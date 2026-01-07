import { Link, NavLink } from 'react-router-dom'
import { useState } from 'react'
import { FiMenu, FiX } from 'react-icons/fi'
import logo from '../assets/logo.png'
import './Header.css'


function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <header className="header">
        {/* Logo */}
        <div className="logo-wrapper">
          <Link to="/" onClick={() => setMenuOpen(false)}>
            <img src={logo} alt="Valle das Flores" className="logo" />
          </Link>
        </div>
  
        {/* Menu Desktop */}
        <nav className="nav">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/loja">Loja</NavLink>
          <NavLink to="/sobre">Sobre</NavLink>
          <NavLink to="/contato">Contato</NavLink>
        </nav>
  
        {/* Botão Mobile */}
        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(true)}
        >
          <FiMenu />
        </button>
      </header>
  
      {/* OVERLAY */}
      {menuOpen && (
        <div
          className="menu-overlay"
          onClick={() => setMenuOpen(false)}
        />
      )}
  
      {/* SIDEBAR */}
      <aside className={`menu-sidebar ${menuOpen ? 'open' : ''}`}>
        <button
          className="menu-close"
          onClick={() => setMenuOpen(false)}
        >
          <FiX />
        </button>
  
        <nav className="menu-nav">
          <NavLink to="/" end onClick={() => setMenuOpen(false)}>Home</NavLink>
          <NavLink to="/loja" onClick={() => setMenuOpen(false)}>Loja</NavLink>
          <NavLink to="/sobre" onClick={() => setMenuOpen(false)}>Sobre</NavLink>
          <NavLink to="/contato" onClick={() => setMenuOpen(false)}>Contato</NavLink>
        </nav>
      </aside>
    </>
  )
  
}

export default Header
