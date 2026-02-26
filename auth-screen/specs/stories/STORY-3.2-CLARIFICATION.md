# STORY-3.2 Clarification: Acceptance Criteria & Technical Details

**Created:** February 26, 2026  
**Purpose:** Detailed clarification of STORY-3.2 acceptance criteria mapping to technical implementation

---

## 1. Acceptance Criteria Clarification

### AC1: Panel Shows Complete Idea Information

**Acceptance Criteria:**
```
Given: Evaluator navigates to /evaluation-queue/:ideaId
When: Page loads successfully
Then: Displays all required idea fields
```

**What This Means:**
- Component must receive `ideaId` from URL params using `useParams()`
- Must make API call to fetch idea details immediately on mount
- Must display all required fields from the API response

**Technical Implementation:**
```typescript
// Route definition in App.tsx
<Route path="/evaluation-queue/:ideaId" element={<ProtectedRoute requiredRole="evaluator"><IdeaReviewPanel /></ProtectedRoute>} />

// Component implementation in IdeaReviewPanel.tsx
const { ideaId } = useParams<{ ideaId?: string }>();

useEffect(() => {
  if (ideaId) {
    fetchIdea(ideaId);
  }
}, [ideaId]);

// API Response expectations (HTTP 200):
{
  id: string;
  title: string;
  description: string;
  category: string;
  status: "Submitted" | "Under Review" | "Approved" | "Rejected";
  submitterId: string;
  submitterName: string;
  submitterEmail: string;
  submitterDepartment?: string;
  createdAt: ISO8601 timestamp;
  updatedAt: ISO8601 timestamp;
  attachments: Attachment[];
}
```

**Verification Checklist:**
- [ ] URL param `ideaId` is extracted correctly
- [ ] API call made to `GET /api/ideas/:ideaId`
- [ ] All fields display in the UI
- [ ] Date formatting shows as "MMM DD, YYYY" (e.g., "Feb 26, 2026")
- [ ] Status badge color matches correct status

**Error Cases:**
- HTTP 404: Idea not found → Display "Idea not found" message with back button
- HTTP 403: Forbidden → Should not render (caught by ProtectedRoute)
- HTTP 500: Server error → Display error message with retry button

---

### AC2: Attachments Display with Download Links

**Acceptance Criteria:**
```
Given: Idea has attachments uploaded (from STORY-2.1)
When: Evaluator views attachment section
Then: Each attachment shows name, size, date + download link
```

**What This Means:**
- Reuse `AttachmentsSection` component from STORY-2.5
- Component receives array of attachment objects
- Each attachment must have: filename, size, uploadedAt timestamp
- Clicking filename triggers download
- Empty state shows "No attachments uploaded"

**Technical Implementation:**
```typescript
// API Response includes attachments array:
attachments: [
  {
    id: string;
    filename: string;
    size: number; // in bytes
    url: string; // presigned S3 URL for download
    uploadedAt: ISO8601 timestamp;
  }
]

// In IdeaReviewPanel.tsx:
<div className="mb-8">
  <h2 className="text-lg font-semibold mb-4">Attachments</h2>
  <AttachmentsSection attachments={idea.attachments} />
</div>

// AttachmentsSection component (from STORY-2.5):
export interface Attachment {
  id: string;
  filename: string;
  size: number;
  url: string;
  uploadedAt: string;
}

// Display logic:
- If attachments.length === 0: Show "No attachments uploaded"
- Otherwise: For each attachment:
  - Display: "[filename]" (clickable link)
  - Display: "234 KB" (formatted size)
  - Display: "Uploaded Feb 26, 2026" (formatted date)
  - On click: redirect to attachment.url (triggers download)
```

**Size Formatting:**
```typescript
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};
```

**Verification Checklist:**
- [ ] AttachmentsSection component receives correct prop types
- [ ] Empty state displays when attachments array is empty
- [ ] File names are clickable links
- [ ] File sizes display in human-readable format (KB/MB)
- [ ] Upload dates display as "Uploaded MMM DD, YYYY"
- [ ] Clicking link downloads file (or opens in new tab)

---

### AC3: Submitter Information Visible and Actionable

**Acceptance Criteria:**
```
Given: Idea displayed in review panel
When: Evaluator views submitter section
Then: Name, email (mailto link), department visible
```

