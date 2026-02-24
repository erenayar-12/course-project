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

### Section 6: Mocking & Test Data

**The Mocking Hierarchy: What to Mock vs. Not Mock**

```
┌─────────────────────────────────────┐
│  AVOID MOCKING (Use Real Code)     │
├─────────────────────────────────────┤
│ - Code you own (services, utils)    │
│ - Simple utilities (validators)     │
│ - Pure functions (calculations)     │
│ - ORM queries (use test DB)         │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  STUB/MOCK (Use Test Doubles)       │
├─────────────────────────────────────┤
│ - External APIs (Auth0, Stripe)     │
│ - Third-party services (email)      │
│ - Time-dependent code (Date.now)    │
│ - Infrastructure (file system)      │
└─────────────────────────────────────┘
```

**Category 1: Mock External Services (HTTP APIs)**

```typescript
// ❌ BAD: You OWN the auth service, don't mock it
jest.mock('./src/services/tokenService');

// ✅ GOOD: Auth0 is external, mock the HTTP call
jest.mock('axios');

it('should login when Auth0 returns valid token', () => {
  // Arrange: Mock the external API
  jest.mocked(axios.post).mockResolvedValueOnce({
    data: { 
      id_token: 'eyJhbGc...', 
      access_token: 'token123' 
    }
  });

  // Act: Call your code (NOT mocked)
  const result = authService.loginWithAuth0('code');

  // Assert
  expect(result.token).toBeDefined();
});
```

**Services to Mock (External Dependencies):**
- Auth0, Okta, OAuth providers
- Email services (SendGrid, AWS SES)
- Payment processors (Stripe, PayPal)
- Analytics services (Segment, Mixpanel)
- Third-party APIs (weather, maps, etc.)

**Category 2: Stub Time-Dependent Code**

```typescript
it('should refresh token when lastRefresh is > 5 minutes ago', () => {
  // Arrange: Control time
  jest.useFakeTimers();
  const now = new Date('2026-02-24T12:00:00Z');
  jest.setSystemTime(now);

  const token = {
    payload: { roleCheckedAt: new Date('2026-02-24T11:54:00Z') },
    needsRoleRefresh: () => true // >5 min ago
  };

  // Act: Advance time
  jest.advanceTimersByTime(6 * 60 * 1000); // 6 minutes

  // Assert
  expect(token.needsRoleRefresh()).toBe(true);

  // Cleanup
  jest.useRealTimers();
});
```

**Stubbed Time Functions:**
- `Date.now()`
- `new Date()`
- `jest.useFakeTimers()`
- `setTimeout()`, `setInterval()`
- `jest.advanceTimersByTime()`

**Category 3: Fake In-Memory Database (Unit Tests Only)**

```typescript
// ❌ BAD: Never mock your ORM for integration tests
// jest.mock('@prisma/client');

// ✅ GOOD: For unit tests of business logic, OK to mock database
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => ({
    user: {
      findUnique: jest.fn().mockResolvedValue({
        id: '123',
        email: 'user@example.com',
        role: 'SUBMITTER'
      })
    }
  }))
}));

it('should load user from database', async () => {
  const prisma = new PrismaClient();
  const user = await prisma.user.findUnique({ where: { id: '123' } });
  
  expect(user.email).toBe('user@example.com');
});
```

**⚠️ IMPORTANT:** In integration tests, use a REAL test database, not mocks:
```typescript
// ✅ GOOD: Integration test uses real database
describe('User Repository Integration', () => {
  let prisma: PrismaClient;

  beforeAll(async () => {
    prisma = new PrismaClient({
      datasources: { db: { url: process.env.TEST_DATABASE_URL } }
    });
    await prisma.$connect();
  });

  it('should save user to database', async () => {
    // Real database, not mocked
    await prisma.user.create({
      data: { email: 'user@example.com', role: 'SUBMITTER' }
    });

    const user = await prisma.user.findUnique({ 
      where: { email: 'user@example.com' } 
    });

    expect(user).toBeDefined();
  });
});
```

**Category 4: Test Fixtures & Helper Functions**

**Bad: Duplicated test data everywhere**
```typescript
// ❌ BAD: Test data scattered across files
it('should process user', () => {
  const user = { id: '123', email: 'user@example.com', role: 'SUBMITTER' };
  // ... test code
});

it('should validate user', () => {
  const user = { id: '123', email: 'user@example.com', role: 'SUBMITTER' };
  // ... test code
});
```

