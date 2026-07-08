import './TotemHeader.css'
import logo from '../../assets/logo.png'

function TotemHeader() {
  return (
    <header className="totem-header">
      <div className="totem-header-logo">
        <img
          src={logo}
          alt="Valle das Flores"
          className="totem-logo"
        />
      </div>

      <div className="totem-header-actions">
        <a
          href="https://wa.me/559295131313"
          target="_blank"
          rel="noopener noreferrer"
          className="totem-whatsapp"
        >
          <i className="fa-brands fa-whatsapp"></i>

          <div className="totem-whatsapp-text">
            <span>Atendimento 24 Horas</span>
           
          </div>
        </a>
      </div>
    </header>
  )
}

export default TotemHeader