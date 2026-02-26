# STORY-3.3: Approve/Reject Decision Flow with State Machine

**Story ID:** STORY-3.3  
**Title:** Approve or Reject Idea with State Validation & Concurrency Handling  
**Epic:** EPIC-3 (Idea Evaluation Workflow & Status Tracking)  
**Sprint:** STORY-3 Implementation Phase  
**Status:** APPROVED (Ready for Implementation)  
**Priority:** P0 (Critical Path)  
**Story Points:** 8  
**Estimated Days:** 2-3 days  
**Confidence:** Medium (State machine + concurrency edge cases)  

**Created:** February 26, 2026  
**Last Updated:** February 26, 2026  
**Owner:** Development Team  
**Related PRD:** IDEA-prd.md (Idea Submission & Evaluation System)  

---

## User Story

**As a** Raj (Evaluator/Admin)  
**I want** to approve or reject an idea with a single click, ensuring valid state transitions  
**so that** I can move ideas through the workflow efficiently and prevent invalid status changes

### Story Context

This is the core decision-making workflow in the evaluation system. After reviewing an idea in the Review Panel (STORY-3.2), evaluators click Approve or Reject to transition ideas between workflow states. The state machine enforces valid transitions (e.g., blocking rejections of already-accepted ideas) and prevents race conditions when multiple evaluators review the same idea simultaneously. All transitions are recorded for audit trails (STORY-3.5).

**Business Value:**
- Ensures workflow integrity with validated state transitions
- Prevents data corruption from concurrent operations
- Provides clear decision trail for compliance/audit
- Blocks invalid operations with clear guidance

---

## Acceptance Criteria

### AC1: Approve Button Changes Status to "Accepted"
**Given:** Idea is in "Under Review" status  
**When:** Evaluator clicks "Approve" button in IdeaReviewPanel  
**Then:**
- API call made: `PUT /api/ideas/:ideaId/status` with body `{ status: 'Accepted' }`
- Database transaction atomically updates idea status to "Accepted"
- `evaluatorId` field set to current user's ID
- UI immediately reflects new status with updated button states
- Success notification displayed: "✓ Idea approved successfully!"
- Backend records status change in audit log (STORY-3.5)
- Approve/Reject buttons become disabled (terminal state reached)

**Test Acceptance:**
```javascript
// Button click updates database
await userEvent.click(screen.getByRole('button', { name: /approve/i }));
await waitFor(() => {
  expect(screen.getByText('✓ Idea approved successfully!')).toBeInTheDocument();
  expect(ideasService.updateIdeaStatus).toHaveBeenCalledWith(
    'idea-123',
    { status: 'Accepted' }
  );
});
```

---

### AC2: Reject Button Prepares for Feedback (Deferred to STORY-3.4)
**Given:** Idea is in "Under Review" status  
**When:** Evaluator clicks "Reject" button in IdeaReviewPanel  
**Then:**
- Modal component appears (placeholder/stub, full implementation deferred to STORY-3.4)
- Modal shows "Feedback form coming in STORY-3.4" message
- Buttons in modal disabled/read-only to prevent premature rejection
- Full rejection feedback logic (required text field, min 10 chars, submission) implemented in STORY-3.4
- Backend already accepts optional `feedback` parameter in PUT endpoint (future-proofed for STORY-3.4 integration)

**Test Acceptance:**
```javascript
await userEvent.click(screen.getByRole('button', { name: /reject/i }));
expect(screen.getByRole('dialog')).toBeInTheDocument();
expect(screen.getByText(/coming in STORY-3.4/i)).toBeInTheDocument();
```

---

### AC3: State Transitions Are Validated on Backend
**Given:** Idea is in "Accepted" or "Rejected" status (terminal state)  
**When:** Evaluator tries to approve or reject again  
**Then:**
- Backend validates transition against state machine
- Invalid transition rejected with 400 Bad Request
- Error response: `{ error: "Invalid transition", message: "Cannot transition from Accepted to Accepted" }`
- Frontend Approve button is disabled with tooltip: "This idea is already Accepted"
- Frontend Reject button is disabled with tooltip: "This idea is already Accepted"
- Buttons show grayed-out appearance (opacity 0.5, cursor-not-allowed)

