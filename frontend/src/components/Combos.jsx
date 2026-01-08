import { useState } from 'react'
import './Combos.css'

const combosData = [
  {
    id: 1,
    image: '/combosemfundo1.png',
    title: 'Combo Amor Perfeito',
    description: 'Flores selecionadas + chocolate + pelúcia.',
    price: 'R$ 249,90',
  },
  {
    id: 2,
    image: '/combosemfundo2.png',
    title: 'Combo Encanto Floral',
    description: 'Arranjo especial para surpreender.',
    price: 'R$ 199,90',
  },
  {
    id: 3,
    image: '/combosemfundo3.png',
    title: 'Combo Doce Carinho',
    description: 'Flores delicadas + chocolates finos.',
    price: 'R$ 219,90',
  },
  {
    id: 4,
    image: '/combosemfundo4.png',
    title: 'Combo Doce Carinho',
    description: 'Flores delicadas + chocolates finos.',
    price: 'R$ 219,90',
  },
  {
    id: 5,
    image: '/combosemfundo5.png',
    title: 'Combo Doce Carinho',
    description: 'Flores delicadas + chocolates finos.',
    price: 'R$ 219,90',
  },
  {
    id: 6,
    image: '/combosemfundo6.png',
    title: 'Combo Doce Carinho',
    description: 'Flores delicadas + chocolates finos.',
    price: 'R$ 219,90',
  },
  {
    id: 7,
    image: '/combosemfundo7.png',
    title: 'Combo Doce Carinho',
    description: 'Flores delicadas + chocolates finos.',
    price: 'R$ 219,90',
  },
  {
    id: 8,
    image: '/combosemfundo8.png',
    title: 'Combo Doce Carinho',
    description: 'Flores delicadas + chocolates finos.',
    price: 'R$ 219,90',
  },
  {
    id: 9,
    image: '/combosemfundo9.png',
    title: 'Combo Doce Carinho',
    description: 'Flores delicadas + chocolates finos.',
    price: 'R$ 219,90',
  },
  {
    id: 10,
    image: '/combosemfundo10.png',
    title: 'Combo Doce Carinho',
    description: 'Flores delicadas + chocolates finos.',
    price: 'R$ 219,90',
  },
]

function Combos() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState('right')

  const prevCombo = () => {
    setDirection('left')
    setCurrentIndex((prev) =>
      prev === 0 ? combosData.length - 1 : prev - 1
    )
  }

  const nextCombo = () => {
    setDirection('right')
    setCurrentIndex((prev) =>
      prev === combosData.length - 1 ? 0 : prev + 1
    )
  }

  const combo = combosData[currentIndex]


  

  return (
    <section className="combos">
      <h3>Combos Especiais</h3>

    <div className="combo-stage">
  <button className="arrow left" onClick={prevCombo}>
    ‹
  </button>

  {/* 🔑 wrapper fixo */}
  <div className="combo-slide-wrapper">
    <div
      key={`${currentIndex}-${direction}`}
      className={`combo-slide ${direction}`}
    >
      <img
        src={combo.image}
        alt={combo.title}
        className="combo-image"
      />
    </div>
  </div>

  <button className="arrow right" onClick={nextCombo}>
    ›
  </button>
</div>


      <div className="combo-info">
        <h4>{combo.title}</h4>
        <p>{combo.description}</p>
        <span className="price">{combo.price}</span>
      </div>
    </section>
  )
}

export default Combos