**Good: Centralized fixtures with factories**
```typescript
// src/tests/fixtures/users.ts
export const TEST_USER_SUBMITTER = {
  id: 'test-user-1',
  email: 'submitter@example.com',
  name: 'Test Submitter',
  role: 'SUBMITTER' as const,
  auth0Id: 'auth0|123',
  createdAt: new Date('2026-01-01'),
};

export function createTestUser(overrides: Partial<User> = {}): User {
  return { ...TEST_USER_SUBMITTER, ...overrides };
}

export function createTestToken(userId: string, role: string = 'SUBMITTER'): string {
  return jwt.sign({ userId, role, exp: Date.now() + 1800000 }, 'test-secret');
}

// Usage in tests:
it('should process user', () => {
  const user = createTestUser({ email: 'custom@example.com' });
  // ... test code
});
```

**Helper Functions Pattern:**
```typescript
// src/tests/helpers/request.ts
export async function loginAsUser(app: Express.Application, user = TEST_USER_SUBMITTER) {
  const response = await request(app)
    .post('/api/auth/callback')
    .send({ code: 'valid-auth0-code' });
  
  return response.body.jwt; // Returns token
}

export async function getProtectedEndpoint(
  app: Express.Application, 
  token: string,
  endpoint: string
) {
  return request(app)
    .get(endpoint)
    .set('Authorization', `Bearer ${token}`);
}

// Usage in integration tests:
it('should get protected data', async () => {
  const token = await loginAsUser(app);
  const response = await getProtectedEndpoint(app, token, '/api/data');
  
  expect(response.status).toBe(200);
});
```

**Fixture Organization:**
```
src/tests/fixtures/
├── users.ts              # User test data + createTestUser()
├── tokens.ts             # Token test data + createTestToken()
├── database.ts           # Database seeding + teardown
└── mockServices.ts       # Mock Auth0, email, payment APIs

src/tests/helpers/
├── request.ts            # loginAsUser(), getProtectedEndpoint()
├── database.ts           # setupTestDb(), truncateAllTables()
└── assertions.ts         # Custom matchers, verification helpers
```

---

### Section 7: Quality Criteria (CRITICAL - What Makes a Good Test)

**Golden Rules of Test Quality**

A test should:
1. ✅ **Test observable behavior** (not implementation details)
2. ✅ **Have meaningful assertions** (not tautological)
3. ✅ **Test one thing** (single responsibility)
4. ✅ **Be fast** (<1s unit, <5s integration)
5. ✅ **Be deterministic** (same result every run)

---

**Rule 1: Test Observable Behavior, Not Implementation Details**

```typescript
// ❌ BAD: Tests implementation (private methods, internal state)
it('should call setState when form submitted', () => {
  const instance = new LoginPage();
  spyOn(instance, 'setState');
  instance.handleSubmit();
  expect(instance.setState).toHaveBeenCalled();
});

// ✅ GOOD: Tests observable behavior (what user sees/experiences)
it('should display error message when login fails', () => {
  render(<LoginPage />);
  const button = screen.getByRole('button', { name: /login/i });
  
  // User clicks button, sees error
  fireEvent.click(button);
  
  expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
});

// ✅ GOOD: Backend observable behavior (API response)
it('should return 401 when credentials invalid', async () => {
  const response = await request(app)
    .post('/api/auth/login')
    .send({ email: 'user@example.com', password: 'wrong' });
  
  expect(response.status).toBe(401);
  expect(response.body.error).toBeDefined();
});
```

**Anti-Pattern: Testing Private Methods**
```typescript
// ❌ AVOID
it('should call privateHelper() with correct args', () => {
  const spy = jest.spyOn(service, 'privateHelper' as any);
  service.publicMethod();
  expect(spy).toHaveBeenCalledWith('expectedArg');
});

// ✅ REPLACE WITH: Test public behavior
it('should format date correctly', () => {
  const result = service.publicMethod();
  expect(result).toMatch(/\d{4}-\d{2}-\d{2}/); // Date format verified
});
```

---

**Rule 2: Assertions Must Be Meaningful (Not Tautological)**

**Tautological Tests (Useless - Always Pass):**
```typescript
// ❌ BAD: Assertions that are always true (no value)
it('should return data', () => {
  const data = getData();
  expect(data).toBeDefined();  // Tautology: if getData ran, data exists
  expect(data).toEqual(data);  // Tautology: anything equals itself
  expect(typeof data).toBe('object'); // Tautology: object is object
});

// ❌ BAD: Test without assertions
it('should load user', async () => {
  const user = await loadUser('123');
  // No assertions! Test always passes if no error thrown
});

// ❌ BAD: Asserting on mock calls only
jest.mocked(axios.get).mockResolvedValue({ data: user });
it('should call API', async () => {
  await service.getUser('123');
  expect(axios.get).toHaveBeenCalled(); // This is the mock you set up!
});
```

