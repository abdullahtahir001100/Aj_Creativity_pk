import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header1";
import Loader from "../components/loader";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import Footer from "../components/Footer";
import SEOMetadata from "../components/SEOMetadata"; // 1. Import the SEO component

const API_URL = 'https://aj-creativity-pk-2dpo.vercel.app/api';
const SITE_URL = 'https://www.javehandmade.store'; // Define your site URL for structured data

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
  const [loading, setLoading] = useState(true); // Set initial loading to true
  const navigate = useNavigate();
  const [cartMessage, setCartMessage] = useState("");
  
  // Your refs and other effects remain the same
  const barRef = useRef(null);
  const footerRef = useRef(null);

  // Fetch products from the backend
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
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching products from API:", error);
        setProducts([]);
      } finally {
        setLoading(false);
        // 3. CRITICAL: Signal to pre-rendering that the page content is ready
        window.prerenderReady = true;
      }
    };
    fetchProducts();
  }, []);
  
  // Your other functions (handleCategoryChange, handlePriceChange, etc.) remain the same
  const filteredProducts = products.filter((p) => { /* ... */ });
  const handleAddToCart = (product) => { /* ... */ };
  const handleProductClick = (product) => { navigate("/details", { state: { product } }); };


  // 2. Define Structured Data for this page
  const generateStructuredData = () => {
    // Breadcrumb schema for navigation
    const breadcrumbData = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [{
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": `${SITE_URL}/`
      }, {
        "@type": "ListItem",
        "position": 2,
        "name": "Products",
        "item": `${SITE_URL}/product`
      }]
    };

    // ItemList schema for the products shown on the page
    const itemListData = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Handmade Jewelry Products",
      "description": "A collection of handmade bangles, earrings, and other jewelry from Jave Handmade.",
      "itemListElement": filteredProducts.map((product, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Product",
          "name": product.name,
          "url": `${SITE_URL}/details`, // Ideally, this would be a unique URL like `/product/${product.slug}`
          "image": product.image,
          "description": `A beautiful ${product.category} named ${product.name}.`,
          "offers": {
            "@type": "Offer",
            "priceCurrency": "PKR",
            "price": Number(String(product.price).replace(/[^\d]/g, '')),
            "availability": "https://schema.org/InStock"
          }
        }
      }))
    };
    
    // Return an array containing both schemas
    return [breadcrumbData, itemListData];
  };

  return (
    <>
      {/* 1. Add the SEOMetadata component with relevant info */}
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
            {/* ... Your filter UI ... */}
          </aside>
          <div className="products-grid">
            {loading ? (
              <Loader />
            ) : filteredProducts.length === 0 ? (
              <p>No products found matching your criteria.</p>
            ) : (
              filteredProducts.map((product, idx) => (
                <div className="product-card" key={product._id || idx} onClick={() => handleProductClick(product)}>
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
                    <img src=".\shopping.png" alt="Add to cart" className="carts" onClick={e => { e.stopPropagation(); handleAddToCart(product); }} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Your cart message and footer remain the same */}
      {cartMessage && ( <div className="cart-message">{cartMessage}</div> )}
      <div ref={footerRef}><Footer /></div>
    </>
  );
};

export default Product;