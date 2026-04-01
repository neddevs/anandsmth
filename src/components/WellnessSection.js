import React from 'react';
import { motion } from 'framer-motion';
import './WellnessSection.css';

const WellnessSection = ({ id, title, icon, color, description, features, image, reverse = false }) => {
  return (
    <section id={id} className={`wellness-section ${reverse ? 'reverse' : ''}`}>
      <div className="container">
        <div className="wellness-content">
          <motion.div 
            className="wellness-text"
            initial={{ opacity: 0, x: reverse ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="wellness-header">
              <div className="wellness-icon" style={{ backgroundColor: color }}>
                <i className={icon}></i>
              </div>
              <h2 className="wellness-title">{title}</h2>
            </div>
            
            <p className="wellness-description">{description}</p>
            
            <div className="wellness-features">
              {features.map((feature, index) => (
                <motion.div 
                  key={index}
                  className="wellness-feature"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="feature-icon">
                    <i className="fas fa-check"></i>
                  </div>
                  <span>{feature}</span>
                </motion.div>
              ))}
            </div>
            
            <motion.button 
              className="wellness-cta"
              style={{ backgroundColor: color }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Learn More
            </motion.button>
          </motion.div>
          
          <motion.div 
            className="wellness-image"
            initial={{ opacity: 0, x: reverse ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="image-container">
              <img src={image} alt={title} />
              <div className="image-overlay" style={{ backgroundColor: `${color}20` }}>
                <div className="overlay-content">
                  <i className={icon} style={{ color }}></i>
                  <span>Discover {title}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WellnessSection;










