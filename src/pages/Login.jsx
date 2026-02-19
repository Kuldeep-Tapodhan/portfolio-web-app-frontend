import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { loginUser } from "../services/auth";
import { Lock, User, Terminal, Loader } from "lucide-react"; // Icons

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
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

      // If successful, update global state and redirect
      login(data);
      navigate("/admin"); // We will build this page next
    } catch (err) {
      // Handle the 401 error from your API
      setError("Invalid credentials. Access denied.");
      setLoading(false);
    }
  };

  // --- Inline Styles for Quick Setup (We use CSS variables) ---
  const styles = {
    container: {
      display: "flex",
      height: "100vh",
      alignItems: "center",
      justifyContent: "center",
      background: "radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)",
    },
    card: {
      background: "var(--bg-secondary)",
      padding: "2.5rem",
      borderRadius: "12px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
      width: "100%",
      maxWidth: "400px",
      border: "1px solid rgba(56, 189, 248, 0.1)",
    },
    header: {
      textAlign: "center",
      marginBottom: "2rem",
      color: "var(--accent-color)",
    },
    inputGroup: {
      marginBottom: "1.5rem",
      position: "relative",
    },
    input: {
      width: "100%",
      padding: "12px 12px 12px 40px", // Space for icon
      background: "#0f172a",
      border: "1px solid #334155",
      borderRadius: "6px",
      color: "white",
      fontSize: "1rem",
      boxSizing: "border-box",
    },
    icon: {
      position: "absolute",
      left: "12px",
      top: "12px",
      color: "#94a3b8",
      width: "18px",
    },
    button: {
      width: "100%",
      padding: "12px",
      background: loading ? "#334155" : "var(--accent-color)",
      color: "#0f172a",
      border: "none",
      borderRadius: "6px",
      fontWeight: "bold",
      fontSize: "1rem",
      cursor: loading ? "not-allowed" : "pointer",
      transition: "all 0.2s",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px",
    },
    error: {
      color: "var(--error-color)",
      marginBottom: "1rem",
      textAlign: "center",
      fontSize: "0.9rem",
      fontFamily: "var(--font-mono)",
    },
    loader: {
      animation: "spin 1s linear infinite",
    },
  };

  return (
    <div style={styles.container}>
      <style>
        {`
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                `}
      </style>
      <div style={styles.card}>
        <div style={styles.header}>
          <Terminal size={48} style={{ marginBottom: "10px" }} />
          <h2 style={{ margin: 0 }}>System Access</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            Identify yourself
          </p>
        </div>

        {error && <div style={styles.error}>{`> Error: ${error}`}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <User style={styles.icon} />
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={credentials.username}
              onChange={handleChange}
              style={styles.input}
              required
              disabled={loading}
            />
          </div>

          <div style={styles.inputGroup}>
            <Lock style={styles.icon} />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={credentials.password}
              onChange={handleChange}
              style={styles.input}
              required
              disabled={loading}
            />
          </div>

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? (
              <>
                <Loader size={18} style={styles.loader} />
                AUTHENTICATING...
              </>
            ) : (
              "INITIALIZE SESSION"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
