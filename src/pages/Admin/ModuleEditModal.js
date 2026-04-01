import React, { useState, useEffect } from 'react';
import './ProductEditModal.css';

const ModuleEditModal = ({ module, isOpen, onClose, onSave, courseModulesCount, parentCourseTier }) => {

  const getInitialState = () => ({
    title: '',
    description: '',
    // Default the order to be the next one in sequence
    order: courseModulesCount + 1,
    // Default the tier to the parent course's tier when adding a new module
    subscriptionTier: parentCourseTier || 'Free',
  });

  const [formData, setFormData] = useState(getInitialState());
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    // This effect runs whenever the modal is opened or the props change
    if (isOpen) {
      if (module) {
        // "Edit" mode: Populate the form with the existing module's data
        setFormData({
          title: module.title || '',
          description: module.description || '',
          order: module.order || 1,
          // Use the module's specific tier, or fall back to the parent course's tier
          subscriptionTier: module.subscriptionTier || parentCourseTier || 'Free',
        });
      } else {
        // "Add" mode: Reset the form to its initial state
        setFormData(getInitialState());
      }
    }
  }, [module, isOpen, courseModulesCount, parentCourseTier]);

  if (!isOpen) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await onSave(formData);
    setIsSaving(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{module ? 'Edit Module' : 'Add New Module'}</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="title">Module Title</label>
            <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="description">Module Description</label>
            <textarea id="description" name="description" rows="3" value={formData.description} onChange={handleChange}></textarea>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="order">Order</label>
              <input type="number" id="order" name="order" value={formData.order} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label htmlFor="subscriptionTier">Access Tier</label>
              <select id="subscriptionTier" name="subscriptionTier" value={formData.subscriptionTier} onChange={handleChange}>
                <option value="Free">Free (Visible to all enrolled users)</option>
                <option value="Plus">Plus (Requires Plus or Premium subscription)</option>
                <option value="Premium">Premium (Requires Premium subscription)</option>
              </select>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-save" onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Module'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModuleEditModal;