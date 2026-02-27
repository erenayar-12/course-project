# STORY-3.2: Idea Review Panel

**Status:** APPROVED  
**Story ID:** STORY-3.2  
**Epic:** EPIC-3 (Idea Evaluation Workflow & Status Tracking)  
**Sprint:** BACKLOG  
**Story Points:** 5  
**Estimated Days:** 1-2 days  
**Priority:** P0 (Critical)  
**Persona:** Raj (Evaluator/Admin)  
**Created:** February 26, 2026  
**Updated:** February 26, 2026  

---

## User Story

**As an** evaluator  
**I want** to click an idea from the queue and see its full details in a dedicated review panel  
**so that** I can examine all relevant information and make an informed decision about whether to approve or reject it

### Story Context

The review panel is the core workspace for evaluators to examine ideas before making decisions. When an evaluator opens an idea from the queue (STORY-3.1), the system automatically transitions the status to "Under Review" to track that active evaluation is happening. The panel displays all idea details (title, description, attachments, submitter info), providing evaluators with complete context needed for evaluation. This is part of EPIC-3's evaluation workflow, where evaluators can efficiently move through the queue and make decisions (implemented in STORY-3.3).

---

## Acceptance Criteria

The acceptance criteria are organized by functional area and follow INVEST principles (Independent, Negotiable, Valuable, Estimable, Small, Testable).

### AC1: Panel Shows Complete Idea Information
**Given:** Evaluator navigates to `/evaluation-queue/:ideaId`  
**When:** Page loads successfully  
**Then:**
- Page displays HTTP 200
- Displays idea title prominently in header
- Displays full idea description (untruncated)
- Shows category in sidebar
- Shows submitter name and email
- Shows submission date (formatted as "MMM DD, YYYY")
- Shows current status with appropriate badge color

**Test:** 
- Navigate to `/evaluation-queue/test-idea-1`
- Verify all fields render and match API response

---

### AC2: Attachments Display with Download Links
**Given:** Idea has attachments uploaded (from STORY-2.1)  
**When:** Evaluator views attachment section  
**Then:**
- Each attachment shows: File name (clickable), File size (in MB/KB), Upload date (formatted)
- Click on file name triggers file download
- Multiple attachments shown in a list format
- If no attachments, displays "No attachments uploaded" message
- File download uses presigned URL from backend

**Test:**
- Create idea with PDF attachment
- View review panel
- Verify attachment displays with size and date
- Click attachment name and verify download

---

### AC3: Submitter Information Visible and Actionable
**Given:** Idea displayed in review panel  
**When:** Evaluator views submitter section  
**Then:**
- Submitter name displayed in sidebar
- Submitter email displayed as clickable mailto: link
- Submitter department displayed (if available in system)
- Link color indicates it's clickable (blue with underline)
- Clicking email link opens default mail client with "To:" pre-populated

**Test:**
- View review panel for idea
- Verify submitter info visible
- Verify email is (mailto:) link
- Verify click opens mail client

---

### AC4: Status Auto-Updates to "Under Review" on First Open
**Given:** Idea status is "Submitted" and no evaluator is assigned  
**When:** Evaluator opens review panel for first time  
**Then:**
- System automatically calls `PUT /api/ideas/:ideaId/status` with `{ status: 'Under Review' }`
- Status badge updates from yellow (Submitted) to orange (Under Review) in real-time
- No user confirmation dialog required
- Update happens silently in background (non-blocking)
- If status already "Under Review", no additional API call is made
- If update fails, error is logged but doesn't prevent viewing idea

**Test:**
- Create idea with "Submitted" status
- Open review panel
- Verify HTTP PUT call made
- Verify status badge updates
- Verify no error popup appears

---

### AC5: Back to Queue Navigation Preserves Context
**Given:** Evaluator is on review panel  
**When:** Evaluator clicks "← Back to Queue" button  
**Then:**
- Navigates back to `/evaluation-queue`
- Queue state preserved (current page, filters, sort, scroll position)
- Session storage restores previous scroll position
- No queue data is re-fetched (use cached state)

**Test:**
- Scroll to page 2 of queue
- Click on idea to open review panel
- Click "Back to Queue"
- Verify queue is still on page 2 at same scroll position

---

### AC6: Panel Design Matches Detail View Pattern (STORY-2.5)
**Given:** Review panel displayed  
**When:** Evaluator views layout and styling  
**Then:**
- Visual design consistent with IdeaDetailPage from STORY-2.5
- Typography: H1 for title, H2 for sections, p for body text
- Colors: White background, gray sidebar, blue action buttons
- Spacing: 8px grid, consistent padding around sections
- Layout: Main content (2/3 width), sidebar (1/3 width) on desktop
- Responsive: Single column on mobile
- Uses Tailwind CSS classes matching existing components

