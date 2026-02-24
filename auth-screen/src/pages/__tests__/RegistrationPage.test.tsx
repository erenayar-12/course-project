import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import RegistrationPage from '../RegistrationPage';

/**
 * RegistrationPage Test Suite
 *
 * Tests verify observable behavior of the registration page UI (AC2, AC3, AC4, AC5 from STORY-EPIC-1.1)
 * Focus: User sees registration form with email, password confirmation, and submit button
 */

describe('RegistrationPage', () => {
  const renderRegistrationPage = () => {
    return render(
      <Router>
        <RegistrationPage />
      </Router>
    );
  };

  describe('AC 2: Registration Page Displays Correctly', () => {
    it('should render heading with text "Register"', () => {
      // 🔵 ARRANGE
      renderRegistrationPage();

      // 🟢 ACT
      const heading = screen.getByRole('heading', { level: 1 });

      // 🔴 ASSERT
      expect(heading).toHaveTextContent(/register/i);
    });

    it('should render email input field with label', () => {
      // 🔵 ARRANGE
      renderRegistrationPage();

      // 🟢 ACT
      const emailInput = screen.getByLabelText(/email/i);

      // 🔴 ASSERT
      expect(emailInput).toBeInTheDocument();
      expect(emailInput).toHaveAttribute('type', 'email');
    });

    it('should render password input field with label', () => {
      // 🔵 ARRANGE
      renderRegistrationPage();

      // 🟢 ACT
      const passwordInput = screen.getByLabelText(/^password/i);

      // 🔴 ASSERT
      expect(passwordInput).toBeInTheDocument();
      expect(passwordInput).toHaveAttribute('type', 'password');
    });

    it('should render confirm password input field with label', () => {
      // 🔵 ARRANGE
      renderRegistrationPage();

      // 🟢 ACT
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

      // 🔴 ASSERT
      expect(confirmPasswordInput).toBeInTheDocument();
      expect(confirmPasswordInput).toHaveAttribute('type', 'password');
    });

    it('should render Create Account button', () => {
      // 🔵 ARRANGE
      renderRegistrationPage();

      // 🟢 ACT
      const createButton = screen.getByRole('button', { name: /create account/i });

      // 🔴 ASSERT
      expect(createButton).toBeInTheDocument();
      expect(createButton).toHaveClass('btn-primary');
    });

    it('should render link back to login page', () => {
      // 🔵 ARRANGE
      renderRegistrationPage();

      // 🟢 ACT
      const loginLink = screen.getByRole('link', { name: /sign in/i });

      // 🔴 ASSERT
      expect(loginLink).toBeInTheDocument();
      expect(loginLink).toHaveAttribute('href', '/login');
    });
  });

  describe('AC 4: Form Labels and Placeholders Are Clear', () => {
    it('should display email label', () => {
      // 🔵 ARRANGE
      renderRegistrationPage();

      // 🟢 ACT
      const emailLabel = screen.getByText(/email/i);

      // 🔴 ASSERT
      expect(emailLabel).toBeInTheDocument();
    });

    it('should display password label', () => {
      // 🔵 ARRANGE
      renderRegistrationPage();

      // 🟢 ACT
      const passwordLabel = screen.getByText(/^password/i);

      // 🔴 ASSERT
      expect(passwordLabel).toBeInTheDocument();
    });

    it('should display confirm password label', () => {
      // 🔵 ARRANGE
      renderRegistrationPage();

      // 🟢 ACT
      const confirmLabel = screen.getByText(/confirm password/i);

      // 🔴 ASSERT
      expect(confirmLabel).toBeInTheDocument();
    });

    it('should mark required fields with asterisk', () => {
      // 🔵 ARRANGE
      renderRegistrationPage();

      // 🟢 ACT
      const requiredMarkers = screen.getAllByText('*');

      // 🔴 ASSERT
      expect(requiredMarkers.length).toBeGreaterThan(0);
    });

    it('should have placeholder text on all inputs', () => {
      // 🔵 ARRANGE
      renderRegistrationPage();

      // 🟢 ACT
      const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
      const passwordInput = screen.getByLabelText(/^password/i) as HTMLInputElement;
      const confirmInput = screen.getByLabelText(/confirm password/i) as HTMLInputElement;

      // 🔴 ASSERT
      expect(emailInput.placeholder).toBeTruthy();
      expect(passwordInput.placeholder).toBeTruthy();
      expect(confirmInput.placeholder).toBeTruthy();
    });
  });

  describe('AC 3: Pages Are Fully Responsive', () => {
    it('should render form in responsive container', () => {
      // 🔵 ARRANGE
      renderRegistrationPage();

      // 🟢 ACT
      const { container } = renderRegistrationPage();
      const mainElement = container.firstChild;

      // 🔴 ASSERT - Check that form is in responsive container
      expect(mainElement).toHaveClass('responsive');
      expect(mainElement).toHaveClass('min-h-screen');
    });

    it('should have input fields with proper width constraints', () => {
      // 🔵 ARRANGE
      renderRegistrationPage();

      // 🟢 ACT
      const emailInput = screen.getByLabelText(/email/i) as HTMLElement;

      // 🔴 ASSERT - Check input has proper responsive styling
      expect(emailInput).toHaveClass('w-full');
      expect(emailInput).toHaveClass('px-4');
    });

    it('should have form container with max-width for desktop', () => {
      // 🔵 ARRANGE
      const { container } = renderRegistrationPage();

      // 🟢 ACT
      const formContainer = container.querySelector('.max-w-md');

      // 🔴 ASSERT
      expect(formContainer).toBeInTheDocument();
    });
  });

  describe('AC 5: Links and Buttons Are Properly Styled', () => {
    it('should have button with proper styling classes', () => {
      // 🔵 ARRANGE
      renderRegistrationPage();

      // 🟢 ACT
      const createButton = screen.getByRole('button', { name: /create account/i });

      // 🔴 ASSERT - Check button has styling classes
      expect(createButton).toHaveClass('bg-indigo-600');
      expect(createButton).toHaveClass('text-white');
    });

    it('should have link with proper styling classes', () => {
      // 🔵 ARRANGE
      renderRegistrationPage();

      // 🟢 ACT
      const loginLink = screen.getByRole('link', { name: /sign in/i });

      // 🔴 ASSERT - Check link has styling classes
      expect(loginLink).toHaveClass('text-indigo-600');
      expect(loginLink).toHaveClass('font-semibold');
    });

    it('should have heading with proper text color for accessibility', () => {
      // 🔵 ARRANGE
      renderRegistrationPage();

      // 🟢 ACT
      const heading = screen.getByRole('heading', { level: 1 });

      // 🔴 ASSERT - Check that heading has accessible color
      expect(heading).toHaveClass('text-gray-800');
    });
  });
});
