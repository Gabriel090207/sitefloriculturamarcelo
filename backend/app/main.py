from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import threading
import time

from app.services.mercado_pago import create_pix_payment
from app.services.whatsapp_ultramsg import (
    send_whatsapp_message,
    send_whatsapp_message_to,
    format_payment_message,
    format_customer_message,
)

app = FastAPI(title="Valle das Flores API", version="1.0.0")

# ===============================
# CORS
# ===============================
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://sitefloriculturamarcelo.onrender.com",
        "https://floriculturavalledasflores.com.br",
        "http://floriculturavalledasflores.com.br",
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

    street: str | None = None
    number: str | None = None
    neighborhood: str | None = None
    cep: str | None = None

    tribute: str | None = None


# ===============================
# CHECKOUT
# ===============================
@app.post("/checkout")
def checkout(data: CheckoutRequest):
    if data.payment_method != "pix":
        raise HTTPException(status_code=400, detail="Método de pagamento não suportado")

    pix = create_pix_payment(
        amount=data.total,
        description="Pedido Valle das Flores",
        items=[
            {
                "title": item.name,
                "quantity": item.quantity,
                "unit_price": item.price,
            }
            for item in data.items
        ],
        metadata={
            "customer_name": data.customer_name,
            "customer_phone": data.customer_phone,
            "customer_date": data.customer_date,
            "delivery_period": data.delivery_period,
            "street": data.street,
            "number": data.number,
            "neighborhood": data.neighborhood,
            "cep": data.cep,
            "tribute": data.tribute,
        },
    )

    return {
        "payment_method": "pix",
        "payment": pix,
    }


# ===============================
# WEBHOOK MERCADO PAGO
# ===============================
def send_client_message_with_delay(phone: str, payment_info: dict):
    time.sleep(50)
    message = format_customer_message(payment_info)
    send_whatsapp_message_to(phone, message)


@app.post("/webhook/mercadopago")
async def mercado_pago_webhook(request: Request):
    body = await request.json()
    payment_id = body.get("data", {}).get("id")

    if not payment_id:
        return {"status": "ignored"}

    import mercadopago
    import os

    sdk = mercadopago.SDK(os.getenv("MP_ACCESS_TOKEN"))
    payment = sdk.payment().get(payment_id)["response"]

    status = payment.get("status")
    detail = payment.get("status_detail")

    print(f"💳 PAYMENT ID: {payment_id}")
    print(f"📌 STATUS: {status}")
    print(f"📌 DETAIL: {detail}")

    if status == "approved":
        print("✅ PAGAMENTO APROVADO — ENVIANDO WHATSAPP")

        # Mensagem para a floricultura
        store_message = format_payment_message(payment)
        send_whatsapp_message(store_message)

        # Mensagem para o cliente (50s depois)
        customer_phone = payment.get("metadata", {}).get("customer_phone")
        if customer_phone:
            threading.Thread(
                target=send_client_message_with_delay,
                args=(customer_phone, payment),
                daemon=True,
            ).start()

    return {"status": "ok"}
