import { useState, useRef, useEffect } from 'react'
import html2canvas from 'html2canvas'


import './MonteSeuBuque.css'

function MonteSeuBuque() {

  const buqueRef = useRef(null)

  // estados (por enquanto só 1 opção cada)
  const [floresSelecionadas, setFloresSelecionadas] = useState(['rosa-azul'])

  const [plantinha, setPlantinha] = useState('mosquitinho')
  const [vaso, setVaso] = useState('vaso-base')
  const [quantidade, setQuantidade] = useState(1)

  const [mensagemFlor, setMensagemFlor] = useState('')


  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)


  const [imagensCarregadas, setImagensCarregadas] = useState(false)


  const toggleFlor = (florId) => {
    setFloresSelecionadas((prev) => {
      // limpa mensagem ao tentar novamente
      setMensagemFlor('')
  
      // remover flor se já estiver selecionada
      if (prev.includes(florId)) {
        return prev.filter((f) => f !== florId)
      }
  
      // 🚫 se quantidade for 1, só pode 1 flor
      if (quantidade === 1 && prev.length === 1) {
        setMensagemFlor('Para 1 flor, é possível escolher apenas uma opção.')
        return prev
      }
  
      // 🚫 se já tiver 2 flores
      if (prev.length === 2) {
        setMensagemFlor('Você pode escolher no máximo 2 tipos de flores.')
        return prev
      }
  
      // adiciona normalmente
      return [...prev, florId]
    })
  }
  
useEffect(() => {
  const handleResize = () => {
    setIsMobile(window.innerWidth <= 768)
  }

  window.addEventListener('resize', handleResize)
  return () => window.removeEventListener('resize', handleResize)
}, [])

useEffect(() => {
  const imagensParaPreload = []

  flores.forEach(f => {
    imagensParaPreload.push(`/buque/flor/${f.id}.png`)
  })

  plantinhas.forEach(p => {
    imagensParaPreload.push(`/buque/plantinha/${p.id}.png`)
  })

  vasos.forEach(v => {
    imagensParaPreload.push(`/buque/vaso/${v.id}.png`)
  })

  let carregadas = 0

  imagensParaPreload.forEach(src => {
    const img = new Image()
    img.src = src
    img.onload = () => {
      carregadas++
      if (carregadas === imagensParaPreload.length) {
        setImagensCarregadas(true)
      }
    }
  })
}, [])


  const flores = [
  { id: 'rosa-azul', nome: 'Rosa Azul' },
  { id: 'rosa-vermelha', nome: 'Rosa Vermelha' },
  { id: 'rosa-branca', nome: 'Rosa Branca' },
  { id: 'rosa-amarela', nome: 'Rosa Amarela' },
  { id: 'rosa-rosa', nome: 'Rosa Rosa' },
  { id: 'girassol', nome: 'Girassol' },
  { id: 'margarida-branca', nome: 'Margarida Branca' },
  { id: 'margarida-azul', nome: 'Margarida Azul' },
  { id: 'margarida-amarela', nome: 'Margarida Amarela' },
  { id: 'margarida-rosa', nome: 'Margarida Rosa' },
  { id: 'astromelia-branca', nome: 'Astromelia Branca' }
]

const plantinhas = [
  { id: 'mosquitinho', nome: 'Mosquitinho' },
  { id: 'samambaia', nome: 'Samambaia' },

]

const vasos = [
   { id: 'vaso-base', nome: 'Vaso Base' },
  { id: 'vaso-aquario', nome: 'Vaso Aquario Escuro' },
  { id: 'vaso-aquarioclaro', nome: 'Vaso Aquario Claro' },
   { id: 'vaso-aquarioefeito', nome: 'Vaso com Estampa' }
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
    { top: '14%', left: '30%', scale: 2 },
    { top: '11%', left: '55%', scale: 2 },
    { top: '18%', left: '65%', scale: 2 },
    { top: '26%', left: '40%', scale: 2 },
    { top: '29%', left: '70%', scale: 2 },
    { top: '39%', left: '50%', scale: 2 },
    { top: '14%', left: '85%', scale: 2 },
    { top: '12%', left: '45%', scale: 2 },
    { top: '12%', left: '75%', scale: 2 },
    { top: '28%', left: '58%', scale: 2 }
    
  ],
    12: [
     { top: '14%', left: '30%', scale: 2 },
    { top: '11%', left: '55%', scale: 2 },
    { top: '18%', left: '65%', scale: 2 },
    { top: '26%', left: '37%', scale: 2 },
    { top: '29%', left: '70%', scale: 2 },
    { top: '39%', left: '50%', scale: 2 },
    { top: '14%', left: '85%', scale: 2 },
    { top: '12%', left: '45%', scale: 2 },
    { top: '12%', left: '75%', scale: 2 },
    { top: '28%', left: '58%', scale: 2 },
    { top: '26%', left: '78%', scale: 2 },
    { top: '25%', left: '48%', scale: 2 }
  ]
}

