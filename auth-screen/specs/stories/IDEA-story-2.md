# IDEA-story-2: File Upload Functionality

**Story ID:** IDEA-story-2  
**Title:** Implement File Upload Handling with Validation and Storage  
**Epic:** EPIC-2 (Idea Submission & Management System)  
**Sprint/Milestone:** Sprint 2  
**Status:** DRAFT  
**Priority:** P1 (High) - Follows IDEA-story-1  
**Story Points:** 5 (Medium - 3-5 days)  
**Owner:** Development Team

---

## User Story

**As a** submitter  
**I want** to optionally attach supporting files (PDF, images, documents) to my idea submission  
**so that** the evaluation team can review comprehensive supporting materials alongside my idea

### Story Context
After submitting an idea through the form (IDEA-story-1), users need the ability to attach supporting documentation such as concept sketches, market research PDFs, or data spreadsheets. This feature increases the quality of submissions by allowing comprehensive context and evidence to support ideas.

---

## Acceptance Criteria

### AC 1: File Input Component Display
- **Given** a user is on the idea submission form
- **When** the form loads
- **Then** a file upload input appears with clear label "Optional: Attach Supporting Files"

### AC 2: File Format Validation
- **Given** a user attempts to attach a file
- **When** the user selects a file
- **Then** only PDF, DOC, DOCX, PNG, JPG, JPEG, XLS, XLSX formats are accepted
- **And** unsupported formats show error: "File format not supported. Please use PDF, Word, Excel, or Image files."

### AC 3: File Size Validation
- **Given** a user attempts to attach a file
- **When** the file exceeds 10MB
- **Then** system shows error: "File size exceeds 10MB limit. Please select a smaller file."

### AC 4: File Selection Display
- **Given** a user has selected a valid file
- **When** the form displays
- **Then** file name, size (in human-readable format: KB/MB), and a remove button appear

### AC 5: Optional Attachment
- **Given** a user has not selected a file
- **When** the user clicks Submit
- **Then** form submits successfully (file is optional)

### AC 6: Upload Progress Indication
- **Given** a form with a valid file is submitted
- **When** the file is being uploaded
- **Then** a progress bar displays showing upload percentage (0-100%)

### AC 7: Drag and Drop Support
- **Given** the file upload component is visible
- **When** a user drags and drops a file onto the designated area
- **Then** the file is selected with same validation as file picker

### AC 8: File Removal
- **Given** a user has selected a file
- **When** the user clicks the "Remove" button
- **Then** the file selection is cleared and upload input resets

### AC 9: Server-Side File Validation
- **Given** a form with file is submitted to the backend
- **When** the backend processes the request
- **Then** server validates file MIME type, size, and extension independently

### AC 10: File Metadata Storage
- **Given** a file is successfully uploaded
- **When** the upload completes
- **Then** file metadata (original name, stored name, size, MIME type, upload timestamp) is persisted to database
- **And** file is linked to the corresponding idea record

---

## Definition of Acceptance

All acceptance criteria must pass automated tests and QA sign-off:

- [ ] All acceptance criteria verified and passing
- [ ] Client-side file validation working correctly
- [ ] Server-side file validation implemented independently
- [ ] Upload progress tracking functional
- [ ] File stored securely with unique naming to prevent collisions
- [ ] Database metadata properly linked to idea record
- [ ] Drag-and-drop functionality working
- [ ] File removal resets component state
- [ ] Code changes reviewed and approved
- [ ] Unit tests passing (>80% coverage for file validation logic)
- [ ] Integration tests passing (upload endpoint verified)
- [ ] E2E tests passing (complete upload workflow)
- [ ] No new warnings or errors in code quality tools
- [ ] Performance: Upload of 10MB file completes within 30 seconds on 1Mbps connection

---

## Technical Notes

### Implementation Hints

**Frontend Approach (React/TypeScript):**
1. Create `FileUploadInput.tsx` component with:
   - File input field with accept attribute filtering
   - Drag-and-drop zone with visual feedback
   - File preview card showing name, size, remove button
   - Progress bar component using XMLHttpRequest or fetch with progress events

2. Validation logic:
   - Client-side: Check file size and MIME type before upload
   - Use `file.type` property and file size calculation
   - Display user-friendly error messages inline

3. Upload mechanism:
   - Use FormData API to send file with idea data
   - Track upload progress via XMLHttpRequest.upload.onprogress
   - Update progress bar in real-time
   - Handle upload cancellation gracefully

**Backend Approach (Node.js/Express):**
1. Install multer for multipart form-data handling
2. Configure multer with:
   - fileSize limit: 10MB
   - fileFilter for MIME type validation
   - Custom filename generation (UUID prefix)
   - Secure upload directory with restricted permissions

3. Endpoint: `POST /api/ideas/:ideaId/upload`
   - Validate JWT token (authorization)
   - Verify file ownership via idea record
   - Save file to secure location
   - Store metadata in database
   - Return success response with attachment info

4. Database schema: Create `ideaAttachments` table linking files to ideas

### Technology Stack
- **Frontend:** React 18, TypeScript, React Hook Form, Tailwind CSS
- **Backend:** Express.js, multer, file-type library, PostgreSQL, Prisma
- **File Storage:** Local filesystem (development) / S3 or cloud storage (production)
- **Validation:** Client-side (React) + Server-side (Express middleware + Prisma)

### Files/Components Affected
- **New Frontend:**
  - `src/components/FileUploadInput.tsx` - Main upload component
  - `src/components/FileProgressBar.tsx` - Upload progress indicator
  
