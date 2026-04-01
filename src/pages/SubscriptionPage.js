import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import useRazorpay from '../hooks/useRazorpay';
import apiService from '../services/api';
import './SubscriptionPage.css';

// Define plans on the frontend for display purposes
const subscriptionPlans = [
  {
    id: 'plus',
    name: 'Plus Plan',
    price: 499,
    duration: '6 Months Access',
    features: [
      'Access to all "Plus" tier courses',
      'Downloadable course notes',
      'Priority email support',
      'Access to community forums',
    ],
    highlight: false,
  },
  {
    id: 'premium',
    name: 'Premium Plan',
    price: 2499,
    duration: 'Lifetime Access',
    features: [
      '<strong>Everything in Plus, plus:</strong>',
      'Access to all "Premium" tier courses',
      'One-on-one sessions with instructors',
      'Exclusive access to live Q&A sessions',
      'Lifetime access to all future courses',
    ],
    highlight: true,
  },
];

const SubscriptionPage = () => {
  useRazorpay(); // Load the Razorpay script
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(null); // Will hold the ID of the plan being processed
  const [error, setError] = useState(null);

  const handleSubscribe = async (planId) => {
    setIsProcessing(planId);
    setError(null);

    const plan = subscriptionPlans.find(p => p.id === planId);
    if (!plan) {
      setError('Selected plan is not valid.');
      setIsProcessing(null);
      return;
    }
    
    try {
      // Step 1: Create a Razorpay order from our backend
      const razorpayOrderResponse = await apiService.createRazorpayOrder({
        amount: plan.price,
        entityId: plan.id,
        entityType: 'subscription',
      });

      if (!razorpayOrderResponse.success) {
        throw new Error(razorpayOrderResponse.message || 'Failed to create payment order.');
      }
      const razorpayOrder = razorpayOrderResponse.data;

      // Step 2: Open the Razorpay Checkout modal
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'Anandmaya Subscription',
        description: `Payment for ${plan.name}`,
        image: '/images/logo.png', // URL to your logo
        order_id: razorpayOrder.id,
        handler: async function (response) {
          // Step 3: Handle successful payment by verifying it on the backend
          try {
            const verificationData = {
              ...response,
              entityId: plan.id,
              entityType: 'subscription',
            };
            
            const verificationResponse = await apiService.verifyRazorpayPayment(verificationData);

            if (verificationResponse.success) {
              // Payment successful! Redirect user to their courses or dashboard
              alert('Subscription successful! You now have access to new content.');
              navigate('/dashboard/courses');
            } else {
              throw new Error(verificationResponse.message || 'Payment verification failed.');
            }
          } catch (verifyError) {
            setError(verifyError.message);
          }
        },
        prefill: {
          name: user.fullName,
          email: user.email,
        },
        notes: {
          planId: plan.id,
          userId: user._id,
        },
        theme: {
          color: '#8B4513',
        },
        modal: {
          ondismiss: function () {
            // This function is called when the user closes the modal without paying
            setIsProcessing(null);
          },
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
      paymentObject.on('payment.failed', function (response) {
        setError(`Payment failed: ${response.error.description}`);
        setIsProcessing(null);
      });

    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
      setIsProcessing(null);
    }
  };

  return (
    <div className="subscription-page">
      <div className="container">
        <div className="section-header">
          <h2>Choose Your Plan</h2>
          <p>Unlock your spiritual potential with our subscription plans.</p>
        </div>
        {error && <p className="error-message">{error}</p>}
        <div className="plans-container">
          {subscriptionPlans.map(plan => (
            <div key={plan.id} className={`plan-card ${plan.highlight ? 'highlight' : ''}`}>
              {plan.highlight && <div className="highlight-badge">Recommended</div>}
              <h3>{plan.name}</h3>
              <p className="price">₹{plan.price}</p>
              <p className="duration">{plan.duration}</p>
              <ul className="features-list">
                {plan.features.map((feature, index) => (
                  <li key={index} dangerouslySetInnerHTML={{ __html: feature }}></li>
                ))}
              </ul>
              <button 
                className="btn-subscribe" 
                onClick={() => handleSubscribe(plan.id)} 
                disabled={isProcessing}
              >
                {isProcessing === plan.id ? 'Processing...' : 'Subscribe Now'}
              </button>
            </div>
          ))}
        </div>
        <div className="free-plan-promo">
          <h4>Looking for free content?</h4>
          <p>We have a wide range of free courses to get you started on your spiritual journey. <Link to="/bhakti-yoga">Explore Free Courses</Link></p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;