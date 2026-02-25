# STORY-2.1 Clarification Questions

**Story ID:** STORY-2.1  
**Title:** Create Idea Submission Form with Validation  
**Generated:** February 25, 2026  
**Status:** PENDING TEAM CLARIFICATION

---

## Critical Questions (MUST ANSWER BEFORE CODING)

### 1. **Category Options - Fixed or Dynamic?**
**Current Spec:** Categories are hardcoded enum: `["Innovation", "Process Improvement", "Cost Reduction", "Other"]`

**Questions:**
- [ ] Are these categories fixed and hardcoded in the frontend/backend?
- [ ] OR should categories be fetched from a database lookup table?
- [ ] Should categories be configurable by admins in Phase 2?
- [ ] Can users enter custom categories if "Other" is selected?

**Decision:** ___________________________

---

### 2. **Authentication Token Integration**
**Current Spec:** "Integrate Auth0 token retrieval for API authentication"

**Questions:**
- [ ] How is the Auth0 token accessed? Via React Context (from EPIC-1)?
- [ ] Should expired tokens trigger automatic re-authentication or refresh?
- [ ] Where is the JWT token stored? (localStorage, sessionStorage, httpOnly cookie?)
- [ ] Is this already implemented in EPIC-1, or does this story need to add it?

**Decision:** ___________________________

---

### 3. **Form Submission Flow - Pre-save Actions**
**Current Spec:** Form submits to POST `/api/ideas`

**Questions:**
- [ ] Should the form auto-save drafts as user types? (Y/N)
- [ ] Should unsaved changes trigger a confirmation dialog when navigating away? (Y/N)
- [ ] Does form submission include uploading the attachment in AC1, or is that deferred to STORY-2.2?
- [ ] If attachment is optional in AC1, should attachment upload be in this story or STORY-2.2?

**Decision:** ___________________________

---

### 4. **Error Handling & Retry Logic**
**Current Spec:** Mentions "network error handling" but lacks detail

**Questions:**
- [ ] On API failure (500, timeout, network error), should form show:
  - [ ] Inline error message + submit button disabled?
  - [ ] Toast notification + allow user to retry?
  - [ ] Modal dialog?
- [ ] Should failed submissions auto-save draft data locally for recovery?
- [ ] Max retry attempts? (suggest 3)
- [ ] Retry delay strategy? (immediate, 1s, exponential backoff?)

**Decision:** ___________________________

---

### 5. **Successful Submission Behavior**
**Current Spec:** "User is redirected to 'My Ideas' dashboard after successful submission"

**Questions:**
- [ ] Immediate redirect (0 sec delay) or delayed (e.g., 2-second success toast)?
- [ ] Should the newly submitted idea appear highlighted/scrolled-to in dashboard?
- [ ] Should form show success message before redirect? (duration?)
- [ ] Should form show the created idea ID or confirmation message?

**Decision:** ___________________________

---

### 6. **Form State on Cancel**
**Current Spec:** "Cancel button that clears all fields and confirms with user"

**Questions:**
- [ ] Confirmation dialog message? (e.g., "Discard changes?")
- [ ] If user cancels the confirmation, do they stay in the form? (assume yes)
- [ ] Should Cancel button be disabled if form is pristine (no changes)? (UX best practice)
- [ ] Navigate back to previous page or to dashboard after Cancel?

**Decision:** ___________________________

---

### 7. **Form Validation - Async Checks**
**Current Spec:** Lists client-side validation only

**Questions:**
- [ ] Should title be checked for uniqueness? (e.g., prevent exact duplicate titles)
- [ ] Should description be checked for duplicate/similarity? (mention in AC but not clear if MVP)
- [ ] Should server perform async validation (e.g., title uniqueness check) before save?
- [ ] If yes, should form show "Checking uniqueness..." loading state?

**Decision:** ___________________________

---

### 8. **File Upload in This Story or STORY-2.2?**
**Current Spec:** "optional Attachments" in AC1

**Questions:**
- [ ] Should AC1 include file upload input, or just empty placeholder?
- [ ] If attachment upload in AC1, should this story include:
  - [ ] File validation (size, format)?
  - [ ] File upload to server?
  - [ ] Progress indicator?
- [ ] OR should attachment field be disabled in AC1 (implemented in STORY-2.2)?

**Decision:** ___________________________

---

### 9. **Accessibility & i18n**
**Current Spec:** "Accessibility checks (WCAG 2.1 AA)"

**Questions:**
- [ ] Should form support screen readers? (assume yes per AC)
- [ ] Should form support keyboard-only navigation? (assume yes)
- [ ] Should form be translated? (currently English only, assume yes)
- [ ] Are there specific i18n keys format? (e.g., `idea.form.title.label`)

**Decision:** ___________________________

---

### 10. **API Error Response Format**
**Current Spec:** Shows success response format

