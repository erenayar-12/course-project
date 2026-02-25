# Implementation Plan: STORY-2.5 - Idea Detail Page

**Document ID:** STORY-2.5-IMPL-PLAN  
**Date Created:** February 25, 2026  
**Status:** READY FOR PHASE 1  
**Reference Spec:** [specs/stories/STORY-2.5-Detail-Page.md](specs/stories/STORY-2.5-Detail-Page.md)  
**Clarifications:** [specs/stories/STORY-2.5-CLARIFICATION.md](specs/stories/STORY-2.5-CLARIFICATION.md)  
**Convention:** Per `agents.md` sections 2-4  
**Epic:** EPIC-2 (Idea Submission Management)  
**Story Points:** 5  
**Estimated Time:** 2-3 days (3-4 days with testing)

---

## 1. Executive Summary

Implement the idea detail page allowing users to view, edit, and delete their submitted ideas with status tracking, attachment management, and evaluator feedback display. This story completes the user-facing workflow for idea lifecycle management.

**Key Deliverables:**
- Detail page component with read-only and editable states
- Attachment display with download capability
- Edit/Delete buttons with conditional visibility based on status
- Rejection feedback display section
- Navigation and authorization controls
- Responsive design for mobile/tablet/desktop
- Loading states and error handling
- 20+ unit tests + 10+ E2E test scenarios

**Dependencies:**
- ✅ STORY-1.2 (Auth & Protected Routes) - Already complete
- ✅ STORY-2.1 (Submission Form) - Already complete
- ✅ STORY-2.3a (Dashboard, navigation to detail) - Already complete
- ✅ STORY-2.4 (Loading states, skeleton loaders) - Already complete
- ⏳ STORY-1.4 (RBAC) - For evaluator access control (stretch goal)

**Tech Stack:**
- Frontend: React 18, TypeScript, Tailwind CSS, React Router v6
- Backend: Express.js, Prisma ORM, PostgreSQL
- Testing: Jest + React Testing Library (unit/integration), Cypress (E2E)

---

## 2. Acceptance Criteria Implementation Roadmap

### Phase 1: Core Display & Base Functionality (AC1-AC8)

#### AC1: Page Loads with Idea Information

**Status:** NOT STARTED - Backend endpoint exists, frontend needs integration

**Task Breakdown:**

**Backend (Skip - Already Exists):**
- ✅ Endpoint: `GET /api/ideas/:ideaId` (from STORY-2.3b)
- ✅ Returns 200 with idea data including attachments
- ✅ Returns 404 for non-existent ideas
- ✅ Authorization: Returns 403 if user is not owner

**Frontend:**
- [ ] Create `src/pages/IdeaDetailPage.tsx` component
  - [ ] Extract `ideaId` from URL params: `const { ideaId } = useParams<{ ideaId: string }>()`
  - [ ] Get current user from auth context
  - [ ] State: `idea: Idea | null`, `loading: boolean`, `error: string | null`
  - [ ] useEffect: On mount, call `ideasService.getIdeaDetail(ideaId)`
  - [ ] Display idea data: title, description, category, status
  - [ ] Show loading state with SkeletonLoader (AC11)
  - [ ] Show error state with error message and retry button
  - [ ] Handle 403/404 errors appropriately (AC8, AC9)

- [ ] Create `src/services/ideasService.ts` method: `getIdeaDetail(ideaId: string)`
  - [ ] Call `GET /api/ideas/:ideaId`
  - [ ] Return `Idea` object with all fields
  - [ ] Throw error on 403/404/500

- [ ] Update routing in `App.tsx` or `Router.tsx`
  - [ ] Add route: `<Route path="/ideas/:ideaId" element={<IdeaDetailPage />} />`
  - [ ] Wrap in ProtectedRoute (from STORY-1.2)

- [ ] Test: Load idea detail page with valid ideaId
- [ ] Test: Verify all idea fields display (title, description, category, status)
- [ ] Test: Show loading spinner while fetching
- [ ] Test: Show error on failed API call
- [ ] Test: Verify 403 error handling (AC9)
- [ ] Test: Verify 404 error handling (AC8, AC10)

**Testing Tasks:**
- [ ] Unit test: `ideasService.getIdeaDetail()` success and error cases
- [ ] Unit test: `IdeaDetailPage.tsx` rendering with mock data
- [ ] Integration test: Load idea → verify API call + data display
- [ ] E2E test: Navigate from dashboard → idea list → detail page

---

#### AC2: Status Badge with Visual Indicator

**Status:** NOT STARTED - StatusBadge component exists from STORY-2.3a

**Task Breakdown:**

