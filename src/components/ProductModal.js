import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ProductModal.css';

const ProductModal = ({ isOpen, onClose, product, onAddToCart, onBuyNow }) => {
  // Stop rendering if the modal is not open or there's no product
  if (!isOpen || !product) {
    return null;
  }

  const handleAddToCartClick = () => {
    onAddToCart(product);
    onClose(); // Close the modal after adding to cart
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="product-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="product-modal-content"
            onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <button className="modal-close-btn" onClick={onClose}>&times;</button>
            
            {/* --- Left Column: Image --- */}
            <div className="modal-image-section">
              <img src={product.images[0]} alt={product.name} />
            </div>

            {/* --- Right Column: Details --- */}
            <div className="modal-details-section">
              <p className="modal-category">{product.category}</p>
              <h2 className="modal-product-name">{product.name}</h2>
              <p className="modal-product-description">{product.description}</p>
              <div className="modal-price">₹{product.price.toFixed(2)}</div>
              <div className="modal-actions">
                <motion.button 
                  className="btn btn-add-to-cart" 
                  onClick={handleAddToCartClick}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Add to Cart
                </motion.button>
                <motion.button 
                  className="btn btn-buy-now" 
                  onClick={() => onBuyNow(product)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Buy Now
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductModal;