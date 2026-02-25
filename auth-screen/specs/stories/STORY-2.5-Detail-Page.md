# STORY-2.5: Build Idea Detail Page

**Story ID:** STORY-2.5  
**Title:** Display Idea Details with Attachments and Edit/Delete Actions  
**Epic:** EPIC-2 (Idea Submission & Management System)  
**Created:** February 25, 2026  
**Priority:** P1 (High)  
**Estimated Size:** M (Medium - 5 story points)  
**Sprint/Milestone:** Sprint 2  
**Owner:** [Development Team]  
**Status:** APPROVED

---

## User Story

**As a** Priya (Idea Submitter)  
**I want** to view the complete details of my submitted idea on a dedicated page  
**so that** I can review all my submission information, download attachments, and manage the idea (edit, delete, or track evaluation progress)

### Story Context
Users need a way to view the full details of their submitted ideas after navigating from the dashboard. The detail page serves as a hub for managing ideas—viewing complete information, downloading attachments, editing draft ideas, and deleting unwanted submissions. This page is also a foundation for future evaluator workflows where reviewers can provide feedback and reject ideas.

---

## Acceptance Criteria

### AC 1: Page Loads with Idea Information
- **Given** The user is authenticated and navigates to `/ideas/:ideaId` for their own idea
- **When** The page loads
- **Then** All idea fields are displayed: Title, Description, Category, Status, Created Date, Updated Date
- **And** Information is formatted clearly and readably (no raw ISO timestamps)
- **And** Page shows "Loading..." message while fetching from API

### AC 2: Status Badge with Visual Indicator
- **Given** The idea detail page is loaded
- **When** The user views the idea status
- **Then** Status is displayed as a colored badge (e.g., Submitted=blue, Approved=green, Rejected=red)
- **And** Badge color follows the design system color scheme
- **And** Status text is always clearly visible

### AC 3: Attachment Display and Download
- **Given** An idea has an attached file
- **When** The detail page loads
- **Then** Attachment information is displayed: filename, file size (human-readable: "2.5 MB"), upload date
- **And** A "Download" button is visible next to attachment info
- **And** Clicking "Download" initiates file download without page navigation
- **And** Downloaded file uses the original filename

### AC 4: Edit Button (Conditional - Draft Ideas Only)
- **Given** The idea has status "Draft" or "Submitted"
- **When** The user views the detail page
- **Then** An "Edit Idea" button is visible and enabled
- **And** Clicking "Edit" navigates to `/ideas/:ideaId/edit` (route placeholder; STORY-2.6 implementation)
- **And** Button is prominently placed (e.g., top-right or action bar)

### AC 5: Delete Button (Conditional - Draft Ideas Only)
- **Given** The idea has status "Draft" or "Submitted"
- **When** The user views the detail page
- **Then** A "Delete" button is visible and enabled
- **And** Clicking "Delete" shows a confirmation modal: "Are you sure you want to delete this idea? This action cannot be undone."
- **And** Confirming deletion removes the idea from the system and redirects to `/my-ideas`
- **And** Button styling indicates destructive action (red/warning color)

### AC 6: Rejection Feedback Display
- **Given** An idea has been rejected (status = "Rejected")
- **When** The user views the detail page
- **Then** A feedback section is displayed with the evaluator's rejection reason (if provided)
- **And** Feedback is clearly labeled: "Rejection Feedback:" or "Evaluator Comments:"
- **And** Feedback styling distinguishes it from main idea content (e.g., alert box or callout)

### AC 7: Read-Only for Non-Draft Ideas
- **Given** The idea has status other than "Draft" or "Submitted" (e.g., Under Review, Approved, Rejected)
- **When** The user views the detail page
- **Then** Edit and Delete buttons are hidden or disabled
- **And** Page displays message: "This idea is under review and cannot be edited"
- **And** User can still view all idea details and download attachments

