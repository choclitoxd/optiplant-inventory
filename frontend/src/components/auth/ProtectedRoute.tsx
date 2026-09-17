import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { RoleType } from '../../types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: RoleType[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const hasRequiredRole = user?.roles?.some(role => allowedRoles.includes(role));
    if (!hasRequiredRole) {
      // Redirect to dashboard if the user doesn't have the required role
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};
