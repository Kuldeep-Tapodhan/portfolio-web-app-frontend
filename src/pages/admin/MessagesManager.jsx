import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Mail, Trash2, User, Clock, MessageSquare, AlertCircle } from 'lucide-react';

const MessagesManager = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const response = await api.get('/contacts/'); 
            let data = response.data;
            if (data.data) data = data.data;
            if (data.results) data = data.results;

            if (Array.isArray(data)) {
                // Sort by newest first (assuming ID increments with time)
                setMessages(data.sort((a, b) => b.id - a.id));
            }
        } catch (error) {
            console.error("Failed to load messages", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this message permanently?")) return;
        try {
            await api.delete(`/contacts/${id}/`);
            setMessages(messages.filter(msg => msg.id !== id));
        } catch (error) {
            alert("Error deleting: " + (error.response?.data?.message || "Check console"));
        }
    };

    // --- Styles ---
    const styles = {
        container: { color: 'var(--text-primary)', maxWidth: '900px', margin: '0 auto' },
        
        header: { 
            marginBottom: '2rem', 
            paddingBottom: '1rem', 
            borderBottom: '1px solid #334155',
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            color: 'var(--accent-color)' 
        },
        
        // Grid Layout
        grid: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
        
        // Message Card
        card: {
            background: 'var(--bg-secondary)', 
            border: '1px solid #334155', 
            borderRadius: '12px', 
            padding: '1.5rem',
            position: 'relative',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.2s ease, border-color 0.2s',
        },
        
        // Header Section of Card (Sender Info)
        cardHeader: { 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start',
            marginBottom: '1rem' 
        },
        
        senderGroup: { display: 'flex', gap: '12px', alignItems: 'center' },
        
        avatar: { 
            width: '42px', height: '42px', borderRadius: '50%', 
            background: 'rgba(56, 189, 248, 0.1)', 
            color: 'var(--accent-color)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid rgba(56, 189, 248, 0.2)'
        },
        
        senderName: { 
            fontSize: '1.1rem', 
            fontWeight: 'bold', 
            color: 'white', 
            margin: '0 0 2px 0' 
        },
        
        senderEmail: { 
            fontSize: '0.9rem', 
            color: '#94a3b8', 
            textDecoration: 'none',
            borderBottom: '1px dashed #475569'
        },
        
        metaInfo: { 
            textAlign: 'right',
            fontSize: '0.8rem', 
            color: '#64748b',
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '4px'
        },

        // Message Body
        messageBody: {
            background: '#0f172a',
            padding: '1.2rem',
            borderRadius: '8px',
            border: '1px solid #1e293b',
            color: '#e2e8f0',
            lineHeight: '1.6',
            fontSize: '0.95rem',
            whiteSpace: 'pre-wrap', // Preserves paragraphs
            fontFamily: 'sans-serif'
        },

        // Actions
        actions: { 
            marginTop: '1rem', 
            display: 'flex', 
            justifyContent: 'flex-end',
            gap: '10px'
        },

        deleteBtn: {
            background: 'transparent', 
            border: '1px solid #ef4444', 
            color: '#ef4444', 
            cursor: 'pointer', 
            padding: '8px 12px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.85rem',
            fontWeight: 'bold',
            transition: 'all 0.2s',
        },

        // Empty State
        emptyState: {
            textAlign: 'center', 
            padding: '5rem 2rem', 
            color: '#64748b', 
            border: '2px dashed #334155', 
            borderRadius: '12px',
            background: 'rgba(15, 23, 42, 0.5)'
        }
    };

    if (loading) return <div>Loading Inbox...</div>;

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <Mail size={28} />
                <h1 style={{margin:0, fontSize:'1.8rem'}}>Inbox</h1>
                <span style={{
                    background: 'var(--accent-color)', color: '#0f172a', 
                    padding: '2px 8px', borderRadius: '12px', fontSize: '0.9rem', fontWeight:'bold'
                }}>
                    {messages.length}
                </span>
            </div>

            <div style={styles.grid}>
                {messages.length === 0 ? (
                    <div style={styles.emptyState}>
                        <MessageSquare size={64} style={{marginBottom:'1rem', opacity:0.3}}/>
                        <h3 style={{color:'#cbd5e1', marginTop:0}}>No Messages Yet</h3>
                        <p>When someone contacts you via your portfolio, it will show up here.</p>
                    </div>
                ) : (
                    messages.map(msg => (
                        <div key={msg.id} style={styles.card}>
                            {/* Header: Name, Email, Date */}
                            <div style={styles.cardHeader}>
                                <div style={styles.senderGroup}>
                                    <div style={styles.avatar}>
                                        <User size={20}/>
                                    </div>
                                    <div>
                                        <h3 style={styles.senderName}>{msg.name}</h3>
                                        <a href={`mailto:${msg.email}`} style={styles.senderEmail}>{msg.email}</a>
                                    </div>
                                </div>
                                <div style={styles.metaInfo}>
                                    <div style={{display:'flex', alignItems:'center', gap:'5px', color:'var(--accent-color)'}}>
                                        <Clock size={14} />
                                        {msg.created_at ? new Date(msg.created_at).toLocaleDateString() : 'Received'}
                                    </div>
                                    <span style={{fontSize:'0.75rem', opacity:0.7}}>ID: #{msg.id}</span>
                                </div>
                            </div>

                            {/* Message Content */}
                            <div style={styles.messageBody}>
                                {msg.message}
                            </div>

                            {/* Delete Action */}
                            <div style={styles.actions}>
                                <button 
                                    onClick={() => handleDelete(msg.id)} 
                                    style={styles.deleteBtn}
                                    title="Delete Permanently"
                                >
                                    <Trash2 size={16} /> Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MessagesManager;