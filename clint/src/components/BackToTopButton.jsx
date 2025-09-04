import { useState, useEffect } from "react";

function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when user scrolls down
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {isVisible && (
        <button className="back-to-top"
          onClick={scrollToTop}
          style={{
            position: "fixed",
            bottom: "30px",
            right: "30px",
            fontSize: "13px",
            height: "40px",
            cursor: "pointer",
            // boxShadow: "0px 0px 10px #2534ca !important",
            transition: "transform 0.3s ease, opacity 0.3s ease",
            zIndex: 1000,
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.transform = "scale(1.1)")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.transform = "scale(1)")
          }
        >
          <i className="fas fa-arrow-up"></i>
        </button>
      )}
    </>
  );
}

export default BackToTopButton;
