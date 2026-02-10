import React, { useContext } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
    Layout, LogOut, User, Code, Briefcase, 
    FolderGit2, Award, BookOpen, Mail, Terminal 
} from 'lucide-react';

const AdminLayout = () => {
    const { logout, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/admin', label: 'Dashboard', icon: <Layout size={20} /> },
        { path: '/admin/profile', label: 'Profile', icon: <User size={20} /> },
        { path: '/admin/skills', label: 'Skills', icon: <Code size={20} /> },
        { path: '/admin/experience', label: 'Experience', icon: <Briefcase size={20} /> },
        { path: '/admin/projects', label: 'Projects', icon: <FolderGit2 size={20} /> },
        { path: '/admin/education', label: 'Education', icon: <BookOpen size={20} /> },
        { path: '/admin/certifications', label: 'Certs', icon: <Award size={20} /> },
        { path: '/admin/contact-info', label: 'My Info', icon: <Terminal size={20} /> }, // Your details
        { path: '/admin/messages', label: 'Inbox', icon: <Mail size={20} /> }, // Incoming messages
    ];

    // --- Styles ---
    const styles = {
        container: { display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' },
        sidebar: {
            width: '260px',
            background: 'var(--bg-secondary)',
            borderRight: '1px solid #334155',
            display: 'flex',
            flexDirection: 'column',
            padding: '1.5rem',
            position: 'fixed',
            height: '100vh',
            boxSizing: 'border-box'
        },
        logo: {
            color: 'var(--accent-color)',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            marginBottom: '2.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
        },
        nav: { flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' },
        link: (isActive) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 12px',
            borderRadius: '6px',
            textDecoration: 'none',
            color: isActive ? 'var(--bg-primary)' : 'var(--text-secondary)',
            background: isActive ? 'var(--accent-color)' : 'transparent',
            fontWeight: isActive ? 'bold' : 'normal',
            transition: 'all 0.2s',
            cursor: 'pointer'
        }),
        content: {
            marginLeft: '260px', // Matches sidebar width
            flex: 1,
            padding: '2rem',
            maxWidth: '1200px'
        },
        logoutBtn: {
            marginTop: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'transparent',
            border: '1px solid var(--error-color)',
            color: 'var(--error-color)',
            padding: '10px',
            borderRadius: '6px',
            cursor: 'pointer',
            width: '100%'
        }
    };

    return (
        <div style={styles.container}>
            {/* Sidebar */}
            <div style={styles.sidebar}>
                <div style={styles.logo}>
                    <Terminal size={24} />
                    <span>DEV_PORTAL</span>
                </div>
                
                <nav style={styles.nav}>
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link 
                                key={item.path} 
                                to={item.path} 
                                style={styles.link(isActive)}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <button onClick={handleLogout} style={styles.logoutBtn}>
                    <LogOut size={18} />
                    <span>Terminate Session</span>
                </button>
            </div>

            {/* Main Content Area */}
            <div style={styles.content}>
                {/* <Outlet /> renders the specific page (Profile, Skills, etc.) here */}
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;