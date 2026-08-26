import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Sun, Moon, Menu, X, Terminal, Sparkles, User, Briefcase, GraduationCap, Award, Mail } from "lucide-react";
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
        if (data) {
          setProfile(Array.isArray(data) ? data[0] : data);
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

  return (
    <nav style={{
      position: "sticky",
      top: 0,
      zIndex: 100,
      width: "100%",
      backdropFilter: "blur(16px)",
      backgroundColor: scrolled ? "var(--nav-bg)" : "rgba(7, 9, 14, 0.4)",
      borderBottom: scrolled ? "1px solid var(--border-color)" : "1px solid transparent",
      transition: "all 0.3s ease",
      padding: "0.75rem 1.25rem"
    }}>
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
          fontSize: "1.2rem",
          letterSpacing: "-0.5px"
        }}>
          <img 
            src="/favicon.svg" 
            alt="KT Logo" 
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "10px",
              boxShadow: "0 0 12px rgba(0, 242, 254, 0.4)",
              objectFit: "cover"
            }} 
          />
          <span>Kuldeep<span style={{ color: "var(--accent-cyan)" }}>.AI</span></span>
        </Link>

        {/* Desktop Navigation Links */}
        <div style={{
          alignItems: "center",
          gap: "1.75rem",
        }} className="desktop-only">
          <a href="#about" style={linkStyle}>About</a>
          <a href="#projects" style={linkStyle}>Projects</a>
          <a href="#skills" style={linkStyle}>Skills</a>
          <a href="#experience" style={linkStyle}>Experience</a>
          <a href="#education" style={linkStyle}>Education</a>
          <a href="#certifications" style={linkStyle}>Certifications</a>
          <a href="#contact" style={linkStyle}>Contact</a>
        </div>

        {/* Right Section: Status Pill & Theme Toggle & Mobile Menu */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {profile && (
            <div 
              style={{
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.3rem 0.75rem",
                borderRadius: "9999px",
                background: "rgba(0, 242, 254, 0.08)",
                border: "1px solid rgba(0, 242, 254, 0.2)",
                fontSize: "0.8rem",
                fontWeight: "600",
                color: "var(--text-primary)"
              }}
              className="nav-status-pill"
            >
              <span style={{
                width: "7px",
                height: "7px",
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
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
            title="Toggle Dark/Light Theme"
          >
            {isDarkMode ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-color)",
              color: "var(--text-primary)",
              borderRadius: "10px",
              width: "36px",
              height: "36px",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer"
            }}
            className="mobile-menu-btn"
            title="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Links Dropdown Drawer */}
      {mobileMenuOpen && (
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.85rem",
          padding: "1rem 0.5rem 0.5rem 0.5rem",
          borderTop: "1px solid var(--border-color)",
          marginTop: "0.75rem",
          background: "var(--bg-card)",
          borderRadius: "14px",
          backdropFilter: "blur(20px)"
        }} className="mobile-drawer">
          <a href="#about" style={mobileLinkStyle} onClick={() => setMobileMenuOpen(false)}>
            <User size={16} /> <span>About Me</span>
          </a>
          <a href="#projects" style={mobileLinkStyle} onClick={() => setMobileMenuOpen(false)}>
            <Sparkles size={16} /> <span>AI Projects</span>
          </a>
          <a href="#skills" style={mobileLinkStyle} onClick={() => setMobileMenuOpen(false)}>
            <Terminal size={16} /> <span>Tech Skills</span>
          </a>
          <a href="#experience" style={mobileLinkStyle} onClick={() => setMobileMenuOpen(false)}>
            <Briefcase size={16} /> <span>Experience</span>
          </a>
          <a href="#education" style={mobileLinkStyle} onClick={() => setMobileMenuOpen(false)}>
            <GraduationCap size={16} /> <span>Education</span>
          </a>
          <a href="#certifications" style={mobileLinkStyle} onClick={() => setMobileMenuOpen(false)}>
            <Award size={16} /> <span>Certifications</span>
          </a>
          <a href="#contact" style={mobileLinkStyle} onClick={() => setMobileMenuOpen(false)}>
            <Mail size={16} /> <span>Contact Me</span>
          </a>
        </div>
      )}

      {/* Embedded Responsive Media Queries for Navbar */}
      <style>{`
        @media (min-width: 901px) {
          .desktop-only {
            display: flex !important;
          }
          .mobile-menu-btn {
            display: none !important;
          }
          .nav-status-pill {
            display: flex !important;
          }
        }
        @media (max-width: 900px) {
          .desktop-only {
            display: none !important;
          }
          .mobile-menu-btn {
            display: flex !important;
          }
          .nav-status-pill {
            display: none !important;
          }
        }
      `}</style>
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

const mobileLinkStyle = {
  color: "var(--text-primary)",
  textDecoration: "none",
  fontWeight: "700",
  fontSize: "0.95rem",
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
  padding: "0.6rem 0.8rem",
  borderRadius: "10px",
  background: "rgba(255, 255, 255, 0.03)"
};

export default Navbar;
