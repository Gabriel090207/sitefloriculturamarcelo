import './Home.css'
import Destaques from '../components/Destaques'
import Combos from '../components/Combos'
import Depoimentos from '../components/Depoimentos'


function Home() {
  return (
    <>
      <section className="hero">
        <h2>Transformamos sentimentos em flores</h2>
        <p>Entregamos carinho em cada detalhe 🌸</p>

        <div className="hero-buttons">
          <button className="btn-primary">Comprar Agora</button>
          <button className="btn-secondary">Conhecer Loja</button>
        </div>
      </section>

      {/* Destaques da Semana */}
      <Destaques />

      {/* Próximas seções (ainda vazias) */}
      <Combos />

      <Depoimentos />
    </>
  )
}

export default Home
