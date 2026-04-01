import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './LiveStreamingBanner.css';

const LiveStreamingBanner = ({ onServiceClick }) => {
  const handleClick = () => {
    onServiceClick('live-darshan');
  };

  return (
    <motion.div 
      className="live-streaming-banner"
      onClick={handleClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      <div className="banner-container">
        <div className="live-section">
          <span className="live-text">LIVE</span>
        </div>
        <div className="streaming-section">
          <span className="streaming-text">DIVINE DARSHAN</span>
        </div>
        <div className="play-button">
          <div className="play-icon">
            <i className="fas fa-play"></i>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LiveStreamingBanner;












