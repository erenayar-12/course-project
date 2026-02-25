# STORY-2.4: Add Sorting and Filtering to Idea List

**Story ID:** STORY-2.4  
**Epic:** EPIC-2 (Idea Submission & Management System)  
**Created:** February 25, 2026  
**Priority:** P1 (High Priority)  
**Estimated Size:** M (Medium - 5 story points)  
**Owner:** [Development Team]  
**Status:** APPROVED

---

## User Story

**As a** Priya (Idea Submitter)  
**I want** to sort and filter my ideas list by status, date, and title  
**So that** I can quickly find specific ideas and organize them by criteria important to me

### Story Context
Users need the ability to organize their submitted ideas across multiple dimensions. As idea submissions accumulate over time, the dashboard can become difficult to navigate. Sorting and filtering are critical features that improve the user experience by allowing submitters to focus on relevant ideas (e.g., find all "Under Review" ideas, or display newest ideas first).

---

## Acceptance Criteria

### AC 1: Filter Controls Available
- **Given** The user is viewing the "My Ideas" dashboard with 5+ ideas
- **When** The user looks at the dashboard interface
- **Then** A filter control is visible with options: All, Submitted, Under Review, Needs Revision, Approved, Rejected

### AC 2: Sort Dropdown Available  
- **Given** The user is viewing the "My Ideas" dashboard
- **When** The user looks for sorting options
- **Then** A sort dropdown is visible with options:
  - Date Created (Newest First) - DEFAULT
  - Date Created (Oldest First)
  - Title (A-Z)
  - Title (Z-A)

### AC 3: Filter Functionality Works
- **Given** The user is viewing 10 ideas with mixed statuses
- **When** The user selects "Under Review" from the filter control
- **Then** Only ideas with "Under Review" status are displayed; other ideas are hidden
- **And** The URL is updated with query parameter: `?status=UNDER_REVIEW`

### AC 4: Sort Functionality Works
- **Given** The user is viewing 10 ideas
- **When** The user selects "Title (A-Z)" from the sort dropdown
- **Then** The list re-orders alphabetically by idea title
- **And** The URL is updated with query parameters: `?sortBy=title&sortOrder=ASC`

### AC 5: Filter + Sort Combination Works
- **Given** The user has "Under Review" filter active and "Date (Newest First)" sort active
- **When** The user changes the sort to "Title (A-Z)"
- **Then** The list remains filtered to "Under Review" ideas AND sorts by title alphabetically
- **And** The URL reflects both: `?status=UNDER_REVIEW&sortBy=title&sortOrder=ASC`

### AC 6: Active Filters Display as Chips
- **Given** The user has applied filters (e.g., "Submitted" and sort "Newest First")
- **When** The user views the dashboard
- **Then** Applied filters are displayed as removable chips above the list
- **And** Each chip has an "X" button to remove that filter individually

### AC 7: Clear All Filters Button
- **Given** The user has 3+ active filters applied
- **When** The user clicks "Clear All Filters" button
- **Then** All filters are reset to defaults
- **And** The URL query parameters are cleared
- **And** All ideas are displayed in default sort order (Newest First)

### AC 8: Pagination Resets on Filter Change
- **Given** The user is on page 3 of filtered results
- **When** The user changes the filter or sort
- **Then** The pagination resets to page 1
- **And** The list updates without page reload

### AC 9: URL Parameter Preservation
- **Given** The user has filtered "Submitted" and sorted "Title A-Z"
- **When** The user bookmarks the URL or shares it with another user
- **Then** The URL contains query parameters: `?status=SUBMITTED&sortBy=title&sortOrder=ASC`
- **And** When the URL is visited, the filters and sorts are automatically applied

### AC 10: Performance Requirement
- **Given** The dashboard loads 50+ ideas
- **When** The user applies a filter or sort
- **Then** The list updates within 1 second
- **And** No loading spinner exceeds 1 second on reasonable network (100 Mbps+)

---

## Definition of Acceptance

All acceptance criteria must pass:

- [ ] Acceptance criteria AC1-AC10 verified and passing
- [ ] Code review completed and approved by tech lead
- [ ] Unit tests passing (≥80% coverage for filter/sort logic)
- [ ] Integration tests passing (API + frontend)
- [ ] E2E tests passing (Cypress or Playwright)
- [ ] No new linting errors or warnings
- [ ] Performance testing confirms <1 second filter/sort response
- [ ] Documentation updated (README or setup guide if needed)
- [ ] Merged to main branch

