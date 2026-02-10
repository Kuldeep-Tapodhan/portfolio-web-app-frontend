import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { User, Save, FileText, Upload, Image as ImageIcon } from "lucide-react";

const ProfileManager = () => {
  const [loading, setLoading] = useState(false);
  const [existingId, setExistingId] = useState(null);

  // Matching your Django Model exactly
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    bio: "",
    profile_picture: null,
    resume: null,
  });

  const [imagePreview, setImagePreview] = useState(null);

  // --- 1. Fetch Data ---
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      // Using the '/profiles/' endpoint as confirmed
      const response = await api.get("/profiles/");

      let data = response.data;
      if (data.data) data = data.data;
      if (data.results) data = data.results;

      if (Array.isArray(data) && data.length > 0) {
        const profile = data[0];
        setExistingId(profile.id);

        setFormData({
          name: profile.name || "",
          title: profile.title || "",
          bio: profile.bio || "",
          profile_picture: null, // Don't preload file objects
          resume: null,
        });

        // Set existing image for preview
        if (profile.profile_picture) {
          const url = profile.profile_picture;
          setImagePreview(url);
        }
      }
    } catch (error) {
      console.error("Failed to load profile", error);
    } finally {
      setLoading(false);
    }
  };

  // --- 2. Handle File Changes ---
  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, [field]: file });

      // If it's the picture, update the preview
      if (field === "profile_picture") {
        setImagePreview(URL.createObjectURL(file));
      }
    }
  };

  // --- 3. Submit ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("title", formData.title);
      payload.append("bio", formData.bio);

      if (formData.profile_picture) {
        payload.append("profile_picture", formData.profile_picture);
      }
      if (formData.resume) {
        payload.append("resume", formData.resume);
      }

      const config = { headers: { "Content-Type": "multipart/form-data" } };

      if (existingId) {
        // FIXED: Use api.put because your backend has 'def put' but no 'def patch'
        // Your backend logic handles partial=True inside the put method, so this is safe.
        await api.put(`/profiles/${existingId}/`, payload, config);
        alert("Identity updated successfully!");
      } else {
        await api.post("/profiles/", payload, config);
        alert("Profile created successfully!");
      }

      // Refresh to ensure we have latest data
      fetchProfile();
    } catch (error) {
      console.error("Save Error:", error);
      const errMsg =
        error.response?.data?.message ||
        JSON.stringify(error.response?.data) ||
        error.message;
      alert("Error saving: " + errMsg);
    }
  };

  // --- Styles ---
  const styles = {
    container: { color: "var(--text-primary)", maxWidth: "800px" },
    header: {
      marginBottom: "2rem",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      color: "var(--accent-color)",
    },

    formCard: {
      background: "var(--bg-secondary)",
      padding: "2rem",
      borderRadius: "12px",
      border: "1px solid #334155",
    },

    uploadSection: {
      display: "flex",
      gap: "2rem",
      marginBottom: "2rem",
      alignItems: "center",
    },
    avatarPreview: {
      width: "120px",
      height: "120px",
      borderRadius: "50%",
      background: "#0f172a",
      border: "2px dashed var(--accent-color)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      flexShrink: 0,
    },
    img: { width: "100%", height: "100%", objectFit: "cover" },

    fileInputLabel: {
      display: "inline-block",
      padding: "8px 16px",
      background: "#1e293b",
      border: "1px solid #334155",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "0.9rem",
      color: "var(--text-secondary)",
      marginTop: "8px",
    },

    grid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "1.5rem",
      marginBottom: "1.5rem",
    },
    fullWidth: { gridColumn: "1 / -1", marginBottom: "1.5rem" },

    label: {
      display: "block",
      marginBottom: "8px",
      fontSize: "0.9rem",
      color: "#94a3b8",
    },
    input: {
      width: "100%",
      background: "#0f172a",
      border: "1px solid #334155",
      color: "white",
      padding: "12px",
      borderRadius: "6px",
      boxSizing: "border-box",
      fontSize: "1rem",
    },
    textarea: {
      width: "100%",
      background: "#0f172a",
      border: "1px solid #334155",
      color: "white",
      padding: "12px",
      borderRadius: "6px",
      minHeight: "100px",
      fontFamily: "inherit",
      boxSizing: "border-box",
      fontSize: "1rem",
    },

    submitBtn: {
      background: "var(--accent-color)",
      color: "#0f172a",
      padding: "12px 24px",
      border: "none",
      borderRadius: "6px",
      fontWeight: "bold",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      fontSize: "1rem",
      marginTop: "1rem",
    },
  };

  if (loading) return <div>Loading Identity...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <User size={32} />
        <h1>Public Identity</h1>
      </div>

      <form onSubmit={handleSubmit} style={styles.formCard}>
        {/* Image Upload Area */}
        <div style={styles.uploadSection}>
          <div style={styles.avatarPreview}>
            {imagePreview ? (
              <img src={imagePreview} alt="Profile" style={styles.img} />
            ) : (
              <ImageIcon size={40} color="#334155" />
            )}
          </div>
          <div>
            <h3 style={{ margin: "0 0 5px 0", color: "white" }}>
              Profile Photo
            </h3>
            <p style={{ margin: 0, fontSize: "0.8rem", color: "#94a3b8" }}>
              This will be displayed on your Home page.
            </p>
            <label style={styles.fileInputLabel}>
              <input
                type="file"
                style={{ display: "none" }}
                accept="image/*"
                onChange={(e) => handleFileChange(e, "profile_picture")}
              />
              <Upload
                size={14}
                style={{ display: "inline", marginRight: "5px" }}
              />
              Change Photo
            </label>
          </div>
        </div>

        <div style={styles.grid}>
          <div>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              style={styles.input}
              required
              placeholder="e.g. Jane Doe"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
          <div>
            <label style={styles.label}>Professional Title</label>
            <input
              type="text"
              style={styles.input}
              required
              placeholder="e.g. AI Research Scientist"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>
        </div>

        <div style={styles.fullWidth}>
          <label style={styles.label}>Short Bio (Hero Section)</label>
          <textarea
            style={styles.textarea}
            required
            placeholder="A brief introduction for the homepage..."
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          />
        </div>

        <div style={styles.fullWidth}>
          <label style={styles.label}>
            <FileText
              size={16}
              style={{ display: "inline", marginRight: "5px" }}
            />{" "}
            Resume / CV (PDF)
          </label>
          <input
            type="file"
            accept="application/pdf"
            style={{ ...styles.input, padding: "8px" }}
            onChange={(e) => handleFileChange(e, "resume")}
          />
          <p style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "5px" }}>
            Upload your latest resume for recruiters to download.
          </p>
        </div>

        <button type="submit" style={styles.submitBtn}>
          <Save size={20} /> Update Identity
        </button>
      </form>
    </div>
  );
};

export default ProfileManager;
