import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';
// re-use the same modal CSS from the Product Edit Modal
import './ProductEditModal.css';

const CourseEditModal = ({ course, isOpen, onClose, onSave }) => {
  // Define the initial state for a new course
  // Note: category is replaced by catalogue ID
  const getInitialState = () => ({
    title: '',
    description: '',
    instructor: 'Anandmaya Faculty',
    thumbnail: '',
    level: 'All Levels',
    catalogue: '',
    subscriptionTier: 'Free',
    isPublished: false,
  });

  const [formData, setFormData] = useState(getInitialState());
  const [catalogues, setCatalogues] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingCatalogues, setIsLoadingCatalogues] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Fetch all catalogues for the dropdown when modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchCatalogues = async () => {
        setIsLoadingCatalogues(true);
        try {
          const response = await apiService.getAllCatalogues();
          if (response.success) {
            setCatalogues(response.data);
          }
        } catch (error) {
          console.error("Failed to fetch catalogues for dropdown:", error);
        } finally {
          setIsLoadingCatalogues(false);
        }
      };

      fetchCatalogues();

      if (course) {
        // Edit mode: Populate form with existing course data
        setFormData({
          title: course.title || '',
          description: course.description || '',
          instructor: course.instructor || 'Anandmaya Faculty',
          thumbnail: course.thumbnail || '',
          level: course.level || 'All Levels',
          catalogue: course.catalogue?._id || course.catalogue || '', // Handle populated or ID only
          subscriptionTier: course.subscriptionTier || 'Free',
          isPublished: course.isPublished || false,
        });
      } else {
        // Add mode: Reset to initial blank state
        setFormData(getInitialState());
      }
    }
  }, [course, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async () => {
    if (!formData.catalogue) {
      alert("Please select a Catalogue first.");
      return;
    }
    setIsSaving(true);
    // The onSave function (passed as a prop) will handle the API call
    await onSave(formData);
    setIsSaving(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{course ? 'Edit Course' : 'Add New Course'}</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="title">Course Title</label>
            <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required />
          </div>

          {/* New Catalogue Dropdown */}
          <div className="form-group">
            <label htmlFor="catalogue">Parent Catalogue (Category)</label>
            <select
              id="catalogue"
              name="catalogue"
              value={formData.catalogue}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                {isLoadingCatalogues ? "Loading Catalogues..." : "Select a Catalogue"}
              </option>
              {catalogues.map(cat => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea id="description" name="description" rows="4" value={formData.description} onChange={handleChange}></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="instructor">Instructor</label>
            <input type="text" id="instructor" name="instructor" value={formData.instructor} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label htmlFor="thumbnail">Thumbnail Image URL</label>
            <input type="text" id="thumbnail" name="thumbnail" value={formData.thumbnail} onChange={handleChange} placeholder="https://example.com/image.jpg" />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="subscriptionTier">Course Base Tier</label>
              <select id="subscriptionTier" name="subscriptionTier" value={formData.subscriptionTier} onChange={handleChange}>
                <option value="Free">Free</option>
                <option value="Plus">Plus</option>
                <option value="Premium">Premium</option>
              </select>
              <small style={{ color: '#666', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>
                Individual modules can still be made free.
              </small>
            </div>
            <div className="form-group">
              <label htmlFor="level">Difficulty Level</label>
              <select id="level" name="level" value={formData.level} onChange={handleChange}>
                <option value="All Levels">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                name="isPublished"
                checked={formData.isPublished}
                onChange={handleChange}
                style={{ width: 'auto' }}
              />
              Publish this course
            </label>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-save" onClick={handleSave} disabled={isSaving || isLoadingCatalogues}>
            {isSaving ? 'Saving...' : 'Save Course'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseEditModal;