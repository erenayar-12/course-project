import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RegistrationPage from '../RegistrationPage';
import { MockAuth0Provider } from '../../context/MockAuth0Context';

/**
 * RegistrationPage Simplified Test Suite
 *
 * Tests verify that RegistrationPage:
 * 1. Renders without errors
 * 2. Displays required form elements
 * 3. Integrates with MockAuth0Provider
 */

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <MockAuth0Provider>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </MockAuth0Provider>
  );
};

describe('RegistrationPage', () => {
  describe('Component Rendering', () => {
    it('should render RegistrationPage without crashing', () => {
      // 🔵 ARRANGE: Create the component tree
      // 🟢 ACT: Render the page
      renderWithProviders(<RegistrationPage />);

      // 🔴 ASSERT: Page should render successfully
      expect(screen.getByText(/create account/i)).toBeInTheDocument();
    });

    it('should display email, password, and confirm password fields', () => {
      // 🔵 ARRANGE: Render the component
      renderWithProviders(<RegistrationPage />);

      // 🟢 ACT: Look for form fields
      // 🔴 ASSERT: All inputs should be present
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    });

    it('should display submit button', () => {
      // 🔵 ARRANGE: Render the component
      renderWithProviders(<RegistrationPage />);

      // 🟢 ACT: Look for submit button
      // 🔴 ASSERT: Button should exist
      expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
    });
  });

  describe('STORY-EPIC-1.2: Auth0 Integration', () => {
    it('should render form with email field for Auth0 signup', () => {
      // 🔵 ARRANGE: Render page
      renderWithProviders(<RegistrationPage />);

      // 🟢 ACT: Look for email input
      // 🔴 ASSERT: Email field should exist
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    });
  });
});
