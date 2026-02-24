# Speckit-Lab Constitution

Code Quality, TypeScript Excellence, and Testing Discipline

## Core Principles

### I. Clean Code (NON-NEGOTIABLE)
All code must be clean, readable, and maintainable. This means:
- **Meaningful naming:** Variables, functions, and classes must have clear, intention-revealing names
- **Small functions:** Each function does one thing well (Single Responsibility Principle)
- **No duplication:** DRY principle strictly enforced; extract common patterns
- **Error handling:** Explicit error handling; no silent failures
- **Comments:** Only when WHY is not obvious from code; avoid obvious comments

### II. TypeScript with Strict Mode
All source code must be written in TypeScript with strict mode enabled:
- **tsconfig.json:** `"strict": true` and `"noImplicitAny": true` mandatory
- **Type safety:** No `any` types; use `unknown` if needed, then narrow types
- **Explicit types:** All function parameters and returns must be typed
- **Null checks:** Strict null checks enabled; handle null/undefined explicitly
- **No casting:** Minimize type-as assertions; prefer proper typing

### III. Testing Pyramid (80% Coverage on Business Logic)
Testing is mandatory and follows the pyramid strategy:
- **Unit Tests** (Bottom, 70% of tests): Core business logic, utilities, pure functions
  - Fast execution: < 100ms per test
  - No external dependencies or mocking
  - Target: 80% code coverage on business logic
  - Framework: Jest with 80% minimum coverage threshold
- **Integration Tests** (Middle, 20% of tests): API routes, database interactions, external service calls
  - Test actual integrations with real/test databases
  - Use test fixtures and controlled environments
  - "Test realistic workflows end-to-end at component boundaries"
- **E2E Tests** (Top, 10% of tests): Critical user journeys only
  - Smoke tests for deployment
  - Happy path scenarios

### IV. JSDoc Comments (Mandatory for Public APIs)
All public functions, classes, and exports must have JSDoc comments:
- **Function docs:** @param, @returns, @throws, @example required for public APIs
- **Type docs:** Document complex types and interfaces
- **Module header:** Every file should have a description of its purpose
- **Format:** Follow JSDoc standard; generate HTML docs from comments
- **Example:**
  ```typescript
  /**
   * Validates user credentials against the authentication system.
   * @param email - User email address (ISO format)
   * @param password - User password (min 8 chars)
   * @returns Promise<AuthToken> with JWT and refresh token
   * @throws InvalidCredentialsError if email/password invalid
   * @example
   * const token = await validateCredentials('user@example.com', 'password123');
   */
  async function validateCredentials(email: string, password: string): Promise<AuthToken>
  ```

## Code Quality Standards

### Linting & Formatting
- **ESLint:** Enforced; no warnings allowed in merge
- **Prettier:** Automatic formatting; non-configurable
- **Pre-commit hooks:** Lint + format on every commit
- **CI Gate:** All checks must pass before merge

### Complexity & Performance
- **Cyclomatic Complexity:** Max 10 per function (measured by ESLint)
- **Function Length:** Max 50 lines (excluding JSDoc and tests)
- **Bundle Size:** Tree-shaking enabled; no dead code
- **Performance:** Critical paths must have benchmarks

## Testing Principles (COMPREHENSIVE)

### Section 1: Testing Philosophy
All code is written following **Test-Driven Development (TDD)** principles with strict discipline:

**RED-GREEN-REFACTOR Cycle (MANDATORY)**
1. **RED:** Write a failing test that describes desired behavior
2. **GREEN:** Write minimal code to make test pass
3. **REFACTOR:** Improve code while keeping test green

**Test-First Mandate:**
- Write tests **BEFORE** implementation code
- Tests are generated from **specification requirements**, not implementation details
- Specification documents drive test creation (e.g., AUTH-SYSTEM-SPEC.md → test suite)
- No implementation is considered complete without passing tests
- Tests are executable specifications of intended behavior

**Rationale:** TDD ensures code is testable by design, reduces bugs, documents expected behavior, and creates living documentation.

