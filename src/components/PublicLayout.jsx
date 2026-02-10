import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { ThemeContext } from "../context/ThemeContext";

const PublicLayout = () => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    // We apply the class 'light-mode' if isDarkMode is false
    <div
      className={!isDarkMode ? "light-mode" : ""}
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "var(--bg-primary)",
        color: "var(--text-primary)",
        transition: "background 0.3s, color 0.3s",
      }}
    >
      <Navbar />

      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default PublicLayout;
