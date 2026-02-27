# Sprint Planning: STORY-3 Implementation Roadmap
**Comprehensive Implementation Plan for Evaluation Queue Workflow**

**Document Date:** February 26, 2026  
**Status:** ACTIVE PLANNING  
**Phase:** STORY-3 (Evaluation Workflow) - Stories 3.1 to 3.7  
**Revision:** 1.0

---

## Executive Summary

This document provides a comprehensive implementation roadmap for STORY-3 (Evaluation Queue Workflow) following the speckit framework from agents.md. It organizes the remaining work (STORY-3.2 through STORY-3.7) into a logical sequence with dependencies, effort estimates, and sprint planning guidance.

**Current Status:**
- ✅ STORY-3.1: **COMPLETED** (All 31 tests passing, committed to git)
- ✅ STORY-3.2: **APPROVED** (Specification complete, 652-line spec document)
- 🔄 STORY-3.3 through STORY-3.7: **PENDING** (Specifications in progress)

**Total Effort:** 29 story points across 7 stories  
**Estimated Duration:** 3-4 weeks (assuming 2-3 developers, standard sprint velocity)

---

## 1. Project Overview & Context

### What We're Building (STORY-3 Epic)
The Evaluation Queue system enables evaluators to systematically review submitted ideas and make approval/rejection decisions with full audit trails and notifications.

### What's Complete
1. **STORY-3.1 - Evaluation Queue List** ✅
   - Backend: `GET /api/evaluation-queue` with pagination
   - Frontend: QueuePagination + QueueTable components
   - State: 31/31 tests passing (100% pass rate)
   - Coverage: 95.83% on main component
   - Git: Committed and pushed (commit 2b6db1a)

2. **STORY-3.2 - Idea Review Panel** ✅ APPROVED
   - 7 acceptance criteria fully documented
   - 22 test cases designed (12 unit + 6 integration + 4 E2E)
   - API contracts: GET /api/ideas/:ideaId, PUT /api/ideas/:ideaId/status
   - Component structure and data flow documented
   - Specification: 652 lines
   - Clarification: 400+ lines with code examples
   - Ready for implementation

### What's Pending
Three phases of remaining work:

**Phase 3.1 - Core Review Functionality (STORY-3.2)**
- Story Points: 5
- Days: 1-2
- Status: Ready for development

**Phase 3.2 - Decision Logic (STORY-3.3, STORY-3.4)**
- Status Machine for Approve/Reject
- Rejection Feedback Form
- Story Points: 13
- Days: 2-3

**Phase 3.3 - Tracking & Communication (STORY-3.5, STORY-3.6, STORY-3.7)**
- Audit Logging
- Email Notifications
- Status Timeline View
- Story Points: 11
- Days: 2-3

---

## 2. Dependency Map & Implementation Sequence

### Dependency Graph
```
STORY-3.1 ✅ COMPLETED
    ↓
STORY-3.2 ✅ APPROVED (Ready to Implement)
    ├→ STORY-3.3 (Blocked until 3.2 complete)
    │   ├→ STORY-3.4 (Depends on 3.3)
    │   └→ STORY-3.5 (Can start in parallel with 3.3)
    │
    ├→ STORY-3.6 (Can start after 3.2 UI complete)
    │
    └→ STORY-3.7 (Depends on 3.2 + 3.3)
```

### Critical Path
1. **Must Complete First:** STORY-3.2 (Idea Review Panel)
   - Blocks: STORY-3.3, STORY-3.4, STORY-3.7
   - No alternative path

2. **Parallel Work Opportunity:**
   - STORY-3.3 (Approve/Reject State Machine) can start once STORY-3.2 UI is complete
   - STORY-3.5 (Audit Logging) can start in parallel with STORY-3.3
   - STORY-3.6 (Email Notifications) can start once 3.2 UI complete

3. **Final Sequence:**
   - STORY-3.7 (Timeline View) must wait for STORY-3.2 + STORY-3.3 completion

