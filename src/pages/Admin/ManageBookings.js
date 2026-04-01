import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';
import EditBookingModal from './EditBookingModal'; // Import the modal
import './ManageBookings.css'; 

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  // State to manage the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Function to fetch bookings for a specific page
  const fetchAllBookings = async (page) => {
    setIsLoading(true);
    // Don't clear old errors immediately, in case saving fails
    // setError(null); 
    try {
      const response = await apiService.getAllBookings({ page, limit: 10 });
      if (response.success) {
        setBookings(response.data);
        setPagination(response.pagination);
      } else {
        throw new Error(response.message || 'Failed to fetch bookings');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // console.log("HEhe", bookings)
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Fetch bookings when the component mounts or when the page changes
  useEffect(() => {
    fetchAllBookings(currentPage);
  }, [currentPage]);

  // Handler functions for the modal
  const handleOpenModal = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };

  const handleSaveBooking = async (bookingId, updateData) => {
    setError(null); // Clear previous errors before trying to save
    try {
      const response = await apiService.updateBookingStatus(bookingId, updateData);
      if (response.success) {
        // Refresh the data on the current page to show the changes
        await fetchAllBookings(currentPage);
        handleCloseModal();
        // Here you can add a success toast notification, e.g., toast.success('Booking updated!');
      } else {
        throw new Error(response.message || 'Failed to save changes');
      }
    } catch (err) {
      // If saving fails, we can display the error
      // The modal will remain open for the user to try again
      alert(`Error: ${err.message}`); // Or set an error state within the modal
    }
  };

  // Handler for pagination
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (isLoading) {
    return <div className="loading-spinner">Loading all bookings...</div>;
  }

  // Display a prominent error message if fetching fails
  if (error && bookings.length === 0) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="manage-bookings-container">
      <div className="header-section">
        <h2>Manage Pooja Bookings</h2>
        <p>Total Bookings: {pagination.totalBookings || 0}</p>
      </div>

      <div className="bookings-table-wrapper">
        <table className="bookings-table">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Devotee</th>
              <th>Pooja Type</th>
              <th>Date & Time</th>
              <th>Special Request</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <tr key={booking.bookingId}>
                  <td data-label="Booking ID">{booking.bookingId}</td>
                  <td data-label="Devotee">
                    {booking.devoteeName}<br />
                    {booking.phone}<br />
                    {/* {console.log("ehe: ", booking.devoteeName)} */}
                    <small>{booking.email}</small>
                  </td>
                  <td data-label="Pooja Details">
                    {booking.poojaType} <br />
                    <small>{booking.temple}</small> <br />
                  </td>
                  <td data-label="Date & Time">
                    {booking.poojaDate}<br />
                    <small>{booking.poojaTime}</small>
                  </td>
                  <td data-label="Special Request" className="special-request-cell">
                    <div className="scrollable-text">
                      {booking.specialRequests || 'None'}
                    </div>
                  </td>
                  <td data-label="Payment">
                    <span className={`status-badge status-${booking.paymentStatus}`}>
                      {booking.paymentStatus}
                    </span>
                  </td>
                  <td data-label="Status">
                    <span className={`status-badge status-${booking.status || 'pending'}`}>
                      {booking.status || 'pending'}
                    </span>
                  </td>
                  <td data-label="Actions">
                    <button className="action-btn" onClick={() => handleOpenModal(booking)}>
                      <i className="fas fa-edit"></i> Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-results">No bookings found for this page.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pagination.totalPages > 1 && (
        <div className="pagination-controls">
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={!pagination.hasPrev}>
            Previous
          </button>
          <span>
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <button onClick={() => handlePageChange(currentPage + 1)} disabled={!pagination.hasNext}>
            Next
          </button>
        </div>
      )}

      {/* Render the Modal. It will only be visible if isModalOpen is true */}
      <EditBookingModal
        booking={selectedBooking}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveBooking}
      />
    </div>
  );
};

export default ManageBookings;