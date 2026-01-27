import asyncio
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

from dotenv import load_dotenv
load_dotenv()



from .services.mercado_pago import (
    create_pix_payment,
    create_card_payment,
    get_payment_by_id
)

from .services.email_resend import (
    send_email,
    format_payment_email
)

from .services.whatsapp_zapi import (
    send_whatsapp_message_to,
    format_customer_message
)


from app.services.firebase import get_firestore
from datetime import datetime



app = FastAPI(title="Valle das Flores API", version="1.0.0")

# =====================================================
# 🔒 CONTROLE ANTI-DUPLICAÇÃO (WEBHOOK)
# =====================================================
PROCESSED_PAYMENTS = set()

# =====================================================
# CORS
# =====================================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "https://vallesdasflores.netlify.app",
        "https://sitefloriculturamarcelo.onrender.com",
        "http://floriculturavalledasflores.com.br",
        "https://floriculturavalledasflores.com.br",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =====================================================
# HEALTH
# =====================================================
@app.get("/health")
def health():
    return {"status": "ok"}

# =====================================================
# MODELS
# =====================================================
class Item(BaseModel):
    id: str
    name: str
    quantity: int
    price: float


class CheckoutRequest(BaseModel):
    items: List[Item]
    delivery_period: str
    payment_method: str
    total: float

    customer_name: str
    customer_phone: str
    customer_date: str
    customer_street: str
    customer_number: str
    customer_neighborhood: str
    customer_cep: str
    tribute: Optional[str] = None


# =====================================================
# CHECKOUT PIX
# =====================================================
@app.post("/checkout")
def checkout(data: CheckoutRequest):
    if data.payment_method == "pix":
        pix = create_pix_payment(
            amount=data.total,
            description="Pedido Valle das Flores",
            items=data.items,
            metadata={
                "customer_name": data.customer_name,
                "customer_phone": data.customer_phone,
                "customer_date": data.customer_date,
                "delivery_period": data.delivery_period,
                "street": data.customer_street,
                "number": data.customer_number,
                "neighborhood": data.customer_neighborhood,
                "cep": data.customer_cep,
                "tribute": data.tribute or ""
            }
        )

        return {
            "payment_method": "pix",
            "payment": pix
        }

    return {"message": "Método de pagamento não implementado"}


# =====================================================
# PAGAMENTO CARTÃO
# =====================================================
@app.post("/pay/card")
def pay_card(data: dict):
    try:
        return create_card_payment(
            token=data["token"],
            amount=float(data["total"]),
            installments=int(data.get("installments", 1)),
            email=data["email"],
            cpf=data["cpf"],
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# =====================================================
# WEBHOOK MERCADO PAGO
# =====================================================
from datetime import datetime
from app.services.firebase import get_firestore


@app.post("/webhook/mercadopago")
async def mercadopago_webhook(request: Request):
    qp = dict(request.query_params)

    payment_id = qp.get("data.id")
    if not payment_id:
        return {"ignored": True}

    # 🔒 ignora duplicados
    if payment_id in PROCESSED_PAYMENTS:
        print("⚠️ PAGAMENTO JÁ PROCESSADO — IGNORANDO")
        return {"ignored": True}

    payment = get_payment_by_id(payment_id)

    status = payment.get("status")
    status_detail = payment.get("status_detail")

    print("💳 PAYMENT ID:", payment_id)
    print("📌 STATUS:", status)
    print("📌 DETAIL:", status_detail)

    if status == "approved" and status_detail == "accredited":

        print("✅ PAGAMENTO APROVADO — PROCESSANDO")

        # 🔒 trava imediatamente
        PROCESSED_PAYMENTS.add(payment_id)

        # ==========================
        # 🔥 FIRESTORE — SALVAR PEDIDO
        # ==========================
        db = get_firestore()

        meta = payment.get("metadata", {})
        items = payment.get("additional_info", {}).get("items", [])

        order_data = {
            "payment_id": str(payment_id),

            # 💳 STATUS FINANCEIRO
            "payment_status": "paid",

            # 📦 STATUS OPERACIONAL
            "status": "Pendente",

            "customer_name": meta.get("customer_name"),
            "customer_phone": meta.get("customer_phone"),
            "delivery_date": meta.get("customer_date"),
            "delivery_period": meta.get("delivery_period"),

            "address": {
                "street": meta.get("street"),
                "number": meta.get("number"),
                "neighborhood": meta.get("neighborhood"),
                "cep": meta.get("cep"),
            },

            "items": items,
            "total": payment.get("transaction_amount"),
            "created_at": datetime.utcnow(),
        }

        db.collection("orders").document(str(payment_id)).set(order_data)

        print("🔥 Pedido salvo no Firestore com sucesso")

        # ==========================
        # 📧 EMAIL — FLORICULTURA
        # ==========================
        html = format_payment_email(payment)
        send_email(
            subject="🌸 Novo pedido confirmado – Valle das Flores",
            html=html
        )

        print("📧 Email enviado para floricultura")

        # ==========================
        # 💬 WHATSAPP — CLIENTE
        # ==========================
        customer_phone = meta.get("customer_phone")

        if customer_phone:
            print("⏳ Aguardando 45s para WhatsApp do cliente...")
            await asyncio.sleep(45)

            customer_message = format_customer_message(payment)
            send_whatsapp_message_to(customer_phone, customer_message)

            print("💬 WhatsApp enviado para o cliente")

    return {"received": True}


from fastapi import Body
from app.services.whatsapp_zapi import (
    send_whatsapp_message_to,
    format_order_finished_message,
    format_order_delivered_message
)

@app.put("/orders/{order_id}/status")
async def update_order_status(order_id: str, payload: dict = Body(...)):
    new_status = payload.get("status")

    if new_status not in ["Pendente", "Pronto", "Entregue"]:
        raise HTTPException(status_code=400, detail="Status inválido")

    db = get_firestore()
    ref = db.collection("orders").document(order_id)

    doc = ref.get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Pedido não encontrado")

    order = doc.to_dict()

    # Atualiza status
    ref.update({"status": new_status})

    customer_phone = order.get("customer_phone")

    # 🔔 DISPARO DE WHATSAPP
    if customer_phone:
        if new_status == "Pronto":
            message = format_order_finished_message(order)
            send_whatsapp_message_to(customer_phone, message)

        elif new_status == "Entregue":
            message = format_order_delivered_message(order)
            send_whatsapp_message_to(customer_phone, message)

    return {"success": True}
