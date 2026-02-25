import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './index.css';

// eslint-disable-next-line no-console
console.log('Main.tsx loading...');

const rootElement = document.getElementById('root');
if (!rootElement) {
  // eslint-disable-next-line no-console
  console.error('Root element not found!');
  throw new Error('Root element not found');
}

// eslint-disable-next-line no-console
console.log('Root element found, rendering app...');

try {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <Router>
        <App />
      </Router>
    </React.StrictMode>
  );
  // eslint-disable-next-line no-console
  console.log('App rendered successfully');
} catch (error) {
  // eslint-disable-next-line no-console
  console.error('Error rendering app:', error);
}
