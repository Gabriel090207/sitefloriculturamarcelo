import os
import requests

RESEND_API_KEY = os.getenv("RESEND_API_KEY")
FROM_EMAIL = os.getenv("RESEND_FROM_EMAIL")
TO_EMAIL = os.getenv("FLORICULTURA_EMAIL")

RESEND_URL = "https://api.resend.com/emails"


def send_email(subject: str, html: str):
    if not RESEND_API_KEY or not FROM_EMAIL or not TO_EMAIL:
        raise Exception("Resend não configurado corretamente")

    payload = {
        "from": FROM_EMAIL,
        "to": [TO_EMAIL],
        "subject": subject,
        "html": html,
    }

    headers = {
        "Authorization": f"Bearer {RESEND_API_KEY}",
        "Content-Type": "application/json",
    }

    response = requests.post(
        RESEND_URL,
        json=payload,
        headers=headers,
        timeout=15,
    )

    if response.status_code not in [200, 201]:
        raise Exception(f"Erro Resend: {response.text}")

    return response.json()


def format_payment_email(payment: dict) -> str:
    items = payment.get("additional_info", {}).get("items", [])
    meta = payment.get("metadata", {})

    html = f"""
    <h2>🌸 Novo Pedido Confirmado – Valle das Flores</h2>

    <p><strong>ID do pedido:</strong> {payment.get("id")}</p>
    <p><strong>Método de pagamento:</strong> {payment.get("payment_method_id")}</p>

    <h3>📦 Itens</h3>
    <ul>
    """

    for item in items:
        html += f"""
        <li>
            <strong>{item.get("title")}</strong><br/>
            Quantidade: {item.get("quantity")}<br/>
            Valor: R$ {item.get("unit_price")}
        </li>
        """

    html += "</ul>"

    if meta.get("tribute"):
        html += f"""
        <h3>🕊️ Mensagem de homenagem</h3>
        <p>{meta.get("tribute")}</p>
        """

    html += f"""
    <h3>👤 Cliente</h3>
    <p>
        Nome: {meta.get("customer_name")}<br/>
        Telefone: {meta.get("customer_phone")}<br/>
        Data desejada: {meta.get("customer_date")}
    </p>
    """

    if meta.get("delivery_period") == "retiradanaloja":
        html += "<p><strong>🏪 Retirada na loja</strong></p>"
    else:
        html += f"""
        <h3>📍 Endereço de entrega</h3>
        <p>
            {meta.get("street")}, {meta.get("number")}<br/>
            {meta.get("neighborhood")} – CEP {meta.get("cep")}
        </p>
        """

    html += f"""
    <h3>💰 Total</h3>
    <p><strong>R$ {payment.get("transaction_amount")}</strong></p>
    """

    return html