### AC 8: Back Navigation
- **Given** The user is viewing the idea detail page
- **When** The user clicks the "Back to My Ideas" button
- **Then** The user is redirected to `/my-ideas` dashboard
- **And** Browser back button also works to return to previous page
- **And** Dashboard preserves any active filters/sort from before navigation

### AC 9: Authorization & Ownership Verification
- **Given** User A is viewing `/ideas/:ideaId`
- **When** The idea belongs to User B
- **Then** A "403 Forbidden" error is displayed: "You don't have permission to view this idea"
- **And** User A cannot access, edit, or delete User B's ideas
- **And** Error message includes "Return to My Ideas" button

### AC 10: Error Handling - Page Not Found
- **Given** The user navigates to `/ideas/:invalidIdea`
- **When** The idea does not exist in the database
- **Then** A "404 Not Found" error is displayed: "Idea not found"
- **And** Error message includes "Return to My Ideas" button
- **And** Page logs the error for debugging

### AC 11: Loading and Error States
- **Given** The detail page is loading idea data from API
- **When** The page is first rendered
- **Then** A skeleton loader or spinner is shown instead of content
- **And** If API call fails, an error message appears with a "Retry" button
- **And** Clicking "Retry" fetches data again
- **And** Loading/error states never exceed 5 seconds before timeout

### AC 12: Responsive Design
- **Given** The detail page is viewed on mobile, tablet, or desktop
- **When** The page renders
- **Then** Layout is responsive and readable on all screen sizes
- **And** Attachment info and buttons stack vertically on mobile
- **And** Text is sufficiently large for readability (minimum 16px on mobile)
- **And** Touch targets (buttons) are at least 44x44 pixels on mobile

---

## Definition of Acceptance

All acceptance criteria must pass:

- [ ] Acceptance criteria AC1-AC12 verified and passing
- [ ] Code review completed and approved by tech lead
- [ ] Unit tests passing (≥80% coverage for component logic)
- [ ] Integration tests with API passing
- [ ] E2E tests passing (Cypress: detail page navigation, edit/delete actions, authorization)
- [ ] No new linting errors or TypeScript errors
- [ ] Performance verified: page loads within 2 seconds on standard network
- [ ] Responsive design verified on mobile (iPhone), tablet (iPad), desktop (1920px+)
- [ ] Accessibility verified: ARIA labels, keyboard navigation, color contrast
- [ ] Documentation updated (README or setup guide if needed)
- [ ] Merged to main branch

---

## Technical Notes

### Implementation Architecture

**Frontend Components:**
- `src/pages/IdeaDetailPage.tsx` - Main page component
- `src/components/IdeaDetailContent.tsx` - Content display (title, description, etc.)
- `src/components/AttachmentDisplay.tsx` - Attachment info and download button
- `src/components/DeleteConfirmationModal.tsx` - Delete confirmation dialog
- `src/components/IdeaStatusBadge.tsx` - Colored status badge
- `src/hooks/useIdeaDetail.ts` - Custom hook for fetching idea data

**Backend Endpoints:**
```typescript
GET /api/ideas/:ideaId
  - Fetch idea details with attachments
  - Verify user ownership (middleware)
  - Return 403 if not owner, 404 if not found

GET /api/ideas/:ideaId/attachment/download
  - Download attached file
  - Set proper response headers (Content-Disposition, Content-Type)
  - Verify user ownership before serving file

DELETE /api/ideas/:ideaId
  - Delete idea (only if status is Draft or Submitted)
  - Verify user ownership
  - Return 403 if not owner
  - Return 409 if idea cannot be deleted (status locked)
```

### API Response Format

