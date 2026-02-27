import React from 'react';
import { MockAuth0Provider } from './context/MockAuth0Context';
import LoginPage from './pages/LoginPage';

/**
 * App Simple - Simplified version without Router for debugging
 */
const AppSimple: React.FC = () => {
  React.useEffect(() => {
    console.log('✓ AppSimple mounted');
  }, []);

  return (
    <MockAuth0Provider>
      <LoginPage />
    </MockAuth0Provider>
  );
};

export default AppSimple;
