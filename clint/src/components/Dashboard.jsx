import React, { useEffect, useState, useRef } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, PieChart, Pie, Cell, AreaChart, Area, ComposedChart,
  ScatterChart, Scatter, RadialBarChart, RadialBar, Treemap, FunnelChart,
  Funnel, LabelList,
} from "recharts";

// CSS Styles with High-Impact Animations
const dashboardStyles = `
  :root {
    --primary-color: #3b82f6;
    --secondary-color: #10b981;
    --background-color: #f3f4f6;
    --card-bg-color: #ffffff;
    --text-color: #1f2937;
    --text-muted-color: #6b7280;
    --border-color: #e5e7eb;
    --shadow-light: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
    --radius-card: 1.5rem;
    --radius-full: 9999px;
  }
    .recharts-trapezoid{
    fill: var(--primary-color);
    }
.flk {
    display: flex
;
    justify-content: space-between;
    align-items: center;
    }
    .flk .chart-container{
    width: 49%;
    }
  /* Exaggerated Keyframe Animations */
  @keyframes dramaticFadeIn {
    from {
      opacity: 0;
      transform: translateY(50px) scale(0.9);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @keyframes highImpactPop {
    0% {
      transform: scale(0.5);
      opacity: 0;
    }
    80% {
      transform: scale(1.1);
      opacity: 1;
    }
    100% {
      transform: scale(1);
    }
  }

  @keyframes intensePulse {
    0%, 100% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.05);
      opacity: 0.8;
      box-shadow: 0 0 20px #ffbb28;
    }
  }

  @keyframes bounceInUp {
    0%, 60%, 75%, 90%, 100% {
      transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    }
    0% {
      opacity: 0;
      transform: translate3d(0, 3000px, 0) scale(0.9);
    }
    60% {
      opacity: 1;
      transform: translate3d(0, -20px, 0) scale(1.05);
    }
    75% {
      transform: translate3d(0, 10px, 0) scale(0.98);
    }
    90% {
      transform: translate3d(0, -5px, 0) scale(1.01);
    }
    100% {
      transform: translate3d(0, 0, 0) scale(1);
    }
  }
  
  @keyframes strongWobble {
    0%, 100% { transform: translateX(0) rotate(0deg); }
    15% { transform: translateX(-10px) rotate(-5deg); }
    30% { transform: translateX(10px) rotate(5deg); }
    45% { transform: translateX(-10px) rotate(-5deg); }
    60% { transform: translateX(10px) rotate(5deg); }
    75% { transform: translateX(-10px) rotate(-5deg); }
  }

  @keyframes glowing {
      0% { box-shadow: 0 0 5px #ff8042; }
      50% { box-shadow: 0 0 20px #ff8042; }
      100% { box-shadow: 0 0 5px #ff8042; }
  }

  body {
    font-family: 'Inter', sans-serif;
    background-color: var(--background-color);
    margin: 0;
    padding: 0;
  }

  .dashboard-container {
    min-height: 100vh;
    padding: 2.5rem 1.5rem;
    color: var(--text-color);
    animation: dramaticFadeIn 1s ease-in-out;
  }

  .header {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 2rem;
    padding: 1.5rem;
    background-color: var(--card-bg-color);
    border-radius: var(--radius-card);
    box-shadow: var(--shadow-lg);
    animation: bounceInUp 1.5s;
  }

  @media (min-width: 768px) {
    .header {
      flex-direction: row;
    }
  }

  .header-title {
    font-size: 1.875rem;
    font-weight: 800;
    color: #111827;
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    animation: highImpactPop 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  }

  @media (min-width: 768px) {
    .header-title {
      margin-bottom: 0;
    }
  }

  .header-actions {
    display: flex;
    gap: 1rem;
    animation: dramaticFadeIn 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  }

  .tab-button {
    display: flex;
    align-items: center;
    padding: 0.5rem 1.5rem;
    border-radius: var(--radius-full);
    font-weight: 600;
    transition: all 0.3s ease-in-out;
    cursor: pointer;
    text-decoration: none;
    animation: highImpactPop 0.8s ease-out;
  }

  .tab-button:hover {
    transform: translateY(-5px) scale(1.1);
    box-shadow: var(--shadow-lg);
    animation: strongWobble 0.7s ease-in-out infinite;
  }

  .tab-button.active {
    background-color: var(--primary-color);
    color: var(--card-bg-color);
    box-shadow: var(--shadow-light);
    transform: scale(1.1);
    animation: glowing 1.5s infinite;
  }

  .tab-button:not(.active) {
    background-color: #e5e7eb;
    color: #4b5563;
  }

  .tab-button:not(.active):hover {
    background-color: #d1d5db;
  }

  .main-content {
    margin-top: 2rem;
    animation: dramaticFadeIn 1.2s ease-in-out;
  }

  .sub-tabs {
    display: flex;
    justify-content: center;
    background-color: var(--card-bg-color);
    padding: 2rem;
    border-radius: var(--radius-card);
    box-shadow: var(--shadow-light);
    gap: 1rem;
    margin-bottom: 2rem;
    animation: bounceInUp 1.2s;
  }

  .sub-tab-button {
    padding: 0.5rem 1.5rem;
    border-radius: var(--radius-full);
    font-weight: 700;
    transition: all 0.3s ease-in-out;
    cursor: pointer;
    text-decoration: none;
    color: var(--text-muted-color);
  }

  .sub-tab-button:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: var(--shadow-light);
  }

  .sub-tab-button.active-all {
    background-color: var(--primary-color);
    color: var(--card-bg-color);
    box-shadow: var(--shadow-light);
    animation: intensePulse 1.5s infinite;
  }
  .sub-tab-button.active-pending {
    background-color: #f59e0b;
    color: var(--card-bg-color);
    box-shadow: var(--shadow-light);
    animation: intensePulse 1.5s infinite;
  }
  .sub-tab-button.active-completed {
    background-color: #16a34a;
    color: var(--card-bg-color);
    box-shadow: var(--shadow-light);
    animation: intensePulse 1.5s infinite;
  }

  .card-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  @media (min-width: 768px) {
    .card-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (min-width: 1024px) {
    .card-grid {
      grid-template-columns: repeat(1, 1fr);
    }
      .kp-grid{
       grid-template-columns: repeat(4, 1fr);
       margen-bottom: 2rem;
               padding: 20px 0;

      }
  }
  
  .order-list-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;
  }

  .order-card {
    background-color: var(--card-bg-color);
    padding: 1.5rem;
    border-radius: var(--radius-card);
    box-shadow: var(--shadow-light);
    transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    animation: dramaticFadeIn 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  }

  .order-card:hover {
    transform: translateY(-10px) scale(1.02) rotate(2deg);
    box-shadow: var(--shadow-lg);
  }
  
  @media (min-width: 768px) {
    .order-card {
        flex-direction: row;
        gap: 2rem;
    }
  }
  
  .card-section {
    flex: 1;
    background-color: #f9fafb;
    padding: 1.5rem;
    border-radius: 1rem;
    box-shadow: inset 0 2px 4px 0 rgb(0 0 0 / 0.05);
    border: 1px solid #f3f4f6;
    animation: highImpactPop 0.9s ease-out;
  }

  .card-section-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--primary-color);
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
  }
  
  .text-icon {
      margin-right: 0.5rem;
      color: var(--primary-color);
      animation: intensePulse 2s ease-in-out infinite;
  }
  
  .product-list {
    max-height: 15rem;
    overflow-x: hidden;
    padding-right: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .product-item {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 1rem;
    background-color: #ffffff;
    border-radius: 0.75rem;
    box-shadow: var(--shadow-light);
    border: 1px solid var(--border-color);
    animation: dramaticFadeIn 0.5s ease-in-out;
    transition: transform 0.2s ease-in-out;
  }
  
  .product-item:hover {
      transform: translateX(10px) scale(1.05) rotate(-2deg);
  }
  
  .product-image-container {
      flex-shrink: 0;
      width: 27rem;
      height: 11rem;
      border-radius: 0.5rem;
      background-color: #e5e7eb;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
  }
  
  .product-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease-in-out;
  }
  
  .product-image:hover {
      transform: scale(1.2) rotate(5deg);
  }

  .product-details {
    flex-grow: 1;
  }

  .product-name {
    font-weight: 700;
    color: var(--text-color);
  }

  .product-info {
    font-size: 0.875rem;
    color: var(--text-muted-color);
  }

  .product-info strong {
    color: var(--text-color);
    font-weight: 600;
  }
  
  .card-actions {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      margin-top: 1rem;
  }

  @media (min-width: 768px) {
      .card-actions {
          flex-direction: column;
          margin-top: 0;
      }
  }

  .action-button {
    padding: 0.5rem 1.5rem;
    border-radius: var(--radius-full);
    font-weight: 700;
    transition: all 0.3s ease-in-out;
    box-shadow: var(--shadow-light);
    color: var(--card-bg-color);
    border: none;
    cursor: pointer;
  }

  .action-button:hover {
    transform: translateY(-5px) scale(1.1);
    box-shadow: var(--shadow-lg);
  }
  
  .action-button.remove:hover {
      animation: strongWobble 0.7s ease-in-out;
  }
  
  .action-button.complete:hover {
      animation: strongWobble 0.7s ease-in-out;
  }

  .action-button.remove {
    background-color: #ef4444;
  }

  .action-button.remove:hover {
    background-color: #dc2626;
  }
  
  .action-button.complete {
    background-color: #16a34a;
  }

  .action-button.complete:hover {
    background-color: #15803d;
  }
  
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 50;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.7);
    animation: dramaticFadeIn 0.5s ease-in-out;
  }

  .modal-content {
    background-color: var(--card-bg-color);
    color: var(--text-color);
    padding: 2rem;
    border-radius: var(--radius-card);
    box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
    max-width: 24rem;
    width: 100%;
    border: 1px solid var(--border-color);
    animation: highImpactPop 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
  }

  .modal-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #111827;
  }

  .modal-close-button {
    color: #9ca3af;
    cursor: pointer;
    transition: transform 0.2s, color 0.2s;
  }
  
  .modal-close-button:hover {
      color: #4b5563;
      transform: rotate(180deg) scale(1.2);
      animation: intensePulse 0.5s ease-in-out infinite;
  }

  .modal-message {
    font-size: 0.875rem;
    color: var(--text-muted-color);
    margin-bottom: 1.5rem;
  }

  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
  }
  
  .modal-button {
    padding: 0.5rem 1rem;
    border-radius: var(--radius-full);
    font-weight: 600;
    transition: background-color 0.2s, transform 0.2s;
    border: none;
    cursor: pointer;
  }
  
  .modal-button:hover {
    transform: scale(1.1);
  }

  .modal-button.cancel {
    background-color: #e5e7eb;
    color: #4b5563;
  }

  .modal-button.cancel:hover {
    background-color: #d1d5db;
  }

  .modal-button.confirm {
    background-color: #dc2626;
    color: #ffffff;
  }

  .modal-button.confirm:hover {
    background-color: #b91c1c;
  }

  .auth-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--background-color);
    padding: 1rem;
  }

  .auth-card {
    background-color: var(--card-bg-color);
    padding: 2rem;
    border-radius: var(--radius-card);
    box-shadow: var(--shadow-lg);
    width: 100%;
    max-width: 24rem;
    border: 1px solid var(--border-color);
    animation: highImpactPop 1s ease-in-out;
  }

  .auth-title {
    font-size: 1.875rem;
    font-weight: 700;
    text-align: center;
    margin-bottom: 1.5rem;
    color: var(--primary-color);
    animation: dramaticFadeIn 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  }

  .auth-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .auth-label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
    margin-bottom: 0.25rem;
  }

  .auth-input {
    width: 100%;
    padding: 0.5rem 1rem;
    background-color: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 0.75rem;
    color: var(--text-color);
    transition: all 0.2s ease;
  }

  .auth-input::placeholder {
    color: #9ca3af;
  }

  .auth-input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
    transform: scale(1.02);
  }

  .auth-error {
    color: #ef4444;
    font-size: 0.875rem;
    text-align: center;
    animation: dramaticFadeIn 0.5s ease-in-out;
  }

  .auth-submit-button {
    width: 100%;
    padding: 0.5rem 1rem;
    background-color: var(--primary-color);
    color: var(--card-bg-color);
    font-weight: 700;
    border-radius: 0.75rem;
    box-shadow: var(--shadow-light);
    transition: background-color 0.2s, transform 0.2s;
    border: none;
    cursor: pointer;
  }

  .auth-submit-button:hover {
    background-color: #2563eb;
    transform: scale(1.05) rotate(1deg);
  }
  
  .loader {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--background-color);
    animation: dramaticFadeIn 0.5s ease-in-out;
  }

  .loader p {
    font-size: 1.25rem;
    color: var(--text-muted-color);
    animation: intensePulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  
  .icon {
      width: 1.5rem;
      height: 1.5rem;
      display: inline-block;
      margin-right: 0.5rem;
      vertical-align: middle;
      transition: transform 0.3s ease-in-out;
  }
  
  .icon:hover {
    transform: rotate(360deg) scale(1.2);
  }

  .card-kpi {
      transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
      animation: dramaticFadeIn 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  }

  .card-kpi:hover {
      transform: translateY(-10px) scale(1.03);
      box-shadow: var(--shadow-lg);
  }

  .chart-container {
    animation: highImpactPop 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  }

  .recharts-wrapper {
      animation: dramaticFadeIn 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  }
`;

