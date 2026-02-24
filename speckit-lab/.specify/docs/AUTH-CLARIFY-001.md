# Authentication System - Clarifications & Design Decisions

**Document ID:** AUTH-CLARIFY-001  
**Date:** February 24, 2026  
**Status:** APPROVED  
**Related Spec:** AUTH-SYSTEM-SPEC.md

---

## Overview

This document addresses key clarification questions for EPIC-1 authentication implementation, ensuring all team members align on critical design decisions before development begins.

---

## Clarification 1: Exact Auth0 SAML Configuration for EPAM Domain

### Question
What's the exact Auth0 SAML configuration needed for EPAM domain?

### Answer

**Auth0 Configuration Steps:**

1. **Create SAML Application in Auth0 Dashboard**
   - Go to Applications → Applications → Create Application
   - Name: "EPAM Innovation Platform"
   - Application Type: "Regular Web Application"

2. **SAML Configuration**
   ```
   Assertion Consumer Service (ACS) URL:
   https://epam-innovation.internal/api/auth/callback
   
   Single Logout URL (optional):
   https://epam-innovation.internal/api/auth/logout
   
   Service Provider Metadata URL:
   https://epam-innovation.internal/.well-known/saml-metadata.xml
   ```

3. **SAML Provider (EPAM Corporate)**
   - **IdP Metadata URL:** Provided by EPAM IT Security
   - **Entity ID:** urn:epam:saml:provider
   - **Sign Assertions:** YES (required for security)
   - **Encrypt Assertions:** YES (for sensitive data)

4. **SAML Attribute Mappings**
   ```
   SAML Attribute → User Profile Mapping
   ─────────────────────────────────────
   http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress
   → app_metadata.email
   
   http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname
   → given_name
   
   http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname
   → family_name
   
   http://schemas.xmlsoap.org/ws/2005/05/identity/claims/groups
   → app_metadata.groups (for role extraction)
   ```

5. **Auth0 Rules for Role Assignment**
   ```javascript
   // Rule: Assign role based on email domain
   function(user, context, callback) {
     const isEPAM = user.email.endsWith('@epam.com');
     
     if (!isEPAM) {
       return callback(new Error('Only EPAM employees allowed'));
     }
     
     // Default role
     user.app_metadata = user.app_metadata || {};
     user.app_metadata.role = 'Submitter';
     
     // Check if user is in evaluator group
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

6. **Environment Variables**
   ```env
   # Auth0
   AUTH0_DOMAIN=epam.auth0.com
   AUTH0_CLIENT_ID=<YOUR_CLIENT_ID>
   AUTH0_CLIENT_SECRET=<YOUR_CLIENT_SECRET>
   AUTH0_CALLBACK_URL=https://epam-innovation.internal/api/auth/callback
   
   # SAML
   SAML_ENTRYPOINT=https://epam.okta.com/app/exk1234/sso/saml
   SAML_ISSUER=urn:innovation-platform
   SAML_CERT=<PUBLIC_KEY_FROM_EPAM>
   ```

### Implementation Priority
🟢 **MUST HAVE** - Coordinate with IT/Security early (2-3 week lead time)

### Testing Approach
- Unit: Auth0 rule logic with mock SAML attributes
- Integration: Test with Auth0 sandbox tenant
- E2E: Test against actual SAML provider in staging

---

## Clarification 2: Handling SAML Provider Outages

### Question
How should we handle SAML provider outages during authentication?

### Answer

**Graceful Degradation Strategy:**

### Strategy 1: Fallback Authentication (Recommended for MVP)

```typescript
/**
 * Authentication flow with fallback
 * 
 * Primary: Auth0 SAML
 * Fallback: Local DB verification (demo/emergency mode)
 */

// Step 1: Attempt Auth0 SAML
try {
  const user = await auth0.authenticate(credentials);
  return user;
} catch (error) {
  if (error.code === 'SAML_PROVIDER_UNAVAILABLE') {
    // SAML provider is down
    
    // Option A: Return retry message to user
    if (!isEmergencyModeEnabled()) {
      throw new AuthenticationError(
        'Authentication service temporarily unavailable. Please try again in a few minutes.',
        503
      );
    }
    
    // Option B: Emergency fallback (if enabled by admin)
    const user = await verifyLocalCredentials(credentials);
    return {
      ...user,
      source: 'FALLBACK',
      warning: 'Using fallback authentication due to SAML outage'
    };
  }
}
```

### Strategy 2: Circuit Breaker Pattern

```typescript
/**
 * Circuit breaker: Stop calling SAML provider if it's consistently failing
 */
