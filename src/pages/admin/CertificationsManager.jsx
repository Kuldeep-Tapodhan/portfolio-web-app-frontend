import React, { useState, useEffect } from "react";
import api from "../../services/api";
import {
  Trash2,
  Plus,
  Award,
  FileText,
  Edit,
  Save,
  Image as ImageIcon,
} from "lucide-react";

const CertificationsManager = () => {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  // Exact match for your Django Model

  const initialFormState = {
    title: "",
    image: null,
    pdf_file: null,
  };

  const [formData, setFormData] = useState(initialFormState);

  // --- 1. Fetch Data ---
  useEffect(() => {
    fetchCerts();
  }, []);

  const fetchCerts = async () => {
    try {
      const response = await api.get("/certifications/");

      // Handle different DRF response structures
      if (response.data.data && Array.isArray(response.data.data)) {
        setCerts(response.data.data);
      } else if (Array.isArray(response.data)) {
        setCerts(response.data);
      } else if (response.data.results) {
        setCerts(response.data.results);
      } else {
        setCerts([]);
      }
    } catch (error) {
      console.error("Failed to load certifications", error);
    } finally {
      setLoading(false);
    }
  };

  // --- 2. Actions ---

  const handleEditClick = (cert) => {
    setEditingId(cert.id);
    setFormData({
      title: cert.title,
      image: null, // Cannot preload files
      pdf_file: null, // Cannot preload files
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
      payload.append("title", formData.title);

      // Only append files if new ones are selected
      if (formData.image) {
        payload.append("image", formData.image);
      }
      if (formData.pdf_file) {
        payload.append("pdf_file", formData.pdf_file);
      }

      const config = { headers: { "Content-Type": "multipart/form-data" } };

      if (editingId) {
        await api.put(`/certifications/${editingId}/`, payload, config);
      } else {
        await api.post("/certifications/", payload, config);
      }

      handleCancelEdit();
      fetchCerts();
    } catch (error) {
      alert(
        "Error saving: " + (error.response?.data?.message || "Check console"),
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this certification?")) return;
    try {
      await api.delete(`/certifications/${id}/`);
      fetchCerts();
    } catch (error) {
      console.error("Failed to delete", error);
    }
  };

  // Helper to format full URL
  const getFullUrl = (path) => {
    if (!path) return null;
    return path;
  };

  // --- 3. Styles (Fixed Colors) ---
  const styles = {
    container: { color: "white" },
    header: {
      marginBottom: "2rem",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      color: "#38bdf8",
    }, // Blue

    // Grid
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
      gap: "1.5rem",
    },

    // Card
    card: {
      background: "#0f172a", // Dark BG
      border: "1px solid #334155",
      borderRadius: "12px",
      padding: "1.5rem",
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
      transition: "border-color 0.2s",
    },
    activeCard: {
      borderColor: "#38bdf8",
      boxShadow: "0 0 15px rgba(56, 189, 248, 0.1)",
    },

    // Image preview in card
    imgBox: {
      width: "100%",
      height: "140px",
      borderRadius: "8px",
      background: "#020617", // Darker BG
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      border: "1px solid #334155",
      marginBottom: "10px",
    },
    img: { width: "100%", height: "100%", objectFit: "cover" },

    title: {
      margin: "0",
      fontSize: "1.1rem",
      textAlign: "center",
      color: "white",
    },

    // Links
    pdfBtn: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      background: "rgba(56, 189, 248, 0.1)", // Blue Tint
      color: "#38bdf8", // Blue Text
      padding: "8px",
      borderRadius: "6px",
      textDecoration: "none",
      fontSize: "0.9rem",
      border: "1px solid rgba(56, 189, 248, 0.2)",
      transition: "all 0.2s",
    },

    // Actions
    actions: {
      display: "flex",
      justifyContent: "flex-end",
      gap: "10px",
      marginTop: "auto",
      paddingTop: "10px",
      borderTop: "1px solid #334155",
    },
    actionBtn: {
      background: "transparent",
      border: "none",
      cursor: "pointer",
      padding: "5px",
    },

    // Form
    formCard: {
      background: "#1e293b",
      padding: "1.5rem",
      borderRadius: "8px",
      marginBottom: "2rem",
      border: "1px dashed #38bdf8",
    },
    formGroup: { marginBottom: "1rem" },
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
    submitBtn: {
      background: "#38bdf8",
      color: "#0f172a",
      padding: "10px 20px",
      border: "none",
      borderRadius: "4px",
      fontWeight: "bold",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
  };

  if (loading) return <div>Loading Certifications...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Award />
        <h1>Certifications</h1>
      </div>

      {/* Form */}
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
          {editingId ? "Edit Certification" : "Add Certification"}
        </h3>

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Certification Title</label>
            <input
              type="text"
              style={styles.input}
              required
              placeholder="e.g. AWS Certified Solutions Architect"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1.5rem",
              marginBottom: "1rem",
            }}
          >
            <div>
              <label style={styles.label}>Certificate Image (Thumbnail)</label>
              <input
                type="file"
                style={styles.input}
                accept="image/*"
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.files[0] })
                }
              />
            </div>
            <div>
              <label style={styles.label}>Certificate PDF (Proof)</label>
              <input
                type="file"
                style={styles.input}
                accept="application/pdf"
                onChange={(e) =>
                  setFormData({ ...formData, pdf_file: e.target.files[0] })
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
              <Save size={18} /> {editingId ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>

      {/* List */}
      <div style={styles.grid}>
        {certs.map((cert) => (
          <div
            key={cert.id}
            style={{
              ...styles.card,
              ...(cert.id === editingId ? styles.activeCard : {}),
            }}
          >
            <div style={styles.imgBox}>
              {cert.image ? (
                <img
                  src={getFullUrl(cert.image)}
                  alt="cert"
                  style={styles.img}
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              ) : (
                <Award size={48} color="#334155" />
              )}
            </div>

            <h3 style={styles.title}>{cert.title}</h3>

            {cert.pdf_file ? (
              <a
                href={getFullUrl(cert.pdf_file)}
                target="_blank"
                rel="noreferrer"
                style={styles.pdfBtn}
              >
                <FileText size={16} /> View PDF
              </a>
            ) : (
              <div
                style={{
                  ...styles.pdfBtn,
                  opacity: 0.5,
                  cursor: "not-allowed",
                  filter: "grayscale(1)",
                }}
              >
                No PDF Attached
              </div>
            )}

            <div style={styles.actions}>
              <button
                onClick={() => handleEditClick(cert)}
                style={{ ...styles.actionBtn, color: "#38bdf8" }}
              >
                <Edit size={18} />
              </button>
              <button
                onClick={() => handleDelete(cert.id)}
                style={{ ...styles.actionBtn, color: "#ef4444" }}
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

export default CertificationsManager;
