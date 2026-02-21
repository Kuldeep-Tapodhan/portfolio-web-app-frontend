<div align="center">

# 🎨 Portfolio Frontend

### React 19 + Vite SPA for the Portfolio Web Application

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![React Router](https://img.shields.io/badge/Router-v7-CA4245?logo=reactrouter&logoColor=white)](https://reactrouter.com/)
[![Axios](https://img.shields.io/badge/HTTP-Axios-5A29E4?logo=axios&logoColor=white)](https://axios-http.com/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com/)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Technologies Used](#-technologies-used)
- [UI Architecture](#-ui-architecture)
- [Routing Structure](#-routing-structure)
- [State Management](#-state-management)
- [API Integration](#-api-integration)
- [Environment Variables](#-environment-variables)
- [Local Development](#-local-development)
- [Build & Deployment](#-build--deployment)
- [Live Link](#-live-link)
- [Folder Structure](#-folder-structure)

---

## 🎯 Overview

The frontend is a **single-page application (SPA)** built with React 19 and Vite. It provides two distinct experiences:

1. **Public Portfolio** — A visually rich, responsive website that showcases the developer's profile, skills, projects, experience, education, certifications, and a contact form. All data is fetched dynamically from the backend API.

2. **Admin Dashboard** — A protected panel for the portfolio owner to manage all content through CRUD (Create, Read, Update, Delete) interfaces, including file uploads for images, PDFs, and resumes.

### Key Highlights

- ⚡ **Vite 7** for instant HMR and optimized production builds
- 🌗 **Dark/Light theme** with CSS custom properties and localStorage persistence
- 🔐 **JWT-protected admin routes** with automatic token injection
- 📱 **Fully responsive** design with mobile-first CSS
- 🎨 **Modern typography** with Google Fonts (Inter)
- 🔍 **SEO optimized** with meta tags, Open Graph, and semantic HTML

---

## 🛠️ Technologies Used

| Technology | Version | Purpose |
|---|---|---|
| React | 19.2.0 | Component-based UI framework |
| Vite | 7.2.4 | Build tool and dev server |
| React Router DOM | 7.12.0 | Client-side routing |
| Axios | 1.13.2 | HTTP client with interceptors |
| Lucide React | 0.562.0 | SVG icon library |
| Google Fonts | Inter | Typography system |
| ESLint | 9.39.1 | Code linting |
| CSS3 | — | Styling (custom properties, Grid, Flexbox) |

---

## 🏗️ UI Architecture

The frontend follows a **component-based architecture** with clear separation of concerns:

```
App.jsx (Root)
├── ThemeProvider (Context)
│   └── BrowserRouter
│       └── AuthProvider (Context)
│           └── Routes
│               │
│               ├── PUBLIC ROUTES (/*)
│               │   └── PublicLayout
│               │       ├── Navbar (with theme toggle)
│               │       ├── <Outlet /> → Page Components
│               │       │   ├── Home.jsx (main portfolio)
│               │       │   ├── /experience (coming soon)
│               │       │   ├── /education (coming soon)
│               │       │   ├── /projects (coming soon)
│               │       │   └── /contact (coming soon)
│               │       └── Footer
│               │
│               ├── AUTH ROUTE (/login)
│               │   └── Login.jsx
│               │
│               └── ADMIN ROUTES (/admin/*)
│                   └── ProtectedRouteWrapper
│                       └── AdminLayout
│                           ├── Sidebar Navigation
│                           └── <Outlet /> → Admin Pages
│                               ├── DashboardHome
│                               ├── SkillsManager
│                               ├── ProjectsManager
│                               ├── ExperienceManager
│                               ├── EducationManager
│                               ├── CertificationsManager
│                               ├── ContactInfoManager
│                               ├── MessagesManager
│                               └── ProfileManager
```

### Layout System

| Layout | Purpose | Includes |
|---|---|---|
| **PublicLayout** | Wraps all public-facing pages | Navbar, Footer, theme-aware class |
| **AdminLayout** | Wraps all admin panel pages | Sidebar navigation, outlet for content |

### Component Roles

| Component | File | Role |
|---|---|---|
| **Navbar** | `components/Navbar.jsx` | Navigation links, theme toggle, responsive menu |
| **Footer** | `components/Footer.jsx` | Site footer with credits |
| **AdminLayout** | `components/AdminLayout.jsx` | Admin sidebar with links to all managers |
| **PublicLayout** | `components/PublicLayout.jsx` | Public wrapper with Navbar + Footer |

---

## 🗺️ Routing Structure

```
/                          → Home (Portfolio Landing Page)
/experience                → Experience Page (Coming Soon)
/education                 → Education Page (Coming Soon)
/projects                  → Projects Page (Coming Soon)
/contact                   → Contact Page (Coming Soon)
/login                     → Admin Login Page
/admin                     → Dashboard Home (Protected)
/admin/skills              → Skills Manager (Protected)
/admin/projects            → Projects Manager (Protected)
/admin/experience          → Experience Manager (Protected)
/admin/education           → Education Manager (Protected)
/admin/certifications      → Certifications Manager (Protected)
/admin/contact-info        → Contact Info Manager (Protected)
/admin/messages            → Messages Manager (Protected)
/admin/profile             → Profile Manager (Protected)
*                          → Redirect to /
```

### Route Protection

All `/admin/*` routes are wrapped in a **`ProtectedRouteWrapper`** component:

```jsx
const ProtectedRouteWrapper = ({ children }) => {
    const { user, loading } = React.useContext(AuthContext);
    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login" replace />;
    return children;
};
```

- If the user is **not authenticated** → redirect to `/login`.
- If the auth state is **loading** → show a loading indicator.
- If **authenticated** → render the admin content.

---

## 🔄 State Management

The application uses **React Context API** for global state management:

### 1. AuthContext (`context/AuthContext.jsx`)

Manages authentication state across the entire application.

| Value | Type | Description |
|---|---|---|
| `user` | `object \| null` | Current authenticated user (contains token) |
| `login(userData)` | `function` | Set user data on successful login |
| `logout()` | `function` | Clear user data and remove tokens from localStorage |
| `loading` | `boolean` | Whether auth state is being initialized |

**Token Persistence:** On page load, the context checks `localStorage` for an existing `access` token. If found, the user is considered authenticated.

### 2. ThemeContext (`context/ThemeContext.jsx`)

Manages dark/light theme toggle with persistence.

| Value | Type | Description |
|---|---|---|
| `isDarkMode` | `boolean` | Current theme state (default: `true` = dark) |
| `toggleTheme()` | `function` | Toggle between dark and light mode |

**Persistence:** Theme preference is saved to `localStorage` as JSON and restored on page load.

---

## 🔗 API Integration

### Service Layer Architecture

```
services/
├── api.js            → Axios instance (base config + token interceptor)
├── auth.js           → Login/logout functions
└── portfolioApi.js   → All portfolio data fetching functions
```

### Axios Configuration (`api.js`)

```javascript
// Base URL resolves to backend API
const API_BASE_URL = import.meta.env.VITE_API_TARGET
    ? `${import.meta.env.VITE_API_TARGET}/api`
    : "/api";

// Axios instance with JWT interceptor
const api = axios.create({ baseURL: API_BASE_URL });

// Auto-attach Bearer token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access");
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
});
```

### Available API Functions (`portfolioApi.js`)

| Function | Endpoint | Returns |
|---|---|---|
| `getProfile()` | `GET /profiles/` | First profile object or `null` |
| `getSkills()` | `GET /skills/` | Array of skills |
| `getExperiences()` | `GET /experiences/` | Array of experiences |
| `getProjects()` | `GET /projects/` | Array of projects |
| `getCertifications()` | `GET /certifications/` | Array of certifications |
| `getEducation()` | `GET /education/` | Array of education records |
| `getContactInfo()` | `GET /contactinfo/` | First contact info object or `null` |
| `submitContact(data)` | `POST /contacts/` | Contact submission response |

### Authentication Functions (`auth.js`)

| Function | Description |
|---|---|
| `loginUser(username, password)` | Sends credentials, stores tokens in localStorage |
| `logoutUser()` | Removes tokens from localStorage |

### Vite Proxy (Development)

In development, Vite proxies `/api` and `/media` requests to the backend:

```javascript
// vite.config.js
proxy: {
    '/api': {
        target: env.VITE_API_TARGET || 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
    },
    '/media': {
        target: env.VITE_API_TARGET || 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
    },
}
```

---

## 🔑 Environment Variables

Create a `.env` file in the `portfolio_frontend/` directory:

```env
# Backend API URL
# For local development:
# VITE_API_TARGET=http://127.0.0.1:8000

# For production (Render backend):
VITE_API_TARGET=https://portfolio-web-app-backend.onrender.com
```

| Variable | Required | Description |
|---|---|---|
| `VITE_API_TARGET` | ✅ | Backend API base URL (without `/api` suffix) |

> **Note:** All Vite environment variables must be prefixed with `VITE_` to be accessible in client-side code via `import.meta.env`.

---

## 💻 Local Development

### Prerequisites

- Node.js ≥ 18.x
- npm ≥ 9.x

### Steps

```bash
# 1. Navigate to frontend directory
cd portfolio_frontend

# 2. Install dependencies
npm install

# 3. Set up environment variables
# Edit .env and set VITE_API_TARGET
# For local backend: VITE_API_TARGET=http://127.0.0.1:8000

# 4. Start development server
npm run dev
```

The app will be available at: **`http://localhost:5173`**

### Available Scripts

| Script | Command | Description |
|---|---|---|
| **Dev Server** | `npm run dev` | Start Vite dev server with HMR |
| **Build** | `npm run build` | Create production build in `dist/` |
| **Preview** | `npm run preview` | Preview production build locally |
| **Lint** | `npm run lint` | Run ESLint checks |

---

## 🚀 Build & Deployment

### Production Build

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Deploy to Vercel

1. Push the `portfolio_frontend/` directory to a GitHub repository.
2. Go to [vercel.com](https://vercel.com) and import the repository.
3. Set **Framework Preset** to **Vite**.
4. Add the environment variable:
   - `VITE_API_TARGET` = `https://portfolio-web-app-backend.onrender.com`
5. Click **Deploy**.

### SPA Rewrite Configuration (`vercel.json`)

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This ensures all routes are handled by React Router (client-side routing) instead of returning 404 errors for deep links.

---

## 🔴 Live Link

| Service | URL |
|---|---|
| **Portfolio Website** | [https://portfolio-web-app-frontend-ashen.vercel.app](https://portfolio-web-app-frontend-ashen.vercel.app) |

---

## 📁 Folder Structure

```
portfolio_frontend/
│
├── public/                          # Static public assets
│   └── vite.svg                     # Vite logo (favicon)
│
├── src/                             # Application source code
│   │
│   ├── components/                  # Reusable UI components
│   │   ├── AdminLayout.jsx          # Admin panel layout with sidebar
│   │   ├── PublicLayout.jsx         # Public site layout (Navbar + Footer)
│   │   ├── Navbar.jsx               # Top navigation bar with theme toggle
│   │   └── Footer.jsx              # Site footer
│   │
│   ├── context/                     # React Context providers
│   │   ├── AuthContext.jsx          # Auth state (user, login, logout, loading)
│   │   └── ThemeContext.jsx         # Theme state (isDarkMode, toggleTheme)
│   │
│   ├── pages/                       # Route-level page components
│   │   ├── Home.jsx                 # Main portfolio page (all sections)
│   │   ├── Login.jsx                # Admin login form
│   │   └── admin/                   # Admin panel pages
│   │       ├── DashboardHome.jsx    # Admin dashboard overview
│   │       ├── SkillsManager.jsx    # CRUD for skills
│   │       ├── ProjectsManager.jsx  # CRUD for projects (with image upload)
│   │       ├── ExperienceManager.jsx# CRUD for experience (with logo upload)
│   │       ├── EducationManager.jsx # CRUD for education
│   │       ├── CertificationsManager.jsx # CRUD for certifications (image + PDF)
│   │       ├── ContactInfoManager.jsx    # CRUD for contact information
│   │       ├── MessagesManager.jsx  # View and manage contact messages
│   │       └── ProfileManager.jsx   # CRUD for profile (picture + resume)
│   │
│   ├── services/                    # API service layer
│   │   ├── api.js                   # Axios instance with JWT interceptor
│   │   ├── auth.js                  # Login/logout API functions
│   │   └── portfolioApi.js          # Portfolio data fetch/submit functions
│   │
│   ├── styles/                      # CSS stylesheets
│   │   ├── Home.css                 # Main portfolio page styles
│   │   ├── StaticGrids.css          # Grid layout definitions
│   │   └── theme.css                # CSS custom properties for dark/light theme
│   │
│   ├── assets/                      # Static assets (images, etc.)
│   ├── App.jsx                      # Root component with routing configuration
│   └── main.jsx                     # Application entry point (ReactDOM.createRoot)
│
├── index.html                       # HTML template (SEO meta, Google Fonts, OG tags)
├── vite.config.js                   # Vite config (proxy, plugins, server settings)
├── vercel.json                      # Vercel SPA rewrite rules
├── eslint.config.js                 # ESLint configuration
├── package.json                     # Dependencies and npm scripts
├── package-lock.json                # Locked dependency versions
├── .env                             # Environment variables (VITE_API_TARGET)
├── .gitignore                       # Git ignore rules
└── README.md                        # This file
```

---

<div align="center">

**Built with React 19 + Vite** ⚛️

</div>
