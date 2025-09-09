import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [burgerOpen, setBurgerOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [hidden, setHidden] = useState(false);
  const location = useLocation();
  const openBurger = () => setBurgerOpen((prev) => !prev);

  // Update cart count from localStorage
  useEffect(() => {
    function updateCartCount() {
      try {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartCount(cart.reduce((sum, item) => sum + (item.quantity || 1), 0));
      } catch {
        setCartCount(0);
      }
    }
    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    window.addEventListener('cartUpdated', updateCartCount);
    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

  // Hide/show header on scroll
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        // scrolling down → hide header
        setHidden(true);
      } else {
        // scrolling up → show header
        setHidden(false);
      }
      lastScrollY = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`site-header ${hidden ? 'hide' : ''}`}>
      <div className="mobilehide">
        <nav className="flexbox">
          <ul>
            <li><Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link></li>
            <li><Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>About</Link></li>
            <li><Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>Contact</Link></li>
          </ul>
          <div className="logo">
            <div className="col-1">
              <div className="image">
                <Link to="/"><img src="./imgs - Copy/logo.svg" alt="Logo" /></Link>
              </div>
            </div>
          </div>
          <ul>
            <li><Link to="/product" className={`button${location.pathname === '/product' ? ' active' : ''}`}>Explore now</Link></li>
            {location.pathname !== '/cart' && (
              <li className='cart'>
                <Link to="/Cart" className={location.pathname === '/cart' ? 'active' : ''}>
                  <img src="./shopping1.png" alt="Cart" />
                  {cartCount > 0 && <strong>{cartCount}</strong>}
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>

      {/* Mobile Nav */}
      <nav className='flexbox mobile'>
        <div className="logo">
          <div className="col-1">
            <div className="image">
              <Link to="/"><img src="./imgs - Copy/logo.svg" alt="Logo" /></Link>
            </div>
          </div>
        </div>

        {/* Right side: Cart + Burger */}
        <div className="flexbox" style={{ gap: "15px", alignItems: "center" }}>
          {/* Cart icon for mobile */}
          {location.pathname !== '/cart' && (
            <div className="cart">
              <Link to="/Cart" className={location.pathname === '/cart' ? 'active' : ''}>
                <img src="./shopping1.png" alt="Cart" />
                {cartCount > 0 && <strong>{cartCount}</strong>}
              </Link>
            </div>
          )}

          {/* Burger button */}
          <div className="burgerbtn">
            <strong className="burger" onClick={openBurger}>
              {burgerOpen ? (
                <img src="../cross.png" alt="Close" />   // Cross icon
              ) : (
                <img src="./burger.png" alt="Burger" /> // Burger icon
              )}
            </strong>
          </div>
        </div>
      </nav>

      {/* Burger Menu */}
      <div className="links" id="togal" style={{
        top: burgerOpen ? '157px' : '-382px',
        display: burgerOpen ? 'block' : 'none'
      }}>
        <li><Link to="/"><h6>Home</h6></Link></li>
        <li><Link to="/about"><h6>About</h6></Link></li>
        <li><Link to="/contact"><h6>Contact</h6></Link></li>
        <li>
          <Link to="/Cart" className={location.pathname === '/cart' ? 'active' : ''}>
            <h5>Cart</h5>
          </Link>
        </li>
        <li><Link to="/product" className="buttn"><h4>Explore now</h4></Link></li>
      </div>
    </header>
  );
};

export default Header;
