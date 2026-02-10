import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Terminal, Save, MapPin, Mail, Phone, Globe, Github, Linkedin, Twitter, Code as CodeIcon } from 'lucide-react';

const ContactInfoManager = () => {
    const [loading, setLoading] = useState(true);
    const [existingId, setExistingId] = useState(null); // Tracks if we are Editing or Creating

    // Initial Empty State
    const [formData, setFormData] = useState({
        address: '',
        email: '',
        phone: '',
        description: '',
        linkedin_link: '',
        github_link: '',
        twitter_link: '',
        leetcode_link: ''
    });

    // --- 1. Fetch Current Info on Load ---
    useEffect(() => {
        fetchContactInfo();
    }, []);

    const fetchContactInfo = async () => {
        try {
            // FIXED: Removed hyphen to match your urls.py
            const response = await api.get('/contactinfo/'); 
            
            console.log("Current Profile Data:", response.data);

            let data = response.data;

            // Handle different API structures
            if (data.data) data = data.data;         
            if (data.results) data = data.results;   

            // If we find data, fill the form automatically!
            if (Array.isArray(data) && data.length > 0) {
                const info = data[0]; // Take the first profile found
                setExistingId(info.id);
                setFormData({
                    address: info.address || '',
                    email: info.email || '',
                    phone: info.phone || '',
                    description: info.description || '',
                    linkedin_link: info.linkedin_link || '',
                    github_link: info.github_link || '',
                    twitter_link: info.twitter_link || '',
                    leetcode_link: info.leetcode_link || ''
                });
            }
        } catch (error) {
            console.error("Failed to load contact info", error);
        } finally {
            setLoading(false);
        }
    };

    // --- 2. Save Changes (Update or Create) ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (existingId) {
                // UPDATE existing profile
                // FIXED: URL updated
                await api.put(`/contactinfo/${existingId}/`, formData);
                alert("Profile updated successfully!");
            } else {
                // CREATE new profile (first time only)
                // FIXED: URL updated
                const response = await api.post('/contactinfo/', formData);
                setExistingId(response.data.id || response.data.data.id);
                alert("Profile created successfully!");
            }
            // Reload to be sure
            fetchContactInfo();
        } catch (error) {
            alert("Error saving: " + (error.response?.data?.message || "Check console"));
        }
    };

    // --- Styles ---
    const styles = {
        container: { color: 'var(--text-primary)', maxWidth: '800px' },
        header: { marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent-color)' },
        
        formCard: {
            background: 'var(--bg-secondary)', 
            padding: '2rem', 
            borderRadius: '12px', 
            border: '1px solid #334155',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        },
        
        sectionTitle: { 
            color: 'white', borderBottom: '1px solid #334155', paddingBottom: '10px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' 
        },

        grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' },
        fullWidth: { gridColumn: '1 / -1', marginBottom: '1.5rem' },

        label: { display:'block', marginBottom:'8px', fontSize:'0.9rem', color:'#94a3b8' },
        input: {
            width: '100%', background: '#0f172a', border: '1px solid #334155', color: 'white', padding: '12px', borderRadius: '6px', boxSizing: 'border-box', fontSize: '1rem'
        },
        textarea: {
            width: '100%', background: '#0f172a', border: '1px solid #334155', color: 'white', padding: '12px', borderRadius: '6px', minHeight: '120px', fontFamily: 'inherit', boxSizing: 'border-box', fontSize: '1rem'
        },
        
        submitBtn: {
            background: 'var(--accent-color)', color: '#0f172a', padding: '12px 24px', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', marginTop: '1rem'
        }
    };

    if (loading) return <div>Loading Profile Data...</div>;

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <Terminal size={32} />
                <h1>My Contact Information</h1>
            </div>

            <form onSubmit={handleSubmit} style={styles.formCard}>
                
                {/* General Info */}
                <h3 style={styles.sectionTitle}><Globe size={20}/> General Details</h3>
                <div style={styles.grid}>
                    <div>
                        <label style={styles.label}><Mail size={14} style={{display:'inline', marginRight:'5px'}}/> Email</label>
                        <input 
                            type="email" style={styles.input} required
                            value={formData.email}
                            onChange={e => setFormData({...formData, email: e.target.value})}
                        />
                    </div>
                    <div>
                        <label style={styles.label}><Phone size={14} style={{display:'inline', marginRight:'5px'}}/> Phone</label>
                        <input 
                            type="text" style={styles.input} required
                            value={formData.phone}
                            onChange={e => setFormData({...formData, phone: e.target.value})}
                        />
                    </div>
                </div>

                <div style={styles.fullWidth}>
                    <label style={styles.label}><MapPin size={14} style={{display:'inline', marginRight:'5px'}}/> Address</label>
                    <textarea 
                        style={{...styles.textarea, minHeight: '80px'}} required
                        value={formData.address}
                        onChange={e => setFormData({...formData, address: e.target.value})}
                    />
                </div>

                <div style={styles.fullWidth}>
                    <label style={styles.label}>About Me (Short Bio)</label>
                    <textarea 
                        style={styles.textarea} required
                        placeholder="I am a passionate Python Developer..."
                        value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                    />
                </div>

                {/* Social Links */}
                <h3 style={styles.sectionTitle}><Globe size={20}/> Social Profiles</h3>
                <div style={styles.grid}>
                    <div>
                        <label style={styles.label}><Linkedin size={14} style={{display:'inline', marginRight:'5px'}}/> LinkedIn URL</label>
                        <input 
                            type="url" style={styles.input}
                            value={formData.linkedin_link}
                            onChange={e => setFormData({...formData, linkedin_link: e.target.value})}
                        />
                    </div>
                    <div>
                        <label style={styles.label}><Github size={14} style={{display:'inline', marginRight:'5px'}}/> GitHub URL</label>
                        <input 
                            type="url" style={styles.input}
                            value={formData.github_link}
                            onChange={e => setFormData({...formData, github_link: e.target.value})}
                        />
                    </div>
                    <div>
                        <label style={styles.label}><Twitter size={14} style={{display:'inline', marginRight:'5px'}}/> Twitter/X URL</label>
                        <input 
                            type="url" style={styles.input}
                            value={formData.twitter_link}
                            onChange={e => setFormData({...formData, twitter_link: e.target.value})}
                        />
                    </div>
                    <div>
                        <label style={styles.label}><CodeIcon size={14} style={{display:'inline', marginRight:'5px'}}/> LeetCode URL</label>
                        <input 
                            type="url" style={styles.input}
                            value={formData.leetcode_link}
                            onChange={e => setFormData({...formData, leetcode_link: e.target.value})}
                        />
                    </div>
                </div>

                <button type="submit" style={styles.submitBtn}>
                    <Save size={20} /> {existingId ? 'Update Profile' : 'Create Profile'}
                </button>
            </form>
        </div>
    );
};

export default ContactInfoManager;