import React, { useRef, useEffect, useState } from "react";
import "../styles/main.scss";
import Header from "../components/header1";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import Footer from "../components/Footer";

const blogPosts = [
  {
    id: 1,
    title: "The Art of Handmade Bangles",
    date: "Aug 12, 2025",
    image: "./imgs/s2.jpg",
    description:
      "Discover the timeless beauty of handcrafted bangles and the intricate designs that make each piece unique."
  },
  {
    id: 2,
    title: "Top 5 Trending Earrings",
    date: "Aug 05, 2025",
    image: "./imgs/s5.jpg",
    description:
      "From classic gold drops to modern studs, explore the earring trends making waves in the jewellery world."
  },
  {
    id: 3,
    title: "How to Care for Your Jewellery",
    date: "Jul 29, 2025",
    image: "./imgs/s11.jpg",
    description:
      "Simple and effective tips to keep your handmade jewellery looking as beautiful as the day you bought it."
  }
];

export default function Contact() {
  const widgetRef = useRef(null);
  const footerRef = useRef(null);
  const [atFooter, setAtFooter] = useState(false);
  const [expanded, setExpanded] = useState({});
  // Example extra content for each blog post (could be fetched or static)
  const extraContent = {
    1: "Handmade bangles are crafted with love and care, using traditional techniques passed down through generations. Each bangle tells a story and adds a unique touch to your style.",
    2: "Earrings are a statement of personality. This season, bold shapes and mixed materials are in. Find out which styles suit your face shape and how to pair them with your outfits.",
    3: "To keep your jewellery shining, store it in a dry place, avoid harsh chemicals, and clean it gently with a soft cloth. Learn more about long-term care and professional cleaning tips here."
  };
  const handleToggle = (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };
  return (
    <div className="fade-in-page">
      <Header />
      <section className="baner" data-aos="fade-up" data-aos-delay="380" data-aos-once="true">
        <div className="heading">
          <div className="h1" data-aos="fade-up" data-aos-delay="380" data-aos-once="true">
            <h1>#Blogs</h1>
            <p>Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet.</p>
          </div>
        </div>
      </section>
      <div className="cointain container">
        <main className="blog-content" data-aos="fade-up" data-aos-delay="380" data-aos-once="true">
          {blogPosts.map((post) => (
            <div key={post.id} className="blog-card" data-aos="fade-up" data-aos-delay="380" data-aos-once="true">
            
                <LazyLoadImage
                  alt={post.title}
                  src={post.image}
                  effect="blur"
                  width="100%"
                  height="300px"
                  object-fit="cover"
                  border-radius="5px"
                  
                />
              <div className="blog-info" data-aos="fade-up" data-aos-delay="380" data-aos-once="true">
                <h2>{post.title}</h2>
                <p className="date">{post.date}</p>
                <p className="desc">{post.description}</p>
                <div
                  className={`extra-content${expanded[post.id] ? ' expanded' : ''}`}
                  style={{ marginBottom: 15, color: '#444', maxHeight: expanded[post.id] ? 200 : 0, overflow: 'hidden', transition: 'max-height 0.5s cubic-bezier(.68,-0.55,.27,1.55), opacity 0.5s', opacity: expanded[post.id] ? 1 : 0 }}
                >
                  {extraContent[post.id]}
                </div>
                <button className="read-more" onClick={() => handleToggle(post.id)}>
                  {expanded[post.id] ? 'Show Less' : 'Read More'}
                </button>
              </div>
            </div>
          ))}
        </main>
      </div>
      <Footer />
    </div>
  );
}
