# Development Tasks - EPIC-1: User Authentication

**Based on:** IMPL-PLAN-AUTH-EPIC-1.md  
**Project:** EPAM Auth-Workflow System  
**Created:** February 24, 2026  
**Status:** READY FOR ASSIGNMENT  
**Constitution Compliance:** ✅ TypeScript Strict | Jest 80% | JSDoc Required

---

## Overview

This document breaks down the implementation plan into specific, assignable development tasks organized by sprint, component, and developer role. Each task includes acceptance criteria, testing requirements, and time estimates.

**Team Structure:**
- 1 Frontend Developer (FE)
- 1 Backend Developer (BE)
- 1 DevOps/QA Engineer (QA)

---

## Sprint 1: Infrastructure & Auth0 Setup (Days 1-3)

### Sprint 1 Goals
- [ ] Development environments ready
- [ ] Auth0 SAML configured
- [ ] Database schema implemented
- [ ] CI/CD pipeline active
- [ ] Testing framework operational

---

### Task 1.1: Frontend Project Setup [FE] - 4 hours

**Description:** Initialize React 18 + TypeScript (strict) project with Vite

**Acceptance Criteria:**
- [ ] React 18 + Vite project created with `npm create vite`
- [ ] TypeScript strict mode configured (`"strict": true`)
- [ ] Tailwind CSS installed and configured
- [ ] shadcn/ui setup complete
- [ ] Auth0 React library installed (`@auth0/auth0-react`)
- [ ] Testing framework (Jest + React Testing Library) configured
- [ ] ESLint + Prettier configured with TypeScript rules
- [ ] `npm start` runs development server without errors
- [ ] `.env.local` template created with Auth0 placeholders
- [ ] Git ignore properly configured for Node projects

**Testing Requirements:**
- [ ] Verify TypeScript strict mode: `npx tsc --noEmit` passes
- [ ] Verify ESLint passes: `npm run lint`
- [ ] Verify Prettier format: `npm run format`

**Definition of Done:**
- [ ] Code committed with message: "feat: Initialize React 18 + Vite project with TypeScript strict"
- [ ] PR reviewed and merged
- [ ] Documented in project README

**Time Estimate:** 4 hours  
**Priority:** 🔴 CRITICAL

---

### Task 1.2: Backend Project Setup [BE] - 4 hours

**Description:** Initialize Node.js + Express + TypeScript (strict) project

**Acceptance Criteria:**
- [ ] Node.js v18+ project created
- [ ] Express.js installed and configured
- [ ] TypeScript strict mode configured
- [ ] Project structure created (src/middleware, src/routes, src/services, src/types, src/config)
- [ ] Jest + supertest configured for testing
- [ ] Redis client library installed
- [ ] Prisma ORM initialized
- [ ] ESLint + Prettier configured (TypeScript)
- [ ] `npm start` runs Express server on port 3000
- [ ] `.env.example` template created
- [ ] CORS configured for frontend origin

**Testing Requirements:**
- [ ] TypeScript strict mode: `npx tsc --noEmit` passes
- [ ] Create sample route test with Jest
- [ ] Verify ESLint/Prettier configuration

**Definition of Done:**
- [ ] Committed: "feat: Initialize Express + TypeScript project with Jest"
- [ ] Pushed to GitHub
- [ ] README updated with setup instructions

**Time Estimate:** 4 hours  
**Priority:** 🔴 CRITICAL

---

### Task 1.3: TypeScript Strict Mode Configuration [FE + BE] - 2 hours

**Description:** Configure TypeScript strict mode for both frontend and backend

**Acceptance Criteria:**
- [ ] Frontend `tsconfig.json`:
  - `"strict": true`
  - `"noImplicitAny": true`
  - `"strictNullChecks": true`
  - `"strictFunctionTypes": true`
  - `"lib": ["ES2020"]`
- [ ] Backend `tsconfig.json` with same settings
- [ ] No TypeScript errors in either project (`tsc --noEmit`)
- [ ] ESLint configured to catch TypeScript issues
- [ ] Pre-commit hooks enforce TypeScript checking

**Testing Requirements:**
- [ ] Run `npm run type-check` in both projects - must pass
- [ ] Create sample file with intentional type error - ESLint must catch it

**Definition of Done:**
- [ ] Both tsconfig.json files properly configured
- [ ] No TypeScript errors in either project
- [ ] Committed: "config: Enable TypeScript strict mode"

**Time Estimate:** 2 hours  
**Priority:** 🔴 CRITICAL

---

### Task 1.4: Database Schema Design [BE] - 6 hours

**Description:** Create Prisma schema with Users, Sessions, and AuditLogs tables

**Acceptance Criteria:**
- [ ] `prisma/schema.prisma` created with:
  - User model (id, email, name, role, auth0Id, createdAt, updatedAt, relations)
  - Session model (id, userId, token, deviceInfo, ipAddress, createdAt, lastActivityAt, expiresAt)
  - AuditLog model (id, userId, eventType, details, ipAddress, userAgent, createdAt)
  - Role enum (SUBMITTER, EVALUATOR, ADMIN)
  - AuthEventType enum (LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT, TOKEN_REFRESH, ROLE_CHANGED)
- [ ] All tables have proper indexes:
  - User: email, auth0Id, role
  - Session: userId, expiresAt
  - AuditLog: userId, eventType, createdAt
- [ ] Relationships defined with cascade delete
- [ ] Timestamps created with @default(now()) and @updatedAt
- [ ] JSDoc comments on all models

**Testing Requirements:**
- [ ] Run `npx prisma generate` - no errors
- [ ] Review schema for normalization issues
- [ ] Verify index strategy for performance

**Definition of Done:**
- [ ] Prisma schema reviewed and approved
- [ ] Committed: "feat: Create Prisma schema for Users, Sessions, AuditLogs"

**Time Estimate:** 6 hours  
**Priority:** 🔴 CRITICAL

---

