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

### AC 1: Single-Select Status Filter Available
- **Given** The user is viewing the "My Ideas" dashboard with 5+ ideas
- **When** The user looks at the dashboard interface
- **Then** A status filter control is visible as a dropdown or radio button group
- **And** Options include: All, Submitted, Under Review, Needs Revision, Approved, Rejected
- **And** Only ONE status can be selected at a time
- **And** Selecting a different status automatically deselects the previous one

### AC 2: Sort Dropdown Available  
- **Given** The user is viewing the "My Ideas" dashboard
- **When** The user looks for sorting options
- **Then** A sort dropdown is visible with exactly 4 options:
  - **Date Created (Newest First)** - DEFAULT, shows newest ideas first
  - **Date Created (Oldest First)** - shows oldest ideas first
  - **Title (A-Z)** - alphabetical ascending
  - **Title (Z-A)** - alphabetical descending

### AC 3: Single-Select Filter Works
- **Given** The user is viewing 10 ideas with mixed statuses
- **When** The user selects "Under Review" status from the filter
- **Then** Only ideas with "Under Review" status are displayed; all others are hidden
- **And** The URL is updated to include query parameter: `?status=UNDER_REVIEW`
- **And** Previously selected status (if any) is deselected
- **And** If user selects "All", URL query param is removed (shows all statuses)

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

### AC 6: Active Filters AND Sort Display as Chips
- **Given** The user has applied a filter (e.g., "Submitted") and/or sort (e.g., "Title A-Z")
- **When** The user views the dashboard
- **Then** Active settings are displayed as removable chips above the list
- **And** Chips show: e.g., ["Submitted"] ["Title (A-Z)"]
- **And** Each chip has an "X" button that removes ONLY that chip
- **And** If no filters/sort applied, no chips are shown

### AC 7: Clear All Button Resets Everything
- **Given** The user has active filter and/or sort (e.g., "Submitted" + "Title A-Z")
- **When** The user clicks "Clear All" button
- **Then** Both filter AND sort are reset to defaults:
  - Filter: All statuses (no status filter)
  - Sort: Date Created (Newest First)
- **And** All URL query parameters are removed
- **And** Page resets to 1
- **And** All ideas are displayed in default order (newest first)

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

### AC 10: Performance & Loading States
- **Given** The dashboard loads 50+ ideas
- **When** The user applies a filter or sort
- **Then** Table shows skeleton loaders immediately
- **And** Filter/sort controls are disabled (opacity dimmed)
- **And** Micro-copy "Filtering ideas..." appears near controls
- **And** The list updates with real data within 1 second on standard networks
- **And** Loading state never exceeds 1 second (fail-over message if slower)

### AC 11: Empty Results State
- **Given** The user applies a filter that returns 0 ideas
- **When** The filter result completes
- **Then** Table body is empty (no rows shown)
- **And** An empty state message is displayed:
  ```
  No ideas match your filters.
  
  Try:
  - Clearing your filters
  - Viewing all ideas
  - Creating a new idea
  ```
- **And** A "Clear Filters" button is available in the empty state

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
- `src/components/IdeaListFilters.tsx` - NEW: Single-select status filter (radio/dropdown)
- `src/components/IdeaSortDropdown.tsx` - NEW: Sort control component (4 options)
- `src/components/FilterChips.tsx` - NEW: Display active filter AND sort as chips
- `src/components/EmptyResultsState.tsx` - NEW: Empty state message with CTA
- `src/pages/MyIdeasDashboard.tsx` - MODIFY: Integrate all controls + URL sync

**State Management:**
```typescript
// State in MyIdeasDashboard component
const [statusFilter, setStatusFilter] = useState<IdeaStatus | 'ALL'>('ALL');
const [sortBy, setSortBy] = useState<'createdAt' | 'title'>('createdAt');
const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');
const [page, setPage] = useState(1);
const [isLoading, setIsLoading] = useState(false);
const [ideas, setIdeas] = useState<Idea[]>([]);
const [totalCount, setTotalCount] = useState(0);
```

**URL Synchronization (URL as Source of Truth):**
```typescript
// On mount: parse URL → apply filters
useEffect(() => {
  const { status, sortBy: sb, sortOrder: so, page: p } = queryParams;
  if (status && status !== 'ALL') setStatusFilter(status);
  if (sb && ['createdAt', 'title'].includes(sb)) setSortBy(sb);
  if (so && ['ASC', 'DESC'].includes(so)) setSortOrder(so);
  if (p && Number(p) > 0) setPage(Number(p));
}, []);

// On filter/sort change: update URL
useEffect(() => {
  const params = new URLSearchParams();
  if (statusFilter !== 'ALL') params.set('status', statusFilter);
  params.set('sortBy', sortBy);
  params.set('sortOrder', sortOrder);
  params.set('page', page.toString());
  
  navigate(`?${params.toString()}`, { replace: true });
}, [statusFilter, sortBy, sortOrder, page]);
```

