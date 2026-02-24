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

### Section 3: Unit Testing Standards (Jest)

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

### Section 4: Integration Testing Standards

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

### Section 5: E2E Testing Standards (Critical Workflows Only)

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

### Section 6: Mocking, Fixtures & Test Data

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

### Section 7: Test Organization & Structure

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

### Section 8: Testing in CI/CD Pipeline

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
