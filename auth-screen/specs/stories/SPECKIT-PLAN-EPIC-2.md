# SPECKIT IMPLEMENTATION PLAN: EPIC-2

**Epic:** EPIC-2 - Idea Submission & Management System  
**Generated:** February 25, 2026  
**Owner:** Development Team  
**Status:** DRAFT (Ready for Sprint Planning)

---

## Overview

This plan provides a detailed implementation roadmap for **EPIC-2** across all 6 user stories, following the conventions and structure defined in **agents.md**.

---

## 1. Story Portfolio Summary

| Story | Title | Priority | Points | Days | Status |
|-------|-------|----------|--------|------|--------|
| **2.1** | Create Idea Submission Form | P0 | 5 | 3-5 | DRAFT |
| **2.2** | File Upload Handling | P0 | 5 | 3-5 | DRAFT |
| **2.3** | Dashboard List View | P1 | 5 | 3-5 | DRAFT |
| **2.4** | Sort & Filtering | P1 | 2 | 1-2 | DRAFT |
| **2.5** | Detail Page | P1 | 5 | 3-5 | DRAFT |
| **2.6** | Edit Functionality | P2 | 5 | 3-5 | DRAFT |
| | **TOTAL** | | **27** | **16-27 days** | |

---

## 2. Implementation Roadmap & Dependencies

```
WEEK 1 (Feb 27 - Mar 3)
├─ STORY-2.1: Submission Form [CRITICAL PATH]
│  ├─ Setup: Create Prisma schema, database migrations
│  ├─ Frontend: React Hook Form + Zod validation
│  ├─ Backend: POST /api/ideas endpoint
│  └─ Testing: Unit + Integration tests
│
└─ STORY-2.2: File Upload [PARALLEL]
   ├─ Frontend: FileUploadInput component, progress tracking
   ├─ Backend: POST /api/ideas/:id/upload endpoint (multer)
   ├─ Database: ideaAttachments table schema
   └─ Testing: Upload validation, error handling

WEEK 2 (Mar 6 - Mar 10)
├─ STORY-2.3: Dashboard [DEPENDS ON 2.1]
│  ├─ Frontend: MyIdeasDashboard pagination
│  ├─ Backend: GET /api/ideas endpoint with pagination
│  ├─ Database: Query optimization, indexes
│  └─ Testing: Pagination, empty state, error states
│
├─ STORY-2.4: Sort & Filter [DEPENDS ON 2.3]
│  ├─ Frontend: Filter controls, sort dropdown, URL params
│  ├─ Backend: Query parameter support (status, sortBy, sortOrder)
│  └─ Testing: Filter/sort combinations
│
└─ STORY-2.5: Detail Page [DEPENDS ON 2.3]
   ├─ Frontend: IdeaDetailPage, attachment download
   ├─ Backend: GET /api/ideas/:id, GET /api/ideas/:id/attachment/download
   ├─ Authorization: Verify user owns idea
   └─ Testing: Detail display, download, authorization

WEEK 3 (Mar 13 - Mar 17)
└─ STORY-2.6: Edit Functionality [DEPENDS ON 2.5]
   ├─ Frontend: EditIdeaPage (reuse form from 2.1)
   ├─ Backend: PUT /api/ideas/:id endpoint
   ├─ Validation: Ensure status is "Submitted"
   ├─ File handling: Replace/remove attachment
   └─ Testing: Edit flow, authorization, status validation
```

### Critical Path Analysis
```
STORY-2.1 (5 days, critical)
    ↓
STORY-2.2 (5 days, parallel with 2.1)
    ↓
STORY-2.3 (5 days, depends on 2.1+2.2)
    ↓
STORY-2.4 (2 days, depends on 2.3) [PARALLEL]
STORY-2.5 (5 days, depends on 2.3) [PARALLEL]
    ↓
STORY-2.6 (5 days, depends on 2.5)
```

**Minimum Timeline:** 16 days (assuming parallel work on 2.1 & 2.2, then sequential)  
**With buffers (25% contingency):** 20 days (4 weeks)

---

## 3. Tech Stack Alignment (Per agents.md)

