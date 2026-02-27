
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './index.css';
// import { Auth0Provider } from '@auth0/auth0-react';

// MSW disabled: All API requests go to real backend in development.

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

ReactDOM.createRoot(rootElement).render(
  <Router>
    <App />
  </Router>
);
