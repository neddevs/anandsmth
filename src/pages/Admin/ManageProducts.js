import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';
import ProductEditModal from './ProductEditModal'; // Make sure this component exists
import './ManageProducts.css';
import toast from 'react-hot-toast';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for managing the Add/Edit modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null); // null for 'Add', product object for 'Edit'

  /**
   * Fetches all products from the backend and updates the component's state.
   */
  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Fetch products when the component first mounts
  useEffect(() => {
    fetchProducts();
  }, []);

  /**
   * Handlers for the Add/Edit Modal
   */
  const handleOpenAddModal = () => {
    setSelectedProduct(null); // Setting to null signifies "Add New" mode
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setSelectedProduct(product); // Passing the product object signifies "Edit" mode
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  /**
   * Handles the save logic for both creating and updating a product.
   * @param {object} formData - The data from the modal's form.
   */
  const handleSaveProduct = async (formData) => {
    try {
      let response;
      if (selectedProduct) {
        // If a product is selected, we are updating it
        response = await apiService.updateProduct(selectedProduct._id, formData);
      } else {
        // If no product is selected, we are creating a new one
        response = await apiService.createProduct(formData);
      }

      if (response.success) {
        fetchProducts(); // Refresh the list to show the new/updated product
        handleCloseModal();
        // Optionally, show a success toast notification here
      } else {
        throw new Error(response.message || 'Failed to save product');
      }
    } catch (err) {
      // Displaying an alert for simplicity, a toast notification would be better UX
      alert(`Error: ${err.message}`);
    }
  };

  /**
   * Handles the deletion of a product after a confirmation prompt.
   * @param {string} productId - The ID of the product to delete.
   */
  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product permanently?')) {
      try {
        const response = await apiService.deleteProduct(productId);
        if (response.success) {
          fetchProducts(); // Refresh the product list
          toast.success('Product deleted successfully!');
        } else {
          throw new Error(response.message || 'Failed to delete product');
        }
      } catch (err) {
        setError(err.message); // Display the error on the page
      }
    }
  };

  // Conditional rendering for loading and error states
  if (isLoading) {
    return <div className="loading-spinner">Loading products...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="manage-products-container">
      <div className="header-section">
        <h2>Manage Store Products</h2>
        <button className="btn-primary-admin" onClick={handleOpenAddModal}>
          <i className="fas fa-plus"></i> Add New Product
        </button>
      </div>

      <div className="products-table-wrapper">
        <table className="products-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product._id}>
                  <td data-label="Image">
                    <img src={product.images[0]} alt={product.name} className="product-table-image" />
                  </td>
                  <td data-label="Name">{product.name}</td>
                  <td data-label="Category">{product.category}</td>
                  <td data-label="Price">₹{product.price.toFixed(2)}</td>
                  <td data-label="Stock">{product.stock}</td>
                  <td data-label="Actions" className="action-cell">
                    <button className="action-btn" onClick={() => handleOpenEditModal(product)}>
                      <i className="fas fa-edit"></i> Edit
                    </button>
                    <button className="action-btn btn-delete" onClick={() => handleDelete(product._id)}>
                      <i className="fas fa-trash"></i> Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-results">No products found. Add one to get started!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* The modal is rendered here but only visible when isModalOpen is true */}
      <ProductEditModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveProduct}
      />
    </div>
  );
};

export default ManageProducts;