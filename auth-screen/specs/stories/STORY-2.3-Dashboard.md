# STORY-2.3: Multi-Role Dashboard with Idea Submission & Evaluation Views

## Story ID & Title
**Story ID:** STORY-2.3  
**Title:** Create Multi-Role Dashboard (User "My Ideas" + Evaluator "Evaluation Queue")  
**Epic:** EPIC-2 (Idea Submission Management)  
**Sprint/Milestone:** Sprint 2  
**Status:** APPROVED  
**Priority:** P1 (Critical)  
**Created:** February 25, 2026

---

## User Story

**As a** submitter/evaluator  
**I want** to view ideas in a centralized dashboard appropriate to my role  
**so that** I can track submitted ideas (as submitter) OR evaluate idea queue (as evaluator) and manage them efficiently

### Story Context

**User View (Submitter):** Users need visibility into all their submitted ideas after submission. The dashboard displays each user's ideas grouped by status (Draft, Submitted, Under Review, Approved, Rejected), enabling them to track progress and navigate to details.

**Evaluator View (Admin/Reviewer):** Evaluators need a dedicated evaluation queue showing all submitted ideas from all users. The queue enables them to batch-review ideas, update statuses, add evaluation comments, and track evaluation history. This serves as the hub for idea management and review workflow.

**Scope:** This story implements BOTH views in a single multi-role dashboard component that adapts based on user role (determined via STORY-1.4 RBAC).

---

## Acceptance Criteria

### AC 1: Dashboard displays authenticated user's ideas
- **Given** user is logged in and navigates to dashboard
- **When** dashboard loads
- **Then** all ideas submitted by current user are displayed in a paginated list

### AC 2: Each list item shows required information
- **Given** dashboard displays ideas
- **When** user views any idea in the list
- **Then** the item displays: Title, Status (badge), Category, Submission Date, and Attachment count

### AC 3: Empty state with call-to-action
- **Given** user has submitted no ideas
- **When** dashboard loads
- **Then** empty state message is displayed: "No ideas submitted yet" with button to "Submit Your First Idea"

### AC 4: Status badges are color-coded
- **Given** dashboard displays ideas with different statuses
- **When** user views status badges
- **Then** statuses are color-coded:
  - Yellow: DRAFT
  - Blue: SUBMITTED  
  - Orange: UNDER_REVIEW
  - Green: APPROVED
  - Red: REJECTED

### AC 5: Pagination controls enable navigation
- **Given** user has more than 10 ideas
- **When** dashboard displays pagination controls
- **Then** pagination shows current page, total pages, and buttons to navigate between pages
- **And** each page displays exactly 10 ideas (except last page)

### AC 6: Statistics display idea status breakdown
- **Given** dashboard loads
- **When** user views the statistics section
- **Then** a summary is displayed showing: Total Ideas, DRAFT count, SUBMITTED count, UNDER_REVIEW count, APPROVED count, REJECTED count

### AC 7: Click row navigates to idea detail page
- **Given** user views the ideas list
- **When** user clicks on any idea row
- **Then** user is navigated to the idea detail page for that idea

### AC 8: Loading state during data fetch
- **Given** dashboard is loading data from API
- **When** user views the dashboard
- **Then** a loading spinner or skeleton loader is displayed

### AC 9: Error state with retry on API failure
- **Given** API request fails to fetch ideas
- **When** dashboard attempts to load
- **Then** error message is displayed: "Failed to load ideas. Please try again."
- **And** a "Retry" button allows user to reattempt the request

### AC 10: Dashboard is responsive across devices
- **Given** user accesses dashboard on mobile, tablet, or desktop
- **When** dashboard renders
- **Then** layout adapts appropriately for each screen size
- **And** all functionality remains accessible and usable

### AC 11: Dashboard accessible only to authenticated users
- **Given** unauthenticated user attempts to access dashboard
- **When** page loads
- **Then** user is redirected to login page
- **And** breadcrumb/navigation reflects "My Ideas" as current page

---

## ADMIN/EVALUATOR-SPECIFIC ACCEPTANCE CRITERIA

### AC 12: Evaluator sees idea evaluation queue
- **Given** authenticated user with "evaluator" role navigates to dashboard
- **When** dashboard loads
- **Then** evaluator sees "Evaluation Queue" tab instead of "My Ideas"
- **And** queue displays all ideas with status SUBMITTED, UNDER_REVIEW from all users (not just own)

### AC 13: Evaluation queue shows required columns
- **Given** evaluator views the evaluation queue
- **When** queue renders
- **Then** each row displays: Submitter Name, Title, Category, Submission Date, Current Status (badge), Attachment count
- **And** an "Actions" column with "Review" button

