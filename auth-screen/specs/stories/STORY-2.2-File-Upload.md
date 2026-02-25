# STORY-2.2: Implement File Upload Handling

**Story ID:** STORY-2.2  
**Epic:** EPIC-2  
**Created:** February 25, 2026  
**Priority:** P0 (High)  
**Estimated Size:** M (Medium)  
**Owner:** [Developer Name]  
**Status:** DRAFT

## Title
Implement File Upload Handling with Validation and Storage

## Description
As a **submitter**, I want to optionally attach a file to my idea submission so that I can provide supporting documentation (PDF, Word docs, images, etc.) along with my idea. The system should validate file size and format before accepting the upload.

## Acceptance Criteria

### Functional Requirements
- [ ] File upload input accepts only supported formats: PDF, DOC, DOCX, PNG, JPG, JPEG, XLS, XLSX
- [ ] File size limit enforced: maximum 10MB per file
- [ ] System rejects files exceeding size limit with clear error message
- [ ] System rejects unsupported file formats with clear error message
- [ ] File attachment is optional (form can submit without file)
- [ ] File upload displays progress indicator showing upload percentage
- [ ] File name is displayed after selection before form submission
- [ ] User can remove selected file before submission
- [ ] Uploaded file is stored in secure location with unique name (prevents name collisions)
- [ ] File metadata (originalName, uploadedName, size, format, uploadedAt) is stored in database
- [ ] File is linked to idea record in database
- [ ] Malware scan is performed on uploaded file (if service available)
- [ ] Submitted form with file redirects to "My Ideas" dashboard

### Non-Functional Requirements
- [ ] File upload completes within 30 seconds (for 10MB file on 1Mbps connection)
- [ ] Upload progress updates at least every 1 second
- [ ] File storage is secure (restricted access, encrypted at rest if available)
- [ ] File storage path does not expose sensitive information
- [ ] System handles upload interruption gracefully (cleanup temporary files)
- [ ] Support for concurrent uploads (multiple users uploading simultaneously)

## Implementation Tasks

### Frontend (React/TypeScript)
- [ ] Create `FileUploadInput.tsx` component with drag-and-drop support
- [ ] Implement client-side file validation (size, format)
- [ ] Display file preview/selection before upload
- [ ] Integrate progress tracking with XMLHttpRequest or fetch API
- [ ] Add file removal button
- [ ] Display upload progress bar with percentage
- [ ] Show file size in human-readable format (KB, MB)
- [ ] Integrate file upload into `SubmissionForm.tsx`
- [ ] Handle upload errors and display appropriate messages

### Backend (Node.js/Express)
- [ ] Create POST `/api/ideas/:ideaId/upload` endpoint
- [ ] Implement multer middleware for file upload handling
- [ ] Add server-side file validation (MIME type, size, extension)
- [ ] Configure secure file storage directory with restricted permissions
- [ ] Implement file naming strategy (UUID prefix to prevent collisions)
- [ ] Create database migration for file metadata table:
  ```sql
  CREATE TABLE ideaAttachments (
    id UUID PRIMARY KEY,
    ideaId UUID NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
    originalFileName VARCHAR(255) NOT NULL,
    storedFileName VARCHAR(255) NOT NULL,
    fileSize INT NOT NULL,
    mimeType VARCHAR(50) NOT NULL,
    uploadedAt TIMESTAMP DEFAULT NOW()
  );
  ```
- [ ] Implement file cleanup on idea deletion
- [ ] Add request logging for upload events
- [ ] Return proper HTTP status codes

### Testing
- [ ] Unit tests for file validation logic (size, format)
- [ ] Integration tests for file upload endpoint
- [ ] E2E tests for complete upload workflow
- [ ] Test file size limit enforcement
- [ ] Test unsupported format rejection
- [ ] Test concurrent upload handling
- [ ] Test upload interruption/cancellation
- [ ] Test successful file persistence

## Technical Notes

### Dependencies
- multer (file upload middleware)
- file-type (MIME type detection)
- sharp (optional: image compression in Phase 2)
- PostgreSQL (metadata storage)

### File Storage Configuration
```javascript
// Multer configuration
const upload = multer({
  dest: 'uploads/ideas/',
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/png',
      'image/jpeg',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file format'));
    }
  }
});
```

### Database Schema
```sql
CREATE TABLE ideaAttachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ideaId UUID NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
  originalFileName VARCHAR(255) NOT NULL,
  storedFileName VARCHAR(255) NOT NULL,
  fileSize INT NOT NULL,
  mimeType VARCHAR(50) NOT NULL,
  uploadedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_attachments_ideaId ON ideaAttachments(ideaId);
```

### API Response Format
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "attachmentId": "uuid",
    "ideaId": "uuid",
    "originalFileName": "document.pdf",
    "fileSize": 2097152,
    "uploadedAt": "2026-02-25T10:00:00Z"
  }
}
```

## Definition of Done
- [ ] Code review completed and approved
- [ ] All unit tests passing (>80% coverage)
- [ ] All integration tests passing
- [ ] All E2E tests passing
- [ ] No console errors or warnings
- [ ] File storage verified and secured
- [ ] Upload progress tracking verified
- [ ] Documentation updated
- [ ] Merged to main branch

---

**Related Stories:**
- [STORY-2.1: Submission Form](STORY-2.1-Submission-Form.md)
- [STORY-2.3: Dashboard](STORY-2.3-Dashboard.md)
