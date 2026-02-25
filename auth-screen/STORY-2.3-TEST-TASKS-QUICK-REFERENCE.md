# STORY-2.3 Test Tasks - Quick Reference & Implementation Checklist

**Purpose:** Quick lookup guide for test task IDs, file structure, and implementation checklist

---

## STORY-2.3a: User Dashboard - Test Quick Reference

### Test File Structure
```
src/components/__tests__/
├── UserDashboard.test.tsx              (10 unit tests)
├── StatusBadge.test.tsx                (4 unit tests)
├── IdeaListItem.test.tsx               (5 unit tests)
├── IdeaStatsBar.test.tsx               (3 unit tests)
├── UserDashboard.integration.test.tsx  (6 integration tests)
└── StatusBadge.integration.test.tsx    (8 integration tests)

src/utils/__tests__/
└── dashboardUtils.test.ts              (9 unit tests)

src/tests/e2e/
├── user-dashboard-pagination.spec.ts   (3 E2E tests)
└── user-dashboard-statistics.spec.ts   (3 E2E tests)
```

### Unit Test Summary (31 tests)

| Test ID Range | Component | Count | Focus | File |
|---|---|---|---|---|
| UT-2.3a-001 to 010 | UserDashboard | 10 | Rendering, data fetch, pagination | UserDashboard.test.tsx |
| UT-2.3a-011 to 014 | StatusBadge | 4 | Status colors & display | StatusBadge.test.tsx |
| UT-2.3a-015 to 019 | IdeaListItem | 5 | Title, category, date, status | IdeaListItem.test.tsx |
| UT-2.3a-020 to 022 | IdeaStatsBar | 3 | Total, approval %, pending | IdeaStatsBar.test.tsx |
| UT-2.3a-023 to 031 | dashboardUtils | 9 | Pagination, date format, % calc | dashboardUtils.test.ts |

### Integration Test Summary (14 tests)

| Test ID Range | Focus | File |
|---|---|---|
| INT-2.3a-001 to 006 | Full flow: fetch → display → paginate | UserDashboard.integration.test.tsx |
| INT-2.3a-007 to 014 | Component context: rendering, styling, a11y, responsive | StatusBadge.integration.test.tsx |

### E2E Test Summary (6 tests)

| Test ID Range | Focus | File |
|---|---|---|
| E2E-2.3a-001 to 003 | Pagination: next/prev, prevent overshoot, scroll | user-dashboard-pagination.spec.ts |
| E2E-2.3a-004 to 006 | Statistics: display correct %, handle updates, empty state | user-dashboard-statistics.spec.ts |

### Implementation Checklist (STORY-2.3a)

**Components to Implement:**
- [ ] `src/components/UserDashboard.tsx` → Pass UT-2.3a-001–010, INT-2.3a-001–006, E2E-2.3a-001–006
- [ ] `src/components/StatusBadge.tsx` → Pass UT-2.3a-011–014, INT-2.3a-007–014
- [ ] `src/components/IdeaListItem.tsx` → Pass UT-2.3a-015–019
- [ ] `src/components/IdeaStatsBar.tsx` → Pass UT-2.3a-020–022
- [ ] `src/utils/dashboardUtils.ts` → Pass UT-2.3a-023–031

**Test Fixtures:***
- [ ] `src/tests/fixtures/dashboard.ts` → Test data factories

**Timeline: 2-3 working days**

---

## STORY-2.3b: Evaluator Queue - Test Quick Reference

### Frontend Test File Structure (37 tests)

```
src/components/__tests__/
├── EvaluationQueue.test.tsx                     (8 unit tests)
├── EvaluationQueueRow.test.tsx                  (6 unit tests)
├── EvaluationModal.test.tsx                     (5 unit tests)
├── EvaluationHistory.test.tsx                   (3 unit tests)
├── BulkActionsBar.test.tsx                      (3 unit tests)
├── EvaluationQueue.integration.test.tsx         (6 integration tests)
├── EvaluationModal.integration.test.tsx         (4 integration tests)
└── BulkActionsBar.integration.test.tsx          (2 integration tests)

src/tests/e2e/
├── evaluator-workflow.spec.ts                   (2 E2E tests)
└── bulk-operations.spec.ts                      (2 E2E tests)
```

### Frontend Unit Test Summary (25 tests)

| Test ID Range | Component | Count | Focus | File |
|---|---|---|---|---|
| FE-UNIT-2.3b-001 to 008 | EvaluationQueue | 8 | Rendering, filtering by status | EvaluationQueue.test.tsx |
| FE-UNIT-2.3b-009 to 014 | EvaluationQueueRow | 6 | Row content: email, title, category, date, status | EvaluationQueueRow.test.tsx |
| FE-UNIT-2.3b-015 to 019 | EvaluationModal | 5 | Header, status select, comments, submit | EvaluationModal.test.tsx |
| FE-UNIT-2.3b-020 to 022 | EvaluationHistory | 3 | Past evaluations list, empty state | EvaluationHistory.test.tsx |
| FE-UNIT-2.3b-023 to 025 | BulkActionsBar | 3 | Select all, bulk buttons, CSV button | BulkActionsBar.test.tsx |

