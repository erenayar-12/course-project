# STORY-2.6: Idea Edit Page - Clarifications

**Status:** 🔄 CLARIFICATIONS IN PROGRESS  
**Date Started:** February 25, 2026  
**Owner:** Development Team  
**Next Phase:** `/speckit.plan` - Create implementation plan after clarification  
**Related Story:** STORY-2.5 (Detail Page), STORY-2.1 (Submission Form)

---

## Open Questions & Clarifications Needed

### 1. Edit Status Behavior - What Happens When User Saves Edited "Submitted" Idea?

**Question:** When a user edits and saves a "Submitted" idea, what status should it change to?

**Current Spec (AC11):** Implies idea can be "re-submitted" after rejection, but unclear for normal submitted edits

**Options:**
- **Option A:** Stay "Submitted" (user editing in place, still awaiting review) ✅ **DECIDED**
- **Option B:** Change to "Draft" (user explicitly chose to edit, must re-submit to get back to "Submitted")
- **Option C:** Change to "Revision Submitted" (new workflow state indicating re-evaluation needed)
- **Option D:** Stay "Submitted" but increment a version_number (track revisions)

**Decision:** ✅ **Option A - STAY "SUBMITTED"** (Approved by product team)

**✅ Approved Implementation:**
- Evaluators see updated idea with modified timestamp; continues from previous evaluation point
- No status change (stays "Submitted")
- Most transparent approach for iterative improvements

**Implementation Impact:**
- Backend: Query needs `updated_at` field to show evaluators it was modified
- Frontend: Success message: "Idea saved and updated for review"
- Database: Add `updated_at` timestamp tracking (likely already exists)
- Validation: Ensure submitted ideas can be edited via API check

**API Contract:**
```ruby
PUT /api/ideas/:ideaId
Request: { title, description, category, attachments[], status: "Submitted" }
Response: { id, title, status: "Submitted", updated_at: "2026-02-25T10:30:00Z", ... }
```

**Database Migration (if needed):**
- Ensure `updated_at` timestamp exists on ideas table
- Track who modified and when (for audit trail)

---

### 2. Attachment Management - Keep vs Replace

**Question:** When editing an idea with existing attachments, how should file management work?

**Current Spec (AC5):** "Current attachments displayed with delete buttons; new files can be added"

**Options:**
- **Option A (Current):** Keep existing + add new (cumulative, max 5 total files) ✅ **DECIDED**
- **Option B:** Replace all (user removes all, must re-upload if needed)
- **Option C:** Lock existing (read-only section), only allow new files to be added to max of 5
- **Option D:** Different limits for original vs added (e.g., max 3 original, + 2 new = 5 total)

**Decision:** ✅ **Option A - KEEP EXISTING + ADD NEW** (Approved by product team)

**✅ Approved Implementation:**
- Display current attachments in read-only section with delete buttons
- Show available slots: "You have 3 attached files. You can add up to 2 more."
- New files added to same attachment array
- Max 5 total files enforced

**Frontend UI Sections:**
1. **Current Attachments** (read-only)
   - List existing files with delete buttons [X]
   - Show file size and upload date
2. **Add New Files** (editable)
   - File picker input
   - Drag-and-drop support
   - Preview of files to be added

**API Contract:**
```ruby
PUT /api/ideas/:ideaId
Request: {
  title, description, category,
  attachments: [
    { id: "existing-123", name: "design.pdf", created_at: "2026-02-20" },  # Keep
    { id: "existing-456", name: "mockups.figma", created_at: "2026-02-18" }  # Keep
    # New files as FormData File objects
  ]
}
```

**Validation Rules:**
- Prevent user from adding > 5 files total
- Warn at 4 files: "One more file allowed"
- Error at 5 files: "Maximum 5 files reached. Delete one to add another."
- File size: Max 10MB per file
- File types: images, PDF, Word, Excel only

---

### 3. Evaluator Feedback Display in Edit Form

**Question:** Should rejection feedback be displayed in the edit form to help user address it?

**Current Spec (AC11):** "If rejected, feedback section displayed at top of form"

