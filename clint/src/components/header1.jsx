import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [burgerOpen, setBurgerOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
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

  return (
    <header className='header'>
      <div className="contain">
        <div className="flexbox">
          <div className="logo lodo">
            <div className="col-1">
              <div className="image">
                <Link to="/"><img src="./imgs/logo.png" alt="Logo" /></Link>
              </div>
            </div>
          </div>
          <div className="col-2">
            <nav className="flexbox">
              <ul>
                <li><Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link></li>
                <li><Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>About</Link></li>
                <li><Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>Contact</Link></li>
                <li><Link to="/blogs" className={location.pathname === '/blogs' ? 'active' : ''}>Blogs</Link></li>
                {/* Cart icon: hide on Cart page */}
                {location.pathname !== '/cart' && (
                  <li className='cart'>
                    <Link to="/Cart" className={location.pathname === '/cart' ? 'active' : ''}>
                      <img src="./shopping.png" alt="" />
                      {cartCount > 0 && <strong>{cartCount}</strong>}
                    </Link>
                  </li>
                )}
                <li><Link to="/product" className={`button${location.pathname === '/product' ? ' active' : ''}`}>Explore now</Link></li>
              </ul>
              <a className="burger" onClick={openBurger}><img src="./burger.png" alt="Burger" /></a>
            </nav>
          </div>
        </div>
        <div className="links" id="togal" style={{
  top: burgerOpen ? '100px' : '-382px',
  display: burgerOpen ? 'block' : 'none'
}}
>
          <li><Link to="/"><h6>Home</h6></Link></li>
          <li><Link to="/about"><h6>About</h6></Link></li>
          <li><Link to="/contact"><h6>Contact</h6></Link></li>
          <li><Link to="/Blogs"><h6>Blogs</h6></Link></li>
          {/* Cart icon in burger menu, always show, but visually hide on Cart page */}
          <li className='cart' style={{ display: location.pathname === '/cart' ? 'none' : undefined }}>
            <Link to="/Cart" className={location.pathname === '/cart' ? 'active' : ''}>
             <h5>Cart</h5>
            </Link>
          </li>
          <li><Link to="/product" className="buttn"><h4>Explore now</h4></Link></li>
        </div>
      </div>
    </header>
  );
};

export default Header;
