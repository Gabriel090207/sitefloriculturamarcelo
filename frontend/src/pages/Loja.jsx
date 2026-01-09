import './Loja.css'
import { useCart } from '../context/CartContext'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useRef } from 'react'
import { produtos } from '../data/produtos'
import MonteSeuBuque from './MonteSeuBuque'







function Loja() {

  const [modo, setModo] = useState('produtos') 
  const [sidebarAberta, setSidebarAberta] = useState(false)

// 'produtos' | 'buque'



  const sidebarRef = useRef(null)
const produtosRef = useRef(null)


  const [produtoSelecionado, setProdutoSelecionado] = useState(null)


  const [categoriaAtiva, setCategoriaAtiva] = useState(() => {
  return localStorage.getItem('categoriaAtiva') || 'Todos'
})

useEffect(() => {
  if (categoriaAtiva) {
    localStorage.setItem('categoriaAtiva', categoriaAtiva)
  } else {
    localStorage.removeItem('categoriaAtiva')
  }
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


     const irParaCategoria = (categoria) => {
  setModo('produtos')
  setCategoriaAtiva(categoria)
  setSidebarAberta(false)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const irParaMonteBuque = () => {
  setModo('buque')
  setCategoriaAtiva(null)
  setSidebarAberta(false)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}



  return (
    <section className="loja">



      

      <div className="loja-layout">
          <div className="loja-sidebar-wrapper">

           

        {/* SIDEBAR */}
<aside
  ref={sidebarRef}
  className={`loja-sidebar ${sidebarAberta ? 'aberta' : ''}`}
>

  <button
  className="mobile-sidebar-close"
  onClick={() => setSidebarAberta(false)}
>
 ‹
</button>


          <h4>Categorias</h4>
        

        <ul>
  <li
    className={categoriaAtiva === 'Todos' && modo === 'produtos' ? 'active' : ''}
    onClick={() => irParaCategoria('Todos')}
  >
    Todos
  </li>

  <li
    className={categoriaAtiva === 'Buquês' && modo === 'produtos' ? 'active' : ''}
    onClick={() => irParaCategoria('Buquês')}
  >
    Buquês
  </li>

  <li
    className={categoriaAtiva === 'Arranjos' && modo === 'produtos' ? 'active' : ''}
    onClick={() => irParaCategoria('Arranjos')}
  >
    Arranjos
  </li>

  <li
    className={categoriaAtiva === 'Cestas & Combos' && modo === 'produtos' ? 'active' : ''}
    onClick={() => irParaCategoria('Cestas & Combos')}
  >
    Combos Especiais
  </li>

  <li
    className={categoriaAtiva === 'CoroasdeRosas' && modo === 'produtos' ? 'active' : ''}
    onClick={() => irParaCategoria('CoroasdeRosas')}
  >
    Coroas de Rosas
  </li>

  <li
    className={categoriaAtiva === 'CoroasdeCampo' && modo === 'produtos' ? 'active' : ''}
    onClick={() => irParaCategoria('CoroasdeCampo')}
  >
    Coroas Flores do Campo
  </li>

  <li
    className={categoriaAtiva === 'Datas Especiais' && modo === 'produtos' ? 'active' : ''}
    onClick={() => irParaCategoria('Datas Especiais')}
  >
    Datas Especiais
  </li>

  <li
     className={`monte-buque-item ${modo === 'buque' ? 'active' : ''}`}
    onClick={irParaMonteBuque}
  >
    Monte seu buquê →
  </li>
</ul>




        </aside>

     {!sidebarAberta && (
  <button
    className="mobile-sidebar-toggle"
    onClick={() => setSidebarAberta(true)}
  >
    ›
  </button>
)}


        </div>

        {/* PRODUTOS */}
      <div ref={produtosRef}>
  {modo === 'buque' ? (
    <MonteSeuBuque />
  ) : (
    <div className="produtos-grid" key={categoriaAtiva}>
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
  )}
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