### Task 1.5: Auth0 SAML Configuration [QA] - 8 hours

**Description:** Configure Auth0 tenant with SAML provider and role assignment rules

**Acceptance Criteria:**
- [ ] Auth0 Regular Web Application created
- [ ] SAML settings configured:
  - ACS URL: https://localhost:3000/api/auth/callback (dev)
  - Single Logout URL: https://localhost:3000/api/auth/logout (dev)
  - Assertion signing enabled
- [ ] SAML attribute mappings configured:
  - email → app_metadata.email
  - givenname → given_name
  - surname → family_name
  - groups → app_metadata.groups
- [ ] Auth0 Rules created for role assignment:
  - Default role: SUBMITTER
  - Check groups: innovation-evaluators → EVALUATOR
  - Check groups: innovation-admins → ADMIN
- [ ] EPAM SAML provider IdP metadata imported
- [ ] Test SAML login flow in sandbox
- [ ] Document credentials in `.env.example`
- [ ] Create Auth0 setup guide for team

**Testing Requirements:**
- [ ] Test login flow with test user
- [ ] Verify role assignment rule executes
- [ ] Confirm ID token includes role claim
- [ ] Test callback returns proper state

**Definition of Done:**
- [ ] Auth0 configuration documented
- [ ] Credentials saved in secure vault
- [ ] Team trained on Auth0 setup
- [ ] Created `.env.example` with Auth0 variables

**Time Estimate:** 8 hours  
**Priority:** 🔴 CRITICAL

---

### Task 1.6: PostgreSQL Database Setup [QA] - 2 hours

**Description:** Create PostgreSQL database and run initial migrations

**Acceptance Criteria:**
- [ ] PostgreSQL 15+ installed
- [ ] Database `epam_innovation_db` created
- [ ] Prisma migrations directory created
- [ ] Initial migration generated: `npx prisma migrate dev --name init`
- [ ] Database hosted locally accessible at `postgresql://localhost:5432/epam_innovation_db`
- [ ] Connection pooling configured (PgBouncer or Prisma connection pooling)
- [ ] Backup strategy documented
- [ ] `.env.local` updated with DATABASE_URL

**Testing Requirements:**
- [ ] Connect to database: `psql epam_innovation_db`
- [ ] Verify all tables created: `\dt`
- [ ] Verify indexes: `\di`
- [ ] Test connection from Express app

**Definition of Done:**
- [ ] Database initialized and accessible
- [ ] All tables created with indexes
- [ ] Committed migration files
- [ ] Documented setup steps

**Time Estimate:** 2 hours  
**Priority:** 🟡 HIGH

---

### Task 1.7: JWT Configuration [BE] - 2 hours

**Description:** Set up JWT secret and configuration

**Acceptance Criteria:**
- [ ] Generate random 256-bit JWT_SECRET
- [ ] Store in `.env.local` (development) and vault (production)
- [ ] Document JWT claims structure:
  - userId
  - email
  - role
  - roleCheckedAt
  - iat, exp, iss, sub
- [ ] Configure token expiry: 30 minutes (MVP)
- [ ] Create `.env.example` with JWT_SECRET placeholder
- [ ] Document JWT configuration in README

**Testing Requirements:**
- [ ] Verify JWT_SECRET is set: `echo $JWT_SECRET | wc -c` (should be 64+ chars)
- [ ] Document secret generation process

**Definition of Done:**
- [ ] JWT_SECRET configured
- [ ] Documented in team wiki
- [ ] Committed: "config: Configure JWT secret and claims"

**Time Estimate:** 2 hours  
**Priority:** 🟡 HIGH

---

### Task 1.8: Redis Configuration [BE] - 2 hours

**Description:** Set up Redis for token revocation and rate limiting

**Acceptance Criteria:**
- [ ] Redis installed locally (or Docker container)
- [ ] Redis client library configured in Express
- [ ] Connection pooling configured
- [ ] Test Redis connection from app
- [ ] Document Redis key structure:
  - `revoked:{token}` - revoked tokens (TTL: 30 min)
  - `rate-limit:login:{email}` - login attempt counter (TTL: 15 min)
- [ ] `.env.local` configured with REDIS_URL

**Testing Requirements:**
- [ ] Test Redis connection: `redis-cli ping` → PONG
- [ ] Verify connection from Node.js app
- [ ] Test key expiration

**Definition of Done:**
- [ ] Redis operational and accessible
- [ ] Documentation created
- [ ] Committed: "config: Set up Redis for token revocation"

**Time Estimate:** 2 hours  
**Priority:** 🟡 HIGH

---

### Task 1.9: Jest Testing Framework Setup [FE + BE] - 4 hours

**Description:** Configure Jest for 80% coverage target with TypeScript support

**Acceptance Criteria:**
- [ ] Jest installed and configured in both projects
- [ ] Jest config files created:
  - Frontend: `jest.config.ts` with React Testing Library
  - Backend: `jest.config.ts` for Node.js
- [ ] Coverage threshold set to 80%:
  - branches: 80%
  - functions: 80%
  - lines: 80%
  - statements: 80%
- [ ] TypeScript support: `ts-jest` configured
- [ ] Test helpers configured (rendering utilities for React)
- [ ] Coverage report generated (lcov, html)
- [ ] npm scripts configured:
  - `npm test` - run tests
  - `npm test:watch` - watch mode
  - `npm test:coverage` - coverage report
- [ ] Pre-commit hooks run Jest before commit

**Testing Requirements:**
- [ ] Create sample unit test in each project
- [ ] Run `npm test` - passes
- [ ] Generate coverage report: `npm test:coverage`
- [ ] Verify 80% threshold configured

**Definition of Done:**
- [ ] Jest configured in both projects
- [ ] Sample tests passing
- [ ] Coverage threshold enforced
- [ ] Committed: "test: Configure Jest with 80% coverage target"

**Time Estimate:** 4 hours  
**Priority:** 🔴 CRITICAL

---

