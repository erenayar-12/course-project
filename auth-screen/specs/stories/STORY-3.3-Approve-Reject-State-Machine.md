# STORY-3.3: Approve/Reject State Machine

**Status:** Not Started  
**Story ID:** STORY-3.3  
**Epic:** EPIC-3 (Idea Evaluation Workflow & Status Tracking)  
**Sprint:** Backlog  
**Story Points:** 8  
**Priority:** P0 (Critical)  
**Persona:** Raj (Evaluator/Admin)  
**Created:** February 26, 2026  
**Updated:** February 26, 2026  

---

## User Story

**As an** evaluator  
**I want** to approve or reject an idea from the review panel  
**so that** I can move ideas through the workflow and communicate my decision to submitters

---

## Context

The core decision-making workflow. Evaluators click Approve or Reject buttons in the review panel (STORY-3.2) to transition ideas between states. The state machine enforces valid transitions and prevents invalid actions (e.g., rejecting an already-accepted idea). Rejections require feedback (STORY-3.4). All transitions are logged for audit trail (STORY-3.5).

---

## Acceptance Criteria

### AC1: Approve Button Changes Status to "Accepted"
**Given:** Idea is in "Under Review" status  
**When:** Evaluator clicks "Approve" button  
**Then:**
- API call made: `PUT /api/ideas/:ideaId/status` with body `{ status: 'Accepted' }`
- Idea status changes to "Accepted" in database
- Button validation succeeds
- UI updates immediately to show new status
- Notification shown: "Idea approved successfully!"
- Approve button becomes disabled/hidden

### AC2: Reject Button Opens Feedback Form
**Given:** Idea is in "Under Review" status  
**When:** Evaluator clicks "Reject" button  
**Then:**
- Modal opens (implemented in STORY-3.4)
- Form asks for rejection reason/feedback
- Evaluator enters feedback
- On submit, status changes to "Rejected" with feedback saved

### AC3: State Transitions Are Validated
**Given:** Idea is in "Accepted" status  
**When:** Evaluator tries to approve again or reject  
**Then:**
- Approve button is disabled with tooltip: "This idea is already accepted"
- Reject button is disabled with tooltip: "This idea is already accepted"
- Buttons show grayed-out appearance
- Cannot click buttons

### AC4: Concurrent Requests Handled Safely
**Given:** Two evaluators viewing same idea simultaneously  
**When:** Both try to approve at exact same time  
**Then:**
- First update succeeds, status changes to "Accepted"
- Second update fails with error: "Idea already processed by another evaluator"
- Database transaction ensures no race conditions
- No duplicate approvals possible

### AC5: Buttons Show Loading State During Update
**Given:** Evaluator clicks Approve button  
**When:** Request sent to backend  
**Then:**
- Button shows spinner icon
- Button is disabled (no further clicks)
- Button text changes to "Approving..."
- After response received, button returns to normal state

### AC6: Error Handling
**Given:** Network error occurs during status update  
**When:** Update fails  
**Then:**
- Error message displayed: "Failed to update idea status. Please try again."
- Retry button shown
- Buttons remain enabled for retry
- No partial state changes persisted

### AC7: Confirmation Before Action
**Given:** Evaluator's mouse hovers over Approve/Reject  
**When:** Button shows tooltip/confirmation  
**Then:**
- Tooltip shows: "Approve this idea?" or "Reject this idea?"
- Prevents accidental clicks
- Visual feedback clear

---

## Technical Details

### State Machine Diagram

```
                    ┌─ Submitted
                    │    │
                    │    v
              ┌─────────────────┐
              │   Under Review  │
              └─────────────────┘
                    │         │
                    v         v
              Accepted    Rejected
                (Final)      (Final)

Valid Transitions:
  Submitted → Under Review (auto in STORY-3.2)
  Under Review → Accepted (STORY-3.3)
  Under Review → Rejected (STORY-3.3 + STORY-3.4)
  
Invalid (Blocked):
  Accepted → Anything (terminal state)
  Rejected → Anything (terminal state)
  Submitted → Accepted/Rejected (must go through Under Review first)
```

### Backend State Machine Logic

**File:** `backend/src/services/statusTransition.service.ts` (NEW)

