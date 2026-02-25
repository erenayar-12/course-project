# Testing Plan - Auth0 Integration (STORY-EPIC-1.2)

**Date:** February 25, 2026  
**Framework:** Jest 29.x + React Testing Library 14.x  
**Coverage Target:** 80% line, 75% branch, 80% function, 80% statement  
**Mutation Target:** 75% minimum (Stryker)

---

## Overview

This document outlines the testing strategy for STORY-EPIC-1.2 (Integrate Auth0 Authentication) following the **Speckit-Lab Constitution** testing discipline:

1. **Test-First (TDD):** Tests written BEFORE implementation
2. **Specify via Tests:** Specification documents drive test creation
3. **Pyramid Structure:** 70% unit, 20% integration, 10% E2E
4. **AAA Pattern:** Arrange → Act → Assert with color-coded comments (🔵🟢🔴)
5. **Behavior-Driven:** Test observable outcomes, not implementation details
6. **Semantic Queries:** Use `getByRole`, `getByLabelText` (avoid `data-testid`)
7. **Deterministic Tests:** No flakiness; mock time/APIs; test isolation

### Coverage Requirements (Constitution Section 3.2)
| Metric | Target | Status |
|--------|--------|--------|
| **Line Coverage** | 80% | ⚠️ In Progress |
| **Branch Coverage** | 75% | ⚠️ In Progress |
| **Function Coverage** | 80% | ⚠️ In Progress |
| **Statement Coverage** | 80% | ⚠️ In Progress |
| **Mutation Score** | 75% | 📋 Phase 2 |

---

## Test File Organization (Constitution Section 3.3)

**Convention:** Test files co-located with source, `__tests__/` directory mirrors source tree

```
src/
├── config/
│   ├── auth0Config.ts
│   └── __tests__/
│       ├── auth0Config.test.ts              (NEW: Unit tests - pure functions)
│       └── auth0Config.integration.test.ts  (NEW: Integration tests)
├── pages/
│   ├── LoginPage.tsx
│   ├── RegistrationPage.tsx
│   └── __tests__/
│       ├── LoginPage.test.tsx               (UPDATE: Add Auth0 unit tests)
│       ├── LoginPage.integration.test.tsx   (NEW: Auth0 hook integration)
│       ├── RegistrationPage.test.tsx        (UPDATE: Add Auth0 unit tests)
│       └── RegistrationPage.integration.test.tsx  (NEW: Auth0 hook integration)
└── tests/
    ├── fixtures/
    │   ├── auth.ts                   (NEW: Test Auth0 responses)
    │   └── users.ts                  (NEW: Test user data)
    ├── helpers/
    │   ├── auth.ts                   (NEW: loginAsUser() helper)
    │   └── mocking.ts                (NEW: Mock Auth0 hooks)
    └── e2e/
        └── auth-flow.spec.ts         (Phase 2: Playwright E2E)
```

**File Naming Convention (Constitution Section 3.4):**
- `Component.test.tsx` — Unit tests (isolated, mocked dependencies)
- `Component.integration.test.tsx` — Integration tests (real hooks/APIs)
- `user-journey.spec.ts` — E2E tests (full app workflows)

---

## Test Anatomy: AAA Pattern (Constitution Section 3.5)

All tests follow **Arrange-Act-Assert** with color-coded comments for clarity:

```typescript
// 🔵 ARRANGE: Set up test data and mocks
// 🟢 ACT: Execute the code being tested
// 🔴 ASSERT: Verify the expected outcome

it('should [action] when [condition]', () => {
  // 🔵 ARRANGE
  const testData = { id: '123', email: 'user@example.com' };
  
  // 🟢 ACT
  const result = functionUnderTest(testData);
  
  // 🔴 ASSERT
  expect(result).toEqual(expectedValue);
});
```

---

## Unit Tests

### 1. LoginPage.test.tsx — Unit Tests (STORY-EPIC-1.1 + 1.2)

