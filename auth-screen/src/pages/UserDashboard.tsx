/**
 * UserDashboard Component (My Ideas Dashboard)
 * 
 * Main dashboard component for viewing user's submitted ideas.
 * Implements STORY-2.3a acceptance criteria:
 * - AC1: Display authenticated user's ideas in paginated list
 * - AC2: Show title, status, category, submission date, attachment count per item
 * - AC3: Empty state with CTA button
 * - AC5: Pagination with sort by createdAt DESC (most recent first)
 * - AC6: Display statistics with counts and percentages
 * - AC7: Click row to navigate to /ideas/:ideaId
 * - AC8: Loading state during fetch
 * - AC9: Error state with retry
 * - AC10: Responsive across devices
 * 
 * @component
 * @example
 * <UserDashboard />
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { IdeaListItem } from '../components/IdeaListItem';
import { IdeaStatsBar } from '../components/IdeaStatsBar';
import { IdeaStatusFilter, type IdeaStatus } from '../components/IdeaStatusFilter';
import { IdeaSortDropdown, type SortBy, type SortOrder } from '../components/IdeaSortDropdown';
import { FilterChips } from '../components/FilterChips';
import { EmptyResultsState } from '../components/EmptyResultsState';
import { FilterDrawer } from '../components/FilterDrawer';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { useIdeasLoading } from '../hooks/useIdeasLoading';
import {
  calculatePaginatedIdeas,
  calculateDashboardStatistics,
  calculatePaginationState,
  type PaginationState,
  type DashboardStatistics,
} from '../utils/dashboardUtils';
import { applyFiltersAndSort } from '../utils/filterSortUtils';

interface Idea {
  id: string;
  title: string;
  status: 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
  category: string;
  createdAt: string;
  attachmentCount: number;
}

const ITEMS_PER_PAGE = 10;

/**
 * User dashboard for viewing personal ideas
 * @returns Dashboard component with ideas list and pagination
 */
