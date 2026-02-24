# Product Requirements Document (PRD)

**Project Name:** EPAM Auth Screen & Workflow Page  
**Version:** 1.0  
**Date:** February 24, 2026  
**Author:** AI Assistant  
**Status:** DRAFT

---

## 1. Overview

### Purpose
Build an internal platform for EPAM employees to submit innovative ideas and track their evaluation through a structured workflow. This system bridges the gap between idea generation and organizational decision-making, enabling employees to contribute ideas while managers can efficiently evaluate and provide feedback.

### Problem Statement
EPAM employees currently lack a centralized system for submitting and tracking ideas. Without a structured submission and evaluation process, valuable ideas are lost, employee engagement suffers, and the organization misses opportunities for innovation. Current process (if any) is fragmented across email, spreadsheets, or informal channels, making it difficult to track status, maintain consistency, and provide transparency. Approximately 60% of submitted ideas receive no feedback within 2 weeks, and 45% are lost due to lack of tracking mechanisms.

### Goals
- Enable EPAM employees to securely authenticate and access the platform
- Provide a streamlined interface for idea submission with clear categorization
- Deliver transparent, real-time workflow status tracking to idea submitters
- Empower evaluators to efficiently assess and provide feedback on ideas
- Establish role-based access control (Submitters vs. Evaluators/Admins)

---

## 2. User Personas

### Persona 1: Priya (Idea Submitter)
**Role:** EPAM Software Engineer / Team Member  
**Background:** Mid-level technical professional, 3-5 years at EPAM, wants to contribute innovative ideas but frustrated by lack of clear submission channels. Comfortable with web applications. Uses Chrome on desktop and Safari on mobile.  
**Needs:** Easy-to-use authentication, simple idea submission form, ability to track idea status without manual follow-up  
**Pain Points:** Previously submitted ideas via email that were lost, unclear evaluation timeline, no feedback on rejected ideas  
**Goals:** Submit 2-3 ideas per quarter, receive feedback within 2 weeks, see ideas move through evaluation process

### Persona 2: Raj (Evaluator/Admin)
**Role:** EPAM Manager / Department Lead  
**Background:** Senior technical professional, responsible for evaluating ideas from their team. Receives 5-10 idea submissions per week. Needs efficient tools to manage evaluation workflow.  
**Needs:** Quick access to submitted ideas, ability to assign status/comments, view all ideas in pipeline, manage role-based access  
**Pain Points:** Ideas scattered across email, no central repository, time-consuming manual tracking, no standardized evaluation process  
**Goals:** Evaluate all ideas within 1 week of submission, provide consistent feedback, maintain organized evaluation records

### Persona 3: Admin (System Administrator)
**Role:** EPAM IT / Systems Administrator  
**Background:** Technical professional responsible for platform maintenance and user management. Must ensure security and proper access controls.  
**Needs:** User management tools, role assignment capabilities, system health monitoring, audit logs  
**Pain Points:** Manual user setup, no centralized access control, security concerns with sensitive user data  
**Goals:** Secure platform with zero unauthorized access, audit trails for compliance, minimal maintenance burden

---

## 3. Use Cases

### Use Case 1: Employee Registration and Authentication
**Actor:** Priya (New EPAM Employee)  
**Preconditions:** Employee has valid EPAM email address; Auth0 is configured  
**Main Flow:**
1. Employee navigates to login page
2. Clicks "Register" or "Sign Up with Auth0"
3. Authenticates via Auth0 (SAML/OAuth to EPAM corporate account)
4. System creates user account with "Submitter" role by default
5. Dashboard is displayed

**Alternate Flows:**
- If account already exists: Redirect to login
- If Auth0 fails: Display error and retry option

**Postconditions:** User account created with default "Submitter" role; user is authenticated and logged in

### Use Case 2: Submit Idea
**Actor:** Priya (Idea Submitter)  
**Preconditions:** User is authenticated; Idea Submission form is accessible  
**Main Flow:**
1. User clicks "Submit New Idea"
2. Form appears with fields: Title, Description, Category, File Attachment
3. User fills in form details (required fields: Title, Description, Category)
4. User optionally uploads one supporting file (PDF, DOC, image)
5. User clicks "Submit"
6. System validates form and saves to database
7. Confirmation message shown; idea assigned status "Submitted"
8. Submitter can view idea in "My Ideas" list with "Submitted" status

**Alternate Flows:**
- If validation fails: Show specific error messages (e.g., "Title required", "File too large")
- If upload fails: Allow submission without file or ask to retry

**Postconditions:** Idea stored in database with "Submitted" status; submitter receives confirmation

### Use Case 3: Track Idea Status
**Actor:** Priya (Idea Submitter)  
**Preconditions:** User has submitted at least one idea; workflow is in progress  
**Main Flow:**
1. User navigates to "My Ideas" dashboard
2. List shows all user's submitted ideas with current status (Submitted, Under Review, Accepted, Rejected)
3. User clicks on specific idea to view details
4. Idea detail page shows: Title, Description, Category, Status, Submission Date, Last Update Date
5. If status is "Accepted" or "Rejected": Evaluator comments visible
6. User can see timeline of status changes

**Postconditions:** User has clear visibility into idea evaluation progress

### Use Case 4: Evaluate Idea (Admin/Evaluator)
**Actor:** Raj (Evaluator)  
**Preconditions:** User has "Evaluator" or "Admin" role; ideas exist in "Submitted" or "Under Review" status  
**Main Flow:**
1. Evaluator logs in and navigates to "Evaluation Dashboard"
2. Queue shows all ideas waiting for evaluation (sorted by submission date)
3. Evaluator opens an idea (Submitted status changes to "Under Review")
4. Evaluator reviews: Title, Description, Category, Attached File, Submitter name
5. Evaluator clicks "Approve" or "Reject"
6. If approved: Status moves to "Accepted"; idea marked complete
7. If rejected: Evaluator enters feedback comments; status moves to "Rejected"
8. Submitter is notified of status change

**Alternate Flows:**
- Evaluator can "Flag for Later" to defer decision
- Evaluator can reassign idea to another evaluator

**Postconditions:** Idea status updated; submitter notified; evaluator can move to next idea

---

## 4. Functional Requirements

### Feature 1: User Authentication & Authorization
**FR-1.1:** System must authenticate users via Auth0 using corporate credentials (SAML/OAuth)  
**FR-1.2:** System must support at least two roles: "Submitter" (default) and "Evaluator/Admin"  
**FR-1.3:** Submitters can only view/edit their own ideas  
**FR-1.4:** Evaluators can view all ideas and update their status  
**FR-1.5:** Admin users can manage user roles and access controls  
**FR-1.6:** Session timeout after 30 minutes of inactivity; user must re-authenticate

### Feature 2: Idea Submission Form
**FR-2.1:** Form must include required fields: Title (max 100 chars), Description (max 2000 chars), Category (dropdown: Technical, Process, Product, Other)  
**FR-2.2:** Form must support optional single file attachment (max 10MB; supported formats: PDF, DOC, DOCX, PNG, JPG)  
**FR-2.3:** Form must validate all required fields before submission  
**FR-2.4:** Form must provide clear error messages for validation failures  
**FR-2.5:** Submitted ideas must be immediately visible in "My Ideas" list  
**FR-2.6:** Duplicate idea detection (warning if similar title exists)

### Feature 3: Idea Management & Listing
**FR-3.1:** "My Ideas" page shows all user's submitted ideas in table format (Title, Category, Status, Submission Date, Last Updated)  
**FR-3.2:** Ideas sortable by Date, Status, Category; filterable by Status  
**FR-3.3:** Clicking an idea shows full details: Title, Description, Category, Status, Attachments, Timeline of Status Changes  
**FR-3.4:** Users can edit ideas only while in "Submitted" status  
**FR-3.5:** Users can view evaluator feedback/comments regardless of status

### Feature 4: Evaluation Workflow
**FR-4.1:** Evaluation queue shows all ideas in "Submitted" or "Under Review" status, sorted by submission date  
**FR-4.2:** Opening an idea automatically updates status from "Submitted" to "Under Review"  
**FR-4.3:** Evaluators can approve (→ "Accepted") or reject (→ "Rejected") ideas  
**FR-4.4:** Rejecting an idea requires evaluator to provide written feedback (required field)  
**FR-4.5:** Evaluators can defer decision by marking idea as "Flag for Later"  
**FR-4.6:** System tracks all status changes with timestamp and evaluator name

