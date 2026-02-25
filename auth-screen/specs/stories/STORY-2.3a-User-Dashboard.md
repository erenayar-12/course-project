# STORY-2.3a: Create "My Ideas" User Dashboard with Pagination

## Story ID & Title
**Story ID:** STORY-2.3a  
**Title:** Create "My Ideas" Dashboard - User Idea List with Pagination & Status Tracking  
**Epic:** EPIC-2 (Idea Submission Management)  
**Sprint/Milestone:** Sprint 2  
**Status:** APPROVED  
**Priority:** P2 (High)  
**Created:** February 25, 2026  
**Split From:** STORY-2.3 (Option B - Phase 1)

---

## User Story

**As a** submitter/user  
**I want** to view all my submitted ideas in a centralized "My Ideas" dashboard  
**so that** I can track the status of my ideas and manage them in one place

### Story Context
Users need visibility into all their submitted ideas after submission. The dashboard displays each user's ideas with status, category, and submission timeline. This serves as the primary hub for idea management and enables users to quickly navigate to individual idea details.

---

## Acceptance Criteria

### AC 1: Dashboard Displays Authenticated User's Ideas
- **Given** user is logged in and navigates to /dashboard
- **When** dashboard loads
- **Then** all ideas submitted by current user are displayed in a paginated list
- **And** loading spinner appears while fetching data

### AC 2: Each List Item Shows Required Information
- **Given** dashboard displays ideas
- **When** user views any idea in the list
- **Then** the item displays: Title, Status (badge), Category, Submission Date, and Attachment count

### AC 3: Empty State with Call-to-Action
- **Given** user has submitted no ideas
- **When** dashboard loads
- **Then** empty state message is displayed: "No ideas submitted yet"
- **And** button shows "Submit Your First Idea"

### AC 4: Status Badges are Color-Coded
- **Given** dashboard displays ideas with different statuses
- **When** user views status badges
- **Then** statuses are color-coded:
  - Yellow: DRAFT
  - Blue: SUBMITTED  
  - Orange: UNDER_REVIEW
  - Green: APPROVED
  - Red: REJECTED

### AC 5: Pagination Controls Enable Navigation
- **Given** user has more than 10 ideas
- **When** dashboard displays pagination controls
- **Then** pagination shows current page, total pages, and buttons to navigate
- **And** each page displays exactly 10 ideas (except last page)

### AC 6: Statistics Display Idea Status Breakdown
- **Given** dashboard loads
- **When** user views the statistics section
- **Then** a summary is displayed showing: Total Ideas, and counts for each status
- **And** counts update in real-time with list

### AC 7: Click Row Navigates to Idea Detail Page
- **Given** user views the ideas list
- **When** user clicks on any idea row
- **Then** user is navigated to the idea detail page for that idea

### AC 8: Loading State During Data Fetch
- **Given** dashboard is loading data from API
- **When** user views the dashboard
- **Then** a loading spinner or skeleton loader is displayed

### AC 9: Error State with Retry on API Failure
- **Given** API request fails to fetch ideas
- **When** dashboard attempts to load
- **Then** error message is displayed: "Failed to load ideas. Please try again."
- **And** a "Retry" button allows user to reattempt the request

### AC 10: Dashboard is Responsive Across Devices
- **Given** user accesses dashboard on mobile, tablet, or desktop
- **When** dashboard renders
- **Then** layout adapts appropriately for each screen size
- **And** all functionality remains accessible and usable

### AC 11: Dashboard Accessible Only to Authenticated Users
- **Given** unauthenticated user attempts to access /dashboard
- **When** page loads
- **Then** user is redirected to login page

---

## Definition of Acceptance

All acceptance criteria must pass automated tests and user/QA sign-off:

- [ ] All 11 acceptance criteria verified and passing
- [ ] Code changes reviewed and approved
- [ ] Unit tests written (>80% coverage)
- [ ] Integration tests passing
- [ ] E2E tests covering main user flows
- [ ] No console errors or warnings
- [ ] Responsive design verified on mobile/tablet/desktop
- [ ] Performance verified (loads <3 seconds with 100 ideas)
- [ ] API pagination tested with edge cases (empty, first page, last page)
- [ ] Documentation updated (if needed)
- [ ] Merged to main branch

---

## Implementation Details

### Frontend (React/TypeScript)

**New Components:**
- `src/pages/Dashboard.tsx` - Main dashboard page component (router)
- `src/pages/UserDashboard.tsx` - User "My Ideas" view
- `src/components/IdeaListItem.tsx` - Individual idea row in list
- `src/components/IdeaStatsBar.tsx` - Statistics summary bar
- `src/components/StatusBadge.tsx` - Reusable status badge (color-coded)
- `src/types/ideaTypes.ts` - TypeScript interfaces for ideas

**Implementation Tasks:**
- [ ] Create Dashboard router component that checks user authentication
- [ ] Implement UserDashboard page with loading/error/empty states
- [ ] Implement IdeaListItem component with status badge styling
- [ ] Create IdeaStatsBar component showing status breakdown
- [ ] Create reusable StatusBadge component with color mapping
- [ ] Implement pagination logic with page state management
- [ ] Integrate with backend API (`GET /api/ideas?limit=10&offset=0`)
- [ ] Add navigation to detail page on row click
- [ ] Implement responsive design (mobile/tablet/desktop)
- [ ] Add skeleton loader for loading state
- [ ] Add error handling with retry button
- [ ] Add empty state with CTA button

