import { useState, useRef } from 'react'
import html2canvas from 'html2canvas'


import './MonteSeuBuque.css'

function MonteSeuBuque() {

  const buqueRef = useRef(null)

  // estados (por enquanto só 1 opção cada)
  const [flor, setFlor] = useState('flor-base')
  const [plantinha, setPlantinha] = useState('mosquitinho')
  const [vaso, setVaso] = useState('vaso-base')
  const [quantidade, setQuantidade] = useState(1)


  const flores = [
  { id: 'flor-base', nome: 'Rosa Azul' },
  { id: 'rosa-vermelha', nome: 'Rosa Vermelha' }
]

const plantinhas = [
  { id: 'mosquitinho', nome: 'Mosquitinho' },
  { id: 'eucalipto', nome: 'Eucalipto' }
]

const vasos = [
  { id: 'vaso-base', nome: 'Base padrão' },
  { id: 'vaso-vidro', nome: 'Vaso de vidro' }
]

const quantidades = [1, 3, 6, 8, 10, 12]


const posicoesFlores = {
  1: [
    { top: '20%', left: '50%', scale: 3 }
  ],
  3: [
    { top: '18%', left: '40%', scale: 2 },
    { top: '16%', left: '60%', scale: 2 },
    { top: '26%', left: '50%', scale: 2 }
  ],
  6: [
    { top: '14%', left: '25%', scale: 2 },
    { top: '11%', left: '55%', scale: 2 },
    { top: '14%', left: '85%', scale: 2 },
    { top: '26%', left: '40%', scale: 2 },
    { top: '26%', left: '70%', scale: 2 },
    { top: '39%', left: '55%', scale: 2 }
  ],
  8: [
    { top: '14%', left: '25%', scale: 2 },
    { top: '11%', left: '55%', scale: 2 },
    { top: '14%', left: '85%', scale: 2 },
    { top: '26%', left: '46%', scale: 2 },
    { top: '26%', left: '64%', scale: 2 },
    { top: '39%', left: '55%', scale: 2 },
    { top: '19%', left: '74%', scale: 2 },
    { top: '19%', left: '37%', scale: 2 }
  ],
   10: [
    { top: '14%', left: '25%', scale: 2 },
    { top: '11%', left: '55%', scale: 2 },
    { top: '14%', left: '85%', scale: 2 },
    { top: '26%', left: '40%', scale: 2 },
    { top: '26%', left: '70%', scale: 2 },
    { top: '39%', left: '55%', scale: 2 },
    
  ],
    12: [
    { top: '14%', left: '25%', scale: 2 },
    { top: '11%', left: '55%', scale: 2 },
    { top: '14%', left: '85%', scale: 2 },
    { top: '26%', left: '40%', scale: 2 },
    { top: '26%', left: '70%', scale: 2 },
    { top: '39%', left: '55%', scale: 2 }
  ]
}



  const handleWhatsApp = () => {
    const phoneNumber = '5516999999999'

    const message = `
Olá! Gostaria de montar um buquê personalizado 🌸

• Flor: Rosa azul
• Plantinha: Mosquitinho
• Vaso: Base padrão

Aguardo para finalizar 😊
    `

    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`

    window.open(url, '_blank')
  }


  const handleFinalizarWhatsApp = async () => {
  const phoneNumber = '5516994287026'

  // GERA IMAGEM DO BUQUÊ

  // NOME BONITO DAS OPÇÕES
  const florSelecionada = flores.find(f => f.id === flor)?.nome
  const plantinhaSelecionada = plantinhas.find(p => p.id === plantinha)?.nome
  const vasoSelecionado = vasos.find(v => v.id === vaso)?.nome

let message = `Olá! Gostaria de fazer um pedido.\n\n`
message += `Pedido via site – Valle das Flores\n\n`

message += `• Buquê Personalizado\n`
message += `  Flor: ${florSelecionada}\n`
message += `  Plantinha: ${plantinhaSelecionada}\n`
message += `  Vaso: ${vasoSelecionado}\n`
message += `  Quantidade de flores: ${quantidade}\n\n`

message += `Buquê montado pelo cliente no site.\n`
message += `Imagem disponível para conferência.\n\n`

message += `Aguardo orientações para finalizar.\nObrigado(a)!`

  const encodedMessage = encodeURIComponent(message)
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`

  window.open(whatsappUrl, '_blank')
}


  return (
    <section className="monte-buque-page monte-buque-enter">


     <div className="monte-buque-header monte-buque-enter" style={{ animationDelay: '0ms' }}>

  <h2>Monte seu buquê</h2>

  <button
    className="btn-whatsapp"
    onClick={handleFinalizarWhatsApp}
  >
    Finalizar pedido
  </button>
</div>

      {/* PREVIEW */}
     <div className="buque-preview monte-buque-enter" style={{ animationDelay: '80ms' }} ref={buqueRef}>


  <img
    className="camada-vaso"
    src={`/buque/vaso/${vaso}.png`}
    alt="Vaso"
  />

  <img
    className="camada-plantinha"
    src={`/buque/plantinha/${plantinha}.png`}
    alt="Plantinha"
  />

 {posicoesFlores[quantidade].map((pos, index) => (
  <img
    key={index}
    className="camada-flor flor-item"
    src={`/buque/flor/${flor}.png`}
    alt="Flor"
    style={{
      top: pos.top,
      left: pos.left,
      transform: `translateX(-50%) scale(${pos.scale})`
    }}
  />
))}


</div>


      {/* OPÇÕES */}
    <div className="buque-options grid-opcoes monte-buque-enter" style={{ animationDelay: '160ms' }}>

  {/* VASO */}
  <div className="option-group">
    <h4>Vaso</h4>
    <div className="option-buttons vertical">
      {vasos.map((item) => (
        <button
          key={item.id}
          className={vaso === item.id ? 'active' : ''}
          onClick={() => setVaso(item.id)}
        >
          {item.nome}
        </button>
      ))}
    </div>
  </div>

  {/* PLANTINHA */}
  <div className="option-group">
    <h4>Plantinha</h4>
    <div className="option-buttons vertical">
      {plantinhas.map((item) => (
        <button
          key={item.id}
          className={plantinha === item.id ? 'active' : ''}
          onClick={() => setPlantinha(item.id)}
        >
          {item.nome}
        </button>
      ))}
    </div>
  </div>

  {/* FLOR */}
  <div className="option-group">
    <h4>Flor</h4>
    <div className="option-buttons vertical">
      {flores.map((item) => (
        <button
          key={item.id}
          className={flor === item.id ? 'active' : ''}
          onClick={() => setFlor(item.id)}
        >
          {item.nome}
        </button>
      ))}
    </div>
  </div>

  {/* QUANTIDADE */}
  <div className="option-group">
    <h4>Quantidade</h4>
    <div className="option-buttons vertical">
      {quantidades.map((qtd) => (
        <button
          key={qtd}
          className={quantidade === qtd ? 'active' : ''}
          onClick={() => setQuantidade(qtd)}
        >
          {qtd}
        </button>
      ))}
    </div>
  </div>
</div>


  

    </section>
  )
}

export default MonteSeuBuque