---

### Section 2: Coverage Requirements (Testing Pyramid)

**Distribution & Targets:**
```
        ◆ E2E (10%)            5-10 critical workflows
       ◆ ◆ Integration (20%)    30-50 component boundaries
      ◆ ◆ ◆ Unit Tests (70%)   300-500 unit tests
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Coverage Metrics (ALL MUST BE MET):**
- **Line Coverage:** 80% minimum on business logic
- **Branch Coverage:** 75% minimum (if/else paths)
- **Function Coverage:** 80% minimum
- **Mutation Score:** 75% minimum (mutation testing with Stryker/Mutant)

**By Category:**
- **Unit Tests (70%):** Service layer, utilities, business logic, pure functions
  - Example: `TokenService.generateToken()`, `validateEmail()`, `calculateRoleRefreshTime()`
  - Framework: Jest (Frontend: React Testing Library; Backend: Jest with supertest for HTTP)
  
- **Integration Tests (20%):** API endpoints, database operations, Prisma queries
  - Example: `POST /api/auth/callback` full flow, role refresh query, audit log creation
  - Database: PostgreSQL test fixtures (rollback after each test)
  - ORM: Prisma with test database seeding
  
- **E2E Tests (10%):** Critical user workflows only
  - Example: "User logs in via Auth0 → receives JWT → accesses protected route → logs out"
  - Happy path only; no negative paths in E2E
  - Execution time: <5 seconds total

**Static Analysis (via agents.md tech stack):**
- **ESLint + TypeScript:** 0 errors, 0 warnings
- **Security scanning:** npm audit (no high/critical vulns)
- **Code coverage reports:** lcov format + HTML dashboard

---

### Section 3: Test Types & Organization

**Folder Structure (Git-friendly, mirrors source layout):**

**Frontend Project (React 18 + Vite):**
```
src/
├── components/
│   ├── LoginPage.tsx
│   ├── AuthContext.tsx
│   ├── ProtectedRoute.tsx
│   └── __tests__/
│       ├── LoginPage.test.tsx          # Unit test (1:1 with source)
│       ├── AuthContext.test.tsx        # Unit test
│       └── ProtectedRoute.integration.test.tsx  # Integration test (optional for components)
├── services/
│   ├── authService.ts
│   └── __tests__/
│       ├── authService.test.ts         # Unit test (pure functions)
│       └── authService.integration.test.ts    # Integration with real API
├── utils/
│   ├── validators.ts
│   └── __tests__/
│       └── validators.test.ts          # Unit test
├── pages/
│   ├── Dashboard.tsx
│   └── __tests__/
│       └── Dashboard.test.tsx          # Unit test (page component)
└── tests/
    ├── e2e/
    │   ├── auth-flow.spec.ts           # E2E: Login → Dashboard → Logout
    │   └── role-based-access.spec.ts   # E2E: Different roles access content
    ├── fixtures/
    │   ├── users.ts                    # Reusable test user data
    │   └── tokens.ts                   # Reusable test token data
    ├── setup.ts                        # Jest global setup
    └── helpers.ts                      # Shared test utilities
```

**Backend Project (Node.js + Express):**
```
src/
├── services/
│   ├── tokenService.ts
│   ├── authService.ts
│   └── __tests__/
│       ├── tokenService.test.ts        # Unit test (pure functions)
│       ├── authService.test.ts         # Unit test (mocked Auth0)
│       └── tokenService.integration.test.ts  # Integration (real crypto)
├── middleware/
│   ├── auth.ts
│   ├── errorHandler.ts
│   └── __tests__/
│       ├── auth.test.ts                # Unit test (mocked JWT)
│       └── auth.integration.test.ts    # Integration (real middleware chain)
├── routes/
│   ├── auth.ts
│   └── __tests__/
│       └── auth.integration.test.ts    # Integration (full endpoint testing)
├── controllers/
│   └── __tests__/
│       └── authController.test.ts      # Unit test (mocked dependencies)
└── tests/
    ├── e2e/
    │   ├── auth-flow.spec.ts           # E2E: Code exchange → JWT → Protected route
    │   └── rbac.spec.ts                # E2E: Role-based endpoint access
    ├── fixtures/
    │   ├── users.ts                    # Test user factory
    │   ├── tokens.ts                   # Test token factory
    │   └── database.ts                 # Database seeding utilities
    ├── setup.ts                        # Jest setup (database, Redis)
    └── helpers.ts                      # Test utilities (request builders, assertions)