enum CircuitState {
  CLOSED = 'CLOSED',      // Normal operation
  OPEN = 'OPEN',          // Stop calling provider
  HALF_OPEN = 'HALF_OPEN' // Probe provider
}

class AuthenticationCircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private failureCount: number = 0;
  private readonly failureThreshold: number = 5;
  private readonly resetTimeout: number = 60000; // 1 minute
  
  async authenticate(credentials: Credentials): Promise<User> {
    if (this.state === CircuitState.OPEN) {
      throw new Error('Authentication service unavailable. Please retry later.');
    }
    
    try {
      const user = await auth0.authenticate(credentials);
      this.onSuccess();
      return user;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  
  private onSuccess(): void {
    this.failureCount = 0;
    this.state = CircuitState.CLOSED;
  }
  
  private onFailure(): void {
    this.failureCount++;
    if (this.failureCount >= this.failureThreshold) {
      this.state = CircuitState.OPEN;
      setTimeout(() => {
        this.state = CircuitState.HALF_OPEN;
      }, this.resetTimeout);
    }
  }
}
```

### Strategy 3: Monitoring & Alerting

```typescript
/**
 * Health check for SAML provider
 * Run every 30 seconds
 */
async function checkSamlHealth(): Promise<void> {
  try {
    const response = await fetch('https://epam.saml-provider.com/health', {
      timeout: 5000
    });
    
    if (response.ok) {
      await updateHealthStatus('SAML_PROVIDER', 'HEALTHY');
    } else {
      await raiseAlert('SAML_PROVIDER_DEGRADED', 'Provider returned non-200 status');
    }
  } catch (error) {
    await raiseAlert('SAML_PROVIDER_DOWN', error.message);
  }
}
```

### User-Facing Error Messages

| Scenario | HTTP Status | Message |
|----------|---|---|
| **SAML temporarily down** | 503 | "Authentication service is temporarily unavailable. Please try again in a few minutes." |
| **Invalid credentials** | 401 | "Invalid email or password." |
| **User not EPAM employee** | 403 | "Only EPAM employees can access this platform." |
| **Service recovering** | 503 | "We're updating our security system. Please try again shortly." |

### Implementation Priority
🟡 **SHOULD HAVE** - Phase 2 or Week 2 of EPIC-1

### Testing Approach
- Unit: Circuit breaker state transitions
- Integration: Mock SAML provider outage scenarios
- Chaos: Test with intentional provider delays/failures

---

## Clarification 3: Rate Limiting - API vs Auth0

### Question
Should rate limiting be implemented in the API or delegated to Auth0?

### Answer

**Recommended: Hybrid Approach**

### Layer 1: Auth0 Rate Limiting (First Defense)

Auth0 provides built-in protection:
- 50 requests per minute per user globally
- 1000 requests per minute per tenant
- No configuration needed - automatic

**Limitation:** Auth0 rate limits are broad; not optimized for login attacks

### Layer 2: Application-Level Rate Limiting (Recommended)

```typescript
/**
 * Express rate limiter for login endpoint
 * Stricter limits than Auth0 for targeted protection
 */

import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import redis from 'redis';

const redisClient = redis.createClient();

export const loginRateLimiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
    prefix: 'rate-limit:login:',
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,                     // 5 attempts per window
  message: 'Too many login attempts. Please try again after 15 minutes.',
  standardHeaders: true,      // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful logins
  keyGenerator: (req) => req.body.email || req.ip, // Rate limit by email
});

/**
 * Route with rate limiting
 */
router.post('/auth/callback', loginRateLimiter, authCallback);
```

### Layer 3: Adaptive Rate Limiting (Phase 2)

```typescript
/**
 * Strict limits during suspicious activity
 * - Multiple failed attempts from same IP
 * - Multiple failed attempts for same user account
 * - Distributed attack detection
 */

