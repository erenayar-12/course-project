# Authentication System Implementation Plan

**Based on:** AUTH-SYSTEM-SPEC.md + agents.md tech stack  
**Project:** EPAM Auth-Workflow System - EPIC-1  
**Created:** February 24, 2026  
**Status:** APPROVED FOR DEVELOPMENT  
**Constitution Compliance:** ✅ TypeScript Strict | Testing Pyramid (Jest 80%) | JSDoc Required

---

## 1. Executive Summary

This implementation plan details the step-by-step execution of the User Authentication System (EPIC-1) using the approved tech stack and design decisions. The plan is organized into 5 sprints (2-3 weeks total) with clear deliverables, testing requirements, and deployment gates.

**Tech Stack Used:**
- **Frontend:** React 18 + TypeScript (strict mode) + Vite
- **Backend:** Node.js v18+ + Express.js + TypeScript (strict mode)
- **Auth:** Auth0 + OAuth 2.0 + SAML 2.0
- **Database:** PostgreSQL + Prisma ORM
- **Testing:** Jest + React Testing Library (80% coverage target)
- **Code Quality:** ESLint + Prettier
- **UI:** Tailwind CSS + shadcn/ui components

---

## 2. Phase Overview

### Sprint Structure (MVP: 2.5 weeks)

```
Sprint 1 (Days 1-3):   Infrastructure & Auth0 Setup
Sprint 2 (Days 4-6):   Frontend Login/Register UI
Sprint 3 (Days 7-9):   Backend JWT & Middleware
Sprint 4 (Days 10-12): RBAC & Protected Routes
Sprint 5 (Days 13-14): Testing, Security Audit, Deploy
```

**Team Requirements:**
- 1 Frontend Developer (React/TypeScript)
- 1 Backend Developer (Node.js/Express)
- 1 DevOps/QA Engineer (Auth0 config, security, testing)

---

## 3. Sprint 1: Infrastructure & Auth0 Setup (Days 1-3)

### Objectives
- ✅ Set up development environment
- ✅ Configure Auth0 SAML provider for EPAM
- ✅ Create database schema (Users, Sessions, AuditLogs)
- ✅ Initialize Express.js API with TypeScript strict mode
- ✅ Set up monitoring and logging

### Deliverables

#### 3.1 Development Environment Setup

**Frontend Project Initialization:**
```bash
npm create vite@latest auth-screen -- --template react-ts
cd auth-screen
npm install
npm install -D tailwindcss postcss autoprefixer
npm install -D @types/react @types/react-dom typescript

# Install UI library
npm install @radix-ui/react-slot class-variance-authority clsx
npm install -D shadcn-ui

# Install auth libraries
npm install @auth0/auth0-react

# Install testing
npm install -D jest @testing-library/react @testing-library/jest-dom ts-jest @types/jest
npm init -y jest
```

**Backend Project Initialization:**
```bash
mkdir auth-api
cd auth-api
npm init -y
npm install express cors dotenv cookie-parser redis prisma
npm install -D typescript @types/node @types/express ts-node ts-loader
npm install -D jest @types/jest ts-jest supertest @types/supertest

# TypeScript setup
npx tsc --init
```

**TypeScript Configuration (strict mode):**
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "moduleResolution": "node",
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "declaration": true,
    "outDir": "./dist",
    "rootDir": "./src"
  }
}
```

**Testing Configuration (Jest):**
```typescript
// jest.config.ts
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/index.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

#### 3.2 Auth0 SAML Configuration

**Steps to Configure Auth0:**
1. Create Auth0 tenant (or use existing EPAM tenant)
2. Create Regular Web Application in Auth0 Dashboard
3. Configure SAML settings:
   ```
   Assertion Consumer Service (ACS) URL:
   https://localhost:3000/api/auth/callback  (dev)
   https://epam-innovation.internal/api/auth/callback  (prod)
   
   Single Logout URL:
   https://epam-innovation.internal/api/auth/logout
   ```

4. Add SAML provider (EPAM corporate):
   - Obtain IdP metadata URL from IT Security
   - Configure attribute mappings
   - Enable assertion signing

