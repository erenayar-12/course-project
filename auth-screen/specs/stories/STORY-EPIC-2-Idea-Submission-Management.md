# User Stories: EPIC-2 - Idea Submission & Management System

**Epic:** EPIC-2  
**Generated Date:** February 25, 2026  
**Total Stories:** 6  
**Status:** DRAFT

---

## Story Overview

| Story ID | Title | Size | Priority | Status |
|----------|-------|------|----------|--------|
| STORY-2.1 | Create Idea Submission Form with Validation | M | P0 | Not Started |
| STORY-2.2 | Implement File Upload Handling | M | P0 | Not Started |
| STORY-2.3 | Create "My Ideas" Dashboard with List View | M | P1 | Not Started |
| STORY-2.4 | Add Sorting and Filtering to Idea List | S | P1 | Not Started |
| STORY-2.5 | Build Idea Detail Page | M | P1 | Not Started |
| STORY-2.6 | Implement Edit Functionality for Submitted Ideas | M | P2 | Not Started |

---

# STORY-2.1: Create Idea Submission Form with Validation

**Story ID:** STORY-2.1  
**Epic:** EPIC-2  
**Created:** February 25, 2026  
**Priority:** P0 (High)  
**Estimated Size:** M (Medium)  
**Owner:** [Developer Name]  
**Status:** DRAFT

## Title
Create Idea Submission Form with Client and Server Validation

## Description
As a **submitter**, I want to submit an innovative idea through a structured form so that my idea can be evaluated by the management team. The form should guide me through the submission process with clear labels, helpful hints, and validation to ensure all required information is provided before submission.

## Acceptance Criteria

### Functional Requirements
- [ ] Form displays all required fields: Title, Description, Category, and optional Attachments
- [ ] Form includes helpful labels and placeholder text for each field
- [ ] Client-side validation prevents submission with empty required fields
- [ ] Client-side validation enforces field limits:
  - Title: 3-100 characters
  - Description: 10-2000 characters
  - Category: required selection from dropdown
- [ ] Form displays clear error messages for each validation failure
- [ ] Form displays success message after successful submission
- [ ] Submitted data is persisted to PostgreSQL database
- [ ] User is redirected to "My Ideas" dashboard after successful submission
- [ ] Form can be submitted via Enter key or Submit button
- [ ] Form includes a Cancel button that clears all fields and confirms with user

### Non-Functional Requirements
- [ ] Form loads within 2 seconds
- [ ] Form is fully responsive (mobile, tablet, desktop)
- [ ] Form follows EPAM brand guidelines and design system
- [ ] Form handles network errors gracefully (displays error notification)
- [ ] Server validates all fields (no implicit client-side dependencies)
- [ ] Database insert includes proper error handling and rollback on failure

## Implementation Tasks

### Frontend (React/TypeScript)
- [ ] Create `SubmissionForm.tsx` component with form state management (React Hook Form or Formik)
- [ ] Implement Zod or Yup schema for client-side validation
- [ ] Create reusable form field components (TextField, TextArea, SelectField)
- [ ] Integrate form submission with API endpoint
- [ ] Add error handling and user feedback (toasts/notifications)
- [ ] Add loading state during form submission
- [ ] Style form with Tailwind CSS for responsive design
- [ ] Add keyboard event handlers (Enter to submit, Escape to cancel)

### Backend (Node.js/Express)
- [ ] Create POST `/api/ideas` endpoint
- [ ] Implement server-side request validation middleware
- [ ] Add authentication/authorization middleware (verify user token)
- [ ] Create database migrations for Ideas table schema:
  ```sql
  CREATE TABLE ideas (
    id UUID PRIMARY KEY,
    userId UUID NOT NULL REFERENCES users(id),
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'Submitted',
    createdAt TIMESTAMP DEFAULT NOW(),
    updatedAt TIMESTAMP DEFAULT NOW()
  );
  ```
- [ ] Implement Ideas repository/service layer for database operations
- [ ] Add request logging and error handling
- [ ] Return proper HTTP status codes (200, 400, 401, 500)

### Testing
- [ ] Unit tests for validation schema (client-side)
- [ ] Integration tests for form submission flow
- [ ] E2E tests for complete submission workflow (fill form → submit → verify database)
- [ ] Test validation error messages display correctly
- [ ] Test success notification displays after submission
- [ ] Test network error handling

## Technical Notes

### Dependencies
- React Hook Form or Formik (form state management)
- Zod or Yup (validation schema)
- Tailwind CSS (styling)
- Axios (HTTP client)
- PostgreSQL (database)

### Database Schema
```sql
CREATE TABLE ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50) NOT NULL,
  status VARCHAR(20) DEFAULT 'Submitted',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ideas_userId ON ideas(userId);
CREATE INDEX idx_ideas_status ON ideas(status);
```

