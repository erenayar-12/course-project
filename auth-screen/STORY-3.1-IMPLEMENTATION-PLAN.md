# STORY-3.1 Implementation Plan

**Status:** READY FOR IMPLEMENTATION  
**Story ID:** STORY-3.1  
**Title:** Evaluation Queue View  
**Reference Spec:** `specs/stories/STORY-3.1-Evaluation-Queue-View.md`  
**Date Created:** February 26, 2026  
**Estimated Duration:** 1.5-2 days  
**Story Points:** 5  

---

## Project Conventions

All work follows [agents.md](agents.md) standards:
- **Naming:** camelCase files, PascalCase components, UPPER_SNAKE_CASE constants
- **File Organization:** Follow `src/` directory structure
- **Commits:** `[subsystem] Brief description` format
- **Specs:** All acceptance criteria from STORY-3.1 spec are binding

---

## Implementation Work Breakdown

### Phase 1: Backend API Endpoint (Day 1, 0.5 days)

#### Task 1.1: Create Evaluation Queue Service Method
**File:** `backend/src/services/ideas.service.ts`
**Lines of Code:** ~50-70  
**Responsibility:**
- Fetch ideas from database with status "Submitted" or "Under Review"
- Apply pagination (limit, offset)
- Apply sorting (createdAt ASC)
- Calculate "daysInQueue" for each idea
- Return formatted response

**Method Signature:**
```typescript
async getEvaluationQueue(page: number, limit: number): Promise<EvaluationQueueResponse>
```

**Dependencies:**
- ✅ Prisma ORM (already configured)
- ✅ Ideas table with `status`, `createdAt` columns

---

#### Task 1.2: Add GET /api/evaluation-queue Endpoint
**File:** `backend/src/routes/ideas.ts`
**Lines of Code:** ~40-50  
**Responsibility:**
- Create express route handler
- Parse query parameters: `page`, `limit`, `sort`, `order`
- Apply roleCheck middleware (must be evaluator/admin)
- Call getEvaluationQueue service
- Return HTTP 200 with JSON response

**Route:**
```
GET /api/evaluation-queue?page=1&limit=25&sort=createdAt&order=asc
```

**Response Format:**
```typescript
{
  "success": true,
  "data": [
    {
      "id": "uuid-1",
      "title": "Improve Login Process",
      "submitterName": "Priya",
      "category": "Process Improvement",
      "createdAt": "2026-02-01T09:00:00Z",
      "status": "Submitted",
      "daysInQueue": 5
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 25,
    "total": 147
  }
}
```

**Dependencies:**
- Task 1.1 (Service method)
- ✅ roleCheck middleware (from EPIC-1.4)

---

#### Task 1.3: Add Database Index for Performance
**File:** Backend database migrations  
**SQL Command:**
```sql
CREATE INDEX idx_ideas_status_createdAt ON ideas(status, createdAt ASC);
```

**Rationale:** Ensures fast filtering by status + sorting by createdAt

---

### Phase 2: Frontend Components (Day 1, 1.0 days)

#### Task 2.1: Create QueuePagination Component
**File:** `src/components/QueuePagination.tsx`  
**Lines of Code:** ~100-120  
**Responsibility:**
- Display "Showing X-Y of Z ideas" text
- Previous/Next buttons with disabled states
- Page size selector (10, 25, 50)
- Save page size to localStorage under key: `evaluationQueue_pageSize`
- Call onPageChange/onPageSizeChange callbacks

**Props Interface:**
```typescript
interface QueuePaginationProps {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}
```

**Dependencies:**
- React hooks (useState)
- Tailwind CSS (styling)

---

#### Task 2.2: Create QueueTable Component
**File:** `src/components/QueueTable.tsx`  
**Lines of Code:** ~120-150  
**Responsibility:**
- Display 6-column table: Title, Submitter, Category, Submission Date, Status, Days in Queue
- Format dates as "Feb 1, 2026"
- Import StatusBadge from STORY-2.5
- Show loading skeleton (5 rows) while isLoading=true
- Handle row click to navigate to `/evaluation-queue/[ideaId]`
- Show empty state: "No ideas pending review" when ideas array is empty

