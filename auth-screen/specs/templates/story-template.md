# User Story Template

<!-- 
INVEST PRINCIPLES VALIDATION CHECKLIST:
This template helps you validate your story against the INVEST criteria:
- [I] Independent: Story can be developed independently without blocking others
- [N] Negotiable: Details can be discussed and refined before implementation
- [V] Valuable: Delivers clear value to the user or business
- [E] Estimable: Team understands it well enough to estimate effort
- [S] Small: Can be completed in one sprint
- [T] Testable: Acceptance criteria are clear and verifiable
-->

## Story ID & Title
**Story ID:** [STORY-XXX]  
**Title:** [CLEAR, DESCRIPTIVE TITLE - e.g., "User Login with Email"]  
**Epic:** [EPIC-XXX - WHICH EPIC DOES THIS BELONG TO]  
**Sprint/Milestone:** [SPRINT NUMBER OR MILESTONE NAME]  
**Status:** [BACKLOG/READY/IN PROGRESS/IN REVIEW/DONE]

---

## User Story

**As a** [PERSONA - WHO IS THE USER]  
**I want** [ACTION - WHAT THEY WANT TO DO]  
**so that** [BENEFIT - WHY IT MATTERS / THE VALUE]

### Story Context
[PROVIDE 2-3 SENTENCES OF CONTEXT EXPLAINING THE BUSINESS VALUE OR PROBLEM THIS SOLVES]

---

## Acceptance Criteria

**When** [CONDITION/PRECONDITION]  
**Then** [EXPECTED BEHAVIOR/OUTCOME]

### AC 1: [SPECIFIC CONDITION]
- **Given** [INITIAL STATE]
- **When** [USER ACTION]
- **Then** [EXPECTED RESULT]

### AC 2: [SPECIFIC CONDITION]
- **Given** [INITIAL STATE]
- **When** [USER ACTION]
- **Then** [EXPECTED RESULT]

### AC 3: [SPECIFIC CONDITION]
- **Given** [INITIAL STATE]
- **When** [USER ACTION]
- **Then** [EXPECTED RESULT]

### AC 4: [EDGE CASE/ERROR HANDLING]
- **Given** [INITIAL STATE]
- **When** [USER ACTION]
- **Then** [EXPECTED RESULT]

### AC 5: [BUSINESS RULE OR CONSTRAINT]
- **Given** [INITIAL STATE]
- **When** [CONDITION]
- **Then** [EXPECTED RESULT]

---

## Definition of Acceptance

All acceptance criteria must pass automated tests (if applicable) and pass user/QA sign-off.

- [ ] All acceptance criteria verified and passing
- [ ] Code changes reviewed and approved
- [ ] Unit tests written and passing
- [ ] Integration tests passing (if applicable)
- [ ] No new warnings or errors in code quality tools
- [ ] Documentation updated (if needed)
- [ ] Performance acceptable (if applicable)

---

## Technical Notes

### Implementation Hints (Optional)
[OPTIONAL: SUGGEST IMPLEMENTATION APPROACH, LIBRARIES, PATTERNS, OR ARCHITECTURAL DECISIONS]

### Technology Stack
- **Backend:** [LANGUAGES/FRAMEWORKS IF RELEVANT]
- **Frontend:** [LIBRARIES/FRAMEWORKS IF RELEVANT]
- **Database:** [ANY DATABASE CONSIDERATIONS]

### Files/Components Affected
- [FILE/COMPONENT 1]
- [FILE/COMPONENT 2]
- [FILE/COMPONENT 3]

### Known Limitations or Considerations
- [LIMITATION 1]
- [LIMITATION 2]

---

## Estimation & Effort

**Story Points:** [1 / 2 / 3 / 5 / 8 / 13 / 21]  
**OR Estimated Days:** [NUMBER OF DAYS]

**Estimation Rationale:**  
[EXPLAIN WHY YOU ESTIMATED THIS VALUE - COMPLEXITY, UNKNOWNS, DEPENDENCIES, ETC.]

**Risk Level:** [LOW / MEDIUM / HIGH]  
**Risk Reason:** [IF MEDIUM/HIGH, BRIEFLY EXPLAIN]

---

## Dependencies & Blockers

### Story Dependencies
- [STORY ID] must be completed first
- [STORY ID] should be completed in parallel
- [SYSTEM/API] must be available

### Blockers
- [ ] [BLOCKER 1 - DESCRIBE AND PLAN MITIGATION]
- [ ] [BLOCKER 2 - DESCRIBE AND PLAN MITIGATION]

---

## INVEST Validation Checklist

Use this checklist to verify your story follows INVEST principles:

- [ ] **Independent** - This story can be completed independently without waiting for other stories
- [ ] **Negotiable** - Details are open for discussion; it's not a fixed specification
- [ ] **Valuable** - This story delivers clear value to the user or business
- [ ] **Estimable** - The team understands it well enough to estimate effort
- [ ] **Small** - Can be completed within one sprint (typically 1-5 days of work)
- [ ] **Testable** - Acceptance criteria are clear and verifiable; team can write tests

---

## Acceptance Sign-Off

| Role | Name | Date | Notes |
|------|------|------|-------|
| Product Owner | [NAME] | [DATE] | [APPROVAL/COMMENTS] |
| Tech Lead | [NAME] | [DATE] | [APPROVAL/COMMENTS] |
| QA Lead | [NAME] | [DATE] | [APPROVAL/COMMENTS] |

---

## Related Information

**Related Stories:**
- [STORY-XXX] - Related work
- [STORY-XXX] - Related work

**Design Reference:**
[LINK TO DESIGN MOCKUP, WIREFRAME, OR PROTOTYPE]

**Documentation:**
[LINK TO RELATED DOCUMENTATION OR TECHNICAL SPEC]

**Acceptance Test Link:**
[LINK TO TEST CASES OR TEST PLAN]

---

## Comments & Discussion

[AREA FOR TEAM DISCUSSION, QUESTIONS, AND CLARIFICATIONS]
