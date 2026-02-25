# STORY-2.6: Implement Edit Functionality for Submitted Ideas

**Story ID:** STORY-2.6  
**Epic:** EPIC-2  
**Created:** February 25, 2026  
**Priority:** P2 (Low)  
**Estimated Size:** M (Medium)  
**Owner:** [Developer Name]  
**Status:** DRAFT

## Title
Implement Edit Functionality for Ideas in "Submitted" Status

## Description
As a **submitter**, I want to edit my idea while it's in "Submitted" status so that I can correct mistakes or add information before it enters the evaluation workflow.

## Acceptance Criteria

### Functional Requirements
- [ ] Edit page pre-populates all idea fields with current values
- [ ] Edit page is accessible only for ideas in "Submitted" status
- [ ] User can edit Title, Description, Category fields
- [ ] User can replace the attached file or remove it
- [ ] Client-side validation applies same rules as submission form
- [ ] Server validates all fields before applying updates
- [ ] Edit form has Save and Cancel buttons
- [ ] Cancel button returns to detail page without saving changes
- [ ] Save button updates idea in database and returns to detail page
- [ ] Success message is displayed after successful update
- [ ] Error message is displayed if update fails
- [ ] Last Updated timestamp is updated when idea is edited
- [ ] Edit history/audit trail is logged (optional, can be in Phase 2)

### Non-Functional Requirements
- [ ] Edit operation completes within 3 seconds
- [ ] Page loads within 2 seconds
- [ ] Page is fully responsive (mobile, tablet, desktop)
- [ ] Concurrent edit conflicts are handled gracefully (last-write-wins or optimistic locking)

## Implementation Tasks

### Frontend (React/TypeScript)
- [ ] Create `EditIdeaPage.tsx` component (can reuse form components from STORY-2.1)
- [ ] Fetch current idea data on component mount
- [ ] Pre-populate form fields with current idea data
- [ ] Allow user to modify Title, Description, Category
- [ ] Allow user to replace or remove attached file
- [ ] Implement Save functionality with API call
- [ ] Implement Cancel functionality (confirm if changes exist)
- [ ] Display success/error messages
- [ ] Redirect to detail page on success
- [ ] Add authorization check (verify user is idea owner)

### Backend (Node.js/Express)
- [ ] Create PUT `/api/ideas/:ideaId` endpoint
- [ ] Add authentication/authorization middleware (verify user is idea owner)
- [ ] Add validation to ensure idea status is "Submitted"
- [ ] Implement update logic in service layer
- [ ] Update idea record in database
- [ ] Handle file replacement (delete old attachment if new one provided)
- [ ] Update Last Updated timestamp
- [ ] Return updated idea object
- [ ] Add request logging and audit trail

### Testing
- [ ] Integration tests for edit endpoint
- [ ] E2E tests for complete edit workflow
- [ ] Test authorization (verify only owner can edit)
- [ ] Test status validation (verify only "Submitted" ideas can be edited)
- [ ] Test file replacement
- [ ] Test form validation
- [ ] Test concurrent edit scenarios

## Technical Notes

### API Endpoint
```
PUT /api/ideas/:ideaId
Authorization: Bearer <jwt_token>
```

### Request Format
```json
{
  "title": "string",
  "description": "string",
  "category": "string",
  "removeAttachment": boolean (optional)
}
```

### Response Format
```json
{
  "success": true,
  "message": "Idea updated successfully",
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "title": "string",
    "description": "string",
    "category": "string",
    "status": "Submitted",
    "createdAt": "2026-02-25T10:00:00Z",
    "updatedAt": "2026-02-25T10:30:00Z"
  }
}
```

### Validation Rules
- Same as STORY-2.1 (title 3-100 chars, description 10-2000 chars, category required)

## Definition of Done
- [ ] Code review completed and approved
- [ ] All unit tests passing (>80% coverage)
- [ ] All integration tests passing
- [ ] All E2E tests passing
- [ ] No console errors or warnings
- [ ] Authorization verified
- [ ] Status validation verified
- [ ] Documentation updated
- [ ] Merged to main branch

---

**Related Stories:**
- [STORY-2.5: Detail Page](STORY-2.5-Detail-Page.md)
