import React from 'react';
import { motion } from 'framer-motion';
import './ProductGrid.css';

const ProductGrid = ({ products, onAddToCart, onProductClick }) => {
  return (
    <section className="product-grid-section">
      <div className="container">
        {products.length === 0 ? (
          <p className="no-products-message">No products found in this category.</p>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <motion.div
                key={product._id}
                className="product-card"
                // ... motion props ...
              >
                <div className="product-image-container" onClick={() => onProductClick(product)}>
                  <img src={product.images[0]} alt={product.name} className="product-image" />
                </div>
                <div className="product-info">
                  {/* --- UPDATE THIS H3 ELEMENT --- */}
                  <h3 
                    className="product-name" 
                    onClick={() => onProductClick(product)}
                    data-full-name={product.name} /* <-- Add this attribute */
                  >
                    {product.name}
                  </h3>
                  {/* ----------------------------- */}
                  <p className="product-category">{product.category}</p>
                  <div className="product-price">₹{product.price.toFixed(2)}</div>
                  <button className="btn-add-to-cart" onClick={() => onAddToCart(product)}>
                    Add to Cart
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;