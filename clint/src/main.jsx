import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // 1. Import BrowserRouter
import "./index.css";
import App from "./App.jsx";
import AOS from 'aos';
import 'aos/dist/aos.css';

AOS.init();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter> {/* 2. Use BrowserRouter here */}
      <App />
    </BrowserRouter>
  </StrictMode>
);