5. Create Auth0 Rules for role assignment:
   ```javascript
   // Role Assignment Rule
   function(user, context, callback) {
     const isEPAM = user.email.endsWith('@epam.com');
     
     if (!isEPAM) {
       return callback(new Error('Only EPAM employees'));
     }
     
     user.app_metadata = user.app_metadata || {};
     user.app_metadata.role = 'Submitter'; // Default
     
     const groups = user.app_metadata.groups || [];
     if (groups.includes('innovation-evaluators')) {
       user.app_metadata.role = 'Evaluator';
     }
     if (groups.includes('innovation-admins')) {
       user.app_metadata.role = 'Admin';
     }
     
     auth0.users.updateAppMetadata(user.user_id, user.app_metadata)
       .then(() => callback(null, user, context))
       .catch(err => callback(err));
   }
   ```

6. Document credentials in `.env.local`:
   ```env
   REACT_APP_AUTH0_DOMAIN=your-tenant.auth0.com
   REACT_APP_AUTH0_CLIENT_ID=xxxxx
   REACT_APP_AUTH0_AUDIENCE=https://epam-api.internal
   
   AUTH0_DOMAIN=your-tenant.auth0.com
   AUTH0_CLIENT_ID=xxxxx
   AUTH0_CLIENT_SECRET=xxxxx
   AUTH0_CALLBACK_URL=https://localhost:3000/api/auth/callback
   ```

**Testing & Validation:**
- [ ] Test SAML login flow in Auth0 sandbox
- [ ] Verify role assignment rule works
- [ ] Test callback returns valid ID token

#### 3.3 Database Schema

**Prisma Schema (`prisma/schema.prisma`):**
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String
  role      Role     @default(SUBMITTER)
  auth0Id   String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  sessions  Session[]
  auditLogs AuditLog[]
  
  @@index([email])
  @@index([auth0Id])
}

model Session {
  id            String   @id @default(uuid())
  userId        String
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  token         String   @unique
  deviceInfo    String?
  ipAddress     String?
  createdAt     DateTime @default(now())
  lastActivityAt DateTime @updatedAt
  expiresAt     DateTime
  
  @@index([userId])
  @@index([expiresAt])
}

model AuditLog {
  id        String        @id @default(uuid())
  userId    String
  user      User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  eventType AuthEventType
  details   String?
  ipAddress String?
  userAgent String?
  createdAt DateTime      @default(now())
  
  @@index([userId])
  @@index([eventType])
}

enum Role {
  SUBMITTER
  EVALUATOR
  ADMIN
}

enum AuthEventType {
  LOGIN_SUCCESS
  LOGIN_FAILURE
  LOGOUT
  TOKEN_REFRESH
  ROLE_CHANGED
}
```

**Database Setup:**
```bash
# Create PostgreSQL database
createdb epam_innovation_db

# Apply migrations
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate
```

#### 3.4 Express.js API Scaffold

**Project Structure:**
```
auth-api/src/
├── middleware/
│   ├── auth.ts           # JWT validation
│   ├── errorHandler.ts   # Error handling
│   └── cors.ts           # CORS setup
├── routes/
│   └── auth.ts           # Auth endpoints
├── services/
│   ├── authService.ts    # Auth logic
│   └── tokenService.ts   # JWT operations
├── types/
│   └── index.ts          # TypeScript interfaces
├── config/
│   ├── auth0.ts
│   └── database.ts
└── index.ts              # Express app entry
```

**Main Express App (`src/index.ts`):**
```typescript
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/auth';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Routes
app.use('/api/auth', authRoutes);

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Auth API listening on port ${PORT}`);
});

export default app;
```

#### 3.5 Testing Setup & CI/CD

**GitHub Actions Workflow (`.github/workflows/test.yml`):**
```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_DB: epam_test
          POSTGRES_PASSWORD: test
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - run: npm ci
      - run: npm run test:coverage
      - run: npm run lint
      - run: npm run type-check
```

**Jest Configuration for Both Frontend & Backend:**
```json
{
  "testMatch": ["**/__tests__/**/*.test.ts", "**/*.spec.ts"],
  "collectCoverage": true,
  "coveragePathIgnorePatterns": ["/node_modules/"],
  "coverageThreshold": {
    "global": {
      "branches": 80,
      "functions": 80,
      "lines": 80,
      "statements": 80
    }
  }
}
```

### Deliverables Checklist (Sprint 1)
- [ ] Frontend project initialized with React 18 + TypeScript strict
- [ ] Backend project initialized with Express + TypeScript strict
- [ ] Auth0 SAML configured with role assignment rules
- [ ] PostgreSQL database created with schema
- [ ] Prisma migrations applied
- [ ] Jest testing framework configured (80% target)
- [ ] ESLint + Prettier configured
- [ ] GitHub Actions CI/CD workflow created
- [ ] `.env` template created with all required variables
- [ ] Documentation: Setup guide for new developers

---

## 4. Sprint 2: Frontend Login/Register UI (Days 4-6)

### Objectives
- ✅ Create responsive login page
- ✅ Create responsive register page
- ✅ Integrate Auth0 login flow
- ✅ Build unit tests (70% of tests)

### Deliverables

#### 4.1 Auth Context Provider

**File:** `src/context/AuthContext.tsx`

```typescript
/**
 * AuthContext - Manages authentication state globally
 * 
 * Provides user info, loading state, and auth functions to all components.
 * Automatically checks for existing session on app load.
 * 
 * @example
 * const { user, isLoading, logout } = useAuth();
 */
import React, { createContext, useContext, useEffect, useState } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'Submitter' | 'Evaluator' | 'Admin';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include',
        });
        if (response.ok) {
          setUser(await response.json());
        }
      } catch (err) {
        console.error('Auth check failed:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const logout = async () => {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, error, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

**Tests:** `src/context/__tests__/AuthContext.test.tsx`
```typescript
describe('AuthContext', () => {
  test('should check auth status on mount', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith('/api/auth/me', expect.any(Object));
    });
  });
  
  test('should set user on successful auth check', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUser
    });
    
    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    await waitFor(() => {
      expect(getByTestId('user-email')).toHaveTextContent('user@epam.com');
    });
  });
});
```

#### 4.2 LoginPage Component

**File:** `src/pages/LoginPage.tsx`

```typescript
/**
 * LoginPage - Displays EPAM authentication interface
 * 
 * Redirects to Auth0 login on button click.
 * Shows loading state during authentication.
 * Displays error messages if login fails.
 * 
 * @component
 * @example
 * return <LoginPage />
 */
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  
  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleLogin = () => {
    window.location.href = `${process.env.REACT_APP_API_URL}/api/auth/login`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <div className="p-8">
          <h1 className="text-2xl font-bold text-center mb-8">EPAM Innovation</h1>
          
          <Button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? 'Redirecting...' : 'Login with EPAM'}
          </Button>
          
          <p className="text-center text-sm text-gray-600 mt-4">
            Use your corporate email to login
          </p>
        </div>
      </Card>
    </div>
  );
};
```

**Tests:** 70% test coverage minimum
```typescript
describe('LoginPage', () => {
  test('should render login button', () => {
    const { getByText } = render(<LoginPage />);
    expect(getByText('Login with EPAM')).toBeInTheDocument();
  });
  
  test('should redirect to dashboard if user already logged in', () => {
    const mockUser = { id: '123', email: 'user@epam.com', role: 'Submitter', name: 'User' };
    jest.spyOn(authModule, 'useAuth').mockReturnValue({ user: mockUser, isLoading: false });
    
    render(<LoginPage />);
    
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });
  
  test('should show loading state during authentication', () => {
    jest.spyOn(authModule, 'useAuth').mockReturnValue({ user: null, isLoading: true });
    
    const { getByText } = render(<LoginPage />);
    expect(getByText('Redirecting...')).toBeInTheDocument();
  });
});
```

#### 4.3 Auth Callback Handler

**File:** `src/pages/AuthCallback.tsx`

```typescript
/**
 * AuthCallback - Handles Auth0 redirect after successful authentication
 * 
 * Exchange authorization code for JWT token.
 * Store token in secure cookie via API.
 * Redirect to dashboard on success.
 * 
 * @component
 */
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader } from '../components/ui/loader';

export const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');

      if (!code || !state) {
        navigate('/login?error=invalid_callback');
        return;
      }

      try {
        const response = await fetch('/api/auth/callback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ code, state }),
        });

        if (response.ok) {
          navigate('/dashboard');
        } else {
          const error = await response.json();
          navigate(`/login?error=${error.message}`);
        }
      } catch (err) {
        navigate('/login?error=callback_failed');
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <Loader />
        <p className="mt-4 text-gray-600">Authenticating...</p>
      </div>
    </div>
  );
};
```

#### 4.4 Protected Route Component

**File:** `src/components/ProtectedRoute.tsx`

```typescript
/**
 * ProtectedRoute - Guards routes requiring authentication and specific roles
 * 
 * @component
 * @param {React.ReactNode} children - Route content
 * @param {string | string[]} requiredRoles - Role(s) required
 * @returns {React.ReactNode} Protected route or redirect
 */
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string | string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles,
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requiredRoles) {
    const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    if (!roles.includes(user.role)) {
      return <Navigate to="/unauthorized" />;
    }
  }

  return <>{children}</>;
};
```

**Tests:**
```typescript
describe('ProtectedRoute', () => {
  test('should show loading while checking auth', () => {
    jest.spyOn(authModule, 'useAuth').mockReturnValue({ 
      user: null, 
      isLoading: true 
    });
    
    const { getByText } = render(
      <ProtectedRoute><div>Protected</div></ProtectedRoute>
    );
    
    expect(getByText('Loading...')).toBeInTheDocument();
  });
  
  test('should redirect to login if not authenticated', () => {
    jest.spyOn(authModule, 'useAuth').mockReturnValue({ 
      user: null, 
      isLoading: false 
    });
    
    render(
      <ProtectedRoute><div>Protected</div></ProtectedRoute>
    );
    
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
  
  test('should render children if user has required role', () => {
    jest.spyOn(authModule, 'useAuth').mockReturnValue({ 
      user: { role: 'Evaluator' }, 
      isLoading: false 
    });
    
    const { getByText } = render(
      <ProtectedRoute requiredRoles="Evaluator">
        <div>Protected Content</div>
      </ProtectedRoute>
    );
    
    expect(getByText('Protected Content')).toBeInTheDocument();
  });
});
```

### Deliverables Checklist (Sprint 2)
- [ ] AuthContext provider with useAuth hook
- [ ] LoginPage component (responsive, mobile-first)
- [ ] AuthCallback handler for Auth0 redirect
- [ ] ProtectedRoute component for role-based access
- [ ] Unit tests for all components (70% coverage)
- [ ] UserMenu component with logout
- [ ] Error handling for failed logins
- [ ] Loading states and spinners
- [ ] Tailwind CSS styling applied
- [ ] shadcn/ui components integrated

---

## 5. Sprint 3: Backend JWT & Middleware (Days 7-9)

### Objectives
- ✅ Implement JWT generation and validation
- ✅ Create auth middleware with role refresh
- ✅ Set up Redis for token revocation
- ✅ Build unit tests (70% coverage)

### Deliverables

#### 5.1 JWT Token Service

**File:** `src/services/tokenService.ts`

```typescript
/**
 * TokenService - Handles JWT generation and validation
 * 
 * @example
 * const token = tokenService.generateToken(user);
 * const decoded = tokenService.verifyToken(token);
 */
import jwt from 'jsonwebtoken';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  roleCheckedAt: number;
  iat?: number;
  exp?: number;
}

export class TokenService {
  private readonly secret = process.env.JWT_SECRET!;
  private readonly expiresIn = '30m';

  /**
   * Generate JWT token for user
   * @param userId - User's unique identifier
   * @param email - User's email
   * @param role - User's role
   * @returns Signed JWT token
   */
  generateToken(userId: string, email: string, role: string): string {
    const payload: TokenPayload = {
      userId,
      email,
      role,
      roleCheckedAt: Math.floor(Date.now() / 1000),
    };

    return jwt.sign(payload, this.secret, {
      algorithm: 'HS256',
      expiresIn: this.expiresIn,
      issuer: 'epam-auth',
      subject: userId,
    });
  }

  /**
   * Verify and decode JWT token
   * @param token - JWT token to verify
   * @returns Decoded token payload
   * @throws Error if token invalid or expired
   */
  verifyToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, this.secret, {
        algorithms: ['HS256'],
      }) as TokenPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Token expired');
      }
      throw new Error('Invalid token');
    }
  }

  /**
   * Check if token needs role refresh (> 5 minutes old)
   * @param token - JWT token
   * @returns true if role should be refreshed from database
   */
  needsRoleRefresh(token: TokenPayload): boolean {
    const now = Math.floor(Date.now() / 1000);
    return now - token.roleCheckedAt > 5 * 60;
  }
}

export const tokenService = new TokenService();
```

**Tests:** `src/services/__tests__/tokenService.test.ts`
```typescript
describe('TokenService', () => {
  test('should generate valid JWT token', () => {
    const token = tokenService.generateToken('123', 'user@epam.com', 'Submitter');
    
    expect(token).toBeTruthy();
    expect(typeof token).toBe('string');
  });
  
  test('should verify valid token', () => {
    const token = tokenService.generateToken('123', 'user@epam.com', 'Submitter');
    const decoded = tokenService.verifyToken(token);
    
    expect(decoded.userId).toBe('123');
    expect(decoded.email).toBe('user@epam.com');
    expect(decoded.role).toBe('Submitter');
  });
  
  test('should reject expired token', () => {
    const expiredToken = jwt.sign(
      { userId: '123', email: 'user@epam.com', role: 'Submitter' },
      process.env.JWT_SECRET!,
      { expiresIn: '-1h' }
    );
    
    expect(() => tokenService.verifyToken(expiredToken)).toThrow('Token expired');
  });
  
  test('should detect when role refresh needed (> 5 min)', () => {
    const oldToken: TokenPayload = {
      userId: '123',
      email: 'user@epam.com',
      role: 'Submitter',
      roleCheckedAt: Math.floor(Date.now() / 1000) - 6 * 60,
    };
    
    expect(tokenService.needsRoleRefresh(oldToken)).toBe(true);
  });
});
```

#### 5.2 Auth Middleware

**File:** `src/middleware/auth.ts`

```typescript
/**
 * Authentication middleware - Validates JWT and attaches user context
 * 
 * Checks token revocation, refreshes role if needed, validates JWT.
 * 
 * @middleware
 * @throws 401 if token missing, revoked, invalid, or expired
 */
import { Request, Response, NextFunction } from 'express';
import { tokenService } from '../services/tokenService';
import { redisClient } from '../config/redis';
import { prisma } from '../config/database';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      res.status(401).json({ error: 'No authentication token' });
      return;
    }

    // Check revocation list
    const isRevoked = await redisClient.get(`revoked:${token}`);
    if (isRevoked) {
      res.status(401).json({ error: 'Token revoked' });
      return;
    }

    const decoded = tokenService.verifyToken(token);

    // Refresh role if > 5 minutes old
    if (tokenService.needsRoleRefresh(decoded)) {
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user) {
        res.status(401).json({ error: 'User not found' });
        return;
      }

      if (user.role !== decoded.role) {
        // Role changed - update cookie
        const newToken = tokenService.generateToken(user.id, user.email, user.role);
        res.cookie('jwt', newToken, {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
          maxAge: 30 * 60 * 1000,
        });
        decoded.role = user.role;
      }
    }

    req.user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};
```

#### 5.3 Rate Limiter Middleware

**File:** `src/middleware/rateLimiter.ts`

```typescript
/**
 * Rate limiter for login endpoint
 * 
 * Allows 5 login attempts per 15 minutes per email.
 * Uses Redis for distributed rate limiting.
 */
import { Request, Response, NextFunction } from 'express';
import { redisClient } from '../config/redis';

export const loginRateLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const email = req.body.email?.toLowerCase();

  if (!email) {
    res.status(400).json({ error: 'Email required' });
    return;
  }

  const key = `rate-limit:login:${email}`;
  const limit = 5;
  const windowMs = 15 * 60; // 15 minutes

  try {
    const attempts = await redisClient.incr(key);

    if (attempts === 1) {
      // First attempt - set expiry
      await redisClient.expire(key, windowMs);
    }

    if (attempts > limit) {
      res.status(429).json({
        error: 'Too many login attempts. Please try again later.',
        retryAfter: windowMs,
      });
      return;
    }

    next();
  } catch (error) {
    // If Redis fails, allow request to proceed
    console.error('Rate limiter error:', error);
    next();
  }
};
```

**Tests:**
```typescript
describe('loginRateLimiter', () => {
  test('should allow 5 login attempts per 15 minutes', async () => {
    for (let i = 0; i < 5; i++) {
      await loginRateLimiter(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalled();
    }
  });
  
  test('should reject 6th attempt with 429', async () => {
    for (let i = 0; i < 6; i++) {
      await loginRateLimiter(mockReq, mockRes, mockNext);
    }
    
    expect(mockRes.status).toHaveBeenCalledWith(429);
  });
});
```

#### 5.4 Auth Routes

**File:** `src/routes/auth.ts`

```typescript
/**
 * Authentication routes - Handles login, logout, token validation
 * 
 * POST /callback - Exchange Auth0 code for JWT
 * POST /logout - Invalidate session
 * GET /me - Get current user info
 */
import { Router } from 'express';
import { authCallback, logout, getMe } from '../controllers/authController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

/**
 * POST /api/auth/callback
 * 
 * Exchange Auth0 authorization code for JWT token.
 * Creates or updates user in database.
 * Sets HTTP-only Secure cookie.
 * 
 * @bodyparam {string} code - Authorization code from Auth0
 * @bodyparam {string} state - CSRF protection state value
 * @returns { token, user }
 * @throws 401 on invalid code or SAML provider unavailable
 */
router.post('/callback', authCallback);

/**
 * POST /api/auth/logout
 * 
 * Invalidates user session immediately.
 * Clears JWT cookie and adds token to revocation list (async).
 * 
 * @authentication Required
 * @returns { success: true }
 */
router.post('/logout', authMiddleware, logout);

/**
 * GET /api/auth/me
 * 
 * Returns current authenticated user information.
 * 
 * @authentication Required
 * @returns { id, email, role, createdAt }
 */
router.get('/me', authMiddleware, getMe);

export default router;
```

### Deliverables Checklist (Sprint 3)
- [ ] TokenService with JWT generation & validation
- [ ] AuthMiddleware with token revocation check
- [ ] Role refresh logic (every 5 min)
- [ ] Rate limiter middleware (5/15min per email)
- [ ] Auth routes with proper error handling
- [ ] Redis configured for token revocation
- [ ] Unit tests for middleware (70% coverage)
- [ ] Integration tests for auth routes
- [ ] Error logging implemented
- [ ] Performance monitoring added

---

## 6. Sprint 4: RBAC & Protected Routes (Days 10-12)

### Objectives
- ✅ Implement role-based access control
- ✅ Create protected routes by role
- ✅ Add role authorization middleware
- ✅ Build integration tests

### Deliverables

#### 6.1 Authorization Middleware

**File:** `src/middleware/authorize.ts`

```typescript
/**
 * Role authorization middleware - Restricts route access by role
 * 
 * @middleware
 * @param {string | string[]} requiredRoles - Role(s) required for access
 * @throws 403 if user does not have required role
 */
import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';

export const authorize = (requiredRoles: string | string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }

    next();
  };
};
```

#### 6.2 Protected Route Examples

**File:** `src/routes/evaluation.ts`

```typescript
/**
 * Evaluation routes - Restricted to Evaluator and Admin roles
 */
import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { getEvaluationQueue, approveIdea } from '../controllers/evaluationController';

const router = Router();

/**
 * GET /api/evaluation/queue
 * 
 * Get ideas pending evaluation.
 * Only Evaluators and Admins can access.
 * 
 * @authentication Required
 * @authorization Evaluator, Admin
 */
router.get(
  '/queue',
  authMiddleware,
  authorize(['Evaluator', 'Admin']),
  getEvaluationQueue
);

/**
 * PUT /api/evaluation/:ideaId/approve
 * 
 * Approve an idea.
 * Only Evaluators and Admins.
 */
router.put(
  '/:ideaId/approve',
  authMiddleware,
  authorize(['Evaluator', 'Admin']),
  approveIdea
);

export default router;
```

#### 6.3 Frontend Protected Components

**File:** `src/pages/Dashboard.tsx`

```typescript
/**
 * Dashboard - Role-based landing page
 * 
 * Routes users to appropriate feature based on role:
 * - Submitter → My Ideas
 * - Evaluator → Evaluation Queue
 * - Admin → Admin Panel
 */
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { SubmitterDashboard } from './SubmitterDashboard';
import { EvaluatorDashboard } from './EvaluatorDashboard';
import { AdminDashboard } from './AdminDashboard';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      {user.role === 'Submitter' && (
        <ProtectedRoute requiredRoles="Submitter">
          <SubmitterDashboard />
        </ProtectedRoute>
      )}
      
      {user.role === 'Evaluator' && (
        <ProtectedRoute requiredRoles="Evaluator">
          <EvaluatorDashboard />
        </ProtectedRoute>
      )}
      
      {user.role === 'Admin' && (
        <ProtectedRoute requiredRoles="Admin">
          <AdminDashboard />
        </ProtectedRoute>
      )}
    </div>
  );
};
```

**Tests:** `src/pages/__tests__/Dashboard.test.tsx`
```typescript
describe('Dashboard', () => {
  test('should show SubmitterDashboard for Submitter role', () => {
    jest.spyOn(authModule, 'useAuth')
      .mockReturnValue({ user: { role: 'Submitter' }, isLoading: false });
    
    const { getByText } = render(<Dashboard />);
    expect(getByText('My Ideas')).toBeInTheDocument();
  });
  
  test('should show EvaluatorDashboard for Evaluator role', () => {
    jest.spyOn(authModule, 'useAuth')
      .mockReturnValue({ user: { role: 'Evaluator' }, isLoading: false });
    
    const { getByText } = render(<Dashboard />);
    expect(getByText('Evaluation Queue')).toBeInTheDocument();
  });
});
```

### Deliverables Checklist (Sprint 4)
- [ ] Authorization middleware implemented
- [ ] Protected routes by role (Evaluator, Admin)
- [ ] Role-based frontend navigation
- [ ] Dashboard component routes users by role
- [ ] Integration tests for RBAC
- [ ] Error handling for unauthorized access
- [ ] Audit logging for authorization failures
- [ ] Documentation: Role definitions and permissions

---

## 7. Sprint 5: Testing, Security Audit & Deployment (Days 13-14)

### Objectives
- ✅ Achieve 80% test coverage
- ✅ Security audit & penetration testing
- ✅ Performance testing
- ✅ Production deployment

### Deliverables

#### 7.1 Testing Coverage

**Coverage Target Breakdown:**
- Unit Tests (70%): 100+ test cases
- Integration Tests (20%): 20+ test cases  
- E2E Tests (10%): 5-10 critical user journeys

**Coverage Report:**
```bash
npm run test:coverage

=============|=======|=======|=======|=======|
File         | % Cov | Stmts | Brch  | Funcs | Lines |
=============|=======|=======|=======|=======|
auth.ts      | 85.2% | 100   | 90    | 88    | 85    |
tokenService | 92.1% | 50    | 95    | 100   | 92    |
middleware   | 88.5% | 130   | 85    | 90    | 88    |
=============|=======|=======|=======|=======|
ALL          | 87.6% | 280   | 88    | 92    | 87    |
```

#### 7.2 Security Audit Checklist

- [ ] OWASP Top 10 review
- [ ] JWT token security verified
- [ ] Cookie flags checked (HttpOnly, Secure, SameSite)
- [ ] CORS properly configured
- [ ] SQL injection prevention (Prisma ORM)
- [ ] XSS prevention (React auto-escaping)
- [ ] CSRF protection with state parameter
- [ ] Rate limiting active
- [ ] HTTPS enforced
- [ ] Sensitive data not logged
- [ ] Dependencies scanned for vulnerabilities
- [ ] Security headers configured (CSP, HSTS, X-Frame-Options)

#### 7.3 Performance Testing

**Load Test with Jest:**
```typescript
describe('Performance Tests', () => {
  test('token validation should be < 10ms', () => {
    const token = tokenService.generateToken('123', 'user@epam.com', 'Submitter');
    
    const start = performance.now();
    tokenService.verifyToken(token);
    const duration = performance.now() - start;
    
    expect(duration).toBeLessThan(10);
  });
  
  test('logout should respond in < 5ms', async () => {
    const start = performance.now();
    await logoutRoute(mockReq, mockRes);
    const duration = performance.now() - start;
    
    expect(duration).toBeLessThan(5);
  });
});
```

#### 7.4 Production Deployment

**Deployment Checklist (Kubernetes/Docker):**
```bash
# Build Docker image
docker build -t epam-auth-api:1.0 .

# Push to registry
docker push ${REGISTRY}/epam-auth-api:1.0

# Deploy to Kubernetes
kubectl apply -f k8s/deployment.yaml

# Verify deployment
kubectl rollout status deployment/epam-auth-api

# Monitor
kubectl logs -f deployment/epam-auth-api
```

**Environment Variables (Production):**
```env
# Security
JWT_SECRET=<randomly-generated-256-bit-key>
CORS_ORIGIN=https://epam-innovation.internal

# Database
DATABASE_URL=postgresql://user:pass@prod-db:5432/epam_prod

# Auth0
AUTH0_DOMAIN=epam.auth0.com
AUTH0_CLIENT_ID=prod_client_id
AUTH0_CLIENT_SECRET=<vault-secret>

# Redis
REDIS_URL=redis://prod-redis:6379

# Monitoring
SENTRY_DSN=<sentry-url>
LOG_LEVEL=info
```

### Deliverables Checklist (Sprint 5)
- [ ] 80% test coverage achieved
- [ ] All Jest tests passing
- [ ] Security audit completed
- [ ] Performance targets met
- [ ] CI/CD pipeline green
- [ ] Staging environment tested
- [ ] Production deployment successful
- [ ] Monitoring and alerting active
- [ ] Documentation complete
- [ ] Team training completed

---

## 8. Implementation Timeline

```
Week 1:
Mon-Wed (Sprint 1): Infrastructure setup, Auth0 config, DB schema
Thu-Fri (Sprint 2): Frontend UI components

Week 2:
Mon-Wed (Sprint 3): Backend JWT, middleware, routes
Thu-Fri (Sprint 4): RBAC, protected routes

Week 3:
Mon-Tue (Sprint 5): Testing, security audit
Wed-Fri (Deployment): Production deployment & monitoring
```

---

## 9. Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Auth0 SAML misconfigured | HIGH | Early validation with IT Security, use sandbox first |
| Rate limiting too aggressive | MEDIUM | Monitor false positives, adjust limits in real-time |
| Database connection issues | MEDIUM | Connection pooling, retry logic, fallback endpoints |
| JWT token expiry edge cases | MEDIUM | Comprehensive testing, token refresh implementation |
| Poor test coverage | HIGH | Enforce 80% minimum, block merge without coverage |

---

## 10. Success Criteria

✅ **Development Complete:**
- All 5 sprints delivered on time
- 80% test coverage achieved
- Zero critical security vulnerabilities
- <5ms logout response time
- <500ms login response time

✅ **Quality Assurance:**
- All Jest tests passing
- ESLint/Prettier checks green
- Security audit approved
- Performance targets met

✅ **Deployment:**
- Production environment stable
- Monitoring and alerts active
- Team trained and ready
- Documentation complete

---

**Plan Version:** 1.0  
**Status:** ✅ READY FOR EXECUTION  
**Tech Stack:** React 18 + Node.js + Express + PostgreSQL + Jest  
**Approved Date:** February 24, 2026  
**Constitution Alignment:** ✅ TypeScript Strict | Jest 80% | JSDoc Required
