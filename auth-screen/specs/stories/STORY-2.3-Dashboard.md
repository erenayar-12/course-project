# STORY-2.3: Create "My Ideas" Dashboard with List View

**Story ID:** STORY-2.3  
**Epic:** EPIC-2  
**Created:** February 25, 2026  
**Priority:** P1 (Medium)  
**Estimated Size:** M (Medium)  
**Owner:** [Developer Name]  
**Status:** DRAFT

## Title
Create "My Ideas" Dashboard with List View and Idea Status Display

## Description
As a **submitter**, I want to view all my submitted ideas in a centralized dashboard so that I can track the status of my ideas and manage them in one place. The dashboard should display a list of all my ideas with key information (title, status, submission date) and allow me to quickly see and interact with each idea.

## Acceptance Criteria

### Functional Requirements
- [ ] Dashboard displays all ideas submitted by current user
- [ ] Each idea in the list shows: Title, Status, Submission Date, Category
- [ ] Dashboard displays empty state message if no ideas exist
- [ ] Status badges are color-coded (Yellow=Submitted, Blue=Under Review, Green=Accepted, Red=Rejected)
- [ ] Ideas list is paginated (show 10 ideas per page)
- [ ] Pagination controls allow navigation between pages
- [ ] Clicking on an idea row navigates to idea detail page
- [ ] Dashboard shows total count of user's ideas
- [ ] Dashboard shows count breakdown by status (e.g., "3 Submitted, 2 Under Review, 1 Accepted")
- [ ] Dashboard is accessible only to authenticated users
- [ ] Dashboard loads data from backend API
- [ ] Loading state is displayed while data is being fetched
- [ ] Error state is displayed if data fetch fails

### Non-Functional Requirements
- [ ] Dashboard loads within 3 seconds with 100 ideas
- [ ] Dashboard is fully responsive (mobile, tablet, desktop)
- [ ] Dashboard follows EPAM brand guidelines and design system
- [ ] API query is optimized (use database indexes, pagination)
- [ ] Dashboard properly handles pagination edge cases

## Implementation Tasks

### Frontend (React/TypeScript)
- [ ] Create `MyIdeasDashboard.tsx` component
- [ ] Create `IdeaListItem.tsx` component for each list row
- [ ] Implement pagination logic (calculate total pages, handle page changes)
- [ ] Integrate with backend API (`GET /api/ideas?page=1&limit=10`)
- [ ] Add loading state display (skeleton loader or spinner)
- [ ] Add error state display with retry button
- [ ] Add empty state display with call-to-action ("Submit your first idea")
- [ ] Implement status badge styling with color coding
- [ ] Add click handlers for row navigation to detail page
- [ ] Display status statistics (count by status)
- [ ] Style with Tailwind CSS for responsive design

### Backend (Node.js/Express)
- [ ] Create GET `/api/ideas` endpoint with pagination support
- [ ] Implement query parameters: `page`, `limit`, `userId` (from auth token)
- [ ] Add authentication/authorization middleware
- [ ] Create service layer for fetching ideas with pagination
- [ ] Optimize database query with appropriate indexes
- [ ] Return paginated response with metadata:
  ```json
  {
    "success": true,
    "data": {
      "ideas": [...],
      "pagination": {
        "currentPage": 1,
        "totalPages": 5,
        "totalCount": 50,
        "limit": 10
      }
    }
  }
  ```
- [ ] Add request logging

### Testing
- [ ] Unit tests for pagination logic
- [ ] Integration tests for API endpoint with various page/limit combinations
- [ ] E2E tests for dashboard navigation and pagination
- [ ] Test empty state display
- [ ] Test loading and error states
- [ ] Test responsive design on different screen sizes

## Technical Notes

### API Endpoint
```
GET /api/ideas?page=1&limit=10
Authorization: Bearer <jwt_token>
```

### Database Query Optimization
```sql
SELECT id, title, status, category, createdAt 
FROM ideas 
WHERE userId = $1 
ORDER BY createdAt DESC 
LIMIT 10 OFFSET 0;
```

### Pagination Example
- Page 1, Limit 10: OFFSET 0
- Page 2, Limit 10: OFFSET 10
- Page 3, Limit 10: OFFSET 20

## Definition of Done
- [ ] Code review completed and approved
- [ ] All unit tests passing (>80% coverage)
- [ ] All integration tests passing
- [ ] All E2E tests passing
- [ ] No console errors or warnings
- [ ] Responsive design verified on mobile/tablet/desktop
- [ ] Pagination verified with various data sets
- [ ] Documentation updated
- [ ] Merged to main branch

---

**Related Stories:**
- [STORY-2.1: Submission Form](STORY-2.1-Submission-Form.md)
- [STORY-2.4: Sort & Filter](STORY-2.4-Sort-Filter.md)
- [STORY-2.5: Detail Page](STORY-2.5-Detail-Page.md)
