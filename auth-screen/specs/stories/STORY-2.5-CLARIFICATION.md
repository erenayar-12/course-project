# STORY-2.5: Idea Detail Page - Clarifications

**Status:** 🔄 CLARIFICATIONS IN PROGRESS  
**Date Started:** February 25, 2026  
**Owner:** Development Team  
**Next Phase:** `/speckit.plan` - Create implementation tasks after clarification

---

## Open Questions & Clarifications Needed

### 1. Edit Button Restrictions - Draft vs Submitted Status

**Question:** Should users be able to edit ideas after they're "Submitted", or only during "Draft" status?

**Current Spec:** AC4 shows edit button enabled for both "Draft" AND "Submitted"

**Options:**
- **Option A (Current):** Edit allowed for Draft OR Submitted (document in review can be updated)
- **Option B:** Edit only for Draft (once submitted, locked for review)
- **Option C:** Edit for Draft/Submitted, but with warning: "Changes may affect evaluation"

**Decision Needed:** [AWAITING PO CLARIFICATION]

**Impact:**
- Backend: Governs who can call PUT /api/ideas/:ideaId and when
- Frontend: Show/hide edit button based on status logic
- UX: Message to user about edit restrictions

---

### 2. Status Timeline/History Display (AC2 Extension)

**Question:** Should detail page display status history timeline (e.g., "Submitted Feb 25" → "Under Review Feb 26")?

**Current Spec:** AC2 mentions "Status timeline/history is displayed (if available from evaluation workflow)" but marked as optional/future

**Options:**
- **Option A (MVP):** Show current status ONLY (no timeline)
- **Option B (Phase 2):** Show timeline only if history exists in database
- **Option C (Future):** Full timeline with all status transitions and evaluator actions

**Decision Needed:** [SELECT MVP SCOPE]

**Recommended:** Option A for MVP (simplify AC2 to remove timeline mention)

**Impact:**
- Database: May need status_history table or createdAt tracking per transition
- Backend: Query for timeline data if needed
- Frontend: Timeline component (optional for future)

---

### 3. Rejection Feedback Content & Visibility

**Question:** Should rejection feedback (evaluator comments) be visible to submitters immediately, or after some workflow step?

**Current Spec:** AC6 shows feedback displayed on detail page after rejection

**Options:**
- **Option A:** Feedback visible immediately after rejection (current spec)
- **Option B:** Feedback only visible if status is "Rejected" (submitter clicks detail page)
- **Option C:** Feedback visible only after submitter views rejection letter (separate workflow)
- **Option D:** Feedback hidden until submission window closes

**Decision Needed:** [AWAITING PO & EVALUATOR INPUT]

**Recommended:** Option A (transparent feedback encourages resubmission)

**Impact:**
- Backend: evaluatorFeedback field in response (may be null initially)
- Frontend: Conditional display of feedback section
- UX: Messaging about evaluator expectations for improvement

---

### 4. Attachment Preview vs Download-Only

**Question:** Should attachments support inline preview (PDF, images), or download-only in MVP?

**Current Spec:** AC3 shows download functionality only

**Options:**
- **Option A (Current):** Download only (simple, MVP-friendly)
- **Option B:** Preview for images/PDFs, download for other types
- **Option C:** Full browser-based preview (pdf.js, image viewer)

**Decision Needed:** [SELECT MVP SCOPE]

**Recommended:** Option A for MVP (reduces frontend complexity, libraries, security review)

**Impact:**
- Frontend: Adds preview libraries if Option B/C selected
- Backend: No changes (same file serving endpoint)
- UX: "Download to view" messaging if preview not available

---

### 5. Delete Action - Soft Delete vs Hard Delete

**Question:** When user deletes an idea, should it be permanently removed (hard delete) or soft-deleted (marked as deleted, kept in db)?

**Current Spec:** AC5 says "removes the idea from the system" - ambiguous on whether it's hard or soft

**Options:**
- **Option A:** Hard delete (idea completely removed, cannot be recovered)
- **Option B:** Soft delete (mark deleted, keep in database for audit, hide from user)
- **Option C:** Soft delete with administrative options to permanently remove later

**Decision Needed:** [LEGAL/COMPLIANCE REVIEW]

**Recommended:** Option B (Soft delete for audit trail, GDPR compliance)

**Impact:**
- Database: Add is_deleted boolean or deleted_at timestamp column
- Backend: Queries must filter WHERE is_deleted = false
- Audit: Maintains deletion history for compliance
- Frontend: No change (user sees permanent deletion)

---

### 6. Edit Route Navigation (/ideas/:ideaId/edit)

**Question:** Should edit route be `/ideas/:ideaId/edit` or `/ideas/:ideaId?mode=edit` or reuse submission form?

**Current Spec:** AC4 links to `/ideas/:ideaId/edit` (placeholder, STORY-2.6 to implement)

**Options:**
- **Option A (Current):** Separate /edit route with dedicated edit form
- **Option B:** Query param `/ideas/:ideaId?mode=edit` with same form component
- **Option C:** Reuse `IdeaSubmissionForm.tsx` component (passed ideaId as prop)

