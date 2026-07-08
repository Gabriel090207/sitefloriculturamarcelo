import { useState } from 'react'
import './Coroas.css'
import { useCart } from '../context/CartContext'
import { useNavigate } from 'react-router-dom'

const coroasData = [
  {
    id: 1,
    image: '/coroa1.png',
    title: 'Coroa de Rosas',
    description:
      'Uma homenagem respeitosa com rosas selecionadas para expressar carinho.',
    price: 'R$ 450,00',
  },
  {
    id: 2,
    image: '/coroa2.png',
    title: 'Coroa de Rosas',
    description:
      'Uma homenagem respeitosa com rosas selecionadas para expressar carinho.',
    price: 'R$ 450,00',
  },
  {
    id: 3,
    image: '/coroa3.png',
    title: 'Coroa de Rosas',
    description:
      'Uma homenagem respeitosa com rosas selecionadas para expressar carinho.',
    price: 'R$ 450,00',
  },
  {
    id: 4,
    image: '/coroa4.png',
    title: 'Coroa de Rosas',
    description:
      'Uma homenagem respeitosa com rosas selecionadas para expressar carinho.',
    price: 'R$ 450,00',
  },
  {
    id: 5,
    image: '/coroa5.png',
    title: 'Coroa de Rosas',
    description:
      'Uma homenagem respeitosa com rosas selecionadas para expressar carinho.',
    price: 'R$ 450,00',
  },
  {
    id: 6,
    image: '/coroa6.png',
    title: 'Coroa de Rosas',
    description:
      'Uma homenagem respeitosa com rosas selecionadas para expressar carinho.',
    price: 'R$ 450,00',
  },
  {
    id: 7,
    image: '/coroa7.png',
    title: 'Coroa de Rosas',
    description:
      'Uma homenagem respeitosa com rosas selecionadas para expressar carinho.',
    price: 'R$ 450,00',
  },
  {
    id: 8,
    image: '/coroa8.png',
    title: 'Coroa de Rosas',
    description:
      'Uma homenagem respeitosa com rosas selecionadas para expressar carinho.',
    price: 'R$ 450,00',
  },
  {
    id: 9,
    image: '/coroa9.png',
    title: 'Coroa de Rosas',
    description:
      'Uma homenagem respeitosa com rosas selecionadas para expressar carinho.',
    price: 'R$ 450,00',
  },
  {
    id: 10,
    image: '/coroa10.png',
    title: 'Coroa de Rosas',
    description:
      'Uma homenagem respeitosa com rosas selecionadas para expressar carinho.',
    price: 'R$ 450,00',
  },
  {
    id: 11,
    image: '/coroa11.png',
    title: 'Coroa de Flores do Campo',
    description:
      'Uma homenagem respeitosa com flores do campo selecionadas para expressar carinho.',
    price: 'R$ 400,00',
  },
  {
    id: 12,
    image: '/coroa12.png',
    title: 'Coroa de Flores do Campo',
    description:
      'Uma homenagem respeitosa com flores do campo selecionadas para expressar carinho.',
    price: 'R$ 400,00',
  },
  {
    id: 13,
    image: '/coroa14.png',
    title: 'Coroa de Flores do Campo',
    description:
      'Uma homenagem respeitosa com flores do campo selecionadas para expressar carinho.',
    price: 'R$ 400,00',
  },
  {
    id: 14,
    image: '/coroa15.png',
    title: 'Coroa de Flores do Campo',
    description:
      'Uma homenagem respeitosa com flores do campo selecionadas para expressar carinho.',
    price: 'R$ 400,00',
  },
  {
    id: 15,
    image: '/coroa17.png',
    title: 'Coroa de Flores do Campo',
    description:
      'Uma homenagem respeitosa com flores do campo selecionadas para expressar carinho.',
    price: 'R$ 400,00',
  },
  {
    id: 16,
    image: '/coroa19.png',
    title: 'Coroa de Flores do Campo',
    description:
      'Uma homenagem respeitosa com flores do campo selecionadas para expressar carinho.',
    price: 'R$ 400,00',
  },
  {
    id: 17,
    image: '/coroa20.png',
    title: 'Coroa de Flores do Campo',
    description:
      'Uma homenagem respeitosa com flores do campo selecionadas para expressar carinho.',
    price: 'R$ 400,00',
  },
]

function Coroas() {

    const { addToCart } = useCart()
const navigate = useNavigate()

  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState('right')

 const handleComprar = (coroa) => {
  addToCart({
    id: coroa.id,
    name: coroa.title,
    price: coroa.price,
    image: coroa.image,
    description: coroa.description,
    category: 'CoroasdeRosas',
  })

  navigate('/loja')
}


  const prevCoroa = () => {
    setDirection('left')
    setCurrentIndex((prev) =>
      prev === 0 ? coroasData.length - 1 : prev - 1
    )
  }

  const nextCoroa = () => {
    setDirection('right')
    setCurrentIndex((prev) =>
      prev === coroasData.length - 1 ? 0 : prev + 1
    )
  }

  const coroa = coroasData[currentIndex]

  return (
    <section className="coroas">
      <h3>Coroas de Flores</h3>

      <div className="combo-stage">
        <button className="arrow left" onClick={prevCoroa}>
          ‹
        </button>

        <div className="combo-slide-wrapper">
          <div
            key={`${currentIndex}-${direction}`}
            className={`combo-slide ${direction}`}
          >
            <img
              src={coroa.image}
              alt={coroa.title}
              className="combo-image"
            />
          </div>
        </div>

        <button className="arrow right" onClick={nextCoroa}>
          ›
        </button>
      </div>

      <div className="combo-info">
        <h4>{coroa.title}</h4>
        <p>{coroa.description}</p>

        <div className="combo-actions">
          <span className="price">{coroa.price}</span>

          <button
  className="combo-buy"
  onClick={() => handleComprar(coroa)}
>
  Comprar
</button>

        </div>
      </div>
    </section>
  )
}

export default Coroas
