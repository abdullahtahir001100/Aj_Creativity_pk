// src/components/DashboardProtectedWrapper.jsx
import React, { useState } from "react";
import DashboardOverview from "./DashboardOverview";
import OrderManagement from "./OrderManagement";
import V1 from "./v1";
import Home from "./Dashboard"; 
import Video from "./VideoDashboard";
import AuthForm from "../components/AuthForm.jsx";
import BlogDashboard from "../components/BlogDashboard";
import "../styles/dashboard-header.scss";

const DashboardProtectedWrapper = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState("orders");
  // NEW STATE for Burger Menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };
  
  // Navigation handler to close menu after clicking a link
  const handleNavigation = (page) => {
    setCurrentPage(page);
    // Menu ko band karein jab koi link click ho
    setIsMenuOpen(false); 
  };

  if (!isAuthenticated) {
    return <AuthForm onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <header className="dashboard-header">
        <h1 className="dashboard-title">Admin Dashboard</h1>
        
        {/* Burger Menu Button - Only visible on small screens */}
        <button 
            className="menu-toggle-button" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-controls="dashboard-nav"
        >
            {/* Hamburger Icon */}
            <span className="burger-icon"></span>
        </button>
        
        {/* Navigation Links - Conditional Class for Mobile */}
        <nav id="dashboard-nav" className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
          <button
            onClick={() => handleNavigation("overview")}
            className={`nav-button ${currentPage === "overview" ? "active" : ""}`}
          >
            Overview
          </button>
          <button
            onClick={() => handleNavigation("orders")}
            className={`nav-button ${currentPage === "orders" ? "active" : ""}`}
          >
            Orders
          </button>
          <button
            onClick={() => handleNavigation("products")}
            className={`nav-button ${currentPage === "products" ? "active" : ""}`}
          >
            Products
          </button>
          <button
            onClick={() => handleNavigation("homeDashboard")}
            className={`nav-button ${currentPage === "homeDashboard" ? "active" : ""}`}
          >
            Home Dashboard
          </button>
          <button style={{fontSize: '12px'}}
            onClick={() => handleNavigation("VideoDashboard")}
            className={`nav-button ${currentPage === "VideoDashboard" ? "active" : ""}`}
          >
            Video Dashboard
          </button>
           <button style={{fontSize: '12px'}}
            onClick={() => handleNavigation("BlogDashboard")}
            className={`nav-button ${currentPage === "BlogDashboard" ? "active" : ""}`}
          >
            BlogDashboard
          </button>
        </nav>
      </header>

      <main style={{ flexGrow: 1, backgroundColor: '#f8fafc' }}>
        {currentPage === "overview" && <DashboardOverview />}
        {currentPage === "orders" && <OrderManagement />}
        {currentPage === "products" && <V1 />}
        {currentPage === "homeDashboard" && <Home />}
        {currentPage === "VideoDashboard" && <Video />}
        {currentPage === "BlogDashboard" && <BlogDashboard />}
      </main>
    </div>
  );
};

export default DashboardProtectedWrapper;