**What This Means:**
- Submitter info displayed in right sidebar
- Email is clickable `mailto:` link
- Department is optional (only show if != null)
- All fields should be clearly labeled

**Technical Implementation:**
```typescript
// In the right sidebar component:
<div className="bg-gray-50 rounded-lg p-6">
  <h3 className="font-semibold mb-4 text-lg">Submitter</h3>
  
  {/* Name */}
  <div className="mb-4">
    <p className="text-sm text-gray-600 mb-1">Name</p>
    <p className="font-medium text-gray-900">{idea.submitterName}</p>
  </div>
  
  {/* Email */}
  <div className="mb-4">
    <p className="text-sm text-gray-600 mb-1">Email</p>
    <a
      href={`mailto:${idea.submitterEmail}`}
      className="text-blue-600 hover:text-blue-800 underline"
    >
      {idea.submitterEmail}
    </a>
  </div>
  
  {/* Department (conditional) */}
  {idea.submitterDepartment && (
    <div className="mb-4">
      <p className="text-sm text-gray-600 mb-1">Department</p>
      <p className="font-medium text-gray-900">{idea.submitterDepartment}</p>
    </div>
  )}
</div>
```

**Verification Checklist:**
- [ ] Submitter name displays correctly
- [ ] Email renders as `<a href="mailto:...">` link
- [ ] Email link is blue and underlined
- [ ] Clicking email opens mail client with recipient pre-filled
- [ ] Department section hidden when department is null/undefined
- [ ] Labels are visible and descriptive

---

### AC4: Status Auto-Updates to "Under Review" on First Open

**Acceptance Criteria:**
```
Given: Idea status is "Submitted" and no evaluator assigned
When: Evaluator opens review panel for first time
Then: System calls PUT /api/ideas/:ideaId/status
```

**What This Means:**
- On component mount, after fetching idea data, check the status
- **Only if** status === "Submitted": make automatic PUT call
- **Do NOT** call if status is already "Under Review" or other status
- Update happens silently (no confirmation dialog)
- Status badge updates immediately in UI
- Non-blocking: if update fails, still allow viewing idea

**Technical Implementation:**
```typescript
// In IdeaReviewPanel.tsx useEffect:
useEffect(() => {
  const fetchAndUpdateStatus = async () => {
    try {
      setIsLoading(true);
      
      // 1. Fetch idea details
      const ideaData = await ideasService.getIdeaDetail(ideaId);
      setIdea(ideaData);
      
      // 2. Check if status is "Submitted"
      if (ideaData.status === "Submitted") {
        try {
          // 3. Auto-update to "Under Review"
          setIsUpdatingStatus(true);
          const updatedIdea = await ideasService.updateIdeaStatus(ideaId, {
            status: "Under Review"
          });
          
          // 4. Update local state with new status
          setIdea(prev => ({ ...prev, status: "Under Review" }));
        } catch (err) {
          // Non-blocking: log error but don't prevent viewing idea
          console.error("Failed to update status:", err);
        } finally {
          setIsUpdatingStatus(false);
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (ideaId) {
    fetchAndUpdateStatus();
  }
}, [ideaId]);
```

**API Call Details:**
```
PUT /api/ideas/:ideaId/status
Request Body:
{
  "status": "Under Review"
}

Response (HTTP 200):
{
  "id": "uuid-1",
  "status": "Under Review",
  "updatedAt": "2026-02-26T14:30:00Z"
}

Backend Logic (pseudo-code):
1. Check authorization (user must be evaluator)
2. Check idea status is "Submitted"
3. Update idea.status = "Under Review"
4. Set idea.evaluatorId = current user ID
5. Update idea.updatedAt = now
6. Return updated idea
```

**Verification Checklist:**
- [ ] Fetch idea first (ensure data loaded)
- [ ] Check status === "Submitted" before calling update API
- [ ] PUT call made only once per open (not on re-renders)
- [ ] Status badge changes from yellow to orange in UI
- [ ] Update happens silently (no toast/modal)
- [ ] If update fails, error is logged but page still works
- [ ] If status already "Under Review", NO PUT call made

**Edge Cases:**
- Idea changes to "Under Review" → No update needed on next visit
- Idea already "Approved" or "Rejected" → No status change
- Multiple evaluators open same idea → First one wins (DB handles conflict)
- Network offline → Non-blocking error, still show idea

