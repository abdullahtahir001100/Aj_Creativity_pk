import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCoverflow, Pagination } from 'swiper/modules';
import Lottie from 'lottie-react';
import anime from 'animejs';
import * as THREE from 'three';
import sparkleAnimation from '../assets/sparkle-animation.json';
import { FALLBACK_PRODUCTS, FRIENDLY_ERROR_MESSAGE } from '../utils/homeFallbacks';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import Header from "../components/header1"; 
import Footer from '../components/Footer';
import Loader from '../components/loader';
import TestimonialSlider from '../components/testi'; 
import '../styles/main.scss';
import '../styles/animation.scss';
import SEOMetadata from '../components/SEOMetadata';

const API_BASE_URL = 'https://server-nine-kappa-75.vercel.app/api';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [latestProducts, setLatestProducts] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartMessage, setCartMessage] = useState("");
  const navigate = useNavigate();
  const lenisRef = useRef(null);
  const heroCanvasRef = useRef(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const productsResponse = await fetch(`${API_BASE_URL}/data`);
        if (!productsResponse.ok) throw new Error('Failed to fetch products');
        const productsData = await productsResponse.json();
        
        setFeaturedProducts(productsData.data.filter(p => p.placement === 'featured'));
        setLatestProducts(productsData.data.filter(p => p.placement === 'latest'));

        const videosResponse = await fetch(`${API_BASE_URL}/videos`);
        if (!videosResponse.ok) throw new Error('Failed to fetch videos');
        const videosData = await videosResponse.json();
        
        setVideos(videosData.data || []);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
        window.prerenderReady = true;
      }
    };
    fetchAllData();
  }, []);

  useEffect(() => {
    const lenis = new Lenis({ smoothWheel: true, smoothTouch: true });
    lenisRef.current = lenis;
    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray('.section-animated');
      sections.forEach((section) => {
        gsap.from(section, {
          opacity: 0,
          y: 50,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        });
      });
    });
    return () => ctx.revert();
  }, [loading]);

  useEffect(() => {
    if (!heroCanvasRef.current) return;
    const container = heroCanvasRef.current;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    const geometry = new THREE.IcosahedronGeometry(1.1, 1);
    const material = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.6,
      roughness: 0.2,
      emissive: 0x1a1a1a
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const light = new THREE.DirectionalLight(0xffffff, 1.2);
    light.position.set(2, 2, 2);
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(light);
    scene.add(ambient);

    const onResize = () => {
      const { clientWidth, clientHeight } = container;
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight);
    };

    window.addEventListener('resize', onResize);

    let frameId;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      mesh.rotation.y += 0.003;
      mesh.rotation.x += 0.0015;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      container.innerHTML = '';
    };
  }, []);

  const normalizePrice = (price) => Number(String(price).replace(/[^\d]/g, ''));

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    const cartItem = {
      id: product._id,
      name: product.name,
      category: product.category,
      color: 'gold',
      size: product.category === 'earring' ? undefined : 'Medium',
      price: normalizePrice(product.price),
      quantity: 1,
      image: product.image[0]
    };
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(cartItem);
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    setCartMessage("Added to cart!");
    setTimeout(() => setCartMessage(""), 2000);
  };

  const handleProductClick = (product) => {
    const slug = product.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    const productForDetails = {
      ...product,
      price: normalizePrice(product.price),
      id: product._id,
      image: product.image[0]
    };
    navigate(`/product/${slug}/${product._id}`, { state: { product: productForDetails } });
  };
  
  const homePageStructuredData = { /* Your SEO Data */ };
  const animateButton = (target) => {
    anime.remove(target);
    anime({
      targets: target,
      scale: [1, 1.07, 1],
      duration: 520,
      easing: 'easeInOutSine'
    });
  };

  if (loading) return <Loader />;
  const featuredList = featuredProducts.length > 0 ? featuredProducts : FALLBACK_PRODUCTS.filter(p => p.placement === 'featured');
  const latestList = latestProducts.length > 0 ? latestProducts : FALLBACK_PRODUCTS.filter(p => p.placement === 'latest');

  return (
    <>
      <SEOMetadata 
        title="Jave Handmade"
        description="Discover beautiful, handcrafted jewelry and accessories at Jave Handmade. Quality items made with passion, perfect for any occasion."
        canonicalUrl="/"
        structuredData={homePageStructuredData}
      />
      
      <Header />
      {error && (
        <div style={{ background: '#2b1b14', color: '#f9e7c4', padding: '12px 18px', textAlign: 'center' }}>
          {FRIENDLY_ERROR_MESSAGE}
        </div>
      )}

      <section className="banner enhanced section-animated" data-aos="fade-up" data-aos-delay="380" data-aos-once="true">
        <div className="hero-backdrop" ref={heroCanvasRef} aria-hidden="true" />
        <div className="cointain hero-grid">
          <motion.div
            className="glass-card"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <p className="eyebrow">Smooth. Artistic. Handcrafted.</p>
            <h1>Welcome to Our HandMade Jewelry Store</h1>
            <p className="lede">Discover the elegance of handcrafted jewelry that tells your story.</p>
            <div className="hero-actions">
              <Link to="/product" className="button primary">Explore Now</Link>
              <Link to="/blogs" className="button ghost">Inspiration</Link>
            </div>
            <div className="hero-inline">
              <Lottie loop autoplay className="hero-lottie" animationData={sparkleAnimation} aria-label="Sparkle animation" />
              <div className="hero-metrics">
                <span className="pill">New Arrivals</span>
                <span className="pill pill-outline">Lenis · GSAP · Framer Motion</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="hero-media"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: 'easeOut', delay: 0.1 }}
          >
            {videos.length > 0 ? (
              <video className="hero-video" autoPlay muted loop playsInline>
                <source src={videos[0].videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="hero-fallback">
                <span>Handcrafted luxury in motion</span>
              </div>
            )}
          </motion.div>
        </div>
      </section>
      
      <section className="product section-animated" data-aos="fade-up" data-aos-delay="580" data-aos-once="true">
        <div className="cointain">
          <div className="heading flexbox">
            <div className="h1"><h1>featured products</h1></div>
            <div className="button">
              <Link to="/product">View More</Link>
            </div>
          </div>
          <div className="line"></div>
          <Swiper
            modules={[Autoplay, EffectCoverflow, Pagination]}
            effect="coverflow"
            grabCursor
            centeredSlides
            slidesPerView="auto"
            spaceBetween={20}
            pagination={{ clickable: true }}
            autoplay={{ delay: 3400, disableOnInteraction: false }}
            loop
            breakpoints={{
              320: { slidesPerView: 1.1 },
              640: { slidesPerView: 1.3 },
              1024: { slidesPerView: 2.3 }
            }}
          >
            {featuredList.map((product) => (
              <SwiperSlide key={product._id} style={{ maxWidth: '520px' }}>
                <div className="sec-1 elevated" onClick={() => handleProductClick(product)} style={{ cursor: 'pointer' }}>
                  <div className="image">
                    <img src={product.image[0]} alt={product.name} loading="lazy" />
                  </div>
                  <div className="flexbox1">
                    <div className="flexitem">
                      <div className="text"><h4>{product.name}</h4></div>
                      <div className="price"><h6>{product.price} Rs</h6></div>
                    </div>
                    <div className="flexitem">
                      <button
                        className="add-to-cart neon"
                        style={{ width: "60px" }}
                        onMouseEnter={(e) => animateButton(e.currentTarget)}
                      >
                        <img src="/shopping.png" alt="Add to cart" />
                      </button>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      <section className="product section-animated" data-aos="fade-up" data-aos-delay="580" data-aos-once="true">
        <div className="cointain">
          <div className="heading"><div className="h1"><h1>latest product</h1></div></div>
          <div className="line"></div>
          <div className="shop-grid">
            {latestList.length > 0 ? (
              latestList.map((product) => (
                <div className="sec-1 sec-2" key={product._id} onClick={() => handleProductClick(product)} style={{ cursor: 'pointer' }}>
                  <div className="image">
                    <img src={product.image[0]} alt={product.name} loading="lazy" />
                  </div>
                  <div className="flexbox1">
                    <div className="flexitem">
                      <div className="text"><h4>{product.name}</h4></div>
                      <div className="price"><h6>{product.price} Rs</h6></div>
                    </div>
                    <div className="flexitem">
                      <button
                        className="add-to-cart neon"
                        style={{ width: "60px" }}
                        onMouseEnter={(e) => animateButton(e.currentTarget)}
                      >
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

      <section className="watch section-animated" data-aos="fade-up" data-aos-delay="780" data-aos-once="true">
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
