import React from 'react';
import { motion } from 'framer-motion';
import './YogaBenefits.css';

const YogaBenefits = () => {
  const benefits = [
    {
      category: 'Physical Benefits',
      icon: 'fas fa-heartbeat',
      color: '#4CAF50',
      items: [
        'Improved flexibility and mobility',
        'Increased muscle strength and tone',
        'Better posture and alignment',
        'Enhanced cardiovascular health',
        'Improved balance and coordination',
        'Boosted immune system function'
      ]
    },
    {
      category: 'Mental Benefits',
      icon: 'fas fa-brain',
      color: '#2196F3',
      items: [
        'Reduced stress and anxiety',
        'Improved focus and concentration',
        'Better sleep quality',
        'Enhanced mood and emotional well-being',
        'Increased self-awareness',
        'Greater mental clarity'
      ]
    },
    {
      category: 'Spiritual Benefits',
      icon: 'fas fa-om',
      color: '#9C27B0',
      items: [
        'Deeper connection with inner self',
        'Enhanced sense of purpose',
        'Greater compassion and empathy',
        'Improved spiritual awareness',
        'Inner peace and tranquility',
        'Connection with universal energy'
      ]
    }
  ];

  return (
    <section className="yoga-benefits">
      <div className="container">
        <motion.div 
          className="benefits-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2>Benefits of Bhakti Yoga</h2>
          <p>Discover the transformative effects of regular yoga practice on your body, mind, and spirit</p>
        </motion.div>

        <div className="benefits-grid">
          {benefits.map((benefit, index) => (
            <motion.div 
              key={index}
              className="benefit-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.03, y: -5 }}
            >
              <div className="benefit-header">
                <div className="benefit-icon" style={{ backgroundColor: benefit.color }}>
                  <i className={benefit.icon}></i>
                </div>
                <h3 className="benefit-title">{benefit.category}</h3>
              </div>
              
              <div className="benefit-items">
                {benefit.items.map((item, itemIndex) => (
                  <motion.div 
                    key={itemIndex}
                    className="benefit-item"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: (index * 0.1) + (itemIndex * 0.05) }}
                    viewport={{ once: true }}
                  >
                    <div className="item-check">
                      <i className="fas fa-check"></i>
                    </div>
                    <span>{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="benefits-cta"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <h3>Ready to Experience These Benefits?</h3>
          <p>Join our Bhakti Yoga community and start your journey towards holistic wellness</p>
          <motion.button 
            className="cta-button"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <i className="fas fa-calendar-plus"></i>
            Book Your First Class
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default YogaBenefits;










