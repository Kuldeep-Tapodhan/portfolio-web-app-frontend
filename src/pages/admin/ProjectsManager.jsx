import React, { useState, useEffect } from "react";
import api from "../../services/api";
import {
  Trash2,
  Plus,
  FolderGit2,
  Github,
  ExternalLink,
  Edit,
  Save,
  Image as ImageIcon,
} from "lucide-react";

const ProjectsManager = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  // Initial State for the Form
  const initialFormState = {
    title: "",
    description: "",
    tech_stack: "", // Input as comma separated string
    github_link: "",
    live_link: "",
    image: null,
  };

  const [formData, setFormData] = useState(initialFormState);

  // --- 1. Fetch Data on Load ---
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.get("/projects/");

      // Smart Check: Handle both Custom APIResponse and Default DRF List
      if (response.data.data && Array.isArray(response.data.data)) {
        setProjects(response.data.data);
      } else if (Array.isArray(response.data)) {
        setProjects(response.data);
      } else if (response.data.results) {
        setProjects(response.data.results);
      } else {
        setProjects([]);
      }
    } catch (error) {
      console.error("Failed to load projects", error);
    } finally {
      setLoading(false);
    }
  };

  // --- 2. Form & Edit Actions ---

  const handleEditClick = (project) => {
    setEditingId(project.id);
    setFormData({
      title: project.title,
      description: project.description,
      tech_stack: project.tech_stack || "",
      github_link: project.github_link || "",
      live_link: project.live_link || "",
      image: null,
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
      payload.append("description", formData.description);
      payload.append("tech_stack", formData.tech_stack);
      payload.append("github_link", formData.github_link);
      payload.append("live_link", formData.live_link);

      // Only append image if a new one is selected
      if (formData.image) {
        payload.append("image", formData.image);
      }

      const config = { headers: { "Content-Type": "multipart/form-data" } };

      if (editingId) {
        await api.put(`/projects/${editingId}/`, payload, config);
      } else {
        await api.post("/projects/", payload, config);
      }

      handleCancelEdit();
      fetchProjects();
    } catch (error) {
      alert(
        "Error saving: " + (error.response?.data?.message || error.message),
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    try {
      await api.delete(`/projects/${id}/`);
      fetchProjects();
    } catch (error) {
      console.error("Failed to delete", error);
    }
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

    // Grid Layout
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
      gap: "2rem",
    },

    // Card
    card: {
      background: "#0f172a",
      border: "1px solid #334155",
      borderRadius: "12px",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      transition: "border-color 0.2s",
    },
    activeCard: {
      borderColor: "#38bdf8",
      boxShadow: "0 0 15px rgba(56, 189, 248, 0.1)",
    },

    // Image Area
    imgArea: {
      height: "160px",
      background: "#020617",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderBottom: "1px solid #334155",
      overflow: "hidden",
    },
    img: { width: "100%", height: "100%", objectFit: "cover" },

    // Content Area
    content: {
      padding: "1.5rem",
      flex: 1,
      display: "flex",
      flexDirection: "column",
    },
    title: { margin: "0 0 10px 0", fontSize: "1.25rem", color: "white" },
    desc: {
      color: "#94a3b8",
      fontSize: "0.9rem",
      lineHeight: "1.5",
      marginBottom: "1rem",
      flex: 1,
    },

    // Badges
    techStack: {
      display: "flex",
      flexWrap: "wrap",
      gap: "8px",
      marginBottom: "1.5rem",
    },
    badge: {
      fontSize: "0.75rem",
      background: "rgba(34, 197, 94, 0.1)", // Green Tint
      color: "#22c55e", // Green Text
      padding: "4px 8px",
      borderRadius: "4px",
      border: "1px solid rgba(34, 197, 94, 0.2)",
    },

    // Links
    links: {
      display: "flex",
      gap: "15px",
      marginTop: "auto",
      borderTop: "1px solid #334155",
      paddingTop: "15px",
    },
    linkItem: {
      display: "flex",
      alignItems: "center",
      gap: "5px",
      color: "#38bdf8",
      textDecoration: "none",
      fontSize: "0.9rem",
    },

    // Actions
    actions: {
      display: "flex",
      justifyContent: "flex-end",
      gap: "10px",
      padding: "10px 15px",
      background: "#1e293b",
      borderTop: "1px solid #334155",
    },
    actionBtn: {
      background: "transparent",
      border: "none",
      cursor: "pointer",
      padding: "5px",
    },

    // Form Styles
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
    textarea: {
      width: "100%",
      background: "#0f172a",
      border: "1px solid #334155",
      color: "white",
      padding: "10px",
      borderRadius: "4px",
      minHeight: "80px",
      fontFamily: "inherit",
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

  if (loading) return <div>Loading Projects...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <FolderGit2 />
        <h1>Project Showcase</h1>
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
          {editingId ? "Edit Project" : "Add New Project"}
        </h3>

        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1.5rem",
            }}
          >
            <div style={styles.formGroup}>
              <label style={styles.label}>Project Title</label>
              <input
                type="text"
                style={styles.input}
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Tech Stack (Comma separated)</label>
              <input
                type="text"
                style={styles.input}
                required
                placeholder="Python, Django, React"
                value={formData.tech_stack}
                onChange={(e) =>
                  setFormData({ ...formData, tech_stack: e.target.value })
                }
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Description</label>
            <textarea
              style={styles.textarea}
              required
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1.5rem",
            }}
          >
            <div style={styles.formGroup}>
              <label style={styles.label}>GitHub Link</label>
              <input
                type="url"
                style={styles.input}
                value={formData.github_link}
                onChange={(e) =>
                  setFormData({ ...formData, github_link: e.target.value })
                }
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Live Demo Link</label>
              <input
                type="url"
                style={styles.input}
                value={formData.live_link}
                onChange={(e) =>
                  setFormData({ ...formData, live_link: e.target.value })
                }
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Project Screenshot</label>
            <input
              type="file"
              style={styles.input}
              accept="image/*"
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.files[0] })
              }
            />
          </div>

          <div style={{ display: "flex", gap: "10px", marginTop: "1rem" }}>
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
              <Save size={18} /> {editingId ? "Update" : "Save Project"}
            </button>
          </div>
        </form>
      </div>

      {/* Projects Grid */}
      <div style={styles.grid}>
        {projects.map((proj) => (
          <div
            key={proj.id}
            style={{
              ...styles.card,
              ...(proj.id === editingId ? styles.activeCard : {}),
            }}
          >
            {/* Image Area */}
            <div style={styles.imgArea}>
              {proj.image ? (
                <img
                  // Handle full URLs vs Relative Paths automatically
                  src={proj.image}
                  alt={proj.title}
                  style={styles.img}
                  onError={(e) => {
                    e.target.style.display = "none";
                  }} // Hide if broken
                />
              ) : (
                <ImageIcon size={48} color="#334155" />
              )}
            </div>

            {/* Content */}
            <div style={styles.content}>
              <h3 style={styles.title}>{proj.title}</h3>
              <p style={styles.desc}>
                {proj.description.length > 100
                  ? proj.description.substring(0, 100) + "..."
                  : proj.description}
              </p>

              {/* Tech Stack Badges */}
              <div style={styles.techStack}>
                {(proj.tech_stack || "")
                  .split(",")
                  .filter((t) => t.trim() !== "")
                  .map((tech, i) => (
                    <span key={i} style={styles.badge}>
                      {tech.trim()}
                    </span>
                  ))}
              </div>

              <div style={styles.links}>
                {proj.github_link && (
                  <a
                    href={proj.github_link}
                    target="_blank"
                    rel="noreferrer"
                    style={styles.linkItem}
                  >
                    <Github size={16} /> Code
                  </a>
                )}
                {proj.live_link && (
                  <a
                    href={proj.live_link}
                    target="_blank"
                    rel="noreferrer"
                    style={styles.linkItem}
                  >
                    <ExternalLink size={16} /> Live Demo
                  </a>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={styles.actions}>
              <button
                onClick={() => handleEditClick(proj)}
                style={{ ...styles.actionBtn, color: "#38bdf8" }}
              >
                <Edit size={18} />
              </button>
              <button
                onClick={() => handleDelete(proj.id)}
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

export default ProjectsManager;