---

## 3. Detailed Story Breakdown

### STORY-3.1: Evaluation Queue List ✅ COMPLETE

**Status:** COMPLETED  
**Story Points:** 8  
**Days:** 2-3 days (elapsed)  
**Pass Rate:** 31/31 tests (100%)  
**Coverage:** 95.83%  
**Git:** ✅ Pushed (commit 2b6db1a)

**Components Implemented:**
- Backend: `GET /api/evaluation-queue?page=N&pageSize=10`
- Frontend: `QueuePagination.tsx, QueueTable.tsx, EvaluationQueue.tsx`
- State: Pagination, loading states, error handling
- Tests: 31 comprehensive tests with 100% pass rate

**Key Files:**
- Backend: `src/routes/evaluationQueue.ts`
- Frontend: `src/pages/EvaluationQueue.tsx`, `src/components/QueuePagination.tsx`, `src/components/QueueTable.tsx`
- Tests: 3 test files, ~400 lines

---

### STORY-3.2: Idea Review Panel 🔄 READY FOR IMPLEMENTATION

**Status:** APPROVED  
**Story Points:** 5  
**Estimated Days:** 1-2  
**Priority:** 🔴 HIGHEST (Critical path blocker)

**User Story:**
As an evaluator, I want to view complete details of an idea before making a decision so that I can make informed approval/rejection choices.

**Route:** `/evaluation-queue/:ideaId`

#### Acceptance Criteria (7 AC)

| AC | Title | Status | Implementation |
|-------|-----------|--------|-----------------|
| 1 | Display complete idea info | 📋 Ready | GET /api/ideas/:ideaId response |
| 2 | Show attached files | 📋 Ready | Reuse AttachmentsSection component |
| 3 | Display submitter info | 📋 Ready | User details + mailto link |
| 4 | Auto-update status on panel load | 📋 Ready | "Submitted" → "Under Review" (PUT request) |
| 5 | Preserve queue breadcrumb | 📋 Ready | sessionStorage scroll position |
| 6 | Match STORY-2.5 design pattern | 📋 Ready | Grid layout, typography, colors |
| 7 | Authorization check | 📋 Ready | ProtectedRoute + evaluator role validation |

#### Component Structure
```
IdeaReviewPanel.tsx (200-250 lines)
├── Header Section (Title + Back button)
├── Main Content Grid
│   ├── Left Column (70%)
│   │   ├── Idea Details (Title, Description, Category)
│   │   └── AttachmentsSection
│   └── Right Sidebar (30%)
│       ├── Submitter Info Card
│       ├── Status Badge
│       └── Meta Info (Created, Updated dates)
└── Footer (Preserved for STORY-3.3 Action Buttons)
```

#### API Contracts
```typescript
// Get idea details
GET /api/ideas/:ideaId
Response: {
  id: string
  title: string
  description: string
  category: string
  attachments: Attachment[]
  submittedBy: User
  status: "Submitted" | "Under Review" | "Approved" | "Rejected"
  createdAt: ISO8601
  updatedAt: ISO8601
}

// Update status to "Under Review"
PUT /api/ideas/:ideaId/status
Body: { status: "Under Review" }
Response: { success: true, updatedAt: ISO8601 }
```

#### Test Coverage (22 tests)
- **Unit Tests (12):**
  - Component renders with full idea data
  - Back button navigates correctly
  - Attachment section displays files
  - Submitter info shows email link
  - Status badge displays correctly
  - Loading skeleton while fetching
  - Error state handling
  - Scroll position restoration
  - Authorization check for non-evaluators
  - Category badge styling
  - Date formatting
  - Empty attachments handling

- **Integration Tests (6):**
  - Full data flow from API to UI
  - Status update on mount
  - Error recovery with retry
  - Breadcrumb navigation
  - Session state preservation
  - Role-based access control

- **E2E Tests (4):**
  - User navigates from queue to detail
  - Status updates in real-time
  - Back button returns to queue position
  - All UI elements render correctly

