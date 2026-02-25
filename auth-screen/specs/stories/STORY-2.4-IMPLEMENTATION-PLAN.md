# STORY-2.4 Implementation Plan

**Document:** Implementation Plan  
**Story ID:** STORY-2.4  
**Story Title:** Add Sorting and Filtering to Idea List  
**Epic:** EPIC-2 (Idea Submission & Management System)  
**Created:** February 25, 2026  
**Status:** IN PROGRESS  
**Owner:** [Development Team]  
**Estimated Duration:** 2-3 days (5 story points)

---

## Executive Summary

STORY-2.4 adds filtering and sorting capabilities to the "My Ideas" dashboard. Users will be able to filter ideas by single status selection and sort by date or title. This plan breaks down the implementation into 3 phases over 2-3 days, with clear deliverables and testing checkpoints.

**Key Outcomes:**
- Single-select status filter (All, Submitted, Under Review, Needs Revision, Approved, Rejected)
- Sort by 4 options (Date Newest/Oldest, Title A-Z/Z-A)
- URL-based state (no localStorage)
- Filter + Sort chips display
- Empty state handling
- Mobile responsive
- 11 acceptance criteria met
- ≥80% test coverage

---

## Project Structure & Deliverables

### Phase 1: Frontend Foundation (Day 1-1.5)
**Goal:** Create UI components and URL synchronization  
**Owner:** Frontend Developer

#### Phase 1 Deliverables

| Deliverable | File | Status | Notes |
|-------------|------|--------|-------|
| StatusFilter Component | `src/components/IdeaStatusFilter.tsx` | NOT STARTED | Single-select radio/dropdown |
| SortDropdown Component | `src/components/IdeaSortDropdown.tsx` | NOT STARTED | 4 sort options |
| FilterChips Component | `src/components/FilterChips.tsx` | NOT STARTED | Show active filter + sort |
| EmptyResultsState Component | `src/components/EmptyResultsState.tsx` | NOT STARTED | Message + CTA |
| Updated Dashboard | `src/pages/my-ideas/MyIdeasDashboard.tsx` | MODIFY | Integrate components + URL sync |
| Types Update | `src/types/ideaTypes.ts` | MODIFY | Add filter/sort types if needed |
| Unit Tests | `src/components/__tests__/IdeaStatusFilter.test.tsx` | NEW | ≥80% coverage |
| | `src/components/__tests__/IdeaSortDropdown.test.tsx` | NEW | ≥80% coverage |
| | `src/components/__tests__/FilterChips.test.tsx` | NEW | ≥80% coverage |

#### Phase 1 Tasks

**Task P1.1:** Create StatusFilter Component
- File: `src/components/IdeaStatusFilter.tsx`
- Naming: PascalCase component `IdeaStatusFilter`
- Type: Functional component with props interface `IdeaStatusFilterProps`
- Props: `selectedStatus`, `onStatusChange`
- UI: Radio buttons or dropdown (single-select)
- Options: All, Submitted, Under Review, Needs Revision, Approved, Rejected
- Accessibility: Proper labels, ARIA attributes
- Effort: 1-2 hours
- Checklist:
  - [ ] Component renders all 6 status options
  - [ ] Radio button shows selected status
  - [ ] Selecting different status updates parent state
  - [ ] Clicking "All" clears filter
  - [ ] Styled with Tailwind (matches dashboard theme)

**Task P1.2:** Create SortDropdown Component
- File: `src/components/IdeaSortDropdown.tsx`
- Naming: PascalCase component `IdeaSortDropdown`
- Type: Functional component with props interface `IdeaSortDropdownProps`
- Props: `sortBy`, `sortOrder`, `onSortChange`
- UI: Dropdown/select showing current sort option
- Options: Display names like "Date (Newest)" but store as `createdAt+DESC`
- Effort: 1-2 hours
- Checklist:
  - [ ] Dropdown shows all 4 options with proper labels
  - [ ] Current sort shown as selected
  - [ ] onChange handler receives both sortBy and sortOrder
  - [ ] Styled consistently with StatusFilter

**Task P1.3:** Create FilterChips Component
- File: `src/components/FilterChips.tsx`
- Naming: PascalCase `FilterChips`
- Type: Functional component
- Props: `statusFilter`, `sortBy`, `sortOrder`, `onRemoveFilter`, `onRemoveSort`
- UI: Show chips only if active (filter !== 'ALL' OR sort !== 'createdAt+DESC')
- Chips: Display "Under Review" + "Title (A-Z)" with X buttons
- Effort: 2-3 hours
- Checklist:
  - [ ] Chips render only when filter/sort active
  - [ ] Each chip shows correct label
  - [ ] X button removes individual chip
  - [ ] Styled as badge/pill components

**Task P1.4:** Create EmptyResultsState Component
- File: `src/components/EmptyResultsState.tsx`
- Naming: PascalCase `EmptyResultsState`
- Props: `onClearFilters` (function)
- UI: Friendly message + "Clear Filters" button
- Message: "No ideas match your filters. Try: Clear filters, viewing all ideas, creating a new idea"
- Effort: 1-2 hours
- Checklist:
  - [ ] Message displays clearly
  - [ ] Button calls onClearFilters
  - [ ] Style matches empty state pattern on dashboard

**Task P1.5:** Update MyIdeasDashboard Component
- File: `src/pages/my-ideas/MyIdeasDashboard.tsx`
- Changes: Add state for filters, integrate new components, implement URL sync
- State: `statusFilter`, `sortBy`, `sortOrder`, `page`, `isLoading`
- URL Sync logic:
  - On mount: parse URL → set state
  - On state change: update URL
  - Example: `/my-ideas?status=SUBMITTED&sortBy=title&sortOrder=ASC&page=1`
- Effort: 3-4 hours
- Checklist:
  - [ ] StatusFilter component renders
  - [ ] SortDropdown component renders
  - [ ] FilterChips display when active
  - [ ] EmptyResultsState shows when 0 results
  - [ ] URL params update when filter/sort changes
  - [ ] URL params applied on page reload

**Task P1.6:** Implement URL Synchronization
- Use React Router v6 `useSearchParams` hook
- Bidirectional sync: state ↔ URL
- Code structure:
  ```typescript
  // On mount: URL → state
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get('status') || 'ALL';
    const sortBy = params.get('sortBy') || 'createdAt';
    // Update state
  }, [location.search]);
  
  // On change: state → URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (statusFilter !== 'ALL') params.set('status', statusFilter);
    params.set('sortBy', sortBy);
    params.set('sortOrder', sortOrder);
    navigate(`?${params.toString()}`, { replace: true });
  }, [statusFilter, sortBy, sortOrder]);
  ```
- Effort: 2-3 hours
- Checklist:
  - [ ] Bookmarked URL with filters preserves filters on reload
  - [ ] Clearing filters removes URL params
  - [ ] URL in browser address bar updates correctly

**Task P1.7:** Write Frontend Unit Tests
- Files: Create test files for all new components
  - `src/components/__tests__/IdeaStatusFilter.test.tsx`
  - `src/components/__tests__/IdeaSortDropdown.test.tsx`
  - `src/components/__tests__/FilterChips.test.tsx`
  - `src/pages/__tests__/MyIdeasDashboard.filter.test.tsx`
- Coverage Target: ≥80%
- Tests to write:
  - Component renders without errors
  - Props passed correctly
  - Click handlers fire correctly
  - State changes update display
  - URL params parsed correctly
- Testing library: React Testing Library + Jest
- Effort: 3-4 hours
- Checklist:
  - [ ] All new components have unit tests
  - [ ] Coverage ≥80% for each component
  - [ ] Tests pass locally
  - [ ] No console errors/warnings

**Phase 1 Effort Estimate:** 15-20 hours (1-1.5 days)

---

### Phase 2: Backend API & Validation (Day 1.5-2)
**Goal:** Implement filtered API endpoint with proper validation  
**Owner:** Backend Developer

#### Phase 2 Deliverables

| Deliverable | File | Status | Notes |
|-------------|------|--------|-------|
| Updated Ideas Route | `backend/src/routes/ideas.ts` | MODIFY | Add query params |
| Ideas Service Update | `backend/src/services/ideaService.ts` | MODIFY | Filtering logic |
| Database Indexes | `backend/prisma/schema.prisma` | VERIFY/UPDATE | Add indexes if missing |
| Backend Unit Tests | `backend/src/routes/__tests__/ideas.filter.test.ts` | NEW | ≥80% coverage |
| Integration Tests | `backend/src/integration/__tests__/filter-sort.integration.test.ts` | NEW | API + DB |

#### Phase 2 Tasks

