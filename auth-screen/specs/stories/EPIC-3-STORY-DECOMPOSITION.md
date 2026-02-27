# EPIC-3: Idea Evaluation Workflow - Story Decomposition

**Epic ID:** EPIC-3  
**Epic Title:** Idea Evaluation Workflow & Status Tracking  
**Decomposed:** February 26, 2026  
**Total Stories:** 7  
**Total Story Points:** 34  
**Estimated Duration:** 4-5 weeks

---

## Stories Overview

| Story ID | Title | Points | Priority | Status |
|----------|-------|--------|----------|--------|
| STORY-3.1 | Evaluation Queue View | 5 | P0 | Not Started |
| STORY-3.2 | Idea Review Panel | 5 | P0 | Not Started |
| STORY-3.3 | Approve/Reject State Machine | 8 | P0 | Not Started |
| STORY-3.4 | Rejection Feedback Form | 5 | P0 | Not Started |
| STORY-3.5 | Audit Logging | 5 | P1 | Not Started |
| STORY-3.6 | Email Notifications | 3 | P1 | Not Started |
| STORY-3.7 | Status Timeline View | 3 | P2 | Not Started |

---

## Story Breakdown

### STORY-3.1: Evaluation Queue View

**Story ID:** STORY-3.1  
**Epic:** EPIC-3  
**Sprint:** Backlog  
**Story Points:** 5  
**Persona:** Raj (Evaluator/Admin)  
**Priority:** P0

#### User Story
**As an** evaluator  
**I want** to see a list of all ideas pending evaluation  
**so that** I can quickly identify which ideas to review and prioritize my review workflow

#### Description
Evaluators need a dedicated queue view showing all ideas with status "Submitted" or "Under Review". The queue displays key information at a glance (idea title, submitter name, creation date, current status) and allows sorting/filtering to efficiently process ideas. This is the main entry point for the evaluation workflow.

#### Acceptance Criteria

1. **AC1: Queue Displays All Pending Ideas**
   - Given: Evaluator navigates to `/evaluation-queue`
   - When: Page loads
   - Then: All ideas with status "Submitted" or "Under Review" are displayed in a table

2. **AC2: Queue Shows Essential Information**
   - Given: Queue page is loaded
   - When: Evaluator views the queue
   - Then: Each row shows: Title, Submitter Name, Category, Submission Date, Current Status, Days in Queue

3. **AC3: Ideas Sorted by Submission Date (Oldest First)**
   - Given: Queue page loads
   - When: First load
   - Then: Ideas are sorted by submission date (oldest ideas appear first - FIFO)

4. **AC4: Status Badges Show Current State**
   - Given: Queue displays ideas
   - When: Evaluator views status column
   - Then: "Submitted" shows yellow badge, "Under Review" shows orange badge, colors match design system

5. **AC5: Pagination Works for Large Queues**
   - Given: Queue has more than 10 ideas
   - When: Evaluator scrolls to bottom
   - Then: Pagination shows previous/next buttons; page size selector (10, 25, 50 per page) available

6. **AC6: Click Idea to View Details**
   - Given: Idea is in queue
   - When: Evaluator clicks on an idea row
   - Then: Navigates to STORY-3.2 idea review panel showing full details

#### Technical Details

**Components to Create:**
- `EvaluationQueue.tsx` - Main queue component
- `QueueTable.tsx` - Table displaying ideas
- `QueuePagination.tsx` - Pagination controls
- `StatusBadge.tsx` - Status display (reuse from STORY-2.5)

**API Endpoint for Backend:**
- `GET /api/evaluation-queue?page=1&limit=25&sort=createdAt` - Fetch pending ideas

**Database Query:**
```sql
SELECT ideas.*, users.name as submitterName, 
       COUNT(*) OVER() as totalCount,
       DATEDIFF(DAY, ideas.createdAt, GETDATE()) as daysInQueue
FROM ideas
LEFT JOIN users ON ideas.userId = users.id
WHERE ideas.status IN ('Submitted', 'Under Review')
ORDER BY ideas.createdAt ASC
LIMIT :limit OFFSET :offset
```

**UI/UX Requirements:**
- Responsive table that collapses to cards on mobile
- Loading skeleton while fetching
- Error state if queue fetch fails
- Empty state message if no ideas pending

