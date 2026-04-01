import React from 'react';
import { motion } from 'framer-motion';
import './StoreHero.css';

const StoreHero = () => {
  return (
    <section className="store-hero">
      <div className="store-hero-overlay"></div>
      <div className="container">
        <div className="store-hero-content">
          <motion.h1 
            className="store-hero-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Bhakti Store
          </motion.h1>
          <motion.p 
            className="store-hero-subtitle"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            Discover sacred items, spiritual books, and devotional offerings for your spiritual journey
          </motion.p>
          <motion.div 
            className="store-hero-features"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <div className="feature">
              <i className="fas fa-shipping-fast"></i>
              <span>Free Shipping</span>
            </div>
            <div className="feature">
              <i className="fas fa-shield-alt"></i>
              <span>Authentic Products</span>
            </div>
            <div className="feature">
              <i className="fas fa-heart"></i>
              <span>Blessed Items</span>
            </div>
            <div className="feature">
              <i className="fas fa-undo"></i>
              <span>Easy Returns</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default StoreHero;
















