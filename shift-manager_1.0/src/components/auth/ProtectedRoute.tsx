import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { ROUTES } from '@/constants';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'admin' | 'coordinator' | 'volunteer';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole = 'volunteer' 
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    // Redirect to login page with return url
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  // Check role permissions
  if (requiredRole && !hasPermission(user.role, requiredRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

// Helper function to check role permissions
function hasPermission(userRole: string, requiredRole: string): boolean {
  const roleHierarchy = {
    volunteer: 0,
    coordinator: 1,
    admin: 2
  };
  
  const userLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] ?? -1;
  const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] ?? 99;
  
  return userLevel >= requiredLevel;
} 