# STORY-3.2: Idea Review Panel

**Status:** Not Started  
**Story ID:** STORY-3.2  
**Epic:** EPIC-3 (Idea Evaluation Workflow & Status Tracking)  
**Sprint:** Backlog  
**Story Points:** 5  
**Priority:** P0 (Critical)  
**Persona:** Raj (Evaluator/Admin)  
**Created:** February 26, 2026  
**Updated:** February 26, 2026  

---

## User Story

**As an** evaluator  
**I want** to click an idea from the queue and see its full details  
**so that** I can make an informed decision about whether to approve or reject it

---

## Context

The review panel is where evaluators examine complete idea information and make decisions. When an evaluator opens an idea from the queue (STORY-3.1), the status automatically transitions to "Under Review" to indicate active evaluation. The panel displays all idea fields, attachments, submitter info, and (in STORY-3.3) approve/reject buttons.

---

## Acceptance Criteria

### AC1: Panel Shows Complete Idea Information
**Given:** Evaluator clicks idea from queue  
**When:** Page loads at `/evaluation-queue/:ideaId`  
**Then:**
- Page displays HTTP 200
- Shows Idea Title
- Shows Idea Description (full text)
- Shows Category
- Shows Submitter Name
- Shows Submission Date (formatted)
- Shows Current Status

### AC2: Attachments Display with Download Links
**Given:** Idea has attachments uploaded (from STORY-2.1)  
**When:** Evaluator views attachment section  
**Then:**
- Each attachment shows: File name, File size (in MB/KB), Upload date
- Click on file name downloads the file
- Multiple attachments shown in list
- If no attachments, "No attachments" message shown

### AC3: Submitter Information Visible
**Given:** Idea displayed in review panel  
**When:** Evaluator views submitter section  
**Then:**
- Submitter Name displayed
- Submitter Email displayed (clickable mailto: link)
- Submitter Department displayed (if available)
- This provides context for evaluator

### AC4: Status Auto-Updates to "Under Review" on Open
**Given:** Idea status is "Submitted"  
**When:** Evaluator opens review panel for first time  
**Then:**
- API call made: `PUT /api/ideas/:ideaId/status` with body `{ status: 'Under Review' }`
- Idea status changes to "Under Review"
- No user confirmation required
- If already "Under Review", no additional update made
- Status badge in UI updates immediately

### AC5: Back to Queue Button
**Given:** Evaluator is on review panel  
**When:** Evaluator clicks "Back to Queue" button  
**Then:**
- Returns to evaluation queue list
- Scroll position restored to previously scrolled position
- All queue filters/pagination preserved

### AC6: Panel Design Matches Detail View (STORY-2.5)
**Given:** Review panel open  
**When:** Evaluator views layout  
**Then:**
- Visual design consistent with IdeaDetailPage from STORY-2.5
- Same typography, colors, spacing
- Same component hierarchy (if possible)
- Looks like "professional detail view"

---

## Technical Details

### Components to Create/Reuse

#### 1. IdeaReviewPanel.tsx (Main Container)
- **Location:** `src/pages/IdeaReviewPanel.tsx`
- **Responsibilities:**
  - Extract ideaId from URL params
  - Authorization check (must be evaluator)
  - Fetch idea details
  - Call status update API (if status is "Submitted")
  - Display idea information
  - Handle navigation back to queue
- **Hooks:** useState, useEffect, useContext, useParams, useNavigate
- **Lines:** ~200-250

#### 2. Reuse Existing Components
- **AttachmentsSection.tsx** - Already exists from STORY-2.5
- **StatusBadge.tsx** - Already exists from STORY-2.5
- **LoadingSpinner.tsx** - Already exists

### API Endpoints

**GET /api/ideas/:ideaId**

```
Response (HTTP 200):
{
  "id": "uuid-1",
  "title": "Improve Login Process",
  "description": "Current login takes 3 steps. We could reduce to 1 step...",
  "category": "Process Improvement",
  "status": "Submitted",
  "submitterId": "user-123",
  "submitterName": "Priya",
  "submitterEmail": "priya@epam.com",
  "submitterDepartment": "Engineering",
  "createdAt": "2026-02-01T09:00:00Z",
  "updatedAt": "2026-02-01T09:00:00Z",
  "attachments": [
    {
      "id": "att-1",
      "filename": "proposal.pdf",
      "size": 245000,
      "url": "https://cdn.example.com/ideas/uuid-1/proposal.pdf",
      "uploadedAt": "2026-02-01T09:05:00Z"
    }
  ]
}

Error Response (HTTP 404):
{
  "error": "Not Found",
  "message": "Idea not found"
}

Error Response (HTTP 403):
{
  "error": "Forbidden",
  "message": "You don't have permission to view this idea"
}
```