**State Machine Diagram:**
```
Submitted ──(auto)──> Under Review ──┬──> Accepted (terminal)
                                      └──> Rejected (terminal)

Valid Transitions:
  Submitted → Under Review
  Under Review → Accepted
  Under Review → Rejected
  
Invalid (Blocked):
  Accepted → Any state
  Rejected → Any state
  Submitted → Accepted/Rejected (must go through Under Review first)
```

**Test Acceptance:**
```javascript
// Verify button states based on status
const { rerender } = render(<ApproveRejectButtons idea={{ status: 'Accepted' }} />);
expect(screen.getByRole('button', { name: /approve/i })).toBeDisabled();
expect(screen.getByRole('button', { name: /reject/i })).toBeDisabled();
```

---

### AC4: Concurrent Requests Handled Safely (Race Condition Prevention)
**Given:** Two evaluators view the same idea simultaneously  
**When:** Both click "Approve" at the exact same time  
**Then:**
- First evaluator's update succeeds, status changes to "Accepted"
- Second evaluator's update fails with 409 Conflict
- Second evaluator receives error: "This idea was already processed by another evaluator"
- Database uses optimistic locking (compare-and-swap) to prevent race conditions
- No duplicate approvals possible (idempotency)
- No partial state changes persisted (transaction atomicity)

**Technical Implementation:**
```sql
-- Optimistic locking: Only update if status hasn't changed
UPDATE ideas 
SET status = 'Accepted', evaluatorId = @userId, updatedAt = GETDATE()
WHERE id = @ideaId AND status = 'Under Review'

-- Check affected rows == 1 (successful) or == 0 (update conflict)
IF @@ROWCOUNT = 0
  THROW 50409, 'Idea already updated by another evaluator', 1;
```

**Test Acceptance:**
```javascript
// Simulate concurrent approvals
const promise1 = ideasService.updateIdeaStatus('idea-123', { status: 'Accepted' });
const promise2 = ideasService.updateIdeaStatus('idea-123', { status: 'Accepted' });

const [result1, result2] = await Promise.allSettled([promise1, promise2]);
expect(result1.status).toBe('fulfilled');
expect(result2.status).toBe('rejected');
expect(result2.reason.message).toContain('already processed');
```

---

### AC5: Loading State During Request (User Feedback)
**Given:** Evaluator clicks Approve button  
**When:** Request is being processed by backend (simulated 500ms delay)  
**Then:**
- Button shows spinner icon (⟳ or <Spinner /> component)
- Button text changes to "Approving..."
- Button disabled (no duplicate clicks possible)
- After response received, button returns to normal state
- If error, button re-enabled for retry

**Visual States:**
```
[Normal]            → [Loading]              → [Success/Error]
"✓ Approve"         "⟳ Approving..."       "✓ Approve" (disabled)
(clickable)         (disabled, spinning)     (disabled, grayed)
```

**Test Acceptance:**
```javascript
await userEvent.click(screen.getByRole('button', { name: /approve/i }));
expect(screen.getByRole('button', { name: /approving/i })).toBeDisabled();
await waitFor(() => {
  expect(screen.getByRole('button', { name: /approve/i })).not.toBeDisabled();
});
```

---

### AC6: Error Handling with Retry (Network Failures)
**Given:** Network error or backend error occurs during status update  
**When:** Update fails with 5xx or network timeout  
**Then:**
- Error message displayed in red box below buttons
- Message clearly describes the problem (e.g., "Failed to approve idea. Please try again.")
- Buttons remain enabled for user to retry
- No partial state changes persisted
- Retry button shown or buttons re-clickable
- After successful retry, error message cleared