**Options:**
- **Option A (Current):** Show feedback in edit form as read-only callout (AC11 - RejectionFeedbackAlert component) ✅ **DECIDED**
- **Option B:** Show feedback only on detail page, not in edit form (user must switch tabs)
- **Option C:** Show feedback in edit form with "I've addressed this feedback" checkbox
- **Option D:** Hide feedback by default, only show if user clicks "View Feedback" link

**Decision:** ✅ **Option A - SHOW IN EDIT FORM** (MVP decision - best UX for addressing feedback)

**✅ Approved Implementation:**
- Component: `RejectionFeedbackAlert.tsx` (reuse from STORY-2.5)
- Placement: Top of form, above title field
- Heading: "Revision Feedback - Please Address"
- Content: Evaluator feedback (read-only)
- Icon: Warning/info icon (yellow background)
- Styling: Alert box with `alert alert-warning` classes

**Conditional Display:**
```typescript
if (idea.status === 'Rejected' && idea.rejection_feedback) {
  return <RejectionFeedbackAlert feedback={idea.rejection_feedback} />
}
// Otherwise, no feedback section shows
```

**Future Enhancement:**
- Optional: Track "feedback acknowledged" timestamp
- Track which feedback items were addressed by user edits

---

### 4. Save Modes - Single Action or Draft vs Submit Buttons?

**Question:** Should there be one "Save Changes" button or separate "Save as Draft" and "Submit for Review" buttons?

**Current Spec (AC7):** Single "Save Changes" button implied

**Options:**
- **Option A (Current):** Single "Save Changes" button (simpler, MVP-friendly) ✅ **DECIDED**
- **Option B:** Two buttons: "Save as Draft" + "Submit for Review"
- **Option C:** Single button with dropdown: Save [▼] → "Draft" or "For Review"
- **Option D:** Intelligent button: if status was "Draft", show "Submit"; if "Submitted", show "Save"

**Decision:** ✅ **Option A - SINGLE "SAVE CHANGES" BUTTON** (MVP simplicity)

**✅ Approved Implementation:**
- Single button: "Save Changes"
- Works for both Draft and Submitted ideas
- Simplified UX, no mode selection needed

**Button Behavior:**
```typescript
const handleSaveChanges = async () => {
  setIsLoading(true);
  try {
    await updateIdea(ideaId, formData);
    showSuccessToast('Idea updated successfully');
    navigate(`/ideas/${ideaId}`);
  } catch (error) {
    showErrorMessage(error);
  } finally {
    setIsLoading(false);
  }
};
```

**Success Messages:**
- If status was "Submitted": "Idea updated. Your changes are submitted for review."
- If status was "Draft": "Draft saved successfully."
- If status was "Rejected": "Idea resubmitted for review."

**Button States:**
- Default: Blue, clickable
- Loading: Disabled, "Saving..." text, spinner
- Error: Shown in error alert with "Try Again" button
- Success: Navigate to detail page

**Future Enhancement (Phase 2):**
- Add separate "Save as Draft" option for submitted ideas if workflow demands it

---

### 5. Unsaved Changes Detection - Warning Modal

**Question:** Should we implement AC13 (optional enhanced UX) - warning modal when user navigates away with unsaved changes?

**Current Spec (AC13):** Optional: "Show confirmation modal if significant changes exist"

**Options:**
- **Option A:** Skip for MVP (user can lose work if they navigate away carelessly)
- **Option B:** Always show warning if any form field changed (strict) ✅ **DECIDED**
- **Option C:** Show warning only if "significant" changes (algorithm TBD)
- **Option D:** Use browser native confirmation (window.beforeunload) - simpler, less friendly

**Decision:** ✅ **Option B - SHOW WARNING IF ANY CHANGES** (Safety improvement)

**✅ Approved Implementation:**

**Track Dirty State:**
```typescript
const [originalData, setOriginalData] = useState<IdeaEditForm>(null);
const [formData, setFormData] = useState<IdeaEditForm>(null);
const isDirty = JSON.stringify(originalData) !== JSON.stringify(formData);
```

