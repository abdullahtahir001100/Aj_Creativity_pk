// src/components/TestimonialSlider.js
import React, { useState, useEffect } from 'react';


const testimonials = [
  { id: 1, name: 'Ayesha Khan', location: 'Sargodha, PK', avatarInitial: 'A', rating: 5, testimonial: "Absolutely in love with my Kundan earrings! The craftsmanship is stunning and they look even more beautiful in person.", date: '2 weeks ago' },
  { id: 2, name: 'Fatima Ali', location: 'Lahore, PK', avatarInitial: 'F', rating: 5, testimonial: "The bangles are just gorgeous. The attention to detail is incredible. I received so many compliments at the wedding.", date: '1 month ago' },
  { id: 3, name: 'Saad Ahmed', location: 'Islamabad, PK', avatarInitial: 'S', rating: 5, testimonial: "I bought a jewelry set for my wife's birthday and she was overjoyed. The quality is top-notch and the design is so unique.", date: '3 weeks ago' },
  { id: 4, name: 'Hina Butt', location: 'Sargodha, PK', avatarInitial: 'H', rating: 4, testimonial: "Beautiful pieces and very well packaged. The delivery was quick. The pin is slightly smaller than I expected, but the quality is great.", date: '2 months ago' },
  { id: 5, name: 'Zainab Qureshi', location: 'Faisalabad, PK', avatarInitial: 'Z', rating: 5, testimonial: "The customer service was excellent and the jewelry is breathtaking. I'll be recommending this store to all my friends!", date: '1 week ago' },
];

const StarRating = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(<span key={`star-${i}`} className={i <= rating ? 'star filled' : 'star'}>★</span>);
  }
  return <div className="star-rating">{stars}</div>;
};

const TestimonialSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1100) {
        setSlidesToShow(3);
      } else if (window.innerWidth >= 768) {
        setSlidesToShow(2);
      } else {
        setSlidesToShow(1);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const lastPossibleIndex = testimonials.length - slidesToShow;
        return prevIndex >= lastPossibleIndex ? 0 : prevIndex + 1;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [slidesToShow]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };
  
  const dotCount = testimonials.length > slidesToShow ? testimonials.length - slidesToShow + 1 : 1;

  return (
    <div className="testimonial-slider-container">
      <div className="testimonial-slider">
        <div
          className="slider-wrapper"
          style={{ transform: `translateX(-${currentIndex * (100 / slidesToShow)}%)` }}
        >
          {testimonials.map((review) => (
            <div 
              className="testimonial-card" 
              key={review.id} // Use the unique review.id for the key
              style={{ flex: `0 0 calc(${100 / slidesToShow}% - 20px)` }}
            >
              <div className="card-header">
                <div className="avatar">{review.avatarInitial}</div>
                <div className="reviewer-info">
                  <p className="reviewer-name">{review.name}</p>
                  <p className="reviewer-location">{review.location}</p>
                </div>
              </div>
              <div className="card-rating">
                <StarRating rating={review.rating} />
                <span className="review-date">{review.date}</span>
              </div>
              <p className="testimonial-text">"{review.testimonial}"</p>
            </div>
          ))}
        </div>
      </div>
       <div className="slider-dots">
        {Array.from({ length: dotCount }).map((_, index) => (
          <button
            key={`dot-${index}`} // Unique key for dots
            className={`dot ${currentIndex === index ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default TestimonialSlider;