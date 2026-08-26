import React, { useContext } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
    LayoutDashboard, LogOut, User, Code2, Briefcase, 
    FolderGit2, Award, GraduationCap, Mail, Terminal, Home as HomeIcon, ChevronRight
} from 'lucide-react';
import '../styles/Home.css';

const AdminLayout = () => {
    const { logout, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
        { path: '/admin/profile', label: 'Profile Identity', icon: <User size={18} /> },
        { path: '/admin/skills', label: 'Tech Skills', icon: <Code2 size={18} /> },
        { path: '/admin/experience', label: 'Experience Track', icon: <Briefcase size={18} /> },
        { path: '/admin/projects', label: 'Projects Showcase', icon: <FolderGit2 size={18} /> },
        { path: '/admin/education', label: 'Education', icon: <GraduationCap size={18} /> },
        { path: '/admin/certifications', label: 'Certifications', icon: <Award size={18} /> },
        { path: '/admin/contact-info', label: 'Contact Info', icon: <Terminal size={18} /> },
        { path: '/admin/messages', label: 'Inbox Messages', icon: <Mail size={18} /> },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
            {/* Ambient Neural Grid */}
            <div className="neural-background">
                <div className="neural-grid"></div>
            </div>

            {/* Sidebar */}
            <aside style={{
                width: '270px',
                background: 'var(--bg-card)',
                borderRight: '1px solid var(--border-color)',
                backdropFilter: 'blur(16px)',
                display: 'flex',
                flexDirection: 'column',
                padding: '1.5rem 1.25rem',
                position: 'fixed',
                height: '100vh',
                boxSizing: 'border-box',
                zIndex: 10
            }}>
                {/* Brand Header */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginBottom: '2rem',
                    paddingBottom: '1rem',
                    borderBottom: '1px solid var(--border-color)'
                }}>
                    <img 
                        src="/favicon.svg" 
                        alt="KT Logo" 
                        style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '10px',
                            boxShadow: '0 0 15px rgba(0, 242, 254, 0.4)'
                        }} 
                    />
                    <div>
                        <div style={{ fontWeight: '800', fontSize: '1.1rem' }}>
                            Kuldeep<span style={{ color: 'var(--accent-cyan)' }}>.Admin</span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Control Panel v2.0
                        </div>
                    </div>
                </div>

                {/* Navigation Items */}
                <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem', overflowY: 'auto' }}>
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link 
                                key={item.path} 
                                to={item.path} 
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '0.7rem 1rem',
                                    borderRadius: '12px',
                                    textDecoration: 'none',
                                    color: isActive ? '#000' : 'var(--text-secondary)',
                                    background: isActive 
                                        ? 'linear-gradient(135deg, var(--accent-cyan), var(--accent-blue))' 
                                        : 'transparent',
                                    fontWeight: isActive ? '700' : '600',
                                    fontSize: '0.9rem',
                                    transition: 'all 0.2s ease',
                                    boxShadow: isActive ? 'var(--glow-cyan)' : 'none'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    {item.icon}
                                    <span>{item.label}</span>
                                </div>
                                {isActive && <ChevronRight size={16} />}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Actions: View Site & Logout */}
                <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    <button 
                        onClick={() => navigate('/')} 
                        className="btn-secondary"
                        style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
                    >
                        <HomeIcon size={16} />
                        <span>Public Site</span>
                    </button>

                    <button 
                        onClick={handleLogout} 
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.6rem',
                            padding: '0.65rem',
                            borderRadius: '12px',
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            color: '#ef4444',
                            fontWeight: '700',
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        <LogOut size={16} />
                        <span>Terminate Session</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main style={{
                marginLeft: '270px',
                flex: 1,
                padding: '2.5rem',
                position: 'relative',
                zIndex: 1,
                maxWidth: '1200px'
            }}>
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;