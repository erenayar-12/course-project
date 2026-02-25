# Project Specification Plan (per agents.md)

**Last Updated:** February 25, 2026  
**Owner:** Development Team  
**Status:** MVP Phase 1 Planning

---

## Phase 1 (MVP): Authentication + Basic Workflow

### ✅ COMPLETED

#### **AUTH System (Authentication)**

**✅ AUTH-prd.md** - Product Requirements Document
- Status: APPROVED
- Completed: Features, personas, requirements defined
- Ready: For epic breakdown

**✅ AUTH-epic-1.md (EPIC-1-User-Authentication)**
- Status: APPROVED
- Title: "User Authentication and Authorization"
- Contains: 5 user stories for auth flow

**✅ AUTH-story-1.md (STORY-EPIC-1-User-Authentication)**
- Status: COMPLETED
- Title: "Display Login and Registration Pages"
- Implementation: LoginPage.tsx, RegistrationPage.tsx
- Tests: ✅ LoginPage.test.tsx, RegistrationPage.test.tsx
- Coverage: 80%+ (5/5 tests passing)

**✅ AUTH-story-2.md (STORY-EPIC-1.1-Display-Login-Pages)**
- Status: COMPLETED
- Title: "Display Login and Registration Pages"
- Implementation: Component UI implemented and tested

**✅ AUTH-story-3.md (STORY-EPIC-1.2-Integrate-Auth0)**
- Status: COMPLETED
- Title: "Integrate Auth0 Authentication"
- Implementation: auth0Config.ts created
- Tests: ✅ auth0Config.test.ts (5 tests passing)

**⏳ AUTH-story-4.md (STORY-EPIC-1.3-JWT-Token-Storage)**
- Status: READY FOR IMPLEMENTATION
- Title: "Store and Manage JWT Tokens Securely"
- Tech Stack: ✅ Aligned with agents.md
- Acceptance Criteria: 7 criteria (AC 1-7)
- Story Points: 5 | Days: 1.5-2 | Risk: MEDIUM-HIGH
- **Next Action:** Implement `tokenService.ts`, `apiClient.ts`, backend middleware

**⏳ AUTH-story-5.md (STORY-EPIC-1.4-RBAC)**
- Status: DRAFT → IN REVIEW
- Title: "Role-Based Access Control (RBAC)"
- **Prerequisite:** AUTH-story-4.md (JWT Token Storage)

**⏳ AUTH-story-6.md (STORY-EPIC-1.5-Logout-Timeout)**
- Status: DRAFT → IN REVIEW
- Title: "Logout and Session Timeout"
- **Prerequisite:** AUTH-story-4.md (JWT Token Storage)

---

### ⏳ IN PROGRESS / BLOCKED

#### **Workflow Engine (WF System)**

**❌ WF-prd.md** - NOT CREATED
- Status: BLOCKED (awaiting PRD specifications)
- Required: Product definition, personas, workflow states, business logic
- Next: Copy template `specs/templates/prd-template.md` → `specs/prds/WF-prd.md`
- Action: Define project phase for workflow/status management

**❌ WF-epic-1.md** - NOT CREATED
- Status: BLOCKED (awaiting WF-prd.md approval)
- Required: Epic breakdown of workflow features
- Next: Create epic specs after PRD completion

**❌ WF-story-1.md to WF-story-N.md** - NOT CREATED
- Status: BLOCKED (awaiting WF-epic-1.md)
- Required: Individual workflow user stories

---

## Phase 2: Idea Submission System

### ❌ NOT STARTED

**❌ IDEA-prd.md** - NOT CREATED
- Status: PLANNED (Phase 2)
- Required: Product requirements for idea submission feature
- Prerequisite: Phase 1 (MVP) Authentication complete

**❌ IDEA-epic-1.md** - NOT CREATED
- Status: PLANNED (Phase 2)

**❌ IDEA-story-1.md to IDEA-story-N.md** - NOT CREATED
- Status: PLANNED (Phase 2)

---

## Phase 3: Advanced Workflow Features

### ❌ NOT STARTED

**❌ WF-epic-2.md** - NOT CREATED
- Status: PLANNED (Phase 3)
- Focus: Advanced workflow features, scaling

**❌ WF-story-N.md to WF-story-M.md** - NOT CREATED
- Status: PLANNED (Phase 3)

---

## Implementation Checklist

### ✅ Before implementation of each story, verify:

- [x] PRD is approved
- [x] All epics created (for completed phase)
- [x] All stories have acceptance criteria
- [x] Stories follow INVEST principles (Independent, Negotiable, Valuable, Estimable, Small, Testable)
- [x] Tech stack aligned with `agents.md`
- [x] Files/components spec matches project structure
- [x] Testing strategy defined (Jest + React Testing Library)

### For STORY-EPIC-1.3 (Current Priority):

