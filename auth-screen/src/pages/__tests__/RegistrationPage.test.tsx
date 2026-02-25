import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import RegistrationPage from '../RegistrationPage';

jest.mock('@auth0/auth0-react');

describe('RegistrationPage', () => {
  let mockLoginWithRedirect: jest.Mock;
  let mockUseAuth0: jest.Mock;

  beforeEach(() => {
    mockLoginWithRedirect = jest.fn();
    jest.clearAllMocks();
    mockUseAuth0 = useAuth0 as jest.Mock;
    mockUseAuth0.mockReturnValue({
      loginWithRedirect: mockLoginWithRedirect,
      isLoading: false,
      error: null,
      isAuthenticated: false,
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('AC 3: Registration with new credentials', () => {
    it('should call loginWithRedirect with signup screen hint', async () => {
      // 🔵 ARRANGE: Render form
      render(
        <BrowserRouter>
          <RegistrationPage />
        </BrowserRouter>
      );
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/^password/i);
      const confirmInput = screen.getByLabelText(/confirm password/i);
      const submitButton = screen.getByRole('button', { name: /create account/i });

      // 🟢 ACT: Fill matching passwords and submit
      fireEvent.change(emailInput, { target: { value: 'newuser@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'SecurePass123' } });
      fireEvent.change(confirmInput, { target: { value: 'SecurePass123' } });
      fireEvent.click(submitButton);

      // 🔴 ASSERT: Auth0 signup flow called with correct parameters
      expect(mockLoginWithRedirect).toHaveBeenCalledWith(
        expect.objectContaining({
          authorizationParams: expect.objectContaining({
            screen_hint: 'signup',
            login_hint: 'newuser@example.com',
          }),
        })
      );
    });
  });

  describe('AC 5: Loading state during registration', () => {
    it('should show loading state while creating account', async () => {
      // 🔵 ARRANGE: Mock isLoading = true
      mockUseAuth0.mockReturnValue({
        loginWithRedirect: mockLoginWithRedirect,
        isLoading: true,
        error: null,
        isAuthenticated: false,
      });

      // 🟢 ACT: Render component
      render(
        <BrowserRouter>
          <RegistrationPage />
        </BrowserRouter>
      );

      // 🔴 ASSERT: Button shows loading state
      const button = screen.getByRole('button', { name: /creating account/i });
      expect(button).toBeDisabled();
      expect(screen.getByText(/creating account/i)).toBeInTheDocument();
    });
  });
});
