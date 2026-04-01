import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../../services/api';
import './MyBookings.css';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await apiService.getUserBookings();
        if (response.success) {
          setBookings(response.data);
        } else {
          throw new Error(response.message || 'Failed to fetch bookings');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (isLoading) {
    return <div className="loading-spinner">Loading your bookings...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="my-bookings-container">
      <h2>My Pooja Bookings</h2>
      {bookings.length === 0 ? (
        <div className="no-bookings">
          <p>You have not booked any poojas yet.</p>
          <Link to="/online-pooja" className="btn btn-primary">Book a Pooja Now</Link>
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map((booking) => (
            <div key={booking.bookingId} className="booking-card">
              <div className="card-header">
                <h3>{booking.poojaType}</h3>
                <span className={`status-badge status-${booking.paymentStatus}`}>
                  {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                </span>
              </div>
              <div className="card-body">
                <p><strong>Booking ID:</strong> {booking.bookingId}</p>
                <p><strong>Temple:</strong> {booking.temple}</p>
                <p><strong>Date:</strong> {booking.poojaDate}</p>
                <p><strong>Time:</strong> {booking.poojaTime}</p>
              </div>
              <div className="card-footer">
                <p>Booked on: {new Date(booking.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;