```typescript
export class StatusTransitionService {
  // Valid transitions
  static readonly TRANSITIONS = {
    'Submitted': ['Under Review'],
    'Under Review': ['Accepted', 'Rejected'],
    'Accepted': [], // Terminal
    'Rejected': []  // Terminal
  };

  /**
   * Validate if transition is allowed
   * @throws Error if invalid transition
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
   * Execute status transition with transaction safety
   * Uses optimistic locking to prevent race conditions
   */
  static async executeTransition(
    ideaId: string,
    newStatus: string,
    evaluatorId: string,
    feedback?: string
  ): Promise<IdeaResponse> {
    const idea = await db.ideas.findUnique({ where: { id: ideaId } });
    
    if (!idea) {
      throw new Error('Idea not found');
    }

    // Validate transition
    this.validateTransition(idea.status, newStatus);

    // Use transaction for atomic update + logging
    return await db.$transaction(async (tx) => {
      // Update idea with optimistic locking
      // Only update if status hasn't changed (compare-and-swap)
      const updated = await tx.ideas.updateMany({
        where: {
          id: ideaId,
          status: idea.status // Only update if status is still same
        },
        data: {
          status: newStatus,
          evaluatorId,
          evaluatorFeedback: feedback || null,
          updatedAt: new Date()
        }
      });

      if (updated.count === 0) {
        throw new Error('Idea already updated by another evaluator');
      }

      // Log the change (STORY-3.5)
      await tx.statusChangeLogs.create({
        data: {
          ideaId,
          oldStatus: idea.status,
          newStatus,
          evaluatorId,
          feedback: feedback || null,
          timestamp: new Date()
        }
      });

      // Return updated idea
      return await tx.ideas.findUnique({ where: { id: ideaId } });
    });
  }
}
```

### Frontend Implementation

**File:** `src/components/ApproveRejectButtons.tsx` (NEW)

