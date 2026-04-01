import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';
import CatalogueEditModal from './CatalogueEditModal';
import './ManageCatalogues.css';

const ManageCatalogues = () => {
  const [catalogues, setCatalogues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCatalogue, setSelectedCatalogue] = useState(null);

  const fetchCatalogues = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiService.getAllCatalogues();
      if (response.success) {
        setCatalogues(response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch catalogues');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    fetchCatalogues();
  }, []);

  const handleOpenAddModal = () => {
    setSelectedCatalogue(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (catalogue) => {
    setSelectedCatalogue(catalogue);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveCatalogue = async (formData) => {
    try {
      let response;
      if (selectedCatalogue) {
        response = await apiService.updateCatalogue(selectedCatalogue._id, formData);
      } else {
        response = await apiService.createCatalogue(formData);
      }
      if (response.success) {
        fetchCatalogues();
        handleCloseModal();
      } else {
        throw new Error(response.message || 'Failed to save catalogue');
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleDelete = async (catalogue) => {
    // Check if the catalogue has courses before confirming deletion
    if (catalogue.courses && catalogue.courses.length > 0) {
      alert('Error: Cannot delete a catalogue that contains courses. Please move or delete the courses first.');
      return;
    }

    if (window.confirm(`Are you sure you want to delete the "${catalogue.name}" catalogue?`)) {
      try {
        await apiService.deleteCatalogue(catalogue._id);
        fetchCatalogues();
      } catch (err) {
        alert(`Error: ${err.message}`);
      }
    }
  };

  if (isLoading) {
    return <div className="loading-spinner">Loading catalogues...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="manage-catalogues-container">
      <div className="header-section">
        <h2>Manage Course Catalogues</h2>
        <button className="btn-primary-admin" onClick={handleOpenAddModal}>
          <i className="fas fa-plus"></i> New Catalogue
        </button>
      </div>

      <div className="catalogues-table-wrapper">
        <table className="catalogues-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Courses</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {catalogues.length > 0 ? (
              catalogues.map((catalogue) => (
                <tr key={catalogue._id}>
                  <td data-label="Name"><strong>{catalogue.name}</strong></td>
                  <td data-label="Description">{catalogue.description}</td>
                  <td data-label="Courses">{catalogue.courses.length}</td>
                  <td data-label="Actions" className="action-cell">
                    <button className="action-btn" onClick={() => handleOpenEditModal(catalogue)}>
                      <i className="fas fa-edit"></i> Edit
                    </button>
                    <button className="action-btn btn-delete" onClick={() => handleDelete(catalogue)}>
                      <i className="fas fa-trash"></i> Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="no-results">No catalogues found. Create one to get started.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <CatalogueEditModal
        catalogue={selectedCatalogue}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveCatalogue}
      />
    </div>
  );
};

export default ManageCatalogues;