import { useCart } from '../context/CartContext'
import { useEffect, useRef, useState,} from 'react'
import './CartDrawer.css'
import { db } from '../firebase/firebase'
import { doc, updateDoc, increment } from 'firebase/firestore'
import { registerSale } from '../firebase/updateSales'
import { api } from '../services/api'


const fetchCoordsByAddress = async (address) => {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    address
  )}`

  

  const response = await fetch(url)
  const data = await response.json()

  if (!data.length) return null

  return {
    lat: Number(data[0].lat),
    lng: Number(data[0].lon)
  }
}

const fetchCoordsByCEP = async (cep) => {
  const cleanCEP = cep.replace('-', '')

  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${cleanCEP}, Manaus`
  )

  const data = await response.json()

  if (!data.length) return null

  return {
    lat: Number(data[0].lat),
    lng: Number(data[0].lon)
  }
}


const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180
  const R = 6371 // raio da Terra em KM

  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return Number((R * c).toFixed(2))
}


const STORE_COORDS = {
  lat: -3.131633,
  lng: -60.023289
}
// Floricultura Valle das Flores
// Rua Major Gabriel, Centro – Manaus


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

const formatCEP = (value) => {
  return value
    .replace(/\D/g, '')          // remove tudo que não for número
    .replace(/^(\d{5})(\d)/, '$1-$2')
    .slice(0, 9)
}

const formatCPF = (value) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    .slice(0, 14)
}


const calculateDeliveryFeeByCEP = (cep) => {
  if (!cep || cep.length < 9) return 0

  // remove o hífen
  const cepNumber = Number(cep.replace('-', ''))

  // FAIXAS DE CEP (Manaus)
  if (cepNumber >= 69000000 && cepNumber <= 69049999) {
    return 9.9
  }

  if (cepNumber >= 69050000 && cepNumber <= 69079999) {
    return 14.9
  }

  if (cepNumber >= 69080000 && cepNumber <= 69099999) {
    return 19.9
  }

  // fora da área principal
  return 29.9
}

const BAIRRO_ZONA_MAP = {
  // CENTRO-SUL
  'Centro': 'centro-sul',
  'Adrianópolis': 'centro-sul',
  'Nossa Senhora das Graças': 'centro-sul',
  'Chapada': 'centro-sul',
  'Aleixo': 'centro-sul',

  // SUL
  'Cachoeirinha': 'sul',
  'Educandos': 'sul',
  'São Francisco': 'sul',
  'Petrópolis': 'sul',
  'Santa Luzia': 'sul',

  // OESTE
  'Compensa': 'oeste',
  'Santo Agostinho': 'oeste',
  'São Jorge': 'oeste',
  'Alvorada': 'oeste',

  // CENTRO-OESTE
  'Redenção': 'centro-oeste',
  'Dom Pedro': 'centro-oeste',
  'Planalto': 'centro-oeste',

  // NORTE
  'Cidade Nova': 'norte',
  'Nova Cidade': 'norte',
  'Santa Etelvina': 'norte',
  'Monte das Oliveiras': 'norte'
}

const calculateDeliveryFeeByZone = (bairro) => {
  if (!bairro) return 40

  const zona = BAIRRO_ZONA_MAP[bairro]

  switch (zona) {
    case 'centro-sul':
      return 25

    case 'sul':
    case 'oeste':
    case 'centro-oeste':
      return 30

    case 'norte':
      return 40

    default:
      // bairro não mapeado
      return 40
  }
}



