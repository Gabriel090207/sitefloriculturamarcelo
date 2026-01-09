import { useState } from 'react'
import './ArranjosHome.css'

const grupos = [
  {
    bg: '#B89A86',
    items: [
      { id: 1, name: 'Arranjo Rosas Nobres', image: '/arranjo1semfundo.png' },
      { id: 2, name: 'Arranjo Elegância', image: '/arranjo1semfundo.png' },
      { id: 3, name: 'Arranjo Delicado', image: '/arranjo1semfundo.png' },
    ],
  },
  {
    bg: '#AFC4D6',
    items: [
      { id: 4, name: 'Arranjo Clássico', image: '/arranjo2semfundo.png' },
      { id: 5, name: 'Arranjo Suave', image: '/arranjo2semfundo.png' },
      { id: 6, name: 'Arranjo Contemporâneo', image: '/arranjo2semfundo.png' },
    ],
  },
  {
    bg: '#D8A0A0',
    items: [
      { id: 4, name: 'Arranjo Clássico', image: '/arranjo2semfundo.png' },
      { id: 5, name: 'Arranjo Suave', image: '/arranjo2semfundo.png' },
      { id: 6, name: 'Arranjo Contemporâneo', image: '/arranjo2semfundo.png' },
    ],
  },
  {
    bg: '#C98A8A',
    items: [
      { id: 4, name: 'Arranjo Clássico', image: '/arranjo2semfundo.png' },
      { id: 5, name: 'Arranjo Suave', image: '/arranjo2semfundo.png' },
      { id: 6, name: 'Arranjo Contemporâneo', image: '/arranjo2semfundo.png' },
    ],
  },
  {
    bg: '#E6D3A3',
    items: [
      { id: 4, name: 'Arranjo Clássico', image: '/arranjo2semfundo.png' },
      { id: 5, name: 'Arranjo Suave', image: '/arranjo2semfundo.png' },
      { id: 6, name: 'Arranjo Contemporâneo', image: '/arranjo2semfundo.png' },
    ],
  },
]

function ArranjosHome() {

  const isMobile = window.innerWidth <= 768

  const itemsPerSlide = isMobile ? 1 : 3

const slides = grupos.flatMap((grupo) => {
  if (!isMobile) return [grupo]

  // MOBILE: quebra cada item em um slide
  return grupo.items.map((item) => ({
    bg: grupo.bg,
    items: [item],
  }))
})


  const [index, setIndex] = useState(0)

  const next = () => {
    setIndex((prev) => (prev + 1) % slides.length )
  }

  const prev = () => {
    setIndex((prev) => (prev - 1 + grupos.length) % grupos.length)
  }

  return (
    <section
      className="arranjos-home"
      style={{ backgroundColor: slides[index].bg }}

    >
      <div className="arranjos-header">
        <h2>Arranjos que transformam momentos</h2>
      </div>

      <div className="arranjos-carousel">
        <button className="arranjos-arrow left" onClick={prev}>‹</button>

        <div className="arranjos-viewport">
          <div
            className="arranjos-track"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {slides.map((grupo, i) => (

              <div className="arranjos-slide" key={i}>
                {grupo.items.map((item) => (
                  <div className="arranjo-item" key={item.id}>
                    <img src={item.image} alt={item.name} />
                    <p>{item.name}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <button className="arranjos-arrow right" onClick={next}>›</button>
      </div>

      <div className="arranjos-cta">
        <a href="/loja">Ver mais arranjos →</a>
      </div>
    </section>
  )
}

export default ArranjosHome
