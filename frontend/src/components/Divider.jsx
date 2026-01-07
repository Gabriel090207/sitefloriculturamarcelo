import './Divider.css'

function Divider() {
  return (
    <div className="divider">
      <span className="divider-line" />
      <img
        src="/logo.png"
        alt="Valle das Flores"
        className="divider-logo"
      />
      <span className="divider-line" />
    </div>
  )
}

export default Divider
