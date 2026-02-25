# IDEA-story-2 Clarification Questions

**Story ID:** IDEA-story-2  
**Title:** Implement File Upload Handling with Validation and Storage  
**Generated:** February 25, 2026  
**Status:** PENDING TEAM CLARIFICATION

---

## Critical Questions (MUST ANSWER BEFORE CODING)

### 1. **File Storage Location - Local vs Cloud**
**Current Spec:** "Local filesystem (development) / S3 or cloud storage (production)"

**Questions:**
- [ ] Should MVP use local filesystem or cloud storage (S3, Azure Blob)?
- [ ] If local filesystem:
  - [ ] Safe to expose upload directory via static serving?
  - [ ] What's the directory path? (`/uploads/`, `./storage/`, `/var/uploads/`?)
  - [ ] Is the directory version-controlled or .gitignored?
- [ ] If cloud (S3/Azure):
  - [ ] AWS credentials management? (environment variables, IAM roles?)
  - [ ] Which region? (us-east-1, closest to deployment?)
- [ ] Backup strategy for uploaded files? (Phase 1 or Phase 2?)

**Decision:** ___________________________

---

### 2. **Supported File Formats - Extensible or Fixed?**
**Current Spec:** "PDF, DOC, DOCX, PNG, JPG, JPEG, XLS, XLSX"

**Questions:**
- [ ] Are these formats fixed or should admins configure them? (Phase 2?)
- [ ] Should we support additional formats? (e.g., PPT, TXT, CSV?)
- [ ] Should MIME type validation be strict or permissive?
  - [ ] Strict: Check magic bytes + file extension match?
  - [ ] Permissive: Trust file extension, check MIME type header?
- [ ] Should video/audio be supported? (assume no for MVP)
- [ ] Compressed archives (.zip, .rar) - allowed or blocked?

**Decision:** ___________________________

---

### 3. **File Size Limit - Single or Total?**
**Current Spec:** "10MB per file"

**Questions:**
- [ ] Is 10MB the limit per file or total per idea?
- [ ] Should users be able to upload multiple files per idea, or one file only?
- [ ] If multiple files, should we enforce:
  - [ ] Max 5 files per idea?
  - [ ] 50MB total per idea?
- [ ] Should file size limit be configurable by admins? (Phase 2?)
- [ ] How to show users their remaining upload quota? (if total limit)

**Decision:** ___________________________

---

### 4. **Multiple File Upload - Allowed or Single File Only?**
**Current Spec:** "File attachment (singular)"

**Questions:**
- [ ] Should users upload ONE file per idea or MULTIPLE files?
- [ ] If multiple files:
  - [ ] Sequential uploads or parallel uploads?
  - [ ] Progress bar per file or aggregate progress?
  - [ ] Ability to remove individual files from a batch?
- [ ] If one file: Can user replace an uploaded file? (delete + reupload?)
- [ ] Should users see file upload history? (all previous uploads?)

**Decision:** ___________________________

---

### 5. **File Naming & Security**
**Current Spec:** "UUID prefix to prevent collisions"

**Questions:**
- [ ] Naming strategy: `uuid-originalname.ext` or `uuid.ext` (loses context)?
- [ ] Should original filename be preserved in database for display?
- [ ] Should uploaded files be accessible directly (e.g., `/uploads/file.pdf`) or behind auth?
- [ ] Should file URLs be time-limited (signed URLs, S3 presigned URLs)?
- [ ] Should file downloads be logged/audited?

**Decision:** ___________________________

---

### 6. **Virus Scanning - MVP or Phase 2?**
**Current Spec:** "Malware scan is performed on uploaded file (if service available)"

**Questions:**
- [ ] Include virus scanning in MVP?
- [ ] If yes:
  - [ ] Which service? (ClamAV, VirusTotal, AWS Macie?)
  - [ ] Synchronous (block upload until scan done) or async (scan after)?
  - [ ] Action if malware detected? (delete file, quarantine, notify user/admin?)