### Backend (Node.js/Express)

**Used from STORY-2.2:**
- Endpoint: `GET /api/ideas` (already exists from STORY-2.2)
- Query params: `limit` (default 10), `offset` (default 0)
- Response includes pagination metadata + statistics
- Authorization required (JWT from Auth0)

**No new backend endpoints required for this story.**

### Database

**No changes needed:** Uses existing schema from STORY-2.2

**Optimization (verify exists):**
- Index on `(userId, createdAt DESC)` for efficient filtering and sorting
- Use LIMIT/OFFSET for pagination

---

## Technical Notes

### Technology Stack
- **Frontend:** React 18, TypeScript, Tailwind CSS, React Query (for data fetching)
- **API:** RESTful (Endpoint: GET /api/ideas - already exists)
- **Authentication:** Auth0 JWT via ProtectedRoute (STORY-1.2)

### Files/Components Affected
- New: `src/pages/Dashboard.tsx` (router)
- New: `src/pages/UserDashboard.tsx` (user view)
- New: `src/components/IdeaListItem.tsx` (list row)
- New: `src/components/IdeaStatsBar.tsx` (statistics)
- New: `src/components/StatusBadge.tsx` (reusable badge)
- New: `src/types/ideaTypes.ts` (add if missing)
- Modified: `src/App.tsx` (add /dashboard route)

### Implementation Hints
- Use React Query for efficient API state management
- Implement skeleton loaders (Tailwind CSS or shadcn/ui Skeleton component)
- Create reusable StatusBadge component (will be used in STORY-2.3b)
- Use Prisma aggregation stats from existing API response
- Consider infinite scroll as alternative to pagination (Phase 2)
- Cache statistics for 5 minutes if performance needed

### Known Limitations or Considerations
- Initial version supports only user's own ideas (pagination, no global view)
- No real-time updates (status changes require page refresh)
- Statistics are computed per request (not cached)
- Archive functionality excluded (future enhancement)
- No filtering/sorting (deferred to STORY-2.4)

---

## Estimation & Effort

**Story Points:** 5  
**OR Estimated Days:** 2-3 days

**Estimation Rationale:**  
Medium complexity story involving frontend component creation, pagination logic, API integration, and testing. Assumes backend `/api/ideas` endpoint exists from STORY-2.2. Main effort: implementing dashboard UI, pagination, statistics aggregation, and comprehensive testing across devices.

**Risk Level:** LOW  
**Risk Reason:** Well-defined requirements, clear AC, uses existing API endpoint from STORY-2.2. No external dependencies or new backend work required.

---

## Dependencies & Blockers

### Story Dependencies
- ✅ **STORY-2.1** (Submission Form) - Provides user data
- ✅ **STORY-2.2** (File Upload) - Backend API endpoint `/api/ideas` must exist
- ✅ **STORY-1.2** (Auth0 Integration) - Authentication/authorization middleware
- ✅ **STORY-1.4** (RBAC) - For ProtectedRoute component (can use existing component)

### Blockers
- None. Can begin implementation immediately.

---

## INVEST Validation Checklist

- [x] **Independent** - Can be developed independently; no dependency on STORY-2.3b or other concurrent stories
- [x] **Negotiable** - Pagination strategy, statistics UI can be refined
- [x] **Valuable** - Delivers clear value for users to track their ideas
- [x] **Estimable** - Well-understood requirements, team can estimate effort accurately
- [x] **Small** - Can be completed in one sprint (2-3 days)
- [x] **Testable** - Clear AC with verifiable outcomes; can write automated tests

---

## Acceptance Sign-Off

| Role | Name | Date | Notes |
|------|------|------|-------|
| Product Owner | [PENDING] | [TBD] | User dashboard verified |
| Tech Lead | [PENDING] | [TBD] | Architecture reviewed, performance acceptable |
| QA Lead | [PENDING] | [TBD] | Test coverage, responsive design verified |

---

## Related Information

**Related User Stories:**
- [STORY-2.1: Submission Form](STORY-2.1-Submission-Form.md) - Prerequisite data source
- [STORY-2.2: File Upload](STORY-2.2-File-Upload.md) - API endpoint source
- [STORY-2.3b: Evaluator Queue](STORY-2.3b-Evaluator-Queue.md) - Parallel/next story (uses same components)
- [STORY-2.4: Sort & Filter](STORY-2.4-Sort-Filter.md) - Enhancement to dashboard (future)
- [STORY-2.5: Detail Page](STORY-2.5-Detail-Page.md) - Destination on row click (future)

**Epic:**
- [EPIC-2: Idea Submission Management](../epics/EPIC-2-Idea-Submission-Management.md)

**Related Branches:**
- Backend API: `feat/story-2.2-file-upload` (GET /api/ideas endpoint available)
- Frontend: `feat/story-2.3a-user-dashboard` (this story)
