import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const location = useLocation();
  const token = localStorage.getItem('libraria_token');

  if (!token) {
    return <Navigate to="/user-login" replace state={{ from: location }} />;
  }

  try {
    const { role } = jwtDecode(token);

    if (adminOnly && role !== 'admin') {
      return <Navigate to="/user-login" replace state={{ from: location }} />;
    }
  } catch (_error) {
    localStorage.removeItem('libraria_token');
    return <Navigate to="/user-login" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
