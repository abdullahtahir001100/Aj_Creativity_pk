import React from "react";

const Loader = () => {
  const styles = {
    wrapper: {
      height: "100vh",
      width: "100%",
      display: "flex",
      // This is the key change to stack the logo and text vertically
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      background: "#fffdf7",
    },
    logo: {
      width: "150px",
      height: "150px",
      objectFit: "contain",
    },
    // Styles for the text
    loadingText: {
      marginTop: "20px", // Space between logo and text
      color: "#6f4e37",   // A color that matches your theme
      fontSize: "1rem",
      fontWeight: "bold",
      fontFamily: "sans-serif",
      letterSpacing: "3px",
    },
  };

  return (
    <div style={styles.wrapper} className="loader">
      <img src="../imgs - Copy/logo.svg" alt="Loading Logo" style={styles.logo} />

      {/* The loading text with a className for the animation */}
      <p style={styles.loadingText} className="loading-text">
        LOADING
      </p>

      {/* Internal CSS for the blinking dots animation */}
      <style>
        {`
          .loading-text::after {
            content: '.';
            animation: blinkDots 1.4s linear infinite;
          }

          @keyframes blinkDots {
            0%   { content: '.'; }
            33%  { content: '..'; }
            66%  { content: '...'; }
            100% { content: '.'; }
          }
        `}
      </style>
    </div>
  );
};

export default Loader;