**Error Response Mapping:**
```
400 Bad Request      → "Invalid state transition. Cannot approve this idea."
401 Unauthorized     → "Session expired. Please log in again."
403 Forbidden        → "You don't have permission to evaluate this idea."
404 Not Found        → "Idea not found or has been deleted."
409 Conflict         → "This idea was already processed by another evaluator."
500+ Server Error    → "Failed to update idea. Please try again."
Network Timeout      → "Connection lost. Please check your internet and retry."
```

**Test Acceptance:**
```javascript
const error = new Error('Network error');
ideasService.updateIdeaStatus.mockRejectedValueOnce(error);

await userEvent.click(screen.getByRole('button', { name: /approve/i }));
expect(screen.getByText(/Failed to approve/i)).toBeInTheDocument();
expect(screen.getByRole('button', { name: /approve/i })).not.toBeDisabled();
```

---

### AC7: Tooltips & Confirmation Hints (Prevent Accidents)
**Given:** Evaluator hovers over Approve or Reject button  
**When:** Button is active and clickable  
**Then:**
- Tooltip appears: "Approve this idea?" (for Approve button)
- Tooltip appears: "Reject this idea?" (for Reject button)
- Tooltip disappears on mouseout
- For disabled buttons, tooltip shows reason: "This idea is already Accepted"
- Tooltips prevent accidental clicks

**Test Acceptance:**
```javascript
const approveBtn = screen.getByRole('button', { name: /approve/i });
expect(approveBtn).toHaveAttribute('title', expect.stringContaining('Approve'));
```

---

## Technical Implementation Plan

### Backend Architecture

**New File: `backend/src/services/statusTransition.service.ts`**

Implements the core state machine logic with transaction safety and optimistic locking.

```typescript
export class StatusTransitionService {
  /**
   * Defines all valid state transitions in the system
   */
  static readonly TRANSITIONS = {
    'Submitted': ['Under Review'],        // Auto-set in STORY-3.2
    'Under Review': ['Accepted', 'Rejected'],  // User decisions in STORY-3.3
    'Accepted': [],                       // Terminal state
    'Rejected': []                        // Terminal state
  };

  /**
   * Validates whether a transition is allowed according to state machine rules
   * @throws Error if transition is invalid
   */
  static validateTransition(currentStatus: string, newStatus: string): void {
    const allowedTransitions = this.TRANSITIONS[currentStatus];
    
    if (!allowedTransitions) {
      throw new Error(`Unknown status: ${currentStatus}`);
    }
    
    if (!allowedTransitions.includes(newStatus)) {
      throw new Error(
        `Invalid transition from ${currentStatus} to ${newStatus}`
      );
    }
  }

  /**
   * Executes a status transition with:
   * - Validation of state rules
   * - Optimistic locking (compare-and-swap)
   * - Transaction atomicity
   * - Audit logging
   * 
   * @param ideaId - ID of idea to update
   * @param newStatus - Target status
   * @param evaluatorId - User making the decision
   * @param feedback - Optional rejection feedback (STORY-3.4)
   * @returns Updated idea object
   * @throws Error on validation or concurrency failure
   */
  static async executeTransition(
    ideaId: string,
    newStatus: 'Accepted' | 'Rejected',
    evaluatorId: string,
    feedback?: string
  ): Promise<IdeaResponse> {
    // 1. Fetch current state
    const idea = await this.ideaRepository.findById(ideaId);
    if (!idea) throw new Error('Idea not found');

    // 2. Validate transition
    this.validateTransition(idea.status, newStatus);

    // 3. Execute atomic transaction with optimistic locking
    return await db.$transaction(async (tx) => {
      // Only update if status matches (optimistic lock)
      const updated = await tx.ideas.updateMany({
        where: {
          id: ideaId,
          status: idea.status  // Lock: only update if status still = old value
        },
        data: {
          status: newStatus,
          evaluatorId,
          evaluatorFeedback: feedback || null,
          updatedAt: new Date()
        }
      });

      // Concurrency check
      if (updated.count === 0) {
        throw new Error('Idea already updated by another evaluator');
      }

      // 4. Log the state change (for STORY-3.5)
      await tx.statusChangeLogs.create({
        data: {
          ideaId,
          oldStatus: idea.status,
          newStatus,
          evaluatorId,
          feedback,
          timestamp: new Date()
        }
      });

      // 5. Return updated idea
      return await tx.ideas.findUnique({ where: { id: ideaId } });
    });
  }
}
```

