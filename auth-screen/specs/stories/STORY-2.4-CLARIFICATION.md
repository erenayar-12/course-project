# STORY-2.4 Clarification & Open Questions

**Document:** Clarification Report  
**Story:** STORY-2.4 (Sort & Filter)  
**Date:** February 25, 2026  
**Status:** PENDING PRODUCT OWNER REVIEW

---

## Overview

This document identifies ambiguities, gaps, and assumptions in STORY-2.4 that require clarification before implementation begins. Resolving these questions will ensure the team has a shared understanding and can estimate accurately.

---

## Critical Questions (MUST RESOLVE)

### Q1: Multiple Status Filters - OR vs AND Logic?
**Issue:** AC1 shows filter control with options "All, Submitted, Under Review, Needs Revision, Approved, Rejected"

**Ambiguity:** Can users select MULTIPLE statuses simultaneously? Or only ONE status at a time?

**Example Scenarios:**
- Scenario A (Single select): User picks "Submitted" → shows only "Submitted" ideas
- Scenario B (Multi-select): User picks "Submitted" + "Under Review" → shows ideas with EITHER status

**Questions:**
- [ ] Should users be able to filter by multiple statuses at once (e.g., show all ideas that are "Submitted" OR "Under Review")?
- [ ] Or should filter be single-select (one status at a time)?
- [ ] How many statuses can be selected simultaneously (if multi-select)?

**Impact:** Changes URL query structure, backend query logic, frontend UI (checkbox vs radio button)

**Recommendation:** Clarify with PO. Single-select is simpler for MVP; multi-select can be Phase 2.

---

### Q2: Filter Persistence - Local Storage or Just URL?
**Issue:** AC9 says "user bookmarks the URL" → filters apply on page load

**Ambiguity:** What if user closes the browser and comes back later? Do filters persist?

**Example Scenarios:**
- Scenario A: User applies "Under Review" filter → closes browser → returns next day → sees all ideas (no persistence)
- Scenario B: User applies "Under Review" filter → closes browser → returns next day → sees "Under Review" filter still active (with localStorage)

**Questions:**
- [ ] Should filter preferences persist indefinitely in localStorage?
- [ ] Should they reset on new browser session?
- [ ] Should we set an expiration time on saved filters (e.g., cleared after 30 days)?

**Impact:** Scope change; adds localStorage/persistence logic to frontend

**Recommendation:** For MVP, keep it URL-based only (no persistence). Store filters in URL params via React Router.

---

### Q3: Chips vs Inline Display - Where Should Active Filters Display?
**Issue:** AC6 says "Applied filters are displayed as removable chips above the list"

**Ambiguity:** Exact placement and number of chips not specified

**Example Scenarios:**
- Scenario A: Show only SELECTED filters (e.g., if "Under Review" selected, show 1 chip)
- Scenario B: Show filter + sort as separate chips (e.g., show 2 chips: "Under Review" + "Newest First")
- Scenario C: Show current sort option in dropdown, only show de-active filter as chips

**Questions:**
- [ ] Should we display the CURRENT sort order as a chip, or leave it only in the dropdown?
- [ ] Row-based or full-width chip container?
- [ ] Max number of chips before they wrap to second line?

**Impact:** UI/UX decision; minimal backend impact

**Recommendation:** Show only ACTIVE FILTERS as chips (not sort). Sort only shown in dropdown for simplicity.

---

### Q4: "Clear All" Scope - Does It Clear Sort Too?
**Issue:** AC7 says "Clear All Filters" resets filters but doesn't explicitly mention sort

**Ambiguity:** When user clicks "Clear All Filters", should it:
- Clear ONLY filter (keep sort setting)?
- Clear filter AND sort (reset to default sort)?

**Example:**
- User has: Filter="Submitted", Sort="Title A-Z"
- Clicks "Clear All"
- Result A: Filter cleared, Sort stays at "Title A-Z"
- Result B: Both cleared, resets to default sort "Date Newest First"

**Questions:**
- [ ] Should "Clear All Filters" button also reset sort to default?
- [ ] Or should there be a separate "Reset All" button that clears both?
- [ ] Current naming suggests filters only (sort is not a "filter")