**Props Interface:**
```typescript
interface QueueTableProps {
  ideas: QueueIdea[];
  isLoading: boolean;
  onRowClick: (ideaId: string) => void;
}

type QueueIdea = {
  id: string;
  title: string;
  submitterName: string;
  category: string;
  createdAt: string;
  status: "Submitted" | "Under Review";
  daysInQueue: number;
};
```

**Dependencies:**
- ✅ StatusBadge.tsx (from STORY-2.5)
- ✅ useNavigate from react-router-dom
- Tailwind CSS

---

#### Task 2.3: Create EvaluationQueue Page Component
**File:** `src/pages/EvaluationQueue.tsx`  
**Lines of Code:** ~150-180  
**Responsibility:**
- Fetch ideas from API on mount
- Manage state: page, pageSize, ideas, loading, error
- Load pageSize from localStorage (default 25)
- Call API with pagination parameters
- Handle API errors (show error banner with retry)
- Pass data to QueueTable and QueuePagination
- Save scroll position to sessionStorage before navigation
- Restore scroll position on mount

**State Management:**
```typescript
const [page, setPage] = useState(1);
const [pageSize, setPageSize] = useState(
  localStorage.getItem('evaluationQueue_pageSize') || '25'
);
const [ideas, setIdeas] = useState<QueueIdea[]>([]);
const [totalCount, setTotalCount] = useState(0);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
```

**Dependencies:**
- Task 2.1, 2.2 (Child components)
- ✅ apiGet from src/api/client.ts
- ✅ useMockAuth0 for authorization check
- React Router (useNavigate)

---

### Phase 3: Routing & Integration (Day 1, 0.5 days)

#### Task 3.1: Add Route to App.tsx
**File:** `src/App.tsx`  
**Change:**
```typescript
// Add to AppRoutes component
<Route
  path="/evaluation-queue"
  element={
    <ProtectedRoute 
      path="/evaluation-queue" 
      requiredRoles={[ROLES.EVALUATOR, ROLES.ADMIN]}
    >
      <EvaluationQueue />
    </ProtectedRoute>
  }
/>
```

**Dependencies:**
- ✅ ProtectedRoute component (from STORY-1.4)
- ✅ ROLES constants

---

#### Task 3.2: Update Navbar Link to Evaluation Queue
**File:** `src/components/Navbar.tsx`  
**Change:**
```typescript
// Add link for evaluators/admins
{user?.role === ROLES.EVALUATOR || user?.role === ROLES.ADMIN ? (
  <Link
    to="/evaluation-queue"
    className="hover:text-indigo-200 transition-colors font-semibold"
  >
    Evaluation Queue
  </Link>
) : null}
```

**Dependencies:**
- ✅ Navbar already uses useMockAuth0

---

### Phase 4: Types & Constants (Day 1, 0.25 days)

#### Task 4.1: Add Type Definitions
**File:** `src/types/ideaSchema.ts`  
**Add:**
```typescript
export type QueueIdea = {
  id: string;
  title: string;
  submitterName: string;
  category: string;
  createdAt: string;
  status: "Submitted" | "Under Review";
  daysInQueue: number;
};

export type EvaluationQueueResponse = {
  success: boolean;
  data: QueueIdea[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
};
```

**Dependencies:**
- ✅ ideaSchema.ts exists from STORY-2.5

---

#### Task 4.2: Add API Service Method
**File:** `src/services/ideas.service.ts`  
**Add:**
```typescript
async getEvaluationQueue(page: number, limit: number): Promise<QueueIdea[]> {
  return apiGet<EvaluationQueueResponse>('/evaluation-queue', {
    params: { page, limit }
  }).then(res => res.data);
}
```

**Dependencies:**
- ✅ apiGet from src/api/client.ts

---

## Implementation Sequence

