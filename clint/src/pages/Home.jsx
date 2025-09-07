import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from "../components/header1"; 
import Footer from '../components/Footer';
import Loader from '../components/loader';
import TestimonialSlider from '../components/testi'; 
import '../styles/main.scss';
import '../styles/animation.scss';
import SEOMetadata from '../components/SEOMetadata';

// API endpoint for fetching data
const API_BASE_URL = 'https://server-nine-kappa-75.vercel.app/api';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [latestProducts, setLatestProducts] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartMessage, setCartMessage] = useState("");
  const navigate = useNavigate();

  // Data fetching logic with the critical fix for pre-rendering
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch products
        const productsResponse = await fetch(`${API_BASE_URL}/data`);
        if (!productsResponse.ok) throw new Error('Failed to fetch products');
        const productsData = await productsResponse.json();
        
        // Filter products for 'featured' and 'latest' sections
        setFeaturedProducts(productsData.data.filter(p => p.placement === 'featured'));
        setLatestProducts(productsData.data.filter(p => p.placement === 'latest'));

        // Fetch videos
        const videosResponse = await fetch(`${API_BASE_URL}/videos`);
        if (!videosResponse.ok) throw new Error('Failed to fetch videos');
        const videosData = await videosResponse.json();
        
        setVideos(videosData.data || []);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
        // CRITICAL: Signal to pre-rendering tools like react-snap that the page is fully loaded
        window.prerenderReady = true;
      }
    };
    fetchAllData();
  }, []);

  // Helper function to normalize price strings to numbers
  const normalizePrice = (price) => Number(String(price).replace(/[^\d]/g, ''));

  // Function to handle adding a product to the cart
  const handleAddToCart = (e, product) => {
    e.stopPropagation(); // Prevent navigation when clicking the cart button
    const cartItem = {
      id: product._id,
      name: product.name,
      category: product.category,
      color: 'gold', // Default color, can be customized
      size: product.category === 'earring' ? undefined : 'Medium', // Default size
      price: normalizePrice(product.price),
      quantity: 1,
      image: product.image[0]
    };
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(cartItem);
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated')); // Notify other components of cart change
    setCartMessage("Added to cart!");
    setTimeout(() => setCartMessage(""), 2000);
  };

  // Function to navigate to product details page
  const handleProductClick = (product) => {
    const productForDetails = {
      ...product,
      price: normalizePrice(product.price),
      id: product._id
    };
    navigate("/details", { state: { product: productForDetails } });
  };
  
  // JSON-LD Structured Data for Homepage SEO
  const homePageStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": "https://www.javehandmade.store/",
    "name": "Jave Handmade",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://www.javehandmade.store/product?search={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Jave Handmade",
      "url": "https://www.javehandmade.store/",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.javehandmade.store/logo.png" // Ensure this logo URL is correct
      }
    }
  };


  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Error: {error}</div>;
  }

  return (
    <>
      <SEOMetadata 
        title="Jave Handmade Store - Unique Handcrafted Jewelry"
        description="Discover beautiful, handcrafted jewelry and accessories at Jave Handmade. Quality items made with passion, perfect for any occasion."
        canonicalUrl="/"
        structuredData={homePageStructuredData}
      />
      
      <Header />
      
      <section className="banner" data-aos="fade-up" data-aos-delay="380" data-aos-once="true">
        <div className="cointain">
          <div className="flexbox">
            <div className="col-1">
              <h1>Welcome to Our HandMade Jewelry Store</h1>
              <p>Discover the elegance of handcrafted jewelry that tells your story.</p>
              <Link to="/product" className="button">Explore Now</Link>
            </div>
          </div>
        </div>
      </section>
      
      <section className="product" data-aos="fade-up" data-aos-delay="580" data-aos-once="true">
        <div className="cointain">
          <div className="heading flexbox">
            <div className="h1"><h1>featured products</h1></div>
            <div className="button">
              {/* IMPROVEMENT: Using <Link> for client-side routing and correct URL */}
              <Link to="/product">View More</Link>
            </div>
          </div>
          <div className="line"></div>
          <div className="shop-grid">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <div className="sec-1" key={product._id} onClick={() => handleProductClick(product)} style={{ cursor: 'pointer' }}>
                  <div className="image">
                    <img src={product.image[0]} alt={product.name} loading="lazy" />
                  </div>
                  <div className="flexbox1">
                    <div className="flexitem">
                      <div className="text"><h4>{product.name}</h4></div>
                      <div className="fonts">
                        {/* IMPROVEMENT: Meaningful alt tags for accessibility */}
                        <img src="/star.png" alt="Rating star" />
                        <img src="/star.png" alt="Rating star" />
                        <img src="/star.png" alt="Rating star" />
                        <img src="/star.png" alt="Rating star" />
                        <img src="/star-half-empty.png" alt="Half rating star" />
                      </div>
                      <div className="price"><h6>{product.price} Rs</h6></div>
                    </div>
                    <div className="flexitem">
                      <button className="add-to-cart" style={{ width: "60px" }} onClick={(e) => handleAddToCart(e, product)}>
                        <img src="/shopping.png" alt="Add to cart" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ textAlign: 'center', width: '100%' }}>No featured products available.</p>
            )}
          </div>
        </div>
      </section>

      <section className="product" data-aos="fade-up" data-aos-delay="580" data-aos-once="true">
        <div className="cointain">
          <div className="heading"><div className="h1"><h1>latest product</h1></div></div>
          <div className="line"></div>
          <div className="shop-grid">
            {latestProducts.length > 0 ? (
              latestProducts.map((product) => (
                <div className="sec-1 sec-2" key={product._id} onClick={() => handleProductClick(product)} style={{ cursor: 'pointer' }}>
                  <div className="image">
                    <img src={product.image[0]} alt={product.name} loading="lazy" />
                  </div>
                  <div className="flexbox1">
                    <div className="flexitem">
                      <div className="text"><h4>{product.name}</h4></div>
                      <div className="fonts">
                        <img src="/star.png" alt="Rating star" />
                        <img src="/star.png" alt="Rating star" />
                        <img src="/star.png" alt="Rating star" />
                        <img src="/star.png" alt="Rating star" />
                        <img src="/star-half-empty.png" alt="Half rating star" />
                      </div>
                      <div className="price"><h6>{product.price} Rs</h6></div>
                    </div>
                    <div className="flexitem">
                      <button className="add-to-cart" style={{ width: "60px" }} onClick={(e) => handleAddToCart(e, product)}>
                        <img src="/shopping.png" alt="Add to cart" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ textAlign: 'center', width: '100%' }}>No latest products available.</p>
            )}
          </div>
        </div>
      </section>

      <section className="watch" data-aos="fade-up" data-aos-delay="780" data-aos-once="true">
        <div className="cointain">
          <div className="heading"><div className="h1"><h1>Our Collections</h1></div></div>
          <div className="line"></div>
          <div className="backcolor">
            <div className="shop-grid videos-grid">
              {videos.length > 0 ? (
                videos.map((video, idx) => (
                  <div className="video-wrapper" key={video._id || idx}>
                    <video controls autoPlay muted loop playsInline loading="lazy" poster="/imgs/logo.png">
                      <source src={video.videoUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ))
              ) : (
                <p style={{ textAlign: 'center', width: '100%' }}>No videos available.</p>
              )}
            </div>
          </div>
        </div>
      </section>
      
      <section className='padd1'> 
        <div className="heading"><div className="h1"><h1>What Our Customers Say</h1></div></div>
        <TestimonialSlider />
      </section>
      
      {cartMessage && (
        <div style={{ position: 'fixed', top: 20, right: 20, background: '#4BB543', color: 'white', padding: '12px 28px', borderRadius: 8, zIndex: 1000, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
          {cartMessage}
        </div>
      )}

      <Footer />
    </>
  );
};

export default Home;