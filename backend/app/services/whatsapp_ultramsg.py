import requests
import os
from dotenv import load_dotenv

load_dotenv()

INSTANCE_ID = os.getenv("ULTRAMSG_INSTANCE_ID")
TOKEN = os.getenv("ULTRAMSG_TOKEN")
TO = os.getenv("FLORICULTURA_PHONE")

BASE_URL = f"https://api.ultramsg.com/{INSTANCE_ID}/messages/chat"

def send_whatsapp_message(message: str):
    if not INSTANCE_ID or not TOKEN or not TO:
        raise Exception("UltraMsg não configurado no .env (INSTANCE_ID, TOKEN, FLORICULTURA_PHONE)")

    payload = {
        "token": TOKEN,
        "to": TO,
        "body": message
    }

    response = requests.post(BASE_URL, data=payload, timeout=15)

    if response.status_code != 200:
        raise Exception(f"Erro UltraMsg: {response.status_code} - {response.text}")

    return response.json()


def format_payment_message(payment: dict) -> str:
    payer = payment.get("payer", {})
    additional_info = payment.get("additional_info", {})
    items = additional_info.get("items", [])

    message = "🌸 *PAGAMENTO CONFIRMADO*\n\n"
    message += f"🆔 Pedido MP: {payment.get('id')}\n"
    message += f"💳 Método: {payment.get('payment_method_id')}\n\n"

    for item in items:
        message += f"• {item.get('title')}\n"
        message += f"Qtd: {item.get('quantity')}\n"
        message += f"Valor: R$ {item.get('unit_price')}\n\n"

    message += f"💰 Total: R$ {payment.get('transaction_amount')}\n\n"
    message += f"👤 Cliente: {payer.get('email')}\n"

    return message