**PUT /api/ideas/:ideaId/status**

```
Request:
{
  "status": "Under Review"
}

Response (HTTP 200):
{
  "id": "uuid-1",
  "status": "Under Review",
  "updatedAt": "2026-02-02T10:30:00Z"
}

Error Response (HTTP 400):
{
  "error": "Bad Request",
  "message": "Invalid status transition"
}
```

### Backend Implementation

**File:** `backend/src/routes/ideas.ts`

```typescript
router.put('/:ideaId/status', authMiddleware, async (req, res) => {
  const { ideaId } = req.params;
  const { status } = req.body;
  const userId = req.user.id;
  
  // Validate status
  const validStatuses = ['Submitted', 'Under Review', 'Accepted', 'Rejected'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ 
      error: 'Bad Request', 
      message: 'Invalid status' 
    });
  }
  
  try {
    const idea = await db.ideas.findUnique({ where: { id: ideaId } });
    
    if (!idea) {
      return res.status(404).json({ 
        error: 'Not Found', 
        message: 'Idea not found' 
      });
    }
    
    // Authorization: user must be evaluator or submitter
    if (idea.userId !== userId && !req.user.roles?.includes('evaluator')) {
      return res.status(403).json({ 
        error: 'Forbidden', 
        message: 'No permission' 
      });
    }
    
    // Update status
    const updated = await db.ideas.update({
      where: { id: ideaId },
      data: { 
        status,
        updatedAt: new Date(),
        evaluatorId: req.user.roles?.includes('evaluator') ? userId : idea.evaluatorId
      }
    });
    
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Frontend Implementation

**File:** `src/pages/IdeaReviewPanel.tsx`

```typescript
import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ideasService } from '../services/ideas.service';
import { AttachmentsSection } from '../components/AttachmentsSection';
import { StatusBadge } from '../components/StatusBadge';
import { ErrorMessage } from '../components/ErrorMessage';
import { LoadingSpinner } from '../components/LoadingSpinner';

