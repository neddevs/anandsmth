import React from 'react';
import './PageBackground.css';

const PageBackground = ({ imageUrl }) => {
  return (
    <div className="page-background-container">
      <div
        className="page-background-image"
        style={{ backgroundImage: `url(${imageUrl})` }}
      ></div>
      <div className="page-background-overlay"></div>
    </div>
  );
};

export default PageBackground;