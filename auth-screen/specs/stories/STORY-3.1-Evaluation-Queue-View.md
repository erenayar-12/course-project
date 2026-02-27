# STORY-3.1: Evaluation Queue View

**Status:** Not Started  
**Story ID:** STORY-3.1  
**Epic:** EPIC-3 (Idea Evaluation Workflow & Status Tracking)  
**Sprint:** Backlog  
**Story Points:** 5  
**Priority:** P0 (Critical)  
**Persona:** Raj (Evaluator/Admin)  
**Created:** February 26, 2026  
**Updated:** February 26, 2026  

---

## User Story

**As an** evaluator  
**I want** to see a list of all ideas pending evaluation  
**so that** I can quickly identify which ideas to review and prioritize my review workflow

---

## Context

Evaluators need a dedicated queue view as their main entry point to the evaluation workflow. This queue displays all ideas with status "Submitted" or "Under Review" in a sortable/filterable table. The queue is sorted by submission date (oldest first - FIFO) to ensure fair processing. This is the gateway to STORY-3.2 (opening an idea for review).

---

## Acceptance Criteria

### AC1: Queue Displays All Pending Ideas
**Given:** Evaluator has "evaluator" role  
**When:** Evaluator navigates to `/evaluation-queue`  
**Then:** 
- Page loads with HTTP 200
- All ideas with status "Submitted" or "Under Review" are displayed
- Ideas with status "Accepted" or "Rejected" are NOT shown
- No ideas shown if queue is empty (empty state message appears)

### AC2: Queue Shows Essential Information
**Given:** Ideas exist in queue  
**When:** Evaluator views the queue table  
**Then:** Each row displays:
- Idea Title (clickable link)
- Submitter Name
- Category (e.g., "Process Improvement", "Cost Reduction")
- Submission Date (formatted as "Feb 1, 2026")
- Current Status (badge with color)
- Days in Queue (calculated: today - submissionDate)

### AC3: Ideas Sorted by Submission Date (Oldest First - FIFO)
**Given:** Queue has multiple ideas with different submission dates  
**When:** Queue page first loads  
**Then:**
- Ideas sorted by createdAt ascending (oldest ideas first)
- This is the default sort order
- Sort column shows visual indicator (up arrow)

