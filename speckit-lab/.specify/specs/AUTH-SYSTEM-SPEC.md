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
2. Rate limiter checks max 5 attempts per 15 minutes
3. React component redirects to Auth0 login page
4. Auth0 validates credentials against SAML provider (EPAM)
5. SAML provider authenticates and returns attributes
6. Auth0 applies role assignment rules based on SAML groups
7. Auth0 returns authorization token to callback URL
8. Backend validates CSRF state parameter and exchanges token
9. Backend creates/updates user in database with role from Auth0
10. Backend generates JWT with userId, email, role claims (30-min expiry)
11. JWT stored in HTTP-only Secure cookie with SameSite=Strict
12. Session record created tracking device info and IP
13. User redirected to dashboard

**Request with Authentication:**
1. Browser includes JWT cookie with each request
2. Express middleware validates JWT signature
3. Middleware checks token revocation list (Redis)
4. Middleware refreshes role from database every 5 minutes
5. Middleware decodes claims (userId, role)
6. Middleware attaches user context to request
7. Route handler processes authenticated request

**Error Handling with Graceful Degradation:**
- If SAML provider down: Circuit breaker engages after 5 failures
- If circuit breaker open: User sees "Service temporarily unavailable"
- Phase 2: Emergency fallback to local DB verification (if enabled)

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

**Purpose:** Invalidate user session (hybrid synchronous + asynchronous approach)

```typescript
/**
 * Logout - Invalidates user session and clears authentication token
 * 
 * Synchronous: Clears cookie immediately (user sees logout success)
 * Asynchronous: Revokes token in background (prevents token reuse)
 * 
 * @route POST /api/auth/logout
 * @authentication Required - JWT cookie
 * 
 * @returns {object} { success: true }
 * 
 * @example
 * POST /api/auth/logout
 * → { "success": true } (returns immediately, ~5ms)
 * Background: Token added to revocation list, session deleted
 */
router.post('/logout', authMiddleware, async (req: AuthRequest, res: AuthResponse) => {
  const userId = req.user.id;
  const token = req.cookies.jwt;
  
  try {
    // Synchronous: Clear JWT cookie immediately
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    
    // Return success immediately (non-blocking)
    res.json({ success: true, message: 'Logged out successfully' });
    
    // Asynchronous: Revoke token in background (no await)
    revokeTokenAsync(userId, token).catch(err => {
      logger.error('Failed to revoke token', { userId, err });
      // Send to DLQ for retry
      messageQueue.send('failed-revocations', { userId, token });
    });
  } catch (error) {
    res.status(500).json({ error: 'Logout failed' });
  }
})

/**
 * Async token revocation (non-blocking)
 * 
 * @private
 * @param {string} userId - User who is logging out
 * @param {string} token - JWT token to revoke
 * @throws {Error} If revocation fails completely
 */
async function revokeTokenAsync(userId: string, token: string): Promise<void> {
  // Set revocation flag in Redis with TTL = token expiry (30 min)
  await redis.setex(`revoked:${token}`, 30 * 60, JSON.stringify({
    revokedAt: new Date(),
    userId,
  }));
  
  // Delete session record from database
  await db.session.deleteMany({
    where: { token },
  });
  
  // Log audit event
  await db.auditLog.create({
    data: {
      userId,
      eventType: 'LOGOUT',
      details: 'User logged out',
      ipAddress: getClientIP(),
    },
  });
}
```

**Implementation Details:**
- **Synchronous:** Clear cookie immediately with `Set-Cookie: jwt=; Max-Age=0; HttpOnly; Secure; Path=/`
- **Asynchronous:** Add JWT to Redis revocation set (TTL 30 min) for immediate invalidation
- **Database:** Delete all sessions for this token
- **Audit:** Log logout event with timestamp and IP address
- **Performance:** Response returns in ~5ms, revocation happens in background

---

### 4.3 Express Middleware

#### Auth Middleware

**File:** `src/middleware/auth.ts`

