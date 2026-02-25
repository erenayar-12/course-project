import React, { createContext, useContext, useState } from 'react';

interface MockAuth0ContextType {
  loginWithRedirect: (options?: any) => Promise<void>;
  isLoading: boolean;
  error: null | { message: string };
}

const MockAuth0Context = createContext<MockAuth0ContextType | undefined>(undefined);

export const MockAuth0Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{ message: string } | null>(null);

  const loginWithRedirect = async (options?: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate login delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock successful login - just log and simulate
      console.log('Mock Auth0 login with:', options);
      
      // Store mock user info
      localStorage.setItem('mock_user', JSON.stringify({
        email: options?.authorizationParams?.login_hint || 'user@example.com',
        isAuthenticated: true,
        timestamp: new Date().toISOString(),
      }));
      
      // Show success message
      alert('✅ Login Successful!\n\nThis is a test/mock login. In production, you would be redirected to Auth0.');
    } catch (err) {
      setError({ message: 'Login failed' });
      console.error('Mock login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MockAuth0Context.Provider value={{ loginWithRedirect, isLoading, error }}>
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