const fetchCEPData = async (cep) => {
  const cleanCEP = cep.replace('-', '')

  const response = await fetch(
    `https://viacep.com.br/ws/${cleanCEP}/json/`
  )

  const data = await response.json()

  if (data.erro) return null

  return {
    bairro: data.bairro,
    cidade: data.localidade,
    uf: data.uf,
    logradouro: data.logradouro
  }
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



const mp = new window.MercadoPago(
  import.meta.env.VITE_MP_PUBLIC_KEY,
  { locale: 'pt-BR' }
)





function CartDrawer({ open, onClose }) {


const whatsappPhone = '559281230907'
const whatsappDisplayPhone = '(92) 98123-0907'
const whatsappUrl = `https://wa.me/${whatsappPhone}`
const whatsappQrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(whatsappUrl)}`
const serviceHours = 'Atendimento 24 Horas'




const [confirmedOrder, setConfirmedOrder] = useState(null)




  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    totalPrice,
    clearCart
  } = useCart()
  

const hasCoroa = cartItems.some(
  (item) =>
    item.category === 'CoroasdeRosas' ||
    item.category === 'CoroasdeCampo'
)

const [customerData, setCustomerData] = useState({
  name: '',
  phone: '',
  cpf: '',
  tribute: '',
  hall: ''
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
  cpf: '',
  tribute: '',
  hall: ''
})
}



const [cardData, setCardData] = useState({
  number: '',
  name: '',
  expiry: '',
  cvv: '',
  installments: '1'
})


const [installments, setInstallments] = useState([])



const [cardBrand, setCardBrand] = useState('')
const [cardProcessing, setCardProcessing] = useState(false)
const [cardPaymentId, setCardPaymentId] = useState(null)
const [cardPaymentStatus, setCardPaymentStatus] = useState(null)
const cardProcessingRef = useRef(false)
const cardOrderSnapshotRef = useRef(null)
const cardPaymentModeRef = useRef(null)

const [showCustomerModal, setShowCustomerModal] = useState(false)


const [showPhraseModal, setShowPhraseModal] = useState(false)
const [phrase, setPhrase] = useState('')

const [pixData, setPixData] = useState(null)
const [pixLoading, setPixLoading] = useState(false)
const [pixConfirmationTimedOut, setPixConfirmationTimedOut] = useState(false)
const [pixPaymentStatus, setPixPaymentStatus] = useState(null)
const pixOrderSnapshotRef = useRef(null)

const [deliveryPeriod, setDeliveryPeriod] = useState(null)
const [showPaymentModal, setShowPaymentModal] = useState(false)

const [showDeliveryModal, setShowDeliveryModal] = useState(false)


const [showPaymentChoiceModal, setShowPaymentChoiceModal] = useState(false)
const [showCardFormModal, setShowCardFormModal] = useState(null)
// valores: 'credit' | 'debit' | null

const [deliveryFee, setDeliveryFee] = useState(0)


const [showSuccessModal, setShowSuccessModal] = useState(false)

const paymentProcessingStage = cardProcessing
  ? cardPaymentStatus === 'approved'
    ? 'card-approved'
    : 'card-processing'
  : pixData && pixPaymentStatus === 'approved'
    ? 'pix-approved'
    : null


const safeDeliveryFee = Number(deliveryFee) || 0

const finalTotal = parseFloat(
  (totalPrice + safeDeliveryFee).toFixed(2)
)

const [cepLocation, setCepLocation] = useState(null)
const [isFetchingCEP, setIsFetchingCEP] = useState(false)
const [cepInvalid, setCepInvalid] = useState(false)


// exemplo: { bairro: 'Centro', cidade: 'Manaus' }

const [distanceKm, setDistanceKm] = useState(null)





  const [visible, setVisible] = useState(false)
  const [animate, setAnimate] = useState(false)


  
  const isCheckoutOpen =
  showCustomerModal ||
  showDeliveryModal ||
  showPaymentChoiceModal ||
  showPaymentModal ||
  showCardFormModal ||
  cardProcessing ||
  showSuccessModal ||
  pixLoading ||
  pixData


  useEffect(() => {
    if (isCheckoutOpen) {
      document.body.classList.add('no-scroll')
      document.documentElement.classList.add('no-scroll')
    } else {
      document.body.classList.remove('no-scroll')
      document.documentElement.classList.remove('no-scroll')
    }
  
    return () => {
      document.body.classList.remove('no-scroll')
      document.documentElement.classList.remove('no-scroll')
    }
  }, [isCheckoutOpen])
  

useEffect(() => {
  if (open) {
    document.body.classList.add('no-scroll')
    document.documentElement.classList.add('no-scroll') // 👈 html
  // 🔒 trava fundo

    setVisible(true)
    setAnimate(false)

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setAnimate(true)
      })
    })
} else {
  document.body.classList.remove('no-scroll')
  document.documentElement.classList.remove('no-scroll')
 // 🔓 libera fundo

    setAnimate(false)

    const timer = setTimeout(() => {
      setVisible(false)
    }, 350)

    return () => clearTimeout(timer)
  }

  // segurança extra ao desmontar
 return () => {
  document.body.classList.remove('no-scroll')
  document.documentElement.classList.remove('no-scroll')
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


const pixPaymentId = pixData?.id

useEffect(() => {
  if (!pixPaymentId) return

  let cancelled = false
  let timeoutId = null
  let requestController = null
  const pollingDeadline = Date.now() + 15 * 60 * 1000

  setPixConfirmationTimedOut(false)

  const checkPaymentStatus = async () => {
    if (cancelled) return

    if (Date.now() >= pollingDeadline) {
      setPixConfirmationTimedOut(true)
      return
    }

    requestController = new AbortController()

    try {
      const response = await api.get(`/payment/status/${pixPaymentId}`, {
        signal: requestController.signal
      })

      if (cancelled) return

      const paymentStatus = response.data?.payment_status
      const orderReady = response.data?.order_ready === true

      if (typeof paymentStatus === 'string') {
        setPixPaymentStatus(paymentStatus)
      }

      if (paymentStatus === 'approved' && orderReady) {
        setConfirmedOrder(pixOrderSnapshotRef.current)
        setPixData(null)
        setShowSuccessModal(true)
        return
      }

      if (paymentStatus === 'rejected' || paymentStatus === 'cancelled') {
        return
      }
    } catch {
      if (cancelled) return
    }

    if (!cancelled) {
      timeoutId = window.setTimeout(checkPaymentStatus, 5000)
    }
  }

  checkPaymentStatus()

  return () => {
    cancelled = true

    if (timeoutId) {
      window.clearTimeout(timeoutId)
    }

    requestController?.abort()
  }
}, [pixPaymentId])


useEffect(() => {
  if (!cardPaymentId) return

  let cancelled = false
  let timeoutId = null
  let requestController = null

  const checkCardPaymentStatus = async () => {
    if (cancelled) return

    requestController = new AbortController()

    try {
      const response = await api.get(`/payment/status/${cardPaymentId}`, {
        signal: requestController.signal
      })

      if (cancelled) return

      const paymentStatus = response.data?.payment_status
      const orderReady = response.data?.order_ready === true

      if (typeof paymentStatus === 'string') {
        setCardPaymentStatus(paymentStatus)
      }

      if (paymentStatus === 'approved' && orderReady) {
        setConfirmedOrder(cardOrderSnapshotRef.current)
        setCardPaymentId(null)
        setCardPaymentStatus(null)
        cardProcessingRef.current = false
        setCardProcessing(false)
        setShowCardFormModal(null)
        cardPaymentModeRef.current = null
        setShowSuccessModal(true)
        return
      }

      if (paymentStatus === 'rejected' || paymentStatus === 'cancelled') {
        setCardPaymentId(null)
        setCardPaymentStatus(null)
        cardProcessingRef.current = false
        setCardProcessing(false)
        setShowCardFormModal(cardPaymentModeRef.current)
        alert(
          paymentStatus === 'rejected'
            ? 'Pagamento recusado pelo emissor'
            : 'Pagamento cancelado'
        )
        return
      }
    } catch {
      if (cancelled) return
    }

    if (!cancelled) {
      timeoutId = window.setTimeout(checkCardPaymentStatus, 5000)
    }
  }

  checkCardPaymentStatus()

  return () => {
    cancelled = true

    if (timeoutId) {
      window.clearTimeout(timeoutId)
    }

    requestController?.abort()
  }
}, [cardPaymentId])


const handleCheckoutWhatsApp = async (customPhrase = '') => {

  const phoneNumber = '559281230907'

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
if (deliveryPeriod === 'retiradanaloja') {
  message += `Retirada na loja\n\n`
} else {
  message += `Endereço:\n`
  message += `${customerData.street}, ${customerData.number}\n`
  message += `${customerData.neighborhood} - CEP ${customerData.cep}\n\n`
}


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
registerSale(cartItems)
  .catch((err) => {
    console.error('Erro ao registrar venda:', err)
  })
  .finally(() => {
    clearCart()
    resetCustomerForm()
  })


}


const handleCheckoutWhatsAppConfirmed = () => {
  if (!confirmedOrder) return

  const {
    cartItems,
    customerData,
    deliveryPeriod,
    deliveryFee,
    finalTotal
  } = confirmedOrder

  let message = `Olá! Gostaria de fazer um pedido.\n\n`
  message += `Pedido via site – Valle das Flores\n\n`

  cartItems.forEach((item) => {
    message += `• ${item.name}\n`
    message += `Quantidade: ${item.quantity}\n`
    message += `Valor: ${item.price}\n\n`
  })

  message += `Cliente: ${customerData.name}\n`
  message += `Telefone: ${customerData.phone}\n`
  message += `Data desejada: ${customerData.date}\n`

  if (deliveryPeriod === 'retiradanaloja') {
    message += `Retirada na loja\n\n`
  } else {
    message += `Endereço:\n`
    message += `${customerData.street}, ${customerData.number}\n`
    message += `${customerData.neighborhood} - CEP ${customerData.cep}\n\n`
  }

  message += `Período de entrega: ${deliveryPeriod}\n`

  if (deliveryFee > 0) {
    message += `Frete: R$ ${deliveryFee.toFixed(2).replace('.', ',')}\n`
  }

  message += `\nTotal do pedido: R$ ${finalTotal.toFixed(2).replace('.', ',')}\n\n`
  message += `Obrigado(a)!`

  const encoded = encodeURIComponent(message)
  window.location.href = `https://wa.me/559281230907?text=${encoded}`

  // ✅ AGORA SIM limpa tudo
  clearCart()
  setConfirmedOrder(null)
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
  })),

  payment_method: 'pix',
  total: finalTotal,

  customer_name: customerData.name,
  customer_phone: customerData.phone,
  cpf: customerData.cpf,
  hall: customerData.hall,
  tribute: customerData.tribute || ''
}
    

    console.log('Payload checkout:', payload)

    const response = await api.post('/checkout-totem', payload)

    pixOrderSnapshotRef.current = {
      cartItems,
      customerData,
      deliveryPeriod,
      deliveryFee,
      finalTotal
    }

    setPixConfirmationTimedOut(false)
    setPixPaymentStatus(null)
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

      <aside
  className={`cart-drawer ${animate ? 'open' : 'close'} ${
    isCheckoutOpen ? 'checkout-open' : ''
  }`}
