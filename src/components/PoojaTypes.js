import React from 'react';
import { motion } from 'framer-motion';
import { poojaTypesData } from '../config/poojaConfig'; // Import from config
import './PoojaTypes.css';

const PoojaTypes = ({ onPoojaSelect }) => {

  const handlePoojaClick = (pooja) => {
    // Scroll to booking form
    const bookingSection = document.querySelector('.booking-form-section');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="pooja-types">
      <div className="container">
        <div className="section-header">
          <h2>Book Your Online Pooja</h2>
          <p>Choose from our various pooja services designed for different occasions and needs</p>
        </div>
        <div className="pooja-grid">
          {poojaTypesData.map((pooja, index) => (
            <motion.div
              key={pooja.id}
              className={`pooja-card ${pooja.featured ? 'featured' : ''}`}
              onClick={() => handlePoojaClick(pooja)}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05, y: -10 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              {pooja.featured && (
                <div className="pooja-badge">Most Popular</div>
              )}
              <div className="pooja-icon">
                <i className={pooja.icon}></i>
              </div>
              <h3>{pooja.title}</h3>
              <p>{pooja.description}</p>
              <div className="pooja-price">₹ {pooja.price}</div>
              <button className="btn btn-primary">Book Now</button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PoojaTypes;
















