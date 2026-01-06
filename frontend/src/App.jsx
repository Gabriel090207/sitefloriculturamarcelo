import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Loja from './pages/Loja'
import Sobre from './pages/Sobre'
import Header from './components/Header'
import Footer from './components/Footer'

function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/loja" element={<Loja />} />
        <Route path="/sobre" element={<Sobre />} />
      </Routes>


      <a
  href="https://wa.me/5599999999999?text=Olá,%20vim%20pelo%20site%20Valle%20das%20Flores!"
  className="whatsapp-float"
  target="_blank"
  rel="noopener noreferrer"
>
  <i className="fab fa-whatsapp"></i>
</a>


 <Footer />
    </>

    
  )
}

export default App