**Modified File: `backend/src/routes/ideas.ts`**

Update the PUT endpoint to use the new state machine service.

```typescript
// PUT /api/ideas/:ideaId/status
router.put(
  '/:ideaId/status',
  authMiddleware,
  roleMiddleware(['evaluator', 'admin']),
  async (req, res) => {
    try {
      const { ideaId } = req.params;
      const { status, feedback } = req.body;
      const evaluatorId = req.user.id;

      // Execute state transition with safety checks
      const updated = await StatusTransitionService.executeTransition(
        ideaId,
        status,
        evaluatorId,
        feedback
      );

      // Email notifications deferred to STORY-3.6
      // Only log the status change; STORY-3.6 queries this log and sends emails
      logger.info(`Status change recorded: Idea ${ideaId} → ${status} by ${evaluatorId}`);

      res.json({
        success: true,
        data: updated,
        message: `Idea ${status.toLowerCase()}`
      });
    } catch (error) {
      if (error.message.includes('Invalid transition')) {
        return res.status(400).json({
          error: 'INVALID_TRANSITION',
          message: error.message
        });
      }
      if (error.message.includes('already updated')) {
        return res.status(409).json({
          error: 'CONFLICT',
          message: 'This idea was already processed by another evaluator'
        });
      }
      if (error.message.includes('not found')) {
        return res.status(404).json({
          error: 'NOT_FOUND',
          message: 'Idea not found'
        });
      }
      return res.status(500).json({
        error: 'INTERNAL_ERROR',
        message: 'Failed to update idea status'
      });
    }
  }
);
```

### Frontend Components

**New File: `src/components/ApproveRejectButtons.tsx`**

Renders approve/reject decision buttons with loading states and error handling.

