import { Link, NavLink } from 'react-router-dom'
import logo from '../assets/logo.png'
import './Header.css'

function Header() {
  return (
    <header className="header">
      
      {/* Logo */}
      <div className="logo-wrapper">
        <Link to="/">
          <img src={logo} alt="Valle das Flores" className="logo" />
        </Link>
      </div>

      {/* Navegação */}
      <nav className="nav">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/loja">Loja</NavLink>
        <NavLink to="/sobre">Sobre</NavLink>
        <NavLink to="/contato">Contato</NavLink>
      </nav>

    </header>
  )
}

export default Header