### Frontend Integration Test Summary (12 tests)

| Test ID Range | Focus | File |
|---|---|---|
| FE-INT-2.3b-001 to 006 | Full flow: fetch → display → filter → modal → update | EvaluationQueue.integration.test.tsx |
| FE-INT-2.3b-007 to 010 | Modal submission: API call, error handling, queue update, audit trail | EvaluationModal.integration.test.tsx |
| FE-INT-2.3b-011 to 012 | Bulk ops: status update, CSV download | BulkActionsBar.integration.test.tsx |

### Backend Test File Structure (27 tests)

```
backend/src/services/__tests__/
├── evaluation.service.test.ts                   (10 unit tests)
└── evaluation.service.integration.test.ts       (4 integration tests)

backend/src/middleware/__tests__/
└── roleCheck.test.ts                            (8 unit tests)

backend/src/routes/__tests__/
└── evaluations.integration.test.ts              (5 integration tests)
```

### Backend Unit Test Summary (18 tests)

| Test ID Range | Component | Count | Focus | File |
|---|---|---|---|---|
| BE-UNIT-2.3b-001 to 010 | EvaluationService | 10 | Submit, history, bulk, error handling | evaluation.service.test.ts |
| BE-UNIT-2.3b-011 to 018 | roleCheck middleware | 8 | EVALUATOR/ADMIN allow, SUBMITTER deny, 401/403 | roleCheck.test.ts |

### Backend Integration Test Summary (9 tests)

| Test ID Range | Focus | File |
|---|---|---|
| BE-INT-2.3b-001 to 004 | Database ops: persist, audit trail, atomicity, concurrency | evaluation.service.integration.test.ts |
| BE-INT-2.3b-005 to 009 | API endpoints: evaluate, history, bulk update, bulk reject, CSV export | evaluations.integration.test.ts |

### Frontend E2E Test Summary (4 tests)

| Test ID Range | Focus | File |
|---|---|---|
| E2E-2.3b-001 to 002 | Evaluator workflow: login → queue → evaluate → success; RBAC deny | evaluator-workflow.spec.ts |
| E2E-2.3b-003 to 004 | Bulk ops: select multiple & update; CSV export & download | bulk-operations.spec.ts |

### Implementation Checklist (STORY-2.3b - Frontend)

**Components to Implement:**
- [ ] `src/components/EvaluationQueue.tsx` → Pass FE-UNIT-001–008, FE-INT-001–006, E2E-001–002
- [ ] `src/components/EvaluationQueueRow.tsx` → Pass FE-UNIT-009–014
- [ ] `src/components/EvaluationModal.tsx` → Pass FE-UNIT-015–019, FE-INT-007–010
- [ ] `src/components/EvaluationHistory.tsx` → Pass FE-UNIT-020–022
- [ ] `src/components/BulkActionsBar.tsx` → Pass FE-UNIT-023–025, FE-INT-011–012, E2E-003–004

### Implementation Checklist (STORY-2.3b - Backend)

**Services to Implement:**
- [ ] `backend/src/services/evaluation.service.ts` → Pass BE-UNIT-001–010, BE-INT-001–004
  * Methods: submitEvaluation, getEvaluationHistory, bulkStatusUpdate
  
**Middleware to Implement:**
- [ ] `backend/src/middleware/roleCheck.ts` → Pass BE-UNIT-011–018 (if not already done in 1.4)

**Routes to Implement:**
- [ ] `backend/src/routes/evaluations.ts` → Pass BE-INT-005–009
  * Endpoints: POST /api/ideas/:id/evaluate, GET /api/ideas/:id/evaluations, PATCH /api/ideas/bulk-evaluate, GET /api/ideas/export/csv, GET /api/ideas/queue

**Database:
- [ ] Create `IdeationEvaluation` Prisma model (immutable audit trail)
- [ ] Create database migration for new model

**Timeline: 4-5 working days** (parallel frontend + backend)

---

## Test Execution Commands

### Run STORY-2.3a Tests

```bash
# Run all 51 tests (unit + integration)
npm test -- --testPathPattern="2.3a" --verbose

# Run only unit tests (31)
npm test -- --testPathPattern="2.3a" --testPathPattern="(?<!integration)" --verbose

# Run only integration tests (14)
npm test -- --testPathPattern="2.3a.*integration" --verbose

# Run with coverage
npm test -- --coverage --testPathPattern="2.3a"

# Run E2E tests
npx cypress run --spec "cypress/e2e/user-dashboard-*.spec.ts"
```

### Run STORY-2.3b Tests

```bash
# Frontend: Run all 37 tests
npm test -- --testPathPattern="FE.*2.3b" --verbose

# Backend: Run all 27 tests
cd backend && npm test -- --testPathPattern="2.3b" --verbose

# E2E tests
npx cypress run --spec "cypress/e2e/evaluator-*.spec.ts"

# All tests (from root)
npm test -- --testPathPattern="2.3b" && cd backend && npm test -- --testPathPattern="2.3b"

# With coverage
npm test -- --coverage --testPathPattern="2.3b"
```

