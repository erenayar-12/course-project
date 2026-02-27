# STORY-3.5: Audit Logging — Implementation Plan

**Status:** PLANNING
**Story ID:** STORY-3.5
**Epic:** EPIC-3 (Idea Evaluation Workflow & Status Tracking)
**Sprint:** Backlog
**Story Points:** 5
**Priority:** P1 (Important)
**Persona:** Raj (Admin/Compliance Officer)
**Created:** February 26, 2026
**Updated:** February 26, 2026

---

## Engineering Implementation Plan

### 1. Database
- **Add `status_change_logs` table** to Prisma schema:
  - Fields: id (PK), idea_id (FK), old_status, new_status, new_status, evaluator_id (FK), evaluator_name, timestamp (UTC, ms precision), feedback (nullable)
  - Migration: `prisma/migrations/` and update `prisma/schema.prisma`

### 2. Backend API
- **Service logic:**
  - In the status update endpoint (e.g., `src/routes/ideas.routes.ts`), after a successful status change, create an audit log entry in the same DB transaction.
  - Ensure log is immutable (no update/delete endpoints for logs).
- **Types:**
  - Add `StatusChangeLog` type/interface in `src/types/ideaSchema.ts` or similar.
- **Tests:**
  - Add integration tests in `src/__tests__/` to verify log creation, field population, and immutability.

### 3. Frontend
- **No direct UI for this story** (display is handled in STORY-3.7), but ensure API changes do not break existing flows.

### 4. Acceptance Criteria Verification
- **AC1:** Test that every status change creates a log entry with all required fields.
- **AC2:** Test that all fields are correctly populated (including evaluator name, feedback, timestamp).
- **AC3:** Test timestamp precision and UTC correctness.
- **AC4:** Test feedback is included for rejections, null otherwise.
- **Immutability:** Attempt to update/delete a log and verify it fails.

### 5. File Locations (per agents.md)
- `prisma/schema.prisma` — DB schema
- `src/routes/ideas.routes.ts` — Status update endpoint
- `src/services/idea.service.ts` — Business logic
- `src/types/ideaSchema.ts` — Types/interfaces
- `src/__tests__/` — Integration tests

### 6. Commit Message Template
```
[backend] Implement audit logging for status changes

- Add status_change_logs table to Prisma schema
- Log all status transitions with evaluator, timestamp, feedback
- Enforce log immutability
- Add integration tests for audit logging
- Related spec: STORY-3.5-Audit-Logging.md
```

---

## Next Steps
- [ ] Review and approve plan
- [ ] Implement DB migration
- [ ] Update backend logic
- [ ] Add tests
- [ ] Validate against acceptance criteria
- [ ] Mark story as IN PROGRESS
