import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import Dashboard from './pages/Dashboard';
import EvaluationQueue from './pages/EvaluationQueue';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import SessionWarningModal from './components/SessionWarningModal';
import { MockAuth0Provider } from './context/MockAuth0Context';
import { useSessionTimeout } from './hooks/useSessionTimeout';
import { ROLES } from './constants/roles';

/**
 * App Component
 *
 * Main application router with Mock Auth0 for testing.
 * Implements RBAC (Role-Based Access Control) - STORY-EPIC-1.4
 */

/**
 * AppRoutes Component
 * Defines all application routes (public and protected)
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

/**
 * AppContent Component
 * Inner component that uses session timeout hook
 * Requires MockAuth0Context (provided by MockAuth0Provider parent)
 */
const AppContent: React.FC = () => {
  // Hook for session timeout management - STORY-EPIC-1.5
  const { showWarningModal, minutesRemaining, extendSession } = useSessionTimeout();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <AppRoutes />
      </main>
      <SessionWarningModal
        isOpen={showWarningModal}
        minutesRemaining={minutesRemaining}
        onExtendSession={extendSession}
      />
    </div>
  );
};

/**
 * App Component
 *
 * Main application component with:
 * - Mock Auth0 authentication (STORY-EPIC-1.2)
 * - Role-Based Access Control (STORY-EPIC-1.4)
 * - Session timeout management (STORY-EPIC-1.5)
 */
const App: React.FC = () => {
  // eslint-disable-next-line no-console
  console.log('App component rendering with Auth, RBAC (1.4) and Session Timeout (1.5) support');

  return (
    <MockAuth0Provider>
      <AppContent />
    </MockAuth0Provider>
  );
};

export default App;