```typescript
import React, { useState } from 'react';
import { ideasService } from '../services/ideas.service';
import { IdeaResponse } from '../types/ideaSchema';
import RejectionFeedbackModal from './RejectionFeedbackModal';

interface ApproveRejectButtonsProps {
  idea: IdeaResponse;
  onStatusChanged: (newStatus: 'Accepted' | 'Rejected') => void;
  onError?: (error: string) => void;
}

export const ApproveRejectButtons: React.FC<ApproveRejectButtonsProps> = ({
  idea,
  onStatusChanged,
  onError
}) => {
  // Don't render buttons for terminal states (Accepted/Rejected)
  // These states cannot be changed, so no decision buttons needed
  if (idea.status === 'Accepted' || idea.status === 'Rejected') {
    return null;
  }

  const [approveLoading, setApproveLoading] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Determine button availability based on status
  const canApprove = idea.status === 'Under Review';
  const canReject = idea.status === 'Under Review';
  const isProcessing = approveLoading;

  const getTooltip = (action: 'approve' | 'reject') => {
    if (action === 'approve') {
      return canApprove ? 'Approve this idea?' : `This idea is already ${idea.status}`;
    }
    return canReject ? 'Reject this idea?' : `This idea is already ${idea.status}`;
  };

  const handleApprove = async () => {
    try {
      setApproveLoading(true);
      setError(null);
      setSuccess(null);

      await ideasService.updateIdeaStatus(idea.id, {
        status: 'Accepted'
      });

      setSuccess('✓ Idea approved successfully!');
      onStatusChanged('Accepted');

      // Auto-clear success after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      const message = err.response?.data?.message || err.message;
      
      if (message.includes('already processed')) {
        setError('This idea was already processed by another evaluator');
      } else if (message.includes('Invalid transition')) {
        setError(`Cannot approve: ${message}`);
      } else {
        setError('Failed to approve idea. Please try again.');
      }

      onError?.(error);
    } finally {
      setApproveLoading(false);
    }
  };

  const handleRejectClick = () => {
    if (canReject) {
      setShowRejectModal(true);
      // STORY-3.4 will implement full rejection with required feedback
    }
  };

  return (
    <>
      {/* Error Alert */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg flex justify-between items-center">
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="text-red-800 hover:text-red-900 font-bold"
            aria-label="Close error message"
          >
            ✕
          </button>
        </div>
      )}

      {/* Success Alert */}
      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg">
          {success}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        {/* Approve Button */}
        <button
          onClick={handleApprove}
          disabled={!canApprove || isProcessing}
          title={getTooltip('approve')}
          aria-label={canApprove ? 'Approve this idea' : 'Approve button disabled'}
          className={`flex-1 px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all
            ${
              canApprove && !isProcessing
                ? 'bg-green-600 text-white hover:bg-green-700 cursor-pointer active:scale-95'
                : 'bg-gray-300 text-gray-600 cursor-not-allowed opacity-50'
            }
          `}
        >
          {approveLoading ? (
            <>
              <span className="inline-block animate-spin">⟳</span>
              Approving...
            </>
          ) : (
            <>
              <span>✓</span>
              Approve
            </>
          )}
        </button>

        {/* Reject Button */}
        <button
          onClick={handleRejectClick}
          disabled={!canReject || isProcessing}
          title="Reject this idea? Feedback form opens in next step."
          aria-label="Reject idea"
          className={`flex-1 px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all bg-red-600 text-white hover:bg-red-700 cursor-pointer active:scale-95`}
        >
          <span>✕</span>
          Reject
        </button>
      </div>

      {/* Rejection Modal - Placeholder for STORY-3.4 */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-lg font-semibold mb-4">Reject Idea - Coming Soon</h2>
            <p className="text-gray-600 mb-6">The rejection feedback form will be implemented in STORY-3.4. For now, please use this modal to prepare for rejection.</p>
            <button
              onClick={() => setShowRejectModal(false)}
              className="w-full px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ApproveRejectButtons;
```

### Database Schema Changes

**Add columns to `ideas` table:**
```sql
ALTER TABLE ideas ADD COLUMN evaluatorId NVARCHAR(255) NULL;
ALTER TABLE ideas ADD COLUMN evaluatorFeedback NVARCHAR(500) NULL;
ALTER TABLE ideas ADD CONSTRAINT fk_ideas_evaluatorId 
  FOREIGN KEY (evaluatorId) REFERENCES users(id);
```

**Create audit log table (supports STORY-3.5):**
```sql
CREATE TABLE statusChangeLogs (
  id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
  ideaId UNIQUEIDENTIFIER NOT NULL,
  oldStatus NVARCHAR(50) NOT NULL,
  newStatus NVARCHAR(50) NOT NULL,
  evaluatorId NVARCHAR(255) NOT NULL,
  feedback NVARCHAR(500) NULL,
  timestamp DATETIME NOT NULL DEFAULT GETDATE(),
  
  CONSTRAINT fk_statusChangeLogs_ideaId 
    FOREIGN KEY (ideaId) REFERENCES ideas(id),
  CONSTRAINT fk_statusChangeLogs_evaluatorId 
    FOREIGN KEY (evaluatorId) REFERENCES users(id)
);

CREATE NONCLUSTERED INDEX idx_statusChangeLogs_ideaId 
  ON statusChangeLogs(ideaId);
CREATE NONCLUSTERED INDEX idx_statusChangeLogs_timestamp 
  ON statusChangeLogs(timestamp);
```

---

## Files Affected

### New Files
- `backend/src/services/statusTransition.service.ts` (State machine logic)
- `src/components/ApproveRejectButtons.tsx` (Decision buttons)
- `backend/migrations/[timestamp]-add-evaluator-fields.sql`