### Task 1.10: GitHub Actions CI/CD Pipeline [QA] - 4 hours

**Description:** Create automated testing and deployment pipeline

**Acceptance Criteria:**
- [ ] `.github/workflows/test.yml` created with:
  - Runs on push and pull_request
  - Configures Node.js 18
  - Sets up PostgreSQL service container
  - Sets up Redis service container
  - Runs `npm ci` (clean install)
  - Runs tests: `npm test:coverage`
  - Runs linting: `npm run lint`
  - Runs type check: `npm run type-check`
  - Reports coverage to code coverage platform
- [ ] Status checks required before merge
- [ ] Branch protection rules configured
- [ ] Documentation for CI/CD process

**Testing Requirements:**
- [ ] Push to branch and verify workflow runs
- [ ] Verify tests pass in CI
- [ ] Verify coverage report generated
- [ ] Verify ESLint errors block merge

**Definition of Done:**
- [ ] CI/CD workflow defined
- [ ] Tests passing on all pushes
- [ ] Branch protection enabled
- [ ] Committed: "ci: Add GitHub Actions test workflow"

**Time Estimate:** 4 hours  
**Priority:** 🟡 HIGH

---

### Task 1.11: Security Configuration [QA] - 3 hours

**Description:** Configure security settings and dependencies scanning

**Acceptance Criteria:**
- [ ] `.gitignore` configured properly (node_modules, .env, dist, etc.)
- [ ] `dependabot.yml` configured for automated dependency updates
- [ ] Security policy created (`.github/SECURITY.md`)
- [ ] `.env.example` created with no sensitive values
- [ ] Document secret management strategy
- [ ] Configure npm audit in CI/CD
- [ ] Create security checklist

**Testing Requirements:**
- [ ] Run `npm audit` - document baseline vulnerabilities
- [ ] Verify no secrets in git history: `git log --all -S 'password' -S 'secret'`
- [ ] Review gitignore effectiveness

**Definition of Done:**
- [ ] Security baseline established
- [ ] Secrets properly managed
- [ ] Committed: "security: Add .gitignore and dependency scanning"

**Time Estimate:** 3 hours  
**Priority:** 🟡 HIGH

---

### Sprint 1 Summary
- **Total Tasks:** 11
- **Total Hours:** 41 hours (~1.3 weeks for 3 people)
- **Blockers:** None (sequential setup)
- **Deliverables:** Fully configured dev environment, Auth0 ready, CI/CD active
- **Testing:** All Jest frameworks operational, 80% threshold enforced

---

## Sprint 2: Frontend Login/Register UI (Days 4-6)

### Sprint 2 Goals
- [ ] React components for authentication UI
- [ ] Auth0 integration complete
- [ ] Unit tests (70% of total tests)
- [ ] Responsive design (mobile-first)

---

### Task 2.1: Create AuthContext Provider [FE] - 4 hours

**Description:** Implement React Context for global auth state management

**File Location:** `src/context/__tests__/AuthContext.test.tsx` (per Section 3: Frontend `src/services/__tests__/service.test.ts`)

**Deliverables:**
- [ ] `src/context/AuthContext.tsx` created with:
  - AuthContextType interface
  - AuthProvider component
  - useAuth hook
  - User interface with id, email, name, role
- [ ] Context provides: user, isLoading, error, logout
- [ ] Auto-checks auth on app mount (GET /api/auth/me)
- [ ] Full JSDoc comments
- [ ] TypeScript strict compliance

**Tests Required:** `src/context/__tests__/AuthContext.test.tsx`
- [ ] Should check auth status on mount
- [ ] Should set user on successful auth check
- [ ] Should handle auth check failure
- [ ] Logout function clears user
- [ ] useAuth hook throws outside provider

**Acceptance Criteria:**
- [ ] 80%+ test coverage
- [ ] No TypeScript errors
- [ ] Proper error handling

**Time Estimate:** 4 hours  
**Priority:** 🔴 CRITICAL

---

### Task 2.2: Build LoginPage Component [FE] - 3 hours

**Description:** Create responsive login page with Auth0 redirect

**File Location:** `src/pages/__tests__/LoginPage.test.tsx` (per Section 3: Frontend `src/components/__tests__/Component.test.tsx`)

**Deliverables:**
- [ ] `src/pages/LoginPage.tsx` with:
  - Responsive Card layout (mobile-first)
  - Login button redirects to Auth0
  - Loading spinner during redirect
  - Helpful text for users
  - Error display (if applicable)
  - Redirect to dashboard if already logged in
  - Full JSDoc comments
  - Tailwind CSS styling
  - Uses shadcn/ui Button component

**Tests Required:** 70%+ coverage
- [ ] Should render login button
- [ ] Should redirect to Auth0 on click
- [ ] Should redirect if user already logged in
- [ ] Should show loading state
- [ ] Should handle loading/error states

**Acceptance Criteria:**
- [ ] Responsive on mobile, tablet, desktop
- [ ] Accessible (ARIA labels, keyboard navigation)
- [ ] <100ms initial render
- [ ] No console warnings

**Time Estimate:** 3 hours  
**Priority:** 🔴 CRITICAL

---

### Task 2.3: Handle Auth0 Callback [FE] - 4 hours

**Description:** Create callback handler for Auth0 redirect

**File Location:** `src/pages/__tests__/AuthCallback.test.tsx` (per Section 3: Frontend `src/services/__tests__/service.test.ts`)

**Deliverables:**
- [ ] `src/pages/AuthCallback.tsx` with:
  - Extracts `code` and `state` from URL
  - Posts to `/api/auth/callback`
  - Shows loading spinner during exchange
  - Redirects to dashboard on success
  - Redirects to login with error on failure
  - Full JSDoc comments
  - Validates CSRF state parameter

**Tests Required:** 70%+ coverage
- [ ] Should extract code and state from URL
- [ ] Should POST to callback endpoint
- [ ] Should redirect to dashboard on success
- [ ] Should redirect to login on failure
- [ ] Should handle network errors

