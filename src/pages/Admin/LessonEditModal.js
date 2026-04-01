import React, { useState, useEffect } from 'react';
// We can re-use the same modal CSS
import './ProductEditModal.css';

const LessonEditModal = ({ lesson, isOpen, onClose, onSave, moduleLessonsCount }) => {
  const getInitialState = () => ({
    title: '',
    order: moduleLessonsCount + 1,
    type: 'Video',
    videoUrl: '',
    notesUrl: '',
    textContent: '',
    duration: '',
  });

  const [formData, setFormData] = useState(getInitialState());
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (isOpen) {
      if (lesson) {
        // Edit mode
        setFormData({
          title: lesson.title || '',
          order: lesson.order || 1,
          type: lesson.type || 'Video',
          videoUrl: lesson.videoUrl || '',
          notesUrl: lesson.notesUrl || '',
          textContent: lesson.textContent || '',
          duration: lesson.duration || '',
        });
      } else {
        // Add mode
        setFormData(getInitialState());
      }
    }
  }, [lesson, isOpen, moduleLessonsCount]);

  if (!isOpen) return null;

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
          <h3>{lesson ? 'Edit Lesson' : 'Add New Lesson'}</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <div className="form-row">
            <div className="form-group" style={{ flex: 3 }}>
              <label htmlFor="title">Lesson Title</label>
              <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="order">Order</label>
              <input type="number" id="order" name="order" value={formData.order} onChange={handleChange} />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="type">Lesson Type</label>
            <select id="type" name="type" value={formData.type} onChange={handleChange}>
              <option value="Video">Video</option>
              <option value="PDF">PDF</option>
              <option value="Text">Text</option>
            </select>
          </div>

          {formData.type === 'Video' && (
            <div className="form-group">
              <label htmlFor="videoUrl">Video URL</label>
              <input type="text" id="videoUrl" name="videoUrl" value={formData.videoUrl} onChange={handleChange} placeholder="e.g., YouTube or Vimeo URL" />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="notesUrl">Notes/PDF URL (Optional)</label>
            <input type="text" id="notesUrl" name="notesUrl" value={formData.notesUrl} onChange={handleChange} placeholder="URL to a downloadable PDF" />
          </div>

          {formData.type === 'Text' && (
            <div className="form-group">
              <label htmlFor="textContent">Text Content</label>
              <textarea id="textContent" name="textContent" rows="6" value={formData.textContent} onChange={handleChange}></textarea>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="duration">Duration (in minutes, Optional)</label>
            <input type="number" id="duration" name="duration" value={formData.duration} onChange={handleChange} />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-save" onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Lesson'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LessonEditModal;