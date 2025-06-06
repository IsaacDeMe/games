import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const AdminRoute = ({ children }) => {
  const { isLoggedIn, currentUser, session } = useAuth();
  const location = useLocation();

  if (session === null) {
    return <div className="min-h-screen flex items-center justify-center"><p>Cargando...</p></div>; 
  }

  if (!isLoggedIn) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (currentUser?.email !== 'isaacdelfamedina@gmail.com') {
    return <Navigate to="/profile" state={{ from: location }} replace />;
  }

  return children;
};

export default AdminRoute;