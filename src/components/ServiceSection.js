import React from 'react';
import { motion } from 'framer-motion';
import './ServiceSection.css';

const ServiceSection = ({ 
  id, 
  title, 
  subtitle, 
  // 'icon' is no longer used but kept for safety
  description, 
  features, 
  buttonText, 
  onButtonClick, 
  // old props 'imageIcon' and 'imageText' are no longer used
  customImage,
  imageUrl, // <-- This is the new prop we are adding
  reverse = false 
}) => {
  return (
    <section id={id} className={`service-section ${reverse ? 'alt' : ''}`}>
      <div className="container">
        <div className="section-header">
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
        <div className={`service-content ${reverse ? 'reverse' : ''}`}>
          <motion.div 
            className="service-image"
            initial={{ opacity: 0, x: reverse ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* --- THIS BLOCK IS THE ONLY PART THAT CHANGES --- */}
            <div className="image-placeholder">
              {imageUrl ? (
                // If an imageUrl is provided, render an img tag
                <img src={imageUrl} alt={title} />
              ) : customImage ? (
                // If a custom component is provided, render it
                customImage
              ) : (
                // Fallback in case neither is provided
                <p>Image for {title}</p>
              )}
            </div>
            {/* ----------------------------------------------- */}
          </motion.div>
          <motion.div 
            className="service-text"
            initial={{ opacity: 0, x: reverse ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3>{title}</h3>
            <p>{description}</p>
            <ul className="service-features">
              {features.map((feature, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <i className="fas fa-check"></i>
                  {feature}
                </motion.li>
              ))}
            </ul>
            <motion.button 
              className="btn btn-primary"
              onClick={onButtonClick}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              {buttonText}
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ServiceSection;