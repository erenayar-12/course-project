import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { ROLES, UserRole } from '../constants/roles';

interface UserData {
  email: string;
  isAuthenticated: boolean;
  role: UserRole;
  timestamp: string;
}

interface LoginOptions {
  authorizationParams?: {
    login_hint?: string;
    screen_hint?: string;
  };
}

interface MockAuth0ContextType {
  loginWithRedirect: (options?: LoginOptions) => Promise<void>;
  isLoading: boolean;
  error: null | { message: string };
  user: UserData | null;
  logout: () => void;
  getToken: () => string | null;
}

const MockAuth0Context = createContext<MockAuth0ContextType | undefined>(undefined);

// Generate a mock JWT token (for testing - not cryptographically secure)
const generateMockToken = (email: string, role: UserRole): string => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({
      sub: email, // Auth0 compatible subject claim
      email,
      role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 86400, // 24 hours
    })
  );
  const signature = btoa('mock-signature');
  return `${header}.${payload}.${signature}`;
};

export const MockAuth0Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{ message: string } | null>(null);
  const [user, setUser] = useState<UserData | null>(null);

  // Load user from localStorage on mount (AC1 - Role persists)
  useEffect(() => {
    const storedUser = localStorage.getItem('mock_user');
    const storedToken = localStorage.getItem('auth_token');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Failed to parse stored user:', e);
      }
    }
  }, []);

  const loginWithRedirect = useCallback(async (options?: LoginOptions) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate login delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock Auth0 login with role assignment
      // eslint-disable-next-line no-console
      console.log('Mock Auth0 login with:', options);

      // Determine role based on email or default to SUBMITTER (AC1 - Default role is Submitter)
      let role: UserRole = ROLES.SUBMITTER;
      const email = options?.authorizationParams?.login_hint || 'user@example.com';

      // Dummy credentials for testing
      if (email === 'admin@admin.com') {
        role = ROLES.ADMIN;
      } else if (email === 'user@user.com') {
        role = ROLES.SUBMITTER;
      } else if (email.includes('evaluator') || email.includes('eval')) {
        role = ROLES.EVALUATOR;
      } else if (email.includes('admin')) {
        role = ROLES.ADMIN;
      }

      // Store user info with role
      const userData: UserData = {
        email,
        isAuthenticated: true,
        role,
        timestamp: new Date().toISOString(),
      };

      // Generate and store mock token
      const token = generateMockToken(email, role);
      localStorage.setItem('mock_user', JSON.stringify(userData));
      localStorage.setItem('auth_token', token);
      setUser(userData);

      // Show success message with role
      // eslint-disable-next-line no-console
      console.log('Mock login successful:', email, role);
    } catch (err) {
      setError({ message: 'Login failed' });
      // eslint-disable-next-line no-console
      console.error('Mock login error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    // AC2: Logout clears all auth data
    localStorage.removeItem('mock_user');
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_user');
    setUser(null);
    setError(null);

    // eslint-disable-next-line no-console
    console.log('User logged out');

    // Redirect to login page (AC1: User is redirected to login)
    window.location.href = '/login?logout=true';
  }, []);

  const getToken = useCallback((): string | null => {
    return localStorage.getItem('auth_token');
  }, []);

  // Memoize context value to prevent unnecessary re-renders of consumers
  const contextValue = useMemo(
    () => ({ loginWithRedirect, isLoading, error, user, logout, getToken }),
    [loginWithRedirect, isLoading, error, user, logout, getToken]
  );

  return (
    <MockAuth0Context.Provider value={contextValue}>
      {children}
    </MockAuth0Context.Provider>
  );
};

export const useMockAuth0 = () => {
  const context = useContext(MockAuth0Context);
  if (!context) {
    throw new Error('useMockAuth0 must be used within MockAuth0Provider');
  }
  return context;
};
