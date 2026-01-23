import os
import mercadopago

sdk = mercadopago.SDK(os.getenv("MP_ACCESS_TOKEN"))


def create_pix_payment(
    amount: float,
    description: str,
    items: list,
    metadata: dict
):
    payment_data = {
        "transaction_amount": round(amount, 2),
        "description": description,
        "payment_method_id": "pix",
        "payer": {
            "email": "cliente@valledasflores.com"
        },
        "additional_info": {
            "items": [
                {
                    "title": item.name,
                    "quantity": item.quantity,
                    "unit_price": item.price
                }
                for item in items
            ]
        },
        "metadata": metadata
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
    cpf: str,
):
    payment_data = {
        "transaction_amount": round(amount, 2),
        "token": token,
        "description": "Pedido Valle das Flores",
        "installments": installments,
        "payer": {
            "email": email,
            "identification": {
                "type": "CPF",
                "number": cpf
            }
        }
    }

    return sdk.payment().create(payment_data)


def get_payment_by_id(payment_id: str):
    response = sdk.payment().get(payment_id)
    return response["response"]