### API Response Format
```json
{
  "success": true,
  "message": "Idea submitted successfully",
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "title": "string",
    "description": "string",
    "category": "string",
    "status": "Submitted",
    "createdAt": "2026-02-25T10:00:00Z",
    "updatedAt": "2026-02-25T10:00:00Z"
  }
}
```

### Field Validations
- **Title:** 3-100 characters, alphanumeric + spaces + common punctuation
- **Description:** 10-2000 characters, free text
- **Category:** Enum from predefined list (Innovation, Process Improvement, Cost Reduction, etc.)

## Definition of Done
- [ ] Code review completed and approved
- [ ] All unit tests passing (>80% coverage)
- [ ] All integration tests passing
- [ ] All E2E tests passing
- [ ] No console errors or warnings
- [ ] Responsive design verified on mobile/tablet/desktop
- [ ] Accessibility checks (WCAG 2.1 AA)
- [ ] Documentation updated
- [ ] Merged to main branch

---

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

# STORY-2.3: Create "My Ideas" Dashboard with List View

**Story ID:** STORY-2.3  
**Epic:** EPIC-2  
**Created:** February 25, 2026  
**Priority:** P1 (Medium)  
**Estimated Size:** M (Medium)  
**Owner:** [Developer Name]  
**Status:** DRAFT

## Title
Create "My Ideas" Dashboard with List View and Idea Status Display

## Description
As a **submitter**, I want to view all my submitted ideas in a centralized dashboard so that I can track the status of my ideas and manage them in one place. The dashboard should display a list of all my ideas with key information (title, status, submission date) and allow me to quickly see and interact with each idea.

## Acceptance Criteria

### Functional Requirements
- [ ] Dashboard displays all ideas submitted by current user
- [ ] Each idea in the list shows: Title, Status, Submission Date, Category
- [ ] Dashboard displays empty state message if no ideas exist
- [ ] Status badges are color-coded (Yellow=Submitted, Blue=Under Review, Green=Accepted, Red=Rejected)
- [ ] Ideas list is paginated (show 10 ideas per page)
- [ ] Pagination controls allow navigation between pages
- [ ] Clicking on an idea row navigates to idea detail page
- [ ] Dashboard shows total count of user's ideas
- [ ] Dashboard shows count breakdown by status (e.g., "3 Submitted, 2 Under Review, 1 Accepted")
- [ ] Dashboard is accessible only to authenticated users
- [ ] Dashboard loads data from backend API
- [ ] Loading state is displayed while data is being fetched
- [ ] Error state is displayed if data fetch fails

### Non-Functional Requirements
- [ ] Dashboard loads within 3 seconds with 100 ideas
- [ ] Dashboard is fully responsive (mobile, tablet, desktop)
- [ ] Dashboard follows EPAM brand guidelines and design system
- [ ] API query is optimized (use database indexes, pagination)
- [ ] Dashboard properly handles pagination edge cases

## Implementation Tasks

### Frontend (React/TypeScript)
- [ ] Create `MyIdeasDashboard.tsx` component
- [ ] Create `IdeaListItem.tsx` component for each list row
- [ ] Implement pagination logic (calculate total pages, handle page changes)
- [ ] Integrate with backend API (`GET /api/ideas?page=1&limit=10`)
- [ ] Add loading state display (skeleton loader or spinner)
- [ ] Add error state display with retry button
- [ ] Add empty state display with call-to-action ("Submit your first idea")
- [ ] Implement status badge styling with color coding
- [ ] Add click handlers for row navigation to detail page
- [ ] Display status statistics (count by status)
- [ ] Style with Tailwind CSS for responsive design

### Backend (Node.js/Express)
- [ ] Create GET `/api/ideas` endpoint with pagination support
- [ ] Implement query parameters: `page`, `limit`, `userId` (from auth token)
- [ ] Add authentication/authorization middleware
- [ ] Create service layer for fetching ideas with pagination
- [ ] Optimize database query with appropriate indexes
- [ ] Return paginated response with metadata:
  ```json
  {
    "success": true,
    "data": {
      "ideas": [...],
      "pagination": {
        "currentPage": 1,
        "totalPages": 5,
        "totalCount": 50,
        "limit": 10
      }
    }
  }
  ```
- [ ] Add request logging

### Testing
- [ ] Unit tests for pagination logic
- [ ] Integration tests for API endpoint with various page/limit combinations
- [ ] E2E tests for dashboard navigation and pagination
- [ ] Test empty state display
- [ ] Test loading and error states
- [ ] Test responsive design on different screen sizes

## Technical Notes

### API Endpoint
```
GET /api/ideas?page=1&limit=10
Authorization: Bearer <jwt_token>
```

### Database Query Optimization
```sql
SELECT id, title, status, category, createdAt 
FROM ideas 
WHERE userId = $1 
ORDER BY createdAt DESC 
LIMIT 10 OFFSET 0;
```