### AC 14: Status update with evaluation comments
- **Given** evaluator clicks "Review" button for an idea
- **When** modal/slide-out opens
- **Then** evaluator can:
  - Select new status from dropdown: ACCEPTED, REJECTED, NEEDS_REVISION
  - Enter evaluation comments (text area, max 500 chars)
  - Optionally attach evaluation notes file
  - Submit changes
- **And** original submission and all prior evaluation history remain visible

### AC 15: Bulk evaluation actions
- **Given** evaluator views the evaluation queue
- **When** evaluator selects multiple ideas via checkboxes
- **Then** bulk actions become available:
  - "Bulk Status Update" to assign same status to selected ideas
  - "Bulk Assign" to reassign evaluation to another evaluator
  - "Export" to download selected ideas as CSV
- **And** bulk actions include confirmation dialog before executing

### AC 16: Evaluation history visible in detail view
- **Given** evaluator opens an idea for review
- **When** detail view renders
- **Then** below the idea details, a "Evaluation History" section shows:
  - Each status change with timestamp, evaluator name, comments
  - Threaded comment history if multiple evaluations occurred
  - Original submission metadata (submitter, submission date, category)
- **And** history is immutable and audit-compliant

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

**New Components (User View):**
- `src/pages/Dashboard.tsx` - Multi-role dashboard container component
- `src/pages/UserDashboard.tsx` - User/submitter "My Ideas" view
- `src/pages/EvaluationQueue.tsx` - Evaluator "Evaluation Queue" view (NEW)
- `src/components/IdeaListItem.tsx` - Individual idea row in user list
- `src/components/IdeaStatsBar.tsx` - Statistics summary bar
- `src/components/EvaluationQueueRow.tsx` - Evaluation queue row with actions (NEW)
- `src/components/EvaluationModal.tsx` - Status update + comment modal (NEW)
- `src/components/BulkActionsBar.tsx` - Bulk selection & action controls (NEW)
- `src/components/EvaluationHistory.tsx` - Immutable history timeline (NEW)
- `src/types/ideaTypes.ts` - TypeScript interfaces for ideas and evaluation

**Implementation Tasks (User View):**
- [ ] Create Dashboard router component that determines user role
- [ ] Implement UserDashboard showing submission list with pagination
- [ ] Implement IdeaListItem component with status badge styling
- [ ] Create IdeaStatsBar component showing status breakdown
- [ ] Implement pagination logic with page state management
- [ ] Integrate with backend API (`GET /api/ideas?limit=10&offset=0`)
- [ ] Add navigation to detail page on row click
- [ ] Implement responsive design (mobile/tablet/desktop)
- [ ] Add skeleton loader for loading state
- [ ] Add error handling with retry button

**Implementation Tasks (Evaluator View) - NEW:**
- [ ] Implement EvaluationQueue page component
- [ ] Create EvaluationQueueRow component with "Review" button
- [ ] Build EvaluationModal for status + comment input
- [ ] Implement BulkActionsBar with checkbox selection
- [ ] Add bulk status update, bulk assign, and export CSV functionality
- [ ] Create EvaluationHistory timeline component (immutable)
- [ ] Wire evaluation endpoints to backend
- [ ] Implement role-based view switching based on RBAC context

### Backend (Node.js/Express)

**Existing API (User View):**
- Endpoint: `GET /api/ideas` (STORY-2.2)
- Query params: `limit` (default 10), `offset` (default 0)
- Response: Paginated list of user's own ideas + statistics
- Authorization required (JWT from Auth0)

**NEW Endpoints (Evaluator View):**
- `GET /api/evaluation-queue?status=SUBMITTED&limit=10&offset=0` - Fetch all submitted ideas for evaluation (EVALUATOR role only)
- `POST /api/ideas/:ideaId/evaluate` - Submit evaluation (status update + comments)
  - Request body: `{ status: string, comments: string, fileUrl?: string }`
  - Response: Updated idea with evaluation record
- `PUT /api/ideas/:ideaId/evaluate` - Update existing evaluation (if not yet finalized)
- `GET /api/ideas/:ideaId/evaluation-history` - Fetch immutable evaluation audit trail
- `POST /api/evaluation-queue/bulk-assign` - Bulk reassign ideas to evaluator
- `POST /api/evaluation-queue/bulk-status-update` - Bulk update status for selected ideas
- `GET /api/evaluation-queue/export` - Export as CSV (query params: ids[], format='csv')

**Service Layer (NEW):**
- `evaluationService.getEvaluationQueue(filters)` - Query all submitted ideas with evaluator filtering
- `evaluationService.submitEvaluation(ideaId, status, comments)` - Create evaluation record
- `evaluationService.getEvaluationHistory(ideaId)` - Retrieve audit trail with immutable records
- `evaluationService.bulkAssign(ideaIds, assigneeId)` - Reassign multiple ideas
- `evaluationService.bulkStatusUpdate(ideaIds, newStatus)` - Update status for multiple ideas

