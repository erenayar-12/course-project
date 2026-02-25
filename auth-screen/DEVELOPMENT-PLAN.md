# InnovatEPAM Project Development Plan

**Document Type:** Project Roadmap & Development Plan  
**Date Created:** February 25, 2026  
**Owner:** Development Team  
**Status:** APPROVED

---

## Project Overview

**Project Goal:** Build InnovatEPAM - a platform for idea submission, evaluation, and workflow management with role-based access control.

**Current Phase:** Phase 1 (MVP) - Authentication + Basic Workflow  
**Progress:** 60% (3/5 stories completed in AUTH epic)

---

## Phase Roadmap (per agents.md Section 9)

### Phase 1: Authentication + Basic Workflow 🟢 (In Progress)

**Authentication (AUTH):**
- ✅ AUTH-epic-1
  - ✅ AUTH-story-1: Display Login Pages
  - ✅ AUTH-story-2: Integrate Auth0
  - ✅ AUTH-story-3: JWT Token Storage
  - ✅ AUTH-story-4: Role-Based Access Control (RBAC)
  - ⏳ AUTH-story-5: Logout & Session Timeout (NEXT)

**Basic Workflow (WF):**
- ⏳ WF-epic-1: Workflow State Machine
  - ⏳ WF-story-1: Implement workflow states (Draft → Submitted → In Review → Approved/Rejected → Completed)
  - ⏳ WF-story-2: Create workflow context/store
  - ⏳ WF-story-3: Add state transition validation

### Phase 2: Idea Submission System 🟡 (Not Started)

**Idea Submission (IDEA):**
- ⏳ IDEA-epic-1: Idea Submission & Management
  - ⏳ IDEA-story-1: Create idea submission form
  - ⏳ IDEA-story-2: Store ideas in database
  - ⏳ IDEA-story-3: Display user's submitted ideas
  - ⏳ IDEA-story-4: Edit/delete ideas (draft only)

### Phase 3: Advanced Workflow Features 🔴 (Future)

- ⏳ WF-epic-2: Advanced workflow features
- ⏳ WF-epic-3: Bull Queue integration for async jobs
- ⏳ WF-epic-4: Temporal.io for complex workflows

---

## Immediate Next Steps (This Sprint)

### 1. Complete AUTH-story-5: Logout & Session Timeout

**Priority:** HIGH  
**Estimated Points:** 2-3  
**Estimation:** 0.5 - 1 day  

**What to implement:**
```
AUTH-story-5 Requirements:
- AC1: Logout button clears session
- AC2: Session timeout after N minutes
- AC3: Auto-redirect to login on timeout
- AC4: Show timeout warning before redirect
- AC5: Remember last active time
```

**Files to modify:**
- `src/context/MockAuth0Context.tsx` - Add session timeout logic
- `src/pages/Dashboard.tsx` - Enhance logout button
- `src/App.tsx` - Add global session timeout middleware
- `src/hooks/useSessionTimeout.ts` (NEW)

**Acceptance Criteria:**
- [ ] Logout button removes user from context/localStorage
- [ ] Redirects to /login after logout
- [ ] Session times out after 15 minutes (configurable)
- [ ] Warning shows 1 minute before timeout
- [ ] User can reset timer by clicking "Stay logged in"
- [ ] Timeout resets on any user action

---

### 2. Setup Backend Infrastructure (Prepare for WF)

**Priority:** MEDIUM  
**Estimated Points:** 5  
**Estimation:** 1 - 2 days  

**What to setup:**
```
Backend Requirements:
- Express.js or Next.js API routes
- TypeScript configuration
- Database (PostgreSQL + Prisma/TypeORM)
- Auth0 integration for real authentication
- JWT validation middleware
- Role-based API middleware
```

**Files to create:**
- `backend/src/types/user.ts` - User data model
- `backend/src/middleware/auth.ts` - JWT validation
- `backend/src/middleware/rbac.ts` - Role validation
- `backend/src/db/schema.prisma` - Database schema
- `.env.test` - Test environment config

