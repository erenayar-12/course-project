import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import LoginPage from '../LoginPage';

/**
 * LoginPage Test Suite
 *
 * Tests verify observable behavior of the login page UI (AC1, AC3, AC4, AC5 from STORY-EPIC-1.1)
 * Focus: User sees login form with correct labels, placeholders, and styling
 */

describe('LoginPage', () => {
  const renderLoginPage = () => {
    return render(
      <Router>
        <LoginPage />
      </Router>
    );
  };

  describe('AC 1: Login Page Displays Correctly', () => {
    it('should render heading with text "Login"', () => {
      // 🔵 ARRANGE
      renderLoginPage();

      // 🟢 ACT
      const heading = screen.getByRole('heading', { level: 1 });

      // 🔴 ASSERT
      expect(heading).toHaveTextContent('Login');
    });

    it('should render email input field with label', () => {
      // 🔵 ARRANGE
      renderLoginPage();

      // 🟢 ACT
      const emailInput = screen.getByLabelText(/email/i);

      // 🔴 ASSERT
      expect(emailInput).toBeInTheDocument();
      expect(emailInput).toHaveAttribute('type', 'email');
    });

    it('should render password input field with label', () => {
      // 🔵 ARRANGE
      renderLoginPage();

      // 🟢 ACT
      const passwordInput = screen.getByLabelText(/password/i);

      // 🔴 ASSERT
      expect(passwordInput).toBeInTheDocument();
      expect(passwordInput).toHaveAttribute('type', 'password');
    });

    it('should render Sign In button', () => {
      // 🔵 ARRANGE
      renderLoginPage();

      // 🟢 ACT
      const signInButton = screen.getByRole('button', { name: /sign in/i });

      // 🔴 ASSERT
      expect(signInButton).toBeInTheDocument();
      expect(signInButton).toHaveClass('btn-primary');
    });

    it('should render link to registration page with correct text', () => {
      // 🔵 ARRANGE
      renderLoginPage();

      // 🟢 ACT
      const registerLink = screen.getByRole('link', { name: /register here/i });

      // 🔴 ASSERT
      expect(registerLink).toBeInTheDocument();
      expect(registerLink).toHaveAttribute('href', '/register');
    });
  });

  describe('AC 4: Form Labels and Placeholders Are Clear', () => {
    it('should display email label', () => {
      // 🔵 ARRANGE
      renderLoginPage();

      // 🟢 ACT
      const emailLabel = screen.getByText(/email/i);

      // 🔴 ASSERT
      expect(emailLabel).toBeInTheDocument();
    });

    it('should display password label', () => {
      // 🔵 ARRANGE
      renderLoginPage();

      // 🟢 ACT
      const passwordLabel = screen.getByText(/password/i);

      // 🔴 ASSERT
      expect(passwordLabel).toBeInTheDocument();
    });

    it('should mark required fields with asterisk', () => {
      // 🔵 ARRANGE
      renderLoginPage();

      // 🟢 ACT
      const requiredMarkers = screen.getAllByText('*');

      // 🔴 ASSERT
      expect(requiredMarkers.length).toBeGreaterThan(0);
    });

    it('should have placeholder text on email input', () => {
      // 🔵 ARRANGE
      renderLoginPage();

      // 🟢 ACT
      const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;

      // 🔴 ASSERT
      expect(emailInput.placeholder).toBeTruthy();
    });

    it('should have placeholder text on password input', () => {
      // 🔵 ARRANGE
      renderLoginPage();

      // 🟢 ACT
      const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement;

      // 🔴 ASSERT
      expect(passwordInput.placeholder).toBeTruthy();
    });
  });

  describe('AC 3: Pages Are Fully Responsive', () => {
    it('should render form in responsive container', () => {
      // 🔵 ARRANGE
      renderLoginPage();

      // 🟢 ACT
      const { container } = renderLoginPage();
      const mainElement = container.firstChild;

      // 🔴 ASSERT - Check that form is in responsive container
      expect(mainElement).toHaveClass('responsive');
      expect(mainElement).toHaveClass('min-h-screen');
    });

    it('should have input fields with proper width constraints', () => {
      // 🔵 ARRANGE
      renderLoginPage();

      // 🟢 ACT
      const emailInput = screen.getByLabelText(/email/i) as HTMLElement;

      // 🔴 ASSERT - Check input has proper responsive styling
      expect(emailInput).toHaveClass('w-full');
      expect(emailInput).toHaveClass('px-4');
    });

    it('should have form container with max-width for desktop', () => {
      // 🔵 ARRANGE
      const { container } = renderLoginPage();

      // 🟢 ACT
      const formContainer = container.querySelector('.max-w-md');

      // 🔴 ASSERT
      expect(formContainer).toBeInTheDocument();
    });
  });

  describe('AC 5: Links and Buttons Are Properly Styled', () => {
    it('should have button with proper styling classes', () => {
      // 🔵 ARRANGE
      renderLoginPage();

      // 🟢 ACT
      const signInButton = screen.getByRole('button', { name: /sign in/i });

      // 🔴 ASSERT - Check button has styling classes (not just 'hover:')
      expect(signInButton).toHaveClass('bg-indigo-600');
      expect(signInButton).toHaveClass('text-white');
    });

    it('should have link with proper styling classes', () => {
      // 🔵 ARRANGE
      renderLoginPage();

      // 🟢 ACT
      const registerLink = screen.getByRole('link', { name: /register here/i });

      // 🔴 ASSERT - Check link has styling classes
      expect(registerLink).toHaveClass('text-indigo-600');
      expect(registerLink).toHaveClass('font-semibold');
    });

    it('should have heading with proper text color for accessibility', () => {
      // 🔵 ARRANGE
      renderLoginPage();

      // 🟢 ACT
      const heading = screen.getByRole('heading', { level: 1 });

      // 🔴 ASSERT - Check that text color class is applied (indicating proper contrast)
      expect(heading).toHaveClass('text-gray-800');
    });
  });
});
