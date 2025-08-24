import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/main.scss';
import '../styles/animation.scss';
const Home = () => {
  const [splashVisible, setSplashVisible] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setSplashVisible(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  const featuredProducts = [
    {
      img: '/imgs/p55.jpg',
      name: 'Bangles and Earings',
      price: '1,650 Rs',
      id: 'index-1',
      category: 'bangle',
    },
    {
      img: '/imgs/IMG-20250706-WA0037.jpg',
      name: 'Timeless Spark',
      price: '500 Rs',
      id: 'index-2',
      category: 'bangle',
    },
    {
      img: '/imgs/s16.jpg',
      name: 'Heritage Grace',
      price: '590 Rs',
      id: 'index-3',
      category: 'bangle',
    },
    {
      img: '/imgs/p10.jpg',
      name: 'Colorful Dreams',
      price: '1,500 Rs',
      id: 'index-4',
      category: 'bangle',
    },
  ];

  const latestProducts = [
    {
      img: '/imgs/p4.jpg',
      name: 'Bangles with Earings',
      price: '1,200 Rs',
      id: 'index-5',
      category: 'bangle',
    },
    {
      img: '/imgs/p5.jpg',
      name: 'Bangles with Earings',
      price: '1,150 Rs',
      id: 'index-6',
      category: 'bangle',
    },
    {
      img: '/imgs/p6.jpg',
      name: 'Enamel Blossom',
      price: '1,550 Rs',
      id: 'index-7',
      category: 'bangle',
    },
    {
      img: '/imgs/p99.jpg',
      name: 'Textured Shine(pair)',
      price: '1,990 Rs',
      id: 'index-8',
      category: 'bangle',
    },
    {
      img: '/imgs - Copy/q11.png',
      name: 'Signature Shine',
      price: '150 Rs',
      id: 'index-9',
      category: 'earring',
    },
    {
      img: '/imgs - Copy/q12.jpg',
      name: 'Modern Chic',
      price: '550 Rs',
      id: 'index-10',
      category: 'earring',
    },
    {
      img: '/imgs - Copy/q16.jpg',
      name: 'Vintage Aura',
      price: '490 Rs',
      id: 'index-11',
      category: 'earring',
    },
    {
      img: '/imgs - Copy/q21.jpg',
      name: 'Pearl Essence',
      price: '500 Rs',
      id: 'index-12',
      category: 'bangle',
    },
  ];
  // Video sources
  const videos = [
    '/vedios/ved-12.mp4',
    '/vedios/WhatsApp Video 2025-07-06 at 16.46.01_93136f2b.mp4',
    '/vedios/WhatsApp Video 2025-07-06 at 16.46.00_c3cb3495.mp4',
    '/vedios/WhatsApp Video 2025-07-06 at 16.46.00_14e6bc6c.mp4',
  ];

  const navigate = useNavigate();

  // Normalize Home product to match Product.jsx/Details.jsx structure
  // Add to Cart logic for Home page
  const [cartMessage, setCartMessage] = useState("");
  const handleAddToCart = (product) => {
    // Always pass price as a number (no Rs, no commas) for cart logic
    const normalizePrice = (price) => Number(String(price).replace(/[^\d]/g, ''));
    const cartItem = {
      id: Date.now(),
      name: product.name,
      category: product.category,
      color: 'gold', // default color
      size: product.category === 'earring' ? undefined : 'Medium', // default size for non-earring
      price: normalizePrice(product.price),
      quantity: 1,
      img: product.img
    };
    let cart = [];
    try {
      cart = JSON.parse(localStorage.getItem("cart")) || [];
    } catch (e) { }
    cart.push(cartItem);
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    setCartMessage("Added to cart!");
    setTimeout(() => setCartMessage(""), 2000);
  };

  const handleProductClick = (product) => {
    // ...existing code...
    // (no change to navigation logic)
    const allProducts = [
      // ...existing code...
    ];
    const getFileName = (path) => path.split('/').pop();
    const found = allProducts.find(p =>
      p.name === product.name &&
      getFileName(p.img) === getFileName(product.img)
    );
    const normalizePrice = (price) => Number(String(price).replace(/[^\d]/g, ''));
    const productForDetails = found
      ? { ...found }
      : { ...product, price: normalizePrice(product.price) };
    navigate("/details", { state: { product: productForDetails } });
  };

  return (
    <>
      {/* Splash Screen */}
      <section className='ban'>

        <div
          id="splash"
          className={splashVisible ? 'visible' : 'hidden'}
        >
          <img
            src="./imgs/logo.png"
            alt="Logo"
          />
        </div>
      </section>
      <Header />
      {/* Banner Section */}
      <section className="banner" data-aos="fade-up" data-aos-delay="380" data-aos-once="true">
        <div className="cointain">
          <div className="flexbox" data-aos="fade-up" data-aos-delay="380" data-aos-once="true">
            <div className="col-1 animate__animated animate__fadeInLeft" data-aos="fade-up" data-aos-delay="380" data-aos-once="true">
              <h1>Welcome to Our HandMade Jewelry Store</h1>
              <p>Discover the elegance of handcrafted jewelry that tells your story.</p>
              {/* <Link to="/product" className="button button-1">Shop Now</Link> */}
              <Link to="/Product" className="button">Explore Now</Link>
            </div>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="features sec-1" data-aos="fade-up" data-aos-delay="380" data-aos-once="true">
        <div className="cointain">
          <div className="flex sec-1" data-aos="fade-up" data-aos-delay="380" data-aos-once="true">
            <div className="image sec-1" data-aos="fade-up" data-aos-delay="380" data-aos-once="true">
              <img src="./imgs - Copy/q14.jpg" alt="Feature 1" />
            </div>
            <div className="image">
              <img src="./imgs - Copy/q1.jpg" alt="Feature 2" />
            </div>
            <div className="image">
              <img src="./imgs - Copy/q12.jpg" alt="Feature 3" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="product" data-aos="fade-up" data-aos-delay="580" data-aos-once="true">
        <div className="cointain">
          <div className="heading">
            <div className="h1">
              <h1>featured products</h1>
            </div>
          </div>
          <div className="line"></div>
          <div className="shop-grid" data-aos="fade-up" data-aos-delay="580" data-aos-once="true">
            {featuredProducts.map((product) => (
              <div
                className="sec-1 sec-2 animate__animated animate__fadeInLeft"
                data-aos="fade-up"
                data-aos-delay="380"
                data-aos-once="true"
                key={product.id}
                onClick={() => handleProductClick(product)}
                style={{ cursor: 'pointer' }}
              >
                <div className="image">
                  <img src={product.img} alt={product.name} id={product.id} />
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
                      <h6>{product.price}</h6>
                    </div>
                  </div>
                  <div className="flexitem">
                    <button
                      className="add-to-cart"
                      style={{
                        width: "60px",
                      }}
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

            ))}
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
            {latestProducts.map((product) => (
              <div
                className="sec-1 sec-2"
                data-aos="fade-up"
                data-aos-delay="380"
                data-aos-once="true"
                key={product.id}
                onClick={() => handleProductClick(product)}
                style={{ cursor: 'pointer' }}
              >
                <div className="image">
                  <img src={product.img} alt={product.name} id={product.id} />
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
                      <h6>{product.price}</h6>
                    </div>
                  </div>
                  <div className="flexitem">
                    <button
                      className="add-to-cart"
                      style={{
                        width: "60px",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                    >
                      <img src="/shopping.png" alt="" />
                    </button>
                  </div>
                </div>
              </div>

            ))}
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
            <div className="shop-grid videos-grid" data-aos="fade-up" data-aos-delay="580" data-aos-once="true">
              {videos.map((src, idx) => (
                <div className="video-wrapper" key={idx}>
                  <video
                    className="video-player"
                    typeof='video/mp4'
                    // src={src} 
                    controls
                    autoPlay
                    muted
                    loop
                    playsInline
                    loading="lazy"
                    //  source src={src} type="video/mp4"
                    poster="/imgs/logo.png"
                    onError={(e) => {
                      console.error('Video loading error for:', src, e);
                      e.target.style.display = 'none';
                    }}
                    onLoadStart={() => console.log('Video load started:', src)}
                    onLoadedData={() => console.log('Video loaded successfully:', src)}>
                    <source src={src} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {cartMessage && (
        <div style={{ position: 'fixed', top: 10, right: 30, background: '#4BB543', color: '#fff', padding: '12px 28px', borderRadius: 10, fontWeight: 600, zIndex: 9999, boxShadow: '0 4px 16px rgba(0,0,0,0.13)' }}>
          {cartMessage}
        </div>
      )}
            <Footer />
      {/*       hjh */}
    </>
  );
};

export default Home;