**Meaningful Tests (Have Oracles - Human-Validated Expected Values):**
```typescript
// ✅ GOOD: Oracle is specific expected behavior
it('should return user with correct email', () => {
  const user = await service.loadUser('123');
  
  // Oracle: Email is human-verified to be specific value
  expect(user.email).toBe('alice@example.com');
  expect(user.role).toBe('SUBMITTER');
  expect(user.createdAt).toEqual(new Date('2026-01-15'));
});

// ✅ GOOD: Oracle validates structure and constraints
it('should return JWT token with 30-minute expiry', () => {
  const token = service.generateToken('user123');
  const decoded = jwt.verify(token, 'secret');
  
  // Oracle: Expiry is exactly 30 minutes (1800 seconds)
  expect(decoded.exp - decoded.iat).toBe(1800);
  expect(decoded.userId).toBe('user123');
});

// ✅ GOOD: Assertions verify side effects
it('should save user to database', async () => {
  await service.createUser(newUser);
  
  // Oracle: Verify actual side effect
  const saved = await db.users.findOne({ email: newUser.email });
  expect(saved).toBeDefined();
  expect(saved.id).toBeTruthy();
});
```

**Guideline: All Expected Values (Oracles) Must Be:**
- [ ] Validated by human (not just copy-pasted from output)
- [ ] Specific (not generic like `toBeDefined()`)
- [ ] Justified (comment WHY this value matters)
- [ ] Observable (tests behavior, not internals)

---

**Rule 3: Tests One Thing (Single Responsibility)**

```typescript
// ❌ BAD: Tests multiple things (3 concerns: auth, DB, email)
it('should create user, assign default role, and send welcome email', () => {
  // Concern 1: User creation in DB
  const user = service.createUser({ email: 'user@example.com' });
  
  // Concern 2: Default role assignment
  expect(user.role).toBe('SUBMITTER');
  
  // Concern 3: Email sent
  expect(mockEmailService.send).toHaveBeenCalledWith(
    'user@example.com',
    expect.stringContaining('Welcome')
  );
});

// ✅ GOOD: Break into focused tests (one assertion per test)
it('should create user with default SUBMITTER role', () => {
  const user = service.createUser({ email: 'user@example.com' });
  expect(user.role).toBe('SUBMITTER');
});

it('should send welcome email after user creation', () => {
  service.createUser({ email: 'user@example.com' });
  expect(mockEmailService.send).toHaveBeenCalledWith(
    'user@example.com',
    expect.stringContaining('Welcome')
  );
});

it('should store user in database with generated ID', async () => {
  const user = await service.createUser({ email: 'user@example.com' });
  const saved = await db.users.findOne({ id: user.id });
  expect(saved).toBeDefined();
});
```

**Benefits of Single Responsibility:**
- Failures are precise (you know exactly what failed)
- Tests are runnable in any order
- Easier to maintain and debug
- Better for TDD workflow

---

**Rule 4: Tests Must Be Fast**

**Target Execution Times:**
- **Unit tests:** <100ms per test (target: <1s for 100 unit tests)
- **Integration tests:** <500ms per test (target: <5s for 10 integration tests)
- **E2E tests:** <5s per test (target: <30s for 5 E2E tests)

```typescript
// ❌ BAD: Waits for real time (too slow)
it('should rate limit after 5 attempts', async () => {
  for (let i = 0; i < 6; i++) {
    await request(app).post('/api/auth/login').send(badCreds);
  }
  // Real 15-minute window? This test takes 15 minutes!
});

// ✅ GOOD: Mocks time (fast)
it('should rate limit after 5 attempts', async () => {
  jest.useFakeTimers();
  
  for (let i = 0; i < 5; i++) {
    await request(app).post('/api/auth/login').send(badCreds);
  }
  
  // This immediately should be rate-limited (no real wait)
  expect(response.status).toBe(429);
  
  jest.useRealTimers();
});

// ✅ GOOD: No I/O for unit tests
it('should validate email format', () => {
  // Pure function, no DB, no API, no file I/O
  expect(isValidEmail('user@example.com')).toBe(true);
  expect(isValidEmail('invalid-email')).toBe(false);
});
```

**Optimization Strategies:**
- Move I/O to integration tests only
- Mock external services
- Use in-memory databases for unit tests
- Parallelize tests where possible
- Avoid unnecessary setup/teardown