**Database Changes:**
- New model: `IdeationEvaluation` (ideaId, evaluatorId, status, comments, fileUrl, createdAt, updatedAt)
  - Relationships: Idea 1→* IdeationEvaluation, User(evaluator) 1→* IdeationEvaluation
- New index on `(status, createdAt DESC)` for evaluation queue queries
- New index on `ideaId` for evaluation history queries
- Status enum extended to include: DRAFT, SUBMITTED, UNDER_REVIEW, ACCEPTED, REJECTED, NEEDS_REVISION

### Database

**Optimization (User View):**
- Index on `(userId, createdAt DESC)` for efficient user idea filtering
- Use LIMIT/OFFSET for pagination

**Query (User View):**
```sql
SELECT id, title, status, category, createdAt, 
       (SELECT COUNT(*) FROM idea_attachments WHERE idea_id = ideas.id) as attachmentCount
FROM ideas 
WHERE user_id = $1 AND status != 'ARCHIVED'
ORDER BY createdAt DESC 
LIMIT $2 OFFSET $3;
```

**Optimization (Evaluator View) - NEW:**
- Index on `(status, createdAt DESC)` for evaluation queue filtering
- Index on `ideaId` for evaluation history queries
- Index on `(evaluatorId, createdAt DESC)` for evaluator workload tracking

**Query (Evaluation Queue):**
```sql
SELECT ideas.id, ideas.title, ideas.category, ideas.createdAt, ideas.status,
       users.name as submitterName,
       (SELECT COUNT(*) FROM idea_attachments WHERE idea_id = ideas.id) as attachmentCount,
       (SELECT MAX(createdAt) FROM ideation_evaluations WHERE idea_id = ideas.id) as lastEvaluatedAt
FROM ideas
JOIN users ON ideas.user_id = users.id
WHERE ideas.status IN ('SUBMITTED', 'UNDER_REVIEW')
ORDER BY ideas.createdAt ASC
LIMIT $1 OFFSET $2;
```

**Query (Evaluation History):**
```sql
SELECT id, evaluatorId, status, comments, fileUrl, createdAt
FROM ideation_evaluations
WHERE idea_id = $1
ORDER BY createdAt DESC;
```

### Testing

**Unit Tests:**
- Pagination calculation logic
- Status badge color mapping
- Component rendering with mock data

**Integration Tests:**
- Dashboard API endpoint with various pagination parameters
- Authentication/authorization verification

**E2E Tests:**
- Dashboard page navigation
- Pagination controls functionality
- Empty state display
- Status badge rendering
- Error state and retry

---

## Technical Notes

### Technology Stack
- **Frontend:** React 18, TypeScript, Tailwind CSS, React Query (for data fetching), React Hook Form (for modal forms)
- **Backend:** Node.js/Express, Prisma ORM, PostgreSQL
- **API:** RESTful (7 endpoints: 1 existing + 6 new evaluation endpoints)
- **Audit Trail:** Immutable evaluation records with timestamp + user + role tracking

### Files/Components Affected

**Frontend - NEW:**
- `src/pages/Dashboard.tsx` (role router)
- `src/pages/UserDashboard.tsx` (submitter view)
- `src/pages/EvaluationQueue.tsx` (evaluator queue)
- `src/components/IdeaListItem.tsx` (user list row)
- `src/components/IdeaStatsBar.tsx` (statistics)
- `src/components/EvaluationQueueRow.tsx` (queue row with actions)
- `src/components/EvaluationModal.tsx` (status + comments form)
- `src/components/BulkActionsBar.tsx` (bulk selection bar)
- `src/components/EvaluationHistory.tsx` (audit trail timeline)
- `src/types/ideaTypes.ts` (add evaluation types)

**Backend - NEW:**
- `src/routes/evaluation.ts` (6 new endpoints)
- `src/services/evaluation.service.ts` (evaluation operations)
- `src/middleware/roleCheck.ts` (EVALUATOR role guard)
- `src/types/evaluationSchema.ts` (Zod validation for evaluation payloads)

**Backend - MODIFIED:**
- `src/routes/ideas.ts` (add history endpoint)
- `src/services/ideas.service.ts` (get idea by ID with full context)

**Database:**
- `prisma/schema.prisma` (add IdeationEvaluation model, extend status enum)

### Implementation Hints
- Use React Query for API state management + mutation handling
- Implement skeleton loaders (Tailwind CSS or shadcn/ui Skeleton component)
- Use React Context for role-based view switching (integrates with STORY-1.4 RBAC)
- Create reusable StatusBadge component (used in both user + evaluator views)
- Use Prisma aggregation for statistics in user view
- Debounce bulk selection updates to prevent excessive re-renders
- Store evaluation modal form state locally until submit
- Archive evaluation history records (immutable, not deleted)
- Consider webhook for async CSV export (if file >5MB)

