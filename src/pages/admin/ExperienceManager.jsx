import React, { useState, useEffect } from "react";
import api from "../../services/api";
import {
  Trash2,
  Plus,
  Briefcase,
  Calendar,
  Edit,
  Save,
  Building,
} from "lucide-react";

const ExperienceManager = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const initialFormState = {
    company_name: "",
    role: "",
    start_date: "",
    end_date: "",
    description: "",
    logo: null, // File object
    is_current: false, // Helper state for logic
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const response = await api.get("/experiences/");
      let data = response.data;
      // Handle various API response structures
      if (data.data) data = data.data;
      if (data.results) data = data.results;

      if (Array.isArray(data)) {
        setExperiences(data);
      }
    } catch (error) {
      console.error("Failed to load experiences", error);
    } finally {
      setLoading(false);
    }
  };

  // --- Actions ---

  const handleEditClick = (exp) => {
    setEditingId(exp.id);
    setFormData({
      company_name: exp.company_name,
      role: exp.role,
      start_date: exp.start_date,
      end_date: exp.end_date || "",
      description: exp.description,
      is_current: !exp.end_date,
      logo: null,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData(initialFormState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = new FormData();
      payload.append("company_name", formData.company_name);
      payload.append("role", formData.role);
      payload.append("start_date", formData.start_date);
      payload.append("description", formData.description);

      if (formData.is_current) {
        payload.append("end_date", "");
      } else {
        payload.append("end_date", formData.end_date);
      }

      if (formData.logo) {
        payload.append("logo", formData.logo);
      }

      if (editingId) {
        await api.put(`/experiences/${editingId}/`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/experiences/", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      handleCancelEdit();
      fetchExperiences();
    } catch (error) {
      console.error(error);
      alert(
        "Error saving: " + (error.response?.data?.message || "Check console"),
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this experience?")) return;
    try {
      await api.delete(`/experiences/${id}/`);
      fetchExperiences();
    } catch (error) {
      console.error("Failed to delete", error);
    }
  };

  // --- Styles ---
  const styles = {
    container: { color: "var(--text-primary)" },
    header: {
      marginBottom: "2rem",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      color: "#38bdf8", // Blue
    },

    formCard: {
      background: "#1e293b",
      padding: "1.5rem",
      borderRadius: "8px",
      marginBottom: "2rem",
      border: "1px dashed #38bdf8", // Blue dashed border
    },
    formGroup: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "1.5rem",
      marginBottom: "1rem",
    },
    fullWidth: { gridColumn: "1 / -1" },

    label: {
      display: "block",
      marginBottom: "5px",
      fontSize: "0.8rem",
      color: "#94a3b8",
    },
    input: {
      width: "100%",
      background: "#0f172a",
      border: "1px solid #334155",
      color: "white",
      padding: "10px",
      borderRadius: "4px",
      boxSizing: "border-box",
    },
    textarea: {
      width: "100%",
      background: "#0f172a",
      border: "1px solid #334155",
      color: "white",
      padding: "10px",
      borderRadius: "4px",
      minHeight: "100px",
      fontFamily: "inherit",
      boxSizing: "border-box",
    },

    list: { display: "flex", flexDirection: "column", gap: "1rem" },
    card: {
      background: "var(--bg-secondary)",
      border: "1px solid #334155",
      borderRadius: "8px",
      padding: "1.5rem",
      display: "flex",
      gap: "1.5rem",
      alignItems: "flex-start",
      transition: "border-color 0.2s",
    },
    activeCard: {
      borderColor: "#38bdf8",
      boxShadow: "0 0 15px rgba(56, 189, 248, 0.1)",
    },

    logoPlaceholder: {
      width: "60px",
      height: "60px",
      borderRadius: "8px",
      background: "#334155",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },
    logoImg: {
      width: "60px",
      height: "60px",
      borderRadius: "8px",
      objectFit: "cover",
    },

    content: { flex: 1 },
    role: { fontSize: "1.2rem", fontWeight: "bold", margin: "0 0 5px 0" },
    company: {
      color: "#38bdf8", // Blue
      marginBottom: "5px",
      display: "flex",
      alignItems: "center",
      gap: "5px",
    },
    date: {
      fontSize: "0.85rem",
      color: "#94a3b8",
      display: "flex",
      alignItems: "center",
      gap: "5px",
      marginBottom: "10px",
    },
    desc: {
      whiteSpace: "pre-line",
      color: "#cbd5e1",
      fontSize: "0.95rem",
      lineHeight: "1.5",
    },

    actions: { display: "flex", flexDirection: "column", gap: "10px" },
    btn: {
      background: "transparent",
      border: "none",
      cursor: "pointer",
      padding: "5px",
    },
    // FIXED: Explicit colors
    editBtn: { color: "#38bdf8" }, // Blue
    deleteBtn: { color: "#ef4444" }, // Red

    submitBtn: {
      background: "#38bdf8", // Blue
      color: "#0f172a",
      padding: "10px 20px",
      border: "none",
      borderRadius: "4px",
      fontWeight: "bold",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      marginTop: "10px",
    },
  };

  if (loading) return <div>Loading Timeline...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Briefcase />
        <h1>Experience Timeline</h1>
      </div>

      {/* Editor Form */}
      <div style={styles.formCard}>
        <h3
          style={{
            marginTop: 0,
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: editingId ? "#38bdf8" : "white",
          }}
        >
          {editingId ? <Edit size={18} /> : <Plus size={18} />}
          {editingId ? "Edit Role" : "Add New Role"}
        </h3>

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <div>
              <label style={styles.label}>Company Name</label>
              <input
                type="text"
                style={styles.input}
                required
                value={formData.company_name}
                onChange={(e) =>
                  setFormData({ ...formData, company_name: e.target.value })
                }
              />
            </div>
            <div>
              <label style={styles.label}>Role / Job Title</label>
              <input
                type="text"
                style={styles.input}
                required
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <div>
              <label style={styles.label}>Start Date</label>
              <input
                type="date"
                style={styles.input}
                required
                value={formData.start_date}
                onChange={(e) =>
                  setFormData({ ...formData, start_date: e.target.value })
                }
              />
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <label style={styles.label}>End Date</label>
                <label
                  style={{
                    ...styles.label,
                    cursor: "pointer",
                    color: "#38bdf8",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={formData.is_current}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        is_current: e.target.checked,
                        end_date: "",
                      })
                    }
                  />{" "}
                  Current
                </label>
              </div>
              <input
                type="date"
                style={styles.input}
                value={formData.end_date}
                disabled={formData.is_current}
                onChange={(e) =>
                  setFormData({ ...formData, end_date: e.target.value })
                }
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <div style={styles.fullWidth}>
              <label style={styles.label}>Description</label>
              <textarea
                style={styles.textarea}
                required
                placeholder="Key achievements and responsibilities..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <div style={styles.fullWidth}>
              <label style={styles.label}>Company Logo (Optional)</label>
              <input
                type="file"
                style={styles.input}
                accept="image/*"
                onChange={(e) =>
                  setFormData({ ...formData, logo: e.target.files[0] })
                }
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                style={{
                  ...styles.submitBtn,
                  background: "transparent",
                  border: "1px solid #334155",
                  color: "#94a3b8",
                }}
              >
                Cancel
              </button>
            )}
            <button type="submit" style={styles.submitBtn}>
              <Save size={18} /> {editingId ? "Update Role" : "Save Role"}
            </button>
          </div>
        </form>
      </div>

      {/* Experience List */}
      <div style={styles.list}>
        {experiences.map((exp) => (
          <div
            key={exp.id}
            style={{
              ...styles.card,
              ...(exp.id === editingId ? styles.activeCard : {}),
            }}
          >
            {/* Logo Column */}
            <div style={styles.logoPlaceholder}>
              {exp.logo ? (
                <img
                  src={exp.logo}
                  alt="company logo"
                  style={styles.logoImg}
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              ) : (
                <Building size={24} color="#64748b" />
              )}
            </div>

            {/* Content Column */}
            <div style={styles.content}>
              <h3 style={styles.role}>{exp.role}</h3>
              <div style={styles.company}>@{exp.company_name}</div>

              <div style={styles.date}>
                <Calendar size={14} />
                {exp.start_date} —{" "}
                {exp.end_date || (
                  // FIXED: Green text for Present
                  <span style={{ color: "#22c55e", fontWeight: "bold" }}>
                    Present
                  </span>
                )}
              </div>

              <p style={styles.desc}>{exp.description}</p>
            </div>

            {/* Actions Column */}
            <div style={styles.actions}>
              <button
                onClick={() => handleEditClick(exp)}
                style={{ ...styles.btn, ...styles.editBtn }}
                title="Edit"
              >
                <Edit size={18} />
              </button>
              <button
                onClick={() => handleDelete(exp.id)}
                style={{ ...styles.btn, ...styles.deleteBtn }}
                title="Delete"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExperienceManager;
