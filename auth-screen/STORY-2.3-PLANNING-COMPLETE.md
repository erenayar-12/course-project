# STORY-2.3a & STORY-2.3b Implementation Plans Ready

**Date:** February 25, 2026  
**Status:** ✅ PLANNING PHASE COMPLETE  
**Next Phase:** `/speckit.tasks` - Generate task assignments

---

## Planning Summary

Comprehensive implementation plans created for both stories following agents.md conventions. Both stories have completed the speckit workflow phases through planning and are ready for task breakdown and team assignments.

---

## STORY-2.3a: User Dashboard (Test Implementation + Components)

**Type:** Frontend Component Implementation  
**Story Points:** 5  
**Estimated Time:** 2-3 days  
**Status:** ✅ Tests created, spec clarified, plan finalized

### Key Features
- Display user's submitted ideas with pagination (10 items/page)
- Statistics dashboard showing counts and percentages per status
- Color-coded status badges (reusable component)
- Responsive design (mobile/tablet/desktop)
- Empty state with CTA to submission form
- Loading and error states

### Components to Implement
1. **UserDashboard.tsx** - Main container page
2. **StatusBadge.tsx** - Reusable status badge component (5 colors)
3. **IdeaListItem.tsx** - Single idea row with all columns
4. **IdeaStatsBar.tsx** - Statistics card with percentages
5. **Utility functions** - paginationUtils, statisticsCalculator

### Testing
- **51 tests already written** (Testing Pyramid: 70% unit, 20% integration, 10% E2E)
- Unit tests: 31 (StatusBadge, IdeaListItem, IdeaStatsBar, utilities)
- Integration tests: 14 (Dashboard flows, auth gates)
- E2E tests: 6 (Load, pagination, responsive)

### API Integration
- `GET /api/ideas?limit=10&offset=0` - Fetch user's ideas
- Pagination offset calculation: `(page - 1) * 10`
- Error handling + retry button

### Definition of Done
- All 51 tests passing
- Components implemented per spec
- API integration working
- Responsive design verified
- Code reviewed and merged

---

## STORY-2.3b: Evaluator Queue

**Type:** Full-Stack Feature (Frontend + Backend)  
**Story Points:** 8  
**Estimated Time:** 4-5 days  
**Status:** ✅ Spec clarified, clarifications integrated, plan finalized

### Key Features
- Evaluator-only queue showing all open evaluation statuses
- Ideas sorted newest first (createdAt DESC)
- Status filtering (SUBMITTED, UNDER_REVIEW, NEEDS_REVISION)
- Evaluation modal with status selection and comments
- Multiple evaluations allowed per idea (sequential evaluations)
- Immutable audit trail showing all evaluations
- Bulk operations (status update, assign, CSV export)
- 100-item limit on bulk operations for performance

### Frontend Components (5)
1. **EvaluationQueue.tsx** - Main queue page with role gate
2. **EvaluationQueueRow.tsx** - Queue row with checkbox and review button
3. **EvaluationModal.tsx** - Form modal for evaluation (status, comments, file)
4. **EvaluationHistory.tsx** - Immutable audit trail timeline
5. **BulkActionsBar.tsx** - Bulk selection and action controls

### Backend (6 API Endpoints)
1. **GET /api/evaluation-queue** - Fetch queue with open statuses
2. **POST /api/ideas/:id/evaluate** - Submit new evaluation
3. **GET /api/ideas/:id/evaluation-history** - Get audit trail
4. **POST /api/evaluation-queue/bulk-status-update** - Bulk update (100-item limit)
5. **POST /api/evaluation-queue/bulk-assign** - Reassign evaluator
6. **GET /api/evaluation-queue/export** - CSV download (all table columns)

### Database Changes
- New model: `IdeationEvaluation` (tracks all evaluations)
- Add status: `NEEDS_REVISION` to IdeaStatus enum
- Relations: Idea.evaluations[], User.evaluations[]
- Migration: `npx prisma migrate dev --name add_ideation_evaluations`

### Role-Based Access
- ProtectedRoute: Evaluators/Admins only (redirect submitters)
- RoleCheck middleware: Validated on all evaluation endpoints (403 errors)

### Clarifications Integrated
- **Sort:** Newest first (createdAt DESC)
- **Status Filter:** All open statuses (SUBMITTED, UNDER_REVIEW, NEEDS_REVISION)
- **Multiple Evaluations:** Each evaluation creates new record (not replaced)
- **Status Badges:** Color-coded, reuse StatusBadge from 2.3a
- **CSV Export:** All table columns (Submitter, Title, Category, Date, Status, Attachments, Assigned To)

### Testing Strategy
- Unit tests: Component rendering, form validation
- Integration tests: API endpoints, role-based access
- E2E tests: Queue access, evaluation workflow, bulk operations

### Definition of Done
- All 5 AC (AC12-AC16) implemented
- Role validation enforced (evaluator/admin only)
- Database migration successful
- Bulk operations support (select, update, assign, export)
- Audit trail immutable (no deletions)
- All tests passing
- Responsive design verified
- Code reviewed and merged

---

## Workflow Progress

### Speckit Workflow Phases

