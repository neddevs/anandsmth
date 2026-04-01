import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import Logo from './Logo';
import './Navbar.css';
import toast from 'react-hot-toast';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const { user, isLoggedIn, logout } = useAuth();
  const { cartItems, toggleCart } = useCart();
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMenuOpen]);

  const handleLogout = () => {
    logout();
    toast.success("You have been logged out.");
    setShowUserMenu(false);
  };

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const getAvatarUrl = () => {
    if (user?.avatar) return user.avatar;
    const name = user?.fullName || 'User';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=8B4513&color=fff&bold=true`;
  };

  const drawerVariants = {
    hidden: { x: '-100%', borderTopRightRadius: '50px', borderBottomRightRadius: '50px' },
    visible: { 
      x: 0, 
      borderTopRightRadius: '20px', 
      borderBottomRightRadius: '20px',
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    },
    exit: { 
      x: '-100%', 
      borderTopRightRadius: '50px', 
      borderBottomRightRadius: '50px',
      transition: { duration: 0.3 }
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className="mobile-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMenuOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <div className={`navbar-wrapper ${scrolled ? 'scrolled' : ''}`}>
        <nav className="navbar">
          <div className="nav-container">
            {/* 1. HAMBURGER */}
            <button 
              className={`hamburger ${isMenuOpen ? 'active' : ''}`} 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <span className="bar"></span>
              <span className="bar"></span>
              <span className="bar"></span>
            </button>

            {/* 2. LOGO */}
            <div className="nav-logo">
              <Link to="/" className="nav-logo-link">
                <Logo size="small" />
                <span className="nav-brand-text">Anandmaya</span>
              </Link>
            </div>

            {/* 3. DESKTOP NAVIGATION MENU */}
            <ul className="nav-menu desktop-menu">
              <li><NavLink to="/" className="nav-link">Home</NavLink></li>
              <li><NavLink to="/online-pooja" className="nav-link">Online Pooja</NavLink></li>
              <li><NavLink to="/live-darshan" className="nav-link">Live Darshan</NavLink></li>
              <li><NavLink to="/bhakti-store" className="nav-link">Bhakti Store</NavLink></li>
              <li><NavLink to="/bhakti-yoga" className="nav-link">Bhakti Yoga</NavLink></li>
            </ul>

            {/* 4. RIGHT SIDE ACTIONS */}
            <div className="nav-actions">
              <button className="nav-cart-btn" onClick={toggleCart} aria-label="Open Shopping Cart">
                <i className="fas fa-shopping-cart"></i>
                {cartItemCount > 0 && <span className="nav-cart-count">{cartItemCount}</span>}
              </button>

              {isLoggedIn ? (
                <div className="user-menu-container" ref={userMenuRef}>
                  <button className="user-menu-trigger" onClick={() => setShowUserMenu(!showUserMenu)} aria-expanded={showUserMenu}>
                    <img src={getAvatarUrl()} alt="User avatar" className="user-avatar-small" />
                  </button>
                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        className="user-menu"
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                      >
                        <div className="user-info">
                          <p className="user-name">{user?.fullName}</p>
                          <p className="user-email">{user?.email}</p>
                        </div>
                        <Link to="/dashboard/bookings" className="user-menu-item" onClick={() => setShowUserMenu(false)}>
                          <i className="fas fa-gopuram"></i> Dashboard
                        </Link>
                        {user?.role === 'admin' && (
                          <Link to="/admin/dashboard" className="user-menu-item admin-link" onClick={() => setShowUserMenu(false)}>
                            <i className="fas fa-user-shield"></i> Admin Panel
                          </Link>
                        )}
                        <button className="user-menu-item logout" onClick={handleLogout}>
                          <i className="fas fa-sign-out-alt"></i> Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="auth-buttons desktop-only">
                  <Link to="/login" className="auth-btn login-btn">Login</Link>
                  <Link to="/signup" className="auth-btn signup-btn">Sign Up</Link>
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>

      {/* 5. MOBILE DRAWER */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className="mobile-drawer"
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="mobile-drawer-header">
              <Link to="/" className="nav-logo-link" onClick={() => setIsMenuOpen(false)}>
                <Logo size="small" />
                <span className="nav-brand-text">Anandmaya</span>
              </Link>
            </div>
            
            <ul className="mobile-nav-menu">
              <li><NavLink to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}><i className="fas fa-home"></i><span>Home</span></NavLink></li>
              <li><NavLink to="/online-pooja" className="nav-link" onClick={() => setIsMenuOpen(false)}><i className="fas fa-gopuram"></i><span>Online Pooja</span></NavLink></li>
              <li><NavLink to="/live-darshan" className="nav-link" onClick={() => setIsMenuOpen(false)}><i className="fas fa-eye"></i><span>Live Darshan</span></NavLink></li>
              <li><NavLink to="/bhakti-store" className="nav-link" onClick={() => setIsMenuOpen(false)}><i className="fas fa-store"></i><span>Bhakti Store</span></NavLink></li>
              <li><NavLink to="/bhakti-yoga" className="nav-link" onClick={() => setIsMenuOpen(false)}><i className="fas fa-book-open"></i><span>Bhakti Yoga</span></NavLink></li>
            </ul>

            {!isLoggedIn && (
              <div className="mobile-auth-buttons">
                <Link to="/login" className="auth-btn login-btn" onClick={() => setIsMenuOpen(false)}>Login</Link>
                <Link to="/signup" className="auth-btn signup-btn" onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;