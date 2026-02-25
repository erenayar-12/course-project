# STORY-2.6: Build Idea Edit Page

**Story ID:** STORY-2.6  
**Title:** Edit Submitted Idea with Form Validation and Status Tracking  
**Epic:** EPIC-2 (Idea Submission & Management System)  
**Created:** February 25, 2026  
**Priority:** P1 (High)  
**Estimated Size:** M (Medium - 5 story points)  
**Sprint/Milestone:** Sprint 2  
**Owner:** [Development Team]  
**Status:** READY FOR PLANNING

---

## User Story

**As a** Priya (Idea Submitter)  
**I want** to edit my submitted idea—updating title, description, category, and attachments  
**so that** I can revise my submission based on feedback, correct mistakes, or add additional information before resubmission

### Story Context
After viewing their idea on the detail page (STORY-2.5), users need the ability to edit submitted ideas that are in "Draft" or "Submitted" status. This page provides a pre-filled form that mirrors the submission form (STORY-2.1) but with the user's existing data. The edit page allows users to address evaluator feedback (AC6 from STORY-2.5) and improve their ideas before resubmission. This story bridges the submission flow (STORY-2.1) with detail view (STORY-2.5), creating a complete lifecycle for idea management.

---

## Acceptance Criteria

### AC1: Page Loads with Prefilled Form Data
- **Given** The user is authenticated and navigates to `/ideas/:ideaId/edit` for their own idea in Draft or Submitted status
- **When** The page loads
- **Then** The edit form is displayed with all existing idea data prefilled:
  - Title field contains the current idea title
  - Description textarea contains the full description
  - Category dropdown shows the selected category
  - Attachments section displays current files
- **And** Form fields are fully editable (not read-only)
- **And** A "Loading..." message shows while fetching the idea data

### AC2: Form Validation (Mirrors STORY-2.1)
- **Given** The user is editing idea information
- **When** The user attempts to submit the form
- **Then** Form validation rules apply (matching STORY-2.1):
  - Title: Required, 5-100 characters, no special characters
  - Description: Required, 20-2000 characters
  - Category: Required, must be from predefined list (Technology, Process, Marketing, HR, etc.)
  - At least one attachment must be included (if feature requires it)
- **And** Invalid fields are highlighted with red borders
- **And** Error messages appear below each invalid field
- **And** Submit button is disabled until all fields pass validation

### AC3: Title and Description Editing
- **Given** The edit form is open
- **When** The user modifies the title or description
- **Then** The input value updates in real-time as the user types
- **And** Character count is displayed below textarea (e.g., "1,245 / 2,000 characters")
- **And** Character limit warning appears when near limit (e.g., at 90% capacity, show orange warning)

### AC4: Category Selection (Dropdown with Validation)
- **Given** The edit form is open
- **When** The user clicks the category dropdown
- **Then** All available categories are displayed:
  - Technology
  - Process Improvement
  - Marketing & Branding
  - Human Resources
  - Customer Experience
  - Finance & Operations
  - Other
- **And** Currently selected category is highlighted/checked
- **And** User can click to change selection
- **And** Form marks this field as required

### AC5: Attachment Management
- **Given** The user is editing an idea with existing attachments
- **When** The edit form loads
- **Then** Current attachments are displayed in a "Current Attachments" section:
  - File name, size (human-readable), upload date
  - A delete (X) button next to each attachment to remove it from edit
- **And** User can remove individual attachments without affecting others
- **When** The user clicks the "Add Attachment" button or drag-drops files
- **Then** New files can be added following the same rules as STORY-2.1:
  - Max 5 files per idea
  - Max 10 MB per file
  - Allowed formats: PDF, DOCX, XLSX, JPG, PNG
- **And** Error messages appear if file limit or format restrictions are violated
- **And** Preview of file upload progress (e.g., "Uploading file.pdf (2/5 MB)")

### AC6: Cancel/Back Navigation
- **Given** The user is editing an idea
- **When** The user clicks the "Cancel" or back button
- **Then** The edit form is discarded without saving
- **And** User is redirected to `/ideas/:ideaId` (the idea detail page)
- **And** All unsaved changes are lost (no draft recovery)
- **And** Optional: Show confirmation modal if significant changes exist ("Discard changes?")