### AC4: Status Badges Show Current State with Colors
**Given:** Queue displays ideas  
**When:** Evaluator views status column  
**Then:**
- "Submitted" status shows yellow badge (#FCD34D)
- "Under Review" status shows orange badge (#FB923C)
- Badges use consistent styling from design system
- Status text is readable against badge background

### AC5: Pagination Works for Large Queues
**Given:** Queue has more than 10 ideas  
**When:** Evaluator scrolls to bottom or page loads  
**Then:**
- Pagination controls visible with Previous/Next buttons
- Current page indicator shown (e.g., "Page 1 of 15")
- Page size selector available (10, 25, 50 items per page)
- Page size persisted in localStorage for user session
- Total idea count shown (e.g., "Showing 1-10 of 147 ideas")

### AC6: Click Idea to View Details
**Given:** Idea is displayed in queue  
**When:** Evaluator clicks on idea title or row  
**Then:**
- Navigates to `/evaluation-queue/[ideaId]`
- STORY-3.2 review panel opens with idea details
- Back button from detail view returns to queue at same scroll position

---

## Technical Details

### Components to Create

#### 1. EvaluationQueue.tsx (Main Container)
- **Location:** `src/pages/EvaluationQueue.tsx`
- **Responsibilities:**
  - Fetch queue data from API
  - Handle pagination state
  - Manage sorting state
  - Authorization check (must be evaluator)
  - Pass data to QueueTable component
- **Hooks:** useState, useEffect, useContext (Auth)
- **Lines:** ~150-180

#### 2. QueueTable.tsx (Table Display)
- **Location:** `src/components/QueueTable.tsx`
- **Responsibilities:**
  - Display table with 6 columns
  - Handle row click navigation
  - Format dates and numbers
  - Show loading skeleton
  - Responsive design (collapse to card view on mobile)
- **Props:** ideas[], isLoading, onRowClick
- **Lines:** ~120-150

#### 3. QueuePagination.tsx (Pagination Controls)
- **Location:** `src/components/QueuePagination.tsx`
- **Responsibilities:**
  - Display pagination buttons
  - Handle page/pageSize changes
  - Show total count and range
  - Disable buttons appropriately
- **Props:** currentPage, pageSize, totalCount, onPageChange, onPageSizeChange
- **Lines:** ~80-100

#### 4. StatusBadge.tsx (Status Display - Reuse)
- **Status:** Already exists from STORY-2.5
- **Location:** `src/components/StatusBadge.tsx`
- **Usage:** Import and use in QueueTable

### API Endpoint

**GET /api/evaluation-queue**

```
Query Parameters:
  ?page=1                  // Page number (1-indexed)
  &limit=25                // Items per page (10, 25, 50)
  &sort=createdAt          // Sort field (createdAt is default)
  &order=asc               // Sort order (asc = oldest first)

Response (HTTP 200):
{
  "data": [
    {
      "id": "uuid-1",
      "title": "Improve Login Process",
      "submitterName": "Priya",
      "category": "Process Improvement",
      "createdAt": "2026-02-01T09:00:00Z",
      "status": "Submitted",
      "daysInQueue": 5
    },
    ...
  ],
  "pagination": {
    "currentPage": 1,
    "pageSize": 25,
    "totalCount": 147,
    "totalPages": 6
  }
}

Error Response (HTTP 403):
{
  "error": "Forbidden",
  "message": "Only evaluators can access evaluation queue"
}
```

### Database Query

```sql
SELECT 
  i.id,
  i.title,
  u.name AS submitterName,
  i.category,
  i.createdAt,
  i.status,
  DATEDIFF(DAY, i.createdAt, GETDATE()) AS daysInQueue,
  COUNT(*) OVER() AS totalCount
FROM ideas i
LEFT JOIN users u ON i.userId = u.id
WHERE i.status IN ('Submitted', 'Under Review')
  AND i.deletedAt IS NULL
ORDER BY i.createdAt ASC
LIMIT @limit OFFSET (@page - 1) * @limit
```

### Backend Implementation

**File:** `backend/src/routes/ideas.ts`

```typescript
router.get('/evaluation-queue', authMiddleware, roleMiddleware(['evaluator']), async (req, res) => {
  const { page = 1, limit = 25, sort = 'createdAt', order = 'asc' } = req.query;
  
  // Validate pagination
  const pageNum = Math.max(1, parseInt(page as string));
  const pageSize = [10, 25, 50].includes(parseInt(limit as string)) 
    ? parseInt(limit as string) 
    : 25;
  
  // Fetch ideas and total count
  const ideas = await db.ideas.findMany({
    where: {
      status: { in: ['Submitted', 'Under Review'] },
      deletedAt: null
    },
    include: { submitter: { select: { name: true } } },
    orderBy: { [sort]: order },
    take: pageSize,
    skip: (pageNum - 1) * pageSize
  });
  
  const totalCount = await db.ideas.count({
    where: {
      status: { in: ['Submitted', 'Under Review'] },
      deletedAt: null
    }
  });
  
  res.json({
    data: ideas.map(idea => ({
      id: idea.id,
      title: idea.title,
      submitterName: idea.submitter.name,
      category: idea.category,
      createdAt: idea.createdAt,
      status: idea.status,
      daysInQueue: Math.floor((Date.now() - idea.createdAt.getTime()) / (1000*60*60*24))
    })),
    pagination: {
      currentPage: pageNum,
      pageSize,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize)
    }
  });
});
```

### Frontend Implementation

**File:** `src/pages/EvaluationQueue.tsx`

```typescript
import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ideasService } from '../services/ideas.service';
import { QueueTable } from '../components/QueueTable';
import { QueuePagination } from '../components/QueuePagination';
import { ErrorMessage } from '../components/ErrorMessage';
import { LoadingSpinner } from '../components/LoadingSpinner';

export function EvaluationQueue() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [ideas, setIdeas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(() => 
    parseInt(localStorage.getItem('queuePage') || '1')
  );
  const [pageSize, setPageSize] = useState(() => 
    parseInt(localStorage.getItem('queuePageSize') || '25')
  );
  const [totalCount, setTotalCount] = useState(0);

  // Authorization check
  useEffect(() => {
    if (user && !user.roles?.includes('evaluator')) {
      navigate('/');
    }
  }, [user, navigate]);

  // Fetch queue data
  useEffect(() => {
    const fetchQueue = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await ideasService.getEvaluationQueue({
          page,
          limit: pageSize,
          sort: 'createdAt',
          order: 'asc'
        });
        
        setIdeas(response.data);
        setTotalCount(response.pagination.totalCount);
      } catch (err) {
        setError(err.message || 'Failed to load evaluation queue');
      } finally {
        setIsLoading(false);
      }
    };

    fetchQueue();
  }, [page, pageSize]);

  const handleRowClick = (ideaId: string) => {
    navigate(`/evaluation-queue/${ideaId}`);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    localStorage.setItem('queuePage', newPage.toString());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(1);
    localStorage.setItem('queuePageSize', newSize.toString());
    localStorage.setItem('queuePage', '1');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Evaluation Queue</h1>
      
      {error && <ErrorMessage message={error} />}
      
      {isLoading ? (
        <LoadingSpinner />
      ) : ideas.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">No ideas pending evaluation</p>
          <p className="text-gray-400 text-sm mt-2">All ideas have been processed!</p>
        </div>
      ) : (
        <>
          <QueueTable ideas={ideas} isLoading={isLoading} onRowClick={handleRowClick} />
          
          <div className="mt-8">
            <QueuePagination
              currentPage={page}
              pageSize={pageSize}
              totalCount={totalCount}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </div>
        </>
      )}
    </div>
  );
}
```

### UI/UX Requirements

**Layout:**
- Full-width container with padding
- Table displays 6 columns
- Responsive: On mobile (< 768px), collapse to card layout
- Loading skeleton matches table structure

**Table Styling:**
- Header: Bold, light gray background (#F9FAFB)
- Rows: Alternating white/light gray background
- Hover effect: Light blue background on row hover
- Sortable columns: Click header to sort (visual arrow indicator)

**Color Scheme:**
- Submitted badge: Yellow (#FCD34D)
- Under Review badge: Orange (#FB923C)
- Link color: Blue (#3B82F6)
- Error: Red (#EF4444)

**Accessibility:**
- Table has proper ARIA labels
- Clickable rows have keyboard navigation (Tab, Enter)
- Status badges have aria-label for screen readers
- Page title visible and clear

### Error Handling

1. **Authorization Failed (403)**
   - Display: "You don't have permission to access this page"
   - Action: Redirect to homepage after 3 seconds

2. **API Error (500)**
   - Display: "Failed to load evaluation queue. Please try again."
   - Action: Show retry button

3. **Network Error**
   - Display: "Network error. Please check your connection."
   - Action: Show retry button

---

## Files Affected

### New Files
- `src/pages/EvaluationQueue.tsx` (150-180 lines)
- `src/components/QueueTable.tsx` (120-150 lines)
- `src/components/QueuePagination.tsx` (80-100 lines)

### Modified Files
- `src/App.tsx` - Add route `/evaluation-queue`
- `backend/src/routes/ideas.ts` - Add GET /evaluation-queue endpoint
- `src/services/ideas.service.ts` - Add getEvaluationQueue() method

### Database
- No schema changes required (uses existing ideas table)
- Add index: `CREATE INDEX idx_ideas_status_createdAt ON ideas(status, createdAt)`

---

## Testing

### Unit Tests (to be created in STORY-3.1 phase)
- [ ] EvaluationQueue component renders with queue data
- [ ] QueueTable displays ideas correctly
- [ ] Clicking idea navigates to review panel
- [ ] Pagination changes page
- [ ] Empty state shows when no ideas
- [ ] Authorization check blocks non-evaluators
- [ ] Error handling shows error message
- [ ] localStorage persists pagination state

### E2E Tests (to be created in STORY-3.1 phase)
- [ ] Evaluator can navigate to evaluation queue
- [ ] Queue displays submitted ideas
- [ ] Queue displays under-review ideas
- [ ] Queue does NOT display accepted/rejected ideas
- [ ] Clicking idea navigates to detail view
- [ ] Pagination works correctly
- [ ] Page size change persists
- [ ] Sorting by different columns works

---

## Definition of Done Checklist

- [ ] Component implemented and compiles without errors (0 TypeScript errors)
- [ ] All acceptance criteria verified
- [ ] API endpoint working (tested with Postman/curl)
- [ ] Unit tests created and passing (>80% coverage)
- [ ] E2E tests created and passing
- [ ] Database index created for performance
- [ ] Responsive design verified on mobile/tablet/desktop
- [ ] Error handling implemented for all failure cases
- [ ] Accessibility verified (keyboard navigation, screen reader compatible)
- [ ] Code reviewed and approved
- [ ] Documentation updated (README, comments)
- [ ] No console warnings or errors
- [ ] Performance verified (< 5 seconds load with 1000+ ideas)

---

## Dependencies

### Blocks
- STORY-3.2 (Idea Review Panel) - requires queue as entry point
- STORY-3.3 (Approve/Reject) - requires queue to access ideas

### Blocked By
- None

### Related To
- EPIC-1 (authenticates evaluators)
- EPIC-2 (ideas exist and have required fields)

---

## Estimation

- **Estimated Story Points:** 5
- **Estimated Days:** 1.5-2 days
- **Confidence:** High (straightforward CRUD operation)

**Breakdown:**
- Components: 0.5 days
- Backend endpoint: 0.5 days
- Integration & routing: 0.5 days
- Testing: 0.5 days
- Review & polish: 0.5 days

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Large queue performance issues | Medium | High | Add pagination, database index, lazy loading |
| Authorization bypass | Low | High | Use roleMiddleware consistently, test thoroughly |
| Race conditions (idea count changes) | Low | Low | Count is point-in-time snapshot, acceptable |

---

## Notes

- Queue is the main entry point for evaluators - high visibility
- FIFO ordering (oldest first) ensures fair distribution of ideas
- localStorage for pagination preference improves UX
- Pagination essential for performance with large queues
- All success paths should be fast (< 2 seconds)
- Status colors should match design system used in STORY-2.5
