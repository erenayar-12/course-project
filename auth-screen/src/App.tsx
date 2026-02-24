import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';

/**
 * App Component
 *
 * Main application router. Directs users to login or registration pages.
 * As the first story in EPIC-1, landing on the app shows the login page by default.
 */

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegistrationPage />} />
      {/* Default route: redirect to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default App;
