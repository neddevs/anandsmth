import React, { useState, useEffect } from 'react';
import './SoundNotification.css';

const SoundNotification = ({ show, onHide, message = "🪣 Sankh dhwani - Welcome to Anandmaya" }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      // Auto hide after 3 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => {
          onHide && onHide();
        }, 300); // Wait for fade out animation
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [show, onHide]);

  if (!show && !isVisible) return null;

  return (
    <div className={`sound-notification ${isVisible ? 'show' : 'hide'}`}>
      <div className="notification-content">
        <i className="fas fa-volume-up"></i>
        <span>{message}</span>
      </div>
    </div>
  );
};

export default SoundNotification;













