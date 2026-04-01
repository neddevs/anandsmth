import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Login from '../components/Login';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get the location the user was trying to access.
  const from = location.state?.from?.pathname || '/';

  const redirectMessage = from !== '/'
    ? `You must be logged in to view the page you were trying to access.`
    : null;

  const handleLoginSuccess = () => {
    // Navigate to the page the user originally intended to visit.
    navigate(from, { replace: true });
  };

  return (
    <Login
      onLoginSuccess={handleLoginSuccess}
      redirectMessage={redirectMessage}
    />
  );
};

export default LoginPage;