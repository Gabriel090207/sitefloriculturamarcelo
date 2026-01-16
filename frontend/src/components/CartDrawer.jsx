import { useCart } from '../context/CartContext'
import { useEffect, useState,} from 'react'
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

console.log('PUBLIC KEY:', import.meta.env.VITE_MP_PUBLIC_KEY)


const mp = new window.MercadoPago(
  import.meta.env.VITE_MP_PUBLIC_KEY,
  { locale: 'pt-BR' }
)








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

const [customerData, setCustomerData] = useState({
  name: '',
  phone: '',
  date: '',
  street: '',
  neighborhood: '',
  number: '',
  cep: '',
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
    street: '',
    neighborhood: '',
    number: '',
    cep: '',
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


const safeDeliveryFee = Number(deliveryFee) || 0

const finalTotal = parseFloat(
  (totalPrice + safeDeliveryFee).toFixed(2)
)

const [cepLocation, setCepLocation] = useState(null)
// exemplo: { bairro: 'Centro', cidade: 'Manaus' }

const [distanceKm, setDistanceKm] = useState(null)





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


useEffect(() => {
  const run = async () => {
    if (
      customerData.cep.length === 9 &&
      deliveryPeriod !== 'retiradanaloja'
    ) {
      try {
        const data = await fetchCEPData(customerData.cep)
        setCepLocation(data)
      } catch (err) {
        console.error('Erro ao buscar CEP:', err)
        setCepLocation(null)
      }
    } else {
      setCepLocation(null)
    }
  }

  run()
}, [customerData.cep, deliveryPeriod])


useEffect(() => {
  const run = async () => {
    if (
      customerData.cep.length !== 9 ||
      deliveryPeriod === 'retiradanaloja'
    ) {
      setDeliveryFee(0)
      return
    }

    try {
      const cepData = await fetchCEPData(customerData.cep)
      if (!cepData || !cepData.bairro) {
        setDeliveryFee(40)
        return
      }

      const fee = calculateDeliveryFeeByZone(cepData.bairro)
      setDeliveryFee(fee)

      console.log('Bairro:', cepData.bairro)
      console.log('Frete por zona: R$', fee)
    } catch (err) {
      console.error('Erro ao calcular frete por zona:', err)
    }
  }

  run()
}, [customerData.cep, deliveryPeriod])


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
  <label>Rua</label>
  <input
    type="text"
    value={customerData.street}
    onChange={(e) => handleCustomerChange('street', e.target.value)}
    placeholder="Ex: Rua Major Gabriel"
  />
</div>

<div className="form-group">
  <label>Bairro</label>
  <input
    type="text"
    value={customerData.neighborhood}
    onChange={(e) => handleCustomerChange('neighborhood', e.target.value)}
    placeholder="Ex: Centro"
  />
</div>

<div className="form-row">
  <div className="form-group">
    <label>Número</label>
    <input
      type="text"
      value={customerData.number}
      onChange={(e) => handleCustomerChange('number', e.target.value)}
      placeholder="Ex: 1833"
    />
  </div>

  <div className="form-group">
    <label>CEP</label>
    <input
  type="text"
  inputMode="numeric"
  value={customerData.cep}
  onChange={(e) =>
    handleCustomerChange('cep', formatCEP(e.target.value))
  }
  placeholder="00000-000"
  maxLength={9}
/>

  </div>
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
  !customerData.street ||
  !customerData.neighborhood ||
  !customerData.number ||
  !customerData.cep
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

      <div className="delivery-warning">
  <strong>AVISO IMPORTANTE:</strong>
  <p>
    Certifique-se de que a pessoa estará no local durante o período de entrega
    escolhido. Caso contrário, o produto retornará para a loja e será cobrada
    uma nova taxa para reenviar o item.
  </p>
</div>



      {[
  { id: 'retiradanaloja', label: 'Retirada na Loja', time: '08h às 19h', price: 0 },
  { id: 'manha', label: 'Manhã', time: '08h às 13h', price: 0 },
  { id: 'tarde', label: 'Tarde', time: '13h às 19h', price: 0 },
  { id: 'noite', label: 'Noite', time: 'A combinar por WhatsApp', price: 0 }
].map(option => (

        <div
          key={option.id}
          className={`delivery-option ${
            deliveryPeriod === option.id ? 'selected' : ''
          }`}
         onClick={() => {
  setDeliveryPeriod(option.id)
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
  {option.id === 'retiradanaloja'
    ? 'Grátis'
    : deliveryFee > 0
      ? `R$ ${deliveryFee.toFixed(2).replace('.', ',')}`
      : '—'}
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

      <div className="form-group">
        <label>Número do cartão</label>
        <input
          type="text"
          inputMode="numeric"
          placeholder="0000 0000 0000 0000"
          value={cardData.number}
          onChange={(e) =>
            setCardData({ ...cardData, number: formatCardNumber(e.target.value) })
          }
        />
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
              setCardData({ ...cardData, installments: e.target.value })
            }
          >
            <option value="1">1x sem juros</option>
            <option value="2">2x sem juros</option>
            <option value="3">3x sem juros</option>
          </select>
        </div>
      )}

     <button
  className="delivery-confirm"
  onClick={async () => {
    try {
      // 1️⃣ separar validade
      const [month, year] = cardData.expiry.split('/')

      // 2️⃣ criar token do cartão
      const tokenResponse = await mp.createCardToken({
        cardNumber: cardData.number.replace(/\s/g, ''),
        cardholderName: cardData.name,
        securityCode: cardData.cvv,
        expirationMonth: month,
        expirationYear: `20${year}`,
      })

      // 3️⃣ validar token
      if (tokenResponse.error) {
        console.error(tokenResponse.error)
        alert('Dados do cartão inválidos')
        return
      }

      const token = tokenResponse.id

      // 4️⃣ enviar token pro backend
      const response = await api.post('/pay/card', {
        token,
        total: finalTotal,
        installments: cardData.installments,
        email: 'cliente@valledasflores.com',
      })

      // 5️⃣ tratar resposta REAL
      if (response.data.status === 'approved') {
        setShowCardFormModal(null)
        setShowSuccessModal(true)
      } else {
        alert('Pagamento recusado')
      }

    } catch (err) {
      console.error(err)
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
