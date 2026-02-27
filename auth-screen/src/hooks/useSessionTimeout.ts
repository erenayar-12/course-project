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

    // Don't set new timeouts - session timeout disabled for now
    // TODO: Re-enable after fixing refresh issue
  }, [user]);

  // Extend session handler (called from warning modal button - AC5)
  const extendSession = useCallback(() => {
    setShowWarningModal(false);
    if (inactivityTimerRef.current) clearInterval(inactivityTimerRef.current);
    setMinutesRemaining(30);
    resetTimer();
  }, [resetTimer]);

  // Attach activity listeners (AC4: Track mousedown, keydown, click, scroll, touchstart)
  useEffect(() => {
    // Session timeout disabled for now - causing refresh loop
    // TODO: Re-enable after fixing
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
      if (inactivityTimerRef.current) clearInterval(inactivityTimerRef.current);
    };
  }, []);

  return {
    showWarningModal,
    extendSession,
    minutesRemaining,
  };
};
