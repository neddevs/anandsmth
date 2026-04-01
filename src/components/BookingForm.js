import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';
import useRazorpay from '../hooks/useRazorpay';
import { poojaTypesData, getPoojaById } from '../config/poojaConfig';
import './BookingForm.css';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const BookingForm = ({ selectedPooja }) => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  useRazorpay(); // Loads the Razorpay script when the component mounts

  const [formData, setFormData] = useState({
    poojaType: '',
    temple: '',
    poojaDate: '',
    poojaTime: '',
    devoteeName: '',
    email: '',
    phone: '',
    specialRequests: '',
    agreeTerms: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Pre-fill form when a pooja is selected or user data is available
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      poojaType: selectedPooja ? selectedPooja.id : prev.poojaType,
      devoteeName: user?.fullName || prev.devoteeName,
      email: user?.email || prev.email,
      phone: user?.phone || prev.phone,
    }));
  }, [selectedPooja, user]);

  // Set minimum date for date picker
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('pooja-date');
    if (dateInput) {
      dateInput.min = today;
    }
  }, []);

  const poojaTypesOptions = poojaTypesData.map(p => ({
    value: p.id,
    label: `${p.title} - ₹${p.price}`
  }));

  const temples = [
    { value: 'tirupati', label: 'Tirupati Balaji Temple, Andhra Pradesh' },
    { value: 'varanasi', label: 'Kashi Vishwanath Temple, Varanasi' },
    { value: 'jagannath', label: 'Jagannath Temple, Puri' },
    { value: 'somnath', label: 'Somnath Temple, Gujarat' },
    { value: 'golden-temple', label: 'Golden Temple, Amritsar' },
    { value: 'meenakshi', label: 'Meenakshi Temple, Madurai' },
    { value: 'rameshwaram', label: 'Ramanathaswamy Temple, Rameshwaram' },
    { value: 'badrinath', label: 'Badrinath Temple, Uttarakhand' },
    { value: 'kedarnath', label: 'Kedarnath Temple, Uttarakhand' },
    { value: 'gangotri', label: 'Gangotri Temple, Uttarakhand' },
    { value: 'yamunotri', label: 'Yamunotri Temple, Uttarakhand' },
    { value: 'vaishno-devi', label: 'Vaishno Devi Temple, Jammu' },
    { value: 'siddhivinayak', label: 'Siddhivinayak Temple, Mumbai' },
    { value: 'shirdi', label: 'Shirdi Sai Baba Temple, Maharashtra' },
    { value: 'sabarimala', label: 'Sabarimala Temple, Kerala' },
    { value: 'bagalamukhi', label: 'Maa Bagalamukhi Temple, Haridwar' },
    { value: 'kalighat', label: 'Kalighat Temple, Kolkata' },
    { value: 'vindhyvasini', label: 'Maa Vindhyvasini' },
    { value: 'loknath', label: 'Loknath Temple, Puri' },
    { value: 'lingaraj', label: 'Lingaraj Temple, Bhubaneswar' }
  ];

  const timeSlots = [
    { value: '06:00', label: '6:00 AM' },
    { value: '08:00', label: '8:00 AM' },
    { value: '10:00', label: '10:00 AM' },
    { value: '12:00', label: '12:00 PM' },
    { value: '14:00', label: '2:00 PM' },
    { value: '16:00', label: '4:00 PM' },
    { value: '18:00', label: '6:00 PM' },
    { value: '20:00', label: '8:00 PM' }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.poojaType) newErrors.poojaType = 'Please select a pooja type';
    if (!formData.temple) newErrors.temple = 'Please select a temple';
    if (!formData.poojaDate) newErrors.poojaDate = 'Please select a date';
    if (!formData.poojaTime) newErrors.poojaTime = 'Please select a time';
    if (!formData.devoteeName.trim()) newErrors.devoteeName = 'Please enter your name';
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Please enter a valid email';
    if (!formData.phone.trim() || !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s/g, ''))) newErrors.phone = 'Please enter a valid phone number';
    if (!formData.agreeTerms) newErrors.agreeTerms = 'Please agree to the terms and conditions';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (!isLoggedIn) {
      toast.error("Please log in to book a pooja.");
      // showErrorMessage("Please log in to book a pooja.");
      return;
    }
    setIsSubmitting(true);
    try {
      const bookingResponse = await apiService.createBooking({
        devoteeName: formData.devoteeName, email: formData.email, phone: formData.phone,
        poojaType: formData.poojaType, temple: formData.temple, poojaDate: formData.poojaDate,
        poojaTime: formData.poojaTime, specialRequests: formData.specialRequests,
      });

      if (bookingResponse.success) {
        initiatePayment(bookingResponse.data);
      } else {
        throw new Error(bookingResponse.message || 'Booking creation failed.');
      }
    } catch (error) {
      console.error('Booking submission error:', error);
      setIsSubmitting(false);
      toast.error(error.message);
    }
  };

  const initiatePayment = async (bookingData) => {
    const poojaDetails = getPoojaById(bookingData.poojaType);
    if (!poojaDetails) {
      // showErrorMessage("Could not find pooja details for payment.");
      toast.error("Could not find pooja details for payment.");
      setIsSubmitting(false);
      return;
    }

    try {
      const orderResponse = await apiService.createRazorpayOrder({
        amount: bookingData.amount,
        currency: 'INR',
        entityId: bookingData.bookingId,
        entityType: 'booking'
      });

      if (!orderResponse.success) {
        throw new Error(orderResponse.message || 'Failed to create payment order.');
      }

      const order = orderResponse.data;
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'Anandmaya',
        description: `Payment for ${poojaDetails.title}`,
        image: '/images/logo.png',
        order_id: order.id,
        handler: async function (response) {
          try {
            // --- ALSO FIX THE VERIFICATION PAYLOAD ---
            const verificationResponse = await apiService.verifyRazorpayPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              entityId: bookingData.bookingId, // Pass the bookingId as the entityId
              entityType: 'booking'             // And specify the type again
            });
            // ------------------------------------------

            if (verificationResponse.success) {
              toast.success(
                (t) => (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    Booking confirmed!
                    <button
                      style={{ background: '#8B4513', color: 'white', padding: '5px 10px', borderRadius: '5px', border: 'none', cursor: 'pointer' }}
                      onClick={() => {
                        navigate('/dashboard/bookings'); // Navigate to dashboard
                        toast.dismiss(t.id);
                      }}
                    >
                      View Bookings
                    </button>
                  </span>
                ), {
                icon: '🙏',
                duration: 6000, // Keep it on screen a bit longer
              }
              );
              setFormData({ // Reset form
                poojaType: '', temple: '', poojaDate: '', poojaTime: '', devoteeName: '', email: '', phone: '', specialRequests: '', agreeTerms: false
              });
            } else {
              toast.error(verificationResponse.message || 'Payment verification failed.');
            }
          } catch (verifyError) {
            toast.error(verifyError.message);
          } finally {
            setIsSubmitting(false);
          }
        },
        prefill: {
          name: formData.devoteeName,
          email: formData.email,
          contact: formData.phone,
        },
        notes: {
          bookingId: bookingData.bookingId, // This is for Razorpay's dashboard, which is fine
        },
        theme: { color: '#8B4513' },
        modal: {
          ondismiss: function () {
            toast.error('Payment was cancelled. Your booking is pending payment.');
            setIsSubmitting(false);
          },
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (paymentError) {
      console.error('Payment initiation error:', paymentError);
      setIsSubmitting(false);
      toast.error(paymentError.message);
      // showErrorMessage(paymentError.message);
    }
  };


  return (
    <section className="booking-form-section">
      <div className="container">
        <div className="section-header">
          <h2>Book Your Pooja</h2>
          <p>Fill in the details to book your sacred ceremony</p>
        </div>
        <div className="booking-form-container">
          <motion.form
            className="booking-form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* --- UPDATED LAYOUT STARTS HERE --- */}

            {/* Pooja Type in its own full-width row */}
            <div className="form-group">
              <label htmlFor="pooja-type">Select Pooja Type</label>
              <select
                id="pooja-type"
                name="poojaType"
                value={formData.poojaType}
                onChange={handleChange}
                className={errors.poojaType ? 'error' : ''}
              >
                <option value="">Choose Pooja Type</option>
                {poojaTypesOptions.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.poojaType && <span className="error-message">{errors.poojaType}</span>}
            </div>

            {/* Temple in its own full-width row */}
            <div className="form-group">
              <label htmlFor="temple">Select Temple</label>
              <select
                id="temple"
                name="temple"
                value={formData.temple}
                onChange={handleChange}
                className={errors.temple ? 'error' : ''}
              >
                <option value="">Choose Temple</option>
                {temples.map(temple => (
                  <option key={temple.value} value={temple.value}>
                    {temple.label}
                  </option>
                ))}
              </select>
              {errors.temple && <span className="error-message">{errors.temple}</span>}
            </div>

            {/* --- END OF UPDATED LAYOUT --- */}

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="pooja-date">Preferred Date</label>
                <input
                  type="date"
                  id="pooja-date"
                  name="poojaDate"
                  value={formData.poojaDate}
                  onChange={handleChange}
                  className={errors.poojaDate ? 'error' : ''}
                />
                {errors.poojaDate && <span className="error-message">{errors.poojaDate}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="pooja-time">Preferred Time</label>
                <select
                  id="pooja-time"
                  name="poojaTime"
                  value={formData.poojaTime}
                  onChange={handleChange}
                  className={errors.poojaTime ? 'error' : ''}
                >
                  <option value="">Select Time</option>
                  {timeSlots.map(slot => (
                    <option key={slot.value} value={slot.value}>
                      {slot.label}
                    </option>
                  ))}
                </select>
                {errors.poojaTime && <span className="error-message">{errors.poojaTime}</span>}
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="devotee-name">Devotee Name</label>
                <input
                  type="text"
                  id="devotee-name"
                  name="devoteeName"
                  placeholder="Enter your full name"
                  value={formData.devoteeName}
                  onChange={handleChange}
                  className={errors.devoteeName ? 'error' : ''}
                />
                {errors.devoteeName && <span className="error-message">{errors.devoteeName}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
                className={errors.phone ? 'error' : ''}
              />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="special-requests">Special Requests (Optional)</label>
              <textarea
                id="special-requests"
                name="specialRequests"
                placeholder="Put your complete address with pincode to receive deliverables (Prashad, Pooja mala/phool, Kumkum/Haldi/ChandanVibhuti, Pooja Incense sticks, etc"
                rows="4"
                value={formData.specialRequests}
                onChange={handleChange}
              ></textarea>
            </div>
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                />
                <span>I agree to the terms and conditions and privacy policy</span>
              </label>
              {errors.agreeTerms && <span className="error-message">{errors.agreeTerms}</span>}
            </div>
            <motion.button
              type="submit"
              className="btn btn-primary btn-large"
              disabled={isSubmitting}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSubmitting ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Processing...
                </>
              ) : (
                'Proceed to Payment'
              )}
            </motion.button>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default BookingForm;