**Browser Unload Handler:**
```typescript
useEffect(() => {
  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    if (isDirty) {
      e.preventDefault();
      e.returnValue = '';
      return '';
    }
  };
  
  window.addEventListener('beforeunload', handleBeforeUnload);
  return () => window.removeEventListener('beforeunload', handleBeforeUnload);
}, [isDirty]);
```

**React Router Blocker (for internal navigation):**
```typescript
const unblock = useBlocker(
  ({ currentLocation, nextLocation }) =>
    isDirty && currentLocation.pathname !== nextLocation.pathname
);

if (unblock.state === 'blocked') {
  return <DiscardChangesModal onConfirm={unblock.proceed} onCancel={unblock.reset} />;
}
```

**Modal UX:**
- Title: "Discard Changes?"
- Message: "You have unsaved changes. Are you sure you want to leave without saving?"
- Buttons: "Cancel" (stay) | "Discard Changes" (leave)
- Applies to: Back button, other links, browser tab close, page refresh

**Impact:**
- ✅ Prevents accidental data loss
- ✅ Better UX than silent loss
- ✅ Improves user confidence
- May annoy power users (future: add "Don't warn again" option)

---

### 6. File Upload Progress & Error Recovery

**Question:** How should file uploads be handled during form submission? Especially if upload fails partway through?

**Current Spec (AC5):** "Preview of file upload progress (e.g., 'Uploading file.pdf (2/5 MB)')"

**Options:**
- **Option A:** Show progress bar for each file as it uploads ✅ **DECIDED**
- **Option B:** Show overall progress (3 of 5 files complete)
- **Option C:** Simple "Uploading..." message without detailed progress
- **Option D:** Process all files before form submission (upload files first, then submit form data)

**Decision:** ✅ **Option A - PER-FILE PROGRESS BARS** (Better UX)

**✅ Approved Implementation:**

**UI Display During Upload:**
```
Uploading Attachments:
├─ Document.pdf         [████░░░░░░] 60% (3 of 5 MB)
├─ Design.figma         [██████████] 100% ✓
├─ Mockups.png         [░░░░░░░░░░] 0% (pending)
```

**Progress Per File:**
- Show individual progress bar for each file
- Display: "Uploading {filename} ({current} of {total} MB)"
- Update bar as bytes upload (use Fetch with UploadEvent.progress)
- Show checkmark (✓) when file complete
- Show spinner (◌) while pending

**Error Handling:**
- File fails to upload: Show error icon (✗) next to file
- Keep successful uploads
- Show "Retry" button for failed files only
- Allow user to:
  1. Retry specific failed files
  2. Remove failed file and continue
  3. Cancel entire operation

**Edge Cases:**
- Network interruption mid-upload: Pause and show "Connection lost. Retry?" button
- File size validation: Client-side check before upload starts
- Format validation: Server response triggers error display
- User cancels: Stop uploads, keep completed files

**Implementation (Fetch with Progress):**
```typescript
const uploadFile = (file: File): Promise<{url: string}> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    
    xhr.upload.addEventListener('progress', (e) => {
      const progress = (e.loaded / e.total) * 100;
      updateProgressBar(file.name, progress);
    });
    
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) resolve(JSON.parse(xhr.responseText));
      else reject(new Error(`Upload failed: ${xhr.status}`));
    });
    
    xhr.addEventListener('error', () => reject(new Error('Network error')));
    xhr.addEventListener('abort', () => reject(new Error('Upload cancelled')));
    
    const formData = new FormData();
    formData.append('file', file);
    xhr.open('POST', '/api/upload', true);
    xhr.send(formData);
  });
};
```

---

### 7. Form Validation & Character Limits - Real-Time vs On-Submit

**Question:** Should validation errors show real-time as user types, or only when they submit?

**Current Spec (AC2, AC3):** Implies real-time feedback ("Character count displayed below textarea")

**Options:**
- **Option A (Current):** Real-time validation with inline error messages as user types ✅ **DECIDED**
- **Option B:** Validate only on blur (when user leaves field)
- **Option C:** Validate only on submit (simpler, fewer error states)
- **Option D:** Progressive validation (show hints at 80% capacity, errors at 100%)

**Decision:** ✅ **Option A - REAL-TIME VALIDATION** (Modern UX standard)

**✅ Approved Implementation:**

**Title Field - Real-Time Validation:**
```
State: Empty
Message: (none)

State: Typing "Hi" (2 chars)
Message: ✗ "Title too short (2 / 5 characters minimum)" (red)
Input Style: border-red-500 focus:border-red-600

State: "Hello Bug" (9 chars)
Message: ✓ "Title looks good" (green) OR hide message
Input Style: border-green-500

State: Getting close to max "This is a very long title that approaches the chara..."
Message: ⚠ "Only 5 characters left" (yellow)
Input Style: border-yellow-500
```

**Description Field - Real-Time Character Count:**
```
Display below textarea:
"215 / 2000 characters"

At 80% (1600 chars): Show warning
"⚠ Getting close to limit. Only 400 characters left"

At 100% (2000 chars): 
"Character limit reached. Remove text to add more."
(Disable typing, show error)  
```

**Category Dropdown - Blur Validation:**
```
On focus: No message
While open: No message
On blur (leave closed): 
  - If empty: ✗ "Please select a category" (red)
  - If selected: Hide message
```

**Form Submit - Final Validation:**
```typescript
const validateForm = (): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  if (!formData.title || formData.title.length < 5) 
    errors.push({ field: 'title', message: 'Title too short' });
  if (!formData.description || formData.description.length < 20)
    errors.push({ field: 'description', message: 'Description too short' });
  if (!formData.category)
    errors.push({ field: 'category', message: 'Category required' });
    
  return errors;
};

// If errors, show error summary and don't submit
if (errors.length > 0) {
  showErrorAlert(errors);
  return; // Don't call API
}

// If valid, submit to API
await updateIdea(ideaId, formData);
```

**Reuse from STORY-2.1:**
- Validation utility functions: `validateTitle()`, `validateDescription()`, `validateCategory()`
- Error messages should match for consistency
- Component styling should match for visual coherence

---

### 8. Authorization - Edit Status Lock vs User-Based Lock

**Question:** Should users be prevented from editing based on idea status alone, or also by workflow state?

**Current Spec (AC9):** "Cannot edit if status is Under Review, Approved, or Rejected"

**Options:**
- **Option A (Simple):** Lock edit if status NOT in [Draft, Submitted] ✅ **DECIDED**
- **Option B (Strict):** Also lock if workflow_state is "In Evaluation" (more granular)
- **Option C (Role-Based):** Check if current user is evaluator and idea is under review
- **Option D (Timestamp-Based):** Lock edit if evaluation_started_at exists and evaluation_deadline passed

**Decision:** ✅ **Option A - STATUS-BASED LOCK** (Simple, MVP-friendly)

**✅ Approved Implementation:**

**Backend Approval Logic:**
```typescript
// Check 1: Is user the owner?
if (req.user.id !== idea.creator_id) {
  return res.status(403).json({ error: "You don't have permission to edit this idea." });
}

// Check 2: Is idea status editable?
if (!["Draft", "Submitted", "Rejected"].includes(idea.status)) {
  return res.status(403).json({ 
    error: "This idea cannot be edited. Only Draft and Submitted ideas can be modified." 
  });
}

// Check 3: Is evaluation_locked flag set?
if (idea.evaluation_locked) {
  return res.status(403).json({ 
    error: "This idea is under review and cannot be modified." 
  });
}
```

**Frontend Pre-checks:**
```typescript
const canEdit = 
  idea.creator_id === currentUser.id &&
  ['Draft', 'Submitted', 'Rejected'].includes(idea.status) &&
  !idea.evaluation_locked;

if (!canEdit) {
  return <IdeaDetailPage idea={idea} />; // Show detail, no edit button
}
```

