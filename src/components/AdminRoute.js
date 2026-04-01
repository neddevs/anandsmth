import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, isLoggedIn, isLoading } = useAuth();
  const location = useLocation();

  // 1. Wait for the authentication check to complete
  if (isLoading) {
    return <div>Loading...</div>; // TODO :- a proper loading spinner component
  }

  // 2. Check if the user is logged in
  if (!isLoggedIn) {
    // Redirect them to the login page, but save the location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Check if the logged-in user is an admin
  if (user?.role !== 'admin') {
    // If not an admin, redirect them to a "Not Authorized" page or their dashboard
    // Redirecting to the user dashboard is a good user experience.
    return <Navigate to="/dashboard/bookings" state={{ from: location }} replace />;
  }

  // 4. If all checks pass, render the child component (the admin page)
  return children;
};

export default AdminRoute;