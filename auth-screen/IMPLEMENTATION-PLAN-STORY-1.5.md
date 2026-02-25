# Implementation Plan: Story 1.5 - Logout & Session Timeout

**Document ID:** STORY-1.5-IMPL-PLAN  
**Date Created:** February 25, 2026  
**Status:** READY FOR IMPLEMENTATION  
**Reference Spec:** `specs/stories/STORY-EPIC-1.5-Logout-Timeout.md`  
**Convention:** Per `agents.md` Section 10

---

## 1. Overview

Implement user-initiated logout and automatic session timeout after 30 minutes of inactivity with a 5-minute warning modal. This story completes the Phase 1 Authentication epic (Stories 1.1-1.5).

**Story Points:** 2  
**Estimated Time:** 0.5-1 day  
**Priority:** HIGH (last AUTH story before Phase 2)

---

## 2. Acceptance Criteria Breakdown

### AC 1: User Can Click Logout Button
```gherkin
Given: User is logged in and viewing any page
When: User clicks "Logout" button in navigation
Then: User is logged out and redirected to /login
And: Session cleared (localStorage, context)
And: Message displayed: "You have been logged out"
```

**Implementation Points:**
- [ ] Add Logout button to Navbar component
- [ ] Bind logout handler from MockAuth0Context
- [ ] Verify redirect to /login works
- [ ] Test with all 3 roles (submitter, evaluator, admin)

---

### AC 2: Logout Clears All Auth Data
```gherkin
Given: User is logged in with active session
When: logout() method is called
Then: JWT token is removed from localStorage
And: User context is set to null
And: All auth headers/cookies cleared
```

**Implementation Points:**
- [ ] Update `MockAuth0Context.logout()` method
- [ ] Clear localStorage keys: `auth_user`, `auth_token`
- [ ] Reset React Context state to null
- [ ] Test logout() doesn't throw errors
- [ ] Verify subsequent API calls fail (will add in Phase 2)

---

### AC 3: Session Timeout After 30 Minutes
```gherkin
Given: User is logged in and inactive
When: 30 minutes pass with no user interaction
Then: Session automatically expires
And: User automatically redirected to /login
And: Message shown: "Session expired due to inactivity. Please login again."
```

**Implementation Points:**
- [ ] Create timeout timer: 30 * 60 * 1000 ms
- [ ] Trigger automatic logout at 30-minute mark
- [ ] Display session-expired toast/redirect
- [ ] Test with mocked time (jest.useFakeTimers)
- [ ] Verify timer doesn't fire if user is active

---

### AC 4: Activity Resets Timeout Counter
```gherkin
Given: Inactivity timer is running (e.g., 10 min elapsed)
When: User performs action (mouse move, click, keyboard)
Then: Timer resets to 0
And: New 30-minute countdown begins
```

**Implementation Points:**
- [ ] Attach event listeners: mousedown, keydown, click, scroll, touchstart
- [ ] Call resetTimer() on any activity
- [ ] Verify listeners work across all pages
- [ ] Clear event listeners on component unmount (memory leak prevention)
- [ ] Test multiple rapid activities don't break timer

---

### AC 5: User Warned Before Timeout (5-Minute Warning)
```gherkin
Given: 25 minutes have passed (5 min before timeout)
When: 25-minute threshold reached
Then: Modal appears with message: "Your session will expire in 5 minutes"
And: Modal has "Extend Session" button
And: Modal warning closes if user clicks button
```

