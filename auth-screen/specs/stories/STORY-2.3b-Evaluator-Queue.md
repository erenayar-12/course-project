# STORY-2.3b: Create Evaluator "Evaluation Queue" with Bulk Operations

## Story ID & Title
**Story ID:** STORY-2.3b  
**Title:** Create Evaluator "Evaluation Queue" - Idea Review List with Bulk Operations & Audit Trail  
**Epic:** EPIC-2 (Idea Submission Management)  
**Sprint/Milestone:** Sprint 2 (Phase 2)  
**Status:** APPROVED  
**Priority:** P1 (Critical)  
**Created:** February 25, 2026  
**Split From:** STORY-2.3 (Option B - Phase 2)  
**Blocks:** None  
**Blocked By:** STORY-1.4 (RBAC for role detection)

---

## ✅ Clarifications Integrated (Feb 25, 2026)

This specification has been clarified and is ready for planning. Key clarifications:

- **Queue Sort:** Newest first (createdAt DESC) - most recent submissions at top
- **Status Filter:** All open statuses shown (SUBMITTED, UNDER_REVIEW, NEEDS_REVISION) 
- **Evaluation UX:** Multiple evaluators can evaluate same idea (new records created, not replaced)
- **Status Badges:** Color-coded - reuse StatusBadge from STORY-2.3a
- **CSV Export:** All table columns (Submitter, Title, Category, Date, Status, Attachments, Assigned To)

See [STORY-2.3b-CLARIFICATIONS.md](../../STORY-2.3b-CLARIFICATIONS.md) for detailed clarification notes.

---

## User Story

**As a** evaluator/admin  
**I want** to view all submitted ideas in a centralized evaluation queue  
**so that** I can batch-review ideas, update statuses, add evaluation comments, and track evaluation history efficiently

### Story Context
Evaluators need a dedicated evaluation queue showing all submitted ideas from all users. The queue enables them to efficiently batch-review ideas, update statuses, add evaluation comments, manage the evaluation workflow, and maintain a complete immutable audit trail for compliance. This supports the idea review workflow spanning from submission through approval/rejection.

---

## Acceptance Criteria

### AC 12: Evaluator Sees Idea Evaluation Queue (Role-Based View)
- **Given** authenticated user with "evaluator" role navigates to /evaluation-queue
- **When** dashboard loads
- **Then** evaluator sees "Evaluation Queue" tab (not "My Ideas")
- **And** queue displays all ideas with status SUBMITTED, UNDER_REVIEW, NEEDS_REVISION from all users (not just own)
  - CLARIFICATION: Shows all "open" evaluation statuses (not ACCEPTED/REJECTED/DRAFT)
  - CLARIFICATION: Sorted by createdAt DESC (newest submissions first)
- **And** unauthenticated or non-evaluator users are redirected to /login or their allowed dashboard

### AC 13: Evaluation Queue Shows Required Columns
- **Given** evaluator views the evaluation queue
- **When** queue renders
- **Then** each row displays: Submitter Name, Title, Category, Submission Date, Current Status (badge), Attachment count
  - CLARIFICATION: Status badge uses color-coding (SUBMITTED=blue, UNDER_REVIEW=yellow, NEEDS_REVISION=orange) - reuse StatusBadge from STORY-2.3a
  - CLARIFICATION: Attachment count shown as text or icon (e.g., "📎 2 files")
  - CLARIFICATION: Queue sorted by createdAt DESC (newest first)
- **And** an "Actions" column with "Review" button
- **And** checkbox column for bulk selection

### AC 14: Status Update Modal with Evaluation Comments
- **Given** evaluator clicks "Review" button for an idea
- **When** modal/slide-out opens
- **Then** evaluator can:
  - Select new status from dropdown: ACCEPTED, REJECTED, NEEDS_REVISION
  - Enter evaluation comments (text area, max 500 chars with counter)
  - Optionally attach evaluation notes file (file upload)
  - Submit changes button submits to backend
  - Cancel button closes modal without saving
  - CLARIFICATION: If idea has prior evaluation history, it's displayed below modal in read-only format
  - CLARIFICATION: Evaluator can SUBMIT NEW evaluation (creates new history record) - allows multiple evaluators to evaluate same idea sequentially
