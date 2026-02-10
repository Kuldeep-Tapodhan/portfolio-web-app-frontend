import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Trash2, Plus, Code, Layers, Save, Edit, X } from 'lucide-react';

const SkillsManager = () => {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null); // Tracks which ID we are editing
    
    // Mapped from your Django Model
    const CATEGORIES = {
        'LANG': 'Programming Languages',
        'WEB': 'Web Technologies',
        'AI':   'AI/ML Technologies',
        'SOFT': 'Soft Skills'
    };

    const initialFormState = {
        name: '',
        category: 'LANG',
        percentage: 50
    };

    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        fetchSkills();
    }, []);

    const fetchSkills = async () => {
        try {
            const response = await api.get('/skills/');
            // Handle different API response structures just in case
            let data = response.data;
            if (data.data) data = data.data;
            if (data.results) data = data.results;
            
            if (Array.isArray(data)) {
                setSkills(data);
            }
        } catch (error) {
            console.error("Failed to load skills", error);
        } finally {
            setLoading(false);
        }
    };

    // --- Actions ---

    const handleEditClick = (skill) => {
        setEditingId(skill.id);
        setFormData({
            name: skill.name,
            category: skill.category,
            percentage: skill.percentage
        });
        // Scroll to top to see the form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData(initialFormState);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = new FormData();
            payload.append('name', formData.name);
            payload.append('category', formData.category);
            payload.append('percentage', formData.percentage);

            if (editingId) {
                // Update existing (PUT)
                await api.put(`/skills/${editingId}/`, payload);
            } else {
                // Create new (POST)
                await api.post('/skills/', payload);
            }
            
            // Reset and reload
            handleCancelEdit();
            fetchSkills(); 
        } catch (error) {
            alert("Error saving skill: " + (error.response?.data?.message || "Unknown error"));
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this skill?")) return;
        try {
            await api.delete(`/skills/${id}/`);
            fetchSkills(); 
        } catch (error) {
            console.error("Failed to delete", error);
        }
    };

    // --- Styles ---
    const styles = {
        container: { color: 'white' }, // Force white text since we are in dark mode
        header: { marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px', color: '#38bdf8' },
        grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' },
        
        card: {
            background: '#0f172a', // Hardcoded Dark BG
            border: '1px solid #334155',
            borderRadius: '8px',
            padding: '1.5rem',
            position: 'relative',
            transition: 'border-color 0.2s',
        },
        // Highlight the card being edited
        activeCard: {
            borderColor: '#38bdf8',
            boxShadow: '0 0 15px rgba(56, 189, 248, 0.1)'
        },
        cardHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' },
        cardTitle: { margin: 0, fontSize: '1.1rem', fontWeight: 'bold', color: 'white' },
        actions: { display: 'flex', gap: '8px' },
        
        iconBtn: {
            background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px', display:'flex', alignItems:'center'
        },
        editBtn: { color: '#38bdf8' },
        // FIXED: Use explicit red hex code
        deleteBtn: { color: '#ef4444' },

        badge: {
            fontSize: '0.75rem',
            background: 'rgba(56, 189, 248, 0.1)', 
            color: '#38bdf8',
            padding: '4px 8px',
            borderRadius: '4px',
            display: 'inline-block',
            marginBottom: '1rem',
            border: '1px solid rgba(56, 189, 248, 0.3)'
        },
        progressBarBg: { height: '6px', background: '#1e293b', borderRadius: '4px', overflow: 'hidden', marginTop: '10px' },
        
        // FIXED: The background color logic
        progressBarFill: (val) => ({
            height: '100%', 
            width: `${val}%`, 
            // Replaced missing var(--success-color) with hex #22c55e (Green)
            // Replaced var(--accent-color) with hex #38bdf8 (Blue)
            background: val > 80 ? '#22c55e' : '#38bdf8', 
            transition: 'width 0.5s'
        }),

        formCard: {
            background: '#1e293b', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', border: '1px dashed #38bdf8'
        },
        formGroup: { display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' },
        input: {
            background: '#0f172a', border: '1px solid #334155', color: 'white', padding: '10px', borderRadius: '4px', flex: 1, minWidth: '150px'
        },
        select: {
            background: '#0f172a', border: '1px solid #334155', color: 'white', padding: '10px', borderRadius: '4px', flex: 1, minWidth: '150px', cursor: 'pointer'
        },
        btnGroup: { display: 'flex', gap: '10px' },
        submitBtn: {
            background: '#38bdf8', color: '#0f172a', padding: '10px 20px', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
        },
        cancelBtn: {
            background: 'transparent', color: '#94a3b8', padding: '10px 20px', border: '1px solid #334155', borderRadius: '4px', cursor: 'pointer'
        }
    };

    if (loading) return <div>Loading Matrix...</div>;

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <Code />
                <h1>Skills Matrix</h1>
            </div>

            {/* Form Area */}
            <div style={styles.formCard}>
                <h3 style={{marginTop:0, display:'flex', alignItems:'center', gap:'10px', color: editingId ? '#38bdf8' : 'white'}}>
                    {editingId ? <Edit size={18}/> : <Plus size={18}/>} 
                    {editingId ? 'Update Module' : 'Add New Module'}
                </h3>
                
                <form onSubmit={handleSubmit} style={styles.formGroup}>
                    {/* Name */}
                    <div style={{flex: 2}}>
                        <label style={{display:'block', marginBottom:'5px', fontSize:'0.8rem', color:'#94a3b8'}}>Skill Name</label>
                        <input 
                            type="text" 
                            style={styles.input} 
                            placeholder="e.g. Django"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            required
                        />
                    </div>

                    {/* Category */}
                    <div style={{flex: 2}}>
                        <label style={{display:'block', marginBottom:'5px', fontSize:'0.8rem', color:'#94a3b8'}}>Category</label>
                        <select 
                            style={styles.select}
                            value={formData.category}
                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                        >
                            {Object.entries(CATEGORIES).map(([key, label]) => (
                                <option key={key} value={key}>{label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Percentage */}
                    <div style={{flex: 1}}>
                        <label style={{display:'block', marginBottom:'5px', fontSize:'0.8rem', color:'#94a3b8'}}>Percentage %</label>
                        <input 
                            type="number" 
                            style={styles.input} 
                            min="1" max="100"
                            value={formData.percentage}
                            onChange={(e) => setFormData({...formData, percentage: e.target.value})}
                        />
                    </div>
                    
                    {/* Buttons */}
                    <div style={styles.btnGroup}>
                        {editingId && (
                            <button type="button" onClick={handleCancelEdit} style={styles.cancelBtn}>
                                Cancel
                            </button>
                        )}
                        <button type="submit" style={styles.submitBtn}>
                            <Save size={18} /> {editingId ? 'Update' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>

            {/* List */}
            <div style={styles.grid}>
                {skills.map(skill => (
                    <div 
                        key={skill.id} 
                        style={{
                            ...styles.card, 
                            ...(skill.id === editingId ? styles.activeCard : {})
                        }}
                    >
                        <div style={styles.cardHeader}>
                            <h3 style={styles.cardTitle}>{skill.name}</h3>
                            <div style={styles.actions}>
                                <button 
                                    onClick={() => handleEditClick(skill)} 
                                    style={{...styles.iconBtn, ...styles.editBtn}}
                                    title="Edit"
                                >
                                    <Edit size={18} />
                                </button>
                                <button 
                                    onClick={() => handleDelete(skill.id)} 
                                    style={{...styles.iconBtn, ...styles.deleteBtn}}
                                    title="Delete"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>

                        <div style={styles.badge}>
                            <Layers size={12} style={{marginRight:'5px', verticalAlign:'text-bottom'}}/>
                            {CATEGORIES[skill.category] || skill.category}
                        </div>
                        
                        <div style={{fontSize: '0.9rem', color: '#94a3b8'}}>
                            Proficiency: {skill.percentage}%
                        </div>
                        <div style={styles.progressBarBg}>
                            <div style={styles.progressBarFill(skill.percentage)}></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SkillsManager;