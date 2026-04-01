import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';
import './ManageOrders.css';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiService.getAllOrders();
      if (response.success) {
        setOrders(response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch orders');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await apiService.updateOrderStatus(orderId, { status: newStatus });
      if (response.success) {
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order._id === orderId ? { ...order, orderStatus: newStatus } : order
          )
        );
        // Consider adding a success toast notification here
      } else {
        throw new Error(response.message || 'Failed to update status');
      }
    } catch (err) {
      alert(`Error updating status: ${err.message}`);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(price);
  };

  if (isLoading) {
    return <div className="loading-spinner">Loading all orders...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="manage-orders-container">
      <div className="header-section">
        <h2>Manage Store Orders</h2>
        <p>Total Orders: {orders.length}</p>
      </div>

      <div className="orders-table-wrapper">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Shipping Address</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order._id}>
                  <td data-label="Order ID">
                    <small>{order._id}</small>
                  </td>
                  <td data-label="Customer">
                    {order.user?.fullName || 'N/A'}<br />
                    <small>{order.user?.email || 'N/A'}</small>
                  </td>
                  <td data-label="Date">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td data-label="Shipping Address" className="address-cell">
                    {order.shippingAddress.address}<br />
                    {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}<br />
                    <small>Ph: {order.shippingAddress.phoneNo}</small>
                  </td>
                  <td data-label="Total">{formatPrice(order.totalAmount)}</td>
                  <td data-label="Payment">
                    <span className={`status-badge status-${order.paymentStatus}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td data-label="Status">
                    <select
                      value={order.orderStatus}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className={`status-select status-bg-${order.orderStatus.toLowerCase()}`}
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-results">No orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageOrders;