# STORY-3.7: Status Timeline View

**Status:** Not Started  
**Story ID:** STORY-3.7  
**Epic:** EPIC-3 (Idea Evaluation Workflow & Status Tracking)  
**Sprint:** Backlog  
**Story Points:** 3  
**Priority:** P2 (Nice to Have)  
**Persona:** Priya (Submitter)  
**Created:** February 26, 2026  
**Updated:** February 26, 2026  

---

## User Story

**As a** submitter  
**I want** to see a timeline showing my idea's status journey from submission through evaluation to final decision  
**so that** I can understand how long ideas typically take and see when decisions were made

---

## Context

The status timeline displays a visual history of all status changes for an idea. For each transition (Submitted → Under Review → Accepted/Rejected), the timeline shows: timestamp, new status, evaluator name, and feedback (if rejection). Timeline is displayed on the idea detail page (STORY-2.5) below the main content. Data sourced from the audit logs created in STORY-3.5.

---

## Acceptance Criteria

### AC1: Timeline Section Visible on Detail Page
**Given:** Submitter views their idea detail page  
**When:** Page loads  
**Then:**
- "Status Timeline" or "History" section visible below main content
- Section shows all status changes chronologically

### AC2: Timeline Shows All Status Changes
**Given:** Idea has been through: Submitted → Under Review → Accepted  
**When:** Timeline viewed  
**Then:**
- All 3 changes displayed in order
- No missing transitions

### AC3: Each Entry Shows Key Information
**Given:** Status change entry in timeline  
**When:** Submitter reads entry  
**Then:**
- Timestamp: "Feb 1, 2026 at 9:00 AM"
- Status: "Submitted"
- Evaluator name (if applicable): "Raj"
- Feedback (if rejection): "Missing business case"