### Modified Files
- `backend/src/routes/ideas.ts` (Update PUT /ideas/:ideaId/status endpoint)
- `src/pages/IdeaReviewPanel.tsx` (Integrate ApproveRejectButtons)
- `src/services/ideas.service.ts` (updateIdeaStatus method signature)
- Database schema (add columns + create audit table)

---

## Test Plan

### Unit Tests (12 tests)

**StatusTransitionService Tests:**
```javascript
✓ Should allow "Under Review" → "Accepted" transition
✓ Should allow "Under Review" → "Rejected" transition
✓ Should block "Accepted" → "Rejected" transition
✓ Should block "Submitted" → "Accepted" transition (must go through Under Review)
✓ Should throw error on unknown status
✓ Should detect race condition (0 rows affected from optimistic lock)
✓ Should record status change log entry
✓ Should set evaluatorId on transition

**ApproveRejectButtons Component Tests:**
✓ Should render both buttons when status is "Under Review"
✓ Should disable buttons when status is "Accepted"
✓ Should disable buttons when status is "Rejected"
✓ Should show loading state during request
```

### Integration Tests (6 tests)

```javascript
✓ Clicking Approve calls API with correct payload
✓ Clicking Reject opens modal for feedback
✓ Success message displays and auto-clears
✓ Error message displays with retry capability
✓ Button states update after successful request
✓ Concurrent approvals: first succeeds, second fails with 409
```

### E2E Tests (5 tests)

```javascript
✓ E2E: Evaluate idea → Click Approve → Status changes to Accepted
✓ E2E: Evaluate idea → Click Reject → Modal opens for feedback
✓ E2E: Race condition → Both evaluators approve same idea → Second gets error
✓ E2E: Network error on approve → Retry succeeds
✓ E2E: Invalid transition (approve already-accepted idea) → Blocked silently
```

### Error Scenario Testing

| Scenario | Request | Expected Response | Client Handling |
|----------|---------|-------------------|-----------------|
| Invalid transition | PUT status: "Accepted" (on "Accepted" idea) | 400 Bad Request | Disable button |
| Race condition | PUT status: "Accepted" (concurrent) | 409 Conflict | "Already processed" error |
| Not found | PUT status: "Accepted" (deleted idea) | 404 Not Found | "Idea not found" error |
| Unauthorized | PUT (non-evaluator user) | 403 Forbidden | Redirect or error |
| Network error | PUT (timeout) | Network timeout | Retry button |

---

## Definition of Done

**Backend:**
- [ ] `StatusTransitionService` implements state machine with validation
- [ ] Optimistic locking prevents race conditions (compare-and-swap)
- [ ] Transactions use ROLLBACK on error (atomic operations)
- [ ] All transitions validated before update
- [ ] Audit log creates entry for each state change
- [ ] Error codes mapped correctly (400, 404, 409, 500)
- [ ] Database schema includes evaluatorId and audit table

**Frontend:**
- [ ] `ApproveRejectButtons` component renders correctly
- [ ] Buttons disabled appropriately based on status
- [ ] Loading states show/hide during request
- [ ] Error messages display with clear guidance
- [ ] Success messages auto-clear after 3 seconds
- [ ] Tooltips show on hover for all button states
- [ ] Accessibility: buttons have aria-labels, proper roles

**Testing:**
- [ ] Unit tests >85% coverage (18+ tests)
- [ ] Integration tests for API calls
- [ ] E2E test for full workflow
- [ ] Concurrency test for race conditions
- [ ] Error handling tested for all 409/400/404/500 scenarios
- [ ] Loading states verified
- [ ] No console errors or warnings

**Code Quality:**
- [ ] No TypeScript errors
- [ ] Code passes ESLint
- [ ] Tests use React Testing Library best practices
- [ ] Service layer properly decoupled
- [ ] Component follows design system

---

## Estimation & Risk

