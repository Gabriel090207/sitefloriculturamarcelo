import './Contato.css'

function Contato() {
  return (
    <section className="contato-page">
      <h2 className="contato-title">Entre em contato</h2>

      <div className="contato-layout">

      <div className="contato-container">
        {/* CARD ESQUERDO */}
        <div className="contato-card info">
          <div className="contato-item">
            <h4>Telefone</h4>
            <span>(16) 99999-9999</span>
          </div>

          <div className="contato-item">
            <h4>E-mail</h4>
            <span>contato@valledasflores.com</span>
          </div>

          <div className="contato-item">
            <h4>Instagram</h4>
            <span>@valledasflores</span>
          </div>

          <div className="contato-item">
            <h4>Endereço</h4>
            <span>Rua das Flores, 123 – Centro</span>
          </div>
          </div>
        </div>

        {/* CARD DIREITO */}
        <div className="contato-card mapa">
          <iframe
            title="Mapa Valle das Flores"
            src="https://www.google.com/maps?q=Rua%20das%20Flores%20123&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  )
}

export default Contato