### AC4: Status Badges Colored Appropriately
**Given:** Timeline displayed  
**When:** Submitter views status badges  
**Then:**
- Submitted = Gray (#9CA3AF)
- Under Review = Yellow (#FCD34D)
- Accepted = Green (#10B981)
- Rejected = Red (#EF4444)

### AC5: Timeline Chronological
**Given:** Multiple status changes  
**When:** Timeline displayed  
**Then:**
- Changes shown in chronological order (oldest at top, newest at bottom)
- Vertically arranged with connecting line
- Visual indicators (dots) for each change

### AC6: Times Show Relative Duration
**Given:** Status change entry  
**When:** Submitter hovers over timestamp  
**Then:**
- Tooltip shows human-readable duration
- Example: "Approved after 3 days in review"
- Shows time between previous status and current status

---

## Technical Details

### Component to Create

**File:** `src/components/StatusTimeline.tsx` (NEW)

```typescript
interface StatusTimelineProps {
  logs: StatusChangeLog[];
}

export function StatusTimeline({ logs }: StatusTimelineProps) {
  if (!logs || logs.length === 0) {
    return (
      <section className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Status History</h2>
        <p className="text-gray-500">No status history available</p>
      </section>
    );
  }

  // Add initial "Submitted" entry if not present
  const timelineEntries = [
    {
      status: 'Submitted',
      timestamp: logs[0]?.timestamp || new Date(),
      evaluatorName: null,
      feedback: null
    },
    ...logs
  ];

  // Calculate durations between statuses
  const enrichedEntries = timelineEntries.map((entry, idx) => ({
    ...entry,
    duration: idx > 0 
      ? calculateDuration(timelineEntries[idx - 1].timestamp, entry.timestamp)
      : null
  }));

  const statusColors = {
    'Submitted': '#9CA3AF',
    'Under Review': '#FCD34D',
    'Accepted': '#10B981',
    'Rejected': '#EF4444'
  };

  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold mb-6">Status History</h2>
      
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-4 top-0 bottom-0 w-1 bg-gray-300" />
        
        {/* Timeline entries */}
        <div className="space-y-6 pl-12">
          {enrichedEntries.map((entry, idx) => (
            <div key={idx} className="relative">
              {/* Dot indicator */}
              <div
                className="absolute -left-8 top-1 w-5 h-5 rounded-full border-4 border-white"
                style={{ backgroundColor: statusColors[entry.status] || '#9CA3AF' }}
              />
              
              {/* Entry content */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-semibold text-gray-900"
                      style={{ backgroundColor: statusColors[entry.status] }}
                    >
                      {entry.status}
                    </span>
                    
                    {entry.evaluatorName && (
                      <span className="text-sm text-gray-600">
                        by {entry.evaluatorName}
                      </span>
                    )}
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {formatDate(entry.timestamp)}
                    </p>
                    {entry.duration && (
                      <p
                        className="text-xs text-gray-500 cursor-help"
                        title={`Time since previous status: ${entry.duration}`}
                      >
                        {entry.duration}
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Rejection feedback */}
                {entry.feedback && (
                  <div className="mt-3 p-3 bg-red-50 rounded border-l-4 border-red-500">
                    <p className="text-xs font-semibold text-red-900 mb-1">
                      Feedback:
                    </p>
                    <p className="text-sm text-red-800">
                      {entry.feedback}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Helpers
function formatDate(date: Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function calculateDuration(fromDate: Date, toDate: Date): string {
  const from = new Date(fromDate);
  const to = new Date(toDate);
  const diffMs = to.getTime() - from.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  } else if (diffHours > 0) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  } else {
    const diffMins = Math.floor(diffMs / (1000 * 60));
    return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  }
}
```

### API Endpoint

**File:** `backend/src/routes/audit.ts` - Already created in STORY-3.5

```typescript
router.get('/ideas/:ideaId/history', authMiddleware, async (req, res) => {
  try {
    const { ideaId } = req.params;
    const logs = await AuditLogService.getLogsForIdea(ideaId);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Frontend Service

**File:** `src/services/audit.service.ts` (NEW)

```typescript
import axios from 'axios';
import { getAuthHeaders } from './auth.service';

export class AuditService {
  async getIdeaHistory(ideaId: string) {
    const response = await axios.get(
      `/api/audit/ideas/${ideaId}/history`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  }
}

export const auditService = new AuditService();
```

### Integration with IdeaDetailPage

**File:** `src/pages/IdeaDetailPage.tsx` - Add at end:

```typescript
import { StatusTimeline } from '../components/StatusTimeline';
import { auditService } from '../services/audit.service';

export function IdeaDetailPage() {
  const [idea, setIdea] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [isLoadingTimeline, setIsLoadingTimeline] = useState(false);

  // ... existing code ...

  // Fetch timeline history
  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        setIsLoadingTimeline(true);
        const logs = await auditService.getIdeaHistory(ideaId);
        setTimeline(logs);
      } catch (err) {
        console.error('Failed to load timeline:', err);
      } finally {
        setIsLoadingTimeline(false);
      }
    };

    if (ideaId) {
      fetchTimeline();
    }
  }, [ideaId]);

  return (
    <div>
      {/* ... existing idea details ... */}

      {/* Status Timeline - at end */}
      <StatusTimeline logs={timeline} />
    </div>
  );
}
```

### TypeScript Types

**File:** `src/types/audit.ts` (if not already created in STORY-3.5)

```typescript
export interface StatusChangeLog {
  id: string;
  ideaId: string;
  oldStatus: string;
  newStatus: string;
  evaluatorId: string;
  evaluatorName: string;
  feedback: string | null;
  timestamp: Date;
}
```

---

## Visual Design

```
Status History

[o] Submitted                          Feb 1, 2026 at 9:00 AM
    No duration shown (initial status)

[o] Under Review                       Feb 2, 2026 at 10:30 AM
    Reviewed by Raj                    3 hours ago

[o] Accepted                           Feb 3, 2026 at 2:45 PM
    Evaluated by Raj                   1 day, 4 hours ago

--- Rejected Entry Example ---

[o] Rejected                           Feb 3, 2026 at 2:45 PM
    Evaluated by Raj                   1 day, 4 hours ago
    
    Feedback:
    Missing customer research and market analysis
```

### Color Codes

| Status | Color | Hex |
|--------|-------|-----|
| Submitted | Gray | #9CA3AF |
| Under Review | Yellow | #FCD34D |
| Accepted | Green | #10B981 |
| Rejected | Red | #EF4444 |

---

## Files Affected

### New Files
- `src/components/StatusTimeline.tsx`
- `src/services/audit.service.ts`

### Modified Files
- `src/pages/IdeaDetailPage.tsx` - Add timeline section
- `src/types/audit.ts` - Add types (or create if not in STORY-3.5)

---

## Testing

### Unit Tests
- [ ] Timeline renders with data
- [ ] Empty timeline shows message
- [ ] Dates formatted correctly
- [ ] Durations calculated correctly
- [ ] Status badges show correct colors
- [ ] Feedback displayed for rejections
- [ ] Chronological order maintained

### E2E Tests
- [ ] Timeline visible on idea detail page
- [ ] All status changes shown
- [ ] Dropdown works on multiple ideas
- [ ] Durations update correctly
- [ ] Dates are clickable/hoverable for details

---

## Definition of Done Checklist

- [ ] Component renders timeline correctly
- [ ] API call fetches all logs
- [ ] Dates formatted appropriately
- [ ] Durations calculated accurately
- [ ] Colors match design system
- [ ] Feedback displayed for rejections
- [ ] Mobile responsive
- [ ] Accessibility verified
- [ ] Unit tests >80%
- [ ] E2E tests passing
- [ ] No console errors

---

## Dependencies

### Blocks
- None

### Blocked By
- STORY-3.5 (Audit logs must exist)

### Related To
- STORY-2.5 (Detail page)
- STORY-3.1-3.3 (Status changes that populate timeline)

---

## Estimation

- **Story Points:** 3
- **Estimated Days:** 0.5-1 day
- **Confidence:** High

**Breakdown:**
- Component: 0.4 days
- Integration: 0.2 days
- Testing: 0.2 days

---

## User Experience

**Flow:**
1. Submitter navigates to their idea detail page
2. Scrolls down to "Status History" section
3. Sees timeline of all status changes
4. Hovers over duration to see "1 day, 4 hours between submission and approval"
5. If rejected, reads feedback in red box

**Mobile:**
- Timeline adapts to narrow screen
- Dots move to left
- Text wraps appropriately
- Touch-friendly spacing

---

## Notes

- Timeline is read-only (no modification by submitter)
- All timestamps in server timezone (converted to user's timezone on frontend)
- Durations help submitters understand process speed
- Visual timeline engaging and easy to understand
- Feedback clearly highlighted for rejections
- Foundation for future reporting/analytics
