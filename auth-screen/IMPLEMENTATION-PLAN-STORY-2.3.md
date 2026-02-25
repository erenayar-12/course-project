# Implementation Plan: STORY-2.3 - Multi-Role Dashboard with Evaluation Queue

**Document ID:** STORY-2.3-IMPL-PLAN  
**Date Created:** February 25, 2026  
**Status:** PENDING RBAC (STORY-1.4)  
**Reference Spec:** [specs/stories/STORY-2.3-Dashboard.md](specs/stories/STORY-2.3-Dashboard.md)  
**Convention:** Per `agents.md` sections 2-4  
**Epic:** EPIC-2 (Idea Submission Management)

---

## 1. Executive Summary

Implement a multi-role dashboard supporting two distinct user views:
- **User/Submitter View ("My Ideas"):** Personal dashboard tracking submitted ideas by status
- **Evaluator/Admin View ("Evaluation Queue"):** Centralized queue for reviewing and evaluating all submitted ideas

This story combines user-facing features (dashboard, list, pagination) with admin workflows (evaluation modal, bulk operations, audit trail).

**Story Points:** 8  
**Estimated Time:** 4-5 days  
**Priority:** P1 (Critical - completes EPIC-2 Phase 1)  
**Phase:** Sprint 2 (Phase 2: Idea Submission)

---

## 2. Acceptance Criteria Implementation Roadmap

### User Dashboard Features (AC 1-11)

#### AC 1: Dashboard Displays User's Ideas
```gherkin
Given: User is logged in and navigates to /dashboard
When: Dashboard page loads
Then: All ideas submitted by user display in paginated list
```

**Task Breakdown:**
- [ ] Create `src/pages/Dashboard.tsx` (router component)
- [ ] Load user context from Auth0 to get userId
- [ ] Call backend: `GET /api/ideas?limit=10&offset=0`
- [ ] Display ideas in table/card layout
- [ ] Verify loading state shows spinner
- [ ] Test with 0, 1, 10, 15+ ideas (pagination boundaries)

---

#### AC 2-3: List Item Display & Empty State
```gherkin
Given: Dashboard loads
Then: Each row shows [Title, Status Badge, Category, Date, Attachments]
And: Empty state shows "No ideas yet" (if 0 ideas)
```

**Task Breakdown:**
- [ ] Create `src/components/IdeaListItem.tsx` component
- [ ] Props: `idea: Idea, onRowClick: (id) => void`
- [ ] Display: title, status badge, category, createdAt (formatted date), attachmentCount
- [ ] Add click handler for navigation to detail page
- [ ] Create empty state layout with CTA button
- [ ] Responsive design: stack on mobile, table on desktop

---

#### AC 4: Status Badge Styling
```gherkin
Given: Ideas display with different statuses
Then: Badges color-coded: DRAFT (yellow), SUBMITTED (blue), UNDER_REVIEW (orange), APPROVED (green), REJECTED (red)
```

**Task Breakdown:**
- [ ] Create `src/components/StatusBadge.tsx` reusable component
- [ ] Props: `status: IdeaStatus`
- [ ] Tailwind CSS color mapping per spec
- [ ] Use across user dashboard + evaluator queue
- [ ] Unit test: all 5 statuses render correct colors

---

#### AC 5: Pagination Controls
```gherkin
Given: User has 15+ ideas
Then: Pagination shows [Previous] [Page 1 of 3] [Next]
And: Each page shows 10 ideas (except last)
```

**Task Breakdown:**
- [ ] Implement pagination state: `currentPage`, `pageSize: 10`
- [ ] Calculate: `offset = (currentPage - 1) * 10`, `totalPages = Math.ceil(total / 10)`
- [ ] Previous/Next buttons (disable when unavailable)
- [ ] Page indicator: "Page 2 of 5"
- [ ] URL or state-based navigation
- [ ] Test edge cases: empty (0 items), single page (1-10 items), multi-page (11+ items)

---

#### AC 6: Statistics Display
```gherkin
Given: Dashboard loads
Then: Stats bar shows: Total Ideas, DRAFT count, SUBMITTED count, UNDER_REVIEW count, APPROVED count, REJECTED count
```

**Task Breakdown:**
- [ ] Create `src/components/IdeaStatsBar.tsx`
- [ ] Fetch statistics from `GET /api/ideas?limit=1&offset=0` (includes stats metadata)
- [ ] Display counts in horizontal bar or card grid
- [ ] Color-code sections matching status badges
- [ ] Responsive: horizontal on desktop, vertical stack on mobile
- [ ] Refresh stats when filtering/pagination changes

---

#### AC 7: Navigation to Detail Page
```gherkin
Given: User clicks on idea row
Then: Navigate to `/dashboard/ideas/:ideaId` (or `/ideas/:ideaId`)
```

**Task Breakdown:**
- [ ] Add click handler to IdeaListItem
- [ ] Navigate using `useNavigate()` hook from react-router
- [ ] Pass ideaId in URL
- [ ] Verify navigation works for all rows
- [ ] E2E test: click row → detail page loads

---

#### AC 8-9: Loading & Error States
```
Given: Dashboard fetching data
Then: Skeleton loader displays
And: Error message shown with "Retry" button
```

**Task Breakdown:**
- [ ] Implement loading state with skeleton loaders (10 placeholder rows)
- [ ] Use Tailwind CSS skeleton or shadcn/ui Skeleton
- [ ] Error state: "Failed to load ideas. Please try again."
- [ ] Retry button calls API again
- [ ] Test: verify spinners/skeletons appear during fetch
- [ ] Error boundary component (optional)

---

#### AC 10: Responsive Design
```gherkin
Given: User accesses dashboard on mobile/tablet/desktop
Then: Layout adapts appropriately
```

**Task Breakdown:**
- [ ] Mobile (<640px): Single column, compact rows
- [ ] Tablet (640-1024px): Two columns or scrollable table
- [ ] Desktop (>1024px): Full table with all columns
- [ ] Test: Chrome DevTools responsive mode
- [ ] Test: Real devices if available
- [ ] Verify touch interactions on mobile

---

#### AC 11: Authentication Guard
```gherkin
Given: Unauthenticated user accesses /dashboard
Then: Redirect to /login
```

**Task Breakdown:**
- [ ] Use `ProtectedRoute` component (from STORY-1.2)
- [ ] Wrap Dashboard in ProtectedRoute
- [ ] Test: unauthenticated access redirects to /login
- [ ] Test: authenticated access allows dashboard load

---

### Evaluator Queue Features (AC 12-16) - **BLOCKED BY STORY-1.4**

#### AC 12: Evaluator Sees Evaluation Queue
```gherkin
Given: Authenticated user with "evaluator" role
Then: Dashboard shows "Evaluation Queue" tab (not "My Ideas")
And: Queue displays all submitted ideas from all users
```

**Task Breakdown:**
- [ ] Implement role detection from RBAC context (STORY-1.4 prerequisite)
- [ ] Create `src/pages/EvaluationQueue.tsx`
- [ ] Call backend: `GET /api/evaluation-queue?status=SUBMITTED,UNDER_REVIEW&limit=10&offset=0`
- [ ] Filter ideas by status (SUBMITTED, UNDER_REVIEW only)
- [ ] Display ideas from all users (not just current user)
- [ ] Verify role-switching logic works (admin can toggle between views)

---

#### AC 13: Queue Column Display
```gherkin
Given: Evaluator views queue
Then: Each row shows [Submitter Name, Title, Category, Date, Status, Attachments, Review Button]
```

**Task Breakdown:**
- [ ] Create `src/components/EvaluationQueueRow.tsx`
- [ ] Columns: submitterName, title, category, createdAt, status, attachmentCount, reviewButton
- [ ] Backend query must join with `users` table to get submitter name
- [ ] Review button: Opens evaluation modal
- [ ] Responsive: horizontal scroll on mobile, full table on desktop

---

#### AC 14: Status Update Modal with Comments
```gherkin
Given: Evaluator clicks "Review" button
Then: Modal opens with:
  - Status dropdown (ACCEPTED, REJECTED, NEEDS_REVISION)
  - Comment textarea (max 500 chars)
  - File upload (optional)
  - Submit + Cancel buttons
```

**Task Breakdown:**
- [ ] Create `src/components/EvaluationModal.tsx`
- [ ] Use React Hook Form for form state management
- [ ] Zod validation:
  - status: required, enum of 3 values
  - comments: max 500 chars
  - fileUrl: optional string
- [ ] Submit handler: calls `POST /api/ideas/:ideaId/evaluate`
- [ ] Show success toast: "Evaluation submitted"
- [ ] Show error toast on API failure
- [ ] Keyboard shortcut: Escape to close
- [ ] Focus management: focus on status field on open

---

#### AC 15: Bulk Operations (Select, Update, Assign, Export)
```gherkin
Given: Evaluator views queue
Then: Bulk actions bar appears when ideas selected:
  - Bulk Status Update
  - Bulk Assign to Evaluator
  - Export as CSV
With confirmation dialog before executing
```

**Task Breakdown:**
- [ ] Create `src/components/BulkActionsBar.tsx`
- [ ] Checkbox column in EvaluationQueueRow (controlled state)
- [ ] Track selectedIds in parent component state
- [ ] Show action bar when selectedIds.length > 0
- [ ] Limit: max 100 items per bulk operation (prevent query timeout)
- [ ] **Bulk Status Update:**
  - [ ] Open modal with status dropdown
  - [ ] Call `POST /api/evaluation-queue/bulk-status-update`
  - [ ] Payload: `{ ideaIds: string[], status: string }`
  - [ ] Refresh queue after success
- [ ] **Bulk Assign:**
  - [ ] Open modal with dropdown of evaluators (from user list)
  - [ ] Call `POST /api/evaluation-queue/bulk-assign`
  - [ ] Payload: `{ ideaIds: string[], assigneeId: string }`
- [ ] **Export CSV:**
  - [ ] Call `GET /api/evaluation-queue/export?ids=id1,id2,id3&format=csv`
  - [ ] Download file: `ideas-export-[date].csv`
  - [ ] Columns: submitterName, title, category, status, createdAt

---

#### AC 16: Evaluation History (Immutable Audit Trail)
```gherkin
Given: Evaluator views idea details
Then: Below idea, "Evaluation History" section shows:
  - Each status change with [Date, Evaluator Name, Status, Comments]
  - Threaded comments if multiple evaluations
  - Original submission info [Submitter, Date, Category]
```

**Task Breakdown:**
- [ ] Create `src/components/EvaluationHistory.tsx`
- [ ] Call backend: `GET /api/ideas/:ideaId/evaluation-history`
- [ ] Display as timeline/list (most recent first)
- [ ] Each entry: timestamp, evaluator name, status, comments, fileUrl (if exists)
- [ ] Immutable display (no edit/delete buttons)
- [ ] Test: verify history persists across multiple evaluations

---

## 3. Technical Architecture

### Frontend Architecture

```
Dashboard Router (App.tsx)
├── Check user role from RBAC context (needs STORY-1.4)
├── Role = "user" or "submitter"
│   └── UserDashboard.tsx
│       ├── IdeaStatsBar.tsx (stats)
│       ├── Pagination controls
│       └── List
│           └── IdeaListItem.tsx (repeating)
│               └── StatusBadge.tsx
│
└── Role = "evaluator" or "admin"
    └── EvaluationQueue.tsx
        ├── BulkActionsBar.tsx (checkbox, actions)
        ├── Pagination controls
        └── Table
            └── EvaluationQueueRow.tsx (repeating)
                ├── StatusBadge.tsx
                └── EvaluationModal.tsx (on Review click)
                    └── File upload input
            └── EvaluationHistory.tsx (detail view)
```

### Component Breakdown

#### User Dashboard Components

| Component | Location | Props | Responsibility |
|-----------|----------|-------|-----------------|
| Dashboard | `src/pages/Dashboard.tsx` | - | Router; detect role; render appropriate view |
| UserDashboard | `src/pages/UserDashboard.tsx` | ideas[], isLoading, onNavigate | Display user's idea list with pagination |
| IdeaListItem | `src/components/IdeaListItem.tsx` | idea, onRowClick | Single idea row with status, date, attachments |
| IdeaStatsBar | `src/components/IdeaStatsBar.tsx` | stats | Horizontal stats display (counts by status) |
| StatusBadge | `src/components/StatusBadge.tsx` | status | Colored badge for status (reusable) |

#### Evaluator Queue Components