**Decision Needed:** [ARCHITECTURE DECISION]

**Recommended:** Option C (Reuse existing form component, reduces duplication)

**Impact:**
- Frontend: IdeaSubmissionForm must support both create and edit modes
- Routing: Simpler with single component handling both flows
- STORY-2.6: Implementation approach determined

---

### 7. Unauthorized Access (AC9) - Error Detail Level

**Question:** How much detail should "403 Forbidden" error message contain?

**Current Spec:** "You don't have permission to view this idea" (generic)

**Options:**
- **Option A (Current):** Generic message (secure, no info leakage)
- **Option B:** Slightly more detail: "This idea belongs to another user"
- **Option C:** Maximum detail: Include owner name or contact info

**Decision Needed:** [SECURITY REVIEW]

**Recommended:** Option A (default for security, prevents user enumeration)

**Impact:**
- Backend: No change (return 403, same message)
- Frontend: Show generic error message
- Security: Prevents attackers from discovering whose ideas exist

---

### 8. Related Ideas Display (Future Enhancement)

**Question:** Should rejected ideas show links to similar/related ideas as suggestions?

**Current Spec:** Not mentioned (potential future feature)

**Consider for Phase 2:**
- Show category-related ideas
- Show submission period cohort
- Show evaluator's "approved ideas" as examples of success

**Decision:** [DEFER TO PHASE 2]

**Impact:** Not in MVP (add to backlog for future consideration)

---

### 9. Permission Levels - Can Evaluators See Submitted Ideas?

**Question:** In the detail page view, who should be able to access ideas?

**Current Spec:** AC9 says owner only, but doesn't mention other roles (evaluators, admins)

**Scenarios:**
1. Submitter viewing own idea - ✅ ALLOWED
2. Evaluator viewing a submitted idea - ❓ DEPENDS ON ROLE
3. Admin viewing any idea - ❓ DEPENDS ON ADMIN PERMISSIONS
4. Other users viewing idea - ❌ FORBIDDEN

**Decision Needed:** [RBAC DESIGN DECISION]

**Recommended:** 
- Submitter: Own ideas only
- Evaluator: Ideas in evaluation queue (STORY-2.3b) only
- Admin: All ideas (audit/management)

**Impact:**
- Backend: Authorization middleware checks user.role + ownership
- STORY-2.3b: Evaluator queue has separate detail page (different permissions)
- Security: Role-based granular access control

---

### 10. Attachment File Size Display Format

**Question:** How should file size be displayed to users?

**Current Spec:** AC3 says "file size (human-readable: "2.5 MB")"

**Formats to consider:**
- "2.5 MB" (decimal: 1MB = 1,000,000 bytes)
- "2.38 MiB" (binary: 1MiB = 1,048,576 bytes)
- "2,500,000 bytes"

**Decision:** [US STANDARD = DECIMAL MB]

**Recommended:** Decimal format "2.5 MB" (common for users, matches file explorers)

**Impact:**
- Frontend: Utility function formatBytes(bytes) → "2.5 MB"
- Backend: Include fileSize in bytes in API response, frontend formats
- UX: Consistent with user expectations

---

### 11. Delete Confirmation Modal - What Gets Deleted?

**Question:** Does delete remove ONLY the idea, or idea + all attachments + evaluation history?

**Current Spec:** AC5 says "removes the idea from the system" (ambiguous)

**Options:**
- **Option A:** Delete idea only (orphan attachments in storage)
- **Option B:** Delete idea + attachments from storage + comments/history (complete removal)
- **Option C:** Delete idea, archive attachments (keep for compliance, hide from UI)

**Decision Needed:** [DATA RETENTION POLICY]

**Recommended:** Option C (soft delete idea, soft delete attachments, keep for audit trail) per conversation in #11

**Impact:**
- Database: is_deleted flag on both ideas and attachments
- Storage: Files kept in object storage (not actually deleted)
- Compliance: Full deletion history available for audits
- Frontend: Message in confirmation modal "Your idea will be deleted (can be restored within 30 days)"

---

### 12. 404 vs 410 vs 403 Status Codes

**Question:** Should unauthorized access return 403, 404, or 410 (for deleted)?

**Current Spec:** AC10 mentions 404, AC9 mentions 403

**Semantics:**
- 403 Forbidden: User authenticated but not authorized
- 404 Not Found: Resource doesn't exist (or shouldn't reveal it exists)
- 410 Gone: Resource used to exist, deliberately deleted

**Decision Needed:** [HTTP BEST PRACTICES]

