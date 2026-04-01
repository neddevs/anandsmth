// Razorpay Configuration
// Replace these with your actual Razorpay credentials

export const RAZORPAY_CONFIG = {
  // Test credentials - Using a working Razorpay test key for development
  keyId: process.env.REACT_APP_RAZORPAY_KEY_ID, // Razorpay test key
  // keySecret: 'your_secret_key_here', // Keep this on backend only
  
  // Production credentials (uncomment when going live)
  // keyId: 'rzp_live_YOUR_LIVE_KEY_ID',
  // keySecret: 'your_live_secret_key_here',
  
  // Currency and other settings
  currency: 'INR',
  name: 'Anandmaya',
  description: 'Spiritual Items Purchase',
  image: '/logo192.png', // Your logo URL
  
  // Theme colors - Updated to match spiritual theme
  theme: {
    color: '#FFD700' // Golden color for spiritual theme
  },
  
  // Modal settings
  modal: {
    ondismiss: () => {
      console.log('Payment modal dismissed');
    }
  }
};

// Backend API endpoints (replace with your actual backend URLs)
export const API_ENDPOINTS = {
  // For development, these will be mock endpoints
  // In production, replace with your actual backend URLs
  createOrder: 'https://your-backend.com/api/orders/create',
  verifyPayment: 'https://your-backend.com/api/payments/verify',
  getOrderDetails: 'https://your-backend.com/api/orders/:orderId'
};

// Mock API functions for development
export const mockAPI = {
  createOrder: async (orderData) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Generate a realistic order ID format
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      success: true,
      order: {
        id: orderId,
        amount: orderData.amount,
        currency: orderData.currency,
        status: 'created',
        created_at: new Date().toISOString(),
        receipt: orderData.receipt
      }
    };
  },
  
  verifyPayment: async (paymentData) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock verification - in real app, this would verify with Razorpay
    return {
      success: true,
      verified: true,
      orderId: paymentData.razorpay_order_id,
      paymentId: paymentData.razorpay_payment_id,
      signature: paymentData.razorpay_signature,
      verified_at: new Date().toISOString()
    };
  }
};

// Real Razorpay integration functions (for production)
export const razorpayAPI = {
  createOrder: async (orderData) => {
    try {
      // In production, this would call your backend API
      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create order');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Order creation failed:', error);
      throw error;
    }
  },
  
  verifyPayment: async (paymentData) => {
    try {
      // In production, this would call your backend API
      const response = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData)
      });
      
      if (!response.ok) {
        throw new Error('Payment verification failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Payment verification failed:', error);
      throw error;
    }
  }
};

export default RAZORPAY_CONFIG;