| Component | Location | Props | Responsibility |
|-----------|----------|-------|-----------------|
| EvaluationQueue | `src/pages/EvaluationQueue.tsx` | - | Queue display; manage selected ideas |
| EvaluationQueueRow | `src/components/EvaluationQueueRow.tsx` | idea, isSelected, onSelect, onReview | Single queue row + checkbox + Review button |
| BulkActionsBar | `src/components/BulkActionsBar.tsx` | selectedCount, onBulkStatusUpdate, onBulkAssign, onExport | Bulk action controls |
| EvaluationModal | `src/components/EvaluationModal.tsx` | idea, onSubmit, onCancel | Status + comment form |
| EvaluationHistory | `src/components/EvaluationHistory.tsx` | ideaId | Immutable evaluation timeline |

### Backend API Endpoints

#### Existing (STORY-2.2)
```
GET /api/ideas
  Query: ?limit=10&offset=0
  Response: { ideas: [], pagination: { total, page, pages }, statistics: { draft, submitted, inReview, approved, rejected } }
  Auth: Required (JWT)
```

#### New Endpoints

```
GET /api/evaluation-queue
  Query: ?status=SUBMITTED,UNDER_REVIEW&limit=10&offset=0
  Response: { ideas: [], pagination: {}, lastEvaluatedAt: Date }
  Auth: Required, Role: EVALUATOR
  Purpose: Fetch all submitted/review ideas for evaluators

POST /api/ideas/:ideaId/evaluate
  Body: { status: "ACCEPTED|REJECTED|NEEDS_REVISION", comments: string, fileUrl?: string }
  Response: { idea: {}, evaluation: { id, ...}, evaluationHistory: [] }
  Auth: Required, Role: EVALUATOR
  Purpose: Create evaluation record, update idea status

PUT /api/ideas/:ideaId/evaluate
  Body: Same as POST
  Auth: Required, Role: EVALUATOR
  Purpose: Update existing evaluation (if not yet finalized)

GET /api/ideas/:ideaId/evaluation-history
  Response: { evaluations: [{ id, evaluatorId, evaluatorName, status, comments, fileUrl, createdAt }] }
  Auth: Required
  Purpose: Fetch complete audit trail

POST /api/evaluation-queue/bulk-status-update
  Body: { ideaIds: string[], status: string }
  Query: Limit 100 items per request
  Response: { updated: number, failed: number, errors: [] }
  Auth: Required, Role: EVALUATOR
  Purpose: Batch update status for multiple ideas

POST /api/evaluation-queue/bulk-assign
  Body: { ideaIds: string[], assigneeId: string }
  Response: { assigned: number, errors: [] }
  Auth: Required, Role: EVALUATOR
  Purpose: Reassign evaluation work to another evaluator

GET /api/evaluation-queue/export
  Query: ?ids=id1,id2,id3&format=csv
  Response: CSV file
  Auth: Required, Role: EVALUATOR
  Purpose: Export selected ideas as CSV
```

### Backend Architecture

```
routes/
├── ideas.ts (existing)
│   ├── GET /api/ideas (modify: add statistics)
│   └── GET /api/ideas/:ideaId/evaluation-history (NEW)
│
└── evaluation.ts (NEW)
    ├── GET /api/evaluation-queue
    ├── POST /api/ideas/:ideaId/evaluate
    ├── PUT /api/ideas/:ideaId/evaluate
    ├── POST /api/evaluation-queue/bulk-status-update
    ├── POST /api/evaluation-queue/bulk-assign
    └── GET /api/evaluation-queue/export

services/
├── ideas.service.ts (modify: add getIdeaById, enrichWithEvaluationHistory)
└── evaluation.service.ts (NEW)
    ├── getEvaluationQueue(filters)
    ├── submitEvaluation(ideaId, status, comments)
    ├── getEvaluationHistory(ideaId)
    ├── bulkStatusUpdate(ideaIds, status)
    ├── bulkAssign(ideaIds, assigneeId)
    └── exportToCSV(ideaIds)

middleware/
└── roleCheck.ts (NEW)
    - Validates req.user.role === "EVALUATOR"
    - Returns 403 if unauthorized
```

### Database Schema Changes

