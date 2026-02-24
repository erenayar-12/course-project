---
name: "Break Epic into User Stories"
description: "Decompose an Epic into 3-4 well-defined User Stories following INVEST principles with complete acceptance criteria"
---

# Break Epic into User Stories

## Purpose
Transform an Epic into 3-4 independently completable User Stories that follow the INVEST principles, can be finished within a single day of work, and have clear, testable acceptance criteria.

## Instructions

### Step 1: Read the Epic
The user will provide or reference an existing Epic from:
```
specs/epics/EPIC-{number}-{name}.md
```

Extract these key sections:
- **Epic Title & Description:** What capability does this deliver?
- **Primary Persona:** Who is this for?
- **Scope & Complexity:** What components are involved?
- **Acceptance Criteria:** What defines "complete"?
- **Success Metrics:** What metrics does this Epic improve?
- **Dependencies:** What must be ready first?

### Step 2: Identify the User Flows
Break down the Epic into discrete user flows or interactions:

**Example: "User Authentication" Epic flows:**
- User enters email and password on login page
- System validates credentials
- System generates and returns JWT token
- User is redirected to dashboard
- User can log out from dashboard

Each flow should be one User Story.

### Step 3: Generate 3-4 User Stories

For each flow/interaction, create a User Story using the story-template.md structure:

**User Story Content:**

1. **Story ID & Title**
   - Format: `STORY-{EPIC-ID}.{number}`
   - Examples: `STORY-AUTH-1.1`, `STORY-AUTH-1.2`, `STORY-AUTH-1.3`
   - Clear, action-oriented title

2. **User Story Format**
   ```
   As a [PERSONA from Epic]
   I want [SPECIFIC ACTION]
   so that [CLEAR BENEFIT]
   ```
   
   **Requirements:**
   - Use actual persona name from Epic (not "User" or "Developer")
   - Action must be specific and testable
   - Benefit must explain WHY this matters to the persona

3. **Story Context**
   - 2-3 sentences explaining where this story fits in the larger flow
   - Link back to the Epic
   - Explain the business value

4. **Acceptance Criteria (3-5)**
   - Use Given-When-Then format for each criterion
   - Make each criterion testable and specific
   - Cover main flow, edge cases, and business rules
   - Should NOT require more than 1 day to complete

5. **Technical Notes**
   - Implementation hints (optional but helpful)
   - Technology stack considerations
   - Files/components affected
   - Known limitations

6. **Estimation**
   - Story Points: 1-3 (should be completable in 1 day)
   - Estimated Days: 0.5 - 1 day
   - Risk Level: LOW (by design, stories should be low-risk)

7. **Dependencies**
   - What other stories must be done first?
   - External system dependencies
   - Any blockers?

8. **INVEST Validation**
   - All 6 criteria must be checkable

### Step 4: Apply INVEST Principles

Verify each User Story passes INVEST:

**[I] Independent**
- [ ] Story can be completed without waiting for other stories
- [ ] Can be started immediately (dependencies are ready)
- [ ] No hidden dependencies on story sequencing

**[N] Negotiable**
- [ ] Details are open for discussion with team
- [ ] Not a fixed specification written in stone
- [ ] Can be refined during refinement meeting

**[V] Valuable**
- [ ] Story delivers clear value to the user or business
- [ ] Users can see/feel the value when complete
- [ ] Not just technical infrastructure work

**[E] Estimable**
- [ ] Team understands it well enough to estimate
- [ ] No major unknowns or research needed
- [ ] Technical approach is clear

**[S] Small**
- [ ] Can be completed in 1 day of work
- [ ] Achievable within a single sprint
- [ ] Not too large that it spans multiple days

**[T] Testable**
- [ ] Acceptance criteria are clear and verifiable
- [ ] Team can write automated tests for it
- [ ] Testers can validate it works correctly

### Step 5: Story Sizing Rules

**✅ GOOD Story Size (1 day of work):**
- "Add email input field to login form"
- "Validate email format on client side"
- "Call authentication API with credentials"
- "Display error message if login fails"
- "Store JWT token in secure cookie"

**❌ TOO LARGE (Multiple days):**
- "Implement complete user authentication system" → Break into 4-5 stories
- "Build login page with all validation and error handling" → Break into 2-3 stories

**❌ TOO SMALL (Less than 0.5 day):**
- "Change button color from blue to red"
- "Add padding to form" → Combine with larger story

### Step 6: Acceptance Criteria Standards

Each story should have 3-5 acceptance criteria using Given-When-Then:

