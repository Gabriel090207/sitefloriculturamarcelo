import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div>
          <h4>Valle das Flores</h4>
          <p>
            Transformando sentimentos em flores, com carinho, qualidade e beleza em cada detalhe.
          </p>
        </div>

        <div>
          <h4>Institucional</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/loja">Loja</a></li>
            <li><a href="/sobre">Sobre</a></li>
            <li><a href="/contato">Contato</a></li>
          </ul>
        </div>

        <div className="footer-contact">
          <h4>Contato</h4>
          <p><i className="fas fa-map-marker-alt"></i> Rua das Flores, 123 – Centro</p>
          <p><i className="fas fa-phone"></i> (99) 99999-9999</p>
          <p><i className="fas fa-envelope"></i> contato@valledasflores.com</p>
        </div>

      </div>

      <div className="footer-bottom">
        © 2026 Valle das Flores — Todos os direitos reservados
      </div>
    </footer>
  )
}

export default Footer