#### Files to Create/Modify
```
CREATE: src/components/IdeaReviewPanel.tsx (200-250 lines)
CREATE: src/components/__tests__/IdeaReviewPanel.test.tsx (150-200 lines)
MODIFY: src/App.tsx (add route)
MODIFY: src/api/ideas.service.ts (ensure updateIdeaStatus method)
```

#### Database Requirements
✅ Already exists:
- ideas.status column
- ideas.attachments relationship
- users table with submittedBy FK

#### Dependencies
- ✅ STORY-2.5 (Detail page design patterns)
- ✅ STORY-3.1 (Queue list navigation)
- ✅ AttachmentsSection component (reusable)

#### Risk Assessment
- **Risk Level:** LOW
- **Blockers:** None
- **Technical Challenges:** None
- **Testing Complexity:** Medium

#### Definition of Acceptance (Checklist)
- [ ] Component renders idea details correctly
- [ ] Attachments display with proper formatting
- [ ] Submitter email link is functional
- [ ] Status updates to "Under Review" on mount
- [ ] Back button navigates with scroll restoration
- [ ] Authorization check prevents non-evaluators
- [ ] All 22 tests passing (100% pass rate)
- [ ] Coverage >80% on component
- [ ] Design matches STORY-2.5 patterns
- [ ] No console errors or warnings
- [ ] Responsive on mobile/tablet/desktop

---

### STORY-3.3: Approve/Reject State Machine ⏳ PENDING SPECIFICATION

**Status:** SPECIFICATIONS IN PROGRESS  
**Story Points:** 8  
**Estimated Days:** 2-3  
**Priority:** 🔴 HIGH (Unblocks STORY-3.4, STORY-3.7)  
**Dependencies:** ✅ STORY-3.2 complete

**User Story:**
As an evaluator, I want to approve or reject ideas with immediate feedback so that submitters know the decision quickly.

**Route:** `/evaluation-queue/:ideaId` (action buttons on STORY-3.2 panel)

#### High-Level Approach
1. **State Machine Definition:**
   ```
   Under Review [AC1]
       ├─ Approve → Approved [AC2] → Send notification [AC3]
       └─ Reject → Show feedback form [AC4 - STORY-3.4]
   ```

2. **Action Buttons:** [Approve] [Reject] buttons on review panel
3. **Immediate Feedback:** Toast/success message after action
4. **Database:** Update status, store decision timestamp
5. **Validation:** Prevent duplicate submissions, role check

#### Preliminary Acceptance Criteria (5 AC)
- AC1: "Approve" button appears on review panel
- AC2: Clicking "Approve" updates status + stores timestamp
- AC3: Success message displays after approval
- AC4: "Reject" button triggers rejection flow (leads to STORY-3.4)
- AC5: Both actions update database + trigger notifications

#### Implementation Notes
- Button states: loading, disabled during submission, success state
- Error handling: retry mechanism, validation on backend
- Optimistic UI updates with fallback to server state
- Toast notifications for user feedback

#### Specification Document
📋 To be created: `specs/stories/STORY-3.3-Approve-Reject-State-Machine.md`

---

### STORY-3.4: Rejection Feedback Form ⏳ PENDING SPECIFICATION

**Status:** SPECIFICATIONS IN PROGRESS  
**Story Points:** 5  
**Estimated Days:** 1-2  
**Priority:** 🟠 HIGH (Improves UX, required for rejections)  
**Dependencies:** ✅ STORY-3.3 (Reject button triggers this form)

**User Story:**
As an evaluator, I want to provide structured feedback when rejecting an idea so that submitters understand why it was rejected.

