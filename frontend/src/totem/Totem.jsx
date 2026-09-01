import { useState, useEffect, useRef } from 'react'
import './Totem.css'
import TotemHeader from './components/TotemHeader'
import hero from '../assets/hero.png'

import ProductCard from '../components/ProductCard'
import { produtos } from '../data/produtos'

import { useCart } from '../context/CartContext'
import TotemCartDrawer from '../components/TotemCartDrawer'

function Totem() {

const [categoriaAtiva, setCategoriaAtiva] = useState('Buquês')
const produtosFiltrados = produtos.filter(
  produto => produto.category === categoriaAtiva
)

const {
  totalItems,
  addToCart,
  clearCart
} = useCart()

const [isSessionStarted, setIsSessionStarted] = useState(false)
const [hasActivePayment, setHasActivePayment] = useState(false)
const [sessionMessage, setSessionMessage] = useState('')
const sessionMessageTimeoutRef = useRef(null)

const [cartOpen, setCartOpen] = useState(false)

const [produtoSelecionado, setProdutoSelecionado] = useState(null)

const [showScrollTop, setShowScrollTop] = useState(false)

useEffect(() => {
  const handleScroll = () => {
    setShowScrollTop(window.scrollY > 500)
  }

  window.addEventListener('scroll', handleScroll)

  return () => {
    window.removeEventListener('scroll', handleScroll)
  }
}, [])

useEffect(() => {
  return () => {
    if (sessionMessageTimeoutRef.current) {
      clearTimeout(sessionMessageTimeoutRef.current)
    }
  }
}, [])

const resetSessionView = () => {
  setCartOpen(false)
  setProdutoSelecionado(null)
  setCategoriaAtiva('Buquês')
  setShowScrollTop(false)
  window.scrollTo({ top: 0, behavior: 'auto' })
}

const handleStartSession = () => {
  clearCart()
  resetSessionView()
  setHasActivePayment(false)
  setSessionMessage('')
  setIsSessionStarted(true)
}

const showSessionMessage = (message) => {
  if (sessionMessageTimeoutRef.current) {
    clearTimeout(sessionMessageTimeoutRef.current)
  }

  setSessionMessage(message)
  sessionMessageTimeoutRef.current = setTimeout(() => {
    setSessionMessage('')
    sessionMessageTimeoutRef.current = null
  }, 4000)
}

const handleCancelSession = () => {
  if (hasActivePayment) {
    showSessionMessage(
      'Há um pagamento em processamento. Aguarde a confirmação antes de cancelar o pedido.'
    )
    return
  }

  clearCart()
  resetSessionView()
  setIsSessionStarted(false)
}

const handleSessionComplete = () => {
  resetSessionView()
  setHasActivePayment(false)
  setIsSessionStarted(false)
}

  return (
    <main className="totem-page">

      {isSessionStarted && <TotemHeader />}

      {sessionMessage && (
        <div className="totem-session-message" role="status" aria-live="polite">
          {sessionMessage}
        </div>
      )}

      {!isSessionStarted ? (
        <section className="totem-start-screen">
          <img
            src={hero}
            alt=""
            className="totem-start-background"
            aria-hidden="true"
          />

          <div className="totem-start-content">
            <img
              src="/logo.png"
              alt="Valle das Flores"
              className="totem-start-logo"
            />
            <h1>Bem-vindo à Valle das Flores</h1>
            <p>
              Encontre flores para transformar sentimentos em momentos especiais.
              Escolha seu buquê ou sua coroa, personalize seu pedido e finalize tudo por aqui
              de forma simples e rápida.
            </p>
            <div className="hero-buttons">
              <button
                type="button"
                className="btn-primary totem-start-button"
                onClick={handleStartSession}
              >
                Iniciar pedido
              </button>
            </div>
          </div>
        </section>
      ) : (
        <>
          <div className="totem-session-actions">
            <button type="button" onClick={handleCancelSession}>
              Cancelar pedido
            </button>
          </div>

      <section className="totem-categorias">

        <button
          className={categoriaAtiva === 'Buquês' ? 'active' : ''}
          onClick={() => setCategoriaAtiva('Buquês')}
        >
          Buquês
        </button>

        <button
          className={categoriaAtiva === 'CoroasdeRosas' ? 'active' : ''}
          onClick={() => setCategoriaAtiva('CoroasdeRosas')}
        >
          Coroas de Rosas
        </button>

        <button
          className={categoriaAtiva === 'CoroasdeCampo' ? 'active' : ''}
          onClick={() => setCategoriaAtiva('CoroasdeCampo')}
        >
          Coroas de Campo
        </button>

      </section>
<section className="totem-produtos">

  {produtosFiltrados.map(produto => (
    <div
      className="produto-card"
      key={produto.id}
    >
      <div className="produto-imagem-wrapper">
        <img
          src={produto.image}
          alt={produto.name}
        />

        <span className="produto-imagem-aviso">
          * Imagens meramente ilustrativas
        </span>
      </div>

      <h3>{produto.name}</h3>

      <p>{produto.description}</p>

      <strong>{produto.price}</strong>

      <div className="produto-actions">

 <button
  className="btn-comprar"
  onClick={() => addToCart(produto)}
>
  Por no Carrinho
</button>

 <button
  className="btn-detalhes"
  onClick={() => setProdutoSelecionado(produto)}
>
    Detalhes
  </button>

</div>
    </div>
  ))}

</section>

{showScrollTop && (
  <button
    className="totem-scroll-top"
    onClick={() =>
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  >
     <i className="fa-solid fa-arrow-up"></i>
  </button>
)}

<button
  className="totem-cart-button"
  onClick={() => setCartOpen(true)}
>
  <i className="fa-solid fa-cart-shopping"></i>

  {totalItems > 0 && (
    <span className="totem-cart-badge">
      {totalItems}
    </span>
  )}
</button>

<TotemCartDrawer
  open={cartOpen}
  onClose={() => setCartOpen(false)}
  onPaymentActivityChange={setHasActivePayment}
  onSessionComplete={handleSessionComplete}
/>


{produtoSelecionado && (
  <div className="produto-detalhe-overlay">
    <div className="produto-detalhe-card">

      <button
        className="produto-detalhe-close"
        onClick={() => setProdutoSelecionado(null)}
      >
        ✕
      </button>

      <img
        src={produtoSelecionado.image}
        alt={produtoSelecionado.name}
        className="produto-detalhe-img"
      />

      <h3>{produtoSelecionado.name}</h3>

      <p className="produto-detalhe-desc">
        {produtoSelecionado.details}
      </p>

      <div className="produto-detalhe-info">

        <div>
          <strong>Quantidade de flores</strong>
          <span>{produtoSelecionado.flowersQty}</span>
        </div>

        <div>
          <strong>Tempo de produção</strong>
          <span>{produtoSelecionado.productionTime}</span>
        </div>

      </div>

    </div>
  </div>
)}

        </>
      )}

    </main>
  )
}

export default Totem
