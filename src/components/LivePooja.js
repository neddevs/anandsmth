import React from 'react';
import { motion } from 'framer-motion';
import './LivePooja.css';

const LivePooja = () => {
  const features = [
    { icon: 'fas fa-video', text: 'HD Live Streaming' },
    { icon: 'fas fa-comments', text: 'Interactive Chat' },
    { icon: 'fas fa-download', text: 'Recording Available' },
    { icon: 'fas fa-mobile-alt', text: 'Mobile Friendly' }
  ];

  const handleVideoClick = () => {
    // Show notification about live streaming
    const notification = document.createElement('div');
    notification.className = 'notification notification-info';
    notification.textContent = 'Live streaming will be available during scheduled pooja times';
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background: #2196F3;
      color: white;
      padding: 15px 20px;
      border-radius: 5px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 10000;
      transform: translateX(100%);
      transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 300);
    }, 5000);
  };

  return (
    <section className="live-pooja">
      <div className="container">
        <div className="live-pooja-content">
          <motion.div 
            className="live-pooja-text"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2>Live Pooja Ceremonies</h2>
            <p>Experience the divine energy through our live streaming pooja ceremonies. Our experienced priests conduct authentic rituals while you participate from the comfort of your home.</p>
            <div className="live-features">
              {features.map((feature, index) => (
                <motion.div 
                  key={index}
                  className="live-feature"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <i className={feature.icon}></i>
                  <span>{feature.text}</span>
                </motion.div>
              ))}
            </div>
            <motion.button 
              className="btn btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              View Live Schedule
            </motion.button>
          </motion.div>
          <motion.div 
            className="live-pooja-video"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div 
              className="video-placeholder"
              onClick={handleVideoClick}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <i className="fas fa-play-circle"></i>
              <p>Live Pooja Ceremony</p>
              <span className="live-indicator">LIVE</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LivePooja;
















