import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "/public/imgs/logo.png"; // update the path to your logo

const NotFound = () => {
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFadeIn(true), 100); // delay for smooth fade-in
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ ...styles.container, opacity: fadeIn ? 1 : 0, transition: "opacity 1s ease-in-out" }}>
      <img src={logo} alt="Aj Creativity Logo" style={styles.logo} />
      <h1 style={styles.h1}>404</h1>
      <h2 style={styles.h2}>Page Not Found</h2>
      <p style={styles.p}>
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link to="/" style={styles.btn} onMouseEnter={e => e.currentTarget.style.transform = "translateY(-3px)"} onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
        Go to Homepage
      </Link>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "'Poppins', sans-serif",
    textAlign: "center",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    background: "linear-gradient(135deg, #ff9a9e, #fad0c4)",
    color: "#333",
  },
  logo: {
    maxWidth: "150px",
    marginBottom: "30px",
    transition: "transform 0.3s ease",
  },
  h1: {
    fontSize: "96px",
    margin: 0,
    color: "#ff6b6b",
  },
  h2: {
    fontSize: "36px",
    margin: "10px 0 30px",
  },
  p: {
    fontSize: "18px",
    lineHeight: 1.6,
    marginBottom: "30px",
    maxWidth: "500px",
  },
  btn: {
    display: "inline-block",
    backgroundColor: "#ff6b6b",
    color: "white",
    padding: "14px 28px",
    borderRadius: "50px",
    textDecoration: "none",
    fontWeight: 600,
    transition: "all 0.3s ease",
  },
};

export default NotFound;
