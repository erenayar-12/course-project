# User Story: Implement Role-Based Access Control (RBAC)

**Story ID:** STORY-EPIC-1.4  
**Epic:** EPIC-1  
**Sprint:** Backlog  
**Status:** Ready for Refinement  
**Persona:** Raj (Evaluators) & Priya (Submitters)

## User Story

**As a** system  
**I want** to enforce role-based access control on all routes and API endpoints  
**so that** users can only access features appropriate for their role (Submitters see submission UI; Evaluators see evaluation UI)

## Story Context

Different users have different roles (Submitter, Evaluator, Admin). We need to ensure users can only access pages and API routes that match their role. Submitters should not be able to access the evaluation queue, and evaluators should not be able to modify their own ideas after submission. This story implements the authorization layer.

## Acceptance Criteria

### AC 1: Role Is Assigned to User at Login
- **Given:** User authenticates through Auth0
- **When:** User first logs in or token is refreshed
- **Then:** User role is fetched (from Auth0 metadata or database) and stored in app state; default role is "Submitter"

### AC 2: Submitter-Only Routes Are Protected
- **Given:** Unauthenticated user or user with "Submitter" role
- **When:** User navigates to admin-only route (e.g., `/evaluation-queue`)
- **Then:** User is redirected to permitted page (dashboard); error message displays: "You don't have permission to access this page"

### AC 3: Evaluator-Only Routes Are Protected
- **Given:** Unauthenticated user or user without "Evaluator" role
- **When:** User tries to navigate to `/evaluation-queue`
- **Then:** User is redirected to their allowed dashboard; access denied message displays

### AC 4: API Endpoints Validate Role
- **Given:** Submitter makes API request to admin endpoint (e.g., `PUT /api/ideas/:id/evaluate`)
- **When:** Request is made with valid JWT but insufficient role
- **Then:** API returns 403 Forbidden with message: "Insufficient permissions for this action"

### AC 5: Role Change Takes Effect After Token Refresh
- **Given:** User role is changed in backend (promoted from Submitter to Evaluator)
- **When:** User's token is refreshed on next API request or page refresh
- **Then:** New role is loaded; user can now access evaluator features

## Technical Notes

### Implementation Approach
- Add role claim to JWT (in Auth0 rules or user metadata)
- Create ProtectedRoute component to wrap routes requiring specific roles
- Create API middleware to validate user role on backend
- Store current user role in React context or Redux
- Add role checks before displaying admin-only UI components

### Files/Components Affected
- `src/components/ProtectedRoute.tsx` - New component for route protection
- `src/App.tsx` - Update routes to use ProtectedRoute
- `src/context/AuthContext.ts` - Add role state
- Backend middleware (`src/middleware/authMiddleware.ts`) - Add role validation
- `src/constants/roles.ts` - Define role constants

### Technology Stack
- React Context API or Redux for role state
- React Router for route protection
- JWTs with custom claims for role information

### Known Limitations
- Roles are static per user (no dynamic role assignments mid-session, requires token refresh)
- No fine-grained permissions (all Evaluators can do all evaluator actions)
- UI elements don't dynamically show/hide based on role in this story (Phase 2 enhancement)

## Estimation & Effort

**Story Points:** 3  
**Estimated Days:** 0.5 - 1 day  
**Risk Level:** LOW-MEDIUM

**Estimation Rationale:** Role-based access is a standard pattern with clear requirements. Main work is creating route protectors and API middleware. Low-medium risk because improper implementation could leak access to restricted features.

## Dependencies & Blockers

### Story Dependencies
- STORY-EPIC-1.3 must be complete (JWT token handling)
- User table in database must include role column
- Auth0 must be configured to include role claim in JWT

### Blockers
- [ ] Auth0 rules not configured to inject role into JWT

## INVEST Validation Checklist

- [x] **Independent** - Depends on STORY-3, but clearly scoped authorization layer
- [x] **Negotiable** - Redirect behavior and error messages can be refined
- [x] **Valuable** - Users can now safely access only their authorized features; security is enforced
- [x] **Estimable** - Clear scope: "Add route and API layer protection based on role"
- [x] **Small** - Can be completed in 0.5-1 day using standard patterns
- [x] **Testable** - Can test unauthorized route access; verify API rejects insufficient role

## Definition of Acceptance

- [ ] User role is correctly assigned at login
- [ ] Submitters cannot access evaluator routes (redirected with error message)
- [ ] Evaluators cannot access admin-only routes (if admin role exists)
- [ ] API endpoints return 403 Forbidden for insufficient permissions
- [ ] Role changes reflected after token refresh
- [ ] Routes protected with ProtectedRoute component
- [ ] Tested with multiple role scenarios (Submitter, Evaluator)

## Related Information

**Related Stories:**
- STORY-EPIC-1.3 (JWT tokens - prerequisite)
- STORY-EPIC-1.5 (logout)

**Design Reference:**
[Auth0 Role-Based Access Control: https://auth0.com/docs/manage-users/access-control/rbac]

**Documentation:**
- React Router Protected Routes: https://reactrouter.com/
- OWASP Access Control: https://owasp.org/www-project-top-ten/
