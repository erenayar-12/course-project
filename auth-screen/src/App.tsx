import React, { ReactNode, ErrorInfo } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import Dashboard from './pages/Dashboard';
import EvaluationQueue from './pages/EvaluationQueue';
import IdeaReviewPanel from './components/IdeaReviewPanel';
import IdeaDetailPage from './pages/IdeaDetailPage';
import IdeaEditPage from './pages/IdeaEditPage';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import { MockAuth0Provider } from './context/MockAuth0Context';
import { ROLES } from './constants/roles';

/**
 * App Component
 *
 * Main application router with Mock Auth0 for testing.
 * Implements RBAC (Role-Based Access Control) - STORY-EPIC-1.4
 */

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary to catch React errors
 */
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error('⚠️ REACT ERROR CAUGHT:', error);
    // eslint-disable-next-line no-console
    console.error('Component Stack:', errorInfo.componentStack);
    // eslint-disable-next-line no-console
    console.error('Full Error:', JSON.stringify({ message: error.message, stack: error.stack }, null, 2));
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: '40px',
            margin: '20px',
            backgroundColor: '#fee5e5',
            border: '3px solid #dc2626',
            borderRadius: '8px',
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            color: '#991b1b',
          }}
        >
          <h1 style={{ color: '#991b1b', fontSize: '24px', marginBottom: '10px' }}>
            ❌ Application Error
          </h1>
          <p style={{ fontSize: '14px' }}>
            <strong>Error Message:</strong>
          </p>
          <p style={{ backgroundColor: '#fff5f5', padding: '10px', borderRadius: '4px', marginBottom: '10px' }}>
            {this.state.error?.message}
          </p>
          <p style={{ color: '#7f1d1d', marginTop: '20px' }}>
            <strong>Steps to fix:</strong>
            <br />
            1. Open Browser DevTools (F12)
            <br />
            2. Check the Console tab for error details
            <br />
            3. Share the full error message with the developer
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

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

    <Route
      path="/evaluation-queue/:ideaId"
      element={
        <ProtectedRoute path="/evaluation-queue/:ideaId" requiredRoles={[ROLES.EVALUATOR, ROLES.ADMIN]}>
          <IdeaReviewPanel />
        </ProtectedRoute>
      }
    />

    <Route
      path="/ideas/:ideaId"
      element={
        <ProtectedRoute path="/ideas/:ideaId">
          <IdeaDetailPage />
        </ProtectedRoute>
      }
    />

    <Route
      path="/ideas/:ideaId/edit"
      element={
        <ProtectedRoute path="/ideas/:ideaId/edit">
          <IdeaEditPage />
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
  // eslint-disable-next-line no-console
  console.log('✓ AppContent rendering');

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <main className="flex-1 bg-white">
        <AppRoutes />
      </main>
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
 * - Error Boundary for error handling
 */
const App: React.FC = () => {
  // eslint-disable-next-line no-console
  console.log('🚀 App starting with Auth, RBAC (1.4) and Session Timeout (1.5)');

  return (
    <ErrorBoundary>
      <MockAuth0Provider>
        <AppContent />
      </MockAuth0Provider>
    </ErrorBoundary>
  );
};

export default App;
