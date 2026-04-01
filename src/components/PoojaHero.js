import React from 'react';
import { motion } from 'framer-motion';
import './PoojaHero.css';

const PoojaHero = () => {
  const stats = [
    { number: '500+', label: 'Poojas Conducted' },
    { number: '1000+', label: 'Devotees Served' },
    { number: '24/7', label: 'Available' }
  ];

  return (
    <section className="pooja-hero">
      <div className="pooja-hero-overlay"></div>
      <div className="container">
        <div className="pooja-hero-content">
          <motion.h1 
            className="pooja-hero-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Online Pooja Services
          </motion.h1>
          <motion.p 
            className="pooja-hero-subtitle"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            Book Your Online Pooja and get the blessings from the comfort of your home.
          </motion.p>
          <motion.div 
            className="pooja-hero-stats"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PoojaHero;
















