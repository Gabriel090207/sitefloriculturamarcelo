import { Routes, Route, useLocation } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'

import Home from './pages/Home'
import Loja from './pages/Loja'
import Sobre from './pages/Sobre'
import Pagamento from './pages/Pagamento'
import PoliticaEntrega from './pages/PoliticaEntrega'
import PoliticaPrivacidade from './pages/PoliticaPrivacidade'
import PoliticaTrocaDevolucao from './pages/PoliticaTrocaDevolucao'



import Contato from './pages/Contato'
import Header from './components/Header'
import Footer from './components/Footer'

import { useCart } from './context/CartContext'
import CartToast from './components/CartToast'
import CartDrawer from './components/CartDrawer'

import ScrollToTop from './components/ScrollToTop'



import Totem from './totem/Totem'


function App() {


  
  const routerLocation = useLocation()
  const { clearCart, totalItems } = useCart()

  const [cartOpen, setCartOpen] = useState(false)

  const previousPath = useRef(routerLocation.pathname)

  const isLoja = routerLocation.pathname === '/loja'
const isTotem = routerLocation.pathname === '/totem'

  useEffect(() => {
    const fromLoja = previousPath.current === '/loja'
    const toAnotherPage = routerLocation.pathname !== '/loja'

    if (fromLoja && toAnotherPage) {
  clearCart()
  localStorage.removeItem('categoriaAtiva')
}


    previousPath.current = routerLocation.pathname
  }, [routerLocation.pathname, clearCart])

  return (
    <>

     <ScrollToTop />
      {!isTotem && <Header />}
      <CartToast />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route
  path="/loja"
  element={
    <Loja
      cartOpen={cartOpen}
    />
  }
/>
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/contato" element={<Contato />} />
        <Route path="/pagamento" element={<Pagamento />} />
        <Route path="/politica-de-entrega" element={<PoliticaEntrega />} />
        <Route path="/politica-de-privacidade" element={<PoliticaPrivacidade />} />
        <Route path="/troca-e-devolucao" element={<PoliticaTrocaDevolucao />} />


        <Route path="/totem" element={<Totem />} />

      </Routes>

      {/* BOTÃO FLUTUANTE */}
      {!isTotem && (
  isLoja ? (
        <button
          className="cart-float"
          onClick={() => setCartOpen(true)}
        >
          <i className="fa-solid fa-cart-shopping"></i>

          {totalItems > 0 && (
            <span className="cart-badge">{totalItems}</span>
          )}
        </button>
      ) : (
        <a
          href="https://wa.me/559281230907?text=Olá,%20vim%20pelo%20site%20Valle%20das%20Flores!"
          className="whatsapp-float"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fab fa-whatsapp"></i>
        </a>
      )
)}

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
      />

      {!isTotem && <Footer />}
    </>
  )
}

export default App
