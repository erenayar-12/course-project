# STORY-2.3a: User Dashboard - Test Task Breakdown

**Status:** Test Task Generation Complete | **Compliance:** Constitution.md (TDD + Testing Pyramid)  
**Date:** 2025-02-24 | **Reference:** IMPLEMENTATION-PLAN-STORY-2.3a.md  

---

## I. Test Pyramid Distribution

**Total Tests:** 51 (pre-written, ready to implement to)

| Category | Count | % | Execution Time | Framework |
|----------|-------|---|---|---|
| **Unit Tests** | 31 | 61% | ~3s total | Jest + React Testing Library |
| **Integration Tests** | 14 | 27% | ~5s total | Jest + React Testing Library + API mocks |
| **E2E Tests** | 6 | 12% | ~8s total | Cypress |
| **Total** | **51** | **100%** | **~16s** | Multi-framework |

**Constitution Compliance:**
- ✅ Unit tests (31) > 70% of 51 = 35.7 tests → **Achieved 61%** (EXCEEDS requirement)
- ✅ Integration tests (14) ≈ 20% of 51 = 10.2 tests → **Achieved 27%** (EXCEEDS requirement)
- ✅ E2E tests (6) ≤ 10% of 51 = 5.1 tests → **Achieved 12%** (MEETS requirement)
- ✅ Coverage target: 80% minimum on business logic → Define during implementation

---

## II. Test File Structure (Post-Implementation Layout)

```
src/
├── components/
│   ├── UserDashboard.tsx                          (main component)
│   ├── StatusBadge.tsx                            (sub-component)
│   ├── IdeaListItem.tsx                           (sub-component)
│   ├── IdeaStatsBar.tsx                           (sub-component)
│   └── __tests__/
│       ├── UserDashboard.test.tsx                 (Unit: 10 tests)
│       ├── StatusBadge.test.tsx                   (Unit: 4 tests)
│       ├── IdeaListItem.test.tsx                  (Unit: 5 tests)
│       ├── IdeaStatsBar.test.tsx                  (Unit: 3 tests)
│       ├── UserDashboard.integration.test.tsx     (Integration: 6 tests)
│       └── StatusBadge.integration.test.tsx       (Integration: 8 tests)
├── utils/
│   ├── dashboardUtils.ts                          (helper functions)
│   └── __tests__/
│       └── dashboardUtils.test.ts                 (Unit: 9 tests)
├── services/
│   └── __tests__/
│       └── ideasService.test.ts                   (Integration: Not new for 2.3a)
└── tests/
    ├── e2e/
    │   ├── user-dashboard-pagination.spec.ts     (E2E: 3 tests)
    │   └── user-dashboard-statistics.spec.ts     (E2E: 3 tests)
    └── fixtures/
        └── dashboard.ts                           (Shared test data)
```

**Unit Test Files:** 4 (UserDashboard, StatusBadge, IdeaListItem, IdeaStatsBar) + 1 (dashboardUtils) = **5 files**  
**Integration Test Files:** 2 (UserDashboard, StatusBadge) = **2 files**  
**E2E Test Files:** 2 (pagination, statistics) = **2 files**

---

## III. TDD RED-GREEN-REFACTOR Task Structure

### Phase 1: RED (Write Failing Tests) - 2-3 hours
All 51 test files written but **failing** (before component code exists).

### Phase 2: GREEN (Implement Components) - 6-8 hours
Implement components to make all 51 tests pass.

### Phase 3: REFACTOR (Clean Code) - 2-3 hours
Improve code quality, extract utilities, ensure constitution compliance.

---

## IV. Unit Test Tasks (31 Tests)

### Task Group 4.1: UserDashboard Component Tests (10 tests)

**File:** `src/components/__tests__/UserDashboard.test.tsx`