class AdaptiveRateLimiter {
  async checkAdaptiveLimits(email: string, ipAddress: string): Promise<void> {
    const failedAttempts = await redis.get(`failed:${email}:24h`);
    
    if (failedAttempts > 10) {
      // Lock account for 24 hours
      throw new Error('Account temporarily locked. Contact support.');
    }
    
    const distributedAttempts = await redis.get(`failed:${ipAddress}:1h`);
    
    if (distributedAttempts > 20) {
      // IP is attempting many emails - likely bot
      throw new Error('Too many authentication attempts from your network.');
    }
  }
}
```

### Recommended Configuration

```typescript
export const rateLimitConfig = {
  // Login endpoint
  login: {
    windowMs: 15 * 60 * 1000,
    max: 5,                // 5 attempts per 15 min
    skipSuccessfulRequests: true,
  },
  
  // General API endpoints
  api: {
    windowMs: 60 * 1000,
    max: 100,              // 100 requests per minute
    skipSuccessfulRequests: false,
  },
  
  // Password reset
  passwordReset: {
    windowMs: 60 * 60 * 1000,
    max: 3,                // 3 attempts per hour
  }
};
```

### Monitoring

```typescript
/**
 * Log rate limit hits for analysis
 */
router.use((req, res, next) => {
  if (res.getHeader('RateLimit-Remaining') === '0') {
    logger.warn(`Rate limit exceeded: ${req.ip}`, {
      endpoint: req.path,
      email: req.body.email,
      timestamp: new Date(),
    });
    
    // Trigger alert if exceeded threshold
    const lastHourViolations = await getRecentViolations(req.ip);
    if (lastHourViolations > 10) {
      await raiseSecurityAlert('HIGH_RATE_LIMIT_VIOLATIONS', req.ip);
    }
  }
  next();
});
```

### Implementation Priority
🟢 **MUST HAVE** - Implement in API for MVP

### Testing
- Unit: Rate limit counter logic
- Integration: Test rate limit headers and lockout behavior
- Load: Test under high concurrent login attempts

---

## Clarification 4: Session Timeout Duration

### Question
What session timeout duration is appropriate - 15 min, 30 min, or user-configurable?

### Answer

**Recommended: 30 minutes** (with user-configurable in Phase 2)

### Rationale

**30-minute timeout balances:**
- **Security:** Limits exposure if device compromised
- **Usability:** Allows users to work on ideas without re-authenticating
- **Business:** Aligns with industry standards (Google, Microsoft, AWS: 15-30 min)

### Implementation

```typescript
/**
 * JWT Token Expiration Configuration
 */

interface TokenConfig {
  // Access token (short-lived, used for API requests)
  accessTokenExpiry: '30m';
  
  // Refresh token (long-lived, used to get new access token)
  // Phase 2 feature
  refreshTokenExpiry: '7d';
  
  // Absolute session timeout (max time logged in)
  absoluteSessionTimeout: '12h';
  
  // Inactivity timeout (no requests for X minutes)
  inactivityTimeout: '30m';
}

/**
 * Custom JWT claims for timeout tracking
 */
interface TokenPayload {
  userId: string;
  email: string;
  role: Role;
  iat: number;        // Issued at
  exp: number;        // Expires (30 min from iat)
  ias: number;        // Inactivity at (will be updated on API call)
  ast: number;        // Absolute session time (issued time, 12h limit)
}

/**
 * Check token validity including inactivity
 */
function validateTokenInactivity(token: TokenPayload): boolean {
  const now = Date.now() / 1000;
  const inactivityDuration = now - token.ias;
  const maxInactivity = 30 * 60; // 30 minutes in seconds
  
  return inactivityDuration < maxInactivity;
}
```

### UI Behavior

```typescript
/**
 * Warn user before session expires
 */
useEffect(() => {
  const warningTime = 5 * 60 * 1000; // 5 minutes before expiry
  const sessionDuration = 30 * 60 * 1000; // 30 minutes total
  
  const timeoutId = setTimeout(() => {
    showWarning('Your session will expire in 5 minutes. Click to continue.');
  }, sessionDuration - warningTime);
  
  return () => clearTimeout(timeoutId);
}, []);

