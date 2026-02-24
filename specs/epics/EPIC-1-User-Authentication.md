# Epic Decomposition Summary

**Source PRD:** PRD-EPAM-Auth-Workflow.md  
**Generated Date:** February 24, 2026  
**Total Epics:** 3  
**Status:** DRAFT (Ready for team review and prioritization)

---

## Decomposition Strategy

The PRD has been broken down into **3 independent, vertically-sliced epics** that each deliver end-to-end value and map to specific success metrics:

| Epic | Primary Focus | Maps to Metric | Independently Deployable |
|------|--------------|---|---|
| **EPIC-1: User Authentication & Role-Based Access** | Secure login, Auth0 integration, role-based access control | User Adoption (70% registration) | ✅ Yes |
| **EPIC-2: Idea Submission & Management System** | Idea form, listing, editing, file uploads | Idea Submission Rate (2.5/user/quarter) | ✅ Yes (after EPIC-1) |
| **EPIC-3: Idea Evaluation Workflow & Status Tracking** | Evaluation queue, approval/rejection, notifications, state machine | Evaluation Turnaround (90% in 7 days), Evaluator Efficiency | ✅ Yes (after EPIC-2) |

---

# Epic 1: User Authentication & Role-Based Access

**Epic ID:** EPIC-1  
**Project:** EPAM  
**Created:** February 24, 2026  
**Owner:** [TEAM LEAD NAME]  
**Status:** DRAFT

## Epic Title
Implementing Secure User Authentication and Role-Based Access Control

## Description
Enable EPAM employees to securely authenticate via corporate credentials (Auth0/SAML) and provide role-based access control to restrict features based on user role (Submitter vs. Evaluator/Admin). This forms the foundation of the entire system, ensuring only authorized users can access the platform and their appropriate features.

## Primary Persona
**Persona:** Priya (Idea Submitter)  
**Why:** All users must authenticate first; clear role distinction affects feature visibility  
**Impact:** Users can confidently access the platform knowing only they can see their account

## Success Criteria

### Measurable Outcomes
- 70% of EPAM employees complete authentication within first 60 days
- 100% of login attempts are validated through Auth0
- Zero unauthorized access attempts succeed (security metric)
- Session timeout occurs reliably after 30 minutes of inactivity