**Acceptance Criteria:**
- [ ] Fast feedback (no >2s waiting)
- [ ] Proper error messages
- [ ] No sensitive data in URL

**Time Estimate:** 4 hours  
**Priority:** 🔴 CRITICAL

---

### Task 2.4: Create ProtectedRoute Component [FE] - 3 hours

**Description:** Implement route protection with role-based access

**File Location:** `src/components/__tests__/ProtectedRoute.test.tsx` (per Section 3: Frontend `src/components/__tests__/Component.test.tsx`)

**Deliverables:**
- [ ] `src/components/ProtectedRoute.tsx` with:
  - Checks authentication status
  - Validates required role(s)
  - Redirects to login if not authenticated
  - Redirects to /unauthorized if insufficient role
  - Shows loading state
  - Type-safe requiredRoles parameter
  - Full JSDoc comments

**Tests Required:** 70%+ coverage
- [ ] Should show loading while checking auth
- [ ] Should redirect to login if not auth
- [ ] Should render children if authorized
- [ ] Should redirect if insufficient role
- [ ] Should handle multiple required roles

**Acceptance Criteria:**
- [ ] No unauthorized access
- [ ] Proper redirects
- [ ] Fast route transitions

**Time Estimate:** 3 hours  
**Priority:** 🔴 CRITICAL

---

### Task 2.5: Build LoginForm Component [FE] - 4 hours

**Description:** Create login form with validation (optional for Phase 1, may skip)

**Deliverables:**
- [ ] `src/components/LoginForm.tsx` with:
  - Email and password inputs
  - Form validation
  - Error messages
  - Loading state
  - Submit handler
  - Full JSDoc comments
  - Tailwind CSS + shadcn/ui

**Note:** MVP may use direct Auth0 redirect instead of form.

**Time Estimate:** 4 hours  
**Priority:** 🟢 LOW (defer if time constrained)

---

### Task 2.6: Implement UserMenu Component [FE] - 3 hours

**Description:** Create user menu with logout capability

**File Location:** `src/components/__tests__/UserMenu.test.tsx` (per Section 3: Frontend `src/components/__tests__/Component.test.tsx`)

**Deliverables:**
- [ ] `src/components/UserMenu.tsx` with:
  - Display current user email
  - Display user role badge (color-coded)
  - Logout button
  - Dropdown menu
  - Mobile responsive
  - Full JSDoc comments

**Tests Required:** 70%+ coverage
- [ ] Should display user info
- [ ] Should call logout on click
- [ ] Should display role badge

**Acceptance Criteria:**
- [ ] Logged-in users see menu
- [ ] Logout works properly
- [ ] Responsive design

**Time Estimate:** 3 hours  
**Priority:** 🟡 HIGH

---

### Task 2.7: Create App Router & Layout [FE] - 3 hours

**Description:** Set up React Router with main layout

**File Location:** `src/__tests__/App.test.tsx` (per Section 3: Frontend `src/components/__tests__/Component.test.tsx`)

**Deliverables:**
- [ ] `src/App.tsx` with React Router setup
- [ ] `src/layouts/MainLayout.tsx` for authenticated pages
- [ ] Routes configured:
  - /login → LoginPage
  - /auth/callback → AuthCallback
  - /dashboard → ProtectedRoute(Dashboard)
  - /unauthorized → UnauthorizedPage
- [ ] AuthProvider wrapped around app
- [ ] Full JSDoc comments

**Tests Required:** Basic route navigation tests
- [ ] Routes render correct components
- [ ] Proper redirects occur

**Time Estimate:** 3 hours  
**Priority:** 🔴 CRITICAL

---

### Sprint 2 Summary
- **Total Tasks:** 7
- **Total Hours:** 27 hours (~1 week for 1 FE dev)
- **Deliverables:** Complete auth UI, routing, context
- **Testing:** 70%+ unit test coverage
- **Blockers:** Requires Sprint 1 complete

---

## Sprint 3: Backend JWT & Middleware (Days 7-9)

### Sprint 3 Goals
- [ ] JWT token service operational
- [ ] Auth middleware with role refresh
- [ ] Auth routes implemented
- [ ] Rate limiting active
- [ ] 70%+ test coverage

---

### Task 3.1: Create TokenService [BE] - 4 hours

**Description:** Implement JWT generation and validation

**File Location:** `src/services/__tests__/tokenService.test.ts` (per Section 3: Backend `src/services/__tests__/service.test.ts`)

**Deliverables:**
- [ ] `src/services/tokenService.ts` with:
  - TokenPayload interface
  - generateToken(userId, email, role): string
  - verifyToken(token): TokenPayload
  - needsRoleRefresh(token): boolean
  - Full JSDoc comments with @param, @returns, @throws, @example

**Tests Required:** 80%+ coverage
- [ ] Should generate valid JWT token
- [ ] Should verify valid token
- [ ] Should reject expired token
- [ ] Should reject invalid signature
- [ ] Should detect role refresh needed
- [ ] Should include all required claims

**Acceptance Criteria:**
- [ ] Tokens expire in 30 minutes
- [ ] HS256 algorithm used
- [ ] Proper claims included
- [ ] 80%+ test coverage

**Time Estimate:** 4 hours  
**Priority:** 🔴 CRITICAL

---

### Task 3.2: Implement Auth Middleware [BE] - 5 hours

**Description:** Create middleware for JWT validation and role refresh

**File Location:** `src/middleware/__tests__/auth.test.ts` (per Section 3: Backend `src/middleware/__tests__/middleware.test.ts`)

**Deliverables:**
- [ ] `src/middleware/auth.ts` with:
  - authMiddleware(req, res, next)
  - Check token in cookies
  - Validate revocation list (Redis)
  - Verify JWT signature
  - Refresh role if needed (every 5 min)
  - Attach user to req.user
  - Full JSDoc comments
  - Proper error handling

