import React from 'react';
import { Auth0Provider } from '@auth0/auth0-react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import { AUTH0_CONFIG, validateAuth0Config } from './config/auth0Config';

/**
 * App Component
 *
 * Main application router wrapped with Auth0Provider.
 * Integrates Auth0 authentication following STORY-EPIC-1.2.
 *
 * Auth Flow:
 * 1. User submits login/registration form
 * 2. LoginWithRedirect() sends user to Auth0
 * 3. Auth0 processes auth and redirects to /dashboard (Callback URL)
 * 4. Dashboard component loads and displays authenticated user content
 *
 * Note: Dashboard page will be implemented in STORY-EPIC-1.3 (JWT Token Storage)
 */

// Validate Auth0 configuration on app startup
validateAuth0Config();

const App: React.FC = () => {
  return (
    <Auth0Provider
      domain={AUTH0_CONFIG.domain}
      clientId={AUTH0_CONFIG.clientId}
      authorizationParams={{
        redirect_uri: AUTH0_CONFIG.redirectUri,
      }}
    >
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        {/* Dashboard: Callback endpoint after Auth0 authentication (STORY-EPIC-1.3) */}
        <Route path="/dashboard" element={<div>Dashboard - Coming Soon</div>} />
        {/* Default route: redirect to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Auth0Provider>
  );
};

export default App;