```typescript
/**
 * Authentication middleware - Validates JWT and attaches user context
 * 
 * Validates JWT signature and expiration. Rejects requests with invalid or expired tokens.
 * Checks token revocation list. Refreshes role claims every 5 minutes from database.
 * Attaches decoded user information to `req.user`.
 * 
 * @middleware
 * @param {Request} req - Express request with JWT cookie
 * @param {Response} res - Express response
 * @param {NextFunction} next - Next middleware in chain
 * 
 * @throws {AuthenticationError} 401 - No valid JWT, invalid signature, expired, or revoked
 * 
 * @example
 * app.use('/api/protected', authMiddleware);
 */
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token: string = req.cookies.jwt;
    
    if (!token) {
      throw new AuthenticationError('No authentication token provided', 401);
    }
    
    // Check token revocation list (Phase 1: immediate logout support)
    const isRevoked = await redis.get(`revoked:${token}`);
    if (isRevoked) {
      throw new AuthenticationError('Token has been revoked', 401);
    }
    
    const decoded: DecodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET!,
      { algorithms: ['HS256'] }
    );
    
    // Refresh role from database every 5 minutes
    const now = Math.floor(Date.now() / 1000);
    if (now - decoded.roleCheckedAt > 5 * 60) {
      const freshUser = await db.user.findUnique({
        where: { id: decoded.userId },
      });
      
      if (freshUser?.role !== decoded.role) {
        // Role changed - update JWT cookie
        const newToken = jwt.sign(
          {
            userId: freshUser.id,
            email: freshUser.email,
            role: freshUser.role,
            roleCheckedAt: now,
          },
          process.env.JWT_SECRET!,
          { expiresIn: '30m' }
        );
        
        res.cookie('jwt', newToken, {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
          maxAge: 30 * 60 * 1000,
        });
        
        decoded.role = freshUser.role;
      }
    }
    
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

#### Session Table (MVP: Track only | Phase 2: Enforce single session)

**File:** `prisma/schema.prisma`

```prisma
/**
 * Session model for tracking active user sessions
 * 
 * MVP: Track all active sessions per user (no restrictions)
 * Phase 2: Enforce single session per user (optional)
 */
