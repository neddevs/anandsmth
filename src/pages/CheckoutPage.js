import React, { useEffect, useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import useRazorpay from '../hooks/useRazorpay';
import './CheckoutPage.css';

const CheckoutPage = () => {
  useRazorpay(); // Load Razorpay script
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    address: '', city: '', state: '', postalCode: '', country: 'India', phoneNo: ''
  });
  // --- ADD gstNumber TO STATE ---
  const [gstNumber, setGstNumber] = useState(''); // New state for GST
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const cartTotal = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);

  const handleAddressChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    try {
      // 1. Create the order in our database
      const orderData = {
        orderItems: cartItems.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.images[0],
          product: item._id
        })),
        shippingAddress,
        gstNumber: gstNumber, // <-- Include the new field in the payload
      };

      const orderResponse = await apiService.createStoreOrder(orderData);
      if (!orderResponse.success) throw new Error(orderResponse.message);

      const createdOrder = orderResponse.data;

      // 2. Create a Razorpay order
      const razorpayOrderResponse = await apiService.createRazorpayOrder({
        amount: createdOrder.totalAmount,
        currency: 'INR',
        entityId: createdOrder._id,
        entityType: 'order'
      });
      if (!razorpayOrderResponse.success) throw new Error(razorpayOrderResponse.message);

      const razorpayOrder = razorpayOrderResponse.data;

      // 3. Open Razorpay Checkout
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'Anandmaya Store',
        order_id: razorpayOrder.id,
        handler: async function (response) {
          // 4. Verify the payment
          const verificationData = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            entityId: createdOrder._id,
            entityType: 'order'
          };
          await apiService.verifyRazorpayPayment(verificationData);
          clearCart();
          // Redirect to the user's order history page on success
          navigate('/dashboard/orders');
        },
        prefill: { name: user.fullName, email: user.email, contact: shippingAddress.phoneNo },
        theme: { color: '#8B4513' }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
      
      paymentObject.on('payment.failed', function (response) {
        setError(`Payment failed: ${response.error.description}`);
        setIsProcessing(false);
      });

    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [])

  if (cartItems.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem', minHeight: '60vh' }}>
        <h2>Your cart is empty.</h2>
        <Link to="/bhakti-store" className="btn btn-primary">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-page-content">
        <h1>Checkout</h1>
        <div className="checkout-layout">
          <form onSubmit={handleSubmit} className="shipping-form">
            <h3>Shipping Address</h3>
            <input name="address" placeholder="Address" onChange={handleAddressChange} required />
            <input name="city" placeholder="City" onChange={handleAddressChange} required />
            <input name="state" placeholder="State" onChange={handleAddressChange} required />
            <input name="postalCode" placeholder="Postal Code" onChange={handleAddressChange} required />
            <input name="country" value="India" readOnly />
            <input name="phoneNo" type="tel" placeholder="Phone Number" onChange={handleAddressChange} required />
            
            {/* --- ADD NEW GST INPUT FIELD --- */}
            <div className="gst-input-container">
              <label htmlFor="gstNumber">GST Number (Optional)</label>
              <input 
                id="gstNumber"
                name="gstNumber" 
                type="text" 
                placeholder="e.g., 22AAAAA0000A1Z5"
                value={gstNumber}
                onChange={(e) => setGstNumber(e.target.value)} 
              />
            </div>
            {/* ------------------------------- */}
            
            <button type="submit" disabled={isProcessing}>
              {isProcessing ? 'Processing...' : `Pay ₹${cartTotal.toFixed(2)}`}
            </button>
            {error && <p className="error-message">{error}</p>}
          </form>
          <div className="order-summary">
            <h3>Order Summary</h3>
            {cartItems.map(item => (
              <div key={item._id} className="summary-item">
                <span>{item.name} x {item.quantity}</span>
                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <hr />
            <div className="summary-total">
              <strong>Total</strong>
              <strong>₹{cartTotal.toFixed(2)}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;