export const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // State for ideas data
  const [allIdeas, setAllIdeas] = useState<Idea[]>([]);
  const [sortedAndPaginatedIdeas, setSortedAndPaginatedIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationState, setPaginationState] = useState<PaginationState | null>(null);
  const [stats, setStats] = useState<DashboardStatistics | null>(null);

  // State for filters/sort from URL parameters
  const [selectedStatus, setSelectedStatus] = useState<IdeaStatus>(() => {
    const status = searchParams.get('status') as IdeaStatus | null;
    return status || 'ALL';
  });
  const [sortBy, setSortBy] = useState<SortBy>(() => {
    return (searchParams.get('sortBy') as SortBy) || 'createdAt';
  });
  const [sortOrder, setSortOrder] = useState<SortOrder>(() => {
    return (searchParams.get('sortOrder') as SortOrder) || 'DESC';
  });

  // State for mobile drawer
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Loading state management (AC10)
  const { isLoading: showSkeletonLoader, showLoadingMessage } = useIdeasLoading({
    timeout: 1000,
  });

  /**
   * Fetch user's ideas from API
   */
  const fetchIdeas = async () => {
    try {
      setLoading(true);
      setError(null);

      // AC8: Loading state
      const response = await fetch('/api/ideas?limit=1000&offset=0', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch ideas: ${response.statusText}`);
      }

      const data = await response.json();
      const ideas = data.ideas || [];

      // Store raw ideas (filtering/sorting applied in useEffect)
      setAllIdeas(ideas);

      // AC6: Calculate statistics
      const calculatedStats = calculateDashboardStatistics(ideas);
      setStats(calculatedStats);

      // Update pagination for page 1
      setCurrentPage(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load ideas');
      setAllIdeas([]);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update pagination and sliced ideas when page changes or ideas load
   */
  useEffect(() => {
    if (allIdeas.length === 0) {
      setSortedAndPaginatedIdeas([]);
      setPaginationState(null);
      setFilterLoading(false);
      return;
    }

    // Apply filters and sort to all ideas
    const status = selectedStatus === 'ALL' ? undefined : (selectedStatus as Exclude<IdeaStatus, 'ALL'>);
    const filtered = applyFiltersAndSort(allIdeas, status, sortBy, sortOrder);

    // Calculate pagination state based on filtered results
    const pagination = calculatePaginationState(filtered.length, currentPage, ITEMS_PER_PAGE);
    setPaginationState(pagination);

    // Get paginated subset
    const paginated = calculatePaginatedIdeas(filtered as Idea[], currentPage, ITEMS_PER_PAGE) as Idea[];
    setSortedAndPaginatedIdeas(paginated);
    
    // Disable loading state after filtering completes (AC10)
    setFilterLoading(false);
  }, [allIdeas, currentPage, selectedStatus, sortBy, sortOrder]);

  /**
   * Handle status filter change and update URL
   */
  const handleStatusChange = (newStatus: IdeaStatus) => {
    setSelectedStatus(newStatus);
    setCurrentPage(1); // Reset to page 1
    setFilterLoading(true); // Trigger skeleton loaders (AC10)

    // Update URL parameters
    const params = new URLSearchParams(searchParams);
    if (newStatus === 'ALL') {
      params.delete('status');
    } else {
      params.set('status', newStatus);
    }
    setSearchParams(params, { replace: true });
  };

  /**
   * Handle sort change and update URL
   */
  const handleSortChange = (newSortBy: SortBy, newSortOrder: SortOrder) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setCurrentPage(1); // Reset to page 1
    setFilterLoading(true); // Trigger skeleton loaders (AC10)

    // Update URL parameters
    const params = new URLSearchParams(searchParams);
    params.set('sortBy', newSortBy);
    params.set('sortOrder', newSortOrder);
    setSearchParams(params, { replace: true });
  };

  /**
   * Clear all filters and sort
   */
  const handleClearAll = () => {
    setSelectedStatus('ALL');
    setSortBy('createdAt');
    setSortOrder('DESC');
    setCurrentPage(1);
    setSearchParams({}, { replace: true });
  };

  /**
   * Remove status filter
   */
  const handleRemoveStatus = () => {
    handleStatusChange('ALL');
  };

  /**
   * Remove sort (reset to default)
   */
  const handleRemoveSort = () => {
    handleSortChange('createdAt', 'DESC');
  };

  /**
   * Fetch ideas on component mount
   */
  useEffect(() => {
    fetchIdeas();
  }, []);

  /**
   * Handle navigation to idea detail page (AC7)
   */
  const handleNavigateToIdea = (ideaId: string) => {
    navigate(`/ideas/${ideaId}`);
  };

  /**
   * Handle retry button click
   */
  const handleRetry = () => {
    fetchIdeas();
  };

  /**
   * Handle navigation to submission form
   */
  const handleSubmitIdea = () => {
    navigate('/submit-idea');
  };

  // AC8: Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Ideas</h1>
          <p className="text-gray-600 mb-8">Track and manage your submitted ideas</p>

          {/* Skeleton loaders for optimistic loading UI (AC10) */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
              <div className="h-10 w-20 bg-gray-200 rounded animate-pulse" />
            </div>
            <SkeletonLoader count={2} rowHeight={40} variant="blocks" />
          </div>

          {/* Skeleton table rows */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <SkeletonLoader count={5} variant="rows" rowHeight={60} />
          </div>
        </div>
      </div>
    );
  }

  // AC9: Error state with retry
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-red-900 mb-2">Unable to Load Ideas</h2>
            <p className="text-red-700 mb-6">{error}</p>
            <button
              onClick={handleRetry}
              className="inline-flex items-center px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // AC3: Empty state
  if (allIdeas.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">My Ideas</h1>
          <div className="bg-white rounded-lg shadow p-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5h.01M9 9h.01"
              />
            </svg>
            <h2 className="mt-6 text-xl font-semibold text-gray-900">No ideas yet</h2>
            <p className="mt-2 text-gray-600">
              You haven't submitted any ideas. Start by sharing your first great idea!
            </p>
            <button
              onClick={handleSubmitIdea}
              className="mt-6 inline-flex items-center px-6 py-3 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
            >
              Submit Your First Idea
            </button>
          </div>
        </div>
      </div>
    );
  }

  // AC1, AC2, AC4, AC5, AC6, AC7: Main dashboard
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">My Ideas</h1>
        <p className="text-gray-600 mb-8">Track and manage your submitted ideas</p>

        {/* AC6: Statistics Bar */}
        {stats && (
          <IdeaStatsBar
            stats={{
              draft: stats.totalIdeas - stats.approvedCount - stats.rejectedCount - stats.pendingReviewCount,
              submitted: 0, // Placeholder
              underReview: stats.pendingReviewCount,
              approved: stats.approvedCount,
              rejected: stats.rejectedCount,
            }}
          />
        )}

        {/* Mobile Filter Drawer Toggle Button */}
        <div className="md:hidden mb-6 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Sort & Filter</h2>
          <button
            onClick={() => setDrawerOpen(!drawerOpen)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium"
          >
            {drawerOpen ? 'Close' : 'Open'} Filters
          </button>
        </div>

        {/* Mobile Filter Drawer (hidden on desktop) */}
        <FilterDrawer
          selectedStatus={selectedStatus}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onStatusChange={handleStatusChange}
          onSortChange={handleSortChange}
          onDrawerToggle={setDrawerOpen}
          onClearAll={handleClearAll}
          isOpen={drawerOpen}
        />

        {/* STORY-2.4 AC1, AC2: Filter and Sort Controls (Desktop only) */}
        <div className="hidden md:block bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <IdeaStatusFilter
              selectedStatus={selectedStatus}
              onChange={handleStatusChange}
              disabled={filterLoading}
            />
            <IdeaSortDropdown
              sortBy={sortBy}
              sortOrder={sortOrder}
              onChange={handleSortChange}
              disabled={filterLoading}
            />
          </div>

          {/* STORY-2.4 AC6, AC7: Filter Chips and Clear All */}
          <FilterChips
            activeStatus={selectedStatus === 'ALL' ? undefined : (selectedStatus as Exclude<IdeaStatus, 'ALL'>)}
            activeSortBy={sortBy !== 'createdAt' || sortOrder !== 'DESC' ? sortBy : undefined}
            activeSortOrder={sortBy !== 'createdAt' || sortOrder !== 'DESC' ? sortOrder : undefined}
            onRemoveStatus={handleRemoveStatus}
            onRemoveSort={handleRemoveSort}
            onClearAll={handleClearAll}
          />

          {/* AC10: Loading message for filter operations */}
          {filterLoading && showLoadingMessage && (
            <p className="text-sm text-gray-500 mt-4">Filtering ideas...</p>
          )}
        </div>

        {/* STORY-2.4 AC11: Empty results state or ideas table */}
        {sortedAndPaginatedIdeas.length === 0 ? (
          <EmptyResultsState hasFilters={selectedStatus !== 'ALL'} onClearFilters={handleClearAll} />
        ) : (
          <>
            {/* AC10: Show skeleton loaders during filtering */}
            {filterLoading && showSkeletonLoader && (
              <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
                <SkeletonLoader count={3} variant="rows" rowHeight={60} />
              </div>
            )}

            {/* AC1, AC2, AC7: Ideas Table (hidden while loading) */}
            {!filterLoading && (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Title</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Category</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date Submitted</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Attachments</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedAndPaginatedIdeas.map((idea) => (
                      <IdeaListItem key={idea.id} idea={idea} onNavigate={handleNavigateToIdea} />
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* AC5: Pagination Controls */}
            {paginationState && !filterLoading && (
              <div className="mt-8 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing {paginationState.startItem} to {paginationState.endItem} of {paginationState.totalItems} ideas
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={!paginationState.canGoPrev}
                    data-testid="pagination-prev"
                    className="px-4 py-2 rounded-md bg-gray-200 text-gray-900 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <div className="px-4 py-2 flex items-center">
                    <span className="text-sm font-medium text-gray-900">
                      Page {paginationState.currentPage} of {paginationState.totalPages}
                    </span>
                  </div>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={!paginationState.canGoNext}
                    data-testid="pagination-next"
                    className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
