---
name: "Generate PRD from Project Brief"
description: "Generate a Product Requirements Document (PRD) from a project brief using the PRD template"
---

# Generate PRD from Project Brief

## Purpose
Generate a complete, detailed Product Requirements Document (PRD) from a high-level project brief. The output should be specific, measurable, and ready for team review.

## Instructions

### Step 1: Read the Template
First, load the PRD template from this location:
```
specs/templates/prd-template.md
```

Use this structure as your backbone for all generated PRDs.

### Step 2: Receive Project Brief
The user will provide a project brief containing:
- Project name/description
- Problem statement
- Key goals
- Target users
- Main features/capabilities
- Any constraints or dependencies

### Step 3: Generate Complete PRD
Expand the brief into a comprehensive PRD by:

**1. Overview Section**
- Write a clear purpose statement (2-3 sentences)
- Expand the problem statement with specific context and numbers
- Define 3-5 measurable goals with success indicators

**2. User Personas**
- Create 2-3 distinct personas with specific names and roles
- Define their background, needs, pain points, and goals
- Make personas realistic and detailed (at least 5 attributes each)

**3. Use Cases**
- Define 3-5 key use cases showing how personas interact with the system
- Include main flow, alternate flows, and clear pre/postconditions
- Make flows numbered and specific

**4. Functional Requirements**
- Break down into 3-5 feature areas (FR-1.x, FR-2.x, etc.)
- List 3+ requirements per feature
- Make requirements testable and specific (avoid vague language like "easy to use")

**5. Non-Functional Requirements**
- Performance: Include specific response time targets (e.g., < 2 seconds)
- Security: List authentication, encryption, and compliance requirements
- Reliability: Define uptime targets and disaster recovery objectives
- Usability: Specify accessibility standards and browser support
- Maintainability: Define code quality, test coverage, documentation standards

**6. Success Metrics**
- Create 4-6 metrics that are SMART (Specific, Measurable, Achievable, Relevant, Time-bound)
- Include measurement methods for each metric
- Metrics should align with stated goals

**7. Scope**
- List 5-8 items in scope (specific features, not vague)
- List 3-5 items out of scope (things that won't be included)
- Add future considerations (Phase 2 enhancements)

**8. Appendix**
- Assumptions: 3-5 assumptions about users, technology, business
- Constraints: Budget, timeline, resource, technical constraints
- Dependencies: External systems, third-party services, team dependencies
- References: Links to related documents or mockups

### Step 4: Quality Checklist
Before returning the PRD, verify it meets these criteria:

**Problem & Goals**
- [ ] Problem statement includes numbers/metrics (not just description)
- [ ] Goals are specific and measurable (not "improve user experience")
- [ ] Goals align with success metrics

**Personas**
- [ ] Each persona has a specific name (not generic "User 1")
- [ ] Personas have distinct roles and needs (not all the same)
- [ ] Pain points are specific to the problem being solved

**Requirements**
- [ ] All requirements are testable (can be verified through testing)
- [ ] No vague terms like "user-friendly", "easy", "fast" without specifics
- [ ] Requirements are at appropriate level of detail (not too high, not implementation)

**Metrics**
- [ ] Each metric is SMART (Specific, Measurable, Achievable, Relevant, Time-bound)
- [ ] Metrics are tied to business objectives, not just technical measurements
- [ ] Measurement methods are realistic and implementable

**Scope**
- [ ] In-scope items are specific features (not just "authentication module")
- [ ] Out-of-scope items explain why they're deferred
- [ ] Clear separation between Phase 1 (MVP) and future phases

### Step 5: Output Format
Return the PRD in this format:

```markdown
# Product Requirements Document (PRD)

[Complete PRD following the template structure]
```

Include a summary comment at the top:
```
**Generated:** [DATE]
**From Brief:** [BRIEF TITLE]
**Status:** DRAFT (Ready for review)
**Next Steps:** Share with stakeholders, refine as needed, move to APPROVED
```

### Step 6: Save Location
**Default filename:** `specs/prds/PRD-{feature-name}.md`

Examples:
- `specs/prds/PRD-Authentication-System.md`
- `specs/prds/PRD-Idea-Submission.md`
- `specs/prds/PRD-Workflow-Engine.md`

---

## Example Input (Project Brief)

```
PROJECT: Authentication System
PROBLEM: Users need a secure way to sign in to the platform with email/password and social login
GOALS: 
  - Support email/password and OAuth (Google, GitHub)
  - Enable MFA for enhanced security
  - Complete login in under 3 seconds
USERS: Platform users, admin team
MAIN FEATURES: Login, registration, MFA setup, password reset
CONSTRAINTS: Must use Auth0, must support mobile browsers
```

---

## Quality Feedback Questions

If the initial PRD seems incomplete, ask the user:

1. **For vague problems:** "Can you provide specific metrics about the current problem? (e.g., how many users are affected?)"

2. **For missing personas:** "Who are the 2-3 most important users? Can you describe their role and background?"

3. **For weak metrics:** "How will you measure if this feature succeeds? (e.g., user adoption rate, time saved, cost reduction)"

4. **For unclear scope:** "What features are absolutely must-have for launch (MVP) vs. nice-to-have for Phase 2?"

---

## Common Pitfalls to Avoid

❌ **Vague language:** "Users should be able to easily log in"  
✅ **Specific:** "Users can complete login in < 3 seconds on Chrome, Firefox, Safari (last 2 versions)"

❌ **Unmeasurable goals:** "Improve security"  
✅ **Measurable:** "Implement OAuth 2.0 and MFA; achieve 100% of logins authenticated"

❌ **Generic personas:** "User", "Admin", "Developer"  
✅ **Named personas:** "Sarah (Product Manager)", "Marcus (System Admin)", "Yuki (Backend Developer)"

❌ **Too broad scope:** "Build a social platform"  
✅ **Clear scope:** "Build login, profile page, basic messaging in Phase 1; video calls in Phase 2"

---

## Invocation

When ready to use this prompt in Copilot, invoke with:

```
/generate-prd [PROJECT BRIEF]
```

Or provide the brief and Copilot will generate the complete PRD interactively.