- **Modified Frontend:**
  - `src/components/IdeaSubmissionForm.tsx` - Integrate file upload
  - `src/services/ideas.service.ts` - Add file upload API call
  
- **New Backend:**
  - `src/api/routes/ideas.ts` - Add `POST /ideas/:ideaId/upload` endpoint
  - `src/api/middleware/fileUpload.ts` - Multer configuration
  
- **Database:**
  - New migration: `ideaAttachments` table
  - Prisma schema update: IdeaAttachment model
  
- **Configuration:**
  - Update `.env` with file upload configuration (max size, allowed formats)

### Known Limitations or Considerations
- **Development:** Files stored locally; needs production cloud storage (S3, Azure Blob) for scalability
- **Malware Scanning:** Not included in MVP; can be added in Phase 2 with ClamAV or VirusTotal
- **File Compression:** Image compression deferred to Phase 2
- **Concurrent Uploads:** Supported via multer; test with multiple simultaneous requests
- **Upload Interruption:** User can cancel; server cleanup of partial uploads required
- **Browser Compatibility:** Drag-and-drop via HTML5 API (IE10+, all modern browsers)

### Database Schema Reference
```sql
CREATE TABLE ideaAttachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ideaId UUID NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
  originalFileName VARCHAR(255) NOT NULL,
  storedFileName VARCHAR(255) NOT NULL UNIQUE,
  fileSize INT NOT NULL,
  mimeType VARCHAR(100) NOT NULL,
  uploadedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  uploadedBy UUID NOT NULL REFERENCES users(id),
  
  CONSTRAINT filesize_max CHECK (fileSize <= 10485760)
);

CREATE INDEX idx_ideaAttachments_ideaId ON ideaAttachments(ideaId);
CREATE INDEX idx_ideaAttachments_uploadedAt ON ideaAttachments(uploadedAt);
```

### API Contract

**Request:**
```
POST /api/ideas/:ideaId/upload
Content-Type: multipart/form-data
Authorization: Bearer {jwt_token}

{
  file: <binary file data>
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "attachmentId": "550e8400-e29b-41d4-a716-446655440000",
    "ideaId": "550e8400-e29b-41d4-a716-446655440001",
    "originalFileName": "market_research.pdf",
    "storedFileName": "uuid-market_research.pdf",
    "fileSize": 2097152,
    "mimeType": "application/pdf",
    "uploadedAt": "2026-02-25T14:30:00Z"
  }
}
```

**Response (Error - 400):**
```json
{
  "success": false,
  "error": "File size exceeds 10MB limit"
}
```

---

## Dependency & Blocking Analysis

### Dependencies (Must Complete Before This Story)
- ✅ IDEA-story-1 (Submission Form) - File attaches to submitted idea
- ✅ Authentication (User token for authorization)
- ✅ Database setup (ideas table exists)

### Blocks (Stories Waiting for This)
- 🔄 IDEA-story-3 (Dashboard) - Display uploaded files in idea preview
- 🔄 IDEA-story-6 (Edit Functionality) - Replace/update uploaded files

---

## Testing Strategy

### Unit Tests (React Components)
```typescript
describe('FileUploadInput', () => {
  it('should validate file format on selection')
  it('should validate file size on selection')
  it('should display file name and size after selection')
  it('should clear file on remove button click')
  it('should show error messages for invalid files')
  it('should trigger upload on form submission')
})
```

### Integration Tests (Frontend + Backend)
```typescript
describe('File Upload Workflow', () => {
  it('should upload valid file and return attachment metadata')
  it('should reject oversized files with 400 error')
  it('should reject unsupported formats with 400 error')
  it('should store file in secure location')
  it('should link attachment to idea record')
})
```

### E2E Tests (Cypress)
```typescript
describe('File Upload E2E', () => {
  it('user can select file and upload with idea form')
  it('user sees progress while file uploads')
  it('user is redirected to dashboard after successful upload')
  it('user can see uploaded file in idea preview on dashboard')
  it('upload fails gracefully with network error')
})
```

### Manual QA Checklist
- [ ] Upload various valid file formats
- [ ] Attempt upload with files >10MB (rejected)
- [ ] Attempt upload with unsupported formats (rejected)
- [ ] Drag-and-drop single file
- [ ] Drag-and-drop multiple files (handle gracefully - single file expected)
- [ ] Slow network simulation - verify progress bar updates
- [ ] Cancel upload mid-process
- [ ] Upload from different browsers (Chrome, Firefox, Safari)
- [ ] Test on mobile (responsive file input)

---

## Estimated Effort Breakdown
- **Frontend Component & Validation:** 2-3 days
- **Backend Upload Endpoint:** 1-2 days
- **Database Setup:** 1 day
- **Testing (Unit + Integration + E2E):** 1-2 days
- **Refinements & Bug Fixes:** 0.5-1 day
- **Total:** 5-9 days (T-shirt: Medium-Large)

---

## Success Criteria (Before Deployment)
- ✅ All 10 acceptance criteria passing
- ✅ Code coverage >80% for file upload logic
- ✅ No security vulnerabilities in file handling
- ✅ Performance: File upload <30 sec for 10MB on 1Mbps
- ✅ All tests passing in CI/CD pipeline
- ✅ Code review approved by tech lead
- ✅ QA sign-off on manual test plan

---

**Related Stories:**
- [IDEA-story-1: Submission Form](IDEA-story-1.md)
- [IDEA-story-3: Dashboard](IDEA-story-3.md)
- [IDEA-story-6: Edit Functionality](IDEA-story-6.md)

**Created:** February 25, 2026  
**Last Updated:** February 25, 2026