**Test:**
- Compare review panel with detail page visually
- Verify responsive design on mobile/tablet
- Check accessibility (WCAG 2.1 AA)

---

### AC7: Authorization Check - Only Evaluators Can Access
**Given:** User is not an evaluator  
**When:** User attempts to navigate to `/evaluation-queue/:ideaId`  
**Then:**
- Page rejects access with 403 Forbidden
- Routes user back to home page
- Displays friendly error message
- Logs unauthorized attempt

**Test:**
- Login as submitter role
- Try to access `/evaluation-queue/test-idea-1`
- Verify redirect to home page

---

## Definition of Acceptance

All acceptance criteria must pass before this story is marked DONE.

- [ ] All 7 acceptance criteria verified and passing
- [ ] Code changes reviewed and approved by tech lead
- [ ] Unit tests written (>80% code coverage)
- [ ] Integration tests passing (API mocking)
- [ ] E2E tests passing (Cypress if available)
- [ ] No console warnings or errors (production build)
- [ ] Performance: Page load < 2 seconds
- [ ] Accessibility: WCAG 2.1 AA compliant
- [ ] Mobile responsive verified (tested on iPhone SE, Pixel 5)
- [ ] Documentation updated (README, inline comments)
- [ ] No TypeScript errors or warnings
- [ ] No breaking changes to existing features

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
- `src/pages/__tests__/IdeaReviewPanel.test.tsx` (150-200 lines)

### Modified Files
- `src/App.tsx` - Add route for `/evaluation-queue/:ideaId`
- `src/services/ideas.service.ts` - Ensure `updateIdeaStatus()` method exists
- `src/types/ideaSchema.ts` - No changes needed if already includes all fields
- `cypress/e2e/evaluation.cy.ts` - Add E2E tests for review workflow

### Database Schema
- Add column if not exists: `ideas.evaluatorId` (nullable, references users.id)

---

## Testing Strategy

### Unit Tests (~12 tests)
- [ ] Component renders without TypeScript errors
- [ ] Component handles loading state correctly
- [ ] Component displays idea data when loaded
- [ ] Status auto-update triggers on mount for "Submitted" ideas
- [ ] Status update does NOT trigger for "Under Review" ideas
- [ ] Status update does NOT trigger for already "Under Review" ideas
- [ ] Error state displays with back button
- [ ] 404 state displays with back button
- [ ] Back button navigates to queue
- [ ] Authorization guard redirects non-evaluators
- [ ] Attachment section renders correctly
- [ ] Submitter info renders with correct formatting

**Coverage Target:** >80% statements, >75% branches

### Integration Tests (~6 tests)
- [ ] Full flow: Queue → View Idea → Status updates → Back to Queue
- [ ] Idea data fetches from API correctly
- [ ] Status update API call is made automatically
- [ ] Files download when attachment link clicked
- [ ] Back navigation preserves queue scroll position
- [ ] Non-evaluator blocked from accessing panel

### E2E Tests (Cypress) (~4 tests)
- [ ] Evaluator logs in → navigates to queue → clicks idea → sees details → goes back
- [ ] Status changes from "Submitted" to "Under Review" visually
- [ ] Attachment download works with real file
- [ ] Responsive design verified on mobile

### Manual Testing Checklist
- [ ] Desktop browser (Chrome, Firefox, Safari)
- [ ] Mobile browser (iPhone, Android)
- [ ] Tablet (iPad)
- [ ] Keyboard navigation (Tab, Enter, Escape)
- [ ] Screen reader (NVDA, JAWS)
- [ ] Network throttling (3G, Slow 4G)
- [ ] Ideas with and without attachments
- [ ] Ideas with and without department info

---

## Definition of Done Checklist

- [ ] All 7 acceptance criteria verified and passing
- [ ] Component renders without TypeScript errors
- [ ] Auto-status update working correctly
- [ ] Back navigation preserves queue state
- [ ] Responsive design verified (mobile, tablet, desktop)
- [ ] All error cases handled appropriately
- [ ] Accessibility verified (WCAG 2.1 AA)
- [ ] Unit tests passing (>80% coverage)
- [ ] Integration tests passing
- [ ] E2E tests passing (if applicable)
- [ ] Code reviewed and approved
- [ ] No console warnings/errors in dev tools
- [ ] Performance acceptable (< 2 second load time)
- [ ] Documentation updated (README, JSDoc comments)
- [ ] No TypeScript errors or warnings

---

## INVEST Validation Checklist

