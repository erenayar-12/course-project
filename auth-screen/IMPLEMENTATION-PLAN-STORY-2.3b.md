# Implementation Plan: STORY-2.3b - Evaluator Queue

**Document ID:** STORY-2.3b-IMPL-PLAN  
**Date Created:** February 25, 2026  
**Status:** READY FOR IMPLEMENTATION  
**Reference Spec:** [specs/stories/STORY-2.3b-Evaluator-Queue.md](specs/stories/STORY-2.3b-Evaluator-Queue.md)  
**Convention:** Per `agents.md` sections 2-4  
**Epic:** EPIC-2 (Idea Submission Management)  
**Story Points:** 8  
**Estimated Time:** 4-5 days  
**Depends On:** STORY-1.4 (RBAC - ✅ Complete)

---

## 1. Executive Summary

Implement "Evaluation Queue" for evaluators and admins to review submitted ideas, provide feedback with status updates and comments, perform bulk operations, and maintain an immutable audit trail for compliance.

**Key Features:**
- Role-based access (evaluator/admin only view)
- Queue displays all open evaluation statuses (SUBMITTED, UNDER_REVIEW, NEEDS_REVISION)
- Sorted by newest first (createdAt DESC)
- Evaluation modal with status selection and comment capture
- Bulk operations: status update, evaluator assignment, CSV export
- Immutable audit trail showing all evaluations

**What's Done:**
- ✅ 5 AC specified with all technical details
- ✅ Clarifications integrated (sort order, status filtering, multiple evaluations, CSV format)
- ✅ Backend dependencies ready (STORY-1.4 RBAC + roleCheck middleware)
- ✅ Reusable component (StatusBadge from STORY-2.3a)

**What's Needed:**
- [ ] Frontend: 5 components (EvaluationQueue, EvaluationQueueRow, EvaluationModal, BulkActionsBar, EvaluationHistory)
- [ ] Backend: 7 API endpoints with role validation
- [ ] Database: IdeationEvaluation model + schema migration
- [ ] Testing: Unit, integration, E2E tests for evaluator workflow

---

## 2. Acceptance Criteria Implementation Roadmap

### AC 12: Evaluator Sees Idea Evaluation Queue (Role-Based View)

**Requirement:** Evaluators see all submitted ideas from all users in a centralized queue  
**Statuses Included:** SUBMITTED, UNDER_REVIEW, NEEDS_REVISION  
**Sorting:** Newest first (createdAt DESC)  
**Role Gate:** Evaluator or Admin only → Redirect non-evaluators to /login or dashboard

**Task Breakdown:**

- [ ] **Frontend: Pages**
  - [ ] Create `src/pages/EvaluationQueue.tsx`
    - [ ] Wrap with ProtectedRoute: `requiredRoles={['evaluator', 'admin']}`
    - [ ] Load authenticatedUser from Auth0Context
    - [ ] Initialize state: `ideas: Idea[]`, `currentPage: number = 1`, `selectedIds: Set<string> = new Set()`, `loading: boolean`, `error: string | null`
    - [ ] Fetch: `GET /api/evaluation-queue?status=SUBMITTED,UNDER_REVIEW,NEEDS_REVISION&limit=10&offset=0&sort=-createdAt`
    - [ ] Display ideas in table format with checkboxes
    - [ ] Show loading spinner while fetching
    - [ ] Show error with retry on failure

- [ ] **Backend: API Endpoint**
  - [ ] Create `src/routes/evaluation.ts` (or add to evaluation.service.ts routes)
  - [ ] Implement `GET /api/evaluation-queue`
    - [ ] Middleware: `authMiddleware → roleCheck(['evaluator', 'admin'])`
    - [ ] Query params: `status=SUBMITTED,UNDER_REVIEW,NEEDS_REVISION&limit=10&offset=0&sort=-createdAt`
    - [ ] Default sort: `ORDER BY ideas.created_at DESC`
    - [ ] Return: `{ ideas: [ { id, title, submitterName, category, createdAt, status, attachmentCount, assignedEvaluator } ], pagination: { total, page, pages } }`
    - [ ] Test: Only return open statuses (exclude DRAFT, ACCEPTED, REJECTED)
    - [ ] Test: Authenticator enforces evaluator role (403 for submitter)

