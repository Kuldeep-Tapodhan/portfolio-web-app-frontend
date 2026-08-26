import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { loginUser } from "../services/auth";
import { Lock, User, Terminal, Loader, Eye, EyeOff, ShieldCheck, ArrowRight } from "lucide-react";
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
        setError(err?.message || "Authentication failed. Please check backend status.");
      }
      setLoading(false);
    }
  };

  return (
    <div className="home-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '1.5rem' }}>
      {/* Ambient Grid Background */}
      <div className="neural-background">
        <div className="neural-grid"></div>
      </div>

      <div 
        className="content-wrapper" 
        style={{ 
          width: '100%', 
          maxWidth: '440px', 
          padding: '0' 
        }}
      >
        <div 
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '24px',
            padding: '2.5rem',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5), var(--glow-cyan)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Top Decorative Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <img 
                src="/favicon.svg" 
                alt="KT Logo" 
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  boxShadow: '0 0 20px rgba(0, 242, 254, 0.4)'
                }} 
              />
            </div>
            
            <h2 style={{ fontSize: '1.8rem', fontWeight: '800', margin: '0 0 0.4rem 0', color: 'var(--text-primary)' }}>
              Dev Admin Access
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
              Authenticate with your system credentials
            </p>
          </div>

          {/* Error Notice */}
          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              padding: '0.75rem 1rem',
              borderRadius: '10px',
              marginBottom: '1.5rem',
              fontSize: '0.88rem',
              fontFamily: "'Fira Code', monospace",
              textAlign: 'center'
            }}>
              🚨 {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--accent-cyan)' }} />
                <input
                  type="text"
                  name="username"
                  className="form-input"
                  placeholder="Username (e.g. djtapodhan143)"
                  value={credentials.username}
                  onChange={handleChange}
                  style={{ paddingLeft: '44px' }}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1.8rem' }}>
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--accent-cyan)' }} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="form-input"
                  placeholder="Enter secret password"
                  value={credentials.password}
                  onChange={handleChange}
                  style={{ paddingLeft: '44px', paddingRight: '44px' }}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '12px',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '0.9rem' }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader size={18} className="spinner" style={{ animation: 'spin 1s linear infinite' }} />
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
          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <button
              type="button"
              onClick={() => navigate('/')}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <span>Return to Public Website</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