```typescript
// GET /api/ideas/:ideaId response
{
  success: true,
  data: {
    id: 'uuid',
    userId: 'uuid',
    title: 'string (3-100)',
    description: 'string (10-5000)',
    category: 'PRODUCT | PROCESS | MARKETING | OTHER',
    status: 'DRAFT | SUBMITTED | UNDER_REVIEW | APPROVED | REJECTED',
    createdAt: 'ISO-8601 timestamp',
    updatedAt: 'ISO-8601 timestamp',
    evaluatorFeedback?: 'string (rejection reason)',
    attachments: [
      {
        id: 'uuid',
        originalName: 'string',
        storedName: 'string',
        fileSize: number (bytes),
        mimeType: 'string',
        uploadedAt: 'ISO-8601 timestamp'
      }
    ]
  }
}

// Error responses
{
  success: false,
  statusCode: 403 | 404 | 500,
  message: 'string (error description)'
}
```

### State Management
- Use `useState` for local component state (loading, error, idea data)
- Optionally use `useContext` if idea detail needs to be shared with sibling components
- Consider adding to Context if edit/delete flows need shared state

### Date Formatting
- Use `new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })`
- Example: "February 25, 2026"
- For time: add `{ hour: '2-digit', minute: '2-digit' }` for "10:30 AM"

### File Download Implementation
```typescript
// Backend: Set response headers
res.setHeader('Content-Disposition', `attachment; filename="${originalFileName}"`);
res.setHeader('Content-Type', 'application/octet-stream');
res.download(filePath);

// Frontend: Initiate download
const downloadFile = async (ideaId: string) => {
  const response = await fetch(`/api/ideas/${ideaId}/attachment/download`);
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
};
```

### Authorization Middleware (Backend)
```typescript
// Middleware to verify idea ownership
async function verifyIdeaOwnership(req, res, next) {
  const { ideaId } = req.params;
  const { userId } = req.user; // From Auth0 JWT
  
  const idea = await prisma.idea.findUnique({
    where: { id: ideaId },
    select: { userId: true }
  });
  
  if (!idea) return res.status(404).json({ error: 'Idea not found' });
  if (idea.userId !== userId) return res.status(403).json({ error: 'Forbidden' });
  
  next();
}

// Apply to routes
router.get('/:ideaId', authMiddleware, verifyIdeaOwnership, getIdeaDetail);
router.delete('/:ideaId', authMiddleware, verifyIdeaOwnership, deleteIdea);
```

---

## Technology Stack

- **Frontend:** React 18, TypeScript, React Router v6, Tailwind CSS, fetch API
- **Backend:** Node.js, Express.js, Prisma ORM, PostgreSQL
- **Testing:** Jest, React Testing Library, Cypress
- **File Handling:** Node.js fs module, multer (backend), Blob API (frontend)

---

## Files/Components Affected

### Frontend (New/Modified)
- `src/pages/IdeaDetailPage.tsx` - NEW: Main detail page component
- `src/components/IdeaDetailContent.tsx` - NEW: Content display section
- `src/components/AttachmentDisplay.tsx` - NEW: Attachment info and download
- `src/components/DeleteConfirmationModal.tsx` - NEW: Delete confirmation
- `src/components/IdeaStatusBadge.tsx` - NEW: Status badge with colors
- `src/hooks/useIdeaDetail.ts` - NEW: Custom hook for data fetching
- `src/services/ideaService.ts` - MODIFIED: Add detail fetch method
- `src/types/ideaTypes.ts` - MODIFIED: Add IdeaDetail type (extended with feedback)

### Backend (New/Modified)
- `backend/src/routes/ideas.ts` - MODIFIED: Add GET /:ideaId and DELETE /:ideaId routes
- `backend/src/services/ideas.service.ts` - MODIFIED: Add getIdeaById and deleteIdea methods
- `backend/src/middleware/authorization.ts` - NEW: Ownership verification middleware

### Tests (New)
- `src/pages/__tests__/IdeaDetailPage.test.tsx` - NEW: Unit tests for detail page
- `cypress/e2e/idea-detail.cy.ts` - NEW: E2E tests for detail page interactions

---

## Known Limitations & Considerations

