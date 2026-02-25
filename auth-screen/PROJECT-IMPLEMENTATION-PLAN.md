# Project Implementation Plan

**Project:** EPAM InnovatePAM - Idea Submission & Evaluation System  
**Created:** February 25, 2026  
**Status:** ACTIVE - Phase 2 In Progress  
**Owner:** Development Team  
**Last Updated:** February 25, 2026

---

## Executive Summary

This document outlines the complete implementation roadmap for the EPAM InnovatePAM system, featuring three major phases:
- **Phase 1 (COMPLETED):** Authentication & Session Management (EPIC-1, 5 stories)
- **Phase 2 (IN PROGRESS):** Idea Submission System (EPIC-2, 6 stories)  
- **Phase 3 (PLANNED):** Advanced Workflow & Evaluation (EPIC-3, 4+ stories)

**Timeline:** 8-10 weeks for Phase 2 completion  
**Tech Stack:** React 18 + Vite + TypeScript + Express.js + PostgreSQL

---

## Phase Overview & Status

### ✅ Phase 1: Authentication & Session Management (COMPLETED)

**Epic:** AUTH-epic-1  
**Duration:** ~2 weeks (Completed)  
**Status:** APPROVED & IMPLEMENTED

**Stories Completed:**
- [x] AUTH-story-1: User Login with Auth0
- [x] AUTH-story-2: Auth0 Integration & JWT Tokens
- [x] AUTH-story-3: JWT Token Storage & Refresh
- [x] AUTH-story-4: Role-Based Access Control (RBAC)
- [x] AUTH-story-5: Logout & Session Timeout

**Key Deliverables:**
- ✅ Auth0 integration with OAuth 2.0
- ✅ JWT token management (access + refresh)
- ✅ Role-based access control (User, Evaluator, Admin)
- ✅ Session timeout with 5-minute warning modal
- ✅ Secure token storage in localStorage

**Test Coverage:** 53/53 tests passing (59.69% code coverage)

---

### 🔄 Phase 2: Idea Submission System (IN PROGRESS)

**Epic:** IDEA-epic-2  
**Duration:** 8-10 weeks (Estimated)  
**Estimated Completion:** Late April 2026  
**Status:** PLANNING & IMPLEMENTATION

#### Phase 2 Stories (In Sequence)

**Story 1: Idea Submission Form (COMPLETED)** ✅
- **Story ID:** IDEA-story-1
- **Duration:** 5 days (Completed)
- **Status:** APPROVED & IMPLEMENTED
- **Deliverables:**
  - IdeaSubmissionForm component with React Hook Form
  - Zod schema validation (title: 3-100 chars, description: 10-2000 chars)
  - FormTextField, FormTextArea, FormSelect reusable components
  - ideas.service.ts HTTP client with JWT auth
  - 24 unit tests passing
  - POST /api/ideas backend endpoint reference

**Story 2: File Upload Functionality (READY FOR IMPLEMENTATION)** ⏳
- **Story ID:** IDEA-story-2
- **Duration:** 5-7 days (Estimated)
- **Est. Start:** Week of Feb 26, 2026
- **Acceptance Criteria:** 10 AC (file validation, upload, storage, metadata)
- **Dependencies:** IDEA-story-1 (blocking)
- **Deliverables:**
  - FileUploadInput component with drag-and-drop
  - File validation (format: PDF/DOC/PNG/JPG/XLS, 10MB limit)
  - Upload progress tracking
  - Server-side file storage & metadata persistence
  - POST /api/ideas/:ideaId/upload endpoint
  - 15+ test cases covering upload scenarios

