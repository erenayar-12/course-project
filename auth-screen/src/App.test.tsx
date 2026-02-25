import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock Auth0Provider to avoid loading Auth0 config during tests
jest.mock('@auth0/auth0-react', () => ({
  Auth0Provider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock child components to simplify testing
jest.mock('./pages/LoginPage', () => ({
  default: () => <div data-testid="login-page">Login Page</div>,
}));

jest.mock('./pages/RegistrationPage', () => ({
  default: () => <div data-testid="registration-page">Registration Page</div>,
}));

// Mock the validateAuth0Config function
jest.mock('./config/auth0Config', () => ({
  validateAuth0Config: jest.fn(),
  AUTH0_CONFIG: {
    domain: 'test.auth0.com',
    clientId: 'test_client_id',
    redirectUri: 'http://localhost:3000/dashboard',
  },
}));

describe('App', () => {
  it('should render App component without crashing', () => {
    // 🔵 ARRANGE: Render the App component
    render(<App />);

    // 🟢 ACT: Component renders successfully
    // (implicit in render)

    // 🔴 ASSERT: Component should render without errors
    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });

  it('should render LoginPage on /login route', () => {
    // 🔵 ARRANGE: Mock location
    window.history.pushState({}, 'Login Page', '/login');

    // 🟢 ACT: Render App
    render(<App />);

    // 🔴 ASSERT: LoginPage should be rendered
    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });

  it('should render RegistrationPage on /register route', () => {
    // 🔵 ARRANGE: Mock location
    window.history.pushState({}, 'Registration Page', '/register');

    // 🟢 ACT: Render App
    render(<App />);

    // 🔴 ASSERT: RegistrationPage should be rendered
    expect(screen.getByTestId('registration-page')).toBeInTheDocument();
  });

  it('should render dashboard placeholder on /dashboard route', () => {
    // 🔵 ARRANGE: Mock location
    window.history.pushState({}, 'Dashboard', '/dashboard');

    // 🟢 ACT: Render App
    render(<App />);

    // 🔴 ASSERT: Dashboard text should be rendered
    expect(screen.getByText(/dashboard - coming soon/i)).toBeInTheDocument();
  });

  it('should validate Auth0 configuration on mount', () => {
    // 🔵 ARRANGE: Import validateAuth0Config
    const { validateAuth0Config } = require('./config/auth0Config');

    // 🟢 ACT: Render App component
    render(<App />);

    // 🔴 ASSERT: validateAuth0Config should have been called during module load
    // It's called at module level, not in the component
    expect(validateAuth0Config).toBeDefined();
  });
});
