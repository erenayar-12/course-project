# STORY-2.3a: Testing Plan - "My Ideas" User Dashboard

**Story:** STORY-2.3a (Create "My Ideas" User Dashboard with Pagination)  
**Date:** February 25, 2026  
**Framework:** Jest + React Testing Library (Frontend) | Supertest (Backend)  
**Target Coverage:** 80%+ per Constitution.md

---

## Test Strategy Overview

This testing plan follows the **Testing Pyramid** from constitution.md:
- **Unit Tests (70%):** Pure functions, isolated components, business logic
- **Integration Tests (20%):** Component boundaries, API interactions, error handling
- **E2E Tests (10%):** Critical user journeys (load, paginate, navigate)

**Total Estimated Test Cases:** ~45 tests  
**Execution Time:** <30 seconds (all tests)

---

## UNIT TESTS (70% - ~31 tests)

### 1. StatusBadge Component Tests

**File:** `src/components/__tests__/StatusBadge.test.tsx`

**Description:** Test color-coded status badge rendering per AC4

```typescript
describe('StatusBadge', () => {
  describe('rendering', () => {
    it('should render DRAFT status with yellow background', () => {
      // Verify className contains 'bg-yellow' or similar
      // Expect text = 'DRAFT'
    });
    it('should render SUBMITTED status with blue background', () => {});
    it('should render UNDER_REVIEW status with orange background', () => {});
    it('should render APPROVED status with green background', () => {});
    it('should render REJECTED status with red background', () => {});
  });
  
  describe('text formatting', () => {
    it('should capitalize status text', () => {});
    it('should handle unknown status gracefully', () => {});
  });
});
```

**Test Count:** 7 tests

---

### 2. IdeaListItem Component Tests

**File:** `src/components/__tests__/IdeaListItem.test.tsx`

**Description:** Test individual idea row rendering (AC2) and click behavior (AC7)

```typescript
describe('IdeaListItem', () => {
  describe('rendering required fields', () => {
    it('should display idea title', () => {
      // AC2: Title displayed
    });
    it('should display status badge', () => {
      // AC2: Status shown with StatusBadge component
    });
    it('should display category', () => {
      // AC2: Category visible
    });
    it('should display submission date', () => {
      // AC2: Date in user-readable format (e.g., "Feb 25, 2026")
    });
    it('should display attachment count', () => {
      // AC2: "2 attachments" or similar
    });
  });
  
  describe('click navigation', () => {
    it('should navigate to /ideas/:ideaId when row clicked', () => {
      // AC7: Verify router.push or navigate called with correct path
    });
    it('should pass ideaId to detail page route', () => {
      // AC7: Correct ID passed for navigation
    });
  });
  
  describe('rendering variants', () => {
    it('should render with all fields populated', () => {});
    it('should handle missing attachments count gracefully', () => {});
  });
});
```

**Test Count:** 10 tests

---

### 3. IdeaStatsBar Component Tests

**File:** `src/components/__tests__/IdeaStatsBar.test.tsx`

**Description:** Test statistics display with counts AND percentages (AC6)

```typescript
describe('IdeaStatsBar', () => {
  describe('statistics display', () => {
    it('should display total ideas count', () => {
      // Total: 10 ideas
    });
    it('should display DRAFT count with percentage', () => {
      // AC6: "3 Draft (30%)"
    });
    it('should display SUBMITTED count with percentage', () => {});
    it('should display UNDER_REVIEW count with percentage', () => {});
    it('should display APPROVED count with percentage', () => {});
    it('should display REJECTED count with percentage', () => {});
  });
  
  describe('percentage calculation', () => {
    it('should calculate percentages correctly for 10 ideas', () => {
      // (3/10)*100 = 30%
      const stats = { draft: 3, submitted: 2, underReview: 1, approved: 3, rejected: 1 };
      // Verify: 30%, 20%, 10%, 30%, 10%
    });
    it('should round percentages to nearest integer', () => {});
    it('should handle zero ideas without division error', () => {});
    it('should handle all ideas in one status', () => {
      // 100% Approved
    });
  });
});
```

**Test Count:** 10 tests

---

### 4. Pagination Utilities Tests

**File:** `src/utils/__tests__/paginationUtils.test.ts`

**Description:** Business logic for pagination calculations

```typescript
describe('paginationUtils', () => {
  describe('calculatePageOffset', () => {
    it('should return 0 for page 1', () => {
      expect(calculatePageOffset(1)).toBe(0);
    });
    it('should return 10 for page 2', () => {
      expect(calculatePageOffset(2)).toBe(10);
    });
    it('should return correct offset for arbitrary page', () => {
      expect(calculatePageOffset(5)).toBe(40);
    });
  });
  
  describe('calculateTotalPages', () => {
    it('should return 1 for 10 or fewer ideas', () => {
      expect(calculateTotalPages(10)).toBe(1);
    });
    it('should return 2 for 11-20 ideas', () => {
      expect(calculateTotalPages(15)).toBe(2);
    });
    it('should round up for non-divisible counts', () => {
      expect(calculateTotalPages(25)).toBe(3);
    });
  });
  
  describe('isLastPage', () => {
    it('should return true when on last page', () => {});
    it('should return false when not on last page', () => {});
  });
});
```

