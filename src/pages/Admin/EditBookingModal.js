import React, { useState, useEffect } from 'react';
import './EditBookingModal.css';

const EditBookingModal = ({ booking, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    status: '',
    liveStreamLink: '',
    notes: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // When the booking prop changes (i.e., a new booking is selected), update the form data
  useEffect(() => {
    if (booking) {
      setFormData({
        status: booking.status || 'confirmed',
        liveStreamLink: booking.liveStreamLink || '',
        notes: booking.notes || ''
      });
    }
  }, [booking]);

  if (!isOpen || !booking) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await onSave(booking.bookingId, formData);
    setIsSaving(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Edit Booking: {booking.bookingId}</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="status">Booking Status</label>
            <select name="status" id="status" value={formData.status} onChange={handleChange}>
              <option value="pending">Pending Payment</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="liveStreamLink">Live Stream Link</label>
            <input
              type="text"
              name="liveStreamLink"
              id="liveStreamLink"
              value={formData.liveStreamLink}
              onChange={handleChange}
              placeholder="https://youtube.com/live/..."
            />
          </div>
          <div className="form-group">
            <label htmlFor="notes">Admin Notes (not visible to user)</label>
            <textarea
              name="notes"
              id="notes"
              rows="4"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add any internal notes here..."
            ></textarea>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-save" onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditBookingModal;