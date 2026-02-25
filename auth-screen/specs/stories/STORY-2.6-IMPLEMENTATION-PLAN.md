# STORY-2.6 Implementation Plan

**Document:** Implementation Plan  
**Story ID:** STORY-2.6  
**Story Title:** Idea Edit Page  
**Epic:** EPIC-2 (Idea Submission & Management System)  
**Created:** February 25, 2026  
**Status:** READY FOR IMPLEMENTATION  
**Owner:** [Development Team]  
**Estimated Duration:** 3-4 days (8 story points)

---

## Executive Summary

STORY-2.6 implements the edit page for ideas, allowing users to modify titles, descriptions, categories, and attachments. Users can edit Draft, Submitted, and Rejected ideas. This plan breaks down implementation into 3 phases over 3-4 days with clear deliverables and testing checkpoints.

**Key Outcomes:**
- IdeaEditPage component with prefilled form data
- Reusable IdeaForm component (create/edit mode)
- Real-time form validation with character counts
- Responsive design (mobile/tablet/desktop)
- Attachment management (keep existing + add new)
- Error handling (403, 404, 500)
- Unsaved changes detection
- File upload progress display
- ≥80% test coverage
- E2E tests for primary workflows

**Decision Baseline:** All 10 clarification questions resolved in STORY-2.6-CLARIFICATION.md

---

## Project Structure & Deliverables

### Phase 1: Frontend Foundation (Day 1)
**Goal:** Create form components, routing, and data fetching  
**Owner:** Frontend Developer  
**Expected Story Points:** 3

#### Phase 1 Deliverables

| Deliverable | File | Status | Notes |
|-------------|------|--------|-------|
| Reusable IdeaForm Component | `src/components/IdeaForm/IdeaForm.tsx` | NEW | Mode prop for create/edit |
| Create Mode UI | `src/components/IdeaForm/CreateMode.tsx` | NEW | Empty form for new ideas |
| Edit Mode UI | `src/components/IdeaForm/EditMode.tsx` | NEW | Prefill + rejection feedback |
| Form Fields Component | `src/components/IdeaForm/FormFields.tsx` | NEW | Title, Description, Category |
| Attachments Section | `src/components/IdeaForm/AttachmentsSection.tsx` | REUSE/ENHANCE | File upload + existing files |
| Rejection Feedback | `src/components/RejectionFeedbackAlert.tsx` | REUSE | From STORY-2.5 |
| IdeaEditPage | `src/pages/IdeaEditPage.tsx` | NEW | Main edit page component |
| Route Setup | `src/App.tsx` | MODIFY | Add /ideas/:ideaId/edit route |
| Validation Utils | `src/utils/ideaValidation.ts` | NEW/REUSE | Shared from STORY-2.1 |
| Types Update | `src/types/ideaTypes.ts` | MODIFY | Add edit form types |
| Unit Tests | `src/components/IdeaForm/__tests__/IdeaForm.test.tsx` | NEW | ≥80% coverage |
| | `src/pages/__tests__/IdeaEditPage.test.tsx` | NEW | ≥80% coverage |

#### Phase 1 Tasks

**Task P1.1: Create Reusable IdeaForm Component**
- File: `src/components/IdeaForm/IdeaForm.tsx`
- Type: Functional component with TypeScript interface
- Props interface `IdeaFormProps`:
  ```typescript
  interface IdeaFormProps {
    mode: 'create' | 'edit';
    ideaId?: string;
    initialData?: Partial<Idea>;
    onSubmit?: (data: FormData) => Promise<void>;
    onCancel?: () => void;
    onSuccess?: (ideaId: string) => void;
    loading?: boolean;
  }
  ```
- Features:
  - Conditional rendering based on mode prop
  - Prefill form when mode='edit' and initialData provided
  - Show RejectionFeedbackAlert in edit mode if idea rejected
  - Form state management (title, description, category, files)
  - Real-time validation as user types
  - Dirty state tracking for unsaved changes detection
- Styling: Tailwind CSS with responsive breakpoints
- Accessibility: Form labels, ARIA attributes, error associations
- Effort: 3-4 hours
- Checklist:
  - [ ] Component accepts mode prop and renders differently
  - [ ] Create mode shows empty form
  - [ ] Edit mode prefills all fields
  - [ ] Form submission calls onSuccess with ideaId
  - [ ] Cancel button calls onCancel
  - [ ] Loading state disables form during submission

**Task P1.2: Create FormFields Sub-Component**
- File: `src/components/IdeaForm/FormFields.tsx`
- Type: Reusable field component for title, description, category
- Fields:
  1. **Title Input:**
     - Type: text input
     - Validation: 5-100 characters (from STORY-2.1)
     - Real-time error display
     - Character counter: "45 / 100"
  2. **Description Textarea:**
     - Type: textarea
     - Validation: 20-2000 characters (from STORY-2.1)
     - Real-time character count: "320 / 2000"
     - Auto-height growing textarea
  3. **Category Dropdown:**
     - Type: Select (dropdown)
     - Options: Technology, Health, Education, Environment, Business, Culture, Other
     - Validation on blur
     - Default: "Select a category" placeholder

- Features:
  - Real-time character display
  - Color-coded validation (red=error, yellow=warning, green=valid)
  - Focus states for accessibility
  - Responsive sizing
- Effort: 2-3 hours
- Checklist:
  - [ ] Title field validates input length
  - [ ] Description field shows live character count
  - [ ] Category dropdown opens/closes
  - [ ] Error messages display correctly
  - [ ] Field values update on change

**Task P1.3: Create Attachments Section Component**
- File: `src/components/IdeaForm/AttachmentsSection.tsx` (enhance STORY-2.5 version)
- Features:
  1. **Current Attachments (edit mode only):**
     - List of existing files with delete buttons
     - Show filename, size, upload date
     - Delete removes from list
  2. **Add New Files:**
     - File input (multiple files)
     - Drag-and-drop support
     - File preview before submit
     - Max 5 files total enforcement
     - Max 10MB per file validation
  3. **Upload Progress:**
     - Per-file progress bars
     - Show "Uploading file.pdf (45%)" during upload
     - Show checkmark when complete
     - Error state with "Retry" button
  4. **Allowed File Types:**
     - Images: .jpg, .png, .gif
     - Documents: .pdf, .doc, .docx
     - Spreadsheets: .xls, .xlsx
- Props: `currentAttachments`, `onAddFiles`, `onRemoveFile`, `mode`
- Effort: 4-5 hours
- Checklist:
  - [ ] Displays existing attachments in edit mode
  - [ ] File picker opens and allows multiple selection
  - [ ] Drag-and-drop adds files to list
  - [ ] File size validation (10MB max)
  - [ ] Total file count validation (max 5)
  - [ ] Preview shows before submit
  - [ ] Error state displays for invalid files

**Task P1.4: Create IdeaEditPage Component**
- File: `src/pages/IdeaEditPage.tsx`
- Type: Main page component for /ideas/:ideaId/edit
- Features:
  - Extract ideaId from URL params
  - Fetch idea data on mount
  - Authorization check (user owns idea, is editable status)
  - Show loading skeleton while fetching
  - Show 404 if idea not found
  - Show 403 if user not authorized
  - Render IdeaForm in edit mode with prefilled data
  - Handle form submission (call API, show success, navigate back)
  - Handle errors (API errors show in alert, allow retry)
- State:
  ```typescript
  const [idea, setIdea] = useState<Idea | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FetchError | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  ```
- Error handling:
  - 401: "Your session expired. Please log in."
  - 403: "You don't have permission to edit this idea."
  - 404: "Idea not found. It may have been deleted."
  - 5xx: "Something went wrong. Please try again."
- Effort: 3-4 hours
- Checklist:
  - [ ] Loads idea data from API on mount
  - [ ] Shows loading skeleton while fetching
  - [ ] Shows 404 page if idea not found
  - [ ] Shows 403 if not authorized
  - [ ] Renders IdeaForm with prefilled data
  - [ ] Form submission calls API
  - [ ] Success navigates back to detail page
  - [ ] Errors display in alert

**Task P1.5: Add Edit Route to App Router**
- File: `src/App.tsx`
- Changes:
  - Add new route: `/ideas/:ideaId/edit`
  - Protected route (user must be authenticated)
  - Uses IdeaEditPage component
  - Route definition:
    ```typescript
    <Route 
      path="/ideas/:ideaId/edit" 
      element={
        <ProtectedRoute>
          <IdeaEditPage />
        </ProtectedRoute>
      } 
    />
    ```
- Effort: 1 hour
- Checklist:
  - [ ] Route renders IdeaEditPage
  - [ ] Route requires authentication
  - [ ] URL params passed to component
  - [ ] Navigation from detail page works

**Task P1.6: Add Edit Link to Detail Page**
- File: `src/pages/IdeaDetailPage.tsx` (modify existing)
- Changes:
  - Add "Edit" button in top-right (if user is owner and idea is editable)
  - Button styling: secondary style, next to actions
  - Link to `/ideas/:ideaId/edit`
  - Show only if:
    - Current user is idea creator
    - Idea status is Draft, Submitted, or Rejected
  - Effort: 1 hour
- Checklist:
  - [ ] Edit button shows for owned editable ideas
  - [ ] Edit button hidden for others' ideas or approved/review ideas
  - [ ] Link navigates to edit page
  - [ ] Button styling matches design system

**Task P1.7: Implement Unsaved Changes Detection**
- File: `src/components/IdeaForm/IdeaForm.tsx` (integrate into form)
- Features:
  - Track form dirty state (changes from initial)
  - Show browser beforeunload warning if leaving with unsaved changes
  - Show React Router blocker modal if navigating to another page
  - "Discard Changes?" modal with options: Cancel, Discard
- Implementation:
  ```typescript
  // Track dirty state
  const [isDirty, setIsDirty] = useState(false);
  
  // Browser unload handler
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);
  
  // React Router blocker
  const unblock = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isDirty && currentLocation.pathname !== nextLocation.pathname
  );
  ```
- Effort: 2-3 hours
- Checklist:
  - [ ] Browser shows warning on tab close with unsaved changes
  - [ ] Modal shows on page navigation with unsaved changes
  - [ ] Cancel button stays on form
  - [ ] Discard button clears changes and navigates

**Task P1.8: Write Frontend Unit Tests**
- Files:
  - `src/components/IdeaForm/__tests__/IdeaForm.test.tsx`
  - `src/components/IdeaForm/__tests__/FormFields.test.tsx`
  - `src/components/IdeaForm/__tests__/AttachmentsSection.test.tsx`
  - `src/pages/__tests__/IdeaEditPage.test.tsx`
- Coverage Target: ≥80%
- Tests to write:
  - Create mode: empty form renders
  - Edit mode: form prefilled with data
  - Validation: errors show for invalid input
  - Character count: updates as user types
  - Submission: calls API, shows success
  - Errors: displays error messages
  - Authorization: 403 shown for non-owners
  - Not found: 404 shown for deleted ideas
  - Attachments: add/remove files works
  - Unsaved changes: warning shows on leave
- Testing library: React Testing Library + Jest
- Effort: 4-5 hours
- Checklist:
  - [ ] All components have ≥80% coverage
  - [ ] Tests pass locally
  - [ ] No console errors/warnings in tests
  - [ ] Mock API calls properly

**Phase 1 Effort Estimate:** 21-28 hours (1 day)

---

### Phase 2: Backend API & Validation (Day 2)
**Goal:** Implement update API endpoint with authorization  
**Owner:** Backend Developer  
**Expected Story Points:** 3

#### Phase 2 Deliverables

| Deliverable | File | Status | Notes |
|-------------|------|--------|-------|
| Update Idea Endpoint | `backend/src/routes/ideas.ts` | MODIFY | Add PUT /ideas/:ideaId |
| Ideas Service Update | `backend/src/services/ideaService.ts` | MODIFY | updateIdea method |
| File Upload Handler | `backend/src/middleware/fileUpload.ts` | MODIFY | Multipart/form-data handling |
| Authorization Middleware | `backend/src/middleware/auth.ts` | VERIFY | Check idea ownership |
| Validation Schema | `backend/src/validators/ideaValidator.ts` | MODIFY | Update validation |
| Database Schema | `backend/prisma/schema.prisma` | VERIFY | Check updated_at field |
| Backend Unit Tests | `backend/src/routes/__tests__/ideas.update.test.ts` | NEW | ≥80% coverage |
| Integration Tests | `backend/src/integration/__tests__/idea-edit.test.ts` | NEW | API + DB + Auth |

#### Phase 2 Tasks

**Task P2.1: Implement PUT /api/ideas/:ideaId Endpoint**
- Route: `PUT /api/ideas/:ideaId`
- Middleware: Authenticate user
- Request body: Multipart form-data
  ```
  Form Fields:
  - title (string, required)
  - description (string, required)
  - category (string, required)
  - attachments[] (files, max 5 total with existing)
  - existingAttachmentIds[] (array of IDs to keep)
  ```
- Validation:
  - User authenticated (401 if not)
  - User is idea creator (403 if not)
  - Idea status is Draft, Submitted, or Rejected (403 if not)
  - Title: 5-100 characters (validation error if not)
  - Description: 20-2000 characters (validation error if not)
  - Category: one of 7 valid categories (validation error if not)
  - Attachments: max 5 total, max 10MB each (validation error if not)
- Response (200 OK):
  ```json
  {
    "id": "idea-123",
    "title": "Updated Title",
    "description": "Updated description...",
    "category": "Technology",
    "status": "Submitted",
    "attachments": [
      {"id": "att-1", "filename": "doc.pdf", "size": 2048, "url": "..."}
    ],
    "updated_at": "2026-02-25T10:30:00Z"
  }
  ```
- Error responses:
  - 400 Bad Request: Validation error with field errors
  - 401 Unauthorized: User not authenticated
  - 403 Forbidden: Not idea owner OR idea status not editable
  - 404 Not Found: Idea doesn't exist
  - 500 Server Error: Internal error
- Effort: 3-4 hours
- Checklist:
  - [ ] Route accepts PUT requests to /api/ideas/:ideaId
  - [ ] Validates user authenticated
  - [ ] Validates user owns idea
  - [ ] Validates idea status is editable
  - [ ] Validates form data (title, description, category)
  - [ ] Validates attachments (count, size)
  - [ ] Updates idea in database
  - [ ] Returns updated idea data
  - [ ] Returns correct error responses

**Task P2.2: Implement updateIdea Service Method**
- File: `backend/src/services/ideaService.ts`
- Method signature:
  ```typescript
  async updateIdea(
    ideaId: string,
    userId: string,
    updates: {
      title: string;
      description: string;
      category: string;
      attachments: File[];
      existingAttachmentIds: string[];
    }
  ): Promise<Idea>
  ```
- Logic:
  1. Query idea by ID
  2. Check idea exists (throw 404)
  3. Check user is creator (throw 403)
  4. Check idea status is editable (throw 403)
  5. Validate inputs (title, description, category, attachments)
  6. Upload new files to storage (S3 or local)
  7. Delete removed attachments from storage
  8. Update idea in database:
     - Set title, description, category
     - Update attachments array (keep existing + add new)
     - Set updated_at timestamp
     - Status stays same (Submitted stays Submitted)
  9. Return updated idea
- Error handling: Throw specific errors (404, 403, 400)
- Effort: 3-4 hours
- Checklist:
  - [ ] Updates all idea fields
  - [ ] Keeps existing attachments marked for keeping
  - [ ] Uploads new files
  - [ ] Deletes removed attachments
  - [ ] Updates timestamp
  - [ ] Throws correct errors
  - [ ] Returns updated idea object

**Task P2.3: Enhance File Upload Middleware**
- File: `backend/src/middleware/fileUpload.ts`
- Features:
  - Support multipart/form-data parsing
  - Handle multiple files in "attachments" field
  - Limit max 5 files per request
  - Limit max 10MB per file
  - Limit total 50MB per request
  - Create temporary folder for uploads during request
  - Clean up temp files on error
  - Return file objects with metadata (filename, size, mimetype)
- Middleware logic:
  ```typescript
  export const uploadAttachments = multer({
    storage: multer.memoryStorage(),
    limits: {
      files: 5,
      fileSize: 10 * 1024 * 1024, // 10MB
      parts: 50,
      fieldNameSize: 100,
      fieldSize: 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
      const allowedMimes = [...];
      if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error(`File type not allowed: ${file.mimetype}`));
      }
    },
  });
  ```
- Effort: 2-3 hours
- Checklist:
  - [ ] Accepts multipart form-data
  - [ ] Handles multiple files in "attachments" field
  - [ ] Enforces file size limits
  - [ ] Rejects invalid file types
  - [ ] Returns file metadata (name, size, type)

**Task P2.4: Implement File Storage & Cleanup**
- Features:
  - Store uploaded files to cloud storage (S3) or local filesystem
  - Generate public URLs for accessing files
  - Delete files when removing attachments
  - Track file locations in database
- Storage service interface:
  ```typescript
  interface FileStorage {
    upload(file: Express.Multer.File, ideaId: string): Promise<{url: string, key: string}>;
    delete(fileKey: string): Promise<void>;
  }
  ```
- Options:
  - Option A: Local filesystem (`backend/uploads/`)
  - Option B: AWS S3 (production)
  - MVP: Use local filesystem for simplicity
- Effort: 2-3 hours
- Checklist:
  - [ ] Files uploaded to storage location
  - [ ] File URLs stored in database
  - [ ] Files can be deleted
  - [ ] Attempted cleanup on error
  - [ ] Public URLs work to download files

**Task P2.5: Add Authorization Checks**
- File: `backend/src/middleware/auth.ts` + endpoint
- Checks for PUT /api/ideas/:ideaId:
  1. User authenticated: JWT token valid (401)
  2. User is idea owner: idea.creator_id == req.user.id (403)
  3. Idea status editable: status in [Draft, Submitted, Rejected] (403)
  4. Idea not locked: evaluation_locked == false (403)
- Error messages:
  - 401: "Unauthorized. Please log in."
  - 403 (owner): "You don't have permission to edit this idea."
  - 403 (status): "This idea cannot be edited. Only Draft and Submitted ideas can be modified."
  - 403 (locked): "This idea is under review and cannot be modified."
- Effort: 1-2 hours
- Checklist:
  - [ ] Validates JWT token
  - [ ] Checks idea owner
  - [ ] Checks idea status
  - [ ] Returns correct 403 messages
  - [ ] Rejects unauthorized requests

**Task P2.6: Update Validation Schema**
- File: `backend/src/validators/ideaValidator.ts`
- Schema for idea update:
  ```typescript
  const updateIdeaSchema = z.object({
    title: z.string().min(5).max(100),
    description: z.string().min(20).max(2000),
    category: z.enum(['Technology', 'Health', 'Education', 'Environment', 'Business', 'Culture', 'Other']),
    // attachments: handled separately (files)
  });
  ```
- Validation middleware usage:
  ```typescript
  app.put('/api/ideas/:ideaId', authenticate, validateBody(updateIdeaSchema), updateIdea);
  ```
- Effort: 1 hour
- Checklist:
  - [ ] Schema validates title length
  - [ ] Schema validates description length
  - [ ] Schema validates category enum
  - [ ] Validation errors return 400 with field errors

**Task P2.7: Verify Database Schema**
- File: `backend/prisma/schema.prisma`
- Check fields exist:
  - `id` (unique)
  - `creator_id` (foreign key to users)
  - `title`
  - `description`
  - `category`
  - `status` (enum)
  - `attachments` (JSON or separate table)
  - `created_at` (timestamp)
  - `updated_at` (timestamp)
  - `rejection_feedback` (optional string)
  - `evaluation_locked` (boolean, optional)
- If any missing: Add to schema
- If using JSON for attachments: Ensure valid JSON structure
- Effort: 1 hour
- Checklist:
  - [ ] All required fields exist in schema
  - [ ] Timestamps are DateTime with auto defaults
  - [ ] attachments field properly structured
  - [ ] Relationships (creator_id -> users) exist
  - [ ] Migrations applied (if schema changed)

**Task P2.8: Write Backend Tests**
- Files:
  - `backend/src/routes/__tests__/ideas.update.test.ts`
  - `backend/src/services/__tests__/ideaService.update.test.ts`
  - `backend/src/integration/__tests__/idea-edit.integration.test.ts`
- Coverage Target: ≥80%
- Tests to write:
  - Successful update: returns 200 with updated idea
  - Validation error (title too short): returns 400
  - Not authenticated: returns 401
  - Not idea owner: returns 403
  - Idea status not editable: returns 403
  - Idea not found: returns 404
  - File upload: saves files, returns URLs
  - File size limit: rejects > 10MB
  - Max files: rejects > 5 files
  - Attachment removal: deletes from storage
  - Authorization checks work correctly
- Testing: Jest + supertest for HTTP testing
- Effort: 4-5 hours
- Checklist:
  - [ ] All endpoints tested
  - [ ] All error cases covered
  - [ ] Authorization tested
  - [ ] File uploads tested
  - [ ] Coverage ≥80%
  - [ ] Tests pass locally

**Phase 2 Effort Estimate:** 18-23 hours (1 day)

---

### Phase 3: Polish, Testing & Deployment (Day 3)
**Goal:** Error handling, UI polish, responsive design, E2E tests, deploy  
**Owner:** Full Stack Team  
**Expected Story Points:** 2

#### Phase 3 Deliverables

| Deliverable | File | Status | Notes |
|-------------|------|--------|-------|
| Error Handling Enhancement | `src/pages/IdeaEditPage.tsx` | MODIFY | Add retry logic, better UX |
| Responsive Design | `src/components/IdeaForm/` | MODIFY | Mobile/tablet/desktop polish |
| Loading States | `src/components/IdeaForm/` | ENHANCE | Skeleton, spinner, progress |
| Success Feedback | `src/services/` + components | ADD | Toast notifications, redirects |
| Form Validation Enhancements | `src/components/IdeaForm/` | ENHANCE | Real-time UX improvements |
| E2E Tests | `cypress/e2e/idea-edit.cy.ts` | NEW | Create, Edit, Delete workflows |
| Integration Tests | `cypress/e2e/` | NEW | Error scenarios, auth flows |
| Documentation | `STORY-2.6-IMPLEMENTATION-COMPLETE.md` | NEW | Implementation summary |
| Git Cleanup | Various | CLEANUP | Rebase, squash commits |

#### Phase 3 Tasks

**Task P3.1: Enhance Error Handling & Recovery**
- File: `src/pages/IdeaEditPage.tsx` + components
- Features:
  1. **Contextual Error Messages:**
     - 401: "Your session expired. Log in again." + "Go to Login" button
     - 403: "You don't have permission to edit this idea." + "Go to Detail" button
     - 404: "Idea not found or deleted." + "Go to My Ideas" button
     - 400: Show field-specific errors in form
     - 5xx: "Something went wrong. Try again?" + "Retry" button
  2. **Retry Mechanism:**
     - "Retry" button for failed operations
     - Maintains form state on retry
     - Max 3 retries before requiring action
  3. **Error Alert Styling:**
     - Prominent display at top of form
     - Different colors for different error types
     - Actionable buttons for recovery
  4. **Network Error Handling:**
     - Detect network failures vs server errors
     - Show offline indicator if no network
     - Queue changes and retry on reconnect (future)
- Effort: 3-4 hours
- Checklist:
  - [ ] Error messages contextual and helpful
  - [ ] Retry button works for transient errors
  - [ ] Form state preserved on error
  - [ ] Recovery paths clear (buttons to log in, go back, etc.)

**Task P3.2: Polish Form UI & Interactions**
- File: `src/components/IdeaForm/` components
- Improvements:
  1. **Title Field:**
     - Better placeholder text
     - Auto-focus on page load
     - Keyboard: Tab moves to next field
  2. **Description Field:**
     - Growing textarea that expands with content
     - Placeholder text: "Describe your idea in detail..."
     - Line counter updated on every keystroke
     - Visual feedback at 80% capacity (yellow), 100% (red)
  3. **Category Dropdown:**
     - Icons for categories (optional)
     - Better visual hierarchy
     - Scroll support if many options
  4. **Attachments Section:**
     - Drag-and-drop visual feedback (highlight on drag)
     - File preview images (thumbnails for images)
     - File type icons for non-images
     - Better spacing and visual grouping
  5. **Form Buttons:**
     - Primary: "Save Changes" (blue)
     - Secondary: "Cancel" (gray)
     - Better touch targets (44x44px minimum)
     - Loading state: "Saving..." with spinner
     - Success state: "✓ Saved" (brief flash)
  6. **Keyboard Support:**
     - Tab through all fields
     - Enter submits form (in certain contexts)
     - Escape cancels (with unsaved warning)
- Styling: Consistent with design system, use Tailwind classes
- Effort: 3-4 hours
- Checklist:
  - [ ] Title field autofocused
  - [ ] Description textarea grows
  - [ ] Category dropdown styled nicely
  - [ ] File upload drag-and-drop visible feedback
  - [ ] Buttons have loading states
  - [ ] Touch targets ≥44x44px
  - [ ] Keyboard navigation works

