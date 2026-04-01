import React from 'react';
import Slider from 'react-slick';

import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

import './BackgroundCarousel.css';

// TODO : - Home Images goes here
const images = [
  'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1920&q=80',
  // 'https://images.unsplash.com/photo-1599839578639-62394a15555c?auto=format&fit=crop&w=1920&q=80', //
  'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1920&q=80',
  'https://plus.unsplash.com/premium_photo-1669650270555-43e550f06551?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  // 'https://images.unsplash.com/photo-1552824357-dd6192975c74?auto=format&fit=crop&w=1920&q=80', 
  'https://images.unsplash.com/photo-1483691278019-cb7253bee49f?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://plus.unsplash.com/premium_photo-1670148434570-8130d3bc05c9?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
];

const BackgroundCarousel = () => {
  const settings = {
    dots: false,        // Hide the dots
    infinite: true,     // Loop the carousel
    fade: true,         // Use a fade transition instead of a slide
    speed: 1500,        // Transition speed in ms
    autoplay: true,     // Automatically change slides
    autoplaySpeed: 5000,// Time between slides in ms
    cssEase: 'ease-in-out',
    pauseOnHover: false,
    arrows: false,      // Hide the navigation arrows
  };

  return (
    <div className="background-carousel">
      <Slider {...settings}>
        {images.map((img, index) => (
          <div key={index}>
            <div 
              className="background-slide" 
              style={{ backgroundImage: `url(${img})` }}
            ></div>
          </div>
        ))}
      </Slider>
      <div className="background-overlay"></div>
    </div>
  );
};

export default BackgroundCarousel;