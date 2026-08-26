import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import {
  LayoutDashboard,
  FolderGit2,
  Cpu,
  Mail,
  Briefcase,
  ArrowRight,
  MessageSquare,
  Plus,
  Clock,
  User,
  Award,
  Terminal,
  Sparkles,
  ExternalLink,
  GraduationCap
} from "lucide-react";
import "../../styles/Home.css";

const DashboardHome = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    messages: 0,
    experience: 0,
    certifications: 0,
    education: 0
  });
  const [recentMessages, setRecentMessages] = useState([]);

  useEffect(() => {
    fetchAllStats();
  }, []);

  const fetchAllStats = async () => {
    try {
      const [projRes, skillRes, msgRes, expRes, certRes, eduRes] = await Promise.allSettled([
        api.get("/projects/"),
        api.get("/skills/"),
        api.get("/contacts/"),
        api.get("/experiences/"),
        api.get("/certifications/"),
        api.get("/education/")
      ]);

      const getCount = (result) => {
        if (result.status === "rejected") return 0;
        let data = result.value.data;
        if (data.data) data = data.data;
        if (data.results) data = data.results;
        return Array.isArray(data) ? data.length : 0;
      };

      let msgs = [];
      if (msgRes.status === "fulfilled") {
        let data = msgRes.value.data;
        if (data.data) data = data.data;
        if (data.results) data = data.results;
        if (Array.isArray(data)) msgs = data;
      }
      msgs.sort((a, b) => b.id - a.id);
      setRecentMessages(msgs.slice(0, 4));

      setStats({
        projects: getCount(projRes),
        skills: getCount(skillRes),
        messages: getCount(msgRes),
        experience: getCount(expRes),
        certifications: getCount(certRes),
        education: getCount(eduRes)
      });
    } catch (error) {
      console.error("Dashboard Stats Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: 'var(--accent-cyan)' }}>
        <div style={{ textAlign: 'center' }}>
          <Sparkles size={36} className="spinner" style={{ marginBottom: '1rem', animation: 'spin 1.5s infinite linear' }} />
          <div>Connecting to Neural Backend Services...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "2.5rem",
        flexWrap: "wrap",
        gap: "1rem"
      }}>
        <div>
          <div className="section-badge" style={{ marginBottom: '0.4rem' }}>
            <LayoutDashboard size={14} />
            <span>Control Center</span>
          </div>
          <h1 style={{ fontSize: "2.2rem", fontWeight: "800", margin: 0, color: "var(--text-primary)" }}>
            System Dashboard
          </h1>
          <p style={{ color: "var(--text-secondary)", margin: "0.2rem 0 0 0", fontSize: "0.95rem" }}>
            Overview of live database metrics, public submissions, and API services.
          </p>
        </div>

        <button
          onClick={() => navigate("/")}
          className="btn-primary"
        >
          <span>View Public Site</span>
          <ExternalLink size={16} />
        </button>
      </div>

      {/* Metrics Stat Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "1.5rem",
        marginBottom: "2.5rem"
      }}>
        {[
          { label: "Active Projects", value: stats.projects, icon: FolderGit2, color: "var(--accent-cyan)", path: "/admin/projects" },
          { label: "Skill Nodes", value: stats.skills, icon: Cpu, color: "var(--accent-indigo)", path: "/admin/skills" },
          { label: "Work Experiences", value: stats.experience, icon: Briefcase, color: "#10b981", path: "/admin/experience" },
          { label: "Certifications", value: stats.certifications, icon: Award, color: "#f59e0b", path: "/admin/certifications" },
          { label: "Inbox Messages", value: stats.messages, icon: Mail, color: "#ef4444", path: "/admin/messages" }
        ].map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              onClick={() => navigate(card.path)}
              style={{
                borderRadius: "18px",
                background: "var(--bg-card)",
                border: "1px solid var(--border-color)",
                padding: "1.5rem",
                backdropFilter: "blur(14px)",
                display: "flex",
                alignItems: "center",
                gap: "1.25rem",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "var(--glass-shadow)"
              }}
              className="stat-hover-card"
            >
              <div style={{
                width: "52px",
                height: "52px",
                borderRadius: "14px",
                background: `rgba(0, 242, 254, 0.08)`,
                border: `1px solid ${card.color}`,
                color: card.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0
              }}>
                <Icon size={26} />
              </div>
              <div>
                <div style={{ fontSize: "1.8rem", fontWeight: "800", color: "var(--text-primary)", lineHeight: "1" }}>
                  {card.value}
                </div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: "500", marginTop: "0.3rem" }}>
                  {card.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Messages Activity & Quick Actions */}
      <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1.2fr", gap: "2rem" }}>
        {/* Left Column: Recent Inbox Messages */}
        <div style={{
          borderRadius: "20px",
          background: "var(--bg-card)",
          border: "1px solid var(--border-color)",
          padding: "1.8rem",
          backdropFilter: "blur(16px)"
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "700", margin: 0, display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <MessageSquare size={20} style={{ color: "var(--accent-cyan)" }} />
              <span>Recent Public Inquiries</span>
            </h3>
            <Link to="/admin/messages" style={{ color: "var(--accent-cyan)", fontSize: "0.85rem", fontWeight: "600", textDecoration: "none" }}>
              View Inbox ↗
            </Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {recentMessages.length === 0 ? (
              <div style={{ color: "var(--text-secondary)", fontStyle: "italic", padding: "1rem 0" }}>
                No contact form submissions recorded yet.
              </div>
            ) : (
              recentMessages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    padding: "1rem 1.25rem",
                    borderRadius: "12px",
                    background: "rgba(15, 23, 42, 0.6)",
                    border: "1px solid var(--border-color)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "1rem"
                  }}
                >
                  <div style={{ overflow: "hidden" }}>
                    <div style={{ fontWeight: "700", color: "var(--text-primary)", fontSize: "0.95rem" }}>
                      {msg.name} <span style={{ fontSize: "0.8rem", color: "var(--accent-indigo)", fontWeight: "500" }}>({msg.email})</span>
                    </div>
                    <div style={{
                      color: "var(--text-secondary)",
                      fontSize: "0.88rem",
                      marginTop: "0.2rem",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis"
                    }}>
                      "{msg.message}"
                    </div>
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.3rem", flexShrink: 0 }}>
                    <Clock size={12} />
                    {new Date(msg.created_at || Date.now()).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Quick Manager Links */}
        <div style={{
          borderRadius: "20px",
          background: "var(--bg-card)",
          border: "1px solid var(--border-color)",
          padding: "1.8rem",
          backdropFilter: "blur(16px)"
        }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: "700", margin: "0 0 1.5rem 0", display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <Plus size={20} style={{ color: "var(--accent-cyan)" }} />
            <span>Quick Management Shortcuts</span>
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            {[
              { label: "Edit Profile", path: "/admin/profile", icon: User },
              { label: "Add Project", path: "/admin/projects", icon: FolderGit2 },
              { label: "Add Skill", path: "/admin/skills", icon: Cpu },
              { label: "Add Experience", path: "/admin/experience", icon: Briefcase },
              { label: "Add Education", path: "/admin/education", icon: GraduationCap },
              { label: "Add Certificate", path: "/admin/certifications", icon: Award },
              { label: "Update Info", path: "/admin/contact-info", icon: Terminal },
              { label: "View Messages", path: "/admin/messages", icon: Mail }
            ].map((action, idx) => {
              const Icon = action.icon;
              return (
                <Link
                  key={idx}
                  to={action.path}
                  style={{
                    padding: "1rem",
                    borderRadius: "12px",
                    background: "rgba(15, 23, 42, 0.5)",
                    border: "1px solid var(--border-color)",
                    color: "var(--text-primary)",
                    textDecoration: "none",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.6rem",
                    textAlign: "center",
                    transition: "all 0.2s ease"
                  }}
                  className="quick-action-link"
                >
                  <Icon size={20} style={{ color: "var(--accent-cyan)" }} />
                  <span>{action.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