**Task P2.1:** Update GET /api/ideas Endpoint
- Route: `GET /api/ideas`
- Existing params: `page`, `limit` (keep functioning)
- New params: `status` (single value), `sortBy`, `sortOrder`
- Parameter validation:
  - `status`: Must be one of [SUBMITTED, UNDER_REVIEW, NEEDS_REVISION, APPROVED, REJECTED] or omitted
  - `sortBy`: Must be one of [createdAt, title]
  - `sortOrder`: Must be one of [ASC, DESC]
  - `page`: Must be positive integer
  - `limit`: Must be 1-50 (default 10)
- Return: `{ ideas[], total, page, pages }`
- Effort: 3-4 hours
- Checklist:
  - [ ] Endpoint accepts all 3 new params
  - [ ] Parameter validation works
  - [ ] Returns 400 for invalid params
  - [ ] Always scopes to current user's ideas (WHERE userId = req.user.id)
  - [ ] Single-select filter (not multi-select)

**Task P2.2:** Implement Filtering & Sorting Logic
- Backend file: `backend/src/services/ideaService.ts` or inline in route
- Filtering logic:
  ```typescript
  const where = { userId };
  if (status) where.status = status; // Single-select only
  ```
- Sorting logic:
  ```typescript
  const orderBy = { [sortBy]: sortOrder.toLowerCase() };
  ```
- Query:
  ```typescript
  const ideas = await prisma.idea.findMany({
    where,
    orderBy,
    skip: (page-1)*limit,
    take: limit
  });
  ```
- Effort: 2-3 hours
- Checklist:
  - [ ] Filtering returns only requested status
  - [ ] Sorting orders by correct field
  - [ ] Pagination works with filters
  - [ ] Performance acceptable (< 1 second)

**Task P2.3:** Verify/Update Database Indexes
- Schema file: `backend/prisma/schema.prisma`
- Required indexes:
  - `CREATE INDEX idx_ideas_userId_status_createdAt ON ideas(userId, status, createdAt DESC)`
  - `CREATE INDEX idx_ideas_userId_title ON ideas(userId, title ASC)`
- Checklist requirements:
  - [ ] All title fields are NOT NULL
  - [ ] Indexes created or already exist
  - [ ] Schema migration needed (if updating schema)
  - [ ] Prisma generate updated (run `prisma generate`)
- Effort: 1-2 hours

**Task P2.4:** Write Backend Unit Tests
- File: `backend/src/routes/__tests__/ideas.filter.test.ts`
- Tests:
  - GET /api/ideas without params returns all user's ideas
  - GET /api/ideas?status=SUBMITTED returns only submitted ideas
  - GET /api/ideas?sortBy=title&sortOrder=ASC returns sorted by title
  - GET /api/ideas?status=SUBMITTED&sortBy=createdAt returns filtered + sorted
  - GET /api/ideas?status=INVALID returns 400 error
  - GET /api/ideas?page=2&limit=5 returns correct page
  - Filter combination: status + sort + pagination all work together
- Coverage: ≥80%
- Effort: 3-4 hours
- Checklist:
  - [ ] All filter combinations tested
  - [ ] Invalid params rejected
  - [ ] Pagination works with filters
  - [ ] Tests pass locally

**Task P2.5:** Write Integration Tests
- File: `backend/src/integration/__tests__/filter-sort.integration.test.ts`
- Tests (with real DB):
  - Create 10 test ideas with various statuses
  - Filter by each status, verify counts
  - Sort by date + title, verify order
  - Complex: filter + sort + pagination together
- Setup/Teardown: Use test database or mocks
- Effort: 3-4 hours
- Checklist:
  - [ ] Integration tests pass
  - [ ] No test database contamination
  - [ ] Teardown cleans up test data

**Phase 2 Effort Estimate:** 13-18 hours (1.5-2 days)

---

### Phase 3: Mobile, Loading States & Quality (Day 2-3)
**Goal:** Complete all features, polish, test, and prepare for production  
**Owner:** Full Team (Frontend + QA)

#### Phase 3 Deliverables

| Deliverable | File | Status | Notes |
|-------------|------|--------|-------|
| Mobile Drawer | `src/components/FilterDrawer.tsx` | NEW | Collapsible on mobile |
| Skeleton Loader | `src/components/SkeletonLoader.tsx` | NEW/REUSE | Loading state UI |
| CSS Sticky Styles | `src/components/IdeaListFilters.module.css` | NEW | Sticky + responsive |
| E2E Tests | `cypress/e2e/idea-filtering.cy.ts` | NEW | Full user flows |
| Performance Tests | Test report | NEW | <1s filter response |

#### Phase 3 Tasks

