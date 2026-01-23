import requests
import os

INSTANCE_ID = os.getenv("ULTRAMSG_INSTANCE_ID")
TOKEN = os.getenv("ULTRAMSG_TOKEN")
TO = os.getenv("FLORICULTURA_PHONE")

BASE_URL = f"https://api.ultramsg.com/{INSTANCE_ID}/messages/chat"


def send_whatsapp_message(message: str):
    if not INSTANCE_ID or not TOKEN or not TO:
        raise Exception("UltraMsg não configurado corretamente")

    payload = {
        "token": TOKEN,
        "to": TO,
        "body": message
    }

    response = requests.post(BASE_URL, data=payload, timeout=15)

    if response.status_code != 200:
        raise Exception(f"Erro UltraMsg: {response.text}")

    return response.json()


def send_whatsapp_message_to(number: str, message: str):
    if not INSTANCE_ID or not TOKEN:
        raise Exception("UltraMsg não configurado corretamente")

    payload = {
        "token": TOKEN,
        "to": number,
        "body": message
    }

    response = requests.post(BASE_URL, data=payload, timeout=15)

    if response.status_code != 200:
        raise Exception(f"Erro UltraMsg cliente: {response.text}")

    return response.json()


# ===============================
# MENSAGEM FLORICULTURA
# ===============================
def format_payment_message(payment: dict) -> str:
    items = payment.get("additional_info", {}).get("items", [])
    meta = payment.get("metadata", {})

    message = "🌸 *NOVO PEDIDO CONFIRMADO – VALLE DAS FLORES*\n\n"

    message += f"🆔 *Pedido MP:* {payment.get('id')}\n"
    message += f"💳 *Método:* {payment.get('payment_method_id')}\n\n"

    message += "📦 *Itens do pedido:*\n"
    for item in items:
        message += f"• {item.get('title')}\n"
        message += f"  Quantidade: {item.get('quantity')}\n"
        message += f"  Valor: R$ {item.get('unit_price')}\n\n"

    if meta.get("tribute"):
        message += "🕊️ *Mensagem para a homenagem:*\n"
        message += f"\"{meta.get('tribute')}\"\n\n"

    message += f"👤 *Cliente:* {meta.get('customer_name')}\n"
    message += f"📞 *Telefone:* {meta.get('customer_phone')}\n"
    message += f"📅 *Data desejada:* {meta.get('customer_date')}\n\n"

    if meta.get("delivery_period") == "retiradanaloja":
        message += "🏪 *Retirada na loja*\n\n"
    else:
        message += "📍 *Endereço de entrega:*\n"
        message += f"{meta.get('street')}, {meta.get('number')}\n"
        message += f"{meta.get('neighborhood')} – CEP {meta.get('cep')}\n\n"

    message += f"⏰ *Período:* {meta.get('delivery_period')}\n"
    message += f"\n💰 *Total:* R$ {payment.get('transaction_amount')}\n"

    return message


# ===============================
# MENSAGEM CLIENTE (🌸 + 💗)
# ===============================
def format_customer_message(payment: dict) -> str:
    meta = payment.get("metadata", {})

    date = meta.get("customer_date", "")
    period = meta.get("delivery_period", "")

    message = "🌸 *Pedido confirmado!*\n\n"
    message += "Olá 😊\n"
    message += "Recebemos o pagamento do *seu pedido* com sucesso.\n\n"
    message += "Seu pedido já está *em produção* e está sendo preparado com todo carinho 💗\n\n"

    if date:
        message += f"📅 Data: {date}\n"
    if period:
        message += f"⏰ Entrega: {period}\n"

    message += "\nQualquer dúvida, estamos à disposição.\n"
    message += "Obrigado por escolher a *Valle das Flores* 💗"

    return message
