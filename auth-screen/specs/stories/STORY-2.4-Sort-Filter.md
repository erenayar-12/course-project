# STORY-2.4: Add Sorting and Filtering to Idea List

**Story ID:** STORY-2.4  
**Epic:** EPIC-2  
**Created:** February 25, 2026  
**Priority:** P1 (Medium)  
**Estimated Size:** S (Small)  
**Owner:** [Developer Name]  
**Status:** DRAFT

## Title
Add Sorting and Filtering Capabilities to Idea List

## Description
As a **submitter**, I want to sort and filter my ideas list so that I can quickly find specific ideas and organize them by criteria important to me (date, status, category).

## Acceptance Criteria

### Functional Requirements
- [ ] Dashboard includes filter control for Status (All, Submitted, Under Review, Accepted, Rejected)
- [ ] Dashboard includes sort dropdown with options:
  - Date Created (Newest First)
  - Date Created (Oldest First)
  - Title (A-Z)
  - Title (Z-A)
  - Status
- [ ] Filter and sort controls are always visible and accessible
- [ ] Applied filters are displayed as active chips with remove button
- [ ] Applying filter/sort immediately updates list without page reload
- [ ] Clear All Filters button resets all filters
- [ ] Default sort is Date Created (Newest First)
- [ ] Pagination resets to page 1 when filter/sort changes
- [ ] URL query parameters are updated to reflect filter/sort state

### Non-Functional Requirements
- [ ] Filter/sort operations complete within 1 second
- [ ] Filter and sort controls are responsive on mobile devices
- [ ] URL state preservation allows bookmarking and sharing filtered views

## Implementation Tasks

### Frontend (React/TypeScript)
- [ ] Add filter controls UI to dashboard
- [ ] Add sort dropdown to dashboard
- [ ] Implement filter state management (useState or Redux)
- [ ] Implement sort state management
- [ ] Update API calls to include filter/sort parameters
- [ ] Add URL query parameter synchronization
- [ ] Display active filters as chips
- [ ] Implement clear filters functionality
- [ ] Handle URL parameter parsing on component mount

### Backend (Node.js/Express)
- [ ] Update GET `/api/ideas` endpoint to support query parameters:
  - `status` (filter by status)
  - `sortBy` (field to sort by)
  - `sortOrder` (asc/desc)
- [ ] Add validation for sort/filter parameters
- [ ] Update database query to apply filters and sorts
- [ ] Ensure query remains optimized with indexes

### Testing
- [ ] Unit tests for filter/sort logic
- [ ] Integration tests for API with filter/sort combinations
- [ ] E2E tests for UI filter/sort controls
- [ ] Test URL parameter preservation
- [ ] Test pagination reset on filter change

## Technical Notes

### API Query Parameters
```
GET /api/ideas?page=1&limit=10&status=Submitted&sortBy=createdAt&sortOrder=DESC
```

### Allowed Parameters
- `status`: "Submitted" | "Under Review" | "Accepted" | "Rejected"
- `sortBy`: "createdAt" | "title" | "status"
- `sortOrder`: "ASC" | "DESC"

## Definition of Done
- [ ] Code review completed and approved
- [ ] All unit tests passing
- [ ] All integration tests passing
- [ ] All E2E tests passing
- [ ] Documentation updated
- [ ] Merged to main branch

---

**Related Stories:**
- [STORY-2.3: Dashboard](STORY-2.3-Dashboard.md)
- [STORY-2.5: Detail Page](STORY-2.5-Detail-Page.md)