const posicoesFloresMobile = {
  1: [
    { top: '18%', left: '50%', scale: 2 }
  ],

  3: [
    { top: '14%', left: '42%', scale: 1.7 },
    { top: '12%', left: '68%', scale: 1.7 },
    { top: '22%', left: '57%', scale: 1.7 }
  ],

  6: [
    { top: '16%', left: '30%', scale: 1.6 },
    { top: '18%', left: '50%', scale: 1.6 },
    { top: '20%', left: '70%', scale: 1.6 },
    { top: '22%', left: '40%', scale: 1.6 },
    { top: '22%', left: '60%', scale: 1.6 },
    { top: '28%', left: '50%', scale: 1.6 }
  ],

  8: [
    { top: '18%', left: '30%', scale: 1.5 },
    { top: '16%', left: '50%', scale: 1.5 },
    { top: '13%', left: '70%', scale: 1.5 },
    { top: '18%', left: '29%', scale: 1.5 },
    { top: '20%', left: '65%', scale: 1.5 },
    { top: '28%', left: '50%', scale: 1.5 },
    { top: '18%', left: '76%', scale: 1.5 },
    { top: '24%', left: '40%', scale: 1.5 }
  ],

  10: [
    { top: '14%', left: '28%', scale: 1.4 },
    { top: '21%', left: '50%', scale: 1.4 },
    { top: '12%', left: '82%', scale: 1.4  },
    { top: '20%', left: '33%', scale: 1.4  },
    { top: '20%', left: '75%', scale: 1.4 },
    { top: '32%', left: '50%', scale: 1.4 },
    { top: '14%', left: '68%', scale: 1.4 },
    { top: '14%', left: '45%', scale: 1.4  },
    { top: '26%', left: '39%', scale: 1.4  },
    { top: '26%', left: '62%', scale: 1.4  }
  ],

  12: [
    { top: '16%', left: '25%', scale: 1.5 },
    { top: '19%', left: '50%', scale:  1.5},
    { top: '13%', left: '80%', scale:  1.5 },
    { top: '18%', left: '35%', scale:  1.5 },
    { top: '18%', left: '75%', scale:  1.5  },
    { top: '30%', left: '50%', scale:  1.5 },
    { top: '12%', left: '47%', scale:  1.5  },
    { top: '12%', left: '64%', scale:  1.5  },
    { top: '24%', left: '39%', scale:  1.5  },
    { top: '24%', left: '64%', scale:  1.5 },
    { top: '28%', left: '45%', scale:  1.5 },
    { top: '28%', left: '55%', scale:  1.5 }
  ]
}

const posicoesAtuais = isMobile
  ? posicoesFloresMobile
  : posicoesFlores




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


message += `Aguardo orientações para finalizar.\nObrigado(a)!`

  const encodedMessage = encodeURIComponent(message)
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`

  window.open(whatsappUrl, '_blank')
}


const gerarFloresMescladas = () => {
  if (floresSelecionadas.length === 1) {
    return Array(quantidade).fill(floresSelecionadas[0])
  }

  const [florA, florB] = floresSelecionadas
  const metade = Math.floor(quantidade / 2)

  const resultado = []

  for (let i = 0; i < quantidade; i++) {
    // alternância com variação
    if (i % 4 === 0 || i % 4 === 3) {
      resultado.push(florA)
    } else {
      resultado.push(florB)
    }
  }

  return resultado.slice(0, quantidade)
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
  className={`camada-plantinha plantinha-${plantinha}`}
  src={`/buque/plantinha/${plantinha}.png`}
  alt="Plantinha"
/>

{(() => {
  const floresMescladas = gerarFloresMescladas()

  return posicoesAtuais[quantidade].map((pos, index) => (
    <img
      key={index}
      className="camada-flor flor-item"
      src={`/buque/flor/${floresMescladas[index]}.png`}
      alt="Flor"
      style={{
        top: pos.top,
        left: pos.left,
        transform: `translateX(-50%) scale(${pos.scale})`
      }}
    />
  ))
})()}



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
    className={floresSelecionadas.includes(item.id) ? 'active' : ''}
    onClick={() => toggleFlor(item.id)}
  >
    {item.nome}
  </button>
))}

    </div>
  </div>

  {/* QUANTIDADE */}
  <div className="option-group">
    <h4>Quantidade</h4>

    {mensagemFlor && (
  <p className="mensagem-flor-aviso">
    {mensagemFlor}
  </p>
)}

    <div className="option-buttons vertical">
      {quantidades.map((qtd) => (
        <button
          key={qtd}
          className={quantidade === qtd ? 'active' : ''}
          onClick={() => {
            setQuantidade(qtd)
            setMensagemFlor('')
          
            if (qtd === 1) {
              setFloresSelecionadas((prev) => prev.slice(0, 1))
            }
          }}
          
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
