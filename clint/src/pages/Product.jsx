import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header1";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import Footer from "../components/Footer";
// import "./Product.scss"; // SCSS import

const products = [
  { img: '/imgs/s1.jpg', name: 'Royal Radiance', price: '1,550', category: 'gold bangle' },
  { img: '/imgs/s2.jpg', name: 'Timeless Spark', price: '500', category: 'bangle' },
  { img: '/imgs/s3.jpg', name: 'Heritage Grace', price: '590', category: 'bangle' },
  // { img: '/imgs/s4.jpg', name: 'Classic Allure', price: '1,200', category: 'bangle' },
  { img: '/imgs/s5.jpg', name: 'Elegant Loop', price: '1,350', category: 'bangle' },
  { img: '/imgs/s6.jpg', name: 'Pearl Essence', price: '1,800', category: 'bangle' },
  { img: '/imgs/s7.jpg', name: 'Golden Dream', price: '1,990', category: 'bangle' },
  { img: '/imgs/s8.jpg', name: 'Textured Shine', price: '1,550', category: 'bangle' },
  { img: '/imgs/s9.jpg', name: 'Floral Dream', price: '1,800', category: 'bangle' },
  { img: '/imgs/s10.jpg', name: 'Artisan Touch', price: '1,350', category: 'bangle' },
  { img: '/imgs/s11.jpg', name: 'Enamel Blossom', price: '1,550', category: 'bangle' },
  { img: '/imgs/s12.jpg', name: 'Modern Chic', price: '550', category: 'earring' },
  { img: '/imgs/s13.jpg', name: 'Vintage Aura', price: '490', category: 'earring' },
  { img: '/imgs/s14.jpg', name: 'Pearl Drop', price: '500', category: 'earring' },
  { img: '/imgs/s15.jpg', name: 'Signature Shine', price: '150', category: 'earring' },
  { img: '/imgs/s16.jpg', name: 'Chic Hoops', price: '590', category: 'earring' },
  { img: '/imgs/s17.jpg', name: 'Crystal Spark', price: '1,200', category: 'earring' },
  { img: '/imgs/s18.jpg', name: 'Dazzle Drop', price: '1,350', category: 'earring' },
  { img: '/imgs/s19.jpg', name: 'Petal Studs', price: '1,550', category: 'earring' },
  { img: '/imgs/s20.jpg', name: 'Twist Loop', price: '1,800', category: 'earring' },
  { img: '/imgs - Copy/q1.jpg', name: 'Ruby Bangle', price: '2,000', category: 'bangle' },
  { img: '/imgs - Copy/q2.jpg', name: 'Emerald Bangle', price: '2,200', category: 'bangle' },
  // { img: '/imgs - Copy/q3.jpg', name: 'Sapphire Bangle', price: '2,100', category: 'bangle' },
  { img: '/imgs - Copy/q4.jpg', name: 'Classic Earring', price: '1,100', category: 'earring' },
  { img: '/imgs - Copy/q5.jpg', name: 'Pearl Drop Earring', price: '1,250', category: 'earring' },
  { img: '/imgs - Copy/q6.jpg', name: 'Gold Hoop Earring', price: '1,350', category: 'earring' },
  { img: '/imgs - Copy/q7.jpg', name: 'Diamond Stud Earring', price: '1,500', category: 'earring' },
  { img: '/imgs - Copy/q8.jpg', name: 'Chic Earring', price: '1,050', category: 'earring' },
  { img: '/imgs - Copy/q9.jpg', name: 'Modern Earring', price: '1,200', category: 'earring' },
  { img: '/imgs - Copy/q10.png', name: 'Elegant Earring', price: '1,300', category: 'earring' },
  { img: '/imgs - Copy/q11.png', name: 'Signature Earring', price: '1,400', category: 'earring' },
  { img: '/imgs - Copy/q12.jpg', name: 'Vintage Earring', price: '1,100', category: 'earring' },
  { img: '/imgs - Copy/q13.jpg', name: 'Petal Earring', price: '1,250', category: 'earring' },
  { img: '/imgs - Copy/q14.jpg', name: 'Twist Earring', price: '1,350', category: 'earring' },
  { img: '/imgs - Copy/q15.jpg', name: 'Crystal Earring', price: '1,500', category: 'earring' },
  { img: '/imgs - Copy/q16.jpg', name: 'Dazzle Earring', price: '1,050', category: 'earring' },
  { img: '/imgs - Copy/q17.jpg', name: 'Stud Earring', price: '1,200', category: 'earring' },
  { img: '/imgs - Copy/q18.jpg', name: 'Loop Earring', price: '1,300', category: 'earring' },
  { img: '/imgs - Copy/q19.jpg', name: 'Drop Earring', price: '1,400', category: 'earring' },
  { img: '/imgs - Copy/q20.png', name: 'Hoop Earring', price: '1,100', category: 'earring' },
  { img: '/imgs - Copy/q21.jpg', name: 'Pearl Stud Earring', price: '1,250', category: 'earring' },
  { img: '/imgs - Copy/q22.jpg', name: 'Gold Stud Earring', price: '1,350', category: 'earring' },
  { img: '/imgs - Copy/q23.jpg', name: 'Silver Stud Earring', price: '1,500', category: 'earring' },
  { img: '/imgs - Copy/q24.jpg', name: 'Rose Earring', price: '1,050', category: 'earring' },
  { img: '/imgs - Copy/q25.jpg', name: 'Leaf Earring', price: '1,200', category: 'earring' },
  { img: '/imgs - Copy/q27.jpg', name: 'Sun Earring', price: '1,300', category: 'earring' },
  { img: '/imgs - Copy/q28.jpg', name: 'Moon Earring', price: '1,400', category: 'earring' },
  { img: '/imgs - Copy/q30.jpg', name: 'Star Earring', price: '1,100', category: 'earring' },
  { img: '/imgs - Copy/q31.jpg', name: 'Wave Earring', price: '1,250', category: 'earring' },
  { img: '/imgs - Copy/q32.jpg', name: 'Shell Earring', price: '1,350', category: 'earring' },
  { img: '/imgs - Copy/q33.jpg', name: 'Coral Earring', price: '1,500', category: 'earring' },
  { img: '/imgs - Copy/q34.jpg', name: 'Stone Earring', price: '1,050', category: 'earring' },
  { img: '/imgs - Copy/q35.jpg', name: 'Bead Earring', price: '1,200', category: 'earring' },
  { img: '/imgs - Copy/q36.jpg', name: 'Gem Earring', price: '1,300', category: 'earring' },
  { img: '/imgs - Copy/q37.jpg', name: 'Opal Earring', price: '1,400', category: 'earring' },
  // baaki products
];