**Story 3: Dashboard - My Ideas View (PENDING SPECIFICATION)**
- **Story ID:** IDEA-story-3
- **Duration:** 5-7 days (Estimated)
- **Est. Start:** Week of Mar 12, 2026
- **Acceptance Criteria:** TBD (display submitted ideas, list view, status indicators)
- **Dependencies:** IDEA-story-1 (submission form)
- **Deliverables:**
  - Dashboard page component
  - Ideas list/grid with filters
  - Idea status display (Submitted, In Review, Approved, Rejected)
  - GET /api/ideas endpoint (user's ideas only)

**Story 4: Sort & Filter Features (PENDING SPECIFICATION)**
- **Story ID:** IDEA-story-4
- **Duration:** 3-5 days (Estimated)
- **Est. Start:** Week of Mar 26, 2026
- **Acceptance Criteria:** TBD (sort by date/status, filter by category/status)
- **Dependencies:** IDEA-story-3 (dashboard)
- **Deliverables:**
  - Sort controls (date, title, status)
  - Filter UI (category, status, date range)
  - Query parameter handling
  - GET /api/ideas?sort=createdAt&filter=status:submitted

**Story 5: Idea Detail Page (PENDING SPECIFICATION)**
- **Story ID:** IDEA-story-5
- **Duration:** 3-5 days (Estimated)
- **Est. Start:** Week of Apr 9, 2026
- **Acceptance Criteria:** TBD (display full idea details, view attachments)
- **Dependencies:** IDEA-story-1, IDEA-story-2 (form + uploads)
- **Deliverables:**
  - IdeaDetail page component
  - Full idea data display (title, description, category, attachments)
  - File preview/download
  - Comments section (Phase 2b or 3?)
  - GET /api/ideas/:ideaId endpoint

**Story 6: Edit Idea Functionality (PENDING SPECIFICATION)**
- **Story ID:** IDEA-story-6
- **Duration:** 4-6 days (Estimated)
- **Est. Start:** Week of Apr 23, 2026
- **Acceptance Criteria:** TBD (edit submitted idea, replace files, save state)
- **Dependencies:** IDEA-story-1, IDEA-story-2, IDEA-story-5
- **Deliverables:**
  - Edit idea form (pre-populate existing data)
  - File replacement UI
  - Optimistic updates + server sync
  - PUT /api/ideas/:ideaId endpoint
  - Audit trail (edited by, timestamp)

#### Phase 2 Timeline Estimate

```
Week of Feb 26:    IDEA-story-2 (File Upload)
Week of Mar 12:    IDEA-story-3 (Dashboard)
Week of Mar 26:    IDEA-story-4 (Sort & Filter)
Week of Apr 9:     IDEA-story-5 (Detail Page)
Week of Apr 23:    IDEA-story-6 (Edit Functionality)
Week of May 7:     Testing, QA, refinements
Week of May 14:    Phase 2 completion + Phase 3 planning
```

**Phase 2 Completion Target:** Mid-May 2026

---

### 📋 Phase 3: Advanced Workflow & Evaluation (PLANNED)

**Epic:** IDEA-epic-3 (Evaluation & Workflow)  
**Duration:** 6-8 weeks (Estimated)  
**Estimated Start:** May 2026  
**Status:** PLANNING

**Planned Stories:**
- IDEA-story-7: Evaluator Dashboard (assign ideas for review)
- IDEA-story-8: Idea Evaluation Form (scoring, comments, approval workflow)
- IDEA-story-9: Status Tracking & Notifications (idea status changes)
- IDEA-story-10: Reporting & Analytics (submission metrics, idea trends)
- WF-story-1: Workflow State Machine (Draft → Submitted → Review → Approved/Rejected)
- WF-story-2: Admin Configuration (workflow customization)

**Key Features:**
- Evaluator assignment & workload balancing
- Scoring rubric with weighted criteria
- Approval chain (single/multi-level approval)
- Automated notifications (email, in-app)
- Real-time dashboard metrics
- Audit trail & decision history

**Estimated Completion:** July-August 2026

---

## Project Structure & Organization

```
auth-screen/
├── specs/
│   ├── templates/
│   │   ├── prd-template.md
│   │   ├── epic-template.md
│   │   └── story-template.md
│   ├── prds/
│   │   ├── AUTH-prd.md (completed)
│   │   └── IDEA-prd.md (completed)
│   ├── epics/
│   │   ├── AUTH-epic-1.md (completed)
│   │   ├── IDEA-epic-2.md (in progress)
│   │   └── IDEA-epic-3.md (planned)
│   └── stories/
│       ├── IDEA-story-1.md (completed) ✅
│       ├── IDEA-story-2.md (ready)
│       ├── CLARIFICATION-IDEA-story-2.md
│       ├── IDEA-story-3.md (pending spec)
│       └── ... (4-6 more stories)
├── src/
│   ├── components/
│   │   ├── FormTextField.tsx ✅
│   │   ├── FormTextArea.tsx ✅
│   │   ├── FormSelect.tsx ✅
│   │   ├── IdeaSubmissionForm.tsx ✅
│   │   ├── FileUploadInput.tsx (todo)
│   │   ├── Navbar.tsx ✅
│   │   ├── SessionWarningModal.tsx ✅
│   │   └── ProtectedRoute.tsx ✅
│   ├── pages/
│   │   ├── LoginPage.tsx ✅
│   │   ├── Dashboard.tsx (todo - Phase 2)
│   │   ├── IdeaDetail.tsx (todo - Phase 2)
│   │   ├── IdeaEdit.tsx (todo - Phase 2)
│   │   └── EvaluatorDashboard.tsx (todo - Phase 3)
│   ├── services/
│   │   ├── ideas.service.ts ✅
│   │   ├── auth.service.ts ✅
│   │   └── file.service.ts (todo)
│   ├── hooks/
│   │   ├── useSessionTimeout.ts ✅
│   │   └── useIdeas.ts (todo)
│   ├── types/
│   │   ├── ideaSchema.ts ✅
│   │   └── fileSchema.ts (todo)
│   ├── context/
│   │   ├── MockAuth0Context.tsx ✅
│   │   └── IdeaContext.tsx (todo)
│   └── __backend__/
│       └── (reference implementation)
├── cypress/
│   ├── e2e/
│   │   ├── idea-submission.cy.ts ✅
│   │   ├── file-upload.cy.ts (todo)
│   │   ├── dashboard.cy.ts (todo)
│   │   └── evaluation.cy.ts (todo - Phase 3)
│   └── config.ts ✅
├── jest.config.js
├── vite.config.ts
├── package.json
├── README.md
├── agents.md
└── PLANNING.md (this file)
```

---

## Sprint Planning

### Sprint 1 (Feb 26 - Mar 11, 2 weeks)

**Focus:** File Upload Functionality (IDEA-story-2)

**Objectives:**
- [ ] Clarify file upload requirements with tech lead (20 clarification questions)
- [ ] Design FileUploadInput component architecture
- [ ] Implement client-side file validation
- [ ] Implement server-side file handling (multer, Express endpoint)
- [ ] Create file storage strategy (local or S3)
- [ ] Write comprehensive test suite (unit + integration + E2E)
- [ ] Code review & QA sign-off

**Deliverables:**
- FileUploadInput and FileProgressBar components
- File upload endpoint (POST /api/ideas/:ideaId/upload)
- Database schema for ideaAttachments
- 20+ tests covering upload scenarios
- Documentation

**Success Criteria:**
- [ ] All 10 acceptance criteria passing
- [ ] >80% test coverage for file upload
- [ ] Code review approved
- [ ] QA sign-off on manual tests

---

### Sprint 2 (Mar 12 - Mar 25, 2 weeks)

**Focus:** Dashboard - My Ideas View (IDEA-story-3)

**Objectives:**
- [ ] Specify IDEA-story-3 acceptance criteria
- [ ] Design Dashboard page and Ideas list/grid
- [ ] Implement GET /api/ideas endpoint (paginated, user-filtered)
- [ ] Create Ideas list view with status indicators
- [ ] Add idea preview cards (title, description, status, date)
- [ ] Write test suite (list rendering, pagination, status display)
- [ ] QA sign-off

**Deliverables:**
- Dashboard page component
- Ideas list/grid with filtering by status
- Pagination controls
- Status badges and indicators
- 15+ test cases

---

### Sprint 3 (Mar 26 - Apr 8, 2 weeks)

**Focus:** Sort & Filter (IDEA-story-4)

**Objectives:**
- [ ] Design sort/filter UI
- [ ] Implement sort controls (date, title, status)
- [ ] Implement filter controls (category, status, date range)
- [ ] Update backend to support query parameters
- [ ] Write tests for sort/filter logic
- [ ] Performance testing (large idea lists)

**Deliverables:**
- Sort controls component
- Filter sidebar/modal
- Updated GET /api/ideas endpoint with query params
- 10+ test cases for sort/filter logic

---

### Sprint 4 (Apr 9 - Apr 22, 2 weeks)

**Focus:** Idea Detail Page & Edit (IDEA-story-5 + IDEA-story-6)

**Objectives:**
- [ ] Design IdeaDetail page layout
- [ ] Implement GET /api/ideas/:ideaId endpoint
- [ ] Create detail page with full idea data
- [ ] Implement file preview/download
- [ ] Design edit form (pre-populated data)
- [ ] Implement PUT /api/ideas/:ideaId endpoint
- [ ] Add edit state management + optimistic updates
- [ ] Write test suite

**Deliverables:**
- IdeaDetail page
- IdeaEditForm component
- File viewer component with download
- Audit trail display
- 20+ test cases

---

### Sprint 5 (May 7 - May 13, 1 week)

**Focus:** Testing, QA, Refinement

**Objectives:**
- [ ] Full system E2E testing (all workflows)
- [ ] Performance testing and optimization
- [ ] Bug fixes and refinements
- [ ] Code coverage verification (80%+)
- [ ] Final code review
- [ ] Merge to main branch
- [ ] Phase 2 completion report

**Deliverables:**
- Phase 2 completion report
- QA sign-off on all features
- Performance baseline metrics
- Ready for Phase 3 kickoff

---

## Dependency Graph

```
Phase 1: Authentication (COMPLETED)
├── AUTH-story-1: Login ✅
├── AUTH-story-2: Auth0 Integration ✅
├── AUTH-story-3: JWT Storage ✅
├── AUTH-story-4: RBAC ✅
└── AUTH-story-5: Logout/Timeout ✅

Phase 2: Idea Submission (IN PROGRESS)
├── IDEA-story-1: Form ✅
│   └── IDEA-story-2: File Upload (WIP)
│       └── IDEA-story-5: Detail Page (pending)
├── IDEA-story-3: Dashboard (depends on story-1)
│   ├── IDEA-story-4: Sort/Filter (depends on story-3)
│   └── IDEA-story-6: Edit (depends on story-3, story-2, story-5)
└── (stories 4, 5, 6 can proceed in parallel after 3)

Phase 3: Evaluation (PLANNED)
├── IDEA-story-7: Evaluator Dashboard (depends on Phase 2)
├── IDEA-story-8: Evaluation Form (depends on Phase 2)
├── IDEA-story-9: Status & Notifications (depends on Phase 2)
├── IDEA-story-10: Analytics (depends on Phase 2)
├── WF-story-1: Workflow State Machine (global)
└── WF-story-2: Admin Configuration (depends on WF-1)
```

---

## Technology Stack Details

### Frontend Technology

**Core:**
- React 18.2.0 (component library)
- Vite 5.0.8 (build tool)
- TypeScript 5.3.3 (type safety)
- Tailwind CSS 3.4.1 (styling)

**Form Management:**
- React Hook Form 7.71.2 (form state)
- Zod 4.3.6 (schema validation)
- @hookform/resolvers 5.2.2 (integration)

**HTTP Client:**
- Axios 1.13.5 (API calls with JWT support)

**File Upload:**
- (todo) multer-next or formidable (client-side)
- (todo) drag-drop library (if needed)

**Testing:**
- Jest 29.7.0 (unit testing)
- React Testing Library 14.1.2 (component testing)
- Cypress (E2E testing)
- @testing-library/user-event 14.5.1 (user interaction)

**Code Quality:**
- ESLint 8.56.0 (linting)
- Prettier 3.1.1 (formatting)
- TypeScript strict mode

### Backend Technology

**Core:**
- Node.js v18+ (runtime)
- Express.js (HTTP server)
- TypeScript (type safety)

**Database:**
- PostgreSQL 14+ (database)
- Prisma 4+ (ORM)

**File Upload:**
- multer (multipart form-data)
- file-type (MIME detection)
- (optional) sharp (image processing)

**Authentication:**
- jsonwebtoken (JWT signing/verification)
- Auth0 SDK (integration)

**Testing:**
- Jest (unit testing)
- Supertest (HTTP endpoint testing)
- @faker-js/faker (test data generation)

---

## Success Metrics & KPIs

### Code Quality
- [ ] Test Coverage: >80% for all new code
- [ ] ESLint: 0 errors, 0 warnings
- [ ] TypeScript: No compilation errors (strict mode)
- [ ] Code Review: 2+ approvals required

### Performance
- [ ] Form submission: <2 seconds
- [ ] File upload (10MB): <30 seconds on 1Mbps
- [ ] Dashboard load: <2 seconds
- [ ] List pagination: 50 ideas per page

### User Experience
- [ ] Form validation: Real-time feedback on blur
- [ ] Error messages: Clear and actionable
- [ ] Loading states: Progress indicators for all async operations
- [ ] Mobile responsiveness: Working on iOS/Android

### Testing Coverage
- [ ] Unit tests: >80% for business logic
- [ ] Integration tests: All API endpoints
- [ ] E2E tests: Critical user journeys
- [ ] Manual QA: Full test plan sign-off

---

## Risk Assessment

### High Priority Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| Unclear file upload requirements | High | High | 20 clarification questions in spec, tech lead review before coding |
| Database scalability (large file uploads) | Medium | High | Performance testing, use S3/cloud storage instead of local FS |
| JWT token expiration during upload | Medium | Medium | Implement token refresh logic, handle 401 errors gracefully |
| File storage space constraints | Low | High | Implement quota per user, storage monitoring, cleanup policies |

### Medium Priority Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| Cross-browser file upload issues | Medium | Medium | Test on Chrome, Firefox, Safari, Edge |
| Malware in uploaded files | Low | High | Defer to Phase 3, use scanning service if needed |
| Concurrent upload conflicts | Low | Medium | Test concurrent uploads, implement optimistic locking |
| Image upload performance | Medium | Medium | Implement image compression in Phase 3 |

---

## Resource Allocation

### Phase 2 Team (Estimated)

- **Frontend Developer:** 1 FTE (Form, File Upload, Dashboard components)
- **Backend Developer:** 1 FTE (File upload endpoint, database schema, API)
- **QA Engineer:** 0.5 FTE (Manual testing, test automation)
- **Tech Lead:** 0.2 FTE (Code review, architecture decisions)

### Sprint Breakdown

- **Sprint 1:** File Upload - Both devs heavily involved (UI + API)
- **Sprint 2:** Dashboard - Frontend-heavy with QA
- **Sprint 3-4:** Sort/Filter + Detail/Edit - Parallel development
- **Sprint 5:** QA & Refinement - QA lead with developer support

---

## Approval & Sign-Off

### Phase 2 Gate Criteria
- [ ] All 6 stories in Phase 2 completed
- [ ] >80% test coverage (code + E2E)
- [ ] All acceptance criteria passing
- [ ] Code review approved
- [ ] QA sign-off on manual tests
- [ ] Performance baselines met
- [ ] Security review completed
- [ ] Documentation updated

### Sign-Off Checklist
- [ ] Tech Lead: Architecture & Code Review _______________
- [ ] QA Lead: Testing & Sign-Off _______________
- [ ] Product Manager: Requirements Validation _______________
- [ ] Project Manager: Timeline & Budget _______________

---

## Next Steps

### Immediate Actions (This Week)
1. [ ] Finalize IDEA-story-2 clarification questions with tech lead
2. [ ] Approve FileUpload story before implementation
3. [ ] Schedule Sprint 1 kickoff
4. [ ] Set up development environment for file upload (local storage vs S3 decision)
5. [ ] Create multer middleware skeleton

### Short-term (Next 2-4 Weeks)
1. [ ] Complete Sprint 1 (File Upload)
2. [ ] Begin specification for IDEA-story-3 (Dashboard)
3. [ ] Set up E2E test framework for file upload flows
4. [ ] Establish performance baseline metrics

### Medium-term (Months 2-3)
1. [ ] Complete Sprint 2-4 (Dashboard, Sort/Filter, Detail, Edit)
2. [ ] Begin Phase 3 planning (Evaluation & Workflow)
3. [ ] Conduct Phase 2 security review
4. [ ] Prepare for Phase 3 kickoff

---

## Related Documentation

- [agents.md](agents.md) - Project conventions and standards
- [IDEA-story-1.md](specs/stories/IDEA-story-1.md) - Submission Form spec (completed)
- [IDEA-story-2.md](specs/stories/IDEA-story-2.md) - File Upload spec (ready)
- [CLARIFICATION-IDEA-story-2.md](specs/stories/CLARIFICATION-IDEA-story-2.md) - 20 clarification questions
- [PHASE-4-COMPLETION-REPORT.md](PHASE-4-COMPLETION-REPORT.md) - E2E testing setup
- [STORY-2.1-IMPLEMENTATION-COMPLETE.md](STORY-2.1-IMPLEMENTATION-COMPLETE.md) - Story 1 completion report

---

**Document Status:** APPROVED FOR EXECUTION  
**Last Updated:** February 25, 2026  
**Next Review:** April 15, 2026 (Phase 2 midpoint check-in)