---

## Technical Implementation Details

### Frontend (React/TypeScript)

**Components to Create/Modify:**
- `src/components/IdeaListFilters.tsx` - NEW: Filter control component
- `src/components/IdeaSortDropdown.tsx` - NEW: Sort control component
- `src/components/ActiveFilterChips.tsx` - NEW: Display applied filters
- `src/pages/MyIdeasDashboard.tsx` - MODIFY: Integrate filters/sort

**State Management:**
```typescript
// State in MyIdeasDashboard component
const [statusFilter, setStatusFilter] = useState<IdeaStatus | 'ALL'>('ALL');
const [sortBy, setSortBy] = useState<'createdAt' | 'title'>('createdAt');
const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');
const [page, setPage] = useState(1);
const [limit, setLimit] = useState(10);
```

**URL Synchronization:**
- Use `useSearchParams` (React Router v6) to sync state with URL
- When filters change → update URL
- On component mount → parse URL params and apply filters
- Example: `/my-ideas?status=SUBMITTED&sortBy=title&sortOrder=ASC&page=1`

**API Integration:**
```typescript
// Call updated GET /api/ideas endpoint
const response = await axios.get('/api/ideas', {
  params: {
    page,
    limit,
    status: statusFilter !== 'ALL' ? statusFilter : undefined,
    sortBy,
    sortOrder
  }
});
```

### Backend (Node.js/Express)

**Endpoint Update:**
- **Route:** `GET /api/ideas`
- **Existing Parameters:** `page`, `limit`
- **New Query Parameters:**
  - `status` - Filter by idea status (optional)
  - `sortBy` - Sort field: "createdAt" | "title" (optional, default: "createdAt")
  - `sortOrder` - Sort direction: "ASC" | "DESC" (optional, default: "DESC")

**Implementation:**
```typescript
// Example backend endpoint
app.get('/api/ideas', authenticateJWT, async (req, res) => {
  const { page = 1, limit = 10, status, sortBy = 'createdAt', sortOrder = 'DESC' } = req.query;
  
  // Build Prisma query
  const where: any = { userId: req.user.id };
  if (status && status !== 'ALL') {
    where.status = status;
  }
  
  // Build order by
  const orderBy: any = {};
  orderBy[sortBy] = sortOrder.toLowerCase();
  
  // Fetch ideas
  const ideas = await prisma.idea.findMany({
    where,
    orderBy,
    skip: (page - 1) * limit,
    take: limit,
  });
  
  // Return paginated results
  res.json({ ideas, total: await prisma.idea.count({ where }) });
});
```

**Database Indexes Required:**
- `INDEX ON ideas(userId, status, createdAt)` - for filtered, sorted queries
- Already present if STORY-2.1 properly created schema

### Testing

**Unit Tests (Frontend):**
- Test filter state changes
- Test sort state changes
- Test URL parameter parsing on mount
- Test filter + sort combinations

**Unit Tests (Backend):**
- Test query parameter validation
- Test filtering logic (status = 'SUBMITTED' returns only submitted ideas)
- Test sorting logic (orderBy works correctly)
- Test combined filter + sort queries

**Integration Tests:**
- API endpoint with various filter/sort combinations
- Verify response includes correct ideas in correct order
- Verify pagination works with filters

**E2E Tests (Cypress):**
- User selects filter → list updates
- User selects sort → list re-orders
- User applies filter + sort → both work together
- User clears filters → all ideas return
- User bookmarks filtered URL → filters apply on page load

**Performance Test:**
- Load 100+ ideas
- Apply filter → measure response time (target: <1 second)
- Apply sort → measure response time (target: <1 second)

---

## Technology Stack

- **Frontend:** React 18, TypeScript, React Router v6 (useSearchParams hook)
- **Backend:** Node.js, Express.js, Prisma ORM
- **Database:** PostgreSQL
- **Testing:** Jest (backend unit), React Testing Library (frontend unit), Cypress (E2E)

---

## Files & Components Affected

### Frontend
- `src/pages/my-ideas/MyIdeasDashboard.tsx` - Add filter/sort state and handlers
- `src/components/IdeaListFilters.tsx` - NEW
- `src/components/IdeaSortDropdown.tsx` - NEW
- `src/components/ActiveFilterChips.tsx` - NEW
- `src/services/ideaService.ts` - MODIFY: Add filter/sort params to API call
- `src/types/ideaTypes.ts` - Ensure IdeaStatus enum includes all statuses

