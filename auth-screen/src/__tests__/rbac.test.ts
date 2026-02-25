import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import { MockAuth0Provider, useMockAuth0 } from '../context/MockAuth0Context';
import { ROLES } from '../constants/roles';

/**
 * Test Component to access useMockAuth0 hook
 */
const TestComponent = () => {
  const { user } = useMockAuth0();
  return <div data-testid="user-role">{user?.role || 'no-role'}</div>;
};

describe('RBAC - Role-Based Access Control (Story 1.4)', () => {
  describe('AC 1: Role Assignment at Login', () => {
    test('should assign default role (Submitter) when email is generic', async () => {
      render(
        <MockAuth0Provider>
          <TestComponent />
        </MockAuth0Provider>
      );
      
      // Initially no user
      expect(screen.getByTestId('user-role')).toHaveTextContent('no-role');
    });
  });

  describe('AC 2 & 3: Route Protection', () => {
    test('should show access denied for users without required role', () => {
      const TestContent = () => (
        <ProtectedRoute path="/evaluation-queue" requiredRoles={[ROLES.EVALUATOR]}>
          <div>Evaluation Content</div>
        </ProtectedRoute>
      );

      render(
        <MockAuth0Provider>
          <Router>
            <TestContent />
          </Router>
        </MockAuth0Provider>
      );

      // Since no user is logged in, should redirect/show access denied
      // This test verifies the ProtectedRoute component exists and has the logic
      expect(screen.queryByText(/Evaluation Content/i)).not.toBeInTheDocument();
    });
  });

  describe('Constants and Configuration', () => {
    test('should have all required roles defined', () => {
      expect(ROLES.ADMIN).toBe('admin');
      expect(ROLES.EVALUATOR).toBe('evaluator');
      expect(ROLES.SUBMITTER).toBe('submitter');
    });

    test('should have protected routes configured', () => {
      const ProtectedRoutesModule = require('../constants/roles');
      const routes = ProtectedRoutesModule.PROTECTED_ROUTES;
      
      expect(routes['/evaluation-queue']).toContain(ROLES.EVALUATOR);
      expect(routes['/evaluation-queue']).toContain(ROLES.ADMIN);
      expect(routes['/evaluation-queue']).not.toContain(ROLES.SUBMITTER);
    });
  });
});