- [ ] Import existing `src/components/StatusBadge.tsx` component
- [ ] Display status badge prominently at top of detail page (next to title)
- [ ] Reuse existing color mapping:
  - `DRAFT`: Yellow/amber background
  - `SUBMITTED`: Blue background
  - `UNDER_REVIEW`: Orange background
  - `APPROVED`: Green background
  - `REJECTED`: Red background

- [ ] Add "Status Timeline" indicator (optional, AC2 extension): Show status transition history
  - [ ] Design: Simple timeline or status history section (if budget allows)
  - [ ] Suggested future feature: Track DRAFT → SUBMITTED → UNDER_REVIEW → APPROVED timeline

- [ ] Responsive: Adjust badge size for mobile (smaller) vs desktop (larger)

**Testing Tasks:**
- [ ] Unit test: StatusBadge renders with correct color for each status
- [ ] Integration test: IdeaDetailPage displays status badge correctly
- [ ] E2E test: Navigate to detail and verify status badge visibility

---

#### AC3: Attachment Display with Download

**Status:** NOT STARTED - Need to implement attachment section

**Task Breakdown:**

**Backend (Verify Exists):**
- ✅ Idea response includes `attachments` array
- ✅ Each attachment has: `id`, `fileName`, `fileSize`, `fileUrl`, `uploadedAt`
- ✅ Endpoint: `GET /api/ideas/:ideaId/attachments/:attachmentId/download` (if separate endpoint)

**Frontend:**

- [ ] Create `src/components/AttachmentsSection.tsx` component
  - [ ] Props: `attachments: Attachment[]`
  - [ ] Display list of attachments
  - [ ] Show for each attachment:
    - [ ] File icon (based on file type: pdf, doc, image, etc.)
    - [ ] File name (truncate if >50 chars, show full on hover)
    - [ ] File size in human-readable format (e.g., "2.5 MB" - decimal format)
    - [ ] Upload date (format: "Feb 25, 2026 at 2:30 PM")
    - [ ] Download button or link

- [ ] Download functionality:
  - [ ] Option A: Direct file URL - `<a href={attachment.fileUrl} download>`
  - [ ] Option B: Download endpoint - POST to `/api/ideas/:ideaId/attachments/:attachmentId/download` (tracks downloads)
  - [ ] Handle browser security (CORS headers if needed)
  - [ ] Show "Downloading..." state briefly
  - [ ] Show error if download fails

- [ ] Edge cases:
  - [ ] No attachments: Don't display section
  - [ ] 1 attachment: Show single item
  - [ ] 5+ attachments: Scroll or vertical list
  - [ ] Large file size: Format correctly (>1GB)

- [ ] Responsive:
  - [ ] Mobile: Single column, larger touch targets
  - [ ] Desktop: Table layout with columns (icon, name, size, date, download)

**Testing Tasks:**
- [ ] Unit test: AttachmentsSection renders with 0, 1, 3+ attachments
- [ ] Unit test: File size formatting (byte → MB, GB)
- [ ] Unit test: Download button click event
- [ ] Integration test: IdeaDetailPage displays attachments
- [ ] E2E test: Download attachment functionality

---

#### AC4: Edit Button (Conditional - AWAITING CLARIFICATION #1)

**Status:** BLOCKED PENDING PO DECISION - Can edit Draft? Can edit Submitted?

**Task Breakdown (Assumes Option A: Edit allowed for Draft OR Submitted):**

- [ ] Create "Edit Idea" button at top of detail page (next to Delete button)
  - [ ] Button text: "Edit Idea"
  - [ ] Button style: Primary (blue) Tailwind color
  - [ ] Placement: Top-right corner (next to status badge)

