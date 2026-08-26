import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Cpu, Sun, Moon, Menu, X, Sparkles, Terminal, Code2, Briefcase, User, Mail } from "lucide-react";
import { ThemeContext } from "../context/ThemeContext";
import { getProfile } from "../services/portfolioApi";

const Navbar = () => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        if (data && data.length > 0) {
          setProfile(data[0]);
        }
      } catch (error) {
        console.error("Error fetching profile for navbar:", error);
      }
    };
    fetchProfile();

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navStyles = {
    position: "sticky",
    top: 0,
    zIndex: 100,
    width: "100%",
    backdropFilter: "blur(16px)",
    backgroundColor: scrolled ? "var(--nav-bg)" : "transparent",
    borderBottom: scrolled ? "1px solid var(--border-color)" : "1px solid transparent",
    transition: "all 0.3s ease",
    padding: "0.85rem 2rem",
  };

  const containerStyles = {
    maxWidth: "1280px",
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    justifySpaceBetween: "space-between",
  };

  return (
    <nav style={navStyles}>
      <div style={{
        maxWidth: "1280px",
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{
          display: "flex",
          alignItems: "center",
          gap: "0.6rem",
          textDecoration: "none",
          color: "var(--text-primary)",
          fontWeight: "800",
          fontSize: "1.25rem",
          letterSpacing: "-0.5px"
        }}>
          <div style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            background: "linear-gradient(135deg, var(--accent-cyan), var(--accent-indigo))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#000",
            boxShadow: "0 0 15px rgba(0, 242, 254, 0.4)"
          }}>
            <Cpu size={20} />
          </div>
          <span>Kuldeep<span style={{ color: "var(--accent-cyan)" }}>.AI</span></span>
        </Link>

        {/* Desktop Navigation Links */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "2rem",
        }} className="desktop-only">
          <a href="#about" style={linkStyle}>About</a>
          <a href="#projects" style={linkStyle}>Projects</a>
          <a href="#skills" style={linkStyle}>Skills</a>
          <a href="#experience" style={linkStyle}>Experience</a>
          <a href="#education" style={linkStyle}>Education</a>
          <a href="#certifications" style={linkStyle}>Certifications</a>
          <a href="#contact" style={linkStyle}>Contact</a>
        </div>

        {/* Right Section: Status Pill & Theme Toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {profile && (
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              padding: "0.35rem 0.85rem",
              borderRadius: "9999px",
              background: "rgba(0, 242, 254, 0.08)",
              border: "1px solid rgba(0, 242, 254, 0.2)",
              fontSize: "0.85rem",
              fontWeight: "600",
              color: "var(--text-primary)"
            }}>
              <span style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#10b981",
                boxShadow: "0 0 8px #10b981"
              }}></span>
              <span>{profile.title || "AI Developer"}</span>
            </div>
          )}

          <button
            onClick={toggleTheme}
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-color)",
              color: "var(--accent-cyan)",
              borderRadius: "10px",
              width: "38px",
              height: "38px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
            title="Toggle Dark/Light Theme"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-primary)",
              cursor: "pointer",
              display: "none"
            }}
            className="mobile-menu-btn"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Links Dropdown */}
      {mobileMenuOpen && (
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          padding: "1rem 0 0.5rem 0",
          borderTop: "1px solid var(--border-color)",
          marginTop: "0.85rem"
        }}>
          <a href="#about" style={linkStyle} onClick={() => setMobileMenuOpen(false)}>About</a>
          <a href="#projects" style={linkStyle} onClick={() => setMobileMenuOpen(false)}>Projects</a>
          <a href="#skills" style={linkStyle} onClick={() => setMobileMenuOpen(false)}>Skills</a>
          <a href="#experience" style={linkStyle} onClick={() => setMobileMenuOpen(false)}>Experience</a>
          <a href="#education" style={linkStyle} onClick={() => setMobileMenuOpen(false)}>Education</a>
          <a href="#certifications" style={linkStyle} onClick={() => setMobileMenuOpen(false)}>Certifications</a>
          <a href="#contact" style={linkStyle} onClick={() => setMobileMenuOpen(false)}>Contact</a>
        </div>
      )}
    </nav>
  );
};

const linkStyle = {
  color: "var(--text-secondary)",
  textDecoration: "none",
  fontWeight: "600",
  fontSize: "0.9rem",
  transition: "color 0.2s ease"
};

export default Navbar;
