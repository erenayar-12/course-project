import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import { MockAuth0Provider } from './context/MockAuth0Context';

/**
 * App Component
 *
 * Main application router with Mock Auth0 for testing.
 * (Real Auth0Provider can be restored when needed)
 */

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegistrationPage />} />
    <Route path="/dashboard" element={<div>Dashboard - Coming Soon</div>} />
    <Route path="/" element={<Navigate to="/login" replace />} />
  </Routes>
);

const App: React.FC = () => {
  console.log('App component rendering with Mock Auth0');
  
  return (
    <MockAuth0Provider>
      <AppRoutes />
    </MockAuth0Provider>
  );
};

export default App;
