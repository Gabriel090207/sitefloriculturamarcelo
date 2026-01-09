import './Home.css'
import { useNavigate } from 'react-router-dom'

import Destaques from '../components/Destaques'
import Combos from '../components/Combos'
import Depoimentos from '../components/Depoimentos'
import ArranjosHome from '../components/ArranjosHome'
import Divider from '../components/Divider'



function Home() {
  const navigate = useNavigate()

  return (
    <>
     <section className="hero">
  <div className="hero-content">
    <h2>Transformamos Sentimentos em Flores</h2>
    <p>Entregamos carinho em cada detalhe </p>

    <div className="hero-buttons">
      <button
  className="btn-primary"
  onClick={() => navigate('/loja')}
>
  Comprar Agora
</button>

      <button
  className="btn-secondary"
  onClick={() => {
    const section = document.getElementById('combos')
    section?.scrollIntoView({ behavior: 'smooth' })
  }}
>
  Ver Combos
</button>

    </div>
  </div>
</section>


      {/* Destaques da Semana */}
      <Destaques />

      <ArranjosHome />


      {/* Próximas seções (ainda vazias) */}
      <Combos />

      <Divider />

      <Depoimentos />
    </>
  )
}

export default Home