```typescript
import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ideasService } from '../services/ideas.service';
import { RejectionFeedbackModal } from './RejectionFeedbackModal';

interface ApproveRejectButtonsProps {
  idea: IdeaResponse;
  onStatusChanged: (newStatus: string) => void;
}

export function ApproveRejectButtons({ idea, onStatusChanged }: ApproveRejectButtonsProps) {
  const { user } = useContext(AuthContext);
  
  const [approveLoading, setApproveLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Determine button states
  const canApprove = idea.status === 'Under Review';
  const canReject = idea.status === 'Under Review';
  const isDisabled = approveLoading || rejectLoading;

  const handleApprove = async () => {
    try {
      setApproveLoading(true);
      setError(null);
      setSuccess(null);

      // Call API
      const updated = await ideasService.updateIdeaStatus(idea.id, {
        status: 'Accepted'
      });

      setSuccess('Idea approved successfully!');
      onStatusChanged('Accepted');

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      if (err.message.includes('already updated')) {
        setError('This idea was already processed by another evaluator');
      } else {
        setError('Failed to approve idea. Please try again.');
      }
    } finally {
      setApproveLoading(false);
    }
  };

  const handleRejectClick = () => {
    if (canReject) {
      setShowRejectModal(true);
    }
  };

  const handleRejectSubmit = async (feedback: string) => {
    try {
      setRejectLoading(true);
      setError(null);
      setSuccess(null);

      // Call API
      const updated = await ideasService.updateIdeaStatus(idea.id, {
        status: 'Rejected',
        feedback
      });

      setSuccess('Idea rejected with feedback sent to submitter');
      onStatusChanged('Rejected');
      setShowRejectModal(false);

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to reject idea. Please try again.');
    } finally {
      setRejectLoading(false);
    }
  };

  return (
    <>
      {/* Error/Success Messages */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-800 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-800 rounded">
          ✓ {success}
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleApprove}
          disabled={!canApprove || isDisabled}
          title={!canApprove ? 'This idea is already ' + idea.status : 'Approve this idea?'}
          className={`flex-1 px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition
            ${canApprove && !isDisabled
              ? 'bg-green-600 text-white hover:bg-green-700 cursor-pointer'
              : 'bg-gray-300 text-gray-600 cursor-not-allowed'
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
              ✓ Approve
            </>
          )}
        </button>

        <button
          onClick={handleRejectClick}
          disabled={!canReject || isDisabled}
          title={!canReject ? 'This idea is already ' + idea.status : 'Reject this idea?'}
          className={`flex-1 px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition
            ${canReject && !isDisabled
              ? 'bg-red-600 text-white hover:bg-red-700 cursor-pointer'
              : 'bg-gray-300 text-gray-600 cursor-not-allowed'
            }
          `}
        >
          {rejectLoading ? (
            <>
              <span className="inline-block animate-spin">⟳</span>
              Rejecting...
            </>
          ) : (
            <>
              ✗ Reject
            </>
          )}
        </button>
      </div>

      {/* Rejection Modal */}
      <RejectionFeedbackModal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onSubmit={handleRejectSubmit}
        isLoading={rejectLoading}
      />
    </>
  );
}
```

### API Endpoint Update

**File:** `backend/src/routes/ideas.ts`

```typescript
router.put('/:ideaId/status', authMiddleware, roleMiddleware(['evaluator']), async (req, res) => {
  try {
    const { ideaId } = req.params;
    const { status, feedback } = req.body;
    const userId = req.user.id;
    const userName = req.user.name;

    // Use state machine service
    const updated = await StatusTransitionService.executeTransition(
      ideaId,
      status,
      userId,
      feedback
    );

    // Trigger email notification (STORY-3.6)
    await emailService.notifyStatusChange(updated, status);

    res.json(updated);
  } catch (error) {
    if (error.message.includes('Invalid transition')) {
      res.status(400).json({ error: 'Invalid transition', message: error.message });
    } else if (error.message.includes('already updated')) {
      res.status(409).json({ error: 'Conflict', message: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});
```

### Database Schema

**Add column to `ideas` table:**
```sql
ALTER TABLE ideas ADD COLUMN evaluatorId NVARCHAR(255) NULL;
ALTER TABLE ideas ADD COLUMN evaluatorFeedback NVARCHAR(500) NULL;
ALTER TABLE ideas ADD FOREIGN KEY (evaluatorId) REFERENCES users(id);
```

**Create audit log table (for STORY-3.5):**
```sql
CREATE TABLE statusChangeLogs (
  id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
  ideaId UNIQUEIDENTIFIER NOT NULL,
  oldStatus NVARCHAR(50) NOT NULL,
  newStatus NVARCHAR(50) NOT NULL,
  evaluatorId NVARCHAR(255) NOT NULL,
  feedback NVARCHAR(500) NULL,
  timestamp DATETIME NOT NULL DEFAULT GETDATE(),
  FOREIGN KEY (ideaId) REFERENCES ideas(id),
  FOREIGN KEY (evaluatorId) REFERENCES users(id)
);
CREATE INDEX idx_statusChangeLogs_ideaId ON statusChangeLogs(ideaId);
CREATE INDEX idx_statusChangeLogs_timestamp ON statusChangeLogs(timestamp);
```

---

## Files Affected

### New Files
- `backend/src/services/statusTransition.service.ts`
- `src/components/ApproveRejectButtons.tsx`

### Modified Files
- `src/pages/IdeaReviewPanel.tsx` - Integrate ApproveRejectButtons component
- `backend/src/routes/ideas.ts` - Update PUT /ideas/:ideaId/status endpoint
- `src/services/ideas.service.ts` - Ensure updateIdeaStatus() method exists
- Database migrations

---

## Testing

### Unit Tests
- [ ] Valid transitions allowed
- [ ] Invalid transitions blocked with error
- [ ] Concurrent updates prevented (optimistic locking)
- [ ] Transaction succeeds or rolls back atomically
- [ ] Error messages appropriate
- [ ] Loading states show/hide correctly
- [ ] Buttons enable/disable correctly based on state

### E2E Tests
- [ ] Approve button works when state is "Under Review"
- [ ] Reject opens modal
- [ ] Disabled states shown for "Accepted" ideas
- [ ] Concurrent approvals handled
- [ ] Network error retry works
- [ ] Success messages shown

---

## Error Scenarios

| Scenario | Error | Handling |
|----------|-------|----------|
| Invalid transition | 400 Bad Request | Display "Cannot approve an already processed idea" |
| Race condition | 409 Conflict | Display "Already processed by another evaluator" |
| Not found | 404 Not Found | Display "Idea not found" |
| Unauthorized | 403 Forbidden | Redirect to home |
| Network error | N/A | Retry button, preserve state |

---

## Definition of Done Checklist

- [ ] State machine validated on backend
- [ ] Optimistic locking prevents race conditions
- [ ] All transitions work correctly
- [ ] Invalid transitions blocked
- [ ] Loading states show/hide properly
- [ ] Error handling complete
- [ ] Transaction uses rollback correctly
- [ ] Buttons disabled appropriately
- [ ] Accessibility verified
- [ ] Unit tests >85% coverage
- [ ] E2E tests passing
- [ ] No console errors
- [ ] Performance acceptable

---

## Dependencies

### Blocks
- STORY-3.4 (Rejection feedback needs reject flow)
- STORY-3.5 (Audit logging follows state changes)
- STORY-3.6 (Email notifications on status change)

### Blocked By
- STORY-3.2 (Review panel with status display)

---

## Estimation

- **Story Points:** 8
- **Estimated Days:** 2-3 days
- **Confidence:** Medium (state machine + concurrency handling is complex)

**Breakdown:**
- State machine service: 1 day
- Button component: 0.5 days
- API endpoint: 0.5 days
- Transaction/locking: 1 day
- Testing: 1 day

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Race conditions on concurrent approvals | Medium | High | Use optimistic locking + transactions |
| Invalid state transitions | Low | High | Validate on backend before update |
| Data corruption on error | Low | High | Use transactions with rollback |
| UI out of sync with backend | Low | Medium | Refetch idea after update |

---

## Notes

- State machine is the critical logic - needs thorough testing
- Optimistic locking uses database comparison to prevent races
- Transaction safety ensures no partial updates
- Error messages should guide evaluators
- Buttons disabled for terminal states (Accepted/Rejected)
