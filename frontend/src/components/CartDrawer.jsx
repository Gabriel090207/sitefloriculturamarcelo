import { useCart } from '../context/CartContext'
import { useEffect, useState,} from 'react'
import './CartDrawer.css'
import { db } from '../firebase/firebase'
import { doc, updateDoc, increment } from 'firebase/firestore'
import { registerSale } from '../firebase/updateSales'
import { api } from '../services/api'


const MP_PUBLIC_KEY = import.meta.env.VITE_MP_PUBLIC_KEY


const parsePrice = (price) => {
  if (typeof price === 'number') return price

  if (typeof price === 'string') {
    return Number(
      price
        .replace('R$', '')
        .replace(/\s/g, '')
        .replace('.', '')
        .replace(',', '.')
    )
  }

  return 0
}


const formatDate = (value) => {
  return value
    .replace(/\D/g, '')
    .replace(/^(\d{2})(\d)/, '$1/$2')
    .replace(/^(\d{2}\/\d{2})(\d)/, '$1/$2')
    .slice(0, 10)
}


const formatPhone = (value) => {
  return value
    .replace(/\D/g, '')                 // só números
    .replace(/^(\d{2})(\d)/, '($1) $2') // DDD
    .replace(/(\d{5})(\d)/, '$1-$2')    // hífen
    .slice(0, 15)                       // limite total
}

const formatCardNumber = (value) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{4})(?=\d)/g, '$1 ')
    .slice(0, 19)
}

const formatExpiry = (value) => {
  return value
    .replace(/\D/g, '')
    .replace(/^(\d{2})(\d)/, '$1/$2')
    .slice(0, 5)
}

const formatCVV = (value) => {
  return value.replace(/\D/g, '').slice(0, 4)
}








