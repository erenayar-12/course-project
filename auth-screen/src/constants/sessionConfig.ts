/**
 * Session Timeout Configuration
 *
 * Per STORY-EPIC-1.5 specifications
 * Defines session duration, warning threshold, activity events, and messages
 */

// Session duration before auto-logout (milliseconds)
export const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

// Time before timeout to show warning (milliseconds)
export const WARNING_THRESHOLD_MS = 25 * 60 * 1000; // 5 min before timeout

// User activity events to track for inactivity
export const ACTIVITY_EVENTS = ['mousedown', 'keydown', 'click', 'scroll', 'touchstart'] as const;

// Session-related message strings
export const SESSION_MESSAGES = {
  WARNING:
    'Your session will expire in 5 minutes due to inactivity. Click "Extend Session" to continue.',
  EXPIRED: 'Your session expired due to inactivity. Please log in again.',
  EXTENDED: 'Session extended. Welcome back!',
} as const;
