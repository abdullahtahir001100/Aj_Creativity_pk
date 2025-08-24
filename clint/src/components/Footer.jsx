import React from "react";
import { Link } from "react-router-dom";
export default function Footer() {
  return (
    <section>
    <footer className="footer">
      <div className="footer-container cointain">
        
        {/* Logo + About */}
        <div className="footer-brand">
          <img src="./imgs/logo.png" alt="Jewellery Logo" className="footer-logo" />
          <p className="footer-desc">
            Timeless elegance, crafted to perfection. Discover our exclusive
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
          <p>Email: info@jewellery.com</p>
          <p>Phone: +92 300 1234567</p>
          <p>Location: Lahore, Pakistan</p>
        </div>

        {/* Social Media */}
        <div className="footer-social">
          <h4>Follow Us</h4>
          <div className="social-icons">
            <a href="https://instagram.com" target="_blank" rel="noreferrer"><img src="./instagram.png" alt="" /></a>
                <a href="https://facebook.com" target="_blank" rel="noreferrer"><img src="./facebook.png" alt="" /></a>
                <a href="https://wa.me/+923001234567" target="_blank" rel="noreferrer"><img src="./whatsapp.png" alt="" /></a>
                <a href="https://wa.me/+923001234567" target="_blank" rel="noreferrer"><img src="./google-play.png" alt="" /></a>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Jewellery Store. All Rights Reserved.</p>
      </div>
    </footer>
    </section>
  );
}
