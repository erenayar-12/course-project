/**
 * STORY-2.5: Idea Detail Page
 * 
 * Displays detailed view of a submitted idea with:
 * - Title, description, category, status
 * - Attachments with download capability
 * - Evaluator feedback (if rejected)
 * - Edit/Delete buttons (conditional visibility)
 * - Loading states with skeleton loaders
 * - Authorization checks (owner-only access)
 * 
 * Implements AC1-AC12 from STORY-2.5 specification
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ideasService } from '../services/ideas.service';
import { StatusBadge } from '../components/StatusBadge';
import AttachmentsSection from '../components/AttachmentsSection';
import RejectionFeedbackSection from '../components/RejectionFeedbackSection';
import '@testing-library/jest-dom';

interface IdeaDetail {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  attachments: Array<{
    id: string;
    originalName: string;
    fileSize: number;
    uploadedAt: Date;
    fileUrl?: string;
  }>;
  evaluatorFeedback?: {
    evaluatorId: string;
    evaluatorName: string;
    comments: string;
    feedbackDate: Date;
  };
}

/**
 * IdeaDetailPage Component
 * 
 * AC1: Page loads with idea information
 * AC2: Status badge with visual indicator
 * AC3: Attachment display with download
 * AC4: Edit button (conditional - Draft/Submitted)
 * AC5: Delete button with confirmation (conditional - Draft)
 * AC6: Rejection feedback display
 * AC7: Read-only mode for non-Draft ideas
 * AC8: Back to Dashboard navigation
 * AC9: Authorization - Owner only (403)
 * AC10: Not found handling (404)
 * AC11: Loading skeleton states
 * AC12: Responsive design (mobile/tablet/desktop)
 */