**Task P3.1:** Implement Mobile Responsive Layout
- Components: Create FilterDrawer for mobile (<768px)
- File: `src/components/FilterDrawer.tsx`
- Behavior:
  - Desktop (≥768px): Show filters inline/sticky
  - Mobile (<768px): Hide in drawer, show "Filter" button to open
- Code:
  ```typescript
  const isMobile = useMediaQuery('(max-width: 768px)');
  return isMobile ? <FilterDrawer /> : <InlineFilters />;
  ```
- Effort: 2-3 hours
- Checklist:
  - [ ] Filter button visible on mobile
  - [ ] Clicking button opens drawer
  - [ ] Drawer closes after selecting filter
  - [ ] Filters work the same on mobile

**Task P3.2:** Add Sticky Positioning & Loading States
- CSS file: `src/components/IdeaListFilters.module.css`
- Sticky: Filter controls stick to top while scrolling
- Loading states:
  - Disable filter/sort buttons during API call
  - Show skeleton rows in table
  - Show "Filtering ideas..." text near controls
- Code:
  ```css
  .filterContainer {
    position: sticky;
    top: 0;
    z-index: 40;
    background: white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  ```
- Effort: 2-3 hours
- Checklist:
  - [ ] Filters stay visible while scrolling
  - [ ] Loading state shows skeleton loaders
  - [ ] Controls disabled during loading
  - [ ] "Filtering ideas..." text appears

**Task P3.3:** Write E2E Tests
- File: `cypress/e2e/idea-filtering.cy.ts`
- Test scenarios:
  1. User selects status filter → list updates with correct ideas
  2. User selects sort option → list reorders
  3. User applies filter + sort → both apply
  4. User clicks "Clear All" → filters/sort reset, ideas show all
  5. User bookmarks URL with filters → refresh page → filters still applied
  6. User applies filter that returns 0 results → empty state shows with CTA
  7. URL params change when filter applied → browser address bar updates
  8. Mobile: User opens filter drawer → selects filter → drawer closesUser scrolls → filter controls stay visible
- Coverage: All 11 acceptance criteria
- Effort: 4-5 hours
- Checklist:
  - [ ] All user workflows tested
  - [ ] Tests pass in Cypress UI
  - [ ] Tests pass in headless mode
  - [ ] No flaky tests

**Task P3.4:** Performance & Quality Testing
- Load test: Create 50+ mock ideas, apply filter, measure response time
- Target: <1 second response time
- Quality checks:
  - No console errors/warnings
  - No TypeScript compilation errors
  - ESLint passes
  - Prettier formatting correct
- Tools: Chrome DevTools, Cypress Performance API
- Effort: 2-3 hours
- Checklist:
  - [ ] Filter response time <1 second
  - [ ] No performance regressions
  - [ ] All linting passes
  - [ ] No type errors

**Task P3.5:** Code Review & Final Testing
- Review checklist:
  - [ ] All code follows agents.md naming conventions
  - [ ] Components use PascalCase, files use camelCase
  - [ ] All types properly defined
  - [ ] No unused imports
  - [ ] All ACs pass
  - [ ] ≥80% test coverage
  - [ ] Documentation updated (README if needed)
- Code review: 1-2 hours (another dev or tech lead)
- Final testing: 1-2 hours (QA or developer)
- Effort: 2-3 hours
- Checklist:
  - [ ] Code review approved
  - [ ] No blocking issues
  - [ ] All tests green
  - [ ] Ready to merge

**Phase 3 Effort Estimate:** 12-17 hours (2-3 days, including QA)

---

## Timeline & Milestones

### Day 1: Frontend Foundation + Backend Setup

| Time | Task | Owner | Duration | Status |
|------|------|-------|----------|--------|
| 9:00-11:30 | P1.1 + P1.2 (Components) | Frontend | 2.5h | NOT STARTED |
| 11:30-13:00 | P1.3 + P1.4 (Chips + Empty) | Frontend | 1.5h | NOT STARTED |
| 13:00-14:00 | Lunch | - | 1h | - |
| 14:00-17:00 | P1.5 + P1.6 (Dashboard + URL) | Frontend | 3h | NOT STARTED |
| 17:00-17:30 | Daily standup + Review | Team | 0.5h | - |
|  | P2.1 + P2.2 (Backend API) | Backend | 6-7h | NOT STARTED |
|  | P2.3 (Database Indexes) | Backend | 1-2h | NOT STARTED |