- [x] Specification written ✅ STORY-EPIC-1.3-JWT-Token-Storage.md
- [x] Aligned with agents.md tech stack ✅ (React 18, Express.js, Prisma, PostgreSQL, Jest)
- [x] All 7 acceptance criteria defined ✅ (AC 1-7 including Jest testing)
- [x] Files/components specified ✅ (Frontend: tokenService.ts, apiClient.ts | Backend: authMiddleware.ts, tokenController.ts)
- [ ] **NEXT:** Begin implementation
  - Frontend: Create `src/services/tokenService.ts`
  - Frontend: Create `src/services/apiClient.ts` with Fetch interceptor
  - Backend: Create `api/middleware/authMiddleware.ts`
  - Backend: Create `api/controllers/tokenController.ts`
  - Database: Add Prisma schema for token audit table
  - Tests: Jest tests for tokenService + API interceptor (80%+ coverage)

---

## Specification Document Status Matrix

| ID | Type | Document | Status | Phase | Next Action |
|---|---|---|---|---|---|
| AUTH | PRD | AUTH-prd.md | ✅ APPROVED | 1 | Reference for implementation |
| EPIC-1 | EPIC | AUTH-epic-1.md | ✅ APPROVED | 1 | Break into stories ✅ |
| 1.0 | STORY | STORY-EPIC-1.md | ✅ COMPLETED | 1 | Move to Phase 2 |
| 1.1 | STORY | STORY-EPIC-1.1 | ✅ COMPLETED | 1 | Move to Phase 2 |
| 1.2 | STORY | STORY-EPIC-1.2 | ✅ COMPLETED | 1 | Move to Phase 2 |
| **1.3** | **STORY** | **STORY-EPIC-1.3** | **⏳ READY** | **1** | **👉 START HERE** |
| 1.4 | STORY | STORY-EPIC-1.4 | ⏳ IN REVIEW | 1 | Blocked on 1.3 |
| 1.5 | STORY | STORY-EPIC-1.5 | ⏳ IN REVIEW | 1 | Blocked on 1.3 |
| WF | PRD | WF-prd.md | ❌ NOT CREATED | 1 | ⏳ Create PRD |
| WF-EPIC-1 | EPIC | WF-epic-1.md | ❌ NOT CREATED | 1 | ⏳ Blocked on PRD |
| IDEA | PRD | IDEA-prd.md | ❌ NOT CREATED | 2 | Planned for Phase 2 |
| WF-EPIC-2 | EPIC | WF-epic-2.md | ❌ NOT CREATED | 3 | Planned for Phase 3 |

---

## Recommended Next Steps

### **Immediate (This Sprint)**

1. **🎯 START:** Implement STORY-EPIC-1.3 (JWT Token Storage)
   - Status: READY FOR IMPLEMENTATION
   - Effort: 5 story points | 1.5-2 days
   - Scope: Full-stack (React frontend + Express backend + Prisma)
   - Testing: Jest with 80%+ coverage required
   - Files to create: 4 frontend + 3 backend + 1 migration

2. **🎯 IN PARALLEL:** Create WF-prd.md (Workflow Engine PRD)
   - Define workflow states, personas, business logic
   - Unblocks: WF-epic-1.md and subsequent workflow stories
   - Effort: ~4 hours planning + 2 hours writing

### **Next Sprint**

3. Implement STORY-EPIC-1.4 (RBAC) - After 1.3 complete
4. Implement STORY-EPIC-1.5 (Logout/Timeout) - After 1.3 complete
5. Create WF-epic-1.md + WF-story-1..N.md - After WF-prd.md approved

### **Phase 2 (After MVP)**

6. Create IDEA-prd.md (Idea Submission System)
7. Create IDEA-epic-1.md + IDEA-story-1..N.md

---

## Key Reminders (per agents.md)

✅ **Naming Conventions:**
- Documents: `[PROJECT-ID]-[DOC-TYPE]-[INCREMENT].md`
- Examples: `AUTH-prd.md`, `AUTH-epic-1.md`, `AUTH-story-1.md`

✅ **File Organization:**
- Specs: `specs/prds/`, `specs/epics/`, `specs/stories/`
- Code: `src/components/`, `src/services/`, `src/pages/`, `api/`, etc.
- Tests: Jest with `[name].test.tsx` or `[name].test.ts`

✅ **Status Tracking:**
- Use: DRAFT → IN REVIEW → APPROVED → IN PROGRESS → COMPLETED

✅ **Commit Messages (PR format):**
```
[SUBSYSTEM] Brief description

- Detailed change
- Related spec: STORY-EPIC-1.3
```

---

## Questions / Clarifications Needed

- [ ] WF System requirements definition (for WF-prd.md) - **WHO?**
- [ ] IDEA System requirements definition (Phase 2) - **WHO?**
- [ ] Backend API endpoints design - **WHO?**
- [ ] PostgreSQL schema finalization - **WHO?**

---

**Generated:** February 25, 2026  
**Next Review:** After STORY-EPIC-1.3 implementation
