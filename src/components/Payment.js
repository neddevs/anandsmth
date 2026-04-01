import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RAZORPAY_CONFIG, mockAPI } from '../config/razorpay';
import './Payment.css';

const Payment = ({ isOpen, onClose, cartItems, total, onPaymentSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    state: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  // Use configuration from config file

  useEffect(() => {
    // Load Razorpay script
    const loadRazorpayScript = () => {
      return new Promise((resolve, reject) => {
        if (window.Razorpay) {
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Razorpay script'));
        document.body.appendChild(script);
      });
    };

    loadRazorpayScript()
      .then(() => {
        setRazorpayLoaded(true);
        setPaymentError('');
      })
      .catch(error => {
        console.error('Razorpay script loading failed:', error);
        setPaymentError('Payment system is not available. Please refresh the page and try again.');
      });

    return () => {
      // Clean up if needed
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!isValidEmail(formData.email)) newErrors.email = 'Please enter a valid email';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!isValidPhone(formData.phone)) newErrors.phone = 'Please enter a valid phone number';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';
    else if (!isValidPincode(formData.pincode)) newErrors.pincode = 'Please enter a valid pincode';
    if (!formData.state.trim()) newErrors.state = 'State is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhone = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const isValidPincode = (pincode) => {
    const pincodeRegex = /^[1-9][0-9]{5}$/;
    return pincodeRegex.test(pincode);
  };

  const generateOrderId = () => {
    return `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const createOrder = async (orderData) => {
    try {
      const response = await mockAPI.createOrder(orderData);
      return response.order;
    } catch (error) {
      console.error('Order creation failed:', error);
      throw error;
    }
  };

  const verifyPayment = async (paymentData) => {
    try {
      const response = await mockAPI.verifyPayment(paymentData);
      return response;
    } catch (error) {
      console.error('Payment verification failed:', error);
      throw error;
    }
  };

  const handlePayment = async () => {
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    try {
      // Check if Razorpay is loaded
      if (!window.Razorpay) {
        throw new Error('Razorpay SDK not loaded. Please refresh the page and try again.');
      }

      // Create order
      const orderData = {
        amount: total * 100, // Razorpay expects amount in paise
        currency: 'INR',
        receipt: generateOrderId()
      };

      const order = await createOrder(orderData);

      // Razorpay options
      const options = {
        key: RAZORPAY_CONFIG.keyId,
        amount: order.amount,
        currency: order.currency,
        name: RAZORPAY_CONFIG.name,
        description: RAZORPAY_CONFIG.description,
        image: RAZORPAY_CONFIG.image,
        order_id: order.id,
        handler: async (response) => {
          try {
            console.log('Payment response:', response);
            
            // Verify payment
            const verification = await verifyPayment(response);
            
            if (verification.success) {
              // Payment successful
              onPaymentSuccess({
                orderId: verification.orderId,
                paymentId: verification.paymentId,
                amount: total,
                items: cartItems,
                customer: formData
              });
              onClose();
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            alert('Payment verification failed. Please try again.');
            setIsProcessing(false);
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone
        },
        notes: {
          address: formData.address,
          city: formData.city,
          pincode: formData.pincode,
          state: formData.state
        },
        theme: RAZORPAY_CONFIG.theme,
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          }
        },
        retry: {
          enabled: true,
          max_count: 3
        },
        // Additional options for better UX
        timeout: 300,
        remember_customer: false,
        readonly: {
          email: false,
          contact: false
        }
      };

      const razorpay = new window.Razorpay(options);
      
      // Add event listeners for better error handling
      razorpay.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error);
        alert(`Payment failed: ${response.error.description}`);
        setIsProcessing(false);
      });
      
      razorpay.on('payment.authorized', function (response) {
        console.log('Payment authorized:', response);
      });
      
      razorpay.on('payment.captured', function (response) {
        console.log('Payment captured:', response);
      });
      
      // Open Razorpay modal
      razorpay.open();
      
      // Add timeout fallback
      setTimeout(() => {
        if (isProcessing) {
          console.log('Payment timeout - user may have closed the modal');
          setIsProcessing(false);
        }
      }, 300000); // 5 minutes timeout

    } catch (error) {
      console.error('Payment error:', error);
      alert(`Payment failed: ${error.message}`);
      setIsProcessing(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="payment-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="payment-modal"
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className="payment-header">
              <h2>Complete Your Purchase</h2>
              <button className="close-btn" onClick={onClose}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="payment-content">
              <div className="payment-form">
                <h3>Shipping Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Full Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={errors.name ? 'error' : ''}
                      placeholder="Enter your full name"
                    />
                    {errors.name && <span className="error-message">{errors.name}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={errors.email ? 'error' : ''}
                      placeholder="Enter your email"
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={errors.phone ? 'error' : ''}
                      placeholder="Enter your phone number"
                    />
                    {errors.phone && <span className="error-message">{errors.phone}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="pincode">Pincode *</label>
                    <input
                      type="text"
                      id="pincode"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      className={errors.pincode ? 'error' : ''}
                      placeholder="Enter pincode"
                    />
                    {errors.pincode && <span className="error-message">{errors.pincode}</span>}
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="address">Address *</label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={errors.address ? 'error' : ''}
                    placeholder="Enter your complete address"
                    rows="3"
                  ></textarea>
                  {errors.address && <span className="error-message">{errors.address}</span>}
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city">City *</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={errors.city ? 'error' : ''}
                      placeholder="Enter your city"
                    />
                    {errors.city && <span className="error-message">{errors.city}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="state">State *</label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className={errors.state ? 'error' : ''}
                      placeholder="Enter your state"
                    />
                    {errors.state && <span className="error-message">{errors.state}</span>}
                  </div>
                </div>
              </div>
              
              <div className="order-summary">
                <h3>Order Summary</h3>
                <div className="order-items">
                  {cartItems.map((item) => (
                    <div key={item.id} className="order-item">
                      <div className="item-info">
                        <h4>{item.name}</h4>
                        <span>Qty: {item.quantity}</span>
                      </div>
                      <span className="item-price">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="order-total">
                  <div className="total-row">
                    <span>Subtotal:</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <div className="total-row">
                    <span>Shipping:</span>
                    <span>FREE</span>
                  </div>
                  <div className="total-row final-total">
                    <span>Total:</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
                
                {paymentError && (
                  <div className="payment-error">
                    <i className="fas fa-exclamation-triangle"></i>
                    {paymentError}
                  </div>
                )}
                
                {/* Test Mode Indicator */}
                <div className="test-mode-indicator">
                  <i className="fas fa-flask"></i>
                  <span>Test Mode - Use test cards for payment</span>
                </div>
                
                <motion.button
                  className="pay-now-btn"
                  onClick={handlePayment}
                  disabled={isProcessing || !razorpayLoaded || paymentError}
                  whileHover={!isProcessing && razorpayLoaded && !paymentError ? { scale: 1.02 } : {}}
                  whileTap={!isProcessing && razorpayLoaded && !paymentError ? { scale: 0.98 } : {}}
                >
                  {isProcessing ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      Processing...
                    </>
                  ) : !razorpayLoaded ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      Loading Payment...
                    </>
                  ) : paymentError ? (
                    <>
                      <i className="fas fa-exclamation-triangle"></i>
                      Payment Unavailable
                    </>
                  ) : (
                    <>
                      <i className="fas fa-credit-card"></i>
                      Pay {formatPrice(total)}
                    </>
                  )}
                </motion.button>
                
                <div className="payment-methods">
                  <p>We accept:</p>
                  <div className="payment-icons">
                    <i className="fab fa-cc-visa"></i>
                    <i className="fab fa-cc-mastercard"></i>
                    <i className="fab fa-cc-amex"></i>
                    <i className="fas fa-mobile-alt"></i>
                    <i className="fas fa-university"></i>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Payment;
