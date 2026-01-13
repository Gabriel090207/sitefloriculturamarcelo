import os
import mercadopago
from dotenv import load_dotenv

load_dotenv()

sdk = mercadopago.SDK(os.getenv("MP_ACCESS_TOKEN"))


def create_pix_payment(amount: float, description: str):
    payment_data = {
        "transaction_amount": amount,
        "description": description,
        "payment_method_id": "pix",
        "payer": {
            "email": "cliente@valledasflores.com"
        }
    }

    payment_response = sdk.payment().create(payment_data)
    payment = payment_response["response"]

    return {
        "id": payment["id"],
        "status": payment["status"],
        "qr_code": payment["point_of_interaction"]["transaction_data"]["qr_code"],
        "qr_code_base64": payment["point_of_interaction"]["transaction_data"]["qr_code_base64"],
    }

def create_card_payment(
    token: str,
    amount: float,
    installments: int,
    email: str,
):
    payment_data = {
        "transaction_amount": amount,
        "token": token,
        "description": "Pedido Valle das Flores",
        "installments": installments,
        "payment_method_id": "visa",  # depois automatizamos
        "payer": {
            "email": email
        }
    }

    payment_response = sdk.payment().create(payment_data)
    payment = payment_response["response"]

    return {
        "id": payment["id"],
        "status": payment["status"],
        "status_detail": payment["status_detail"],
    }


from fastapi import APIRouter, HTTPException
from services.mercado_pago import create_card_payment

router = APIRouter()

@router.post("/pay/card")
def pay_card(data: dict):
    try:
        return create_card_payment(
            token=data["token"],
            amount=float(data["total"]),
            installments=int(data.get("installments", 1)),
            email=data["email"],
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
