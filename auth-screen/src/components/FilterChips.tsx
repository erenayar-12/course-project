/**
 * FilterChips Component (P1.3)
 * 
 * Displays active filter and sort selections as removable chips.
 * Implements STORY-2.4 AC6: Show active filters/sort as chips with remove buttons
 * 
 * @component
 * @example
 * <FilterChips
 *   activeStatus="SUBMITTED"
 *   activeSortBy="title"
 *   onRemoveStatus={() => console.log('remove status')}
 *   onRemoveSort={() => console.log('remove sort')}
 * />
 */

import React from 'react';
import { IdeaStatus } from './IdeaStatusFilter';
import { SortBy, SortOrder } from './IdeaSortDropdown';

interface FilterChipsProps {
  /** Currently active status filter (undefined if 'ALL') */
  activeStatus?: Exclude<IdeaStatus, 'ALL'>;
  /** Currently active sort field */
  activeSortBy?: SortBy;
  /** Currently active sort order */
  activeSortOrder?: SortOrder;
  /** Callback to remove status filter */
  onRemoveStatus?: () => void;
  /** Callback to remove sort */
  onRemoveSort?: () => void;
  /** Callback for clear all button */
  onClearAll?: () => void;
}

/**
 * Display active filters and sort as removable chips (AC6)
 */
export const FilterChips: React.FC<FilterChipsProps> = ({
  activeStatus,
  activeSortBy,
  activeSortOrder,
  onRemoveStatus,
  onRemoveSort,
  onClearAll,
}) => {
  // Convert status to display label
  const getStatusLabel = (status: string): string => {
    const labelMap: Record<string, string> = {
      SUBMITTED: 'Submitted',
      UNDER_REVIEW: 'Under Review',
      NEEDS_REVISION: 'Needs Revision',
      APPROVED: 'Approved',
      REJECTED: 'Rejected',
    };
    return labelMap[status] || status;
  };

  // Convert sort to display label
  const getSortLabel = (sortBy: SortBy, sortOrder: SortOrder): string => {
    if (sortBy === 'createdAt') {
      return sortOrder === 'DESC' ? 'Newest First' : 'Oldest First';
    }
    return sortOrder === 'ASC' ? 'Title (A-Z)' : 'Title (Z-A)';
  };

  const hasActiveFilters = activeStatus || activeSortBy;

  if (!hasActiveFilters) {
    return null;
  }

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      {/* Status Filter Chip */}
      {activeStatus && (
        <div
          className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
          data-testid="status-chip"
        >
          <span>{getStatusLabel(activeStatus)}</span>
          <button
            onClick={onRemoveStatus}
            className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-blue-200 transition-colors"
            aria-label={`Remove ${getStatusLabel(activeStatus)} filter`}
            type="button"
          >
            ✕
          </button>
        </div>
      )}

      {/* Sort Chip */}
      {activeSortBy && activeSortOrder && (
        <div
          className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
          data-testid="sort-chip"
        >
          <span>{getSortLabel(activeSortBy, activeSortOrder)}</span>
          <button
            onClick={onRemoveSort}
            className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-purple-200 transition-colors"
            aria-label="Remove sort"
            type="button"
          >
            ✕
          </button>
        </div>
      )}

      {/* Clear All Button */}
      {hasActiveFilters && onClearAll && (
        <button
          onClick={onClearAll}
          className="ml-2 text-sm text-red-600 hover:text-red-800 underline transition-colors font-medium"
          data-testid="clear-all-button"
          type="button"
        >
          Clear All
        </button>
      )}
    </div>
  );
};