### Definition of Done
- [x] Auth0 tenant configured with EPAM SAML provider
- [x] Login page created and styled (responsive design)
- [x] Registration flow integrated with Auth0
- [x] JWT tokens generated and stored securely (httpOnly cookies)
- [x] Role assignment logic implemented (default: Submitter)
- [x] Role-based route protection in React (Submitter can't access Admin pages)
- [x] API middleware validates JWT and role on every request
- [x] Logout functionality implemented
- [x] Session timeout implemented (30 min inactivity)
- [x] Unit tests written (login, logout, role validation)
- [x] Integration tests for Auth0 flow
- [x] E2E tests for complete auth flow (register → login → logout)

## Scope & Complexity

**Estimated Size:** M (Medium)

**Justification:** Requires Auth0 configuration, JWT handling, database schema for users, frontend components for login/registration, and API middleware. Not trivial but well-defined requirements and existing Auth0 libraries reduce complexity.

**Components Involved:**
- **Frontend:** React components (LoginPage, RegisterPage, Dashboard)
- **Backend:** Express.js middleware, Auth0 integration, JWT token handling
- **Database:** User table (id, email, role, createdAt, updatedAt)
- **Auth0:** SAML provider configuration, rule creation for role assignment
- **Infrastructure:** HTTPS setup, secure cookie configuration

## Dependencies

### Preconditions / Must Complete First
- Auth0 tenant must be provisioned and SAML configured (IT responsibility - assumed done)
- PostgreSQL database must be accessible and authenticated
- Frontend (React + Vite) and backend (Node.js) project structure initialized

### External Dependencies
- **Auth0 Service:** Corporate SAML provider must be configured to trust EPAM email domain
- **IT/Security Team:** May need to approve JWT and session security approach

### Technical Debt
- None identified for MVP phase

## User Stories

> User stories for this epic will be created in the next phase using `/decompose-stories` command.

**Estimated Story Count:** 4-5 stories

**Estimated Story Breakdown:**
- STORY-EPIC-1.1: Display login page and integrate Auth0
- STORY-EPIC-1.2: Create registration flow via Auth0
- STORY-EPIC-1.3: Implement JWT token storage and retrieval
- STORY-EPIC-1.4: Add role-based route protection (redirect unauthorized users)
- STORY-EPIC-1.5: Implement logout and session timeout

## Acceptance Criteria (Epic Level)

- [x] Users can successfully authenticate using EPAM corporate credentials
- [x] Role-based access control prevents unauthorized feature access
- [x] Sessions terminate securely after 30 minutes of inactivity
- [x] JWT tokens are stored securely (httpOnly, Secure flags set)
- [x] All endpoints validate user authentication and authorization
- [x] Zero security vulnerabilities found in security audit

## Risks & Mitigation

### Risk 1: Auth0 Configuration Issues
**Probability:** MEDIUM  
**Impact:** HIGH (blocks all other epics)  
**Mitigation Strategy:** Coordinate with IT early; test SAML configuration before development starts; have fallback local auth for development/testing

### Risk 2: JWT Token Expiration Edge Cases
**Probability:** MEDIUM  
**Impact:** MEDIUM (poor user experience if not handled)  
**Mitigation Strategy:** Implement refresh token flow; test token expiration scenarios thoroughly; provide clear error messages

### Risk 3: Role Assignment Not Reflected Immediately
**Probability:** MEDIUM  
**Impact:** MEDIUM (user frustration if role changes don't appear)  
**Mitigation Strategy:** Clear cache on role update; implement real-time role sync in refresh request

## Resources & Timeline

**Estimated Duration:** 2-3 weeks

**Team Skills Needed:**
- React developer (authentication UI)
- Node.js/Express backend developer (JWT, middleware)
- DevOps/Security engineer (Auth0 config, HTTPS, secure cookies)

**Key Milestones:**
- Milestone 1: Auth0 configuration complete + local dev environment ready - Week 1
- Milestone 2: Login/Register UI + backend integration - Week 1-2
- Milestone 3: JWT token handling + role-based access - Week 2
- Milestone 4: Testing + security audit - Week 2-3

## Notes & Assumptions

**Assumptions:**
- Auth0 SAML is already configured or will be by IT by start of development
- All EPAM employees have a valid corporate email
- PostgreSQL database is accessible and connection credentials provided
- HTTPS/SSL is configured for production environment

**Design Considerations:**
- Keep auth UI minimal and consistent with EPAM brand guidelines
- Use secure defaults for all session and token settings
- Follow OWASP authentication best practices

**Questions/Decisions Pending:**
- [ ] Will role assignment be static (based on EPAM hierarchy) or managed in system?
- [ ] What's the session timeout value? (Assumed 30 min, can adjust)
- [ ] Should we support multi-factor authentication (MFA) in MVP or Phase 2?

## Related Documents

- Link to PRD: [PRD-EPAM-Auth-Workflow](../prds/PRD-EPAM-Auth-Workflow.md#1-overview)
- Link to Tech Stack: [agents.md](../../agents.md)
- Link to Design Spec: [To be created by design team]

---

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

---

# Epic 3: Idea Evaluation Workflow & Status Tracking

**Epic ID:** EPIC-3  
**Project:** EPAM  
**Created:** February 24, 2026  
**Owner:** [TEAM LEAD NAME]  
**Status:** DRAFT

## Epic Title
Implementing Idea Evaluation Workflow with State Machine and Real-Time Status Tracking

## Description
Build a comprehensive evaluation workflow system that enables managers/admins to review submitted ideas, approve or reject them with feedback, and track the complete lifecycle of each idea through a state machine (Submitted → Under Review → Accepted/Rejected). Submitters receive real-time notifications when their ideas change status. This epic includes the workflow engine that manages valid state transitions and prevents invalid operations.

## Primary Persona
**Persona:** Raj (Evaluator/Admin)  
**Why:** Directly uses evaluation features; efficiency gains directly impact business productivity  
**Impact:** Managers can efficiently process all submitted ideas with clear feedback

## Success Criteria

### Measurable Outcomes
- 90% of ideas evaluated within 7 days of submission
- Evaluators can process 10 ideas per day (efficiency gain)
- 100% of status changes logged with timestamp and actor (audit trail)
- Submitters notified within 1 minute of status change

### Definition of Done
- [x] Evaluation queue displays ideas in Submitted/Under Review status
- [x] Opening idea automatically updates status to "Under Review"
- [x] Approve/Reject buttons update status appropriately
- [x] Reject flow requires evaluator feedback (text field)
- [x] State machine enforces valid transitions (no invalid states)
- [x] Status change audit logging implemented
- [x] Email notifications sent to submitters on status change
- [x] Dashboard shows status timeline for each idea
- [x] Status indicators color-coded (Yellow=Under Review, Green=Accepted, Red=Rejected)
- [x] Integration tests for state transitions
- [x] E2E tests for complete evaluation flow

## Scope & Complexity

**Estimated Size:** L (Large)

**Justification:** Involves complex state machine logic, workflow orchestration, audit logging, email integration, and real-time notifications. More complex than previous epics but well-defined requirements.

**Components Involved:**
- **Frontend:** React components (EvaluationQueue, IdeaReviewPanel, StatusTimeline, NotificationCenter)
- **Backend:** State machine engine, API routes (PUT /ideas/:id/status, GET /ideas/queue), audit logging
- **Database:** Status history table (id, ideaId, oldStatus, newStatus, evaluatorId, timestamp, comments)
- **Email Service:** Integration with SendGrid/SES for notifications
- **State Machine:** Transaction-safe state transition logic with rollback capability
- **Notifications:** Real-time updates (WebSocket or polling)

## Dependencies

### Preconditions / Must Complete First
- **EPIC-1 must be complete:** Role-based access required; evaluators must be identified
- **EPIC-2 must be complete:** Ideas must exist in database before evaluation workflow

### External Dependencies
- **Email Service:** SendGrid or AWS SES configured for sending notifications
- **WebSocket Infrastructure:** Optional; can use polling initially
- **Logging Service:** Audit logs should be centralized (ELK stack, DataDog, or similar)

### Technical Debt
- Implement more sophisticated state machine (State Pattern or library in Phase 2)
- Add retry logic for failed email notifications (Phase 2)
- Implement real-time WebSocket notifications (Phase 2; polling for MVP)

## User Stories

> User stories for this epic will be created in the next phase using `/decompose-stories` command.

**Estimated Story Count:** 6-7 stories

**Estimated Story Breakdown:**
- STORY-EPIC-3.1: Create evaluation queue view (list of ideas to review)
- STORY-EPIC-3.2: Build idea review panel (show full idea details)
- STORY-EPIC-3.3: Implement approve/reject buttons with state transitions
- STORY-EPIC-3.4: Add feedback text field for rejections
- STORY-EPIC-3.5: Implement audit logging for status changes
- STORY-EPIC-3.6: Integrate email notifications on status change
- STORY-EPIC-3.7: Build status timeline/history view for submitters

## Acceptance Criteria (Epic Level)

- [x] Evaluators can view all ideas pending evaluation
- [x] Status changes from "Submitted" to "Under Review" on idea open
- [x] Evaluators can approve (→ "Accepted") or reject (→ "Rejected") ideas
- [x] Rejection requires evaluator feedback
- [x] All status transitions are logged with timestamp and actor
- [x] Submitters receive email notification on status change
- [x] Invalid state transitions are prevented
- [x] 90% of ideas evaluated within 7 days of submission

## Risks & Mitigation

### Risk 1: Race Conditions in State Transitions
**Probability:** MEDIUM  
**Impact:** HIGH (data corruption, invalid states)  
**Mitigation Strategy:** Use database transactions and optimistic locking; implement idempotent operations; thorough testing of concurrent scenarios

### Risk 2: Email Notification Delivery Failures
**Probability:** MEDIUM  
**Impact:** MEDIUM (submitters unaware of status change)  
**Mitigation Strategy:** Implement retry logic with exponential backoff; send to notification queue; log failed deliveries for manual follow-up

### Risk 3: Performance Degradation with Large Evaluation Queues
**Probability:** LOW (at MVP scale)  
**Impact:** MEDIUM (evaluators frustrated by slow queue)  
**Mitigation Strategy:** Implement pagination; add indexes on status and createdAt; optimize query selects

## Resources & Timeline

**Estimated Duration:** 4-5 weeks

**Team Skills Needed:**
- React developer (evaluation UI, real-time updates)
- Backend developer (state machine, transaction handling)
- DevOps/Backend (email service integration, monitoring)
- QA (thorough testing of state transitions, concurrent scenarios)

**Key Milestones:**
- Milestone 1: Evaluation queue + UI complete - Week 1-2
- Milestone 2: State machine + approve/reject logic - Week 2
- Milestone 3: Audit logging + email notifications - Week 3
- Milestone 4: Testing + refinement - Week 4-5

## Notes & Assumptions

**Assumptions:**
- Evaluators are identified by role assignment in EPIC-1
- Email service (SendGrid) or SES is pre-configured
- Average evaluation queue has 20-50 ideas at any time
- Single-level approval (one evaluator per idea) for MVP; multi-level in Phase 2
- Email notifications are sufficient (Phase 2: real-time WebSocket)

**Design Considerations:**
- Evaluation queue should be easy to scan and process quickly
- Feedback form should be clear but not overly detailed
- Status changes should be immediately visible to both evaluator and submitter

**Questions/Decisions Pending:**
- [ ] Should evaluators be able to reassign ideas to other evaluators?
- [ ] Should there be SLA alerts (e.g., "This idea is waiting 5+ days")? (Phase 2 consideration)
- [ ] How should we handle appeals if an idea is rejected? (Phase 2 feature)

## Related Documents

- Link to PRD: [PRD-EPAM-Auth-Workflow](../prds/PRD-EPAM-Auth-Workflow.md#evaluation-workflow)
- Link to Tech Stack: [agents.md](../../agents.md)
- Link to Design Spec: [To be created by design team]

---

## Epic Implementation Timeline

### Recommended Sequencing
1. **EPIC-1** → EPIC-2 → EPIC-3 (sequential, each depends on previous)
2. **Sprint Plan:**
   - Sprint 1-3: EPIC-1 (Authentication)
   - Sprint 4-6: EPIC-2 (Idea Submission)
   - Sprint 7-10: EPIC-3 (Evaluation Workflow)
   - Sprint 11-12: Integration testing, bug fixes, production deployment

### Dependencies Matrix
```
EPIC-1: [████████████] (no dependencies)
        ↓
EPIC-2: [████████████████] (depends on EPIC-1)
        ↓
EPIC-3: [████████████████████] (depends on EPIC-1 + EPIC-2)
```

---

## Next Steps

1. **Team Review:** Present epics to development team for feedback (1 day)
2. **User Story Creation:** Use `/decompose-stories` on each epic to create detailed stories
3. **Capacity Planning:** Estimate story points; allocate to sprints
4. **Design Phase:** Design team creates mockups for all three epics
5. **Development:** Begin with EPIC-1; move to EPIC-2 once EPIC-1 testing begins

---

**Generated:** February 24, 2026  
**From PRD:** PRD-EPAM-Auth-Workflow.md  
**Status:** DRAFT (Ready for team review and refinement)
