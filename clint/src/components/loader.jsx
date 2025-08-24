import React from "react";

const Loader = () => {
  const styles = {
    wrapper: {
      margin: 0,
      padding: 0,
      height: "100vh",
      width: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#fffdf7", // Light luxury background
    },
    diamond: {
      position: "relative",
      width: "80px",
      height: "80px",
      transform: "rotate(45deg)",
      animation: "spin 3s linear infinite",
    },
  };

  return (
    <div style={styles.wrapper} className="loader">
      <div style={styles.diamond} className="diamond"></div>

      {/* Internal CSS with keyframes & pseudo-elements */}
      <style>
        {`
          .diamond::before,
          .diamond::after {
            content: "";
            position: absolute;
            width: 80px;
            height: 80px;
            border: 3px solid gold;
            border-radius: 8px;
            top: 0;
            left: 0;
            box-shadow: 0 0 15px rgba(218,165,32,0.6),
                        0 0 25px rgba(255,215,0,0.4);
          }

          .diamond::after {
            transform: scale(0.7);
            opacity: 0.8;
          }

          @keyframes spin {
            0%   { transform: rotate(45deg) scale(1); }
            50%  { transform: rotate(225deg) scale(1.1); }
            100% { transform: rotate(405deg) scale(1); }
          }
        `}
      </style>
    </div>
  );
};

export default Loader;