- [ ] **Database: Ensure statuses exist**
  - [ ] Verify Prisma schema has IdeaStatus enum with all values
  - [ ] Existing statuses: DRAFT, SUBMITTED, UNDER_REVIEW, ACCEPTED, REJECTED
  - [ ] Add: NEEDS_REVISION status to enum

**Test Tasks:**
- [ ] Unit test: API endpoint returns correct statuses only
- [ ] Integration test: Frontend loads queue successfully
- [ ] Integration test: Error handling on API failure
- [ ] E2E test: Evaluator can access queue, submitter redirect
- [ ] E2E test: Queue shows all open statuses sorted DESC

---

### AC 13: Evaluation Queue Shows Required Columns

**Columns to Display:**
1. Checkbox (for bulk selection)
2. Submitter Name
3. Title
4. Category
5. Submission Date (format: "Feb 25, 2026")
6. Current Status (color-coded badge)
7. Attachment Count (icon + count)
8. Actions (Review button)

**Task Breakdown:**

- [ ] **Frontend: Components**
  - [ ] Create `src/components/EvaluationQueueRow.tsx`
    - [ ] Props: `idea: Idea`, `isSelected: boolean`, `onSelect: (id) => void`, `onReview: (id) => void`
    - [ ] Render checkbox with selection handler
    - [ ] Render submitter name (from idea.user.name)
    - [ ] Render title (truncate if >50 chars)
    - [ ] Render category (PRODUCT, SERVICE, PROCESS, OTHER)
    - [ ] Render createdAt (formatted date)
    - [ ] Render StatusBadge component (reuse from STORY-2.3a) with color coding
    - [ ] Render attachment icon + count (e.g., "📎 2 files")
    - [ ] Render "Review" button → calls onReview(id)
    - [ ] Responsive: Full table on desktop, card layout on mobile

  - [ ] Update `src/pages/EvaluationQueue.tsx`
    - [ ] Loop through ideas array, render EvaluationQueueRow for each
    - [ ] Pass checkbox selection state and handlers
    - [ ] Pass Review button click handler → open evaluation modal

- [ ] **Backend: Ensure data structure**
  - [ ] GET /api/evaluation-queue response includes:
    - [ ] `id: string`
    - [ ] `title: string`
    - [ ] `submitterName: string` (from idea.user.name)
    - [ ] `category: IdeaCategory`
    - [ ] `createdAt: datetime`
    - [ ] `status: IdeaStatus`
    - [ ] `attachments: Attachment[]` (for count)

**Test Tasks:**
- [ ] Unit test: EvaluationQueueRow renders all columns
- [ ] Unit test: Checkbox selection handler works
- [ ] Unit test: Review button click handler fires
- [ ] Unit test: Status badge color codes correctly
- [ ] Unit test: Attachment count formats correctly
- [ ] Integration test: Full table renders with data
- [ ] E2E test: Table layout on desktop, card layout on mobile

---

### AC 14: Status Update Modal with Evaluation Comments

**Modal Features:**
- Status dropdown: ACCEPTED, REJECTED, NEEDS_REVISION
- Comments textarea: max 500 chars with counter
- Optional file upload for evaluation notes
- Submit button (saves evaluation)
- Cancel button (closes without saving)
- Show prior evaluation history below modal
- Success toast notification on submission

**Task Breakdown:**

