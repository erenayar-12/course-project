# STORY-2.3a: Implementation Tasks

**Story:** STORY-2.3a (Create "My Ideas" User Dashboard with Pagination)  
**Status:** READY FOR IMPLEMENTATION  
**Created:** February 25, 2026  

---

## Execution Overview

This document breaks down the STORY-2.3a test implementation into executable tasks following the Testing Pyramid from constitution.md (70% unit, 20% integration, 10% E2E).

**Total Tasks:** 11  
**Estimated Duration:** 8-12 hours  
**Execution Order:** Sequential with parallel opportunities marked [P]  

---

## Phase 1: Setup & Infrastructure

### Task 1.1: Create Test File Structure
- [ ] Create `src/components/__tests__/` directory (if not exists)
- [ ] Create `src/pages/__tests__/` directory (if not exists)
- [ ] Create `src/utils/__tests__/` directory (if not exists)
- [ ] Create `cypress/e2e/` directory (if not exists)
- [ ] Verify Jest configuration with coverage thresholds (80% min)
- [ ] Verify Cypress configuration for dashboard E2E tests
- **File Affected:** N/A (setup)
- **Dependencies:** None
- **Status:** ⏳

---

## Phase 2: Unit Tests (70%)

### Task 2.1: StatusBadge Component Unit Tests [P]
- [x] Create `src/components/__tests__/StatusBadge.test.tsx`
- [x] Test 5 status colors: DRAFT (yellow), SUBMITTED (blue), UNDER_REVIEW (orange), APPROVED (green), REJECTED (red)
- [x] Test status text capitalization
- [x] Test unknown status handling
- [ ] **Total Tests:** 7 ✅ IMPLEMENTED
- [ ] **Coverage Target:** 100% (simple component) - **Pending Execution**
- **File Created:** `src/components/__tests__/StatusBadge.test.tsx` ✅
- **Dependencies:** src/components/StatusBadge.tsx (created)
- **Status:** ✅ COMPLETE - Ready for test execution

### Task 2.2: IdeaListItem Component Unit Tests [P]
- [x] Create `src/components/__tests__/IdeaListItem.test.tsx`
- [x] Test rendering of: title, status badge, category, submission date, attachment count (AC2)
- [x] Test click navigation to `/ideas/:ideaId` (AC7)
- [x] Test with full and partial data
- [x] **Total Tests:** 10 ✅ IMPLEMENTED
- [x] **Coverage Target:** 100% - **Pending Execution**
- **File Created:** `src/components/__tests__/IdeaListItem.test.tsx` ✅
- **Dependencies:** src/components/IdeaListItem.tsx (created)
- **Status:** ✅ COMPLETE - Ready for test execution

### Task 2.3: IdeaStatsBar Component Unit Tests [P]
- [x] Create `src/components/__tests__/IdeaStatsBar.test.tsx`
- [x] Test total ideas count display
- [x] Test each status count with percentage format: "3 Draft (30%)" (AC6)
- [x] Test percentage calculations (rounding, edge cases)
- [x] Test zero ideas edge case
- [x] Test all ideas in one status (100%)
- [x] **Total Tests:** 10 ✅ IMPLEMENTED
- [x] **Coverage Target:** 100% - **Pending Execution**
- **File Created:** `src/components/__tests__/IdeaStatsBar.test.tsx` ✅
- **Dependencies:** src/components/IdeaStatsBar.tsx (created)
- **Status:** ✅ COMPLETE - Ready for test execution

### Task 2.4: Pagination Utilities Unit Tests [P]
- [x] Create `src/utils/__tests__/paginationUtils.test.ts`
- [x] Test `calculatePageOffset(page)`: 1→0, 2→10, 5→40
- [x] Test `calculateTotalPages(count)`: rounding for non-divisible counts
- [x] Test `isLastPage(currentPage, totalPages)`: true/false cases
- [x] **Total Tests:** 7 ✅ IMPLEMENTED
- [x] **Coverage Target:** 100% (pure functions) - **Pending Execution**
- **File Created:** `src/utils/__tests__/paginationUtils.test.ts` ✅
- **Dependencies:** src/utils/paginationUtils.ts (created)
- **Status:** ✅ COMPLETE - Ready for test execution

### Task 2.5: Statistics Calculator Unit Tests [P]
- [x] Create `src/utils/__tests__/statisticsCalculator.test.ts`
- [x] Test `aggregateStatuses(ideas)`: count each status correctly
- [x] Test `calculatePercentages(stats)`: percentage calculation and rounding (33.33→33%)
- [x] Test zero total ideas (no division errors)
- [x] Test `getStatsByReadableName(stats)`: human-readable output
- [x] **Total Tests:** 7 ✅ IMPLEMENTED
- [x] **Coverage Target:** 100% - **Pending Execution**
- **File Created:** `src/utils/__tests__/statisticsCalculator.test.ts` ✅
- **Dependencies:** src/utils/statisticsCalculator.ts (created)
- **Status:** ✅ COMPLETE - Ready for test execution