**Day 1 Outcomes:**
- ✅ StatusFilter component done
- ✅ SortDropdown component done
- ✅ FilterChips component done
- ✅ EmptyResultsState done
- ✅ Dashboard integrated
- ✅ URL sync working
- ✅ Backend endpoint updated
- ✅ Database schema verified

---

### Day 2: Testing + Mobile + Polish

| Time | Task | Owner | Duration | Status |
|------|------|-------|----------|--------|
| 9:00-10:30 | P1.7 (Frontend Unit Tests) | Frontend | 1.5h | NOT STARTED |
| 10:30-12:00 | P2.4 + P2.5 (Backend Tests) | Backend | 1.5h | NOT STARTED |
| 12:00-13:00 | Lunch | - | 1h | - |
| 13:00-15:00 | P3.1 (Mobile Drawer) | Frontend | 2h | NOT STARTED |
| 15:00-16:30 | P3.2 (Sticky + Loading) | Frontend | 1.5h | NOT STARTED |
| 16:30-17:00 | Integration & preliminary E2E | QA/Both | 0.5h | NOT STARTED |
| 17:00-17:30 | Daily standup | Team | 0.5h | - |

**Day 2 Morning Outcomes:**
- ✅ Frontend unit tests ≥80% coverage
- ✅ Backend unit tests passing
- ✅ Integration tests passing
- ✅ All API filter combinations tested

**Day 2 Afternoon Outcomes:**
- ✅ Mobile responsive working
- ✅ Sticky positioning done
- ✅ Loading state UX done
- ✅ Preliminary E2E tests working

---

### Day 3: E2E Testing + Quality + Merge

| Time | Task | Owner | Duration | Status |
|------|------|-------|----------|--------|
| 9:00-11:00 | P3.3 (Full E2E Tests) | QA/Frontend | 2h | NOT STARTED |
| 11:00-12:00 | P3.4 (Performance Tests) | QA/Frontend | 1h | NOT STARTED |
| 12:00-13:00 | Lunch | - | 1h | - |
| 13:00-14:30 | P3.5 (Code Review) | Tech Lead | 1.5h | NOT STARTED |
| 14:30-15:30 | Final Testing & Fixes | Full Team | 1h | NOT STARTED |
| 15:30-16:00 | Merge to main + Deploy | Backend | 0.5h | NOT STARTED |
| 16:00-17:00 | Documentation + Retro | Team | 1h | NOT STARTED |

**Day 3 Final Outcomes:**
- ✅ All 11 ACs passing
- ✅ E2E tests green
- ✅ Performance <1 second
- ✅ Code review approved
- ✅ Merged to main branch
- ✅ Status: COMPLETED

---

## Dependencies & Prerequisites

### Must Complete First
- ✅ STORY-2.1 (Idea Submission Form) - provides idea data
- ✅ STORY-2.3 (Dashboard) - provides list UI
- ✅ STORY-1.4 (RBAC) - provides auth context

### Must Be Available
- ✅ React Router v6 (for useSearchParams)
- ✅ Prisma ORM (for filtering queries)
- ✅ PostgreSQL database
- ✅ Jest + React Testing Library

### External Integrations
- None (filter is internal feature)

---

## Resource Requirements

### Team Composition
- **Frontend Developer:** 1 (main contributor for Phase 1 + Phase 3)
- **Backend Developer:** 1 (main contributor for Phase 2)
- **QA Engineer:** 1 (E2E testing, performance testing)
- **Tech Lead:** 1 (code review, architecture oversight)

### Tools & Setup Required
```bash
# Frontend
- Node.js v18+
- React 18
- React Router v6
- Tailwind CSS
- Jest
- React Testing Library

# Backend
- Node.js v18+
- Express.js
- Prisma
- PostgreSQL
- Jest

# QA
- Cypress
- Chrome DevTools
- Postman (for API testing)
```

### Estimated Total Effort
- Frontend: 15-20 hours (1-1.5 days, DAY 1 + DAY 2-3)
- Backend: 13-18 hours (1.5-2 days, DAY 1 + DAY 2)
- QA/Testing: 8-10 hours (1+ days, DAY 2-3)
- **Total:** 36-48 hours ≈ **2-3 business days**

---

## Risk Management

### Risk 1: URL Parameter Complexity
**Risk:** URL params grow too long with many filters  
**Probability:** LOW  
**Impact:** MEDIUM (can break URL sharing)  
**Mitigation:** 
- Keep params minimal (status, sortBy, sortOrder for Phase 1)
- Add localStorage in Phase 2 if needed
- Document URL size limits

