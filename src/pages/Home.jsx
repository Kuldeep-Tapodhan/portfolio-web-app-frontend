import React, { useState, useEffect } from "react";
import {
  Github,
  Linkedin,
  Twitter,
  Code2,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Download,
  Send,
  Briefcase,
  GraduationCap,
  Award,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  getProfile,
  getSkills,
  getExperiences,
  getProjects,
  getCertifications,
  getEducation,
  getContactInfo,
  submitContact,
} from "../services/portfolioApi";
import "../styles/Home.css";

const Home = () => {
  // State management
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [projects, setProjects] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [education, setEducation] = useState([]);
  const [contactInfo, setContactInfo] = useState(null);
  const [currentSkillIndex, setCurrentSkillIndex] = useState(0);
  const SKILLS_PER_PAGE = 3;
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const PROJECTS_PER_PAGE = 2;
  const [currentCertificationIndex, setCurrentCertificationIndex] = useState(0);
  const CERTIFICATIONS_PER_PAGE = 3;

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  // Fetch all data on component mount
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [
          profileData,
          skillsData,
          experiencesData,
          projectsData,
          certificationsData,
          educationData,
          contactInfoData,
        ] = await Promise.all([
          getProfile().catch(() => null),
          getSkills().catch(() => []),
          getExperiences().catch(() => []),
          getProjects().catch(() => []),
          getCertifications().catch(() => []),
          getEducation().catch(() => []),
          getContactInfo().catch(() => null),
        ]);

        setProfile(profileData);
        setSkills(skillsData);
        setExperiences(experiencesData);
        setProjects(projectsData);
        setCertifications(certificationsData);
        setEducation(educationData);
        setContactInfo(contactInfoData);
      } catch (error) {
        console.error("Error fetching portfolio data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    const category = skill.category || "OTHER";
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {});

  const categoryNames = {
    LANG: "Programming Languages",
    WEB: "Web Technologies",
    AI: "AI/ML Technologies",
    SOFT: "Soft Skills",
    OTHER: "Other Skills",
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormStatus({ type: "", message: "" });

    try {
      await submitContact(formData);
      setFormStatus({
        type: "success",
        message: "Message sent successfully! I'll get back to you soon.",
      });
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      setFormStatus({
        type: "error",
        message: "Failed to send message. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Present";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  // Scroll to section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Carousel helper functions
  const chunkArray = (array, size) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  };

  // Group skills into cards of 5 skills each
  const skillCards = Object.entries(groupedSkills).flatMap(
    ([category, categorySkills]) => {
      const chunks = chunkArray(categorySkills, 5);
      return chunks.map((chunk, index) => ({
        category,
        skills: chunk,
        cardIndex: index,
        totalCards: chunks.length,
      }));
    },
  );

  // Pagination for skills
  const totalSkillPages = Math.ceil(skillCards.length / SKILLS_PER_PAGE);
  const visibleSkillCards = skillCards.slice(
    currentSkillIndex * SKILLS_PER_PAGE,
    (currentSkillIndex + 1) * SKILLS_PER_PAGE,
  );

  const nextSkillPage = () => {
    setCurrentSkillIndex((prev) => (prev + 1) % totalSkillPages);
  };

  const prevSkillPage = () => {
    setCurrentSkillIndex(
      (prev) => (prev - 1 + totalSkillPages) % totalSkillPages,
    );
  };

  // Pagination for projects
  const totalProjectPages = Math.ceil(projects.length / PROJECTS_PER_PAGE);
  const visibleProjectCards = projects.slice(
    currentProjectIndex * PROJECTS_PER_PAGE,
    (currentProjectIndex + 1) * PROJECTS_PER_PAGE,
  );

  const nextProjectPage = () => {
    setCurrentProjectIndex((prev) => (prev + 1) % totalProjectPages);
  };

  const prevProjectPage = () => {
    setCurrentProjectIndex(
      (prev) => (prev - 1 + totalProjectPages) % totalProjectPages,
    );
  };

  // Pagination for certifications
  const totalCertificationPages = Math.ceil(
    certifications.length / CERTIFICATIONS_PER_PAGE,
  );
  const visibleCertifications = certifications.slice(
    currentCertificationIndex * CERTIFICATIONS_PER_PAGE,
    (currentCertificationIndex + 1) * CERTIFICATIONS_PER_PAGE,
  );

  const nextCertificationPage = () => {
    setCurrentCertificationIndex(
      (prev) => (prev + 1) % totalCertificationPages,
    );
  };

  const prevCertificationPage = () => {
    setCurrentCertificationIndex(
      (prev) => (prev - 1 + totalCertificationPages) % totalCertificationPages,
    );
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p style={{ color: "var(--text-secondary)" }}>Loading portfolio...</p>
      </div>
    );
  }

  return (
    <div className="home-container">
      {/* HERO SECTION */}
      <section id="profile" className="hero-section section">
        <div className="section-content hero-content">
          {profile?.profile_picture && (
            <div className="profile-image-container">
              <img
                src={profile.profile_picture}
                alt={profile.name}
                className="profile-image"
              />
            </div>
          )}

          <h1 className="hero-title">Hi, I'm {profile?.name || "Your Name"}</h1>

          <p className="hero-subtitle">
            {profile?.title || "Full Stack Developer"}
          </p>

          <p className="hero-bio">
            {profile?.bio ||
              "Passionate developer creating amazing web experiences."}
          </p>

          <div className="hero-buttons">
            <button
              className="btn btn-primary"
              onClick={() => scrollToSection("projects")}
            >
              <Briefcase size={20} />
              View Projects
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => scrollToSection("contact")}
            >
              <Mail size={20} />
              Contact Me
            </button>
            {profile?.resume && (
              <a href={profile.resume} className="btn btn-secondary" download>
                <Download size={20} />
                Download Resume
              </a>
            )}
          </div>

          <div className="social-links">
            {profile?.github_link && (
              <a
                href={profile.github_link}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >
                <Github size={24} />
              </a>
            )}
            {profile?.linkedin_link && (
              <a
                href={profile.linkedin_link}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >
                <Linkedin size={24} />
              </a>
            )}
            {profile?.twitter_link && (
              <a
                href={profile.twitter_link}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >
                <Twitter size={24} />
              </a>
            )}
            {profile?.leetcode_link && (
              <a
                href={profile.leetcode_link}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >
                <Code2 size={24} />
              </a>
            )}
          </div>
        </div>
      </section>

      {/* SKILLS SECTION */}
      {skills.length > 0 && (
        <section
          id="skills"
          className="section"
          style={{ background: "var(--bg-secondary)" }}
        >
          <div className="section-content">
            <div className="section-header">
              <h2 className="section-title">Skills & Expertise</h2>
              <p className="section-description">
                Technologies and tools I work with
              </p>
            </div>

            <div className="carousel-container">
              <button
                className="carousel-btn carousel-btn-left"
                onClick={prevSkillPage}
                disabled={totalSkillPages <= 1}
                aria-label="Previous skills"
              >
                <ChevronLeft size={24} />
              </button>

              <div className="skills-carousel-grid">
                {visibleSkillCards.map((card, index) => (
                  <div
                    key={`${card.category}-${index}`}
                    className="skill-category"
                  >
                    <h3 className="category-title">
                      {categoryNames[card.category] || card.category}
                      {card.totalCards > 1 &&
                        ` (${card.cardIndex + 1}/${card.totalCards})`}
                    </h3>
                    {card.skills.map((skill) => (
                      <div key={skill.id} className="skill-item">
                        <div className="skill-name">
                          <span>{skill.name}</span>
                          <span className="skill-percentage">
                            {skill.percentage}%
                          </span>
                        </div>
                        <div className="skill-bar">
                          <div
                            className="skill-progress"
                            style={{ width: `${skill.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <button
                className="carousel-btn carousel-btn-right"
                onClick={nextSkillPage}
                disabled={totalSkillPages <= 1}
                aria-label="Next skills"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {totalSkillPages > 1 && (
              <div className="carousel-indicators">
                {Array.from({ length: totalSkillPages }).map((_, index) => (
                  <div
                    key={index}
                    className={`carousel-indicator ${
                      index === currentSkillIndex ? "active" : ""
                    }`}
                    onClick={() => setCurrentSkillIndex(index)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* EXPERIENCE SECTION */}
      {experiences.length > 0 && (
        <section id="experience" className="section">
          <div className="section-content">
            <div className="section-header">
              <h2 className="section-title">Work Experience</h2>
              <p className="section-description">
                My professional journey and accomplishments
              </p>
            </div>

            <div className="timeline">
              {[...experiences]
                .sort((a, b) => new Date(b.start_date) - new Date(a.start_date))
                .map((exp, index) => (
                  <div key={exp.id} className="timeline-item">
                    <div className="timeline-marker"></div>
                    <div className="timeline-content">
                      {exp.logo && (
                        <img
                          src={exp.logo}
                          alt={exp.company_name}
                          className="company-logo"
                        />
                      )}
                      <h3 className="experience-role">{exp.role}</h3>
                      <p className="experience-company">{exp.company_name}</p>
                      <p className="experience-date">
                        {formatDate(exp.start_date)} -{" "}
                        {formatDate(exp.end_date)}
                      </p>
                      <p className="experience-description">
                        {exp.description}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* PROJECTS SECTION */}
      {projects.length > 0 && (
        <section
          id="projects"
          className="section"
          style={{ background: "var(--bg-secondary)" }}
        >
          <div className="section-content">
            <div className="section-header">
              <h2 className="section-title">Featured Projects</h2>
              <p className="section-description">
                Some of my recent work and side projects
              </p>
            </div>
            <div className="carousel-container">
              <button
                className="carousel-btn carousel-btn-left"
                onClick={prevProjectPage}
                disabled={totalProjectPages <= 1}
                aria-label="Previous projects"
              >
                <ChevronLeft size={24} />
              </button>

              <div className="projects-grid">
                {visibleProjectCards.map((project) => (
                  <div key={project.id} className="project-card">
                    {project.image && (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="project-image"
                      />
                    )}
                    <div className="project-info">
                      <h3 className="project-title">{project.title}</h3>
                      <p className="project-description">
                        {project.description}
                      </p>
                      {project.github_link && (
                        <a
                          href={project.github_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="project-link"
                        >
                          View on GitHub <ExternalLink size={16} />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <button
                className="carousel-btn carousel-btn-right"
                onClick={nextProjectPage}
                disabled={totalProjectPages <= 1}
                aria-label="Next projects"
              >
                <ChevronRight size={24} />
              </button>
            </div>
            {totalProjectPages > 1 && (
              <div className="carousel-indicators">
                {Array.from({ length: totalProjectPages }).map((_, index) => (
                  <div
                    key={index}
                    className={`carousel-indicator ${
                      index === currentProjectIndex ? "active" : ""
                    }`}
                    onClick={() => setCurrentProjectIndex(index)}
                  />
                ))}
              </div>
            )}{" "}
          </div>
        </section>
      )}

      {/* EDUCATION SECTION */}
      {education.length > 0 && (
        <section id="education" className="section">
          <div className="section-content">
            <div className="section-header">
              <h2 className="section-title">Education</h2>
              <p className="section-description">
                My academic background and qualifications
              </p>
            </div>

            <div className="timeline">
              {education.map((edu, index) => (
                <div key={edu.id} className="timeline-item">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <GraduationCap
                      size={40}
                      style={{
                        color: "var(--accent-color)",
                        marginBottom: "1rem",
                      }}
                    />
                    <h3 className="education-degree">{edu.degree}</h3>
                    <p className="education-institution">{edu.institution}</p>
                    <p className="education-date">
                      {formatDate(edu.start_date)} - {formatDate(edu.end_date)}
                    </p>
                    <p className="education-description">{edu.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CERTIFICATIONS SECTION */}
      {certifications.length > 0 && (
        <section
          id="certifications"
          className="section"
          style={{ background: "var(--bg-secondary)" }}
        >
          <div className="section-content">
            <div className="section-header">
              <h2 className="section-title">Certifications</h2>
              <p className="section-description">
                Professional certifications and achievements
              </p>
            </div>

            <div className="carousel-container">
              <button
                className="carousel-btn carousel-btn-left"
                onClick={prevCertificationPage}
                disabled={totalCertificationPages <= 1}
                aria-label="Previous certifications"
              >
                <ChevronLeft size={24} />
              </button>

              <div className="certifications-grid">
                {visibleCertifications.map((cert) => (
                  <div
                    key={cert.id}
                    className="certification-card"
                    onClick={() =>
                      cert.pdf_file && window.open(cert.pdf_file, "_blank")
                    }
                    style={{ cursor: "pointer" }}
                  >
                    {cert.image ? (
                      <img
                        src={cert.image}
                        alt={cert.title}
                        className="certification-image"
                      />
                    ) : (
                      <div
                        style={{
                          height: "220px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "var(--bg-primary)",
                        }}
                      >
                        <Award
                          size={60}
                          style={{ color: "var(--accent-color)" }}
                        />
                      </div>
                    )}
                    <div className="certification-info">
                      <h3 className="certification-title">{cert.title}</h3>
                    </div>
                  </div>
                ))}
              </div>

              <button
                className="carousel-btn carousel-btn-right"
                onClick={nextCertificationPage}
                disabled={totalCertificationPages <= 1}
                aria-label="Next certifications"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {totalCertificationPages > 1 && (
              <div className="carousel-indicators">
                {Array.from({ length: totalCertificationPages }).map(
                  (_, index) => (
                    <div
                      key={index}
                      className={`carousel-indicator ${
                        index === currentCertificationIndex ? "active" : ""
                      }`}
                      onClick={() => setCurrentCertificationIndex(index)}
                    />
                  ),
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* CONTACT SECTION */}
      <section id="contact" className="section">
        <div className="section-content">
          <div className="section-header">
            <h2 className="section-title">Get In Touch</h2>
            <p className="section-description">
              Have a question or want to work together? Feel free to reach out!
            </p>
          </div>

          <div className="contact-container">
            {/* Contact Information */}
            <div className="contact-info-box">
              <h3 className="contact-info-title">Contact Information</h3>

              {contactInfo?.description && (
                <p
                  style={{
                    marginBottom: "2rem",
                    color: "var(--text-secondary)",
                    lineHeight: "1.6",
                  }}
                >
                  {contactInfo.description}
                </p>
              )}

              {(contactInfo?.email || profile?.email) && (
                <div className="contact-detail">
                  <div className="contact-icon">
                    <Mail size={20} />
                  </div>
                  <div>
                    <strong>Email</strong>
                    <p>{contactInfo?.email || profile?.email}</p>
                  </div>
                </div>
              )}

              {(contactInfo?.phone || profile?.phone) && (
                <div className="contact-detail">
                  <div className="contact-icon">
                    <Phone size={20} />
                  </div>
                  <div>
                    <strong>Phone</strong>
                    <p>{contactInfo?.phone || profile?.phone}</p>
                  </div>
                </div>
              )}

              {(contactInfo?.address || profile?.address) && (
                <div className="contact-detail">
                  <div className="contact-icon">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <strong>Address</strong>
                    <p>{contactInfo?.address || profile?.address}</p>
                  </div>
                </div>
              )}

              <div
                className="social-links"
                style={{ marginTop: "2rem", justifyContent: "flex-start" }}
              >
                {profile?.github_link && (
                  <a
                    href={profile.github_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link"
                  >
                    <Github size={24} />
                  </a>
                )}
                {profile?.linkedin_link && (
                  <a
                    href={profile.linkedin_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link"
                  >
                    <Linkedin size={24} />
                  </a>
                )}
                {profile?.twitter_link && (
                  <a
                    href={profile.twitter_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link"
                  >
                    <Twitter size={24} />
                  </a>
                )}
                {profile?.leetcode_link && (
                  <a
                    href={profile.leetcode_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link"
                  >
                    <Code2 size={24} />
                  </a>
                )}
              </div>
            </div>

            {/* Contact Form */}
            <div className="contact-form">
              <h3 className="contact-info-title">Send a Message</h3>

              {formStatus.message && (
                <div className={`form-message ${formStatus.type}`}>
                  {formStatus.message}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-input"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-input"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message" className="form-label">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    className="form-textarea"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                  style={{ width: "100%" }}
                >
                  {submitting ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send size={20} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
