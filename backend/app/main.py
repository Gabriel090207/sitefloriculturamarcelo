from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

from app.services.mercado_pago import (
    create_pix_payment,
    create_card_payment,
    sdk
)

from services.whatsapp_ultramsg import send_whatsapp_message


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


# ===============================
# CHECKOUT PIX
# ===============================
@app.post("/checkout")
def checkout(data: CheckoutRequest):
    if data.payment_method != "pix":
        return {"message": "Método não suportado"}

    pix = create_pix_payment(
        amount=data.total,
        description="Pedido Valle das Flores",
        items=[
            {
                "title": item.name,
                "quantity": item.quantity,
                "unit_price": item.price
            }
            for item in data.items
        ]
    )

    return {
        "payment_method": "pix",
        "payment": pix
    }


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
    payload = await request.json()

    action = payload.get("action")
    payment_id = payload.get("data", {}).get("id")

    if action != "payment.updated" or not payment_id:
        return {"status": "ignored"}

    payment = sdk.payment().get(payment_id)["response"]

    if payment.get("status") != "approved":
        return {"status": "not approved"}

    message = format_payment_message(payment)

    send_whatsapp_message(message)

    return {"status": "whatsapp_sent"}


# ===============================
# FORMATAR MENSAGEM WHATSAPP
# ===============================
def format_payment_message(payment: dict) -> str:
    payer = payment.get("payer", {})
    info = payment.get("additional_info", {})
    items = info.get("items", [])

    message = "🌸 *NOVO PEDIDO CONFIRMADO*\n\n"
    message += f"🆔 Pedido MP: {payment.get('id')}\n"
    message += f"💳 Método: {payment.get('payment_method_id')}\n\n"

    for item in items:
        message += f"• {item.get('title')}\n"
        message += f"Qtd: {item.get('quantity')}\n"
        message += f"Valor: R$ {item.get('unit_price')}\n\n"

    message += f"💰 *Total:* R$ {payment.get('transaction_amount')}\n\n"
    message += f"📧 Cliente: {payer.get('email')}\n"

    return message