**Tests Required:** 80%+ coverage
- [ ] Should validate valid JWT
- [ ] Should reject missing token
- [ ] Should reject revoked token
- [ ] Should reject expired token
- [ ] Should refresh role if changed
- [ ] Should return 401 on auth failure

**Acceptance Criteria:**
- [ ] <10ms validation time
- [ ] Proper error messages
- [ ] 80%+ test coverage

**Time Estimate:** 5 hours  
**Priority:** 🔴 CRITICAL

---

### Task 3.3: Create Rate Limiter Middleware [BE] - 3 hours

**Description:** Implement login rate limiting (5 attempts / 15 min)

**File Location:** `src/middleware/__tests__/rateLimiter.test.ts` (per Section 3: Backend `src/middleware/__tests__/middleware.test.ts`)

**Deliverables:**
- [ ] `src/middleware/rateLimiter.ts` with:
  - loginRateLimiter(req, res, next)
  - Track attempts per email in Redis
  - Limit: 5 attempts per 15 minutes
  - Return 429 (Too Many Requests) when exceeded
  - Skip on Redis failure
  - Full JSDoc comments

**Tests Required:** 80%+ coverage
- [ ] Should allow 5 attempts per 15 min
- [ ] Should reject 6th attempt with 429
- [ ] Should expire old attempts
- [ ] Should handle Redis failures

**Acceptance Criteria:**
- [ ] Effective DDoS protection
- [ ] Fair to legitimate users
- [ ] Proper error responses

**Time Estimate:** 3 hours  
**Priority:** 🟡 HIGH

---

### Task 3.4: Implement Auth Routes [BE] - 6 hours

**Type:** INTEGRATION TEST (Move to Sprint 5)

**Description:** Create backend auth endpoints

**File Location:** `src/routes/__tests__/auth.integration.test.ts` (per Section 3: Backend `src/routes/__tests__/route.integration.test.ts`)

**Deliverables:**
- [ ] `src/routes/auth.ts` with routes:
  - POST /callback - Exchange code for JWT
  - POST /logout - Invalidate session
  - GET /me - Get current user
- [ ] `src/controllers/authController.ts` with:
  - authCallback handler
  - logout handler
  - getMe handler
- [ ] Full JSDoc comments on all endpoints
- [ ] Proper error handling

**Tests Required:** 80%+ coverage
- [ ] POST /callback should create JWT
- [ ] POST /logout should clear cookie
- [ ] GET /me should return user info
- [ ] Endpoints return proper error codes

**Acceptance Criteria:**
- [ ] <500ms callback response time
- [ ] <5ms logout response
- [ ] Proper HTTP status codes

**Time Estimate:** 6 hours  
**Priority:** 🔴 CRITICAL

---

### Task 3.5: Auth0 Token Exchange [BE] - 4 hours

**Description:** Implement backend token exchange with Auth0

**Deliverables:**
- [ ] Exchange authorization code for ID token
- [ ] Create/update user in database
- [ ] Generate JWT for frontend
- [ ] Set secure cookie
- [ ] Create audit log entry
- [ ] Full JSDoc comments
- [ ] Error handling for:
  - Invalid code
  - SAML unavailable
  - User not EPAM domain
- [ ] Validate CSRF state parameter

**Tests Required:** 80%+ coverage
- [ ] Should exchange valid code
- [ ] Should create user on first login
- [ ] Should update user on subsequent login
- [ ] Should reject invalid code
- [ ] Should validate CSRF state

**Acceptance Criteria:**
- [ ] New users created automatically
- [ ] Roles assigned from Auth0
- [ ] Secure cookie set

**Time Estimate:** 4 hours  
**Priority:** 🔴 CRITICAL

---

### Task 3.6: Logout Implementation [BE] - 3 hours

**Description:** Implement hybrid logout (sync response + async revocation)

**Deliverables:**
- [ ] Synchronous: Clear JWT cookie (response <5ms)
- [ ] Asynchronous: Add to revocation list (background)
- [ ] Delete session from database
- [ ] Audit log entry
- [ ] Error handling and retry logic
- [ ] Full JSDoc comments

**Tests Required:** 80%+ coverage
- [ ] Should return immediate success
- [ ] Should clear cookie
- [ ] Should add to revocation list
- [ ] Should delete session

**Acceptance Criteria:**
- [ ] Response <5ms
- [ ] Token revoked within seconds
- [ ] No data loss

**Time Estimate:** 3 hours  
**Priority:** 🟡 HIGH

---

### Task 3.7: Error Handling Middleware [BE] - 2 hours

**Description:** Create centralized error handler

**File Location:** `src/middleware/__tests__/errorHandler.test.ts` (per Section 3: Backend `src/middleware/__tests__/middleware.test.ts`)

**Deliverables:**
- [ ] `src/middleware/errorHandler.ts` with:
  - Catch all errors
  - Log to console/Sentry
  - Return proper HTTP status
  - Hide sensitive info
  - Full JSDoc comments

**Tests Required:** 80%+ coverage
- [ ] Should catch thrown errors
- [ ] Should return 500 for unhandled
- [ ] Should not expose sensitive data

**Time Estimate:** 2 hours  
**Priority:** 🟡 HIGH

---

### Sprint 3 Summary
**UNIT TESTS ONLY (per Pyramid - 70% of tests)**
- **Total Tasks:** 4 unit tests (3.1, 3.2, 3.3, 3.7)
- **Total Hours:** 14 hours (~1 week for 1 BE dev)
- **Deliverables:** TokenService, Auth Middleware, Rate Limiter, Error Handler (all UNIT tested)
- **Testing:** 80%+ unit test coverage
- **NOTE:** Integration tests 3.4, 3.5, 3.6 moved to Sprint 5
- **Blockers:** Requires Sprint 1 complete

---

## Sprint 4: RBAC & Protected Routes (Days 10-12)

### Sprint 4 Goals
- [ ] Role-based access control working
- [ ] Protected routes by role
- [ ] Integration tests passing
- [ ] Dashboard routing by role

