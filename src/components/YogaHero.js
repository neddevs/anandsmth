import React from 'react';
import { motion } from 'framer-motion';
import Logo from './Logo';
import YogaSymbol from './YogaSymbol';
import './YogaHero.css';

const YogaHero = () => {
  return (
    <section className="yoga-hero">
      <div className="yoga-hero-overlay"></div>
      
      {/* Animated Background Elements */}
      <div className="yoga-hero-background">
        <motion.div 
          className="floating-lotus-1"
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        >
          🪷
        </motion.div>
        <motion.div 
          className="floating-lotus-2"
          animate={{ 
            y: [0, 15, 0],
            rotate: [0, -3, 0]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 1
          }}
        >
          🕉️
        </motion.div>
        <motion.div 
          className="floating-lotus-3"
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 8, 0]
          }}
          transition={{ 
            duration: 7, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 2
          }}
        >
          ✨
        </motion.div>
      </div>

      <div className="yoga-hero-content">
        <motion.div 
          className="yoga-hero-logo"
          initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1.5, delay: 0.2, type: "spring", stiffness: 100 }}
        >
          <Logo size="xlarge" showText={false} />
        </motion.div>

        <motion.div 
          className="yoga-symbol-container"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.5, type: "spring", stiffness: 120 }}
        >
          <YogaSymbol size="xlarge" />
        </motion.div>

        <motion.div 
          className="yoga-hero-text"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <h1 className="yoga-hero-title">
            <span className="highlight">Bhakti</span> Yoga
          </h1>
          <p className="yoga-hero-subtitle">
            The Path of Devotion & Spiritual Wellness
          </p>
          <p className="yoga-hero-description">
            Discover the ancient wisdom of Bhakti Yoga - a holistic approach that combines 
            physical postures, breathing techniques, and devotional practices to create 
            harmony between body, mind, and spirit.
          </p>
        </motion.div>

        <motion.div 
          className="yoga-hero-actions"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          <motion.button 
            className="yoga-cta-primary"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <i className="fas fa-play"></i>
            Start Your Journey
          </motion.button>
          <motion.button 
            className="yoga-cta-secondary"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <i className="fas fa-calendar"></i>
            View Schedule
          </motion.button>
        </motion.div>

        <motion.div 
          className="yoga-hero-stats"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          <div className="stat-item">
            <div className="stat-number">500+</div>
            <div className="stat-label">Happy Students</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">50+</div>
            <div className="stat-label">Classes Weekly</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">5</div>
            <div className="stat-label">Expert Teachers</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">10+</div>
            <div className="stat-label">Years Experience</div>
          </div>
        </motion.div>
      </div>

      <motion.div 
        className="yoga-hero-scroll"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        onClick={() => {
          const element = document.querySelector('.yoga-introduction');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      >
        <i className="fas fa-chevron-down"></i>
        <span>Discover More</span>
      </motion.div>
    </section>
  );
};

export default YogaHero;