---

**Rule 5: Tests Must Be Deterministic (No Flakiness)**

```typescript
// ❌ BAD: Flaky (fails intermittently)
it('should process order', async () => {
  const order = await service.processOrder();
  
  // Race condition: sometimes timestamp is this second, sometimes next
  expect(order.timestamp).toBe(new Date()); // FLAKY!
  
  // File system order not guaranteed
  const files = await fs.readdir('/data');
  expect(files[0]).toBe('expected.txt'); // FLAKY!
  
  // API response timing not guaranteed
  await new Promise(r => setTimeout(r, 100)); // FLAKY!
});

// ✅ GOOD: Deterministic (same result every run)
it('should process order', async () => {
  jest.useFakeTimers();
  const now = new Date('2026-02-24T12:00:00Z');
  jest.setSystemTime(now);
  
  const order = await service.processOrder();
  
  // Mock filesystem
  jest.mock('fs');
  jest.mocked(fs.readdir).mockResolvedValue(['expected.txt']);
  
  // Mock time delays
  jest.advanceTimersByTime(100);
  
  expect(order.timestamp).toEqual(now);
  jest.useRealTimers();
});
```

**Sources of Flakiness:**
- Real time (use `jest.useFakeTimers()`)
- Network I/O (mock with `jest.mock()`)
- File system (mock with `jest.mock('fs')`)
- Database race conditions (use transactions)
- Test order dependencies (isolate tests)
- Random data (use fixed seeds)

---

## Quality Gates (All Must Pass Before Merge)

**Assertion Quality:**
- [ ] No tautological assertions (always true)
- [ ] All expected values (oracles) human-validated
- [ ] Tests verify meaningful behavior
- [ ] Every test has at least 1 assertion

**Test Independence:**
- [ ] Tests can run in ANY order
- [ ] No shared global state
- [ ] Each test uses `beforeEach` setup
- [ ] Tests runnable in isolation: `npm test -- --testNamePattern="test name"`

**Performance:**
- [ ] Unit tests: <100ms each
- [ ] Integration tests: <500ms each
- [ ] E2E tests: <5s each
- [ ] Full test suite: <60 seconds

**Mutation Testing (75% Minimum)**

**What is Mutation Testing?**
Mutation testing verifies that your tests actually CATCH bugs. It modifies your code (mutations) and checks if tests fail:

```typescript
// Original code
function isAdult(age: number): boolean {
  return age >= 18;
}

// Mutation 1: >= changed to >
function isAdult(age: number): boolean {
  return age > 18; // If tests pass, they didn't catch this!
}

// Mutation 2: 18 changed to 17
function isAdult(age: number): boolean {
  return age >= 17;
}

// If your test only checks isAdult(25), both mutations pass uncaught!
// ❌ BAD test (catches neither mutation)
it('should consider 25 an adult', () => {
  expect(isAdult(25)).toBe(true);
});

// ✅ GOOD test (catches both mutations)
it('should consider 18+ as adults', () => {
  expect(isAdult(17)).toBe(false);  // Catches mutation 2
  expect(isAdult(18)).toBe(true);   // Catches mutations 1 & 2
  expect(isAdult(19)).toBe(true);   // Validates upper bound logic
});
```

**Mutation Testing Tools (By Language):**

| Language | Tool | Setup |
|----------|------|-------|
| **TypeScript/JavaScript** | Stryker | `npm install --save-dev @stryker-mutator/core` |
| **Python** | mutmut | `pip install mutmut` |
| **Java** | Pitest | `maven-plugin` or `gradle-plugin` |
| **Go** | go-fuzz | Built-in or third-party |

**TypeScript/JavaScript Stryker Setup:**
```bash
# Install
npm install --save-dev @stryker-mutator/core @stryker-mutator/typescript-checker

# Configure stryker.conf.json
{
  "testRunner": "jest",
  "testFramework": "jest",
  "coverageAnalysis": "perTest",
  "mutate": ["src/**/*.ts", "!src/**/*.test.ts"],
  "mutationScore": 75
}

# Run mutation tests
npx stryker run
```

**Stryker Report Interpretation:**
```
Mutation score: 78.5%
  - Killed: 157 mutations (your tests caught these bugs)
  - Survived: 43 mutations (your tests MISSED these bugs)
  - Timeout: 2 mutations (infinite loops)
  - Compile errors: 1 mutation

❌ If score < 75%: Add more edge case tests
✅ If score >= 75%: Tests are comprehensive
```

