# STORY-2.4 Clarification Decisions

**Document:** Decision Log  
**Story:** STORY-2.4 (Sort & Filter)  
**Date:** February 25, 2026  
**Status:** APPROVED FOR IMPLEMENTATION

---

## Resolved Critical Questions

### ✅ Q1: Filter One Status at a Time (Single-Select)
**Decision:** Single-select filter - user can only filter by ONE status at a time  
**Rationale:** Simpler MVP implementation; can add multi-select in Phase 2  
**Impact:**
- Use radio buttons instead of checkboxes
- URL: `?status=SUBMITTED` (not multiple status params)
- Backend: only check one status in WHERE clause
- UX: Selecting different status automatically deselects previous one

---

### ✅ Q2: URL-Based Only (No localStorage)
**Decision:** Filter state stored ONLY in URL query parameters; no localStorage persistence  
**Rationale:** Simpler implementation; stateless approach; URL is the source of truth  
**Impact:**
- On mount: parse URL params, apply filters
- On filter change: update URL params
- On browser close/refresh: filters reset (user can bookmark URL to preserve)
- No localStorage complexity in Phase 1

---

### ✅ Q3: Include Sort in Filter Chips
**Decision:** Display BOTH active filter AND active sort as removable chips  
**Rationale:** Gives user full visibility of all active refinements; clearer UI feedback  
**Impact:**
- Example chips: ["Under Review", "Title (A-Z)"]
- Each chip can be clicked to remove individually
- Chips update when filter/sort changes
- Provides clear visual distinction from "Clear All" button

---

### ✅ Q4: Clear All Resets Sort to Default
**Decision:** "Clear All Filters" button resets BOTH filter AND sort to defaults  
**Rationale:** More intuitive; user expects "Clear All" to mean complete reset  
**Default State After Clear All:**
- Filter: ALL (show all statuses)
- Sort: createdAt DESC (newest first)
- Page: 1
- URL: `/my-ideas` (no query params)

---

## Team Decisions on Remaining Questions

### ✅ Q5: Empty Results - Show User-Friendly Message
**Decision (EASY):** Display empty state with message + help  
**Implementation:**
```
"No ideas match your filters. Try:"
- [ ] Clear filters
- [ ] View all ideas
- [ ] Change search criteria
```
**Effort:** Minimal (UI component + conditional render)

---

### ✅ Q6: Sorting Null Values - DB Constraint Approach
**Decision (EASY):** Enforce NOT NULL constraint on title at DB level  
**Implementation:**
- Prisma schema: `title String` (no `?` = NOT NULL)
- Frontend: Validate before submit
- Backend: Reject requests with empty titles
- Result: No null values to sort; problem prevented at source

---

### ✅ Q7: Mobile Filter Layout - Collapsible Drawer
**Decision (MEDIUM):** 
- Desktop (≥768px): Horizontal filter/sort controls always visible
- Mobile (<768px): "Filter" button that opens collapsible drawer
  
**Implementation:**
```typescript
// Conditional rendering
{isMobile ? <FilterDrawer /> : <InlineFilterControls />}
```
**Effort:** Moderate (responsive design + drawer component)

---

### ✅ Q8: Sticky Positioning - Filters Sticky at Top
**Decision (MEDIUM):** Filter/sort controls sticky to top during scroll  
**Implementation:**
```css
.filter-container {
  position: sticky;
  top: 0;
  z-index: 40;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
```
**Effort:** Low (CSS only; no JS needed)

---

### ✅ Q9: Loading State - Skeleton Loaders + Disabled Controls
**Decision (EASY):** 
- Show skeleton rows in table while loading
- Disable filter/sort controls during request
- Show micro-copy: "Filtering ideas..."

**Implementation:**
```typescript
// Show skeletons while loading
{isLoading ? <SkeletonRows count={10} /> : <IdeaRows ideas={ideas} />}

// Disable controls
<button disabled={isLoading} onClick={handleFilter}>Filter</button>
```
**Effort:** Low (standard loading pattern)

---

