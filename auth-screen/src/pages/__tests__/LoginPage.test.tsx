import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from '../LoginPage';
import { MockAuth0Provider } from '../../context/MockAuth0Context';

/**
 * LoginPage Simplified Test Suite
 *
 * Tests verify that LoginPage:
 * 1. Renders without errors
 * 2. Displays required form elements
 * 3. Integrates with MockAuth0Provider
 *
 * More detailed assertions can be added as needed for specific user stories.
 */

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <MockAuth0Provider>
      <BrowserRouter>{component}</BrowserRouter>
    </MockAuth0Provider>
  );
};

describe('LoginPage', () => {
  describe('Component Rendering', () => {
    it('should render LoginPage without crashing', () => {
      // 🔵 ARRANGE: Create the component tree
      // 🟢 ACT: Render the page
      renderWithProviders(<LoginPage />);

      // 🔴 ASSERT: Page should render successfully
      expect(screen.getByText(/sign in/i)).toBeInTheDocument();
    });

    it('should display email and password input fields', () => {
      // 🔵 ARRANGE: Render the component
      renderWithProviders(<LoginPage />);

      // 🟢 ACT: Look for form fields
      // 🔴 ASSERT: Both inputs should be present
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });

    it('should display link to registration page', () => {
      // 🔵 ARRANGE: Render the component
      renderWithProviders(<LoginPage />);

      // 🟢 ACT: Look for registration link
      // 🔴 ASSERT: Link should exist
      expect(screen.getByText(/register here/i)).toBeInTheDocument();
    });
  });

  describe('STORY-EPIC-1.2: Auth0 Integration', () => {
    it('should render Sign In button for form submission', () => {
      // 🔵 ARRANGE: Render page
      renderWithProviders(<LoginPage />);

      // 🟢 ACT: Look for submit button
      // 🔴 ASSERT: Button should exist
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });
  });
});
