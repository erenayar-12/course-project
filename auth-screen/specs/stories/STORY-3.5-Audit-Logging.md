# STORY-3.5: Audit Logging

**Status:** Not Started  
**Story ID:** STORY-3.5  
**Epic:** EPIC-3 (Idea Evaluation Workflow & Status Tracking)  
**Sprint:** Backlog  
**Story Points:** 5  
**Priority:** P1 (Important)  
**Persona:** Raj (Admin/Compliance Officer)  
**Created:** February 26, 2026  
**Updated:** February 26, 2026  

---

## User Story

**As an** admin  
**I want** all status changes to be logged with timestamp, evaluator ID, and action taken  
**so that** we have a complete audit trail of who made what decision and when, for compliance

---

## Context

Audit logging creates an immutable record of all idea status transitions. Every status change (Submitted → Under Review, Under Review → Accepted/Rejected) is logged with: ideaId, oldStatus, newStatus, evaluatorId, evaluatorName, timestamp, feedback (if applicable). These logs serve compliance, debugging, and historical analysis. Logs are displayed as status timeline (STORY-3.7).

---

## Acceptance Criteria

### AC1: Status Change Logged to Audit Table
**Given:** Evaluator approves or rejects an idea  
**When:** Status update succeeds  
**Then:**
- Audit log entry created in `statusChangeLogs` table
- Entry contains: ideaId, oldStatus, newStatus, evaluatorId, timestamp
- Log created within same transaction as status update
- Log entry is immutable (cannot be modified/deleted after creation)

### AC2: All Fields Populated Correctly
**Given:** Status change logged  
**When:** Admin queries audit logs  
**Then:**
- ideaId: UUID of idea
- oldStatus: Previous status (e.g., "Submitted")
- newStatus: New status (e.g., "Under Review")
- evaluatorId: User ID of evaluator making change
- evaluatorName: Full name of evaluator (from users table)
- timestamp: UTC timestamp with millisecond precision
- feedback: Rejection feedback if applicable, null otherwise

### AC3: Timestamp Is Accurate
**Given:** Audit log entry created at exactly 2:45:30.123 UTC  
**When:** Checking timestamp in database  
**Then:**
- Shows UTC time with millisecond precision
- Timezone handled correctly
- No rounding or truncation

### AC4: Feedback Included in Logs (If Rejection)
**Given:** Idea rejected with feedback "Missing business case"  
**When:** Audit log created  
**Then:**
- Feedback field populated with rejection text
- Feedback field null for non-rejection transitions

### AC5: Concurrent Updates Don't Lose Data
**Given:** Multiple status changes happening simultaneously  
**When:** Audit logs queried  
**Then:**
- All changes recorded
- No log entries missing
- No duplicate entries
- Logs in correct chronological order

### AC6: Audit Logs Immutable
**Given:** Audit log entry exists  
**When:** Admin tries to modify or delete log  
**Then:**
- Operations fail (permission denied or constraint violation)
- Logs cannot be edited or deleted (append-only design)

---

## Technical Details

### Database Schema

**Create `statusChangeLogs` table:**

```sql
CREATE TABLE statusChangeLogs (
  id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
  ideaId UNIQUEIDENTIFIER NOT NULL,
  oldStatus NVARCHAR(50) NOT NULL,
  newStatus NVARCHAR(50) NOT NULL,
  evaluatorId NVARCHAR(255) NOT NULL,
  evaluatorName NVARCHAR(255) NOT NULL,
  feedback NVARCHAR(500) NULL,
  timestamp DATETIME NOT NULL DEFAULT GETUTCDATE(),
  
  FOREIGN KEY (ideaId) REFERENCES ideas(id),
  FOREIGN KEY (evaluatorId) REFERENCES users(id),
  
  -- Prevent modification/deletion
  CONSTRAINT pk_statusChangeLogs PRIMARY KEY (id)
);

-- Indexes for query performance
CREATE INDEX idx_statusChangeLogs_ideaId ON statusChangeLogs(ideaId);
CREATE INDEX idx_statusChangeLogs_timestamp ON statusChangeLogs(timestamp);
CREATE INDEX idx_statusChangeLogs_evaluatorId ON statusChangeLogs(evaluatorId);
```

### Backend Service

**File:** `backend/src/services/auditLog.service.ts` (NEW)

```typescript
export class AuditLogService {
  /**
   * Log a status change (called within transaction)
   */
  static async logStatusChange(
    tx: PrismaClient,
    ideaId: string,
    oldStatus: string,
    newStatus: string,
    evaluatorId: string,
    evaluatorName: string,
    feedback?: string
  ) {
    return await tx.statusChangeLogs.create({
      data: {
        ideaId,
        oldStatus,
        newStatus,
        evaluatorId,
        evaluatorName,
        feedback: feedback || null,
        timestamp: new Date() // Uses server time
      }
    });
  }

  /**
   * Get all logs for an idea
   */
  static async getLogsForIdea(ideaId: string) {
    return await db.statusChangeLogs.findMany({
      where: { ideaId },
      orderBy: { timestamp: 'asc' }
    });
  }

  /**
   * Get logs by evaluator (for admin reporting)
   */
  static async getLogsByEvaluator(evaluatorId: string, startDate?: Date, endDate?: Date) {
    return await db.statusChangeLogs.findMany({
      where: {
        evaluatorId,
        timestamp: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: { timestamp: 'desc' }
    });
  }
}
```

### Integration with Status Transition