```gherkin
### AC 1: Valid Credentials
- Given: User is on the login page
- When: User enters valid email and password and clicks Submit
- Then: System authenticates user and stores JWT token in secure cookie

### AC 2: Invalid Email Format
- Given: User is on the login page
- When: User enters invalid email format in email field
- Then: System displays error "Please enter a valid email address"

### AC 3: Account Doesn't Exist
- Given: User is on the login page
- When: User enters valid email format but account doesn't exist
- Then: System displays generic error "Invalid credentials"
```

**Requirements for Acceptance Criteria:**
- Must be testable (can verify true/false)
- Must be specific (not "should be easy to understand")
- Should cover main flow + 1-2 edge cases
- Should be completable in the story's timeframe

### Step 7: Story Sequencing

Order stories logically:
1. Stories that other stories depend on come first (prerequisites)
2. Core feature stories before enhancement stories
3. Foundation/setup stories before advanced stories

**Example Auth Epic Sequencing:**
1. STORY-AUTH-1.1: Display Login Form (UI only)
2. STORY-AUTH-1.2: Validate Email Format (client validation)
3. STORY-AUTH-1.3: Call Auth API with Credentials (backend integration)
4. STORY-AUTH-1.4: Handle Login Success / Store Token (state management)

### Step 8: Quality Checklist

Before finalizing stories, verify:

**Story Content**
- [ ] Each story has a distinct, testable focus
- [ ] User story wording is specific (not vague like "improve security")
- [ ] Each story delivers incremental value
- [ ] No duplicate or overlapping stories

**Acceptance Criteria**
- [ ] 3-5 criteria per story (not too few, not too many)
- [ ] Each criterion is testable and specific
- [ ] Criteria cover main flow + edge cases + business rules
- [ ] No criteria require dependencies outside this story

**INVEST Validation**
- [ ] All 6 INVEST letters can be checked
- [ ] No story appears blocked by others
- [ ] All stories are sized for ~1 day completion

**Sizing Consistency**
- [ ] All stories are similarly sized (1-3 story points)
- [ ] No story is drastically larger than others
- [ ] Stories can all fit in one sprint

**Completeness**
- [ ] Stories together fully cover the Epic's scope
- [ ] All Epic acceptance criteria will be met when stories are done
- [ ] Nothing from Epic scope is missing

### Step 9: Output Format

Generate stories in this format:

```markdown
# User Story: [Story Title]

**Story ID:** [STORY-XXX-1]
**Epic:** [EPIC-ID]
**Sprint:** [BACKLOG/SPRINT-NUMBER]
...
[Full story content following story-template.md structure]
```

Include a summary at the top:

```
**Decomposed from:** [EPIC-Name]
**Generated Date:** [DATE]
**Story Count:** 3-4
**Coverage:** [BRIEF SUMMARY OF WHAT THESE STORIES DELIVER]
**Status:** DRAFT (Ready for refinement and estimation)
**Next Step:** Team refinement meeting to discuss details and estimates
```

### Step 10: Save Locations

**Default naming:** `specs/stories/STORY-{EPIC-ID}.{number}-{name}.md`

**Examples:**
- `specs/stories/STORY-AUTH-1.1-Display-Login-Form.md`
- `specs/stories/STORY-AUTH-1.2-Validate-Credentials.md`
- `specs/stories/STORY-AUTH-1.3-Handle-Login-Success.md`
- `specs/stories/STORY-IDEA-2.1-Create-Submission-Form.md`

Group all stories in one file or organize by epic (your preference).

---

## Example: Epic Decomposition Into Stories

### Input Epic (Summary)
```
EPIC-1: User Authentication Foundations

Description: Enable users to securely log in with email/password
Primary Persona: App User (Sarah)
Success Metrics: 95% login success rate, < 3 second login time

Acceptance Criteria (Epic level):
- Email/password login works
- JWT tokens are generated and stored securely
- Failed login attempts show appropriate errors
- User is redirected to dashboard on success
```

### Output Stories (Decomposition)

**STORY-AUTH-1.1: Display Login Form**
- Persona: Sarah (App User)
- User Story: "As Sarah, I want to see a login form when I arrive at the app, so I can enter my credentials"
- Completion: 1 day
- AC1: Form displays email input field
- AC2: Form displays password input field
- AC3: Form displays Submit button
- AC4: Form is responsive on mobile/tablet/desktop

