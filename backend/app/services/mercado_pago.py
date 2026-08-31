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
    payment_method_id: str,
    issuer_id: int | None,
):
    payment_data = {
        "transaction_amount": round(amount, 2),
        "token": token,
        "description": "Pedido Valle das Flores",
        "installments": installments,

        "payment_method_id": payment_method_id,

        "issuer_id": issuer_id,

        "payer": {
            "email": email,
            "identification": {
                "type": "CPF",
                "number": cpf
            }
        }
    }

    payment_response = sdk.payment().create(payment_data)
    response_data = payment_response.get("response")

    if not isinstance(response_data, dict):
        response_data = {}

    diagnostic_data = {
        "sdk_http_status": payment_response.get("status"),
        "id": response_data.get("id"),
        "status": response_data.get("status"),
        "status_detail": response_data.get("status_detail"),
        "payment_method_id": response_data.get("payment_method_id"),
        "payment_type_id": response_data.get("payment_type_id"),
        "installments": response_data.get("installments"),
        "error": response_data.get("error"),
        "message": response_data.get("message"),
        "cause": response_data.get("cause"),
        "request_id": response_data.get("request_id")
            or payment_response.get("request_id"),
    }

    print("[CARD_DIAGNOSTIC] Mercado Pago:", diagnostic_data)

    return payment_response


def get_payment_by_id(payment_id: str):
    response = sdk.payment().get(payment_id)
    return response["response"]