**File:** `backend/src/services/statusTransition.service.ts` - Update executeTransition:

```typescript
static async executeTransition(
  ideaId: string,
  newStatus: string,
  evaluatorId: string,
  evaluatorName: string,
  feedback?: string
): Promise<IdeaResponse> {
  const idea = await db.ideas.findUnique({ where: { id: ideaId } });
  
  if (!idea) throw new Error('Idea not found');

  this.validateTransition(idea.status, newStatus);

  // Transaction: update idea AND log change atomically
  return await db.$transaction(async (tx) => {
    // Update idea
    const updated = await tx.ideas.updateMany({
      where: {
        id: ideaId,
        status: idea.status // Optimistic lock
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

    // Log the change - within SAME transaction
    await AuditLogService.logStatusChange(
      tx,
      ideaId,
      idea.status,
      newStatus,
      evaluatorId,
      evaluatorName,
      feedback
    );

    // Return updated idea
    return await tx.ideas.findUnique({ where: { id: ideaId } });
  });
}
```

### API Endpoint for Querying Logs

**File:** `backend/src/routes/audit.ts` (NEW)

```typescript
import { Router } from 'express';
import { authMiddleware, roleMiddleware } from '../middleware';
import { AuditLogService } from '../services/auditLog.service';

const router = Router();

// Get logs for specific idea (visible to anyone with access)
router.get('/ideas/:ideaId/history', authMiddleware, async (req, res) => {
  try {
    const { ideaId } = req.params;
    
    // Verify user can view this idea
    const idea = await db.ideas.findUnique({ where: { id: ideaId } });
    if (!idea) return res.status(404).json({ error: 'Not found' });
    
    // Can view if: submitter, evaluator, or admin
    if (idea.userId !== req.user.id && !req.user.roles?.includes('evaluator')) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const logs = await AuditLogService.getLogsForIdea(ideaId);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get logs by evaluator (admin only)
router.get('/evaluator/:evaluatorId', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const { evaluatorId } = req.params;
    const { startDate, endDate } = req.query;
    
    const logs = await AuditLogService.getLogsByEvaluator(
      evaluatorId,
      startDate ? new Date(startDate as string) : undefined,
      endDate ? new Date(endDate as string) : undefined
    );
    
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
```

### TypeScript Types

**File:** `src/types/audit.ts` (NEW)

```typescript
export interface StatusChangeLog {
  id: string;
  ideaId: string;
  oldStatus: IdeaStatus;
  newStatus: IdeaStatus;
  evaluatorId: string;
  evaluatorName: string;
  feedback: string | null;
  timestamp: Date;
}
```

---

## Implementation Checklist

**Backend:**
- [ ] Create `statusChangeLogs` table
- [ ] Create `AuditLogService` class
- [ ] Integrate logging into `StatusTransitionService`
- [ ] Create audit query endpoints
- [ ] Add indexes for performance

**Frontend:**
- [ ] Add audit log service method
- [ ] Display timeline (STORY-3.7)

**Database Migrations:**
- [ ] Create migration script to create table
- [ ] Add backup of logs table

---

## Files Affected

### New Files
- `backend/src/services/auditLog.service.ts`
- `backend/src/routes/audit.ts`
- `src/types/audit.ts`

### Modified Files
- `backend/src/services/statusTransition.service.ts` - Add logging call
- `backend/src/routes/ideas.ts` - Use logging-aware transition service
- Database migrations

---

## Testing

### Unit Tests
- [ ] Log created for each status change
- [ ] All fields populated correctly
- [ ] Timestamp accurate
- [ ] Concurrent updates all logged
- [ ] Query by ideaId returns all changes in order
- [ ] Query by evaluatorId works
- [ ] Logs immutable (update/delete fails)

### E2E Tests
- [ ] Complete workflow logs all changes
- [ ] Multiple evaluations logged separately
- [ ] Feedback logged with rejection
- [ ] Admin can view all logs
- [ ] Submitter can view their idea's log

---

## Definition of Done Checklist

- [ ] Table created with proper constraints
- [ ] Logging integrated into state transitions
- [ ] All fields captured correctly
- [ ] Transaction ensures atomicity
- [ ] Indexes created for performance
- [ ] Query end points working
- [ ] Immutability enforced
- [ ] Timestamps accurate
- [ ] Unit tests >85%
- [ ] E2E tests passing
- [ ] No orphaned logs
- [ ] Tested with concurrent updates

---

## Compliance & Security

- **Compliance:** Audit trail satisfies compliance requirements (who, what, when)
- **Tamper-Proof:** Append-only design prevents modification
- **Performance:** Indexes ensure quick historical queries
- **Data Privacy:** Only logs status changes (no PII except names)

---

## Dependencies

### Blocks
- STORY-3.6 (Email notifications use logs)
- STORY-3.7 (Timeline displays logs)

### Blocked By
- STORY-3.3 (Status transitions must exist first)

---

## Estimation

- **Story Points:** 5
- **Estimated Days:** 1 day
- **Confidence:** High

**Breakdown:**
- Table schema: 0.2 days
- Service code: 0.3 days
- Integration: 0.3 days
- Testing: 0.2 days

---

## Notes

- Logging must be within same transaction as status update for atomicity
- Timestamps use UTC for consistency across timezones
- Feedback stored both in `ideas.evaluatorFeedback` and `statusChangeLogs.feedback`
- Logs are immutable (no updates/deletes after creation)
- Foundation for compliance reporting and auditing
