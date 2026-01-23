from fastapi import FastAPI, Request, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import time
import os
import mercadopago
from dotenv import load_dotenv

from app.services.mercado_pago import create_pix_payment, create_card_payment
from app.services.whatsapp_ultramsg import (
    send_whatsapp_message,
    send_whatsapp_message_to,
    format_payment_message,
    format_client_confirmation_message,  # 👈 mensagem definida lá
)

load_dotenv()

# =====================================================
# APP
# =====================================================

app = FastAPI(title="Valle das Flores API", version="1.0.0")

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
# SDK MERCADO PAGO
# =====================================================

sdk = mercadopago.SDK(os.getenv("MP_ACCESS_TOKEN"))

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

# =====================================================
# CHECKOUT
# =====================================================

@app.post("/checkout")
def checkout(data: CheckoutRequest):
    if data.payment_method == "pix":
        pix = create_pix_payment(
            amount=data.total,
            description="Pedido Valle das Flores",
        )

        return {
            "payment_method": "pix",
            "payment": pix,
            "delivery_period": data.delivery_period,
            "items": data.items,
            "total": data.total,
        }

    return {"message": "Método de pagamento não implementado"}

# =====================================================
# CARTÃO
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
# FUNÇÃO COM DELAY (50s)
# =====================================================

def send_client_message_with_delay(phone: str, payment_info: dict):
    time.sleep(50)
    message = format_client_confirmation_message(payment_info)
    send_whatsapp_message_to(phone, message)

# =====================================================
# WEBHOOK MERCADO PAGO
# =====================================================

@app.post("/webhook/mercadopago")
async def webhook_mercadopago(
    request: Request,
    background_tasks: BackgroundTasks,
):
    body = await request.json()
    query = dict(request.query_params)

    payment_id = query.get("data.id") or body.get("data", {}).get("id")
    if not payment_id:
        return {"status": "ignored"}

    payment_info = sdk.payment().get(payment_id)["response"]

    status = payment_info.get("status")
    status_detail = payment_info.get("status_detail")

    print(f"💳 PAYMENT ID: {payment_id}")
    print(f"📌 STATUS: {status}")
    print(f"📌 DETAIL: {status_detail}")

    # 🔒 anti-duplicação
    if payment_info.get("metadata", {}).get("notified"):
        print("⚠️ Pagamento já processado")
        return {"status": "already_processed"}

    if status == "approved":
        print("✅ PAGAMENTO APROVADO — ENVIANDO WHATSAPP")

        # 1️⃣ floricultura (imediato)
        store_message = format_payment_message(payment_info)
        send_whatsapp_message(store_message)

        # 2️⃣ cliente (delay 50s)
        client_phone = payment_info.get("metadata", {}).get("customer_phone")
        if client_phone:
            background_tasks.add_task(
                send_client_message_with_delay,
                client_phone,
                payment_info,
            )

        # 3️⃣ marca como processado
        sdk.payment().update(
            payment_id,
            {"metadata": {"notified": True}},
        )

    return {"status": "ok"}
