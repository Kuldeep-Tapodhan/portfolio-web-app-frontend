import React, { useState, useContext } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
    LayoutDashboard, LogOut, User, Code2, Briefcase, 
    FolderGit2, Award, GraduationCap, Mail, Terminal, Home as HomeIcon, ChevronRight, Menu, X
} from 'lucide-react';
import '../styles/Home.css';

const AdminLayout = () => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

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
        <div className="admin-root-container">
            {/* Ambient Neural Grid */}
            <div className="neural-background">
                <div className="neural-grid"></div>
            </div>

            {/* Mobile Top App Bar (Visible on <= 992px) */}
            <header className="admin-mobile-header">
                <div className="admin-brand">
                    <img 
                        src="/favicon.svg" 
                        alt="KT Logo" 
                        className="admin-brand-logo" 
                    />
                    <span className="admin-brand-title">
                        Kuldeep<span className="brand-highlight">.Admin</span>
                    </span>
                </div>
                
                <button
                    onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                    className="admin-mobile-toggle"
                    title="Toggle Admin Navigation"
                >
                    {mobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </header>

            <div className="admin-body">
                {/* Mobile Drawer Backdrop */}
                {mobileSidebarOpen && (
                    <div className="admin-sidebar-backdrop" onClick={() => setMobileSidebarOpen(false)} />
                )}

                {/* Sidebar Drawer */}
                <aside className={`admin-sidebar ${mobileSidebarOpen ? 'mobile-open' : ''}`}>
                    {/* Sidebar Header */}
                    <div className="sidebar-header">
                        <div className="admin-brand">
                            <img 
                                src="/favicon.svg" 
                                alt="KT Logo" 
                                className="admin-brand-logo"
                            />
                            <div>
                                <div className="admin-brand-title">
                                    Kuldeep<span className="brand-highlight">.Admin</span>
                                </div>
                                <div className="admin-version">Control Panel v2.4</div>
                            </div>
                        </div>

                        <button
                            onClick={() => setMobileSidebarOpen(false)}
                            className="mobile-close-btn"
                            title="Close Sidebar"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Navigation Items */}
                    <nav className="sidebar-nav">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link 
                                    key={item.path} 
                                    to={item.path} 
                                    onClick={() => setMobileSidebarOpen(false)}
                                    className={`sidebar-link ${isActive ? 'active' : ''}`}
                                >
                                    <div className="sidebar-link-content">
                                        {item.icon}
                                        <span>{item.label}</span>
                                    </div>
                                    {isActive && <ChevronRight size={16} />}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Bottom Actions */}
                    <div className="sidebar-footer">
                        <button 
                            onClick={() => { navigate('/'); setMobileSidebarOpen(false); }} 
                            className="btn-secondary sidebar-action-btn"
                        >
                            <HomeIcon size={16} />
                            <span>Public Website</span>
                        </button>

                        <button 
                            onClick={handleLogout} 
                            className="sidebar-logout-btn"
                        >
                            <LogOut size={16} />
                            <span>Terminate Session</span>
                        </button>
                    </div>
                </aside>

                {/* Main Dashboard Content Workspace */}
                <main className="admin-main-content">
                    <Outlet />
                </main>
            </div>

            {/* CSS styles for Admin Layout responsiveness */}
            <style>{`
                .admin-root-container {
                    display: flex;
                    flex-direction: column;
                    min-height: 100vh;
                    background: var(--bg-primary);
                    color: var(--text-primary);
                }
                .admin-mobile-header {
                    padding: 0.85rem 1.25rem;
                    background: var(--bg-card);
                    border-bottom: 1px solid var(--border-color);
                    backdrop-filter: blur(20px);
                    display: none;
                    align-items: center;
                    justify-content: space-between;
                    position: sticky;
                    top: 0;
                    z-index: 50;
                }
                .admin-brand {
                    display: flex;
                    align-items: center;
                    gap: 0.7rem;
                }
                .admin-brand-logo {
                    width: 34px;
                    height: 34px;
                    border-radius: 10px;
                    box-shadow: 0 0 15px rgba(0, 242, 254, 0.4);
                }
                .admin-brand-title {
                    font-weight: 800;
                    font-size: 1.05rem;
                }
                .admin-version {
                    font-size: 0.72rem;
                    color: var(--text-muted);
                }
                .admin-mobile-toggle {
                    background: var(--bg-card);
                    border: 1px solid var(--border-color);
                    color: var(--accent-cyan);
                    padding: 0.45rem;
                    border-radius: 10px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                }
                .admin-body {
                    display: flex;
                    flex: 1;
                    position: relative;
                }
                .admin-sidebar-backdrop {
                    position: fixed;
                    inset: 0;
                    background: rgba(0,0,0,0.6);
                    backdrop-filter: blur(4px);
                    z-index: 98;
                }
                .admin-sidebar {
                    width: 275px;
                    background: var(--bg-card);
                    border-right: 1px solid var(--border-color);
                    backdrop-filter: blur(24px);
                    display: flex;
                    flex-direction: column;
                    padding: 1.5rem 1.2rem;
                    position: fixed;
                    height: 100vh;
                    box-sizing: border-box;
                    z-index: 99;
                    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .sidebar-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 1.8rem;
                    padding-bottom: 1rem;
                    border-bottom: 1px solid var(--border-color);
                }
                .mobile-close-btn {
                    background: transparent;
                    border: none;
                    color: var(--text-muted);
                    cursor: pointer;
                    display: none;
                }
                .sidebar-nav {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 0.4rem;
                    overflow-y: auto;
                }
                .sidebar-link {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0.75rem 1rem;
                    border-radius: 12px;
                    text-decoration: none;
                    color: var(--text-secondary);
                    background: transparent;
                    font-weight: 600;
                    font-size: 0.9rem;
                    transition: all 0.2s ease;
                }
                .sidebar-link-content {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }
                .sidebar-link:hover {
                    background: rgba(0, 242, 254, 0.08);
                    color: var(--accent-cyan);
                }
                .sidebar-link.active {
                    color: #000;
                    background: linear-gradient(135deg, var(--accent-cyan), var(--accent-blue));
                    font-weight: 800;
                    box-shadow: var(--glow-cyan);
                }
                .sidebar-footer {
                    padding-top: 1rem;
                    border-top: 1px solid var(--border-color);
                    display: flex;
                    flex-direction: column;
                    gap: 0.6rem;
                }
                .sidebar-action-btn {
                    width: 100%;
                    justify-content: center;
                    font-size: 0.85rem;
                    padding: 0.6rem;
                }
                .sidebar-logout-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.6rem;
                    padding: 0.65rem;
                    border-radius: 12px;
                    background: rgba(239, 68, 68, 0.1);
                    border: 1px solid rgba(239, 68, 68, 0.3);
                    color: #ef4444;
                    font-weight: 700;
                    font-size: 0.85rem;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .sidebar-logout-btn:hover {
                    background: rgba(239, 68, 68, 0.2);
                }
                .admin-main-content {
                    margin-left: 275px;
                    flex: 1;
                    padding: 2.5rem;
                    position: relative;
                    z-index: 1;
                    max-width: 1200px;
                    width: calc(100% - 275px);
                }

                @media (max-width: 992px) {
                    .admin-mobile-header {
                        display: flex !important;
                    }
                    .admin-sidebar {
                        transform: translateX(-100%);
                        top: 0;
                        left: 0;
                    }
                    .admin-sidebar.mobile-open {
                        transform: translateX(0);
                    }
                    .admin-main-content {
                        margin-left: 0 !important;
                        width: 100% !important;
                        padding: 1.5rem 1rem !important;
                    }
                    .mobile-close-btn {
                        display: block !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default AdminLayout;