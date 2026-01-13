from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.services.mercado_pago import create_pix_payment


app = FastAPI(title="Valle das Flores API", version="1.0.0")

app.include_router(router)


# Libera o frontend acessar o backend (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite (comum)
        "http://localhost:3000",
        "https://vallesdasflores.netlify.app",  # React (caso use)
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok"}


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