- **And** original submission and all prior evaluation history remain visible below modal
- **And** success toast shows after submission

### AC 15: Bulk Evaluation Actions (Select, Update, Assign, Export)
- **Given** evaluator views the evaluation queue
- **When** evaluator selects multiple ideas via checkboxes
- **Then** bulk actions become available:
  - "Bulk Status Update" to assign same status to selected ideas
  - "Bulk Assign" to reassign evaluation to another evaluator  
  - "Export CSV" to download selected ideas as CSV
    - CLARIFICATION: CSV includes ALL table columns: Submitter, Title, Category, Submission Date, Status, Attachment Count, Assigned To (evaluator)
- **And** bulk actions include confirmation dialog before executing
- **And** operation limited to 100 items maximum per request (prevent timeout)
- **And** CSV export limited to 100 items per request

### AC 16: Evaluation History Visible in Detail View (Immutable Audit Trail)
- **Given** evaluator opens an idea for review
- **When** detail view renders
- **Then** below the idea details, a "Evaluation History" section shows:
  - Each status change with [Date, Evaluator Name, Status, Comments]
  - Threaded comment history if multiple evaluations occurred
  - Original submission metadata [Submitter, Date, Category]
- **And** history is displayed in immutable/read-only format (no edit/delete buttons)
- **And** audit trail is complete and audit-compliant (no records deleted)

---

## Definition of Acceptance

All acceptance criteria must pass automated tests and user/QA sign-off:

- [ ] All 5 acceptance criteria verified and passing (AC 12-16)
- [ ] Admin/Evaluator view: Evaluation queue displays all submitted ideas
- [ ] Status updates with comments work end-to-end
- [ ] Bulk actions (select, update, assign, export) are functional
- [ ] Evaluation history audit trail visible and immutable
- [ ] Role-based access enforced (ProtectedRoute + backend middleware)
- [ ] Code changes reviewed and approved
- [ ] Unit tests written (>80% coverage on new components)
- [ ] Integration tests passing (API endpoints + role validation)
- [ ] E2E tests covering evaluator workflow
- [ ] No console errors or warnings
- [ ] Responsive design verified on mobile/tablet/desktop
- [ ] Performance verified (loads <3 seconds with 100 ideas)
- [ ] Bulk operations performance verified (<2 seconds for 100 items)
- [ ] CSV export performance verified (<10 seconds for 100 ideas)
- [ ] Merged to main branch

---

## Implementation Details

### Frontend (React/TypeScript)

**New Components:**
- `src/pages/EvaluationQueue.tsx` - Evaluator "Evaluation Queue" page
- `src/components/EvaluationQueueRow.tsx` - Evaluation queue row with checkbox + Review button
- `src/components/EvaluationModal.tsx` - Status update + comment modal form
- `src/components/BulkActionsBar.tsx` - Bulk selection & action controls (select, update, assign, export)
- `src/components/EvaluationHistory.tsx` - Immutable evaluation timeline component
- `src/types/evaluationTypes.ts` - TypeScript interfaces for evaluation data

**Reused from STORY-2.3a:**
- `src/components/StatusBadge.tsx` - Reusable status badge component

**Implementation Tasks:**
- [ ] Implement EvaluationQueue page component with role-based access check
- [ ] Fetch queue from `GET /api/evaluation-queue?status=SUBMITTED,UNDER_REVIEW&limit=10&offset=0`  
- [ ] Create EvaluationQueueRow component with checkbox + Review button
- [ ] Implement pagination for evaluation queue
- [ ] Create EvaluationModal component with form validation (Zod)
  - [ ] Status dropdown (3 options: ACCEPTED, REJECTED, NEEDS_REVISION)
  - [ ] Comments textarea with max 500 char counter
  - [ ] File upload input for evaluation notes
  - [ ] Submit button calls `POST /api/ideas/:ideaId/evaluate`
- [ ] Implement BulkActionsBar with checkbox selection tracking
  - [ ] Show action buttons only when items selected
  - [ ] "Bulk Status Update" → modal with status dropdown → `POST /api/evaluation-queue/bulk-status-update`
  - [ ] "Bulk Assign" → modal with evaluator dropdown → `POST /api/evaluation-queue/bulk-assign`
  - [ ] "Export CSV" → `GET /api/evaluation-queue/export?ids=...` download
  - [ ] 100-item limit validation with user feedback
