import React from 'react';
import './PageLayout.css';

const PageLayout = ({ children }) => {
  return (
    <main className="page-layout-container">
      {children}
    </main>
  );
};

export default PageLayout;