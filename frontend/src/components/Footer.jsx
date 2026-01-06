import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* SOBRE */}
        <div className="footer-about">
          <h4>Valle das Flores</h4>
          <p>
          A Valle das Flores nasceu do carinho pelos detalhes e do desejo de transformar sentimentos em experiências inesquecíveis. Trabalhamos com flores frescas e arranjos cuidadosamente pensados para transmitir emoções verdadeiras. Cada pedido é preparado com dedicação, tornando cada entrega única e especial.
          </p>
        </div>

        {/* INSTITUCIONAL */}
        <div className="footer-links">
          <h4>Institucional</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/loja">Loja</a></li>
            <li><a href="/sobre">Sobre</a></li>
            <li><a href="/contato">Contato</a></li>
          </ul>
        </div>

        {/* CONTATO */}
        <div className="footer-contact">
          <h4>Contato</h4>

          <p>
            <i className="fa-solid fa-location-dot"></i>
            Rua das Flores, 123 – Centro
          </p>

          <p>
            <i className="fa-solid fa-phone"></i>
            (99) 99999-9999
          </p>

          <p>
            <i className="fa-solid fa-envelope"></i>
            contato@valledasflores.com
          </p>
        </div>

        {/* REDES SOCIAIS */}
        <div className="footer-social-column">
          <h4>Redes sociais</h4>

          <div className="footer-social">
            <a href="#" aria-label="Instagram">
              <i className="fa-brands fa-instagram"></i>
            </a>
            <a href="#" aria-label="Facebook">
              <i className="fa-brands fa-facebook-f"></i>
            </a>
            <a href="#" aria-label="WhatsApp">
              <i className="fa-brands fa-whatsapp"></i>
            </a>
          </div>
        </div>

      </div>

      {/* COPYRIGHT */}
      <div className="footer-bottom">
        © 2026 Valle das Flores — Todos os direitos reservados
      </div>
    </footer>
  )
}

export default Footer