- [ ] **Frontend: Components**
  - [ ] Create `src/components/EvaluationModal.tsx`
    - [ ] Props: `idea: Idea`, `isOpen: boolean`, `onClose: () => void`, `onSubmit: (data) => Promise<void>`
    - [ ] Dialog/Modal container (dark overlay, centered card)
    - [ ] Implement form with React Hook Form:
      - [ ] Status dropdown (3 options: ACCEPTED, REJECTED, NEEDS_REVISION)
      - [ ] Comments textarea (max 500 chars) with live character counter
      - [ ] File upload input (optional, for evaluation notes)
      - [ ] Form validation with Zod schema
    - [ ] Form validation rules:
      - [ ] Status: required, one of 3 values
      - [ ] Comments: required, 10-500 chars
      - [ ] File: optional, max 10MB, allowed formats
    - [ ] Submit button: calls onSubmit with form data
    - [ ] Cancel button: calls onClose
    - [ ] Loading state during submission (disable buttons, show spinner)
    - [ ] Success/Error toast messages

  - [ ] Create `src/components/EvaluationHistory.tsx` (displayed BELOW modal)
    - [ ] Props: `idea: Idea`, `evaluations: IdeationEvaluation[]`
    - [ ] Display immutable audit trail:
      - [ ] Each evaluation as timeline entry: [Date, Evaluator Name, Status, Comments, File Link]
      - [ ] Render in descending order (newest first)
      - [ ] Read-only format (no edit/delete buttons)
      - [ ] Original submission info at bottom: [Submitter, Date, Category]

  - [ ] Update `src/pages/EvaluationQueue.tsx`
    - [ ] Track modal state: `selectedIdeaId: string | null`, `isModalOpen: boolean`
    - [ ] On Review button click: set selectedIdeaId, open modal
    - [ ] On modal submit: call evaluation API, refresh queue
    - [ ] On modal close: clear selectedIdeaId, close modal

- [ ] **Backend: API Endpoints**
  - [ ] Implement `POST /api/ideas/:ideaId/evaluate`
    - [ ] Middleware: `authMiddleware → roleCheck(['evaluator', 'admin'])`
    - [ ] Body: `{ status: 'ACCEPTED' | 'REJECTED' | 'NEEDS_REVISION', comments: string, fileUrl?: string }`
    - [ ] Validation: status in enum, comments 10-500 chars
    - [ ] Action: Call `evaluationService.submitEvaluation(ideaId, evaluatorId, { status, comments, fileUrl })`
    - [ ] Database: Create new IdeationEvaluation record (multiple evaluations per idea allowed)
    - [ ] Response: `{ success: true, evaluation: { id, ideaId, evaluatorId, status, comments, createdAt }, history: [ ... ] }`
    - [ ] Test: Role validation (403 for submitter)
    - [ ] Test: Status validation
    - [ ] Test: Comments validation
    - [ ] Test: Create evaluation record (not replace)

  - [ ] Implement `GET /api/ideas/:ideaId/evaluation-history`
    - [ ] Middleware: `authMiddleware → roleCheck(['evaluator', 'admin'])`
    - [ ] Returns: `{ evaluations: [ { id, evaluatorId, evaluatorName, status, comments, fileUrl, createdAt } ], originalSubmission: { submitterName, submitterId, submittedAt, category } }`
    - [ ] Sort by createdAt DESC (newest first)
    - [ ] Test: Returns all evaluations for idea
    - [ ] Test: Read-only (no POST/PUT to history endpoint)

**Test Tasks:**
- [ ] Unit test: Form validation (status, comments, file)
- [ ] Unit test: Character counter updates
- [ ] Unit test: Status dropdown options
- [ ] Unit test: File upload validation
- [ ] Integration test: Modal form submission
- [ ] Integration test: API creates new evaluation record
- [ ] Integration test: Multiple evaluations don't overwrite
- [ ] Integration test: Evaluation history displays correctly
- [ ] E2E test: Open modal → fill form → submit → success toast
- [ ] E2E test: Close modal → no data saved
- [ ] E2E test: History shows all evaluations

---

### AC 15: Bulk Evaluation Actions (Select, Update, Assign, Export)

**Bulk Actions:**
1. Bulk Status Update: Apply same status to multiple ideas
2. Bulk Assign: Reassign evaluation to another evaluator
3. Export CSV: Download selected ideas as CSV file

**Constraints:**
- All bulk operations limited to 100 items maximum
- Confirmation dialog before executing
- Success/Error toast notifications

**Task Breakdown:**

