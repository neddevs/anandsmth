/**
 * Example Component demonstrating Middleware Integration
 * This component shows how to use the middleware service in React components
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useApi';
import apiService from '../services/api';
import integrationTestService from '../services/integrationTest';
import './MiddlewareExample.css';

const MiddlewareExample = () => {
  const { 
    login, 
    register, 
    logout, 
    getCurrentUser, 
    updateProfile,
    loading, 
    error, 
    isAuthenticated,
    currentUser,
    clearError 
  } = useAuth();

  const [testResults, setTestResults] = useState(null);
  const [showTests, setShowTests] = useState(false);

  // Form states
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [registerForm, setRegisterForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: ''
  });

  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    phone: ''
  });

  // Load current user on component mount
  useEffect(() => {
    if (isAuthenticated && !currentUser) {
      getCurrentUser();
    }
  }, [isAuthenticated, currentUser, getCurrentUser]);

  // Update profile form when user data changes
  useEffect(() => {
    if (currentUser) {
      setProfileForm({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        phone: currentUser.phone || ''
      });
    }
  }, [currentUser]);

  const handleLogin = async (e) => {
    e.preventDefault();
    clearError();
    
    try {
      await login(loginForm);
      console.log('Login successful!');
    } catch (err) {
      console.error('Login failed:', err.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    clearError();
    
    try {
      await register(registerForm);
      console.log('Registration successful!');
    } catch (err) {
      console.error('Registration failed:', err.message);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    clearError();
    
    try {
      await updateProfile(profileForm);
      console.log('Profile updated successfully!');
    } catch (err) {
      console.error('Profile update failed:', err.message);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      console.log('Logout successful!');
    } catch (err) {
      console.error('Logout failed:', err.message);
    }
  };

  const runIntegrationTests = async () => {
    setShowTests(true);
    setTestResults('Running tests...');
    
    try {
      await integrationTestService.runAllTests();
      setTestResults('Tests completed! Check console for results.');
    } catch (err) {
      setTestResults(`Tests failed: ${err.message}`);
    }
  };

  const testHealthCheck = async () => {
    try {
      const response = await apiService.healthCheck();
      console.log('Health check response:', response);
      alert(`Backend is ${response.success ? 'healthy' : 'unhealthy'}`);
    } catch (err) {
      console.error('Health check failed:', err.message);
      alert(`Health check failed: ${err.message}`);
    }
  };

  return (
    <div className="middleware-example">
      <div className="container">
        <h1>Middleware Integration Example</h1>
        
        {/* Status Section */}
        <div className="status-section">
          <h2>Current Status</h2>
          <div className="status-grid">
            <div className="status-item">
              <strong>Authentication:</strong> 
              <span className={isAuthenticated ? 'success' : 'error'}>
                {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
              </span>
            </div>
            <div className="status-item">
              <strong>Loading:</strong> 
              <span className={loading ? 'loading' : 'idle'}>
                {loading ? 'Loading...' : 'Idle'}
              </span>
            </div>
            <div className="status-item">
              <strong>User:</strong> 
              <span>{currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'None'}</span>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="error-section">
            <h3>Error</h3>
            <div className="error-message">{error}</div>
            <button onClick={clearError} className="clear-error-btn">
              Clear Error
            </button>
          </div>
        )}

        {/* Authentication Forms */}
        {!isAuthenticated ? (
          <div className="auth-section">
            <div className="form-container">
              <h2>Login</h2>
              <form onSubmit={handleLogin} className="auth-form">
                <div className="form-group">
                  <label>Email:</label>
                  <input
                    type="email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Password:</label>
                  <input
                    type="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={loginForm.rememberMe}
                      onChange={(e) => setLoginForm({...loginForm, rememberMe: e.target.checked})}
                    />
                    Remember Me
                  </label>
                </div>
                <button type="submit" disabled={loading} className="submit-btn">
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </form>
            </div>

            <div className="form-container">
              <h2>Register</h2>
              <form onSubmit={handleRegister} className="auth-form">
                <div className="form-group">
                  <label>First Name:</label>
                  <input
                    type="text"
                    value={registerForm.firstName}
                    onChange={(e) => setRegisterForm({...registerForm, firstName: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Last Name:</label>
                  <input
                    type="text"
                    value={registerForm.lastName}
                    onChange={(e) => setRegisterForm({...registerForm, lastName: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email:</label>
                  <input
                    type="email"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Password:</label>
                  <input
                    type="password"
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone:</label>
                  <input
                    type="tel"
                    value={registerForm.phone}
                    onChange={(e) => setRegisterForm({...registerForm, phone: e.target.value})}
                  />
                </div>
                <button type="submit" disabled={loading} className="submit-btn">
                  {loading ? 'Registering...' : 'Register'}
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="user-section">
            <h2>User Profile</h2>
            <div className="user-info">
              <p><strong>Name:</strong> {currentUser?.firstName} {currentUser?.lastName}</p>
              <p><strong>Email:</strong> {currentUser?.email}</p>
              <p><strong>Phone:</strong> {currentUser?.phone || 'Not provided'}</p>
              <p><strong>Role:</strong> {currentUser?.role}</p>
            </div>

            <form onSubmit={handleUpdateProfile} className="profile-form">
              <h3>Update Profile</h3>
              <div className="form-group">
                <label>First Name:</label>
                <input
                  type="text"
                  value={profileForm.firstName}
                  onChange={(e) => setProfileForm({...profileForm, firstName: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Last Name:</label>
                <input
                  type="text"
                  value={profileForm.lastName}
                  onChange={(e) => setProfileForm({...profileForm, lastName: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Phone:</label>
                <input
                  type="tel"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                />
              </div>
              <button type="submit" disabled={loading} className="submit-btn">
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
            </form>

            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        )}

        {/* Testing Section */}
        <div className="testing-section">
          <h2>Testing</h2>
          <div className="test-buttons">
            <button onClick={testHealthCheck} className="test-btn">
              Test Health Check
            </button>
            <button onClick={runIntegrationTests} className="test-btn">
              Run Integration Tests
            </button>
          </div>
          
          {showTests && (
            <div className="test-results">
              <h3>Test Results</h3>
              <p>{testResults}</p>
              <p><em>Check browser console for detailed results.</em></p>
            </div>
          )}
        </div>

        {/* API Information */}
        <div className="api-info">
          <h2>API Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <strong>Base URL:</strong> {process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}
            </div>
            <div className="info-item">
              <strong>Environment:</strong> {process.env.NODE_ENV || 'development'}
            </div>
            <div className="info-item">
              <strong>Token:</strong> {apiService.getAuthToken() ? 'Present' : 'Not present'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiddlewareExample;









