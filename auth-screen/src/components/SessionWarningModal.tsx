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
          Your session will expire in{' '}
          <span className="font-bold text-red-600">{minutesRemaining}</span> minute(s) due to
          inactivity.
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
        </div>
      </div>
    </div>
  );
};

export default SessionWarningModal;