- [ ] **Frontend: Components**
  - [ ] Create `src/components/BulkActionsBar.tsx`
    - [ ] Props: `selectedCount: number`, `selectedIds: Set<string>`, `onBulkStatusUpdate: () => void`, `onBulkAssign: () => void`, `onExport: () => void`
    - [ ] Render only when `selectedCount > 0`
    - [ ] Display: "X items selected"
    - [ ] Show action buttons:
      - [ ] "Bulk Status Update" button
      - [ ] "Bulk Assign" button
      - [ ] "Export CSV" button
    - [ ] Label warning if selectedCount > 100: "Maximum 100 items per operation"

  - [ ] Create `src/components/BulkConfirmationDialog.tsx` (reusable)
    - [ ] Props: `isOpen: boolean`, `action: string`, `itemCount: number`, `onConfirm: () => void`, `onCancel: () => void`
    - [ ] Dialog with confirmation message
    - [ ] Confirm button (executes action)
    - [ ] Cancel button (closes dialog)
    - [ ] Example: "Are you sure you want to update status for 5 ideas?"

  - [ ] Update `src/pages/EvaluationQueue.tsx`
    - [ ] Track selected ideas: `selectedIds: Set<string>`
    - [ ] On checkbox change: update selectedIds set
    - [ ] Show BulkActionsBar when selectedIds.size > 0
    - [ ] Handle bulk status update:
      - [ ] Show BulkConfirmationDialog
      - [ ] Call evaluationService.bulkStatusUpdate(ideaIds, status)
      - [ ] Refresh queue after success
    - [ ] Handle bulk assign:
      - [ ] Show evaluator selection dialog
      - [ ] Call evaluationService.bulkAssign(ideaIds, evaluatorId)
      - [ ] Refresh queue after success
    - [ ] Handle export:
      - [ ] Call evaluationService.exportToCSV(ideaIds)
      - [ ] Download file on success
    - [ ] Validate: Limit operations to 100 items (show error if exceeded)
    - [ ] Clear selection after operation

  - [ ] Create `src/components/BulkStatusUpdateDialog.tsx`
    - [ ] Props: `isOpen: boolean`, `selectedCount: number`, `onConfirm: (status) => void`, `onCancel: () => void`
    - [ ] Status dropdown (3 options)
    - [ ] Confirmation button
    - [ ] Cancel button

  - [ ] Create `src/components/BulkAssignDialog.tsx`
    - [ ] Props: `isOpen: boolean`, `selectedCount: number`, `onConfirm: (evaluatorId) => void`, `onCancel: () => void`
    - [ ] Evaluator dropdown (list of available evaluators from API)
    - [ ] Confirmation button
    - [ ] Cancel button

- [ ] **Backend: API Endpoints**
  - [ ] Implement `POST /api/evaluation-queue/bulk-status-update`
    - [ ] Middleware: `authMiddleware → roleCheck(['evaluator', 'admin'])`
    - [ ] Body: `{ ideaIds: string[], status: string }`
    - [ ] Validation: ideaIds array, max 100 items, status in enum
    - [ ] Action: Call `evaluationService.bulkStatusUpdate(ideaIds, status, evaluatorId)`
    - [ ] Response: `{ success: true, updated: number, failed: number, errors: [] }`
    - [ ] Test: Role validation
    - [ ] Test: 100-item limit
    - [ ] Test: Create evaluation records for each idea

  - [ ] Implement `POST /api/evaluation-queue/bulk-assign`
    - [ ] Middleware: `authMiddleware → roleCheck(['evaluator', 'admin'])`
    - [ ] Body: `{ ideaIds: string[], assigneeId: string }`
    - [ ] Validation: ideaIds array, max 100 items, assigneeId exists
    - [ ] Action: Call `evaluationService.bulkAssign(ideaIds, assigneeId)`
    - [ ] Response: `{ success: true, assigned: number, errors: [] }`

  - [ ] Implement `GET /api/evaluation-queue/export`
    - [ ] Middleware: `authMiddleware → roleCheck(['evaluator', 'admin'])`
    - [ ] Query: `ids=id1,id2,id3&format=csv`
    - [ ] Validation: max 100 item IDs
    - [ ] Action: Call `evaluationService.exportToCSV(ideaIds)`
    - [ ] Response: CSV file download with Content-Disposition header
    - [ ] CSV columns: Submitter, Title, Category, Submission Date, Status, Attachment Count, Assigned To
    - [ ] Test: Generate valid CSV for selected ideas
    - [ ] Test: Correct columns and data format

