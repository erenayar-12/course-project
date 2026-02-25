# Epic 2: Idea Submission & Management System

**Epic ID:** EPIC-2  
**Project:** EPAM  
**Created:** February 24, 2026  
**Owner:** [TEAM LEAD NAME]  
**Status:** DRAFT

## Epic Title
Implementing Idea Submission Form and Idea Management Dashboard

## Description
Build a comprehensive idea submission system where authenticated EPAM employees can submit innovative ideas through a structured form, view their submitted ideas in a dashboard with filtering/sorting capabilities, and edit ideas while in "Submitted" status. This system captures structured idea data (title, description, category, attachments) and provides a centralized repository for all ideas.

## Primary Persona
**Persona:** Priya (Idea Submitter)  
**Why:** Primary user of submission system; most impacted by form usability and idea tracking  
**Impact:** Employees can easily contribute ideas and track them in one place

## Success Criteria

### Measurable Outcomes
- 2.5 ideas submitted per user per quarter (business goal)
- 95% of form submissions complete successfully (no errors)
- Average form completion time < 5 minutes
- 80% of submissions include file attachments (encourage adoption of full feature set)

### Definition of Done
- [x] Idea submission form created with validation
- [x] File upload handling (max 10MB, supported formats)
- [x] Form persists to PostgreSQL database
- [x] "My Ideas" dashboard displays all user's ideas
- [x] Sorting implemented (Date, Status, Category)
- [x] Filtering implemented (Status)
- [x] Idea detail page shows full info + attachment download
- [x] Edit functionality for ideas in "Submitted" status only
- [x] Duplicate idea detection (warning message)
- [x] Form validation tests
- [x] Database queries optimized (pagination for large idea lists)
- [x] E2E tests for submission flow

## Scope & Complexity

**Estimated Size:** M (Medium)

**Justification:** Involves multi-field form with validation, file upload handling, database schema design, and dashboard UI. Moderate complexity due to file handling and duplicate detection logic.

**Components Involved:**
- **Frontend:** React components (SubmissionForm, MyIdeasDashboard, IdeaDetailPage, EditForm)
- **Backend:** Express routes (POST /ideas, GET /ideas, GET /ideas/:id, PUT /ideas/:id), file upload middleware
- **Database:** Ideas table (id, userId, title, description, category, fileUrl, status, createdAt, updatedAt), file storage
- **File Storage:** Local filesystem or cloud storage (S3/Azure Blob)
- **Validation:** Client-side (React) and server-side (Express middleware)

## Dependencies

### Preconditions / Must Complete First
- **EPIC-1 must be complete:** User authentication required to determine current user for idea ownership
- Authentication endpoints must be functional
- Database schema for users exists

### External Dependencies
- **File Storage:** File upload service must be configured (S3, local filesystem, or similar)
- **Duplicate Detection:** Optional ML service or simple string similarity check

### Technical Debt
- Implement file size optimization for image uploads (compression in Phase 2)

## User Stories

> User stories for this epic will be created in the next phase using `/decompose-stories` command.

**Estimated Story Count:** 5-6 stories

**Estimated Story Breakdown:**
- STORY-EPIC-2.1: Create idea submission form with validation
- STORY-EPIC-2.2: Implement file upload handling
- STORY-EPIC-2.3: Create "My Ideas" dashboard with list view
- STORY-EPIC-2.4: Add sorting and filtering to idea list
- STORY-EPIC-2.5: Build idea detail page
- STORY-EPIC-2.6: Implement edit functionality for submitted ideas

## Acceptance Criteria (Epic Level)

- [x] Users can submit ideas with all required fields (title, description, category)
- [x] Users can optionally attach a file (max 10MB)
- [x] All submitted ideas appear immediately in "My Ideas" dashboard
- [x] Ideas can be filtered by status and sorted by multiple fields
- [x] Users can view complete idea details including attachment
- [x] Ideas in "Submitted" status can be edited; locked after workflow begins
- [x] Form validation prevents submission of required fields
- [x] 95% form submission success rate achieved in testing

## Risks & Mitigation

### Risk 1: File Upload Performance Issues
**Probability:** MEDIUM  
**Impact:** MEDIUM (poor user experience with large files)  
**Mitigation Strategy:** Implement chunked uploads; set reasonable file size limits; provide progress indicator

### Risk 2: Duplicate Ideas Not Caught
**Probability:** LOW  
**Impact:** LOW (low business impact, can improve in Phase 2)  
**Mitigation Strategy:** Implement basic string similarity check (Levenshtein distance); flag similar ideas as warning, not blocker

### Risk 3: Database Query Performance Slow with Large Idea Counts
**Probability:** LOW (at MVP scale)  
**Impact:** MEDIUM (scalability concern)  
**Mitigation Strategy:** Add database indexes on userId, status, createdAt; implement pagination from start

## Resources & Timeline

**Estimated Duration:** 3-4 weeks

**Team Skills Needed:**
- React developer (form UI, state management)
- Node.js backend developer (API routes, file handling)
- Database engineer (schema design, indexing, query optimization)

**Key Milestones:**
- Milestone 1: Idea submission form + validation complete - Week 1
- Milestone 2: File upload + database persistence working - Week 2
- Milestone 3: Dashboard + filtering/sorting implemented - Week 2-3
- Milestone 4: Edit functionality + testing complete - Week 3-4

## Notes & Assumptions

**Assumptions:**
- File storage will be on local filesystem initially (Phase 2: move to cloud storage)
- Average idea submission rate: 10/week (week 1) → 50/week (month 3)
- Duplicate detection sufficient with basic string matching
- Users have access to files they want to upload

**Design Considerations:**
- Form should guide users through submission (clear labels, helpful hints)
- Dashboard should be quick-loading even with 100+ ideas
- File upload should show progress to user

**Questions/Decisions Pending:**
- [ ] Should we support multiple attachments per idea or single file? (Assuming single file)
- [ ] What file formats should be supported? (PDF, DOC, DOCX, PNG, JPG assumed)
- [ ] Should idea title/description have character limits? (100 chars, 2000 chars assumed)

## Related Documents

- Link to PRD: [PRD-EPAM-Auth-Workflow](../prds/PRD-EPAM-Auth-Workflow.md#idea-submission-system)
- Link to Tech Stack: [agents.md](../../agents.md)
- Link to Design Spec: [To be created by design team]