### Frontend Stack
- **Framework:** React 18
- **Build Tool:** Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui or Material-UI
- **Form Management:** React Hook Form (recommended)
- **Validation:** Zod (schema validation)
- **State Management:** React Context API (for form state)
- **HTTP Client:** Axios or Fetch API
- **Testing:** Jest + React Testing Library

### Backend Stack
- **Runtime:** Node.js v18+
- **Framework:** Express.js or Next.js API Routes
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** Auth0 (JWT tokens)
- **File Upload:** multer middleware
- **Testing:** Jest + Supertest

### Development Tools (For All Stories)
- **Package Manager:** npm or yarn
- **Linter:** ESLint
- **Formatter:** Prettier
- **Git Workflow:** Feature branches → PR review → merge main

---

## 4. Sprint Breakdown

### 🚀 Sprint 1: Foundation (Feb 27 - Mar 3, 5 days)

**Goal:** Establish form infrastructure and file upload foundation

#### Stories In Sprint
- [x] STORY-2.1: Idea Submission Form
- [x] STORY-2.2: File Upload Handling

#### Deliverables
- ✅ Prisma schema with ideas & ideaAttachments tables
- ✅ Database migrations applied
- ✅ POST `/api/ideas` endpoint (form submission)
- ✅ POST `/api/ideas/{id}/upload` endpoint (file upload)
- ✅ React form component with React Hook Form
- ✅ Zod validation schemas
- ✅ File upload progress tracking UI
- ✅ Error handling (validation, network, file validation)
- ✅ >80% test coverage for both stories

#### Team Composition
- **Frontend Lead:** 1 developer (React form + UI)
- **Backend Lead:** 1 developer (Express endpoints, DB)
- **QA:** 1 tester (test cases, E2E scripts)

#### Blockers to Resolve
- [ ] Clarification questions from CLARIFICATION-STORY-2.1.md
- [ ] Confirm Auth0 integration complete (from EPIC-1)
- [ ] Confirm PostgreSQL + Prisma setup complete

---

### 📊 Sprint 2: User Engagement (Mar 6 - Mar 10, 5 days)

**Goal:** Enable users to view and manage their ideas

#### Stories In Sprint
- [x] STORY-2.3: Dashboard List View
- [x] STORY-2.4: Sort & Filtering
- [x] STORY-2.5: Detail Page (Start)

#### Deliverables
- ✅ GET `/api/ideas` endpoint with pagination
- ✅ MyIdeasDashboard component (paginated list)
- ✅ Filter controls (Status dropdown)
- ✅ Sort dropdown (Date, Title, Status)
- ✅ IdeaDetailPage component (full idea view)
- ✅ GET `/api/ideas/{id}` endpoint
- ✅ File download functionality
- ✅ Status badges (color-coded)
- ✅ Empty state + error states
- ✅ URL parameter preservation (filter/sort state)
- ✅ Authorization checks (user owns idea)
- ✅ >80% test coverage

#### Team Composition
- **Frontend Lead:** 1 developer (Dashboard + Detail page)
- **Backend Lead:** 1 developer (Query optimization, endpoints)
- **QA:** 1 tester (pagination, filters, auth)

#### Dependencies from Sprint 1
- [ ] STORY-2.1 completed (form endpoints, schema)
- [ ] STORY-2.2 completed (file upload endpoints)

---

### ✏️ Sprint 3: Edit Capabilities (Mar 13 - Mar 17, 5 days)

**Goal:** Allow users to edit ideas before evaluation

#### Stories In Sprint
- [x] STORY-2.5: Detail Page (Complete)
- [x] STORY-2.6: Edit Functionality

#### Deliverables
- ✅ EditIdeaPage component (pre-populated form)
- ✅ PUT `/api/ideas/{id}` endpoint (update idea)
- ✅ Status validation (only "Submitted" ideas editable)
- ✅ File replacement/removal in edit flow
- ✅ Audit logging (who edited, when)
- ✅ Optimistic locking (concurrent edit handling)
- ✅ Success/error messaging
- ✅ Redirect to detail page after save
- ✅ >80% test coverage

#### Team Composition
- **Frontend Lead:** 1 developer (Edit form, UX flow)
- **Backend Lead:** 1 developer (PUT endpoint, transaction safety)
- **QA:** 1 tester (concurrent edits, auth, state validation)

