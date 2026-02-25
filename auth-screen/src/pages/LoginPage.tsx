import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { useMockAuth0 } from '../context/MockAuth0Context';

/**
 * LoginPage Component
 *
 * Displays a responsive login form with email and password inputs.
 * Integrates Auth0 authentication (STORY-EPIC-1.2).
 *
 * Features:
 * - Responsive design (mobile, tablet, desktop)
 * - WCAG AA accessible form elements
 * - Auth0 integration for secure login
 * - Error message display
 * - Loading state during authentication
 * - Link to registration page
 */

interface LoginFormData {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const { loginWithRedirect, isLoading, error } = useMockAuth0();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [localError, setLocalError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { id, value } = e.currentTarget;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
    setLocalError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    // Basic validation
    if (!formData.email || !formData.password) {
      setLocalError('Please enter both email and password.');
      return;
    }

    try {
      // Send login request to Auth0
      await loginWithRedirect({
        authorizationParams: {
          login_hint: formData.email,
        },
      });
    } catch (err) {
      // Generic error message for security (AC 2)
      setLocalError('Invalid email or password. Please try again.');
    }
  };

  const displayError = error || localError ? 'Invalid email or password. Please try again.' : null;

  return (
    <main className="responsive min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        {/* Heading */}
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Login</h1>

        {/* Error Message Display (AC 2) */}
        {displayError && (
          <div
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
            role="alert"
            aria-live="polite"
          >
            <p className="text-sm text-red-700">{displayError}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              required
              value={formData.email}
              onChange={handleInputChange}
              disabled={isLoading}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
              aria-label="Email"
            />
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              required
              value={formData.password}
              onChange={handleInputChange}
              disabled={isLoading}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
              aria-label="Password"
            />
          </div>

          {/* Sign In Button with Loading State (AC 5) */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors duration-200 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="inline-block animate-spin">⏳</span>
                Logging in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Registration Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-indigo-600 font-semibold hover:text-indigo-700 hover:underline transition-colors"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
