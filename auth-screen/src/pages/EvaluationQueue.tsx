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
import { auth } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { apiGet } from '../api/client';
import { QueueTable } from '../components/QueueTable';
import { QueuePagination } from '../components/QueuePagination';
import EvaluationModal from '../components/EvaluationModal';
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
    // Modal state
    const [selectedIdea, setSelectedIdea] = useState<QueueIdea | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
  const [firebaseUser, setFirebaseUser] = useState<any>(null);
  const [ideas, setIdeas] = useState<QueueIdea[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({ page: 1, pageSize: 25, total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Firebase Auth state
  const [authLoading, setAuthLoading] = useState(true);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // ...existing code...
  // Authentication check (not inside any hook or conditional)
  let authContent = null;
  if (authLoading) {
    authContent = <div>Loading...</div>;
  } else if (!firebaseUser) {
    window.location.href = '/login';
    authContent = null;
  }

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
      // Ensure pageSize is always a valid number
      const validPageSize = typeof pageSize === 'number' && !isNaN(pageSize) ? pageSize : 25;
      const result = await apiGet<EvaluationQueueResponse>('/ideas', {
        params: { page, limit: validPageSize },
        headers: { Authorization: firebaseUser ? `Bearer ${firebaseUser.accessToken || ''}` : '' },
      });

      if (result.success && result.data) {
        console.log('EvaluationQueue fetched ideas:', result.data);
        // Show only open statuses in queue
        const queueIdeas = (result.data || []).filter(
          (idea) => ['SUBMITTED', 'UNDER_REVIEW', 'NEEDS_REVISION'].includes(idea.status)
        );
        setIdeas(queueIdeas);
        setPagination({
          page: result.pagination.page,
          pageSize: result.pagination.limit,
          total: result.pagination.total,
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
    if (firebaseUser) {
      fetchQueue(pagination.page, pagination.pageSize);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firebaseUser]);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    // Save scroll position for restoration after navigation
    sessionStorage.setItem('evaluationQueue_scrollPos', String(window.scrollY));
    const pageSize = typeof pagination.pageSize === 'number' && !isNaN(pagination.pageSize) ? pagination.pageSize : 25;
    setPagination(prev => ({ ...prev, page: newPage, pageSize }));
    fetchQueue(newPage, pageSize);
  };

  // Handle page size change
  const handlePageSizeChange = (newPageSize: number) => {
    const pageSize = typeof newPageSize === 'number' && !isNaN(newPageSize) ? newPageSize : 25;
    setPagination(prev => ({ ...prev, pageSize, page: 1 }));
    fetchQueue(1, pageSize);
  };

  // Handle retry on error
  const handleRetry = () => {
    const pageSize = typeof pagination.pageSize === 'number' && !isNaN(pagination.pageSize) ? pagination.pageSize : 25;
    fetchQueue(pagination.page, pageSize);
  };

  if (authContent !== null) {
    return authContent;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-gray-900">Evaluation Queue</h1>
          <p className="text-gray-600">Ideas in progress for admin, your submitted ideas for users</p>
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
              onRowClick={(ideaId) => {
                const idea = ideas.find(i => i.id === ideaId);
                if (idea) {
                  setSelectedIdea(idea);
                  setIsModalOpen(true);
                }
              }}
            />
          </div>
        {/* Evaluation Modal */}
        {isModalOpen && selectedIdea && (
          <EvaluationModal
            idea={selectedIdea}
            isOpen={isModalOpen}
            isLoading={isSubmitting}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedIdea(null);
            }}
            onSubmit={async (status, comments, fileUrl) => {
              setIsSubmitting(true);
              try {
                await fetch(`http://localhost:3001/api/ideas/${selectedIdea.id}/evaluate`, {
                  method: 'POST',
                  body: JSON.stringify({ status, comments, fileUrl }),
                  headers: { 'Content-Type': 'application/json', Authorization: firebaseUser ? `Bearer ${firebaseUser.accessToken || ''}` : '' },
                });
                setIsModalOpen(false);
                setSelectedIdea(null);
                // Refresh queue
                fetchQueue(pagination.page, pagination.pageSize);
              } catch (err) {
                alert('Failed to submit evaluation: ' + (err.message || err));
              } finally {
                setIsSubmitting(false);
              }
            }}
          />
        )}

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
              💡 Admin sees in-progress ideas. Users see their own submissions. Click on any idea title to view details and provide feedback.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EvaluationQueue;