**Common Mutations That Escape (Signs of Weak Tests):**
```typescript
// Mutation: Change > to >=
if (age > 18) { ... }  // Test only checks age=18, misses boundary

// Mutation: Remove statement
logger.error(err);  // If error logging isn't verified, mutation survives

// Mutation: Change false to true
return isValid && hasPermission;  // If only testing valid case, missed

// Mutation: Negate condition
if (!isAdmin) return;  // If only testing admin path, mutation survives
```

**Practical Mutation Testing in CI/CD:**
```yaml
# .github/workflows/mutation-testing.yml
name: Mutation Tests
on: [push, pull_request]

jobs:
  mutation:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test  # Unit tests must pass first
      - run: npx stryker run
      - name: Check mutation score
        run: |
          SCORE=$(npx stryker report | grep "Mutation score" | head -1)
          if [[ $SCORE < 75 ]]; then
            echo "Mutation score too low: $SCORE"
            exit 1
          fi
```

---

## Anti-Patterns To Avoid (Code Review Checklist)

| Anti-Pattern | Example | Fix |
|--------------|---------|-----|
| **Testing private methods** | `spyOn(obj, 'privateMethod')` | Test public interface instead |
| **Interdependent tests** | `test1` sets `globalState`, `test2` uses it | Use `beforeEach` for setup |
| **Brittle tests** | Break when refactoring variable names | Test behavior, not implementation |
| **Flaky tests** | Fail intermittently on CI | Mock time, use transactions |
| **No assertions** | `it('should load data', async () => { await fn(); })` | Add assertions |
| **Copy-pasted tests** | Same login code in 10 tests | Extract to `loginAsUser()` helper |
| **Tautological assertions** | `expect(x).toEqual(x)` | Use specific oracle values |
| **Over-mocking** | Mock everything including your own code | Only mock external services |
| **Under-mocking** | Tests fail randomly due to real API calls | Mock all external services |
| **Slow tests** | Single unit test takes >5 seconds | Mock I/O, use fake timers |

---

## Summary: The 5 Pillars of Test Quality

```
   🏛️  TEST QUALITY  🏛️
   
   🔵 Observable Behavior
   (not implementation details)
            ↓
   🟢 Meaningful Assertions  
   (spec-validated oracles)
            ↓
   🟡 Single Responsibility
   (one thing per test)
            ↓
   🟣 Speed & Determinism
   (fast, reproducible)
            ↓
   🔴 Mutation Testing
   (75% score minimum)
```

These 5 pillars transform tests from "checking code runs" to "verifying code is correct".

---

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

### Section 8: Tools & Frameworks (Tech Stack Implementation)

This section specifies the EXACT tools, versions, and configurations required for all projects in Speckit-Lab to ensure consistency and compatibility.

### Static Analysis & Type Checking

**TypeScript (Mandatory for All Projects)**
```json
// tsconfig.json (identical for frontend & backend)
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020"],
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```
- **Command:** `npm run type-check` → `tsc --noEmit`
- **CI/CD Gate:** Must pass before any other checks

**ESLint (Linting)**
- **Version:** ESLint 8.x with TypeScript support
- **Config:** `.eslintrc.json` with TypeScript parser
- **Plugins:** `@typescript-eslint/eslint-plugin`, `eslint-plugin-react` (frontend only)
- **Command:** `npm run lint` → `eslint src --max-warnings 0`
- **Requirement:** ZERO warnings allowed; warnings treated as errors

**Prettier (Code Formatting)**
- **Version:** Prettier 3.x
- **Config:** `.prettierrc.json` (non-negotiable, no overrides)
- **Command:** `npm run format` → `prettier --write src`
- **Check:** `npm run format:check` → `prettier --check src`
- **Integration:** Pre-commit hook runs `npm run format`

---

### Testing Frameworks & Libraries

**Unit & Integration Testing: Jest**
- **Version:** Jest 29.x
- **TypeScript Support:** `ts-jest` 29.x
- **Config:** `jest.config.ts` (TypeScript configuration file, not .js)
- **Coverage thresholds in config:**
  ```json
  {
    "collectCoverageFrom": ["src/**/*.ts", "!src/**/*.d.ts"],
    "coverageThreshold": {
      "global": {
        "branches": 75,
        "functions": 80,
        "lines": 80,
        "statements": 80
      }
    }
  }
  ```

**Testing Libraries (By Platform):**

