import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';
import './Hero.css';

const Hero = ({ onServiceClick }) => {
  const [activeCard, setActiveCard] = useState(0);

  const serviceOptions = [
    {
      id: 'online-pooja',
      icon: 'fas fa-hands-praying',
      title: 'Online Pooja',
      description: 'Participate in sacred Vedic rituals from the comfort of your home.',
      imageUrl: 'https://images.unsplash.com/photo-1625072290979-cac544181be8?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'live-darshan',
      icon: 'fas fa-eye',
      title: 'Live Darshan',
      description: 'Real-time divine sightings from major temples across India.',
      imageUrl: 'https://images.unsplash.com/photo-1758467746090-06bd59666c50?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'bhakti-store',
      icon: 'fas fa-store',
      title: 'Bhakti Store',
      description: 'Curated spiritual items, idols, and books for your journey.',
      imageUrl: 'https://images.unsplash.com/photo-1693749390308-a50fe528479a?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'bhakti-yoga',
      icon: 'fas fa-spa',
      title: 'Bhakti Yoga',
      description: 'Connect body, mind, and soul through devotional yoga practices.',
      imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80'
    },
  ];

  return (
    <section className="hero">
      {/* Live Darshan Widget - Restored Style with Framer Motion */}
      <motion.div
        className="live-darshan-widget"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 1, type: "spring" }}
        onClick={() => onServiceClick('live-darshan')}
      >
        <span className="watch-live-text">Divine Darshan</span>
        <div className='watch-live-butt'>Watch Live</div>
      </motion.div>

      {/* Top Content */}
      <div className="hero-content-top">
        <motion.div
          className="hero-logo"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <Logo size="xlarge" />
        </motion.div>

        <motion.h1
          className="hero-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <span className="highlight">Anandmaya</span>
        </motion.h1>

        <motion.p
          className="hero-subtitle1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Body ~ Mind ~ Soul
        </motion.p>

        <motion.p
          className="hero-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Discover the path of devotion, spiritual enlightenment and physical wellness
        </motion.p>
      </div>

      {/* The Expansion Deck */}
      <div className="hero-deck-container">
        <div className="deck-grid">
          {serviceOptions.map((service, index) => {
            const isActive = activeCard === index;

            return (
              <motion.div
                key={service.id}
                className={`deck-card ${isActive ? 'active' : ''}`}
                onClick={() => onServiceClick(service.id)}
                onHoverStart={() => setActiveCard(index)}
                layout
                transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                style={{ flex: isActive ? 3 : 1 }}
              >
                <div
                  className="card-bg"
                  style={{ backgroundImage: `url(${service.imageUrl})` }}
                />
                <div className="card-overlay" />

                <div className="card-content">
                  <motion.div layout className="card-header">
                    <div className="card-icon-wrapper">
                      <i className={service.icon}></i>
                    </div>
                    <motion.h3 layout="position" className="card-title">
                      {service.title}
                    </motion.h3>
                  </motion.div>

                  <AnimatePresence>
                    {isActive && (
                      <motion.p
                        className="card-desc"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10, transition: { duration: 0.2 } }}
                        transition={{ delay: 0.2, duration: 0.4 }}
                      >
                        {service.description}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Hero;