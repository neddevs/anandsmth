import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import apiService from '../services/api';
import '../components/Login.css'; // Re-using login styles

const ResetPasswordPage = () => {
  const { token } = useParams(); // Get token from URL
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await apiService.resetPassword(token, password);
      if (response.success) {
        setMessage('Password reset successfully! Redirecting to dashboard...');
        // Redirect to the user dashboard after a short delay
        setTimeout(() => {
          navigate('/dashboard/bookings');
        }, 2000);
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      setError(err.message || 'An error occurred. The link may be invalid or expired.');
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Reset Your Password</h2>
          <p>Enter and confirm your new password below.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {message && <div className="info-message">{message}</div>}
          {error && <div className="error-message general-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
            />
          </div>

          <button type="submit" className="auth-button" disabled={isLoading || message}>
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
        {message && (
          <div className="auth-footer">
            <Link to="/login" className="auth-link">Login Now</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;