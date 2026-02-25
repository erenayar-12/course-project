# Implementation Plan: STORY-2.3a - User Dashboard (Test Implementation + Components)

**Document ID:** STORY-2.3a-IMPL-PLAN  
**Date Created:** February 25, 2026  
**Status:** READY FOR IMPLEMENTATION  
**Reference Spec:** [specs/stories/STORY-2.3a-User-Dashboard.md](specs/stories/STORY-2.3a-User-Dashboard.md)  
**Convention:** Per `agents.md` sections 2-4  
**Epic:** EPIC-2 (Idea Submission Management)  
**Story Points:** 5  
**Estimated Time:** 2-3 days

---

## 1. Executive Summary

Implement "My Ideas" dashboard for authenticated users showing their submitted ideas with pagination, statistics, and status tracking. Complete component implementation following TDD principles using 51 pre-written tests (31 unit, 14 integration, 6 E2E).

**What's Done:**
- ✅ 51 comprehensive tests created (testing pyramid: 70/20/10)
- ✅ Component stubs created (StatusBadge, IdeaListItem, IdeaStatsBar, UserDashboard utilities)
- ✅ Specification fully clarified (sort order, percentage display, linking)

**What's Needed:**
- [ ] Implement component logic to pass tests
- [ ] Hook up backend API integration
- [ ] Verify responsive design (mobile/tablet/desktop)
- [ ] Execute full test suite (target: 51/51 passing)

---

## 2. Acceptance Criteria Implementation Roadmap

### AC 1: Dashboard Displays User's Ideas

**Status:** Component stub exists - Need implementation

**Task Breakdown:**
- [ ] `src/pages/UserDashboard.tsx` - Main container component
  - [ ] Load user context to get userId from Auth0
  - [ ] Initialize state: `ideas: Idea[]`, `currentPage: number = 1`, `loading: boolean`, `error: string | null`
  - [ ] Call `ideasService.getUserIdeas(userId, { limit: 10, offset: (currentPage - 1) * 10 })`
  - [ ] Handle loading state with skeleton loaders
  - [ ] Handle error state with retry button
  - [ ] Pass ideas array to IdeaListItem components in loop
- [ ] Test: Call backend endpoint `GET /api/ideas?limit=10&offset=0`
- [ ] Test: Display results when data loads
- [ ] Test: Show loading spinner while fetching
- [ ] Test: Show error message on API failure

**Testing Tasks (Tests Already Written - Just Implement):**
- ✅ Unit test: `getUserIdeas()` service call [paginationUtils.test.ts]
- ✅ Integration test: `UserDashboard.integration.test.tsx` - AC1-10 main flows
- ✅ E2E test: `dashboard-load.cy.ts` - Auth redirect + dashboard load

---

### AC 2: List Item Display (Title, Status, Category, Date, Attachments)

**Status:** Component stub exists - Need implementation

**Task Breakdown:**
- [ ] `src/components/IdeaListItem.tsx` - Single idea row component
  - [ ] Props: `idea: Idea`, `onRowClick?: (ideaId: string) => void`
  - [ ] Render: Title (text, truncate if >50 chars)
  - [ ] Render: Status badge (use StatusBadge component)
  - [ ] Render: Category (PRODUCT, SERVICE, PROCESS, OTHER)
  - [ ] Render: Date (format as "Feb 25, 2026" - use date-fns)
  - [ ] Render: Attachment count icon + count (e.g., "📎 2 files")
  - [ ] Add click handler → navigate to `/ideas/:ideaId`
  - [ ] Responsive: Stack on mobile <640px, table row on desktop
- [ ] Test: Render all fields
- [ ] Test: Click handler calls onRowClick
- [ ] Test: Truncate long titles
- [ ] Test: Handle 0, 1, 5+ attachments

**Testing Tasks (Tests Already Written):**
- ✅ Unit test: `IdeaListItem.test.tsx` (8 tests) - All fields, click handlers, truncation
- ✅ Integration test: `UserDashboard.integration.test.tsx` - AC2-3 list rendering

---

### AC 3: Empty State (No Ideas)

**Status:** Design defined - Need implementation

**Task Breakdown:**
- [ ] `src/components/EmptyStateCard.tsx` - Reusable empty state component OR inline in UserDashboard
  - [ ] Show message: "You haven't submitted any ideas yet"
  - [ ] Show CTA button: "Submit Your First Idea" → Navigate to `/submit-idea`
  - [ ] Icon: Lightbulb or document icon
  - [ ] Responsive design: centered on all breakpoints
- [ ] UserDashboard: Render empty state when `ideas.length === 0`
- [ ] Test: Show empty state only when 0 ideas
- [ ] Test: Hide list and pagination when empty
- [ ] Test: CTA button navigates to submission form