- [ ] If no (defer to Phase 2): Should files be flagged as "unscanned"?
- [ ] Do we need legal disclaimer? ("Files not scanned for viruses")

**Decision:** ___________________________

---

### 7. **Upload Progress & Cancellation**
**Current Spec:** "Progress bar displays showing upload percentage"

**Questions:**
- [ ] If user cancels upload mid-process:
  - [ ] Abort the HTTP request?
  - [ ] Delete partial file from server?
  - [ ] Show "Upload cancelled" message?
- [ ] If upload fails mid-process (network interruption):
  - [ ] Auto-retry? (how many times, with backoff?)
  - [ ] Allow user to manually retry?
  - [ ] Clean up partial files automatically?
- [ ] Progress updates: How frequently? (every byte, 100ms throttle?)
- [ ] Should estimated time remaining be shown?

**Decision:** ___________________________

---

### 8. **File Metadata Requirements**
**Current Spec:** "original name, stored name, size, MIME type, upload timestamp"

**Questions:**
- [ ] Should we also store/track:
  - [ ] Virus scan status & timestamp?
  - [ ] File approval/rejection status? (by admin, Phase 2?)
  - [ ] File description/notes? (user-entered notes about the file?)
  - [ ] File tags? (categorization, auto-generated or user-entered?)
- [ ] Should files be linked to idea creator only or to multiple users?
- [ ] Retention policy: How long to keep deleted idea files? (7 days? 30 days? forever?)

**Decision:** ___________________________

---

### 9. **Error Handling & User Feedback**
**Current Spec:** Lists validation errors but lacks specificity

**Questions:**
- [ ] For each error scenario:
  - [ ] Toast notification, inline error, modal, or multiple?
  - [ ] Auto-dismiss or require user action?
  - [ ] Log errors to server analytics?
- [ ] Specific error messages:
  - [ ] "File size 15MB exceeds 10MB limit. Please select a smaller file."  →  or simpler?
  - [ ] "File format XYZ not supported. Allowed: PDF, DOC, DOCX, PNG, JPG, JPEG, XLS, XLSX."  →  or abbreviated?
- [ ] Should errors persist after form submission or clear?
- [ ] Permission error (not idea owner): What message?

**Decision:** ___________________________

---

### 10. **Upload Endpoint & Authentication**
**Current Spec:** "POST /api/ideas/:ideaId/upload"

**Questions:**
- [ ] Authentication: JWT token required? (assume yes)
- [ ] Authorization: Only idea creator can upload files for their idea? (assume yes)
- [ ] Should endpoint accept file + metadata in single request or separate requests?
- [ ] Should endpoint return:
  - [ ] Full attachment object?
  - [ ] Minimal data (just attachment ID)?
  - [ ] Link to view/download file?
- [ ] Rate limiting: How many uploads per user per minute? (prevent spam?)

**Decision:** ___________________________

---

## Nice-to-Have Clarifications

### 11. **File Preview/Thumbnail Generation**
- [ ] Generate thumbnails for images? (resize, crop?)
- [ ] Generate thumbnails for PDFs? (first page preview?)
- [ ] UI: Show preview thumbnail in form before upload?
- [ ] UI: Show preview in dashboard idea card?

**Decision:** ___________________________

---

### 12. **Download & Sharing**
- [ ] Can users download their uploaded files?
- [ ] Can admin/evaluator download files for review?
- [ ] Can users share file access with other users? (Phase 2?)
- [ ] Should downloads be logged/tracked?

**Decision:** ___________________________

---

### 13. **File Versioning**
- [ ] Can users upload a new version of a file? (replace or version history?)
- [ ] If versioning: Show upload history (all previous versions)?
- [ ] Should old versions be kept or deleted after new version?
- [ ] Can evaluators comment on specific file versions? (Phase 2?)

**Decision:** ___________________________

---

