# User Story: Store and Manage JWT Tokens Securely

**Story ID:** STORY-EPIC-1.3  
**Epic:** EPIC-1  
**Sprint:** Backlog  
**Status:** Ready for Refinement  
**Persona:** Priya & Raj (All authenticated users)

## User Story

**As a** user of the app  
**I want** my authentication token to be stored securely  
**so that** I stay logged in across page refreshes and my session is protected from attacks

## Story Context

After Auth0 authenticates a user, we need to securely store the JWT token for subsequent API requests. Auth0 React SDK typically handles cookie storage automatically, but we must ensure tokens are stored in secure HTTP-only cookies (not localStorage) to prevent XSS attacks. This story implements token management following the project's tech stack: React 18 with TypeScript frontend, Express.js backend with Prisma ORM, PostgreSQL database, Jest testing, and secure OAuth 2.0 patterns. All API requests will include the token via Fetch API interceptor, and tokens will refresh before expiration using Express.js middleware.

## Acceptance Criteria

### AC 1: JWT Token Is Stored in Secure Cookie
- **Given:** User successfully authenticates through Auth0
- **When:** Auth0 returns an access token
- **Then:** Token is stored in an HTTP-only, Secure, SameSite cookie (not localStorage); cookie is not accessible to JavaScript

### AC 2: Token Persists Across Page Refreshes
- **Given:** User is logged in and has a valid token
- **When:** User refreshes the page
- **Then:** Token is still present; user remains logged in (no redirect to login page)

### AC 3: All API Requests Include Token in Header
- **Given:** User is authenticated and makes an API request
- **When:** API request is sent
- **Then:** Request includes `Authorization: Bearer [token]` header; backend receives token

### AC 4: Expired Token Triggers Re-authentication
- **Given:** Token expiration time has passed
- **When:** User makes an API request or token is about to expire
- **Then:** Token is refreshed automatically (if refresh token available); or user is redirected to login page

### AC 5: No Token Leaks in Logs or Console
- **Given:** User authenticates and uses the app
- **When:** Checking browser console and application logs
- **Then:** Full token value does not appear in console logs; only identifier/claims are logged for debugging

### AC 6: Token Service Tested with Jest + React Testing Library
- **Given:** `tokenService.ts` and API interceptor code is written
- **When:** Jest test suite runs (`npm run test:unit`)
- **Then:** Token refresh logic has 80%+ coverage; interceptor tests mock Fetch API; all tests pass

### AC 7: API Middleware Validates Token in Express Backend
- **Given:** Express.js API server is running
- **When:** Request arrives at protected endpoint without Authorization header
- **Then:** Middleware returns 401 Unauthorized; token rejected if signature invalid or expired

## Technical Notes

### Implementation Approach
- Configure Auth0 React SDK to use secure HTTP-only cookies with `cacheLocation: 'memory'`
- Use `useRefreshTokens: true` in Auth0 config for automatic token refresh
- Create `tokenService.ts` with JWT refresh logic and exponential backoff
- Build API client interceptor using Fetch API (or Axios) to attach Bearer token to all requests
- Implement token refresh middleware in Express.js backend (or Next.js API routes)
- Use PostgreSQL + Prisma ORM to track token refresh events in database
- All token validation handled server-side (no client-side verification)
- Implement JWT interceptor error handling for 401/403 responses

### Files/Components Affected (Frontend)
- `src/config/auth0Config.ts` - Update Auth0 config with cookie settings
- `src/services/tokenService.ts` - New token refresh and validation logic
- `src/services/apiClient.ts` - New Fetch-based API client with interceptors
- `src/setupTests.ts` - Add token mocking for Jest tests

### Files/Components Affected (Backend)
- `api/middleware/authMiddleware.ts` - JWT verification middleware
- `api/controllers/tokenController.ts` - Token refresh endpoint
- `prisma/schema.prisma` - Add token refresh logs/audit table
- `src/database/migrations/*.sql` - Add token tracking table

### Technology Stack (From agents.md)
**Frontend:**
- React 18 with TypeScript
- Vite build tool
- Auth0 React SDK
- Jest + React Testing Library for tests
- Fetch API for HTTP requests

**Backend:**
- Node.js v18+
- Express.js (or Next.js API Routes)
- TypeScript
- Prisma ORM
- PostgreSQL database

**Security:**
- HTTP-only, Secure, SameSite cookies
- JWT (Access + Refresh tokens)
- OAuth 2.0 protocol

### Known Limitations
- Token refresh happens server-side via Express.js middleware (more secure than client-side)
- Token revocation not yet implemented; token remains valid until expiration (handled in STORY-EPIC-1.5)
- Token rotation not yet implemented (Phase 2 security enhancement)
- Prisma migrations require manual database setup; no automatic migration on deploy
- Fetch API used (no external HTTP library dependency); requires polyfills for older browsers

## Estimation & Effort

**Story Points:** 5  
**Estimated Days:** 1.5 - 2 days  
**Risk Level:** MEDIUM-HIGH

**Estimation Rationale:** Full-stack implementation (React frontend + Express backend + Prisma migration). Involves security-critical components (JWT handling, token validation, secure cookies). Moderate-high risk because improper token handling can cause security vulnerabilities and session management failures. Well-documented in Auth0 and JWT best practices, but requires careful coordination between frontend/backend and comprehensive testing with Jest.

## Dependencies & Blockers

### Story Dependencies
- STORY-EPIC-1.2 must be complete (Auth0 integration working)
- Backend API endpoints must exist (even if not fully functional)

### Blockers
- [ ] Backend API not deployed or accessible

## INVEST Validation Checklist

- [x] **Independent** - Depends on STORY-2, but adds token handling step
- [x] **Negotiable** - Token storage approach (cookies vs. memory) can be refined
- [x] **Valuable** - Users can now maintain sessions; API requests authenticate properly
- [x] **Estimable** - Clear scope: "Configure secure token storage and refresh"
- [x] **Small** - Can be completed in 0.5-1 day; mainly configuration
- [x] **Testable** - Can inspect cookies, verify API requests include token, test refresh

## Definition of Acceptance

- [ ] Token stored in HTTP-only, Secure, SameSite cookie via Auth0 React SDK
- [ ] Token persists across page refresh with user remaining logged in
- [ ] `tokenService.ts` exports `getToken()` and `refreshToken()` functions
- [ ] API client uses Fetch API with interceptor adding `Authorization: Bearer [token]` header
- [ ] All API requests include token in header; verified via browser DevTools Network tab
- [ ] Token refresh triggered before expiration (check `tokenExpiresAt` time)
- [ ] Expired token results in automatic refresh or redirect to login page
- [ ] No sensitive values logged to console (use `console.debug()` for claims only)
- [ ] Jest tests pass with 80%+ coverage for token service and API interceptor
- [ ] Express.js backend validates JWT signature and expiration
- [ ] Prisma database schema includes token refresh audit table
- [ ] Security audit (OWASP) passed: No XSS, No CSRF vulnerabilities

## Related Information

**Related Stories:**
- STORY-EPIC-1.2 (Auth0 integration - prerequisite)
- STORY-EPIC-1.5 (logout and session timeout)

**Design Reference:**
[Auth0 Storage Options: https://auth0.com/docs/libraries/auth0-spa-js#storage-options]

**Documentation:**
- OWASP: https://owasp.org/www-community/attacks/CSRF
- JWT Best Practices: https://tools.ietf.org/html/rfc8725