**Testing Tasks (Tests Already Written):**
- ✅ Integration test: `UserDashboard.integration.test.tsx` - AC3 empty state flow

---

### AC 4: Status Badge Color-Coding

**Status:** Component stub exists - Need implementation

**Task Breakdown:**
- [ ] `src/components/StatusBadge.tsx` - Reusable status badge component
  - [ ] Props: `status: IdeaStatus`, `variant?: 'badge' | 'bar'` (optional)
  - [ ] Color mapping (Tailwind CSS):
    - DRAFT → bg-gray-200 text-gray-800 (yellow/grey)
    - SUBMITTED → bg-blue-200 text-blue-800 (blue)
    - UNDER_REVIEW → bg-yellow-200 text-yellow-800 (yellow)
    - ACCEPTED → bg-green-200 text-green-800 (green)
    - REJECTED → bg-red-200 text-red-800 (red)
  - [ ] Render as badge (rounded pill)
  - [ ] Reusable across UserDashboard + EvaluationQueue (STORY-2.3b)
- [ ] Test: All 5 statuses render correct colors
- [ ] Test: Accessibility (ARIA labels)

**Testing Tasks (Tests Already Written):**
- ✅ Unit test: `StatusBadge.test.tsx` (5 tests) - All status colors

---

### AC 5: Pagination (Previous/Page/Next)

**Status:** Component stub exists - Need implementation

**Task Breakdown:**
- [ ] `src/utils/paginationUtils.ts` - Utility functions (may already exist)
  - [ ] `calculatePages(total: number, limit: number): number`
  - [ ] `calculateOffset(page: number, limit: number): number`
  - [ ] `getPaginationRange(currentPage: number, totalPages: number): (number | string)[]`
- [ ] Pagination UI Component:
  - [ ] Display "Page X of Y" text
  - [ ] Previous button (disabled on page 1)
  - [ ] Next button (disabled on last page)
  - [ ] Optional: Page number clickable links
  - [ ] Default page size: 10 items per page (configurable)
- [ ] UserDashboard: 
  - [ ] Track `currentPage` state
  - [ ] Update offset in API call: `offset = (page - 1) * 10`
  - [ ] Call pagination utility to calculate total pages
  - [ ] Re-fetch data when page changes
- [ ] Test: Calculate correct offset for each page
- [ ] Test: Previous/Next buttons disabled appropriately
- [ ] Test: Fetch correct page data from API

**Testing Tasks (Tests Already Written):**
- ✅ Unit test: `paginationUtils.test.ts` (4 tests) - Offset calculation, page ranges
- ✅ E2E test: `dashboard-pagination.cy.ts` (1 test) - Page navigation flow

---

### AC 6: Statistics Display (Total, DRAFT, SUBMITTED, UNDER_REVIEW, ACCEPTED, REJECTED + Percentages)

**Status:** Component stub exists - Need implementation

**Task Breakdown:**
- [ ] `src/utils/statisticsCalculator.ts` - Utility functions
  - [ ] `aggregateStatuses(ideas: Idea[]): IdeaStatusCounts`
    - Returns: `{ total: number, draft: number, submitted: number, underReview: number, accepted: number, rejected: number }`
  - [ ] `calculatePercentage(count: number, total: number): number`
    - Returns: percentage 0-100
  - [ ] `formatStatLine(label: string, count: number, percentage: number): string`
    - Returns: "Draft: 3 (30%)"
- [ ] `src/components/IdeaStatsBar.tsx` - Statistics display component
  - [ ] Props: `ideas: Idea[]`
  - [ ] Display statistics in a card/section at top of dashboard
  - [ ] Show both counts AND percentages (e.g., "3 Approved (30%)")
  - [ ] Responsive: single row on desktop, stacked on mobile
  - [ ] Color-coded stat bars (match status badge colors)
- [ ] UserDashboard: Render IdeaStatsBar component above idea list
- [ ] Test: Calculate correct counts for each status
- [ ] Test: Calculate correct percentages
- [ ] Test: Handle edge cases (0 ideas, all same status, multiple statuses)

**Testing Tasks (Tests Already Written):**
- ✅ Unit test: `statisticsCalculator.test.ts` (8 tests) - Count aggregation, percentage calculation
- ✅ Unit test: `IdeaStatsBar.test.tsx` (6 tests) - Stat display formatting

---

### AC 7: Idea Detail Link (AC7 - Navigate to /ideas/:ideaId)

**Status:** Design defined - Destination in STORY-2.5

**Task Breakdown:**
- [ ] IdeaListItem: Add click handler → Navigate to `/ideas/:ideaId`
- [ ] UserDashboard: Pass `onRowClick` prop to IdeaListItem
- [ ] Router: Ensure `/ideas/:ideaId` route exists (may be placeholder for STORY-2.5)
- [ ] Test: Click on idea row navigates to correct URL
- [ ] Test: STORY-2.5 will implement actual detail page content

