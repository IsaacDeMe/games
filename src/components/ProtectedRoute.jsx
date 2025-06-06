import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, session } = useAuth();
  const location = useLocation();

  // If session is null, it means we are still checking auth state
  if (session === null) {
    return <div className="min-h-screen flex items-center justify-center"><p>Cargando...</p></div>; 
  }

  if (!isLoggedIn) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;