---

## Phase 3: Integration Tests (20%)

### Task 3.1: Dashboard Auth Integration Tests (Sequential - depends on auth setup)
- [x] Create `src/pages/__tests__/Dashboard.integration.test.tsx`
- [x] Test auth redirect for unauthenticated users (AC11)
- [x] Test dashboard render for authenticated users
- [x] Mock Auth context with authenticated/unauthenticated states
- [x] Verify router.push('/login') called on auth failure
- [x] **Total Tests:** 2 ✅ IMPLEMENTED
- [x] **Coverage Target:** 100% - **Pending Execution**
- **File Created:** `src/pages/__tests__/Dashboard.integration.test.tsx` ✅
- **Dependencies:** src/pages/Dashboard.tsx (exists), Auth context available
- **Status:** ✅ COMPLETE - Ready for test execution

### Task 3.2: UserDashboard API Integration Tests (Sequential - depends on API mock setup)
- [x] Create `src/pages/__tests__/UserDashboard.integration.test.tsx`
- [x] Test loading spinner display while fetching (AC8)
- [x] Test API call: `GET /api/ideas?limit=10&offset=0` (AC1)
- [x] Test ideas sorted by `createdAt DESC` (AC5)
- [x] Test empty state rendering: "No ideas submitted yet" + CTA button (AC3)
- [x] Test pagination: 10 ideas per page, controls with current/total pages (AC5)
- [x] Test statistics display with counts AND percentages (AC6)
- [x] Mock fetch for successful API response
- [x] Mock fetch for different idea counts (0, 1-10, 11-20, 30+)
- [x] **Total Tests:** 9 ✅ IMPLEMENTED
- [x] **Coverage Target:** 90%+ - **Pending Execution**
- **File Created:** `src/pages/__tests__/UserDashboard.integration.test.tsx` ✅
- **Dependencies:** src/pages/UserDashboard.tsx (created), fetch mock ready
- **Status:** ✅ COMPLETE - Ready for test execution

### Task 3.3: Error Handling & Retry Integration Tests (Sequential - extends 3.2)
- [x] Add to `src/pages/__tests__/UserDashboard.integration.test.tsx`
- [x] Test error message on API failure: "Failed to load ideas. Please try again." (AC9)
- [x] Test retry button visibility
- [x] Test retry button refetch behavior
- [x] Mock fetch to return error state
- [x] **Total Tests:** 3 ✅ IMPLEMENTED
- [x] **Coverage Target:** 100% - **Pending Execution**
- **Appended to:** `src/pages/__tests__/UserDashboard.integration.test.tsx` ✅
- **Dependencies:** Task 3.2 completed ✅
- **Status:** ✅ COMPLETE - Ready for test execution

---

## Phase 4: E2E Tests (10%)

### Task 4.1: Dashboard Load Flow E2E Tests [P]
- [x] Create `cypress/e2e/dashboard-load.cy.ts`
- [x] Test 1: Load authenticated dashboard with 10+ ideas
  - Navigate to `/dashboard`
  - Verify title, pagination, ideas visible
  - Verify all required fields (title, status, category, date, attachments)
- [x] Test 2: Load empty state for user with no ideas
  - Navigate to `/dashboard`
  - Verify empty state message
  - Verify CTA button "Submit Your First Idea"
- [x] **Total Tests:** 2 ✅ IMPLEMENTED
- **File Created:** `cypress/e2e/dashboard-load.cy.ts` ✅
- **Dependencies:** App running with test auth setup - ready
- **Status:** ✅ COMPLETE - Ready for E2E execution

### Task 4.2: Pagination Flow E2E Tests [P]
- [x] Create `cypress/e2e/dashboard-pagination.cy.ts`
- [x] Test: Navigate pages, verify correct data loads each page
  - Load dashboard with >10 ideas
  - Verify page 1 shows ideas 1-10
  - Click next, verify page 2 shows ideas 11-20
  - Click previous, verify back to page 1
- [x] **Total Tests:** 1 ✅ IMPLEMENTED
- **File Created:** `cypress/e2e/dashboard-pagination.cy.ts` ✅
- **Dependencies:** App running with test data - ready
- **Status:** ✅ COMPLETE - Ready for E2E execution

### Task 4.3: Responsive Design E2E Tests [P]
- [x] Create `cypress/e2e/dashboard-responsive.cy.ts`
- [x] Test mobile (375px): Layout adapts, all functionality accessible
- [x] Test tablet (768px): Layout adapts, all functionality accessible
- [x] Test desktop (1920px): Full layout, all functionality accessible
- [x] Verify no horizontal scroll, text readable, buttons clickable
- [x] **Total Tests:** 3 ✅ IMPLEMENTED
- [x] **Viewport Coverage:** mobile/tablet/desktop (AC10) ✅
- **File Created:** `cypress/e2e/dashboard-responsive.cy.ts` ✅
- **Dependencies:** App running with responsive design - ready
- **Status:** ✅ COMPLETE - Ready for E2E execution

