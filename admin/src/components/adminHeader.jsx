import logo from "../assets/logo.png";
import "../styles/admin-header.css";

export default function AdminHeader() {
  return (
    <header className="admin-header">
      <div className="admin-logo-wrapper">
        <img
          src={logo}
          alt="Valle das Flores"
          className="admin-logo"
        />
      </div>
    </header>
  );
}
