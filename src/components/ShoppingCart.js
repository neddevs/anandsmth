import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../contexts/CartContext';
import './ShoppingCart.css';

const ShoppingCart = () => {
  const {
    isCartOpen,
    cartItems,
    updateQuantity,
    removeFromCart,
    closeCart
  } = useCart();
  
  const navigate = useNavigate();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(price);
  };
  
  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    closeCart(); // Close the cart sidebar
    navigate('/checkout'); // Navigate to the dedicated checkout page
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            className="cart-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />
          <motion.div
            className="shopping-cart"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            <div className="cart-header">
              <h2>Your Cart</h2>
              <button className="close-btn" onClick={closeCart}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="cart-content">
              {cartItems.length === 0 ? (
                <div className="empty-cart">
                  <i className="fas fa-shopping-bag"></i>
                  <h3>Your cart is empty</h3>
                  <p>Add some spiritual items to get started.</p>
                </div>
              ) : (
                <>
                  <div className="cart-items">
                    {cartItems.map((item) => (
                      <motion.div
                        key={item._id}
                        className="cart-item"
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="item-image">
                           {/* Use the first image from the images array */}
                          <img src={item.images[0]} alt={item.name} />
                        </div>
                        <div className="item-details">
                          <h4>{item.name}</h4>
                          <p className="item-price">{formatPrice(item.price)}</p>
                        </div>
                        <div className="item-controls">
                          <div className="quantity-controls">
                            <button
                              onClick={() => updateQuantity(item, item.quantity - 1)}
                              className="quantity-btn"
                            >
                              <i className="fas fa-minus"></i>
                            </button>
                            <span className="quantity">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item, item.quantity + 1)}
                              className="quantity-btn"
                            >
                              <i className="fas fa-plus"></i>
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item)}
                            className="remove-btn"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="cart-summary">
                    <div className="total-row">
                      <span>Subtotal:</span>
                      <span className="total-amount">{formatPrice(cartTotal)}</span>
                    </div>
                    <motion.button
                      className="checkout-btn"
                      onClick={handleCheckout}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <i className="fas fa-shield-alt"></i>
                      Proceed to Checkout
                    </motion.button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ShoppingCart;