export function IdeaReviewPanel() {
  const { ideaId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [idea, setIdea] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Authorization check
  useEffect(() => {
    if (user && !user.roles?.includes('evaluator')) {
      navigate('/');
    }
  }, [user, navigate]);

  // Fetch idea details
  useEffect(() => {
    const fetchIdea = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const ideData = await ideasService.getIdeaDetail(ideaId);
        setIdea(ideData);
        
        // Auto-update status to "Under Review" if "Submitted"
        if (ideData.status === 'Submitted') {
          await updateStatusToUnderReview(ideData);
        }
      } catch (err) {
        setError(err.message || 'Failed to load idea');
      } finally {
        setIsLoading(false);
      }
    };

    if (ideaId) {
      fetchIdea();
    }
  }, [ideaId]);

  const updateStatusToUnderReview = async (ideaData) => {
    try {
      setIsUpdatingStatus(true);
      
      const updated = await ideasService.updateIdeaStatus(ideaId, {
        status: 'Under Review'
      });
      
      // Update local state
      setIdea({ ...ideaData, status: 'Under Review' });
    } catch (err) {
      console.error('Failed to update status:', err);
      // Non-blocking error - don't prevent viewing idea
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleBackToQueue = () => {
    navigate('/evaluation-queue', { replace: false });
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage message={error} />
        <button
          onClick={handleBackToQueue}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Back to Queue
        </button>
      </div>
    );
  }

  if (!idea) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-gray-500">Idea not found</p>
        <button
          onClick={handleBackToQueue}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Back to Queue
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={handleBackToQueue}
        className="mb-6 text-blue-600 hover:text-blue-800 font-medium"
      >
        ← Back to Queue
      </button>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-2">
          <h1 className="text-3xl font-bold">{idea.title}</h1>
          <StatusBadge status={idea.status} />
        </div>
        <p className="text-gray-600">
          Submitted on {new Date(idea.createdAt).toLocaleDateString()} by {idea.submitterName}
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-8">
        {/* Left: Description */}
        <div className="col-span-2">
          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Description</h2>
            <p className="text-gray-700 leading-relaxed">{idea.description}</p>
          </section>

          {/* Attachments */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Attachments</h2>
            <AttachmentsSection attachments={idea.attachments} />
          </section>

          {/* Approve/Reject Buttons (from STORY-3.3) */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Decision</h2>
            <div className="flex gap-4">
              <button
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
              >
                ✓ Approve
              </button>
              <button
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
              >
                ✗ Reject
              </button>
            </div>
          </section>
        </div>

        {/* Right: Sidebar */}
        <div>
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold mb-4">Idea Details</h3>
            
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-1">Category</p>
              <p className="font-medium">{idea.category}</p>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-1">Submitted</p>
              <p className="font-medium">
                {new Date(idea.createdAt).toLocaleDateString()}
              </p>
            </div>

            <h3 className="font-semibold mb-4 mt-8">Submitter</h3>
            
            <div className="mb-3">
              <p className="text-sm text-gray-600 mb-1">Name</p>
              <p className="font-medium">{idea.submitterName}</p>
            </div>

            <div className="mb-3">
              <p className="text-sm text-gray-600 mb-1">Email</p>
              <a
                href={`mailto:${idea.submitterEmail}`}
                className="text-blue-600 hover:underline"
              >
                {idea.submitterEmail}
              </a>
            </div>

            {idea.submitterDepartment && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Department</p>
                <p className="font-medium">{idea.submitterDepartment}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status Update Notification */}
      {isUpdatingStatus && (
        <div className="fixed bottom-4 right-4 bg-blue-100 text-blue-800 px-4 py-2 rounded">
          Updating status to "Under Review"...
        </div>
      )}
    </div>
  );
}
```

### Routing

**File:** `src/App.tsx` - Add this route:

```typescript
<Route
  path="/evaluation-queue/:ideaId"
  element={
    <ProtectedRoute requiredRole="evaluator">
      <IdeaReviewPanel />
    </ProtectedRoute>
  }
/>
```

---

## Files Affected

### New Files
- `src/pages/IdeaReviewPanel.tsx` (200-250 lines)

### Modified Files
- `src/App.tsx` - Add route for `/evaluation-queue/:ideaId`
- `src/services/ideas.service.ts` - Ensure `updateIdeaStatus()` method exists

### Database Schema
- Add column if not exists: `ideas.evaluatorId` (nullable, references users.id)

---

## Testing

### Unit Tests
- [ ] Component renders with idea data
- [ ] Status auto-updates to "Under Review" on load
- [ ] Attachments display correctly
- [ ] Submitter info displayed
- [ ] Back button navigates to queue
- [ ] Authorization check blocks non-evaluators
- [ ] Error handling shows error message
- [ ] 404 shows not found message

### E2E Tests
- [ ] Evaluator navigates from queue to review panel
- [ ] Idea details load correctly
- [ ] Status changes from "Submitted" to "Under Review"
- [ ] Attachments download links work
- [ ] Back button returns to queue
- [ ] Email link opens mail client

---

## Definition of Done Checklist

- [ ] Component renders without TypeScript errors
- [ ] All acceptance criteria verified
- [ ] Auto-status update working correctly
- [ ] Back navigation preserves queue state
- [ ] Responsive design verified
- [ ] All error cases handled
- [ ] Accessibility verified
- [ ] Unit tests passing (>80% coverage)
- [ ] E2E tests passing
- [ ] Code reviewed and approved
- [ ] No console warnings/errors
- [ ] Performance acceptable (< 2 second load)

---

## Dependencies

### Blocks
- STORY-3.3 (Approve/Reject buttons need review panel)

### Blocked By
- STORY-3.1 (Queue is entry point)

### Related To
- STORY-2.5 (Design and layout patterns)

---

## Estimation

- **Story Points:** 5
- **Estimated Days:** 1-2 days
- **Confidence:** High

**Breakdown:**
- Component: 1 day
- API integration: 0.5 days
- Testing: 0.5 days

---

## Notes

- Status update to "Under Review" is automatic, non-blocking
- Design closely matches STORY-2.5 IdeaDetailPage for consistency
- Approve/Reject buttons added in STORY-3.3 (placeholder shown)
- Attachment handling reuses existing component from STORY-2.5
