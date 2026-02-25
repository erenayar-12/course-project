/**
 * IdeaStatusFilter Component (P1.1)
 * 
 * Single-select status filter dropdown for idea list.
 * Implements STORY-2.4 AC1: Filter ideas by status (All, Submitted, Under Review, etc.)
 * 
 * @component
 * @example
 * <IdeaStatusFilter 
 *   selectedStatus="UNDER_REVIEW"
 *   onChange={(status) => console.log(status)}
 * />
 */

import React from 'react';

export type IdeaStatus = 'ALL' | 'SUBMITTED' | 'UNDER_REVIEW' | 'NEEDS_REVISION' | 'APPROVED' | 'REJECTED';

interface IdeaStatusFilterProps {
  /** Currently selected status filter */
  selectedStatus: IdeaStatus;
  /** Callback fired when status selection changes */
  onChange: (status: IdeaStatus) => void;
  /** Enable/disable the filter control */
  disabled?: boolean;
}

/**
 * Status filter dropdown for filtering ideas (AC1)
 */
export const IdeaStatusFilter: React.FC<IdeaStatusFilterProps> = ({
  selectedStatus,
  onChange,
  disabled = false,
}) => {
  const statusOptions: { value: IdeaStatus; label: string }[] = [
    { value: 'ALL', label: 'All Statuses' },
    { value: 'SUBMITTED', label: 'Submitted' },
    { value: 'UNDER_REVIEW', label: 'Under Review' },
    { value: 'NEEDS_REVISION', label: 'Needs Revision' },
    { value: 'APPROVED', label: 'Approved' },
    { value: 'REJECTED', label: 'Rejected' },
  ];

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="status-filter" className="text-sm font-medium text-gray-700">
        Filter by Status
      </label>
      <select
        id="status-filter"
        value={selectedStatus}
        onChange={(e) => onChange(e.target.value as IdeaStatus)}
        disabled={disabled}
        data-testid="status-filter"
        className={`
          w-full px-3 py-2 border border-gray-300 rounded-lg 
          focus:ring-2 focus:ring-blue-500 focus:border-transparent
          transition-colors
          ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'bg-white'}
        `}
      >
        {statusOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