- [ ] Implement EvaluationHistory component
  - [ ] Display audit trail (immutable, read-only)
  - [ ] Show each evaluation: date, evaluator name, status, comments, file
- [ ] Add loading skeleton loaders for queue + modal
- [ ] Add error handling with retry buttons
- [ ] Implement responsive design (mobile/tablet/desktop)
- [ ] Integrate with StatusBadge component (from STORY-2.3a)

### Backend (Node.js/Express)

**New Endpoints (HTTP REST):**

1. **GET /api/evaluation-queue** - Fetch submitted ideas
   - Query params: `status=SUBMITTED,UNDER_REVIEW,NEEDS_REVISION&limit=10&offset=0` (all open statuses)
   - Default sort: createdAt DESC (newest first)
   - Auth middleware: Required (JWT)
   - Role: EVALUATOR or ADMIN (roleCheck middleware)
   - Response: `{ ideas: [], pagination: { total, page, pages }, lastEvaluatedAt }`
   - CLARIFICATION: Returns all ideas with open evaluation statuses (excludes ACCEPTED/REJECTED/DRAFT)

2. **POST /api/ideas/:ideaId/evaluate** - Submit evaluation
   - Body: `{ status: string, comments: string, fileUrl?: string }`
   - Auth: Required
   - Role: EVALUATOR or ADMIN
   - Response: `{ idea: {...}, evaluation: {...}, evaluationHistory: [] }`
   - Creates IdeationEvaluation record + updates idea status

3. **PUT /api/ideas/:ideaId/evaluate** - Update evaluation
   - Body: Same as POST
   - Auth: Required
   - Role: EVALUATOR or ADMIN
   - Updates existing evaluation (if not finalized)

4. **GET /api/ideas/:ideaId/evaluation-history** - Fetch audit trail
   - Auth: Required
   - Response: `{ evaluations: [{ id, evaluatorId, evaluatorName, status, comments, fileUrl, createdAt }] }`

5. **POST /api/evaluation-queue/bulk-status-update** - Batch status update
   - Body: `{ ideaIds: string[], status: string }`
   - Max 100 items per request
   - Auth: Required
   - Role: EVALUATOR or ADMIN
   - Response: `{ updated: number, failed: number, errors: [] }`

6. **POST /api/evaluation-queue/bulk-assign** - Reassign to evaluator
   - Body: `{ ideaIds: string[], assigneeId: string }`
   - Auth: Required
   - Role: EVALUATOR or ADMIN
   - Response: `{ assigned: number, errors: [] }`

7. **GET /api/evaluation-queue/export** - Export as CSV
   - Query: `ids=id1,id2,id3&format=csv`
   - Auth: Required
   - Role: EVALUATOR or ADMIN
   - Response: CSV file download
   - Max 100 items per request

**Service Layer Implementation:**
- `evaluation.service.ts` (NEW):
  - `getEvaluationQueue(filters)` - Query all submitted ideas with pagination
  - `submitEvaluation(ideaId, status, comments, fileUrl)` - Create evaluation record
  - `updateEvaluation(ideaId, status, comments, fileUrl)` - Update existing evaluation
  - `getEvaluationHistory(ideaId)` - Fetch immutable audit trail
  - `bulkStatusUpdate(ideaIds, newStatus)` - Batch update status
  - `bulkAssign(ideaIds, assigneeId)` - Reassign ideas
  - `exportToCSV(ideaIds)` - Generate CSV

**Middleware:**
- Use existing `authMiddleware` (handles JWT verification + role extraction)
- Use `roleCheck(['evaluator', 'admin'])` on evaluation endpoints
- Add file upload middleware for evaluation file storage

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

// Extend Idea model - ADD relation
model Idea {
  // ... existing fields
  evaluations     IdeationEvaluation[]  // NEW
}

// Extend User model - ADD relation
model User {
  // ... existing fields
  evaluations     IdeationEvaluation[]  // NEW (evaluator's evaluations)
}

