import logo from "../../assets/logo.png";
import { FiLogOut } from "react-icons/fi";
import { signOut } from "firebase/auth";
import { auth } from "../../services/firebase";
import { useNavigate } from "react-router-dom";

import "./AdminHeader.css";

export default function AdminHeader() {
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (err) {
      console.error("Erro ao sair:", err);
    }
  }

  return (
    <header className="admin-header">
      <div className="admin-logo-wrapper">
        <img
          src={logo}
          alt="Valle das Flores"
          className="admin-logo"
        />
      </div>

      <button
        className="logout-btn"
        onClick={handleLogout}
        title="Sair"
        aria-label="Sair"
      >
        <FiLogOut />
        <span>Sair</span>
      </button>
    </header>
  );
}