Use this checklist to verify the story follows INVEST principles:

- [✓] **Independent** - Can be completed independently; depends on STORY-3.1 being available but doesn't block other work
- [✓] **Negotiable** - Details are open for discussion; specific implementation can be refined
- [✓] **Valuable** - Delivers clear value: evaluators can examine ideas before making decisions
- [✓] **Estimable** - Team understands it well enough to estimate (5 points, 1-2 days)
- [✓] **Small** - Can be completed within 1 sprint (fits in 1-2 day timeframe)
- [✓] **Testable** - Acceptance criteria are clear and verifiable with automated tests

---

## Implementation Hints & Technical Decisions

### Component Structure
```
IdeaReviewPanel (page)
├── Header (title + status badge)
├── Main Content Area (2/3 width on desktop)
│   ├── Description Section
│   ├── AttachmentsSection (reuse component)
│   └── Action Placeholder (Approve/Reject from STORY-3.3)
└── Sidebar (1/3 width on desktop)
    ├── Idea Details Card
    └── Submitter Info Card
```

### State Management
Use React Hooks (useState, useEffect, useContext):
- `idea` state for loaded idea data
- `isLoading` state for loading spinner
- `error` state for error handling
- `isUpdatingStatus` state for status update notification

### Styling Approach
- Use Tailwind CSS classes consistent with existing components
- Grid layout: `grid-cols-3` on desktop, single column on mobile
- Responsive breakpoints: `md:` for tablet, `lg:` for desktop
- Colors: Use design system (blue for actions, gray for secondary, green for success, red for danger)
- Use existing color tokens: `bg-blue-600`, `text-gray-700`, `border-gray-200`

### Performance Optimization
- Lazy load attachments list if >5 files
- Use React.memo for AttachmentsSection component if needed
- Avoid re-fetching idea data on navigation back
- Use browser caching for static assets

### API Integration Pattern
```typescript
// Service layer handles all API calls
const idea = await ideasService.getIdeaDetail(ideaId);
const updated = await ideasService.updateIdeaStatus(ideaId, { status: 'Under Review' });
```

- Implement proper error handling with user-friendly messages
- Add request/response logging for debugging
- Use TypeScript types for all API responses

### Authorization Pattern
```typescript
// Check user role on component mount
useEffect(() => {
  if (user && !user.roles?.includes('evaluator')) {
    navigate('/');
  }
}, [user, navigate]);
```

---

## Estimation & Effort

**Story Points:** 5  
**Estimated Days:** 1-2 days  
**Confidence Level:** HIGH

**Breakdown:**
- Component structure & layout: 0.5 days
- API integration & status update logic: 0.5 days
- Authorization & error handling: 0.25 days
- Unit tests: 0.25 days
- Integration/E2E tests: 0.25 days
- Code review & refinement: 0.25 days

**Total Estimated Effort:** ~1.75 days (high confidence)

**Estimation Rationale:**
- Low complexity: reuses existing components and patterns from STORY-2.5
- Well-defined scope: clear acceptance criteria
- Known dependencies: STORY-3.1 queue already implemented
- No discovery needed: design and API specifics already documented

---

## Notes & Context

- Status update to "Under Review" is automatic, non-blocking to user experience
- Design closely matches STORY-2.5 IdeaDetailPage for consistency
- Approve/Reject decision buttons added in STORY-3.3 (placeholder/stub shown in this story)
- Attachment handling reuses existing AttachmentsSection component from STORY-2.5
- Follows React best practices: functional components, hooks, proper lifecycle management
- Implements authorization checks with ProtectedRoute component from STORY-1.4

---

## Related Stories & Context

| Story | Title | Relationship |
|-------|-------|--------------|
| STORY-3.1 | Evaluation Queue View | ← Direct entry point to this story |
| STORY-3.3 | Approve/Reject State Machine | → Next step (implement decision buttons) |
| STORY-3.4 | Rejection Feedback Form | → Related (popup from reject button) |
| STORY-2.5 | Detail Page Functionality | ← Design and layout patterns |
| STORY-2.1 | File Upload | ← Attachment handling |
| STORY-1.4 | RBAC | ← Authorization checks |

---

## Acceptance Sign-Off

| Role | Name | Date | Status |
|------|------|------|--------|
| Product Owner | [TBD] | [TBD] | [TBD] |
| Tech Lead | [TBD] | [TBD] | [TBD] |
| QA Lead | [TBD] | [TBD] | [TBD] |

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Feb 26, 2026 | GitHub Copilot | Initial comprehensive specification per agents.md |

---

**Next Action:** PR code review + acceptance criteria verification
