import './Destaques.css'
import { useEffect, useState } from 'react'
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore'
import { db } from '../firebase/firebase'

function Destaques() {
  const [destaques, setDestaques] = useState([])

  useEffect(() => {
    async function fetchDestaques() {
      const q = query(
        collection(db, 'products'),
        orderBy('sold', 'desc'),
        limit(3)
      )

      const snapshot = await getDocs(q)

      const produtos = snapshot.docs
        .map((doc) => doc.data())
        .filter((p) => p.sold > 0)

      setDestaques(produtos)
    }

    fetchDestaques()
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
