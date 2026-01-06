import './Sobre.css'


function Sobre() {
  return (
    <section className="sobre">

      {/* Banner */}
      <div className="sobre-banner">
        <h1>Sobre a Valle das Flores</h1>
        <p>Transformando sentimentos em flores</p>
      </div>

      {/* Conteúdo */}
      <div className="sobre-conteudo">

        <div className="sobre-bloco">
          <h2>Nossa História</h2>
          <p>
            A Floricultura <strong>Valle das Flores</strong> nasceu do amor pela natureza
            e do desejo de transformar sentimentos em flores. Trabalhamos com dedicação
            para oferecer arranjos florais, coroas, buquês e composições cuidadosamente
            selecionadas, sempre prezando pela qualidade, frescor e beleza em cada detalhe.
          </p>
        </div>

        <div className="sobre-bloco">
          <h2>O que fazemos</h2>
          <p>
            Além das opções tradicionais, também trabalhamos com
            <strong> arranjos personalizados</strong>, criados de acordo com o gosto,
            a ocasião e o sentimento que cada cliente deseja transmitir. Cada detalhe
            é pensado com carinho para tornar cada entrega única e especial.
          </p>
        </div>

        <div className="sobre-bloco">
          <h2>Nosso compromisso</h2>
          <p>
            Acreditamos que as flores têm o poder de expressar emoções, marcar momentos
            importantes e levar alegria a quem recebe. Seja para celebrar conquistas,
            surpreender alguém especial ou homenagear momentos inesquecíveis, nosso
            compromisso é oferecer criatividade, bom gosto e excelência em cada criação.
          </p>

          <p>
            Na Valle das Flores, cada cliente é atendido com atenção e sensibilidade,
            garantindo que cada pedido reflita exatamente a emoção desejada.
          </p>
        </div>

      </div>
    </section>

    
  )

  
}

export default Sobre
