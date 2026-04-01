import React from 'react';
import { motion } from 'framer-motion';
import './AnimatedBackground.css';

const AnimatedBackground = () => {
  const shrineImages = [
    {
      id: 1,
      src: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      alt: 'Golden Temple',
      delay: 0,
      duration: 20
    },
    {
      id: 2,
      src: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      alt: 'Kashi Vishwanath Temple',
      delay: 2,
      duration: 25
    },
    {
      id: 3,
      src: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      alt: 'Puri Jagannath Temple',
      delay: 4,
      duration: 22
    },
    {
      id: 4,
      src: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      alt: 'Shirdi Sai Temple',
      delay: 6,
      duration: 18
    },
    {
      id: 5,
      src: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      alt: 'Tirupati Temple',
      delay: 8,
      duration: 24
    },
    {
      id: 6,
      src: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      alt: 'Meenakshi Temple',
      delay: 10,
      duration: 26
    }
  ];

  return (
    <div className="animated-background">
      {shrineImages.map((shrine) => (
        <motion.div
          key={shrine.id}
          className="shrine-image"
          initial={{ 
            x: -200, 
            y: Math.random() * window.innerHeight,
            opacity: 0.1,
            scale: 0.8
          }}
          animate={{ 
            x: window.innerWidth + 200,
            y: Math.random() * window.innerHeight,
            opacity: 0.3,
            scale: 1
          }}
          transition={{
            duration: shrine.duration,
            delay: shrine.delay,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear"
          }}
          whileHover={{ 
            scale: 1.1,
            opacity: 0.6,
            transition: { duration: 0.3 }
          }}
        >
          <img 
            src={shrine.src} 
            alt={shrine.alt}
            loading="lazy"
          />
          <div className="shrine-overlay">
            <span className="shrine-name">{shrine.alt}</span>
          </div>
        </motion.div>
      ))}
      
      {/* Floating particles */}
      {[...Array(15)].map((_, index) => (
        <motion.div
          key={`particle-${index}`}
          className="floating-particle"
          initial={{ 
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: 0
          }}
          animate={{ 
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: [0, 0.6, 0],
            scale: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            delay: Math.random() * 5,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedBackground;