### 14. **Drag & Drop UX Details**
- [ ] Drag & drop over entire form area or specific zone?
- [ ] Visual feedback: Border highlight, color change, or overlay?
- [ ] Handle drag-over of multiple files: Accept first or show error?
- [ ] Should there be a "click here to browse" fallback in addition to drag-drop?

**Decision:** ___________________________

---

### 15. **Mobile File Upload Experience**
- [ ] File picker: Native file app or use camera/gallery for images?
- [ ] On mobile, should file upload launch after idea form completion or concurrent?
- [ ] Progress bar: Fixed position or scrollable with form?
- [ ] File removal on mobile: Swipe gesture or button tap?

**Decision:** ___________________________

---

### 16. **File Encryption & Privacy**
- [ ] Should files be encrypted at rest? (AWS S3 SSE, AES-256?)
- [ ] Should files be encrypted in transit? (HTTPS, assume yes?)
- [ ] Compliance requirements? (GDPR file handling, data retention, export rights?)
- [ ] User right to delete: Should users be able to delete their uploaded files?

**Decision:** ___________________________

---

### 17. **Admin File Management (Phase 1 or 2?)**
- [ ] Should admins see all uploaded files in a central location?
- [ ] Should admins be able to delete user files?
- [ ] Should admins see upload audit trail? (who, when, what file?)
- [ ] Should admins set policies? (allowed formats, size limits per role?)

**Decision:** ___________________________

---

### 18. **Quota & Storage Limits**
- [ ] Per-user upload quota? (e.g., 100MB total across all ideas?)
- [ ] Per-organization quota? (total team storage?)
- [ ] Exceed quota: Show warning message or block upload?
- [ ] Should storage usage be visible in user profile/dashboard?

**Decision:** ___________________________

---

### 19. **Database Cleanup & Orphaned Files**
- [ ] When idea is deleted: Delete associated files immediately or soft-delete?
- [ ] When user uploads file but never submits idea: Cleanup orphaned files? (when? after how long?)
- [ ] Disk space monitoring: Should we alert if uploads exceed storage limit?

**Decision:** ___________________________

---

### 20. **Testing Environment**
- [ ] For testing: Should mock file uploads (no real disk write) or use real storage?
- [ ] Test fixtures: Generate test files dynamically or check in sample PDFs?
- [ ] E2E tests: Use small files (1KB) or realistic sizes (5MB+)?
- [ ] Performance load testing: Upload many files in parallel?

**Decision:** ___________________________

---

## Dependencies & Blockers

### From IDEA-story-1 (Submission Form)
- ✅ Form component must exist before file upload integrates
- ✅ Database `ideas` table must exist for foreign key reference
- ⚠️ Form submission flow must be finalized (file required or optional?)

### From Authentication (EPIC-1)
- ✅ JWT token + user context available for authorization
- ⚠️ User identity persisted to database (for `uploadedBy` field)

### Potential Blockers
- ❓ Backend API route structure (Express routes vs Next.js API routes?)
- ❓ File storage infrastructure setup (local dir creation, S3 bucket provisioning?)
- ❓ Environment configuration strategy (.env, secrets management?)

---

## Assumptions (If Not Answered)

1. **Default Assumption:** Single file upload per idea (not multiple)
2. **Default Assumption:** Local filesystem for MVP (not cloud storage)
3. **Default Assumption:** No virus scanning in MVP (Phase 2)
4. **Default Assumption:** File download accessible to idea creator + evaluators only
5. **Default Assumption:** File retention: Keep forever (no auto-delete)
6. **Default Assumption:** No file versioning (replace overwrites)
7. **Default Assumption:** Progress updates throttled to ~100ms intervals

---

## Sign-Off

**Developer Questions Recorded By:** ___________________________  
**Tech Lead Review Date:** ___________________________  
**Answers Provided By:** ___________________________  
**All Clarifications Resolved:** ☐ YES   ☐ NO

**Notes:**
```
[Add any additional context, decisions, or follow-ups here]
```

---

**Last Updated:** February 25, 2026  
**Status:** Ready for tech lead review and team discussion