**Testing Tasks (Tests Already Written):**
- ✅ Integration test: AC7 link navigation behavior

---

### AC 8: Responsive Design (Mobile/Tablet/Desktop)

**Status:** Design specified - Need implementation verification

**Task Breakdown:**
- [ ] Mobile <640px:
  - [ ] Stack stats bar vertically
  - [ ] IdeaListItem: Show title + status only, swipe for more details
  - [ ] Pagination: Number buttons removed, just Prev/Next
  - [ ] Touch-friendly button sizes (44px minimum)
- [ ] Tablet 640px-1024px:
  - [ ] Stats in 2 columns
  - [ ] Idea table with medium spacing
  - [ ] Full pagination visible
- [ ] Desktop >1024px:
  - [ ] Stats in single row
  - [ ] Full table with all columns
  - [ ] Pagination with page numbers
- [ ] Test: Responsive breakpoints (mobile/tablet/desktop)
- [ ] Test: No horizontal scroll on mobile

**Testing Tasks (Tests Already Written):**
- ✅ E2E test: `dashboard-responsive.cy.ts` (3 tests) - Mobile/Tablet/Desktop viewport tests

---

### AC 9: Loading State

**Status:** Design specified - Need implementation

**Task Breakdown:**
- [ ] Show skeleton/spinner while loading
- [ ] Skeleton matches dashboard layout (stat cards, list items)
- [ ] Loading state: `loading: boolean` in component
- [ ] Disable pagination during load
- [ ] Show success message after load completes
- [ ] Test: Show spinner while data loads
- [ ] Test: Hide spinner on success
- [ ] Test: Hide spinner on error

**Testing Tasks (Tests Already Written):**
- ✅ Integration test: AC9 loading state flow

---

### AC 10: Error Handling (Show error message + Retry button)

**Status:** Design specified - Need implementation

**Task Breakdown:**
- [ ] Catch API errors: network failure, 404, 500, etc.
- [ ] Display error message: "Failed to load ideas. Please try again."
- [ ] Show Retry button that re-fetches data
- [ ] Clear error on successful retry
- [ ] Log error for debugging
- [ ] Test: Show error on API failure
- [ ] Test: Retry button re-fetches data
- [ ] Test: Clear error on success

**Testing Tasks (Tests Already Written):**
- ✅ Integration test: AC10 error handling flow

---

### AC 11: Authentication Gate (Redirect to /login if not authenticated)

**Status:** ProtectedRoute component exists - Need verification

**Task Breakdown:**
- [ ] Wrap UserDashboard route with ProtectedRoute component
- [ ] Verify unauthenticated users redirect to /login
- [ ] Show loading indicator while checking auth
- [ ] Test: Unauthenticated user redirected to login
- [ ] Test: Authenticated user can access dashboard

**Testing Tasks (Tests Already Written):**
- ✅ Integration test: `Dashboard.integration.test.tsx` - AC11 auth redirect

---

## 3. Component Architecture

```
src/pages/
  └── UserDashboard.tsx (51 lines)
      ├── State: ideas[], currentPage, loading, error
      ├── Effects: useEffect(() => { fetch ideas })
      └── Render:
          └── ProtectedRoute check
          └── IdeaStatsBar (AC6)
          └── Search/Filter bar (optional, placeholder)
          ├── IdeaListItem[] (AC2, AC4, AC7)
          ├── EmptyState (AC3)
          └── Pagination (AC5)

src/components/
  ├── StatusBadge.tsx (AC4)
  │   └── Props: status → Renders colored badge with text
  │
  ├── IdeaListItem.tsx (AC2, AC7)
  │   └── Props: idea, onRowClick → Renders single row + click handler
  │
  ├── IdeaStatsBar.tsx (AC6)
  │   └── Props: ideas → Renders statistics with percentages
  │
  └── EmptyStateCard.tsx (AC3, optional)
      └── Props: none → Renders empty state with CTA

src/utils/
  ├── paginationUtils.ts (AC5)
  │   ├── calculatePages(total, limit)
  │   ├── calculateOffset(page, limit)
  │   └── getPaginationRange(currentPage, totalPages)
  │
  └── statisticsCalculator.ts (AC6)
      ├── aggregateStatuses(ideas)
      ├── calculatePercentage(count, total)
      └── formatStatLine(label, count, percentage)

src/services/
  └── ideas.service.ts (existing)
      └── getUserIdeas(userId, { limit, offset })
```

---

## 4. API Integration Points

### Backend Endpoints Used

1. **GET /api/ideas** - Fetch user's ideas
   - Query: `?limit=10&offset=0`
   - Response: `{ ideas: [], pagination: { total, page, pages }, lastFetched }`
   - Used in: UserDashboard (AC1)

