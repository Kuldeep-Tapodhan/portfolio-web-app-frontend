import React from 'react';
import { Cpu, Github, Linkedin, Twitter, Heart, ArrowUp } from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer-container">
      <div className="footer-content">
        {/* Top Footer Row */}
        <div className="footer-main-row">
          <div className="footer-brand-col">
            <div className="footer-brand-logo">
              <span className="footer-brand-title">
                Kuldeep<span className="brand-highlight">.AI</span>
              </span>
            </div>
            <p className="footer-tagline">
              Architecting production AI/ML applications, multi-agent voice workflows, and robust full-stack software systems.
            </p>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-col-title">Navigation</h4>
            <div className="footer-nav-grid">
              <a href="#about" className="footer-link">About</a>
              <a href="#projects" className="footer-link">Projects</a>
              <a href="#skills" className="footer-link">Skills</a>
              <a href="#experience" className="footer-link">Experience</a>
              <a href="#education" className="footer-link">Education</a>
              <a href="#certifications" className="footer-link">Certifications</a>
              <a href="#contact" className="footer-link">Contact</a>
            </div>
          </div>

          <div className="footer-social-col">
            <h4 className="footer-col-title">Connect</h4>
            <div className="footer-social-badges">
              <a 
                href="https://github.com/Kuldeep-Tapodhan" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-badge"
                title="GitHub Profile"
              >
                <Github size={18} />
                <span>GitHub</span>
              </a>
              <a 
                href="https://www.linkedin.com/in/kuldeep-tapodhan-780701251/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-badge"
                title="LinkedIn Profile"
              >
                <Linkedin size={18} />
                <span>LinkedIn</span>
              </a>
              <a 
                href="https://x.com/deeptapodhan143" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-badge"
                title="X / Twitter Profile"
              >
                <Twitter size={18} />
                <span>Twitter</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <div className="footer-copyright">
            © {new Date().getFullYear()} Kuldeep Tapodhan. Built with React, Vite & DRF.
          </div>

          <button onClick={scrollToTop} className="scroll-top-btn" title="Scroll to Top">
            <span>Back to Top</span>
            <ArrowUp size={16} />
          </button>
        </div>
      </div>

      <style>{`
        .footer-container {
          border-top: 1px solid var(--border-color);
          padding: 4rem 1.5rem 2rem 1.5rem;
          background: var(--bg-secondary);
          backdrop-filter: blur(20px);
          margin-top: 5rem;
          position: relative;
        }
        .footer-content {
          max-width: 1280px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 3rem;
        }
        .footer-main-row {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr;
          gap: 3rem;
        }
        @media (max-width: 900px) {
          .footer-main-row {
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }
        }
        .footer-brand-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }
        .footer-logo-icon {
          width: 38px;
          height: 38px;
          border-radius: 12px;
          background: linear-gradient(135deg, var(--accent-cyan), var(--accent-indigo));
          display: flex;
          align-items: center;
          justify-content: center;
          color: #000;
          box-shadow: 0 0 15px rgba(0, 242, 254, 0.3);
        }
        .footer-brand-title {
          font-weight: 800;
          font-size: 1.25rem;
        }
        .footer-tagline {
          color: var(--text-secondary);
          font-size: 0.92rem;
          line-height: 1.6;
          max-width: 420px;
        }
        .footer-col-title {
          font-size: 0.9rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--text-muted);
          margin-bottom: 1.2rem;
        }
        .footer-nav-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.6rem 1rem;
        }
        .footer-link {
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 600;
          transition: color 0.2s;
        }
        .footer-link:hover {
          color: var(--accent-cyan);
        }
        .footer-social-badges {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }
        .social-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.65rem;
          padding: 0.55rem 1rem;
          border-radius: 10px;
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          text-decoration: none;
          font-size: 0.88rem;
          font-weight: 600;
          transition: all 0.3s ease;
          width: max-content;
        }
        .social-badge:hover {
          border-color: var(--accent-cyan);
          color: var(--accent-cyan);
          transform: translateX(4px);
          box-shadow: 0 0 15px rgba(0, 242, 254, 0.15);
        }
        .footer-bottom-bar {
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          padding-top: 1.8rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
          font-size: 0.85rem;
          color: var(--text-muted);
        }
        .scroll-top-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          padding: 0.5rem 1rem;
          border-radius: 9999px;
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .scroll-top-btn:hover {
          border-color: var(--accent-cyan);
          color: var(--accent-cyan);
          transform: translateY(-2px);
        }
      `}</style>
    </footer>
  );
};

export default Footer;