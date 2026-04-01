import React from 'react';
import { motion } from 'framer-motion';
import './PaymentSuccess.css';

const PaymentSuccess = ({ isOpen, onClose, paymentData }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleDownloadInvoice = () => {
    // In a real application, this would generate and download an actual invoice
    alert('Invoice download feature will be implemented in the backend');
  };

  const handleTrackOrder = () => {
    // In a real application, this would redirect to order tracking
    alert('Order tracking feature will be implemented');
  };

  if (!paymentData) return null;

  return (
    <motion.div
      className="payment-success-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="payment-success-modal"
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 50 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="success-header">
          <motion.div
            className="success-icon"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', damping: 10 }}
          >
            <i className="fas fa-check-circle"></i>
          </motion.div>
          <h2>Payment Successful! 🙏</h2>
          <p>Thank you for your purchase. Your order has been confirmed.</p>
        </div>

        <div className="success-content">
          <div className="order-details">
            <h3>Order Details</h3>
            <div className="detail-row">
              <span>Order ID:</span>
              <span className="order-id">{paymentData.orderId}</span>
            </div>
            <div className="detail-row">
              <span>Payment ID:</span>
              <span className="payment-id">{paymentData.paymentId}</span>
            </div>
            <div className="detail-row">
              <span>Total Amount:</span>
              <span className="amount">{formatPrice(paymentData.amount)}</span>
            </div>
            <div className="detail-row">
              <span>Payment Status:</span>
              <span className="status success">Completed</span>
            </div>
          </div>

          <div className="shipping-details">
            <h3>Shipping Address</h3>
            <div className="address">
              <p><strong>{paymentData.customer.name}</strong></p>
              <p>{paymentData.customer.address}</p>
              <p>{paymentData.customer.city}, {paymentData.customer.state} - {paymentData.customer.pincode}</p>
              <p>Phone: {paymentData.customer.phone}</p>
              <p>Email: {paymentData.customer.email}</p>
            </div>
          </div>

          <div className="order-items">
            <h3>Items Ordered</h3>
            <div className="items-list">
              {paymentData.items.map((item) => (
                <div key={item.id} className="item-row">
                  <div className="item-info">
                    <h4>{item.name}</h4>
                    <span>Qty: {item.quantity}</span>
                  </div>
                  <span className="item-price">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="success-actions">
            <motion.button
              className="action-btn primary"
              onClick={handleDownloadInvoice}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <i className="fas fa-download"></i>
              Download Invoice
            </motion.button>
            <motion.button
              className="action-btn secondary"
              onClick={handleTrackOrder}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <i className="fas fa-truck"></i>
              Track Order
            </motion.button>
            <motion.button
              className="action-btn outline"
              onClick={onClose}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <i className="fas fa-home"></i>
              Continue Shopping
            </motion.button>
          </div>

          <div className="success-message">
            <p>
              <i className="fas fa-info-circle"></i>
              You will receive a confirmation email shortly with your order details and tracking information.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PaymentSuccess;
