**Story Points:** 8  
**Estimated Days:** 2-3 days (assuming STORY-3.2 is done)

**Breakdown:**
- State machine service: 1 day (validation + transactions)
- Button component: 0.5 days (UI + integration)
- API endpoint update: 0.5 days (small change)
- Concurrency handling: 1 day (optimistic locking + testing)
- Testing (unit + E2E): 1 day
- Polish + fixes: 0.5 days

**Risk Assessment:**

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Race conditions in testing | Medium | High | Use optimistic locking + transactions; test with concurrent mocks |
| Invalid state transitions slip through | Low | High | Comprehensive unit tests for all transitions |
| Data corruption on error | Low | High | Use DB transactions with rollback |
| UI out of sync with backend | Low | Medium | Refetch idea after update; use optimistic UI |
| Evaluators confused by disabled buttons | Low | Medium | Add clear tooltips and error messages |

---

## Dependencies

### Blocks
- **STORY-3.4** (Requires rejection feedback modal)
- **STORY-3.5** (Audit logging uses status change logs)
- **STORY-3.6** (Email notifications triggered on status change)

### Blocked By
- **STORY-3.2** (Idea Review Panel must exist to embed buttons)

### Related
- **STORY-3.1** (Evaluation Queue provides list of ideas to review)

---

## Success Criteria

✅ **Workflow Integrity:** No invalid state transitions possible  
✅ **Concurrency Safe:** Race conditions prevented by optimistic locking  
✅ **User Experience:** Clear feedback (loading, error, success states)  
✅ **Audit Trail:** All transitions logged for compliance  
✅ **Performance:** Status updates complete in <1 second  
✅ **Reliability:** No data corruption; transactions atomic  

---

## Implementation Checklist

### Phase 1: Backend Setup
- [ ] Create `StatusTransitionService` with state machine validation
  - **NOTE:** Implement optimistic locking (compare-and-swap) for concurrency safety
  - **NOTE:** Return 409 Conflict on race condition (version mismatch)
- [ ] Update `PUT /ideas/:ideaId/status` endpoint with transaction safety
  - **NOTE:** Only call email logging service (defer actual email sending to STORY-3.6)
  - **NOTE:** Do NOT use emailService.notifyStatusChange() - use emailService.logStatusChange() instead
  - **NOTE:** Ensure statusChangeLogs entry is created in same transaction
- [ ] Add database columns (evaluatorId, evaluatorFeedback)
  - **NOTE:** evaluatorFeedback can be NULL initially (populated by STORY-3.4)
- [ ] Create statusChangeLogs table with audit trail
- [ ] Unit tests for state machine (>80% coverage)
- [ ] Integration tests for API endpoint (concurrent request handling)

### Phase 2: Frontend Integration
- [ ] Create `ApproveRejectButtons` component with state machine validation
  - **NOTE:** Approve button triggers immediate API call (status → Accepted)
  - **NOTE:** Reject button opens placeholder modal (STORY-3.4 implements actual feedback form)
  - **NOTE:** Component returns null when status is terminal (Accepted/Rejected)
- [ ] Integrate into `IdeaReviewPanel.tsx` on review panel footer
- [ ] Wire up API calls with error handling (400, 404, 409, 500)
- [ ] Add loading states (show spinner while processing)
- [ ] Add success/error messages (user feedback on completion)
- [ ] Component tests covering all state transitions (>85% coverage)

### Phase 3: Testing & Polish
- [ ] Unit tests for state machine validation (12 tests as per spec)
- [ ] Integration tests for API interactions (6 tests as per spec)
- [ ] E2E tests for full approval/rejection workflow (5 tests as per spec)
- [ ] Concurrency testing (verify 409 responses on simultaneous requests)
- [ ] Error scenario testing (400, 404, 409, 500 error codes)
- [ ] Accessibility checks (keyboard navigation, screen reader compatibility)
- [ ] Performance testing (confirm <1 second state transitions)
- [ ] Code review