---

### Task 4.1: Create Authorization Middleware [BE] - 3 hours

**Description:** Implement role-based endpoint protection

**File Location:** `src/middleware/__tests__/authorize.test.ts` (per Section 3: Backend `src/middleware/__tests__/middleware.test.ts`)

**Deliverables:**
- [ ] `src/middleware/authorize.ts` with:
  - authorize(requiredRoles) middleware factory
  - Check req.user has required role
  - Return 403 if insufficient
  - Full JSDoc comments

**Tests Required:** 80%+ coverage
- [ ] Should allow authorized roles
- [ ] Should reject insufficient role
- [ ] Should handle multiple allowed roles

**Time Estimate:** 3 hours  
**Priority:** 🟡 HIGH

---

### Task 4.2: Create Protected Backend Routes [BE] - 4 hours

**Description:** Add authorization to routes by role

**Deliverables:**
- [ ] Evaluation routes (Evaluator, Admin only)
- [ ] Admin routes (Admin only)
- [ ] Protected idea submission routes
- [ ] Full JSDoc on all endpoints

**Tests Required:** 80%+ coverage
- [ ] Integration tests for each role
- [ ] Test authorization enforcement

**Time Estimate:** 4 hours  
**Priority:** 🟡 HIGH

---

### Task 4.3: Create Dashboard Component [FE] - 4 hours

**Description:** Build role-based landing page

**File Location:** `src/pages/__tests__/Dashboard.test.tsx` (per Section 3: Frontend `src/components/__tests__/Component.test.tsx`)

**Deliverables:**
- [ ] `src/pages/Dashboard.tsx` that routes by role:
  - Submitter → SubmitterDashboard
  - Evaluator → EvaluatorDashboard
  - Admin → AdminDashboard
- [ ] Protected with ProtectedRoute
- [ ] Show user role
- [ ] Navigation to role-specific features
- [ ] Full JSDoc comments

**Tests Required:** 70%+ coverage
- [ ] Should show correct dashboard per role
- [ ] Should redirect unauthorized users

**Time Estimate:** 4 hours  
**Priority:** 🟡 HIGH

---

### Task 4.4: Create Role-Specific Dashboards [FE] - 6 hours

**Description:** Build dashboard pages for each role

**File Locations:** 
- `src/pages/__tests__/SubmitterDashboard.test.tsx`
- `src/pages/__tests__/EvaluatorDashboard.test.tsx`
- `src/pages/__tests__/AdminDashboard.test.tsx`
(per Section 3: Frontend `src/components/__tests__/Component.test.tsx`)

**Deliverables:**
- [ ] `src/pages/SubmitterDashboard.tsx`
- [ ] `src/pages/EvaluatorDashboard.tsx`
- [ ] `src/pages/AdminDashboard.tsx`
- [ ] Each shows role-relevant info
- [ ] Full JSDoc comments

**Tests Required:** 70%+ coverage
- [ ] Each page renders correctly
- [ ] Proper access restrictions

**Time Estimate:** 6 hours  
**Priority:** 🟡 HIGH

---

### Task 4.5: Integration Tests [BE] - 4 hours

**Type:** INTEGRATION TEST (Move to Sprint 5)

**Description:** Create integration tests for RBAC

**File Location:** `src/routes/__tests__/auth.integration.test.ts` for auth routes; `src/routes/__tests__/rbac.integration.test.ts` for RBAC (per Section 3: Backend `src/routes/__tests__/route.integration.test.ts`)

**Deliverables:**
- [ ] `src/routes/__tests__/rbac.integration.test.ts`
- [ ] Test role-based route access
- [ ] Test authorization middleware
- [ ] Test protected endpoints

**Tests Required:** 80%+ coverage
- [ ] User with role can access
- [ ] User without role denied
- [ ] Multiple roles work

**Time Estimate:** 4 hours  
**Priority:** 🟡 HIGH

---

### Sprint 4 Summary
**UNIT TESTS ONLY (per Pyramid - 70% of tests)**
- **Total Tasks:** 3 unit tests (4.1, 4.3, 4.4)
- **Total Hours:** 13 hours (~1 week for FE + BE team)
- **Deliverables:** Authorization Middleware, Dashboard components (all UNIT tested)
- **Testing:** 70%+ unit test coverage on frontend, 80%+ on backend
- **NOTE:** Integration tests for RBAC moved to Sprint 5
- **Blockers:** Requires Sprints 1-3 complete

---

## Sprint 5: Integration Testing (20% of tests - Days 10-12)

### Sprint 5 Goals
- [ ] All backend routes integration tested (real database)
- [ ] Auth flow end-to-end verified (code exchange → JWT → protected routes)
- [ ] RBAC integration tests passing
- [ ] Coverage: 80%+ on all endpoints

---

### Task 5.1: Backend Route Integration Tests [BE] - 6 hours

**Type:** INTEGRATION TEST (from Sprint 3)

**Description:** Integration test all auth endpoints with real PostgreSQL

**File Location:** `src/routes/__tests__/auth.integration.test.ts` (per Section 3: Backend `src/routes/__tests__/route.integration.test.ts`)

**Deliverables:**
- [ ] `src/routes/__tests__/auth.integration.test.ts` combining Tasks 3.4, 3.5, 3.6:
  - POST /callback - code exchange tests
  - POST /logout - logout tests
  - GET /me - current user tests
  - Real PostgreSQL test database
  - Real Redis for token revocation

**Tests Required:** 80%+ coverage
- [ ] Code exchange creates JWT
- [ ] Logout revokes token
- [ ] GET /me returns user info
- [ ] Error responses correct

**Time Estimate:** 6 hours  
**Priority:** 🔴 CRITICAL

---

### Task 5.2: RBAC Integration Tests [BE] - 4 hours

**Type:** INTEGRATION TEST (from Sprint 4)

**Description:** Test role-based route access with real database