| Story | Phase 1: Specify | Phase 2: Clarify | Phase 3: Plan | Phase 4: Tasks | Phase 5: Implement |
|-------|---|---|---|---|---|
| **STORY-2.3a** | ✅ | ✅ | ✅ | ➡️ Next | ⏳ Ready |
| **STORY-2.3b** | ✅ | ✅ | ✅ | ➡️ Next | ⏳ Ready |
| **STORY-1.4** | ✅ | ✅ | ✅ | ✅ | ✅ Complete |

### Next Steps

**Phase 4: Tasks** - Run `/speckit.tasks` to:
1. Generate detailed task breakdown for each AC
2. Assign tasks to team members
3. Create Jira/tracking tickets
4. Define task estimates and dependencies
5. Establish review/QA checkpoints

**Phase 5: Implementation** - Execute stories:
1. STORY-2.3a: Implement components to pass 51 tests
2. STORY-2.3b: Implement full-stack features with database changes

---

## Dependencies & Readiness

### STORY-2.3a Dependencies
- ✅ STORY-2.1 (Submission Form) - Idea data available
- ✅ STORY-1.2 (Auth0) - Authentication working
- ✅ STORY-2.2 (File Upload) - Attachment support
- ✅ Tests created (ready to implement against)

**Status:** READY FOR IMPLEMENTATION

### STORY-2.3b Dependencies
- ✅ STORY-1.4 (RBAC) - Role validation complete
- ✅ STORY-2.3a (Dashboard) - StatusBadge component reusable
- ✅ STORY-2.1 (Submission Form) - Idea data available
- ✅ STORY-2.2 (File Upload) - File handling infrastructure
- ✅ Design & clarifications complete

**Status:** READY FOR IMPLEMENTATION

---

## Implementation Capacity

### STORY-2.3a Resources
- **Effort:** 2-3 days (5 points)
- **Team Size:** 1 frontend engineer
- **Key Skills:** React, TypeScript, UI component development, testing
- **Tests Written:** 51 (ready to implement against)

### STORY-2.3b Resources
- **Effort:** 4-5 days (8 points)
- **Team Size:** 1 frontend engineer + 1 backend engineer (can work in parallel)
- **Frontend Skills:** React, TypeScript, form handling, bulk operations UI
- **Backend Skills:** Node.js/Express, Prisma, REST API, database migrations

### Recommended Assignment
- **STORY-2.3a:** Full-stack engineer (primarily frontend)
- **STORY-2.3b:** Two-person team (frontend + backend) OR sequential implementation

### Parallel Execution Possible
Both stories can be implemented in parallel since:
1. STORY-2.3a is frontend-only (no backend changes needed)
2. STORY-2.3b backend can start before 2.3a completes
3. StatusBadge component from 2.3a is reused in 2.3b (simple dependency)

**Recommended Timeline:** Start both concurrently, 2.3a finishes ~Day 2, 2.3b finishes ~Day 4-5

---

## Quality Metrics

### Code Quality Targets
- Test Coverage: 80%+ for new code
- No TypeScript errors or warnings
- No ESLint violations
- Code review approval required before merge

### Performance Targets
- Queue loads <3 seconds with 100+ ideas
- Bulk operations complete <2 seconds for 100 items
- CSV export <10 seconds for 100 items
- Mobile dashboard responsive and touch-friendly

### Accessibility Targets
- WCAG AA compliance
- ARIA labels on interactive elements
- Semantic HTML structure
- Keyboard navigation support

---

## Risk Assessment

### STORY-2.3a Risks (Low)
- **Tests vs. Implementation Mismatch:** Low risk (tests are authoritative)
- **Component Styling:** Low risk (use Tailwind CSS patterns from 2.1)
- **Mitigation:** Early test execution to catch issues

### STORY-2.3b Risks (Medium)
- **Database Migration:** Medium risk (ensure backup before migration)
- **Multiple Evaluations Model:** Medium risk (test thoroughly to prevent overwriting)
- **Audit Trail Immutability:** Medium risk (enforce with DB constraints)
- **Bulk Operations Performance:** Low risk (100-item limit prevents timeout)
- **Mitigation:** Test migration on backup DB, thorough testing of evaluation flows

---

## Sign-Off Checklist

- [x] STORY-2.3a plan complete and comprehensive
- [x] STORY-2.3b plan complete and comprehensive
- [x] All AC mapped to implementation tasks
- [x] API specifications detailed with examples
- [x] Database schema defined
- [x] Component architecture documented
- [x] Testing strategy defined
- [x] Timeline estimates provided
- [x] Risk mitigation identified
- [x] Definition of Done established
- [x] Success criteria defined

**Overall Status:** ✅ PLANS APPROVED & READY FOR TASK BREAKDOWN

---

## Recommended Reading Order

1. **IMPLEMENTATION-PLAN-STORY-2.3a.md** - User Dashboard components
2. **IMPLEMENTATION-PLAN-STORY-2.3b.md** - Evaluator Queue features
3. **STORY-2.3a-TESTING-PLAN.md** (ref) - Test specifications
4. **STORY-2.3b-CLARIFICATIONS.md** (ref) - Clarification details
5. **specs/stories/STORY-2.3a-User-Dashboard.md** (ref) - User story spec
6. **specs/stories/STORY-2.3b-Evaluator-Queue.md** (ref) - User story spec

---

**Next Command:** `/speckit.tasks according to agents.md`

This will generate granular task assignments for both stories with:
- AC-by-AC task breakdown
- Subtask dependencies
- Sprint planning
- Team assignments
- Risk tracking
