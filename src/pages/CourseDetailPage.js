import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import apiService from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import useRazorpay from '../hooks/useRazorpay';
import './CourseDetailPage.css';

const CourseDetailPage = () => {
  useRazorpay();
  const { id: courseId } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, user, verifyToken, enrollments, fetchEnrollments } = useAuth();

  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const fetchCourse = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiService.getPublicCourseDetails(courseId);
        if (response.success) {
          setCourse(response.data);
        } else {
          throw new Error(response.message || 'Failed to load course details.');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  const isEnrolled = enrollments.some(enrollment => enrollment.course?._id === courseId);

  const handleEnrollFree = async () => {
    if (!isLoggedIn) {
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }
    setIsProcessing(true);
    try {
      const response = await apiService.enrollInFreeCourse(courseId);
      if (response.success) {
        await fetchEnrollments(); // Refresh global enrollment state
        navigate(`/courses/player/${courseId}`);
      } else {
        throw new Error(response.message || 'Enrollment failed.');
      }
    } catch (err) {
      setError(err.message);
      setIsProcessing(false);
    }
  };

  const handleSubscribeAndEnroll = async () => {
    if (!isLoggedIn) {
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }

    setIsProcessing(true);
    setError(null);

    const planId = course.subscriptionTier.toLowerCase();
    const plan = {
      id: planId,
      name: `${course.subscriptionTier} Plan`,
      price: planId === 'plus' ? 499 : 2499,
    };

    try {
      const razorpayOrderResponse = await apiService.createRazorpayOrder({
        amount: plan.price,
        entityId: plan.id,
        entityType: 'subscription',
        courseId: courseId,
      });

      if (!razorpayOrderResponse.success) {
        throw new Error(razorpayOrderResponse.message);
      }

      const razorpayOrder = razorpayOrderResponse.data;

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: `Anandmaya - ${plan.name}`,
        description: `Access to ${plan.name} content`,
        order_id: razorpayOrder.id,
        handler: async function (response) {
          const verificationData = { ...response };
          await apiService.verifyRazorpayPayment(verificationData);
          await verifyToken(); // This re-fetches the user (with new subscription)
          await fetchEnrollments(); // This re-fetches enrollments (with the new one)
          navigate(`/courses/player/${courseId}`);
        },
        prefill: { name: user.fullName, email: user.email },
        theme: { color: '#8B4513' },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
      setIsProcessing(false);
    }
  };
  
  const handleEnrollPaid = async () => {
    if (!isLoggedIn) {
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }
    setIsProcessing(true);
    try {
      const response = await apiService.enrollInPaidCourse(courseId);
      if (response.success) {
        await fetchEnrollments();
        navigate(`/courses/player/${courseId}`);
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      setError(err.message);
      setIsProcessing(false);
    }
  };

  const renderEnrollmentButton = () => {
    if (isEnrolled) {
      return (
        <Link to={`/courses/player/${courseId}`} className="btn-enroll">
          Go to Course
        </Link>
      );
    }

    if (!isLoggedIn) {
      return <Link to="/login" state={{ from: window.location.pathname }} className="btn-enroll">Login to Enroll</Link>;
    }

    const hasSubscriptionAccess = user && (
      (course.subscriptionTier === 'Plus' && (user.subscription?.tier === 'plus' || user.subscription?.tier === 'premium')) ||
      (course.subscriptionTier === 'Premium' && user.subscription?.tier === 'premium')
    );

    if (hasSubscriptionAccess) {
      return (
        <button className="btn-enroll" onClick={handleEnrollPaid} disabled={isProcessing}>
          {isProcessing ? 'Processing...' : 'Start Course'}
        </button>
      );
    }

    switch (course?.subscriptionTier) {
      case 'Free':
        return (
          <button className="btn-enroll" onClick={handleEnrollFree} disabled={isProcessing}>
            {isProcessing ? 'Enrolling...' : 'Enroll for Free'}
          </button>
        );
      case 'Plus':
      case 'Premium':
        return (
          <button className="btn-subscribe" onClick={handleSubscribeAndEnroll} disabled={isProcessing}>
            {isProcessing ? 'Processing...' : `Subscribe to ${course.subscriptionTier}`}
          </button>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return <div className="loading-spinner">Loading Course...</div>;
  }

  if (error && !isProcessing) {
    return <div className="error-message">Error: {error}</div>;
  }

  if (!course) {
    return <div className="error-message">Course not found.</div>;
  }

  return (
    <div className="course-detail-page">
      <div className="course-hero" style={{ backgroundImage: `url(${course.thumbnail})` }}>
        <div className="hero-overlay">
          {/* <h1>{course.title}</h1> */}
          <p>{course.instructor}</p>
          <span className={`tier-badge tier-${course.subscriptionTier?.toLowerCase()}`}>{course.subscriptionTier}</span>
        </div>
      </div>

      <div className="container course-content-layout">
        <main className="course-main-content">
          <h1>{course.title}</h1>

          <h2>About this Course</h2>
          <p>{course.description}</p>

          <h2>Curriculum</h2>
          <div className="curriculum-accordion">
            {course.modules && course.modules.sort((a, b) => a.order - b.order).map((module) => (
              <div key={module._id} className="module-section">
                <h3 className="module-title">
                  {module.order}. {module.title}
                  {module.subscriptionTier && module.subscriptionTier !== 'Free' && (
                    <span className={`tier-badge-small tier-${module.subscriptionTier.toLowerCase()}`}>
                      <i className="fas fa-lock"></i> {module.subscriptionTier}
                    </span>
                  )}
                </h3>
                <ul className="lesson-list">
                  {module.lessons && module.lessons.sort((a, b) => a.order - b.order).map((lesson) => (
                    <li key={lesson._id}>
                      <i className={`fas ${lesson.type === 'Video' ? 'fa-play-circle' : 'fa-file-alt'}`}></i>
                      {lesson.title}
                      {lesson.duration && <span className="lesson-duration">{lesson.duration} min</span>}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </main>
        <aside className="course-sidebar">
          <div className="enroll-box">
            <img src={course.thumbnail} alt={course.title} className="sidebar-thumbnail" />
            <div className="enroll-box-content">
              {error && <p className="sidebar-error">{error}</p>}
              {renderEnrollmentButton()}
              <p className="sidebar-note">Full access to all course videos and notes upon enrollment.</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CourseDetailPage;