**File Location:** `src/routes/__tests__/rbac.integration.test.ts` (per Section 3: Backend `src/routes/__tests__/route.integration.test.ts`)

**Deliverables:**
- [ ] Test authorization enforcement per role
- [ ] Test protected endpoints
- [ ] Real database seeding with test users

**Tests Required:** 80%+ coverage
- [ ] User with role can access
- [ ] User without role gets 403
- [ ] Multiple roles work correctly

**Time Estimate:** 4 hours  
**Priority:** 🟡 HIGH

---

### Sprint 5 Summary
**INTEGRATION TESTS ONLY (per Pyramid - 20% of tests)**
- **Total Tasks:** 2 integration tests (5.1, 5.2 combining 3.4, 3.5, 3.6, 4.5)
- **Total Hours:** 10 hours (~1 week for 1 BE dev)
- **Deliverables:** Auth routes + RBAC integration tested with real DB/Redis
- **Testing:** 80%+ coverage on all endpoints
- **Blockers:** Requires Sprints 1-4 complete

---

## Sprint 6: E2E Testing (10% of tests - Days 13)

### Sprint 6 Goals
- [ ] Critical user workflows tested end-to-end
- [ ] Happy path scenarios verified
- [ ] <5 seconds per E2E test

---

### Task 6.1: Auth Flow E2E Test [FE] - 4 hours

**Type:** E2E TEST (Playwright)

**Description:** Test complete authentication flow end-to-end

**File Location:** `tests/e2e/auth-flow.spec.ts` (per Section 3: E2E `tests/e2e/`)

**Deliverables:**
- [ ] `tests/e2e/auth-flow.spec.ts` with Playwright tests:
  - User visits login page
  - User clicks Auth0 login
  - Auth0 callback redirects to dashboard
  - User logged in status verified
  - Logout clears session

**Tests Required:** Happy path only
- [ ] Complete login flow works
- [ ] Redirect to dashboard occurs
- [ ] Logout functional
- [ ] <5 seconds total

**Acceptance Criteria:**
- [ ] Test runs consistently
- [ ] No flakiness
- [ ] Clear error messages

**Time Estimate:** 4 hours  
**Priority:** 🟡 HIGH

---

### Task 6.2: Role-Based Access E2E Test [FE] - 3 hours

**Type:** E2E TEST (Playwright)

**Description:** Test role-based access control end-to-end

**File Location:** `tests/e2e/role-based-access.spec.ts` (per Section 3: E2E `tests/e2e/`)

**Deliverables:**
- [ ] `tests/e2e/role-based-access.spec.ts` with Playwright tests:
  - Submitter user sees submitter dashboard
  - Evaluator user sees evaluator dashboard
  - Admin user sees admin dashboard
  - Unauthorized user redirected

**Tests Required:** Role verification
- [ ] Each role sees correct dashboard
- [ ] Unauthorized access blocked
- [ ] <5 seconds total

**Time Estimate:** 3 hours  
**Priority:** 🟡 HIGH

---

### Sprint 6 Summary
**E2E TESTS ONLY (per Pyramid - 10% of tests)**
- **Total Tasks:** 2 E2E tests (6.1, 6.2)
- **Total Hours:** 7 hours (~1 week for 1 FE dev)
- **Deliverables:** Auth flow and role-based access critical workflows tested
- **Framework:** Playwright
- **Blockers:** Requires Sprints 1-5 complete

---

## Sprint 7: Testing, Security & Deployment (Days 14-15)

### Sprint 5 Goals
- [ ] 80% test coverage achieved
- [ ] Security audit passed
- [ ] Performance targets met
- [ ] Ready for production

---

### Task 7.1: Achieve 80% Test Coverage [FE + BE] - 6 hours

**Description:** Ensure all code meets coverage threshold

**Deliverables:**
- [ ] Generate coverage report: `npm run test:coverage`
- [ ] Review coverage gaps
- [ ] Add tests for uncovered code
- [ ] Aim for 80%+ across all metrics

**Acceptance Criteria:**
- [ ] 80%+ branches coverage
- [ ] 80%+ function coverage
- [ ] 80%+ line coverage
- [ ] 80%+ statement coverage
- [ ] No unfinished tests

**Time Estimate:** 6 hours  
**Priority:** 🔴 CRITICAL

---

### Task 7.2: Security Audit [QA] - 4 hours

**Description:** Conduct security review

**Deliverables:**
- Checklist:
  - [ ] OWASP Top 10 reviewed
  - [ ] JWT security verified
  - [ ] Cookie flags checked
  - [ ] CORS properly configured
  - [ ] SQL injection prevention (ORM)
  - [ ] XSS prevention (React)
  - [ ] CSRF protection (state param)
  - [ ] Rate limiting active
  - [ ] HTTPS enforced
  - [ ] Sensitive data not logged
  - [ ] Dependencies scanned
  - [ ] Headers configured (CSP, HSTS)

**Acceptance Criteria:**
- [ ] All security items passed
- [ ] Vulnerabilities documented
- [ ] Remediation plan created

**Time Estimate:** 4 hours  
**Priority:** 🔴 CRITICAL

---

### Task 7.3: Performance Testing [QA] - 4 hours

**Description:** Verify performance targets met

**Acceptance Criteria:**
- [ ] Token validation <10ms
- [ ] Logout response <5ms
- [ ] Login <500ms
- [ ] Role refresh <50ms
- [ ] GET /me <50ms
- [ ] Rate limiting <5ms

**Tests Required:**
- [ ] Performance benchmarks in Jest
- [ ] Load testing simulation

**Time Estimate:** 4 hours  
**Priority:** 🟡 HIGH

---

### Task 7.4: Docker Configuration [QA] - 3 hours

**Description:** Create Docker image for deployment

**Deliverables:**
- [ ] Dockerfile for backend
- [ ] docker-compose.yml for local dev
- [ ] .dockerignore properly configured

