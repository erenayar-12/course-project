---
name: "Decompose PRD into Epics"
description: "Break down a Product Requirements Document into 3-4 high-level Epics with clear boundaries and independent deployability"
---

# Decompose PRD into Epics

## Purpose
Transform a PRD's functional and non-functional requirements into 3-4 well-defined Epics that are independently deployable, deliver end-to-end value, and map to specific success metrics.

## Instructions

### Step 1: Read the PRD
The user will provide or reference an existing PRD from:
```
specs/prds/PRD-{feature-name}.md
```

Extract these key sections:
- **Overview:** Purpose, Goals, Problem Statement
- **Functional Requirements:** All FR-X.Y items
- **User Personas:** Who the system serves
- **Success Metrics:** How we measure success
- **Scope:** What's in/out of scope

### Step 2: Identify Epic Candidates
Analyze the PRD and identify 3-4 major feature areas or user journeys that:

**Deliver End-to-End Value**
- Each Epic produces a working, testable feature
- Users can accomplish a meaningful goal using the Epic's functionality
- Not just internal refactoring or infrastructure (unless critical)

**Are Independently Deployable**
- Epic A can ship without Epic B being complete
- Epics have minimal dependencies on each other
- Each Epic has its own acceptance criteria and completion state

**Map to Success Metrics**
- Each Epic directly contributes to achieving 1-2 success metrics from the PRD
- Can demonstrate progress toward business goals
- Measurable impact on KPIs

**Have Clear Boundaries**
- Define what's included vs. excluded within each Epic
- Clear scope of user stories/work items
- No ambiguity about where responsibilities end

### Step 3: Generate Epics
For each of the 3-4 Epics, create a comprehensive document using the epic-template.md structure:

**Epic Content to Generate:**

1. **Epic Title**
   - Use clear, action-oriented names
   - Format: "Building/Implementing/Enabling [Capability]"
   - Examples: "Building User Authentication", "Implementing Idea Submission", "Enabling Workflow Approvals"

2. **Description (2-3 sentences)**
   - Explain what capability this Epic delivers
   - Why it's valuable to users/business
   - How it relates to the overall PRD goals

3. **Epic ID**
   - Format: `EPIC-1`, `EPIC-2`, etc.
   - Use the same project prefix as PRD (e.g., `AUTH-EPIC-1` for AUTH project)

4. **Primary Persona**
   - Which persona benefits most from this Epic?
   - Why this persona is the primary beneficiary

5. **Success Criteria**
   - 3-5 measurable outcomes
   - Link back to PRD success metrics
   - Definition of Done checklist

6. **Scope & Complexity**
   - Size estimate: S / M / L
   - Components affected (backend, frontend, database, etc.)
   - Key technical considerations

7. **Dependencies**
   - What must be completed before this Epic?
   - External dependencies (third-party services, other teams)
   - Technical debt to address first

8. **User Stories Placeholder**
   - Note that specific user stories will be created in next phase
   - Indicate expected number of stories (estimate: 3-8 per Epic)

9. **Risks & Mitigation**
   - 2-3 potential risks specific to this Epic
   - Mitigation strategies

10. **Resources & Timeline**
    - Estimated duration (weeks/sprints)
    - Team skills needed
    - Key milestones

### Step 4: Epic Decomposition Rules

Follow these rules when creating Epics:

**Rule 1: Vertical Slices, Not Horizontal Layers**
- ❌ AVOID: "Database Layer Epic", "API Layer Epic", "UI Layer Epic"
- ✅ USE: "User Login Epic", "Profile Management Epic", "Permission Assignment Epic"

**Rule 2: Each Epic Should Deliver User Value**
- ❌ AVOID: "Technical Refactoring" (unless essential to user feature)
- ✅ USE: "Enable Multi-Factor Authentication" (user can now secure their account)

**Rule 3: Map to Metrics**
- EPIC-1 maps to Metric A (e.g., "50% login success rate")
- EPIC-2 maps to Metric B (e.g., "Average submission time < 2 minutes")
- EPIC-3 maps to Metric C (e.g., "Approval workflow time < 24 hours")

**Rule 4: Clear Boundaries**
- Each Epic has a discrete set of requirements
- Stories within an Epic don't span multiple feature areas
- Can be completed and deployed independently

### Step 5: Quality Checklist

Before finalizing Epics, verify:

**Independence**
- [ ] Each Epic can be developed in parallel with others
- [ ] Epic A does not block Epic B from progressing
- [ ] Dependencies are explicitly documented

**Value Delivery**
- [ ] Each Epic delivers a complete feature users can interact with
- [ ] Not just technical infrastructure (unless required for feature)
- [ ] Users can accomplish a meaningful goal with each Epic

**Metric Alignment**
- [ ] Epic-1 improves/measures [Metric X]
- [ ] Epic-2 improves/measures [Metric Y]
- [ ] Epic-3 improves/measures [Metric Z]
- [ ] All major PRD metrics are covered by Epics

