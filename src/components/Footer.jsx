import React from 'react';
import { Cpu, Github, Linkedin, Twitter, Code2, Heart } from 'lucide-react';

const Footer = () => (
  <footer style={{
    borderTop: '1px solid var(--border-color)',
    padding: '3rem 2rem 2rem 2rem',
    background: 'var(--bg-secondary)',
    backdropFilter: 'blur(16px)',
    marginTop: '4rem'
  }}>
    <div style={{
      maxWidth: '1280px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-indigo))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#000'
          }}>
            <Cpu size={18} />
          </div>
          <span style={{ fontWeight: '800', fontSize: '1.1rem' }}>
            Kuldeep<span style={{ color: 'var(--accent-cyan)' }}>.AI</span>
          </span>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <a href="https://github.com/Kuldeep-Tapodhan" target="_blank" rel="noopener noreferrer" style={socialIconStyle}>
            <Github size={18} />
          </a>
          <a href="https://www.linkedin.com/in/kuldeep-tapodhan-780701251/" target="_blank" rel="noopener noreferrer" style={socialIconStyle}>
            <Linkedin size={18} />
          </a>
          <a href="https://x.com/deeptapodhan143" target="_blank" rel="noopener noreferrer" style={socialIconStyle}>
            <Twitter size={18} />
          </a>
        </div>
      </div>

      <div style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        paddingTop: '1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.85rem',
        color: 'var(--text-muted)',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <span>© {new Date().getFullYear()} Kuldeep Tapodhan. All rights reserved.</span>
        <span>Built with React, Vite, Django REST Framework & Neural Glass UI</span>
      </div>
    </div>
  </footer>
);

const socialIconStyle = {
  color: 'var(--text-secondary)',
  textDecoration: 'none',
  padding: '0.5rem',
  borderRadius: '8px',
  background: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid var(--border-color)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.2s'
};

export default Footer;