import './Destaques.css'
import { useEffect, useState } from 'react'
import { produtos } from '../data/produtos'

function Destaques() {
  const [destaques, setDestaques] = useState([])

  useEffect(() => {
    const sales =
      JSON.parse(localStorage.getItem('salesCount')) || {}

    const top3 = produtos
      .map((produto) => ({
        ...produto,
        sold: sales[produto.id] || 0,
      }))
      .filter((p) => p.sold > 0)
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 3)

    setDestaques(top3)
  }, [])

  if (destaques.length === 0) return null

  return (
    <section className="destaques">
      <h3>Destaques da Semana</h3>

      <div className="cards">
        {destaques.map((item) => (
          <div className="card" key={item.id}>
            <img src={item.image} alt={item.name} />

            <div className="card-content">
              <h4>{item.name}</h4>
              <p>{item.description}</p>
              <span className="price">{item.price}</span>
              <button>Comprar</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Destaques