**Files to Create:**
- `src/pages/EvaluationQueue.tsx` (new main component)
- `src/components/QueueTable.tsx` (new)
- `src/components/QueuePagination.tsx` (new or reuse)

#### Dependencies
- Requires EPIC-1 (role verification to show only to evaluators)
- Requires EPIC-2 (ideas exist in database)
- STORY-3.1 blocks STORY-3.2

#### Estimation
- **Story Points:** 5
- **Estimated Days:** 1-2 days
- **Risk:** LOW - straightforward data display with pagination

---

### STORY-3.2: Idea Review Panel

**Story ID:** STORY-3.2  
**Epic:** EPIC-3  
**Sprint:** Backlog  
**Story Points:** 5  
**Persona:** Raj (Evaluator/Admin)  
**Priority:** P0

#### User Story
**As an** evaluator  
**I want** to click an idea from the queue and see its full details  
**so that** I can make an informed decision about whether to approve or reject it

#### Description
When evaluator clicks an idea from the queue (STORY-3.1), they navigate to a detailed review panel showing complete idea information: title, description, category, submitter details, submitted date, and all attachments. The panel also displays approve/reject buttons (implemented in STORY-3.3) for taking action.

#### Acceptance Criteria

1. **AC1: Panel Shows Complete Idea Information**
   - Given: Evaluator clicks idea from queue
   - When: Review panel opens
   - Then: Full idea details displayed: title, description, category, submitter info, submission date

2. **AC2: Attachments Display with Download Links**
   - Given: Idea has attachments
   - When: Evaluator views review panel
   - Then: Attachments shown with file names, sizes, and download links working

3. **AC3: Submitter Information Visible**
   - Given: Idea displayed in review panel
   - When: Evaluator views submitter section
   - Then: Submitter name, email, and department shown (for context)

4. **AC4: Status Auto-Updates to "Under Review" on Open**
   - Given: Idea status is "Submitted"
   - When: Evaluator opens review panel for first time
   - Then: Idea status automatically changes to "Under Review" (backend call made)

5. **AC5: Back to Queue Button**
   - Given: Evaluator is on review panel
   - When: Evaluator clicks "Back to Queue" button
   - Then: Returns to queue list at previous scroll position

6. **AC6: Panel Design Matches Detail View (STORY-2.5)**
   - Given: Review panel open
   - When: Evaluator views layout
   - Then: Visual design consistent with IdeaDetailPage from STORY-2.5

#### Technical Details

**Components to Create:**
- `IdeaReviewPanel.tsx` - Main review component
- Reuse `AttachmentsSection.tsx` from STORY-2.5

**API Endpoints:**
- `GET /api/ideas/:ideaId` - Get idea details (existing from STORY-2.5)
- `PUT /api/ideas/:ideaId/status` - Update status to "Under Review"

**Backend Logic:**
- When review panel opens, automatically call PUT endpoint to change status
- Implement idempotency: calling twice shouldn't cause issues

**Route:**
- `/evaluation-queue/:ideaId`

**Files to Create/Modify:**
- `src/pages/IdeaReviewPanel.tsx` (new)
- `src/App.tsx` (add route for `/evaluation-queue/:ideaId`)

#### Dependencies
- Depends on STORY-3.1 (must have queue first)
- Blocks STORY-3.3 (approve/reject buttons added next)

#### Estimation
- **Story Points:** 5
- **Estimated Days:** 1-2 days
- **Risk:** LOW-MEDIUM (status auto-update requires careful transaction handling)

---

### STORY-3.3: Approve/Reject State Machine

**Story ID:** STORY-3.3  
**Epic:** EPIC-3  
**Sprint:** Backlog  
**Story Points:** 8  
**Persona:** Raj (Evaluator/Admin)  
**Priority:** P0

#### User Story
**As an** evaluator  
**I want** to approve or reject an idea from the review panel  
**so that** I can move ideas through the workflow and communicate my decision to submitters

#### Description
Implement the state machine logic that handles idea approval/rejection. Evaluator clicks "Approve" or "Reject" button, which updates idea status. Approval changes status to "Accepted"; rejection changes to "Rejected" and requires feedback (STORY-3.4). State machine prevents invalid transitions (e.g., cannot reject an already-accepted idea).