### AC7: Submit Changes with Success Feedback
- **Given** The user has filled valid form data
- **When** The user clicks the "Save Changes" button
- **Then** The form data is submitted to `PUT /api/ideas/:ideaId` endpoint
- **And** A "Saving..." loading state is shown on the submit button
- **And** Upon success (200 OK), a success message is displayed:
  - "Idea saved successfully!"
  - Or "Idea updated and resubmitted for review" (if status changes)
- **And** User is redirected to `/ideas/:ideaId` after 2-3 seconds
- **And** The detail page now displays the updated information

### AC8: Error Handling on Submit
- **Given** The user attempts to save changes
- **When** The server returns an error (400, 403, 404, 500)
- **Then** An appropriate error message is displayed:
  - 400: "Some fields are invalid. Please review and try again."
  - 403: "You don't have permission to edit this idea."
  - 404: "Idea not found. It may have been deleted."
  - 500: "Server error. Please try again later."
- **And** The form remains open so user can correct and retry
- **And** The submit button becomes re-enabled for retry
- **And** A "Retry" button is provided alongside the error message

### AC9: Authorization Verification
- **Given** A user navigates to `/ideas/:ideaId/edit`
- **When** The idea belongs to a different user
- **Then** A 403 Forbidden error is shown:
  - "You don't have permission to edit this idea."
  - Back button redirects to `/dashboard`
- **And** The form is not rendered
- **When** The idea is not in Draft or Submitted status (e.g., Under Review, Approved, Rejected)
- **Then** A 403 error is shown:
  - "This idea cannot be edited. Only Draft and Submitted ideas can be modified."
  - Back button redirects to `/ideas/:ideaId`

### AC10: Not Found / Invalid Idea ID
- **Given** The user navigates to `/ideas/:invalidId/edit`
- **When** The idea ID does not exist in the database
- **Then** A 404 error page is displayed:
  - "Idea not found. It may have been deleted."
  - A "Back to Dashboard" button redirects to `/dashboard`

### AC11: Status Tracking and Feedback Display
- **Given** The idea is in "Submitted" status following rejection (from AC6 of STORY-2.5)
- **When** The edit form loads
- **Then** At the top of the form, a feedback section is displayed:
  - "Rejection Feedback:" or "Evaluator Comments:" header
  - Displays the evaluator's comment/reason for rejection (from previous evaluation)
  - Styled as an alert or callout box (read-only)
- **And** A button "Re-submit for Review" is prominently displayed near the submit button
- **When** User edits and submits the form after reviewing feedback
- **Then** The idea status changes back to "Submitted" (ready for re-evaluation)

### AC12: Responsive Design (Mobile/Tablet/Desktop)
- **Given** The user is viewing the edit form on a mobile device
- **When** The page loads
- **Then** Form is rendered responsively:
  - Single column layout on mobile
  - Stacked input fields with appropriate touch targets (min 44x44px)
  - File upload button easily tappable
  - Submit/Cancel buttons are full-width or side-by-side depending on space
- **When** Viewing on tablet or desktop
- **Then** Form renders with appropriate widths and spacing
- **And** Two-column layout possible for attachments and metadata sections

### AC13: Unsaved Changes Detection (Optional - Enhanced UX)
- **Given** The user has made changes to the form
- **When** The user attempts to navigate away without saving
- **Then** A confirmation modal appears:
  - "You have unsaved changes. Do you want to discard them?"
  - "Cancel" keeps the user on the form
  - "Discard" navigates away without saving
- **And** This applies to back button, navigation links, and page close

---

## Definition of Acceptance

All acceptance criteria must pass automated tests and be verified by QA:

- [ ] All acceptance criteria verified and passing
- [ ] Form validation matches STORY-2.1 implementation
- [ ] API integration (PUT /api/ideas/:ideaId) working correctly
- [ ] Authorization checks prevent editing of others' ideas or published ideas
- [ ] Error states display appropriate messages
- [ ] Mobile responsiveness tested on multiple device sizes
- [ ] Unit tests written for form validation logic
- [ ] Integration tests for API calls and state management
- [ ] No new warnings or errors in code quality tools
- [ ] Accessibility: Form labels, ARIA attributes, keyboard navigation
- [ ] Performance: Form loads and submits in <2 seconds
- [ ] Documentation updated (if needed)

---

## Technical Notes

