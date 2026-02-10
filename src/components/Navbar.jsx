import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Terminal, Sun, Moon, Menu, X } from "lucide-react";
import { ThemeContext } from "../context/ThemeContext";
import { getProfile } from "../services/portfolioApi";

const Navbar = () => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profile, setProfile] = useState(null);

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
  }, []);

  const styles = {
    nav: {
      display: "grid",
      gridTemplateColumns: "auto 1fr auto",
      alignItems: "center",
      padding: "1rem 2rem",
      background: "var(--nav-bg)",
      borderBottom: "1px solid var(--border-color)",
      position: "sticky",
      top: 0,
      zIndex: 50,
      backdropFilter: "blur(10px)",
      transition: "background 0.3s, border-color 0.3s",
      gap: "1rem",
    },
    logo: {
      fontSize: "1.5rem",
      fontWeight: "bold",
      color: "var(--accent-color)",
      textDecoration: "none",
      fontFamily: "monospace",
      letterSpacing: "-1px",
      zIndex: 51,
      minWidth: "max-content",
    },
    linksDesktop: {
      display: "flex",
      gap: "2rem",
      alignItems: "center",
      justifySelf: "center",
    },
    rightSection: {
      display: "flex",
      alignItems: "center",
      gap: "1.5rem",
      justifySelf: "end",
    },
    profileContainer: {
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
      background: "rgba(56, 189, 248, 0.1)",
      padding: "0.5rem 1rem",
      borderRadius: "50px",
      border: "1px solid rgba(56, 189, 248, 0.2)",
      textDecoration: "none",
      color: "inherit",
      transition: "background 0.2s",
      cursor: "pointer",
    },
    profileImg: {
      width: "32px",
      height: "32px",
      borderRadius: "50%",
      objectFit: "cover",
      border: "2px solid var(--accent-color)",
    },
    divider: {
      width: "1px",
      height: "24px",
      background: "var(--border-color)",
    },
    linksMobile: {
      display: "none",
      flexDirection: "column",
      position: "absolute",
      top: "100%",
      left: 0,
      right: 0,
      background: "var(--nav-bg)",
      borderBottom: "1px solid var(--border-color)",
      padding: "1rem 2rem",
      gap: "1rem",
      backdropFilter: "blur(10px)",
    },
    linksMobileOpen: {
      display: "flex",
    },
    link: {
      color: "var(--text-secondary)",
      textDecoration: "none",
      fontWeight: "500",
      fontSize: "0.95rem",
      transition: "color 0.2s",
      cursor: "pointer",
    },
    toggleBtn: {
      background: "transparent",
      border: "1px solid var(--border-color)",
      color: "var(--accent-color)",
      borderRadius: "50%",
      width: "40px",
      height: "40px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      transition: "all 0.2s",
    },
    menuBtn: {
      background: "transparent",
      border: "none",
      color: "var(--accent-color)",
      cursor: "pointer",
      display: "none",
      padding: "0.5rem",
      zIndex: 51,
    },
  };

  const mediaQuery = window.matchMedia("(max-width: 900px)");
  const isMobile = mediaQuery.matches;

  // Render for Mobile
  if (isMobile) {
    return (
      <nav
        style={{
          ...styles.nav,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Link to="/" style={styles.logo}>
          &lt;Portfolio /&gt;
        </Link>

        {/* Mobile Right Controls */}
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <button
            onClick={toggleTheme}
            style={styles.toggleBtn}
            title="Switch Theme"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={styles.menuBtn}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Links Dropdown */}
        <div
          style={{
            ...styles.linksMobile,
            ...(mobileMenuOpen ? styles.linksMobileOpen : {}),
            zIndex: 100,
          }}
        >
          {/* Include Profile in Mobile Menu - Linked to #profile */}
          <a
            href="/#profile"
            style={{
              ...styles.link,
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 0",
              borderBottom: "1px solid var(--border-color)",
              marginBottom: "10px",
            }}
            onClick={() => setMobileMenuOpen(false)}
          >
            {profile?.profile_picture ? (
              <img
                src={`http://127.0.0.1:8000${profile.profile_picture}`}
                alt="Profile"
                style={styles.profileImg}
              />
            ) : (
              <span>⚡</span>
            )}
            <span>{profile?.name || "Profile"}</span>
          </a>

          {/* Home Link Removed */}
          <a
            href="/#skills"
            style={styles.link}
            onClick={() => setMobileMenuOpen(false)}
          >
            Skills
          </a>
          <a
            href="/#experience"
            style={styles.link}
            onClick={() => setMobileMenuOpen(false)}
          >
            Experience
          </a>
          <a
            href="/#projects"
            style={styles.link}
            onClick={() => setMobileMenuOpen(false)}
          >
            Projects
          </a>
          <a
            href="/#contact"
            style={styles.link}
            onClick={() => setMobileMenuOpen(false)}
          >
            Contact
          </a>
        </div>
      </nav>
    );
  }

  // Render for Desktop
  return (
    <nav style={styles.nav}>
      {/* LEFT: LOGO */}
      <Link to="/" style={styles.logo}>
        &lt;Portfolio /&gt;
      </Link>

      {/* CENTER: LINKS */}
      <div style={styles.linksDesktop}>
        {/* Home Link Removed */}
        <a
          href="/#skills"
          style={styles.link}
          onMouseEnter={(e) => (e.target.style.color = "var(--accent-color)")}
          onMouseLeave={(e) => (e.target.style.color = "var(--text-secondary)")}
        >
          Skills
        </a>
        <a
          href="/#experience"
          style={styles.link}
          onMouseEnter={(e) => (e.target.style.color = "var(--accent-color)")}
          onMouseLeave={(e) => (e.target.style.color = "var(--text-secondary)")}
        >
          Experience
        </a>
        <a
          href="/#projects"
          style={styles.link}
          onMouseEnter={(e) => (e.target.style.color = "var(--accent-color)")}
          onMouseLeave={(e) => (e.target.style.color = "var(--text-secondary)")}
        >
          Projects
        </a>
        <a
          href="/#contact"
          style={styles.link}
          onMouseEnter={(e) => (e.target.style.color = "var(--accent-color)")}
          onMouseLeave={(e) => (e.target.style.color = "var(--text-secondary)")}
        >
          Contact
        </a>
      </div>

      {/* RIGHT: PROFILE + TOGGLE */}
      <div style={styles.rightSection}>
        {/* Profile Link to #profile */}
        <a href="/#profile" style={styles.profileContainer}>
          {profile?.profile_picture ? (
            <img
              src={`http://127.0.0.1:8000${profile.profile_picture}`}
              alt="Profile"
              style={styles.profileImg}
            />
          ) : (
            <span style={{ fontSize: "1.2rem" }}>⚡</span>
          )}
          <span style={{ fontSize: "0.9rem", fontWeight: "600" }}>
            {profile?.name || "Me"}
          </span>
        </a>

        <div style={styles.divider}></div>

        <button
          onClick={toggleTheme}
          style={styles.toggleBtn}
          title="Switch Theme"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