### ✅ Q10: Sortable Fields - MVP Scope (Date + Title Only)
**Decision (EASY):** Keep MVP simple  
**Sort Options:**
- Date Created (Newest First) - DEFAULT
- Date Created (Oldest First)  
- Title (A-Z)
- Title (Z-A)

**NOT in MVP (Phase 2):**
- Category sort
- Status sort
- Submitter email sort

**Rationale:** 60/40 rule - these 4 sort options are common/easy; others can wait

---

### ✅ Q11: Pagination Limit - 10 Items Per Page Default
**Decision (EASY):** 
- Default: 10 items per page
- Max: 50 items per page (performance limit)
- Not user-selectable in Phase 1

**Query Param:** `?page=1&limit=10`

**Phase 2 Enhancement:** Add "Items per page" selector (10/25/50)

---

### ✅ Q12: URL Parameter Case Sensitivity - Normalize to UPPERCASE
**Decision (EASY):** 
- Backend normalizes all status values to UPPERCASE
- Frontend always sends UPPERCASE
- Old bookmarks with lowercase (`?status=submitted`) still work (backend converts)

**Validation:**
```typescript
// Backend: normalize input
const normalizedStatus = status?.toUpperCase();
if (!['SUBMITTED', 'UNDER_REVIEW', 'NEEDS_REVISION', 'APPROVED', 'REJECTED'].includes(normalizedStatus)) {
  return res.status(400).json({ error: 'Invalid status' });
}
```

---

### ✅ Q13: Role-Based Filter Access - "My Ideas" Only
**Decision (EASY):** 
- Filter always scoped to current user's ideas
- Backend: `WHERE userId = req.user.id`
- No cross-user filtering in Phase 1
- Evaluators have separate STORY-2.3b queue (different endpoint)

**Security:** Filter cannot be bypassed via URL manipulation; server enforces userId

---

## Summary of Decisions

| Question | Decision | Effort | Status |
|----------|----------|--------|--------|
| Q1 | Single-select filter | Low | ✅ APPROVED |
| Q2 | URL-based only | Low | ✅ APPROVED |
| Q3 | Include sort in chips | Low | ✅ APPROVED |
| Q4 | Clear All resets sort | Low | ✅ APPROVED |
| Q5 | Empty state message | Low | ✅ APPROVED |
| Q6 | DB NOT NULL constraint | Low | ✅ APPROVED |
| Q7 | Mobile drawer | Medium | ✅ APPROVED |
| Q8 | Sticky controls | Low | ✅ APPROVED |
| Q9 | Skeleton loaders | Low | ✅ APPROVED |
| Q10 | Date+Title sort MVP | Low | ✅ APPROVED |
| Q11 | 10 items per page | Low | ✅ APPROVED |
| Q12 | Uppercase normalization | Low | ✅ APPROVED |
| Q13 | My Ideas only | Low | ✅ APPROVED |

**Effort Breakdown:** 
- Easy (60%): Q1, Q2, Q4, Q5, Q6, Q9, Q10, Q11, Q12, Q13 = 10 decisions
- Medium (40%): Q3, Q7, Q8 = 3 decisions

---

## Updated Implementation Plan

### Phase 1: Core Filter/Sort (Days 1-2)
1. Create single-select status filter (radio/dropdown)
2. Implement 4-option sort dropdown
3. Add URL param synchronization
4. Create filter + sort chips display
5. Implement "Clear All" button
6. Add empty state messaging
7. Backend: Add query param validation & filtering

### Phase 2: Polish & Responsive (Day 2-3)
1. Add mobile drawer for filters
2. Add skeleton loaders
3. Add sticky positioning
4. Performance testing
5. Full test suite

### Phase 3: Future Enhancements (Phase 2 Sprint)
1. Multi-select filters
2. localStorage persistence
3. Additional sort fields
4. Items-per-page selector
5. Full-text search

---

## Next Steps

1. ✅ **Decisions Approved** - Ready for development
2. **Update STORY-2.4 spec** with concrete implementation details
3. **Create technical tasks** from updated spec
4. **Assign to developer(s)**
5. **Begin implementation** - Phase 1 core features (Days 1-2)