**Test Count:** 7 tests

---

### 5. Statistics Calculation Tests

**File:** `src/utils/__tests__/statisticsCalculator.test.ts`

**Description:** Pure function logic for aggregating status counts/percentages

```typescript
describe('statisticsCalculator', () => {
  describe('aggregateStatuses', () => {
    it('should count each status correctly', () => {
      const ideas = [
        { id: 1, status: 'DRAFT' },
        { id: 2, status: 'DRAFT' },
        { id: 3, status: 'APPROVED' },
      ];
      // Return { draft: 2, approved: 1, submitted: 0, ... }
    });
  });
  
  describe('calculatePercentages', () => {
    it('should return percentage for each status', () => {
      const stats = { draft: 3, submitted: 2, underReview: 0, approved: 3, rejected: 2 };
      // Expect { draft: 30, submitted: 20, approved: 30, rejected: 20, ... }
    });
    it('should handle edge case: 0 total ideas', () => {
      // Should not throw; return percentages as 0
    });
    it('should handle rounding', () => {
      // 1/3 = 33.33... → 33%
    });
  });
  
  describe('getStatsByStatus', () => {
    it('should return stats keyed by readable status name', () => {
      // { "Draft": 3, "Submitted": 2, ... } or similar
    });
  });
});
```

**Test Count:** 7 tests

---

## INTEGRATION TESTS (20% - ~9 tests)

### 6. UserDashboard Component with API Integration

**File:** `src/pages/__tests__/UserDashboard.integration.test.tsx`

**Description:** Test dashboard loading, data fetching, sorting (AC1, AC5)

```typescript
describe('UserDashboard (Integration)', () => {
  describe('data loading', () => {
    it('should display loading spinner while fetching ideas', () => {
      // AC8: Spinner visible during load
      // Use userEvent and waitFor
    });
    it('should fetch ideas from GET /api/ideas?limit=10&offset=0', () => {
      // Verify fetch called with correct endpoint/params
    });
    it('should display ideas sorted by createdAt DESC', () => {
      // AC5: Most recent first
      // Verify API called with sort param or client-side sorting applied
    });
  });
  
  describe('empty state', () => {
    it('should display empty state when user has no ideas', () => {
      // AC3: "No ideas submitted yet" message
      // AC3: CTA button "Submit Your First Idea"
    });
    it('should navigate to submission form on CTA button click', () => {
      // AC3: CTA button navigates to submission form
    });
  });
  
  describe('pagination', () => {
    it('should display 10 ideas per page', () => {
      // AC5: Exactly 10 items on first page
    });
    it('should display pagination controls with current/total pages', () => {
      // AC5: "Page 1 of 3" or similar
    });
    it('should load next page when next button clicked', () => {
      // AC5: Fetch with offset=10 (page 2)
    });
  });
  
  describe('statistics', () => {
    it('should display status breakdown with counts and percentages', () => {
      // AC6: "3 Approved (30%)" format
    });
  });
});
```

**Test Count:** 9 tests

---

### 7. Dashboard Router Component Auth Tests

**File:** `src/pages/__tests__/Dashboard.integration.test.tsx`

**Description:** Test authentication check before dashboard access (AC11)

```typescript
describe('Dashboard (Router Component)', () => {
  describe('authentication', () => {
    it('should render UserDashboard when user is authenticated', () => {
      // AC11: Render dashboard for logged-in user
      // Mock Auth context with authenticated state
    });
    it('should redirect to login when user is not authenticated', () => {
      // AC11: Redirect to /login for unauthenticated user
      // Verify router.push('/login') called
    });
  });
});
```

**Test Count:** 2 tests

---

### 8. Error Handling & Retry Tests

**File:** `src/pages/__tests__/UserDashboard.integration.test.tsx` (extended)

**Description:** Test error state and retry functionality (AC9)

```typescript
describe('UserDashboard Error Handling', () => {
  describe('API failure', () => {
    it('should display error message when API fails', () => {
      // AC9: "Failed to load ideas. Please try again." message
      // Mock fetch to return error
    });
    it('should display retry button on error', () => {
      // AC9: Retry button visible
    });
    it('should refetch ideas when retry button clicked', () => {
      // AC9: Retry calls fetchIdeas again
    });
  });
});
```

**Test Count:** 3 tests

---

## E2E TESTS (10% - ~5 tests)

### 9. Complete Dashboard Loading Flow

**File:** `cypress/e2e/dashboard-load.cy.ts` (or similar)

**Description:** Critical user journey - load and view dashboard

```typescript
describe('Dashboard Load Flow (E2E)', () => {
  it('should load authenticated dashboard with ideas', () => {
    // 1. User logged in (via auth setup)
    // 2. Navigate to /dashboard
    // 3. Verify title, content, pagination visible
    // 4. Verify ideas displayed with all required fields
  });
  
  it('should display empty state for new user with no ideas', () => {
    // 1. Logged in but no ideas submitted
    // 2. Navigate to /dashboard
    // 3. Verify empty state message and CTA button
  });
});
```

