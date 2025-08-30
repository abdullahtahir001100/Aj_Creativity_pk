import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header1";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import Footer from "../components/Footer";
// import "../styles/Product.css";

// Hardcoded API URL to avoid 'process is not defined' error
const API_URL = 'http://localhost:5000/api';

const priceRanges = [
  { label: "0 - 500", min: 0, max: 500 },
  { label: "501 - 1000", min: 501, max: 1000 },
  { label: "1001 - 2000", min: 1001, max: 2000 },
  { label: "2001+", min: 2001, max: Infinity }
];

const categories = ["bangle", "gold bangle", "earring"];

const Product = () => {
  const [products, setProducts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [loading, setLoading] = useState(false);
  const barRef = useRef(null);
  const footerRef = useRef(null);
  const [atFooter, setAtFooter] = useState(false);
  const navigate = useNavigate();
  const [cartMessage, setCartMessage] = useState("");

  // Products ko backend se fetch karein
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/products`);
        const data = await response.json();
        if (data.success) {
          setProducts(data.data);
        } else {
          console.error("Failed to fetch products:", data.message);
          setProducts([]); // Agar fetch fail ho to products ko empty array par set karein
        }
      } catch (error) {
        console.error("Error fetching products from API:", error);
        setProducts([]); // Error hone par products ko empty array par set karein
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Handle scroll and resize for footer
  useEffect(() => {
    const handleScrollResize = () => {
      if (!barRef.current || !footerRef.current) return;
      const barRect = barRef.current.getBoundingClientRect();
      const footerRect = footerRef.current.getBoundingClientRect();
      if (barRect.bottom >= footerRect.top) {
        setAtFooter(true);
      } else {
        setAtFooter(false);
      }
    };
    window.addEventListener('scroll', handleScrollResize);
    window.addEventListener('resize', handleScrollResize);
    handleScrollResize();
    return () => {
      window.removeEventListener('scroll', handleScrollResize);
      window.removeEventListener('resize', handleScrollResize);
    };
  }, []);

  // Filter products based on selected categories and prices
  const filteredProducts = products.filter((p) => {
    const matchCategory = selectedCategories.length === 0 || selectedCategories.includes(p.category);
    const matchPrice = selectedPrices.length === 0 || selectedPrices.some((rangeLabel) => {
      const range = priceRanges.find((r) => r.label === rangeLabel);
      const productPrice = Number(String(p.price).replace(/[^\d]/g, ''));
      return productPrice >= range.min && productPrice <= range.max;
    });
    return matchCategory && matchPrice;
  });

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const handlePriceChange = (range) => {
    setSelectedPrices((prev) =>
      prev.includes(range) ? prev.filter((r) => r !== range) : [...prev, range]
    );
  };

  const handleAddToCart = (product) => {
    const cartItem = {
      id: product._id || Date.now(),
      name: product.name,
      category: product.category,
      color: 'gold',
      size: product.category === 'earring' ? undefined : 'Medium',
      price: Number(String(product.price).replace(/[^\d]/g, '')),
      quantity: 1,
      img: product.image
    };
    let cart = [];
    try { cart = JSON.parse(localStorage.getItem("cart")) || []; } catch (e) {}
    cart.push(cartItem);
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    setCartMessage("Added to cart!");
    setTimeout(() => setCartMessage(""), 2000);
  };

  const handleProductClick = (product) => {
    navigate("/details", { state: { product } });
  };

  return (
    <>
      <Header />
      <section className="product-page fade-in-page" data-aos="fade-up" data-aos-delay="450" data-aos-once="true">
        <div className="container">
          <aside className="sidebar" data-aos="fade-up" data-aos-delay="450" data-aos-once="true">
            <div className="bar" ref={barRef}>
              <div className="op-1">
                <h3>Filter by Category</h3>
                {categories.map((cat) => (
                  <label key={cat}>
                    <input type="checkbox" checked={selectedCategories.includes(cat)} onChange={() => handleCategoryChange(cat)} /> {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </label>
                ))}
              </div>
              <div className="op-2">
                <h3>Filter by Price</h3>
                {priceRanges.map((range) => (
                  <label key={range.label}>
                    <input type="checkbox" checked={selectedPrices.includes(range.label)} onChange={() => handlePriceChange(range.label)} /> {range.label}
                  </label>
                ))}
              </div>
            </div>
          </aside>
          <div className="products-grid" data-aos="fade-up" data-aos-delay="450" data-aos-once="true">
            {loading ? (
              <p>Loading products...</p>
            ) : filteredProducts.length === 0 ? (
              <p>No products found. Please add products from the dashboard.</p>
            ) : (
              filteredProducts.map((product, idx) => (
                <div className="product-card" key={product._id || idx} onClick={() => handleProductClick(product)} style={{ cursor: 'pointer' }} data-aos="fade-up" data-aos-delay="380" data-aos-once="true">
                  <LazyLoadImage
                    alt={product.name}
                    src={`${API_URL.replace('/api', '')}${product.image}`}
                    effect="blur"
                    width="100%"
                    height="300px"
                    style={{ objectFit: 'cover', borderRadius: '5px', marginBottom: '10px' }}
                  />
                  <div className="flex-1">
                    <div className="detail">
                      <small>{product.category}</small>
                      <h4>{product.name}</h4>
                      <p>{product.price} Rs</p>
                    </div>
                    <img src="/Aj_Creativity/cart.png" alt="Add to cart" className="carts" style={{ cursor: 'pointer' }} onClick={e => { e.stopPropagation(); handleAddToCart(product); }} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
      {cartMessage && (
        <div style={{ position: 'fixed', top: 10, right: 30, background: '#4BB543', color: '#fff', padding: '12px 28px', borderRadius: 10, fontWeight: 600, zIndex: 9999, boxShadow: '0 4px 16px rgba(0,0,0,0.13)' }}>
          {cartMessage}
        </div>
      )}
      <div ref={footerRef}>
        <Footer />
      </div>
    </>
  );
};

export default Product;