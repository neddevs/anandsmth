import React from 'react';
import { motion } from 'framer-motion';
import './ProductCategories.css';

const ProductCategories = ({ categories, selectedCategory, onCategoryChange }) => {
  return (
    <section className="product-categories">
      <div className="container">
        <div className="categories-container">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => onCategoryChange(category.id)}
            >
              <i className={category.icon}></i>
              <span>{category.name}</span>
              
              {/* --- ADD THIS MOTION DIV FOR THE ANIMATED UNDERLINE --- */}
              {selectedCategory === category.id && (
                <motion.div 
                  className="active-indicator" 
                  layoutId="activeCategoryIndicator" // This tells Framer Motion to animate between elements
                />
              )}
              {/* -------------------------------------------------- */}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductCategories;