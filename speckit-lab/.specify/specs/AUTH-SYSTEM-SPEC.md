# User Authentication System Specification

**Based on:** EPIC-1: User Authentication & Role-Based Access  
**Project:** EPAM Auth-Workflow System  
**Created:** February 24, 2026  
**Status:** SPECIFICATION  
**Constitution Compliance:** ✅ TypeScript Strict | Testing Pyramid | JSDoc Required

---

## 1. Executive Summary

This specification defines the complete implementation of a secure user authentication and role-based access control (RBAC) system for the EPAM innovation platform. The system enables:

- **Secure Authentication:** Corporate credential verification via Auth0/SAML
- **Role-Based Access:** Feature-level authorization (Submitter vs. Evaluator/Admin)
- **Session Management:** Secure JWT token handling with automatic timeout
- **Audit Trail:** Complete authentication event logging

**Expected Outcomes:**
- 70% employee registration within 60 days
- Zero unauthorized access incidents
- <100ms authentication response time

---

## 2. System Architecture

### 2.1 High-Level Architecture

```
┌─────────────────┐
│  React Frontend │─── HTTPS ───┐
│  (Login Forms)  │             │
└─────────────────┘             │
                                ▼
                        ┌─────────────────┐
                        │  Express.js API │
                        │  (Auth Routes)  │
                        └─────────────────┘
                                │
                    ┌──────────┬─┴──────────┐
                    ▼          ▼           ▼
            ┌──────────────┐  ┌────────┐  ┌──────────┐
            │  Auth0 SAML  │  │ JWT    │  │PostgreSQL│
            │  Provider    │  │ Tokens │  │ Users DB │
            └──────────────┘  └────────┘  └──────────┘
```

### 2.2 Authentication Flow

**Login Sequence:**
1. User navigates to `/login`
2. React component redirects to Auth0 login page
3. Auth0 validates credentials against SAML provider
4. Auth0 returns authorization token to callback URL
5. Backend exchanges token for JWT
6. JWT stored in HTTP-only Secure cookie
7. User redirected to dashboard

**Request with Authentication:**
1. Browser includes JWT cookie with each request
2. Express middleware validates JWT signature
3. Middleware decodes claims (userId, role)
4. Middleware attaches user context to request
5. Route handler processes authenticated request

---

## 3. Technology Stack

| Layer | Technology | Strict Mode | Notes |
|-------|-----------|---|---|
| **Frontend** | React 18 + TypeScript | `strict: true` | Vite build tool |
| **Backend** | Node.js v18+ + Express | `strict: true` | JWT middleware |
| **Auth** | Auth0 + SAML 2.0 | N/A | Corporate provider |
| **Database** | PostgreSQL + Prisma | `strict: true` | ORM for type safety |
| **Testing** | Jest + React Testing Library | N/A | 80% coverage target |

---

## 4. Component Specifications

### 4.1 Frontend Components

#### LoginPage Component

**File:** `src/pages/LoginPage.tsx`

```typescript
/**
 * LoginPage - Displays EPAM authentication interface
 * 
 * Features:
 * - Responsive design (mobile-first)
 * - Auth0 login redirect
 * - Loading state during authentication
 * - Error message display
 * - Forgot password link
 * 
 * @component
 * @example
 * return <LoginPage />
 */
export const LoginPage: React.FC = () => {
  // Redirect to Auth0 login
  // Show loading state
  // Handle authentication errors
}
```

**Requirements:**
- Must redirect unauthenticated users
- Accept `?returnTo=` query parameter for post-login redirect
- Display 401 Unauthorized errors clearly
- Support "Remember Me" checkbox (optional, Phase 2)

**Testing (80% coverage target):**
- Unit: Component renders correctly (3 tests)
- Unit: Redirect URLs are constructed properly (2 tests)
- Integration: Auth0 redirect happens on button click (1 test)
- E2E: Full login flow completes successfully (1 test)

---

#### ProtectedRoute Component

**File:** `src/components/ProtectedRoute.tsx`

```typescript
/**
 * ProtectedRoute - Guards routes requiring authentication and specific roles
 * 
 * @component
 * @param {ReactNode} children - Route content to display if authorized
 * @param {string | string[]} requiredRoles - Role(s) required for access
 * @returns {ReactNode} Protected route or redirect to login
 * 
 * @example
 * <ProtectedRoute requiredRoles="Evaluator">
 *   <EvaluationQueue />
 * </ProtectedRoute>
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles,
}) => {
  // Check authentication status
  // Verify user role
  // Redirect to login if needed
  // Show unauthorized message if insufficient role
}
```

**Logic:**
- Check if JWT exists in cookies
- Decode JWT and extract `role` claim
- Verify role includes `requiredRoles`
- Redirect to login if auth missing
- Redirect to `/unauthorized` if role insufficient

---

#### UserMenu Component

**File:** `src/components/UserMenu.tsx`

```typescript
/**
 * UserMenu - Displays authenticated user info and logout option
 * 
 * @component
 * @returns {ReactNode} User menu dropdown
 * 
 * @example
 * return <UserMenu />
 */
export const UserMenu: React.FC = () => {
  const { user, logout } = useAuth();
  
  return (
    // Display user name, role badge
    // Logout button
    // Settings link (optional)
  );
}
```

**Features:**
- Display user's email and role
- Color-coded role badges (Submitter=blue, Evaluator=orange, Admin=red)
- Logout button that clears session
- Optional: Settings/profile link

---

### 4.2 Backend Routes

#### POST /api/auth/callback

**Purpose:** Exchange Auth0 authorization code for JWT

```typescript
/**
 * Auth callback - Handles Auth0 redirect after successful authentication
 * 
 * @route POST /api/auth/callback
 * @bodyparam {string} code - Authorization code from Auth0
 * @bodyparam {string} state - State parameter for CSRF protection
 * 
 * @returns {object} { token: string, user: { id, email, role } }
 * 
 * @throws {AuthenticationError} 401 - Invalid code or expired
 * @throws {ValidationError} 400 - Missing required parameters
 * 
 * @example
 * POST /api/auth/callback
 * { "code": "abc123", "state": "xyz789" }
 * → { "token": "eyJhbGc...", "user": { ... } }
 */
router.post('/callback', async (req: AuthRequest, res: AuthResponse) => {
  // Validate state parameter (CSRF protection)
  // Exchange code with Auth0 for ID token
  // Extract user info from ID token
  // Look up or create user in database
  // Assign role (default: Submitter)
  // Generate JWT with user claims
  // Set HTTP-only Secure cookie
  // Return user data + JWT
})
```

**Error Handling:**
- Invalid state → 400 Bad Request
- Code expired → 401 Unauthorized
- User not in EPAM domain → 403 Forbidden

---

#### GET /api/auth/me

**Purpose:** Return current authenticated user info

```typescript
/**
 * Get current user - Returns authenticated user information
 * 
 * @route GET /api/auth/me
 * @authentication Required - JWT cookie
 * 
 * @returns {object} { id, email, role, createdAt }
 * 
 * @throws {AuthenticationError} 401 - No valid JWT
 * 
 * @example
 * GET /api/auth/me
 * Headers: { Cookie: "jwt=eyJhbGc..." }
 * → { "id": "user_123", "email": "user@epam.com", "role": "Submitter" }
 */
router.get('/me', authMiddleware, async (req: AuthRequest, res: AuthResponse) => {
  // Extract user from request context (added by authMiddleware)
  // Return user object
})
```

**Response Schema:**
```typescript
interface User {
  id: string;
  email: string;
  role: 'Submitter' | 'Evaluator' | 'Admin';
  createdAt: Date;
}
```

---

#### POST /api/auth/logout

**Purpose:** Invalidate user session

```typescript
/**
 * Logout - Invalidates user session and clears authentication token
 * 
 * @route POST /api/auth/logout
 * @authentication Required - JWT cookie
 * 
 * @returns {object} { success: true }
 * 
 * @example
 * POST /api/auth/logout
 * → { "success": true }
 */
router.post('/logout', authMiddleware, async (req: AuthRequest, res: AuthResponse) => {
  // Clear JWT cookie (set max-age: 0)
  // Optionally: Add token to revocation list
  // Return success response
})
```

**Implementation:**
- Clear cookie by setting `Set-Cookie: jwt=; Max-Age=0; HttpOnly; Secure; Path=/`
- Optional: Add JWT to Redis revocation set (for immediate invalidation)

---

### 4.3 Express Middleware

#### Auth Middleware

**File:** `src/middleware/auth.ts`

```typescript
/**
 * Authentication middleware - Validates JWT and attaches user context
 * 
 * Validates JWT signature and expiration. Rejects requests with invalid or expired tokens.
 * Attaches decoded user information to `req.user`.
 * 
 * @middleware
 * @param {Request} req - Express request with JWT cookie
 * @param {Response} res - Express response
 * @param {NextFunction} next - Next middleware in chain
 * 
 * @throws {AuthenticationError} 401 - No valid JWT, invalid signature, or expired
 * 
 * @example
 * app.use('/api/protected', authMiddleware);
 */
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token: string = req.cookies.jwt;
    
    if (!token) {
      throw new AuthenticationError('No authentication token provided', 401);
    }
    
    const decoded: DecodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET!,
      { algorithms: ['HS256'] }
    );
    
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };
    
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ error: 'Token expired' });
    } else if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ error: 'Invalid token' });
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  }
}
```

**Key Features:**
- Validates JWT signature using HS256 algorithm
- Checks token expiration (reject if expired)
- Attaches user context to `req.user`
- Enforces HTTPS (optional in dev, required in prod)

---

#### Role Authorization Middleware

**File:** `src/middleware/authorize.ts`

```typescript
/**
 * Role authorization middleware - Restricts route access by role
 * 
 * @middleware
 * @param {string | string[]} requiredRoles - Role(s) required for access
 * @returns {Function} Middleware function
 * 
 * @throws {AuthorizationError} 403 - User does not have required role
 * 
 * @example
 * app.delete('/api/ideas/:id', authorize('Admin'), deleteIdea);
 */
export const authorize = (requiredRoles: string | string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
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
  }
}
```

**Usage Examples:**
```typescript
// Single role
app.delete('/api/ideas/:id', authMiddleware, authorize('Admin'), destroyIdea);

// Multiple roles allowed
app.post('/api/ideas/:id/approve', authMiddleware, authorize(['Evaluator', 'Admin']), approveIdea);
```

---

### 4.4 Database Schema

#### Users Table

**File:** `prisma/schema.prisma`

```prisma
/**
 * User model for authentication and authorization
 * 
 * Stores user account information, role assignment, and session metadata.
 * All users default to "Submitter" role unless explicitly changed to "Evaluator" or "Admin".
 */
model User {
  /// Unique user identifier (UUID)
  id String @id @default(uuid())
  
  /// Corporate email address (unique, indexed for login)
  email String @unique
  
  /// User's full name from Auth0
  name String
  
  /// User's role in the system
  /// @default "Submitter" - Regular user can submit ideas
  role Role @default(SUBMITTER)
  
  /// Auth0 unique identifier
  auth0Id String @unique
  
  /// Timestamp when user first registered
  createdAt DateTime @default(now()) @db.Timestamp()
  
  /// Timestamp of last update
  updatedAt DateTime @updatedAt @db.Timestamp()
  
  /// Last login timestamp (optional, for analytics)
  lastLoginAt DateTime? @db.Timestamp()
  
  /// Relations
  ideas Idea[]
  evaluations Evaluation[]
  auditLogs AuditLog[]
  
  @@index([email])
  @@index([auth0Id])
  @@index([role])
}

/// Enumeration of valid user roles
enum Role {
  SUBMITTER
  EVALUATOR
  ADMIN
}
```

**Indexes:**
- `email` - For quick user lookup during login
- `auth0Id` - For matching Auth0 profile to database user
- `role` - For filtering evaluators/admins

---

#### Audit Log Table

**File:** `prisma/schema.prisma`

```prisma
/**
 * AuditLog model for authentication event tracking
 * 
 * Records all authentication events (login, logout, role changes) for security auditing.
 */
model AuditLog {
  /// Unique audit log identifier
  id String @id @default(uuid())
  
  /// User who performed the action
  userId String
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  /// Type of authentication event
  eventType AuthEventType
  
  /// Event details (success/failure reason)
  details String?
  
  /// IP address of the request
  ipAddress String?
  
  /// User agent (browser info)
  userAgent String?
  
  /// Event timestamp
  createdAt DateTime @default(now()) @db.Timestamp()
  
  @@index([userId])
  @@index([eventType])
  @@index([createdAt])
}

/// Types of authentication events to log
enum AuthEventType {
  LOGIN_SUCCESS
  LOGIN_FAILURE
  LOGOUT
  TOKEN_REFRESH
  ROLE_CHANGED
  PASSWORD_RESET
}
```

---

## 5. Security Implementation

### 5.1 JWT Token Configuration

```typescript
/**
 * JWT Claims Structure
 * @typedef {Object} TokenClaims
 * @property {string} userId - User's unique identifier
 * @property {string} email - User's email address
 * @property {Role} role - User's role (Submitter|Evaluator|Admin)
 * @property {number} iat - Issued At timestamp (seconds since epoch)
 * @property {number} exp - Expiration time (15 min for access token)
 * @property {string} iss - Issuer (your app domain)
 * @property {string} sub - Subject (userId)
 */

// Token generation
const token = jwt.sign(
  {
    userId: user.id,
    email: user.email,
    role: user.role,
  },
  process.env.JWT_SECRET!,
  {
    algorithm: 'HS256',
    expiresIn: '15m', // Short-lived access token
    issuer: 'https://epam.auth-system.internal',
    subject: user.id,
  }
);
```

### 5.2 Cookie Configuration

```typescript
/**
 * HTTP-Only Secure Cookie Configuration
 * 
 * Prevents XSS attacks by making cookie inaccessible to JavaScript.
 * Prevents CSRF by sending only on same-site requests.
 * Prevents MITM by enforcing HTTPS.
 */
res.cookie('jwt', token, {
  httpOnly: true,      // Not accessible via document.cookie
  secure: true,        // Only sent over HTTPS
  sameSite: 'strict',  // Only sent with same-site requests
  domain: '.epam.com', // Only sent to EPAM domain
  path: '/',           // Sent with all requests
  maxAge: 15 * 60 * 1000, // 15 minutes
});
```

### 5.3 CSRF Protection

```typescript
/**
 * CSRF Token Middleware
 * 
 * Validates state parameter in Auth0 callback to prevent CSRF attacks.
 * State value must match session state or be stored in secure cookie.
 */
export const verifyCsrfState = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { state } = req.body;
  const sessionState = req.session.auth.state;
  
  if (state !== sessionState) {
    throw new AuthenticationError('Invalid CSRF state', 401);
  }
  
  next();
}
```

---

## 6. User Stories & Implementation

### Story 1.1: Display Login Page (2 points)

**Description:** Create responsive login UI that redirects to Auth0

**Acceptance Criteria:**
- [ ] Login form displays "Email" and "Password" fields
- [ ] Form is responsive (mobile, tablet, desktop)
- [ ] Submit button redirects to Auth0 login URL
- [ ] Loading spinner shows during redirect
- [ ] Error messages display if Auth0 is unavailable

**Implementation:**
```typescript
// src/pages/LoginPage.tsx
export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginWithRedirect, isLoading } = useAuth0();
  
  const handleLogin = async () => {
    await loginWithRedirect();
  };
  
  return (
    <div className="login-container">
      <Card title="EPAM Authentication">
        <Button 
          onClick={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? 'Redirecting...' : 'Login with EPAM'}
        </Button>
      </Card>
    </div>
  );
}
```

**Testing:**
- Unit: Component renders with "Login with EPAM" button
- Unit: Button click triggers loginWithRedirect
- Unit: Loading state displays during redirect
- E2E: Complete login flow redirects to Auth0

---

### Story 1.2: Integrate Auth0 OAuth (3 points)

**Description:** Configure Auth0 and implement OAuth flow

**Acceptance Criteria:**
- [ ] Auth0 SAML provider configured
- [ ] Login redirects to Auth0 login page
- [ ] Auth0 callback returns authorization code
- [ ] Backend exchanges code for ID token
- [ ] User is created/updated in database

**Configuration:**
```typescript
// .env
REACT_APP_AUTH0_DOMAIN=epam.auth0.com
REACT_APP_AUTH0_CLIENT_ID=xxxxx
REACT_APP_AUTH0_AUDIENCE=https://epam-api.com

// App setup
const auth0Provider = new Auth0Provider({
  domain: process.env.REACT_APP_AUTH0_DOMAIN!,
  clientId: process.env.REACT_APP_AUTH0_CLIENT_ID!,
  redirectUri: `${window.location.origin}/auth/callback`,
  audience: process.env.REACT_APP_AUTH0_AUDIENCE,
  scope: 'openid profile email',
});
```

---

### Story 1.3: JWT Token Storage (3 points)

