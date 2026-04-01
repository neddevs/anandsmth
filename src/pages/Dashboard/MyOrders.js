import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../../services/api';
import './MyOrders.css'; // We will create this next

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await apiService.getMyOrders();
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

    fetchOrders();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(price);
  };

  if (isLoading) {
    return <div className="loading-spinner">Loading your orders...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="my-orders-container">
      <h2>My Store Orders</h2>
      {orders.length === 0 ? (
        <div className="no-orders">
          <p>You have not placed any orders yet.</p>
          <Link to="/bhakti-store" className="btn btn-primary">Shop Now</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-card-header">
                <div>
                  <h4>Order #{order._id.substring(0, 8)}...</h4>
                  <p>Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`status-badge status-${order.orderStatus.toLowerCase()}`}>
                  {order.orderStatus}
                </span>
              </div>
              <div className="order-card-body">
                {order.orderItems.map(item => (
                  <div key={item.product} className="order-item">
                    <img src={item.image} alt={item.name} className="item-image" />
                    <div className="item-details">
                      <p className="item-name">{item.name}</p>
                      <p className="item-qty">Quantity: {item.quantity}</p>
                    </div>
                    <p className="item-price">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
              <div className="order-card-footer">
                <strong>Total: {formatPrice(order.totalAmount)}</strong>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;