### Implementation Hints
- **Component Structure:**
  ```
  IdeaEditPage.tsx (container)
    ├── IdeaEditForm.tsx (reusable form, also used in STORY-2.1)
    ├── AttachmentManager.tsx (add/remove attachments)
    ├── RejectionFeedbackAlert.tsx (display feedback if rejected)
    └── FormErrorDisplay.tsx (validation errors)
  ```

- **State Management:** Use React hooks (useState, useEffect) or context for:
  - Form data (title, description, category)
  - Attachments (current and new)
  - Loading/error states
  - Form dirty state (for unsaved changes detection)

- **API Integration:**
  - Fetch existing idea: `GET /api/ideas/:ideaId`
  - Submit changes: `PUT /api/ideas/:ideaId` with form data + file uploads
  - Handle multipart/form-data for file uploads

- **Form Validation:** Reuse validation from STORY-2.1 via shared utility functions:
  ```typescript
  // In src/utils/validation.ts
  export const validateTitle = (title: string) => { }
  export const validateDescription = (desc: string) => { }
  export const validateCategory = (cat: string) => { }
  export const validateAttachments = (files: File[]) => { }
  ```

- **Components to Create/Modify:**
  - ✅ New: `src/pages/IdeaEditPage.tsx`
  - ✅ Modify: `src/services/ideas.service.ts` – add `updateIdea(ideaId, data)` method
  - ✅ Reuse: `IdeaEditForm.tsx` from STORY-2.1 (make generic)
  - ✅ New: `src/components/RejectionFeedbackAlert.tsx`

- **File Upload Handling:**
  - Use FormData API to send files with other form data
  - Show progress indicator during upload
  - Handle file size validation on client-side
  - Graceful error handling for upload failures

### Technology Stack
- **Frontend:** React 18, TypeScript, Tailwind CSS
- **API:** Express.js REST endpoint (PUT /api/ideas/:ideaId)
- **File Handling:** FormData API, Multer (backend)
- **Validation:** Zod or custom validators (matching STORY-2.1)
- **Testing:** Jest + React Testing Library

### Files/Components Affected
- ✅ New: `src/pages/IdeaEditPage.tsx`
- ✅ New: `src/components/RejectionFeedbackAlert.tsx`
- 🔄 Modify: `src/services/ideas.service.ts` – add `updateIdea()` method
- 🔄 Reuse: `IdeaEditForm.tsx` or `IdeaSubmissionForm.tsx` from STORY-2.1
- 📝 Modify: `src/App.tsx` – add route `/ideas/:ideaId/edit`
- 🧪 New: `src/pages/__tests__/IdeaEditPage.test.tsx`
- 🧪 New: `src/components/__tests__/RejectionFeedbackAlert.test.tsx`

### Known Limitations or Considerations

1. **Draft vs. Submitted Status:**
   - Draft ideas can be edited and re-saved as drafts (not submitted yet)
   - Submitted ideas can be edited and resubmitted for evaluation
   - Consider whether resubmission changes status back to "Submitted" or "Under Review"
   - *Clarification needed from PO*

2. **Attachment Replacement:**
   - Should editing remove old attachments and require re-upload, or keep existing?
   - Current design: Keep existing, allow adding/removing as needed
   - *Confirm with UX/PO*

3. **Evaluator Feedback Persistence:**
   - Feedback only shown if previously rejected
   - Feedback persists after re-edit for context
   - *Confirm feedback visibility rules*

4. **Concurrent Edit Conflicts:**
   - No optimistic locking implemented in MVP
   - If two users edit simultaneously, last write wins
   - Future enhancement: Implement version conflicts handling
   - *Consider for Phase 2*

5. **Mobile File Upload:**
   - Mobile camera/gallery access may require special handling
   - Test on real devices if camera upload planned
   - *Defer to Phase 2 if not MVP*

---

## Dependencies

### Blocks This Story
None - can start immediately

### Depends On
- ✅ STORY-1.2 (Auth & Protected Routes)
- ✅ STORY-2.1 (Submission Form & Validation) – reuse form structure
- ✅ STORY-2.5 (Detail Page) – users navigate from detail page to edit

### Enables Future Stories
- ⏳ STORY-2.7 (Evaluator Dashboard) – reviewers can see edited submissions
- ⏳ STORY-3.1 (Idea Versioning) – track multiple revisions of ideas

---

## Clarifications Needed

Before starting implementation, confirm:

