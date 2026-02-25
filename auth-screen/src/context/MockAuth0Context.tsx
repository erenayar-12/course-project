import React, { createContext, useContext, useState, useEffect } from 'react';
import { ROLES, UserRole } from '../constants/roles';

interface UserData {
  email: string;
  isAuthenticated: boolean;
  role: UserRole;
  timestamp: string;
}

interface MockAuth0ContextType {
  loginWithRedirect: (options?: any) => Promise<void>;
  isLoading: boolean;
  error: null | { message: string };
  user: UserData | null;
  logout: () => void;
}

const MockAuth0Context = createContext<MockAuth0ContextType | undefined>(undefined);

export const MockAuth0Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{ message: string } | null>(null);
  const [user, setUser] = useState<UserData | null>(null);

  // Load user from localStorage on mount (AC1 - Role persists)
  useEffect(() => {
    const storedUser = localStorage.getItem('mock_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored user:', e);
      }
    }
  }, []);

  const loginWithRedirect = async (options?: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate login delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock Auth0 login with role assignment
      console.log('Mock Auth0 login with:', options);
      
      // Determine role based on email or default to SUBMITTER (AC1 - Default role is Submitter)
      let role: UserRole = ROLES.SUBMITTER;
      const email = options?.authorizationParams?.login_hint || 'user@example.com';
      
      if (email.includes('evaluator') || email.includes('eval')) {
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
      
      localStorage.setItem('mock_user', JSON.stringify(userData));
      setUser(userData);
      
      // Show success message with role
      alert(`✅ Login Successful!\n\nEmail: ${email}\nRole: ${role}\n\nThis is a test/mock login. In production, you would be redirected to Auth0.`);
    } catch (err) {
      setError({ message: 'Login failed' });
      console.error('Mock login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('mock_user');
    setUser(null);
    console.log('User logged out');
  };

  return (
    <MockAuth0Context.Provider value={{ loginWithRedirect, isLoading, error, user, logout }}>
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