#### Dependencies from Sprint 2
- [ ] STORY-2.3 completed (dashboard working)
- [ ] STORY-2.5 completed (detail page display)

---

### 🎯 Sprint 4: Integration & Polish (Mar 20 - Mar 24, 5 days)

**Goal:** E2E testing, performance optimization, deployment readiness

#### Activities
- [ ] Full E2E test suite execution (all 6 stories)
- [ ] Performance testing (dashboard with 1000+ ideas)
- [ ] Database query optimization
- [ ] API response time benchmarking
- [ ] Security audit (authorization, input validation)
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Documentation updates (README, component docs)
- [ ] Bug fixes from testing
- [ ] Staging deployment

#### Deliverables
- ✅ All E2E tests passing (100%)
- ✅ < 2s page load times (dashboard, detail, edit)
- ✅ No security vulnerabilities
- ✅ WCAG 2.1 AA accessibility pass
- ✅ Complete technical documentation
- ✅ Code coverage >80% across all stories

---

## 5. File Organization (Per agents.md)

### Specification Files
```
specs/
├── epics/
│   └── EPIC-2-Idea-Submission-Management.md
├── stories/
│   ├── STORY-2.1-Submission-Form.md
│   ├── STORY-2.2-File-Upload.md
│   ├── STORY-2.3-Dashboard.md
│   ├── STORY-2.4-Sort-Filter.md
│   ├── STORY-2.5-Detail-Page.md
│   ├── STORY-2.6-Edit-Functionality.md
│   └── CLARIFICATION-STORY-2.1.md
```

### Source Code Structure
```
src/
├── components/
│   ├── ideaSubmissionForm.tsx        [STORY-2.1]
│   ├── formTextField.tsx             [STORY-2.1]
│   ├── formTextArea.tsx              [STORY-2.1]
│   ├── formSelect.tsx                [STORY-2.1]
│   ├── fileUploadInput.tsx           [STORY-2.2]
│   ├── myIdeasDashboard.tsx          [STORY-2.3]
│   ├── ideaListItem.tsx              [STORY-2.3]
│   ├── idea StatusBadge.tsx          [STORY-2.3]
│   ├── ideaDetailPage.tsx            [STORY-2.5]
│   └── editIdeaPage.tsx              [STORY-2.6]
├── types/
│   └── ideaSchema.ts                 [STORY-2.1]
├── services/
│   └── ideas.service.ts              [2.1, 2.2, 2.3, 2.5, 2.6]
├── api/
│   └── routes/
│       └── ideas.ts                  [All stories]
├── hooks/
│   └── useIdeas.ts                   [2.3, 2.4]
└── __tests__/
    ├── ideaSubmissionForm.test.tsx   [STORY-2.1]
    ├── fileUploadInput.test.tsx      [STORY-2.2]
    ├── ideaSchema.test.ts            [STORY-2.1]
    ├── ideas.service.test.ts         [All]
    └── ideas.api.test.ts             [All]
```

### Naming Conventions (Per agents.md)
- **Components:** PascalCase (e.g., `IdeaSubmissionForm`)
- **Component Files:** camelCase (e.g., `ideaSubmissionForm.tsx`)
- **Functions:** camelCase (e.g., `handleSubmit`, `fetchIdeas`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `MAX_FILE_SIZE`)
- **Types/Interfaces:** PascalCase (e.g., `IdeaResponse`)
- **Database Tables:** snake_case plural (e.g., `ideas`, `idea_attachments`)

---

## 6. Acceptance Criteria Checklist

