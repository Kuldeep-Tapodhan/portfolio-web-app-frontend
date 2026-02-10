import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext'; // <--- Import ThemeProvider

// Components
import AdminLayout from './components/AdminLayout';
import PublicLayout from './components/PublicLayout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';

// Admin Pages
import DashboardHome from './pages/admin/DashboardHome';
import SkillsManager from './pages/admin/SkillsManager';
import ProjectsManager from './pages/admin/ProjectsManager';
import ExperienceManager from './pages/admin/ExperienceManager';
import EducationManager from './pages/admin/EducationManager';
import CertificationsManager from './pages/admin/CertificationsManager';
import ContactInfoManager from './pages/admin/ContactInfoManager';
import MessagesManager from './pages/admin/MessagesManager';
import ProfileManager from './pages/admin/ProfileManager';

const ProtectedRouteWrapper = ({ children }) => {
    const { user, loading } = React.useContext(AuthContext);
    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login" replace />;
    return children;
};

function App() {
  return (
    <ThemeProvider> 
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            
            {/* PUBLIC SIDE */}
            <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                {/* Placeholders for new links to avoid crashes */}
                <Route path="/experience" element={<div style={{textAlign:'center', marginTop:'50px'}}>Experience Page Coming Soon</div>} />
                <Route path="/education" element={<div style={{textAlign:'center', marginTop:'50px'}}>Education Page Coming Soon</div>} />
                <Route path="/projects" element={<div style={{textAlign:'center', marginTop:'50px'}}>Projects Page Coming Soon</div>} />
                <Route path="/contact" element={<div style={{textAlign:'center', marginTop:'50px'}}>Contact Page Coming Soon</div>} />
            </Route>

            {/* ADMIN SIDE */}
            <Route path="/login" element={<Login />} />
            
            <Route path="/admin" element={
                <ProtectedRouteWrapper>
                    <AdminLayout />
                </ProtectedRouteWrapper>
            }>
                <Route index element={<DashboardHome />} />
                <Route path="skills" element={<SkillsManager />} />
                <Route path="projects" element={<ProjectsManager />} />
                <Route path="experience" element={<ExperienceManager />} />
                <Route path="education" element={<EducationManager />} />
                <Route path="certifications" element={<CertificationsManager />} />
                <Route path="contact-info" element={<ContactInfoManager />} />
                <Route path="messages" element={<MessagesManager />} />
                <Route path="profile" element={<ProfileManager />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;