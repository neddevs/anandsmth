import React from 'react';
import './YantraBackground.css';

const YantraBackground = () => {
  const yantras = [
    {
      id: 'ganesha',
      name: 'Ganesha Yantra',
      symbol: (
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2"/>
          <polygon points="50,20 60,40 80,40 65,55 70,75 50,65 30,75 35,55 20,40 40,40" fill="currentColor"/>
          <circle cx="50" cy="50" r="8" fill="currentColor"/>
        </svg>
      ),
      color: '#4CAF50'
    },
    {
      id: 'durga',
      name: 'Durga Yantra', 
      symbol: (
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <polygon points="50,10 70,30 50,50 30,30" fill="currentColor"/>
          <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="2"/>
          <polygon points="50,50 60,70 50,90 40,70" fill="currentColor"/>
        </svg>
      ),
      color: '#FF9800'
    },
    {
      id: 'sri',
      name: 'Sri Yantra',
      symbol: (
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <polygon points="50,10 70,30 90,50 70,70 50,90 30,70 10,50 30,30" fill="none" stroke="currentColor" strokeWidth="2"/>
          <polygon points="50,20 65,35 80,50 65,65 50,80 35,65 20,50 35,35" fill="currentColor"/>
          <polygon points="50,30 60,40 70,50 60,60 50,70 40,60 30,50 40,40" fill="none" stroke="currentColor" strokeWidth="2"/>
          <circle cx="50" cy="50" r="8" fill="currentColor"/>
        </svg>
      ),
      color: '#9C27B0'
    },
    {
      id: 'kamala',
      name: 'Kamala Yantra',
      symbol: (
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <polygon points="50,10 58,25 73,25 61,35 67,50 50,40 33,50 39,35 27,25 42,25" fill="currentColor"/>
          <polygon points="50,20 58,35 73,35 61,45 67,60 50,50 33,60 39,45 27,35 42,35" fill="none" stroke="currentColor" strokeWidth="2"/>
          <polygon points="50,30 58,45 73,45 61,55 67,70 50,60 33,70 39,55 27,45 42,45" fill="currentColor"/>
          <circle cx="50" cy="50" r="5" fill="currentColor"/>
        </svg>
      ),
      color: '#E91E63'
    },
    {
      id: 'tara',
      name: 'Tara Yantra',
      symbol: (
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <polygon points="50,10 60,30 80,30 65,45 70,65 50,55 30,65 35,45 20,30 40,30" fill="currentColor"/>
          <polygon points="50,30 55,40 65,40 58,47 62,57 50,52 38,57 42,47 35,40 45,40" fill="none" stroke="currentColor" strokeWidth="2"/>
          <circle cx="50" cy="50" r="6" fill="currentColor"/>
        </svg>
      ),
      color: '#00BCD4'
    },
    {
      id: 'sri-chakra',
      name: 'Sri Chakra',
      symbol: (
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <polygon points="50,5 75,25 95,50 75,75 50,95 25,75 5,50 25,25" fill="none" stroke="currentColor" strokeWidth="2"/>
          <polygon points="50,15 70,30 85,50 70,70 50,85 30,70 15,50 30,30" fill="currentColor"/>
          <polygon points="50,25 65,37 77,50 65,63 50,75 35,63 23,50 35,37" fill="none" stroke="currentColor" strokeWidth="2"/>
          <polygon points="50,35 60,45 70,50 60,55 50,65 40,55 30,50 40,45" fill="currentColor"/>
          <circle cx="50" cy="50" r="5" fill="currentColor"/>
        </svg>
      ),
      color: '#FF5722'
    },
    {
      id: 'bagala',
      name: 'Bagala-Mukhi',
      symbol: (
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <polygon points="50,10 70,30 50,50 30,30" fill="currentColor"/>
          <polygon points="50,50 70,70 50,90 30,70" fill="currentColor"/>
          <polygon points="10,50 30,30 50,50 30,70" fill="none" stroke="currentColor" strokeWidth="2"/>
          <polygon points="90,50 70,30 50,50 70,70" fill="none" stroke="currentColor" strokeWidth="2"/>
          <circle cx="50" cy="50" r="8" fill="currentColor"/>
        </svg>
      ),
      color: '#F44336'
    },
    {
      id: 'bhubaneshwar',
      name: 'Bhubaneshwar',
      symbol: (
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2"/>
          <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="2"/>
          <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="2"/>
          <polygon points="50,20 60,40 80,40 65,55 70,75 50,65 30,75 35,55 20,40 40,40" fill="currentColor"/>
          <circle cx="50" cy="50" r="5" fill="currentColor"/>
        </svg>
      ),
      color: '#FFC107'
    },
    {
      id: 'matangi',
      name: 'Matangi',
      symbol: (
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <polygon points="50,10 65,25 80,40 65,55 50,70 35,55 20,40 35,25" fill="currentColor"/>
          <polygon points="50,20 60,30 70,40 60,50 50,60 40,50 30,40 40,30" fill="none" stroke="currentColor" strokeWidth="2"/>
          <circle cx="50" cy="40" r="8" fill="currentColor"/>
        </svg>
      ),
      color: '#8BC34A'
    },
    {
      id: 'tripura',
      name: 'Tripura-Sundari',
      symbol: (
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <polygon points="50,10 70,30 50,50 30,30" fill="currentColor"/>
          <polygon points="50,50 70,70 50,90 30,70" fill="currentColor"/>
          <polygon points="50,30 65,45 50,60 35,45" fill="none" stroke="currentColor" strokeWidth="2"/>
          <circle cx="50" cy="50" r="6" fill="currentColor"/>
        </svg>
      ),
      color: '#795548'
    },
    {
      id: 'kali',
      name: 'Kali Yantra',
      symbol: (
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <polygon points="50,10 60,30 80,30 65,45 70,65 50,55 30,65 35,45 20,30 40,30" fill="currentColor"/>
          <polygon points="50,30 55,40 65,40 58,47 62,57 50,52 38,57 42,47 35,40 45,40" fill="none" stroke="currentColor" strokeWidth="2"/>
          <circle cx="50" cy="50" r="8" fill="currentColor"/>
        </svg>
      ),
      color: '#607D8B'
    },
    {
      id: 'shiva',
      name: 'Shiva Yantra',
      symbol: (
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <polygon points="50,10 70,30 50,50 30,30" fill="currentColor"/>
          <polygon points="50,50 70,70 50,90 30,70" fill="currentColor"/>
          <polygon points="10,50 30,30 50,50 30,70" fill="currentColor"/>
          <polygon points="90,50 70,30 50,50 70,70" fill="currentColor"/>
          <polygon points="50,30 60,40 50,50 40,40" fill="none" stroke="currentColor" strokeWidth="2"/>
          <polygon points="50,50 60,60 50,70 40,60" fill="none" stroke="currentColor" strokeWidth="2"/>
          <circle cx="50" cy="50" r="4" fill="currentColor"/>
        </svg>
      ),
      color: '#212121'
    }
  ];

  return (
    <div className="yantra-background">
      {yantras.map((yantra, index) => (
        <div
          key={yantra.id}
          className={`yantra-symbol yantra-${yantra.id}`}
          style={{
            '--delay': `${index * 0.5}s`,
            '--color': yantra.color
          }}
        >
          <div className="yantra-frame">
            <div className="yantra-inner">
              <div className="yantra-geometric">
                {yantra.symbol}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default YantraBackground;