### Story-Level QA Gates
```
STORY-2.1 ✓ Ready for Sprint 1
├─ [?] Clarifications reviewed and approved
├─ [ ] EPIC-1 Auth integration complete
├─ [ ] Prisma setup complete
├─ [ ] PostgreSQL accessible
└─ [ ] React 18 + Vite + TS configured

STORY-2.2 ✓ Ready for Sprint 1
├─ [ ] Multer configured
├─ [ ] File storage directory ready
├─ [ ] File size limits defined (10MB)
├─ [ ] Supported MIME types defined
└─ [ ] Story-2.1 endpoints available

STORY-2.3 ✓ Ready for Sprint 2
├─ [ ] STORY-2.1 completed & merged
├─ [ ] STORY-2.2 completed & merged
├─ [ ] Database indexes created
└─ [ ] Pagination logic approved

STORY-2.4 ✓ Ready for Sprint 2
├─ [ ] STORY-2.3 completed & merged
├─ [ ] Filter/sort backend support planned
└─ [ ] URL parameter format approved

STORY-2.5 ✓ Ready for Sprint 2
├─ [ ] STORY-2.3 completed & merged
├─ [ ] Detail page mockups approved
└─ [ ] Authorization pattern defined

STORY-2.6 ✓ Ready for Sprint 3
├─ [ ] STORY-2.5 completed & merged
├─ [ ] Edit form components available
└─ [ ] Update endpoint design approved
```

---

## 7. Risk Assessment & Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| **Clarifications delay sprint start** | HIGH | MEDIUM | Resolve by Feb 26 (see CLARIFICATION-STORY-2.1.md) |
| **Auth0 integration incomplete** | MEDIUM | HIGH | Verify with EPIC-1 team before Sprint 1 |
| **Database query performance issues** | MEDIUM | MEDIUM | Add indexes early, load test with 10k ideas |
| **File upload concurrent issues** | MEDIUM | MEDIUM | Use UUID prefixes, test with parallel uploads |
| **Form state complexity** | LOW | MEDIUM | Use React Hook Form + Context API |
| **Browser/mobile compatibility** | LOW | MEDIUM | Test on Chrome, Firefox, Safari, mobile browsers |
| **Scope creep (duplicate detection, etc)** | MEDIUM | MEDIUM | Keep to MVP scope, defer Phase 2 features |
| **Authentication token expiration** | LOW | HIGH | Implement token refresh in Auth service |

---

## 8. Definition of Done (Sprint-Level)

### For Each Story
```
Code Quality
├─ [ ] Code follows naming conventions from agents.md
├─ [ ] TypeScript: No compilation errors (tsc --noEmit)
├─ [ ] ESLint: 0 warnings/errors
├─ [ ] Prettier: Code formatted
└─ [ ] No console warnings/errors

Testing
├─ [ ] Unit tests: >80% coverage
├─ [ ] Component tests: >80% coverage
├─ [ ] Integration tests: Critical paths covered
├─ [ ] E2E tests: User flows validated
└─ [ ] All tests passing locally + CI/CD

Documentation
├─ [ ] Component JSDoc comments
├─ [ ] API endpoint comments
├─ [ ] Database schema documented
├─ [ ] README updated
└─ [ ] Spec file linked in code

Security & Performance
├─ [ ] No hardcoded secrets
├─ [ ] Input validation (client + server)
├─ [ ] Authorization checks (user owns resource)
├─ [ ] API response times < 2s
├─ [ ] Database queries optimized

Accessibility
├─ [ ] WCAG 2.1 AA compliance
├─ [ ] Keyboard navigation working
├─ [ ] Screen reader friendly
└─ [ ] Color contrast verified

Git & Review
├─ [ ] Feature branch from main
├─ [ ] Commit messages follow format: [subsystem] description
├─ [ ] PR description references spec: STORY-2.X.md
├─ [ ] Code review approved by 2+ reviewers
└─ [ ] Merged to main via approved PR
```

---

## 9. Resource Allocation

### Team Makeup (Recommended)
```
Sprint 1 (Feb 27 - Mar 3)
├─ Frontend Developer #1: 100% (STORY-2.1)
├─ Backend Developer #1: 100% (STORY-2.1)
├─ Frontend Developer #2: 100% (STORY-2.2 - parallel)
├─ Backend Developer #2: 100% (STORY-2.2 - parallel)
└─ QA Engineer: 100% (Writing test cases)

Sprint 2 (Mar 6 - Mar 10)
├─ Frontend Developer #1: 100% (STORY-2.3, 2.4, 2.5)
├─ Backend Developer #1: 100% (STORY-2.3, 2.4, 2.5)
└─ QA Engineer: 100% (Integration testing)

Sprint 3 (Mar 13 - Mar 17)
├─ Frontend Developer #1: 100% (STORY-2.6)
├─ Backend Developer #1: 100% (STORY-2.6)
└─ QA Engineer: 100% (Concurrent edit scenarios)

Sprint 4 (Mar 20 - Mar 24)
├─ Full Team: All hands on E2E, optimization, docs
└─ DevOps: Staging deployment, performance monitoring
```