**URL Format:**
- All statuses: `/my-ideas` (no params)
- Filtered: `/my-ideas?status=SUBMITTED&sortBy=createdAt&sortOrder=DESC&page=1`
- Max URL length: params automatically normalized by browser

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
- **Existing Parameters:** `page`, `limit` (default: page=1, limit=10)
- **New Query Parameters:**
  - `status` - Filter by single idea status (optional, values: SUBMITTED|UNDER_REVIEW|NEEDS_REVISION|APPROVED|REJECTED)
  - `sortBy` - Sort field (optional, values: createdAt|title, default: createdAt)
  - `sortOrder` - Sort direction (optional, values: ASC|DESC, default: DESC)

**Implementation (Node.js/Express):**
```typescript
app.get('/api/ideas', authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, status, sortBy = 'createdAt', sortOrder = 'DESC' } = req.query;

    // Validation
    if (status && !['SUBMITTED', 'UNDER_REVIEW', 'NEEDS_REVISION', 'APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }
    if (!['createdAt', 'title'].includes(sortBy)) {
      return res.status(400).json({ error: 'Invalid sortBy value' });
    }
    if (!['ASC', 'DESC'].includes(sortOrder)) {
      return res.status(400).json({ error: 'Invalid sortOrder value' });
    }

    // Build WHERE clause (always scope to current user)
    const where: any = { userId };
    if (status) {
      where.status = status; // Single-select only
    }

    // Build ORDER BY
    const orderBy: any = {};
    orderBy[sortBy] = sortOrder.toLowerCase();

    // Fetch ideas with count
    const [ideas, total] = await Promise.all([
      prisma.idea.findMany({
        where,
        orderBy,
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        select: { id: true, title: true, description: true, status: true, createdAt: true, category: true, userId: true }
      }),
      prisma.idea.count({ where })
    ]);

    res.json({ 
      ideas, 
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / Number(limit))
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch ideas' });
  }
});
```

**Database Constraints:**
- `ideas.title` must NOT NULL (prevent null values in sorting)
- Index: `CREATE INDEX idx_ideas_userId_status_createdAt ON ideas(userId, status, createdAt DESC)`
- Index: `CREATE INDEX idx_ideas_userId_title ON ideas(userId, title ASC)` for title sorting

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

### Key Design Decisions (Resolved from Clarifications)

1. **Single-Select Filter:** Users can filter by ONE status at a time (not multi-select)
2. **URL-Based State:** Filter/sort state stored ONLY in URL params; no localStorage
3. **Filter + Sort Chips:** Both filter AND sort display as removable chips
4. **Clear All Button:** Resets BOTH filter AND sort to defaults (not just filter)
5. **Empty State UX:** Shows helpful message when filter returns 0 results
6. **Mobile Responsive:** Filters in collapsible drawer on mobile (<768px)
7. **Sticky Controls:** Filter/sort controls remain sticky while scrolling table
8. **Pagination Limit:** 10 items per page (not user-selectable in Phase 1)

### Phase 1 (Day 1-1.5): Frontend Single-Select Filter & Sort UI

**Tasks:**
1. Create `IdeaListFilters.tsx` with radio button/dropdown for single-select status
2. Create `IdeaSortDropdown.tsx` with 4 sort options
3. Create `FilterChips.tsx` component showing BOTH filter AND sort as chips
4. Create `EmptyResultsState.tsx` with friendly messaging
5. Integrate all into `MyIdeasDashboard.tsx`
6. Implement URL parameter parsing + synchronization using React Router's `useSearchParams`
7. Test: Verify URL updates when filter/sort changes
8. Test: Verify filters apply on page reload with bookmarked URL

**Code Example - Single-Select Radio:**
```typescript
function IdeaListFilters({ selectedStatus, onStatusChange }: Props) {
  return (
    <fieldset>
      <legend>Filter by Status</legend>
      {['ALL', 'SUBMITTED', 'UNDER_REVIEW', 'NEEDS_REVISION', 'APPROVED', 'REJECTED'].map(status => (
        <label key={status}>
          <input
            type="radio"
            name="status"
            value={status}
            checked={selectedStatus === status}
            onChange={() => onStatusChange(status === 'ALL' ? 'ALL' : status)}
          />
          {status === 'ALL' ? 'All Ideas' : status.replace(/_/g, ' ')}
        </label>
      ))}
    </fieldset>
  );
}
```

### Phase 2 (Day 1.5-2): Backend API + Parameter Validation

**Tasks:**
1. Update `GET /api/ideas` endpoint with query param validation
2. Implement single-select status filtering (not multi-select)
3. Implement 4 sort options
4. Add parameter validation (reject invalid status/sortBy/sortOrder values)
5. Test with Postman: Try various filter/sort combinations
6. Verify pagination resets to page 1 when filter changes
7. Check database indexes exist for performance

### Phase 3 (Day 2-3): Mobile + Loading States + Tests

**Tasks:**
1. Add mobile menu drawer (show/hide filters on mobile <768px)
2. Add sticky positioning CSS to filter controls
3. Add skeleton loader component + loading state UI
4. Implement error handling (e.g., "Unable to load filters")
5. Write unit tests (frontend + backend)
6. Write integration tests (API with various params)
7. Write E2E tests (user clicks filter → URL changes → list updates)
8. Performance testing with 50+ ideas
9. Code review & merge
