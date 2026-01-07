import { useEffect, useRef } from 'react'
import './Depoimentos.css'


const depoimentosData = [
  {
    id: 1,
    name: 'Ana C. Paula',
    text: 'Pedi um buquê personalizado e ficou muito lindo. As flores estavam super fresquinhas.',
    avatar: '/person1.jpg',
  },
  {
    id: 2,
    name: 'Marcos da Silva ',
    text: 'Pedi pro vendedor me ajudar a escolher um arranjo e ela gostou muito, top demais.',
    avatar: '/person2.jpg',
  },
  {
    id: 3,
    name: 'Juliana da Costas',
    text: 'Já comprei mais de uma vez e sempre vem tudo muito bonito.',
    avatar: '/person3.jpg',
  },
  {
    id: 4,
    name: 'Renato Almeida de Souza',
    text: 'Peguei um combo com flores e chocolate e achei tudo muito caprichado, e bem organizadinho, muito fofo, amei o ursinho da coelha bravinha, próxima vez que for ai vou querer ele ein.',
    avatar: '/person4.jpg',
  },
  {
    id: 5,
    name: 'Fernanda L.',
    text: 'O buquê do Dia das Mães estava perfeito, minha mãe ficou muito feliz, obrigado pelo carinho.',
    avatar: '/person5.jpg',
  },
  {
    id: 6,
    name: 'Carlos Henrique',
    text: 'O atendimento foi bom, me ajudaram a escolher o que eu queria.',
    avatar: '/person6.jpg',
  },
  {
    id: 7,
    name: 'Patricia Nunes',
    text: 'A Coroa chegou bem cheia, muito obrigado pelo cuidado em um momento como esse, foram muito atenciosos comigo e com minha familia.',
    avatar: '/person7.jpg',
  },
  {
    id: 8,
    name: 'Lucas Rocha de Oliveira',
    text: 'Precisava de um presente rápido e eles resolveram tudo pra mim.',
    avatar: '/person8.jpg',
  },
  {
    id: 9,
    name: 'Camila Freitas',
    text: 'Os arranjos são tops.',
    avatar: '/person9.jpg',
  },
  {
    id: 10,
    name: 'Bruno Teixeira',
    text: 'Encomendei flores para alguém muito querido que estava no hospital, num momento em que eu não conseguia estar presente como gostaria. Quando as flores chegaram, me disseram que iluminaram o quarto e trouxeram um pouco de alegria. Foi mais do que um arranjo, foi carinho e conforto, conversaram comigo quando as flores chegaram e me ajudaram a me fizeram me sentir melhor, muito obrigado.',
    avatar: '/person10.jpg',
  },
]

function Depoimentos() {

    const trackRef = useRef(null)

      useEffect(() => {
    const track = trackRef.current
    let position = 0
    const speed = 0.8 // ajuste fino depois

    const animate = () => {
      position -= speed

      if (Math.abs(position) >= track.scrollWidth / 2) {
        position = 0
      }

      track.style.transform = `translate3d(${position}px, 0, 0)`
      requestAnimationFrame(animate)
    }

    requestAnimationFrame(animate)
  }, [])

  return (
    <section className="depoimentos">
      <h3>O que nossos clientes dizem</h3>

     <div className="depoimentos-wrapper">
  <div className="depoimentos-track" ref={trackRef}>

    <div className="depoimentos-track-inner">
      {depoimentosData.map((item) => (
        <div className="depoimento-card" key={item.id}>
          <img
            src={item.avatar}
            alt={item.name}
            className="avatar"
          />

          <div className="depoimento-texto">
            <p>“{item.text}”</p>
            <span className="nome">{item.name}</span>
          </div>
        </div>
      ))}
    </div>

    <div className="depoimentos-track-inner">
      {depoimentosData.map((item) => (
        <div className="depoimento-card" key={`clone-${item.id}`}>
          <img
            src={item.avatar}
            alt={item.name}
            className="avatar"
          />

          <div className="depoimento-texto">
            <p>“{item.text}”</p>
            <span className="nome">{item.name}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>

    </section>
  )
}

export default Depoimentos
