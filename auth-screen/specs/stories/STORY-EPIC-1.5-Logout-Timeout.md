# User Story: Implement Logout and Session Timeout

**Story ID:** STORY-EPIC-1.5  
**Epic:** EPIC-1  
**Sprint:** Backlog  
**Status:** Ready for Refinement  
**Persona:** Priya & Raj (All authenticated users)

## User Story

**As a** user of the app  
**I want** to be able to log out and have my session automatically expire after inactivity  
**so that** my account is secure and my data is protected if I leave my computer unattended

## Story Context

Users need a way to explicitly log out, and sessions should automatically timeout if inactive for too long. This story implements both logout functionality (user-initiated) and automatic session timeout (system-initiated). When either event occurs, user is logged out, token is cleared, and user is redirected to login page.

## Acceptance Criteria

### AC 1: User Can Click Logout Button
- **Given:** User is logged in and on the dashboard
- **When:** User clicks "Logout" or "Sign Out" button in navigation menu
- **Then:** User is logged out; session is cleared; user is redirected to login page

### AC 2: Logout Clears All Auth Data
- **Given:** User clicks logout
- **When:** Logout completes
- **Then:** JWT token is deleted from cookies; user state is cleared; local storage is cleared of user data

### AC 3: Session Timeout After 30 Minutes of Inactivity
- **Given:** User is logged in but inactive (no page interactions for 30 minutes)
- **When:** 30 minutes pass with no user activity
- **Then:** Session automatically expires; user is redirected to login page; message displays: "Your session expired due to inactivity. Please log in again."

### AC 4: Activity Resets Timeout Counter
- **Given:** User is logged in with active session timeout
- **When:** User performs any action (mouse move, keyboard input, click)
- **Then:** Timeout timer resets; new 30-minute inactivity period begins

### AC 5: User Is Warned Before Timeout
- **Given:** User has been inactive for 25 minutes (5 minutes before timeout)
- **When:** 5-minute warning threshold is reached
- **Then:** Modal/banner displays: "Your session will expire in 5 minutes due to inactivity. Click here to stay logged in." with "Extend Session" button

## Technical Notes

### Implementation Approach
- Create logout handler that calls Auth0's logout and clears local auth state
- Implement inactivity timer using JavaScript `setInterval` or library like `react-idle-timer`
- Track user activity (mouse move, keyboard, click events)
- Store last activity timestamp; compare with current time to determine inactivity
- Show warning modal at 5-minute mark; reset timer if user interacts
- Automatically logout if no interaction at 30-minute mark

### Files/Components Affected
- `src/components/Navbar.tsx` - Add logout button
- `src/hooks/useSessionTimeout.ts` - New custom hook for timeout logic
- `src/components/SessionWarningModal.tsx` - New warning modal component
- `src/context/AuthContext.ts` - Update logout handler
- `src/App.tsx` - Integrate session timeout hook

### Technology Stack
- `react-idle-timer` library (optional) or vanilla JavaScript event listeners
- React Context for session state
- Vanilla JavaScript for activity tracking

### Known Limitations
- Timeout is per-browser-tab (timer doesn't sync across multiple tabs)
- No "Remember Me" feature in MVP (always logout on timeout; can add in Phase 2)
- Warning modal can be dismissed but doesn't prevent timeout (user must actively click "Stay Logged In")

## Estimation & Effort

**Story Points:** 2  
**Estimated Days:** 0.5 - 1 day  
**Risk Level:** LOW

**Estimation Rationale:** Straightforward implementation using existing patterns. Logout is simple button handler. Session timeout uses standard JavaScript event listeners and timers. Low risk because requirements are clear and well-defined.

## Dependencies & Blockers

### Story Dependencies
- STORY-EPIC-1.2 must be complete (Auth0 integration with logout support)
- Navigation component must be ready (Navbar.tsx)

### Blockers
- [ ] None identified

## INVEST Validation Checklist

- [x] **Independent** - Depends on STORY-2, but can be developed in parallel once Auth0 is integrated
- [x] **Negotiable** - Timeout duration (30 min), warning time (5 min) can be adjusted
- [x] **Valuable** - Users can securely logout; sessions are secure from unwanted access if user steps away
- [x] **Estimable** - Clear scope: "Add logout button and implement 30-minute inactivity timeout"
- [x] **Small** - Can be completed in 0.5-1 day; uses standard patterns
- [x] **Testable** - Can simulate inactivity by manipulating time; verify timeout occurs; verify logout clears data

## Definition of Acceptance

- [ ] Logout button displays in navigation menu
- [ ] Clicking logout clears all auth data and redirects to login
- [ ] Session automatically times out after 30 minutes of inactivity
- [ ] User activity (mouse, keyboard) resets timeout timer
- [ ] Warning modal displays at 5-minute mark before timeout
- [ ] Modal "Extend Session" button resets timer
- [ ] Timeout modal redirects to login if user ignores warning
- [ ] Session timeout tested manually (simulating time passage)

## Related Information

**Related Stories:**
- STORY-EPIC-1.2 (Auth0 integration - prerequisite)
- STORY-EPIC-1.4 (RBAC)

**Design Reference:**
[Session Timeout Pattern: https://www.nngroup.com/articles/session-timeout/]

**Documentation:**
- react-idle-timer: https://github.com/SupremeTechnopriest/react-idle-timer
- Auth0 Logout: https://auth0.com/docs/logout
