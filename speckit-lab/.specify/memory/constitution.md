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

## Development Workflow

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