```prisma
// New model
model IdeationEvaluation {
  id              String    @id @default(cuid())
  ideaId          String
  evaluatorId     String
  status          String    // ACCEPTED, REJECTED, NEEDS_REVISION
  comments        String    // max 500 chars
  fileUrl         String?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  idea            Idea      @relation(fields: [ideaId], references: [id], onDelete: Cascade)
  evaluator       User      @relation(fields: [evaluatorId], references: [id], onDelete: Restrict)

  @@index([ideaId])
  @@index([evaluatorId])
  @@index([status, createdAt])
}

// Extend Idea model
model Idea {
  // ... existing fields
  evaluations     IdeationEvaluation[]  // NEW relation
}

// Extend User model
model User {
  // ... existing fields
  evaluations     IdeationEvaluation[]  // NEW relation
}

// Extend status enum
enum IdeaStatus {
  DRAFT
  SUBMITTED
  UNDER_REVIEW
  ACCEPTED
  REJECTED
  NEEDS_REVISION  // NEW
}
```

### Database Indexes

```sql
-- Evaluation queue lookup
CREATE INDEX idx_ideas_status_created ON ideas(status, created_at DESC);

-- Evaluation history
CREATE INDEX idx_evaluations_idea ON ideation_evaluations(idea_id);

-- Evaluator workload
CREATE INDEX idx_evaluations_evaluator_created ON ideation_evaluations(evaluator_id, created_at DESC);

-- User ideas lookup (existing, but verify)
CREATE INDEX idx_ideas_user_created ON ideas(user_id, created_at DESC);
```

---

## 4. Implementation Phases

### Phase 1: Setup & Blocking Dependencies (Day 1)
- [ ] Verify STORY-1.4 (RBAC) is merged and working
  - [ ] Check role detection context available
  - [ ] Verify evaluator role exists
  - [ ] Test role switching in context
- [ ] Create branch: `feat/story-2.3-dashboard`
- [ ] Update Prisma schema with new model + enums
- [ ] Run migration: `npm run db:push`
- [ ] Scaffold directory structure:
  - [ ] `src/pages/Dashboard.tsx`, `src/pages/UserDashboard.tsx`, `src/pages/EvaluationQueue.tsx`
  - [ ] `src/components/Idea*.tsx`, `src/components/Evaluation*.tsx`, `src/components/StatusBadge.tsx`
  - [ ] `src/services/evaluation.service.ts`
  - [ ] `src/routes/evaluation.ts`
  - [ ] `src/types/evaluationSchema.ts`

### Phase 2: User Dashboard (Days 1-2)
- [ ] Implement `src/pages/UserDashboard.tsx`
  - [ ] Fetch user ideas from API
  - [ ] Handle loading/error/empty states
  - [ ] Implement pagination logic
- [ ] Create `src/components/IdeaListItem.tsx`
  - [ ] Responsive layout
  - [ ] Click navigation to detail page
  - [ ] Format dates, show attachments
- [ ] Create `src/components/IdeaStatsBar.tsx`
  - [ ] Display stats from API response
  - [ ] Color-coded sections
- [ ] Create `src/components/StatusBadge.tsx` (reusable)
- [ ] Implement pagination controls
- [ ] Add loading skeleton loaders
- [ ] Responsive design (mobile/tablet/desktop)
- [ ] Unit tests for components

### Phase 3: Role-Based Routing (Day 2)
- [ ] Implement role detection in `src/pages/Dashboard.tsx`
  - [ ] Read user role from RBAC context
  - [ ] Render UserDashboard or EvaluationQueue based on role
  - [ ] Add role switcher for testing (optional)
- [ ] Verify ProtectedRoute integration
- [ ] E2E test: navigate between views

### Phase 4: Evaluator Queue - Basic (Day 2-3)
- [ ] Implement `src/pages/EvaluationQueue.tsx`
  - [ ] Fetch queue from `GET /api/evaluation-queue`
  - [ ] Handle loading/error/empty states
- [ ] Create `src/components/EvaluationQueueRow.tsx`
  - [ ] Display submitter name, title, category, status
  - [ ] Add "Review" button
- [ ] Implement pagination for queue
- [ ] Basic table layout

