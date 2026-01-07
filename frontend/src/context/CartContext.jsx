import { createContext, useContext, useState, useEffect } from 'react'


const CartContext = createContext()

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
  const savedCart = localStorage.getItem('cartItems')
  return savedCart ? JSON.parse(savedCart) : []
})

useEffect(() => {
  localStorage.setItem('cartItems', JSON.stringify(cartItems))
}, [cartItems])


const clearCart = () => {
  setCartItems([])
  localStorage.removeItem('cartItems')
}

  const [showToast, setShowToast] = useState(false)


  const addToCart = (product) => {
  setCartItems((prev) => {
    const exists = prev.find((item) => item.id === product.id)

    if (exists) {
      return prev.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    }

    return [...prev, { ...product, quantity: 1 }]
  })

  // mostra o toast
  setShowToast(true)

  // esconde automaticamente
  setTimeout(() => {
    setShowToast(false)
  }, 2500)
}


  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id))
  }


  const increaseQuantity = (id) => {
  setCartItems((prev) =>
    prev.map((item) =>
      item.id === id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    )
  )
}

const decreaseQuantity = (id) => {
  setCartItems((prev) =>
    prev
      .map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter((item) => item.quantity > 0)
  )
}

  const totalItems = cartItems.reduce(
    (acc, item) => acc + item.quantity,
    0
  )

  const totalPrice = cartItems.reduce((total, item) => {
  const priceNumber = Number(
    item.price.replace('R$', '').replace(',', '.')
  )

  return total + priceNumber * item.quantity
}, 0)


  return (
 <CartContext.Provider
  value={{
    cartItems,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    totalItems,
    totalPrice,
    showToast
  }}
>



      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
