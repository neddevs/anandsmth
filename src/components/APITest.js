/**
 * API Test Component
 * This component tests if the API service is working correctly
 */

import React, { useState, useEffect } from 'react';
import apiService from '../services/api';

const APITest = () => {
  const [status, setStatus] = useState('Testing...');
  const [error, setError] = useState(null);

  useEffect(() => {
    testAPI();
  }, []);

  const testAPI = async () => {
    try {
      setStatus('Testing API service...');
      
      // Test 1: Check if apiService exists
      if (!apiService) {
        throw new Error('API Service is undefined');
      }
      
      setStatus('API Service found, testing methods...');
      
      // Test 2: Check if methods exist
      if (typeof apiService.register !== 'function') {
        throw new Error('register method not found');
      }
      
      if (typeof apiService.login !== 'function') {
        throw new Error('login method not found');
      }
      
      if (typeof apiService.getCurrentUser !== 'function') {
        throw new Error('getCurrentUser method not found');
      }
      
      setStatus('All methods found, testing health check...');
      
      // Test 3: Test health check
      const healthResponse = await apiService.healthCheck();
      
      if (healthResponse.success) {
        setStatus('✅ API Service is working correctly!');
        setError(null);
      } else {
        throw new Error('Health check failed');
      }
      
    } catch (err) {
      setStatus('❌ API Service Error');
      setError(err.message);
      console.error('API Test Error:', err);
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #ccc', 
      margin: '20px',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9'
    }}>
      <h3>API Service Test</h3>
      <p><strong>Status:</strong> {status}</p>
      {error && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
        <p>API Service Object: {apiService ? 'Found' : 'Not Found'}</p>
        <p>Register Method: {apiService?.register ? 'Found' : 'Not Found'}</p>
        <p>Login Method: {apiService?.login ? 'Found' : 'Not Found'}</p>
        <p>Health Check Method: {apiService?.healthCheck ? 'Found' : 'Not Found'}</p>
      </div>
    </div>
  );
};

export default APITest;









