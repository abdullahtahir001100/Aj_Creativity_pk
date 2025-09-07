import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header1";
import Loader from "../components/loader";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import Footer from "../components/Footer";
import SEOMetadata from "../components/SEOMetadata";

const API_URL = 'https://aj-creativity-pk-2dpo.vercel.app/api';
const SITE_URL = 'https://www.javehandmade.store';

const priceRanges = [
  { label: "0 - 500", min: 0, max: 500 },
  { label: "501 - 1000", min: 501, max: 1000 },
  { label: "1001 - 2000", min: 1001, max: 2000 },
  { label: "2001+", min: 2001, max: Infinity }
];

const Product = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // State for our dynamic categories
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [cartMessage, setCartMessage] = useState("");
  const footerRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/products`);
        const data = await response.json();
        if (data.success && data.data) {
          setProducts(data.data);
          
          // DYNAMICALLY CREATE CATEGORY LIST
          // This creates a list of unique categories from your products
          const uniqueCategories = [...new Set(data.data.map(p => p.category))];
          setCategories(uniqueCategories);

        } else {
          console.error("Failed to fetch products:", data.message);
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching products from API:", error);
        setProducts([]);
      } finally {
        setLoading(false);
        // For pre-rendering
        window.prerenderReady = true;
      }
    };
    fetchProducts();
  }, []);

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

  const handleProductClick = (product) => {
    navigate("/details", { state: { product } });
  };
  
  const handleAddToCart = (product) => { /* Your existing Add to Cart logic */ };
  
  const generateStructuredData = () => { /* Your existing structured data logic */ };

  return (
    <>
      <SEOMetadata 
        title="Shop All Products - Handcrafted Jewelry | Jave Handmade"
        description="Browse our full collection of beautiful, handcrafted jewelry. Find unique bangles, earrings, and more, all made with passion and care."
        canonicalUrl="/product"
        structuredData={!loading && products.length > 0 ? generateStructuredData() : null}
      />

      <Header />
      <section className="product-page fade-in-page">
        <div className="container">
          <aside className="sidebar">
            <div className="bar">
              <div className="op-1">
                <h3>Filter by Category</h3>
                {/* This now maps over the DYNAMIC categories state */}
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
          <div className="products-grid">
            {loading ? (
              <Loader />
            ) : filteredProducts.length === 0 ? (
              <p>No products found matching your criteria.</p>
            ) : (
              filteredProducts.map((product) => (
                <div className="product-card" key={product._id} onClick={() => handleProductClick(product)}>
                  <LazyLoadImage
                    alt={product.name}
                    src={product.image}
                    effect="blur"
                    width="100%"
                    height="300px"
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="flex-1">
                    <div className="detail">
                      <small>{product.category}</small>
                      <h4>{product.name}</h4>
                      <p>{product.price} Rs</p>
                    </div>
                    <img src="./shopping.png" alt="Add to cart" className="carts" onClick={e => { e.stopPropagation(); handleAddToCart(product); }} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
      {cartMessage && ( <div className="cart-message" style={{ /* your styles */ }}>{cartMessage}</div> )}
      <div ref={footerRef}>
        <Footer />
      </div>
    </>
  );
};

export default Product;