**Edit Route Protection:**
```typescript
function IdeaEditPage() {
  const { ideaId } = useParams();
  const { idea, loading, error } = useGetIdea(ideaId);
  
  if (loading) return <LoadingSpinner />;
  
  // Check authorization on load
  if (error) return <ErrorPage error={error} />;
  
  const isAuthorized = 
    idea.creator_id === getCurrentUserId() &&
    ['Draft', 'Submitted', 'Rejected'].includes(idea.status);
  
  if (!isAuthorized) {
    return <ForbiddenPage message="You don't have permission to edit this idea." />;
  }
  
  return <IdeaEditForm idea={idea} />;
}
```

**Error Messages (AC8):**
- 403 Ownership: "You don't have permission to edit this idea."
- 403 Status: "This idea cannot be edited. Only Draft and Submitted ideas can be modified."
- 403 Locked: "This idea is under review and cannot be modified."

---

### 9. Mobile File Upload - Camera vs File Picker

**Question:** On mobile, should file upload support camera capture or only file selection?

**Current Spec:** No explicit mention; assumed file picker only

**Options:**
- **Option A:** File picker only (current web standard `<input type="file">`) ✅ **DECIDED**
- **Option B:** File picker + camera capture on mobile (iOS/Android camera app)
- **Option C:** File picker + camera + gallery (most flexible)
- **Option D:** Smart selection (camera if first upload, picker if additional)

**Decision:** ✅ **Option A - FILE PICKER ONLY** (MVP scope)

**✅ Approved Implementation:**
```html
<input 
  type="file" 
  multiple 
  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
  onChange={handleFileSelect}
  disabled={isMaxFilesReached}
/>
```

**Mobile Behavior:**
- Tapping opens native file picker
- User can select from device storage/files app
- Can browse folders and select multiple files
- Works on iOS and Android with standard `<input>`

**Limitation (MVP):**
- Cannot capture new photos directly from camera
- User must use camera app to take photo, then `attach file
- This is acceptable for MVP; camera integration can be Phase 2

**Future Enhancement (Phase 2):**
```html
<!-- iOS Safari + Android Chrome support -->
<input 
  type="file" 
  accept="image/*;capture=environment"
  // Enables: "Take photo" option on iOS, Camera app selection on Android
/>
```

---

### 10. Edit Form Component Reuse with STORY-2.1

**Question:** How should the edit form be implemented relative to the submission form from STORY-2.1?

**Current Spec (AC2):** "Form validation matches STORY-2.1 implementation"

**Options:**
- **Option A:** Extract form logic into `IdeaFormContent.tsx` component, reuse in both STORY-2.1 and STORY-2.6
- **Option B:** Create separate `IdeaEditForm.tsx` component (duplicate some validation logic)
- **Option C:** Use single `IdeaForm.tsx` with mode prop: `<IdeaForm mode="create" />` vs `<IdeaForm mode="edit" ideaId="123" />` ✅ **DECIDED**
- **Option D:** Keep completely separate implementations (avoid coupling)

**Decision:** ✅ **Option C - SINGLE REUSABLE COMPONENT** (DRY principle)

**✅ Approved Implementation:**

**Unified Component Structure:**
```typescript
// src/components/IdeaForm.tsx
interface IdeaFormProps {
  mode: 'create' | 'edit';
  ideaId?: string;                  // Required if mode='edit'
  initialData?: Partial<Idea>;      // Prefilled for edit mode
  onSubmit?: (data: FormData) => Promise<void>;
  onCancel?: () => void;
  onSuccess?: (ideaId: string) => void;
  loading?: boolean;
}

export const IdeaForm: React.FC<IdeaFormProps> = ({
  mode,
  ideaId,
  initialData,
  onSubmit,
  onCancel,
  onSuccess,
  loading = false,
}) => {
  // Shared form logic for both create and edit
  // Differences handled via conditional rendering
  
  if (mode === 'create') {
    return <>Create Form UI, empty fields</>;  
  } else if (mode === 'edit') {
    return <>Edit Form UI, prefilled fields, rejection feedback alert</>;  
  }
};
```

**Usage in Pages:**
```typescript
// IdeaSubmissionPage.tsx (STORY-2.1)
<IdeaForm 
  mode="create" 
  onSubmit={handleCreateIdea}
  onSuccess={(ideaId) => navigate(`/ideas/${ideaId}`)}
