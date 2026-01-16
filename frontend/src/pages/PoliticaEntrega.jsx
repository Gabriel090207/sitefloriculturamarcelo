import './Sobre.css'

function PoliticaEntrega() {
  return (
    <section className="sobre-page">
      <h1 className="sobre-title">Política de Entrega</h1>

      <div className="sobre-card">
        <div className="sobre-section">
          <p>
            Nossa missão é garantir que seus sentimentos cheguem ao destino
            com frescor, pontualidade e carinho. Ao realizar uma compra em
            nosso site, você concorda com as condições descritas abaixo.
          </p>
        </div>

        <div className="sobre-section">
          <h3>1. Prazos e horários de entrega</h3>
          <p>
            <strong>Entregas no mesmo dia:</strong> Para que a entrega seja
            realizada no mesmo dia, o pedido deve ser confirmado e o pagamento
            aprovado dentro do horário de funcionamento da floricultura.
          </p>
          <p>
            <strong>Períodos de entrega:</strong> As entregas são realizadas
            por períodos (Manhã, Tarde ou Comercial). Não garantimos horários
            exatos, devido a fatores como trânsito, clima e rotas, exceto em
            casos específicos previamente agendados, como cerimônias fúnebres
            ou eventos.
          </p>
          <p>
            <strong>Datas especiais:</strong> Em datas de grande demanda,
            como Dia das Mães, Dia dos Namorados e datas comemorativas,
            os horários podem sofrer variações. Recomendamos o agendamento
            com antecedência mínima de 48 horas.
          </p>
        </div>

        <div className="sobre-section">
          <h3>2. Local de entrega e dados do destinatário</h3>
          <p>
            É de inteira responsabilidade do cliente fornecer corretamente
            todos os dados necessários para a entrega, como endereço completo,
            número, bairro, complemento, ponto de referência e telefone de
            contato do destinatário.
          </p>
          <p>
            Em locais com restrições de acesso, como hospitais, hotéis,
            empresas, condomínios ou órgãos públicos, a entrega será realizada
            na recepção ou portaria, conforme as normas do local.
          </p>
        </div>

        <div className="sobre-section">
          <h3>3. Ausência do destinatário e reenvio</h3>
          <p>
            Realizamos uma tentativa de entrega no endereço informado. Caso
            não haja ninguém para receber ou o acesso seja impedido, tentaremos
            contato com o destinatário ou com o comprador.
          </p>
          <p>
            Se a entrega não puder ser concluída por ausência, dados incorretos
            ou impossibilidade de acesso, o pedido retornará à floricultura.
            Para uma nova tentativa, será cobrada uma nova taxa de entrega.
          </p>
          <p>
            Por se tratar de produtos perecíveis, a Valle das Flores não se
            responsabiliza por eventuais perdas de qualidade caso o reenvio
            seja agendado para outro dia devido à ausência no horário original.
          </p>
        </div>

        <div className="sobre-section">
          <h3>4. Alterações e cancelamentos</h3>
          <p>
            Solicitações de alteração de endereço, mensagem do cartão ou dados
            do pedido devem ser feitas com antecedência, antes do início da
            produção ou da saída para entrega.
          </p>
          <p>
            Cancelamentos com reembolso total somente serão aceitos caso o
            pedido ainda não tenha sido confeccionado ou enviado para entrega.
          </p>
        </div>

        <div className="sobre-section">
          <h3>5. Confirmação de entrega</h3>
          <p>
            Após a conclusão da entrega, o cliente poderá receber uma
            confirmação por WhatsApp ou outro meio de comunicação informado
            no momento da compra.
          </p>
        </div>
      </div>
    </section>
  )
}

export default PoliticaEntrega