```

**Test File Distribution:**
- **Unit Tests (70%):** `__tests__/` co-located with source files
  - One file per source file (e.g., `UserService.ts` → `__tests__/UserService.test.ts`)
  - Isolated tests, fast execution (<100ms each)
  
- **Integration Tests (20%):** `tests/integration/` grouped by feature
  - `POST /api/auth/callback` all scenarios in one file
  - Database state verified, real dependencies
  
- **E2E Tests (10%):** `tests/e2e/` grouped by user journey
  - `auth-flow.spec.ts` - complete login/logout flow
  - `rbac.spec.ts` - role-based access verification

---

### Section 4: Naming Conventions

**Test File Naming:**

| Test Type | Frontend | Backend | Purpose |
|-----------|----------|---------|---------|
| Unit | `Component.test.tsx` | `service.test.ts` | Pure functions, isolated units |
| Integration | `Component.integration.test.tsx` | `route.integration.test.ts` | Component boundaries, feature workflows |
| E2E | `user-journey-name.spec.ts` | `user-journey-name.spec.ts` | Full app scenarios |

**Examples:**
```
✅ LoginPage.test.tsx              (unit test for React component)
✅ authService.test.ts             (unit test for utility/service)
✅ auth.integration.test.ts        (integration test for middleware/route)
✅ login-with-auth0.spec.ts        (E2E test for user journey)