// Inline SVG Icons for a lightweight and cohesive look
const ChartLineIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="icon" style={{color: '#3b82f6'}}>
    <path fillRule="evenodd" d="M2.25 10.5a8.25 8.25 0 1 1 16.5 0 8.25 8.25 0 0 1-16.5 0ZM19.5 10.5a.75.75 0 0 0-.75-.75h-2.25a.75.75 0 0 0 0 1.5H18a.75.75 0 0 0 .75-.75ZM15 10.5a.75.75 0 0 0-.75-.75H12a.75.75 0 0 0 0 1.5h2.25a.75.75 0 0 0 .75-.75ZM10.5 10.5a.75.75 0 0 0-.75-.75H8.25a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 .75-.75Z" clipRule="evenodd" />
  </svg>
);
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="icon" style={{color: '#3b82f6'}}>
    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 16.5a.75.75 0 0 0 .979-.344C5.556 14.168 7.371 13.5 9.28 13.5h5.44c1.908 0 3.723.668 4.55 1.761a.75.75 0 0 0 .98-.346 9 9 0 1 0-16.148 0Z" clipRule="evenodd" />
  </svg>
);
const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="icon">
    <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
  </svg>
);
const BoxIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="icon" style={{color: '#3b82f6'}}>
    <path fillRule="evenodd" d="M11.54 22.351a.75.75 0 0 1-.84.062L5.805 19.98a.75.75 0 0 1-.58-.87l.076-.416A13.885 13.885 0 0 1 12 15.356a13.884 13.884 0 0 1 6.702 3.345l.076.416a.75.75 0 0 1-.58.87l-4.895 2.433a.75.75 0 0 1-.84-.062ZM12 18a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" clipRule="evenodd" />
    <path fillRule="evenodd" d="M12 18a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" clipRule="evenodd" />
    <path d="M12 2.25a.75.75 0 0 1 .75.75V4.5a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM18.98 1.623a.75.75 0 0 0-.858.12l-1.571 1.572a.75.75 0 0 0 1.06 1.06l1.571-1.57a.75.75 0 0 0-.12-1.062ZM3.793 1.623a.75.75 0 0 1 .858.12l1.571 1.572a.75.75 0 0 1-1.06 1.06l-1.571-1.57a.75.75 0 0 1 .12-1.062ZM12 8.25a.75.75 0 0 1 .75.75v5.25a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Z" />
    <path fillRule="evenodd" d="M12 2.25a.75.75 0 0 1 .75.75v5.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
  </svg>
);
const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="icon" style={{color: '#ef4444'}}>
    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z" clipRule="evenodd" />
  </svg>
);
const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="icon" style={{color: '#16a34a'}}>
    <path fillRule="evenodd" d="M19.927 10.927a.75.75 0 0 0-.008-1.063l-10.5-10.5a.75.75 0 0 0-1.06-.008l-4.5 4.5a.75.75 0 0 0 1.061 1.06L15 4.568l9.427 9.426a.75.75 0 0 0 1.061-1.06Z" clipRule="evenodd" />
  </svg>
);
const DollarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="icon" style={{color: '#f59e0b'}}>
    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z" clipRule="evenodd" />
  </svg>
);

