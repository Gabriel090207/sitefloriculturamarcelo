import { useEffect, useRef, useState } from 'react'
import './TotemHeader.css'
import logo from '../../assets/logo.png'

function TotemHeader() {
  const [showServiceModal, setShowServiceModal] = useState(false)
  const [isServiceModalClosing, setIsServiceModalClosing] = useState(false)
  const closeTimeoutRef = useRef(null)
  const whatsappPhone = '92995131313'
  const whatsappDisplayPhone = '(92) 99513-1313'
  const whatsappUrl = `https://wa.me/${whatsappPhone}`
  const whatsappQrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(whatsappUrl)}`
  const serviceHours = 'Atendimento 24 Horas'

  const openServiceModal = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
    setIsServiceModalClosing(false)
    setShowServiceModal(true)
  }

  const closeServiceModal = () => {
    if (isServiceModalClosing) return

    setIsServiceModalClosing(true)
    closeTimeoutRef.current = setTimeout(() => {
      setShowServiceModal(false)
      setIsServiceModalClosing(false)
      closeTimeoutRef.current = null
    }, 240)
  }

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
    }
  }, [])

  return (
    <>
      <header className="totem-header">
        <div className="totem-header-logo">
          <img
            src={logo}
            alt="Valle das Flores"
            className="totem-logo"
          />
        </div>

        <div className="totem-header-actions">
          <button
            type="button"
            className="totem-whatsapp"
            onClick={openServiceModal}
          >
            <i className="fa-brands fa-whatsapp"></i>

            <div className="totem-whatsapp-text">
              <span>Atendimento 24 Horas</span>
            </div>
          </button>
        </div>
      </header>

      {showServiceModal && (
        <div
          className={`totem-service-overlay${isServiceModalClosing ? ' is-closing' : ''}`}
          onClick={closeServiceModal}
        >
          <div
            className="totem-service-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="totem-service-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="totem-service-close"
              onClick={closeServiceModal}
              aria-label="Fechar atendimento"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            <h2 id="totem-service-title">{serviceHours}</h2>

            <p>Escaneie o QR Code com seu celular para abrir o WhatsApp da floricultura.</p>

            <img
              src={whatsappQrCodeUrl}
              alt="QR Code para abrir o WhatsApp da floricultura"
              className="totem-service-qr-code"
            />

            <div className="totem-service-contact">
              <span>Número:</span>
              <strong>{whatsappDisplayPhone}</strong>
            </div>

            

            <p className="totem-service-help">
              Se não souber usar o QR Code, utilize o número acima.
            </p>
          </div>
        </div>
      )}
    </>
  )
}

export default TotemHeader
