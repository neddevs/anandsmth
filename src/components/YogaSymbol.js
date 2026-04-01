import React from 'react';
import './YogaSymbol.css';

const YogaSymbol = ({ size = 'large' }) => {
  const getSizeClass = () => {
    switch (size) {
      case 'small': return 'yoga-symbol-small';
      case 'medium': return 'yoga-symbol-medium';
      case 'xlarge': return 'yoga-symbol-xlarge';
      default: return 'yoga-symbol-large';
    }
  };

  return (
    <div className={`yoga-symbol-container ${getSizeClass()}`}>
      <div className="yoga-symbol-icon">
        {/* Chakra Energy Points */}
        <div className="chakra-point chakra-1"></div>
        <div className="chakra-point chakra-2"></div>
        <div className="chakra-point chakra-3"></div>
        <div className="chakra-point chakra-4"></div>
        <div className="chakra-point chakra-5"></div>
        <div className="chakra-point chakra-6"></div>
        <div className="chakra-point chakra-7"></div>
        
        {/* Central Lotus representing enlightenment */}
        <div className="yoga-lotus">
          <div className="lotus-petal yoga-petal-1"></div>
          <div className="lotus-petal yoga-petal-2"></div>
          <div className="lotus-petal yoga-petal-3"></div>
          <div className="lotus-petal yoga-petal-4"></div>
          <div className="lotus-petal yoga-petal-5"></div>
          <div className="lotus-petal yoga-petal-6"></div>
          <div className="lotus-petal yoga-petal-7"></div>
          <div className="lotus-petal yoga-petal-8"></div>
          
          {/* Center with Om symbol */}
          <div className="yoga-center">
            <div className="yoga-om-symbol">ॐ</div>
          </div>
        </div>
        
        {/* Energy flow lines */}
        <div className="energy-flow energy-flow-1"></div>
        <div className="energy-flow energy-flow-2"></div>
        <div className="energy-flow energy-flow-3"></div>
        <div className="energy-flow energy-flow-4"></div>
        
        {/* Meditation aura rings */}
        <div className="aura-ring aura-ring-1"></div>
        <div className="aura-ring aura-ring-2"></div>
        <div className="aura-ring aura-ring-3"></div>
      </div>
    </div>
  );
};

export default YogaSymbol;










