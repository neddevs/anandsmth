import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import apiService from '../services/api';
import { useCart } from '../contexts/CartContext';
import ProductCategories from '../components/ProductCategories';
import ProductGrid from '../components/ProductGrid';
import ProductModal from '../components/ProductModal';
import PageBackground from '../components/PageBackground';
import './BhaktiStore.css';

const BhaktiStore = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { addToCart, toggleCart } = useCart();
  const imageUrl = 'https://images.unsplash.com/photo-1536570729710-552e7eb8ff1c?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const fetchProducts = async () => {
      try {
        const response = await apiService.getAllProducts();
        if (response.success) {
          setProducts(response.data);
        } else {
          throw new Error(response.message || 'Failed to fetch products');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Create a list of unique categories from the products data
  const categories = [
    { id: 'all', name: 'All Products', icon: 'fas fa-th' },
    ...[...new Set(products.map(p => p.category))].map(category => ({
      id: category.toLowerCase(),
      name: category,
      icon: 'fas fa-gem' // Default icon
    }))
  ];

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(product => product.category.toLowerCase() === selectedCategory);

  const handleAddToCart = (product) => {
    addToCart(product); // Add item to cart via context

    // Display a custom toast notification
    toast.custom((t) => (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="toast-container"
      >
        <img src={product.images[0]} alt={product.name} className="toast-image" />
        <div className="toast-text">
          <p>Added to cart!</p>
          <span>{product.name}</span>
        </div>
        <button
          onClick={() => {
            toggleCart();
            toast.dismiss(t.id);
          }}
          className="toast-button"
        >
          View Cart
        </button>
      </motion.div>
    ), {
      position: 'top-center',
      duration: 4000, // Toast will disappear after 4 seconds
    });
  };

  const openProductModal = (product) => setSelectedProduct(product);
  const closeProductModal = () => setSelectedProduct(null);

  const handleBuyNow = (product) => {
    handleAddToCart(product); // Use the same toast notification
    closeProductModal();
    // Delay opening the cart to give the user time to see the toast
    setTimeout(() => {
      toggleCart();
    }, 300);
  };

  return (
    <div className="bhakti-store-page">
      <PageBackground imageUrl={imageUrl} />
      {/* New compact header */}
      <div className="store-page-header">
        <div className="container-header">
          <h1>Bhakti Store</h1>
          <p>Discover a curated collection of sacred items for your spiritual journey.</p>
        </div>
      </div>

      <div className="store-main-content">
        <ProductCategories
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {isLoading ? (
          <div className="loading-spinner">Loading Products...</div>
        ) : error ? (
          <div className="error-message">Error: {error}</div>
        ) : (
          <ProductGrid
            products={filteredProducts}
            onAddToCart={handleAddToCart}
            onProductClick={openProductModal}
          />
        )}
      </div>

      <ProductModal
        isOpen={!!selectedProduct}
        onClose={closeProductModal}
        product={selectedProduct}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
      />
    </div>
  );
};

export default BhaktiStore;