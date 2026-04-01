/**
 * Middleware Service for Frontend-Backend Integration
 * Handles API communication, error handling, and data transformation
 */

import config from '../config/environment';
import errorHandler from './errorHandler';

class MiddlewareService {
  constructor() {
    this.baseURL = config.API_BASE_URL;
    this.timeout = config.TIMEOUT;
    this.retryAttempts = config.RETRY_ATTEMPTS;
    this.retryDelay = config.RETRY_DELAY;
  }

  /**
   * Get authentication token from localStorage
   */
  getAuthToken() {
    return localStorage.getItem('token');
  }

  /**
   * Set authentication token in localStorage
   */
  setAuthToken(token) {
    localStorage.setItem('token', token);
  }

  /**
   * Remove authentication token from localStorage
   */
  removeAuthToken() {
    localStorage.removeItem('token');
  }

  /**
   * Get user data from localStorage
   */
  getUserData() {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  }

  /**
   * Set user data in localStorage
   */
  setUserData(userData) {
    localStorage.setItem('userData', JSON.stringify(userData));
  }

  /**
   * Remove user data from localStorage
   */
  removeUserData() {
    localStorage.removeItem('userData');
  }

  /**
   * Get request headers with authentication
   */
  getHeaders(includeAuth = true) {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (includeAuth) {
      const token = this.getAuthToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    return headers;
  }

  /**
   * Handle API response and errors
   */
  async handleResponse(response) {
    let data;
    
    try {
      data = await response.json();
    } catch (error) {
      throw new Error('Invalid JSON response from server');
    }

    if (!response.ok) {
      // Handle specific HTTP status codes
      switch (response.status) {
        case 401:
          // Unauthorized - clear auth data and redirect to login
          this.clearAuthData();
          throw new Error('Session expired. Please login again.');
        
        case 403:
          throw new Error('Access denied. You do not have permission to perform this action.');
        
        case 404:
          throw new Error('Resource not found.');
        
        case 422:
          throw new Error(data.message || 'Validation failed.');
        
        case 429:
          throw new Error('Too many requests. Please try again later.');
        
        case 500:
          throw new Error('Server error. Please try again later.');
        
        default:
          throw new Error(data.message || `Request failed with status ${response.status}`);
      }
    }

    return data;
  }

  /**
   * Clear authentication data
   */
  clearAuthData() {
    this.removeAuthToken();
    this.removeUserData();
  }

  /**
   * Retry mechanism for failed requests
   */
  async retryRequest(requestFn, attempts = this.retryAttempts) {
    try {
      return await requestFn();
    } catch (error) {
      if (attempts > 1 && this.shouldRetry(error)) {
        await this.delay(this.retryDelay);
        return this.retryRequest(requestFn, attempts - 1);
      }
      throw error;
    }
  }

  /**
   * Check if request should be retried
   */
  shouldRetry(error) {
    // Retry on network errors or 5xx server errors
    return error.message.includes('Network') || 
           error.message.includes('Server error') ||
           error.message.includes('timeout');
  }

  /**
   * Delay utility
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Generic request method with retry logic
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      method: 'GET',
      headers: this.getHeaders(options.includeAuth !== false),
      ...options,
    };

    // Add timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    config.signal = controller.signal;

    const requestFn = async () => {
      try {
        const response = await fetch(url, config);
        clearTimeout(timeoutId);
        return await this.handleResponse(response);
      } catch (error) {
        clearTimeout(timeoutId);
        
        if (error.name === 'AbortError') {
          throw new Error('Request timeout. Please check your connection.');
        }
        
        if (error.message.includes('Failed to fetch')) {
          throw new Error('Network error. Please check your connection.');
        }
        
        throw error;
      }
    };

    return this.retryRequest(requestFn);
  }

  /**
   * Authentication API methods
   */
  async register(userData) {
    try {
      const response = await this.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
        includeAuth: false,
      });

      if (response.success && response.data.token) {
        this.setAuthToken(response.data.token);
        this.setUserData(response.data.user);
      }

      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async login(credentials) {
    try {
      const response = await this.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
        includeAuth: false,
      });

      if (response.success && response.data.token) {
        this.setAuthToken(response.data.token);
        this.setUserData(response.data.user);
      }

      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      const response = await this.request('/auth/me');
      
      if (response.success && response.data.user) {
        this.setUserData(response.data.user);
      }

      return response;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  }

  async updateProfile(profileData) {
    try {
      const response = await this.request('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
      });

      if (response.success && response.data.user) {
        this.setUserData(response.data.user);
      }

      return response;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  async logout() {
    try {
      const response = await this.request('/auth/logout', {
        method: 'POST',
      });

      // Clear auth data regardless of response
      this.clearAuthData();

      return response;
    } catch (error) {
      console.error('Logout error:', error);
      // Clear auth data even if logout fails
      this.clearAuthData();
      throw error;
    }
  }

  /**
   * Health check
   */
  async healthCheck() {
    try {
      return await this.request('/health', {
        includeAuth: false,
      });
    } catch (error) {
      console.error('Health check error:', error);
      throw error;
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    const token = this.getAuthToken();
    const userData = this.getUserData();
    return !!(token && userData);
  }

  /**
   * Get current user data from localStorage
   */
  getCurrentUserData() {
    return this.getUserData();
  }

  /**
   * Utility method to handle form validation errors
   */
  formatValidationErrors(errors) {
    if (Array.isArray(errors)) {
      return errors.map(error => error.msg || error.message).join(', ');
    }
    return errors;
  }

  /**
   * Utility method to show user-friendly error messages
   */
  getErrorMessage(error) {
    return errorHandler.getErrorMessage(error);
  }
}

// Create and export a singleton instance
const middlewareService = new MiddlewareService();
export default middlewareService;
