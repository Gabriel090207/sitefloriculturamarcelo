import './Loja.css'
import { useCart } from '../context/CartContext'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useState } from 'react'




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
   {
    id: 11,
    name: 'Coroa de Rosas',
    description: 'Uma homenagem respeitosa com rosas selecionadas para expressar carinho.',
    price: 'R$ 400,00',
    image: '/coroa1.png',
     category: 'CoroasdeRosas',
  },
  {
    id: 12,
    name: 'Coroa de Rosas',
    description: 'Uma homenagem respeitosa com rosas selecionadas para expressar carinho.',
    price: 'R$ 400,00',
    image: '/coroa2.png',
     category: 'CoroasdeRosas',
  },
   {
    id: 13,
    name: 'Coroa de Rosas',
    description: 'Uma homenagem respeitosa com rosas selecionadas para expressar carinho.',
    price: 'R$ 400,00',
    image: '/coroa3.png',
     category: 'CoroasdeRosas',
  },
    {
    id: 14,
    name: 'Coroa de Rosas',
    description: 'Uma homenagem respeitosa com rosas selecionadas para expressar carinho.',
    price: 'R$ 400,00',
    image: '/coroa4.png',
     category: 'CoroasdeRosas',
  },
  {
    id: 15,
    name: 'Coroa de Rosas',
    description: 'Uma homenagem respeitosa com rosas selecionadas para expressar carinho.',
    price: 'R$ 400,00',
    image: '/coroa5.png',
     category: 'CoroasdeRosas',
  },
  {
    id: 16,
    name: 'Coroa de Rosas',
    description: 'Uma homenagem respeitosa com rosas selecionadas para expressar carinho.',
    price: 'R$ 400,00',
    image: '/coroa6.png',
     category: 'CoroasdeRosas',
  },
  {
    id: 17,
    name: 'Coroa de Rosas',
    description: 'Uma homenagem respeitosa com rosas selecionadas para expressar carinho.',
    price: 'R$ 400,00',
    image: '/coroa7.png',
     category: 'CoroasdeRosas',
  },
  {
    id: 18,
    name: 'Coroa de Rosas',
    description: 'Uma homenagem respeitosa com rosas selecionadas para expressar carinho.',
    price: 'R$ 400,00',
    image: '/coroa8.png',
     category: 'CoroasdeRosas',
  },
  {
    id: 19,
    name: 'Coroa de Rosas',
    description: 'Uma homenagem respeitosa com rosas selecionadas para expressar carinho.',
    price: 'R$ 400,00',
    image: '/coroa9.png',
     category: 'CoroasdeRosas',
  },
  {
    id: 20,
    name: 'Coroa de Rosas',
    description: 'Uma homenagem respeitosa com rosas selecionadas para expressar carinho.',
    price: 'R$ 400,00',
    image: '/coroa10.png',
     category: 'CoroasdeRosas',
  },
   {
    id: 21,
    name: 'Coroa de Flores do Campo',
    description: 'Uma homenagem respeitosa com flores do campo selecionadas para expressar carinho.',
    price: 'R$ 370,00',
    image: '/coroa11.png',
     category: 'CoroasdeCampo',
  },
{
    id: 22,
    name: 'Coroa de Flores do Campo',
    description: 'Uma homenagem respeitosa com flores do campo selecionadas para expressar carinho.',
    price: 'R$ 370,00',
    image: '/coroa12.png',
     category: 'CoroasdeCampo',
  },
  {
    id: 23,
    name: 'Coroa de Flores do Campo',
    description: 'Uma homenagem respeitosa com flores do campo selecionadas para expressar carinho.',
    price: 'R$ 370,00',
    image: '/coroa13.png',
     category: 'CoroasdeCampo',
  },
  {
    id: 24,
    name: 'Coroa de Flores do Campo',
    description: 'Uma homenagem respeitosa com flores do campo selecionadas para expressar carinho.',
    price: 'R$ 370,00',
    image: '/coroa14.png',
     category: 'CoroasdeCampo',
  },
  {
    id: 25,
    name: 'Coroa de Flores do Campo',
    description: 'Uma homenagem respeitosa com flores do campo selecionadas para expressar carinho.',
    price: 'R$ 370,00',
    image: '/coroa15.png',
     category: 'CoroasdeCampo',
  },
  {
    id: 26,
    name: 'Coroa de Flores do Campo',
    description: 'Uma homenagem respeitosa com flores do campo selecionadas para expressar carinho.',
    price: 'R$ 370,00',
    image: '/coroa16.png',
     category: 'CoroasdeCampo',
  },
  {
    id: 27,
    name: 'Coroa de Flores do Campo',
    description: 'Uma homenagem respeitosa com flores do campo selecionadas para expressar carinho.',
    price: 'R$ 370,00',
    image: '/coroa17.png',
     category: 'CoroasdeCampo',
  },
  {
    id: 28,
    name: 'Coroa de Flores do Campo',
    description: 'Uma homenagem respeitosa com flores do campo selecionadas para expressar carinho.',
    price: 'R$ 370,00',
    image: '/coroa18.png',
     category: 'CoroasdeCampo',
  },
  {
    id: 29,
    name: 'Coroa de Flores do Campo',
    description: 'Uma homenagem respeitosa com flores do campo selecionadas para expressar carinho.',
    price: 'R$ 370,00',
    image: '/coroa19.png',
     category: 'CoroasdeCampo',
  },
  {
    id: 30,
    name: 'Coroa de Flores do Campo',
    description: 'Uma homenagem respeitosa com flores do campo selecionadas para expressar carinho.',
    price: 'R$ 370,00',
    image: '/coroa20.png',
     category: 'CoroasdeCampo',
  },

]

function Loja() {

  const [categoriaAtiva, setCategoriaAtiva] = useState('Todos')


  const location = useLocation()
  const { clearCart } = useCart()





  const { addToCart } = useCart()

  const produtosFiltrados =
  categoriaAtiva === 'Todos'
    ? produtos
    : produtos.filter(
        (produto) => produto.category === categoriaAtiva
      )


  return (
    <section className="loja">



      

      <div className="loja-layout">
        {/* SIDEBAR */}
        <aside className="loja-sidebar">
          <h4>Categorias</h4>
         <ul>
  <li onClick={() => setCategoriaAtiva('Todos')}>Todos</li>
  <li onClick={() => setCategoriaAtiva('Buquês')}>Buquês</li>
  <li onClick={() => setCategoriaAtiva('Arranjos')}>Arranjos</li>
  <li onClick={() => setCategoriaAtiva('Cestas & Combos')}>Cestas & Combos</li>
  <li onClick={() => setCategoriaAtiva('CoroasdeRosas')}>Coroas de Rosas</li>
   <li onClick={() => setCategoriaAtiva('CoroasdeCampo')}>Coroas Flores do Campo</li>
  <li onClick={() => setCategoriaAtiva('Datas Especiais')}>Datas Especiais</li>
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
        <div
  className="produtos-grid"
  key={categoriaAtiva}
>

          {produtosFiltrados.map((produto, index) => (


           <div
  className="produto-card"
  key={produto.id}
  style={{ animationDelay: `${index * 60}ms` }}
>

              <img src={produto.image} alt={produto.name} />
              <h3>{produto.name}</h3>
              <p>{produto.description}</p>
              <strong>{produto.price}</strong>
              <div className="produto-actions">
 <button
  className="btn-comprar"
  onClick={() => addToCart(produto)}
>
  Por no Carrinho
</button>

  <button className="btn-detalhes">Detalhes</button>
</div>

            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Loja
