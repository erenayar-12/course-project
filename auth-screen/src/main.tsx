
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './index.css';

// Start MSW in development and E2E, but only in the browser (not Cypress or Node)
if (
  (import.meta.env.MODE === 'development' || import.meta.env.MODE === 'e2e') &&
  typeof window !== 'undefined' &&
  // Avoid running in Cypress (which sets window.Cypress)
  !(window.Cypress)
) {
  import('./mocks/browser').then(({ worker }) => {
    worker.start({ onUnhandledRequest: 'bypass' });
  });
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

ReactDOM.createRoot(rootElement).render(
  <Router>
    <App />
  </Router>
);