### Verify Quality Gates

```bash
# ESLint
npm run lint -- src/components/User* src/components/Evaluation*

# TypeScript strict mode
npx tsc --noEmit

# Security: Check dependencies
npm audit

# All tests + coverage + linting
npm test -- --coverage && npm run lint && npx tsc --noEmit
```

---

## Test Task ID Reference

### TDD Phases Per Task

Each test goes through three phases:

1. **RED** (~8-10 min): Write failing test
2. **GREEN** (~12-15 min): Implement to pass test
3. **REFACTOR** (~2-3 min): Clean code, add JSDoc

**Example (STORY-2.3a, UT-2.3a-001):**
- RED: Write test for "page title 'My Ideas' renders"
- GREEN: Add `<h1>My Ideas</h1>` to UserDashboard component
- REFACTOR: Ensure proper JSDoc, no linting errors

---

## Workflow Status

**Workflow Phase:** 4/7 COMPLETE

| Phase | Status | Document |
|-------|--------|----------|
| 1. SPECIFY | ✅ Complete | EPIC-2 specs |
| 2. CLARIFY | ✅ Complete | STORY-2.3b clarifications |
| 3. PLAN | ✅ Complete | Implementation plans (2.3a & 2.3b) |
| **4. TASKS** | ✅ **COMPLETE** | **This document** |
| 5. IMPLEMENT | ⏳ Ready | Execute RED-GREEN-REFACTOR |
| 6. VERIFY | ⏳ Pending | QA & UAT |
| 7. DEPLOY | ⏳ Pending | Release |

**Next Action:** Execute Phase 5 (IMPLEMENT)
- Start with STORY-2.3a RED phase (write all 51 failing tests)
- Parallel: Start STORY-2.3b backend RED phase

---

## Test Dependencies & Sequencing

### STORY-2.3a No External Dependencies
- Can start immediately after test task documents created
- Tests use mocked API responses
- Independent component implementations

### STORY-2.3b Has Dependencies
**Blocking:** STORY-1.4 RBAC (✅ COMPLETE)
- roleCheck middleware (used in evaluation endpoints)
- JWT token validation (used in all evaluator routes)

**Non-Blocking but Recommended:**
- STORY-2.3a Dashboard (tests utility functions, no blocking)
- Test database setup (for integration test fixtures)

---

## Time Estimate Summary

| Story | Phase | Est. Time | Team Size |
|-------|-------|-----------|-----------|
| **2.3a** | RED (write tests) | 4 hours | 1 engineer |
| **2.3a** | GREEN (implement) | 10-12 hours | 1-2 engineers |
| **2.3a** | REFACTOR + QA | 4 hours | 1 engineer |
| **2.3a** | **TOTAL** | **2-3 days** | **1-2 engineers** |
| | | | |
| **2.3b** | RED (write tests) | 5-6 hours | 1-2 engineers (parallel) |
| **2.3b** | GREEN (implement) | 18-20 hours | 2-3 engineers (parallel backend + frontend) |
| **2.3b** | REFACTOR + QA | 4-5 hours | 1-2 engineers |
| **2.3b** | **TOTAL** | **4-5 days** | **2-3 engineers (parallel)** |
| | | | |
| **COMBINED** | **Both Stories** | **6-8 days** | **2-4 engineers** |

**Optimal Timeline:** Run STORY-2.3a + STORY-2.3b in parallel
- Days 1-2: STORY-2.3a complete
- Days 3-5: STORY-2.3b (parallel backend + frontend)
- Days 6-8: Final QA & cleanup

---

## Success Criteria Checklist

### STORY-2.3a Done ✅
- [ ] 51/51 tests passing
- [ ] Coverage ≥82%
- [ ] Zero ESLint errors
- [ ] TypeScript strict mode
- [ ] All E2E workflows passing
- [ ] Git commit pushed

### STORY-2.3b Done ✅
- [ ] 68/68 tests passing (37 frontend + 27 backend + 4 E2E)
- [ ] Coverage ≥80% on evaluation logic
- [ ] Zero ESLint errors
- [ ] TypeScript strict mode
- [ ] Database migration applied
- [ ] All API endpoints working
- [ ] RBAC verification passed
- [ ] Git commit pushed

### Both Stories Ready for Deployment ✅
- [ ] Total 119/119 tests passing
- [ ] Staging environment verified
- [ ] UAT sign-off received
- [ ] Performance benchmarks met
- [ ] Security review passed

---

**Document Version:** 1.0  
**Created:** 2025-02-24  
**Related:** STORY-2.3a-TEST-TASKS.md, STORY-2.3b-TEST-TASKS.md, STORY-2.3-TEST-TASKS-COMPLETE.md  
**Constitution.md Compliance:** ✅ All testing standards applied
