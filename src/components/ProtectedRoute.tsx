import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserType } from '../types/user';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserType[];
}

function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(currentUser.userType)) {
    // Redirect to appropriate dashboard based on user type
    switch (currentUser.userType) {
      case UserType.ADMIN:
        return <Navigate to="/admin" replace />;
      case UserType.PROFESSIONAL:
        return <Navigate to="/professional" replace />;
      case UserType.CLIENT:
        return <Navigate to="/client" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  return <>{children}</>;
}

export default ProtectedRoute;