#### Acceptance Criteria

1. **AC1: Approve Button Changes Status to "Accepted"**
   - Given: Idea is in "Under Review" status
   - When: Evaluator clicks "Approve" button
   - Then: Status changes to "Accepted", button validation succeeds, UI updates immediately

2. **AC2: Reject Button Changes Status to "Rejected"**
   - Given: Idea is in "Under Review" status
   - When: Evaluator clicks "Reject" button
   - Then: Opens feedback form (STORY-3.4) for evaluator to enter rejection reason

3. **AC3: State Transitions Are Validated**
   - Given: Idea is in "Accepted" status
   - When: Evaluator tries to approve again or reject
   - Then: Buttons are disabled; error message shown "This idea is already approved"

4. **AC4: Concurrent Requests Handled Safely**
   - Given: Two evaluators viewing same idea
   - When: Both try to approve simultaneously
   - Then: First update succeeds, second shows error "Idea already processed by another evaluator"

5. **AC5: Buttons Show Loading State During Update**
   - Given: Evaluator clicks Approve/Reject
   - When: Request sent to backend
   - Then: Button shows spinner, disabled until response received

6. **AC6: Error Handling**
   - Given: Network error during status update
   - When: Update fails
   - Then: Error message displayed, user can retry

7. **AC7: Confirmation Before Major Actions**
   - Given: Evaluator hovers over Approve/Reject
   - When: Tooltip/confirmation dialog shown asking "Are you sure?"
   - Then: Prevents accidental clicks

#### Technical Details

**State Machine Diagram:**
```
Submitted → Under Review → Accepted
              ↓
            Rejected
```

**Valid Transitions:**
- Submitted → Under Review (auto on panel open)
- Under Review → Accepted
- Under Review → Rejected
- Invalid: Cannot go back from Accepted/Rejected; Cannot approve if already rejected

**Backend Validation:**
```typescript
// State machine logic
const validTransitions = {
  'Submitted': ['Under Review'],
  'Under Review': ['Accepted', 'Rejected'],
  'Accepted': [], // No transitions allowed
  'Rejected': []  // No transitions allowed
};

// Check if transition is valid
if (!validTransitions[currentStatus].includes(newStatus)) {
  throw new Error(`Invalid transition from ${currentStatus} to ${newStatus}`);
}
```

**API Endpoint:**
- `PUT /api/ideas/:ideaId/status` with body: `{ status: 'Accepted' | 'Rejected', feedback?: string }`

**Database Transaction:**
```sql
BEGIN TRANSACTION
  UPDATE ideas SET status = @newStatus, updatedAt = GETDATE() 
  WHERE id = @ideaId AND status = @currentStatus
  
  -- Optimistic lock: only update if status hasn't changed
  IF @@ROWCOUNT = 0 THROW 50001, 'Idea already updated', 1
  
  -- Log the status change (STORY-3.5)
  INSERT INTO statusChanges (ideaId, oldStatus, newStatus, evaluatorId, timestamp)
  VALUES (@ideaId, @currentStatus, @newStatus, @userId, GETDATE())
COMMIT TRANSACTION
```

**Components to Update:**
- `IdeaReviewPanel.tsx` - Add approve/reject buttons
- Create `StatusTransitionService.ts` for state machine logic

**Files to Create/Modify:**
- `src/services/statusTransition.service.ts` (new) - State machine logic
- `src/pages/IdeaReviewPanel.tsx` (modify) - Add buttons

#### Dependencies
- Depends on STORY-3.2 (needs review panel)
- Blocks STORY-3.4 (rejection feedback), STORY-3.5 (audit logging)

#### Estimation
- **Story Points:** 8
- **Estimated Days:** 2-3 days
- **Risk:** MEDIUM-HIGH (state machine + concurrent request handling + transaction safety)

---

### STORY-3.4: Rejection Feedback Form

**Story ID:** STORY-3.4  
**Epic:** EPIC-3  
**Sprint:** Backlog  
**Story Points:** 5  
**Persona:** Raj (Evaluator/Admin)  
**Priority:** P0

