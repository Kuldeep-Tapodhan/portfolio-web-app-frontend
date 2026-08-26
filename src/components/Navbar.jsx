import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Sun, Moon, Menu, X, Terminal, Sparkles, User, Briefcase, GraduationCap, Award, Mail, ArrowUpRight } from "lucide-react";
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
    <header className={`navbar-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Brand Text Logo */}
        <Link to="/" className="navbar-brand">
          <div className="brand-text">
            <span>Kuldeep</span>
            <span className="brand-highlight">.AI</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav">
          <a href="#about" className="nav-link">About</a>
          <a href="#projects" className="nav-link">Projects</a>
          <a href="#skills" className="nav-link">Skills</a>
          <a href="#experience" className="nav-link">Experience</a>
          <a href="#education" className="nav-link">Education</a>
          <a href="#certifications" className="nav-link">Certifications</a>
          <a href="#contact" className="nav-link">Contact</a>
        </nav>

        {/* Right Section: Status Pill & Actions */}
        <div className="navbar-actions">
          {profile && (
            <div className="nav-status-pill">
              <span className="pulse-dot"></span>
              <span>{profile.title || "AI Developer"}</span>
            </div>
          )}

          <button
            onClick={toggleTheme}
            className="theme-toggle-btn"
            title="Toggle Dark / Light Theme"
            aria-label="Toggle Theme"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-menu-btn"
            title="Toggle Navigation Menu"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <>
          <div className="mobile-backdrop" onClick={() => setMobileMenuOpen(false)} />
          <nav className="mobile-drawer">
            <a href="#about" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
              <User size={18} /> <span>About Me</span>
            </a>
            <a href="#projects" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
              <Sparkles size={18} /> <span>AI Projects</span>
            </a>
            <a href="#skills" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
              <Terminal size={18} /> <span>Tech Skills</span>
            </a>
            <a href="#experience" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
              <Briefcase size={18} /> <span>Experience</span>
            </a>
            <a href="#education" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
              <GraduationCap size={18} /> <span>Education</span>
            </a>
            <a href="#certifications" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
              <Award size={18} /> <span>Certifications</span>
            </a>
            <a href="#contact" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
              <Mail size={18} /> <span>Contact Me</span>
            </a>
          </nav>
        </>
      )}

      {/* Embedded Responsive Scoped Styles for Navbar */}
      <style>{`
        .navbar-header {
          position: sticky;
          top: 0;
          z-index: 100;
          width: 100%;
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          background: rgba(6, 9, 17, 0.5);
          border-bottom: 1px solid transparent;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          padding: 0.85rem 1.5rem;
        }
        .navbar-header.scrolled {
          background: var(--nav-bg);
          border-bottom: 1px solid var(--border-color);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
          padding: 0.65rem 1.5rem;
        }
        .navbar-container {
          max-width: 1280px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
          color: var(--text-primary);
          font-weight: 800;
          font-size: 1.25rem;
          letter-spacing: -0.5px;
        }
        .brand-logo-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .brand-logo-img {
          width: 36px;
          height: 36px;
          border-radius: 12px;
          object-fit: cover;
          box-shadow: 0 0 15px rgba(0, 242, 254, 0.4);
          border: 1px solid rgba(0, 242, 254, 0.3);
          transition: transform 0.3s ease;
        }
        .navbar-brand:hover .brand-logo-img {
          transform: scale(1.08) rotate(3deg);
        }
        .brand-highlight {
          color: var(--accent-cyan);
          background: linear-gradient(135deg, var(--accent-cyan), var(--accent-indigo));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 2rem;
        }
        .nav-link {
          color: var(--text-secondary);
          text-decoration: none;
          font-weight: 600;
          font-size: 0.9rem;
          position: relative;
          padding: 0.3rem 0;
          transition: color 0.2s ease;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0%;
          height: 2px;
          background: linear-gradient(90deg, var(--accent-cyan), var(--accent-indigo));
          border-radius: 9999px;
          transition: width 0.3s ease;
        }
        .nav-link:hover {
          color: var(--text-primary);
        }
        .nav-link:hover::after {
          width: 100%;
        }
        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }
        .nav-status-pill {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.35rem 0.85rem;
          border-radius: 9999px;
          background: rgba(0, 242, 254, 0.08);
          border: 1px solid rgba(0, 242, 254, 0.2);
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-primary);
          white-space: nowrap;
        }
        .theme-toggle-btn {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          color: var(--accent-cyan);
          border-radius: 12px;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(8px);
        }
        .theme-toggle-btn:hover {
          background: var(--bg-card-hover);
          border-color: var(--accent-cyan);
          transform: translateY(-2px);
          box-shadow: 0 0 15px rgba(0, 242, 254, 0.25);
        }
        .mobile-menu-btn {
          display: none;
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          border-radius: 12px;
          width: 40px;
          height: 40px;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .mobile-menu-btn:hover {
          border-color: var(--accent-cyan);
          color: var(--accent-cyan);
        }
        .mobile-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          z-index: 98;
        }
        .mobile-drawer {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          padding: 1.25rem;
          border-top: 1px solid var(--border-color);
          margin-top: 0.75rem;
          background: var(--bg-card);
          border-radius: 20px;
          backdrop-filter: blur(24px);
          border: 1px solid var(--border-color);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
          animation: slideDown 0.3s ease-out forwards;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .mobile-link {
          color: var(--text-primary);
          text-decoration: none;
          font-weight: 700;
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          gap: 0.85rem;
          padding: 0.75rem 1rem;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid transparent;
          transition: all 0.2s ease;
        }
        .mobile-link:hover {
          background: rgba(0, 242, 254, 0.1);
          border-color: rgba(0, 242, 254, 0.25);
          color: var(--accent-cyan);
          transform: translateX(4px);
        }

        @media (max-width: 960px) {
          .desktop-nav {
            display: none;
          }
          .mobile-menu-btn {
            display: flex;
          }
          .nav-status-pill {
            display: none;
          }
        }
        @media (max-width: 480px) {
          .navbar-header {
            padding: 0.75rem 1rem;
          }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