**Clarity**
- [ ] Epic scope is clear (in/out of scope explicit)
- [ ] No ambiguity about component responsibilities
- [ ] Acceptance criteria are testable and specific

**Sizing**
- [ ] Each Epic is sized consistently (no Epic is drastically larger)
- [ ] Epics are sized appropriately for a sprint team (not too large, not too small)
- [ ] Can be completed in 2-4 weeks with a typical team

### Step 6: Output Format

Generate output for each Epic in this format:

```markdown
# Epic: [Epic Title]

**Epic ID:** [EPIC-1]
**Project:** [PROJECT-ID]
...
[Full epic content following epic-template.md structure]
```

Include a summary section at the beginning:

```
**Generated from:** [PRD-Name]
**Generated Date:** [DATE]
**Decomposition Strategy:** [BRIEF EXPLANATION OF HOW PRD WAS BROKEN DOWN]
**Total Epics:** 3-4
**Status:** DRAFT (Ready for team review and refinement)
```

### Step 7: Save Locations

**Default naming:** `specs/epics/EPIC-{number}-{name}.md`

**Examples:**
- `specs/epics/EPIC-1-User-Authentication.md`
- `specs/epics/EPIC-2-Idea-Submission.md`
- `specs/epics/EPIC-3-Workflow-Engine.md`

Include reference back to source PRD in each Epic file.

---

## Example: PRD Decomposition

### Input PRD (Summary)
```
PRD-Name: Authentication System
Goals: 
  1. Enable secure user login
  2. Support multiple auth methods
  3. Implement MFA

Success Metrics:
  - 95% login success rate
  - < 3 second login time
  - 70% MFA adoption
  - < 24 hour account recovery

Functional Requirements:
  - Email/password auth
  - OAuth 2.0 (Google, GitHub)
  - MFA setup and verification
  - Password reset flow
  - Session management
```

### Output Epics (Decomposition)

**EPIC-1: User Authentication Foundations**
- Delivers: Email/password login + OAuth
- Maps to: 95% login success rate, < 3 second login time
- Value: Users can securely access the platform
- Independently deployable: Yes (OAuth can be disabled initially)

**EPIC-2: Multi-Factor Authentication**
- Delivers: MFA setup, verification, management
- Maps to: 70% MFA adoption metric
- Value: Users can significantly increase account security
- Independently deployable: Yes (existing after EPIC-1)

**EPIC-3: Account Recovery & Session Management**
- Delivers: Password reset, forgot email recovery, session lifecycle
- Maps to: < 24 hour account recovery, session security
- Value: Users can regain access to locked accounts, secure sessions
- Independently deployable: Yes (foundational for EPIC-1)

---

## Key Questions to Ask During Decomposition

1. **"Can this Epic ship without the others being complete?"**
   - If NO → Recombine or redefine boundaries

2. **"Does this Epic let users accomplish a complete goal?"**
   - If NO → Expand scope or combine with related Epic

3. **"Which success metric does this Epic improve?"**
   - If NONE → Consider if it's truly necessary or refactor as infrastructure

4. **"Who is the primary user of this Epic?"**
   - If MULTIPLE PERSONAS → May need to split or clearly define primary

5. **"What's the smallest useful unit we can ship?"**
   - This unit should be your Epic, not individual screens/endpoints

---

## Common Pitfalls to Avoid

❌ **Horizontal Slicing**
```
EPIC-1: Backend API Development
EPIC-2: Frontend Development
EPIC-3: Database Setup
```
✅ **Vertical Slicing**
```
EPIC-1: User Registration (includes backend, frontend, database)
EPIC-2: User Profile Management (includes backend, frontend, database)
```

❌ **Too Small**
```
EPIC-1: Add Login Button
EPIC-2: Add Password Input Field
EPIC-3: Add Submit Button
```
✅ **Appropriately Sized**
```
EPIC-1: User Login with Email & Password (all UI + backend + validation)
```

❌ **No Clear Value**
```
EPIC: "Database Migration to PostgreSQL"
```
✅ **User-Facing Value**
```
EPIC: "Enable Real-Time Notifications" (users see updates instantly)
```

---

## Invocation

When ready to decompose a PRD into Epics, invoke with:

```
/decompose-epics [PRD-Name or Path]
```

Or reference the PRD directly:
```
/decompose-epics specs/prds/PRD-Authentication.md
```

Copilot will generate 3-4 complete Epic documents ready for review.

---

## Next Steps After Epic Decomposition

1. **Review Epics with Stakeholders**
   - Verify Epic boundaries make sense
   - Confirm metric alignment
   - Get approval on prioritization

2. **Create User Stories**
   - Within each approved Epic, create 5-8 user stories
   - Use: `/generate-stories [EPIC-Name]`

3. **Plan Sprints**
   - Select 1-2 Epics per sprint
   - Distribute stories across team capacity
   - Track progress against metrics