#### User Story
**As an** evaluator  
**I want** to provide detailed feedback when rejecting an idea  
**so that** submitters understand why their idea was not accepted and can improve future submissions

#### Description
When evaluator clicks "Reject" button (STORY-3.3), a modal form opens requiring evaluator to enter rejection feedback. Feedback is required (non-empty text). Form includes character counting and guidance. Rejecting without feedback is blocked. Feedback is saved with the status change and visible to submitter.

#### Acceptance Criteria

1. **AC1: Reject Modal Opens with Feedback Form**
   - Given: Evaluator clicks "Reject" button
   - When: Modal opens
   - Then: Form shows title "Why are you rejecting this idea?", text area for feedback, character count, Cancel/Submit buttons

2. **AC2: Feedback Is Required**
   - Given: Modal is open
   - When: Evaluator tries to submit without entering feedback
   - Then: Error message shown "Feedback is required", Submit button disabled

3. **AC3: Character Limit Enforced**
   - Given: Feedback form is open
   - When: Evaluator types feedback
   - Then: Character count shown (Max 500 chars); type beyond limit is blocked

4. **AC4: Feedback Saved with Status Change**
   - Given: Evaluator enters feedback and clicks Submit
   - When: Form submitted
   - Then: Status changes to "Rejected" and feedback stored in database

5. **AC5: Feedback Visible to Submitter**
   - Given: Idea rejected with feedback
   - When: Submitter views their idea (STORY-2.5 Detail View)
   - Then: Rejection feedback displayed in "Evaluator Feedback" section

6. **AC6: Cancel Button Discards Changes**
   - Given: Modal is open with feedback entered
   - When: Evaluator clicks Cancel
   - Then: Modal closes without saving, idea status unchanged

#### Technical Details

**Components to Create:**
- `RejectionFeedbackModal.tsx` - Modal with form
- `RejectionForm.tsx` - Form component

**Modal Flow:**
```
User clicks Reject → Modal opens → User enters feedback → 
Validates → Submits → Updates status + saves feedback → 
Modal closes → UI refreshes
```

**Database Schema Addition:**
```sql
ALTER TABLE ideas ADD COLUMN evaluatorFeedback NVARCHAR(500) NULL;
-- Store feedback inline in statusChanges table or separate table
```

**API Update:**
- Modify `PUT /api/ideas/:ideaId/status` to include `feedback` field
- Backend validates: feedback required if status='Rejected'

**Validation Rules:**
- Feedback required (non-empty)
- Min: 10 characters
- Max: 500 characters
- No SQL injection attempts

**Files to Create/Modify:**
- `src/components/RejectionFeedbackModal.tsx` (new)
- `src/pages/IdeaReviewPanel.tsx` (integrate modal)
- `backend/src/routes/ideas.ts` (update PUT endpoint)

#### Dependencies
- Depends on STORY-3.3 (reject button logic)
- Related to STORY-2.5 (feedback displayed in detail view)

#### Estimation
- **Story Points:** 5
- **Estimated Days:** 1-2 days
- **Risk:** LOW - straightforward modal form

---

### STORY-3.5: Audit Logging

**Story ID:** STORY-3.5  
**Epic:** EPIC-3  
**Sprint:** Backlog  
**Story Points:** 5  
**Persona:** Raj (Admin/Compliance Officer)  
**Priority:** P1

#### User Story
**As an** admin  
**I want** all status changes to be logged with timestamp, evaluator ID, and action taken  
**so that** we have a complete audit trail of who made what decision and when, for compliance

#### Description
Every idea status change (Submitted → Under Review, Under Review → Accepted/Rejected) is logged to audit table with: ideaId, oldStatus, newStatus, evaluatorId, evaluatorName, timestamp, feedback (if applicable). These logs become visible as status timeline in STORY-3.7.

#### Acceptance Criteria

1. **AC1: Status Change Logged to Audit Table**
   - Given: Evaluator approves/rejects an idea
   - When: Status update succeeds
   - Then: Audit log entry created with all required fields

2. **AC2: All Fields Populated Correctly**
   - Given: Status change logged
   - When: Admin queries audit logs
   - Then: Logs contain: ideaId, oldStatus, newStatus, evaluatorId, evaluatorName, timestamp, action

