import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import Dashboard from './pages/Dashboard';
import EvaluationQueue from './pages/EvaluationQueue';
import ProtectedRoute from './components/ProtectedRoute';
import { MockAuth0Provider } from './context/MockAuth0Context';
import { ROLES } from './constants/roles';

/**
 * App Component
 *
 * Main application router with Mock Auth0 for testing.
 * Implements RBAC (Role-Based Access Control) - STORY-EPIC-1.4
 */

const AppRoutes: React.FC = () => (
  <Routes>
    {/* Public Routes */}
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegistrationPage />} />
    
    {/* Protected Routes */}
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute path="/dashboard">
          <Dashboard />
        </ProtectedRoute>
      }
    />
    
    <Route
      path="/evaluation-queue"
      element={
        <ProtectedRoute path="/evaluation-queue" requiredRoles={[ROLES.EVALUATOR, ROLES.ADMIN]}>
          <EvaluationQueue />
        </ProtectedRoute>
      }
    />
    
    {/* Default redirect */}
    <Route path="/" element={<Navigate to="/login" replace />} />
  </Routes>
);

const App: React.FC = () => {
  console.log('App component rendering with RBAC support (Story 1.4)');
  
  return (
    <MockAuth0Provider>
      <AppRoutes />
    </MockAuth0Provider>
  );
};

export default App;