| Layer | Frontend | Backend |
|-------|----------|---------|
| **Rendering/Runtime** | React Testing Library 14.x | Jest + Node.js |
| **Assertions** | Jest matchers | Jest matchers |
| **Mocking** | jest.mock(), jest-mock-extended | jest.mock(), jest-mock-extended |
| **HTTP Testing** | MSW (Mock Service Worker) | supertest 6.x |
| **Database** | N/A | Prisma + test fixtures |

**Frontend Testing Stack:**
```json
{
  "devDependencies": {
    "jest": "^29.x",
    "@testing-library/react": "^14.x",
    "@testing-library/jest-dom": "^6.x",
    "ts-jest": "^29.x"
  }
}
```

**Backend Testing Stack:**
```json
{
  "devDependencies": {
    "jest": "^29.x",
    "@types/jest": "^29.x",
    "ts-jest": "^29.x",
    "supertest": "^6.x",
    "@types/supertest": "^2.x",
    "jest-mock-extended": "^3.x"
  }
}
```

**Commands:**
- `npm test` → Run all tests (unit + integration)
- `npm run test:watch` → Watch mode during development
- `npm run test:unit` → Unit tests only
- `npm run test:integration` → Integration tests only
- `npm run test:coverage` → Generate coverage report
- `npm run test:coverage:report` → Coverage report + HTML view

---

### E2E Testing (Phase 2+)

**Primary Framework: Playwright**
- **Version:** Playwright 1.40.x (when ready for Phase 2)
- **Languages:** TypeScript end-to-end
- **Command:** `npm run test:e2e` → `playwright test`
- **Use case:** Critical user workflows (auth, submission, evaluation)

**Alternative: Stagehand (AI-Native Browser Automation)**
- **Version:** TBD (optional, emerging tool)
- **Use case:** Complex UI interactions with AI assistance
- **Consideration:** Evaluate in Phase 2 after initial E2E framework is stable

**Current Phase 1 Approach:**
- Use Jest + supertest for backend integration tests
- Use Jest + React Testing Library for component integration
- Defer end-to-end with Playwright to Phase 2
- No E2E tests required for MVP authentication

---

### Coverage & Quality Metrics

**Coverage Tool: Jest Coverage**
- **Report format:** LCOV (for Codecov integration)
- **HTML report:** `coverage/lcov-report/index.html`
- **Minimum targets:**
  - Line coverage: 80%
  - Branch coverage: 75%
  - Function coverage: 80%
  - Statement coverage: 80%

**Mutation Testing: Stryker**
- **Version:** @stryker-mutator/core 7.x
- **Mutator:** typescript-checker for TypeScript files
- **Minimum score:** 75% (survived mutations < 25%)
- **Config:** `stryker.conf.json`
- **Command:** `npm run mutation:test` → `stryker run`
- **CI/CD:** Runs on main branch only (after all other tests pass)

**Stryker Configuration:**
```json
{
  "testRunner": "jest",
  "testFramework": "jest",
  "coverageAnalysis": "perTest",
  "mutate": ["src/**/*.ts", "!src/**/*.test.ts", "!src/**/*.integration.test.ts"],
  "mutationScore": 75,
  "timeoutMS": 10000,
  "plugins": ["@stryker-mutator/typescript-checker"]
}
```

---

### Package Manager & Dependencies

**Primary: npm**
- **Version:** npm 10.x (included with Node.js 18+)
- **Install:** `npm ci` (clean install in CI/CD)
- **Lock file:** `package-lock.json` (committed to git)
- **Security:** `npm audit` (zero high/critical vulnerabilities)

**Dependency Management:**
- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Express.js, Prisma, PostgreSQL driver
- **Shared:** TypeScript, ESLint, Prettier, Jest

**Version Pinning:**
- Lock major versions in `package.json` (e.g., `"react": "^18.0.0"`)
- Weekly dependency updates via Dependabot
- Monthly major version review

---

### Pre-Commit Hooks (husky + lint-staged)

**Configuration (`.husky/pre-commit`):**
```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm run type-check  # TypeScript strict mode
npm run lint        # ESLint (zero warnings)
npm run format      # Prettier auto-format
npm run test:unit   # Unit tests only (fast)
```

**Dependencies:**
```json
{
  "devDependencies": {
    "husky": "^8.x",
    "lint-staged": "^15.x"
  }
}
```

**Benefits:**
- Catches errors before commit
- Prevents broken code from reaching repository
- Enforces constitution compliance locally
- Developers can't bypass (prevents lazy commits)

---

### CI/CD Pipeline (GitHub Actions)

**Trigger:** On every push and pull request to any branch