3. **AC3: Timestamp Is Accurate**
   - Given: Audit log entry created
   - When: Checking timestamp
   - Then: Shows UTC time with millisecond precision

4. **AC4: Feedback Included in Logs (If Rejection)**
   - Given: Idea rejected with feedback
   - When: Audit log created
   - Then: Feedback text stored in auditLog entry

5. **AC5: Concurrent Updates Don't Lose Data**
   - Given: Multiple status changes happening simultaneously
   - When: Audit logs queried
   - Then: All changes logged, no entries missing or corrupted

6. **AC6: Audit Logs Immutable**
   - Given: Audit log entry created
   - When: Admin tries to modify log
   - Then: Operations fail; logs cannot be edited/deleted (append-only)

#### Technical Details

**Database Schema:**
```sql
CREATE TABLE statusChangeLogs (
  id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
  ideaId UNIQUEIDENTIFIER NOT NULL,
  oldStatus NVARCHAR(50) NOT NULL,
  newStatus NVARCHAR(50) NOT NULL,
  evaluatorId NVARCHAR(255) NOT NULL,
  evaluatorName NVARCHAR(255) NOT NULL,
  feedback NVARCHAR(500) NULL,
  timestamp DATETIME NOT NULL DEFAULT GETDATE(),
  FOREIGN KEY (ideaId) REFERENCES ideas(id),
  INDEX idx_ideaId (ideaId),
  INDEX idx_timestamp (timestamp)
);
```

**Implementation in State Machine:**
```typescript
// After status update succeeds
const auditLog = {
  ideaId,
  oldStatus: idea.status,
  newStatus: newStatus,
  evaluatorId: userId,
  evaluatorName: userName,
  feedback: feedback || null,
  timestamp: new Date()
};

await statusChangeLogs.create(auditLog);
```

**Files to Create/Modify:**
- `backend/src/services/auditLog.service.ts` (new)
- `backend/src/routes/ideas.ts` (add logging call)
- Database migration file (create new table)

#### Dependencies
- Depends on STORY-3.3 (status change logic must exist first)
- Required by STORY-3.7 (audit logs are displayed as timeline)

#### Estimation
- **Story Points:** 5
- **Estimated Days:** 1 day
- **Risk:** LOW - straightforward logging/audit trail

---

### STORY-3.6: Email Notifications

**Story ID:** STORY-3.6  
**Epic:** EPIC-3  
**Sprint:** Backlog  
**Story Points:** 3  
**Persona:** Priya (Submitter)  
**Priority:** P1

#### User Story
**As a** submitter  
**I want** to receive an email notification when my idea status changes  
**so that** I'm immediately informed whether my idea was accepted or rejected

#### Description
When idea status changes from "Under Review" to "Accepted" or "Rejected", an email is automatically sent to submitter with: new status, evaluator feedback (if rejected), link to view idea. Email should be sent within 1 minute of status change. Failed emails are retried.

#### Acceptance Criteria

1. **AC1: Email Sent on Approval**
   - Given: Evaluator approves an idea
   - When: Status changes to "Accepted"
   - Then: Email sent to submitter within 1 minute

2. **AC2: Email Sent on Rejection**
   - Given: Evaluator rejects an idea with feedback
   - When: Status changes to "Rejected"
   - Then: Email sent to submitter with rejection feedback included

3. **AC3: Email Contains Link to Idea**
   - Given: Email sent
   - When: Submitter receives email
   - Then: Email includes clickable link to view idea details

4. **AC4: Email Template Professional and Clear**
   - Given: Email sent
   - When: Submitter reads email
   - Then: Subject line clear, body explains what happened, call-to-action present

5. **AC5: Submitter Email Address Correct**
   - Given: Email queued for sending
   - When: Email service processes
   - Then: Email sent to correct submitter email address (from users table)

6. **AC6: Failed Emails Are Retried**
   - Given: Email fails to send (network error, service down)
   - When: Failure detected
   - Then: Automatic retry after 5 minutes, up to 3 attempts

#### Technical Details

**Email Templates:**

