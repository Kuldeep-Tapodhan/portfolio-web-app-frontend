import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Trash2, Plus, BookOpen, GraduationCap, Edit, Save, Calendar } from 'lucide-react';

const EducationManager = () => {
    const [educationList, setEducationList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);

    // Standard Education Fields + helper 'is_current'
    const initialFormState = {
        institution: '',
        degree: '',
        field_of_study: '',
        start_date: '',
        end_date: '',
        grade: '',
        description: '',
        is_current: false // New helper state
    };

    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        fetchEducation();
    }, []);

    const fetchEducation = async () => {
        try {
            const response = await api.get('/education/');
            
            // Handle different DRF response structures
            if (response.data.data && Array.isArray(response.data.data)) {
                setEducationList(response.data.data);
            } else if (Array.isArray(response.data)) {
                setEducationList(response.data);
            } else if (response.data.results) {
                setEducationList(response.data.results);
            } else {
                setEducationList([]);
            }
        } catch (error) {
            console.error("Failed to load education", error);
        } finally {
            setLoading(false);
        }
    };

    // --- Actions ---

    const handleEditClick = (edu) => {
        setEditingId(edu.id);
        setFormData({
            institution: edu.institution,
            degree: edu.degree,
            field_of_study: edu.field_of_study || '',
            start_date: edu.start_date,
            end_date: edu.end_date || '', // Handle null
            grade: edu.grade || '',
            description: edu.description || '',
            is_current: !edu.end_date // If end_date is null/empty, it is current
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData(initialFormState);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Prepare payload
            const payload = { ...formData };
            
            // Logic: If 'Current' is checked, force end_date to be null/empty
            if (payload.is_current) {
                payload.end_date = null; 
            }
            // Remove the helper 'is_current' key before sending to Django
            delete payload.is_current; 

            if (editingId) {
                await api.put(`/education/${editingId}/`, payload);
            } else {
                await api.post('/education/', payload);
            }
            
            handleCancelEdit();
            fetchEducation();
        } catch (error) {
            alert("Error saving: " + (error.response?.data?.message || "Check console"));
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this entry?")) return;
        try {
            await api.delete(`/education/${id}/`);
            fetchEducation();
        } catch (error) {
            console.error("Failed to delete", error);
        }
    };

    // --- Styles ---
    const styles = {
        container: { color: 'white' },
        header: { marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px', color: '#38bdf8' }, // Blue
        
        formCard: {
            background: '#1e293b', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', border: '1px dashed #38bdf8'
        },
        formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1rem' },
        formGroup: { marginBottom: '1rem' },
        
        label: { display:'block', marginBottom:'5px', fontSize:'0.8rem', color:'#94a3b8' },
        input: {
            width: '100%', background: '#0f172a', border: '1px solid #334155', color: 'white', padding: '10px', borderRadius: '4px', boxSizing: 'border-box'
        },
        textarea: {
            width: '100%', background: '#0f172a', border: '1px solid #334155', color: 'white', padding: '10px', borderRadius: '4px', minHeight: '80px', fontFamily: 'inherit', boxSizing: 'border-box'
        },
        
        list: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
        card: {
            background: '#0f172a', // Dark BG
            border: '1px solid #334155', 
            borderRadius: '8px', 
            padding: '1.5rem', 
            display: 'flex', 
            gap: '1.5rem', 
            transition: 'border-color 0.2s'
        },
        activeCard: { borderColor: '#38bdf8', boxShadow: '0 0 15px rgba(56, 189, 248, 0.1)' },
        
        iconBox: {
            width: '50px', height: '50px', borderRadius: '8px', 
            background: 'rgba(56, 189, 248, 0.1)', // Blue Tint
            color: '#38bdf8', // Blue Icon
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
        },
        
        content: { flex: 1 },
        institution: { margin: '0 0 5px 0', fontSize: '1.2rem', color: 'white' },
        degree: { color: '#38bdf8', fontWeight: 'bold', marginBottom: '5px' },
        meta: { fontSize: '0.9rem', color: '#94a3b8', display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '10px' },
        desc: { color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.5' },
        
        actions: { display: 'flex', flexDirection: 'column', gap: '10px' },
        actionBtn: { background: 'transparent', border: 'none', cursor: 'pointer', padding: '5px' },
        submitBtn: {
            background: '#38bdf8', color: '#0f172a', padding: '10px 20px', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
        }
    };

    if (loading) return <div>Loading Education...</div>;

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <BookOpen />
                <h1>Education History</h1>
            </div>

            {/* Form */}
            <div style={styles.formCard}>
                <h3 style={{marginTop:0, display:'flex', alignItems:'center', gap:'10px', color: editingId ? '#38bdf8' : 'white'}}>
                    {editingId ? <Edit size={18}/> : <Plus size={18}/>} 
                    {editingId ? 'Edit Education' : 'Add Education'}
                </h3>
                
                <form onSubmit={handleSubmit}>
                    <div style={styles.formGrid}>
                        <div>
                            <label style={styles.label}>Institution Name</label>
                            <input 
                                type="text" style={styles.input} required
                                placeholder="e.g. Stanford University"
                                value={formData.institution}
                                onChange={e => setFormData({...formData, institution: e.target.value})}
                            />
                        </div>
                        <div>
                            <label style={styles.label}>Degree</label>
                            <input 
                                type="text" style={styles.input} required
                                placeholder="e.g. Bachelor of Technology"
                                value={formData.degree}
                                onChange={e => setFormData({...formData, degree: e.target.value})}
                            />
                        </div>
                    </div>

                    <div style={styles.formGrid}>
                        <div>
                            <label style={styles.label}>Field of Study</label>
                            <input 
                                type="text" style={styles.input}
                                placeholder="e.g. Computer Science"
                                value={formData.field_of_study}
                                onChange={e => setFormData({...formData, field_of_study: e.target.value})}
                            />
                        </div>
                        <div>
                            <label style={styles.label}>Grade / CGPA</label>
                            <input 
                                type="text" style={styles.input}
                                placeholder="e.g. 9.0 CGPA"
                                value={formData.grade}
                                onChange={e => setFormData({...formData, grade: e.target.value})}
                            />
                        </div>
                    </div>

                    <div style={styles.formGrid}>
                        <div>
                            <label style={styles.label}>Start Date</label>
                            <input 
                                type="date" style={styles.input} required
                                value={formData.start_date}
                                onChange={e => setFormData({...formData, start_date: e.target.value})}
                            />
                        </div>
                        <div>
                            {/* Updated End Date Section with Checkbox */}
                            <div style={{display:'flex', justifyContent:'space-between'}}>
                                <label style={styles.label}>End Date</label>
                                <label style={{...styles.label, cursor:'pointer', color: '#38bdf8'}}>
                                    <input 
                                        type="checkbox" 
                                        checked={formData.is_current}
                                        onChange={e => setFormData({...formData, is_current: e.target.checked, end_date: ''})}
                                    /> Current
                                </label>
                            </div>
                            <input 
                                type="date" style={styles.input} 
                                value={formData.end_date}
                                disabled={formData.is_current}
                                onChange={e => setFormData({...formData, end_date: e.target.value})}
                            />
                        </div>
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Description (Optional)</label>
                        <textarea 
                            style={styles.textarea}
                            placeholder="Achievements, Thesis, etc."
                            value={formData.description}
                            onChange={e => setFormData({...formData, description: e.target.value})}
                        />
                    </div>

                    <div style={{display:'flex', gap:'10px'}}>
                        {editingId && (
                            <button type="button" onClick={handleCancelEdit} style={{...styles.submitBtn, background:'transparent', border:'1px solid #334155', color:'#94a3b8'}}>
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
            <div style={styles.list}>
                {educationList.map(edu => (
                    <div 
                        key={edu.id} 
                        style={{...styles.card, ...(edu.id === editingId ? styles.activeCard : {})}}
                    >
                        <div style={styles.iconBox}>
                            <GraduationCap size={24} />
                        </div>

                        <div style={styles.content}>
                            <h3 style={styles.institution}>{edu.institution}</h3>
                            <div style={styles.degree}>
                                {edu.degree} {edu.field_of_study && `in ${edu.field_of_study}`}
                            </div>
                            
                            <div style={styles.meta}>
                                <span style={{display:'flex', alignItems:'center', gap:'5px'}}>
                                    <Calendar size={14} /> 
                                    {edu.start_date} — {edu.end_date || <span style={{color:'#22c55e', fontWeight: 'bold'}}>Present</span>}
                                </span>
                                {edu.grade && (
                                    <span style={{
                                        color:'#22c55e', 
                                        background:'rgba(34, 197, 94, 0.1)', 
                                        padding:'2px 6px', 
                                        borderRadius:'4px', 
                                        fontSize:'0.8rem',
                                        border: '1px solid rgba(34, 197, 94, 0.2)'
                                    }}>
                                        {edu.grade}
                                    </span>
                                )}
                            </div>
                            
                            {edu.description && <p style={styles.desc}>{edu.description}</p>}
                        </div>

                        <div style={styles.actions}>
                            <button onClick={() => handleEditClick(edu)} style={{...styles.actionBtn, color: '#38bdf8'}}>
                                <Edit size={18} />
                            </button>
                            <button onClick={() => handleDelete(edu.id)} style={{...styles.actionBtn, color: '#ef4444'}}>
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EducationManager;