**Task P3.3: Implement Responsive Design (Mobile/Tablet/Desktop)**
- Files: All form components
- Breakpoints:
  - Mobile (< 640px): Single column, stacked buttons
  - Tablet (640-1024px): Better spacing, 2 column for some fields
  - Desktop (> 1024px): Full responsive layout, optimal spacing
- Mobile improvements:
  - Full-width form fields
  - Buttons span full width in column layout
  - Proper form field spacing (touch-friendly)
  - Modal-like overlay on small screens (optional)
  - File upload simplified UI for mobile
- Changes: Use Tailwind responsive classes (sm:, md:, lg:)
- Effort: 2-3 hours
- Checklist:
  - [ ] Form renders correctly on mobile (< 640px)
  - [ ] Form renders correctly on tablet (640-1024px)
  - [ ] Form renders correctly on desktop (> 1024px)
  - [ ] Touch targets ≥44x44px on mobile
  - [ ] Text sizes readable on mobile
  - [ ] Buttons clickable and properly spaced

**Task P3.4: Enhance Loading & Success States**
- File: `src/pages/IdeaEditPage.tsx` + form components
- Features:
  1. **Loading Skeleton:**
     - Show while fetching idea data
     - Structured like form (title field, description field, category field, attachments)
     - Shimmer animation optional
     - Better than blank page
  2. **Form Submission Loading:**
     - Disable all form fields during submission
     - Show "Saving..." text on button
     - Display progress if file upload taking time
     - Prevent double-submit
  3. **Success Feedback:**
     - Toast notification: "Idea updated successfully"
     - Brief success state on button: "✓ Saved"
     - Auto-navigate to detail page (after 1 second)
  4. **File Upload Progress:**
     - Show progress bar for each file
     - Display "Uploading file.pdf (45%)"
     - Show checkmark when complete
     - Overall progress: "3 of 5 files complete"
- Components: Reuse existing spinners, toasts, progress bars
- Effort: 2-3 hours
- Checklist:
  - [ ] Skeleton loads visible while fetching
  - [ ] Form disabled loading feedback during submit
  - [ ] Toast shows success message
  - [ ] File upload progress visible
  - [ ] Auto-navigate to detail page on success

**Task P3.5: Enhance Form Validation UX**
- File: `src/components/IdeaForm/` components
- Improvements:
  1. **Real-time Feedback:**
     - Title: Show "✓ Title valid" or "✗ Too short" as user types
     - Description: Show live character count with color coding
     - Category: Show required indicator initially, error on blur if empty
  2. **Field-level Errors:**
     - Inline error text below each field
     - Error color (red) for invalid fields
     - Warning color (yellow) for near-limit fields
  3. **Form-level Validation:**
     - Check all fields before enabling submit button
     - Show validation summary at top if multiple errors
     - Clear errors when field becomes valid
  4. **Character Limit UX:**
     - Show counter always (not just on focus)
     - Color at 0-80%: gray
     - Color at 80-100%: yellow (warning)
     - Color at 100%: red (disabled input)
- Effort: 2-3 hours
- Checklist:
  - [ ] Real-time validation feedback shows
  - [ ] Errors display inline in fields
  - [ ] Character counts update live
  - [ ] Submit button disabled if invalid
  - [ ] Success/error colors consistent

**Task P3.6: Write E2E Tests (Cypress)**
- File: `cypress/e2e/idea-edit.cy.ts`
- Test Scenarios:
  1. **Edit Flow (Happy Path):**
     - Login
     - Navigate to My Ideas
     - Click Edit on an idea
     - Update title and description
     - Add new attachment
     - Click Save
     - Verify idea updated on detail page
  2. **Validation:**
     - Try to save with title too short → error
     - Try to save with empty description → error
     - Try to upload file > 10MB → error
     - Try to upload > 5 files → error
  3. **Authorization:**
     - Logged-in user edits own idea → allowed
     - Logged-in user tries to edit other's idea → 403 error
     - Unauthenticated user tries to access edit page → redirects to login
  4. **Error Handling:**
     - Server returns 500 → error displayed
     - Network error → offline message
     - 404 not found → friendly error page
  5. **Unsaved Changes:**
     - Edit form, then navigate away → warning shows
     - Click Cancel in warning → stays on form
     - Click Discard → navigates away
  6. **Edge Cases:**
     - Edit rejected idea → allows edit
     - Edit submitted idea → stays submitted
     - Delete attachment while editing → attachment removed
- Coverage: Main workflows + error cases
- Effort: 4-5 hours
- Checklist:
  - [ ] All test scenarios pass
  - [ ] Tests run in CI/CD
  - [ ] Flaky tests debugged
  - [ ] Performance acceptable (< 5s per test)

**Task P3.7: Test Suite & Coverage Report**
- Run full test suite:
  ```bash
  npm test -- --coverage --watchAll=false
  ```
- Verify coverage:
  - Overall: ≥80%
  - Statements: ≥80%
  - Branches: ≥75%
  - Functions: ≥80%
  - Lines: ≥80%
- Generate coverage report: `coverage/`
- Document in: `STORY-2.6-IMPLEMENTATION-COMPLETE.md`
- Effort: 1-2 hours
- Checklist:
  - [ ] Overall coverage ≥80%
  - [ ] All new files have ≥80% coverage
  - [ ] Coverage report generated
  - [ ] No critical paths untested