- [ ] **Backend: Service Layer** (evaluation.service.ts)
  - [ ] Implement `bulkStatusUpdate(ideaIds: string[], status: string, evaluatorId: string)`
    - [ ] Validate 100-item limit
    - [ ] Loop through ideaIds, create IdeationEvaluation for each
    - [ ] Return { updated: number, failed: number, errors: [] }
  - [ ] Implement `bulkAssign(ideaIds: string[], assigneeId: string)`
    - [ ] Validate assignee exists (GET /users/:id)
    - [ ] Update assignment (depends on schema design)
    - [ ] Return { assigned: number, errors: [] }
  - [ ] Implement `exportToCSV(ideaIds: string[])`
    - [ ] Fetch ideas, evaluations, submitters
    - [ ] Format as CSV: [Submitter, Title, Category, Date, Status, Attachments, Assigned To]
    - [ ] Return CSV string for download

**Test Tasks:**
- [ ] Unit test: Bulk checkbox selection
- [ ] Unit test: 100-item limit validation
- [ ] Unit test: CSV generation format
- [ ] Integration test: Bulk status update API
- [ ] Integration test: Bulk assign API
- [ ] Integration test: CSV export API
- [ ] Integration test: Queue refreshes after bulk operation
- [ ] E2E test: Select multiple ideas → bulk status update → confirm → success
- [ ] E2E test: Select ideas → export CSV → download file
- [ ] E2E test: Bulk operations fail gracefully with error message

---

### AC 16: Evaluation History Visible in Detail View (Immutable Audit Trail)

**Audit Trail Requirements:**
- Each status change tracked: [Date, Evaluator Name, Status, Comments]
- Threaded comment history
- Original submission metadata: [Submitter, Date, Category]
- Read-only, immutable format (no edit/delete)
- Complete audit history (no records deleted)

**Task Breakdown:**

- [ ] **Frontend: Components**
  - [ ] Create `src/components/EvaluationHistory.tsx` (already mentioned in AC14)
    - [ ] Props: `evaluations: IdeationEvaluation[]`, `originalSubmission: { submitterName, submittedAt, category }`
    - [ ] Display timeline:
      - [ ] Newest evaluation at top (createdAt DESC)
      - [ ] Each entry: [Timestamp, Evaluator Name (colored badge), Status badge, Comments box, File link]
      - [ ] Original submission at bottom: "Submitted by [Name] on [Date] - [Category]"
    - [ ] Styling: Timeline with vertical line connecting entries
    - [ ] Read-only: No edit/delete buttons, read-only comment boxes
    - [ ] Responsive: Full timeline on desktop, stacked on mobile

- [ ] **Backend: Database**
  - [ ] Prisma schema: IdeationEvaluation model
    ```prisma
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
      @@index([createdAt])
    }
    ```
  - [ ] Database indexes for query performance:
    - [ ] `idx_evaluations_idea` on (idea_id)
    - [ ] `idx_evaluations_evaluator_created` on (evaluator_id, created_at DESC)
  - [ ] Add relations to Idea and User models
  - [ ] Migration: Run `npx prisma migrate dev --name add_ideation_evaluations`

  - [ ] Constraints for immutability:
    - [ ] No DELETE on IdeationEvaluation records (cascade delete on Idea only)
    - [ ] No UPDATE on createdAt timestamp
    - [ ] Optional: Soft delete pattern if deletion needed for compliance

- [ ] **Backend: API Endpoint** (already in AC14)
  - [ ] GET /api/ideas/:ideaId/evaluation-history
    - [ ] Returns all evaluations in DESC order
    - [ ] Includes evaluator name (from User relation)
    - [ ] Includes original submission info
    - [ ] Test: No deletions possible (immutable)

**Test Tasks:**
- [ ] Unit test: EvaluationHistory renders timeline correctly
- [ ] Unit test: Evaluations sorted DESC (newest first)
- [ ] Unit test: No edit/delete buttons present
- [ ] Integration test: API returns full history
- [ ] Integration test: History includes evaluator names
- [ ] Integration test: Multiple evaluations display correctly
- [ ] E2E test: View evaluation history → see all evaluations → no edit option
- [ ] E2E test: History persists after page refresh

---

## 3. Component & API Architecture

### Frontend Component Tree