❌ LoginPageTest.tsx               (don't use suffix)
❌ test-authService.ts             (don't prefix)
❌ AuthServiceUnitTest.ts          (too verbose)
```

**Test Suite & Case Naming:**

**Pattern:** `describe('[ComponentName | ServiceName]', ...)`

```typescript
// ✅ GOOD: Clear, hierarchical test structure
describe('TokenService', () => {
  describe('generateToken', () => {
    describe('when payload is valid', () => {
      it('should return signed JWT with 30-minute expiry', () => {});
      it('should include userId and email in claims', () => {});
    });
    describe('when payload is invalid', () => {
      it('should throw InvalidTokenError', () => {});
      it('should include error details in message', () => {});
    });
  });
});

// ✅ GOOD: For React components
describe('LoginPage', () => {
  describe('rendering', () => {
    it('should display email input field', () => {});
    it('should display password input field', () => {});
  });
  describe('user interactions', () => {
    it('should call onSubmit when form submitted', () => {});
    it('should show error message on failed login', () => {});
  });
});

// ✅ GOOD: For API endpoints
describe('POST /api/auth/callback', () => {
  describe('with valid authorization code', () => {
    it('should return 200 with JWT token', () => {});
    it('should set secure httpOnly cookie', () => {});
  });
  describe('with invalid authorization code', () => {
    it('should return 400 Bad Request', () => {});
    it('should include error message', () => {});
  });
});
```

**Test Case Naming Pattern:** `it('should [action] when [condition]', ...)`

```typescript
// ✅ GOOD: Clear what is being tested and when
it('should validate email format when email contains @', () => {});
it('should reject email when format is invalid', () => {});
it('should update user role when fetched from Auth0', () => {});

// ❌ BAD: Vague, doesn't describe condition
it('validates email', () => {});
it('works correctly', () => {});
it('should handle errors', () => {});
```

**Describe Block Hierarchy:**

```typescript
describe('AuthService', () => {
  // Level 1: Service name

  describe('login', () => {
    // Level 2: Method name

    describe('when credentials are valid', () => {
      // Level 3: Condition/scenario

      it('should return user with JWT token', () => {});  // Level 4: Test case
      it('should set session cookie', () => {});
    });

    describe('when credentials are invalid', () => {
      // Level 3: Alternative condition

      it('should throw InvalidCredentialsError', () => {});
      it('should increment failed attempt counter', () => {});
    });
  });
});
```

---

### Section 5: Test Anatomy

**Primary Pattern: Arrange-Act-Assert (AAA)**

Every test follows this structure for clarity and maintainability:

```typescript
/**
 * Arrange: Set up test data and mocks
 * Act: Execute the code being tested
 * Assert: Verify the expected outcome
 */
it('should generate JWT with correct claims', () => {
  // 🔵 ARRANGE: Set up test data
  const userId = 'test-user-123';
  const email = 'user@example.com';
  const role = 'SUBMITTER';

  // 🟢 ACT: Execute the function being tested
  const token = TokenService.generateToken({ userId, email, role });

  // 🔴 ASSERT: Verify the outcome
  const decoded = TokenService.verifyToken(token);
  expect(decoded.userId).toBe(userId);
  expect(decoded.email).toBe(email);
  expect(decoded.role).toBe(role);
});
```

**Advanced AAA with Setup/Teardown:**

```typescript
describe('LoginPage', () => {
  // 🔵 SHARED ARRANGE (beforeEach, NOT beforeAll)
  let mockAuthService: jest.Mock;

  beforeEach(() => {
    // Reset mocks BEFORE each test (test isolation)
    mockAuthService = jest.fn();
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Clean up after each test (teardown)
    jest.restoreAllMocks();
  });

  it('should call authService.login when form submitted', () => {
    // 🔵 ARRANGE (test-specific)
    const { getByRole } = render(<LoginPage onSubmit={mockAuthService} />);
    const submitButton = getByRole('button', { name: /login/i });

    // 🟢 ACT
    fireEvent.click(submitButton);

    // 🔴 ASSERT
    expect(mockAuthService).toHaveBeenCalledTimes(1);
  });

  it('should show error message on failed login', () => {
    // 🔵 ARRANGE
    const error = new Error('Invalid credentials');
    mockAuthService.mockRejectedValue(error);
    render(<LoginPage onSubmit={mockAuthService} />);

    // 🟢 ACT
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // 🔴 ASSERT
    expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
  });
});
```

**Setup vs. Teardown Patterns:**

```typescript
describe('AuthService', () => {
  // ✅ Use beforeEach for test-specific setup (test isolation)
  beforeEach(() => {
    // Runs BEFORE each test
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    // Runs AFTER each test (cleanup)
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  // ❌ Avoid beforeAll for test-specific setup (violates isolation)
  // beforeAll(() => {
  //   // DON'T set up test-specific data here
  //   // Only OK for expensive one-time setup (database, server)
  // });

  it('test 1', () => {
    // beforeEach ran before this test
    // afterEach will run after
  });

  it('test 2', () => {
    // beforeEach ran again before this test (fresh state)
    // afterEach will run after
  });
});
```

**Integration Test Setup:**

```typescript
describe('POST /api/auth/callback', () => {
  // Expensive one-time setup (OK to use beforeAll)
  beforeAll(async () => {
    // Start database container
    await setupTestDatabase();
    // Migrate schema
    await runMigrations();
  });

  afterAll(async () => {
    // Teardown database
    await teardownTestDatabase();
  });

  // Test-specific cleanup (use beforeEach/afterEach)
  beforeEach(async () => {
    // Clear tables before each test
    await truncateAllTables();
  });

  afterEach(async () => {
    // Cleanup after each test
    jest.clearAllMocks();
  });

  it('should exchange code for JWT', async () => {
    // Arrange: Create test data
    const testCode = 'valid-code-123';

    // Act: Send request
    const response = await request(app)
      .post('/api/auth/callback')
      .send({ code: testCode });

    // Assert: Verify response and database
    expect(response.status).toBe(200);
    expect(response.body.jwt).toBeDefined();
    
    const user = await prisma.user.findUnique({ where: { email: 'user@example.com' } });
    expect(user).toBeDefined();
  });
});
```

**Test Independence Principle (CRITICAL):**

```typescript
// ❌ BAD: Tests depend on global state
let userId: string;

describe('UserService', () => {
  it('should create user', () => {
    const user = createUser({ email: 'user@example.com' });
    userId = user.id;  // Sets global state
    expect(user).toBeDefined();
  });

  it('should get user', () => {
    // This test DEPENDS on previous test running first
    // Will fail if run in different order or in isolation
    const user = getUser(userId);
    expect(user).toBeDefined();
  });
});

// ✅ GOOD: Each test is independent
describe('UserService', () => {
  let userId: string;

  beforeEach(() => {
    // Each test gets fresh data
    const user = createUser({ email: 'user@example.com' });
    userId = user.id;
  });

  it('should create user', () => {
    expect(userId).toBeDefined();
  });

  it('should get user', () => {
    // Uses userId created in beforeEach
    const user = getUser(userId);
    expect(user).toBeDefined();
  });
});
```

**Key Independence Rules:**
- [ ] Each test must run independently (remove global setup/teardown)
- [ ] Each test must be runnable in isolation: `npm test -- --testNamePattern="specific test"`
- [ ] Tests can run in ANY order (randomize with `--randomOrder`)
- [ ] No test should depend on another test's output
- [ ] Use `beforeEach` (not `beforeAll`) for test-specific data

---

### Section 6: Unit Testing Standards (Jest)

**Frontend Unit Tests (React 18 + React Testing Library):**
```typescript
// ✅ GOOD: Test user behavior, not implementation
it('LoginPage should submit credentials on button click', () => {
  render(<LoginPage />);
  const button = screen.getByRole('button', { name: /login/i });
  fireEvent.click(button);
  expect(mockOnSubmit).toHaveBeenCalled();
});

// ❌ BAD: Tests implementation details
it('LoginPage should call setIsLoading with true', () => {
  // Don't test state management; test behavior
});
```

**Jest Configuration (All Projects):**
- `jest.config.ts` with TypeScript support (`ts-jest`)
- Coverage threshold: `{ lines: 80, branches: 75, functions: 80, statements: 80 }`
- Test environment: `node` (backend), `jsdom` (frontend)
- Setup files: Test utilities, global test configuration
- Timeout: 30 seconds per test (increase only if justified)

**Unit Test Structure:**
```typescript
describe('TokenService', () => {
  describe('generateToken', () => {
    it('should return valid JWT with 30-minute expiry', () => {
      // Arrange
      const payload: TokenPayload = { userId: '123', email: 'user@example.com', role: 'SUBMITTER' };
      
      // Act
      const token = TokenService.generateToken(payload);
      
      // Assert
      const decoded = TokenService.verifyToken(token);
      expect(decoded.userId).toBe('123');
      expect(decoded.exp - decoded.iat).toBe(1800); // 30 minutes
    });

    it('should throw InvalidTokenError with missing payload', () => {
      expect(() => TokenService.generateToken(null as any)).toThrow(InvalidTokenError);
    });
  });
});
```

**Requirements for Unit Tests:**
- [ ] Test only ONE thing per test (single assertion focus)
- [ ] Use descriptive test names: `should [action] when [condition]`
- [ ] Arrange-Act-Assert pattern
- [ ] No external dependencies; mock everything (APIs, database, time)
- [ ] Fast execution: <100ms per test
- [ ] Use `jest.mock()` for dependencies
- [ ] Test error cases: happy path + edge cases + error cases

**Mocking Strategies:**
- Pure functions: No mocking needed
- External APIs: Mock with `jest.mock()` or `jest-mock-extended`
- Database: Mock Prisma client with `jest.mock('@prisma/client')`
- Time: Use `jest.useFakeTimers()` for time-dependent code

---

### Section 7: Integration Testing Standards

**Backend Integration Tests (Express + Prisma + PostgreSQL):**
```typescript
describe('POST /api/auth/callback', () => {
  beforeAll(async () => {
    // Start test database
    await setupTestDatabase();
  });

  afterEach(async () => {
    // Rollback migrations after each test
    await truncateTestDatabase();
  });

  it('should exchange authorization code for JWT token', async () => {
    // Arrange
    const testCode = 'valid-auth0-code';
    jest.mock('auth0', () => ({
      /* mock Auth0 API response */
    }));

    // Act
    const response = await request(app)
      .post('/api/auth/callback')
      .send({ code: testCode, state: 'valid-state' });

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('jwt');
    expect(response.headers['set-cookie']).toContain('jwt=');
  });

  it('should create user in database on first login', async () => {
    // Verify database state changed
    const user = await prisma.user.findUnique({ where: { email: 'new@example.com' } });
    expect(user).toBeDefined();
    expect(user?.role).toBe('SUBMITTER');
  });

  it('should return 429 after 5 failed login attempts', async () => {
    // Rate limiting integration test
    for (let i = 0; i < 5; i++) {
      await request(app).post('/api/auth/callback').send({ code: 'invalid' });
    }
    const response = await request(app).post('/api/auth/callback').send({ code: 'invalid' });
    expect(response.status).toBe(429);
  });
});
```

**Test Database Strategy:**
- Separate PostgreSQL database for testing (`epam_innovation_db_test`)
- Migrate schema before test suite: `npx prisma migrate deploy --skip-generate`
- Seed with minimal test data (🟡 if needed, not default)
- Truncate tables after each test, NOT full reset (faster)
- Use transactions for test isolation: `prisma.$transaction(async (tx) => { ... })`

**Integration Test Scope:**
- Test API endpoints end-to-end (request → response)
- Verify database was updated correctly
- Test with real service calls (not mocked)
- Verify error handling: 400 (bad request), 401 (auth), 403 (forbidden), 429 (rate limit), 500 (server)
- Verify HTTP headers: `Content-Type`, `Set-Cookie`, CORS, CSP

**Requirements for Integration Tests:**
- [ ] Test realistic workflows, not individual functions
- [ ] Use test fixtures or database seeding
- [ ] Verify both response and side effects (database changes, external calls)
- [ ] Test error paths: invalid input, auth failures, database errors
- [ ] Timeout: <2 seconds per test (or document why longer)
- [ ] No test dependencies: tests must run in any order
- [ ] Use `supertest` for Express: `request(app).post('/endpoint')`

---

### Section 8: E2E Testing Standards (Critical Workflows Only)

**E2E Tests - Happy Path Only:**
```typescript
describe('Authentication Flow - E2E (Happy Path)', () => {
  it('User can login, access protected route, and logout', async () => {
    // 1. User visits login page
    await page.goto('http://localhost:3000/login');
    
    // 2. User clicks "Login with Auth0"
    await page.click('button:has-text("Login with Auth0")');
    
    // 3. Auth0 popup opens and redirects
    // (Mocked in test environment)
    await page.waitForNavigation();
    
    // 4. Dashboard appears with user info
    expect(await page.textContent('.user-email')).toContain('user@example.com');
    
    // 5. User accesses protected API
    const response = await page.evaluate(async () => {
      return fetch('/api/auth/me').then(r => r.json());
    });
    expect(response.role).toBe('SUBMITTER');
    
    // 6. User logs out
    await page.click('button:has-text("Logout")');
    
    // 7. Redirected to login page
    expect(page.url()).toContain('/login');
  });
});
```

**Framework:** Playwright or Cypress (not configured yet; optional for Phase 2)

**E2E Scope (Smoke Tests):**
- ✅ Test 1-2 critical happy-path workflows only
- ✅ Verify entire flow works end-to-end
- ❌ DO NOT test negative paths in E2E (use unit/integration tests)
- ❌ DO NOT test every edge case (too slow)
- ✅ Examples: "Login → Access Protected Route", "Submit Idea → Evaluator Reviews"

**Requirements for E2E Tests:**
- [ ] Only critical user journeys (max 5)
- [ ] Happy path only; no error scenarios
- [ ] Execution time: <5 seconds total
- [ ] Isolated test environment (staging, not production)
- [ ] Clear setup/teardown (no state leakage)
- [ ] Run last in CI pipeline (slowest)

---

### Section 9: Mocking, Fixtures & Test Data

**Mocking Strategy (Hierarchy):**
1. **Avoid mocking:** If possible, test real code (prefer integration tests)
2. **Mock external APIs:** Auth0, email services, third-party APIs
3. **Mock time:** For time-dependent code, use `jest.useFakeTimers()`
4. **Mock database:** Only for unit tests; use real DB for integration tests

**Mocking Examples:**

```typescript
// ❌ Over-mocking (too isolated, not realistic)
jest.mock('prisma', () => ({ user: { findUnique: jest.fn() } }));

// ✅ Under-mocking (realistic for integration)
// Use real Prisma with test database

// ✅ Right-mocking (unit test of service)
jest.mock('axios'); // Mock external API calls
```

**Test Fixtures & Seeding:**
```typescript
// src/tests/fixtures/users.ts
export const TEST_USER_SUBMITTER = {
  id: 'test-user-1',
  email: 'submitter@example.com',
  name: 'Test Submitter',
  role: 'SUBMITTER',
  auth0Id: 'auth0|123',
  createdAt: new Date('2026-01-01'),
};

export const TEST_USER_EVALUATOR = {
  id: 'test-user-2',
  email: 'evaluator@example.com',
  name: 'Test Evaluator',
  role: 'EVALUATOR',
  auth0Id: 'auth0|456',
};

// Usage in tests:
beforeEach(async () => {
  await prisma.user.create({ data: TEST_USER_SUBMITTER });
});
```

**Test Data Guidelines:**
- Create reusable fixtures in `src/tests/fixtures/`
- Use TypeScript types for fixtures (catch schema changes)
- Fixtures should mirror real data closely
- Never hardcode test data in test files
- Use factory functions for complex objects: `createTestUser(overrides)`

---

### Section 10: Test Organization & Structure

**File Structure:**
```
src/
├── services/
│   ├── tokenService.ts
│   └── __tests__/
│       ├── tokenService.test.ts      # Unit tests
│       └── tokenService.integration.test.ts  # Integration tests
├── middleware/
│   ├── auth.ts
│   └── __tests__/
│       └── auth.test.ts              # Unit tests
├── routes/
│   ├── auth.ts
│   └── __tests__/
│       └── auth.integration.test.ts  # Integration tests
└── tests/
    ├── fixtures/                     # Shared test data
    │   ├── users.ts
    │   └── tokens.ts
    ├── setup.ts                      # Jest setup
    └── testDatabase.ts               # Database utilities
```

**Test File Naming:**
- `[module].test.ts` - Unit tests
- `[module].integration.test.ts` - Integration tests
- `[feature].e2e.test.ts` - E2E tests

**Test Suite Organization:**
```typescript
describe('TokenService', () => {
  describe('generateToken', () => {
    describe('when payload is valid', () => {
      it('should return signed JWT', () => {});
      it('should include 30-minute expiry', () => {});
    });
    describe('when payload is invalid', () => {
      it('should throw InvalidTokenError', () => {});
    });
  });
  
  describe('verifyToken', () => {
    // ... tests ...
  });
});
```

**Shared Test Utilities:**
```typescript
// src/tests/setup.ts
beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(async () => {
  await cleanupTestDatabase();
});

// src/tests/helpers.ts
export async function seedTestUser(overrides = {}) {
  return prisma.user.create({
    data: { ...TEST_USER_SUBMITTER, ...overrides },
  });
}
```

---

### Section 11: Testing in CI/CD Pipeline

**GitHub Actions Test Workflow:**
```yaml
name: Test Suite

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
      
      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
    
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      
      # Step 1: Type check
      - run: npm run type-check
      
      # Step 2: Lint
      - run: npm run lint
      
      # Step 3: Format
      - run: npm run format:check
      
      # Step 4: Database migration
      - run: npm run db:migrate:test
      
      # Step 5: Unit tests
      - run: npm run test:unit --coverage
      
      # Step 6: Integration tests
      - run: npm run test:integration --coverage
      
      # Step 7: Coverage report
      - run: npm run test:coverage:report
      
      # Step 8: Security audit
      - run: npm audit --audit-level=moderate
      
      # Step 9: Upload coverage
      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
```

**npm Scripts for Testing:**
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:unit": "jest --testPathPattern=\\.test\\.ts$",
    "test:integration": "jest --testPathPattern=\\.integration\\.test\\.ts$",
    "test:e2e": "playwright test",
    "test:coverage": "jest --coverage",
    "test:coverage:report": "jest --coverage && open coverage/lcov-report/index.html",
    "type-check": "tsc --noEmit",
    "lint": "eslint src --max-warnings 0",
    "format": "prettier --write src",
    "format:check": "prettier --check src",
    "db:migrate:test": "DATABASE_URL=postgresql://localhost/epam_innovation_db_test npx prisma migrate deploy"
  }
}
```

**CI/CD Gates (MUST ALL PASS):**
```
✓ Type check passes (tsc --noEmit)
✓ ESLint zero warnings (npm run lint)
✓ Prettier formatting (npm run format:check)
✓ Unit tests passing + 80% coverage
✓ Integration tests passing
✓ E2E tests passing (if applicable)
✓ npm audit passes (no moderate+ vulnerabilities)
✓ Code review approved
```

**Coverage Reporting:**
- Generate LCOV report: `--coverage`
- Upload to Codecov for PR comments
- Enforce thresholds: PR fails if coverage drops below 80%
- Track trends over time

**Failure Handling:**
- If ANY test fails: PR cannot merge
- If coverage drops: PR reviewer must approve waiver
- If lint/format fails: Must fix before merge
- If audit fails: Must upgrade vulnerable dependency or document exception

---

## Integration & Enforcement

These 8 Testing Principles are **MANDATORY** for all code merged to main branch.

**During Code Review:**
- Reviewer checks: "Are tests written FIRST per TDD?"
- Reviewer verifies: Coverage metrics met (80% line, 75% branch)
- Reviewer enforces: No implementation without tests
- Reviewer rejects: Insufficient test coverage

**In CI/CD:**
- Tests run automatically on every push and PR
- Must pass ALL gates before merge allowed
- Coverage dashboard updated on main branch

---


### Version Control
- **Branches:** feature/, bugfix/, docs/ with JIRA/issue ID (e.g., feature/AUTH-123)
- **Commits:** Conventional commits (feat:, fix:, docs:, test:, refactor:)
- **PRs:** Require code review + all checks passing before merge
- **Main branch:** Protected; only merge from reviewed PRs

### Definition of Done for Features
- [ ] Code written in TypeScript with strict mode
- [ ] All public APIs have JSDoc comments
- [ ] Unit tests written (80% coverage on business logic)
- [ ] Integration tests for external dependencies
- [ ] ESLint + Prettier checks passing
- [ ] Code review approved
- [ ] Documentation updated
- [ ] No console logs or debugger statements in production code

## Testing Gates (CI/CD)

All of these must pass before code merges:
```
✓ TypeScript compilation (strict mode)
✓ ESLint (zero warnings)
✓ Prettier format check
✓ Unit tests (80% coverage minimum)
✓ Integration tests (all passing)
✓ Security audit (npm audit)
```

## Governance

- **Constitution supersedes all other practices:** If conflict, constitution wins
- **Amendments:** Changes require team discussion and documentation
- **Violations:** Code review must flag any deviations before merge
- **Ratification:** All team members acknowledge and commit to these principles

---

**Version:** 1.0 | **Ratified:** February 24, 2026 | **Last Amended:** February 24, 2026
