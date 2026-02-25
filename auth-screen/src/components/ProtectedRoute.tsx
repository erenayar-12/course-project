import React from 'react';
import { Navigate } from 'react-router-dom';
import { useMockAuth0 } from '../context/MockAuth0Context';
import { UserRole, PROTECTED_ROUTES } from '../constants/roles';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
  path: string;
}

/**
 * ProtectedRoute Component
 *
 * Validates user authentication and role before rendering protected content.
 * Reference: STORY-EPIC-1.4 - AC2, AC3 (Route Protection)
 *
 * Features:
 * - Check if user is authenticated
 * - Check if user has required role
 * - Redirect to login if not authenticated
 * - Redirect to dashboard with error if insufficient permissions
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRoles, path }) => {
  const { user } = useMockAuth0();

  // If no user is logged in, redirect to login
  if (!user || !user.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Determine required roles for this route
  const rolesForRoute = requiredRoles || PROTECTED_ROUTES[path] || [];

  // Check if user has one of the required roles (AC2, AC3)
  const hasRequiredRole = rolesForRoute.length === 0 || rolesForRoute.includes(user.role);

  if (!hasRequiredRole) {
    // Show access denied and redirect (AC2, AC3)
    // eslint-disable-next-line no-console
    console.warn(`Access denied for role "${user.role}" on route "${path}"`);

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-700 mb-4">You don't have permission to access this page.</p>
          <p className="text-sm text-gray-500 mb-6">
            Your role: <span className="font-semibold capitalize">{user.role}</span>
          </p>
          <button
            onClick={() => (window.location.href = '/dashboard')}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // User is authenticated and has required role
  return <>{children}</>;
};

export default ProtectedRoute;