```
src/pages/
  └── EvaluationQueue.tsx (255 lines)
      ├── State:
      │   ├── ideas: Idea[]
      │   ├── currentPage: number
      │   ├── selectedIds: Set<string>
      │   ├── selectedIdeaId: string | null (for modal)
      │   ├── isModalOpen: boolean
      │   ├── bulkAction: 'status' | 'assign' | null
      │   ├── loading: boolean
      │   ├── error: string | null
      │
      ├── Effects:
      │   └── useEffect(() => { fetchQueue() }, [currentPage])
      │
      └── Render:
          ├── ProtectedRoute (requiredRoles: evaluator/admin)
          ├── BulkActionsBar (selectedCount, onBulkStatusUpdate, onBulkAssign, onExport)
          ├── EvaluationQueueRow[] (ideas, selected state, handlers)
          ├── Pagination (currentPage, totalPages handlers)
          ├── EvaluationModal (if isModalOpen)
          │   ├── EvaluationHistory (shows prior evaluations)
          │   └── Modal form (status, comments, file upload)
          └── BulkConfirmationDialog (if confirming bulk action)

src/components/
  ├── EvaluationQueueRow.tsx (85 lines)
  │   ├── Props: idea, isSelected, onSelect, onReview
  │   ├── Renders: checkbox, submitter, title, category, date, status badge, attachments, review button
  │   └── Events: checkbox change, review click
  │
  ├── EvaluationModal.tsx (180 lines)
  │   ├── Props: idea, isOpen, onClose, onSubmit
  │   ├── Form:
  │   │   ├── Status dropdown (Zod validation)
  │   │   ├── Comments textarea (500 char counter)
  │   │   ├── File upload input
  │   │   ├── Submit/Cancel buttons
  │   │
  │   └── Contains: EvaluationHistory component below form
  │
  ├── EvaluationHistory.tsx (120 lines)
  │   ├── Props: evaluations, originalSubmission
  │   ├── Renders: Timeline with evaluation entries
  │   └── Read-only format
  │
  ├── BulkActionsBar.tsx (95 lines)
  │   ├── Props: selectedCount, selectedIds, onBulkStatusUpdate, onBulkAssign, onExport
  │   ├── Shows only if selectedCount > 0
  │   └── Renders: 3 action buttons
  │
  ├── BulkConfirmationDialog.tsx (75 lines)
  │   ├── Props: isOpen, action, itemCount, onConfirm, onCancel
  │   └── Generic confirmation modal
  │
  ├── BulkStatusUpdateDialog.tsx (85 lines)
  │   ├── Props: isOpen, selectedCount, onConfirm, onCancel
  │   └── Status dropdown + confirm
  │
  └── BulkAssignDialog.tsx (85 lines)
      ├── Props: isOpen, selectedCount, onConfirm, onCancel
      └── Evaluator dropdown + confirm
```

### Backend API Endpoints

```
GET  /api/evaluation-queue
POST /api/ideas/{ideaId}/evaluate
GET  /api/ideas/{ideaId}/evaluation-history
POST /api/evaluation-queue/bulk-status-update
POST /api/evaluation-queue/bulk-assign
GET  /api/evaluation-queue/export
```

### Backend Service Layer

```
evaluation.service.ts
├── getEvaluationQueue(filters)                    [GET /api/evaluation-queue]
├── submitEvaluation(ideaId, evaluatorId, data)    [POST /api/ideas/{id}/evaluate]
├── getEvaluationHistory(ideaId)                   [GET /api/ideas/{id}/evaluation-history]
├── bulkStatusUpdate(ideaIds, status, ...)         [POST /api/evaluation-queue/bulk-status-update]
├── bulkAssign(ideaIds, assigneeId)                [POST /api/evaluation-queue/bulk-assign]
└── exportToCSV(ideaIds)                           [GET /api/evaluation-queue/export]
```

---

## 4. Database Changes

### New Model: IdeationEvaluation

```prisma
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
  @@index([createdAt])
}
```

### Updated Models

**Idea model:**
```prisma
model Idea {
  // ... existing
  evaluations     IdeationEvaluation[]  // NEW
}
```

**User model:**
```prisma
model User {
  // ... existing
  evaluations     IdeationEvaluation[]  // NEW (evaluator's evaluations)
}
```

### Updated Enums

**IdeaStatus:**
```prisma
enum IdeaStatus {
  DRAFT
  SUBMITTED
  UNDER_REVIEW
  NEEDS_REVISION
  ACCEPTED
  REJECTED
}
```

### Migration Command

```bash
npx prisma migrate dev --name add_ideation_evaluations
```