### Phase 5: Evaluator Queue - Evaluation Modal (Day 3)
- [ ] Create `src/components/EvaluationModal.tsx`
  - [ ] Status dropdown with 3 options
  - [ ] Comment textarea (max 500 chars counter)
  - [ ] File upload input
  - [ ] Submit button calls `POST /api/ideas/:ideaId/evaluate`
- [ ] Form validation (Zod)
- [ ] Success/error toast notifications
- [ ] Unit tests

### Phase 6: Bulk Operations (Day 3-4)
- [ ] Create `src/components/BulkActionsBar.tsx`
  - [ ] Checkbox selection tracking
  - [ ] Show action buttons when items selected
- [ ] Implement "Bulk Status Update"
  - [ ] Modal with status dropdown
  - [ ] Call `POST /api/evaluation-queue/bulk-status-update`
  - [ ] Refresh queue on success
- [ ] Implement "Bulk Assign"
  - [ ] Modal with evaluator dropdown
  - [ ] Call `POST /api/evaluation-queue/bulk-assign`
- [ ] Implement "Export CSV"
  - [ ] Call `GET /api/evaluation-queue/export`
  - [ ] Download triggered in browser
- [ ] Add 100-item limit validation

### Phase 7: Evaluation History (Day 4)
- [ ] Create `src/components/EvaluationHistory.tsx`
  - [ ] Call `GET /api/ideas/:ideaId/evaluation-history`
  - [ ] Display as timeline (most recent first)
  - [ ] Show all fields: date, evaluator, status, comments
- [ ] Integration with idea detail page
- [ ] Styling: card or timeline layout

### Phase 8: Backend API Implementation (Days 2-4, parallel with frontend)
- [ ] Implement `evaluation.service.ts`
  - [ ] `getEvaluationQueue(filters)` - Query all submitted ideas
  - [ ] `submitEvaluation(ideaId, status, comments)` - Create record + update idea status
  - [ ] `getEvaluationHistory(ideaId)` - Fetch audit trail
  - [ ] `bulkStatusUpdate(ideaIds, status)` - Batch update
  - [ ] `bulkAssign(ideaIds, assigneeId)` - Reassign work  
  - [ ] `exportToCSV(ideaIds)` - Generate CSV
- [ ] Implement `routes/evaluation.ts`
  - [ ] All 6 endpoints with proper error handling
  - [ ] Add roleCheck middleware
- [ ] Add evaluation history query to `ideas.service.ts`
- [ ] Implement role-based middleware

### Phase 9: Testing (Days 4-5)
- [ ] **Unit Tests:**
  - [ ] StatusBadge component (all 5 status colors)
  - [ ] IdeaListItem component (props, click handler)
  - [ ] IdeaStatsBar (stats calculation)
  - [ ] EvaluationModal form validation
  - [ ] BulkActionsBar checkbox logic
  - [ ] Pagination logic
- [ ] **Integration Tests:**
  - [ ] UserDashboard API calls (mock backend)
  - [ ] EvaluationQueue API calls (mock backend)
  - [ ] Evaluation modal submit flow
  - [ ] Bulk operations flow
- [ ] **E2E Tests:**
  - [ ] User dashboard full flow (login → dashboard → pagination → detail)
  - [ ] Evaluator queue full flow (role switch → queue → review → submit)
  - [ ] Bulk operations flow (select → update → verify)
- [ ] **Manual Testing:**
  - [ ] Test on real mobile device (iPhone/Android)
  - [ ] Test on tablet (iPad)
  - [ ] Test on desktop (Chrome, Firefox, Safari)
  - [ ] Test role switching (if RBAC supports it)
  - [ ] Performance: load 100 ideas and time page load

### Phase 10: Code Review & Finalization (Day 5)
- [ ] Code review by tech lead
- [ ] Fix any issues flagged
- [ ] Verify test coverage >80%
- [ ] Check console for warnings/errors
- [ ] Verify responsive design on DevTools
- [ ] Merge to main
- [ ] Update documentation

---

## 5. Dependencies & Prerequisites

### Blocking Dependencies
- 🔴 **STORY-1.4 (RBAC)** - Must be merged before starting Phase 3
  - Need role detection in React context
  - Need role-based middleware in backend
  - Test: Can check `user.role === "EVALUATOR"`