/**
 * User can extend session by clicking "Continue" or making any API call
 */
async function extendSession(): Promise<void> {
  const newToken = await api.getNewToken();
  saveTokenToCookie(newToken);
}
```

### Phase 2: User-Configurable Timeout

```typescript
// User settings screen
export const SessionSettings: React.FC = () => {
  const [timeout, setTimeout] = useState<30 | 60 | 120>(30);
  
  return (
    <div>
      <label>Session Timeout</label>
      <select value={timeout} onChange={(e) => setTimeout(Number(e.target.value))}>
        <option value={30}>30 minutes (recommended)</option>
        <option value={60}>60 minutes</option>
        <option value={120}>120 minutes</option>
      </select>
      <p>Your session will automatically log out after this period of inactivity.</p>
    </div>
  );
}
```

### Implementation Priority
🟢 **MUST HAVE** - 30-minute fixed timeout for MVP

### Testing
- Unit: Token expiration calculation
- Integration: Session timeout behavior with inactive user
- E2E: Warning display and session extension

---

## Clarification 5: Concurrent Login Restrictions

### Question
Should concurrent logins be restricted to one session per user?

### Answer

**Recommended: NO restrictions for MVP** (Implement in Phase 2)

### Rationale for MVP (No Restrictions)

✅ **Pros:**
- User can have multiple browser tabs/windows open
- User can access on desktop AND mobile simultaneously
- Simpler implementation
- Aligns with user expectation (like Gmail, Office 365)

❌ **Cons:**
- Harder to logout completely (must invalidate all tokens)
- Potential security concern if device compromised
- More complex token revocation logic

### Phase 1 Implementation: Track All Active Sessions

```typescript
/**
 * Sessions table to track all active tokens per user
 */
model Session {
  id String @id @default(uuid())
  userId String
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  token String @unique
  deviceInfo String? // Browser, OS, device type
  ipAddress String?
  createdAt DateTime @default(now())
  lastActivityAt DateTime @updatedAt
  expiresAt DateTime
  
  @@index([userId])
  @@index([expiresAt])
}

/**
 * Create session record when user logs in
 */
async function createSession(user: User, deviceInfo: string): Promise<Session> {
  return await db.session.create({
    data: {
      userId: user.id,
      token: generateToken(),
      deviceInfo,
      ipAddress: getClientIP(),
      expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 min
    },
  });
}
```

### Phase 2 Implementation: Enforce Single Session

```typescript
/**
 * Optional feature: Login restricts to one session per user
 * User can "Force logout other sessions"
 */

async function loginWithSingleSession(email: string, password: string): Promise<Token> {
  // Check if user prefers single session
  const user = await db.user.findUnique({
    where: { email },
    include: { settings: true },
  });
  
  if (user?.settings?.singleSessionMode) {
    // Invalidate all other sessions
    await db.session.deleteMany({
      where: {
        userId: user.id,
        expiresAt: { gt: new Date() }, // Active sessions
      },
    });
  }
  
  // Create new session
  return createSession(user, getDeviceInfo());
}
```

### UI for Phase 2: Active Sessions Dashboard

```typescript
/**
 * UserSettings component showing all active sessions
 */
export const ActiveSessions: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  
  return (
    <div>
      <h3>Active Sessions</h3>
      {sessions.map(session => (
        <div key={session.id}>
          <p>{session.deviceInfo} - {session.ipAddress}</p>
          <p>Last activity: {formatTime(session.lastActivityAt)}</p>
          <button onClick={() => revokeSession(session.id)}>
            Logout this session
          </button>
        </div>
      ))}
    </div>
  );
}
```

### Implementation Priority
🔴 **NICE TO HAVE** - Defer to Phase 2

### Testing (Phase 2)
- Unit: Session creation and validation
- Integration: Multi-session behavior
- E2E: Logout from one session while another is active

---

## Clarification 6: Role Changes Mid-Session

### Question
How should we handle role changes mid-session - immediate logout or refresh on next request?

### Answer

**Recommended: Refresh on next API call** (not immediate logout)

### Rationale

✅ **Refresh on next request:**
- Non-disruptive to user
- User keeps current work context
- Aligns with "principle of least surprise"
- Easier to implement

❌ **Immediate logout:**
- Disrupts user experience
- Loses unsaved work
- Only needed for security emergencies (account locked, etc.)

### Implementation

```typescript
/**
 * Role information stored in JWT (not constantly refreshed from DB)
 * But checked on each API request via middleware
 */

