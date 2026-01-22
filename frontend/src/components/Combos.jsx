import { useState } from 'react'
import './Combos.css'
import { useCart } from '../context/CartContext'
import { useNavigate } from 'react-router-dom'


const combosData = [
  {
    id: 1,
    image: '/combosemfundo1.png',
    title: 'Combo Beijinho de Natal',
    description: 'Os melhores beijos são sempre em eventos especiais.',
    price: 'R$ 119,00',
  },
  {
    id: 2,
    image: '/combosemfundo2.png',
    title: 'Combo Magia de Natal',
    description: 'Trazendo a magia que só o Natal pode oferecer.',
    price: 'R$ 89,99',
  },
  {
    id: 3,
    image: '/combosemfundo3.png',
    title: 'Combo Feliz Natal',
    description: 'Desejando a todos uma explosão de emoções nessa data especial.',
    price: 'R$ 29,99',
  },
  {
    id: 4,
    image: '/combosemfundo4.png',
    title: 'Combo Apego Delicado',
    description: 'Demonstrando sempre querer ficar perto de você.',
    price: 'R$ 69,99',
  },
  {
    id: 5,
    image: '/combosemfundo5.png',
    title: 'Combo Doce Afago',
    description: 'Carinho e amor não se explicam, apenas se sente.',
    price: 'R$ 169,99',
  },
  {
    id: 6,
    image: '/combosemfundo6.png',
    title: 'Combo Cheirinho de Natal',
    description: 'Nas menores caixas vêm sempre os melhores sentimentos.',
    price: 'R$ 19,99',
  },
  {
    id: 7,
    image: '/combosemfundo7.png',
    title: 'Combo Natal em Família',
    description: 'Trazendo para essa data um significado ainda mais especial.',
    price: 'R$ 149,99',
  },
  {
    id: 8,
    image: '/combosemfundo8.png',
    title: 'Combo Tudo Meu',
    description: 'Não deixando de mimar aquela pessoa que você tanto adora.',
    price: 'R$ 89,99',
  },
  {
    id: 9,
    image: '/combosemfundo9.png',
    title: 'Combo Luz e Alegria',
    description: 'Iluminando a vida daqueles que nos são especiais.',
    price: 'R$ 79,99',
  },
  {
    id: 10,
    image: '/combosemfundo11.png',
    title: 'Combo Fofura Natalina',
    description: 'Um presente doce e especial.',
    price: 'R$ 89,99',
  },
  {
    id: 11,
    image: '/combosemfundo12.png',
    title: 'Cesta Encantada',
    description: 'Quando o amor não consegue ser expressado apenas com palavras.',
    price: 'R$ 119,99',
  },
  {
    id: 12,
    image: '/combo13semfundo.png',
    title: 'Cesta Boas Festas',
    description: 'Começando o dia de quem a gente ama totalmente especial.',
    price: 'R$ 149,99',
  },
  {
    id: 13,
    image: '/combosemfundo14.png',
    title: 'Combo Aroma de Natal',
    description:
      'Sinta a fragrância do carinho que será entregue nessa data tão especial.',
    price: 'R$ 139,99',
  },
]

function Combos() {

  const { addToCart } = useCart()
const navigate = useNavigate()


 const handleComprar = (combo) => {
  addToCart({
    id: combo.id,
    name: combo.title,
    price: combo.price,
    image: combo.image,
    description: combo.description,
    category: 'Cestas & Combos',
  })

  navigate('/loja')
}


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
    <section className="combos" id="combos">

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

  <div className="combo-actions">
    <span className="price">{combo.price}</span>

   <button
  className="combo-buy"
  onClick={() => handleComprar(combo)}
>
  Comprar
</button>

  </div>
</div>

    </section>
  )
}

export default Combos
