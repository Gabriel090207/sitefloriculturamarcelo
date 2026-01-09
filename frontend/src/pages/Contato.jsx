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
            <span>(92) 98123-0907</span>
          </div>

          <div className="contato-item">
            <h4>E-mail</h4>
            <span>floriculturavalledasflores@gmail.com</span>
          </div>

          <div className="contato-item">
            <h4>Instagram</h4>
            <span> @floriculturavalledasflores</span>
          </div>

          <div className="contato-item">
            <h4>Endereço</h4>
            <span>Rua Major Gabriel, 1833 - Centro, Manaus - AM, 692020-060, Brasil.</span>
          </div>
          </div>
        </div>

        {/* CARD DIREITO */}
        <div className="contato-card mapa">
          <iframe
            title="Mapa Valle das Flores"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3983.910672781734!2d-60.0170444!3d-3.1183292!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x926c055cfe2fffff%3A0xe20c1eb995da6a12!2sR.%20Maj.%20Gabriel%2C%201833%20-%20Sala%201%20-%20Centro%2C%20Manaus%20-%20AM%2C%2069020-060!5e0!3m2!1spt-BR!2sbr!4v1767971616268!5m2!1spt-BR!2sbr"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  )
}

export default Contato