const priceRanges = [
  { label: "0 - 500", min: 0, max: 500 },
  { label: "501 - 1000", min: 501, max: 1000 },
  { label: "1001 - 2000", min: 1001, max: 2000 },
  { label: "2001+", min: 2001, max: Infinity }
];

const categories = ["bangle", "gold bangle", "earring"];

const Product = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPrices, setSelectedPrices] = useState([]);
  const barRef = useRef(null);
  const footerRef = useRef(null);
  const [atFooter, setAtFooter] = useState(false);

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

  const filteredProducts = products.filter((p) => {
    const matchCategory = selectedCategories.length === 0 || selectedCategories.includes(p.category);
    const matchPrice = selectedPrices.length === 0 || selectedPrices.some((rangeLabel) => {
      const range = priceRanges.find((r) => r.label === rangeLabel);
      const productPrice = Number(p.price.replace(/,/g, ''));
      return productPrice >= range.min && productPrice <= range.max;
    });
    return matchCategory && matchPrice;
  });

  const navigate = useNavigate();
  const [cartMessage, setCartMessage] = useState("");

  const handleAddToCart = (product) => {
    const cartItem = {
      id: Date.now(),
      name: product.name,
      category: product.category,
      color: 'gold',
      size: product.category === 'earring' ? undefined : 'Medium',
      price: Number(String(product.price).replace(/[^\d]/g, '')),
      quantity: 1,
      img: product.img
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
            <div className="bar">
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
            {filteredProducts.map((product, idx) => (
              <div className="product-card" key={idx} onClick={() => handleProductClick(product)} style={{ cursor: 'pointer' }} data-aos="fade-up" data-aos-delay="380" data-aos-once="true">
                <LazyLoadImage
                  alt={product.name}
                  src={product.img}
                  effect="blur"
                  width="100%"
                  height="300px"
                  object-fit="cover"
                  border-radius="5px"
                  margin-bottom="10px"
                />
                <div className="flex-1">
                  <div className="detail">
                    <small>{product.category}</small>
                    <h4>{product.name}</h4>
                    <p>{product.price} Rs</p>
                  </div>
                  <img src="./shopping.png" alt="Add to cart" className="carts" style={{ cursor: 'pointer' }} onClick={e => { e.stopPropagation(); handleAddToCart(product); }} />

                </div>
              </div>
            ))}
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
