/**
 * StatusBadge Component
 * 
 * Displays a color-coded status badge for idea statuses.
 * Implements AC4: Status badges with color mapping
 * - DRAFT: Yellow
 * - SUBMITTED: Blue
 * - UNDER_REVIEW: Orange
 * - APPROVED: Green
 * - REJECTED: Red
 * 
 * @component
 * @example
 * <StatusBadge status="APPROVED" />
 */

import React from 'react';

interface StatusBadgeProps {
  status: 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
}

/**
 * Get color classes for status badge
 * @param status - The idea status
 * @returns Object with background and text color classes
 */
function getStatusColorClasses(status: StatusBadgeProps['status']): { bg: string; text: string } {
  const colorMap = {
    DRAFT: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
    SUBMITTED: { bg: 'bg-blue-100', text: 'text-blue-800' },
    UNDER_REVIEW: { bg: 'bg-orange-100', text: 'text-orange-800' },
    APPROVED: { bg: 'bg-green-100', text: 'text-green-800' },
    REJECTED: { bg: 'bg-red-100', text: 'text-red-800' },
  };
  return colorMap[status];
}

/**
 * Format status text for display
 * @param status - The idea status
 * @returns Formatted status string
 */
function formatStatusText(status: StatusBadgeProps['status']): string {
  const statusMap = {
    DRAFT: 'Draft',
    SUBMITTED: 'Submitted',
    UNDER_REVIEW: 'Under Review',
    APPROVED: 'Approved',
    REJECTED: 'Rejected',
  };
  return statusMap[status];
}

/**
 * Renders a color-coded status badge
 * @param status - The idea status to display
 * @returns Color-coded badge component
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const colors = getStatusColorClasses(status);
  const displayText = formatStatusText(status);

  return (
    <span
      data-testid="status-badge"
      role="status"
      className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${colors.bg} ${colors.text}`}
    >
      {displayText}
    </span>
  );
};