**STORY-AUTH-1.2: Validate Email & Password Format**
- Persona: Sarah
- User Story: "As Sarah, I want the system to validate my email before submitting, so I don't waste time on invalid entries"
- Completion: 1 day
- AC1: Email format is validated on blur/change
- AC2: Error shows for invalid email format
- AC3: Submit button disabled until both fields have valid format
- AC4: Clear error messages guide user to fix issues

**STORY-AUTH-1.3: Submit Credentials and Call Auth API**
- Persona: Sarah
- User Story: "As Sarah, I want to submit my credentials to the system, so I can authenticate"
- Completion: 1 day
- AC1: Form submits credentials to Auth0 API
- AC2: Loading state shows while API call is in progress
- AC3: API response is received and processed
- AC4: Network errors display appropriate error message

**STORY-AUTH-1.4: Handle Login Success & Store Token**
- Persona: Sarah
- User Story: "As Sarah, I want to be logged in and redirected to the dashboard after successful login, so I can access the app"
- Completion: 1 day
- AC1: JWT token is stored in secure cookie (httpOnly)
- AC2: User is redirected to dashboard on success
- AC3: Subsequent requests include auth token
- AC4: Token remains valid for 24 hours

---

## Key Questions to Ask During Decomposition

1. **"Can one person complete this story in one day?"**
   - If NO → Break it into smaller stories

2. **"Can this story be tested independently?"**
   - If NO → Stories have unclear boundaries, reconsider

3. **"Does someone need to finish another story before starting this one?"**
   - If YES → Note the dependency, but consider if it's blocking

4. **"If we demoed only this story, would stakeholders see value?"**
   - If NO → Story might be too small or too infrastructure-focused

5. **"Can we write a test (automated or manual) to verify this story is done?"**
   - If NO → Acceptance criteria need to be more specific

---

## Common Pitfalls to Avoid

❌ **Too Large / Multi-Day Story**
```
"Implement complete user login system with form validation, 
API integration, error handling, and token storage"
```
✅ **Right-Sized Stories**
```
STORY-1: "Display login form with email and password fields"
STORY-2: "Validate email format on client"
STORY-3: "Submit credentials to Auth API"
STORY-4: "Store token and redirect to dashboard"
```

❌ **Vague Acceptance Criteria**
```
AC1: "Email should be valid"
AC2: "Errors should be clear"
AC3: "Login should be fast"
```
✅ **Specific Acceptance Criteria**
```
AC1: "Email format is validated; error shows if format invalid"
AC2: "Error message displays: 'Please enter valid email address'"
AC3: "Login API responds in < 2 seconds"
```

❌ **Infrastructure-Only Story (No User Value)**
```
"Refactor authentication module to use new pattern"
(User doesn't see or feel this)
```
✅ **User-Facing Story**
```
"User can log in with email and password" (user sees this)
```

❌ **Missing Dependencies**
```
STORY-1: "Add password reset page"
STORY-2: "Add forgot password link to login form"
(Story 1 depends on Story 2 link)
```
✅ **Clear Dependencies**
```
STORY-1: "Add forgot password link to login form"
STORY-2: "Create password reset page" (depends on STORY-1)
```

---

## Story Refinement Checklist

Before a story enters a sprint, verify:

- [ ] Story title is clear and action-oriented
- [ ] User story uses real persona name
- [ ] Acceptance criteria are specific and testable
- [ ] Story can be completed in 1 day
- [ ] No major unknowns or research needed
- [ ] Dependencies are documented
- [ ] Story estimate is agreed upon (1-3 points)
- [ ] Technical approach is understood
- [ ] Definition of Done applies

---

## Invocation

When ready to break an Epic into User Stories, invoke with:

```
/decompose-stories [EPIC-Name or Path]
```

Or reference the Epic directly:
```
/decompose-stories specs/epics/EPIC-1-User-Authentication.md
```

Copilot will generate 3-4 complete User Story documents ready for team refinement.

---

## Next Steps After Story Decomposition

1. **Refine with Team**
   - Review stories in refinement meeting
   - Clarify acceptance criteria with stakeholders
   - Discuss technical approach

2. **Estimate Stories**
   - Team estimates each story in story points (1-3)
   - Discuss any stories that seem too large

3. **Plan Sprint**
   - Select stories for upcoming sprint
   - Distribute stories across team capacity
   - Assign owners if using that model

4. **Start Development**
   - Developer picks a story from sprint
   - References acceptance criteria during development
   - Uses CI/CD pipeline to verify acceptance criteria

5. **Define DoD (Definition of Done)**
   - Code written + reviewed
   - Unit tests passing
   - Acceptance criteria verified
   - Code merged to main branch
   - Story marked as DONE
