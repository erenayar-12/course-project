import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import LoginPage from '../LoginPage';

// Mock external service (Auth0)
jest.mock('@auth0/auth0-react');

describe('LoginPage', () => {
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

  describe('AC 1: Valid login redirects to Auth0', () => {
    it('should call loginWithRedirect when form submitted with credentials', async () => {
      // 🔵 ARRANGE: Render component
      render(
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      );
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      // 🟢 ACT: User fills form and submits
      fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      // 🔴 ASSERT: loginWithRedirect called with email hint
      expect(mockLoginWithRedirect).toHaveBeenCalled();
      expect(mockLoginWithRedirect).toHaveBeenCalledWith(
        expect.objectContaining({
          authorizationParams: expect.objectContaining({
            login_hint: 'user@example.com',
          }),
        })
      );
    });

    it('should show loading state during authentication (AC 5)', async () => {
      // 🔵 ARRANGE: Mock isLoading = true
      (useAuth0 as jest.Mock).mockReturnValue({
        loginWithRedirect: mockLoginWithRedirect,
        isLoading: true,
        error: null,
        isAuthenticated: false,
      });

      // 🟢 ACT: Render component
      render(
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      );

      // 🔴 ASSERT: Button shows loading state
      const button = screen.getByRole('button', { name: /logging in/i });
      expect(button).toBeDisabled();
      expect(screen.getByText(/logging in/i)).toBeInTheDocument();
    });
  });

  describe('AC 2: Invalid credentials show error message', () => {
    it('should display error message when Auth0 returns error', async () => {
      // 🔵 ARRANGE: Mock Auth0 error
      mockUseAuth0.mockReturnValue({
        loginWithRedirect: mockLoginWithRedirect,
        isLoading: false,
        error: { message: 'Invalid credentials' },
        isAuthenticated: false,
      });

      // 🟢 ACT: Render component
      render(
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      );

      // 🔴 ASSERT: Generic error message displayed (not actual error for security)
      expect(screen.getByText(/Invalid email or password/i)).toBeInTheDocument();
    });
  });
});
