import './Sobre.css'

function Pagamento() {
  return (
    <section className="sobre-page">
      <h1 className="sobre-title">Formas de Pagamento</h1>

      <div className="sobre-card">
        <div className="sobre-section">
          <h3>Cartão de crédito e Débito</h3>

          <div className="payment-cards">
            <img src="./public/visa.png" alt="Visa" />
            <img src="./public/mastercard.svg" alt="Mastercard" />
            <img src="./public/american.png" alt="American Express" />
            <img src="./public/elo.png" alt="Elo" />
           
          </div>

          <p>
            Aceitamos cartões de crédito e débito com sistema de criptografia,
            garantindo a proteção dos seus dados e o sigilo de todas as
            transações realizadas em nosso site.
          </p>
        </div>

        <div className="sobre-section">
          <h3>Pix</h3>

          <div className="payment-pix">
            <img src="./public/pix.png" alt="Pix" />
          </div>

          <p>
            Ao finalizar o pedido, você poderá pagar via Pix utilizando
            QR Code ou a opção de Copia e Cola. O pagamento é rápido,
            seguro e aprovado instantaneamente.
          </p>
        </div>

        <div className="sobre-section">
          <h3>Segurança</h3>
          <p>
            Todas as transações realizadas na Valle das Flores são
            protegidas por sistemas de segurança e criptografia,
            garantindo total confidencialidade dos dados dos clientes.
          </p>
        </div>
      </div>
    </section>
  )
}

export default Pagamento