**Description:** Implement secure JWT storage in HTTP-only cookies

**Acceptance Criteria:**
- [ ] JWT stored in HTTP-only Secure cookie
- [ ] Cookie includes SameSite=Strict flag
- [ ] Token includes userId, email, role claims
- [ ] Token expires after 15 minutes
- [ ] Refresh token mechanism implemented (optional Phase 2)

---

### Story 1.4: Role-Based Access Control (3 points)

**Description:** Implement RBAC for Submitter vs Evaluator/Admin

**Acceptance Criteria:**
- [ ] ProtectedRoute component restricts by role
- [ ] Submitter can only access /ideas/my-ideas
- [ ] Evaluator can access /evaluation-queue
- [ ] Admin can access /admin-panel
- [ ] Unauthorized users redirected to /unauthorized

---

### Story 1.5: Logout & Session Timeout (2 points)

**Description:** Implement logout and automatic session termination

**Acceptance Criteria:**
- [ ] Logout button clears JWT cookie
- [ ] Session expires after 30 minutes of inactivity
- [ ] Expired sessions redirect to login
- [ ] Session refresh before timeout (optional)

---

## 7. Testing Strategy (80% Coverage)

### Unit Tests (70%)

```typescript
// auth.middleware.test.ts
describe('authMiddleware', () => {
  test('should validate valid JWT token', () => {
    const validToken = jwt.sign({ userId: '123', role: 'Submitter' }, SECRET);
    const req = { cookies: { jwt: validToken } };
    authMiddleware(req, res, next);
    expect(req.user).toBeDefined();
    expect(next).toHaveBeenCalled();
  });
  
  test('should reject expired token', () => {
    const expiredToken = jwt.sign({ userId: '123' }, SECRET, { expiresIn: '-1h' });
    const req = { cookies: { jwt: expiredToken } };
    authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });
  
  test('should reject missing token', () => {
    const req = { cookies: {} };
    authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });
});
```

### Integration Tests (20%)

```typescript
// auth.integration.test.ts
describe('Authentication Flow', () => {
  test('should complete login flow from Auth0', async () => {
    const response = await request(app)
      .post('/api/auth/callback')
      .send({ code: 'valid_auth_code', state: 'valid_state' });
    
    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
    expect(response.headers['set-cookie'][0]).toContain('jwt=');
  });
});
```

### E2E Tests (10%)

```typescript
// auth.e2e.test.ts - Playwright/Cypress
test('Complete user authentication journey', async ({ page }) => {
  await page.goto('/login');
  await page.click('button:has-text("Login")');
  // Auth0 login page appears
  // User enters credentials and authenticates
  // Redirected back to app
  await expect(page).toHaveURL('/dashboard');
  // User info displayed in menu
  await expect(page).toContainText('user@epam.com');
});
```

---

## 8. Performance Requirements

| Metric | Target | Justification |
|--------|--------|---|
| Login response time | <500ms | SAML round-trip to Auth0 |
| Token validation | <10ms | JWT signature verification |
| GET /auth/me | <50ms | Database lookup + JWT decode |
| Token refresh | <200ms | If refresh tokens implemented |

---

## 9. Production Deployment Checklist

- [ ] Auth0 SAML provider configured with EPAM domain
- [ ] JWT_SECRET stored in secure vault (not in .env)
- [ ] HTTPS enforced (all auth routes require HTTPS)
- [ ] Secure cookie flags verified (HttpOnly, Secure, SameSite)
- [ ] Rate limiting on login attempts (e.g., 5 attempts/min)
- [ ] Monitoring and alerting for authentication failures
- [ ] Audit logs exported to security monitoring system
- [ ] Security headers configured (CSP, HSTS, X-Frame-Options)
- [ ] OAuth token endpoint protected with client credentials
- [ ] Session timeout tested and verified (30 min default)

---

## 10. Reference Implementation

**Repository:** `D:\labs\course-project\`

**Related Documents:**
- EPIC-1: [auth-screen/specs/epics/EPIC-1-User-Authentication.md](../../../auth-screen/specs/epics/EPIC-1-User-Authentication.md)
- User Stories: [auth-screen/specs/stories/](../../../auth-screen/specs/stories/)
- Constitution: [.specify/memory/constitution.md](./constitution.md)

---

**Specification Version:** 1.0  
**Last Updated:** February 24, 2026  
**Status:** Ready for Development
