/**
 * STORY-3.1: EvaluationQueue Page Component (Updated)
 * 
 * Main page for evaluator queue - shows all submitted ideas pending evaluation.
 * This is a simplified, efficient view focused on:
 * - Quick table display of pending ideas
 * - Pagination for handling large queues
 * - Click-to-evaluate workflow
 */

import React, { useEffect, useState } from 'react';
import { useMockAuth0 } from '../context/MockAuth0Context';
import { apiGet } from '../api/client';
import { QueueTable } from '../components/QueueTable';
import { QueuePagination } from '../components/QueuePagination';
import { QueueIdea, EvaluationQueueResponse } from '../types/ideaSchema';
import { ROLES } from '../constants/roles';

interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

/**
 * EvaluationQueue Page
 * Displays a simplified evaluator queue focused on quick idea browsing and evaluation
 * Features: Pagination with localStorage persistence, error recovery, scroll restoration
 */
const EvaluationQueue: React.FC = () => {
  const { user } = useMockAuth0();
  const [ideas, setIdeas] = useState<QueueIdea[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({ page: 1, pageSize: 25, total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load pagination state from localStorage
  useEffect(() => {
    const savedPageSize = localStorage.getItem('evaluationQueue_pageSize');
    if (savedPageSize) {
      setPagination(prev => ({ ...prev, pageSize: parseInt(savedPageSize) }));
    }
  }, []);

  // Restore scroll position from sessionStorage
  useEffect(() => {
    const savedScroll = sessionStorage.getItem('evaluationQueue_scrollPos');
    if (savedScroll) {
      window.scrollTo(0, parseInt(savedScroll));
      sessionStorage.removeItem('evaluationQueue_scrollPos');
    }
  }, []);

  // Fetch evaluation queue
  const fetchQueue = async (page: number, pageSize: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiGet<EvaluationQueueResponse>('/evaluation-queue', {
        params: { page, limit: pageSize },
      });

      if (response.success && response.data) {
        setIdeas(response.data);
        setPagination({
          page: response.pagination.page,
          pageSize: response.pagination.limit,
          total: response.pagination.total,
        });
      }
    } catch (err: any) {
      console.error('Failed to fetch evaluation queue:', err);
      setError(err.message || 'Failed to fetch evaluation queue. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    if (user) {
      fetchQueue(pagination.page, pagination.pageSize);
    }
  }, [user]);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    // Save scroll position for restoration after navigation
    sessionStorage.setItem('evaluationQueue_scrollPos', String(window.scrollY));
    setPagination(prev => ({ ...prev, page: newPage }));
    fetchQueue(newPage, pagination.pageSize);
  };

  // Handle page size change
  const handlePageSizeChange = (newPageSize: number) => {
    setPagination(prev => ({ ...prev, pageSize: newPageSize, page: 1 }));
    fetchQueue(1, newPageSize);
  };

  // Handle retry on error
  const handleRetry = () => {
    fetchQueue(pagination.page, pagination.pageSize);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Evaluation Queue</h1>
          <p className="text-gray-600">Review ideas submitted by team members</p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
            <div>
              <p className="font-semibold text-red-700">{error}</p>
            </div>
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-red-600 text-white rounded font-semibold hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Queue Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <QueueTable 
              ideas={ideas} 
              isLoading={isLoading}
            />
          </div>

          {/* Pagination */}
          {!error && (
            <QueuePagination
              currentPage={pagination.page}
              pageSize={pagination.pageSize}
              totalCount={pagination.total}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          )}
        </div>

        {/* Info Text */}
        {!isLoading && ideas.length > 0 && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 Ideas are sorted by submission date (oldest first) to ensure fair FIFO processing.
              Click on any idea title to view details and provide feedback.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EvaluationQueue;
