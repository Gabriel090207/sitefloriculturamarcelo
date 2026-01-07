import { Routes, Route, useLocation } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'

import Home from './pages/Home'
import Loja from './pages/Loja'
import Sobre from './pages/Sobre'
import Header from './components/Header'
import Footer from './components/Footer'

import { useCart } from './context/CartContext'
import CartToast from './components/CartToast'
import CartDrawer from './components/CartDrawer'

import ScrollToTop from './components/ScrollToTop'



function App() {
  const routerLocation = useLocation()
  const { clearCart, totalItems } = useCart()

  const [cartOpen, setCartOpen] = useState(false)

  const previousPath = useRef(routerLocation.pathname)

  const isLoja = routerLocation.pathname === '/loja'

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
      <Header />
      <CartToast />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/loja" element={<Loja />} />
        <Route path="/sobre" element={<Sobre />} />
      </Routes>

      {/* BOTÃO FLUTUANTE */}
      {isLoja ? (
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
          href="https://wa.me/5599999999999?text=Olá,%20vim%20pelo%20site%20Valle%20das%20Flores!"
          className="whatsapp-float"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fab fa-whatsapp"></i>
        </a>
      )}

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
      />

      <Footer />
    </>
  )
}

export default App
