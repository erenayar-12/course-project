/**
 * STORY-2.3b: EvaluationQueue Page Component
 * 
 * Main page for evaluator queue - shows all submitted ideas pending evaluation
 * AC 12-16: Evaluation queue with filters, bulk operations, and status updates
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Idea, IdeaStatus, EvaluationStatus, EvaluationQueueResponse } from '../../types/evaluationTypes';
import EvaluationQueueRow from '../../components/EvaluationQueueRow';
import EvaluationModal from '../../components/EvaluationModal';
import BulkActionsBar from '../../components/BulkActionsBar';

type FilterStatus = 'all' | IdeaStatus;

/**
 * EvaluationQueue Page
 * Displays evaluator queue with filtering, selection, and bulk operations
 * Supports AC12-16: Queue view, filters, bulk operations, audit trail
 */
const EvaluationQueue: React.FC = () => {
  // Queue data
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>();

  // Filtering
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');

  // Selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Modal
  const [selectedIdea, setSelectedIdea] = useState<Idea>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  // Fetch evaluation queue
  const fetchQueue = async (pageNum: number = 1) => {
    try {
      setIsLoading(true);
      setError(undefined);

      const offset = (pageNum - 1) * limit;
      const response = await axios.get<EvaluationQueueResponse>('/api/evaluation-queue', {
        params: {
          limit,
          offset,
          status: statusFilter === 'all' ? undefined : statusFilter,
        },
      });

      setIdeas(response.data.ideas);
      setTotalPages(response.data.pagination.pages);
      setPage(pageNum);
    } catch (err) {
      setError('Failed to load evaluation queue');
      // eslint-disable-next-line no-console
      console.error('Error fetching queue:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue(1);
  }, [statusFilter]);

  // Filter displayed ideas
  const filteredIdeas = 
    statusFilter === 'all'
      ? ideas
      : ideas.filter(idea => idea.status === statusFilter);

  // Handle modal submission
  const handleEvaluationSubmit = async (
    status: EvaluationStatus,
    comments: string,
    fileUrl?: string
  ) => {
    if (!selectedIdea) return;

    try {
      setIsSubmitting(true);

      await axios.post(`/api/ideas/${selectedIdea.id}/evaluate`, {
        status,
        comments,
        fileUrl,
      });

      // Refresh queue
      await fetchQueue(page);
      setIsModalOpen(false);
      setSelectedIdea(undefined);
    } catch (err) {
      const message = (err as unknown as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to submit evaluation';
      throw new Error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle idea selection
  const toggleSelection = (ideaId: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(ideaId)) {
      newSelected.delete(ideaId);
    } else {
      newSelected.add(ideaId);
    }
    setSelectedIds(newSelected);
  };

  // Select all on current page
  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(filteredIdeas.map(i => i.id));
      setSelectedIds(allIds);
    } else {
      setSelectedIds(new Set());
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Pending Ideas</h1>
        <p className="text-gray-600 mt-1">Review and evaluate submitted ideas</p>
      </div>

      {/* Status Filters */}
      <div className="mb-6 flex gap-2">
        {(['all', 'SUBMITTED', 'UNDER_REVIEW', 'NEEDS_REVISION'] as FilterStatus[]).map(
          (filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === filter
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {filter === 'all' ? 'All' : filter.replace(/_/g, ' ')}
            </button>
          )
        )}
      </div>

      {/* Bulk Actions Bar */}
      {selectedIds.size > 0 && (
        <BulkActionsBar
          selectedCount={selectedIds.size}
          selectedIds={Array.from(selectedIds)}
          totalCount={filteredIdeas.length}
          onSelectAll={toggleSelectAll}
          onBulkStatusUpdate={() => {/* TODO: Implement bulk status update */}}
          onBulkAssign={() => {/* TODO: Implement bulk assign */}}
          onExportCSV={() => {/* TODO: Implement CSV export */}}
        />
      )}

      {/* Loading State */}
      {isLoading && (
        <div data-testid="loading-skeleton" className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700">
          <p className="font-medium">{error}</p>
          <button
            onClick={() => fetchQueue(page)}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && filteredIdeas.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No ideas pending evaluation</p>
        </div>
      )}

      {/* Ideas Table */}
      {!isLoading && !error && filteredIdeas.length > 0 && (
        <>
          <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    <input
                      type="checkbox"
                      checked={selectedIds.size === filteredIdeas.length && filteredIdeas.length > 0}
                      onChange={(e) => toggleSelectAll(e.target.checked)}
                      className="w-4 h-4"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Submitter</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Title</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Attachments</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredIdeas.map((idea) => (
                  <React.Fragment key={idea.id}>
                    <tr data-testid="queue-row" className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(idea.id)}
                          onChange={() => toggleSelection(idea.id)}
                          className="w-4 h-4"
                        />
                      </td>
                      <EvaluationQueueRow
                        idea={idea}
                        onOpenModal={(ideaId) => {
                          setSelectedIdea(ideas.find(i => i.id === ideaId));
                          setIsModalOpen(true);
                        }}
                      />
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-4 flex justify-between items-center">
              <button
                onClick={() => fetchQueue(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>

              <span className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>

              <button
                onClick={() => fetchQueue(page + 1)}
                disabled={page === totalPages}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Evaluation Modal */}
      {selectedIdea && (
        <EvaluationModal
          idea={selectedIdea}
          isOpen={isModalOpen}
          isLoading={isSubmitting}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleEvaluationSubmit}
        />
      )}
    </div>
  );
};

export default EvaluationQueue;