```
=== APPROVAL EMAIL ===
Subject: Great news! Your idea was accepted

Dear [Submitter Name],

Good news! Your idea "[Idea Title]" has been accepted and selected for further consideration.

View your idea: [Link to idea]

Thank you for your contribution!
Best regards,
EPAM Ideas Platform
```

```
=== REJECTION EMAIL ===
Subject: Thank you for your idea submission - Status Update

Dear [Submitter Name],

Thank you for submitting your idea "[Idea Title]". After careful review, it was not selected at this time.

Feedback from evaluators:
[FEEDBACK TEXT]

We truly appreciate your participation. We encourage you to submit more ideas in the future.

View your idea: [Link to idea]

Best regards,
EPAM Ideas Platform
```

**Email Service Integration:**
```typescript
// backend/src/services/emailService.ts
async sendApprovalEmail(submitter: User, idea: Idea) {
  const emailContent = generateApprovalTemplate(submitter, idea);
  await emailQueue.add({
    to: submitter.email,
    subject: emailContent.subject,
    html: emailContent.html,
    retries: 0,
    maxRetries: 3
  });
}

async sendRejectionEmail(submitter: User, idea: Idea, feedback: string) {
  const emailContent = generateRejectionTemplate(submitter, idea, feedback);
  await emailQueue.add({...});
}
```

**Files to Create/Modify:**
- `backend/src/services/emailService.ts` (new)
- `backend/src/services/emailTemplates.ts` (new)
- `backend/src/services/emailQueue.ts` (new) - Job queue for retries
- `backend/src/routes/ideas.ts` (add email sending call)
- `.env` - Add SendGrid API key

#### Dependencies
- Depends on STORY-3.3 (status changes must be working)
- Requires backend email service setup (SendGrid/SES)

#### Estimation
- **Story Points:** 3
- **Estimated Days:** 0.5-1 day
- **Risk:** MEDIUM (email service integration, retry logic)

---

### STORY-3.7: Status Timeline View

**Story ID:** STORY-3.7  
**Epic:** EPIC-3  
**Sprint:** Backlog  
**Story Points:** 3  
**Persona:** Priya (Submitter)  
**Priority:** P2

#### User Story
**As a** submitter  
**I want** to see a timeline showing my idea's status journey from submission through evaluation to final decision  
**so that** I can understand how long ideas typically take and see when decisions were made

#### Description
In the idea detail page (STORY-2.5), add a "Status Timeline" section showing the complete history of status changes. For each status change, display: timestamp, new status, evaluator name, and feedback (if rejection). Timeline displayed chronologically with visual indicators (badges/colors).

#### Acceptance Criteria

1. **AC1: Timeline Section Visible on Detail Page**
   - Given: Submitter views their idea detail page
   - When: Page loads
   - Then: "Status Timeline" or "History" section visible below main content

2. **AC2: Timeline Shows All Status Changes**
   - Given: Idea has been through multiple status changes
   - When: Timeline viewed
   - Then: All changes displayed (Submitted → Under Review → Accepted/Rejected)

3. **AC3: Each Entry Shows Key Information**
   - Given: Status change entry in timeline
   - When: Submitter reads entry
   - Then: Shows: Timestamp, Status, Evaluator Name, Feedback (if applicable)

4. **AC4: Status Badges Colored Appropriately**
   - Given: Timeline displayed
   - When: Submitter views status badges
   - Then: Submitted=gray, Under Review=yellow, Accepted=green, Rejected=red

5. **AC5: Timeline Chronological**
   - Given: Multiple status changes
   - When: Timeline displayed
   - Then: Changes shown in chronological order (oldest at top, newest at bottom)

6. **AC6: Times Show Relative Duration**
   - Given: Status change entry
   - When: Submitter hovers over timestamp
   - Then: Tooltip shows human-readable duration ("Approved after 3 days in review")

#### Technical Details

**Component to Create:**
- `StatusTimeline.tsx` - Timeline display component

**Data Source:**
- Query statusChangeLogs table from STORY-3.5

**API Endpoint:**
- `GET /api/ideas/:ideaId/status-history` - Fetch all status changes for an idea

