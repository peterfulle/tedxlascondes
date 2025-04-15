import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

// Este componente verifica si el usuario tiene la autorización necesaria
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('auth_token'); // O cualquier otro método que uses para autenticación
  const isAdmin = localStorage.getItem('user_role') === 'admin'; // Verificar si es admin
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirigir al login si no está autenticado
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (!isAdmin) {
    // Redirigir al inicio si no es administrador
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;