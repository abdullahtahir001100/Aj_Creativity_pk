import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    // 1. The <footer> is the correct top-level element, so the <section> and Fragment were removed.
    <footer className="footer">
      {/* 2. Fixed typo: "cointain" is now "container". */}
      <div className="footer-container container">

        {/* Logo + About */}
        <div className="footer-brand">
          {/* Images are now linked using string paths from the public folder. */}
          <img src="./imgs - Copy/logof.svg" alt="Jewellery Logo" className="footer-logo" />
          <p className="footer-desc">
            Timeless elegance, <Link to= "/dashboard" className="linker">crafted</Link> to perfection. Discover our exclusive
            collection of fine jewellery for every occasion.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/product">Shop</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-contact">
          <h4>Contact</h4>
          <p>Email: Javehandmade.com</p>
          <p>Phone: +92 347 8708641</p>
          <p>Location: Sargodha, Pakistan</p>
        </div>

        {/* Social Media */}
        <div className="footer-social">
          <h4>Follow Us</h4>
          <div className="social-icons">
            {/* 3. Added descriptive alt text for better accessibility. */}
            <a href="https://www.instagram.com/handmade_by_javeria/" target="_blank" rel="noreferrer">
              <img src="./instagram.png" alt="Instagram" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer">
              <img src="./facebook.png" alt="Facebook" />
            </a>
            <a href="https://wa.link/9v8dty" target="_blank" rel="noreferrer">
              <img src="./whatsapp.png" alt="WhatsApp" />
            </a>
            {/* 4. Corrected the link for Google Play. */}
            <a href="https://play.google.com" target="_blank" rel="noreferrer">
              <img src="./google-play.png" alt="Google Play" />
            </a>
          </div>
        </div>

      </div> {/* 5. Added the missing closing </div> tag for the main container. */}

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Jewellery Store. All Rights Reserved.</p>
      </div>
    </footer>
  );
}