**Impact:** UX consistency; minimal technical impact

**Recommendation:** "Clear All Filters" clears filter only. Keep sort as-is. Separate "Reset All" button for complete reset.

---

### Q5: Empty Results - What Should Happen?
**Issue:** No AC covers the case when filters result in 0 ideas

**Ambiguity:** User applies filter "Approved" but has no approved ideas

**Example Scenarios:**
- No message shown, just blank table
- Message: "No ideas match this filter. Try adjusting your filters."
- Suggestions: "No ideas found. Here are similar filters..."

**Questions:**
- [ ] What should the UI show when filter returns 0 results?
- [ ] Should there be a helpful message?
- [ ] Should suggestions be offered (e.g., "Try viewing all ideas")?

**Impact:** UX polish; slightly changes acceptance criteria

**Recommendation:** Show empty state message with "Clear Filters" button suggestion.

---

### Q6: Sorting Null Values - Ideas Without Titles?
**Issue:** AC4 says "Sort by Title (A-Z)" but doesn't specify behavior for null/empty titles

**Ambiguity:** Some ideas might have empty or null titles. How should they sort?

**Questions:**
- [ ] Should ideas with null/empty titles appear at start or end of sorted list?
- [ ] Should frontend validate that titles are never empty?
- [ ] What about special characters or numbers in titles?

**Impact:** Edge case handling; backend query logic

**Recommendation:** Ensure DB constraint prevents null titles. Sort those rare cases to end of list.

---

## UI/UX Design Questions (SHOULD CLARIFY)

### Q7: Mobile Responsiveness - Filter Controls Layout
**Issue:** AC1-AC2 show "controls" but don't specify mobile layout

**Questions:**
- [ ] On mobile (<768px), should filter/sort be:
  - A) Stacked vertically?
  - B) In a collapsible menu/drawer?
  - C) In tabs?
  - D) Hidden behind a "Filter" button?
- [ ] Should filters still be sticky on mobile?

**Recommendation:** Use collapsible drawer/modal for filters on mobile; show sort in main view.

---

### Q8: Filter/Sort Control Position - Fixed or Scrollable?
**Issue:** Spec doesn't define if filter controls scroll with page

**Questions:**
- [ ] Should filter controls be:
  - A) Fixed to top (always visible)?
  - B) Sticky (scroll away but snap back)?
  - C) Normal scroll with page?
- [ ] At what scroll position should they become sticky?

**Recommendation:** Sticky positioning - stays visible when scrolling table, but scrolls away with page header.

---

### Q9: Loading State - What Should Display During Filter/Sort?
**Issue:** AC10 mentions "no loading spinner exceeds 1 second" but doesn't specify what loads

**Questions:**
- [ ] Should table rows show skeleton loaders?
- [ ] Should filter controls be disabled during loading?
- [ ] Should there be a spinner overlay?
- [ ] What should text say? ("Loading...", "Filtering...", etc.)

**Recommendation:** Show skeleton loaders in table rows; disable filter controls; include micro-copy "Filtering ideas..."

---

## Technical/Implementation Questions (SHOULD CLARIFY)

### Q10: Sortable Fields - Should We Add Description or Category?
**Issue:** AC2 only includes sort by Date and Title

**Questions:**
- [ ] Should sort options include:
  - [ ] Description (alphabetical)?
  - [ ] Category (alphabetical)?
  - [ ] Status (alphabetical)?
  - [ ] Submitter email?
- [ ] Or keep it simple: Date + Title only (MVP)?

**Impact:** Backend query complexity; frontend UI

**Recommendation:** MVP scope: Title + Date only. Add category/status sorting in Phase 2.

---

### Q11: Default Pagination Limit - 10 Items Per Page?
**Issue:** Backend code example uses `limit = 10` but isn't explicitly stated in AC

**Questions:**
- [ ] Is 10 items per page the right default?
- [ ] Should this be configurable by user (e.g., "Show 25 per page")?
- [ ] What's the max items per page for performance?

