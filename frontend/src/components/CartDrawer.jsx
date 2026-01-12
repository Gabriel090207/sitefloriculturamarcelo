import { useCart } from '../context/CartContext'
import { useEffect, useState,} from 'react'
import './CartDrawer.css'
import { db } from '../firebase/firebase'
import { doc, updateDoc, increment } from 'firebase/firestore'
import { registerSale } from '../firebase/updateSales'



function CartDrawer({ open, onClose }) {
const {
  cartItems,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  totalPrice
} = useCart()

const hasCoroa = cartItems.some(
  (item) =>
    item.category === 'CoroasdeRosas' ||
    item.category === 'CoroasdeCampo'
)


const [showPhraseModal, setShowPhraseModal] = useState(false)
const [phrase, setPhrase] = useState('')


  const [visible, setVisible] = useState(false)
  const [animate, setAnimate] = useState(false)

 useEffect(() => {
  if (open) {
    setVisible(true)
    setAnimate(false)

    // força reflow antes de abrir
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setAnimate(true)
      })
    })
  } else {
    setAnimate(false)

    const timer = setTimeout(() => {
      setVisible(false)
    }, 350)

    return () => clearTimeout(timer)
  }
}, [open])


const handleCheckoutWhatsApp = async (customPhrase = '') => {

  const phoneNumber = '5516994287026'

  let message = `Olá! Gostaria de fazer um pedido.\n\n`
  message += `Pedido via site – Valle das Flores\n\n`

  cartItems.forEach((item) => {
    message += `• ${item.name}\n`
    message += `  Quantidade: ${item.quantity}\n`
    message += `  Valor: ${item.price}\n`
    message += `  Foto: ${window.location.origin}${item.image}\n\n`
  })

  if (customPhrase) {
    message += `Mensagem para a homenagem:\n`
    message += `"${customPhrase}"\n\n`
  }

  message += `Total do pedido: R$ ${totalPrice
    .toFixed(2)
    .replace('.', ',')}\n\n`

  message += `Aguardo orientações para finalizar.\nObrigado(a)!`

  const encodedMessage = encodeURIComponent(message)
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`

  


// abre o WhatsApp IMEDIATAMENTE (necessário para mobile)
window.location.href = whatsappUrl

// registra a venda em segundo plano
registerSale(cartItems).catch((err) => {
  console.error('Erro ao registrar venda:', err)
})


}



  if (!visible) return null

  return (
    <>
      <div className="cart-overlay" onClick={onClose} />

      <aside className={`cart-drawer ${animate ? 'open' : 'close'}`}>
        <header className="cart-drawer-header">
          <h3>Seu carrinho</h3>
          <button onClick={onClose}>✕</button>
        </header>

        <div className="cart-drawer-content">
          {cartItems.length === 0 && (
            <p className="cart-empty">Seu carrinho está vazio</p>
          )}

          {cartItems.map((item) => (
            <div className="cart-item" key={item.id}>
              <img src={item.image} alt={item.name} />

              <div className="cart-item-info">
                <strong>{item.name}</strong>
               <div className="cart-quantity">
  <button
    className="qty-btn"
    onClick={() => decreaseQuantity(item.id)}
    aria-label="Diminuir quantidade"
  >
    −
  </button>

  <span className="qty-value">{item.quantity}</span>

  <button
    className="qty-btn"
    onClick={() => increaseQuantity(item.id)}
    aria-label="Aumentar quantidade"
  >
    +
  </button>
</div>

                <span>{item.price}</span>
              </div>

              <button
                className="cart-remove"
                onClick={() => removeFromCart(item.id)}
              >
                Remover
              </button>
            </div>
          ))}
        </div>

     {cartItems.length > 0 && (
  <div className="cart-drawer-footer">
    <div className="cart-total">
      <span>Total</span>
      <strong>
        R$ {totalPrice.toFixed(2).replace('.', ',')}
      </strong>
    </div>

    <button
  className="btn-checkout"
  onClick={() => {
    if (hasCoroa) {
      setShowPhraseModal(true)
    } else {
      handleCheckoutWhatsApp()
    }
  }}
>

      Finalizar pedido no WhatsApp
    </button>
  </div>
)}


      </aside>

     {showPhraseModal && (
  <div className="phrase-overlay">
    <div className="phrase-card">
      <h4>Mensagem de Homenagem</h4>

      <p className="phrase-subtitle">
        Se desejar, escreva uma frase para acompanhar a coroa.
      </p>

      <textarea
        placeholder="Ex: Com carinho e saudades eternas..."
        value={phrase}
        onChange={(e) => setPhrase(e.target.value)}
      />

      <div className="phrase-actions">
        <button
          className="phrase-cancel"
          onClick={() => setShowPhraseModal(false)}
        >
          Agora não
        </button>

        <button
          className="phrase-confirm"
          onClick={() => {
            setShowPhraseModal(false)
            handleCheckoutWhatsApp(phrase)
          }}
        >
          Confirmar mensagem
        </button>
      </div>
    </div>
  </div>
)}


    </>
  )
}

export default CartDrawer