**Testing:**
- [ ] Build image without errors
- [ ] Container runs successfully

**Time Estimate:** 3 hours  
**Priority:** 🟡 HIGH

---

### Task 7.5: Documentation [QA] - 4 hours

**Description:** Create production documentation

**Deliverables:**
- [ ] README.md with setup instructions
- [ ] DEPLOYMENT.md with production guide
- [ ] API.md documenting endpoints
- [ ] SECURITY.md with security policies
- [ ] TROUBLESHOOTING.md for common issues

**Time Estimate:** 4 hours  
**Priority:** 🟡 HIGH

---

### Task 7.6: Production Deployment [QA] - 4 hours

**Description:** Deploy to production environment

**Acceptance Criteria:**
- [ ] Health check endpoint responding
- [ ] Monitoring and alerts configured
- [ ] Error logging active (Sentry)
- [ ] Database backups configured
- [ ] Team trained

**Time Estimate:** 4 hours  
**Priority:** 🔴 CRITICAL

---

### Sprint 7 Summary
- **Total Tasks:** 6
- **Total Hours:** 25 hours (~2 days for all)
- **Deliverables:** Production-ready system with full test coverage
- **Testing:** 80%+ coverage verified across 19 unit+integration+E2E tests
- **Blockers:** Requires Sprints 1-6 complete

---

## Test Distribution Summary

**Total Test Tasks:** 19 (per Testing Pyramid)
- **Unit Tests:** 13 tasks (68%) = Sprints 2, 3, 4
- **Integration Tests:** 4 tasks (21%) = Sprint 5  
- **E2E Tests:** 2 tasks (11%) = Sprint 6
- **Quality/Deployment:** 6 tasks = Sprint 7

**File Locations (per Section 3 of Constitution):**
- Frontend: `src/components/__tests__/`, `src/pages/__tests__/`, `src/services/__tests__/`, `src/__tests__/`
- Backend: `src/services/__tests__/`, `src/middleware/__tests__/`, `src/routes/__tests__/`
- E2E: `tests/e2e/`

**All tasks reference correct Section 3 file locations from constitution**

---

## Task Priority Matrix

### 🔴 CRITICAL (Must Complete)
- [x] Frontend/Backend project setup
- [x] TypeScript strict mode
- [x] Auth0 SAML config
- [x] Database schema
- [x] Jest framework
- [x] TokenService
- [x] Auth middleware
- [x] Auth routes
- [x] Coverage 80%+
- [x] Security audit
- [x] Production deploy

### 🟡 HIGH (Should Complete)
- Auth0 + JWT integration
- Rate limiting
- Router setup
- Authorization middleware
- Performance testing
- Docker config

### 🟢 LOW (Nice to Have)
- LoginForm component (if not using direct Auth0 redirect)
- Advanced logging
- Analytics

---

## Resource Allocation

**Frontend Developer (FE):**
- Sprint 1: Tasks 1.1, 1.3, 1.9
- Sprint 2: ALL (Tasks 2.1-2.7) - 7 unit tests
- Sprint 3: (support only)
- Sprint 4: Tasks 4.3, 4.4 - 2 unit tests
- Sprint 5: (support only)
- Sprint 6: Tasks 6.1, 6.2 - 2 E2E tests
- Sprint 7: Task 7.1, 7.3 (partial)

**Backend Developer (BE):**
- Sprint 1: Tasks 1.2, 1.3, 1.4, 1.6, 1.7, 1.8, 1.9
- Sprint 2: (support only)
- Sprint 3: Tasks 3.1, 3.2, 3.3, 3.7 - 4 unit tests
- Sprint 4: Tasks 4.1 - 1 unit test
- Sprint 5: Tasks 5.1, 5.2 - 2 integration tests
- Sprint 6: (support only)
- Sprint 7: Task 7.1, 7.2, 7.3 (partial)

**DevOps/QA Engineer (QA):**
- Sprint 1: Tasks 1.5, 1.6, 1.8, 1.10, 1.11
- Sprints 2-6: (test support & monitoring)
- Sprint 7: Tasks 7.2, 7.3, 7.4, 7.5, 7.6

---

## Task Assignment Example

**Day 1, Morning:**
- FE: Task 1.1 (Project setup)
- BE: Task 1.2 (Project setup)
- QA: Task 1.5 (Auth0 config prep - async)

**Day 1, Afternoon:**
- FE: Task 1.3 (TypeScript strict)
- BE: Task 1.3 (TypeScript strict)
- QA: Task 1.6 (Database setup)

---

## Acceptance Criteria for All Tasks

Every task must satisfy:
- [ ] Code passes TypeScript strict mode (`tsc --noEmit`)
- [ ] Code passes linting (`npm run lint`)
- [ ] Code passes formatting (`npm run format`)
- [ ] Unit tests passing with 70%+ coverage
- [ ] No console errors or warnings
- [ ] Full JSDoc comments with examples
- [ ] Committed with descriptive message
- [ ] PR reviewed and approved
- [ ] Merged to main branch

---

## Definition of Done (Sprint Level)

A sprint is complete when:
- [ ] All tasks 100% complete
- [ ] Test coverage 80%+
- [ ] No TypeScript errors
- [ ] CI/CD pipeline green
- [ ] All code reviewed
- [ ] Documentation updated
- [ ] Team trained on changes
- [ ] Ready for next sprint

---

**Tasks Document Version:** 2.0  
**Status:** ✅ PYRAMID-ALIGNED & READY FOR TEAM ASSIGNMENT  
**Total Test Tasks:** 19 (13 unit + 4 integration + 2 E2E)\n**Total Hours:** 147 hours (~10.5 working days for 3-person team)  
**Timeline:** 3 weeks (7 sprints with overlaps)  
**Test Distribution:** 68% unit, 21% integration, 11% E2E (per constitution pyramid)  
**Constitution Compliance:** ✅ TypeScript Strict | Jest 80% | JSDoc Required | All file locations per Section 3
