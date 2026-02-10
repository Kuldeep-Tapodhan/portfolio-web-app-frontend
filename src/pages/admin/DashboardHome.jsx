import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { 
    LayoutDashboard, FolderGit2, Cpu, Mail, Briefcase, 
    ArrowRight, MessageSquare, Plus, Clock, User, Award, Terminal
} from 'lucide-react';

const DashboardHome = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ projects: 0, skills: 0, messages: 0, experience: 0 });
    const [recentMessages, setRecentMessages] = useState([]);

    useEffect(() => { fetchAllStats(); }, []);

    const fetchAllStats = async () => {
        try {
            const [projRes, skillRes, msgRes, expRes] = await Promise.allSettled([
                api.get('/projects/'), api.get('/skills/'), api.get('/contacts/'), api.get('/experiences/') 
            ]);

            const getCount = (result) => {
                if (result.status === 'rejected') return 0;
                let data = result.value.data;
                if (data.data) data = data.data;
                if (data.results) data = data.results;
                return Array.isArray(data) ? data.length : 0;
            };

            let msgs = [];
            if (msgRes.status === 'fulfilled') {
                let data = msgRes.value.data;
                if (data.data) data = data.data;
                if (data.results) data = data.results;
                if (Array.isArray(data)) msgs = data;
            }
            msgs.sort((a, b) => b.id - a.id);
            setRecentMessages(msgs.slice(0, 3));

            setStats({ projects: getCount(projRes), skills: getCount(skillRes), messages: getCount(msgRes), experience: getCount(expRes) });

        } catch (error) { console.error(error); } finally { setLoading(false); }
    };

    // --- STYLES (UPDATED FOR LIGHT MODE) ---
    const styles = {
        container: { color: 'var(--text-primary)' },
        header: { marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent-color)' },
        
        grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' },
        
        // FIXED: Using variables instead of hardcoded hex codes
        statCard: {
            background: 'var(--bg-secondary)', 
            border: '1px solid var(--border-color)', 
            borderRadius: '12px', padding: '1.5rem',
            display: 'flex', alignItems: 'center', gap: '1.5rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            cursor: 'default'
        },
        
        iconBox: (color) => ({
            width: '60px', height: '60px', borderRadius: '12px',
            background: `rgba(${color}, 0.1)`, color: `rgb(${color})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        }),

        statNumber: { fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-primary)', margin: 0, lineHeight: 1 },
        statLabel: { color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '5px' },

        sectionTitle: { fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' },
        
        msgList: { display: 'flex', flexDirection: 'column', gap: '1rem' },
        msgItem: {
            background: 'var(--bg-secondary)', // Adaptive
            border: '1px solid var(--border-color)',
            padding: '1rem', borderRadius: '8px', borderLeft: '4px solid var(--accent-color)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        },
        msgName: { fontWeight: 'bold', color: 'var(--text-primary)', display:'block' },
        msgText: { color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '400px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
        
        actionsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' },
        actionBtn: {
            background: 'var(--bg-secondary)', // Adaptive
            border: '1px dashed var(--border-color)', 
            color: 'var(--accent-color)', padding: '1rem', borderRadius: '8px', 
            textAlign: 'center', textDecoration: 'none', fontSize: '0.9rem',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
            transition: 'all 0.2s'
        }
    };

    if (loading) return <div>Loading System Stats...</div>;

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <LayoutDashboard size={32} />
                <h1>System Overview</h1>
            </div>

            <div style={styles.grid}>
                <div style={styles.statCard}>
                    <div style={styles.iconBox('56, 189, 248')}> <FolderGit2 size={28} /> </div>
                    <div><h2 style={styles.statNumber}>{stats.projects}</h2><div style={styles.statLabel}>Active Projects</div></div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.iconBox('168, 85, 247')}> <Cpu size={28} /> </div>
                    <div><h2 style={styles.statNumber}>{stats.skills}</h2><div style={styles.statLabel}>Skill Nodes</div></div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.iconBox('34, 197, 94')}> <Briefcase size={28} /> </div>
                    <div><h2 style={styles.statNumber}>{stats.experience}</h2><div style={styles.statLabel}>Experiences</div></div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.iconBox('239, 68, 68')}> <Mail size={28} /> </div>
                    <div><h2 style={styles.statNumber}>{stats.messages}</h2><div style={styles.statLabel}>Inbox Messages</div></div>
                </div>
            </div>

            <div style={{display:'grid', gridTemplateColumns:'2fr 1fr', gap:'2rem'}}>
                <div>
                    <h3 style={styles.sectionTitle}><MessageSquare size={20}/> Recent Inbox Activity</h3>
                    <div style={styles.msgList}>
                        {recentMessages.length === 0 ? <div style={{color:'var(--text-secondary)', fontStyle:'italic'}}>No messages yet.</div> : recentMessages.map(msg => (
                            <div key={msg.id} style={styles.msgItem}>
                                <div><span style={styles.msgName}>{msg.name}</span><span style={styles.msgText}>{msg.message}</span></div>
                                <div style={{fontSize:'0.8rem', color:'var(--text-secondary)', display:'flex', alignItems:'center', gap:'5px'}}><Clock size={14}/>{new Date(msg.created_at || Date.now()).toLocaleDateString()}</div>
                            </div>
                        ))}
                        <Link to="/admin/messages" style={{marginTop:'10px', color:'var(--accent-color)', textDecoration:'none', display:'flex', alignItems:'center', gap:'5px', fontSize:'0.9rem'}}>View All Messages <ArrowRight size={16}/></Link>
                    </div>
                </div>

                <div>
                    <h3 style={styles.sectionTitle}><Plus size={20}/> Quick Actions</h3>
                    <div style={styles.actionsGrid}>
                        <Link to="/admin/projects" style={styles.actionBtn}><FolderGit2 /> Add Project</Link>
                        <Link to="/admin/skills" style={styles.actionBtn}><Cpu /> Add Skill</Link>
                        <Link to="/admin/experience" style={styles.actionBtn}><Briefcase /> Add Experience</Link>
                        <Link to="/admin/certifications" style={styles.actionBtn}><Award /> Add Certification</Link>
                        <Link to="/admin/profile" style={styles.actionBtn}><User /> Public Identity</Link>
                        <Link to="/admin/contact-info" style={styles.actionBtn}><Terminal /> Contact Info</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;