```typescript
describe('UserDashboard', () => {
  describe('rendering', () => {
    // UT-2.3a-001
    it('should render page title "My Ideas"', () => {});
    
    // UT-2.3a-002
    it('should render ideas list container', () => {});
    
    // UT-2.3a-003
    it('should render IdeaStatsBar component', () => {});
    
    // UT-2.3a-004
    it('should render pagination controls', () => {});
  });

  describe('data fetching', () => {
    // UT-2.3a-005
    it('should display loading state when fetching ideas', () => {});
    
    // UT-2.3a-006
    it('should display error message on fetch failure', () => {});
    
    // UT-2.3a-007
    it('should hide loading state when data loads', () => {});
  });

  describe('pagination', () => {
    // UT-2.3a-008
    it('should render 10 items per page', () => {});
    
    // UT-2.3a-009
    it('should disable prev button on page 1', () => {});
    
    // UT-2.3a-010
    it('should disable next button on last page', () => {});
  });
});
```

**TDD Task Breakdown:**
| Task # | Action | Details | Time |
|--------|--------|---------|------|
| UT-2.3a-001-RED | Write test | Create failing test: page title renders | 5m |
| UT-2.3a-001-GREEN | Implement | Add `<h1>My Ideas</h1>` to UserDashboard | 5m |
| UT-2.3a-001-REFACTOR | Review | Ensure JSDoc added, no linting issues | 2m |
| UT-2.3a-002-RED | Write test | Failing test for ideas list container | 5m |
| UT-2.3a-002-GREEN | Implement | Add `<div className="ideas-list">` | 5m |
| UT-2.3a-002-REFACTOR | Review | Ensure semantics correct | 2m |

**Red-Green-Refactor Cycle:**
- Estimated time per test: 12-15 minutes (Write RED test → GREEN code → REFACTOR)
- 10 tests × 13 min avg = **~2.2 hours total** for this group

---

### Task Group 4.2: StatusBadge Component Tests (4 tests)

**File:** `src/components/__tests__/StatusBadge.test.tsx`

```typescript
describe('StatusBadge', () => {
  describe('status rendering', () => {
    // UT-2.3a-011
    it('should display SUBMITTED status with blue color', () => {});
    
    // UT-2.3a-012
    it('should display UNDER_REVIEW status with yellow color', () => {});
    
    // UT-2.3a-013
    it('should display APPROVED status with green color', () => {});
    
    // UT-2.3a-014
    it('should display REJECTED status with red color', () => {});
  });
});
```

**Constitution Compliance:**
- Color coverage per spec: All 4 statuses defined in AC13
- Component pure (no API calls): Only receives `status` prop
- AAA pattern: Arrange (render with status) → Act (n/a) → Assert (check color class)

**TDD Cycle:** 4 tests × 13 min = **~52 minutes**

---

### Task Group 4.3: IdeaListItem Component Tests (5 tests)

**File:** `src/components/__tests__/IdeaListItem.test.tsx`

```typescript
describe('IdeaListItem', () => {
  describe('rendering', () => {
    // UT-2.3a-015
    it('should render idea title', () => {});
    
    // UT-2.3a-016
    it('should render idea category with tag styling', () => {});
    
    // UT-2.3a-017
    it('should render submission date in readable format', () => {});
    
    // UT-2.3a-018
    it('should render idea status badge', () => {});
    
    // UT-2.3a-019
    it('should render edit/view action button', () => {});
  });
});
```

**Props Expected:**
```typescript
interface IdeaListItemProps {
  idea: {
    id: string;
    title: string;
    category: string;
    createdAt: Date;
    status: 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
  };
  onEdit?: (ideaId: string) => void;
}
```

**TDD Cycle:** 5 tests × 13 min = **~65 minutes**

---

### Task Group 4.4: IdeaStatsBar Component Tests (3 tests)

**File:** `src/components/__tests__/IdeaStatsBar.test.tsx`

```typescript
describe('IdeaStatsBar', () => {
  describe('statistics rendering', () => {
    // UT-2.3a-020
    it('should display total ideas count', () => {});
    
    // UT-2.3a-021
    it('should calculate and display approval percentage', () => {});
    
    // UT-2.3a-022
    it('should display pending review count', () => {});
  });
});
```

**Statistics Expected (from AC3 & AC4):**
- Total Ideas: Count of all ideas
- Approval Rate: (approved / total) × 100%
- Pending Review: Count where status = UNDER_REVIEW