### Risk 2: Database Query Performance
**Risk:** Filter queries become slow with large idea counts  
**Probability:** MEDIUM  
**Impact:** MEDIUM (affects UX)  
**Mitigation:**
- Add proper database indexes (Task P2.3)
- Test with 100+ ideas (Day 3)
- Monitor query performance in DevTools

### Risk 3: Mobile Responsive Issues
**Risk:** Filter drawer not working on all screen sizes  
**Probability:** LOW  
**Impact:** LOW (affects mobile users only)  
**Mitigation:**
- Test on actual devices (iPhone, Android)
- Use responsive media queries (Task P3.1)
- Include mobile E2E test (Task P3.3)

### Risk 4: Browser Compatibility
**Risk:** useSearchParams not supported in old browsers  
**Probability:** LOW  
**Impact:** MEDIUM (breaks feature for some users)  
**Mitigation:**
- React Router v6 handles compatibility
- Add polyfills if needed
- Document browser support (React Router docs)

---

## Acceptance & Sign-Off

### Phase 1 Acceptance Criteria
- [ ] All 4 new components created + tested
- [ ] URL synchronization working bidirectionally
- [ ] Unit tests ≥80% coverage
- [ ] No console errors
- [ ] Dashboard integrates all new components

### Phase 2 Acceptance Criteria
- [ ] GET /api/ideas endpoint accepts new params
- [ ] Parameter validation working (rejects invalid input)
- [ ] Filtering logic returns correct ideas
- [ ] Sorting logic orders correctly
- [ ] Backend tests ≥80% coverage
- [ ] Integration tests pass with real DB

### Phase 3 Acceptance Criteria
- [ ] E2E tests for all 11 ACs passing
- [ ] Mobile responsive working
- [ ] Loading states show correctly
- [ ] Performance <1 second
- [ ] Code review approved
- [ ] All 11 ACs verified passing
- [ ] Documentation updated

### Sign-Off

| Role | Name | Target Date | Status |
|------|------|-------------|--------|
| Frontend Lead | [Name] | 2026-02-26 | PENDING |
| Backend Lead | [Name] | 2026-02-26 | PENDING |
| QA Lead | [Name] | 2026-02-27 | PENDING |
| Tech Lead | [Name] | 2026-02-27 | PENDING |
| Product Owner | [Name] | 2026-02-27 | PENDING |

---

## Post-Implementation

### Metrics to Monitor
- API response time for filtered requests (target: <1s)
- Error rate for invalid filter params
- User adoption of filter/sort features
- Browser compatibility issues reported

### Phase 2 Enhancements (Sprint N+1)
1. Multi-select filters (select multiple statuses)
2. localStorage persistence
3. Additional sort fields (category, status, submitter)
4. Items-per-page selector
5. Full-text search integration

### Documentation
- Update README.md with filter/sort usage
- Add Postman API documentation for new params
- Update user guide with filter feature
- Update component documentation (Storybook if used)

---

## Links & References

| Reference | Link |
|-----------|------|
| **Story Spec** | [STORY-2.4-Sort-Filter.md](STORY-2.4-Sort-Filter.md) |
| **Decisions Doc** | [STORY-2.4-DECISIONS.md](STORY-2.4-DECISIONS.md) |
| **Epic** | [EPIC-2-Idea-Submission-Management.md](../epics/EPIC-2-Idea-Submission-Management.md) |
| **Project Conventions** | [../../agents.md](../../agents.md) |
| **Component Templates** | [components/](../../src/components/) |
| **Test Examples** | [__tests__/](../../src/__tests__/) |
| **Backend Examples** | [backend/src/routes/](../../backend/src/routes/) |

---

## Questions & Next Steps

### Before Starting
- [ ] Team assignment confirmed?
- [ ] Branching strategy defined (feature branch: `feature/story-2.4-filter-sort`)?
- [ ] Test database configured for Phase 2?
- [ ] Cypress environment ready for Phase 3?

### During Implementation
- [ ] Daily standups at 9:00 AM?
- [ ] Pair programming for complex tasks?
- [ ] Document blockers/issues in GitHub Issues?

### After Completion
- [ ] Demo to Product Owner
- [ ] Merge to main branch
- [ ] Deploy to staging
- [ ] Manual QA on staging
- [ ] Deploy to production

---

**Document Owner:** Development Team  
**Last Updated:** February 25, 2026  
**Version:** 1.0 (Ready for Implementation)