---

## 5. API Specification Details

### GET /api/evaluation-queue

```http
GET /api/evaluation-queue?status=SUBMITTED,UNDER_REVIEW,NEEDS_REVISION&limit=10&offset=0&sort=-createdAt
Authorization: Bearer <jwt>

Response (200):
{
  "success": true,
  "data": {
    "ideas": [
      {
        "id": "idea-123",
        "title": "Automated Testing System",
        "submitterName": "John Doe",
        "category": "PRODUCT",
        "createdAt": "2026-02-25T10:30:00Z",
        "status": "SUBMITTED",
        "attachmentCount": 2,
        "assignedEvaluator": "evaluator@example.com"
      }
    ],
    "pagination": {
      "total": 25,
      "page": 1,
      "pages": 3
    }
  }
}
```

### POST /api/ideas/:ideaId/evaluate

```http
POST /api/ideas/idea-123/evaluate
Authorization: Bearer <jwt>
Content-Type: application/json

Request:
{
  "status": "ACCEPTED",
  "comments": "This is a great idea with strong market potential.",
  "fileUrl": "/uploads/evaluation-notes.pdf"
}

Response (201):
{
  "success": true,
  "data": {
    "evaluation": {
      "id": "eval-456",
      "ideaId": "idea-123",
      "evaluatorId": "user-789",
      "status": "ACCEPTED",
      "comments": "Great idea!",
      "createdAt": "2026-02-25T11:00:00Z"
    },
    "history": [ ... ]
  }
}
```

### GET /api/ideas/:ideaId/evaluation-history

```http
GET /api/ideas/idea-123/evaluation-history
Authorization: Bearer <jwt>

Response (200):
{
  "success": true,
  "data": {
    "evaluations": [
      {
        "id": "eval-456",
        "evaluatorId": "user-789",
        "evaluatorName": "Jane Evaluator",
        "status": "ACCEPTED",
        "comments": "Great idea!",
        "fileUrl": "/uploads/eval-notes.pdf",
        "createdAt": "2026-02-25T11:00:00Z"
      },
      {
        "id": "eval-123",
        "evaluatorId": "user-456",
        "evaluatorName": "Bob Admin",
        "status": "NEEDS_REVISION",
        "comments": "Needs more market analysis.",
        "createdAt": "2026-02-24T09:00:00Z"
      }
    ],
    "originalSubmission": {
      "submitterName": "John Doe",
      "submitterEmail": "john@example.com",
      "submittedAt": "2026-02-23T14:30:00Z",
      "category": "PRODUCT"
    }
  }
}
```

### POST /api/evaluation-queue/bulk-status-update

```http
POST /api/evaluation-queue/bulk-status-update
Authorization: Bearer <jwt>
Content-Type: application/json

Request:
{
  "ideaIds": ["idea-1", "idea-2", "idea-3"],
  "status": "ACCEPTED"
}

Response (200):
{
  "success": true,
  "data": {
    "updated": 3,
    "failed": 0,
    "errors": []
  }
}

Error (400):
{
  "success": false,
  "message": "Bulk operations limited to 100 items maximum"
}
```

### GET /api/evaluation-queue/export

```http
GET /api/evaluation-queue/export?ids=idea-1,idea-2,idea-3&format=csv
Authorization: Bearer <jwt>

Response (200):
Content-Type: text/csv
Content-Disposition: attachment; filename="evaluation-queue-export.csv"

Submitter,Title,Category,Submission Date,Status,Attachments,Assigned To
John Doe,Automated Testing,PRODUCT,2026-02-25,"SUBMITTED",2,alice@example.com
Jane Smith,Workflow Automation,SERVICE,2026-02-24,"UNDER_REVIEW",0,bob@example.com
```

---

## 6. Implementation Timeline