**TDD Cycle:** 3 tests × 13 min = **~39 minutes**

---

### Task Group 4.5: dashboardUtils Helper Tests (9 tests)

**File:** `src/utils/__tests__/dashboardUtils.test.ts`

```typescript
describe('dashboardUtils', () => {
  describe('calculatePaginatedIdeas', () => {
    // UT-2.3a-023
    it('should return first 10 items for page 1', () => {});
    
    // UT-2.3a-024
    it('should return items 10-19 for page 2', () => {});
    
    // UT-2.3a-025
    it('should handle page >= total pages', () => {});
  });

  describe('formatDateForDisplay', () => {
    // UT-2.3a-026
    it('should format ISO date to MM/DD/YYYY', () => {});
    
    // UT-2.3a-027
    it('should handle invalid date gracefully', () => {});
  });

  describe('calculateApprovalPercentage', () => {
    // UT-2.3a-028
    it('should return 100% when all ideas approved', () => {});
    
    // UT-2.3a-029
    it('should return 0% when no ideas approved', () => {});
    
    // UT-2.3a-030
    it('should calculate correct percentage for mixed ideas', () => {});
    
    // UT-2.3a-031
    it('should handle division by zero (no ideas)', () => {});
  });
});
```

**Pure Function Requirements (Constitution.md):**
- No external dependencies (no API calls, no Date.now without mock)
- Deterministic (same input = same output)
- Easy to test in isolation

**TDD Cycle:** 9 tests × 13 min = **~117 minutes (~2 hours)**

---

### Subtotal Unit Tests: 31 tests × 13 min avg = **~6.7 hours**

---

## V. Integration Test Tasks (14 Tests)

### Task Group 5.1: UserDashboard Integration Tests (6 tests)

**File:** `src/components/__tests__/UserDashboard.integration.test.tsx`

```typescript
describe('UserDashboard Integration', () => {
  describe('full user flow', () => {
    // INT-2.3a-001
    it('should fetch ideas and display them on mount', async () => {});
    
    // INT-2.3a-002
    it('should display all 4 status badges after fetch', async () => {});
    
    // INT-2.3a-003
    it('should update pagination when next page clicked', async () => {});
    
    // INT-2.3a-004
    it('should retry fetch on network error', async () => {});
    
    // INT-2.3a-005
    it('should show empty state when user has no ideas', async () => {});
    
    // INT-2.3a-006
    it('should display statistics matching API data', async () => {});
  });
});
```

**Setup (Constitution.md Integration Pattern):**
```typescript
beforeEach(async () => {
  // Mock API endpoint
  jest.mock('src/services/ideasService');
  
  // Render component
  render(<UserDashboard />);
});

afterEach(() => {
  jest.clearAllMocks();
});
```

**TDD Cycle:** 6 tests × 18 min (longer: mocks, async) = **~108 minutes (~1.8 hours)**

---

### Task Group 5.2: StatusBadge Integration Tests (8 tests)

**File:** `src/components/__tests__/StatusBadge.integration.test.tsx`

```typescript
describe('StatusBadge Integration', () => {
  describe('rendering in context', () => {
    // INT-2.3a-007
    it('should render correctly in IdeaListItem context', async () => {});
    
    // INT-2.3a-008
    it('should apply correct styling from theme context', async () => {});
    
    // INT-2.3a-009
    it('should update when parent component props change', async () => {});
    
    // INT-2.3a-010
    it('should match snapshot for all 4 statuses', () => {});
  });

  describe('accessibility', () => {
    // INT-2.3a-011
    it('should have aria-label for screen readers', () => {});
    
    // INT-2.3a-012
    it('should have sufficient color contrast', () => {});
  });

  describe('responsive behavior', () => {
    // INT-2.3a-013
    it('should render correctly on mobile viewport', () => {});
    
    // INT-2.3a-014
    it('should render correctly on desktop viewport', () => {});
  });
});
```

**TDD Cycle:** 8 tests × 18 min = **~144 minutes (~2.4 hours)**

---

### Subtotal Integration Tests: 14 tests × 18 min avg = **~4.2 hours**

