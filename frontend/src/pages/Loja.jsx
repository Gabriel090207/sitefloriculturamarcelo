import './Loja.css'
import { FiShoppingCart } from 'react-icons/fi'


const produtos = [
  {
    id: 1,
    name: 'Buquê Romântico',
    description: 'Um gesto delicado para quem você ama.',
    price: 'R$ 129,90',
    image: '/buque1.png',
  },
  {
    id: 2,
    name: 'Buquê Romântico',
    description: 'Um gesto delicado para quem você ama.',
    price: 'R$ 129,90',
    image: '/buque2.png',
  },
  {
    id: 3,
    name: 'Buquê Romântico',
    description: 'Um gesto delicado para quem você ama.',
    price: 'R$ 129,90',
    image: '/buque3.png',
  },
  {
    id: 4,
    name: 'Buquê Romântico',
    description: 'Um gesto delicado para quem você ama.',
    price: 'R$ 129,90',
    image: '/buque4.png',
  },
  {
    id: 5,
    name: 'Buquê Romântico',
    description: 'Um gesto delicado para quem você ama.',
    price: 'R$ 129,90',
    image: '/buque5.png',
  },
  {
    id: 6,
    name: 'Buquê Romântico',
    description: 'Um gesto delicado para quem você ama.',
    price: 'R$ 129,90',
    image: '/buque6.png',
  },
  {
    id: 7,
    name: 'Buquê Romântico',
    description: 'Um gesto delicado para quem você ama.',
    price: 'R$ 129,90',
    image: '/buque7.png',
  },
  {
    id: 8,
    name: 'Buquê Romântico',
    description: 'Um gesto delicado para quem você ama.',
    price: 'R$ 129,90',
    image: '/buque8.png',
  },
  {
    id: 9,
    name: 'Buquê Romântico',
    description: 'Um gesto delicado para quem você ama.',
    price: 'R$ 129,90',
    image: '/buque9.png',
  },
  {
    id: 10,
    name: 'Buquê Romântico',
    description: 'Um gesto delicado para quem você ama.',
    price: 'R$ 129,90',
    image: '/buque10.png',
  },
]

function Loja() {
  return (
    <section className="loja">

<section className="loja-banner">
<div className="logo-text">

  <span className="logo-nome">Valle das Flores</span>


  <button className="cart-button">
  <FiShoppingCart size={38} />
</button>
</div>

</section>

      

      <div className="loja-layout">
        {/* SIDEBAR */}
        <aside className="loja-sidebar">
          <h4>Categorias</h4>
          <ul>
            <li>Buquês</li>
            <li>Arranjos</li>
            <li>Cestas & Combos</li>
            <li>Coroas</li>
            <li>Datas Especiais</li>
          </ul>

          <h4>Ocasiões</h4>
          <ul>
            <li>Aniversário</li>
            <li>Romântico</li>
            <li>Agradecimento</li>
            <li>Condolências</li>
          </ul>
        </aside>

        {/* PRODUTOS */}
        <div className="produtos-grid">
          {produtos.map((produto) => (
            <div className="produto-card" key={produto.id}>
              <img src={produto.image} alt={produto.name} />
              <h3>{produto.name}</h3>
              <p>{produto.description}</p>
              <strong>{produto.price}</strong>
              <div className="produto-actions">
  <button className="btn-comprar">Comprar</button>
  <button className="btn-detalhes">Ver detalhes</button>
</div>

            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Loja