**Database Schema (Draft):**
```sql
Table users {
  id: UUID (Primary Key)
  email: String (Unique)
  auth0_id: String (Unique)
  role: Enum (ADMIN, EVALUATOR, SUBMITTER)
  created_at: DateTime
  updated_at: DateTime
}

Table ideas {
  id: UUID (Primary Key)
  user_id: UUID (Foreign Key → users.id)
  title: String
  description: Text
  status: Enum (DRAFT, SUBMITTED, IN_REVIEW, APPROVED, REJECTED, COMPLETED)
  created_at: DateTime
  updated_at: DateTime
}

Table workflow_states {
  id: UUID (Primary Key)
  idea_id: UUID (Foreign Key → ideas.id)
  current_state: Enum (states above)
  previous_state: Enum
  transitioned_by: UUID (Foreign Key → users.id)
  transitioned_at: DateTime
}
```

---

### 3. Integrate Real Auth0 (After Session Timeout)

**Priority:** MEDIUM-HIGH  
**Estimated Points:** 3  
**Estimation:** 0.5 - 1 day  

**What to implement:**
```
Auth0 Integration:
- Update .env.local with real Auth0 credentials
- Replace MockAuth0Context with real Auth0Provider
- Verify login/logout with Auth0
- Test callback URL redirect
```

**Prerequisites:**
- Auth0 account with application configured
- Valid Auth0 domain and client ID
- Redirect URI set to http://localhost:3000/callback

**Steps:**
1. Get Auth0 credentials from dashboard
2. Update `.env.local`
3. Remove MockAuth0Context usage
4. Use real @auth0/auth0-react provider
5. Test full OAuth flow

---

## Development Schedule (Recommended)

| Week | Task | Priority | Est. Days |
|------|------|----------|-----------|
| **Week 1** | Fix rbac.test files + Complete AUTH-story-5 | HIGH | 1 day |
| | Test session timeout thoroughly | HIGH | 0.5 days |
| | Integrate real Auth0 | MEDIUM-HIGH | 1 day |
| **Week 2** | Setup backend infrastructure | MEDIUM | 1-2 days |
| | Create database schema | MEDIUM | 0.5 days |
| | Implement User API endpoints | MEDIUM | 1 day |
| **Week 3** | Start WF-epic-1 (Workflow State Machine) | MEDIUM | 2 days |
| | Implement workflow context | MEDIUM | 1 day |
| **Week 4** | Begin IDEA-epic-1 (Idea Submission) | LOW | 2 days |
| | Create idea submission form | LOW | 1 day |

---

## Spec Documents to Create

### Phase 1 Specs (Immediate)

**Already Created:**
- ✅ AUTH-prd.md
- ✅ AUTH-epic-1.md
- ✅ AUTH-story-1.md through AUTH-story-5.md

**To Create:**
- ⏳ WF-prd.md - Workflow engine requirements
- ⏳ WF-epic-1.md - Workflow state machine epic

### Phase 2 Specs (After Phase 1)

**To Create:**
- ⏳ IDEA-prd.md - Idea submission system requirements
- ⏳ IDEA-epic-1.md - Idea submission & management

### Template Locations
```
specs/
├── prds/
│   ├── AUTH-prd.md (exists)
│   ├── WF-prd.md (create)
│   └── IDEA-prd.md (create)
├── epics/
│   ├── EPIC-1-User-Authentication.md (exists)
│   ├── WF-epic-1.md (create)
│   └── IDEA-epic-1.md (create)
└── stories/
    ├── STORY-EPIC-1.1-Display-Login-Pages.md (exists)
    ├── STORY-EPIC-1.2-Integrate-Auth0.md (exists)
    ├── STORY-EPIC-1.3-JWT-Token-Storage.md (exists)
    ├── STORY-EPIC-1.4-RBAC.md (exists)
    ├── STORY-EPIC-1.5-Logout-Timeout.md (exists)
    ├── STORY-WF-1.1-Workflow-States.md (create)
    ├── STORY-WF-1.2-Workflow-Context.md (create)
    ├── STORY-IDEA-1.1-Submission-Form.md (create)
    └── STORY-IDEA-1.2-Store-Ideas.md (create)
```

---