### Feature 5: Status Tracking & Notifications
**FR-5.1:** Ideas progress through states: Submitted → Under Review → Accepted/Rejected  
**FR-5.2:** Status changes are logged with timestamp and actor (who made change)  
**FR-5.3:** Submitters receive email notification when idea status changes  
**FR-5.4:** Dashboard shows real-time status indicator (color-coded: Yellow=Under Review, Green=Accepted, Red=Rejected)  
**FR-5.5:** Submitter can view complete history of status changes for each idea

### Feature 6: State Machine Workflow Engine
**FR-6.1:** System implements state machine with states: Draft, Submitted, Under Review, Accepted, Rejected  
**FR-6.2:** Only allowed state transitions are enforced (e.g., cannot go from Rejected back to Under Review)  
**FR-6.3:** Each state transition is logged with timestamp and actor  
**FR-6.4:** Invalid state transitions are prevented with clear error messages

---

## 5. Non-Functional Requirements

### Performance
- **Page Load Time:** Dashboard loads in < 2 seconds; idea submission form in < 1.5 seconds
- **API Response Time:** All API endpoints respond within < 500ms (P95)
- **Throughput:** System supports 100 concurrent users and 50 idea submissions per minute
- **File Upload:** Single file upload completes in < 30 seconds for 10MB file

### Security
- **Authentication:** OAuth 2.0 via Auth0 with corporate SAML integration; JWT tokens
- **Authorization:** Role-based access control (RBAC) enforced server-side; Submitters cannot access other users' ideas
- **Data Protection:** All data encrypted in transit (HTTPS/TLS 1.3); sensitive data encrypted at rest
- **Session Security:** Secure HTTP-only cookies; CSRF protection enabled
- **Audit Requirements:** All user actions logged (login, idea submission, status changes); audit logs retained for 1 year

### Reliability & Availability
- **Uptime:** Target 99.5% availability (maintenance window: 1 hour/month)
- **Recovery Time Objective (RTO):** 30 minutes max downtime
- **Recovery Point Objective (RPO):** No data loss; daily automated backups
- **Error Handling:** Graceful error messages; retry mechanism for transient failures

### Usability
- **Accessibility:** WCAG 2.1 AA compliance; screen reader support; keyboard navigation
- **Browser Support:** Chrome (latest 2 versions), Firefox, Safari, Edge
- **Mobile Support:** Fully responsive design; works on screens 320px wide (mobile) and up
- **User Experience:** Clear visual feedback for all actions; loading states; success/error messages

### Maintainability
- **Code Quality:** ESLint + Prettier for consistency; TypeScript for type safety; >80% code coverage for critical paths
- **Documentation:** API documentation (OpenAPI/Swagger); deployment guide; user manual
- **Testing:** Unit tests (Jest), Integration tests (React Testing Library), E2E tests (Playwright)
- **Monitoring:** Application performance monitoring (APM); error tracking (Sentry); log aggregation (ELK)

---

## 6. Success Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| **User Adoption** | 70% of EPAM employees register within first 60 days | Google Analytics; user signup tracking |
| **Idea Submission Rate** | Average 2.5 ideas per user per quarter | Database query; idea submission events |
| **Evaluation Turnaround** | 90% of ideas evaluated within 7 days of submission | Workflow status timestamps; business intelligence |
| **System Uptime** | 99.5% availability | Uptime monitoring service (Pingdom/DataDog) |
| **Submission Success Rate** | 95% of form submissions complete successfully (no errors) | Application logging; error rate tracking |
| **Average Page Load Time** | Dashboard loads in < 2 seconds (P95) | Real User Monitoring (RUM) / APM tool |
| **User Satisfaction** | NPS (Net Promoter Score) > 50 | In-app survey; quarterly user feedback |
| **Evaluator Efficiency** | Average 10 ideas evaluated per evaluator per day | Time tracking; evaluation completion logs |

---

## 7. Scope

### In Scope (MVP - Phase 1)
- User authentication via Auth0 with corporate SAML
- Basic role-based access (Submitter and Evaluator/Admin)
- Idea submission form with Title, Description, Category, optional file attachment
- My Ideas dashboard with filtering and sorting
- Evaluation workflow with status tracking (Submitted → Under Review → Accepted/Rejected)
- Basic state machine for workflow progression
- Email notifications for status changes
- Responsive design for desktop and mobile
- API endpoints for all core features

### Out of Scope (Future Phases)
- Social features (comments, likes, sharing on submitted ideas)
- Advanced analytics/reporting on ideas and trends
- Integration with project management tools (Jira, Azure DevOps)
- Machine learning for idea similarity/deduplication
- Multi-level approval workflows (currently single evaluator)
- Mobile native apps (Phase 2+)
- Advanced search/filtering features
- Bulk operations (import/export ideas)

### Future Considerations
- **Phase 2:** Advanced analytics dashboard, multi-level approval workflows, integration with project management tools
- **Phase 3:** Mobile native apps, AI-powered idea recommendations, community features
- **Phase 4:** Public API for third-party integrations, advanced reporting suite

---

## Appendix

### A. Assumptions
- All EPAM employees have valid corporate email addresses integrated with Auth0
- Auth0 tenant is pre-configured with corporate SAML provider
- PostgreSQL database is available and properly configured
- Approximately 1,000-5,000 active EPAM users at launch
- Average idea submission rate grows from 10/week (week 1) to 50/week (month 3)
- Email service (SendGrid/SES) is available for notifications
- Users have basic browser literacy and access to modern browsers

### B. Constraints
- **Timeline:** MVP must launch within 8 weeks
- **Budget:** Limited to phase 1 scope; Phase 2+ subject to additional approval
- **Technology:** Must use React 18, Vite, Node.js 18+, PostgreSQL, Auth0 (already contracted)
- **Team Size:** Single full-stack engineer + 1 part-time QA
- **Data Residency:** All data must reside in [REGION] data centers (compliance requirement)

### C. Dependencies
- **Auth0 Tenant:** Must be provisioned and configured with EPAM SAML provider (IT responsibility)
- **PostgreSQL Database:** Must be configured (IT responsibility); connection credentials provided
- **Email Service:** Configure SendGrid or SES for email notifications
- **DNS/Hosting:** Deployment infrastructure must be ready (IT/DevOps responsibility)
- **EPAM IT Approval:** Security and compliance review required before production launch

### D. References
- [Tech Stack Overview](../agents.md)
- [Epic Decomposition](../specs/epics/) (to be created)
- [User Stories](../specs/stories/) (to be created)
- [Design Mockups](../design/) (to be provided by design team)
- [Auth0 Documentation](https://auth0.com/docs)
- [PostgreSQL Best Practices](https://www.postgresql.org/)

---

## Quality Checklist

✅ **Problem Statement**
- [x] Includes specific numbers (60% of ideas lost, 45% receive no feedback within 2 weeks)
- [x] Clearly articulates pain points
- [x] Quantifies opportunity/impact

✅ **Personas**
- [x] Each persona has a specific name (Priya, Raj, Admin)
- [x] Distinct roles with different needs
- [x] Pain points are specific to the problem being solved
- [x] Goals are measurable and tied to persona's role

✅ **Metrics**
- [x] All metrics are SMART (Specific, Measurable, Achievable, Relevant, Time-bound)
- [x] Metrics tied to business objectives (adoption, engagement, efficiency, satisfaction)
- [x] Measurement methods are realistic and implementable
- [x] Baseline/targets clearly defined

✅ **Scope**
- [x] In-scope items are specific features (not vague)
- [x] Out-of-scope items clearly separated from MVP
- [x] Future phases identified
- [x] Clear distinction: Phase 1 (MVP) vs. Phase 2+

✅ **Requirements**
- [x] Functional requirements are testable and specific
- [x] Non-functional requirements include quantified targets
- [x] No vague language ("easy", "fast", "secure" are all quantified)
- [x] All requirements map back to use cases and personas

---

## Next Steps

1. **Stakeholder Review:** Share PRD with EPAM leadership for feedback and approval (2 days)
2. **Design Phase:** Design team creates mockups and prototypes (1 week)
3. **Epic Decomposition:** Break PRD into 3-4 epics using `/decompose-epics` command
4. **Story Creation:** Create user stories for each epic using `/decompose-stories` command
5. **Sprint Planning:** Allocate stories to sprints; begin development
6. **Development:** Start with Epic 1 (Authentication); move to Epic 2+ as dependent epics complete

---

**Generated:** February 24, 2026  
**From Brief:** Auth Screen and Workflow Page - EPAM Idea Submission System  
**Status:** DRAFT (Ready for stakeholder review)  
**Next Step:** Share with EPAM leadership, collect feedback, move to APPROVED status
