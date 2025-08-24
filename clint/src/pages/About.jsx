import React from "react";
import "../styles/main.scss";
import Header from "../components/header1";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

export default function HeroFive() {
  return (
    <>
   <Header />
  <section className="hero5 fade-in-page" data-aos="fade-up" data-aos-delay="380" data-aos-once="true">
      <div className="hero5__media" data-aos="fade-up" data-aos-delay="380" data-aos-once="true">
        <LazyLoadImage
                  alt=""
                  src="/q12.jpg"
                  effect="blur"
                  height="100%"
                className="hero5__img" />
      </div>

      <div className="hero5__content" data-aos="fade-up" data-aos-delay="380" data-aos-once="true">
        <div className="hero5__headline" data-aos="fade-up" data-aos-delay="380" data-aos-once="true">
          <span>Ready to bring</span>
          <span>more freedom,</span>
          <span>ease, & intentional</span>
          <span>growth into your</span>
          <span>business?</span>
        </div>

        <div className="hero5__copy" data-aos="fade-up" data-aos-delay="380" data-aos-once="true">
          <p className="hero5__kicker">You’ve come to the right place.</p>
          <p>
            This is where you’ll find <strong>guidance</strong>,{" "}
            <strong>encouragement</strong>, and <strong>support</strong> so that
            you can build and run a business that{" "}
            <em>truly works best for you</em>.
          </p>
        </div>

        <Link to="/Product"><p className="hero5__cta" data-aos="fade-up" data-aos-delay="380" data-aos-once="true"> Let’s order now…</p></Link>
      </div>
    </section>
    <Footer /> 
    </>
  );
}
