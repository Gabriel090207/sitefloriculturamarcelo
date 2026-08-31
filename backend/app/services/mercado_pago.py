import os
from datetime import datetime, timezone

import mercadopago


# Diagnóstico temporário de configuração — remover após validar o ambiente.
mp_access_token = os.getenv("MP_ACCESS_TOKEN")
normalized_token = mp_access_token.strip() if mp_access_token is not None else ""
has_surrounding_quotes = (
    len(normalized_token) >= 2
    and normalized_token[0] == normalized_token[-1]
    and normalized_token[0] in {"'", '"'}
)
token_for_classification = (
    normalized_token[1:-1] if has_surrounding_quotes else normalized_token
)

if token_for_classification.startswith("APP_USR-"):
    environment_hint = "production"
elif token_for_classification.startswith("TEST-"):
    environment_hint = "test"
else:
    environment_hint = "unknown"

print("[MP_CONFIG_DIAGNOSTIC]", {
    "exists": mp_access_token is not None,
    "length": len(mp_access_token) if mp_access_token is not None else 0,
    "environment_hint": environment_hint,
    "has_edge_whitespace": (
        mp_access_token != normalized_token
        if mp_access_token is not None
        else False
    ),
    "has_surrounding_quotes": has_surrounding_quotes,
    "loaded_on_module_import": True,
    "loaded_at_utc": datetime.now(timezone.utc).isoformat(),
})
# Fim do diagnóstico temporário.

sdk = mercadopago.SDK(mp_access_token)


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
