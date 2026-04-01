/**
 * Test Integration Page
 * This page allows you to test the complete login/signup flow
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useApi';
import MiddlewareExample from '../components/MiddlewareExample';
import APITest from '../components/APITest';
import './TestIntegration.css';

const TestIntegration = () => {
  const { isAuthenticated, currentUser, clearError } = useAuth();
  const [showExample, setShowExample] = useState(false);

  useEffect(() => {
    // Clear any existing errors when component mounts
    clearError();
  }, [clearError]);

  return (
    <div className="test-integration">
      <div className="container">
        <header className="test-header">
          <h1>🧪 Integration Test Page</h1>
          <p>Test the complete login/signup flow with your MongoDB backend</p>
        </header>

        <div className="status-card">
          <h2>Current Status</h2>
          <div className="status-grid">
            <div className="status-item">
              <span className="label">Authentication:</span>
              <span className={`value ${isAuthenticated ? 'success' : 'error'}`}>
                {isAuthenticated ? '✅ Authenticated' : '❌ Not Authenticated'}
              </span>
            </div>
            <div className="status-item">
              <span className="label">User:</span>
              <span className="value">
                {currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'None'}
              </span>
            </div>
            <div className="status-item">
              <span className="label">Email:</span>
              <span className="value">
                {currentUser?.email || 'Not available'}
              </span>
            </div>
          </div>
        </div>

        <APITest />

        <div className="instructions">
          <h2>How to Test</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Test Registration</h3>
                <p>Create a new account using the registration form below</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Test Login</h3>
                <p>Login with your credentials to test authentication</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Test Profile Management</h3>
                <p>Update your profile information and test logout</p>
              </div>
            </div>
          </div>
        </div>

        <div className="test-controls">
          <button 
            className="toggle-btn"
            onClick={() => setShowExample(!showExample)}
          >
            {showExample ? 'Hide' : 'Show'} Test Interface
          </button>
        </div>

        {showExample && (
          <div className="example-container">
            <MiddlewareExample />
          </div>
        )}

        <div className="troubleshooting">
          <h2>Troubleshooting</h2>
          <div className="troubleshooting-content">
            <div className="troubleshooting-item">
              <h3>Backend Not Running</h3>
              <p>Make sure your backend server is running on port 5000</p>
              <code>cd backend && npm start</code>
            </div>
            <div className="troubleshooting-item">
              <h3>MongoDB Connection Issues</h3>
              <p>Check your MongoDB connection string in backend/.env</p>
              <code>MONGODB_URI=mongodb+srv://...</code>
            </div>
            <div className="troubleshooting-item">
              <h3>CORS Errors</h3>
              <p>Ensure CORS is properly configured in your backend</p>
              <code>CLIENT_URL=http://localhost:3000</code>
            </div>
          </div>
        </div>

        <div className="api-info">
          <h2>API Information</h2>
          <div className="api-details">
            <div className="api-item">
              <strong>Backend URL:</strong> {process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}
            </div>
            <div className="api-item">
              <strong>Environment:</strong> {process.env.NODE_ENV || 'development'}
            </div>
            <div className="api-item">
              <strong>Token Present:</strong> {localStorage.getItem('token') ? 'Yes' : 'No'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestIntegration;