---

### AC5: Back to Queue Navigation Preserves Context

**Acceptance Criteria:**
```
Given: Evaluator is on review panel
When: Evaluator clicks "Back to Queue" button
Then: Navigates back to /evaluation-queue with state preserved
```

**What This Means:**
- Back button navigates to `/evaluation-queue`
- Previous queue state restored (page, filters, scroll position)
- No re-fetch of queue data (use browser back or sessionStorage)

**Technical Implementation:**
```typescript
// Option 1: Use browser navigation history
const handleBackToQueue = () => {
  navigate(-1); // Goes back in browser history
};

// Option 2: Use explicit route with state (preferred)
const handleBackToQueue = () => {
  // Save scroll position before navigating
  sessionStorage.setItem('evaluationQueue_scrollPos', String(window.scrollY));
  navigate('/evaluation-queue');
};

// In EvaluationQueue.tsx useEffect:
useEffect(() => {
  // Restore scroll position after render
  const savedScroll = sessionStorage.getItem('evaluationQueue_scrollPos');
  if (savedScroll) {
    window.scrollTo(0, parseInt(savedScroll));
    sessionStorage.removeItem('evaluationQueue_scrollPos');
  }
}, [/* items loaded */]);
```

**Verification Checklist:**
- [ ] "← Back to Queue" button visible at top of panel
- [ ] Clicking button navigates to `/evaluation-queue`
- [ ] Queue data is not re-fetched (uses cached state)
- [ ] User's pagination state preserved (still on page 2, etc.)
- [ ] Scroll position restored to previous location
- [ ] No flicker or blank screen on navigation

---

### AC6: Panel Design Matches Detail View Pattern (STORY-2.5)

**Acceptance Criteria:**
```
Given: Review panel displayed
When: Evaluator views layout
Then: Design consistent with IdeaDetailPage from STORY-2.5
```

**What This Means:**
- Visual design mirrors the detail page shown in STORY-2.5
- Same typography, spacing, colors
- Same grid layout pattern (main 2/3, sidebar 1/3 on desktop)
- Responsive design works on mobile (single column)

**Technical Implementation - Layout Structure:**
```tsx
<div className="min-h-screen bg-white">
  {/* Back Button */}
  <div className="max-w-7xl mx-auto px-4 py-6">
    <button className="text-blue-600 hover:text-blue-800">← Back to Queue</button>
  </div>
  
  {/* Main Container */}
  <div className="max-w-7xl mx-auto px-4 py-8">
    
    {/* Header */}
    <div className="mb-8">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{idea.title}</h1>
          <p className="text-gray-600">
            Submitted on {formatDate(idea.createdAt)} by {idea.submitterName}
          </p>
        </div>
        <StatusBadge status={idea.status} />
      </div>
    </div>
    
    {/* Main Content Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* Left Column (2/3 width on desktop) */}
      <div className="lg:col-span-2">
        
        {/* Description Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
          <p className="text-gray-700 leading-relaxed text-base">
            {idea.description}
          </p>
        </div>
        
        {/* Attachments Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Attachments</h2>
          <AttachmentsSection attachments={idea.attachments} />
        </div>
        
        {/* Decision Section (Approve/Reject from STORY-3.3) */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Decision</h2>
          <div className="flex gap-4">
            <button className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">
              ✓ Approve
            </button>
            <button className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700">
              ✗ Reject
            </button>
          </div>
        </div>
      </div>
      
      {/* Right Column Sidebar (1/3 width on desktop) */}
      <div className="lg:col-span-1">
        
        {/* Idea Details Card */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Idea Details</h3>
          
          <div className="mb-6">
            <p className="text-xs uppercase tracking-wide text-gray-600 font-semibold mb-2">Category</p>
            <p className="text-base font-medium text-gray-900">{idea.category}</p>
          </div>
          
          <div className="mb-6">
            <p className="text-xs uppercase tracking-wide text-gray-600 font-semibold mb-2">Submitted</p>
            <p className="text-base font-medium text-gray-900">{formatDate(idea.createdAt)}</p>
          </div>
        </div>
        
        {/* Submitter Card */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Submitter</h3>
          
          <div className="mb-4">
            <p className="text-xs uppercase tracking-wide text-gray-600 font-semibold mb-2">Name</p>
            <p className="text-base font-medium text-gray-900">{idea.submitterName}</p>
          </div>
          
          <div className="mb-4">
            <p className="text-xs uppercase tracking-wide text-gray-600 font-semibold mb-2">Email</p>
            <a href={`mailto:${idea.submitterEmail}`} className="text-base text-blue-600 hover:underline">
              {idea.submitterEmail}
            </a>
          </div>
          
          {idea.submitterDepartment && (
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-600 font-semibold mb-2">Department</p>
              <p className="text-base font-medium text-gray-900">{idea.submitterDepartment}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
</div>
```

