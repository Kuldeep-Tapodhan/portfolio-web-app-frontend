import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { loginUser } from "../services/auth";
import { Lock, User, Loader, Eye, EyeOff, ShieldCheck, ArrowRight } from "lucide-react";
import "../styles/Home.css";

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser(credentials.username, credentials.password);
      login(data);
      navigate("/admin");
    } catch (err) {
      console.error("Login Error:", err);
      if (err?.code === "INVALID_CREDENTIALS" || err?.detail || err?.non_field_errors) {
        setError("Invalid username or password. Access denied.");
      } else {
        setError(err?.message || "Authentication failed. Please check backend service status.");
      }
      setLoading(false);
    }
  };

  return (
    <div className="login-page-container">
      {/* Ambient Grid Background */}
      <div className="neural-background">
        <div className="neural-grid"></div>
      </div>

      <div className="login-card-wrapper">
        <div className="login-card">
          {/* Top Decorative Header */}
          <div className="login-header">
            <div className="login-logo-ring">
              <img 
                src="/favicon.svg" 
                alt="Kuldeep AI Logo" 
                className="login-logo-img" 
              />
            </div>
            
            <h2 className="login-title">
              Dev Admin Access
            </h2>
            <p className="login-subtitle">
              Authenticate with your system credentials
            </p>
          </div>

          {/* Error Notice */}
          {error && (
            <div className="login-error-alert">
              🚨 {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <div className="input-icon-wrapper">
                <User size={18} className="input-icon" />
                <input
                  type="text"
                  name="username"
                  className="form-input with-icon"
                  placeholder="Username (e.g. djtapodhan143)"
                  value={credentials.username}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1.8rem' }}>
              <label className="form-label">Password</label>
              <div className="input-icon-wrapper">
                <Lock size={18} className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="form-input with-icon with-end-icon"
                  placeholder="Enter secret password"
                  value={credentials.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle-btn"
                  title="Toggle Password Visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary login-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader size={18} className="spinner" />
                  <span>AUTHENTICATING...</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={18} />
                  <span>INITIALIZE ADMIN SESSION</span>
                </>
              )}
            </button>
          </form>

          {/* Quick link back to website */}
          <div className="login-footer-link">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="return-site-btn"
            >
              <span>Return to Public Website</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .login-page-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 1.5rem;
          background-color: var(--bg-primary);
          color: var(--text-primary);
        }
        .login-card-wrapper {
          width: 100%;
          max-width: 440px;
          position: relative;
          z-index: 1;
        }
        .login-card {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 28px;
          padding: 2.5rem 2rem;
          backdrop-filter: blur(24px);
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6), var(--glow-cyan);
        }
        @media (max-width: 480px) {
          .login-card {
            padding: 1.8rem 1.25rem;
            border-radius: 22px;
          }
        }
        .login-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .login-logo-ring {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
        }
        .login-logo-img {
          width: 58px;
          height: 58px;
          border-radius: 18px;
          box-shadow: 0 0 25px rgba(0, 242, 254, 0.4);
          border: 1px solid rgba(0, 242, 254, 0.3);
        }
        .login-title {
          font-size: 1.8rem;
          font-weight: 800;
          margin: 0 0 0.4rem 0;
          color: var(--text-primary);
        }
        .login-subtitle {
          color: var(--text-secondary);
          font-size: 0.9rem;
          margin: 0;
        }
        .login-error-alert {
          background: rgba(239, 68, 68, 0.12);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #f87171;
          padding: 0.8rem 1rem;
          border-radius: 12px;
          margin-bottom: 1.5rem;
          font-size: 0.88rem;
          font-family: 'Fira Code', monospace;
          text-align: center;
        }
        .input-icon-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .input-icon {
          position: absolute;
          left: 14px;
          color: var(--accent-cyan);
          pointer-events: none;
        }
        .form-input.with-icon {
          padding-left: 44px;
        }
        .form-input.with-end-icon {
          padding-right: 44px;
        }
        .password-toggle-btn {
          position: absolute;
          right: 12px;
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 0.3rem;
          border-radius: 6px;
        }
        .password-toggle-btn:hover {
          color: var(--accent-cyan);
        }
        .login-submit-btn {
          width: 100%;
          justify-content: center;
          padding: 0.9rem;
        }
        .login-footer-link {
          text-align: center;
          margin-top: 1.6rem;
        }
        .return-site-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          transition: color 0.2s;
        }
        .return-site-btn:hover {
          color: var(--accent-cyan);
        }
      `}</style>
    </div>
  );
};

export default Login;