**Location:** `src/pages/__tests__/LoginPage.test.tsx`  
**Type:** Unit tests (component rendering, state management)  
**Spec Reference:** STORY-EPIC-1.2 Acceptance Criteria drive test creation

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useAuth0 } from '@auth0/auth0-react';
import LoginPage from '../LoginPage';

// Mock external service (Auth0)
jest.mock('@auth0/auth0-react');

describe('LoginPage', () => {
  let mockLoginWithRedirect: jest.Mock;
  
  beforeEach(() => {
    mockLoginWithRedirect = jest.fn();
    jest.clearAllMocks();
    (useAuth0 as jest.Mock).mockReturnValue({
      loginWithRedirect: mockLoginWithRedirect,
      isLoading: false,
      error: null,
      isAuthenticated: false,
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('AC 1: Valid login redirects to Auth0', () => {
    it('should call loginWithRedirect when form submitted', async () => {
      // 🔵 ARRANGE: Render component
      render(<LoginPage />);
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      // 🟢 ACT: User fills form and submits
      fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      // 🔴 ASSERT: loginWithRedirect called with email hint
      await waitFor(() => {
        expect(mockLoginWithRedirect).toHaveBeenCalledWith(
          expect.objectContaining({
            authorizationParams: expect.objectContaining({
              login_hint: 'user@example.com',
            }),
          })
        );
      });
    });

    it('should show loading state during authentication (AC 5)', async () => {
      // 🔵 ARRANGE: Mock isLoading = true
      (useAuth0 as jest.Mock).mockReturnValue({
        loginWithRedirect: mockLoginWithRedirect,
        isLoading: true,
        error: null,
        isAuthenticated: false,
      });

      // 🟢 ACT: Render component
      render(<LoginPage />);

      // 🔴 ASSERT: Button shows loading state
      const button = screen.getByRole('button', { name: /logging in/i });
      expect(button).toBeDisabled();
      expect(screen.getByText(/logging in/i)).toBeInTheDocument();
    });
  });

  describe('AC 2: Invalid credentials show error message', () => {
    it('should display error when loginWithRedirect fails', async () => {
      // 🔵 ARRANGE: Mock Auth0 error
      (useAuth0 as jest.Mock).mockReturnValue({
        loginWithRedirect: mockLoginWithRedirect,
        isLoading: false,
        error: { message: 'Invalid password' },
        isAuthenticated: false,
      });

      // 🟢 ACT: Render component
      render(<LoginPage />);

      // 🔴 ASSERT: Generic error message displayed
      expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
    });

    it('should show validation error for empty email', async () => {
      // 🔵 ARRANGE: Render component
      render(<LoginPage />);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      // 🟢 ACT: Click submit without filling email
      fireEvent.click(submitButton);

      // 🔴 ASSERT: Custom validation error (not API error)
      await waitFor(() => {
        expect(screen.getByText(/please enter both email and password/i)).toBeInTheDocument();
      });
    });

    it('should prevent multiple submissions (AC 5)', async () => {
      // 🔵 ARRANGE: Render component
      render(<LoginPage />);
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);

      fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      // 🟢 ACT: Click submit multiple times
      fireEvent.click(submitButton);
      fireEvent.click(submitButton);
      fireEvent.click(submitButton);

      // 🔴 ASSERT: Only one loginWithRedirect call
      await waitFor(() => {
        expect(mockLoginWithRedirect).toHaveBeenCalledTimes(1);
      });
    });
  });
});
```

### 2. RegistrationPage.test.tsx — Unit Tests (STORY-EPIC-1.1 + 1.2)

**Location:** `src/pages/__tests__/RegistrationPage.test.tsx`  
**Type:** Unit tests (component rendering, form validation)

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useAuth0 } from '@auth0/auth0-react';
import RegistrationPage from '../RegistrationPage';

jest.mock('@auth0/auth0-react');

describe('RegistrationPage', () => {
  let mockLoginWithRedirect: jest.Mock;

  beforeEach(() => {
    mockLoginWithRedirect = jest.fn();
    jest.clearAllMocks();
    (useAuth0 as jest.Mock).mockReturnValue({
      loginWithRedirect: mockLoginWithRedirect,
      isLoading: false,
      error: null,
      isAuthenticated: false,
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('AC 3: Registration with new credentials', () => {
    it('should call loginWithRedirect with signup screen hint', async () => {
      // 🔵 ARRANGE: Render form
      render(<RegistrationPage />);
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/^password/i);
      const confirmInput = screen.getByLabelText(/confirm password/i);
      const submitButton = screen.getByRole('button', { name: /create account/i });

      // 🟢 ACT: Fill matching passwords and submit
      fireEvent.change(emailInput, { target: { value: 'newuser@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'SecurePass123' } });
      fireEvent.change(confirmInput, { target: { value: 'SecurePass123' } });
      fireEvent.click(submitButton);

      // 🔴 ASSERT: Auth0 signup flow called
      await waitFor(() => {
        expect(mockLoginWithRedirect).toHaveBeenCalledWith(
          expect.objectContaining({
            authorizationParams: expect.objectContaining({
              screen_hint: 'signup',
              login_hint: 'newuser@example.com',
            }),
          })
        );
      });
    });

    it('should validate password minimum length (8 characters)', async () => {
      // 🔵 ARRANGE: Render form
      render(<RegistrationPage />);
      const passwordInput = screen.getByLabelText(/^password/i);
      const submitButton = screen.getByRole('button', { name: /create account/i });

      // 🟢 ACT: Fill with short password
      fireEvent.change(passwordInput, { target: { value: 'short' } });
      fireEvent.click(submitButton);

      // 🔴 ASSERT: Validation error shown
      await waitFor(() => {
        expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
      });
      expect(mockLoginWithRedirect).not.toHaveBeenCalled();
    });

    it('should validate password confirmation match', async () => {
      // 🔵 ARRANGE: Render form
      render(<RegistrationPage />);
      const passwordInput = screen.getByLabelText(/^password/i);
      const confirmInput = screen.getByLabelText(/confirm password/i);
      const submitButton = screen.getByRole('button', { name: /create account/i });

      // 🟢 ACT: Fill with mismatched passwords
      fireEvent.change(passwordInput, { target: { value: 'SecurePass123' } });
      fireEvent.change(confirmInput, { target: { value: 'DifferentPass456' } });
      fireEvent.click(submitButton);

      // 🔴 ASSERT: Mismatch error shown
      await waitFor(() => {
        expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
      });
      expect(mockLoginWithRedirect).not.toHaveBeenCalled();
    });
  });

  describe('AC 5: Loading state during registration', () => {
    it('should show loading state while creating account', async () => {
      // 🔵 ARRANGE: Mock isLoading = true
      (useAuth0 as jest.Mock).mockReturnValue({
        loginWithRedirect: mockLoginWithRedirect,
        isLoading: true,
        error: null,
        isAuthenticated: false,
      });

      // 🟢 ACT: Render component
      render(<RegistrationPage />);

      // 🔴 ASSERT: Button shows loading state
      const button = screen.getByRole('button', { name: /creating account/i });
      expect(button).toBeDisabled();
      expect(screen.getByText(/creating account/i)).toBeInTheDocument();
    });
  });
});
```

### 3. auth0Config.test.ts — Unit Tests (Pure Functions)

**Location:** `src/config/__tests__/auth0Config.test.ts`  
**Type:** Unit tests (pure functions, no dependencies)

```typescript
import { validateAuth0Config, AUTH0_CONFIG } from '../auth0Config';

describe('auth0Config', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('validateAuth0Config', () => {
    it('should throw error when VITE_AUTH0_DOMAIN is missing', () => {
      // 🔵 ARRANGE: Missing Auth0 domain
      process.env.VITE_AUTH0_DOMAIN = '';
      process.env.VITE_AUTH0_CLIENT_ID = 'valid-client-id';

      // 🟢 ACT & 🔴 ASSERT: Expect throw
      expect(() => validateAuth0Config()).toThrow(/Auth0 configuration is incomplete/);
    });

    it('should throw error when VITE_AUTH0_CLIENT_ID is missing', () => {
      // 🔵 ARRANGE: Missing client ID
      process.env.VITE_AUTH0_DOMAIN = 'example.auth0.com';
      process.env.VITE_AUTH0_CLIENT_ID = '';

      // 🟢 ACT & 🔴 ASSERT: Expect throw
      expect(() => validateAuth0Config()).toThrow(/Auth0 configuration is incomplete/);
    });

    it('should not throw when both domain and client ID present', () => {
      // 🔵 ARRANGE: Valid config
      process.env.VITE_AUTH0_DOMAIN = 'example.auth0.com';
      process.env.VITE_AUTH0_CLIENT_ID = 'valid-client-id';

      // 🟢 ACT & 🔴 ASSERT: No error
      expect(() => validateAuth0Config()).not.toThrow();
    });
  });

  describe('AUTH0_CONFIG', () => {
    it('should contain domain and clientId from environment', () => {
      // 🔵 ARRANGE: Env vars set
      process.env.VITE_AUTH0_DOMAIN = 'tenant.auth0.com';
      process.env.VITE_AUTH0_CLIENT_ID = 'client-123';

      // 🟢 ACT: Import config
      // 🔴 ASSERT: Config matches env vars
      expect(AUTH0_CONFIG.domain).toBe('tenant.auth0.com');
      expect(AUTH0_CONFIG.clientId).toBe('client-123');
    });

    it('should have redirectUri pointing to /dashboard', () => {
      // 🔴 ASSERT: Includes /dashboard
      expect(AUTH0_CONFIG.redirectUri).toMatch(/\/dashboard$/);
    });
  });
});
```

---

## Mocking Strategy (Constitution Section 3.6)

### What to Mock vs. Not Mock (Hierarchy)

**✅ MOCK EXTERNAL SERVICES:**
- Auth0 (`@auth0/auth0-react`)
- HTTP calls (`axios`, `fetch`)
- Time-dependent code (`Date.now()`)
- Third-party APIs

**❌ DO NOT MOCK:**
- Your own service code
- Pure utility functions
- React components you own
- Router (wrap in BrowserRouter instead)

### Auth0 Hook Mocking Pattern

```typescript
// ✅ CORRECT: Mock external Auth0 service
jest.mock('@auth0/auth0-react');

const mockLoginWithRedirect = jest.fn();
(useAuth0 as jest.Mock).mockReturnValue({
  loginWithRedirect: mockLoginWithRedirect,
  isLoading: false,
  error: null,
  isAuthenticated: false,
});

// ❌ WRONG: Don't mock your own code
// jest.mock('../src/services/authService'); // Don't do this!
```

### Router Integration (Not Mocked)

```typescript
// ✅ GOOD: Wrap components in Router (not mocked)
render(
  <BrowserRouter>
    <LoginPage />
  </BrowserRouter>
);

// ✅ GOOD: Test navigation works
const link = screen.getByRole('link', { name: /register/i });
expect(link).toHaveAttribute('href', '/register');
```

---

## Running Tests (Constitution Section 8 Scripts)

```bash
# Run all tests once
npm test

# Run tests in watch mode (development)
npm run test:watch

# Run ONLY unit tests (fast feedback)
npm run test:unit

# Run ONLY integration tests
npm run test:integration

# Generate coverage report with HTML
npm run test:coverage

# View coverage HTML report
npm run test:coverage:report

# Run mutation testing (Phase 2)
npm run mutation:test

# CI/CD comprehensive suite
npm run ci
```

---

## Coverage Status (Constitution Section 3.2)

**Coverage Targets (Constitutional Minimums):**
| Layer | Line | Branch | Function | Statement |
|-------|------|--------|----------|-----------|
| **Global Target** | 80% | 75% | 80% | 80% |
| **Current Status** | ~65% | ~60% | ~65% | ~65% |
| **Gap** | -15% | -15% | -15% | -15% |

**By Component:**
| File | Current | Target | Gap | Status |
|------|---------|--------|-----|--------|
| LoginPage | ~70% | 80% | -10% | ⚠️ below |
| RegistrationPage | ~70% | 80% | -10% | ⚠️ below |
| auth0Config | 0% | 80% | -80% | ❌ missing |
| **TOTAL** | ~65% | 80% | -15% | ❌ below |

**Roadmap:**
- Phase 1 (Current): Reach 80% on auth components
- Phase 2: Add mutation testing (75% score minimum)
- Phase 3: Full E2E coverage with Playwright

---

## Definition of Done (Constitution Section 1)

**Per Constitutional Definition of Done:**
- [ ] **TDD Compliance:** Tests written BEFORE implementation
- [ ] **Spec-Driven:** All tests generated from STORY-EPIC-1.2 acceptance criteria
- [ ] **Coverage Met:** 80% line, 75% branch, 80% function, 80% statement
- [ ] **AAA Pattern:** All tests follow Arrange-Act-Assert with color comments
- [ ] **Semantic Queries:** No `data-testid`; use `getByRole`, `getByLabelText`
- [ ] **Behavior-Focused:** Tests verify WHAT app does, not HOW it works
- [ ] **Test Independence:** Each test runnable in isolation
- [ ] **Deterministic:** No flaky tests; mock all time/APIs
- [ ] **Mocking:** External services mocked, own code not mocked
- [ ] **Performance:** Unit tests <100ms, integration <500ms
- [ ] **JSDoc:** All public functions have @param, @returns, @throws
- [ ] **No Console Errors:** Clean test output
- [ ] **CI/CD Pass:** All tests pass in GitHub Actions pipeline
- [ ] **PR Review:** Reviewer verifies test quality before approval

---

## Constitutional Standards (Ratified)

This testing plan adheres to **Speckit-Lab Constitution** standards:

✅ **Section I:** Clean Code with meaningful names  
✅ **Section II:** TypeScript strict mode mandatory  
✅ **Section III:** Testing Pyramid (70% unit, 20% integration, 10% E2E)  
✅ **Section IV:** JSDoc comments on all public APIs  
✅ **Section V:** Code Quality (ESLint, Prettier, complexity limits)  
✅ **Section VI:** Test-First TDD mandate  
✅ **Section VII:** AAA pattern with test anatomy  
✅ **Section VIII:** Jest 29.x, npm scripts, pre-commit hooks, CI/CD gates  

---

## Implementation Guidelines

**BEFORE Writing Code (RED-GREEN-REFACTOR):**
1. Write test that FAILS (RED phase)
2. Implement minimum code to pass test (GREEN phase)
3. Refactor while keeping test green (REFACTOR phase)
4. Commit test + code together

**During Code Review:**
- Reviewer checks test quality first (before implementation)
- Verify AAA pattern, semantic queries, behavior-focused
- Confirm coverage meets 80% threshold
- Reject if tests written after implementation (TDD violation)

**In CI/CD (GitHub Actions):**
- Type-check → Lint → Format → Unit Tests → Integration → Security → Mutation → Report
- All gates must pass 100% before merge
- Coverage reported to Codecov
- Failed gate = PR blocked from merge

---

## Related Specifications

- **STORY-EPIC-1.1:** Display Login/Registration Pages
- **STORY-EPIC-1.2:** Integrate Auth0 Authentication
- **STORY-EPIC-1.3:** JWT Token Storage (Phase 2)
- **Speckit-Lab Constitution:** Constitution.md standards
- **agents.md:** Project conventions and tech stack

---

**Version:** 2.0 | **Updated:** February 25, 2026  
**Status:** Constitutional Alignment Complete ✅  
**Next Step:** Implement tests following TDD (RED-GREEN-REFACTOR cycle)

