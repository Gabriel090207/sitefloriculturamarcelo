import os
import requests

INSTANCE_ID = os.getenv("ZAPI_INSTANCE_ID")
INSTANCE_TOKEN = os.getenv("ZAPI_INSTANCE_TOKEN")
CLIENT_TOKEN = os.getenv("ZAPI_CLIENT_TOKEN")

BASE_URL = f"https://api.z-api.io/instances/{INSTANCE_ID}/token/{INSTANCE_TOKEN}"


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
# MENSAGEM — PAGAMENTO CONFIRMADO
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


# ======================================================
# MENSAGEM — PEDIDO FINALIZADO
# ======================================================
def format_order_finished_message(order: dict) -> str:
    customer_name = order.get("customer_name", "")
    delivery_date = order.get("delivery_date", "")
    delivery_period = order.get("delivery_period", "")

    is_pickup = delivery_period == "retiradanaloja"

    message = "🌸 *Seu pedido está pronto!* 🌸\n\n"
    message += f"Olá {customer_name} 😊\n\n"

    if is_pickup:
        message += (
            "Seu pedido foi *finalizado com sucesso* "
            "e já está *disponível para retirada na loja* 💐✨\n\n"
        )
        message += "📍 Você já pode vir buscar no horário de funcionamento.\n"

    else:
        message += (
            "Seu pedido foi *finalizado com sucesso* "
            "e está prontinho 💐✨\n\n"
        )
        if delivery_date:
            message += f"📅 Data da entrega: {delivery_date}\n"
        if delivery_period:
            message += f"⏰ Período: {delivery_period}\n"

        message += "\nEle será entregue conforme o combinado 💗\n"

    message += (
        "\nQualquer dúvida, estamos à disposição.\n"
        "Obrigado por escolher a *Valle das Flores* 🌷"
    )

    return message


# ======================================================
# MENSAGEM — PEDIDO ENTREGUE
# ======================================================
def format_order_delivered_message(order: dict) -> str:
    customer_name = order.get("customer_name", "")

    message = "🌸 *Pedido entregue!* 🌸\n\n"
    message += f"Olá {customer_name} 😊\n\n"
    message += (
        "Passando para avisar que seu pedido "
        "foi *entregue com sucesso* 💐✨\n\n"
    )
    message += (
        "Esperamos que você tenha gostado 💗\n"
        "Qualquer coisa, estamos sempre à disposição.\n\n"
        "*Valle das Flores* 🌷"
    )

    return message