// Token payload
interface TokenPayload {
  userId: string;
  email: string;
  role: Role;
  roleCheckedAt: number; // Last time role was verified in DB
}

/**
 * Middleware: Refresh role claims if > 5 minutes old
 */
export const roleRefreshMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const now = Math.floor(Date.now() / 1000);
  const roleCheckInterval = 5 * 60; // 5 minutes
  
  // Check if role needs refresh
  if (now - req.user.roleCheckedAt > roleCheckInterval) {
    const latestUser = await db.user.findUnique({
      where: { id: req.user.userId },
    });
    
    if (latestUser.role !== req.user.role) {
      // Role changed! Update in memory and in JWT cookie
      req.user.role = latestUser.role;
      
      const newToken = jwt.sign(
        {
          userId: req.user.userId,
          email: req.user.email,
          role: latestUser.role,
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
      
      // Log role change audit event
      await db.auditLog.create({
        data: {
          userId: req.user.userId,
          eventType: 'ROLE_CHANGED',
          details: `Role changed from ${req.user.role} to ${latestUser.role}`,
          ipAddress: getClientIP(req),
        },
      });
    }
  }
  
  next();
}
```

### Phase 2: Emergency Immediate Logout

```typescript
/**
 * For security emergencies (account locked, compromised, etc.)
 * Admin can force logout
 */
async function forceLogoutUser(userId: string): Promise<void> {
  // Invalidate all sessions
  await db.session.deleteMany({
    where: { userId },
  });
  
  // Add JWT to revocation list (Redis)
  const userSessions = await db.session.findMany({
    where: { userId },
  });
  
  for (const session of userSessions) {
    await redis.setex(
      `revoked:${session.token}`,
      30 * 60, // 30 minutes (duration of token)
      'revoked'
    );
  }
  
  // Notify user
  await sendEmail(userId, 'Security Alert: Your session was terminated');
}
```

### Frontend: Detect Role Change UI

```typescript
/**
 * React hook to detect role changes and inform user
 */
export const useRoleChangeDetection = () => {
  const [previousRole, setPreviousRole] = useState<Role>(null);
  const { user } = useAuth();
  
  useEffect(() => {
    if (user && previousRole && user.role !== previousRole) {
      showNotification(
        `Your role has been updated to ${user.role}. 
        Some features may have changed.`,
        'info'
      );
      setPreviousRole(user.role);
    }
  }, [user?.role]);
};
```

### Implementation Priority
🟢 **MUST HAVE** - Implement role refresh mechanism

### Testing
- Unit: Role refresh logic and JWT update
- Integration: Role change with concurrent requests
- E2E: User sees role change reflected in UI

---

## Clarification 7: Logout Synchronicity

### Question
Should logout be synchronous (immediate token revocation) or asynchronous (eventual consistency)?

### Answer

**Recommended: Hybrid - Synchronous response + Async revocation**

### Rationale

**Best of both worlds:**
- User sees immediate logout (UX)
- Token revocation happens in background (reliability)
- Non-blocking API response

### Implementation

```typescript
/**
 * Logout endpoint - Fast response, background cleanup
 */
router.post('/auth/logout', authMiddleware, async (req: Request, res: Response) => {
  const userId = req.user.id;
  const token = req.cookies.jwt;
  
  try {
    // Synchronous: Clear cookie immediately
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    
    // Asynchronous: Revoke token in background (don't wait)
    revokeTokenAsync(userId, token).catch(err => {
      logger.error('Failed to revoke token', { userId, err });
      // Send to DLQ for retry
      await messageQueue.send('failed-revocations', { userId, token });
    });
    
    // Return success immediately
    res.json({ success: true, message: 'Logged out successfully' });
    
  } catch (error) {
    res.status(500).json({ error: 'Logout failed' });
  }
});

/**
 * Async token revocation (non-blocking)
 */
async function revokeTokenAsync(userId: string, token: string): Promise<void> {
  // Set revocation flag in Redis with TTL = token expiry
  const ttl = 30 * 60; // 30 minutes
  await redis.setex(`revoked:${token}`, ttl, JSON.stringify({
    revokedAt: new Date(),
    userId,
  }));
  
  // Delete session record
  await db.session.delete({
    where: { token },
  });
  
  // Log audit event
  await db.auditLog.create({
    data: {
      userId,
      eventType: 'LOGOUT',
      details: `User logged out`,
    },
  });
}

/**
 * Middleware: Check revocation list before accepting requests
 */
export const checkTokenRevocationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.cookies.jwt;
  
  if (token) {
    const isRevoked = await redis.get(`revoked:${token}`);
    
    if (isRevoked) {
      res.status(401).json({ error: 'Token has been revoked' });
      return;
    }
  }
  
  next();
}
```

### Comparison: Sync vs Async vs Hybrid

| Approach | Response Time | Reliability | Complexity | Recommendation |
|----------|---|---|---|---|
| **Fully Sync** | ~500ms | High (if Redis down, logout fails) | Low | ❌ Not recommended |
| **Fully Async** | ~5ms | Low (user sees success but still logged in briefly) | Low | ❌ Risky |
| **Hybrid** | ~5ms | High (respond fast, revoke background) | Medium | ✅ **Recommended** |

### Phase 2: Graceful Degradation

```typescript
/**
 * If revocation fails, provide fallback
 */