function CartDrawer({ open, onClose }) {

  useEffect(() => {
    if (!showCardFormModal) return
  
    const mp = new window.MercadoPago(
      import.meta.env.VITE_MP_PUBLIC_KEY,
      { locale: 'pt-BR' }
    )
  
    mp.cardForm({
      amount: finalTotal.toString(),
      iframe: true,
      form: {
        id: 'card-form',
        cardNumber: { id: 'cardNumber' },
        expirationDate: { id: 'expirationDate' },
        securityCode: { id: 'securityCode' },
        cardholderName: { id: 'cardholderName' },
        issuer: { id: 'issuer' },
        installments: { id: 'installments' },
        identificationType: { id: 'identificationType' },
        identificationNumber: { id: 'identificationNumber' },
        email: { id: 'email' },
      },
      callbacks: {
        onSubmit: (event) => {
          event.preventDefault()
          const data = cardForm.getCardFormData()
  
          api.post('/pay/card', {
            token: data.token,
            installments: data.installments,
            total: finalTotal,
            email: data.email,
          })
        }
      }
    })
  }, [showCardFormModal])
  

  
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

const [customerData, setCustomerData] = useState({
  name: '',
  phone: '',
  date: '',
  address: '',
  tribute: ''
})


const handleCustomerChange = (field, value) => {
  setCustomerData(prev => ({
    ...prev,
    [field]: value
  }))
}

const resetCustomerForm = () => {
  setCustomerData({
    name: '',
    phone: '',
    date: '',
    address: '',
    tribute: ''
  })
}

const [cardData, setCardData] = useState({
  number: '',
  name: '',
  expiry: '',
  cvv: '',
  installments: '1'
})


const [showCustomerModal, setShowCustomerModal] = useState(false)


const [showPhraseModal, setShowPhraseModal] = useState(false)
const [phrase, setPhrase] = useState('')

const [pixData, setPixData] = useState(null)
const [pixLoading, setPixLoading] = useState(false)

const [deliveryPeriod, setDeliveryPeriod] = useState(null)
const [showPaymentModal, setShowPaymentModal] = useState(false)

const [showDeliveryModal, setShowDeliveryModal] = useState(false)


const [showPaymentChoiceModal, setShowPaymentChoiceModal] = useState(false)
const [showCardFormModal, setShowCardFormModal] = useState(null)
// valores: 'credit' | 'debit' | null

const [deliveryFee, setDeliveryFee] = useState(0)


const [showSuccessModal, setShowSuccessModal] = useState(false)


const finalTotal = parseFloat(
  (totalPrice + deliveryFee).toFixed(2)
)



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


useEffect(() => {
  api.get('/health')
    .then((res) => {
      console.log('Backend conectado:', res.data)
    })
    .catch((err) => {
      console.error('Erro ao conectar backend:', err)
    })
}, [])


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

  message += `Cliente: ${customerData.name}\n`
message += `Telefone: ${customerData.phone}\n`
message += `Data desejada: ${customerData.date}\n`
message += `Endereço: ${customerData.address}\n\n`

if (deliveryPeriod) {
  message += `Período de entrega: ${deliveryPeriod}\n`
}

if (deliveryFee > 0) {
  message += `Frete: R$ ${deliveryFee.toFixed(2).replace('.', ',')}\n`
}

message += `\n`


  message += `Total do pedido: R$ ${finalTotal.toFixed(2)
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


const gerarPix = async () => {
  try {
    setPixLoading(true)

    const payload = {
      items: cartItems.map(item => ({
  id: String(item.id),
  name: String(item.name),
  quantity: Number(item.quantity),
  price: parsePrice(item.price)
}))
,
      delivery_period: deliveryPeriod,
      payment_method: 'pix',
      total: finalTotal


    }

    console.log('Payload checkout:', payload)

    const response = await api.post('/checkout', payload)

    setPixData(response.data.payment)
 } catch (err) {
  console.error('Erro completo:', err)
  console.error('Resposta do backend:', err?.response?.data)
  alert('Erro ao gerar Pix (veja o console)')
}
 finally {
    setPixLoading(false)
  }
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

          {cartItems.map((item, index) => (
  <div className="cart-item" key={`${item.id}-${index}`}>

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
  R$ {finalTotal.toFixed(2).replace('.', ',')}
</strong>

    </div>

   <button
  className="btn-checkout"
 onClick={() => setShowCustomerModal(true)}

>
  Finalizar pedido
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

{showPaymentModal && (
  <div className="phrase-overlay">
    <div className="phrase-card">
      <button
        className="modal-close"
        onClick={() => setShowPaymentModal(false)}
        aria-label="Fechar"
      >
        <i className="fa-solid fa-xmark"></i>
      </button>

      <h4>Escolha o método de pagamento</h4>

     {/* PIX */}
<div
  className="payment-choice-card online"
  onClick={() => {
    setShowPaymentModal(false)
    gerarPix()
  }}
>
  <div className="payment-left">
    <i className="fa-brands fa-pix"></i>

    <div className="payment-text">
      <strong>Pix</strong>
      <span>Pagamento instantâneo</span>
    </div>
  </div>

  <i className="fa-solid fa-chevron-right"></i>
</div>


      {/* CRÉDITO */}
      <div
        className="payment-choice-card online"
        onClick={() => {
          setShowPaymentModal(false)
          setShowCardFormModal('credit')
        }}
      >
        <div className="payment-left">
  <i className="fa-regular fa-credit-card"></i>

  <div className="payment-text">
    <strong>Cartão de crédito</strong>
    <span>Parcelamento disponível</span>
  </div>
</div>


        <i className="fa-solid fa-chevron-right"></i>
      </div>

      {/* DÉBITO */}
      <div
        className="payment-choice-card online"
        onClick={() => {
          setShowPaymentModal(false)
          setShowCardFormModal('debit')
        }}
      >
        <div className="payment-left">
  <i className="fa-solid fa-credit-card"></i>

  <div className="payment-text">
    <strong>Cartão de débito</strong>
    <span>Pagamento à vista</span>
  </div>
</div>


        <i className="fa-solid fa-chevron-right"></i>
      </div>
    </div>
  </div>
)}

{pixLoading && (
  <div className="delivery-overlay">
    <div className="delivery-card pix-loading">
      <i className="fa-solid fa-spinner fa-spin"></i>

      <p>Gerando código Pix…</p>
      <span>Isso pode levar alguns segundos</span>
    </div>
  </div>
)}


{pixData && (
  <div className="phrase-overlay">
    <div className="phrase-card">
      <button
        className="modal-close"
        onClick={() => setPixData(null)}
        aria-label="Fechar"
      >
        <i className="fa-solid fa-xmark"></i>
      </button>

      <h4>Pagamento via Pix</h4>


      <img
        src={`data:image/png;base64,${pixData.qr_code_base64}`}
        alt="QR Code Pix"
        style={{ width: 220, margin: '20px auto', display: 'block' }}
      />

      <textarea
        readOnly
        value={pixData.qr_code}
        style={{ width: '100%', height: 120 }}
      />

      <button
  className="phrase-confirm"
  onClick={() => {
    setPixData(null)
    setShowSuccessModal(true)
  }}
>
  Já realizei o pagamento
</button>

    </div>
  </div>
)}

{showCustomerModal && (
  <div className="delivery-overlay">
    <div className="delivery-card">
  <button
  className="modal-close"
  onClick={() => {
    resetCustomerForm()
    setShowCustomerModal(false)
  }}
  aria-label="Fechar"
>

    <i className="fa-solid fa-xmark"></i>
  </button>

  <h4>Dados para entrega</h4>


      <div className="form-group">
        <label>Nome do responsável</label>
        <input
          type="text"
          value={customerData.name}
          onChange={(e) => handleCustomerChange('name', e.target.value)}
          placeholder="Ex: Maria Silva"
        />
      </div>

      <div className="form-group">
        <label>Telefone / WhatsApp</label>
        <input
  type="tel"
  inputMode="numeric"
  placeholder="(DD) 9XXXX-XXXX"
  value={customerData.phone}
  onChange={(e) =>
    handleCustomerChange('phone', formatPhone(e.target.value))
  }
  maxLength={15}
/>

      </div>

      <div className="form-group">
        <label>Data que precisa estar pronto</label>
        <input
  type="text"
  inputMode="numeric"
  placeholder="DD/MM/AAAA"
  value={customerData.date}
  onChange={(e) => handleCustomerChange('date', formatDate(e.target.value))}
  maxLength={10}
/>

      </div>

      <div className="form-group">
        <label>Endereço de entrega</label>
        <textarea
          rows="2"
          value={customerData.address}
          onChange={(e) => handleCustomerChange('address', e.target.value)}
          placeholder="Rua, número, bairro, complemento"
        />
      </div>

      {/* FRASE SOMENTE SE TIVER COROA */}
      {hasCoroa && (
        <div className="form-group">
          <label>Mensagem para a coroa</label>
          <textarea
            rows="3"
            value={customerData.tribute}
            onChange={(e) => handleCustomerChange('tribute', e.target.value)}
            placeholder="Ex: Com amor e saudades eternas"
          />
        </div>
      )}

      <button
        className="delivery-confirm"
        disabled={
          !customerData.name ||
          !customerData.phone ||
          !customerData.date ||
          !customerData.address
        }
        onClick={() => {
          setShowCustomerModal(false)
          setShowDeliveryModal(true)
        }}
      >
        Continuar
      </button>
    </div>
  </div>
)}



{showDeliveryModal && (
  <div
  className="delivery-overlay"
  onClick={() => setShowDeliveryModal(false)}
>


  <div
  className="delivery-card"
  onClick={(e) => e.stopPropagation()}
>

      <button
        className="modal-close"
        onClick={() => setShowDeliveryModal(false)}
        aria-label="Fechar"
      >
        <i className="fa-solid fa-xmark"></i>
      </button>

      <h4>Em qual período vamos entregar?</h4>


      {[
        { id: 'manha', label: 'Manhã', time: '08h às 13h', price: 19.9 },
        { id: 'tarde', label: 'Tarde', time: '13h às 19h', price: 19.9 },
        { id: 'comercial', label: 'Comercial', time: '08h às 19h', price: 0 },
        { id: 'noite', label: 'Noite', time: '19h às 23h30', price: 19.9 }
      ].map(option => (
        <div
          key={option.id}
          className={`delivery-option ${
            deliveryPeriod === option.id ? 'selected' : ''
          }`}
          onClick={() => {
  setDeliveryPeriod(option.id)
  setDeliveryFee(option.price)
}}

        >
          <div className="delivery-left">
            <span className="delivery-icon">
              <i
                className={`fa-solid ${
                  option.id === 'manha'
                    ? 'fa-sun'
                    : option.id === 'tarde'
                    ? 'fa-cloud-sun'
                    : option.id === 'noite'
                    ? 'fa-moon'
                    : 'fa-briefcase'
                }`}
              />
            </span>

            <div className="delivery-text">
              <strong>{option.label}</strong>
              <span>{option.time}</span>
            </div>
          </div>

          <div className="delivery-price">
            {option.price === 0
              ? 'Grátis'
              : `R$ ${option.price.toFixed(2).replace('.', ',')}`}
          </div>
        </div>
      ))}

      <button
        className="delivery-confirm"
        disabled={!deliveryPeriod}
        onClick={() => {
  setShowDeliveryModal(false)
  setShowPaymentChoiceModal(true)
}}

      >
        Continuar
      </button>
    </div>
  </div>
)}

{showPaymentChoiceModal && (
  <div className="delivery-overlay">
    <div className="delivery-card">
      <button
        className="modal-close"
        onClick={() => setShowPaymentChoiceModal(false)}
        aria-label="Fechar"
      >
        <i className="fa-solid fa-xmark"></i>
      </button>

      <h4>Como deseja pagar?</h4>

      {/* WHATSAPP */}
    <div
  className="payment-choice-card whatsapp"
  onClick={() => {
    setShowPaymentChoiceModal(false)
    handleCheckoutWhatsApp()
  }}
>
  <div className="payment-left">
    <i className="fa-brands fa-whatsapp"></i>

    <div className="payment-text">
      <strong>Pagamento via WhatsApp</strong>
      <span>Falar com a floricultura</span>
    </div>
  </div>

  <div className="payment-right">
    <span className="payment-amount">
      R$ {finalTotal.toFixed(2).replace('.', ',')}
    </span>
    <i className="fa-solid fa-chevron-right"></i>
  </div>
</div>


      {/* ONLINE */}
    <div
  className="payment-choice-card online"
  onClick={() => {
    setShowPaymentChoiceModal(false)
    setShowPaymentModal(true)
  }}
>
  <div className="payment-left">
    <i className="fa-solid fa-credit-card"></i>

    <div className="payment-text">
      <strong>Pagamento online</strong>
      <span>Pix, crédito ou débito</span>
    </div>
  </div>

  <div className="payment-right">
    <span className="payment-amount">
      R$ {finalTotal.toFixed(2).replace('.', ',')}
    </span>
    <i className="fa-solid fa-chevron-right"></i>
  </div>
</div>


    </div>
  </div>
)}


{showCardFormModal && (
  <div className="delivery-overlay">
    <div className="delivery-card">
      <button
        className="modal-close"
        onClick={() => setShowCardFormModal(null)}
        aria-label="Fechar"
      >
        <i className="fa-solid fa-xmark"></i>
      </button>

      <h4>
        {showCardFormModal === 'credit'
          ? 'Cartão de crédito'
          : 'Cartão de débito'}
      </h4>

      <form id="card-form">
  <div className="form-group">
    <label>Número do cartão</label>
    <div id="cardNumber" className="mp-input"></div>
  </div>

  <div className="form-group">
    <label>Nome no cartão</label>
    <input id="cardholderName" type="text" />
  </div>

  <div className="form-row">
    <div className="form-group">
      <label>Validade</label>
      <div id="expirationDate" className="mp-input"></div>
    </div>

    <div className="form-group">
      <label>CVV</label>
      <div id="securityCode" className="mp-input"></div>
    </div>
  </div>

  <div className="form-group">
    <label>Parcelamento</label>
    <select id="installments"></select>
  </div>

  <input type="hidden" id="issuer" />
  <input type="hidden" id="identificationType" />
  <input type="hidden" id="identificationNumber" />
  <input type="hidden" id="email" value="cliente@valledasflores.com" />

  <button className="delivery-confirm" type="submit">
    Pagar
  </button>
</form>



    </div>
  </div>
)}

{showSuccessModal && (
  <div className="delivery-overlay">
    <div className="success-card">
      <div className="success-check">
        <svg viewBox="0 0 52 52">
          <circle cx="26" cy="26" r="25" fill="none" />
          <path fill="none" d="M14 27 l7 7 l16 -16" />
        </svg>
      </div>

      <h4>Pedido recebido!</h4>

      <p>
        Recebemos seu pedido com sucesso.
        <br />
        Em breve entraremos em contato.
      </p>

      <button
        className="success-whatsapp"
        onClick={() => {
          setShowSuccessModal(false)
          handleCheckoutWhatsApp()
        }}
      >
        <i className="fa-brands fa-whatsapp"></i>
        Enviar detalhes no WhatsApp
      </button>
    </div>
  </div>
)}



    </>
  )
}

export default CartDrawer