- [ ] Conditional visibility: Show only if:
  - [ ] Current user is idea owner AND
  - [ ] Idea status is DRAFT or SUBMITTED (per Clarification #1 Option A)

- [ ] Click handler:
  - [ ] Navigate to `/ideas/:ideaId/edit` (STORY-2.6 - Edit page)
  - [ ] OR Navigate to `/submit-idea?ideaId=:ideaId` (Reuse submission form)
  - [ ] Pass idea data via state or URL params

- [ ] UI state:
  - [ ] Disabled state if idea status is UNDER_REVIEW, APPROVED, REJECTED
  - [ ] Tooltip on disabled button: "Ideas cannot be edited in review"
  - [ ] OR Hide button entirely for non-editable statuses

**Testing Tasks:**
- [ ] Unit test: Edit button displays for DRAFT status
- [ ] Unit test: Edit button displays for SUBMITTED status
- [ ] Unit test: Edit button hidden for UNDER_REVIEW, APPROVED, REJECTED
- [ ] Unit test: Edit button click navigates to edit route
- [ ] Integration test: IdeaDetailPage conditional button visibility
- [ ] E2E test: Click edit button → navigate to edit form

---

#### AC5: Delete Button with Confirmation (AC5 + Clarification #11)

**Status:** NOT STARTED - Need modal confirmation + soft delete

**Task Breakdown:**

- [ ] Create "Delete Idea" button at top of detail page
  - [ ] Button text: "Delete"
  - [ ] Button style: Danger (red) Tailwind color
  - [ ] Placement: Top-right corner (next to Edit button)

- [ ] Conditional visibility: Show only if:
  - [ ] Current user is idea owner AND
  - [ ] Idea status is DRAFT (?)  [CLARIFICATION #1 - Currently assumes Draft only]

- [ ] Click handler:
  - [ ] Open confirmation modal with:
    - [ ] Title: "Delete Idea?"
    - [ ] Message: "This idea will be deleted and moved to trash. You can recover it within 30 days."
    - [ ] Two buttons: "Cancel" (gray), "Delete" (red danger)
    - [ ] Optional: Checkbox "Permanently delete (cannot recover)"

- [ ] Delete action:
  - [ ] Call backend: `DELETE /api/ideas/:ideaId`
  - [ ] Backend performs soft delete (mark is_deleted = true) per Clarification #11
  - [ ] Show success toast: "Idea deleted successfully"
  - [ ] Navigate back to dashboard after 1-2 seconds

- [ ] Error handling:
  - [ ] Show error toast if delete fails
  - [ ] Allow user to retry

- [ ] Accessible:
  - [ ] Focus management on confirmation modal
  - [ ] Keyboard: Escape to cancel, Tab to focus buttons, Enter to confirm
  - [ ] ARIA: Announce deletion confirmation

**Testing Tasks:**
- [ ] Unit test: Delete button visibility (DRAFT only)
- [ ] Unit test: Delete button click opens modal
- [ ] Unit test: Cancel button closes modal without deleting
- [ ] Unit test: Confirm button calls delete API
- [ ] Integration test: Delete flow end-to-end
- [ ] E2E test: Delete button → modal → confirm → redirects to dashboard
- [ ] E2E test: Verify deleted idea appears as deleted (soft delete tracking)

---

#### AC6: Rejection Feedback Display (AC6 + Clarification #3)

**Status:** NOT STARTED - Awaiting PO/Evaluator decision on visibility

**Task Breakdown (Assumes Option A: Show feedback immediately after rejection):**

- [ ] Create `src/components/RejectionFeedbackSection.tsx` component
  - [ ] Props: `feedback: EvaluatorFeedback | null | undefined`
  - [ ] Display only if idea status is REJECTED AND feedback exists

- [ ] Feedback display:
  - [ ] Header: "Evaluator Feedback"
  - [ ] Evaluator name (if available)
  - [ ] Rejection date
  - [ ] Feedback text (read-only, no edit)
  - [ ] Optional: Attachment from evaluator (if exists)

- [ ] Styling:
  - [ ] Warning/error styling (red border, light red background)
  - [ ] Prominent placement (below status, above attachments)
  - [ ] Responsive: Readable on mobile

- [ ] Related ideas (Future feature per Clarification #8):
  - [ ] Optional: Show links to approved ideas as examples
  - [ ] Defer for Phase 2

- [ ] Resubmission CTA:
  - [ ] If status is REJECTED: Show "Resubmit Idea" button
  - [ ] Click → Navigate to `/ideas/:ideaId/edit` with message "Address feedback and resubmit"

**Testing Tasks:**
- [ ] Unit test: RejectionFeedbackSection renders only when status is REJECTED
- [ ] Unit test: Display feedback text correctly
- [ ] Unit test: Evaluator name, date display
- [ ] Integration test: IdeaDetailPage with rejected idea shows feedback
- [ ] E2E test: Navigate to rejected idea → feedback visible

---

#### AC7: Read-Only Mode for Non-Draft Ideas

**Status:** NOT STARTED - Conditional rendering based on status

**Task Breakdown:**

- [ ] Identify editable fields:
  - [ ] DRAFT: Title, description, category, attachments ALL editable
  - [ ] SUBMITTED: Show all fields as read-only (maybe mark with "submitted" visual)
  - [ ] UNDER_REVIEW, APPROVED, REJECTED: All fields read-only

- [ ] Implementation:
  - [ ] Design pattern: `isEditable = status === 'DRAFT'` OR `isEditable = status === 'DRAFT' || status === 'SUBMITTED'` (depends on Clarification #1)
  - [ ] Pass `isEditable` boolean to form/field components
  - [ ] Disable input fields, hide delete button, hide edit button when not editable

- [ ] Visual indicators:
  - [ ] Read-only fields: gray background, no borders, no focus ring
  - [ ] Message: "This idea is submitted for review and cannot be edited"
  - [ ] OR Message: "This idea has been evaluated. Review feedback below."

- [ ] Attachment upload:
  - [ ] Only allow upload in DRAFT mode
  - [ ] Hide upload button in other statuses

**Testing Tasks:**
- [ ] Unit test: Read-only indicators display correctly
- [ ] Unit test: Form fields disabled for SUBMITTED status
- [ ] Unit test: Edit/delete buttons hidden for SUBMITTED status
- [ ] Integration test: DRAFTED idea vs SUBMITTED idea comparison
- [ ] E2E test: Navigate to SUBMITTED idea → verify read-only state

---

#### AC8: Back Navigation - "Back to Dashboard"

**Status:** NOT STARTED - Simple navigation link

**Task Breakdown:**

- [ ] Add "Back to My Ideas" link or button
  - [ ] Placement: Top-left corner (breadcrumb style) OR in header
  - [ ] Style: Secondary button or underlined link
  - [ ] Text: "← Back to Dashboard" or "Back to My Ideas"

- [ ] Click handler:
  - [ ] Use `useNavigate(-1)` to go back in browser history
  - [ ] OR Navigate to `/dashboard` explicitly
  - [ ] Recommendation: Use browser back (-1) to preserve filters/sort from STORY-2.4

- [ ] Persistence (per AC8 of spec):
  - [ ] Dashboard filters/sort should be preserved when returning
  - [ ] Already implemented from STORY-2.4 (URL params in state)
  - [ ] No extra work needed here

**Testing Tasks:**
- [ ] E2E test: Back button returns to dashboard
- [ ] E2E test: Dashboard filters preserved after detail page navigation

---

### Phase 2: Authorization & Error Handling (AC9-AC10)

#### AC9: Authorization - Only Owner Can View

**Status:** NOT STARTED - Backend check exists, frontend needs error handling

**Task Breakdown:**

**Backend (Verify Exists):**
- ✅ Endpoint returns 403 Forbidden if user is not owner
- ✅ Response: `{ error: "You don't have permission to view this idea" }`
- ✅ Returns 404 if idea doesn't exist (per security best practices)

**Frontend:**

- [ ] Error handling for 403:
  - [ ] Catch 403 error in ideasService
  - [ ] Display message: "You don't have permission to view this idea"
  - [ ] No sensitive info leaked (per Clarification #7 - secure by default)
  - [ ] Show "Back to Dashboard" button to navigate away

- [ ] Error handling for 404:
  - [ ] Same as AC10 below

- [ ] Evaluator access (STRETCH GOAL - depends on Clarification #9):
  - [ ] If user role is "evaluator", allow viewing submitted ideas
  - [ ] Requires RBAC from STORY-1.4 (may be blocked)
  - [ ] Different permissions: Evaluators can view but not edit/delete
  - [ ] Create separate evaluator detail page OR reuse with `readOnly` prop

**Testing Tasks:**
- [ ] Unit test: 403 error displays permission message
- [ ] E2E test: Non-owner accessing idea shows 403 error
- [ ] E2E test: Owner can access own idea (happy path)
- [ ] E2E test: Error page has back button

---

#### AC10: Not Found Handling (404)

**Status:** NOT STARTED - 404 error page

**Task Breakdown:**

- [ ] Error display:
  - [ ] Show friendly message: "Idea not found"
  - [ ] OR detailed message: "The idea you're looking for doesn't exist or has been deleted"
  - [ ] Don't reveal why (403 vs 404 distinction is internal)

- [ ] Recovery options:
  - [ ] "Back to Dashboard" button
  - [ ] "Submit New Idea" button
  - [ ] Search ideas feature (optional)

- [ ] Styling:
  - [ ] Error page component with icon (404 illustration)
  - [ ] Responsive design
  - [ ] Prominent call-to-action buttons

**Testing Tasks:**
- [ ] Unit test: 404 error displays not found message
- [ ] E2E test: Invalid ideaId shows 404 error
- [ ] E2E test: Back button navigates back

---

### Phase 3: Loading States & Responsive (AC11-AC12)

#### AC11: Loading State with Skeleton Loader

**Status:** PARTIALLY DONE - SkeletonLoader component exists from STORY-2.4

**Task Breakdown:**

- [ ] Reuse `src/components/SkeletonLoader.tsx` from STORY-2.4
  - [ ] Already has shimmer animation
  - [ ] Already responsive

- [ ] Show loading state while fetching:
  - [ ] Page initially shows skeleton loaders for:
    - [ ] Title (2 lines)
    - [ ] Description (5 lines)
    - [ ] Attachments section (3 items)
    - [ ] Metadata (status, date, category)
  - [ ] All skeletons animate together

- [ ] Duration: Max 3-5 seconds before showing error
  - [ ] implication: Use timeout to display error if API doesn't respond

- [ ] Remove loading state:
  - [ ] After API response received AND content rendered
  - [ ] Smooth fade-out transition (optional)

- [ ] Error state timeout:
  - [ ] If API takes >5s: Show error message with retry button
  - [ ] User can click retry to reload

**Testing Tasks:**
- [ ] Unit test: SkeletonLoader displays on initial load
- [ ] Integration test: Transition from skeleton → content
- [ ] E2E test: Verify skeleton animation during load
- [ ] E2E test: Load timeout shows error after 5+ seconds

---

#### AC12: Responsive Design (Mobile/Tablet/Desktop)

**Status:** NOT STARTED - Need responsive testing

**Task Breakdown:**

- [ ] Mobile (<640px):
  - [ ] Single column layout
  - [ ] Title as h2 (larger)
  - [ ] Status badge full width or right-aligned
  - [ ] Edit/Delete buttons stack vertically or show in dropdown
  - [ ] Attachments list single column
  - [ ] Font sizes: readable on small screens
  - [ ] Touch targets: min 44x44px per AC12 spec

- [ ] Tablet (640-1024px):
  - [ ] Layout still adapts towards desktop
  - [ ] Two-column layout possible for attachments
  - [ ] Buttons side-by-side if space allows

- [ ] Desktop (>1024px):
  - [ ] Full layout with whitespace
  - [ ] Two/three column option for attachments + feedback
  - [ ] Horizontal button layout

- [ ] Responsive classes (Tailwind):
  - [ ] Use `sm:`, `md:`, `lg:` breakpoints
  - [ ] Test: Chrome DevTools responsive mode
  - [ ] Test: Real mobile device if available

**Touch Targets (Per AC12):**
- [ ] Buttons minimum 44x44px (touch-friendly)
- [ ] Links minimum 44x44px
- [ ] Spacing between clickable elements: min 8px
- [ ] Verified using DevTools inspect element

**Testing Tasks:**
- [ ] Unit test: Component renders on different screen sizes
- [ ] E2E test: Mobile layout (viewport 375x812)
- [ ] E2E test: Tablet layout (viewport 768x1024)
- [ ] E2E test: Desktop layout (viewport 1920x1080)
- [ ] E2E test: Touch target verification (44x44px minimum)

---

## 3. Technical Architecture

### Component Structure

```
IdeaDetailPage.tsx (Main Container)
├── Header Section
│   ├── Back button
│   ├── Title
│   ├── Status badge
│   └── Edit/Delete buttons
├── Main Content
│   ├── Metadata (Category, Date, Submitter)
│   ├── Description (read-only or editable)
│   ├── AttachmentsSection
│   │   ├── File list
│   │   └── Download buttons
│   └── (Conditional) RejectionFeedbackSection
│       ├── Evaluator feedback
│       └── Resubmit button
├── Loading State
│   └── SkeletonLoader
└── Error State
    └── Error message + Back button
```

### Service Layer

**File:** `src/services/ideasService.ts`

```typescript
// New methods needed for STORY-2.5:

async getIdeaDetail(ideaId: string): Promise<Idea> {
  // GET /api/ideas/:ideaId
  // Returns 403 if not owner, 404 if not found
}

async deleteIdea(ideaId: string): Promise<void> {
  // DELETE /api/ideas/:ideaId
  // Backend performs soft delete
}

async downloadAttachment(ideaId: string, attachmentId: string): Promise<Blob> {
  // GET /api/ideas/:ideaId/attachments/:attachmentId/download
  // Returns file blob
  // Optional: Can use direct fileUrl instead
}
```

### State Management

**Local Component State:**
- `idea: Idea | null` - Current idea data
- `loading: boolean` - Loading during fetch
- `error: string | null` - Error message
- `showDeleteModal: boolean` - Delete confirmation visibility

**Context (from STORY-1.2):**
- `currentUser` - Auth context with userId, role
- `logout` - For redirecting after delete (optional)

**URL State (from STORY-2.4):**
- `/ideas/:ideaId` - Idea ID in route
- Previous dashboard filters preserved in browser history

### API Integration

**GET /api/ideas/:ideaId** (Already exists from STORY-2.3b)
```typescript
Response: {
  id: string
  title: string
  description: string
  category: 'PRODUCT' | 'SERVICE' | 'PROCESS' | 'OTHER'
  status: 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED'
  createdAt: ISO8601
  updatedAt: ISO8601
  userId: string
  attachments: [
    {
      id: string
      fileName: string
      fileSize: number  // bytes
      fileUrl: string   // S3 or storage URL
      uploadedAt: ISO8601
    }
  ]
  evaluatorFeedback?: {
    evaluatorId: string
    evaluatorName: string
    comments: string
    feedbackDate: ISO8601
    attachmentUrl?: string
  }
}
```

**DELETE /api/ideas/:ideaId** (Need to create/verify)
```typescript
Request: DELETE with Authorization header
Response: {
  success: true
  message: "Idea deleted successfully"
}
Error (403): {
  error: "You don't have permission to delete this idea"
}
Error (404): {
  error: "Idea not found"
}
```

### Prisma Schema (Backend - Verify exists)

```prisma
model Idea {
  id            String      @id @default(cuid())
  title         String
  description   String
  category      String      // PRODUCT, SERVICE, PROCESS, OTHER
  status        String      // DRAFT, SUBMITTED, UNDER_REVIEW, APPROVED, REJECTED
  userId        String
  user          User        @relation(fields: [userId], references: [id])
  
  attachments   Attachment[]
  evaluations   Evaluation[]
  
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  is_deleted    Boolean     @default(false)  // Soft delete per Clarification #11
  deleted_at    DateTime?
  
  @@index([userId, status])
}

model Attachment {
  id          String    @id @default(cuid())
  ideaId      String
  idea        Idea      @relation(fields: [ideaId], references: [id], onDelete: Cascade)
  
  fileName    String
  fileSize    Int       // bytes
  fileUrl     String    // S3 URL or storage path
  uploadedAt  DateTime  @default(now())
  
  @@index([ideaId])
}

model Evaluation {
  id            String      @id @default(cuid())
  ideaId        String
  idea          Idea        @relation(fields: [ideaId], references: [id], onDelete: Cascade)
  evaluatorId   String
  evaluator     User        @relation(fields: [evaluatorId], references: [id])
  
  status        String      // APPROVED, REJECTED, NEEDS_REVISION
  comments      String?
  createdAt     DateTime    @default(now())
  
  @@index([ideaId, evaluatorId])
}
```

---

## 4. Implementation Phases

### Phase 1: Backend Verification (0.5 days)
- [ ] Verify `GET /api/ideas/:ideaId` endpoint exists and works
- [ ] Verify `DELETE /api/ideas/:ideaId` endpoint exists
- [ ] Verify 403/404 error handling in backend
- [ ] Test authorization middleware
- [ ] Verify soft delete implementation (is_deleted flag)

### Phase 2: Core Frontend Components (1 day)
- [ ] Create `IdeaDetailPage.tsx` container
- [ ] Create `AttachmentsSection.tsx` component
- [ ] Create `RejectionFeedbackSection.tsx` component
- [ ] Import and reuse `StatusBadge.tsx`, `SkeletonLoader.tsx`
- [ ] Implement basic routing (`/ideas/:ideaId`)
- [ ] Wire up `ideasService.getIdeaDetail()` call
- [ ] Implement loading/error states

### Phase 3: User Actions & Interactivity (1 day)
- [ ] Edit button (conditional visibility, navigation to STORY-2.6)
- [ ] Delete button with confirmation modal
- [ ] Download attachment functionality
- [ ] Back to dashboard navigation
- [ ] Error handling (403, 404, timeout)

### Phase 4: Testing & Responsive Design (1 day)
- [ ] 20+ unit tests (components, services, utilities)
- [ ] 10+ integration tests (component workflows)
- [ ] 10+ E2E tests (user journeys, responsive)
- [ ] Responsive design verification (mobile/tablet/desktop)
- [ ] Accessibility audit (keyboard nav, ARIA, focus management)
- [ ] Cross-browser testing (Chrome, Safari, Firefox, Edge)

---

## 5. File Structure & Dependencies

### New Files to Create

```
src/
├── pages/
│   └── IdeaDetailPage.tsx              [NEW] Main detail page container
├── components/
│   ├── AttachmentsSection.tsx          [NEW] Display attachments + downloads
│   ├── RejectionFeedbackSection.tsx    [NEW] Display evaluator feedback
│   ├── SkeletonLoader.tsx              [EXISTS] Reuse from STORY-2.4
│   └── StatusBadge.tsx                 [EXISTS] Reuse from STORY-2.3a
└── services/
    └── ideasService.ts                 [MODIFY] Add getIdeaDetail, deleteIdea
```

### Updated Files

```
src/
├── App.tsx                             [MODIFY] Add /ideas/:ideaId route
├── Router.tsx (or routing file)        [MODIFY] Add protected route
├── types/ideas.ts or types/index.ts    [MODIFY] Add RejectionFeedback type
└── services/ideasService.ts            [MODIFY] Add new service methods
```

### Test Files to Create

```
src/
├── pages/__tests__/
│   └── IdeaDetailPage.test.tsx         [NEW] 10+ unit tests
├── components/__tests__/
│   ├── AttachmentsSection.test.tsx     [NEW] 5+ unit tests
│   └── RejectionFeedbackSection.test.tsx [NEW] 3+ unit tests
└── services/__tests__/
    └── ideasService.test.ts            [MODIFY] Add detail/delete test cases
```

### E2E Test Files

```
cypress/
└── e2e/
    └── idea-detail-page.cy.ts          [NEW] 10+ E2E test scenarios
```

### Type Definitions

**File:** `src/types/ideas.ts` (or update existing)

```typescript
interface Idea {
  id: string
  title: string
  description: string
  category: 'PRODUCT' | 'SERVICE' | 'PROCESS' | 'OTHER'
  status: IdeaStatus
  userId: string
  createdAt: ISO8601DateTime
  updatedAt: ISO8601DateTime
  attachments: Attachment[]
  evaluatorFeedback?: EvaluatorFeedback
}

interface Attachment {
  id: string
  fileName: string
  fileSize: number  // bytes
  fileUrl: string
  uploadedAt: ISO8601DateTime
}

interface EvaluatorFeedback {
  evaluatorId: string
  evaluatorName: string
  comments: string
  feedbackDate: ISO8601DateTime
  attachmentUrl?: string
}

type IdeaStatus = 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED'
type IdeaCategory = 'PRODUCT' | 'SERVICE' | 'PROCESS' | 'OTHER'
```

---

## 6. Testing Strategy

### Unit Tests (10-15 tests)

**IdeaDetailPage Component:**
- Renders loading state with SkeletonLoader
- Renders idea data after successful fetch
- Shows error message on API failure (404, 403, 500)
- Edit button displays for DRAFT status
- Edit button hidden for SUBMITTED/UNDER_REVIEW/APPROVED/REJECTED
- Delete button displays and opens confirmation modal
- Delete action calls API and redirects
- Back button navigates to dashboard
- Status badge renders with correct colors

**AttachmentsSection Component:**
- Renders 0, 1, 3+ attachments
- Shows file size in human-readable format (bytes → MB)
- Download button click triggers download
- No section displayed if attachments array is empty
- File names truncated if >50 chars

**RejectionFeedbackSection Component:**
- Only displays when status is REJECTED
- Shows evaluator name, date, feedback text
- Resubmit button navigates to edit page
- Hidden when status is not REJECTED

**ideasService.ts Methods:**
- `getIdeaDetail()` - Success case returns Idea object
- `getIdeaDetail()` - Error cases (403, 404, 500)
- `deleteIdea()` - Success case returns void
- `deleteIdea()` - Error cases

### Integration Tests (5-8 tests)

- Load detail page → Fetch idea → Render all sections
- Click edit button → Navigate to edit form
- Click delete button → Confirmation modal → Confirm → Delete → Redirect
- Download attachment → File downloaded successfully
- 403 error → Permission error message displayed
- 404 error → Not found error message displayed
- Navigation preserve: Detail page → Back → Dashboard (filters preserved)
- Rejected idea page → Feedback section visible → Resubmit button works

### E2E Tests (10-12 tests)

- Navigate from dashboard list → Click idea row → Detail page loads
- Detail page displays all idea information (title, description, status, attachments)
- Edit button click → Navigate to edit form (STORY-2.6)
- Delete button click → Modal opens → Cancel closes modal
- Delete button click → Modal opens → Confirm deletes and redirects
- Download attachment → File downloads successfully
- Mobile layout: <640px viewport, 44x44px touch targets
- Tablet layout: 640-1024px viewport, responsive columns
- Desktop layout: >1024px viewport, full width layout
- Back button → Returns to dashboard with filters preserved
- 403 authorization error → Shows permission denied message
- 404 not found error → Shows idea not found message

**Test Pyramid Target:**
- Unit tests: 60% (10-15 tests)
- Integration tests: 30% (5-8 tests)
- E2E tests: 10% (3-4 tests)
- **Total: 20-25 test scenarios**

---

## 7. Dependencies & Blockers

### Hard Dependencies
- ✅ STORY-1.2 (Auth & Protected Routes) - Core authentication
- ✅ STORY-2.1 (Submission Form) - Form component for edit reuse
- ✅ STORY-2.3a (Dashboard) - List item navigation to detail
- ✅ STORY-2.4 (Filter/Sort) - URL state preservation, SkeletonLoader
- ⏳ Backend API endpoints (`GET /api/ideas/:ideaId`, `DELETE /api/ideas/:ideaId`)

### Soft Dependencies (Can implement in parallel)
- STORY-2.6 (Edit Page) - Creates `/ideas/:ideaId/edit` route
- STORY-1.4 (RBAC) - For evaluator access control (future stretch)
- Clarifications #1, #3, #5, #9 - Minor feature adjustments

### Blocked By Clarifications
- **Clarification #1:** Can users edit after submission? (affects AC4 logic)
- **Clarification #3:** When is rejection feedback visible? (affects AC6 display timing)
- **Clarification #5:** Hard vs soft delete (affects AC5 logic)
- **Clarification #9:** Can evaluators view submitted ideas? (affects authorization)

**Recommendation:**  Proceed with default implementations while waiting for PO clarifications. Code is easily refactorable based on clarification decisions.

---

## 8. Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| Backend API not ready | MEDIUM | HIGH | Implement mock service for testing |
| Authorization edge cases | MEDIUM | MEDIUM | Comprehensive 403/404 tests, security review |
| Attachment download CORS issues | LOW | MEDIUM | Test with real file URLs, CORS headers |
| Mobile responsive complexity | LOW | MEDIUM | Tailwind breakpoints, DevTools testing |
| Soft delete data loss | LOW | HIGH | Backup soft delete schema, audit trail |
| Performance with large attachments | LOW | LOW | File size validation on backend |

**Mitigation Strategies:**
1. Create mock API service for frontend testing during backend development
2. Conduct security audit before production (authorization, no info leakage)
3. Test with real S3/storage URLs for attachment downloads
4. Use Cypress viewport testing for responsive design validation
5. Verify soft delete implementation (is_deleted flag + deleted_at timestamp)

---

## 9. Implementation Checklist

### Pre-Implementation
- [ ] Backend API endpoints verified (`GET /api/ideas/:ideaId`, `DELETE /api/ideas/:ideaId`)
- [ ] Clarifications #1, #3, #5 received from PO (or proceed with defaults)
- [ ] Type definitions finalized for Idea, Attachment, EvaluatorFeedback
- [ ] Database schema includes soft delete (is_deleted, deleted_at)
- [ ] Mock API service created for testing (if backend not ready)

### Phase 1: Components & Services (Day 1)
- [ ] Create `IdeaDetailPage.tsx` container
- [ ] Create `AttachmentsSection.tsx` component
- [ ] Create `RejectionFeedbackSection.tsx` component
- [ ] Add `ideasService.getIdeaDetail()` and `deleteIdea()` methods
- [ ] Wire up routing (`/ideas/:ideaId`)
- [ ] Implement loading and error states

### Phase 2: Interactions (Day 2)
- [ ] Edit button with navigation
- [ ] Delete button with confirmation modal
- [ ] Download attachment functionality
- [ ] Back to dashboard navigation
- [ ] 403/404 error handling UI

### Phase 3: Testing (Day 2-3)
- [ ] 10-15 unit tests passing
- [ ] 5-8 integration tests passing
- [ ] 10-12 E2E tests passing
- [ ] Responsive design verified (mobile/tablet/desktop)
- [ ] Accessibility audit (keyboard nav, ARIA)
- [ ] Cross-browser testing (Chrome, Firefox, Safari)

### Deployment & Verification
- [ ] All tests passing (target: 25/25 ✅)
- [ ] Accessibility checklist completed
- [ ] Security review completed (authorization, no data leaks)
- [ ] Performance audit (load times, attachment downloads)
- [ ] User acceptance testing with stakeholders
- [ ] Deploy to staging environment
- [ ] Deploy to production

---

## 10. Success Criteria

**Definition of Done:**
- ✅ All 12 acceptance criteria implemented
- ✅ 20+ tests created and passing (unit + integration + E2E)
- ✅ 0 TypeScript errors or warnings
- ✅ 0 accessibility issues (WCAG 2.1 AA compliant)
- ✅ Mobile responsive (tested on 3 viewports: mobile/tablet/desktop)
- ✅ Authorization verified (owner-only access, 403/404 handling)
- ✅ Code reviewed and approved
- ✅ Deployed to staging for QA

**Performance Targets:**
- Page load time: <2 seconds (initial render)
- Skeleton loader duration: <3 seconds before error
- File download: <5 seconds for <10MB files
- Lighthouse score: >90 (Performance, Accessibility, Best Practices)

**Quality Metrics:**
- Test coverage: >80% line coverage
- Cyclomatic complexity: <5 per function
- Documentation: All components documented with JSDoc
- Code style: ESLint + Prettier rules passing

---

## 11. Next Steps

1. **Get Clarifications Approved** (by Feb 26)
   - PO decision on Clarifications #1, #3, #5, #9
   - Update implementation plan if needed

2. **Verify Backend API Ready** (by Feb 26)
   - Test `GET /api/ideas/:ideaId` endpoint
   - Test `DELETE /api/ideas/:ideaId` endpoint
   - Verify soft delete implementation

3. **Begin Phase 1 Implementation** (Feb 27+)
   - Create components
   - Wire up services
   - Implement loading/error states

4. **Create STORY-2.6 Plan** (parallelize)
   - Edit page specification already complete
   - Plan implementation while STORY-2.5 Phase 1 in progress

---

**Document Status:** 🟢 READY FOR PHASE 1 IMPLEMENTATION  
**Last Updated:** February 25, 2026  
**Next Review:** After Phase 1 completion (target: Feb 27)
