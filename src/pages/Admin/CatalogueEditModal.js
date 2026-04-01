import React, { useState, useEffect } from 'react';
import './ProductEditModal.css';

const CatalogueEditModal = ({ catalogue, isOpen, onClose, onSave }) => {
  const getInitialState = () => ({
    name: '',
    description: '',
    image: '', // Optional image field
  });

  const [formData, setFormData] = useState(getInitialState());
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // This effect runs when the modal opens or the selected catalogue changes.
  // It populates the form for editing or resets it for adding.
  useEffect(() => {
    if (isOpen) {
      if (catalogue) {
        // Edit mode: Fill form with the selected catalogue's data
        setFormData({
          name: catalogue.name || '',
          description: catalogue.description || '',
          image: catalogue.image || '',
        });
      } else {
        // Add mode: Reset the form to its initial blank state
        setFormData(getInitialState());
      }
    }
  }, [catalogue, isOpen]);

  // If the modal is not supposed to be open, don't render anything
  if (!isOpen) {
    return null;
  }

  // A generic handler to update state when any form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // The handler for the "Save" button click
  const handleSave = async () => {
    setIsSaving(true);
    await onSave(formData); // Call the onSave function passed down from the parent
    setIsSaving(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{catalogue ? 'Edit Catalogue' : 'Add New Catalogue'}</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="name">Catalogue Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Yoga, Pranayam, Meditation"
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              placeholder="A short summary of what this catalogue is about."
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="image">Image URL (Optional)</label>
            <input
              type="text"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/category-image.jpg"
            />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-save" onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Catalogue'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CatalogueEditModal;