import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Login.css';
import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';

const Login = ({ onLoginSuccess, redirectMessage }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const { login, error: authError, clearError, isLoading, loginWithGoogle } = useAuth();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (authError) {
      clearError();
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    clearError();

    try {
      const result = await login({
        email: formData.email,
        password: formData.password
      });

      if (result.success) {
        // Instead of navigating, call the success handler from props
        toast.success(`Welcome back, ${result.user.fullName}!`);
        onLoginSuccess();
      } else {
        setErrors({ general: result.error || 'Login failed. Please try again.' });
      }
    } catch (error) {
      setErrors({ general: 'Login failed. Please try again.' });
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    console.log("Google Sign-In Success:", credentialResponse);
    const result = await loginWithGoogle(credentialResponse.credential);
    if (result.success) {
      onLoginSuccess(); // This redirects the user
    }
  };

  const handleGoogleError = () => {
    console.error("Google Sign-In Failed");
    // TODO :- Optionally set an error state to show a message to the user
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Sign in to continue your spiritual journey</p>
        </div>

        <div className="google-login-container">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            theme="filled_blue"
            shape="rectangular"
            logo_alignment="left"
            width="300" // You can adjust this width if needed
          />
        </div>

        <div className="separator">OR</div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          {/* Display the redirect message from LoginPage */}
          {redirectMessage && (
            <div className="info-message">
              {redirectMessage}
            </div>
          )}

          {(errors.general || authError) && (
            <div className="error-message general-error">
              {errors.general || authError}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              placeholder="Enter your email"
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
              placeholder="Enter your password"
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>
          
          <div className="form-options">
            <label className="checkbox-container">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              <span className="checkmark"></span>
              Remember me
            </label>
            <Link to="/forgot-password" className="forgot-password">
              Forgot Password?
            </Link>
          </div>
          
          <button 
            type="submit" 
            className="auth-button"
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>
            Don't have an account?
            <Link to="/signup" className="auth-link">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;