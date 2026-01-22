from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Request
from app.services.mercado_pago import create_pix_payment
from fastapi import HTTPException
from app.services.mercado_pago import create_card_payment



app = FastAPI(title="Valle das Flores API", version="1.0.0")




# Libera o frontend acessar o backend (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite (comum)
        "http://localhost:3000",
        "https://vallesdasflores.netlify.app",
        "https://sitefloriculturamarcelo.onrender.com",
        "http://floriculturavalledasflores.com.br",
        "https://floriculturavalledasflores.com.br",

          # React (caso use)
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/webhook/mercadopago")
async def mercadopago_webhook(request: Request):
    # Query params (ex: ?data.id=123&type=payment)
    qp = dict(request.query_params)

    # Body (pode ser vazio ou JSON)
    try:
        body = await request.json()
    except Exception:
        body = None

    print("✅ WEBHOOK MERCADO PAGO RECEBIDO")
    print("Query params:", qp)
    print("Body:", body)

    # Importante: responder rápido 200 para o Mercado Pago não ficar reenviando
    return {"received": True}


from pydantic import BaseModel
from typing import List


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


@app.post("/checkout")
def checkout(data: CheckoutRequest):
    if data.payment_method == "pix":
        pix = create_pix_payment(
            amount=data.total,
            description="Pedido Valle das Flores"
        )

        return {
            "payment_method": "pix",
            "payment": pix,
            "delivery_period": data.delivery_period,
            "items": data.items,
            "total": data.total
        }

    return {"message": "Método de pagamento não implementado"}


@app.post("/pay/card")
def pay_card(data: dict):
    try:
        return create_card_payment(
            token=data["token"],
            amount=float(data["total"]),
            installments=int(data.get("installments", 1)),
            email=data["email"],
            cpf=data["cpf"],  # 👈 CPF recebido do frontend
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