**Typography & Colors:**
```typescript
// Headings
h1: "text-4xl font-bold text-gray-900"
h2: "text-2xl font-bold text-gray-900"
h3: "text-lg font-bold text-gray-900"

// Body text
main: "text-base text-gray-900"
secondary: "text-sm text-gray-600"
muted: "text-xs uppercase tracking-wide text-gray-600 font-semibold"

// Backgrounds
container: "bg-white"
sidebar-card: "bg-gray-50"
input: "bg-white border border-gray-300"

// Buttons
primary: "bg-blue-600 text-white hover:bg-blue-700"
success: "bg-green-600 text-white hover:bg-green-700"
danger: "bg-red-600 text-white hover:bg-red-700"

// Status Badge Colors
Submitted: "bg-yellow-100 text-yellow-800"
Under Review: "bg-orange-100 text-orange-800"
Approved: "bg-green-100 text-green-800"
Rejected: "bg-red-100 text-red-800"
```

**Responsive Design:**
```css
/* Desktop (lg and up) */
grid-cols-3 with 2/3 + 1/3 layout

/* Tablet (md) */
grid-cols-2 with content adjustments

/* Mobile (default) */
grid-cols-1 (stacked single column)
Sidebar moves below main content
All sections full width
Font sizes slightly reduced
```

**Verification Checklist:**
- [ ] Main container has max-width constraint (max-w-7xl)
- [ ] Grid layout: 2/3 main + 1/3 sidebar on desktop
- [ ] Single column on mobile (no sidebar)
- [ ] Typography follows pattern (h1, h2, h3 sizes)
- [ ] Colors match design system (gray-900, gray-600, blue-600)
- [ ] Spacing consistent (8px/16px grid)
- [ ] Responsive breakpoints work (test on mobile/tablet)
- [ ] No horizontal scrolling on mobile

---

### AC7: Authorization Check - Only Evaluators Can Access

**Acceptance Criteria:**
```
Given: User is not an evaluator
When: User attempts to navigate to /evaluation-queue/:ideaId
Then: Page rejects access and redirects
```

**What This Means:**
- Only users with "evaluator" or "admin" role can access
- Non-evaluators redirected to home page
- Happens before component renders

**Technical Implementation:**
```typescript
// In App.tsx route definition:
<Route
  path="/evaluation-queue/:ideaId"
  element={
    <ProtectedRoute requiredRole="evaluator">
      <IdeaReviewPanel />
    </ProtectedRoute>
  }
/>

// ProtectedRoute component (from STORY-1.4):
interface ProtectedRouteProps {
  requiredRole?: string;
  children: React.ReactNode;
}

export function ProtectedRoute({ requiredRole, children }: ProtectedRouteProps) {
  const { user } = useMockAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    // Not authenticated
    if (!user) {
      navigate('/login');
      return;
    }

    // Check role if required
    if (requiredRole && !user.roles?.includes(requiredRole)) {
      navigate('/');
      return;
    }
  }, [user, requiredRole, navigate]);

  // Wait for auth check
  if (!user) return <LoadingSpinner />;

  // Authorization failed
  if (requiredRole && !user.roles?.includes(requiredRole)) {
    return null; // Redirect happens above
  }

  // Authorized
  return <>{children}</>;
}

// User roles:
type UserRole = "submitter" | "evaluator" | "admin";

// Valid access:
user.roles?.includes("evaluator") ✓
user.roles?.includes("admin") ✓
user.roles?.includes("submitter") ✗
```