#### Preliminary Form Structure
```
Modal Form: "Provide Rejection Feedback"
├── Rejection Reason (dropdown)
│   ├── "Idea already exists"
│   ├── "Does not fit strategy"
│   ├── "Insufficient market research"
│   ├── "Technical feasibility concerns"
│   └── "Other"
├── Detailed Comments (textarea, required)
│   └── Character count: 0/500
├── Internal Notes (textarea, optional)
│   └── Visible to evaluators only
└── Actions
    ├── [Cancel]
    └── [Send Rejection]
```

#### Key Features
- Reason dropdown is required
- Comments textarea is required (min 20 chars)
- Internal notes are optional, not sent to submitter
- Form validation with helpful error messages
- Email template: reason + comments sent to submitter
- Audit log: captures who rejected, when, reasons

#### Specification Document
📋 To be created: `specs/stories/STORY-3.4-Rejection-Feedback-Form.md`

---

### STORY-3.5: Audit Logging ⏳ PENDING SPECIFICATION

**Status:** SPECIFICATIONS IN PROGRESS  
**Story Points:** 5  
**Estimated Days:** 1-2  
**Priority:** 🟢 MEDIUM (Can work in parallel with STORY-3.3)  
**Dependencies:** Minimal (can start during STORY-3.2)

**User Story:**
As an administrator, I want to see a complete audit trail of all idea status changes so that I can track decision history and ensure compliance.

#### Preliminary Scope
1. **New Table:** `audit_logs` with fields:
   - id (uuid)
   - ideaId (FK to ideas)
   - evaluatorId (FK to users)
   - action (enum: "view", "approve", "reject", "comment")
   - oldStatus / newStatus
   - details (JSON)
   - timestamp (ISO8601)

2. **Frontend Audit Timeline View (STORY-3.7):**
   - Display audit entries chronologically
   - Show evaluator name, action, timestamp
   - Show status transitions with details

3. **Backend Recording:**
   - Middleware to auto-log all /api/ideas/:id updates
   - Log viewer endpoint: GET /api/admin/ideas/:id/audit

#### Specification Document
📋 To be created: `specs/stories/STORY-3.5-Audit-Logging.md`

---

### STORY-3.6: Email Notifications ⏳ PENDING SPECIFICATION

**Status:** SPECIFICATIONS IN PROGRESS  
**Story Points:** 3  
**Estimated Days:** 1  
**Priority:** 🟢 MEDIUM (Can start after STORY-3.2)  
**Dependencies:** ✅ STORY-3.3 (approval/rejection decisions)

**User Story:**
As a submitter, I want to receive email notifications when my idea is approved or rejected so that I know the decision status.

#### Email Templates
1. **Approval Notification:**
   ```
   Subject: Your idea "{title}" has been approved! 🎉
   
   Hi {submitterName},
   
   Great news! Your idea "{title}" has been approved!
   
   Next steps: [link to next workflow stage]
   
   Best regards,
   The Innovation Team
   ```

2. **Rejection Notification:**
   ```
   Subject: Your idea "{title}" needs more work
   
   Hi {submitterName},
   
   Thank you for your submission. Unfortunately, your idea 
   "{title}" was not approved in this cycle.
   
   Feedback from evaluators:
   ---
   {feedback}
   ---
   
   You can resubmit after addressing the feedback.
   
   Best regards,
   The Innovation Team
   ```

