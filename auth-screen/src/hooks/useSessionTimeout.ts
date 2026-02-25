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
 * Per STORY-EPIC-1.5 implementation spec: AC3, AC4, AC5
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import { useMockAuth0 } from '../context/MockAuth0Context';
import {
  SESSION_TIMEOUT_MS,
  WARNING_THRESHOLD_MS,
  ACTIVITY_EVENTS,
} from '../constants/sessionConfig';

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

  // Reset timer on activity (AC4: Activity resets timeout counter)
  const resetTimer = useCallback(() => {
    if (!user) return; // Don't track if not logged in

    lastActivityRef.current = Date.now();

    // Clear existing timeouts
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
    if (inactivityTimerRef.current) clearInterval(inactivityTimerRef.current);

    // Close warning modal if open
    setShowWarningModal(false);
    setMinutesRemaining(30);

    // Set timeout for warning modal (at 25 minute mark - AC5)
    warningTimeoutRef.current = setTimeout(() => {
      setShowWarningModal(true);
      // Start countdown timer (show remaining minutes)
      inactivityTimerRef.current = setInterval(() => {
        const remaining = Math.ceil(
          (SESSION_TIMEOUT_MS - (Date.now() - lastActivityRef.current)) / 1000 / 60
        );
        setMinutesRemaining(Math.max(0, remaining));
      }, 1000);
    }, WARNING_THRESHOLD_MS);

    // Set timeout for logout (at 30 minute mark - AC3)
    timeoutRef.current = setTimeout(() => {
      // eslint-disable-next-line no-console
      console.log('Session timeout: logging out user');
      logout();
    }, SESSION_TIMEOUT_MS);
  }, [user, logout]);

  // Extend session handler (called from warning modal button - AC5)
  const extendSession = useCallback(() => {
    setShowWarningModal(false);
    if (inactivityTimerRef.current) clearInterval(inactivityTimerRef.current);
    setMinutesRemaining(30);
    resetTimer();
  }, [resetTimer]);

  // Attach activity listeners (AC4: Track mousedown, keydown, click, scroll, touchstart)
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