**Sequential Pipeline:**
```yaml
Stage 1: Type Safety
  - npm run type-check (TypeScript strict)
  - Exit if fails ❌

Stage 2: Code Quality
  - npm run lint (ESLint)
  - npm run format:check (Prettier)
  - Exit if fails ❌

Stage 3: Database Setup (Integration Tests)
  - Start PostgreSQL 15 service container
  - Start Redis 7 service container
  - npx prisma migrate deploy (test database)
  - Exit if fails ❌

Stage 4: Testing
  - npm run test:unit --coverage (Unit tests + coverage report)
  - npm run test:integration (Integration tests)
  - Verify 80% line coverage minimum
  - Exit if fails ❌

Stage 5: Security
  - npm audit (block high/critical vulnerabilities)
  - Exit if fails ❌

Stage 6: Mutation Testing (Main Branch Only)
  - npm run mutation:test
  - Verify 75% mutation score minimum
  - Exit if fails ❌

Stage 7: Reporting
  - Upload coverage to Codecov
  - Post PR comment with coverage delta
  - Archive mutation report artifacts
  - Exit if fails ❌
```

**Complete GitHub Actions Workflow:**
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
      - name: Type Check
        run: npm run type-check
      
      # Stage 2: Code Quality
      - name: Lint
        run: npm run lint
      
      - name: Format Check
        run: npm run format:check
      
      # Stage 3: Database Setup
      - name: Database Migration
        run: npm run db:migrate:test
        env:
          TEST_DATABASE_URL: postgresql://postgres:test@localhost:5432/epam_innovation_db_test
      
      # Stage 4: Testing
      - name: Unit Tests with Coverage
        run: npm run test:unit --coverage
        env:
          NODE_ENV: test
          TEST_DATABASE_URL: postgresql://postgres:test@localhost:5432/epam_innovation_db_test
          REDIS_URL: redis://localhost:6379
      
      - name: Integration Tests
        run: npm run test:integration
        env:
          NODE_ENV: test
          TEST_DATABASE_URL: postgresql://postgres:test@localhost:5432/epam_innovation_db_test
          REDIS_URL: redis://localhost:6379
      
      - name: Verify Coverage (80% Minimum)
        run: |
          COVERAGE=$(cat coverage/coverage-summary.json | jq '.total.lines.pct')
          if (( $(echo "$COVERAGE < 80" | bc -l) )); then
            echo "Coverage $COVERAGE% below 80% minimum"
            exit 1
          fi
      
      # Stage 5: Security
      - name: Security Audit
        run: npm audit --audit-level=moderate
      
      # Stage 6: Mutation Testing (Main Branch Only)
      - name: Mutation Testing
        if: github.ref == 'refs/heads/main'
        run: npm run mutation:test
      
      # Stage 7: Reporting
      - name: Upload Coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
          flags: unittests
          fail_ci_if_error: true
      
      - name: Archive Mutation Report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: mutation-report
          path: reports/mutation/
```

---

### Complete npm Scripts Reference

```json
{
  "scripts": {
    "type-check": "tsc --noEmit",
    "lint": "eslint src --max-warnings 0",
    "lint:fix": "eslint src --fix",
    "format": "prettier --write src",
    "format:check": "prettier --check src",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:unit": "jest --testPathPattern=\\.test\\.ts$ --testPathPattern=\\.test\\.tsx$",
    "test:integration": "jest --testPathPattern=\\.integration\\.test\\.ts$",
    "test:e2e": "playwright test",
    "test:coverage": "jest --coverage",
    "test:coverage:report": "jest --coverage && node -e \"require('child_process').exec('open coverage/lcov-report/index.html')\"",
    "mutation:test": "stryker run",
    "db:migrate": "prisma migrate dev",
    "db:migrate:test": "DATABASE_URL=postgresql://postgres:test@localhost:5432/epam_innovation_db_test npx prisma migrate deploy",
    "db:seed": "prisma db seed",
    "build": "tsc && vite build",
    "dev": "vite",
    "preview": "vite preview",
    "ci": "npm run type-check && npm run lint && npm run test:coverage && npm run mutation:test"
  }
}
```

---

### Quality Gate Summary (Non-Negotiable Order)

All of these MUST pass, IN THIS ORDER, before code merges:

```
✅ STAGE 1: Type Safety
   └─ npm run type-check (tsc --noEmit)

✅ STAGE 2: Code Quality
   └─ npm run lint
   └─ npm run format:check

✅ STAGE 3: Database Setup (Integration Tests)
   └─ Migrate schema to test database