**Visual Timeline Design:**
```
●─ Submitted on Feb 1, 2026 at 9:00 AM
  └─ Status: Initial submission

●─ Under Review on Feb 2, 2026 at 10:30 AM
  └─ Status: Raj started evaluation

●─ Accepted on Feb 3, 2026 at 2:45 PM [4.4 days later]
  └─ Evaluator: Raj
  └─ Feedback: Excellent idea with good business value
```

**Files to Create/Modify:**
- `src/components/StatusTimeline.tsx` (new)
- `src/pages/IdeaDetailPage.tsx` (integrate timeline)
- `backend/src/routes/ideas.ts` (add GET /status-history endpoint)

#### Dependencies
- Depends on STORY-3.5 (audit logs must exist)
- Integrates with STORY-2.5 (detail page)

#### Estimation
- **Story Points:** 3
- **Estimated Days:** 0.5-1 day
- **Risk:** LOW - read-only display with no business logic

---

## Implementation Sequence

### Phase 1 (Foundation - Week 1-2)
1. STORY-3.1: Evaluation Queue View - provides data display foundation
2. STORY-3.2: Idea Review Panel - adds detail view
3. STORY-3.3: Approve/Reject State Machine - implements core workflow logic

### Phase 2 (Feedback & Logging - Week 2-3)
4. STORY-3.4: Rejection Feedback - enhances rejection flow
5. STORY-3.5: Audit Logging - captures workflow history

### Phase 3 (Notifications & UI - Week 3-4)
6. STORY-3.6: Email Notifications - external communication
7. STORY-3.7: Status Timeline - user-facing history

---

## Dependencies Map

```
STORY-3.1 (Queue)
    ↓
STORY-3.2 (Review Panel) → STORY-3.7 (Timeline uses audit logs)
    ↓
STORY-3.3 (State Machine) ← STORY-3.5 (Audit Logging)
    ↓
STORY-3.4 (Rejection Feedback)
    ↓
STORY-3.6 (Email Notifications)
```

---

## Acceptance Criteria Summary - EPIC Level

- [x] Evaluators can view all ideas pending evaluation (STORY-3.1)
- [x] Status changes from "Submitted" to "Under Review" on idea open (STORY-3.2)
- [x] Evaluators can approve (→ "Accepted") or reject (→ "Rejected") ideas (STORY-3.3)
- [x] Rejection requires evaluator feedback (STORY-3.4)
- [x] All status transitions logged with timestamp and actor (STORY-3.5)
- [x] Submitters receive email notification on status change (STORY-3.6)
- [x] Invalid state transitions prevented (STORY-3.3)
- [x] 90% of ideas evaluated within 7 days (measurement story)
- [x] Status timeline visible to submitters (STORY-3.7)

---

## Technical Architecture

### Frontend Stack
- React 18 + TypeScript
- React Router for navigation
- Tailwind CSS for styling
- State management: React hooks (useState, useEffect, useContext)

### Backend Stack
- Node.js / Express
- TypeScript
- SQL Server
- SendGrid for email
- Transaction-based state machine

### Database Tables
- `ideas` (existing, add evaluatorFeedback field)
- `statusChangeLogs` (new, audit trail)
- `emailQueue` (new, for email retry logic)

---

## Success Metrics

| Metric | Target | How to Measure |
|--------|--------|---|
| Avg ideas evaluated per day | 10+ | Query evaluation dashboard |
| Status change notification latency | < 1 min | Track email send times |
| Audit log completeness | 100% | Verify no missing entries |
| State machine error rate | < 0.1% | Monitor invalid transition attempts |
| Email delivery success rate | > 95% | Track SendGrid delivery metrics |

---

## Known Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Race conditions in concurrent evaluations | Use database transactions + optimistic locking |
| Email service failures | Implement retry queue with exponential backoff |
| Performance with large evaluation queues | Pagination + database indexing on status/date |
| Invalid state transitions | Enforce state machine on backend with validation |
| Audit log data loss | Use append-only design, no deletes allowed |

---

## Notes

- All stories follow the established patterns from EPIC-1 and EPIC-2
- Careful attention to transaction safety and concurrent access
- Email notifications use queuing pattern for reliability
- Audit logging provides compliance trail
- Status timeline completes the user feedback loop

**Total Estimated Duration:** 4-5 weeks  
**Total Story Points:** 34  
**Recommended Team Size:** 2-3 developers