### Phase 4: Deployment
- [ ] Database migration (add columns + create statusChangeLogs table)
- [ ] Deploy backend (StatusTransitionService + endpoint updates)
- [ ] Deploy frontend (ApproveRejectButtons + IdeaReviewPanel integration)
- [ ] Smoke testing (verify approve workflow end-to-end)
- [ ] Monitor error logs (watch for 409 Conflict errors, invalid transitions)

---

## Acceptance Sign-Off

| Role | Name | Date | Status |
|------|------|------|--------|
| Product Owner | To Be Assigned | - | PENDING |
| Tech Lead | To Be Assigned | - | PENDING |
| QA Lead | To Be Assigned | - | PENDING |

---

## Related Documentation

**Related Stories:**
- [STORY-3.1](STORY-3.1-SPECIFICATION.md) - Evaluation Queue List
- [STORY-3.2](STORY-3.2-SPECIFICATION.md) - Idea Review Panel
- [STORY-3.4](STORY-3.4-SPECIFICATION.md) - Rejection Feedback (when available)
- [STORY-3.5](STORY-3.5-SPECIFICATION.md) - Audit Logging (when available)
- [STORY-3.6](STORY-3.6-SPECIFICATION.md) - Status Change Notifications (when available)

**Technical References:**
- [StatusTransitionService](../backend/src/services/statusTransition.service.ts) (Implementation)
- [ApproveRejectButtons](../src/components/ApproveRejectButtons.tsx) (Component)

**Agents & Conventions:**
- [agents.md](./agents.md) - Project conventions and standards

---

## Change Log

| Date | Author | Change | Status |
|------|--------|--------|--------|
| 2026-02-26 | Development Team | Initial specification created | APPROVED |
| 2026-02-27 | Development Team | Clarifications applied: Optimistic locking chosen, rejection feedback deferred to STORY-3.4, notifications logged for STORY-3.6, terminal buttons hidden from DOM | FINALIZED |

---

## Questions & Discussion

### Key Discussion Points - RESOLVED
1. **Concurrency Model:** Is optimistic locking (compare-and-swap) acceptable, or do you prefer pessimistic locking?
   - **Decision:** ✅ **Optimistic locking chosen** (compare-and-swap with 409 Conflict on race condition)
   - Rationale: Better concurrency performance without long-held locks; clearer error semantics
   - Implementation: Version field in ideas table, compare-and-swap on update

2. **Feedback Timing:** Should rejection feedback be required immediately (STORY-3.3) or can it be deferred to STORY-3.4?
   - **Decision:** ✅ **Deferred to STORY-3.4** (placeholder modal in STORY-3.3)
   - Rationale: Lighter scope for STORY-3.3, cleaner separation of concerns
   - Implementation: Reject button opens "Coming Soon" modal, no form processing in STORY-3.3
   - Impact: AC2 updated to reflect placeholder modal instead of full feedback form

3. **Notifications:** Should approval/rejection trigger immediate email to submitter (STORY-3.6) or batch notifications?
   - **Decision:** ✅ **Log-only approach (defer to STORY-3.6)**
   - Rationale: Decoupled notification strategy, enables batch processing
   - Implementation: Call emailService.logStatusChange() instead of emailService.notifyStatusChange()
   - Impact: Emails sent asynchronously by STORY-3.6, not synchronously here

4. **Terminal State Buttons:** Should rejected/approved ideas show disabled buttons or hide buttons entirely?
   - **Decision:** ✅ **Hidden from DOM** (component returns null for terminal states)
   - Rationale: Cleaner UI, no visual confusion from disabled buttons
   - Implementation: `if (isTerminal) return null;` guard in ApproveRejectButtons

### Team Notes
- Optimistic locking chosen for better concurrency without long-held locks
- Transaction safety ensures audit log always consistent with idea status
- Error messages tested to be user-friendly and actionable
- Button states clearly communicate what actions are possible
- Scope boundaries clearly defined (feedback → 3.4, emails → 3.6)

