import React from 'react';

const Footer = () => (
    <footer style={{ 
        textAlign: 'center', 
        padding: '2rem', 
        color: 'var(--text-secondary)', // Adaptive color
        borderTop: '1px solid var(--border-color)', // Adaptive border
        fontSize: '0.9rem', 
        marginTop: 'auto',
        background: 'var(--bg-primary)',
        transition: 'background 0.3s, color 0.3s, border-color 0.3s'
    }}>
        <p>
            © {new Date().getFullYear()} <strong>Portfolio</strong>. All rights reserved.
        </p>
    </footer>
);

export default Footer;