- **Limitation 1:** Deletion is permanent; no soft delete or restore feature in MVP
- **Limitation 2:** Rejection feedback is simple text; no rich text formatting in MVP
- **Limitation 3:** No revision history or audit log of idea changes (future enhancement)
- **Consideration 1:** Download endpoint should have rate limiting to prevent abuse
- **Consideration 2:** Large file downloads may require progress bar (future enhancement)
- **Consideration 3:** Mobile-specific delete confirmation might use platform-native dialogs
- **Consideration 4:** Evaluator feedback is display-only; editing feedback is in STORY-2.X (evaluator workflow)

---

## Estimation & Effort

**Story Points:** 5  
**Estimated Days:** 4-5 days

**Estimation Rationale:**  
Medium complexity due to:
- Frontend: Multiple components, conditional rendering, authorization state
- Backend: Two new endpoints, ownership verification, proper error handling
- Testing: Authorization tests, error cases, responsive design validation
- Similar effort to STORY-2.3 (dashboard) but with simpler data model
- No file storage or upload complexity (handled in STORY-2.2)

**Risk Level:** LOW

**Risk Reason:**  
- Core concepts well-established (authorization, API patterns)
- No external service dependencies
- Dependency STORY-2.3 (dashboard) already complete
- Patterns can follow STORY-2.3 implementation

---

## Dependencies & Blockers

### Story Dependencies
- ✅ **STORY-2.1** (Idea Submission Form) - MUST be complete (provides idea data)
- ✅ **STORY-2.3** (Dashboard) - MUST be complete (provides navigation to detail page)
- ✅ **STORY-2.2** (File Upload) - Optional but recommended (provides attachment data)
- ⏳ **STORY-2.6** (Edit Idea) - Can be in parallel; edit button links to STORY-2.6

### Blockers
- None known at specification time

### Optional Enhancements (Phase 3)
- Status timeline/evaluation history display
- Rich text formatting for rejection feedback
- File preview (PDF, images) instead of download-only
- Idea sharing with evaluators via link

---

## INVEST Validation Checklist

- ✅ **Independent** - Can be developed independently; only depends on STORY-2.1 & 2.3
- ✅ **Negotiable** - Details open for discussion (feedback UI, edit restrictions, etc.)
- ✅ **Valuable** - Delivers core functionality for users to review their ideas
- ✅ **Estimable** - Team understands requirements well enough to estimate (5 points)
- ✅ **Small** - Can be completed in 1 sprint (4-5 days)
- ✅ **Testable** - Clear acceptance criteria with measurable tests

---

## Sign-Off & Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Product Owner | [Product Manager] | 2026-02-25 | APPROVED |
| Tech Lead | [Engineering Lead] | 2026-02-25 | APPROVED |
| QA Lead | [QA Engineer] | 2026-02-25 | READY FOR QA |

---

## Related Documents

- **Epic:** [EPIC-2: Idea Submission & Management System](../epics/EPIC-2-Idea-Submission-Management.md)
- **Related Story:** [STORY-2.3: Create "My Ideas" Dashboard](STORY-2.3-Dashboard.md)
- **Related Story:** [STORY-2.6: Edit Idea (Planned)](STORY-2.6-Edit-Idea.md)
- **Tech Stack Reference:** [agents.md](../../agents.md)
- **API Design Reference:** [PRD-EPAM-Auth-Workflow.md](../prds/PRD-EPAM-Auth-Workflow.md)
  }
}
```

## Definition of Done
- [ ] Code review completed and approved
- [ ] All unit tests passing (>80% coverage)
- [ ] All integration tests passing
- [ ] All E2E tests passing
- [ ] No console errors or warnings
- [ ] Responsive design verified on mobile/tablet/desktop
- [ ] File download verified
- [ ] Authorization verified
- [ ] Documentation updated
- [ ] Merged to main branch

---

**Related Stories:**
- [STORY-2.3: Dashboard](STORY-2.3-Dashboard.md)
- [STORY-2.6: Edit](STORY-2.6-Edit-Functionality.md)