**Verification Checklist:**
- [ ] ProtectedRoute guards the route
- [ ] Non-evaluators cannot access `/evaluation-queue/:ideaId`
- [ ] Non-evaluators redirected to home page
- [ ] Submitters cannot view other submitters' ideas (if needed)
- [ ] Admins can access (if admin role includes evaluator privileges)
- [ ] No console errors about missing auth

---

## 2. Technical Architecture Overview

### Component Hierarchy
```
App.tsx
├── Routes
│   └── /evaluation-queue/:ideaId
│       └── ProtectedRoute (requiredRole="evaluator")
│           └── IdeaReviewPanel
│               ├── StatusBadge (reused)
│               ├── AttachmentsSection (reused from STORY-2.5)
│               └── Sidebar Components
```

### Data Flow
```
URL Param (:ideaId)
    ↓
IdeaReviewPanel useEffect
    ↓
ideasService.getIdeaDetail(ideaId)
    ↓
GET /api/ideas/:ideaId
    ↓
Component State (idea, isLoading, error)
    ↓
Render UI with idea data
    ↓
Auto-update status if "Submitted"
    ↓
ideasService.updateIdeaStatus(ideaId, { status: "Under Review" })
    ↓
PUT /api/ideas/:ideaId/status
```

### State Management
```typescript
const [idea, setIdea] = useState<IdeaDetail | null>(null);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

// Error states:
- Loading: show spinner
- Error: show error message + back button
- Not found: show "Idea not found" + back button
- Success: show idea details
```

### API Integration Layer
```typescript
// In ideasService.ts:

// Already exists from STORY-2.5:
getIdeaDetail(ideaId: string): Promise<IdeaDetail>

// Ensure exists for STORY-3.2:
updateIdeaStatus(ideaId: string, data: { status: string }): Promise<IdeaDetail>
```

### Type Definitions
```typescript
// From ideaSchema.ts:
interface IdeaDetail {
  id: string;
  title: string;
  description: string;
  category: string;
  status: "Submitted" | "Under Review" | "Approved" | "Rejected";
  submitterId: string;
  submitterName: string;
  submitterEmail: string;
  submitterDepartment?: string;
  createdAt: string; // ISO8601
  updatedAt: string; // ISO8601
  attachments: Attachment[];
}

interface Attachment {
  id: string;
  filename: string;
  size: number;
  url: string;
  uploadedAt: string; // ISO8601
}

interface User {
  email: string;
  isAuthenticated: boolean;
  role: "submitter" | "evaluator" | "admin";
  timestamp: string;
}
```

---

## 3. Implementation Checklist by AC

| AC | Component | File | Lines | Est. Days |
|----|-----------|------|-------|-----------|
| AC1 | IdeaReviewPanel (main) | src/pages/IdeaReviewPanel.tsx | 80-100 | 0.5 |
| AC2 | Reuse AttachmentsSection | - (already exists) | - | 0 |
| AC3 | Sidebar submitter card | src/pages/IdeaReviewPanel.tsx | 30-40 | 0.25 |
| AC4 | Auto-status update logic | src/pages/IdeaReviewPanel.tsx | 20-30 | 0.25 |
| AC5 | Back button + navigation | src/pages/IdeaReviewPanel.tsx | 5-10 | 0.1 |
| AC6 | Responsive layout + styling | src/pages/IdeaReviewPanel.tsx | 60-80 | 0.25 |
| AC7 | ProtectedRoute integration | src/App.tsx | 1-2 | 0 |
| Tests | Unit + Integration | src/pages/__tests__/IdeaReviewPanel.test.tsx | 150-200 | 0.5 |

**Total Implementation:** ~2 days

---

## 4. Known Questions & Decisions

### Q1: What if idea is already "Under Review"?
**A:** Do NOT make another PUT call. Check status === "Submitted" first.

### Q2: What if status update fails?
**A:** Log error silently. Still allow viewing idea. Show optional notification.

### Q3: Can multiple evaluators open same idea?
**A:** First evaluator wins (database constraint). Next evaluator sees "Under Review" status.

### Q4: Should we show who is evaluating?
**A:** Not in STORY-3.2. Would be added in STORY-3.5 (audit logging).

### Q5: What about concurrent edits?
**A:** STORY-3.2 is read-only except for status update. STORY-3.3 adds decisions.