**Task P3.8: Git Commits & Cleanup**
- Organize Phase 1-3 commits:
  - Phase 1: "feat(story-2.6): Phase 1 - Form components & routing"
  - Phase 2: "feat(story-2.6): Phase 2 - Backend API & validation"
  - Phase 3: "feat(story-2.6): Phase 3 - Polish & testing"
- Commit format:
  ```
  feat(story-2.6): [Phase Title] - [Change Description]
  
  Acceptance Criteria Implemented:
  - AC1: [detail]
  - AC2: [detail]
  
  Testing:
  - 45+ unit tests
  - 10+ integration tests
  - 6 E2E test scenarios
  
  Coverage: 85% overall
  ```
- Effort: 1-2 hours
- Checklist:
  - [ ] Phase 1 commit created
  - [ ] Phase 2 commit created
  - [ ] Phase 3 commit created
  - [ ] All commits have descriptive messages
  - [ ] Git history clean (no WIP commits)

**Task P3.9: Create Implementation Summary Document**
- File: `STORY-2.6-IMPLEMENTATION-COMPLETE.md`
- Contents:
  - Overview of implementation
  - Files created/modified
  - Test results (passing tests, coverage)
  - Phase breakdown and timeline
  - Blockers encountered and resolved
  - Future enhancements identified
  - How to run/test locally
- Effort: 1 hour
- Checklist:
  - [ ] Document created
  - [ ] All phases documented
  - [ ] Test results included
  - [ ] Files list complete
  - [ ] Clear instructions for running

**Phase 3 Effort Estimate:** 18-22 hours (1 day)

---

## Implementation Timeline & Milestones

### Timeline Overview

| Phase | Duration | Focus | Day |
|-------|----------|-------|-----|
| Phase 1 | 1 day | Components, routing, form logic | Day 1 |
| Phase 2 | 1 day | Backend API, validation, auth | Day 2 |
| Phase 3 | 1 day | Polish, E2E tests, deployment | Day 3 |
| **Total** | **3 days** | **Full Story** | **Estimated: 3-4 days** |

### Daily Milestones

**Day 1 (Phase 1):**
- ✅ 9:00 AM - IdeaForm component template created
- ✅ 11:00 AM - FormFields component done
- ✅ 1:00 PM - AttachmentsSection enhanced
- ✅ 3:00 PM - IdeaEditPage & routing complete
- ✅ 5:00 PM - Unit tests written, 80%+ coverage
- **End of Day:** Phase 1 PR created, ready for review

**Day 2 (Phase 2):**
- ✅ 9:00 AM - PUT /api/ideas/:ideaId endpoint implemented
- ✅ 11:00 AM - updateIdea service method complete
- ✅ 1:00 PM - File upload middleware & storage done
- ✅ 3:00 PM - Authorization checks & validation complete
- ✅ 5:00 PM - Backend tests written, 80%+ coverage
- **End of Day:** Phase 2 PR created, API tested locally

**Day 3 (Phase 3):**
- ✅ 9:00 AM - Error handling enhanced, UX polish complete
- ✅ 11:00 AM - Responsive design verified on mobile/tablet/desktop
- ✅ 1:00 PM - Loading states & success feedback done
- ✅ 3:00 PM - E2E tests written, all scenarios passing
- ✅ 5:00 PM - Full test suite passes, coverage report generated
- **End of Day:** Phase 3 PR created, all tests passing, ready to merge

---

## Story Points Breakdown

| Phase | Component | Tasks | Effort | Story Points |
|-------|-----------|-------|--------|--------------|
| 1 | Form Components | P1.1-P1.2 | 6-8h | 2 |
| 1 | Attachments & Edit Page | P1.3-P1.5 | 8-10h | 2 |
| 1 | Routing & Tests | P1.6-P1.8 | 6-8h | 1 |
| **Phase 1 Total** | | | 20-26h | **5 SP** |
| 2 | Backend API | P2.1-P2.3 | 8-10h | 2 |
| 2 | Auth & Validation | P2.4-P2.8 | 10-13h | 2 |
| **Phase 2 Total** | | | 18-23h | **4 SP** |
| 3 | Polish & Responsive | P3.1-P3.5 | 10-13h | 1.5 |
| 3 | Testing & Deploy | P3.6-P3.9 | 8-10h | 1.5 |
| **Phase 3 Total** | | | 18-23h | **3 SP** |
| | | | | |
| **TOTAL STORY** | | | **56-72 hours** | **~12 SP** |

**Adjusted Estimate:** 8 story points (accounting for parallel work, team efficiency)

---

## Dependencies & Risk Analysis

### Story Dependencies

**Direct Dependencies:**
- ✅ STORY-2.1 (Submission Form) - Form validation logic reused
- ✅ STORY-2.5 (Detail Page) - Navigation link added, RejectionFeedbackAlert component reused
- ✅ STORY-1.2 (Auth) - Users must be authenticated to edit

**Indirect Dependencies:**
- STORY-2.3 (List & Filter) - Users navigate from list to edit
- STORY-2.2 (Evaluator Workflow) - Status transitions after edit