**Recommendation:** Keep 10 as default. Add "Items per page" selector in Phase 2.

---

### Q12: Case Sensitivity - URL Parameters
**Issue:** AC3 shows `?status=UNDER_REVIEW` but database might have different casing

**Questions:**
- [ ] Should URL params be case-insensitive?
- [ ] Should backend normalize `?status=under_review` → `UNDER_REVIEW`?
- [ ] What if old bookmarks have wrong casing?

**Recommendation:** Always uppercase status values; validate & normalize on backend.

---

### Q13: Role-Based Filter Access - Can Admin See Others' Ideas?
**Issue:** Spec doesn't address multi-tenancy or role differences

**Questions:**
- [ ] Should admins/evaluators be able to filter other users' ideas?
- [ ] Should this story apply to evaluators viewing the evaluation queue?
- [ ] Should filters be different for different roles?

**Impact:** Backend scope; authorization logic

**Recommendation:** In STORY-2.4, filter only applies to "My Ideas" (own user's ideas). Evaluators are covered by STORY-2.3b separately.

---

## Assumptions That Should Be Validated

### Assumption 1: All Ideas Have Status Fields
**Current Assumption:** All ideas in DB have a non-null `status` field (DRAFT, SUBMITTED, UNDER_REVIEW, NEEDS_REVISION, APPROVED, REJECTED)

**Question:** Is this enforced by DB schema or application logic?

**Validation Needed:** Confirm STORY-2.1 created proper schema with status NOT NULL + default value.

---

### Assumption 2: URL Params are Always Properly Formatted
**Current Assumption:** Invalid URL params (e.g., `?status=INVALID`) are silently ignored or produce empty results

**Question:** What should happen with invalid params?

**Validation Needed:** Define error handling strategy; decide if we validate params strictly or loosely.

---

### Assumption 3: Network is "Reasonable" (100 Mbps+)
**Current Assumption:** AC10 mentions "reasonable network (100 Mbps+)" for 1-second response

**Question:** Is this realistic for all users? What about mobile (4G)?

**Validation Needed:** Define performance targets for different network speeds; consider pagination/lazy-loading strategies.

---

## Recommended Action Items

### Before Implementation:
- [ ] **CRITICAL:** Resolve Q1 (single vs multi-select filters) - impacts architecture
- [ ] **CRITICAL:** Resolve Q2 (URL-based vs localStorage persistence) - impacts scope
- [ ] **HIGH:** Resolve Q4 ("Clear All" button scope) - impacts UX naming
- [ ] **HIGH:** Resolve Q10 (which fields are sortable) - impacts query design
- [ ] **MEDIUM:** Resolve Q7 (mobile layout) - impacts CSS/responsive design
- [ ] **MEDIUM:** Validate Assumption 1 (status field always populated)

### Before QA:
- [ ] Resolve Q5 (empty results UX)
- [ ] Resolve Q9 (loading state messaging)
- [ ] Clarify Q13 (role-based access)

### For Phase 2 (Future Enhancement):
- Add multi-select filters (if single-select chosen for MVP)
- Add localStorage persistence
- Add category/status as sortable fields
- Add items-per-page selector
- Implement full-text search

---

## Sign-Off

**Questions Identified By:** GitHub Copilot  
**Date:** February 25, 2026  
**Awaiting Clarification From:** Product Owner / Tech Lead  

| Question Group | Priority | Owner | Status |
|---|---|---|---|
| Q1, Q2, Q4 | CRITICAL | PO | ⏳ PENDING |
| Q7, Q10, Q13 | HIGH | PO + Tech Lead | ⏳ PENDING |
| Q5, Q9 | MEDIUM | PO | ⏳ PENDING |
| Q3, Q6, Q8, Q11, Q12 | MEDIUM | Tech Lead | ⏳ PENDING |

---

## Next Steps

1. **Schedule clarification meeting** with PO/Tech Lead
2. **Document decisions** for each critical question
3. **Update STORY-2.4 spec** with resolved answers
4. **Create new AC** if scope changes
5. **Begin implementation** once all CRITICAL questions are resolved

