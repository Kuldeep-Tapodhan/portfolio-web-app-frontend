import React, { useState, useEffect } from 'react';
import { 
  getProfile, 
  getSkills, 
  getExperiences, 
  getProjects, 
  getCertifications,
  getEducation, 
  getContactInfo,
  submitContact as sendContactMessage 
} from '../services/portfolioApi';
import TerminalWidget from '../components/TerminalWidget';
import { getMediaUrl } from '../services/api';
import { 
  Cpu, Sparkles, Terminal, Code2, Briefcase, GraduationCap, Mail, Phone, 
  MapPin, ExternalLink, Github, Linkedin, Twitter, CheckCircle2, ArrowRight, 
  Layers, Bot, Database, Zap, Send, MessageSquare, Award, ShieldCheck, UserCheck, Camera, FileText
} from 'lucide-react';
import '../styles/Home.css';

const Home = () => {
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [projects, setProjects] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [education, setEducation] = useState([]);
  const [contactInfo, setContactInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [activeProjectCategory, setActiveProjectCategory] = useState('ALL');
  const [activeSkillCategory, setActiveSkillCategory] = useState('AI');

  // Contact Form State
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState({ submitting: false, success: false, error: null });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [profData, skData, expData, projData, certData, eduData, cInfoData] = await Promise.all([
          getProfile().catch(() => null),
          getSkills().catch(() => []),
          getExperiences().catch(() => []),
          getProjects().catch(() => []),
          getCertifications().catch(() => []),
          getEducation().catch(() => []),
          getContactInfo().catch(() => null)
        ]);

        if (profData) setProfile(Array.isArray(profData) ? profData[0] : profData);
        if (skData) setSkills(skData);
        if (expData) setExperiences(expData);
        if (projData) setProjects(projData);
        if (certData) setCertifications(certData);
        if (eduData) setEducation(eduData);
        if (cInfoData) setContactInfo(Array.isArray(cInfoData) ? cInfoData[0] : cInfoData);
      } catch (err) {
        console.error("Error fetching data for home page:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setFormStatus({ submitting: true, success: false, error: null });
    try {
      await sendContactMessage(formData);
      setFormStatus({ submitting: false, success: true, error: null });
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setFormStatus({ submitting: false, success: false, error: null }), 5000);
    } catch (err) {
      console.error("Error sending message:", err);
      setFormStatus({ submitting: false, success: false, error: "Failed to send message. Please try again." });
    }
  };

  // Category Filtering for Projects
  const filteredProjects = projects.filter((proj) => {
    if (activeProjectCategory === 'ALL') return true;
    const title = proj.title.toLowerCase();
    const stack = (proj.tech_stack || '').toLowerCase();

    if (activeProjectCategory === 'VOICE') return title.includes('voice') || stack.includes('livekit') || stack.includes('webrtc');
    if (activeProjectCategory === 'RAG') return title.includes('health') || title.includes('rag') || stack.includes('biomistral') || stack.includes('chromadb');
    if (activeProjectCategory === 'CV') return title.includes('plant') || stack.includes('opencv') || stack.includes('tensorflow');
    if (activeProjectCategory === 'ML') return title.includes('recommendation') || title.includes('prediction') || stack.includes('knn') || stack.includes('random forest');
    if (activeProjectCategory === 'WEB') return title.includes('management') || title.includes('to-do') || stack.includes('django') || stack.includes('flask');
    return true;
  });

  // Category Filtering for Skills
  const filteredSkills = skills.filter((sk) => {
    if (activeSkillCategory === 'ALL') return true;
    return sk.category === activeSkillCategory;
  });

  // Calculate dynamic metrics from API data
  const calculatedYearsExp = experiences.length > 0 ? (
    Math.max(...experiences.map(exp => {
      if (!exp.start_date) return 1;
      const startYear = new Date(exp.start_date).getFullYear();
      const currentYear = new Date().getFullYear();
      return Math.max(1, currentYear - startYear + 1);
    }))
  ) : (profile ? 1 : 0);

  const displayYearsExp = calculatedYearsExp > 0 ? `${calculatedYearsExp}+ Yrs` : '1+ Yrs';
  const displayProjectsCount = projects.length > 0 ? `${projects.length}+` : '0+';
  const displaySkillsCount = skills.length > 0 ? `${skills.length}+` : '0+';
  const currentCompanyTag = experiences[0]?.company_name ? `@ ${experiences[0].company_name}` : '';
  const currentRoleSub = experiences[0] ? `${experiences[0].company_name} • ${experiences[0].role}` : (profile?.title || '');

  // Date formatting helper for experiences and education timelines
  const formatDateRange = (startDate, endDate) => {
    if (!startDate) return '';
    const startObj = new Date(startDate);
    const startStr = !isNaN(startObj) ? startObj.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : startDate;
    if (!endDate) return `${startStr} - Present`;
    const endObj = new Date(endDate);
    const endStr = !isNaN(endObj) ? endObj.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : endDate;
    return `${startStr} - ${endStr}`;
  };

  return (
    <div className="home-container">
      {/* Ambient Neural Grid & Background */}
      <div className="neural-background">
        <div className="neural-grid"></div>
      </div>

      <div className="content-wrapper">

        {/* ================= HERO SECTION ================= */}
        <section id="about" className="hero-section">
          <div className="hero-content">
            {/* Profile Photo Avatar & Status Pill */}
            <div className="hero-profile-avatar-wrapper">
              {profile?.profile_picture ? (
                <img
                  src={getMediaUrl(profile.profile_picture)}
                  alt={profile?.name || 'Kuldeep Tapodhan'}
                  className="hero-profile-img"
                />
              ) : (
                <div className="hero-avatar-placeholder" title="Developer Avatar">
                  <UserCheck size={44} />
                </div>
              )}

              <div>
                <div className="status-pill" style={{ marginBottom: '0.4rem' }}>
                  <span className="pulse-dot"></span>
                  <span>Available for AI Engineering</span>
                </div>
                {currentRoleSub && (
                  <div style={{ fontSize: '0.86rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                    {currentRoleSub}
                  </div>
                )}
              </div>
            </div>

            <h1 className="hero-title">
              Hi, I'm <span className="gradient-text">{profile?.name || "Kuldeep Tapodhan"}</span>
            </h1>

            <div className="hero-company-tag">
              <Bot size={20} />
              <span>{profile?.title || "Python AI/ML Developer"} {currentCompanyTag}</span>
            </div>

            <p className="hero-bio">
              {profile?.bio || 
                "AI & Machine Learning Developer specialized in building scalable, production-grade applications powered by Multi-Agent LLM voice systems, fine-tuned RAG pipelines, computer vision models, and high-performance REST APIs."
              }
            </p>

            {/* Quick Metrics */}
            <div className="metrics-row">
              <div className="metric-card">
                <span className="metric-number">{displayYearsExp}</span>
                <span className="metric-label">Industry Exp.</span>
              </div>
              <div className="metric-card">
                <span className="metric-number">{displayProjectsCount}</span>
                <span className="metric-label">AI/ML Builds</span>
              </div>
              <div className="metric-card">
                <span className="metric-number">{displaySkillsCount}</span>
                <span className="metric-label">Tech & Models</span>
              </div>
            </div>

            {/* CTA Action Buttons */}
            <div className="hero-cta-group">
              <a href="#projects" className="btn-primary">
                <span>Explore Projects</span>
                <ArrowRight size={18} />
              </a>
              <a href="#contact" className="btn-secondary">
                <Mail size={18} />
                <span>Get In Touch</span>
              </a>
            </div>
          </div>

          {/* Right Side: Interactive Terminal Widget */}
          <div className="hero-terminal-wrapper">
            <TerminalWidget
              profile={profile}
              skills={skills}
              projects={projects}
              contactInfo={contactInfo}
              experiences={experiences}
              education={education}
            />
          </div>
        </section>

        {/* ================= BENTO GRID PROJECTS SECTION ================= */}
        <section id="projects" style={{ paddingTop: '2.5rem' }}>
          <div className="section-header">
            <div className="section-badge">
              <Layers size={14} />
              <span>Featured Work</span>
            </div>
            <h2 className="section-title">AI & Engineering Projects</h2>
            <p className="section-subtitle">
              Production-grade Multi-Agent Voice Platforms, Fine-Tuned LLM RAG Pipelines, Computer Vision Mobile Engines, and Machine Learning Systems.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="filter-pills">
            {[
              { id: 'ALL', label: 'All Projects' },
              { id: 'VOICE', label: '🎙️ Voice AI & Multi-Agent' },
              { id: 'RAG', label: '🏥 RAG & Healthcare' },
              { id: 'CV', label: '🌿 Computer Vision & Mobile' },
              { id: 'ML', label: '🤖 Machine Learning' },
              { id: 'WEB', label: '⚡ Web Apps & APIs' }
            ].map((tab) => (
              <button
                key={tab.id}
                className={`filter-pill ${activeProjectCategory === tab.id ? 'active' : ''}`}
                onClick={() => setActiveProjectCategory(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Bento Grid */}
          <div className="bento-grid">
            {filteredProjects.map((project, idx) => {
              const isFeatured = Boolean(project.is_featured || idx === 0);
              return (
                <div
                  key={project.id || idx}
                  className={`bento-card ${isFeatured ? 'featured' : ''}`}
                >
                  <div>
                    <div className="bento-badge">
                      <Sparkles size={12} />
                      <span>{isFeatured ? 'Featured Architecture' : 'Production Build'}</span>
                    </div>
                    <h3 className="project-title">{project.title}</h3>
                    <p className="project-description">{project.description}</p>
                  </div>

                  <div>
                    {project.tech_stack && (
                      <div className="tech-tags">
                        {project.tech_stack.split(',').map((tech, tIdx) => (
                          <span key={tIdx} className="tech-tag">
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="project-links">
                      {project.github_link && (
                        <a
                          href={project.github_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="project-link-btn"
                        >
                          <Github size={16} />
                          <span>Code Repository</span>
                        </a>
                      )}
                      {project.live_url && (
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="project-link-btn"
                        >
                          <ExternalLink size={16} />
                          <span>Live Demo</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ================= SKILLS MATRIX SECTION ================= */}
        <section id="skills" style={{ paddingTop: '4rem' }}>
          <div className="section-header">
            <div className="section-badge">
              <Cpu size={14} />
              <span>Tech Matrix</span>
            </div>
            <h2 className="section-title">Skills & Capabilities</h2>
            <p className="section-subtitle">
              Comprehensive technical expertise across AI Models, Multi-Agent Frameworks, Backend Systems, and Cloud DevOps.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="skills-category-tabs">
            {[
              { id: 'AI', label: '🤖 AI / ML & LLMs', icon: Bot },
              { id: 'WEB', label: '⚡ Backend & Frameworks', icon: Zap },
              { id: 'LANG', label: '🌐 Languages & Web', icon: Code2 },
              { id: 'SOFT', label: '🛠️ DevOps & Infrastructure', icon: Database }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  className={`skill-tab-btn ${activeSkillCategory === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveSkillCategory(tab.id)}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Skills Grid */}
          <div className="skills-grid">
            {filteredSkills.map((skill, idx) => (
              <div key={skill.id || idx} className="skill-card">
                <div className="skill-info">
                  <span className="skill-name">{skill.name}</span>
                  <span className="skill-percent">{skill.percentage}%</span>
                </div>
                <div className="progress-bar-bg">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${skill.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= WORK EXPERIENCE SECTION ================= */}
        <section id="experience" style={{ paddingTop: '4rem' }}>
          <div className="section-header">
            <div className="section-badge">
              <Briefcase size={14} />
              <span>Work History</span>
            </div>
            <h2 className="section-title">Professional Experience</h2>
            <p className="section-subtitle">
              Engineering production AI/ML software, real-time multi-agent voice pipelines, and scalable backend microservices.
            </p>
          </div>

          <div className="timeline-container">
            {experiences.map((exp, idx) => (
              <div key={exp.id || idx} className="timeline-item">
                <div className="timeline-node experience-node"></div>
                <div className="timeline-card">
                  <div className="timeline-header">
                    <div>
                      <span className="timeline-role">{exp.role}</span>
                      <div className="timeline-company">@ {exp.company_name}</div>
                    </div>
                    {exp.start_date && (
                      <span className="timeline-date">
                        {formatDateRange(exp.start_date, exp.end_date)}
                      </span>
                    )}
                  </div>
                  <p className="timeline-desc">{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= EDUCATION SECTION ================= */}
        <section id="education" style={{ paddingTop: '4rem' }}>
          <div className="section-header">
            <div className="section-badge" style={{ background: 'rgba(129, 140, 248, 0.12)', borderColor: 'rgba(129, 140, 248, 0.3)', color: 'var(--accent-indigo)' }}>
              <GraduationCap size={14} />
              <span>Academic Background</span>
            </div>
            <h2 className="section-title">Education & Qualifications</h2>
            <p className="section-subtitle">
              Academic foundation in Information Technology, computer science fundamentals, and advanced engineering coursework.
            </p>
          </div>

          <div className="timeline-container">
            {education.map((edu, idx) => (
              <div key={edu.id || idx} className="timeline-item">
                <div className="timeline-node education-node"></div>
                <div className="timeline-card">
                  <div className="timeline-header">
                    <div>
                      <span className="timeline-role">{edu.degree}</span>
                      <div className="timeline-company edu">{edu.institution}</div>
                    </div>
                    {edu.start_date && (
                      <span className="timeline-date edu">
                        {formatDateRange(edu.start_date, edu.end_date)}
                      </span>
                    )}
                  </div>
                  <p className="timeline-desc">{edu.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= CERTIFICATIONS SECTION ================= */}
        <section id="certifications" style={{ paddingTop: '4rem' }}>
          <div className="section-header">
            <div className="section-badge" style={{ background: 'rgba(16, 185, 129, 0.12)', borderColor: 'rgba(16, 185, 129, 0.3)', color: '#10b981' }}>
              <Award size={14} />
              <span>Credentials</span>
            </div>
            <h2 className="section-title">Certifications & Achievements</h2>
            <p className="section-subtitle">
              Verified certifications across Machine Learning, Cloud Computing, Python Data Science, and SQL Engineering.
            </p>
          </div>

          <div className="certifications-grid">
            {certifications.map((cert, idx) => {
              const fileUrl = cert.pdf_file || cert.image;
              const hasFile = Boolean(fileUrl);
              const fullUrl = hasFile ? getMediaUrl(fileUrl) : null;

              return (
                <div 
                  key={cert.id || idx} 
                  className="cert-card"
                  onClick={() => {
                    if (fullUrl) {
                      window.open(fullUrl, '_blank', 'noopener,noreferrer');
                    } else {
                      alert(`Certificate "${cert.title}" PDF/Document can be managed via Admin Panel.`);
                    }
                  }}
                  title={hasFile ? `Click to view ${cert.title} PDF` : 'Click to view certificate'}
                >
                  <div className="cert-icon-wrapper">
                    {cert.pdf_file ? <FileText size={24} /> : <Award size={24} />}
                  </div>
                  <div>
                    <h3 className="cert-title">{cert.title}</h3>
                    <div className="cert-issuer">Verified Industry Credential</div>
                    <div className="cert-verified-badge">
                      <ShieldCheck size={14} />
                      <span>Verified Certification</span>
                    </div>
                    <div className="cert-action-hint">
                      <span>{hasFile ? 'View PDF Document' : 'View Credential Details'}</span>
                      <ExternalLink size={12} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ================= CONTACT SECTION ================= */}
        <section id="contact" style={{ paddingTop: '4rem' }}>
          <div className="section-header">
            <div className="section-badge">
              <Mail size={14} />
              <span>Get In Touch</span>
            </div>
            <h2 className="section-title">Let's Build Intelligent Systems</h2>
            <p className="section-subtitle">
              Available for AI/ML Engineering roles, Voice Bot development, RAG architecture, and full-stack software consulting.
            </p>
          </div>

          <div className="contact-grid">
            {/* Left Contact Info Card */}
            <div className="contact-info-card">
              <div className="contact-detail-item">
                <div className="contact-icon-wrapper">
                  <Mail size={20} />
                </div>
                <div>
                  <div className="contact-label">Direct Email</div>
                  <a href={`mailto:${contactInfo?.email || 'kuldeep.tapodhan0306@gmail.com'}`} className="contact-value">
                    {contactInfo?.email || 'kuldeep.tapodhan0306@gmail.com'}
                  </a>
                </div>
              </div>

              <div className="contact-detail-item">
                <div className="contact-icon-wrapper">
                  <Phone size={20} />
                </div>
                <div>
                  <div className="contact-label">Phone</div>
                  <a href={`tel:${contactInfo?.phone || '+919016568931'}`} className="contact-value">
                    {contactInfo?.phone || '+91 9016568931'}
                  </a>
                </div>
              </div>

              <div className="contact-detail-item">
                <div className="contact-icon-wrapper">
                  <MapPin size={20} />
                </div>
                <div>
                  <div className="contact-label">Location</div>
                  <div className="contact-value">{contactInfo?.address || 'Rajkot, Gujarat, India'}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                <a
                  href={contactInfo?.github_link || 'https://github.com/Kuldeep-Tapodhan'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                  style={{ flex: 1, justifyContent: 'center', minWidth: '130px' }}
                >
                  <Github size={18} />
                  <span>GitHub</span>
                </a>
                <a
                  href={contactInfo?.linkedin_link || 'https://www.linkedin.com/in/kuldeep-tapodhan-780701251/'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                  style={{ flex: 1, justifyContent: 'center', minWidth: '130px' }}
                >
                  <Linkedin size={18} />
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>

            {/* Right Contact Form Card */}
            <div className="contact-form-card">
              <form onSubmit={handleContactSubmit}>
                <div className="form-group">
                  <label className="form-label">Your Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Alex Morgan"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Your Email</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="e.g. alex@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Message</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Describe your project, engineering inquiry, or opportunity..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
                  disabled={formStatus.submitting}
                >
                  {formStatus.submitting ? (
                    <span>Sending Message...</span>
                  ) : (
                    <>
                      <Send size={18} />
                      <span>Send Message</span>
                    </>
                  )}
                </button>

                {formStatus.success && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', marginTop: '1rem', fontSize: '0.9rem', fontWeight: '700' }}>
                    <CheckCircle2 size={18} />
                    <span>Message sent successfully! I will respond promptly.</span>
                  </div>
                )}
                {formStatus.error && (
                  <div style={{ color: '#ef4444', marginTop: '1rem', fontSize: '0.9rem', fontWeight: '600' }}>
                    {formStatus.error}
                  </div>
                )}
              </form>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Home;