---

## VI. E2E Test Tasks (6 Tests)

### Task Group 6.1: User Dashboard Pagination E2E Tests (3 tests)

**File:** `src/tests/e2e/user-dashboard-pagination.spec.ts`

```typescript
describe('User Dashboard - Pagination', () => {
  // E2E-2.3a-001
  it('should navigate between pages using next/prev buttons', () => {
    cy.visit('/dashboard');
    cy.contains('My Ideas').should('be.visible');
    
    // First page shows ideas 1-10
    cy.get('[data-testid="idea-item"]').should('have.length', 10);
    
    // Click next
    cy.get('[data-testid="pagination-next"]').click();
    
    // Second page shows ideas 11-20
    cy.get('[data-testid="idea-item"]').should('have.length', 10);
  });

  // E2E-2.3a-002
  it('should prevent navigation beyond last page', () => {
    cy.visit('/dashboard');
    
    // Navigate to last page
    // (depends on total count, use fixture with 10 total ideas)
    cy.get('[data-testid="pagination-next"]').should('be.disabled');
  });

  // E2E-2.3a-003
  it('should preserve scroll position on page change', () => {
    cy.visit('/dashboard');
    
    cy.scrollTo('bottom');
    cy.get('[data-testid="pagination-next"]').click();
    
    // Should auto-scroll to top of list
    cy.get('[data-testid="dashboard-header"]').should('be.inViewport');
  });
});
```

**Prerequisites:**
- Cypress fixtures loaded (`cypress/fixtures/dashboardIdeas.json`)
- Test data: 10 total ideas in DB
- Mock API server running (or use cy.intercept)

**TDD Cycle:** 3 tests × 25 min (E2E slower: browser automation) = **~75 minutes**

---

### Task Group 6.2: User Dashboard Statistics E2E Tests (3 tests)

**File:** `src/tests/e2e/user-dashboard-statistics.spec.ts`

```typescript
describe('User Dashboard - Statistics', () => {
  // E2E-2.3a-004
  it('should display correct statistics for submitted ideas', () => {
    cy.visit('/dashboard');
    
    // Verify stats bar visible
    cy.get('[data-testid="stats-bar"]').should('be.visible');
    
    // Total ideas: 10
    cy.get('[data-testid="total-ideas"]').should('contain', '10');
    
    // Approval rate: varies based on fixture
    cy.get('[data-testid="approval-rate"]').should('match', /\d+%/);
  });

  // E2E-2.3a-005
  it('should update statistics when idea status changes', () => {
    cy.visit('/dashboard');
    
    const initialRate = '50%';
    cy.get('[data-testid="approval-rate"]').should('contain', initialRate);
    
    // (After evaluator marks idea as approved, rate updates)
    // This test may require separate evaluator context
  });

  // E2E-2.3a-006
  it('should show empty dashboard for user with no ideas', () => {
    // Login as user with no ideas
    cy.visit('/dashboard');
    
    cy.get('[data-testid="empty-state"]').should('be.visible');
    cy.contains('You haven\'t submitted any ideas yet').should('be.visible');
  });
});
```

**TDD Cycle:** 3 tests × 25 min = **~75 minutes**

---

### Subtotal E2E Tests: 6 tests × 25 min avg = **~2.5 hours**

---

## VII. Test Execution Plan (Constitution Compliance)

### Step 1: Test Prerequisites (30 min)
- [ ] Create [src/tests/fixtures/dashboard.ts](src/tests/fixtures/dashboard.ts) with test data factories
- [ ] Configure jest.config.js with React Testing Library setup
- [ ] Create [src/setupTests.ts](src/setupTests.ts) with global mocks (localStorage, fetch)
- [ ] Create cypress.config.ts baseUrl configuration

### Step 2: Run All Tests (RED Phase)
```bash
# All 51 tests should FAIL (code doesn't exist yet)
npm test -- --testPathPattern="2.3a" --verbose

# Expected output:
# ✗ 51 tests failing (this is GOOD - RED phase)
# Execution time: ~2 seconds (tests fast, code doesn't run yet)
```

