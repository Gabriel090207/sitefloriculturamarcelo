import './Loja.css'
import { useCart } from '../context/CartContext'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useRef } from 'react'
import { produtos } from '../data/produtos'







function Loja() {


  const sidebarRef = useRef(null)
const produtosRef = useRef(null)


  const [produtoSelecionado, setProdutoSelecionado] = useState(null)


  const [categoriaAtiva, setCategoriaAtiva] = useState(() => {
  return localStorage.getItem('categoriaAtiva') || 'Todos'
})

useEffect(() => {
  localStorage.setItem('categoriaAtiva', categoriaAtiva)
}, [categoriaAtiva])

useEffect(() => {
  const sidebar = sidebarRef.current
  const produtos = produtosRef.current

  if (!sidebar || !produtos) return

  const onScroll = () => {
    const sidebarRect = sidebar.getBoundingClientRect()
    const produtosRect = produtos.getBoundingClientRect()

    const offsetTop = 160
    const limiteInferior =
      produtosRect.bottom - sidebar.offsetHeight - offsetTop

    if (produtosRect.top <= offsetTop && limiteInferior > 0) {
      sidebar.style.position = 'fixed'
      sidebar.style.top = `${offsetTop}px`
    } else if (limiteInferior <= 0) {
      sidebar.style.position = 'absolute'
      sidebar.style.top = `${produtos.offsetHeight - sidebar.offsetHeight}px`
    } else {
      sidebar.style.position = 'static'
    }
  }

  window.addEventListener('scroll', onScroll)
  return () => window.removeEventListener('scroll', onScroll)
}, [])



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
          <div className="loja-sidebar-wrapper">
        {/* SIDEBAR */}
        <aside ref={sidebarRef} className="loja-sidebar">
          <h4>Categorias</h4>
         <ul>
  <li
    className={categoriaAtiva === 'Todos' ? 'active' : ''}
    onClick={() => setCategoriaAtiva('Todos')}
  >
    Todos
  </li>

  <li
    className={categoriaAtiva === 'Buquês' ? 'active' : ''}
    onClick={() => setCategoriaAtiva('Buquês')}
  >
    Buquês
  </li>

  <li
    className={categoriaAtiva === 'Arranjos' ? 'active' : ''}
    onClick={() => setCategoriaAtiva('Arranjos')}
  >
    Arranjos
  </li>

  <li
    className={categoriaAtiva === 'Cestas & Combos' ? 'active' : ''}
    onClick={() => setCategoriaAtiva('Cestas & Combos')}
  >
    Combos Especiais
  </li>

  <li
    className={categoriaAtiva === 'CoroasdeRosas' ? 'active' : ''}
    onClick={() => setCategoriaAtiva('CoroasdeRosas')}
  >
    Coroas de Rosas
  </li>

  <li
    className={categoriaAtiva === 'CoroasdeCampo' ? 'active' : ''}
    onClick={() => setCategoriaAtiva('CoroasdeCampo')}
  >
    Coroas Flores do Campo
  </li>

  <li
    className={categoriaAtiva === 'Datas Especiais' ? 'active' : ''}
    onClick={() => setCategoriaAtiva('Datas Especiais')}
  >
    Datas Especiais
  </li>
</ul>



        </aside>
        </div>

        {/* PRODUTOS */}
        <div
        ref={produtosRef}
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

<button
  className="btn-detalhes"
  onClick={() => setProdutoSelecionado(produto)}
>
  Detalhes
</button>

</div>

            </div>
          ))}
        </div>
      </div>

      {produtoSelecionado && (
  <div className="produto-detalhe-overlay">
    <div className="produto-detalhe-card">
      <button
        className="produto-detalhe-close"
        onClick={() => setProdutoSelecionado(null)}
      >
        ✕
      </button>

      <img
        src={produtoSelecionado.image}
        alt={produtoSelecionado.name}
        className="produto-detalhe-img"
      />

      <h3>{produtoSelecionado.name}</h3>

      <p className="produto-detalhe-desc">
        {produtoSelecionado.details}
      </p>

      <div className="produto-detalhe-info">
        <div>
          <strong>Quantidade de flores</strong>
          <span>{produtoSelecionado.flowersQty}</span>
        </div>

        <div>
          <strong>Tempo de produção</strong>
          <span>{produtoSelecionado.productionTime}</span>
        </div>
      </div>
    </div>
  </div>
)}

    </section>
  )
}

export default Loja