### Required from Previous Stories
- ✅ **STORY-1.2 (Auth0)** - JWT authentication (done)
- ✅ **STORY-2.1 (Submission Form)** - Ideas data (done)
- ✅ **STORY-2.2 (File Upload)** - Backend API + file handling (done)

### Technology Versions
- Node.js v18+
- React 18
- Prisma 5.8.0+
- Express 4.18.2+

---

## 6. Task Tracking & Sign-Off

### Development Tasks Checklist

#### User Dashboard (11 tasks)
- [ ] UserDashboard component
- [ ] IdeaListItem component
- [ ] IdeaStatsBar component
- [ ] StatusBadge component (reusable)
- [ ] Pagination controls
- [ ] Loading skeleton loaders
- [ ] Error state handling
- [ ] Empty state messaging
- [ ] Responsive design implementation
- [ ] ProtectedRoute integration
- [ ] User dashboard unit tests

#### Evaluator Queue (16 tasks)
- [ ] EvaluationQueue component
- [ ] EvaluationQueueRow component
- [ ] Role-based routing in Dashboard.tsx
- [ ] EvaluationModal component
- [ ] BulkActionsBar component
- [ ] Bulk status update logic
- [ ] Bulk assign logic
- [ ] CSV export logic
- [ ] EvaluationHistory component
- [ ] Checkbox selection system
- [ ] 100-item limit validation
- [ ] Evaluator queue unit tests
- [ ] Bulk operations integration tests
- [ ] Evaluation history integration tests
- [ ] E2E tests for evaluator workflow
- [ ] E2E tests for role switching

#### Backend API (12 tasks)
- [ ] Database schema updates (Prisma)
- [ ] Database migration + indexes
- [ ] evaluation.service.ts implementation
- [ ] evaluation.ts routes (6 endpoints)  
- [ ] Role-based middleware
- [ ] GET /api/evaluation-queue endpoint
- [ ] POST /api/ideas/:ideaId/evaluate endpoint
- [ ] GET /api/ideas/:ideaId/evaluation-history endpoint
- [ ] Bulk status update endpoint
- [ ] Bulk assign endpoint
- [ ] CSV export endpoint
- [ ] API unit/integration tests

#### Infrastructure (4 tasks)
- [ ] Branch creation: `feat/story-2.3-dashboard`
- [ ] Environment setup verification
- [ ] Dependency installation (if needed)
- [ ] Database migration verification

#### Final QA (6 tasks)
- [ ] Test coverage >80%
- [ ] Mobile responsive testing
- [ ] Performance testing (load 100 ideas)
- [ ] Browser compatibility (Chrome, Firefox, Safari)
- [ ] Accessibility review (keyboard nav, screen reader)
- [ ] Code review + approval

**Total: 49 development tasks**

### Code Review Checklist
- [ ] All acceptance criteria implemented
- [ ] No console errors/warnings
- [ ] Test coverage >80%
- [ ] Code follows project conventions
- [ ] Performance acceptable (page load <3s with 100 ideas)
- [ ] Responsive design verified
- [ ] API errors handled gracefully
- [ ] Security: role-based access enforced
- [ ] Database indexes created
- [ ] Audit trail immutable

### Acceptance Sign-Off

| Role | Name | Date | Notes |
|------|------|------|-------|
| Product Owner | [PENDING] | [TBD] | User dashboard + Evaluator queue verified |
| Tech Lead | [PENDING] | [TBD] | Architecture, RBAC integration, performance reviewed |
| QA Lead | [PENDING] | [TBD] | Test coverage, responsive design, E2E verified |

---

## 7. Risk Mitigation