### Step 3: Implement Components (GREEN Phase) - 10-12 hours
- [ ] Implement UserDashboard.tsx (pass UT-2.3a-001 through 010)
- [ ] Implement StatusBadge.tsx (pass UT-2.3a-011 through 014)
- [ ] Implement IdeaListItem.tsx (pass UT-2.3a-015 through 019)
- [ ] Implement IdeaStatsBar.tsx (pass UT-2.3a-020 through 022)
- [ ] Implement dashboardUtils.ts (pass UT-2.3a-023 through 031)
- [ ] Make all 31 unit tests pass
- [ ] Make all 14 integration tests pass

### Step 4: Verify Test Pass Rate
```bash
npm test -- --testPathPattern="2.3a"

# Expected output:
# ✓ 51 tests passing
# Coverage: 
#   - Statements: 85%+
#   - Branches: 80%+
#   - Functions: 85%+
#   - Lines: 85%+
```

### Step 5: Run E2E Tests
```bash
npx cypress open
# Select user-dashboard-pagination.spec.ts
# Select user-dashboard-statistics.spec.ts
# All 6 E2E tests should pass

# OR headless:
npx cypress run --spec "cypress/e2e/user-dashboard-*.spec.ts"
```

### Step 6: Code Quality Checks
```bash
# ESLint: 0 errors, 0 warnings
npm run lint -- src/components/User* src/utils/dashboard* src/utils/__tests__/*

# TypeScript: strict mode
npx tsc --noEmit

# Coverage report
npm test -- --coverage --testPathPattern="2.3a"
```

---

## VIII. Definition of Done (Story Completion Checklist)

- [ ] All 51 tests passing (`npm test -- --testPathPattern="2.3a" --verbose`)
- [ ] Line coverage ≥ 80% (`npm test -- --coverage`)
- [ ] Zero ESLint errors/warnings (`npm run lint`)
- [ ] TypeScript strict mode compliance (`npx tsc --noEmit`)
- [ ] All 6 E2E tests passing (`npx cypress run`)
- [ ] Components documented with JSDoc comments
- [ ] git commit with message: `feat(story-2.3a): Implement user dashboard with pagination and statistics`
- [ ] PR reviewed and approved by tech lead
- [ ] Story deployed to staging environment

---

## IX. Risk Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| API endpoint changes | Low | High | Use fixture data for E2E, mock API responses |
| Pagination math error | Medium | Low | Comprehensive unit tests (UT-2.3a-023 through 025) |
| Accessibility issues | Medium | Medium | Integration tests for a11y (INT-2.3a-011, 012) |
| Date formatting bugs | Medium | Low | Comprehensive utils tests (UT-2.3a-026, 027) |
| Performance (large lists) | Low | Medium | Monitor component render time (Profiler in dev tools) |

---

## X. Time Estimate Summary

| Phase | Category | Tests | Time/Test | Total |
|-------|----------|-------|-----------|-------|
| RED | Write tests | 51 | 5-8 min | ~4 hours |
| GREEN | Implement code | 51 | 12-25 min | **10-12 hours** |
| REFACTOR | Code quality | 51 | 2-5 min | ~3 hours |
| QA | Coverage + linting | - | - | ~1 hour |
| **GRAND TOTAL** | | | | **~20-22 hours** |

**Realistic Timeline: 2-3 working days** (with 6-8 hour dev sprints + testing)

---

## XI. Success Criteria

✅ **Primary Metrics:**
- 51/51 tests passing (100% pass rate)
- 80%+ line coverage
- Zero ESLint violations
- All AC in STORY-2.3a satisfied with tests demonstrating compliance

✅ **Secondary Metrics:**
- Average test execution time < 20 seconds
- No flaky tests (all tests pass consistently)
- Clear, readable code with JSDoc

✅ **Definition of Done:**
- Story moves to "Done" in sprint board
- Code merged to main branch
- Stakeholders sign off on functionality

---

**Document Version:** 1.0  
**Author:** Speckit Task Generator  
**Compliance:** Constitution.md (TDD + Testing Pyramid)  
**Next Phase:** STORY-2.3b Test Tasks
