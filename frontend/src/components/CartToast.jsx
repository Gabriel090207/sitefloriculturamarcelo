import { useCart } from '../context/CartContext'
import './CartToast.css'

function CartToast() {
  const { showToast } = useCart()

  return (
    <div className={`cart-toast ${showToast ? 'show' : ''}`}>
      Item adicionado ao carrinho 
    </div>
  )
}

export default CartToast
