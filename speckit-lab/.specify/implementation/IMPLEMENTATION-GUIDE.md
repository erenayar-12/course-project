# Speckit-Lab: Implementation Guide

**Auth-Workflow System - EPIC-1 Complete Implementation**

**Date Created:** February 24, 2026  
**Status:** ✅ READY FOR DEVELOPMENT  
**Constitution Version:** 8 sections (7 testing principles + 1 tools & frameworks)  
**Tasks Version:** 7 sprints (19 tests pyramid-aligned: 13 unit + 2 integration + 2 E2E)  
**Team Size:** 3 developers (1 FE + 1 BE + 1 QA)  
**Timeline:** 3 weeks (7 sprints with overlaps)

---

## Table of Contents

1. [Constitution Compliance Checklist](#constitution-compliance-checklist)
2. [Test Pyramid Implementation](#test-pyramid-implementation)
3. [Sprint-by-Sprint Implementation](#sprint-by-sprint-implementation)
4. [Pre-Development Setup](#pre-development-setup)
5. [Code Quality Gates](#code-quality-gates)
6. [Deployment Checklist](#deployment-checklist)

---

## Constitution Compliance Checklist

### ✅ Section 1: Testing Philosophy
**Requirement:** RED-GREEN-REFACTOR cycle, test-first mandate

**Implementation Steps:**
- [ ] Enable pre-commit hooks to prevent commits without tests
- [ ] Create test file BEFORE any implementation file
- [ ] Use naming convention: `src/component.test.tsx` (test) before `src/component.tsx` (impl)
- [ ] PR must include tests for all new code

**Validation Commands:**
```bash
npm run test:coverage  # Must show all functions tested
npm run test -- --testNamePattern="LoginPage"  # Only test specific feature
```

---

### ✅ Section 2: Coverage Requirements (Testing Pyramid)

**70% Unit Tests (13 tasks)** - Sprints 2, 3, 4
```
Target: 300-400 unit tests
Coverage: 80% line, 75% branch, 80% function
Execution: <100ms per test, <1s total for 100 tests
Framework: Jest + React Testing Library (frontend), Jest + supertest (backend)
```

**20% Integration Tests (2 tasks)** - Sprint 5
```
Target: 20-30 integration tests
Coverage: 80% endpoint coverage
Database: Real PostgreSQL test instance
Execution: <500ms per test, <5s total for 10 tests
```

**10% E2E Tests (2 tasks)** - Sprint 6
```
Target: 5-10 E2E workflows
Framework: Playwright
Execution: <5s per test, <30s total
Focus: Critical happy-path workflows only
```

**Implementation Checklist:**
- [ ] Sprint 2: 7 frontend unit tests complete (70%+ coverage each)
- [ ] Sprint 3: 4 backend unit tests complete (80%+ coverage each)
- [ ] Sprint 4: 3 mixed tests complete (dashboard + auth)
- [ ] Sprint 5: 2 integration test files complete (route + RBAC)
- [ ] Sprint 6: 2 E2E test files complete (auth flow + role access)
- [ ] Final: `npm run test:coverage` shows 80% line coverage

---

### ✅ Section 3: Test Types & Organization

**File Structure (per Constitution Section 3):**

```
Frontend:
src/
├── components/
│   ├── LoginPage.tsx
│   ├── ProtectedRoute.tsx
│   ├── UserMenu.tsx
│   └── __tests__/
│       ├── LoginPage.test.tsx ✅
│       ├── ProtectedRoute.test.tsx ✅
│       └── UserMenu.test.tsx ✅
├── context/
│   ├── AuthContext.tsx
│   └── __tests__/
│       └── AuthContext.test.tsx ✅
├── pages/
│   ├── Dashboard.tsx
│   ├── LoginPage.tsx
│   ├── AuthCallback.tsx
│   ├── SubmitterDashboard.tsx
│   ├── EvaluatorDashboard.tsx
│   ├── AdminDashboard.tsx
│   └── __tests__/
│       ├── Dashboard.test.tsx ✅
│       ├── LoginPage.test.tsx ✅
│       ├── AuthCallback.test.tsx ✅
│       ├── SubmitterDashboard.test.tsx ✅
│       ├── EvaluatorDashboard.test.tsx ✅
│       └── AdminDashboard.test.tsx ✅
├── App.tsx
├── __tests__/
│   └── App.test.tsx ✅
└── tests/
    ├── e2e/
    │   ├── auth-flow.spec.ts ✅
    │   └── role-based-access.spec.ts ✅
    ├── fixtures/
    │   ├── users.ts
    │   └── tokens.ts
    └── helpers.ts

Backend:
src/
├── services/
│   ├── tokenService.ts
│   └── __tests__/
│       └── tokenService.test.ts ✅
├── middleware/
│   ├── auth.ts
│   ├── rateLimiter.ts
│   ├── authorize.ts
│   ├── errorHandler.ts
│   └── __tests__/
│       ├── auth.test.ts ✅
│       ├── rateLimiter.test.ts ✅
│       ├── authorize.test.ts ✅
│       └── errorHandler.test.ts ✅
├── routes/
│   ├── auth.ts
│   └── __tests__/
│       ├── auth.integration.test.ts ✅
│       └── rbac.integration.test.ts ✅
└── controllers/
    └── authController.ts
```

**Implementation Checklist:**
- [ ] All folders created per structure above
- [ ] `__tests__` folders co-located with source files
- [ ] Integration tests in `src/routes/__tests__/`
- [ ] E2E tests in `tests/e2e/`
- [ ] Fixtures organized in `tests/fixtures/`

---

### ✅ Section 4: Naming Conventions

**File Naming Standards:**
- [ ] Unit tests: `ComponentName.test.tsx`, `service.test.ts`
- [ ] Integration tests: `route.integration.test.ts`
- [ ] E2E tests: `user-journey-name.spec.ts`
- [ ] Test suites: `describe('[ComponentName]', ...)`
- [ ] Test cases: `it('should [action] when [condition]', ...)`

**Example Test Structure:**
```typescript
// ✅ CORRECT
describe('AuthContext', () => {
  describe('useAuth', () => {
    describe('when user is authenticated', () => {
      it('should return user object with email and role', () => {
        // ...
      });
    });
  });
});

// ❌ WRONG
describe('Auth Tests', () => {
  it('works', () => {
    // ...
  });
});
```

**Implementation Checklist:**
- [ ] All test files follow naming convention
- [ ] All `describe()` blocks named after component/service
- [ ] All `it()` blocks follow "should [action] when [condition]" pattern
- [ ] No generic test descriptions

---

### ✅ Section 5: Test Anatomy (Arrange-Act-Assert)

**Every Test Must Follow AAA Pattern:**

```typescript
// ✅ CORRECT
it('should set user state when AuthContext mounts', () => {
  // 🔵 ARRANGE - Set up test data
  const mockUser = { id: '123', email: 'user@example.com', role: 'SUBMITTER' };
  jest.mock('./authService', () => ({
    getCurrentUser: jest.fn().mockResolvedValue(mockUser)
  }));

  // 🟢 ACT - Execute code being tested
  render(<TestWrapper><Component /></TestWrapper>);
  
  // 🔴 ASSERT - Verify outcome
  expect(screen.getByText(mockUser.email)).toBeInTheDocument();
});
```

**Setup/Teardown Rules:**
- [ ] Use `beforeEach()` for test-specific setup (test isolation)
- [ ] NEVER use `beforeAll()` for test data (violates independence)
- [ ] Each test must run independently: `npm test -- --testNamePattern="specific test"`
- [ ] Tests can run in ANY order: `npm test -- --randomOrder`

**Integration Test Setup:**
```typescript
// ✅ CORRECT - One-time expensive setup
beforeAll(async () => {
  await setupTestDatabase();
  await runMigrations();
});

// ✅ CORRECT - Per-test cleanup
beforeEach(async () => {
  await truncateAllTables();
});

afterEach(async () => {
  jest.clearAllMocks();
});
```

**Implementation Checklist:**
- [ ] All tests follow AAA pattern
- [ ] `beforeEach()` used for test isolation (not `beforeAll()`)
- [ ] All tests include at least one assertion
- [ ] Tests runnable in isolation and in any order
- [ ] No global state between tests

---

### ✅ Section 6: Mocking & Test Data

**Mocking Hierarchy (DO NOT DEVIATE):**

```
┌─────────────────────────────────────┐
│ 1. AVOID MOCKING (Use Real Code)   │
│ - Your services, utils, validators │
└─────────────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│ 2. MOCK EXTERNAL (HTTP APIs)       │
│ - Auth0, email services, Stripe    │
└─────────────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│ 3. STUB TIME (jest.useFakeTimers)  │
│ - Date.now(), setTimeout           │
└─────────────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│ 4. FAKE DB (In-memory for units)   │
│ - Mock Prisma for unit tests       │
└─────────────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│ 5. REAL DB (Integration tests)     │
│ - PostgreSQL test instance         │
└─────────────────────────────────────┘
```

**Test Fixtures Organization:**

```typescript
// src/tests/fixtures/users.ts
export const TEST_USER_SUBMITTER = {
  id: 'test-user-1',
  email: 'submitter@example.com',
  role: 'SUBMITTER' as const,
  auth0Id: 'auth0|123',
  createdAt: new Date('2026-01-01'),
};

export function createTestUser(overrides = {}) {
  return { ...TEST_USER_SUBMITTER, ...overrides };
}
```

**Frontend Fixtures Example:**
```typescript
// src/tests/helpers/auth.ts
export async function loginAsUser(app, user = TEST_USER_SUBMITTER) {
  const token = jwt.sign(user, 'test-secret', { expiresIn: '30m' });
  localStorage.setItem('jwt_token', token);
  return token;
}
```

**Backend Integration Test Example:**
```typescript
// src/routes/__tests__/auth.integration.test.ts
describe('POST /api/auth/callback', () => {
  beforeAll(async () => {
    // Start real PostgreSQL test database
    await setupTestDatabase();
  });

  beforeEach(async () => {
    // Truncate tables before each test
    await truncateAllTables();
  });

  it('should exchange code for JWT', async () => {
    // Use REAL test database, not mocks
    const response = await request(app)
      .post('/api/auth/callback')
      .send({ code: 'valid-auth0-code' });

    expect(response.status).toBe(200);
    const user = await prisma.user.findUnique({
      where: { email: 'user@example.com' }
    });
    expect(user).toBeDefined();
  });
});
```

**Implementation Checklist:**
- [ ] No mocking of your own services (only external APIs)
- [ ] Real PostgreSQL for all integration tests
- [ ] Mock Prisma ONLY for unit tests
- [ ] Fixtures in `src/tests/fixtures/`
- [ ] Helpers in `src/tests/helpers/`
- [ ] No hardcoded test data in test files

---

### ✅ Section 7: Quality Criteria

**5 Golden Rules (Non-Negotiable):**

| Rule | Definition | Example ✅ | Counterexample ❌ |
|------|-----------|----------|------------------|
| **Observable Behavior** | Test what user sees, not implementation | Verify button displays error | Verify `setState()` called |
| **Meaningful Assertions** | Expected values human-validated, not tautological | `expect(result).toBe('alice')` | `expect(result).toBe(result)` |
| **Single Responsibility** | One behavior per test | Test token expiry validation | Test create + update + delete |
| **Fast** | <100ms unit, <500ms integration, <5s E2E | Pure function test | 60-second test |
| **Deterministic** | Same result every run, no flakiness | `jest.useFakeTimers()` for time | `await sleep(100)` |

**Anti-Patterns Checklist (REJECT IN CODE REVIEW):**

- [ ] ❌ Testing private methods (`spyOn(obj, 'private')`)
- [ ] ❌ Interdependent tests (test1 sets state for test2)
- [ ] ❌ Brittle tests (break on variable name refactor)
- [ ] ❌ Flaky tests (pass/fail randomly on CI)
- [ ] ❌ No assertions (`it('should load', async () => { await fn(); })`)
- [ ] ❌ Copy-pasted tests (same setup in 10 files)
- [ ] ❌ Tautological assertions (`expect(x).toEqual(x)`)
- [ ] ❌ Over-mocking (`jest.mock('./myService')` - you own this!)
- [ ] ❌ Under-mocking (real Auth0 API calls in tests)
- [ ] ❌ Slow tests (>5 seconds for unit tests)

**Mutation Testing (75% Minimum Score):**

```bash
# Install Stryker
npm install --save-dev @stryker-mutator/core @stryker-mutator/typescript-checker

# Run mutation tests
npx stryker run

# Expected output:
# Mutation score: 78.5%
#  - Killed: 157 mutations (tests caught these bugs)
#  - Survived: 43 mutations (tests MISSED these bugs)
#  - Timeout: 2 mutations
#  - Compile errors: 1 mutation
```

**If Score < 75%:**
- Identify "Survived" mutations in report
- Add edge case tests for those code paths
- Re-run until score ≥ 75%

**Implementation Checklist:**
- [ ] All tests verify observable behavior (not implementation)
- [ ] All assertions have specific expected values (no tautologies)
- [ ] Each test covers ONE behavior
- [ ] All tests <5 seconds (unit <100ms, integration <500ms)
- [ ] No flaky tests on CI/CD
- [ ] Run `npm run mutation:test` - score ≥ 75%
- [ ] Code review flags any anti-patterns immediately

---

### ✅ Section 8: Tools & Frameworks

**Exact Version Specifications:**

```json
{
  "devDependencies": {
    "typescript": "^5.3.0",
    "eslint": "^8.x",
    "prettier": "^3.x",
    "jest": "^29.x",
    "ts-jest": "^29.x",
    "@testing-library/react": "^14.x",
    "supertest": "^6.x",
    "@stryker-mutator/core": "^7.x",
    "husky": "^8.x",
    "lint-staged": "^15.x"
  }
}
```

**npm Scripts (ALL MANDATORY):**

```json
{
  "scripts": {
    "type-check": "tsc --noEmit",
    "lint": "eslint src --max-warnings 0",
    "format": "prettier --write src",
    "format:check": "prettier --check src",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:unit": "jest --testPathPattern=\\.test\\.tsx?$",
    "test:integration": "jest --testPathPattern=\\.integration\\.test\\.ts$",
    "test:e2e": "playwright test",
    "test:coverage": "jest --coverage",
    "mutation:test": "stryker run"
  }
}
```

**Pre-Commit Hooks (4-Stage Gate - Non-Bypassable):**

```bash
#!/bin/sh
# .husky/pre-commit (auto-installed by husky)

# Stage 1: Type checking
npm run type-check || exit 1

# Stage 2: Linting
npm run lint || exit 1

# Stage 3: Formatting
npm run format || exit 1

# Stage 4: Unit tests (fast)
npm run test:unit || exit 1

echo "✅ All pre-commit checks passed!"
```

**CI/CD Pipeline (7 Stages - GitHub Actions):**

```yaml
name: Comprehensive Test Suite
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_DB: epam_innovation_db_test
          POSTGRES_PASSWORD: test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
      
      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
        ports:
          - 6379:6379
    
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      # Stage 1: Type Safety
      - run: npm run type-check
      
      # Stage 2: Code Quality
      - run: npm run lint
      - run: npm run format:check
      
      # Stage 3: Database Setup
      - run: npm run db:migrate:test
        env:
          TEST_DATABASE_URL: postgresql://postgres:test@localhost:5432/epam_innovation_db_test
      
      # Stage 4: Testing
      - run: npm run test:unit --coverage
      - run: npm run test:integration
        env:
          TEST_DATABASE_URL: postgresql://postgres:test@localhost:5432/epam_innovation_db_test
          REDIS_URL: redis://localhost:6379
      
      # Stage 5: Security
      - run: npm audit --audit-level=moderate
      
      # Stage 6: Mutation Testing (Main Only)
      - if: github.ref == 'refs/heads/main'
        run: npm run mutation:test
      
      # Stage 7: Reporting
      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
```

**Implementation Checklist:**
- [ ] npm 10.x installed (`npm --version`)
- [ ] All dependencies installed (`npm ci`)
- [ ] ESLint configured with zero warnings allowed
- [ ] Prettier format applied to all code
- [ ] Jest configured with 80% coverage threshold
- [ ] Stryker configured with 75% mutation target
- [ ] husky installed and pre-commit hooks active
- [ ] GitHub Actions workflow created and passing
- [ ] Codecov integration configured for PR comments

---

## Test Pyramid Implementation

### Total Test Distribution

```
19 TOTAL TESTS (Pyramid Aligned)

13 UNIT TESTS (68%) - Sprints 2, 3, 4
├─ Sprint 2: 7 Frontend Unit Tests
│  ├─ AuthContext (1)
│  ├─ LoginPage (1)
│  ├─ AuthCallback (1)
│  ├─ ProtectedRoute (1)
│  ├─ UserMenu (1)
│  ├─ App Router (1)
│  └─ LoginForm (1)
├─ Sprint 3: 4 Backend Unit Tests
│  ├─ TokenService (1)
│  ├─ Auth Middleware (1)
│  ├─ Rate Limiter (1)
│  └─ Error Handler (1)
└─ Sprint 4: 2 Frontend + 1 Backend Unit Tests
   ├─ Authorization Middleware (1)
   └─ Dashboard Components (2)

2 INTEGRATION TESTS (11%) - Sprint 5
├─ Auth Routes Integration (combines 3 scenarios)
│  ├─ POST /callback (code exchange)
│  ├─ POST /logout (token revocation)
│  └─ GET /me (current user)
└─ RBAC Integration (role-based access)
   ├─ Endpoint access per role
   ├─ Authorization enforcement
   └─ Role transition handling

2 E2E TESTS (11%) - Sprint 6
├─ Auth Flow E2E (happy path)
│  ├─ Login page → Auth0 → Dashboard
│  ├─ User logged-in verification
│  └─ Logout functionality
└─ Role-Based Access E2E
   ├─ Submitter sees submitter dashboard
   ├─ Evaluator sees evaluator dashboard
   └─ Unauthorized user redirected
```

### Coverage Targets

```
LINE COVERAGE:     80% minimum
BRANCH COVERAGE:   75% minimum
FUNCTION COVERAGE: 80% minimum
STATEMENT COVERAGE: 80% minimum
MUTATION SCORE:    75% minimum
```

### Execution Times

```
Unit Tests (13):     ~3 seconds total
Integration Tests:   ~5 seconds total
E2E Tests (2):       ~10 seconds total
Coverage Analysis:   ~2 seconds total
Mutation Testing:    ~30 seconds total

Total CI/CD Time: ~5 minutes (parallel execution)
```

---

## Sprint-by-Sprint Implementation

### Sprint 1: Infrastructure & Auth0 Setup (Days 1-3)

**Frontend Setup**
```bash
npm create vite@latest auth-screen -- --template react-ts
cd auth-screen

# Install dependencies
npm install react-router-dom @auth0/auth0-react
npm install -D tailwindcss postcss autoprefixer jest @testing-library/react ts-jest

# Configure TypeScript strict mode
# Update tsconfig.json: "strict": true, "noImplicitAny": true

# Verify
npm run test  # Should run 0 tests (none yet)
npx tsc --noEmit  # Should show no errors
npm run lint  # Should show 0 warnings
```

**Backend Setup**
```bash
npm init -y
npm install express cors dotenv cookie-parser redis @prisma/client
npm install -D typescript @types/express @types/node jest supertest ts-jest

# Initialize Prisma
npx prisma init

# Configure TypeScript strict mode
npx tsc --init
# Update tsconfig.json: "strict": true, "noImplicitAny": true

# Verify
npm run test  # Should run 0 tests (none yet)
npx tsc --noEmit  # Should show no errors
npm run lint  # Should show 0 warnings
```

**Auth0 Configuration**
- [ ] Create Auth0 tenant
- [ ] Create SAML Web Application
- [ ] Configure SAML settings
- [ ] Set up role assignment rules
- [ ] Test SAML login flow
- [ ] Document credentials in `.env.example`

**Database Setup**
- [ ] PostgreSQL 15+ installed
- [ ] Create database: `epam_innovation_db`
- [ ] Create test database: `epam_innovation_db_test`
- [ ] Prisma schema created with Users, Sessions, AuditLogs models
- [ ] Migration generated: `npx prisma migrate dev --name init`

**CI/CD Setup**
- [ ] Create `.github/workflows/test.yml`
- [ ] Configure PostgreSQL service container
- [ ] Configure Redis service container
- [ ] All 7 stages defined but not all passing yet

**Deliverables:**
✅ Both projects initialize without errors  
✅ TypeScript strict mode enforced  
✅ Jest configured with 0 tests (baseline)  
✅ Pre-commit hooks installed  
✅ Auth0 SAML configured  
✅ Database schema created  
✅ CI/CD pipeline created  

---

### Sprint 2: Frontend Unit Tests (Days 4-6)

**7 Frontend Unit Tests (70% of unit tests)**

| Task | File | Lines | Coverage | Status |
|------|------|-------|----------|--------|
| 2.1 | `src/context/__tests__/AuthContext.test.tsx` | 100-150 | 80%+ | 🟢 Unit |
| 2.2 | `src/pages/__tests__/LoginPage.test.tsx` | 100-150 | 70%+ | 🟢 Unit |
| 2.3 | `src/pages/__tests__/AuthCallback.test.tsx` | 100-150 | 70%+ | 🟢 Unit |
| 2.4 | `src/components/__tests__/ProtectedRoute.test.tsx` | 100-150 | 70%+ | 🟢 Unit |
| 2.5 | `src/components/__tests__/UserMenu.test.tsx` | 100-150 | 70%+ | 🟢 Unit |
| 2.7 | `src/__tests__/App.test.tsx` | 100-150 | 70%+ | 🟢 Unit |
| 2.6 | Other component tests | 50-100 | 70%+ | 🟢 Unit |

**Implementation Checklist:**
- [ ] AuthContext test covers: auth check on mount, user set on success, error handling
- [ ] LoginPage test covers: button render, Auth0 redirect, user already logged-in redirect
- [ ] AuthCallback test covers: code/state extraction, callback POST, success redirect, error handling
- [ ] ProtectedRoute test covers: loading state, unauthenticated redirect, authorized render, insufficient role redirect
- [ ] UserMenu test covers: user info display, logout call, role badge display
- [ ] App router test covers: route linking, component renders
- [ ] All tests use React Testing Library (not implementation details)
- [ ] All tests use fixtures `TEST_USER_SUBMITTER` from `src/tests/fixtures/users.ts`
- [ ] All tests AAA pattern (Arrange-Act-Assert)
- [ ] All tests <100ms execution
- [ ] All tests independent (beforeEach setup)
- [ ] Coverage report: `npm run test:coverage` shows 70%+ coverage

**Validation:**
```bash
npm run test:unit -- --coverage
# Expected: 70%+ lines covered

npm run mutation:test
# Expected: Will run after all other tests pass
```

---

### Sprint 3: Backend Unit Tests (Days 7-9)

**4 Backend Unit Tests (32% of unit tests)**

| Task | File | Lines | Coverage | Status |
|------|------|-------|----------|--------|
| 3.1 | `src/services/__tests__/tokenService.test.ts` | 150-200 | 80%+ | 🟢 Unit |
| 3.2 | `src/middleware/__tests__/auth.test.ts` | 150-200 | 80%+ | 🟢 Unit |
| 3.3 | `src/middleware/__tests__/rateLimiter.test.ts` | 100-150 | 80%+ | 🟢 Unit |
| 3.7 | `src/middleware/__tests__/errorHandler.test.ts` | 100-150 | 80%+ | 🟢 Unit |

**Implementation Checklist:**
- [ ] TokenService test covers: JWT generation, token verification, expiry, claims validation, role refresh detection
- [ ] Auth middleware test covers: valid JWT validation, missing token rejection, revoked token detection, role refresh
- [ ] Rate limiter test covers: 5 attempts allowed, 6th attempt rejected with 429, old attempts expire
- [ ] Error handler test covers: error catching, HTTP status codes, sensitive data not exposed
- [ ] All tests mock external services (jest.mock())
- [ ] All tests use jest.useFakeTimers() for time-dependent code
- [ ] All tests NOT mocking own services (test real business logic)
- [ ] All tests AAA pattern
- [ ] All tests <100ms execution
- [ ] All tests independent (beforeEach setup)
- [ ] All tests include meaningful assertions (not tautological)
- [ ] Coverage report: `npm run test:coverage` shows 80%+ coverage for backend

**Validation:**
```bash
npm run test:unit -- --coverage
# Expected: 70%+ overall (combination of FE + BE)

npm run mutation:test
# Expected: Score approaching 75%
```

---

### Sprint 4: Mixed Unit Tests (Days 10-12)

**3 Mixed Unit Tests (23% of unit tests)**

| Task | File | Lines | Coverage | Status |
|------|------|-------|----------|--------|
| 4.1 | `src/middleware/__tests__/authorize.test.ts` | 100-150 | 80%+ | 🟢 Unit |
| 4.3 | `src/pages/__tests__/Dashboard.test.tsx` | 100-150 | 70%+ | 🟢 Unit |
| 4.4 | `src/pages/__tests__/{*Dashboard}.test.tsx` | 200-300 | 70%+ | 🟢 Unit |

**Implementation Checklist:**
- [ ] Authorization middleware test covers: role-based access, 403 on insufficient role, multiple allowed roles
- [ ] Dashboard router test covers: correct dashboard per role render, unauthorized redirect
- [ ] Role-specific dashboard tests cover: SubmitterDashboard, EvaluatorDashboard, AdminDashboard render correctly
- [ ] All tests independent and runnable in any order
- [ ] Combined coverage: `npm run test:coverage` shows 80%+ line coverage overall

**Validation:**
```bash
npm run test:coverage
# Expected: 80%+ line coverage across all 13 unit tests

npm run mutation:test
# Expected: Score ≥ 75% on all mutations
```

---

### Sprint 5: Integration Tests (Days 10-12 parallel)

**2 Integration Test Files (4 test scenarios)**

| Task | File | Tests | Coverage | Status |
|------|------|-------|----------|--------|
| 5.1 | `src/routes/__tests__/auth.integration.test.ts` | 3 scenarios | 80%+ | 🔵 Integration |
| 5.2 | `src/routes/__tests__/rbac.integration.test.ts` | 1+ scenarios | 80%+ | 🔵 Integration |

**Scenarios in `auth.integration.test.ts`:**
```typescript
describe('POST /api/auth/callback', () => {
  it('should exchange code for JWT', async () => {
    // Real database, real request
    const response = await request(app)
      .post('/api/auth/callback')
      .send({ code: 'valid-code' });
    
    expect(response.status).toBe(200);
    expect(response.body.jwt).toBeDefined();
    
    // Verify database was updated
    const user = await prisma.user.findUnique({
      where: { email: 'user@example.com' }
    });
    expect(user).toBeDefined();
  });
});

describe('POST /api/auth/logout', () => {
  it('should clear cookie and revoke token', async () => {
    // ...
  });
});

describe('GET /api/auth/me', () => {
  it('should return current user', async () => {
    // ...
  });
});
```

**Scenarios in `rbac.integration.test.ts`:**
```typescript
describe('Role-Based Access Control', () => {
  it('should allow authorized roles to access endpoint', async () => {
    // ...
  });

  it('should reject unauthorized roles with 403', async () => {
    // ...
  });
});
```

**Implementation Checklist:**
- [ ] Real PostgreSQL test database used (no mocks)
- [ ] Real JWT tokens created (not mocked)
- [ ] All endpoints tested: POST /callback, POST /logout, GET /me
- [ ] Role-based access tested for multiple roles
- [ ] HTTP status codes verified (200, 401, 403, 429)
- [ ] Database state changes verified after requests
- [ ] All tests <500ms execution
- [ ] All tests independent with beforeEach cleanup
- [ ] Coverage: 80%+ on all routes

**Validation:**
```bash
npm run test:integration
# Expected: All tests pass with real database

npm run test:coverage
# Expected: 80%+ coverage from unit + integration combined
```

---

### Sprint 6: E2E Tests (Days 13)

**2 E2E Test Files (Happy Path Only)**

| Task | File | Scenario | Duration | Status |
|------|------|----------|----------|--------|
| 6.1 | `tests/e2e/auth-flow.spec.ts` | Login → Dashboard → Logout | <5s | 🔴 E2E |
| 6.2 | `tests/e2e/role-based-access.spec.ts` | Role verification | <5s | 🔴 E2E |

**Test 6.1: auth-flow.spec.ts**
```typescript
test('User can login and access dashboard', async ({ page }) => {
  // 1. Visit login page
  await page.goto('http://localhost:3000/login');
  expect(page.url()).toContain('/login');

  // 2. Click Auth0 login
  await page.click('button:has-text("Login with Auth0")');

  // 3. Auth0 popup (mocked in test environment)
  // (Auth0 redirects to callback)

  // 4. Dashboard should appear
  await page.waitForNavigation();
  expect(page.url()).toContain('/dashboard');
  expect(await page.textContent('.user-email')).toContain('user@example.com');

  // 5. Logout
  await page.click('button:has-text("Logout")');
  
  // 6. Back to login
  expect(page.url()).toContain('/login');
});
```

**Test 6.2: role-based-access.spec.ts**
```typescript
test('Submitter sees submitter dashboard', async ({ page }) => {
  // Login as submitter
  await loginAsUser(page, TEST_USER_SUBMITTER);
  
  // Should see submitter dashboard
  expect(await page.textContent('h1')).toContain('Submitter Dashboard');
});

test('Evaluator sees evaluator dashboard', async ({ page }) => {
  // Login as evaluator
  await loginAsUser(page, TEST_USER_EVALUATOR);
  
  // Should see evaluator dashboard
  expect(await page.textContent('h1')).toContain('Evaluator Dashboard');
});
```

**Implementation Checklist:**
- [ ] Playwright installed: `npm install -D @playwright/test`
- [ ] E2E tests focus on HAPPY PATH ONLY (no error scenarios)
- [ ] Tests verify critical workflows (login, access, logout)
- [ ] Tests execute in <5 seconds each
- [ ] Tests run against staging environment
- [ ] No real Auth0 calls (mocked in test environment)
- [ ] All tests independent
- [ ] Tests reproducible and deterministic

**Validation:**
```bash
npm run test:e2e
# Expected: Both tests pass, each <5 seconds
```

---

### Sprint 7: Quality & Deployment (Days 14-15)

**6 Quality Assurance Tasks**

| Task | Description | Status |
|------|-----------|--------|
| 7.1 | Achieve 80% coverage | ✅ Must verify |
| 7.2 | Security audit | ✅ All checks pass |
| 7.3 | Performance testing | ✅ All benchmarks met |
| 7.4 | Docker configuration | ✅ Images build |
| 7.5 | Documentation | ✅ Complete |
| 7.6 | Production deployment | ✅ Live |

**Task 7.1: Coverage Verification**
```bash
npm run test:coverage
# Expected output:
# ======= Coverage summary =======
# Statements   : 80.5% ( 800/1000 )
# Branches     : 75.2% ( 600/800 )
# Functions    : 80.3% ( 400/500 )
# Lines        : 80.4% ( 804/1000 )

npm run mutation:test
# Expected output:
# Stryker started with 5 worker(s) and 25 concurrent test runners
# Mutation score: 76.8%
#  - Killed: 167 mutations
#  - Survived: 51 mutations
#  - Timeout: 2 mutations
```

**Task 7.2: Security Audit**
```bash
npm audit
# Expected: Zero high/critical vulnerabilities

# Manual security checklist:
# [ ] OWASP Top 10 reviewed
# [ ] JWT security verified (HS256 algorithm)
# [ ] Cookie flags checked (httpOnly, secure, sameSite)
# [ ] CORS properly configured
# [ ] SQL injection prevention (Prisma ORM)
# [ ] XSS prevention (React sanitization)
# [ ] CSRF protection (state parameter)
# [ ] Rate limiting active (5 attempts / 15 min)
# [ ] HTTPS enforced
# [ ] Sensitive data not logged
```

**Task 7.3: Performance Testing**
```typescript
// Add to test suite
describe('Performance', () => {
  it('POST /callback should respond in <500ms', async () => {
    const start = performance.now();
    const response = await request(app)
      .post('/api/auth/callback')
      .send({ code: 'valid-code' });
    const duration = performance.now() - start;
    
    expect(duration).toBeLessThan(500);
    expect(response.status).toBe(200);
  });

  it('Token validation should be <10ms', () => {
    const start = performance.now();
    tokenService.verifyToken(validToken);
    const duration = performance.now() - start;
    
    expect(duration).toBeLessThan(10);
  });
});
```

**Task 7.4: Docker Configuration**
```dockerfile
# Dockerfile (backend)
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: epam_innovation_db
      POSTGRES_PASSWORD: dev
    ports:
      - "5432:5432"
  
  redis:
    image: redis:7
    ports:
      - "6379:6379"
  
  api:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      - postgres
      - redis
    environment:
      DATABASE_URL: postgresql://postgres:dev@postgres:5432/epam_innovation_db
      REDIS_URL: redis://redis:6379
```

**Task 7.5: Documentation**
- [ ] README.md with setup instructions
- [ ] DEPLOYMENT.md with production guide
- [ ] API.md documenting all endpoints
- [ ] SECURITY.md with security policies
- [ ] TROUBLESHOOTING.md for common issues

**Task 7.6: Production Deployment**
- [ ] Health check endpoint responding
- [ ] Monitoring and alerts configured
- [ ] Error logging active (Sentry)
- [ ] Database backups configured
- [ ] SSL/TLS certificates installed
- [ ] Team trained on deployment
- [ ] Runbooks created for common issues

**Final Validation:**
```bash
# Run entire test suite
npm run type-check && \
npm run lint && \
npm run format:check && \
npm run test:unit --coverage && \
npm run test:integration && \
npm run test:e2e && \
npm run mutation:test && \
npm audit --audit-level=moderate

# Expected: All 7 CI/CD stages passing (Green)
```

---

## Pre-Development Setup

### Prerequisites Checklist
- [ ] Node.js 18+ installed: `node --version`
- [ ] npm 10+ installed: `npm --version`
- [ ] Git configured: `git config --global user.name`
- [ ] PostgreSQL 15+ installed and running
- [ ] Redis 7+ installed and running
- [ ] VS Code editor with extensions:
  - [ ] ESLint extension
  - [ ] Prettier - Code formatter
  - [ ] Jest extension
  - [ ] Playwright Test for VS Code

### Initial Project Setup

```bash
# Frontend
npm create vite@latest auth-screen -- --template react-ts
cd auth-screen
npm install
npm install -D @testing-library/react jest ts-jest

# Backend
mkdir auth-api
cd auth-api
npm init -y
npm install express @prisma/client
npm install -D @types/express jest ts-jest

# Both projects
npm install -D husky lint-staged
npx husky install
npx husky add .husky/pre-commit "npm run type-check && npm run lint && npm run test:unit"
```

### Environment Variables

**Frontend (.env.local):**
```
REACT_APP_AUTH0_DOMAIN=your-tenant.auth0.com
REACT_APP_AUTH0_CLIENT_ID=your_client_id
REACT_APP_API_URL=http://localhost:3000
```

**Backend (.env.local):**
```
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/epam_innovation_db
TEST_DATABASE_URL=postgresql://user:password@localhost:5432/epam_innovation_db_test
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-256-bit-secret-key
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_CLIENT_ID=your_client_id
AUTH0_CLIENT_SECRET=your_client_secret
```

### Database Setup

```bash
# Create databases
createdb epam_innovation_db
createdb epam_innovation_db_test

# Initialize Prisma
npx prisma migrate dev --name init

# Verify schema
npx prisma studio  # Interactive database explorer
```

---

## Code Quality Gates

### Pre-Commit Gates (4 Stages - Non-Bypassable)

```bash
# Automatic when you run: git commit

Stage 1: Type Checking
├─ Command: tsc --noEmit
├─ Failure: Exit 1 (commit blocked)
└─ Fix: Add type annotations

Stage 2: ESLint
├─ Command: eslint src --max-warnings 0
├─ Failure: Exit 1 (commit blocked)
└─ Fix: npm run lint:fix

Stage 3: Prettier (Auto-format)
├─ Command: prettier --write src
├─ Result: Files auto-formatted
└─ Commit updated files

Stage 4: Jest (Unit Tests Only)
├─ Command: jest --testPathPattern=\.test\.tsx?$
├─ Failure: Exit 1 (commit blocked)
└─ Fix: npm run test:watch to debug
```

### CI/CD Gates (7 Stages - All Must Pass)

```
Trigger: Every push and PR

Stage 1: Type Safety ✅
├─ Command: npm run type-check
├─ Block if: Any TypeScript error
└─ Time: ~5s

Stage 2: Linting ✅
├─ Command: npm run lint && npm run format:check
├─ Block if: Any lint warning or format mismatch
└─ Time: ~5s

Stage 3: Database Setup ✅
├─ Services: PostgreSQL 15 + Redis 7
├─ Command: npx prisma migrate deploy
├─ Block if: Migration fails
└─ Time: ~10s

Stage 4: Unit + Integration Tests ✅
├─ Commands: npm run test:unit && npm run test:integration
├─ Coverage: 80% line minimum
├─ Block if: Tests fail OR coverage < 80%
└─ Time: ~30s

Stage 5: Security Audit ✅
├─ Command: npm audit --audit-level=moderate
├─ Block if: High/critical vulnerabilities found
└─ Time: ~10s

Stage 6: Mutation Testing (Main branch only) ✅
├─ Command: npm run mutation:test
├─ Minimum score: 75%
├─ Block if: Score < 75%
└─ Time: ~30s

Stage 7: Reporting ✅
├─ Codecov upload
├─ PR comment with coverage delta
├─ Artifact archiving
└─ Time: ~10s

Total Time: ~5 minutes (parallel stages)
```

### Code Review Checklist

**Every PR must satisfy:**

```
TESTING:
- [ ] All new code has test coverage (70%+ unit tests)
- [ ] Tests written BEFORE implementation (TDD)
- [ ] AAA pattern (Arrange-Act-Assert)
- [ ] No tautological assertions
- [ ] No test data in arbitrary files
- [ ] Integration tests use real database
- [ ] No mocking own services
- [ ] All tests <5 seconds

CODE QUALITY:
- [ ] TypeScript strict mode, no `any` types
- [ ] All functions have JSDoc comments
- [ ] ESLint passes with 0 warnings
- [ ] Prettier formatting applied
- [ ] No console.log() in production code
- [ ] No commented-out code
- [ ] Clear variable/function names

ANTI-PATTERNS (REJECT):
- [ ] ❌ Testing private methods
- [ ] ❌ Interdependent tests
- [ ] ❌ Mocking own services
- [ ] ❌ Real API calls in tests
- [ ] ❌ Flaky/time-dependent tests
- [ ] ❌ Tests without assertions
- [ ] ❌ Copy-pasted test code
- [ ] ❌ Over >5 second test blocks

DOCUMENTATION:
- [ ] PR description explains WHAT and WHY
- [ ] Breaking changes documented
- [ ] Database migrations included
- [ ] Config changes noted
- [ ] Dependencies justified
```

---

## Deployment Checklist

### Pre-Deployment Verification

```bash
# 1. Local test suite passes
npm run test:coverage  # 80%+ coverage
npm run mutation:test  # 75%+ score

# 2. Security check passes
npm audit --audit-level=moderate  # No vulnerabilities

# 3. Performance benchmarks met
npm run test:performance  # All <target times

# 4. Build succeeds
npm run build  # No errors or warnings

# 5. Docker image builds
docker build -t epam-auth-api:latest .

# 6. All environments configured
cat .env.production  # All secrets set
env | grep JWT_SECRET  # Verify secrets in place
```

### Production Deployment Steps

```bash
# 1. Tag release
git tag -a v1.0.0 -m "Release v1.0.0 - Auth system MVP"
git push origin v1.0.0

# 2. GitHub Actions workflow runs automatically
# - Builds Docker image
# - Runs full test suite
# - Pushes to container registry
# - Deploys to production

# 3. Verify deployment
curl https://api.example.com/health  # Should return 200
curl -X GET https://api.example.com/api/auth/me \
  -H "Authorization: Bearer $TEST_JWT"  # Should return user

# 4. Monitor
# - Check error tracking (Sentry)
# - Monitor database performance
# - Watch API response times
# - Alert on error rate increases
```

### Post-Deployment Validation

```bash
# 1. Health check
curl -v https://api.example.com/health

# 2. Database connectivity
# Login to production database and verify:
# - Tables created
# - Indexes present
# - Foreign keys configured

# 3. Auth flow test
# - Login to application
# - Verify JWT issued
# - Verify role assignment
# - Verify token refresh
# - Verify logout

# 4. E2E tests in production
npm run test:e2e -- --headed  # Visual verification

# 5. Performance monitoring
# - Average response time: <500ms
# - 99th percentile: <1s
# - Error rate: <0.1%
```

### Rollback Plan

```bash
# If deployment fails:

# 1. Identify the problem
git log --oneline -5  # Check recent commits
tail -100 /var/log/app/error.log  # Check error log

# 2. Rollback to previous version
git revert <bad_commit_hash>
git tag -a v1.0.1-rollback -m "Rollback to v1.0.0"
git push origin v1.0.1-rollback

# 3. Re-deploy
kubectl rollout rollback deployment/auth-api

# 4. Root cause analysis
# Document:
# - What failed
# - Why it wasn't caught in testing
# - How to prevent in future
```

---

## Success Metrics

### Development Metrics

```
✅ Code Quality:
   - ESLint: 0 warnings
   - TypeScript: 0 errors
   - Prettier: 100% compliant

✅ Test Coverage:
   - Line coverage: 80%+
   - Branch coverage: 75%+
   - Mutation score: 75%+

✅ Test Execution:
   - Unit tests: <1s total
   - Integration tests: <5s total
   - E2E tests: <30s total
   - Full suite: <5 minutes

✅ Performance:
   - Token validation: <10ms
   - Login response: <500ms
   - GET /me: <50ms
   - All endpoints: <1s
```

### Business Metrics (Post-Launch)

```
✅ System Availability:
   - Uptime: 99.9%+
   - MTTR (Mean Time to Recovery): <5 minutes

✅ User Experience:
   - Login success rate: >98%
   - Average login time: <2 seconds
   - Error rate: <0.1%

✅ Security:
   - Zero security incidents
   - All vulns patched within 24h
   - Audit score: 100%
```

---

## Final Checklist

```
BEFORE FIRST COMMIT:
- [ ] Constitution reviewed and understood
- [ ] Task pyramid understood (13 unit, 2 integration, 2 E2E)
- [ ] File locations per Section 3 memorized
- [ ] All tools installed (Node, npm, TypeScript, Jest)
- [ ] Pre-commit hooks installed and tested
- [ ] GitHub Actions workflow created

DURING DEVELOPMENT:
- [ ] Write test FIRST (RED-GREEN-REFACTOR)
- [ ] Each test follows AAA pattern
- [ ] Each test <100ms execution
- [ ] No hardcoded test data
- [ ] Coverage report after each sprint
- [ ] Mutation score trending toward 75%

BEFORE SPRINT COMPLETION:
- [ ] All tests passing locally
- [ ] Coverage report verified (80%+)
- [ ] Code review approved
- [ ] CI/CD pipeline green
- [ ] Security audit passed

BEFORE DEPLOYMENT:
- [ ] All sprints complete (Sprints 1-7)
- [ ] 80%+ coverage achieved
- [ ] 75%+ mutation score
- [ ] Zero critical vulnerabilities
- [ ] Performance benchmarks met
- [ ] Documentation complete
- [ ] Team trained
```

---

**Document Version:** 1.0  
**Last Updated:** February 24, 2026  
**Created By:** Speckit-Lab Constitution & Tasks Framework  
**Status:** ✅ READY FOR IMPLEMENTATION  
**Team:** 1 Frontend + 1 Backend + 1 QA (3 developers)  
**Timeline:** 3 weeks (21 days including weekends, 15 working days)  
**Success Criteria:** Constitution compliance + Test pyramid + All gates passing