/>

// IdeaEditPage.tsx (STORY-2.6)
<IdeaForm 
  mode="edit" 
  ideaId={ideaId}
  initialData={idea}
  onSubmit={handleUpdateIdea}
  onCancel={() => navigate(`/ideas/${ideaId}`)}
  onSuccess={() => navigate(`/ideas/${ideaId}`)}
/>
```

**Shared Validation Utilities:**
```typescript
// src/utils/ideaValidation.ts
export const validateTitle = (title: string): ValidationError | null => {
  if (!title || title.length < 5) 
    return { field: 'title', message: 'Title must be at least 5 characters' };
  if (title.length > 100)
    return { field: 'title', message: 'Title cannot exceed 100 characters' };
  return null;
};

export const validateDescription = (desc: string): ValidationError | null => {
  if (!desc || desc.length < 20)
    return { field: 'description', message: 'Description must be at least 20 characters' };
  if (desc.length > 2000)
    return { field: 'description', message: 'Description cannot exceed 2000 characters' };
  return null;
};

export const validateCategory = (category: string): ValidationError | null => {
  const validCategories = ['Technology', 'Health', 'Education', 'Environment', 'Business', 'Culture', 'Other'];
  if (!category || !validCategories.includes(category))
    return { field: 'category', message: 'Please select a valid category' };
  return null;
};

export const validateAttachments = (files: File[]): ValidationError | null => {
  if (files.length > 5)
    return { field: 'attachments', message: 'Maximum 5 files allowed' };
  const maxFileSize = 10 * 1024 * 1024; // 10MB
  for (const file of files) {
    if (file.size > maxFileSize)
      return { field: 'attachments', message: `${file.name} exceeds 10MB limit` };
  }
  return null;
};

export const validateIdeaForm = (idea: Partial<Idea>): ValidationError[] => {
  const errors: ValidationError[] = [];
  const titleError = validateTitle(idea.title || '');
  if (titleError) errors.push(titleError);
  const descError = validateDescription(idea.description || '');
  if (descError) errors.push(descError);
  const catError = validateCategory(idea.category || '');
  if (catError) errors.push(catError);
  return errors;
};
```

**Component File Structure:**
```
src/components/
├── IdeaForm/
│   ├── IdeaForm.tsx (main component with mode prop)
│   ├── CreateMode.tsx (create-specific UI)
│   ├── EditMode.tsx (edit-specific UI)
│   ├── FormFields.tsx (shared title/description/category fields)
│   ├── AttachmentsSection.tsx (shared file handling)
│   ├── RejectionFeedbackAlert.tsx (edit-only, reuse from STORY-2.5)
│   └── IdeaForm.test.tsx (shared tests for both modes)
├── ...

