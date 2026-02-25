# STORY-2.3b: Evaluator Queue - Clarifications Summary

**Status:** ✅ CLARIFIED & READY FOR PLANNING  
**Date Clarified:** February 25, 2026  
**Next Phase:** `/speckit.plan` - Create implementation tasks

---

## Clarifications Integrated

### 1. Queue Sorting (AC12-AC13)
**Question:** How should the evaluation queue be sorted?

**Clarification:** **Newest first (createdAt DESC)**
- Most recent submissions appear at the top of the queue
- Oldest pending evaluations sink to bottom
- This gives evaluators the most recent work first
- Implementation: ORDER BY createdAt DESC in database query

**Impact:** 
- Backend: `GET /api/evaluation-queue` adds `ORDER BY ideas.createdAt DESC`
- Frontend: No explicit sort dropdown needed (single default sort)

---

### 2. Queue Status Filtering (AC12)
**Question:** Should queue ONLY show SUBMITTED + UNDER_REVIEW, or include NEEDS_REVISION?

**Clarification:** **All open statuses (SUBMITTED, UNDER_REVIEW, NEEDS_REVISION)**
- "Open" means: awaiting evaluation or awaiting resubmission
- Evaluators see ideas they haven't finalized (not ACCEPTED/REJECTED)
- NEEDS_REVISION status indicates: evaluator requested changes, awaiting submitter resubmission
- Evaluators should be able to see these pending resubmissions

**Impact:**
- Backend: `GET /api/evaluation-queue` returns statuses: SUBMITTED OR UNDER_REVIEW OR NEEDS_REVISION
- Frontend: AC12 updated to clarify three statuses
- Database query: `WHERE status IN ('SUBMITTED', 'UNDER_REVIEW', 'NEEDS_REVISION')`

---

### 3. Evaluation History & Multiple Evaluations (AC14)
**Question:** When an idea has prior evaluation history, should evaluators UPDATE or SUBMIT NEW?

**Clarification:** **Allow multiple evaluations per idea (submit NEW record)**
- Each evaluator can submit a separate evaluation
- Creates new IdeationEvaluation record
- Builds immutable audit trail with all evaluations
- Example flow:
  1. Evaluator A: "Looks promising, needs more detail" → NEEDS_REVISION
  2. Submitter resubmits with more detail
  3. Evaluator B: "Great! This is ready" → ACCEPTED
  4. Full history shows both evaluations with timestamps

**Impact:**
- Backend: POST /api/ideas/:id/evaluate always creates NEW record (not UPDATE)
- Frontend: Modal doesn't edit previous evaluation, creates new one
- Database: No "previous evaluation replaced" logic needed
- UX: Clear indication "You are adding a NEW evaluation" in modal

---

### 4. Status Badge Color-Coding (AC13)
**Question:** Should status badges be color-coded like STORY-2.3a?

**Clarification:** **YES - Use same StatusBadge component from STORY-2.3a with colors:**
- `SUBMITTED` → Blue badge
- `UNDER_REVIEW` → Yellow badge
- `NEEDS_REVISION` → Orange badge
- `ACCEPTED` → Green (for reference/history)
- `REJECTED` → Red (for reference/history)

**Impact:**
- Frontend: Import StatusBadge component (reusable)
- Styling: Consistent color scheme across app
- Documentation: Update component reusability note

---

### 5. Attachment Display (AC13)
**Question:** How should attachment count be displayed?

**Clarification:** **Text format with icon** (consistent with STORY-2.3a)
- Show as: "📎 2 files" or "1 file" or "No attachments"
- Icon provides visual clarity
- Text provides specific count
- Implementation: Show in attachment column of queue table

**Impact:**
- Frontend: Loop through idea.attachments array, count and format
- Display: Icon + count text in queue row

---

### 6. CSV Export Columns (AC15)
**Question:** Which columns should be in CSV export?

**Clarification:** **All table columns from queue view:**
1. Submitter Name
2. Title
3. Category
4. Submission Date (createdAt)
5. Current Status
6. Attachment Count
7. Assigned To (current evaluator)

Plus optional:
8. Idea ID
9. Submission URL (backend can generate)

**Impact:**
- Backend: GET /api/evaluation-queue/export generates CSV with these columns
- Frontend: Download CSV file with header row + data rows
- Libraries: Use csv-stringify or papaparse for CSV generation
- Performance: Optimized for <10 seconds for 100 items

---

## Acceptance Criteria Status

| AC | Title | Clarified? | Notes |
|----|-------|-----------|-------|
| AC12 | Queue role-based view | ✅ | All open statuses (SUBMITTED, UNDER_REVIEW, NEEDS_REVISION) sorted DESC |
| AC13 | Queue columns display | ✅ | Color-coded status badges, attachment count format specified |
| AC14 | Status modal + history | ✅ | Multiple evaluations allowed per idea (new records) |
| AC15 | Bulk operations | ✅ | CSV columns defined, 100-item limit applied |
| AC16 | Audit trail | ✅ | Immutable history with all evaluations visible |

---

## Implementation Ready - No Ambiguities Remaining

✅ **Default sort order:** Newest first (createdAt DESC)  
✅ **Status filtering:** All open statuses (SUBMITTED, UNDER_REVIEW, NEEDS_REVISION)  
✅ **Multiple evaluations:** Allowed - new records created  
✅ **Color coding:** Reuse StatusBadge component from STORY-2.3a  
✅ **CSV format:** All table columns specified  
✅ **Attachment display:** Text + icon format  

---

## Dependencies Satisfied

| Dependency | Status | Notes |
|-----------|--------|-------|
| STORY-1.4 (RBAC) | ✅ Complete | Role validation + middleware ready |
| STORY-2.3a (Dashboard) | ✅ Complete | StatusBadge component can be reused |
| STORY-2.2 (File Upload) | ✅ Complete | Backend API endpoints exist |
| STORY-2.1 (Submission) | ✅ Complete | Idea data available |

---

## Next Steps

**Phase:** Planning  
**Command:** `/speckit.plan story 2.3b` 

**Deliverable:** Implementation plan with task breakdown covering:
- Frontend component structure (5 components)
- Backend endpoint implementation (7 endpoints)
- Database schema changes (IdeationEvaluation model)
- Testing tasks (unit + integration + E2E)
- Task estimates and dependencies

---

## QA Sign-Off Checklist

- [x] All AC clarified with specific technical details
- [x] No ambiguities in requirements
- [x] Dependencies verified and satisfied
- [x] Implementation approach defined
- [x] Test criteria clear and measurable
- [x] Status badge reuse confirmed
- [x] CSV format specified
- [x] Role-based access gates confirmed

---

**Status:** 🟢 **READY FOR IMPLEMENTATION PHASE**