**Day 1 (Full Day):**
1. ✅ Task 1.1 - Backend service method (~30 min)
2. ✅ Task 1.2 - Backend API endpoint (~20 min)
3. ✅ Task 1.3 - Database index (~10 min)
4. ✅ Task 2.1 - QueuePagination component (~40 min)
5. ✅ Task 2.2 - QueueTable component (~50 min)
6. ✅ Task 2.3 - EvaluationQueue page (~60 min)
7. ✅ Task 3.1, 3.2 - Routing & navbar (~20 min)
8. ✅ Task 4.1, 4.2 - Types & services (~20 min)

**Day 2 (Testing & Polish):**
1. ✅ Integration testing
2. ✅ API endpoint testing with Postman
3. ✅ Responsive design verification (mobile/tablet)
4. ✅ Accessibility testing (keyboard nav)
5. ✅ Error handling edge cases
6. ✅ Performance testing (large datasets)
7. ✅ Code review and cleanup

---

## Definition of Done Checklist

- [ ] All 6 acceptance criteria from STORY-3.1 spec passing
- [ ] 0 TypeScript errors
- [ ] Backend endpoint tested and working
- [ ] Components render without errors
- [ ] Pagination state persists in localStorage
- [ ] Scroll position restores correctly
- [ ] Error handling shows retry button
- [ ] Empty state displays when no ideas
- [ ] Loading skeleton shows while fetching
- [ ] Status badges color correctly (yellow/orange)
- [ ] Click idea navigates to detail view
- [ ] Authorization check works (non-evaluators redirected)
- [ ] Mobile responsive layout verified
- [ ] Accessibility: tab navigation works
- [ ] Console clean (no warnings/errors)
- [ ] Code follows agents.md conventions
- [ ] All files pass ESLint
- [ ] TypeScript strict mode compliant

---

## Acceptance Criteria Traceability

| AC | Component | Status |
|----|-----------|----|
| AC1: Queue displays pending ideas | EvaluationQueue.tsx + Backend | ⏳ |
| AC2: Shows essential info columns | QueueTable.tsx | ⏳ |
| AC3: Sorted by createdAt ASC | Ideas service + API | ⏳ |
| AC4: Status badges with colors | StatusBadge + QueueTable | ⏳ |
| AC5: Pagination (10/25/50) | QueuePagination.tsx | ⏳ |
| AC6: Click to view details | QueueTable.tsx + Router | ⏳ |

---

## Commits (Git Workflow)

```bash
# Task 1.1 - 1.3
[backend] Add evaluation queue endpoint with pagination

# Task 2.1
[frontend] Add QueuePagination component with localStorage persistence

# Task 2.2
[frontend] Add QueueTable component with status badges and empty state

# Task 2.3
[frontend] Add EvaluationQueue page with API integration

# Task 3.1 - 3.2
[frontend] Add evaluation queue routing and navbar link

# Task 4.1 - 4.2
[types] Add EvaluationQueue type definitions and service method

# Day 2
[test] Add E2E tests for evaluation queue
[docs] Update README with queue feature
```

---

## Risk Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Pagination performance | Medium | Medium | Add database index, lazy load |
| Authorization bypass | Low | High | Test roleCheck thoroughly |
| Scroll loss on navigation | Low | Low | sessionStorage position restore |
| API timeout on large queue | Low | Medium | Add timeout error handling |

---

## Notes for Developer

1. **Reuse Components:** StatusBadge.tsx already exists from STORY-2.5 - just import it
2. **Follow EPIC-2 Patterns:** Dashboard.tsx shows similar API fetching + pagination pattern
3. **Authorization:** Use existing roleCheck middleware (STORY-1.4)
4. **Styling:** Use Tailwind utility classes consistently with existing components
5. **Testing:** Jest + React Testing Library (matching test setup from EPIC-2)
6. **Performance:** Test with 1000+ ideas in queue - ensure pagination prevents browser slowdown

---

## Dependencies

**Blocks:**
- STORY-3.2 (Idea Review Panel) - needs queue as entry point

**Blocked By:**
- None (all dependencies satisfied by EPIC-1 & EPIC-2)

**Related:**
- STORY-2.5 (Uses StatusBadge component)
- STORY-1.4 (Uses roleCheck middl ware)
- EPIC-2 (Similar pagination/API patterns)

---

**Ready to start implementation? All tasks are well-defined and follow agents.md conventions.**