## Git Commit Strategy (per agents.md Section 7)

### Commit Message Format
```
[SUBSYSTEM] Brief description

- Detailed change 1
- Detailed change 2
- Related spec: STORY-name.md
```

### Example Commits
```
[auth] Complete AUTH-story-5 logout and session timeout

- Add session timeout after 15 minutes of inactivity
- Show 1-minute warning before redirect
- Add "Stay logged in" button to extend session
- Implement useSessionTimeout hook
- Add configurable timeout constants
- Related spec: AUTH-story-5.md

[backend] Setup Express.js and database infrastructure

- Initialize Node.js backend with Express
- Configure TypeScript and ESLint
- Setup Prisma ORM with PostgreSQL
- Create initial database schema
- Add JWT validation middleware
- Related specs: WF-prd.md

[ideas] Implement idea submission form (IDEA-story-1)

- Create SubmitIdeaForm component
- Add form validation (title, description)
- Integrate with API endpoint
- Add loading and error states
- Related spec: IDEA-story-1.md
```

---

## Testing Strategy

### Unit Tests (Jest + React Testing Library)
```bash
npm run test:unit
```

**Coverage Goals:**
- Components: 80%+
- Utilities: 90%+
- Hooks: 85%+

### Integration Tests
```bash
npm run test:integration
```

**Focus Areas:**
- Auth flow (login → protected route → logout)
- Role-based access control
- Workflow state transitions
- Idea submission → workflow state changes

### E2E Tests (Future - Cypress/Playwright)
```bash
npm run test:e2e
```

---

## Code Review Checklist (Before Merge)

- [ ] Code follows TypeScript best practices
- [ ] Components use React hooks properly
- [ ] Tailwind classes are organized
- [ ] Accessibility standards met (WCAG AA)
- [ ] Commit messages follow conventions
- [ ] Related spec is referenced
- [ ] Tests pass (unit + integration)
- [ ] No console errors or warnings
- [ ] Documentation updated

---

## Risk Mitigation

### Potential Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Auth0 credentials setup | Medium | High | Document setup steps, provide examples |
| Database schema mismatch | Medium | High | Use Prisma migrations, version control schema |
| Role validation bugs | Medium | Medium | Comprehensive RBAC tests, manual scenarios |
| Session timeout edge cases | Low | Medium | Test timeout with various user actions |
| Performance issues | Low | Medium | Monitor with dev tools, optimize as needed |

---

## Success Metrics

### Phase 1 Completion
- ✅ All 5 AUTH stories completed
- ✅ Authentication fully functional
- ✅ RBAC working with 3 roles
- ✅ Backend infrastructure ready
- ✅ >80% test coverage for auth layer

### Phase 2 Completion
- ✅ Idea submission working
- ✅ Ideas stored in database
- ✅ Workflow states functioning
- ✅ Users can track idea status

### Phase 3 Completion
- ✅ Advanced workflow features
- ✅ Async job queue (Bull)
- ✅ Complex workflow support

---

## Resources & References

### Documentation
- `agents.md` - Project conventions
- `README.md` - Project overview
- `TESTING_PLAN.md` - Testing procedures
- `specs/` - All specifications

### Tech Stack References
- React: https://react.dev
- TypeScript: https://www.typescriptlang.org
- Tailwind CSS: https://tailwindcss.com
- Vite: https://vitejs.dev
- Auth0: https://auth0.com/docs
- React Router: https://reactrouter.com
- Jest: https://jestjs.io
- Prisma: https://www.prisma.io

---

## Communication & Updates

**Sprint Planning:** Weekly  
**Status Updates:** Daily standup  
**Spec Reviews:** Before implementation  
**Code Reviews:** Before merge  

**Communication Channels:**
- GitHub Issues: Feature requests, bugs
- GitHub Discussions: Architecture decisions
- Commits: Reference related specs
- PRs: Detailed descriptions with spec links

---

**Next Steps:** 
1. Fix rbac.test files
2. Start AUTH-story-5 (Logout & Session Timeout)
3. Create WF-prd.md for workflow engine

**Last Updated:** February 25, 2026  
**Status:** Ready for Implementation