| Phase | Tasks | Days | Completion |
|-------|-------|------|------------|
| **Backend Setup** | Schema migration, API endpoints structure | 0.5 | Day 1 AM |
| **Evaluation Service** | submitEvaluation, getHistory, bulk operations | 1 | Day 1 PM |
| **API Endpoints** | Implement 4 main endpoints + testing | 1 | Day 2 AM |
| **Frontend Setup** | Asset creation, component stubs | 0.5 | Day 2 AM |
| **Queue & Row** | EvaluationQueue page, EvaluationQueueRow component | 1 | Day 2 PM |
| **Modal & History** | EvaluationModal, EvaluationHistory components | 1 | Day 3 AM |
| **Bulk Operations** | BulkActionsBar, dialogs, bulk API integration | 1 | Day 3 PM |
| **Testing** | Unit, integration, E2E tests | 1 | Day 4 |
| **Polish & Review** | Responsive design, accessibility, code review | 0.5 | Day 4 PM |

**Total:** 4-5 days (8 story points)

---

## 7. Testing Strategy

### Unit Tests (35% of tests)
- EvaluationQueueRow component rendering
- EvaluationModal form validation
- EvaluationHistory timeline display
- Bulk action validation (100-item limit)
- CSV generation format

### Integration Tests (45% of tests)
- Queue API endpoint with authentication
- Evaluation submission creating new records (not replacing)
- Bulk status update functionality
- Bulk assign functionality
- CSV export functionality
- Role-based access control (evaluator/admin only)

### E2E Tests (20% of tests)
- Evaluator can access queue
- Non-evaluator redirected
- Submit evaluation with comments
- View evaluation history
- Bulk select ideas
- Bulk status update with confirmation
- CSV export and download
- Multiple evaluations per idea

### Test Coverage Goal
- Minimum: 80% code coverage
- Target: 85%+

---

## 8. Dependencies & Risk Mitigation

### Critical Dependencies
- ✅ STORY-1.4 (RBAC) - roleCheck middleware completed
- ✅ STORY-2.1 (Submission) - Idea data available
- ✅ STORY-2.2 (File Upload) - File upload infrastructure
- ✅ STORY-2.3a (Dashboard) - StatusBadge component reusable

### Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| Database migration fails | Low | High | Test migration on backup DB first |
| Bulk operation timeout (100+ items) | Medium | Medium | Limit to 100 items, async for >1000 |
| Performance with large datasets | Medium | Medium | Add database indexes, pagination |
| Audit trail mutation | Low | High | Use ON DELETE RESTRICT, no UPDATE timestamps |
| CSV export encoding issues | Low | Low | Test with special characters, UTF-8 encoding |

---

## 9. Definition of Done

General:
- [ ] All 5 AC (AC12-AC16) implemented per spec
- [ ] Code reviewed and approved
- [ ] No console errors or warnings
- [ ] Merged to main branch

Frontend:
- [ ] 5 components created (Queue, Row, Modal, History, BulkBar)
- [ ] Component reusability verified (StatusBadge)
- [ ] Form validation working
- [ ] API integration tested
- [ ] Responsive design verified (mobile/tablet/desktop)
- [ ] Accessibility verified (ARIA labels, semantic HTML)

Backend:
- [ ] 6 API endpoints implemented (4 main + 2 bulk)
- [ ] Role-based access enforced (403 for non-evaluators)
- [ ] Database migration successful
- [ ] IdeationEvaluation model created
- [ ] Relations added to Idea/User models
- [ ] Indexes created for query performance
- [ ] Error handling implemented

Testing:
- [ ] Unit tests: >80% coverage
- [ ] Integration tests: API endpoints working
- [ ] E2E tests: Critical user flows working
- [ ] No failing tests

Performance:
- [ ] Queue loads <3 seconds with 100 ideas
- [ ] Bulk operations complete <2 seconds for 100 items
- [ ] CSV export <10 seconds for 100 items
- [ ] Audit trail immutable (no deletions possible)

---

## 10. Success Criteria

✅ Evaluators can access queue (non-evaluators redirected)  
✅ Queue shows all open statuses: SUBMITTED, UNDER_REVIEW, NEEDS_REVISION  
✅ Ideas sorted newest first (createdAt DESC)  
✅ Status update modal works with comments and file upload  
✅ Multiple evaluations per idea allowed (new records created)  
✅ Evaluation history visible and immutable  
✅ Bulk operations support (select, update, assign, export)  
✅ CSV export includes all table columns  
✅ 100-item limit enforced on bulk operations  
✅ Role validation on all API endpoints  
✅ All tests passing (unit, integration, E2E)  
✅ Responsive design verified  
✅ Ready for STORY-2.4 (Sort & Filter) enhancements
