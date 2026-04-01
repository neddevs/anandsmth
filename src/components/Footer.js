import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import BackToTopButton from './BackToTopButton';
import './Footer.css';

const Footer = () => {
  return (
    <>
      <footer className="footer-compact">
        <div className="container">
          <div className="footer-content-compact">
            
            {/* 1. Logo */}
            <div className="footer-logo-compact">
              <Logo size="small" />
            </div>

            {/* 2. Essential Links */}
            <nav className="footer-nav">
              <Link to="/online-pooja">Online Pooja</Link>
              <Link to="/bhakti-store">Bhakti Store</Link>
              <Link to="/bhakti-yoga">Bhakti Yoga</Link>
              <Link to="/">Contact</Link>
            </nav>

            {/* 3. Social Media Icons */}
            <div className="social-links-compact">
              <a href="https://facebook.com" aria-label="Facebook" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook-f"></i></a>
              <a href="https://twitter.com" aria-label="Twitter" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a>
              <a href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>
              <a href="https://youtube.com" aria-label="YouTube" target="_blank" rel="noopener noreferrer"><i className="fab fa-youtube"></i></a>
            </div>

          </div>
          
          {/* 4. Copyright line */}
          <div className="footer-bottom-compact">
            <p>&copy; {new Date().getFullYear()} Anandmaya. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
      <BackToTopButton />
    </>
  );
};

export default Footer;