### Risk 1: STORY-1.4 Delay
**Impact:** Blocks evaluator queue implementation  
**Mitigation:**
- [ ] Start user dashboard features immediately (doesn't depend on RBAC)
- [ ] Prepare evaluation queue components in parallel (add role check later)
- [ ] Create feature flag to hide evaluator queue until RBAC ready

### Risk 2: Database Migration Issues
**Impact:** Hard to rollback if schema wrong  
**Mitigation:**
- [ ] Test Prisma migration locally first
- [ ] Backup production database before migration
- [ ] Have rollback script ready

### Risk 3: Performance with Large Idea Sets (1000+)
**Impact:** Dashboard slow, evaluation queue unresponsive  
**Mitigation:**
- [ ] Add pagination (limit 10 per page) - done in spec
- [ ] Create database indexes on (status, createdAt) - done in spec
- [ ] Implement caching for statistics (optional Phase 2)
- [ ] Load test with 1000+ ideas

### Risk 4: Bulk Operations Timeout
**Impact:** Large exports (CSV 100 items) could timeout  
**Mitigation:**
- [ ] Limit bulk operations to 100 items per request
- [ ] Consider async job for CSV export (Phase 2)
- [ ] Add request timeout validation

### Risk 5: Audit Trail Immutability Violated
**Impact:** Compliance issue if evaluations can be deleted  
**Mitigation:**
- [ ] Set cascade delete restrictions in database
- [ ] No delete endpoint for evaluations
- [ ] Only allow status updates on immutable records
- [ ] Add database constraints

---

## 8. Success Criteria

### Functionality
- ✅ User dashboard displays own ideas with pagination
- ✅ All 11 user-facing AC implemented and passing
- ✅ Evaluator queue displays all submitted ideas (when STORY-1.4 complete)
- ✅ All 5 evaluator-specific AC implemented and passing (when role detection ready)

### Quality
- ✅ Test coverage >80% on new components
- ✅ No console errors/warnings
- ✅ Zero accessibility violations (WCAG 2.1 AA)
- ✅ Page load <3 seconds with 100 ideas

### Performance
- ✅ Dashboard responsive on mobile/tablet/desktop
- ✅ Pagination smooth (no flicker on page change)
- ✅ Bulk operations complete <2 seconds for 100 items
- ✅ CSV export downloads <10 seconds for 100 ideas

### Security
- ✅ Unauthenticated users redirected to login
- ✅ Users only see own ideas (in user dashboard)
- ✅ Evaluators only see SUBMITTED/UNDER_REVIEW ideas
- ✅ Audit trail immutable (no deletions)
- ✅ Role-based access enforced at backend

### Documentation
- ✅ Inline code comments for complex logic
- ✅ API endpoint documentation in code
- ✅ README updated with new endpoints
- ✅ Schema changes documented

---

## 9. Related Documentation

- **Spec:** [specs/stories/STORY-2.3-Dashboard.md](specs/stories/STORY-2.3-Dashboard.md)
- **Test Plan:** [TESTING_PLAN.md](TESTING_PLAN.md)
- **Project Conventions:** [agents.md](agents.md)
- **Backend API Docs:** [API.md](API.md) (create post-implementation)
- **Tech Stack Report:** [TECH_STACK_REPORT.md](TECH_STACK_REPORT.md)

---

## 10. Estimated Timeline

| Phase | Task | Days | Status |
|-------|------|------|--------|
| 1 | Setup & STORY-1.4 verification | 0.5 | Pending |
| 2 | User Dashboard (components + API) | 1.5 | Pending |
| 3 | Role-based routing | 0.5 | Pending |
| 4 | Evaluator Queue - Basic | 1 | Pending (Blocked by STORY-1.4) |
| 5 | Evaluator Modal + History | 1 | Pending (Blocked by STORY-1.4) |
| 6 | Bulk Operations | 1 | Pending (Blocked by STORY-1.4) |
| 7-8 | Backend API + Integration | 1.5 | Parallel with phases 2-6 |
| 9 | Testing & QA | 1 | Pending |
| 10 | Code Review & Finalization | 0.5 | Pending |
| | **TOTAL** | **4-5 days** | **Pending STORY-1.4** |

---

## 11. Next Steps

1. ✅ Confirm STORY-1.4 (RBAC) is in progress or complete
2. ✅ Team review of this implementation plan
3. ✅ Assign developer(s) to user dashboard (can start immediately)
4. ⏳ Wait for STORY-1.4 merge, then start evaluator queue
5. ⏳ Create branch: `feat/story-2.3-dashboard`
6. ⏳ Begin Phase 1: Setup & dependencies

---

**Document Status:** READY FOR IMPLEMENTATION (awaiting STORY-1.4 completion)  
**Last Updated:** February 25, 2026  
**Owner:** Development Team  
**Approvals Pending:** Product Owner, Tech Lead, QA Lead
