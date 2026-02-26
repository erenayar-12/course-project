import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { useMockAuth0 } from '../context/MockAuth0Context';

/**
 * LoginPage Component - Simplified Version
 * 
 * Displays a responsive login form using inline styles for maximum compatibility
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

    if (!formData.email || !formData.password) {
      setLocalError('Please enter both email and password.');
      return;
    }

    try {
      await loginWithRedirect({
        authorizationParams: {
          login_hint: formData.email,
        },
      });
    } catch (err) {
      setLocalError('Invalid email or password. Please try again.');
    }
  };

  const displayError = error || localError ? 'Invalid email or password. Please try again.' : null;

  return (
    <main style={{minHeight: '100vh', background: 'linear-gradient(to bottom right, #eff6ff, #e0e7ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'}}>
      <div style={{width: '100%', maxWidth: '28rem', background: 'white', borderRadius: '0.5rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', padding: '2rem'}}>
        {/* Heading */}
        <h1 style={{fontSize: '1.875rem', fontWeight: 'bold', textAlign: 'center', color: '#1f2937', marginBottom: '2rem'}}>
          Login
        </h1>

        {/* Error Message */}
        {displayError && (
          <div style={{marginBottom: '1.5rem', padding: '1rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.5rem', color: '#b91c1c'}}>
            <p style={{fontSize: '0.875rem'}}>{displayError}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
          {/* Email Field */}
          <div>
            <label htmlFor="email" style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem'}}>
              Email <span style={{color: '#ef4444'}}>*</span>
            </label>
            <input
              id="email"
              type="email"
              placeholder="admin@admin.com"
              required
              value={formData.email}
              onChange={handleInputChange}
              disabled={isLoading}
              style={{width: '100%', padding: '0.5rem 1rem', border: '2px solid #d1d5db', borderRadius: '0.5rem', fontSize: '1rem', outline: 'none', transition: 'all 200ms', opacity: isLoading ? 0.5 : 1, cursor: isLoading ? 'not-allowed' : 'text'}}
              onFocus={(e) => e.target.style.borderColor = '#4f46e5'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem'}}>
              Password <span style={{color: '#ef4444'}}>*</span>
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              required
              value={formData.password}
              onChange={handleInputChange}
              disabled={isLoading}
              style={{width: '100%', padding: '0.5rem 1rem', border: '2px solid #d1d5db', borderRadius: '0.5rem', fontSize: '1rem', outline: 'none', transition: 'all 200ms', opacity: isLoading ? 0.5 : 1, cursor: isLoading ? 'not-allowed' : 'text'}}
              onFocus={(e) => e.target.style.borderColor = '#4f46e5'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={isLoading}
            style={{width: '100%', padding: '0.75rem', background: '#4f46e5', color: 'white', fontWeight: '600', borderRadius: '0.5rem', border: 'none', cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.7 : 1, transition: 'all 200ms'}}
            onMouseEnter={(e) => !isLoading && (e.currentTarget.style.background = '#4338ca')}
            onMouseLeave={(e) => !isLoading && (e.currentTarget.style.background = '#4f46e5')}
          >
            {isLoading ? '⏳ Logging in...' : 'Sign In'}
          </button>
        </form>

        {/* Registration Link */}
        <div style={{marginTop: '1.5rem', textAlign: 'center'}}>
          <p style={{color: '#4b5563', fontSize: '0.875rem'}}>
            Don't have an account? <Link to="/register" style={{color: '#4f46e5', fontWeight: '600', textDecoration: 'none', cursor: 'pointer'}}>Register here</Link>
          </p>
        </div>

        {/* Test Credentials */}
        <div style={{marginTop: '2rem', padding: '1rem', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '0.5rem'}}>
          <p style={{fontSize: '0.75rem', fontWeight: '600', color: '#1e3a8a', marginBottom: '0.5rem'}}>📝 Test Credentials:</p>
          <div style={{display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.75rem', color: '#1e40af'}}>
            <p><strong>Admin:</strong> admin@admin.com (any password)</p>
            <p><strong>User:</strong> user@user.com (any password)</p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