✅ STAGE 4: Testing
   └─ npm run test:unit --coverage (80% line minimum)
   └─ npm run test:integration (all passing)

✅ STAGE 5: Security
   └─ npm audit --audit-level=moderate

✅ STAGE 6: Mutation Testing (Main Branch Only)
   └─ stryker run (75% score minimum)

✅ STAGE 7: Reporting
   └─ Coverage uploaded to Codecov
   └─ PR comment with metrics

If ANY stage fails → PR blocked from merge
All stages must pass 100% → PR approved for merge
```

---

### Environment Configuration

**Development Environment (.env.local):**
```bash
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/epam_innovation_db
REDIS_URL=redis://localhost:6379
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_CLIENT_ID=your_client_id
AUTH0_CLIENT_SECRET=your_client_secret
JWT_SECRET=your-secret-key-256-bits-minimum
LOG_LEVEL=debug
```

**Test Environment (.env.test):**
```bash
NODE_ENV=test
TEST_DATABASE_URL=postgresql://postgres:test@localhost:5432/epam_innovation_db_test
REDIS_URL=redis://localhost:6379
JWT_SECRET=test-secret-key
LOG_LEVEL=error
```

**Production Environment (Secrets Manager):**
- Use GitHub Actions secrets vault
- Never commit `.env.production`
- Use environment-specific secret management

---

### Troubleshooting & Common Issues

**TypeScript Compilation Fails:**
```bash
npm run type-check
# Check for 'any' types: grep -r "any" src/
# Run: npm run lint:fix
```

**Coverage Below 80%:**
```bash
npm run test:coverage:report
# Open coverage/lcov-report/index.html
# Identify uncovered lines and add tests
```

**Mutation Score Below 75%:**
```bash
npm run mutation:test
# Review killed vs. survived mutations
# Add assertions for edge cases
# See: reports/mutation/html/index.html
```

**Flaky Tests in CI/CD:**
- Run locally: `npm run test:integration`
- Use fake timers: `jest.useFakeTimers()`
- Mock external APIs: `jest.mock()`
- Increase timeout if data-dependent: `jest.setTimeout(10000)`

**Prettier vs. ESLint Conflicts:**
```bash
npm install --save-dev eslint-config-prettier
# Add to .eslintrc.json: "prettier" in extends array (last)
npm run lint:fix && npm run format
```

---

## Summary: Tools & Frameworks Matrix

| Category | Tool | Version | Command | Minimum |
|----------|------|---------|---------|---------|
| **Type Check** | TypeScript | 5.x | `npm run type-check` | Strict mode |
| **Lint** | ESLint | 8.x | `npm run lint` | 0 warnings |
| **Format** | Prettier | 3.x | `npm run format` | 100% compliant |
| **Unit Tests** | Jest | 29.x | `npm run test:unit` | 80% coverage |
| **Integration Tests** | Jest + supertest | 29.x / 6.x | `npm run test:integration` | All passing |
| **E2E Tests** | Playwright | 1.40.x | `npm run test:e2e` | Critical paths |
| **Coverage** | Jest Coverage | 29.x | `npm run test:coverage` | 80% line |
| **Mutation** | Stryker | 7.x | `npm run mutation:test` | 75% score |
| **Package Mgr** | npm | 10.x | `npm ci` | Lock file |
| **Pre-Commit** | husky | 8.x | Auto hook | No bypass |

---

**Tools & Frameworks Section Ratified:** February 24, 2026  
**Tech Stack:** React 18 + Node.js 18+ + TypeScript 5.x + Jest 29.x  
**Constitution Compliance:** ✅ All standards enforced in CI/CD pipeline  
**Automation:** ✅ Pre-commit hooks + GitHub Actions gates


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

- **Constitution (8 sections) supersedes all other practices:** If conflict, constitution wins
- **Tools & Frameworks (Section 8) are mandatory:** Tech stack, versions, and CI/CD gates non-negotiable
- **Amendments:** Changes require team discussion and documentation
- **Violations:** Code review must flag any deviations before merge
- **Ratification:** All team members acknowledge and commit to these principles

---

**Version:** 1.0 | **Ratified:** February 24, 2026 | **Last Amended:** February 24, 2026  
**Constitution Sections:** 8 (7 Testing Principles + 1 Tools & Frameworks)  
**Coverage Target:** 80% line, 75% branch, 75% mutation score  
**Pre-Commit Hooks:** type-check → lint → format → unit tests  
**CI/CD Stages:** 7 (Type Safety → Quality → Database → Testing → Security → Mutation → Reporting)