**Recommended:**
- AC9 (not owner): 403 Forbidden (user is authenticated, just unauthorized)
- AC10 (idea doesn't exist): 404 Not Found (standard)
- Soft-deleted idea: Could use 410 Gone (or 404 for same UX)

**Impact:**
- Backend: Return codes in error handler
- Frontend: Handle 403 vs 404 differently (different user messages)

---

### 13. Mobile Experience - Touch-Friendly Actions

**Question:** Should delete button on mobile show different UX (swipe, long-press, etc.)?

**Current Spec:** AC12 mentions "Touch targets (buttons) are at least 44x44 pixels" but no swipe/gesture mention

**Options:**
- **Option A:** Standard button tap (current spec)
- **Option B:** Swipe-to-delete gesture (iOS-style)
- **Option C:** Long-press to delete (Android-style)
- **Option D:** Multiple taps before delete confirmation (double-tap)?

**Decision Needed:** [MOBILE UX DESIGN]

**Recommended:** Option A (tap button) for MVP (simplest, most accessible, works across platforms)

**Impact:**
- Frontend: Standard button with modal, no gesture handlers needed
- Accessibility: Works with keyboard, voice controls
- Complexity: Minimal (no gesture library needed)

---

### 14. Loading Skeleton Variability

**Question:** Should skeleton loaders show actual content layout, or generic placeholders?

**Current Spec:** AC11 mentions "skeleton loader or spinner" but doesn't specify design

**Options:**
- **Option A:** Generic spinner (Loading...)
- **Option B:** Content-aware skeleton (shape of actual content)
- **Option C:** Skeleton + animated shimmer (SkeletonLoader from STORY-2.4)

**Decision Needed:** [UX CONSISTENCY]

**Recommended:** Option C (use SkeletonLoader created in STORY-2.4, shows actual layout while loading)

**Impact:**
- Frontend: Import SkeletonLoader component from STORY-2.4
- UX: Consistent loading states across app
- Code reuse: Single loading component library

---

### 15. Back Button Behavior - Preserve Filters?

**Question:** When user clicks "Back to My Ideas", should dashboard preserve active filters/sort?

**Current Spec:** AC8 says "Dashboard preserves any active filters/sort from before navigation"

**Implementation:** Browser history + URL params in query string

**Options:**
- **Option A (Current):** Preserve via URL history (browser back button works)
- **Option B:** Store in context/state (survives page refresh)
- **Option C:** localStorage backup of filter state

**Decision:** [ACCEPT CURRENT SPEC]

**Rationale:** URL params from STORY-2.4 naturally preserve state, browser back button works

**Impact:**
- Frontend: No change (already implemented in STORY-2.4)
- Routing: React Router handles history automatically

---

## Summary of Clarifications Needed Before Implementation

| # | Question | Owner | Priority | Target Date |
|---|----------|-------|----------|-------------|
| 1 | Edit after submission allowed? | PO | HIGH | Feb 26 |
| 2 | Timeline display in MVP? | PO | MEDIUM | Feb 26 |
| 3 | Rejection feedback visibility | PO + Evaluator | HIGH | Feb 26 |
| 4 | Attachment preview needed? | PO | MEDIUM | Feb 26 |
| 5 | Hard vs soft delete | Legal/Compliance | HIGH | Feb 27 |
| 6 | Edit route architecture | Tech Lead | MEDIUM | Feb 26 |
| 7 | Error message detail level | Security | MEDIUM | Feb 26 |
| 8 | Related ideas feature | Backlog | LOW | Phase 2 |
| 9 | Evaluator access to detail | PO | HIGH | Feb 26 |
| 10 | File size format | UX | LOW | Resolved ✅ |
| 11 | Delete cascading behavior | Data/Compliance | HIGH | Feb 27 |
| 12 | HTTP status codes | Tech Lead | MEDIUM | Feb 26 |
| 13 | Mobile gesture interactions | UX/Design | LOW | Resolved ✅ |
| 14 | Loading skeleton design | Tech Lead | LOW | Resolved ✅ |
| 15 | Back button state preservation | Tech Lead | LOW | Resolved ✅ |

---

## Recommended Clarifications Summary (Ready to Implement)

**Resolved (Can Proceed):**
- ✅ #10: Use decimal "MB" format
- ✅ #13: Standard tap buttons on mobile
- ✅ #14: Use SkeletonLoader from STORY-2.4
- ✅ #15: URL params naturally preserve state

**Awaiting Decisions:**
- ⏳ #1: Edit allowed after submission? → PO decision
- ⏳ #3: Show rejection feedback immediately? → PO + Evaluator design
- ⏳ #5: Soft delete for compliance → Legal review
- ⏳ #9: Can evaluators see submitted ideas? → RBAC design

**Can Proceed with Defaults:**
- #2: Timeline optional (AC2 mentions "if available")
- #4: Download-only for MVP
- #6: Suggest reusing IdeaSubmissionForm
- #7: Generic error messages (secure by default)
- #11: Soft delete + archive files
- #12: 403 for unauthorized, 404 for not found

---

## Next Steps

1. **Gather Clarifications** - PO, Evaluators, Security team to provide decisions
2. **Update STORY-2.5 Spec** - Incorporate clarified decisions
3. **Create Implementation Plan** - `/speckit.plan` to break into tasks
4. **Begin Development** - Phase 1: Backend endpoints, Phase 2: Frontend

**Timeline:** Clarifications by Feb 26, Planning by Feb 27, Implementation starts Feb 28

---

**Status Update:** 🔄 Awaiting stakeholder input on HIGH priority items (#1, #3, #5, #9)  
**Last Updated:** February 25, 2026