### Risks & Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|-----------|
| File upload failures | Users can't add attachments | Medium | Mock S3 in tests, use retry logic |
| Authorization bugs | Security vulnerability | Medium | Review auth logic with security team, thorough testing |
| Form validation edge cases | Users confused by errors | Low | Test with QA team on edge cases |
| Mobile responsiveness issues | Poor mobile UX | Low | Test on real devices (iPhone, Android) |
| API contract mismatch | Frontend/backend breaking | Low | Define API schema upfront, use OpenAPI/Zod |
| Performance (large uploads) | Timeout on slow networks | Low | Add timeout handling, show upload progress |

### Unknown Unknowns

- File storage strategy (local vs S3) - decide early in Phase 2
- Database migration strategy - coordinate with DevOps
- API versioning approach - ensure backward compatibility

---

## Testing Strategy

### Unit Testing (Jest + React Testing Library)
- **Target Coverage:** ≥80%
- **Files:**
  - `src/components/IdeaForm/IdeaForm.test.tsx`
  - `src/components/IdeaForm/FormFields.test.tsx`
  - `src/components/IdeaForm/AttachmentsSection.test.tsx`
  - `src/pages/IdeaEditPage.test.tsx`
  - `backend/src/routes/__tests__/ideas.update.test.ts`
  - `backend/src/services/__tests__/ideaService.update.test.ts`
- **Test Types:**
  - Component rendering
  - Props passing
  - Event handlers
  - State changes
  - Error scenarios
  - Validation logic

### Integration Testing
- **Framework:** Jest + Supertest (backend) / RTL (frontend)
- **Scenarios:**
  - Form submission → API call → database update
  - File upload → storage → database
  - Authorization checks → rejection on unauthorized
  - Error handling → retry logic
- **Files:**
  - `backend/src/integration/__tests__/idea-edit.integration.test.ts`
  - `src/__tests__/integration/idea-edit.integration.test.tsx`

### E2E Testing (Cypress)
- **Framework:** Cypress
- **File:** `cypress/e2e/idea-edit.cy.ts`
- **Scenarios:**
  1. Edit existing idea (happy path)
  2. Validation errors
  3. Authorization (own vs other's idea)
  4. File uploads
  5. Network errors
  6. Unsaved changes warning
- **Coverage:** Main workflows + error cases

### Manual Testing Checklist
- [ ] Test on Chrome, Firefox, Safari
- [ ] Test on iPhone, Android (mobile)
- [ ] Test with slow network (throttle to 3G)
- [ ] Test with very large uploads (> 100MB)
- [ ] Screen reader accessibility (NVDA/JAWS)
- [ ] Keyboard-only navigation
- [ ] Copy-paste in form fields
- [ ] Session timeout during edit
- [ ] Offline then online refresh

---

## Success Criteria

### Code Quality
- ✅ TypeScript strict mode enabled (no `any` types)
- ✅ ESLint passes with zero warnings
- ✅ Prettier formatting enforced
- ✅ Test coverage ≥80%
- ✅ No console errors/warnings in app

### Functional Requirements
- ✅ All 13 acceptance criteria met
- ✅ Form prefills with idea data
- ✅ Real-time validation
- ✅ File upload & progress display
- ✅ Error handling (400, 401, 403, 404, 500)
- ✅ Responsive design (mobile/tablet/desktop)
- ✅ Unsaved changes detection

### Performance
- ✅ Form loads within 2 seconds
- ✅ Form submission response within 3 seconds
- ✅ File upload shows progress (every 500ms)
- ✅ No layout shifts (CLS < 0.1)
- ✅ Lighthouse score ≥90

### User Experience
- ✅ Clear error messages (not technical)
- ✅ Loading states (skeleton, spinner)
- ✅ Success feedback (toast notification)
- ✅ Keyboard navigation compatible
- ✅ 44x44px minimum touch targets
- ✅ WCAG 2.1 Level AA accessibility

---

## Sign-Off & Approval

| Role | Name | Status |
|------|------|--------|
| Product Owner | [PO] | ⏳ Pending |
| Tech Lead | [Tech Lead] | ⏳ Pending |
| QA Lead | [QA] | ⏳ Pending |
| Security Review | [Security] | ⏳ Pending |

---

## References

- **STORY-2.6 Specification:** [specs/stories/STORY-2.6-Edit-Page.md](specs/stories/STORY-2.6-Edit-Page.md)
- **STORY-2.6 Clarifications:** [specs/stories/STORY-2.6-CLARIFICATION.md](specs/stories/STORY-2.6-CLARIFICATION.md)
- **STORY-2.5 Implementation:** [IMPLEMENTATION-PLAN-STORY-2.5.md](IMPLEMENTATION-PLAN-STORY-2.5.md)
- **STORY-2.1 Form Validation:** [specs/stories/STORY-2.1-Submission-Form.md](specs/stories/STORY-2.1-Submission-Form.md)
- **agents.md Guidelines:** [agents.md](agents.md)

---

**Status:** 🟢 READY FOR IMPLEMENTATION  
**Created:** February 25, 2026  
**Last Updated:** February 25, 2026  
**Next Step:** Assign to development team and begin Phase 1

