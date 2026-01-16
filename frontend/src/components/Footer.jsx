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

        {/* POLÍTICAS */}
<div className="footer-links">
  <h4>Políticas</h4>
  <ul>
    <li><a href="/politica-de-entrega">Política de Entrega</a></li>
    <li><a href="/pagamento">Formas de Pagamento</a></li>
     <li><a href="/troca-e-devolucao">Troca e Devolução</a></li>
    <li><a href="/politica-de-privacidade">Privacidade e Segurança</a></li>
  </ul>
</div>


       {/* CONTATO + REDES SOCIAIS */}
<div className="footer-contact-group">

  {/* CONTATO */}
  <div className="footer-contact">
    <h4>Contato</h4>

    <p>
      <i className="fa-solid fa-location-dot"></i>
      Rua Major Gabriel, 1833 - Centro, Manaus - AM, 692020-060, Brasil.
    </p>

    <p>
      <i className="fa-solid fa-phone"></i>
      (92) 98123-0907
    </p>

    <p>
      <i className="fa-solid fa-envelope"></i>
      floriculturavalledasflores@gmail.com
    </p>
  </div>

  {/* REDES SOCIAIS */}
  <div className="footer-social-column">
    <h4>Redes sociais</h4>

    <div className="footer-social">
      <a href="https://www.instagram.com/floriculturavalledasflores/" aria-label="Instagram">
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

</div>


      {/* COPYRIGHT */}
      <div className="footer-bottom">
        © 2026 Valle das Flores — Todos os direitos reservados
      </div>
    </footer>
  )
}

export default Footer