src/utils/
├── ideaValidation.ts (shared validation rules)
```

**Tests - Both Modes Tested Together:**
```typescript
// src/components/IdeaForm/IdeaForm.test.tsx
describe('IdeaForm', () => {
  describe('Create Mode', () => {
    it('renders empty form fields', () => { });
    it('validates and submits new idea', () => { });
  });
  
  describe('Edit Mode', () => {
    it('prefills form with idea data', () => { });
    it('shows rejection feedback if rejected', () => { });
    it('validates and submits updates', () => { });
  });
  
  describe('Shared Validation', () => {
    it('validates title in both modes', () => { });
    it('validates description in both modes', () => { });
    // ... shared validation tests
  });
});
```

---

## Summary Table - Clarifications at a Glance

| # | Question | Current | **DECIDED** | Priority | Status |
|----|----------|---------|-------------|----------|--------|
| 1 | Edit status behavior (Submitted → ?) | Unclear | ✅ Stay "Submitted" (Option A) | HIGH | 🟢 APPROVED |
| 2 | Attachment management | Keep + add | ✅ Keep existing + add new (Option A) | HIGH | 🟢 APPROVED |
| 3 | Show rejection feedback in form? | Yes (AC11) | ✅ Yes, show in form (Option A) | MEDIUM | 🟢 APPROVED |
| 4 | Save modes (1 vs 2 buttons) | Single button | ✅ Single "Save Changes" (Option A) | MEDIUM | 🟢 APPROVED |
| 5 | Unsaved changes warning | Optional | ✅ Implement modal (Option B) | LOW | 🟢 APPROVED |
| 6 | File upload progress | Specified | ✅ Per-file progress + retry (Option A) | MEDIUM | 🟢 APPROVED |
| 7 | Validation timing | Real-time | ✅ Real-time validation (Option A) | MEDIUM | 🟢 APPROVED |
| 8 | Authorization logic | Status-based | ✅ Status-based lock (Option A) | HIGH | 🟢 APPROVED |
| 9 | Mobile camera support | Not mentioned | ✅ MVP: File picker only (Option A) | LOW | 🟢 APPROVED |
| 10 | Form component reuse | Separate forms | ✅ Single reusable component (Option C) | MEDIUM | 🟢 APPROVED |

---

## Dependencies on Other Stories

- ✅ **STORY-2.1:** Submission form validation logic—can reuse via shared utils
- ✅ **STORY-2.5:** Detail page → edit page navigation—must ensure link works
- ✅ **STORY-1.2:** Auth/protected routes—must wrap /ideas/:ideaId/edit route
- ⏳ **Workflow System:** How statuses transition (affects clarification #1)
- ⏳ **Evaluator Workflow:** When evaluators see updated ideas (affects #1 & #6)

---

## Recommended Clarification Order

**First (Must Answer Before Planning):**
1. ✅ Edit status behavior (#1)
2. ✅ Form component reuse approach (#10)
3. ✅ Authorization logic (#8)

**Second (Should Answer Before Implementation):**
4. Attachment management (#2)
5. Validation timing (#7)
6. Unsaved changes warning (#5)

**Third (Can Defer to Planning Sprint):**
7. Feedback display in form (#3)
8. Save button pattern (#4)
9. File upload progress (#6)
10. Mobile features (#9)

---

## ✅ All Clarifications Approved & Decided

**Status:** 🟢 READY FOR IMPLEMENTATION PLANNING

**All 10 Clarifications Resolved:**
- ✅ #1 Edit status behavior → Stay Submitted
- ✅ #2 Attachment management → Keep existing + add new
- ✅ #3 Feedback display → Show in edit form
- ✅ #4 Save button pattern → Single "Save Changes"
- ✅ #5 Unsaved changes → Show warning modal
- ✅ #6 File upload progress → Per-file progress bars
- ✅ #7 Validation timing → Real-time
- ✅ #8 Authorization logic → Status-based lock
- ✅ #9 Mobile camera → File picker MVP
- ✅ #10 Component reuse → Single reusable IdeaForm component

**Next Step:** Run `/speckit.plan` to create detailed implementation plan
- Break 13 ACs into technical tasks
- Estimate Phase 1-3 effort
- Identify dependencies and critical path
- Provide story points for implementation team

---

## References

- **STORY-2.6:** [specs/stories/STORY-2.6-Edit-Page.md](specs/stories/STORY-2.6-Edit-Page.md)
- **STORY-2.5:** [specs/stories/STORY-2.5-Detail-Page.md](specs/stories/STORY-2.5-Detail-Page.md)
- **STORY-2.1:** [specs/stories/STORY-2.1-Submission-Form.md](specs/stories/STORY-2.1-Submission-Form.md)
- **STORY-2.5 Clarifications:** [specs/stories/STORY-2.5-CLARIFICATION.md](specs/stories/STORY-2.5-CLARIFICATION.md)

---

**Status:** ✅ ALL CLARIFICATIONS DECIDED & APPROVED  
**Last Updated:** February 25, 2026  
**Next Action:** Run `/speckit.plan` to create implementation plan