**Test Count:** 2 tests

---

### 10. Pagination Navigation Flow

**File:** `cypress/e2e/dashboard-pagination.cy.ts`

**Description:** User navigates through pages

```typescript
describe('Dashboard Pagination Flow (E2E)', () => {
  it('should navigate between pages and load correct data', () => {
    // 1. Load dashboard with >10 ideas
    // 2. Verify page 1 shows first 10 ideas
    // 3. Click "Next" button
    // 4. Verify page 2 loaded with ideas 11-20
    // 5. Click "Previous" button
    // 6. Verify returned to page 1
  });
});
```

**Test Count:** 1 test

---

### 11. Responsive Design Tests

**File:** `cypress/e2e/dashboard-responsive.cy.ts`

**Description:** Verify AC10 - responsive across devices

```typescript
describe('Dashboard Responsive Design (E2E)', () => {
  it('should display correctly on mobile (375px)', () => {
    // AC10: Mobile layout
    // Verify ideas list, pagination, stats visible
  });
  
  it('should display correctly on tablet (768px)', () => {
    // AC10: Tablet layout
  });
  
  it('should display correctly on desktop (1920px)', () => {
    // AC10: Desktop layout
  });
});
```

**Test Count:** 3 tests

---

## Test Execution & Coverage Requirements

### Running Tests Locally

```bash
# Unit tests only (fast feedback loop)
npm test -- --testPathPattern="\.test\." --coverage

# Integration tests
npm test -- --testPathPattern="\.integration\." --coverage

# E2E tests (requires running app)
npm run dev &
npx cypress run

# All tests with coverage report
npm test -- --coverage --collectCoverageFrom="src/**/*.{ts,tsx}" --coverageThreshold='{"global":{"branches":75,"functions":80,"lines":80,"statements":80}}'
```

### Coverage Goals (Constitution.md)

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Line Coverage | 80% | TBD | 🔄 |
| Branch Coverage | 75% | TBD | 🔄 |
| Function Coverage | 80% | TBD | 🔄 |
| Mutation Score | 75% | TBD | 🔄 |

### Test Organization

```
src/
├── components/
│   ├── StatusBadge.tsx
│   ├── IdeaListItem.tsx
│   ├── IdeaStatsBar.tsx
│   └── __tests__/
│       ├── StatusBadge.test.tsx          ✅ 7 tests
│       ├── IdeaListItem.test.tsx         ✅ 10 tests
│       └── IdeaStatsBar.test.tsx         ✅ 10 tests
├── pages/
│   ├── Dashboard.tsx
│   ├── UserDashboard.tsx
│   └── __tests__/
│       ├── Dashboard.integration.test.tsx     ✅ 2 tests
│       └── UserDashboard.integration.test.tsx ✅ 9+3 tests
└── utils/
    ├── paginationUtils.ts
    ├── statisticsCalculator.ts
    └── __tests__/
        ├── paginationUtils.test.ts      ✅ 7 tests
        └── statisticsCalculator.test.ts ✅ 7 tests

cypress/
└── e2e/
    ├── dashboard-load.cy.ts             ✅ 2 tests
    ├── dashboard-pagination.cy.ts       ✅ 1 test
    └── dashboard-responsive.cy.ts       ✅ 3 tests
```

---

## Acceptance Criteria Traceability

| AC | Test File | Test Type | Status |
|----|-----------|-----------|--------|
| AC1 | UserDashboard.integration.test.tsx | Integration | 🔄 |
| AC2 | IdeaListItem.test.tsx | Unit | 🔄 |
| AC3 | UserDashboard.integration.test.tsx | Integration | 🔄 |
| AC4 | StatusBadge.test.tsx | Unit | 🔄 |
| AC5 | UserDashboard.integration.test.tsx, dashboard-pagination.cy.ts | Integration + E2E | 🔄 |
| AC6 | IdeaStatsBar.test.tsx | Unit | 🔄 |
| AC7 | IdeaListItem.test.tsx | Unit | 🔄 |
| AC8 | UserDashboard.integration.test.tsx | Integration | 🔄 |
| AC9 | UserDashboard.integration.test.tsx | Integration | 🔄 |
| AC10 | dashboard-responsive.cy.ts | E2E | 🔄 |
| AC11 | Dashboard.integration.test.tsx | Integration | 🔄 |

---

## Next Steps

1. **Write Unit Tests First** (TDD approach per Constitution.md)
   - Start with StatusBadge, IdeaListItem, IdeaStatsBar components
   - Then write utility function tests
   
2. **Integration Tests**
   - Mock API responses and test dashboard loading/paginating
   - Test auth redirect
   
3. **E2E Tests**
   - Run against live application
   - Verify user journeys end-to-end
   
4. **Coverage Report**
   - Generate HTML coverage report
   - Verify ≥80% coverage on business logic
   - Adjust tests if any critical paths uncovered

5. **Documentation**
   - Update README with test execution commands
   - Document any manual testing steps

---

**Created:** February 25, 2026  
**Status:** READY FOR TEST IMPLEMENTATION  
**Assigned to:** Development Team
