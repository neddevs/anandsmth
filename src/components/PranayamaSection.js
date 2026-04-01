import React from 'react';
import { motion } from 'framer-motion';
import './PranayamaSection.css';

const PranayamaSection = ({ techniques }) => {
  return (
    <section className="pranayama-section">
      <div className="container">
        <motion.div 
          className="pranayama-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2>Pranayama Techniques</h2>
          <p>Master the art of breath control for enhanced physical, mental, and spiritual well-being</p>
        </motion.div>

        <div className="pranayama-grid">
          {techniques.map((technique, index) => (
            <motion.div 
              key={index}
              className="pranayama-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <div className="pranayama-header-card">
                <div className="pranayama-icon">
                  <i className="fas fa-wind"></i>
                </div>
                <h3 className="pranayama-name">{technique.name}</h3>
              </div>
              
              <p className="pranayama-description">{technique.description}</p>
              
              <div className="pranayama-benefits">
                <h4>Benefits:</h4>
                <ul>
                  {technique.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex}>{benefit}</li>
                  ))}
                </ul>
              </div>
              
              <div className="pranayama-steps">
                <h4>How to Practice:</h4>
                <ol>
                  {technique.steps.map((step, stepIndex) => (
                    <li key={stepIndex}>{step}</li>
                  ))}
                </ol>
              </div>
              
              <motion.button 
                className="pranayama-cta"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <i className="fas fa-play-circle"></i>
                Start Practice
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PranayamaSection;