2. **Authentication** - JWT in Authorization header
   - Header: `Authorization: Bearer <token>`
   - Used in: All requests (AC11)

### Service Layer (Existing)

```typescript
// src/services/ideas.service.ts
export async function getUserIdeas(
  userId: string, 
  params: { limit: number; offset: number }
): Promise<IdeasResponse>

// Should return type:
interface IdeasResponse {
  ideas: Idea[];
  pagination: { total: number; page: number; pages: number };
  lastFetched: string;
}

interface Idea {
  id: string;
  title: string;
  description: string;
  category: IdeaCategory;
  status: IdeaStatus;
  userId: string;
  createdAt: string;
  attachments?: Attachment[];
}
```

---

## 5. Test Execution Plan

### Run All Tests

```bash
# Frontend tests (STORY-2.3a)
npm test -- --testPathPattern="2.3a|UserDashboard|StatusBadge|IdeaListItem|IdeaStatsBar|pagination|statistics"

# E2E tests (Cypress)
npm run test:e2e -- --spec="cypress/e2e/dashboard-*.cy.ts"

# Full test suite
npm test
```

### Expected Results

- **Unit Tests:** 31/31 passing
  - `StatusBadge.test.tsx` - 5 tests ✅
  - `IdeaListItem.test.tsx` - 8 tests ✅
  - `IdeaStatsBar.test.tsx` - 6 tests ✅
  - `paginationUtils.test.ts` - 4 tests ✅
  - `statisticsCalculator.test.ts` - 8 tests ✅

- **Integration Tests:** 14/14 passing
  - `Dashboard.integration.test.tsx` - 7 tests (AC11 auth flows) ✅
  - `UserDashboard.integration.test.tsx` - 7 tests (AC1-10 main flows) ✅

- **E2E Tests:** 6/6 passing
  - `dashboard-load.cy.ts` - 2 tests ✅
  - `dashboard-pagination.cy.ts` - 1 test ✅
  - `dashboard-responsive.cy.ts` - 3 tests ✅

**Total:** 51/51 tests passing

---

## 6. Implementation Timeline

| Phase | Tasks | Days | Completion |
|-------|-------|------|------------|
| **Setup** | Verify component stubs, install depenencies | 0.5 | Day 1 AM |
| **Core Components** | Implement UserDashboard, StatusBadge, IdeaListItem | 1 | Day 1 PM |
| **Stats & Utils** | Implement IdeaStatsBar, pagination/stats utilities | 0.5 | Day 2 AM |
| **API Integration** | Hook up getUserIdeas service, error handling | 0.5 | Day 2 AM |
| **Responsive & Polish** | Mobile/tablet/desktop styling, empty state | 0.5 | Day 2 PM |
| **Test Execution** | Run all 51 tests, fix failing tests | 1 | Day 2-3 |
| **Final Review** | Code review, merge to main | 0.5 | Day 3 |

**Total:** 2-3 days (5 story points)

---

## 7. Dependencies & Blockers

### Must Be Complete
- ✅ STORY-2.1 (Submission Form) - Provides idea data
- ✅ STORY-1.2 (Auth0 Integration) - User authentication
- ✅ STORY-2.2 (File Upload) - Attachment support

### Optional Enhancements (Post-MVP)
- [ ] STORY-2.4 (Sort & Filter) - Additional sorting options
- [ ] STORY-2.5 (Detail Page) - Destination for idea link

### Known Issues
- None identified

---

## 8. Definition of Done

- [x] All 51 tests created (DONE in previous phase)
- [ ] All tests passing (51/51)
- [ ] Components implemented per spec
- [ ] API integration working
- [ ] Responsive design verified on mobile/tablet/desktop
- [ ] Error handling implemented
- [ ] Loading states working
- [ ] Code reviewed and approved
- [ ] Merged to main branch
- [ ] No console errors or warnings
- [ ] Accessibility verified (ARIA labels, semantic HTML)

---

## 9. Notes

- **TDD Approach:** Tests are written first (inverse TDD). Implement components to pass tests.
- **Component Reusability:** StatusBadge will be reused in STORY-2.3b (Evaluator Queue)
- **Styling:** Use Tailwind CSS consistent with STORY-2.1 and agents.md
- **Date Formatting:** Use date-fns library (already in dependencies)
- **Performance:** Pagination limits to 10 items/page to prevent slow renders
- **Accessibility:** Include ARIA labels and semantic HTML for screen readers

---

## 10. Success Criteria

✅ All 51 tests passing  
✅ Dashboard displays user's ideas with all required columns  
✅ Statistics show counts and percentages  
✅ Pagination works for 10+ ideas  
✅ Responsive design verified  
✅ Error handling and retry working  
✅ Code coverage >80%  
✅ Ready for STORY-2.3b (Evaluator Queue) implementation
