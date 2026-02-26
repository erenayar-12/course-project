/**
 * Navbar Component
 *
 * Main navigation bar with login status display and logout button.
 * Per STORY-EPIC-1.4 (RBAC) and STORY-EPIC-1.5 (Logout)
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useMockAuth0 } from '../context/MockAuth0Context';

const Navbar: React.FC = () => {
  const { user, logout } = useMockAuth0();

  return (
    <nav className="bg-indigo-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo/Brand */}
        <Link to="/" className="text-2xl font-bold hover:text-indigo-200 transition-colors">
          InnovatEPAM
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-6">
          {user && (
            <>
              {/* Dashboard Link */}
              <Link
                to="/dashboard"
                className="hover:text-indigo-200 transition-colors font-semibold"
              >
                Dashboard
              </Link>

              {/* Evaluation Queue Link - Only for evaluators and admins */}
              {(user.role === 'evaluator' || user.role === 'admin') && (
                <Link
                  to="/evaluation-queue"
                  className="hover:text-indigo-200 transition-colors font-semibold"
                >
                  Queue
                </Link>
              )}

              {/* User Info */}
              <div className="text-sm opacity-90">
                <span className="block">{user.email}</span>
                <span className="text-xs opacity-75">Role: {user.role}</span>
              </div>

              {/* Logout Button - AC1: User can click logout button */}
              <button
                onClick={() => logout()}
                className="bg-red-600 text-white px-4 py-2 rounded font-semibold hover:bg-red-700 transition-colors"
                aria-label="Logout"
              >
                Logout
              </button>
            </>
          )}

          {!user && (
            <>
              <Link to="/login" className="hover:text-indigo-200 transition-colors font-semibold">
                Login
              </Link>
              <Link
                to="/register"
                className="hover:text-indigo-200 transition-colors font-semibold"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