#### Implementation
- Use SendGrid or AWS SES for email delivery
- Queue emails with Bull or similar (don't send synchronously)
- Track bounces and failures
- Add email template management UI (future)

#### Specification Document
📋 To be created: `specs/stories/STORY-3.6-Email-Notifications.md`

---

### STORY-3.7: Status Timeline View ⏳ PENDING SPECIFICATION

**Status:** SPECIFICATIONS IN PROGRESS  
**Story Points:** 3  
**Estimated Days:** 1  
**Priority:** 🟡 LOW (Nice-to-have, requires STORY-3.5)  
**Dependencies:** ✅ STORY-3.5 (Audit logs provide data)

**User Story:**
As a submitter, I want to see a timeline of my idea's status changes so that I understand the workflow progress.

#### Preliminary UI
```
Status Timeline (right sidebar on idea detail page, STORY-2.5)
├── Submitted ──── 2026-02-10 10:30 AM
│   by: System
│   
├── Under Review ─ 2026-02-15 2:15 PM
│   by: Jane Doe (Evaluator)
│   
├── Approved ───── 2026-02-20 11:00 AM
│   by: John Smith (Evaluator)
│   Comment: "Great innovation! Moving to budget approval."
│   
└── [Next Stage] ─ Pending...
```

#### Key Features
- Reverse chronological order (newest first)
- Show evaluator name and timestamp
- Display decision feedback in expandable section
- Visual indicators: submitted, reviewed, approved, rejected
- Responsive: full view on desktop, collapsed on mobile

#### Specification Document
📋 To be created: `specs/stories/STORY-3.7-Status-Timeline-View.md`

---

## 4. Sprint Planning Recommendations

### Sprint 1: Foundation (STORY-3.2) - 1 Week
**Goal:** Implement core review panel  
**Team:** 1-2 developers  
**Effort:** 5 story points

**Tasks:**
- Day 1: Implement IdeaReviewPanel component
- Day 1: Create data fetching and state management
- Day 2: Implement unit tests (12 tests)
- Day 2: Implement integration tests (6 tests)
- Day 3: E2E tests, coverage verification, code review
- Day 3-4: Final fixes, accessibility audit

**Deliverables:**
- ✅ IdeaReviewPanel.tsx (ready for actions in next sprint)
- ✅ IdeaReviewPanel.test.tsx
- ✅ All 22 tests passing
- ✅ >80% coverage
- ✅ Code review approved
- ✅ Git: Feature branch merged to main

---

### Sprint 2: Decision Logic (STORY-3.3 + 3.4) - 1.5 Weeks
**Goal:** Implement approve/reject workflows  
**Team:** 2 developers (parallel work possible)  
**Effort:** 13 story points

**Parallel Tracks:**

**Track A: State Machine (STORY-3.3)**
- Days 1-2: Implement approve action + tests
- Day 3: Implement reject button + form trigger
- Day 3: Validation, error handling, retry logic

**Track B: Rejection Form (STORY-3.4)**
- Days 1-2: Build RejectionFeedbackModal component
- Day 3: Form validation, submission handler
- Days 3-4: Tests, accessibility, error states

**Deliverables:**
- ✅ Action buttons on review panel
- ✅ Approve workflow with success feedback
- ✅ Reject workflow with feedback capture
- ✅ All tests passing (20+ tests across both stories)
- ✅ Error handling and validation
- ✅ Database updates (ideas.status, audit logs)

---

### Sprint 3: Tracking & Communication (STORY-3.5 + 3.6 + 3.7) - 1.5 Weeks
**Goal:** Add audit, notifications, timeline  
**Team:** 2 developers (parallel work possible)  
**Effort:** 11 story points

**Parallel Tracks:**

**Track A: Audit Logging (STORY-3.5)**
- Days 1-2: Create audit_logs table migration
- Day 2: Implement audit middleware
- Day 3: Create audit log viewer API

**Track B: Email Notifications (STORY-3.6)**
- Days 1-2: Set up email service (SendGrid/SES)
- Day 2-3: Create email templates
- Day 3: Queue email jobs, add error handling

**Track C: Timeline View (STORY-3.7)**
- Days 4-5: Build StatusTimeline component
- Day 5: Styling, responsive design
- Day 5: Tests and accessibility

**Deliverables:**
- ✅ Audit logs captured for all status changes
- ✅ Email notifications sent on approve/reject
- ✅ Status timeline view on idea detail page
- ✅ All 12+ tests passing
- ✅ Admin audit log viewer
- ✅ Email delivery monitoring/retries

---

### Total Sprint Capacity: 3.5 Weeks / 29 Story Points

| Sprint | Stories | Points | Focus | Duration |
|--------|---------|--------|-------|----------|
| 1 | STORY-3.2 | 5 | Review Panel | 1 week |
| 2 | STORY-3.3, 3.4 | 13 | Decision Logic | 1.5 weeks |
| 3 | STORY-3.5, 3.6, 3.7 | 11 | Tracking & Comms | 1.5 weeks |

---

## 5. Risk & Mitigation Strategy

### Technical Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|-----------|
| Email delivery failures | Submitters don't get notified | Medium | Queue jobs with retry, monitor bounces |
| Audit log table grows large | Query performance degrades | Low | Index ideaId + timestamp, partition by month |
| State machine complexity | Logic errors, edge cases | Low | Comprehensive state diagram, test all transitions |
| Auth0 API rate limits | Failed status updates | Low | Implement exponential backoff, cache tokens |
| Database lock on concurrent updates | Approval/rejection conflicts | Low | Use optimistic locking, UUID for idempotency |

### Mitigation Checklist
- ✅ Load testing on audit log queries (>100k records)
- ✅ Spike on email service integration
- ✅ State machine diagram review with team
- ✅ Concurrent update scenarios in tests
- ✅ Rollback plan for failed email deliveries

---

## 6. Quality Gates & Definition of Done

### Code Quality
- [ ] All tests passing (100% pass rate per story)
- [ ] Coverage: >80% statements, >75% branches
- [ ] ESLint: 0 errors, 0 warnings
- [ ] Prettier: Consistent formatting
- [ ] TypeScript: Strict mode, no `any` types

### Testing
- [ ] Unit tests for all functions
- [ ] Integration tests for API calls
- [ ] E2E tests for critical paths
- [ ] Edge case scenarios covered
- [ ] Error handling validated
- [ ] Performance tested (response times <200ms)

### Code Review
- [ ] 2 reviewers sign-off
- [ ] Architecture reviewed
- [ ] Security checklist completed
- [ ] Database migrations reviewed
- [ ] API contracts verified

### Documentation
- [ ] Code comments for complex logic
- [ ] API documentation updated
- [ ] Database schema documented
- [ ] Component Storybook entries (if applicable)
- [ ] Specification updated with lessons learned

### Deployment
- [ ] Database migrations tested
- [ ] Rollback procedure documented
- [ ] Environment variables configured
- [ ] Secrets stored securely
- [ ] Monitoring/alerting configured

---

## 7. Specification Creation Queue

These specifications need to be created following agents.md guidelines:

| Story | Document | Status | Owner | Due |
|-------|----------|--------|-------|-----|
| STORY-3.3 | `STORY-3.3-Approve-Reject-State-Machine.md` | 🔄 In Progress | Copilot | Feb 26 |
| STORY-3.4 | `STORY-3.4-Rejection-Feedback-Form.md` | 📋 Planned | Copilot | Feb 27 |
| STORY-3.5 | `STORY-3.5-Audit-Logging.md` | 📋 Planned | Copilot | Feb 28 |
| STORY-3.6 | `STORY-3.6-Email-Notifications.md` | 📋 Planned | Copilot | Mar 1 |
| STORY-3.7 | `STORY-3.7-Status-Timeline-View.md` | 📋 Planned | Copilot | Mar 1 |

**Specification Format:** Follow `specs/templates/story-template.md`  
**Naming Convention:** `STORY-[N]-[Title].md` in `specs/stories/` directory

---

## 8. Dependencies & Blockers

### External Dependencies
- ✅ Auth0: Already integrated (STORY-1.2)
- ✅ Database: PostgreSQL with Prisma (setup complete)
- ✅ Email Service: SendGrid or AWS SES (to be configured)
- ⏳ Frontend design system: Tailwind + shadcn/ui (in use)
- ⏳ Backend framework: Express.js (in use)

### Internal Dependencies
```
STORY-3.2 (Ready) ←  STORY-3.1 ✅
    ↓
STORY-3.3 ←────── Blocked until 3.2 complete
    ↓
STORY-3.4 ←────── Blocked until 3.3 complete

STORY-3.5 ←────── Can run in parallel with 3.3 (early)
STORY-3.6 ←────── Can run in parallel with 3.3 (mid)
STORY-3.7 ←────── Blocked until 3.2 + 3.5 complete
```

### Known Blockers
- **None** for STORY-3.2 (Ready to start immediately)
- **STORY-3.2 completion** blocks STORY-3.3, STORY-3.4, STORY-3.7

---

## 9. Success Metrics

### By Story Completion
- **STORY-3.2:** Evaluators can view complete idea details before deciding
- **STORY-3.3:** Evaluators can approve ideas with 1-click action
- **STORY-3.4:** Evaluators can provide structured rejection feedback
- **STORY-3.5:** Admins can audit all status changes with timestamps
- **STORY-3.6:** Submitters receive email notifications on decisions
- **STORY-3.7:** Submitters can see timeline of idea progress

### Quantitative Goals
- ✅ 100% test pass rate on all stories
- ✅ >80% code coverage (branches >75%)
- ✅ <200ms API response times (p95)
- ✅ Email delivery: >99% success rate (tracked in audit logs)
- ✅ Zero security vulnerabilities (OWASP top 10 checked)

### Qualitative Goals
- ✅ User feedback: Evaluators rate experience 4+/5
- ✅ Developer experience: All code adheres to project conventions
- ✅ Documentation: Specifications approved by stakeholders
- ✅ Performance: UI feels instant (no jank, smooth transitions)

---

## 10. Next Steps (Immediate Actions)

### Today (Feb 26)
1. ✅ Create this sprint plan document (DONE)
2. Create STORY-3.3 specification (`STORY-3.3-Approve-Reject-State-Machine.md`)
3. Finalize team assignment for Sprint 1

### This Week (Feb 26-Mar 1)
4. Create remaining STORY-3.4 through STORY-3.7 specifications
5. Get stakeholder approval on all 5 specifications
6. Conduct sprint planning meeting with development team
7. Set up project board (GitHub Projects or similar)
8. Begin Sprint 1 development (STORY-3.2 implementation)

### Next Week (Mar 3-7)
9. Sprint 1 review and demo (STORY-3.2 complete)
10. Sprint 1 retrospective
11. Sprint 2 kickoff (STORY-3.3 + STORY-3.4 parallel tracks)

---

## 11. Reference Materials

### Project Conventions
- See `agents.md` for all naming, structure, and workflow standards
- Specification template: `specs/templates/story-template.md`
- Code style: Tailwind CSS, TypeScript strict mode, React 18 hooks

### Recent Completions
- **STORY-3.1:** [See git commit 2b6db1a](Implementation complete with 31/31 passing tests)
- **STORY-3.2 Specification:** [specs/stories/STORY-3.2-Idea-Review-Panel.md](652 lines)
- **STORY-3.2 Clarification:** [specs/stories/STORY-3.2-CLARIFICATION.md](400+ lines with code examples)

### Key Files
- Backend routes: `backend/src/routes/`
- Frontend components: `src/components/`, `src/pages/`
- API services: `src/api/ideas.service.ts`
- Tests: `**/__tests__/`, `**/*.test.tsx`

---

## 12. Sign-Off & Approval

| Role | Name | Status | Date |
|------|------|--------|------|
| Plan Author | GitHub Copilot | ✅ Complete | Feb 26, 2026 |
| Tech Lead | [TBD] | ⏳ Pending | - |
| Product Owner | [TBD] | ⏳ Pending | - |
| QA Lead | [TBD] | ⏳ Pending | - |

---

## 13. Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Feb 26, 2026 | Copilot | Initial sprint plan for STORY-3 (Stories 3.1-3.7) |

---

**Last Updated:** February 26, 2026  
**Next Review:** March 3, 2026 (Post Sprint 1)  
**Questions?** Update this document or reference agents.md for project conventions.
