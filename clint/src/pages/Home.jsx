import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from "../components/header1"; 
import Footer from '../components/Footer';
import Loader from '../components/loader';
import TestimonialSlider from '../components/testi'; 
import '../styles/main.scss';
import '../styles/animation.scss';

const API_BASE_URL = 'https://server-nine-kappa-75.vercel.app/api';

const Home = () => {
  const [splashVisible, setSplashVisible] = useState(true);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [latestProducts, setLatestProducts] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartMessage, setCartMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Splash screen timer
    const timer = setTimeout(() => {
      setSplashVisible(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch products
        const productsResponse = await fetch(`${API_BASE_URL}/data`);
        if (!productsResponse.ok) throw new Error('Failed to fetch products');
        const productsData = await productsResponse.json();
        
        // Correctly filter from the 'data' property of the response
        const fetchedFeatured = productsData.data.filter(p => p.placement === 'featured');
        const fetchedLatest = productsData.data.filter(p => p.placement === 'latest');
        
        setFeaturedProducts(fetchedFeatured);
        setLatestProducts(fetchedLatest);

        // Fetch videos
        const videosResponse = await fetch(`${API_BASE_URL}/videos`);
        if (!videosResponse.ok) throw new Error('Failed to fetch videos');
        const videosData = await videosResponse.json();
        
        // Correctly access the 'data' property
        const fetchedVideos = videosData.data || [];
        setVideos(fetchedVideos);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  const normalizePrice = (price) => Number(String(price).replace(/[^\d]/g, ''));

  const handleAddToCart = (product) => {
    // Check if the product has a valid image array and take the first image
    const cartItem = {
      id: product._id,
      name: product.name,
      category: product.category,
      color: 'gold',
      size: product.category === 'earring' ? undefined : 'Medium',
      price: normalizePrice(product.price),
      quantity: 1,
      image: product.image && product.image.length > 0 ? product.image[0] : null // 👈 This is the fix
    };

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(cartItem);
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    setCartMessage("Added to cart!");
    setTimeout(() => setCartMessage(""), 2000);
  };

  const handleProductClick = (product) => {
    const productForDetails = {
      ...product,
      price: normalizePrice(product.price),
      id: product._id
    };
    navigate("/details", { state: { product: productForDetails } });
  };

  if (loading) {
    return <div><Loader /></div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
     <Header />
      {/* Banner Section */}
      <section className="banner" data-aos="fade-up" data-aos-delay="380" data-aos-once="true">
        <div className="cointain">
          <div className="flexbox" data-aos="fade-up" data-aos-delay="380" data-aos-once="true">
            <div className="col-1 animate__animated animate__fadeInLeft" data-aos="fade-up" data-aos-delay="380" data-aos-once="true">
              <h1>Welcome to Our HandMade Jewelry Store</h1>
              <p>Discover the elegance of handcrafted jewelry that tells your story.</p>
              <Link to="/Product" className="button">Explore Now</Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Products Section */}
      <section className="product" data-aos="fade-up" data-aos-delay="580" data-aos-once="true">
        <div className="cointain">
          <div className="heading flexbox">
            <div className="h1">
              <h1>featured products</h1>
            </div>
            <div className="button">
              <a href="/prodect">View More</a>
            </div>
          </div>
          <div className="line"></div>
          <div className="shop-grid" data-aos="fade-up" data-aos-delay="580" data-aos-once="true">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <div
                  className="sec-1 animate__animated animate__fadeInLeft"
                  data-aos-delay="380"
                  data-aos-once="true"
                  key={product._id}
                  onClick={() => handleProductClick(product)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="image">
                    <img src={product.image[0]} alt={product.name} loading="lazy" />
                  </div>
                  <div className="flexbox1">
                    <div className="flexitem">
                      <div className="text">
                        <h4>{product.name}</h4>
                        {product.category && (
                          <small style={{ color: '#888', fontSize: 13 }}>Category: {product.category}</small>
                        )}
                      </div>
                      <div className="fonts">
                        <i className="fa fa-star" aria-hidden="true"></i>
                        <i className="fa fa-star" aria-hidden="true"></i>
                        <i className="fa fa-star" aria-hidden="true"></i>
                        <i className="fa fa-star" aria-hidden="true"></i>
                      </div>
                      <div className="price">
                        <h6>{product.price} Rs</h6>
                      </div>
                    </div>
                    <div className="flexitem">
                      <button
                        className="add-to-cart"
                        style={{ width: "60px" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                      >
                         <img src="./shopping.png" alt="" />
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

      {/* Latest Products Section */}
      <section className="product" data-aos="fade-up" data-aos-delay="580" data-aos-once="true">
        <div className="cointain">
          <div className="heading">
            <div className="h1">
              <h1>latest product</h1>
            </div>
          </div>
          <div className="line"></div>
          <div className="shop-grid">
            {latestProducts.length > 0 ? (
              latestProducts.map((product) => (
                <div
                  className="sec-1 sec-2"
                  data-aos-delay="380"
                  data-aos-once="true"
                  key={product._id}
                  onClick={() => handleProductClick(product)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="image">
                    <img src={product.image[0]} alt={product.name} loading="lazy"/>
                  </div>
                  <div className="flexbox1">
                    <div className="flexitem">
                      <div className="text">
                        <h4>{product.name}</h4>
                        {product.category && (
                          <small style={{ color: '#888', fontSize: 13 }}>Category: {product.category}</small>
                        )}
                      </div>
                      <div className="fonts">
                        <i className="fa fa-star" aria-hidden="true"></i>
                        <i className="fa fa-star" aria-hidden="true"></i>
                        <i className="fa fa-star" aria-hidden="true"></i>
                        <i className="fa fa-star" aria-hidden="true"></i>
                      </div>
                      <div className="price">
                        <h6>{product.price} Rs</h6>
                      </div>
                    </div>
                    <div className="flexitem">
                      <button
                        className="add-to-cart"
                        style={{ width: "60px" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                      >
                         <img src="./shopping.png" alt="" />
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

      {/* Watch (Videos) Section */}
      <section className="watch" data-aos="fade-up" data-aos-delay="780" data-aos-once="true">
        <div className="cointain">
          <div className="heading">
            <div className="h1">
              <h1>Our Collections</h1>
            </div>
          </div>
          <div className="line"></div>
          <div className="backcolor">
            <div className="shop-grid videos-grid" data-aos-delay="580" data-aos-once="true">
              {videos.length > 0 ? (
                videos.map((video, idx) => (
                  <div className="video-wrapper" key={video._id || idx}>
                    <video
                      className="video-player"
                      controls
                      autoPlay
                      muted
                      loop
                      playsInline
                      loading="lazy"
                      poster="/imgs/logo.png"
                    >
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
       <div className="heading">
            <div className="h1">
              <h1>What Our Customers Say</h1>
            </div>
          </div>
      {/* This is where you render the imported Testimonial Slider */}
      <TestimonialSlider />
      </section>
      {cartMessage && (
        <div style={{ position: 'fixed', top: 10, right: 30, background: '#4BB543', color: '#fff', padding: '12px 28px', borderRadius: 10, fontWeight: 600, zIndex: 9999, boxShadow: '0 4px 16px rgba(0,0,0,0.13)' }}>
          {cartMessage}
        </div>
      )}

      <Footer />
    </>
  );
};

export default Home;