**Implementation Points:**
- [ ] Create SessionWarningModal component
- [ ] Show modal at 25-minute mark (SESSION_TIMEOUT - 5 min)
- [ ] "Extend Session" button calls resetTimer()
- [ ] Modal styling: centered, semi-transparent overlay
- [ ] Close button dismisses modal (but doesn't prevent timeout)
- [ ] Test modal timing with jest.useFakeTimers

---

## 3. Technical Specification

### Architecture Diagram
```
App.tsx
  ├─ MockAuth0Provider (auth state)
  ├─ useSessionTimeout (hook)
  │  ├─ Tracks activity events
  │  ├─ Maintains inactivity timer
  │  ├─ Shows warning modal
  │  └─ Auto-logout on timeout
  ├─ Navbar.tsx
  │  └─ Logout button (calls context.logout())
  └─ SessionWarningModal.tsx
     └─ Warning display + Extend Session button
```

### File Structure
```
src/
├── hooks/
│   └── useSessionTimeout.ts           [NEW]
├── components/
│   ├── Navbar.tsx                     [MODIFY]
│   └── SessionWarningModal.tsx        [NEW]
├── constants/
│   └── sessionConfig.ts               [NEW]
├── context/
│   └── MockAuth0Context.tsx           [MODIFY - logout handler]
└── App.tsx                            [MODIFY - integrate hook]
```

### New Files to Create

#### `src/constants/sessionConfig.ts`
```typescript
/**
 * Session Timeout Configuration
 * Per STORY-EPIC-1.5 specifications
 */

// Session duration before auto-logout (milliseconds)
export const SESSION_TIMEOUT_MS = 30 * 60 * 1000;  // 30 minutes

// Time before timeout to show warning (milliseconds)
export const WARNING_THRESHOLD_MS = 25 * 60 * 1000; // 5 min before timeout

// User activity events to track
export const ACTIVITY_EVENTS = [
  'mousedown',
  'keydown',
  'click',
  'scroll',
  'touchstart',
] as const;

// Warning modal messages
export const SESSION_MESSAGES = {
  WARNING: 'Your session will expire in 5 minutes due to inactivity. Click "Extend Session" to continue.',
  EXPIRED: 'Your session expired due to inactivity. Please log in again.',
  EXTENDED: 'Session extended. Welcome back!',
} as const;
```

#### `src/hooks/useSessionTimeout.ts`
```typescript
/**
 * useSessionTimeout Hook
 * 
 * Manages session inactivity timeout and warning modal.
 * - Tracks user activity (mouse, keyboard, touch)
 * - Maintains 30-minute inactivity timer
 * - Shows 5-minute warning before timeout
 * - Auto-logs out user on timeout
 * - Resets timer on any activity
 * 
 * Per STORY-EPIC-1.5 implementation spec
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import { useMockAuth0 } from '../context/MockAuth0Context';
import { SESSION_TIMEOUT_MS, WARNING_THRESHOLD_MS, ACTIVITY_EVENTS } from '../constants/sessionConfig';

interface UseSessionTimeoutReturn {
  showWarningModal: boolean;
  extendSession: () => void;
  minutesRemaining: number;
}

export const useSessionTimeout = (): UseSessionTimeoutReturn => {
  const { logout, user } = useMockAuth0();
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [minutesRemaining, setMinutesRemaining] = useState(30);
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  // Reset timer on activity
  const resetTimer = useCallback(() => {
    if (!user) return; // Don't track if not logged in

    lastActivityRef.current = Date.now();

    // Clear existing timeouts
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
    if (inactivityTimerRef.current) clearInterval(inactivityTimerRef.current);

    // Close warning modal if open
    setShowWarningModal(false);

    // Set timeout for warning modal (at 25 minute mark)
    warningTimeoutRef.current = setTimeout(() => {
      setShowWarningModal(true);
      // Start countdown timer (show remaining minutes)
      inactivityTimerRef.current = setInterval(() => {
        const remaining = Math.ceil((SESSION_TIMEOUT_MS - (Date.now() - lastActivityRef.current)) / 1000 / 60);
        setMinutesRemaining(Math.max(0, remaining));
      }, 1000);
    }, WARNING_THRESHOLD_MS);

    // Set timeout for logout (at 30 minute mark)
    timeoutRef.current = setTimeout(() => {
      // eslint-disable-next-line no-console
      console.log('Session timeout: logging out user');
      logout();
    }, SESSION_TIMEOUT_MS);
  }, [user, logout]);

  // Extend session handler (called from warning modal button)
  const extendSession = useCallback(() => {
    setShowWarningModal(false);
    if (inactivityTimerRef.current) clearInterval(inactivityTimerRef.current);
    setMinutesRemaining(30);
    resetTimer();
  }, [resetTimer]);

  // Attach activity listeners
  useEffect(() => {
    if (!user) return; // Don't track if not logged in

    // Initial timer setup
    resetTimer();

    // Add event listeners for activity
    ACTIVITY_EVENTS.forEach((eventName) => {
      window.addEventListener(eventName, resetTimer);
    });

    // Cleanup
    return () => {
      ACTIVITY_EVENTS.forEach((eventName) => {
        window.removeEventListener(eventName, resetTimer);
      });

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
      if (inactivityTimerRef.current) clearInterval(inactivityTimerRef.current);
    };
  }, [user, resetTimer]);

  return {
    showWarningModal,
    extendSession,
    minutesRemaining,
  };
};
```

#### `src/components/SessionWarningModal.tsx`
```typescript
/**
 * SessionWarningModal Component
 * 
 * Displays 5-minute warning before session timeout.
 * User can click "Extend Session" to reset inactivity timer.
 * 
 * Per STORY-EPIC-1.5 AC 5 specification
 */

import React from 'react';

interface SessionWarningModalProps {
  isOpen: boolean;
  minutesRemaining: number;
  onExtendSession: () => void;
}

export const SessionWarningModal: React.FC<SessionWarningModalProps> = ({
  isOpen,
  minutesRemaining,
  onExtendSession,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        {/* Header */}
        <h2 className="text-xl font-bold text-red-600 mb-4">Session Timeout Warning</h2>

        {/* Message */}
        <p className="text-gray-700 mb-4">
          Your session will expire in <span className="font-bold text-red-600">{minutesRemaining}</span> minute(s)
          due to inactivity.
        </p>

        {/* Subtext */}
        <p className="text-sm text-gray-500 mb-6">
          Click "Extend Session" to continue working, or you will be logged out automatically.
        </p>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onExtendSession}
            className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            aria-label="Extend session and stay logged in"
          >
            Extend Session
          </button>
          <button
            onClick={() => {
              /* Modal will close naturally on logout */
            }}
            className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            aria-label="Logout now"
          >
            Logout Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionWarningModal;
```

### Modified Files

#### `src/context/MockAuth0Context.tsx` - Update logout method
```typescript
// Add to existing MockAuth0Provider...

export const logout = async (): Promise<void> => {
  // Clear auth state
  setUser(null);
  
  // Clear localStorage
  localStorage.removeItem('auth_user');
  localStorage.removeItem('auth_token');
  
  // Clear sessionStorage if used
  sessionStorage.removeItem('auth_user');
  
  // Redirect to login (with optional message)
  const returnTo = `${window.location.origin}/login?logout=true`;
  window.location.href = returnTo;
};
```

#### `src/components/Navbar.tsx` - Add Logout button
```typescript
// In existing Navbar component, add:

import { useMockAuth0 } from '../context/MockAuth0Context';

// Inside component:
const { logout, user } = useMockAuth0();

// In JSX, add logout button:
{user && (
  <button
    onClick={() => logout()}
    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
    aria-label="Logout"
  >
    Logout
  </button>
)}
```

#### `src/App.tsx` - Integrate useSessionTimeout hook
```typescript
// Add import
import { useSessionTimeout } from './hooks/useSessionTimeout';
import SessionWarningModal from './components/SessionWarningModal';

// In App component, inside MockAuth0Provider:
const AppContent: React.FC = () => {
  const { showWarningModal, extendSession, minutesRemaining } = useSessionTimeout();

  return (
    <>
      <SessionWarningModal 
        isOpen={showWarningModal}
        minutesRemaining={minutesRemaining}
        onExtendSession={extendSession}
      />
      <AppRoutes />
    </>
  );
};
```

---

## 4. Implementation Steps (Phase Breakdown)

### Phase 1: Setup (15 minutes)
- [ ] Create branch: `git checkout -b feature/story-1.5-logout-timeout`
- [ ] Create `src/constants/sessionConfig.ts`
- [ ] Create `src/hooks/useSessionTimeout.ts` (stub)
- [ ] Create `src/components/SessionWarningModal.tsx` (stub)

### Phase 2: Hook Implementation (20 minutes)
- [ ] Implement `useSessionTimeout` hook with all logic
- [ ] Add event listeners (mousedown, keydown, click, scroll, touchstart)
- [ ] Implement inactivity timer (30 min)
- [ ] Implement warning timer (25 min)
- [ ] Implement resetTimer callback
- [ ] Test hook logic in isolation

### Phase 3: Component Implementation (15 minutes)
- [ ] Implement `SessionWarningModal` component
- [ ] Style modal (centered, accessible)
- [ ] Add "Extend Session" button
- [ ] Add "Logout Now" button
- [ ] Test modal displays correctly

### Phase 4: Integration (15 minutes)
- [ ] Update `MockAuth0Context.logout()` method
- [ ] Add Logout button to `Navbar.tsx`
- [ ] Integrate `useSessionTimeout` hook in `App.tsx`
- [ ] Display `SessionWarningModal` in App
- [ ] Test full flow: login → inactivity → warning → logout

### Phase 5: Testing (15 minutes)
- [ ] Write unit tests for `useSessionTimeout` hook
- [ ] Write integration tests for logout flow
- [ ] Mock timers (jest.useFakeTimers)
- [ ] Test all 5 acceptance criteria
- [ ] Verify 80% coverage maintained

---

## 5. Testing Strategy

### Unit Tests: `src/hooks/__tests__/useSessionTimeout.test.ts`
```typescript
describe('useSessionTimeout Hook', () => {
  describe('AC1: Logout button clears auth', () => {
    it('should call logout on timeout', () => {
      // Mock jest.useFakeTimers
      // Render hook with logged-in user
      // Advance timers 30 minutes
      // Verify logout called
    });
  });

  describe('AC3: 30-minute timeout', () => {
    it('should timeout after 30 minutes of inactivity', () => {
      // Setup fake timers
      // Render hook
      // Advance time 30 minutes
      // Verify logout triggered
    });
  });

  describe('AC4: Activity resets timer', () => {
    it('should reset timer on mouse activity', () => {
      // Setup timer
      // Advance 10 minutes
      // Trigger mousedown event
      // Advance 25 minutes (total 35 min, but timer reset)
      // Verify logout NOT called (timer reset at 10 min)
    });
  });

  describe('AC5: Warning modal shows', () => {
    it('should show warning modal at 25-minute mark', () => {
      // Setup fake timers
      // Advance 25 minutes
      // Verify showWarningModal = true
      // Verify minutesRemaining = 5
    });

    it('should reset timer on "Extend Session" click', () => {
      // Show modal (at 25 min)
      // Click extendSession button
      // Verify timer resets
      // Verify minutesRemaining = 30
    });
  });
});
```

### Integration Tests: `src/__tests__/logout-flow.test.tsx`
```typescript
describe('Logout & Session Timeout Flow', () => {
  it('should logout when user clicks logout button', async () => {
    // Render App with logged-in user
    // Find and click Logout button
    // Verify redirected to /login
    // Verify auth cleared
  });

  it('should show warning modal before timeout', async () => {
    // Render App
    // Mock time: advance 25 minutes
    // Verify modal appears
    // Verify "Extend Session" button visible
  });

  it('should auto-logout without interaction', async () => {
    // Render App
    // Mock time: advance 30 minutes (no activity)
    // Verify logout called
    // Verify redirected to /login
  });
});
```

---

## 6. Acceptance Criteria Validation Checklist

- [ ] **AC1:** Logout button displays in Navbar
- [ ] **AC1:** Logout redirects to /login
- [ ] **AC2:** logout() clears localStorage (auth_user, auth_token)
- [ ] **AC2:** logout() clears React Context (user = null)
- [ ] **AC3:** Auto-logout occurs at 30-minute mark
- [ ] **AC3:** "Session expired" message displayed
- [ ] **AC4:** mousedown event resets timer
- [ ] **AC4:** keydown event resets timer
- [ ] **AC4:** click event resets timer
- [ ] **AC4:** scroll event resets timer
- [ ] **AC4:** touchstart event resets timer
- [ ] **AC5:** Warning modal displays at 25-minute mark
- [ ] **AC5:** Modal shows "5 minutes remaining"
- [ ] **AC5:** "Extend Session" button resets timer
- [ ] **AC5:** Modal closes after "Extend Session" clicked
- [ ] **All:** Tests passing (15+ test cases)
- [ ] **All:** ESLint compliant (0 errors)
- [ ] **All:** Prettier formatted
- [ ] **All:** TypeScript strict mode OK

---

## 7. Dependencies & Prerequisites

### Code Dependencies
- ✅ STORY-1.2: Auth0 integration (logout support) - DONE
- ✅ STORY-1.4: RBAC system - DONE
- ✅ React 18 + TypeScript - DONE
- ✅ MockAuth0Context - DONE

### Development Tools
- ✅ Jest (testing)
- ✅ React Testing Library
- ✅ ESLint + Prettier
- ✅ Tailwind CSS (styling)

### No External Blockers
- All prerequisites completed
- Ready to implement immediately

---

## 8. Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| Timer issues (not firing) | LOW | MEDIUM | Mock time in tests; verify with console logs |
| Event listener memory leaks | LOW | MEDIUM | Proper cleanup in useEffect return |
| Modal styling issues | LOW | LOW | Use Tailwind defaults; test responsiveness |
| Cross-tab sync not working | LOW | LOW | Documented limitation; note in AC comments |
| Timer reset not working | LOW | MEDIUM | Unit test each activity event separately |

---

## 9. Definition of Done

✅ Story 1.5 is DONE when:

1. **Code Complete**
   - [ ] All 5 files created/modified (per Section 3)
   - [ ] 0 ESLint errors
   - [ ] Prettier formatting applied
   - [ ] TypeScript strict mode passes

2. **Tests Passing**
   - [ ] 15+ total tests (existing + new)
   - [ ] All test suites PASS
   - [ ] Coverage maintained >49%

3. **Acceptance Criteria Met**
   - [ ] All 5 AC validated (manual + automated)
   - [ ] Logout button works
   - [ ] Timer works (30 min)
   - [ ] Warning shows (25 min)
   - [ ] Activity resets timer

4. **Documentation**
   - [ ] JSDoc comments on all functions
   - [ ] Inline comments for complex logic
   - [ ] This implementation plan completed
   - [ ] Spec reference added to code

5. **Git Status**
   - [ ] All changes committed
   - [ ] PR created with description
   - [ ] Code review passed
   - [ ] Merged to main branch

---

## 10. Success Metrics

**Quantitative:**
- ✅ 5/5 acceptance criteria met
- ✅ 15/15 tests passing
- ✅ 0 ESLint violations
- ✅ 0 compilation errors

**Qualitative:**
- ✅ Code is clean and maintainable
- ✅ Implementation follows agents.md conventions
- ✅ Users understand session timeout behavior
- ✅ Security improved (auto-logout on inactivity)

---

## 11. Commands Reference

```bash
# Create feature branch
git checkout -b feature/story-1.5-logout-timeout

# Create files (stubs)
touch src/constants/sessionConfig.ts
touch src/hooks/useSessionTimeout.ts
touch src/components/SessionWarningModal.tsx

# Run tests
npm run test:unit -- --watch

# Check linting
npm run lint

# Format code
npm run format

# Run with dev server
npm run dev

# After completion, commit
git add -A
git commit -m "feat: Story 1.5 - Logout & Session Timeout

- Implement useSessionTimeout hook (AC3, AC4)
- Add SessionWarningModal component (AC5)
- Update logout handler (AC2)
- Add logout button to Navbar (AC1)
- All acceptance criteria met
- Tests passing (15/15)
- Per agents.md Section 10 spec"

git push origin feature/story-1.5-logout-timeout
```

---

## 12. Timeline

| Task | Duration | Status |
|------|----------|--------|
| Setup files | 15 min | ⏳ TODO |
| Implement hook | 20 min | ⏳ TODO |
| Implement modal | 15 min | ⏳ TODO |
| Integration | 15 min | ⏳ TODO |
| Testing | 15 min | ⏳ TODO |
| **Total** | **80 min** | ⏳ TODO |

**Estimated Completion:** Within 1 day ✅

---

## 13. Communication

**Stakeholder Update:**
- Story 1.5 is specified and ready for implementation
- Follows all agents.md conventions (Section 10)
- Estimated 1 day to complete
- Ready to start immediately upon approval

**Next Story After 1.5:**
- Story WF-epic-1: Workflow State Machine (Phase 1, Week 3)
- Requires backend setup (Express + PostgreSQL)

---

**Document Created:** February 25, 2026  
**Convention Reference:** `agents.md` Sections 3-10  
**Spec Reference:** `specs/stories/STORY-EPIC-1.5-Logout-Timeout.md`  
**Status:** ✅ READY FOR IMPLEMENTATION