model Session {
  /// Unique session identifier
  id String @id @default(uuid())
  
  /// User associated with this session
  userId String
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  /// JWT token for this session
  token String @unique
  
  /// Device information (browser, OS, device type)
  deviceInfo String?
  
  /// IP address of session
  ipAddress String?
  
  /// When session was created
  createdAt DateTime @default(now()) @db.Timestamp()
  
  /// Last activity timestamp (updated with each request)
  lastActivityAt DateTime @updatedAt @db.Timestamp()
  
  /// When token expires (30 minutes from creation)
  expiresAt DateTime @db.Timestamp()
  
  @@index([userId])
  @@index([expiresAt])
}
```

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
 * 
 * Session Timeout: 30 minutes of inactivity (MVP default)
 * Absolute Session: 12 hours maximum (Phase 2)
 */
res.cookie('jwt', token, {
  httpOnly: true,      // Not accessible via document.cookie
  secure: true,        // Only sent over HTTPS
  sameSite: 'strict',  // Only sent with same-site requests
  domain: '.epam.com', // Only sent to EPAM domain
  path: '/',           // Sent with all requests
  maxAge: 30 * 60 * 1000, // 30 minutes (MVP inactivity timeout)
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
  test('should validate valid JWT token', async () => {
    const validToken = jwt.sign({ userId: '123', role: 'Submitter', roleCheckedAt: now }, SECRET);
    const req = { cookies: { jwt: validToken } };
    await authMiddleware(req, res, next);
    expect(req.user).toBeDefined();
    expect(next).toHaveBeenCalled();
  });
  
  test('should reject expired token', async () => {
    const expiredToken = jwt.sign({ userId: '123' }, SECRET, { expiresIn: '-1h' });
    const req = { cookies: { jwt: expiredToken } };
    await authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });
  
  test('should reject missing token', async () => {
    const req = { cookies: {} };
    await authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });
  
  test('should reject revoked token', async () => {
    const validToken = jwt.sign({ userId: '123', role: 'Submitter', roleCheckedAt: now }, SECRET);
    await redis.set(`revoked:${validToken}`, 'revoked');
    const req = { cookies: { jwt: validToken } };
    await authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });
  
  test('should refresh role if changed in database', async () => {
    const validToken = jwt.sign({ userId: '123', role: 'Submitter', roleCheckedAt: now - 6*60 }, SECRET);
    const req = { cookies: { jwt: validToken } };
    const mockUser = { id: '123', email: 'test@epam.com', role: 'Evaluator' };
    jest.spyOn(db.user, 'findUnique').mockResolvedValue(mockUser);
    
    await authMiddleware(req, res, next);
    
    expect(req.user.role).toBe('Evaluator');
    expect(res.cookie).toHaveBeenCalled();
  });
});

// auth.logout.test.ts
describe('POST /auth/logout', () => {
  test('should return success immediately without waiting for revocation', async () => {
    const response = await request(app)
      .post('/api/auth/logout')
      .set('Cookie', `jwt=${validToken}`);
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    // Note: revocation happens in background
  });
  
  test('should clear JWT cookie', async () => {
    await request(app)
      .post('/api/auth/logout')
      .set('Cookie', `jwt=${validToken}`);
    
    // Cookie should be cleared
    const response = await request(app)
      .get('/api/auth/me')
      .set('Cookie', `jwt=`); // Empty cookie
    
    expect(response.status).toBe(401);
  });
});

// rate-limiter.test.ts
describe('Login Rate Limiter', () => {
  test('should allow up to 5 login attempts per 15 minutes', async () => {
    for (let i = 0; i < 5; i++) {
      const response = await request(app).post('/api/auth/callback')
        .send({ code: 'invalid', state: 'valid' });
      expect(response.status).not.toBe(429); // Too Many Requests
    }
  });
  
  test('should reject 6th login attempt with 429', async () => {
    for (let i = 0; i < 6; i++) {
      const response = await request(app).post('/api/auth/callback')
        .send({ code: 'invalid', state: 'valid' });
      if (i === 5) {
        expect(response.status).toBe(429);
      }
    }
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
| Login response time | <500ms | SAML round-trip to Auth0 (includes rate limit check) |
| Token validation | <10ms | JWT signature verification |
| Role refresh check | <50ms | Database lookup every 5 min (cached during window) |
| GET /auth/me | <50ms | Database lookup + JWT decode |
| Logout response | <5ms | Synchronous (async revocation in background) |
| Token revocation | <100ms | Redis write for revocation list |

---

## 9. Production Deployment Checklist

- [ ] Auth0 SAML provider configured with EPAM domain (custom rules for role assignment)
- [ ] SAML attribute mappings configured (email, name, groups)
- [ ] JWT_SECRET stored in secure vault (not in .env)
- [ ] Redis configured for token revocation list
- [ ] Circuit breaker configured (5 fails → open, 1 min → half-open)
- [ ] HTTPS enforced (all auth routes require HTTPS)
- [ ] Secure cookie flags verified (HttpOnly=true, Secure=true, SameSite=strict)
- [ ] Rate limiting on login endpoint (5 attempts per 15 min per email)
- [ ] Role refresh cache configured (every 5 minutes)
- [ ] Session table indexed on userId and expiresAt
- [ ] Token revocation list TTL set to 30 min (match token expiry)
- [ ] Monitoring and alerting for authentication failures
- [ ] Audit logs exported to security monitoring system
- [ ] Security headers configured (CSP, HSTS, X-Frame-Options)
- [ ] OAuth token endpoint protected with client credentials
- [ ] Session timeout tested and verified (30 min inactivity)
- [ ] Logout performance tested (<5ms synchronous response)
- [ ] Concurrent session tracking verified (for Phase 2 single-session mode)
- [ ] Emergency fallback authentication disabled in production
- [ ] Load testing: 100 concurrent logins at peak time

---

## 10. Reference Implementation & Design Decisions

**Repository:** `D:\labs\course-project\`

**Related Documents:**
- EPIC-1: [auth-screen/specs/epics/EPIC-1-User-Authentication.md](../../../auth-screen/specs/epics/EPIC-1-User-Authentication.md)
- User Stories: [auth-screen/specs/stories/](../../../auth-screen/specs/stories/)
- Constitution: [.specify/memory/constitution.md](./constitution.md)
- **Design Clarifications:** [.specify/docs/AUTH-CLARIFY-001.md](../docs/AUTH-CLARIFY-001.md) ✅ **ALL CLARIFICATIONS ACCEPTED**

### Design Decisions Summary

All 7 key design clarifications have been incorporated into this specification:

✅ **Auth0 SAML Configuration** - Custom role assignment rules based on SAML groups  
✅ **SAML Outage Handling** - Circuit breaker + Phase 2 fallback  
✅ **Rate Limiting** - Hybrid (Auth0 + API layer at 5/15min)  
✅ **Session Timeout** - 30 minutes inactivity (MVP fixed timeout)  
✅ **Concurrent Logins** - No restrictions (tracked for Phase 2)  
✅ **Role Changes** - Refresh on next API request (non-disruptive)  
✅ **Logout** - Hybrid synchronous response + async revocation  

See [AUTH-CLARIFY-001.md](../docs/AUTH-CLARIFY-001.md) for detailed rationale on each decision.

---

**Specification Version:** 1.0  
**Status:** ✅ APPROVED (All clarifications accepted)
**Last Updated:** February 24, 2026  
**Constitution Alignment:** ✅ TypeScript Strict | Testing Pyramid (80% coverage) | JSDoc Required