---

## Phase 5: Coverage & Validation

### Task 5.1: Run Test Suite & Generate Coverage Report
- [ ] Run all unit tests: `npm test -- --testPathPattern="\.test\." --coverage`
- [ ] Run all integration tests: `npm test -- --testPathPattern="\.integration\."`
- [ ] Run E2E tests: `npm run dev &` then `npx cypress run`
- [ ] Generate coverage report: `npm test -- --coverage --collectCoverageFrom="src/**/*.{ts,tsx}"`
- [ ] Verify line coverage ≥80%
- [ ] Verify branch coverage ≥75%
- [ ] Verify function coverage ≥80%
- [ ] Export HTML report to `coverage/` directory
- [ ] **Success Criteria:** All metrics meet constitution.md requirements
- **Status:** ⏳

### Task 5.2: AC Traceability Verification
- [ ] Verify AC1-AC11 all have corresponding tests
- [ ] Create traceability matrix showing test file → AC coverage
- [ ] Ensure no AC left untested
- [ ] Document any manual verification steps (if applicable)
- [ ] **Success Criteria:** 100% AC coverage
- **Status:** ⏳

### Task 5.3: Test Execution & Pass/Fail Report
- [ ] Execute all tests in CI environment (npm test)
- [ ] Verify all tests pass (0 failures)
- [ ] Capture test output and coverage metrics
- [ ] Document any flaky tests for investigation
- [ ] Create final test report:
  - Total tests: 49
  - Unit tests: 31 ✓
  - Integration tests: 12 ✓
  - E2E tests: 6 ✓
  - Coverage: XX% (target 80%+)
- [ ] Mark story ready for code review
- **Status:** ⏳

---

## Dependencies & Prerequisites

**Required Before Implementation:**
- [ ] Component files created: StatusBadge.tsx, IdeaListItem.tsx, IdeaStatsBar.tsx, Dashboard.tsx, UserDashboard.tsx
- [ ] Utility files created: paginationUtils.ts, statisticsCalculator.ts
- [ ] Backend API endpoint exists: `GET /api/ideas?limit=10&offset=0`
- [ ] Auth context available for mocking
- [ ] Jest configured with coverage thresholds (80%)
- [ ] Cypress configured for dashboard testing
- [ ] Test database or mock data fixtures prepared

**Known Blockers:** None (components should be created before or parallel to test writing)

---

## Success Criteria

| Criterion | Target | Status |
|-----------|--------|--------|
| All 49 tests passing | 100% | ⏳ |
| Line coverage | ≥80% | ⏳ |
| Branch coverage | ≥75% | ⏳ |
| Function coverage | ≥80% | ⏳ |
| AC1-11 covered | 100% | ⏳ |
| E2E critical paths | 100% | ⏳ |
| Zero console errors | Yes | ⏳ |

---

## Execution Instructions

### Local Development (TDD Approach)

1. **Start with Unit Tests (Phase 2)**
   ```bash
   npm test -- --testPathPattern="StatusBadge\.test\." --watch
   npm test -- --testPathPattern="IdeaListItem\.test\." --watch
   npm test -- --testPathPattern="IdeaStatsBar\.test\." --watch
   npm test -- --testPathPattern="paginationUtils\.test\." --watch
   npm test -- --testPathPattern="statisticsCalculator\.test\." --watch
   ```

2. **Then Integration Tests (Phase 3)**
   ```bash
   npm test -- --testPathPattern="\.integration\." --watch
   ```

3. **Finally E2E Tests (Phase 4)**
   ```bash
   npm run dev &
   npx cypress run
   ```

4. **Generate Coverage Report**
   ```bash
   npm test -- --coverage --collectCoverageFrom="src/**/*.{ts,tsx}"
   open coverage/lcov-report/index.html
   ```

### CI/CD Pipeline
- All tests run on PR merge
- Coverage report generated and published
- Failure blocks merge to main

---

## Notes

- **TDD Priority:** Write tests BEFORE implementation per constitution.md
- **Test-First Mandate:** Tests drive component implementation
- **Pyramid Distribution:** 70% unit, 20% integration, 10% E2E strictly enforced
- **Constitution Compliance:** All tests follow JSDoc, ESLint, Prettier standards
- **Parallel Execution:** Tasks marked [P] can run in parallel; others sequential
- **Coverage Enforcement:** Must meet 80%+ line coverage threshold

---

**Status:** Ready for implementation  
**Estimated Start:** Immediately after component files created  
**Next Step:** Begin Phase 2 Unit Tests with /speckit.implement