**Questions:**
- [ ] What should error responses look like? Example:
  ```json
  {
    "success": false,
    "error": "validation_error",
    "message": "Title is required",
    "details": [{"field": "title", "message": "..."}]
  }
  ```
- [ ] Should backend return validation errors per field or as list?
- [ ] Should frontend display errors inline under fields or as toast?

**Decision:** ___________________________

---

## Nice-to-Have Clarifications

### 11. **Duplicate Detection (Mentioned in EPIC but not AC)**
- [ ] Should form warn user if they enter a title similar to existing ideas?
- [ ] Similarity threshold? (e.g., 80% match)
- [ ] If yes, defer to Phase 2 or include in MVP?

**Decision:** ___________________________

---

### 12. **Form Layout & UX**
- [ ] Full-page form or modal dialog?
- [ ] Single column or multi-column layout?
- [ ] Should character counts be displayed for Title/Description?
- [ ] Show real-time validation feedback as user types or only on blur?

**Decision:** ___________________________

---

### 13. **Loading & Disabled States**
- [ ] During submission, should form fields be disabled? (assume yes)
- [ ] Should Submit button show loading spinner or change text? (suggest both)
- [ ] Can user close form while submission is in-flight? (assume no)

**Decision:** ___________________________

---

### 14. **Success Notification Details**
- [ ] Toast notification or page success banner?
- [ ] Content: "Idea submitted successfully" or include idea title?
- [ ] Duration on screen? (suggest 3-5 seconds)
- [ ] Should user be able to dismiss or auto-dismiss?

**Decision:** ___________________________

---

### 15. **Mobile Experience**
- [ ] On mobile, should submit button be sticky/fixed at bottom?
- [ ] Should keyboard auto-shrink on mobile for better UX?
- [ ] Responsive font sizes defined? (assume Tailwind defaults OK)

**Decision:** ___________________________

---

## Questions About Testing

### 16. **Test Coverage Specifics**
- [ ] What exact scenarios should unit tests cover?
  - [ ] Valid submission success
  - [ ] Validation error for each field
  - [ ] Network error handling
  - [ ] Form state management
- [ ] E2E test - should it use mock API or real backend?
- [ ] Should tests include Auth0 token mocking?

**Decision:** ___________________________

---

### 17. **Browser & Environment Support**
- [ ] Target browsers? (Chrome, Firefox, Safari, Edge, mobile browsers?)
- [ ] Node.js minimum version? (spec says 18+, but should we support 18, 20, 22?)
- [ ] Should form work with JavaScript disabled? (assume no, modern SPA)

**Decision:** ___________________________

---

## Questions About Integration Points

### 18. **Auth0 Integration Scope**
- [ ] Is EPIC-1 (Auth0 integration) already complete?
- [ ] Does this story assume Auth0 logout/token handling is available?
- [ ] Should story create service layer for Auth0 token retrieval?

**Decision:** ___________________________

---

### 19. **Database Schema - User Relationship**
- [ ] Should `userId` reference be auto-populated from Auth0 context?
- [ ] Or should backend extract from JWT token?
- [ ] What if `userId` is missing or invalid? (error handling)

**Decision:** ___________________________

---

## Summary of Decisions

| Question | Answer | Owner | Date |
|----------|--------|-------|------|
| 1. Categories fixed or dynamic? | | | |
| 2. Auth token storage/refresh? | | | |
| 3. Auto-save drafts? | | | |
| 4. Error retry strategy? | | | |
| 5. Redirect behavior? | | | |
| 6. Cancel redirect? | | | |
| 7. Title uniqueness check? | | | |
| 8. File upload in AC1? | | | |
| 9. i18n support? | | | |
| 10. Error response format? | | | |

---

## Recommended Answers for MVP (If Team Can't Decide)

### Option A: Minimal MVP (3-day implementation)
- ✅ Categories: Hardcoded enum
- ✅ File upload: Disabled/placeholder (STORY-2.2)
- ✅ Auto-save drafts: NO
- ✅ Async validation: NO (only client-side)
- ✅ Error handling: Toast notifications + simple retry
- ✅ Redirect: Immediate to dashboard
- ✅ i18n: English only (Phase 2)

### Option B: Full-Featured MVP (5-day implementation)
- ✅ Categories: Fetched from lookup table
- ✅ File upload: Include in AC1
- ✅ Auto-save: YES (localStorage)
- ✅ Async validation: YES (title uniqueness)
- ✅ Error handling: Detailed field-level errors
- ✅ Redirect: 2-sec delay with success toast
- ✅ i18n: Basic translations

---

**Team Consensus Needed By:** February 26, 2026  
**Implementation Start:** February 27, 2026  
**Estimated Completion:** March 3-5, 2026

---

## Next Steps
1. **Team Lead** shares this document with team
2. **Team discusses** and documents answers in table above
3. **Product Owner** approves final clarifications
4. **Developer** uses clarifications as implementation guide
5. **Update STORY-2.1** with clarified acceptance criteria
6. **Begin implementation** in sprint
