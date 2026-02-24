import { Link } from 'react-router-dom';
import React from 'react';

/**
 * LoginPage Component
 *
 * Displays a responsive login form with email and password inputs.
 * Follows STORY-EPIC-1.1 acceptance criteria for login page presentation.
 *
 * Features:
 * - Responsive design (mobile, tablet, desktop)
 * - WCAG AA accessible form elements
 * - Clear labels and required field markers
 * - Link to registration page
 */

const LoginPage: React.FC = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    // Form submission will be handled in next story (STORY-EPIC-1.2)
  };

  return (
    <main className="responsive min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        {/* Heading */}
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Login</h1>

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
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
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
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
              aria-label="Password"
            />
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="btn-primary w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors duration-200 active:scale-95"
          >
            Sign In
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
