# STORY-2.5: Build Idea Detail Page

**Story ID:** STORY-2.5  
**Epic:** EPIC-2  
**Created:** February 25, 2026  
**Priority:** P1 (Medium)  
**Estimated Size:** M (Medium)  
**Owner:** [Developer Name]  
**Status:** DRAFT

## Title
Build Idea Detail Page with Full Information Display and Attachment Download

## Description
As a **submitter**, I want to view the complete details of my submitted idea so that I can see all the information I submitted and download any attachments I included.

## Acceptance Criteria

### Functional Requirements
- [ ] Detail page displays all idea information: Title, Description, Category, Status, Creation Date, Last Updated Date
- [ ] Detail page displays status badge with color coding
- [ ] Status timeline/history is displayed (if available from evaluation workflow)
- [ ] If idea has attachment, display file information and download button
- [ ] Download button allows user to download the attached file
- [ ] Back button navigates back to dashboard
- [ ] Edit button is visible and enabled only if idea status is "Submitted"
- [ ] Edit button navigates to edit page (for STORY-2.6)
- [ ] Delete button is visible with confirmation dialog
- [ ] Page displays rejection feedback if idea was rejected
- [ ] Page is accessible only to idea owner (authentication verified)
- [ ] Read-only view for ideas with status other than "Submitted"
- [ ] Page loads data from backend API

### Non-Functional Requirements
- [ ] Page loads within 2 seconds
- [ ] Page is fully responsive (mobile, tablet, desktop)
- [ ] Page follows EPAM brand guidelines and design system
- [ ] File download does not require reload or page navigation

## Implementation Tasks

### Frontend (React/TypeScript)
- [ ] Create `IdeaDetailPage.tsx` component
- [ ] Parse URL parameters to extract idea ID
- [ ] Fetch idea details from API on component mount
- [ ] Display loading state while fetching
- [ ] Display error state with retry button
- [ ] Render all idea fields with appropriate formatting
- [ ] Display status badge with color coding
- [ ] Display file information and download button (if attachment exists)
- [ ] Implement download functionality
- [ ] Show/hide edit and delete buttons based on idea status
- [ ] Implement delete confirmation dialog
- [ ] Add back navigation button
- [ ] Style with Tailwind CSS for responsive design

### Backend (Node.js/Express)
- [ ] Create GET `/api/ideas/:ideaId` endpoint
- [ ] Add authentication/authorization middleware (verify user is idea owner)
- [ ] Implement service layer for fetching idea details
- [ ] Optimize query to include attachment information
- [ ] Return complete idea object with relationships
- [ ] Create endpoint for file download: GET `/api/ideas/:ideaId/attachment/download`
- [ ] Implement proper file download response headers
- [ ] Add request logging

### Testing
- [ ] Integration tests for detail endpoint with various idea states
- [ ] E2E tests for detail page navigation and display
- [ ] Test file download functionality
- [ ] Test authorization (verify user can only see own ideas)
- [ ] Test responsive design on different screen sizes

## Technical Notes

### API Endpoints
```
GET /api/ideas/:ideaId
GET /api/ideas/:ideaId/attachment/download
```

### Response Format
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "title": "string",
    "description": "string",
    "category": "string",
    "status": "Submitted",
    "createdAt": "2026-02-25T10:00:00Z",
    "updatedAt": "2026-02-25T10:00:00Z",
    "attachment": {
      "id": "uuid",
      "originalFileName": "document.pdf",
      "fileSize": 2097152,
      "uploadedAt": "2026-02-25T10:00:00Z"
    }
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