1. **Edit Status Behavior:** When a "Submitted" idea is re-edited and saved, should:
   - Option A: Stay as "Submitted" (default, awaiting re-review)
   - Option B: Change to "Draft" (user can edit/revise before final submission)
   - Option C: Change to a new state like "Revision Submitted" (explicit re-evaluation request)
   - **Recommendation:** Option A (stay "Submitted")

2. **Attachment Behavior:** When editing, should attachments:
   - Option A: Keep existing + add new (current design)
   - Option B: Replace all (user removes and re-uploads)
   - Option C: Don't allow changes (only edit text fields)
   - **Recommendation:** Option A (most flexible)

3. **Evaluator Feedback Visibility:** After rejection, when editing, should we:
   - Option A: Show feedback in edit form as reminder
   - Option B: Show feedback only on detail page, not edit page
   - Option C: Let user dismiss feedback after reading
   - **Recommendation:** Option A (help user address feedback)

4. **Save as Draft vs. Submit:** Should there be two buttons:
   - "Save as Draft" (don't resubmit yet)
   - "Submit for Review" (finalize and resubmit)
   - Or just one "Save Changes" button?
   - **Recommendation:** Single "Save Changes" button for MVP

5. **Unsaved Changes Warning:** Should we implement optional AC13:
   - Show warning modal when leaving with unsaved changes?
   - Or let user leave freely?
   - **Recommendation:** Implement for better UX

---

## Testing Strategy

### Unit Tests (Jest)
- [ ] Form validation logic (title, description, category)
- [ ] File attachment validation (size, format, count)
- [ ] Error message display based on API response codes
- [ ] Character counter updates in real-time
- [ ] Form reset after successful submission

### Integration Tests (Jest + React Testing Library)
- [ ] Load idea data into form fields
- [ ] Edit and resubmit idea successfully
- [ ] Display rejection feedback from previous evaluation
- [ ] Authorization: Prevent editing of others' ideas
- [ ] Authorization: Prevent editing of non-editable statuses
- [ ] File upload and removal in attachments section
- [ ] Form validation prevents submission of invalid data
- [ ] Error recovery (retry after API failure)

### E2E Tests (Cypress)
- [ ] Navigate from detail page → edit page → save → back to detail
- [ ] Edit idea with new title, description, attachments
- [ ] Verify updated idea displays on detail page
- [ ] Test 403/404 error scenarios
- [ ] Mobile responsive layout verification
- [ ] Form validation prevents submission
- [ ] File upload progress and completion

### Manual QA Checklist
- [ ] Form loads with correct prefilled data
- [ ] All validation rules working as specified
- [ ] File upload/removal working correctly
- [ ] Rejection feedback displays when applicable
- [ ] Success message and redirect working
- [ ] Error messages appropriate and helpful
- [ ] Mobile layout responsive and usable
- [ ] Accessibility: Tab navigation, screen reader, keyboard-only usage

---

## Future Enhancements (Post-MVP)

1. **Rich Text Editor:** Support markdown or rich text formatting for descriptions
2. **Draft Auto-save:** Automatically save form state every 30 seconds
3. **Idea Versioning:** Track all versions/edits for audit trail
4. **Collaborative Editing:** Multiple team members can co-edit ideas
5. **Change Log:** Show what changed between versions
6. **Template Suggestions:** AI-powered suggestions to improve idea description
7. **Multi-language Support:** Edit in different languages
8. **Bulk Edit:** Edit multiple ideas at once
9. **Schedule Resubmission:** Set date to auto-resubmit after edits
10. **Attachment Versioning:** Track old vs. new attachment versions

---

## References

- **STORY-2.1:** Build Idea Submission Form with File Upload
- **STORY-2.5:** Build Idea Detail Page with View/Edit/Delete
- **STORY-2.4:** Build Dashboard with Filtering and Sorting
- **Design System:** [Link to design system/Figma]
- **API Specification:** `/docs/api/ideas.md`
- **Agents.md:** Project conventions and standards

---

## Sign-Off

- [ ] Product Owner approval
- [ ] Design/UX review
- [ ] Architecture review
- [ ] Security review (file uploads, authorization)
- [ ] Ready for implementation

---

**Status:** READY FOR PLANNING  
**Last Updated:** February 25, 2026  
**Next Step:** Create implementation plan and break down into technical tasks
