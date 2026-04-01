import React from 'react';
import './Logo.css';

const Logo = ({ size = 'medium', showText = true, className = '' }) => {
  const logoPath = '/images/logo.png'

  const getSizeClass = () => {
    switch (size) {
      case 'small': return 'logo-small';
      case 'large': return 'logo-large';
      case 'xlarge': return 'logo-xlarge';
      default: return 'logo-medium';
    }
  };

  return (
    <div className={`logo-container ${getSizeClass()} ${className}`}>
      <div className="logo-icon">
        {/* Lotus flower representing purity and spiritual awakening */}
        {/* <div className="lotus-petal lotus-petal-1"></div>
        <div className="lotus-petal lotus-petal-2"></div>
        <div className="lotus-petal lotus-petal-3"></div>
        <div className="lotus-petal lotus-petal-4"></div>
        <div className="lotus-petal lotus-petal-5"></div>
        <div className="lotus-petal lotus-petal-6"></div>
        <div className="lotus-petal lotus-petal-7"></div>
        <div className="lotus-petal lotus-petal-8"></div> */}

        <img src={logoPath} className='logo-image' height='169' />

          {/* Center circle representing the divine */}
        {/* <div className="lotus-center">
          <div className="om-symbol">ॐ</div>
        </div> */}

        {/* Radiating energy rings */}
        {/* <div className="energy-ring energy-ring-1"></div> */}
        <div className="energy-ring energy-ring-2"></div>
        <div className="energy-ring energy-ring-3"></div>
      </div>

    </div>
  );
};

export default Logo;
