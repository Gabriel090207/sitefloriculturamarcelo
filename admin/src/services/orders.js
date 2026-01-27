import {
  collection,
  getDocs,
  query,
  orderBy
} from "firebase/firestore";
import { db } from "./firebase";

const API_URL = import.meta.env.VITE_API_URL;

/* =========================
   BUSCAR PEDIDOS
========================= */
export async function getOrders() {
  const q = query(
    collection(db, "orders"),
    orderBy("created_at", "desc")
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

/* =========================
   ATUALIZAR STATUS (BACKEND)
========================= */
export async function updateOrderStatus(id, status) {
  const response = await fetch(
    `${API_URL}/orders/${id}/status`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ status })
    }
  );

  if (!response.ok) {
    throw new Error("Erro ao atualizar status do pedido");
  }

  return response.json();
}
