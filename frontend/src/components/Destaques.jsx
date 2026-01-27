import './Destaques.css'
import { useEffect, useState } from 'react'
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore'
import { db } from '../firebase/firebase'
import { useCart } from '../context/CartContext'
import { useNavigate } from 'react-router-dom'

function Destaques() {
  const { addToCart } = useCart()  // Importando a função addToCart
  const navigate = useNavigate()

  const handleComprar = (produto) => {
    addToCart({
      id: produto.id,
      name: produto.name,
      price: produto.price,
      image: produto.image,
      description: produto.description,
      category: 'Destaques',  // Ou qualquer categoria relevante
    })

    // Após adicionar ao carrinho, redireciona para a página da loja
    navigate('/loja')
  }

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
              <button onClick={() => handleComprar(item)}>
                Comprar
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Destaques
