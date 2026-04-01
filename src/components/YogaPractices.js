import React from 'react';
import { motion } from 'framer-motion';
import './YogaPractices.css';

const YogaPractices = ({ practices }) => {
  return (
    <section className="yoga-practices">
      <div className="container">
        <motion.div 
          className="practices-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2>Yoga Practices</h2>
          <p>Explore our comprehensive range of yoga practices designed for all levels and goals</p>
        </motion.div>

        <div className="practices-grid">
          {practices.map((practice, index) => (
            <motion.div 
              key={practice.id}
              className="practice-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.03, y: -5 }}
            >
              <div className="practice-image">
                <img src={practice.image} alt={practice.name} />
                <div className="practice-overlay">
                  <div className="practice-difficulty">{practice.difficulty}</div>
                  <div className="practice-duration">{practice.duration}</div>
                </div>
              </div>
              
              <div className="practice-content">
                <h3 className="practice-name">{practice.name}</h3>
                <p className="practice-description">{practice.description}</p>
                
                <div className="practice-benefits">
                  <h4>Benefits:</h4>
                  <ul>
                    {practice.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex}>{benefit}</li>
                    ))}
                  </ul>
                </div>
                
                <motion.button 
                  className="practice-cta"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <i className="fas fa-play"></i>
                  Learn More
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default YogaPractices;