async function revokeTokenWithFallback(
  userId: string,
  token: string
): Promise<void> {
  try {
    await revokeTokenAsync(userId, token);
  } catch (error) {
    logger.warn('Revocation failed, using fallback', error);
    
    // Fallback: Delete from database
    await db.session.deleteMany({
      where: { userId },
    });
    
    // Fallback: Clear all Redis sessions for user
    const sessionKeys = await redis.keys(`session:${userId}:*`);
    for (const key of sessionKeys) {
      await redis.del(key);
    }
  }
}
```

### Monitoring & Alerts

```typescript
/**
 * Monitor logout success rate
 */
interface LogoutMetrics {
  totalLogouts: number;
  successfulRevocations: number;
  failedRevocations: number;
  averageRevocationTime: number;
}

// Alert if > 10% revocations fail in 5-minute window
if (metrics.failedRevocations / metrics.totalLogouts > 0.1) {
  await raiseAlert('HIGH_LOGOUT_FAILURE_RATE', {
    failureRate: (metrics.failedRevocations / metrics.totalLogouts * 100).toFixed(2) + '%'
  });
}
```

### Implementation Priority
🟢 **MUST HAVE** - Implement hybrid synchronous response + async revocation

### Testing
- Unit: Token revocation logic
- Integration: Logout flow with revocation check
- Load: Logout under high concurrency
- Chaos: Test with Redis/DB failures

---

## Summary: Design Decisions

| Decision | Choice | Rationale | Phase |
|----------|--------|-----------|-------|
| Auth0 SAML Config | Custom rules + email domain check | Secure, flexible role assignment | MVP |
| SAML Outage Handling | Circuit breaker + emergency fallback | Graceful degradation | Phase 2 |
| Rate Limiting | Hybrid (Auth0 + API layer) | Defense in depth | MVP |
| Session Timeout | 30 minutes fixed | Security + usability balance | MVP |
| Concurrent Logins | No restrictions | Align with user expectations | MVP |
| Role Changes | Refresh on next request | Non-disruptive UX | MVP |
| Logout | Sync response + async revocation | Best of both worlds | MVP |

---

## Next Steps

1. **Share with Team:** Present these clarifications in design review
2. **Validate with Security:** Auth0/SAML specialist review
3. **Document in Code:** Add JSDoc references to this document
4. **Create Tickets:** Convert decisions into implementation stories
5. **Test Scenarios:** Build test cases for each decision

---

**Version:** 1.0  
**Approved by:** [ARCHITECTURE REVIEW]  
**Date:** February 24, 2026  
**Document:** AUTH-CLARIFY-001
