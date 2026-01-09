import { doc, updateDoc, increment } from 'firebase/firestore'
import { db } from './firebase'

export async function registerSale(cartItems) {
  for (const item of cartItems) {
    const productRef = doc(db, 'products', String(item.id))

    await updateDoc(productRef, {
      sold: increment(item.quantity),
    })
  }
}
