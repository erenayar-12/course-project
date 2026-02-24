# User Story: Integrate Auth0 Authentication

**Story ID:** STORY-EPIC-1.2  
**Epic:** EPIC-1  
**Sprint:** Backlog  
**Status:** Ready for Refinement  
**Persona:** Priya (All users)

## User Story

**As a** EPAM employee  
**I want** to authenticate using my corporate email and login via Auth0  
**so that** I can access the app securely with my company credentials

## Story Context

This story integrates Auth0 authentication into the login and registration flows created in Story 1. Users will now be able to authenticate using corporate SAML credentials. Upon successful authentication, users are redirected to the dashboard. This story handles both registration (new user creation) and login (existing user authentication).

## Acceptance Criteria

### AC 1: User Can Log In with Valid Credentials
- **Given:** User is on login page and has valid EPAM credentials
- **When:** User enters email and password and clicks "Sign In"
- **Then:** Request is sent to Auth0; if successful, user is redirected to dashboard

### AC 2: User Receives Error for Invalid Credentials
- **Given:** User is on login page
- **When:** User enters invalid email/password and clicks "Sign In"
- **Then:** Error message displays: "Invalid email or password. Please try again." (generic message for security)

### AC 3: User Can Register with New Credentials
- **Given:** User is on registration page and enters valid email and matching passwords
- **When:** User clicks "Create Account"
- **Then:** New account is created in Auth0; user is automatically logged in and redirected to dashboard

### AC 4: Auth0 Branding Elements Display
- **Given:** User is on login/registration page
- **When:** Page fully loads
- **Then:** Auth0 button or branding is visible (if using Auth0's UI); or custom UI with Auth0 integration is seamless

### AC 5: Loading State Shows During Auth Request
- **Given:** User clicks "Sign In" or "Create Account"
- **When:** Request is in progress
- **Then:** Button changes to show loading state (spinning icon or "Logging in..." text); button is disabled to prevent multiple clicks

## Technical Notes

### Implementation Approach
- Install `@auth0/auth0-react` npm package
- Configure Auth0Provider in App.tsx with your Auth0 domain and client ID
- Use `useAuth0()` hook in LoginPage and RegistrationPage
- Use `loginWithRedirect()` for login and `loginWithRedirect(screen_hint='signup')` for registration
- Handle redirect callback on dashboard page

### Files/Components Affected
- `src/App.tsx` - Add Auth0Provider
- `src/pages/LoginPage.tsx` - Update with Auth0 logic
- `src/pages/RegistrationPage.tsx` - Update with Auth0 logic
- `src/config/auth0Config.js` - New configuration file
- `src/environment/.env.local` - Auth0 credentials (not committed to git)

### Technology Stack
- @auth0/auth0-react library
- Node.js environment variables (.env)

### Known Limitations
- Error messages are generic (don't reveal if email exists)
- No rate limiting on login attempts (can be added in Phase 2)
- No "Forgot Password" flow yet (Phase 2 feature)
- Session timeout not yet implemented (Story 1.5)

## Estimation & Effort

**Story Points:** 3  
**Estimated Days:** 0.5 - 1 day  
**Risk Level:** LOW-MEDIUM

**Estimation Rationale:** Auth0 integration is well-documented with libraries handling most complexity. Main work is configuration, hook usage, and error handling. Risk is low-medium because Auth0 configuration must be correct.

## Dependencies & Blockers

### Story Dependencies
- STORY-EPIC-1.1 must be complete (login/registration pages exist)
- Auth0 tenant must be configured (IT responsibility)
- Auth0 domain and client ID must be provided

### Blockers
- [ ] Auth0 not configured for EPAM SAML
- [ ] Auth0 credentials not yet provided to development team

## INVEST Validation Checklist

- [x] **Independent** - Story depends on STORY-1 being done, but can proceed in parallel once UI is ready
- [x] **Negotiable** - Error messages, loading states can be refined
- [x] **Valuable** - Users can now authenticate; core functionality is enabled
- [x] **Estimable** - Clear: "Integrate Auth0 into existing forms"
- [x] **Small** - Can be completed in 0.5-1 day once Auth0 is configured
- [x] **Testable** - Can test login with valid/invalid credentials; verify redirect

## Definition of Acceptance

- [ ] Auth0 is configured and working
- [ ] Login with valid EPAM credentials succeeds
- [ ] Login with invalid credentials shows error
- [ ] New user registration works via Auth0
- [ ] User is redirected to dashboard after successful auth
- [ ] Loading state displays during authentication
- [ ] No sensitive data in logs or console
- [ ] Tested in Chrome, Firefox, Safari

## Related Information

**Related Stories:**
- STORY-EPIC-1.1 (display pages - prerequisite)
- STORY-EPIC-1.3 (JWT token storage)

**Design Reference:**
[Auth0 Sign Up / Login Widget: https://auth0.com/docs/get-started/authentication-and-authorization-flow/authorization-code-flow]

**Documentation:**
- @auth0/auth0-react: https://github.com/auth0/auth0-react
- Auth0 React quick start: https://auth0.com/docs/quickstart/spa/react
