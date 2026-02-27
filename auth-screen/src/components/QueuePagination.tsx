/**
 * QueuePagination Component (STORY-3.1)
 * 
 * Displays pagination controls for evaluation queue:
 * - Previous/Next buttons with disabled states
 * - Current page and total count display
 * - Page size selector (10, 25, 50 items)
 * - Persists page size to localStorage
 */

import React, { useEffect, useState } from 'react';

interface QueuePaginationProps {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

const PAGE_SIZES = [10, 25, 50];

export const QueuePagination: React.FC<QueuePaginationProps> = ({
  currentPage,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
}) => {
  const [selectedPageSize, setSelectedPageSize] = useState<number>(pageSize);

  const totalPages = Math.ceil(totalCount / selectedPageSize);
  const startIndex = (currentPage - 1) * selectedPageSize + 1;
  const endIndex = Math.min(currentPage * selectedPageSize, totalCount);

  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  // Handle page size change
  const handlePageSizeChange = (newSize: number) => {
    setSelectedPageSize(newSize);
    localStorage.setItem('evaluationQueue_pageSize', String(newSize));
    onPageSizeChange(newSize);
    onPageChange(1); // Reset to page 1
  };

  return (
    <div className="flex flex-col gap-4 items-center justify-between py-4 px-4 bg-gray-50 border-t border-gray-200">
      {/* Info Text */}
      <div className="text-sm text-gray-600">
        Showing <span className="font-semibold">{startIndex}</span>
        {' '}-{' '}
        <span className="font-semibold">{endIndex}</span>
        {' '}of{' '}
        <span className="font-semibold">{totalCount}</span>
        {' '}ideas
      </div>

      {/* Controls */}
      <div className="flex items-center gap-6">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canGoPrev}
          className="px-4 py-2 bg-indigo-600 text-white rounded font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors"
          aria-label="Previous page"
        >
          Previous
        </button>

        {/* Page Indicator */}
        <span className="text-sm text-gray-700 font-semibold">
          Page <span className="text-indigo-600">{currentPage}</span> of <span className="text-indigo-600">{totalPages || 1}</span>
        </span>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canGoNext}
          className="px-4 py-2 bg-indigo-600 text-white rounded font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors"
          aria-label="Next page"
        >
          Next
        </button>

        {/* Page Size Selector */}
        <div className="flex items-center gap-2">
          <label htmlFor="page-size" className="text-sm text-gray-600 font-medium">
            Items per page:
          </label>
          <select
            id="page-size"
            value={selectedPageSize}
            onChange={(e) => handlePageSizeChange(parseInt(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring focus:ring-indigo-500"
          >
            {PAGE_SIZES.map(size => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