### Pagination Example
- Page 1, Limit 10: OFFSET 0
- Page 2, Limit 10: OFFSET 10
- Page 3, Limit 10: OFFSET 20

## Definition of Done
- [ ] Code review completed and approved
- [ ] All unit tests passing (>80% coverage)
- [ ] All integration tests passing
- [ ] All E2E tests passing
- [ ] No console errors or warnings
- [ ] Responsive design verified on mobile/tablet/desktop
- [ ] Pagination verified with various data sets
- [ ] Documentation updated
- [ ] Merged to main branch

---

# STORY-2.4: Add Sorting and Filtering to Idea List

**Story ID:** STORY-2.4  
**Epic:** EPIC-2  
**Created:** February 25, 2026  
**Priority:** P1 (Medium)  
**Estimated Size:** S (Small)  
**Owner:** [Developer Name]  
**Status:** DRAFT

## Title
Add Sorting and Filtering Capabilities to Idea List

## Description
As a **submitter**, I want to sort and filter my ideas list so that I can quickly find specific ideas and organize them by criteria important to me (date, status, category).

## Acceptance Criteria

### Functional Requirements
- [ ] Dashboard includes filter control for Status (All, Submitted, Under Review, Accepted, Rejected)
- [ ] Dashboard includes sort dropdown with options:
  - Date Created (Newest First)
  - Date Created (Oldest First)
  - Title (A-Z)
  - Title (Z-A)
  - Status
- [ ] Filter and sort controls are always visible and accessible
- [ ] Applied filters are displayed as active chips with remove button
- [ ] Applying filter/sort immediately updates list without page reload
- [ ] Clear All Filters button resets all filters
- [ ] Default sort is Date Created (Newest First)
- [ ] Pagination resets to page 1 when filter/sort changes
- [ ] URL query parameters are updated to reflect filter/sort state

### Non-Functional Requirements
- [ ] Filter/sort operations complete within 1 second
- [ ] Filter and sort controls are responsive on mobile devices
- [ ] URL state preservation allows bookmarking and sharing filtered views

## Implementation Tasks

### Frontend (React/TypeScript)
- [ ] Add filter controls UI to dashboard
- [ ] Add sort dropdown to dashboard
- [ ] Implement filter state management (useState or Redux)
- [ ] Implement sort state management
- [ ] Update API calls to include filter/sort parameters
- [ ] Add URL query parameter synchronization
- [ ] Display active filters as chips
- [ ] Implement clear filters functionality
- [ ] Handle URL parameter parsing on component mount

### Backend (Node.js/Express)
- [ ] Update GET `/api/ideas` endpoint to support query parameters:
  - `status` (filter by status)
  - `sortBy` (field to sort by)
  - `sortOrder` (asc/desc)
- [ ] Add validation for sort/filter parameters
- [ ] Update database query to apply filters and sorts
- [ ] Ensure query remains optimized with indexes

### Testing
- [ ] Unit tests for filter/sort logic
- [ ] Integration tests for API with filter/sort combinations
- [ ] E2E tests for UI filter/sort controls
- [ ] Test URL parameter preservation
- [ ] Test pagination reset on filter change

## Technical Notes

### API Query Parameters
```
GET /api/ideas?page=1&limit=10&status=Submitted&sortBy=createdAt&sortOrder=DESC
```

### Allowed Parameters
- `status`: "Submitted" | "Under Review" | "Accepted" | "Rejected"
- `sortBy`: "createdAt" | "title" | "status"
- `sortOrder`: "ASC" | "DESC"

## Definition of Done
- [ ] Code review completed and approved
- [ ] All unit tests passing
- [ ] All integration tests passing
- [ ] All E2E tests passing
- [ ] Documentation updated
- [ ] Merged to main branch

---

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

## Story Dependencies & Timeline

```
STORY-2.1 (Form Submission)
├─ STORY-2.2 (File Upload) [depends on 2.1]
└─ STORY-2.3 (Dashboard) [depends on 2.1]
   ├─ STORY-2.4 (Sort/Filter) [depends on 2.3]
   └─ STORY-2.5 (Detail Page) [depends on 2.3]
      └─ STORY-2.6 (Edit) [depends on 2.5]
```

### Recommended Implementation Order
1. **Week 1:** STORY-2.1 (Submission Form)
2. **Week 1-2:** STORY-2.2 (File Upload)
3. **Week 2:** STORY-2.3 (Dashboard)
4. **Week 2:** STORY-2.4 (Sort/Filter)
5. **Week 2-3:** STORY-2.5 (Detail Page)
6. **Week 3:** STORY-2.6 (Edit Functionality)

---

## Related Documents

- [EPIC-2-Idea-Submission-Management.md](EPIC-2-Idea-Submission-Management.md)
- [PRD-EPAM-Auth-Workflow.md](../prds/PRD-EPAM-Auth-Workflow.md)

---

**Status:** DRAFT (Ready for team review and estimation)  
**Generated:** February 25, 2026
