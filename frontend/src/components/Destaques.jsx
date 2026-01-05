import './Destaques.css'

function Destaques() {
  return (
    <section className="destaques">
      <h3>Destaques da Semana</h3>

      <div className="cards">
        <div className="card">
          <img src="/placeholder.jpg" alt="Buquê Romântico" />
          <div className="card-content">
            <h4>Buquê Romântico</h4>
            <p>Um gesto delicado para quem você ama.</p>
            <span className="price">R$ 129,90</span>
            <button>Comprar</button>
          </div>
        </div>

        <div className="card">
          <img src="/placeholder.jpg" alt="Cesta Especial" />
          <div className="card-content">
            <h4>Cesta Especial</h4>
            <p>Surpreenda com carinho e elegância.</p>
            <span className="price">R$ 189,90</span>
            <button>Comprar</button>
          </div>
        </div>

        <div className="card">
          <img src="/placeholder.jpg" alt="Arranjo Floral" />
          <div className="card-content">
            <h4>Arranjo Floral</h4>
            <p>Beleza natural para qualquer ocasião.</p>
            <span className="price">R$ 99,90</span>
            <button>Comprar</button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Destaques