### Backend
- `backend/src/routes/ideas.ts` - UPDATE: GET /api/ideas endpoint
- `backend/src/services/ideaService.ts` - MODIFY: Add filtering/sorting logic
- `backend/prisma/schema.prisma` - VERIFY: Indexes exist

### Tests
- `src/pages/__tests__/MyIdeasDashboard.test.tsx` - Update or create
- `src/components/__tests__/IdeaListFilters.test.tsx` - NEW
- `src/components/__tests__/IdeaSortDropdown.test.tsx` - NEW
- `backend/src/routes/__tests__/ideas.test.ts` - Update: test new params
- `cypress/e2e/idea-filtering.cy.ts` - NEW: E2E tests

---

## Known Limitations & Considerations

- **Limitation 1:** Does not support filtering by category in Phase 1 (future enhancement)
- **Limitation 2:** Full-text search not included (can be added in Phase 2)
- **Limitation 3:** URL parameters may become long with many filters (acceptable MVP approach)
- **Consideration 1:** Filter controls should be sticky on dashboard for easy access while scrolling
- **Consideration 2:** Pagination state management must handle filter changes gracefully

---

## Estimation & Effort

**Story Points:** 5  
**Estimated Days:** 2-3 days

**Estimation Rationale:**  
Medium complexity due to:
- Frontend state management + URL synchronization (1-1.5 days)
- Backend endpoint query parameter handling (0.5 days)
- Testing across unit/integration/E2E layers (0.5-1 days)
- Similar to STORY-2.3 complexity but with added URL sync requirement

**Risk Level:** LOW

**Risk Reason:** 
- Filters and sorts are standard features with well-established patterns
- Dependencies (STORY-2.1, STORY-2.3) already complete
- No external service integrations required

---

## Dependencies & Blockers

### Story Dependencies
- ✅ **STORY-2.1** (Idea Submission Form) - MUST be complete (provides idea data)
- ✅ **STORY-2.3** (Dashboard) - MUST be complete (provides list UI)
- **STORY-2.2** (File Upload) - Can be in parallel; not required for filtering

### Blockers
- None known at specification time

---

## INVEST Validation Checklist

- ✅ **Independent** - Can be developed without blocking other stories
- ✅ **Negotiable** - Details (sort options, filter fields) open for discussion
- ✅ **Valuable** - Improves usability of dashboard significantly
- ✅ **Estimable** - Team understands requirements well enough to estimate
- ✅ **Small** - Can be completed in 1 sprint
- ✅ **Testable** - Clear acceptance criteria with measurable tests

---

## Sign-Off & Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Product Owner | [Product Manager] | 2026-02-25 | APPROVED |
| Tech Lead | [Engineering Lead] | 2026-02-25 | APPROVED |
| QA Lead | [QA Engineer] | 2026-02-25 | READY FOR QA |

---

## Related Documents

- **Epic:** [EPIC-2: Idea Submission & Management System](../epics/EPIC-2-Idea-Submission-Management.md)
- **Related Story:** [STORY-2.3: Create "My Ideas" Dashboard](STORY-2.3-Dashboard.md)
- **Related Story:** [STORY-2.5: Build Idea Detail Page](STORY-2.5-Detail-Page.md)
- **Tech Stack Reference:** [agents.md](../../agents.md)
- **API Design Reference:** [PRD-EPAM-Auth-Workflow.md](../prds/PRD-EPAM-Auth-Workflow.md)

---

## Implementation Notes for Developer

### Phase 1 (Days 1-1.5): Frontend Filter/Sort UI
1. Create `IdeaListFilters.tsx` component with status options
2. Create `IdeaSortDropdown.tsx` component with sort options
3. Create `ActiveFilterChips.tsx` to display applied filters
4. Integrate into `MyIdeasDashboard.tsx`
5. Connect to URL params using React Router's `useSearchParams`

### Phase 2 (Days 1.5-2): Backend API Updates
1. Update GET `/api/ideas` endpoint to accept query params
2. Implement filtering logic in service layer
3. Implement sorting logic in service layer
4. Add parameter validation
5. Test with Postman or similar tool

### Phase 3 (Days 2-3): Testing & Polish
1. Write unit tests (frontend + backend)
2. Write integration tests
3. Write E2E tests in Cypress
4. Performance testing with 100+ ideas
5. Code review & merge
