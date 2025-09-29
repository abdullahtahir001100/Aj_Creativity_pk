import React, { useState, useEffect } from "react";
import axios from 'axios';
import "../styles/main.scss";
import Header from "../components/header1";
import Loader from '../components/loader';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import Footer from "../components/Footer";

const API_URL = 'https://backend-two-henna-22.vercel.app';

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [expanded, setExpanded] = useState({});
  // ✅ STEP 1: Add a new state for loading
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/blogs`);
        setBlogPosts(response.data);
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      } finally {
        // ✅ STEP 2: Set loading to false after the fetch is complete (whether it succeeds or fails)
        setIsLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const handleToggle = (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }
  
  const renderMultiLineText = (text) => {
    if (!text) {
      return null;
    }
    return text.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < text.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <div className="fade-in-page">
      <Header />
      <section className="baner" data-aos="fade-up" data-aos-delay="380" data-aos-once="true">
        <div className="heading">
          <div className="h1">
            <h1>#Blogs</h1>
            <p>Welcome to our thoughts and stories.</p>
          </div>
        </div>
      </section>
      <div className="cointain container">
        <main className="blog-content">
          {/* ✅ STEP 3: Check the loading state before mapping the blogs */}
          {isLoading ? (
            // If it's loading, show this message
            <div className="loading-message">
              <Loader />
            </div>
          ) : (
            // Otherwise, show the blogs
            blogPosts.map((post) => (
              <div key={post._id} className="blog-card">
                <LazyLoadImage
                  alt={post.title}
                  src={post.image} 
                  effect="blur"
                  width="350px"
                  height="300px"
                />
                <div className="blog-info">
                  <h2>{post.title}</h2>
                  <p className="date">{formatDate(post.date)}</p>
                  <p className="desc">{post.description}</p>
                  <div
                    className={`extra-content ${expanded[post._id] ? 'expanded' : ''}`}
                  >
                    <p>{renderMultiLineText(post.extraContent)}</p>
                  </div>
                  <button className="read-more" onClick={() => handleToggle(post._id)}>
                    {expanded[post._id] ? 'Show Less' : 'Read More'}
                  </button>
                </div>
              </div>
            ))
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}