const IdeaDetailPage: React.FC = () => {
  const { ideaId } = useParams<{ ideaId: string }>();
  const navigate = useNavigate();
  const [idea, setIdea] = useState<IdeaDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load idea data on mount
  useEffect(() => {
    const loadIdea = async () => {
      if (!ideaId) {
        setError('Idea ID is required');
        setErrorCode(400);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        setErrorCode(null);
        const data = await ideasService.getIdeaDetail(ideaId);
        setIdea(data);
      } catch (err) {
        const error = err as any;
        const status = error.response?.status || error.status;
        
        setErrorCode(status);
        
        // User-friendly error messages based on HTTP status
        if (status === 403) {
          setError("You don't have permission to view this idea. It may belong to another user.");
        } else if (status === 404) {
          setError('Idea not found. It may have been deleted or does not exist.');
        } else if (status === 401) {
          setError('Your session has expired. Please log in again.');
        } else if (status >= 500) {
          setError('Something went wrong on the server. Please try again later.');
        } else {
          setError(error.message || 'Failed to load idea. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadIdea();
  }, [ideaId]);

  // Handle delete action
  const handleDelete = async () => {
    if (!idea) return;

    try {
      setIsDeleting(true);
      setError(null);
      await ideasService.deleteIdea(idea.id);
      
      // Show success feedback before navigating
      console.log('Idea deleted successfully');
      
      // Redirect to dashboard after delete
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const error = err as any;
      const status = error.response?.status || error.status;
      
      if (status === 403) {
        setError("You don't have permission to delete this idea.");
      } else if (status === 404) {
        setError('Idea not found. It may have been deleted already.');
      } else if (status === 401) {
        setError('Your session has expired. Please log in again.');
      } else {
        setError(error.message || 'Failed to delete idea. Please try again.');
      }
      
      setShowDeleteModal(false);
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle retry for failed loads
  const handleRetry = () => {
    setLoading(true);
    setError(null);
    setErrorCode(null);
    
    const loadIdea = async () => {
      if (!ideaId) {
        setError('Idea ID is required');
        setErrorCode(400);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        setErrorCode(null);
        const data = await ideasService.getIdeaDetail(ideaId);
        setIdea(data);
      } catch (err) {
        const error = err as any;
        const status = error.response?.status || error.status;
        
        setErrorCode(status);
        
        if (status === 403) {
          setError("You don't have permission to view this idea. It may belong to another user.");
        } else if (status === 404) {
          setError('Idea not found. It may have been deleted or does not exist.');
        } else if (status === 401) {
          setError('Your session has expired. Please log in again.');
        } else if (status >= 500) {
          setError('Something went wrong on the server. Please try again later.');
        } else {
          setError(error.message || 'Failed to load idea. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadIdea();
  };

  // Handle edit navigation
  const handleEdit = () => {
    if (idea) {
      navigate(`/ideas/${idea.id}/edit`, { state: { idea } });
    }
  };

  // Format date helper
  const formatDate = (date: Date | string): string => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Determine if idea is editable
  const isEditable = idea && (idea.status === 'DRAFT' || idea.status === 'SUBMITTED');

  // Loading state - show skeleton loaders
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Back button skeleton */}
          <div className="mb-6 h-8 w-32 bg-gray-200 rounded animate-pulse" />
          
          {/* Main content card skeleton */}
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8">
            {/* Header section skeleton */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                {/* Title skeleton */}
                <div className="flex-1 min-w-0">
                  <div className="h-8 bg-gray-200 rounded animate-pulse mb-3" />
                  <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse" />
                </div>
                {/* Status badge skeleton */}
                <div className="h-8 w-24 bg-gray-200 rounded-full animate-pulse flex-shrink-0" />
              </div>

              {/* Metadata skeleton */}
              <div className="space-y-2">
                <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-56 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>

            {/* Description section skeleton */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>

            {/* Attachments skeleton */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4" />
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error states
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 text-blue-600 hover:text-blue-800 underline text-sm font-medium"
          >
            ← Back
          </button>

          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-900 mb-2">
              {errorCode === 403 ? 'Access Denied' : errorCode === 404 ? 'Idea Not Found' : errorCode === 401 ? 'Session Expired' : 'Error Loading Idea'}
            </h2>
            <p className="text-red-700 mb-6">{error}</p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              {errorCode !== 401 && (
                <button
                  onClick={handleRetry}
                  className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors text-sm font-medium"
                >
                  Try Again
                </button>
              )}
              
              {errorCode === 401 ? (
                <button
                  onClick={() => navigate('/login', { replace: true })}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Go to Login
                </button>
              ) : (
                <button
                  onClick={() => navigate('/dashboard', { replace: true })}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Back to Dashboard
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!idea) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with back button and actions */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:text-blue-800 underline text-sm font-medium inline-flex items-center gap-1 active:opacity-70 transition-opacity"
          >
            ← Back to My Ideas
          </button>

          {/* Edit/Delete buttons - responsive layout */}
          <div className="flex gap-2 flex-wrap">
            {isEditable && (
              <button
                onClick={handleEdit}
                className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium active:opacity-80 min-h-10 min-w-10 flex items-center justify-center"
                aria-label="Edit idea"
              >
                Edit
              </button>
            )}

            {idea.status === 'DRAFT' && (
              <button
                onClick={() => setShowDeleteModal(true)}
                className="px-3 sm:px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm font-medium active:opacity-80 min-h-10 min-w-10 flex items-center justify-center"
                aria-label="Delete idea"
              >
                Delete
              </button>
            )}
          </div>
        </div>

        {/* Main content card - responsive padding */}
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8">
          {/* Title and status section */}
          <div className="mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">
                {idea.title}
              </h1>
              <div className="flex-shrink-0">
                <StatusBadge status={idea.status} />
              </div>
            </div>

            {/* Metadata - responsive text sizes */}
            <div className="space-y-1.5 text-xs sm:text-sm text-gray-600">
              <p>
                Category: <span className="font-medium text-gray-900">{idea.category}</span>
              </p>
              <p>
                Submitted: <span className="font-medium text-gray-900">{formatDate(idea.createdAt)}</span>
              </p>
              <p>
                By: <span className="font-medium text-gray-900">{idea.user?.name || 'Unknown'}</span>
              </p>
            </div>
          </div>

          {/* Description section */}
          <div className="mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-gray-200">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">Description</h2>
            <p className={`text-sm sm:text-base text-gray-700 whitespace-pre-wrap leading-relaxed break-words ${isEditable ? '' : 'opacity-75'}`}>
              {idea.description}
            </p>
            {!isEditable && (
              <p className="text-xs sm:text-sm text-gray-500 mt-3">
                This idea is submitted for review and cannot be edited.
              </p>
            )}
          </div>

          {/* Attachments */}
          {idea.attachments && idea.attachments.length > 0 && (
            <div className="mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-gray-200">
              <AttachmentsSection attachments={idea.attachments} />
            </div>
          )}

          {/* Rejection feedback (if rejected) */}
          {idea.status === 'REJECTED' && idea.evaluatorFeedback && (
            <div className="mb-6 sm:mb-8">
              <RejectionFeedbackSection 
                feedback={idea.evaluatorFeedback}
                ideaId={idea.id}
              />
            </div>
          )}
        </div>
      </div>

      {/* Delete confirmation modal - responsive */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="delete-modal-title">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-auto max-h-screen overflow-y-auto p-6">
            <h2 id="delete-modal-title" className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Delete Idea?</h2>
            <p className="text-sm sm:text-base text-gray-600 mb-6">
              This idea will be deleted and moved to trash. You can recover it within 30 days.
            </p>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded p-3 mb-6">
                <p className="text-xs sm:text-sm text-red-700">{error}</p>
              </div>
            )}
            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setError(null);
                }}
                disabled={isDeleting}
                className="px-4 py-2 bg-gray-300 text-gray-900 rounded hover:bg-gray-400 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm min-h-10"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm min-h-10"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IdeaDetailPage;
