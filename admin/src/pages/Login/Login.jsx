import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../services/firebase";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";



import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();


  const [showPassword, setShowPassword] = useState(false);


  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");

      // redirecionamento será feito no próximo passo
    } catch (err) {
      setError("Email ou senha inválidos");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-background" />
  
      <form className="login-card" onSubmit={handleSubmit}>
        <img
          src="/src/assets/logo.png"
          alt="Valle das Flores"
          className="login-logo"
        />
  
        <h1>Entrar</h1>
  
        <div className="login-field">
          <label>Email</label>
          <input
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
  
        <div className="login-field">
          <label>Senha</label>
  
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
  
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(prev => !prev)}
              aria-label="Mostrar ou ocultar senha"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </div>
  
        {error && <span className="login-error">{error}</span>}
  
        <button
          type="submit"
          disabled={loading}
          className="login-submit"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
  
}