// Utility function to generate a color from a string for consistent chart colors
const stringToColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    let value = (hash >> (i * 8)) & 0xFF;
    color += ('00' + value.toString(16)).substr(-2);
  }
  return color;
};

// Custom Modal Component to replace native alerts/confirms
const Modal = ({ show, title, message, onConfirm, onCancel }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button onClick={onCancel} className="modal-close-button">
            <CloseIcon />
          </button>
        </div>
        <p className="modal-message">{message}</p>
        <div className="modal-actions">
          <button onClick={onCancel} className="modal-button cancel">
            Cancel
          </button>
          <button onClick={onConfirm} className="modal-button confirm">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

// Reusable Order Card Component
const OrderCard = ({ order, handleRemove, handleComplete, index }) => {
  const cardStyle = {
    animationDelay: `${index * 0.1}s`,
  };
  return (
    <div className="order-card" style={cardStyle}>
      {/* Order Details Container */}
      <div className="order-details-container" style={{display: 'flex', flexDirection: 'column', gap: '2rem', flex: '1', width: '100%'}}>
        {/* User Details Section */}
        <div className="card-section">
          <h2 className="card-section-title"><UserIcon className="text-icon" />User Details</h2>
          <div className="text-sm" style={{fontSize: '0.875rem', lineHeight: '1.25rem', color: 'var(--text-muted-color)'}}>
            <p style={{marginBottom: '0.5rem'}}><strong style={{color: 'var(--text-color)'}}>Name:</strong> {order.userName}</p>
            <p style={{marginBottom: '0.5rem'}}><strong style={{color: 'var(--text-color)'}}>Email:</strong> {order.email || "N/A"}</p>
            <p style={{marginBottom: '0.5rem'}}><strong style={{color: 'var(--text-color)'}}>Primary:</strong> {order.primaryNumber}</p>
            <p style={{marginBottom: '0.5rem'}}><strong style={{color: 'var(--text-color)'}}>Alternate:</strong> {order.altNumber || "N/A"}</p>
            <p style={{marginBottom: '0.5rem'}}><strong style={{color: 'var(--text-color)'}}>Address:</strong> {order.address}</p>
            <p style={{marginBottom: '0.5rem'}}><strong style={{color: 'var(--text-color)'}}>Location:</strong> {order.location}</p>
            <p style={{marginBottom: '0.5rem'}}><strong style={{color: 'var(--text-color)'}}>Payment:</strong> {order.paymentMethod}</p>
            <p style={{marginBottom: '0.5rem'}}><strong style={{color: 'var(--text-color)'}}>Total:</strong> Rs {order.totalPrice}</p>
          </div>
        </div>
        
        {/* Products Section */}
        <div className="card-section" style={{flex: '2'}}>
          <h2 className="card-section-title">🛍️ Products</h2>
          <div className="product-list">
            {order.products?.map((p, productIndex) => (
              <div key={productIndex} className="product-item">
                <div className="product-image-container">
                  {p.image ? (
                    <img src={p.image} alt={p.name} className="product-image" />
                  ) : (
                    <span style={{fontSize: '0.75rem', color: '#6b7280', textAlign: 'center', padding: '0.25rem'}}>No Image</span>
                  )}
                </div>
                <div className="product-details">
                  <p className="product-name">{p.name}</p>
                  <p className="product-info"><strong style={{fontWeight: '600'}}>Size:</strong> {p.size || "N/A"}</p>
                  <p className="product-info"><strong style={{fontWeight: '600'}}>Color:</strong> {p.color || "N/A"}</p>
                  <p className="product-info"><strong style={{fontWeight: '600'}}>Quantity:</strong> {p.quantity}</p>
                  <p className="product-info"><strong style={{fontWeight: '600'}}>Price:</strong> Rs {p.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="card-actions">
        <button
          onClick={() => handleRemove(order._id)}
          className="action-button remove"
        >
          ❌ Remove
        </button>
        {order.status === "pending" && (
          <button
            onClick={() => handleComplete(order._id)}
            className="action-button complete"
          >
            ✅ Complete
          </button>
        )}
      </div>
    </div>
  );
};

// AuthForm component with a basic login mock-up
const AuthForm = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === "admi" && password === "password") {
      onLoginSuccess();
    } else {
      setError("Invalid credentials. Please use 'admin' and 'password'.");
    }
  };

  return (
    <div className="auth-container">
      <style>{dashboardStyles}</style>
      <div className="auth-card">
        <h2 className="auth-title">Login</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div>
            <label className="auth-label" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="auth-input"
              placeholder="admin"
            />
          </div>
          <div>
            <label className="auth-label" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
              placeholder="password"
            />
          </div>
          {error && <p className="auth-error">{error}</p>}
          <button
            type="submit"
            className="auth-submit-button"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

// Main Dashboard Component
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("orders");
  const [orderSubTab, setOrderSubTab] = useState("pending");
  const [modal, setModal] = useState({ show: false, message: "", onConfirm: null, title: "" });

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("https://aj-creativitypk.vercel.app/api/orders");
        const data = await res.json();
        if (data.success && Array.isArray(data.orders)) {
          setOrders(data.orders);
        } else if (Array.isArray(data)) {
          setOrders(data);
        } else {
          console.warn("⚠ Unexpected API response:", data);
          setOrders([]);
        }
      } catch (err) {
        console.error("❌ Fetch error:", err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleRemove = (id) => {
    setModal({
      show: true,
      title: "Confirm Deletion",
      message: "Are you sure you want to delete this order? This action cannot be undone.",
      onConfirm: async () => {
        setModal({ ...modal, show: false });
        try {
          const res = await fetch(`https://aj-creativitypk.vercel.app/api/orders/${id}`, {
            method: "DELETE",
          });
          const data = await res.json();
          if (data.success || data.message?.toLowerCase().includes("deleted")) {
            setOrders((prev) => prev.filter((order) => order._id !== id));
          } else {
            setModal({
              show: true,
              title: "Error",
              message: data.message || "Failed to delete order.",
              onConfirm: () => setModal({ ...modal, show: false }),
              onCancel: () => setModal({ ...modal, show: false })
            });
          }
        } catch (err) {
          console.error(err);
          setModal({
            show: true,
            title: "Error",
            message: "Error connecting to server. Please try again later.",
            onConfirm: () => setModal({ ...modal, show: false }),
            onCancel: () => setModal({ ...modal, show: false })
          });
        }
      },
      onCancel: () => setModal({ ...modal, show: false }),
    });
  };

  const handleComplete = async (id) => {
    try {
      const res = await fetch(`https://aj-creativitypk.vercel.app/api/orders/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed" }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) => (o._id === id ? { ...o, status: "completed" } : o))
        );
      } else {
        setModal({
          show: true,
          title: "Error",
          message: data.message || "Failed to mark as completed.",
          onConfirm: () => setModal({ ...modal, show: false }),
          onCancel: () => setModal({ ...modal, show: false })
        });
      }
    } catch (err) {
      console.error(err);
      setModal({
        show: true,
        title: "Error",
        message: "Error connecting to server. Please try again later.",
        onConfirm: () => setModal({ ...modal, show: false }),
        onCancel: () => setModal({ ...modal, show: false })
      });
    }
  };

  if (loading) {
    return (
      <div className="loader">
        <style>{dashboardStyles}</style>
        <p>⏳ Loading Dashboard...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthForm onLoginSuccess={handleLoginSuccess} />;
  }

  // Data processing for charts
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const chartData = months.map((m, i) => ({
    month: m,
    orders: orders.filter((o) => new Date(o.createdAt).getMonth() === i).length,
    revenue: orders
      .filter((o) => new Date(o.createdAt).getMonth() === i)
      .reduce((acc, o) => acc + (o.totalPrice || 0), 0),
  }));
  const statusChartData = months.map((m, i) => ({
    month: m,
    pending: orders.filter(
      (o) => new Date(o.createdAt).getMonth() === i && o.status === "pending"
    ).length,
    completed: orders.filter(
      (o) => new Date(o.createdAt).getMonth() === i && o.status === "completed"
    ).length,
  }));
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  const pendingOrders = orders.filter((o) => o.status === "pending");
  const completedOrders = orders.filter((o) => o.status === "completed");

  // Advanced chart data
  const productRevenueData = orders.flatMap(o => o.products || []).reduce((acc, p) => {
    acc[p.name] = (acc[p.name] || 0) + (p.price * p.quantity || 0);
    return acc;
  }, {});
  const productDataForCharts = Object.entries(productRevenueData).map(([name, revenue]) => ({ name, revenue }));
  const categoryData = orders.flatMap(o => o.products || []).reduce((acc, p) => {
    const category = p.category || "Uncategorized";
    acc[category] = (acc[category] || 0) + (p.quantity || 0);
    return acc;
  }, {});
  const categoryDataForCharts = Object.entries(categoryData).map(([name, value]) => ({ name, value }));
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF0000', '#00FF00', '#0000FF'];
  const funnelData = [
    { name: 'Pending', value: pendingOrders.length },
    { name: 'Completed', value: completedOrders.length },
  ];
  const salesByCountryData = orders.reduce((acc, o) => {
    const country = o.location || "Unknown";
    acc[country] = (acc[country] || 0) + (o.totalPrice || 0);
    return acc;
  }, {});
  const salesByCountryDataForCharts = Object.entries(salesByCountryData).map(([name, value]) => ({ name, value }));

  return (
    <div className="dashboard-container">
      <style>{dashboardStyles}</style>
      <Modal {...modal} />
      {/* Main Header */}
      <header className="header">
        <h1 className="header-title">
          <ChartLineIcon /> Orders Dashboard
        </h1>
        <div className="header-actions">
          <button onClick={() => setActiveTab("orders")} className={`tab-button ${activeTab === "orders" ? "active" : ""}`}>
            <BoxIcon style={{color: activeTab === 'orders' ? 'white' : 'inherit'}} /> Orders
          </button>
          <button onClick={() => setActiveTab("analytics")} className={`tab-button ${activeTab === "analytics" ? "active" : ""}`}>
            <ChartLineIcon style={{color: activeTab === 'analytics' ? 'white' : 'inherit'}} /> Analytics
          </button>
        </div>
      </header>
      
      {/* Content */}
      <main className="main-content">
        {activeTab === "orders" && (
          <div className="space-y-8">
            <div className="sub-tabs">
              <button
                onClick={() => setOrderSubTab("all")}
                className={`sub-tab-button ${orderSubTab === "all" ? "active-all" : ""}`}
              >
                All Orders
              </button>
              <button
                onClick={() => setOrderSubTab("pending")}
                className={`sub-tab-button ${orderSubTab === "pending" ? "active-pending" : ""}`}
              >
                Pending Orders
              </button>
              <button
                onClick={() => setOrderSubTab("completed")}
                className={`sub-tab-button ${orderSubTab === "completed" ? "active-completed" : ""}`}
              >
                Completed Orders
              </button>
            </div>
            
            <div className="order-list-grid">
              {orders.filter((o) => {
                if (orderSubTab === "all") return true;
                return o.status === orderSubTab;
              }).length > 0 ? (
                orders.filter((o) => {
                  if (orderSubTab === "all") return true;
                  return o.status === orderSubTab;
                }).map((o, index) => (
                  <OrderCard
                    key={o._id}
                    order={o}
                    handleRemove={handleRemove}
                    handleComplete={handleComplete}
                    index={index}
                  />
                ))
              ) : (
                <p style={{textAlign: 'center', fontSize: '1.25rem', color: '#6b7280', padding: '2rem'}}>No orders found for this category. 🎉</p>
              )}
            </div>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="card-grid kp-grid">
              <div className="card-kpi" style={{display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: 'var(--card-bg-color)', padding: '1.5rem', borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-light)'}}>
                <div style={{padding: '0.75rem', backgroundColor: '#dbeafe', borderRadius: '0.75rem', color: '#3b82f6'}}>
                  <BoxIcon />
                </div>
                <div>
                  <div style={{fontSize: '2.25rem', fontWeight: '700', color: '#111827'}}>{totalOrders}</div>
                  <div style={{fontSize: '0.875rem', color: '#6b7280'}}>Total Orders</div>
                </div>
              </div>
              <div className="card-kpi" style={{display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: 'var(--card-bg-color)', padding: '1.5rem', borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-light)'}}>
                <div style={{padding: '0.75rem', backgroundColor: '#fee2e2', borderRadius: '0.75rem', color: '#ef4444'}}>
                  <ClockIcon />
                </div>
                <div>
                  <div style={{fontSize: '2.25rem', fontWeight: '700', color: '#111827'}}>{pendingOrders.length}</div>
                  <div style={{fontSize: '0.875rem', color: '#6b7280'}}>Pending</div>
                </div>
              </div>
              <div className="card-kpi" style={{display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: 'var(--card-bg-color)', padding: '1.5rem', borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-light)'}}>
                <div style={{padding: '0.75rem', backgroundColor: '#dcfce7', borderRadius: '0.75rem', color: '#16a34a'}}>
                  <CheckIcon />
                </div>
                <div>
                  <div style={{fontSize: '2.25rem', fontWeight: '700', color: '#111827'}}>{completedOrders.length}</div>
                  <div style={{fontSize: '0.875rem', color: '#6b7280'}}>Completed</div>
                </div>
              </div>
              <div className="card-kpi" style={{display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: 'var(--card-bg-color)', padding: '1.5rem', borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-light)'}}>
                <div style={{padding: '0.75rem', backgroundColor: '#fef3c7', borderRadius: '0.75rem', color: '#f59e0b'}}>
                  <DollarIcon />
                </div>
                <div>
                  <div style={{fontSize: '2.25rem', fontWeight: '700', color: '#111827'}}>Rs {totalRevenue.toLocaleString()}</div>
                  <div style={{fontSize: '0.875rem', color: '#6b7280'}}>Total Revenue</div>
                </div>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="card-grid">
              {/* Chart 1: Line Chart */}
              <div className="chart-container" style={{backgroundColor: 'var(--card-bg-color)', padding: '1.5rem', borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-light)'}}>
                <h2 style={{fontSize: '1.25rem', fontWeight: '700', color: '#3b82f6', marginBottom: '1rem'}}>Monthly Orders & Revenue</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis yAxisId="left" stroke="#3b82f6" />
                    <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="orders" stroke="#3b82f6" name="Orders" />
                    <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#10b981" name="Revenue" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Chart 2: Bar Chart */}
              <div className="chart-container" style={{backgroundColor: 'var(--card-bg-color)', padding: '1.5rem', borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-light)'}}>
                <h2 style={{fontSize: '1.25rem', fontWeight: '700', color: '#ef4444', marginBottom: '1rem'}}>Orders by Status</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={statusChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                    <Legend />
                    <Bar dataKey="pending" fill="#FFBB28" name="Pending" />
                    <Bar dataKey="completed" fill="#00C49F" name="Completed" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Chart 3: Pie Chart */}
             
              {/* Chart 4: Area Chart */}
              <div className="chart-container" style={{backgroundColor: 'var(--card-bg-color)', padding: '1.5rem', borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-light)'}}>
                <h2 style={{fontSize: '1.25rem', fontWeight: '700', color: '#7c3aed', marginBottom: '1rem'}}>Cumulative Revenue</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                    <Area type="monotone" dataKey="revenue" stroke="#10b981" fill="#10b981" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Chart 5: Funnel Chart */}
              <div className="chart-container" style={{backgroundColor: 'var(--card-bg-color)', padding: '1.5rem', borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-light)'}}>
                <h2 style={{fontSize: '1.25rem', fontWeight: '700', color: '#f59e0b', marginBottom: '1rem'}}>Order Status Funnel</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <FunnelChart>
                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                    <Funnel
                      dataKey="value"
                      data={funnelData}
                      isAnimationActive
                    >
                      <LabelList position="right" fill="#333" dataKey="name" />
                    </Funnel>
                  </FunnelChart>
                </ResponsiveContainer>
              </div>

              {/* Chart 6: Treemap */}
               <div className="chart-container" style={{backgroundColor: 'var(--card-bg-color)', padding: '1.5rem', borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-light)'}}>
                <h2 style={{fontSize: '1.25rem', fontWeight: '700', color: '#ef4444', marginBottom: '1rem'}}>Scatter Chart: Revenue vs Orders</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid stroke="#e5e7eb" />
                    <XAxis type="number" dataKey="orders" name="Orders" stroke="#6b7280" />
                    <YAxis type="number" dataKey="revenue" name="Revenue" stroke="#6b7280" />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                    <Scatter name="A school" data={chartData} fill="#3b82f6" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
              {/* Chart 7: Composed Chart */}
              <div className="chart-container" style={{backgroundColor: 'var(--card-bg-color)', padding: '1.5rem', borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-light)'}}>
                <h2 style={{fontSize: '1.25rem', fontWeight: '700', color: '#4338ca', marginBottom: '1rem'}}>Orders & Revenue Trend</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={chartData}>
                    <CartesianGrid stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis yAxisId="left" stroke="#3b82f6" />
                    <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                    <Legend />
                    <Bar yAxisId="left" dataKey="orders" barSize={20} fill="#3b82f6" name="Orders" />
                    <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#10b981" name="Revenue" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              {/* Chart 8: Radial Bar Chart */}
             <div className="flk">
               <div className="chart-container" style={{backgroundColor: 'var(--card-bg-color)', padding: '1.5rem', borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-light)'}}>
                <h2 style={{fontSize: '1.25rem', fontWeight: '700', color: '#06b6d4', marginBottom: '1rem'}}>Revenue by Country</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <RadialBarChart
                    cx="50%"
                    cy="50%"
                    innerRadius="10%"
                    outerRadius="80%"
                    data={salesByCountryDataForCharts}
                  >
                    <RadialBar minAngle={15} label={{ position: 'insideStart', fill: '#333' }} background clockWise dataKey='value' />
                    <Legend iconSize={10} width={120} height={140} layout='vertical' verticalAlign='middle' wrapperStyle={{ top: 0, left: 35 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>

              {/* Chart 9: Pie Chart for Categories */}
              <div className="chart-container" style={{backgroundColor: 'var(--card-bg-color)', padding: '1.5rem', borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-light)'}}>
                <h2 style={{fontSize: '1.25rem', fontWeight: '700', color: '#f97316', marginBottom: '1rem'}}>Orders by Category</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryDataForCharts}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#3b82f6"
                      label
                    >
                      {categoryDataForCharts.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={stringToColor(entry.name)} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
             </div>

              {/* Chart 10: Scatter Chart */}
             <div className="flk">
               <div className="chart-container" style={{backgroundColor: 'var(--card-bg-color)', padding: '1.5rem', borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-light)'}}>
                <h2 style={{fontSize: '1.25rem', fontWeight: '700', color: '#16a34a', marginBottom: '1rem'}}>Order Funnel</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={funnelData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#3b82f6"
                      label
                    >
                      {funnelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={stringToColor(entry.name)} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

 <div className="chart-container" style={{backgroundColor: 'var(--card-bg-color)', padding: '1.5rem', borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-light)'}}>
                <h2 style={{fontSize: '1.25rem', fontWeight: '700', color: '#16a34a', marginBottom: '1rem'}}>Order Funnel</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={funnelData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#3b82f6"
                      label
                    >
                      {funnelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={stringToColor(entry.name)} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

             </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