**Total Resource Days:** 92 person-days (23 days × 4 developers)

---

## 10. Communication Schedule

### Daily Standups
- **Time:** 9:00 AM EST
- **Duration:** 15 minutes
- **Attendees:** All team members + Product Owner
- **Format:** What did you do? What's next? Any blockers?

### Sprint Planning
- **Day:** Monday of each sprint
- **Duration:** 1 hour
- **Agenda:** Review sprint goals, assign stories, clarify acceptance criteria

### Sprint Retrospective
- **Day:** Friday of each sprint
- **Duration:** 1 hour
- **Agenda:** What went well? What to improve? Action items?

### Weekly Stakeholder Update
- **Day:** Wednesday
- **Distribution:** Product Owner, Leadership
- **Content:** Progress update, burndown, risks/issues

---

## 11. Success Metrics

### Quality Metrics
| Metric | Target | Current |
|--------|--------|---------|
| Code Coverage | >80% | TBD |
| Test Pass Rate | 100% | TBD |
| TypeScript Errors | 0 | TBD |
| ESLint/Prettier Issues | 0 | TBD |
| WCAG 2.1 AA Compliance | 100% | TBD |

### Performance Metrics
| Metric | Target | Current |
|--------|--------|---------|
| Form Load Time | <2s | TBD |
| Dashboard Load (100 ideas) | <3s | TBD |
| API Response Time | <500ms | TBD |
| File Upload Speed (10MB) | <30s | TBD |

### Timeline Metrics
| Milestone | Target Date | Status |
|-----------|-------------|--------|
| Clarifications Approval | Feb 26 | PENDING |
| Sprint 1 Complete | Mar 3 | NOT STARTED |
| Sprint 2 Complete | Mar 10 | NOT STARTED |
| Sprint 3 Complete | Mar 17 | NOT STARTED |
| Sprint 4 Complete | Mar 24 | NOT STARTED |
| Production Ready | Mar 28 | NOT STARTED |

---

## 12. Next Steps

### This Week (Feb 25 - Feb 28)
1. [ ] **Stakeholder Review:** Present this plan to team + Product Owner
2. [ ] **Clarifications:** Team discusses and approves answers to CLARIFICATION-STORY-2.1.md
3. [ ] **Environment Setup:** Ensure Prisma, PostgreSQL, React 18, Vite all configured
4. [ ] **Test Infrastructure:** Jest + React Testing Library configured
5. [ ] **Auth Verification:** Confirm EPIC-1 (Auth0 integration) is production-ready

### Next Week (Mar 3 - Mar 7)
1. [ ] Sprint 1 Planning (Monday, Mar 3)
2. [ ] STORY-2.1 Implementation Kickoff
3. [ ] STORY-2.2 Implementation Kickoff (parallel)
4. [ ] Daily standups begin

### Success Criteria for Plan Approval
- [ ] Team has reviewed and understands the plan
- [ ] Clarifications documented and approved
- [ ] All dependencies verified (Auth, DB, tooling)
- [ ] Resources allocated and committed
- [ ] Sprint 1 stories assigned to developers
- [ ] Test cases drafted for both Sprint 1 stories

---

## References

- **Epic Spec:** [EPIC-2-Idea-Submission-Management.md](../epics/EPIC-2-Idea-Submission-Management.md)
- **Story Specs:** See `specs/stories/STORY-2.*.md` files
- **Clarifications:** [CLARIFICATION-STORY-2.1.md](CLARIFICATION-STORY-2.1.md)
- **Project Conventions:** [agents.md](../../agents.md)
- **Tech Stack Report:** [TECH_STACK_REPORT.md](../../TECH_STACK_REPORT.md)
- **Development Plan:** [DEVELOPMENT-PLAN.md](../../DEVELOPMENT-PLAN.md)

---

**Plan Status:** DRAFT (Ready for team review)  
**Review Deadline:** February 26, 2026  
**Sprint Start:** February 27, 2026  
**Execution Lead:** [Team Lead Name]  
**Last Updated:** February 25, 2026
