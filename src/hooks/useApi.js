/**
 * Custom React Hook for API Operations
 * Provides state management and error handling for API calls
 */

import { useState, useCallback } from 'react';
import apiService from '../services/api';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  /**
   * Execute API call with loading and error state management
   */
  const execute = useCallback(async (apiCall, ...args) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const result = await apiCall(...args);
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = err.message || 'An error occurred';
      setError(errorMessage);
      console.error('API Error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Clear all state
   */
  const clearState = useCallback(() => {
    setLoading(false);
    setError(null);
    setData(null);
  }, []);

  return {
    loading,
    error,
    data,
    execute,
    clearError,
    clearState,
  };
};

/**
 * Hook for authentication operations
 */
export const useAuth = () => {
  const api = useApi();

  const register = useCallback(async (userData) => {
    return api.execute(apiService.register, userData);
  }, [api]);

  const login = useCallback(async (credentials) => {
    return api.execute(apiService.login, credentials);
  }, [api]);

  const logout = useCallback(async () => {
    return api.execute(apiService.logout);
  }, [api]);

  const getCurrentUser = useCallback(async () => {
    return api.execute(apiService.getCurrentUser);
  }, [api]);

  const updateProfile = useCallback(async (profileData) => {
    return api.execute(apiService.updateProfile, profileData);
  }, [api]);

  return {
    ...api,
    register,
    login,
    logout,
    getCurrentUser,
    updateProfile,
    isAuthenticated: apiService.isAuthenticated(),
    currentUser: apiService.getCurrentUserData(),
  };
};

/**
 * Hook for health check
 */
export const useHealthCheck = () => {
  const api = useApi();

  const checkHealth = useCallback(async () => {
    return api.execute(apiService.healthCheck);
  }, [api]);

  return {
    ...api,
    checkHealth,
  };
};

export default useApi;
