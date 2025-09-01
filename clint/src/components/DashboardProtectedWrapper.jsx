import React, { useState } from "react";
import DashboardOverview from "./DashboardOverview";
import OrderManagement from "./OrderManagement";
import V1 from "./v1";
import AuthForm from "../components/AuthForm.jsx";
import "../styles/dashboard-header.scss"; // Naya SCSS file import kiya gaya hai

const DashboardProtectedWrapper = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState("orders");

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <AuthForm onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Naya Header */}
      <header className="dashboard-header">
        <h1 className="dashboard-title">Admin Dashboard</h1>
        <nav className="nav-links">
          <button
            onClick={() => setCurrentPage("overview")}
            className={`nav-button ${currentPage === "overview" ? "active" : ""}`}
          >
            Overview
          </button>
          <button
            onClick={() => setCurrentPage("orders")}
            className={`nav-button ${currentPage === "orders" ? "active" : ""}`}
          >
            Orders
          </button>
          <button
            onClick={() => setCurrentPage("products")}
            className={`nav-button ${currentPage === "products" ? "active" : ""}`}
          >
            Products
          </button>
         <a href="/#/HomeDashboard" className="button">HomeDashboard</a>
        
        </nav>
      </header>

      <main style={{ flexGrow: 1, backgroundColor: '#f8fafc' }}>
        {currentPage === "overview" && <DashboardOverview />}
        {currentPage === "orders" && <OrderManagement />}
        {currentPage === "products" && <V1 />}
      </main>
    </div>
  );
};

export default DashboardProtectedWrapper;