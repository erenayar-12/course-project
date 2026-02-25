/**
 * EmptyResultsState Component (P1.4)
 * 
 * Displays friendly message when no ideas match filter/sort criteria.
 * Implements STORY-2.4 AC11: Show empty state with CTA to clear filters
 * 
 * @component
 * @example
 * <EmptyResultsState
 *   hasFilters={true}
 *   onClearFilters={() => console.log('clear')}
 * />
 */

import React from 'react';

interface EmptyResultsStateProps {
  /** Whether filters/sort are currently active */
  hasFilters?: boolean;
  /** Callback to clear filters and reset view */
  onClearFilters?: () => void;
}

/**
 * Empty state for filtered results (AC11)
 */
export const EmptyResultsState: React.FC<EmptyResultsStateProps> = ({
  hasFilters = false,
  onClearFilters,
}) => {
  return (
    <div
      className="flex flex-col items-center justify-center py-12 px-4"
      data-testid="empty-results-state"
    >
      <div className="text-6xl mb-4">🔍</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {hasFilters ? 'No ideas match your filters' : 'No ideas yet'}
      </h3>
      <p className="text-gray-600 text-center mb-6 max-w-sm">
        {hasFilters
          ? 'Try adjusting your filters or sorting to find what you need.'
          : 'Start by submitting your first idea to see it appear here.'}
      </p>
      {hasFilters && onClearFilters && (
        <button
          onClick={onClearFilters}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          data-testid="clear-filters-cta"
          type="button"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
};
