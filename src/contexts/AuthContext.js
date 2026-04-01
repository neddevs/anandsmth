import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrollments, setEnrollments] = useState([]); 

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      verifyToken();
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchEnrollments = async () => {
    try {
      // Assuming apiService.getMyEnrollments() exists and returns { success: true, data: [...] }
      const response = await apiService.getMyEnrollments();
      if (response.success) {
        setEnrollments(response.data);
      }
    } catch (err) {
      // Silently fail, as this is a secondary data fetch
      console.error("Failed to fetch user enrollments:", err);
    }
  };

  const verifyToken = async () => {
    try {
      const response = await apiService.getCurrentUser();
      if (response.success) {
        setUser(response.data.user);
        await fetchEnrollments(); // Fetch enrollments after getting user
      } else {
        localStorage.removeItem('token');
        setUser(null);
        setEnrollments([]);
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      localStorage.removeItem('token');
      setUser(null);
      setEnrollments([]);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setError(null);
      const response = await apiService.login(credentials);

      if (response.success) {
        const { user: userData, token } = response.data;
        localStorage.setItem('token', token);
        setUser(userData);
        await fetchEnrollments(); // Fetch enrollments after login
        return { success: true, user: userData };
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const response = await apiService.register(userData);

      if (response.success) {
        const { user: newUser, token } = response.data;
        localStorage.setItem('token', token);
        setUser(newUser);
        // Enrollments are fetched on page reload/token verification, no need to fetch here
        return { success: true, user: newUser };
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      setError(null);
      setEnrollments([]); // Clear enrollments on logout
    }
  };

  const updateUser = async (updatedData) => {
    try {
      setError(null);
      const response = await apiService.updateProfile(updatedData);

      if (response.success) {
        setUser(response.data.user);
        return { success: true, user: response.data.user };
      } else {
        throw new Error(response.message || 'Profile update failed');
      }
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  const clearError = () => {
    setError(null);
  };

  const loginWithGoogle = async (credential) => {
    try {
      setError(null);
      const response = await apiService.googleLogin({ credential });

      if (response.success) {
        const { user: userData, token } = response.data;
        localStorage.setItem('token', token);
        setUser(userData);
        await fetchEnrollments(); // Fetch enrollments after Google login
        return { success: true, user: userData };
      } else {
        throw new Error(response.message || 'Google login failed');
      }
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    isLoggedIn: !!user,
    isLoading,
    error,
    enrollments, // Expose enrollments state
    fetchEnrollments, // Expose function to allow manual refresh
    login,
    register,
    logout,
    updateUser,
    clearError,
    loginWithGoogle,
    verifyToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};