>

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


{pixData && pixPaymentStatus !== 'approved' && (
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

      {pixConfirmationTimedOut ? (
        <div className="pix-loading">
          <p>Não recebemos a confirmação do pagamento.</p>
          <span>Feche esta tela para tentar novamente.</span>
          <button
            className="phrase-confirm"
            onClick={() => setPixData(null)}
          >
            Fechar e tentar novamente
          </button>
        </div>
      ) : pixPaymentStatus === 'rejected' || pixPaymentStatus === 'cancelled' ? (
        <div className="pix-loading">
          <p>
            {pixPaymentStatus === 'rejected'
              ? 'O pagamento não foi aprovado.'
              : 'O pagamento foi cancelado.'}
          </p>
          <span>Feche esta tela para tentar novamente.</span>
          <button
            className="phrase-confirm"
            onClick={() => setPixData(null)}
          >
            Fechar e tentar novamente
          </button>
        </div>
      ) : (
        <p className="phrase-subtitle">
          Após realizar o pagamento, a confirmação será feita automaticamente.
        </p>
      )}

    </div>
  </div>
)}

{paymentProcessingStage && (
  <div className="delivery-overlay">
    <div className="delivery-card pix-loading">
      <i className="fa-solid fa-spinner fa-spin"></i>

      <p>
        {paymentProcessingStage === 'pix-approved'
          ? 'Pagamento reconhecido!'
          : paymentProcessingStage === 'card-approved'
            ? 'Pagamento aprovado!'
            : 'Processando pagamento...'}
      </p>

      <span>
        {paymentProcessingStage === 'card-processing'
          ? 'Por favor, aguarde. Não feche esta tela.'
          : 'Estamos finalizando seu pedido...'}
      </span>
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
  onChange={(e) => {
    const onlyLetters = e.target.value.replace(/[^A-Za-zÀ-ÿ\s]/g, '')
    handleCustomerChange('name', onlyLetters)
  }}
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
  <label>CPF do pagador</label>
  <input
    type="text"
    inputMode="numeric"
    placeholder="000.000.000-00"
    value={customerData.cpf}
    onChange={(e) =>
      handleCustomerChange('cpf', formatCPF(e.target.value))
    }
    maxLength={14}
  />
</div>


      

     


      {/* FRASE SOMENTE SE TIVER COROA */}
      {hasCoroa && (
        <div className="form-group">
          <label>Frase para a faixa de sua homenagem</label>
          <textarea
            rows="3"
            value={customerData.tribute}
            onChange={(e) => handleCustomerChange('tribute', e.target.value)}
            placeholder="Ex: Com amor e saudades eternas"
          />
        </div>
      )}



     <div className="form-group">
  <label>Salão</label>

  <select
    value={customerData.hall}
    onChange={(e) => handleCustomerChange('hall', e.target.value)}
  >
    <option value="">Selecione o salão</option>
    <option value="1">Salão 1</option>
    <option value="2">Salão 2</option>
    <option value="3">Salão 3</option>
    <option value="4">Salão 4</option>
    <option value="5">Salão 5</option>
    <option value="6">Salão 6</option>
  </select>
</div>


 <div className="delivery-warning">
  <strong>AVISO IMPORTANTE:</strong>
  <p>
    Certifique-se de que a pessoa estará no local durante o período de entrega
    escolhido. Caso contrário, o produto retornará para a loja e será cobrada
    uma nova taxa para reenviar o item.
  </p>
</div>

<button
  className="delivery-confirm"
  disabled={
  !customerData.name ||
  !customerData.phone ||
  !customerData.cpf ||
  !customerData.hall
}


        onClick={() => {
  setShowCustomerModal(false)
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
        onClick={() => {
          setCardPaymentId(null)
          setCardPaymentStatus(null)
          cardProcessingRef.current = false
          setCardProcessing(false)
          cardPaymentModeRef.current = null
          setShowCardFormModal(null)
        }}
        disabled={cardProcessing && !cardPaymentId}
        aria-label="Fechar"
      >
        <i className="fa-solid fa-xmark"></i>
      </button>

      <h4>
        {showCardFormModal === 'credit'
          ? 'Cartão de crédito'
          : 'Cartão de débito'}
      </h4>

      <div className="form-group">
        <label>Número do cartão</label>

         <div className="card-number-input">
        <input
          type="text"
          inputMode="numeric"
          placeholder="0000 0000 0000 0000"
          value={cardData.number}
          onChange={async (e) => {
  const formatted = formatCardNumber(e.target.value)

  setCardData({
    ...cardData,
    number: formatted
  })

  const cardNumber = formatted.replace(/\s/g, '')

  if (cardNumber.length >= 6) {
    try {
      const response = await mp.getPaymentMethods({
        bin: cardNumber.substring(0, 6)
      })

     if (response.results.length > 0) {
  const paymentMethod = response.results[0]

  setCardBrand(paymentMethod.name)

  const installmentsResponse = await mp.getInstallments({
    amount: String(finalTotal),
    bin: cardNumber.substring(0, 6)
  })

  if (
    installmentsResponse.length > 0 &&
    installmentsResponse[0].payer_costs
  ) {
    setInstallments(installmentsResponse[0].payer_costs)
  } else {
    setInstallments([])
  }
} else {
  setCardBrand('')
  setInstallments([])
}
    } catch (err) {
  console.error(err)
  setCardBrand('')
  setInstallments([])
}
  } else {
    setCardBrand('')
  }
}}
        />

        {cardBrand && (
  <img
    className="card-brand-logo"
    src={`/card-brands/${cardBrand.toLowerCase()}.svg`}
    alt={cardBrand}
  />
)}

       </div>
      </div>

      <div className="form-group">
        <label>Nome no cartão</label>
        <input
          type="text"
          placeholder="Como está impresso"
          value={cardData.name}
          onChange={(e) =>
            setCardData({ ...cardData, name: e.target.value.toUpperCase() })
          }
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Validade</label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="MM/AA"
            value={cardData.expiry}
            onChange={(e) =>
              setCardData({ ...cardData, expiry: formatExpiry(e.target.value) })
            }
          />
        </div>

        <div className="form-group">
          <label>CVV</label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="CVV"
            value={cardData.cvv}
            onChange={(e) =>
              setCardData({ ...cardData, cvv: formatCVV(e.target.value) })
            }
          />
        </div>
      </div>

      {showCardFormModal === 'credit' && (
  <div className="form-group">
    <label>Parcelamento</label>

   <select
  value={cardData.installments}
  onChange={(e) =>
    setCardData({
      ...cardData,
      installments: e.target.value
    })
  }
>

  {installments.length === 0 ? (

    <option value="1">
      À vista
    </option>

  ) : (

    installments.map((item) => (
      <option
        key={item.installments}
        value={item.installments}
      >
       {item.installments === 1
  ? `À vista — ${item.total_amount.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })}`
  : `${item.installments}x de ${item.installment_amount.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })}`
}
      </option>
    ))

  )}

</select>
  </div>
)}

<button
  className="delivery-confirm"
  disabled={cardProcessing}
  onClick={async () => {
    if (cardProcessingRef.current) return

    cardPaymentModeRef.current = showCardFormModal
    cardProcessingRef.current = true
    setCardProcessing(true)
    setCardPaymentStatus(null)
    setShowCardFormModal(null)

    try {
      // 1️⃣ limpar e separar validade
      const expiry = cardData.expiry.replace(/\s/g, '')

      if (!expiry || !expiry.includes('/')) {
        cardProcessingRef.current = false
        setCardProcessing(false)
        setShowCardFormModal(cardPaymentModeRef.current)
        alert('Validade do cartão inválida')
        return
      }

      const [month, year] = expiry.split('/')

      if (!month || !year || month.length !== 2 || year.length !== 2) {
        cardProcessingRef.current = false
        setCardProcessing(false)
        setShowCardFormModal(cardPaymentModeRef.current)
        alert('Validade do cartão inválida')
        return
      }

      // 2️⃣ criar token do cartão (CAMPOS CORRETOS)
      const tokenResponse = await mp.createCardToken({
        cardNumber: cardData.number.replace(/\s/g, ''),
        cardholderName: cardData.name,
        cardExpirationMonth: month,
        cardExpirationYear: `20${year}`,
        securityCode: cardData.cvv,
      })

      // 3️⃣ validar token
      if (tokenResponse.error) {
        console.error('[CARD_DIAGNOSTIC] Falha ao criar token', {
          token_created: false
        })
        cardProcessingRef.current = false
        setCardProcessing(false)
        setShowCardFormModal(cardPaymentModeRef.current)
        alert('Dados do cartão inválidos')
        return
      }

      const token = tokenResponse.id

      const paymentMethods = await mp.getPaymentMethods({
  bin: tokenResponse.first_six_digits
})

const paymentMethod = paymentMethods.results[0]

      console.log('[CARD_DIAGNOSTIC] Payload sanitizado', {
        mode: showCardFormModal,
        payment_methods_count: paymentMethods.results.length,
        payment_methods: paymentMethods.results.map((method) => ({
          id: method.id,
          payment_type_id: method.payment_type_id,
          status: method.status,
          processing_mode: method.processing_mode,
          additional_info_needed: method.additional_info_needed,
          issuer_id: method.issuer?.id ?? 'ausente'
        })),
        payment_method_id: paymentMethod.id,
        issuer_id: paymentMethod.issuer?.id ?? 'ausente',
        installments: Number(cardData.installments),
        total: finalTotal,
        token_created: Boolean(token)
      })

      // 4️⃣ enviar token pro backend
      const response = await api.post('/pay/card', {
  token,

  total: finalTotal,

  installments: Number(cardData.installments),

  email: 'cliente@valledasflores.com',

  cpf: customerData.cpf.replace(/\D/g, ''),

  payment_method_id: paymentMethod.id,

  issuer_id: paymentMethod.issuer?.id
})

      // 5️⃣ tratar resposta
      const payment = response.data.response
      const paymentId = payment?.id
      const paymentStatus = payment?.status
      const paymentStatusDetail = payment?.status_detail

      if (typeof paymentStatus === 'string') {
        setCardPaymentStatus(paymentStatus)
      }

      if (paymentStatus === 'rejected' || paymentStatus === 'cancelled') {
        cardProcessingRef.current = false
        setCardProcessing(false)
        setCardPaymentStatus(null)
        setShowCardFormModal(cardPaymentModeRef.current)
        alert(
          paymentStatusDetail
            ? `Pagamento recusado: ${paymentStatusDetail}`
            : paymentStatus === 'cancelled'
              ? 'Pagamento cancelado'
              : 'Pagamento recusado pelo emissor'
        )
        return
      }

      if (!paymentId || payment?.error) {
        cardProcessingRef.current = false
        setCardProcessing(false)
        setCardPaymentStatus(null)
        setShowCardFormModal(cardPaymentModeRef.current)
        alert(
          paymentStatusDetail
            ? `Pagamento recusado: ${paymentStatusDetail}`
            : payment?.message || 'Erro ao processar pagamento'
        )
        return
      }

      cardOrderSnapshotRef.current = {
        cartItems,
        customerData,
        deliveryPeriod,
        deliveryFee,
        finalTotal
      }

      setCardPaymentId(String(paymentId))
    } catch (err) {
  const backendData = err.response?.data
  const backendResponse = backendData?.response

  console.error('[CARD_DIAGNOSTIC] Falha na requisição', {
    http_status: err.response?.status,
    sdk_http_status: backendData?.status,
    response: backendResponse
      ? {
          id: backendResponse.id,
          status: backendResponse.status,
          status_detail: backendResponse.status_detail,
          payment_method_id: backendResponse.payment_method_id,
          payment_type_id: backendResponse.payment_type_id,
          installments: backendResponse.installments,
          error: backendResponse.error,
          message: backendResponse.message,
          cause: backendResponse.cause,
          request_id: backendResponse.request_id
        }
      : null
  })

  cardProcessingRef.current = false
  setCardProcessing(false)
  setCardPaymentStatus(null)
  setShowCardFormModal(cardPaymentModeRef.current)
  alert('Erro ao processar pagamento')
}
  }}
>

  Pagar
</button>


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
        Pagamento aprovado e pedido recebido com sucesso.
        <br />
        A floricultura entrará em contato pelo WhatsApp para confirmar os detalhes do pedido.
      </p>

      <img
        src={whatsappQrCodeUrl}
        alt="QR Code para abrir o WhatsApp da floricultura"
        style={{ width: 220, margin: '0 auto 16px', display: 'block' }}
      />

      <p>
        Escaneie o QR Code com seu celular para abrir o WhatsApp da floricultura.
        <br />
        Se não souber usar o QR Code, utilize o número <strong>{whatsappDisplayPhone}</strong>.
        <br />
        {serviceHours}
      </p>
      <button
  className="success-whatsapp"
  onClick={() => {
    clearCart();  // Limpar o carrinho
    setShowSuccessModal(false);  // Fechar o modal de sucesso

    // Redireciona o usuário para a loja
    history.push('/loja');  // Para versões mais antigas do react-router
    // Ou para versões mais novas (v6+)
    // navigate('/loja');
  }}
>
  Fechar
</button>


    </div>
  </div>
)}



    </>
  )
}

export default CartDrawer