### Known Limitations or Considerations
- User view shows only own ideas; evaluator view shows all ideas with SUBMITTED/UNDER_REVIEW status
- No real-time notifications (evaluator must refresh queue for new submissions)
- Evaluation comments max 500 chars (extensible in Phase 2)
- Bulk operations limited to 100 items per request (prevent query timeout)
- Archive functionality excluded (future enhancement)
- Multi-evaluator assignment deferred (single evaluator per idea in Phase 1)

---

## Estimation & Effort

**Story Points:** 8  
**OR Estimated Days:** 4-5 days

**Estimation Rationale:**  
High-complexity story involving dual-role dashboard, evaluator queue, bulk operations, immutable audit trail, and comprehensive testing. Breakdown:
- User view components (40%): Dashboard, list, stats, pagination, responsive design
- Evaluator queue components (35%): Queue table, evaluation modal, bulk actions bar, history timeline
- Backend endpoints (20%): 6 new REST endpoints + role-based authorization + database queries
- Testing (5%): Unit tests for components, integration tests for evaluation workflow, E2E for role switching

Increased from 5 to 8 points due to: multi-role complexity, bulk operations, immutable audit trail requirements, additional backend endpoints, and cross-role testing.

**Risk Level:** MEDIUM  
**Risk Reason:** Role-based view switching requires tight integration with STORY-1.4 RBAC; evaluator bulk operations need careful permission checks; audit trail immutability must be enforced at database level. Mitigations: coordinate with RBAC implementer, add role guards at middleware level, use database constraints for audit trail.

---

## Dependencies & Blockers

### Story Dependencies
- ✅ **STORY-2.1** (Submission Form) - Provides user submission data
- ✅ **STORY-2.2** (File Upload) - Backend API endpoint `/api/ideas` must exist
- ✅ **STORY-1.2** (Auth0 Integration) - Authentication/authorization middleware
- 🔴 **STORY-1.4** (RBAC) - **REQUIRED** for evaluator role detection + role-based view switching (BLOCKING)
- 📋 **STORY-2.4** (Sort & Filter) - Deferred; evaluation queue can use basic sorting only

### Blockers
- 🔴 **STORY-1.4 (RBAC) must be completed first** - Cannot implement evaluator view without role detection mechanism
- Database migration for new IdeationEvaluation model + indexes must run before evaluation endpoints go live

---

## INVEST Validation Checklist

- [ ] **Independent** - BLOCKED by STORY-1.4 (RBAC) for role detection; cannot start evaluator view without role context
- [x] **Negotiable** - Bulk operation limits (100 items), evaluation comment length (500 chars) can be adjusted
- [x] **Valuable** - Delivers critical value for both submitters (track ideas) and evaluators (review queue)
- [x] **Estimable** - Well-understood requirements post-clarification; 8 story points with dependencies identified
- [ ] **Small** - Increased scope adds complexity; now requires 4-5 days instead of 2-3 (NO longer fits small category; split recommended if needed)
- [x] **Testable** - Clear AC (16 criteria) with verifiable outcomes; role-based testing required
---

## Acceptance Sign-Off

| Role | Name | Date | Notes |
|------|------|------|-------|
| Product Owner | [PENDING] | [TBD] | [AWAITING REVIEW] |
| Tech Lead | [PENDING] | [TBD] | [AWAITING REVIEW] |
| QA Lead | [PENDING] | [TBD] | [AWAITING REVIEW] |

---

## Related Information

**Related User Stories:**
- [STORY-2.1: Submission Form](STORY-2.1-Submission-Form.md) - Prerequisite data source
- [STORY-2.2: File Upload](STORY-2.2-File-Upload.md) - API endpoint GET /api/ideas source
- [STORY-1.4: RBAC](../STORY-1.4-RBAC.md) - **BLOCKING DEPENDENCY** for role detection
- [STORY-2.4: Sort & Filter](STORY-2.4-Sort-Filter.md) - Enhancement to queue filtering (Phase 2)
- [STORY-2.5: Detail Page](STORY-2.5-Detail-Page.md) - Idea detail destination on row click
- [STORY-1.5: Logout & Timeout](../STORY-1.5-Logout-Timeout.md) - Session management during evaluation

**Epic:**
- [EPIC-2: Idea Submission Management](../epics/EPIC-2-Idea-Submission-Management.md)
- [EPIC-1: User Authentication & Authorization](../epics/EPIC-1-User-Authentication.md) - RBAC component

**Related Branches:**
- Backend API: `feat/story-2.2-file-upload` (GET /api/ideas endpoint available)
- Dashboard (User + Evaluator): `feat/story-2.3-dashboard` (NEW branch with dual views)
- RBAC: `feat/story-1.4-rbac` (REQUIRED; must merge before STORY-2.3 implementation)
