import os
import requests
import time

INSTANCE_ID = os.getenv("ZAPI_INSTANCE_ID")
INSTANCE_TOKEN = os.getenv("ZAPI_INSTANCE_TOKEN")
CLIENT_TOKEN = os.getenv("ZAPI_CLIENT_TOKEN")

BASE_URL = f"https://api.z-api.io/instances/{INSTANCE_ID}/token/{INSTANCE_TOKEN}"


# ======================================================
# STATUS DIGITANDO (opcional, humano)
# ======================================================
def enviar_digitando(numero: str):
    try:
        url = f"{BASE_URL}/send-status-typing"
        headers = {
            "Client-Token": CLIENT_TOKEN
        }
        requests.post(url, headers=headers, timeout=5)
    except:
        pass


# ======================================================
# ENVIO DE MENSAGEM
# ======================================================
def send_whatsapp_message_to(number: str, message: str):
    if not INSTANCE_ID or not INSTANCE_TOKEN or not CLIENT_TOKEN:
        raise Exception("Z-API não configurada corretamente")

    phone = "".join(filter(str.isdigit, number))
    if not phone.startswith("55"):
        phone = f"55{phone}"

    url = f"{BASE_URL}/send-text"

    headers = {
        "Client-Token": CLIENT_TOKEN,
        "Content-Type": "application/json"
    }

    payload = {
        "phone": phone,
        "message": message
    }

    response = requests.post(
        url,
        json=payload,
        headers=headers,
        timeout=15
    )

    if response.status_code not in [200, 201]:
        raise Exception(f"Erro Z-API: {response.text}")

    return response.json()


# ======================================================
# MENSAGEM PADRÃO CLIENTE
# ======================================================
def format_customer_message(payment: dict) -> str:
    meta = payment.get("metadata", {})

    date = meta.get("customer_date", "")
    period = meta.get("delivery_period", "")

    message = "🌸 *Pedido confirmado!*\n\n"
    message += "Olá 😊\n"
    message += "Recebemos o pagamento do *seu pedido* com sucesso.\n\n"
    message += (
        "Seu pedido já está *em produção* "
        "e está sendo preparado com todo carinho 💗\n\n"
    )

    if date:
        message += f"📅 Data: {date}\n"
    if period:
        message += f"⏰ Entrega: {period}\n"

    message += "\nQualquer dúvida, estamos à disposição.\n"
    message += "Obrigado por escolher a *Valle das Flores* 💗"

    return message
