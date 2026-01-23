from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

from app.services.mercado_pago import (
    create_pix_payment,
    create_card_payment,
    get_payment_by_id
)

from app.services.whatsapp_ultramsg import (
    send_whatsapp_message,
    format_payment_message
)

app = FastAPI(title="Valle das Flores API", version="1.0.0")

# ===============================
# CORS
# ===============================
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

# ===============================
# HEALTH
# ===============================
@app.get("/health")
def health():
    return {"status": "ok"}

# ===============================
# MODELS
# ===============================
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


# ===============================
# CHECKOUT PIX
# ===============================
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


# ===============================
# PAGAMENTO CARTÃO
# ===============================
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


# ===============================
# WEBHOOK MERCADO PAGO
# ===============================
@app.post("/webhook/mercadopago")
async def mercadopago_webhook(request: Request):
    qp = dict(request.query_params)

    payment_id = qp.get("data.id")
    if not payment_id:
        return {"ignored": True}

    payment = get_payment_by_id(payment_id)

    status = payment.get("status")
    status_detail = payment.get("status_detail")

    print("💳 PAYMENT ID:", payment_id)
    print("📌 STATUS:", status)
    print("📌 DETAIL:", status_detail)

    if status == "approved" and status_detail == "accredited":
        print("✅ PAGAMENTO APROVADO — ENVIANDO WHATSAPP")

        message = format_payment_message(payment)
        send_whatsapp_message(message)

    return {"received": True}