// Extend status enum - ADD new statuses
enum IdeaStatus {
  DRAFT
  SUBMITTED         // Initial submission by user
  UNDER_REVIEW      // Evaluator has claimed for review
  NEEDS_REVISION    // Evaluator requests changes before acceptance
  ACCEPTED
  REJECTED
}
```

**Database Indexes:**
```sql
CREATE INDEX idx_ideas_status_created ON ideas(status, created_at DESC);
CREATE INDEX idx_evaluations_idea ON ideation_evaluations(idea_id);
CREATE INDEX idx_evaluations_evaluator_created ON ideation_evaluations(evaluator_id, created_at DESC);
```

---

## Technical Notes

### Technology Stack
- **Frontend:** React 18, TypeScript, Tailwind CSS, React Query (mutations), React Hook Form
- **Backend:** Node.js/Express, Prisma ORM, PostgreSQL
- **API:** RESTful (7 new endpoints)
- **Audit Trail:** Immutable IdeationEvaluation records (no deletion, database constraints)
- **File Upload:** Multer (consistent with STORY-2.2)
- **Role-Based Access:** JWT + roleCheck middleware (STORY-1.4)

### Files/Components Affected

**Frontend - NEW:**
- `src/pages/EvaluationQueue.tsx` (page)
- `src/components/EvaluationQueueRow.tsx` (table row)
- `src/components/EvaluationModal.tsx` (form modal)
- `src/components/BulkActionsBar.tsx` (bulk controls)
- `src/components/EvaluationHistory.tsx` (audit timeline)
- `src/types/evaluationTypes.ts` (interfaces)

**Frontend - MODIFIED:**
- `src/pages/Dashboard.tsx` (add role-based routing)
- `src/App.tsx` (add /evaluation-queue route)

**Backend - NEW:**
- `src/routes/evaluation.ts` (7 endpoints)
- `src/services/evaluation.service.ts` (core logic)
- `src/types/evaluationSchema.ts` (Zod validation schemas)

**Backend - MODIFIED:**
- `src/middleware/roleCheck.ts` (already created for STORY-1.4)
- `src/middleware/auth.ts` (already has role extraction)
- `prisma/schema.prisma` (add IdeationEvaluation model + status enum)

### Implementation Hints
- Sort queue by createdAt DESC - show newest submissions first (CLARIFIED)
- Use React Query for API mutations (POST, PUT, bulk operations)
- Implement skeleton loaders for queue and modal
- Use React Context or URL params for role-based view switching
- Create reusable BulkConfirmationDialog component
- Debounce bulk selection to prevent excessive re-renders
- Store evaluation form state locally until submit (don't lose data on cancel)
- Use database constraints to enforce audit trail immutability (cascade delete on idea, but not on evaluation)
- Consider async CSV export for >1000 items (webhook callback)
- Reuse StatusBadge component from STORY-2.3a with color-coding (CLARIFIED)
- Multiple evaluations per idea allowed - each creates new audit record (CLARIFIED)
- CSV export includes all table columns: Submitter, Title, Category, Date, Status, Attachments, Assigned To (CLARIFIED)

### Known Limitations or Considerations
- Queue shows all open evaluation statuses: SUBMITTED, UNDER_REVIEW, NEEDS_REVISION (not ACCEPTED/REJECTED/DRAFT)
- Multiple evaluators can evaluate the same idea sequentially (new evaluation record created, not replaced)
- Evaluator can only see ideas with open statuses (not already approved/rejected)
- No real-time notifications for new submissions (evaluator must refresh)
- Evaluation comments limited to 500 chars (extensible in Phase 2)
- Bulk operations limited to 100 items per request (prevent query timeout)
- CSV export limited to 100 items per request
- No dynamic evaluator reassignment queue balancing (manual in Phase 1)
- Archive functionality excluded (future enhancement)
- Multi-language comments not tested (Phase 2)

---

## Estimation & Effort

**Story Points:** 8  
**OR Estimated Days:** 4-5 days

**Estimation Rationale:**  
High-complexity story involving dual-role integration, evaluator queue UI, bulk operations, evaluation modal, and immutable audit trail. Breakdown:
- Evaluator queue components (35%): EvaluationQueue, table, pagination, role-based access
- Evaluation modal + history (30%): Form with validation, file upload, immutable timeline
- Bulk operations (25%): Selection, status update, reassign, CSV export
- Backend API (20%): 7 endpoints + role middleware + database model
- Testing (10%): Unit, integration, E2E for evaluator workflow

Increased from combined 5+8 split due to: multi-role complexity, bulk operations, immutable audit trail, role-based access enforcement.

**Risk Level:** MEDIUM  
**Risk Reason:** 
- Depends on STORY-1.4 RBAC (role detection in context)
- Bulk operations need careful permission checks
- Audit trail immutability critical (compliance)
- Database migration + new model introduces risk

**Mitigations:**
- Coordinate closely with STORY-1.4 implementation
- Add role validation at both frontend (ProtectedRoute) and backend (middleware)
- Use database constraints (ON DELETE RESTRICT) to prevent audit trail deletion
- Test migration with backup database first
- Load test bulk operations with 1000+ items

---

## Dependencies & Blockers

### Story Dependencies
- ✅ **STORY-2.1** (Submission Form) - Provides idea data
- ✅ **STORY-2.2** (File Upload) - Backend API endpoint `/api/ideas` exists
- ✅ **STORY-1.2** (Auth0 Integration) - Authentication middleware
- 🔴 **STORY-1.4** (RBAC)** - **REQUIRED BLOCKER** for role detection + middleware
- 📋 **STORY-2.3a** (User Dashboard) - Can develop in parallel; reuses some components
- 📋 **STORY-2.4** (Sort & Filter) - Optional enhancement for queue filtering (Phase 2)

### Blockers
- 🔴 **STORY-1.4 (RBAC) MUST be merged first**
  - Cannot check role without role detection mechanism
  - Cannot guard endpoints without role middleware
- Database migration must be executed before deployment
- All STORY-2.2 backend endpoints must be working

---

## INVEST Validation Checklist

- [ ] **Independent** - Blocks on STORY-1.4; cannot start role-gated features without role detection
- [x] **Negotiable** - Bulk limits (100 items), comment length (500 chars), CSV format adjustable
- [x] **Valuable** - Delivers critical value for evaluators; enables idea review workflow
- [x] **Estimable** - Well-understood requirements; 8 points with clear breakdown
- [ ] **Small** - HIGH complexity; requires 4-5 days (larger than ideal; consider Phase 2 split)
- [x] **Testable** - Clear AC (5 criteria) with verifiable outcomes; role-based testing required

---

## Acceptance Sign-Off

| Role | Name | Date | Notes |
|------|------|------|-------|
| Product Owner | [PENDING] | [TBD] | Evaluator queue + bulk ops verified |
| Tech Lead | [PENDING] | [TBD] | RBAC integration, audit trail design reviewed |
| QA Lead | [PENDING] | [TBD] | Test coverage, E2E workflow, performance verified |

---

## Related Information

**Related User Stories:**
- [STORY-2.3a: User Dashboard](STORY-2.3a-User-Dashboard.md) - Parallel story (Phase 1, can start now)
- [STORY-2.1: Submission Form](STORY-2.1-Submission-Form.md) - Prerequisite data
- [STORY-2.2: File Upload](STORY-2.2-File-Upload.md) - API endpoint + file handling
- [STORY-1.4: RBAC](../STORY-1.4-RBAC.md) - **BLOCKING DEPENDENCY** - must merge first
- [STORY-2.4: Sort & Filter](STORY-2.4-Sort-Filter.md) - Queue enhancement (Phase 2)
- [STORY-2.5: Detail Page](STORY-2.5-Detail-Page.md) - Idea details view (Phase 2)

**Epic:**
- [EPIC-2: Idea Submission Management](../epics/EPIC-2-Idea-Submission-Management.md)
- [EPIC-1: User Authentication & Authorization](../epics/EPIC-1-User-Authentication.md)

**Related Branches:**
- Backend API: `feat/story-2.2-file-upload` (existing endpoints)
- RBAC: `feat/story-1.4-rbac` (REQUIRED - must merge before this)
- Frontend: `feat/story-2.3a-user-dashboard` (parallel, can merge first)
- Evaluation Queue: `feat/story-2.3b-evaluation-queue` (this story - start after STORY-1.4)
