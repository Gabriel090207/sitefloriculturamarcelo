import {
  collection,
  getDocs,
  query,
  orderBy,
  updateDoc,
  doc
} from "firebase/firestore";
import { db } from "./firebase";

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

export async function updateOrderStatus(id, status) {
  const ref = doc(db, "orders", id);
  await updateDoc(ref, { status });
}
