/**
 * STORY-3.2: Idea Review Panel Component
 *
 * Displays complete idea details for evaluators to review before making decisions.
 * Shows: Title, Description, Category, Attachments, Submitter Info, Status
 * Actions: Back button (preserves queue state), ready for decision buttons (STORY-3.3)
 *
 * Implements AC1-AC7 from STORY-3.2 specification
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ideasService } from '../services/ideas.service';
import { StatusBadge } from './StatusBadge';
import AttachmentsSection from './AttachmentsSection';
import { IdeaResponse } from '../types/ideaSchema';
import ApproveRejectButtons from './ApproveRejectButtons';

interface ApiError {
  response?: {
    status: number;
    data?: {
      message?: string;
    };
  };
  status?: number;
  message?: string;
}

/**
 * IdeaReviewPanel Component
 * AC1: Display complete idea information
 * AC2: Show attached files with sizes and dates
 * AC3: Display submitter info with mailto link
 * AC4: Auto-update status to "Under Review" on load
 * AC5: Preserve queue breadcrumb with back button
 * AC6: Match STORY-2.5 design patterns
 * AC7: Authorization check for evaluator role
 */
const IdeaReviewPanel: React.FC = () => {
  const { ideaId } = useParams<{ ideaId: string }>();
  const navigate = useNavigate();

  const [idea, setIdea] = useState<IdeaResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusUpdated, setStatusUpdated] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  // Approve handler (AC1, AC5, AC6)
  const handleApprove = async () => {
    if (!ideaId || !idea) return;
    setActionLoading(true);
    setActionError(null);
    try {
      await ideasService.updateIdeaStatus(ideaId, 'Accepted');
      setIdea({ ...idea, status: 'Accepted' });
    } catch (err: any) {
      setActionError(err.message || 'Failed to approve idea. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  // Reject handler (AC2: just open modal, feedback deferred)
  const handleReject = () => {
    // Modal logic handled in ApproveRejectButtons
  };

  // AC4: Auto-update status to "Under Review" on mount
  useEffect(() => {
    const loadAndUpdateIdea = async () => {
      if (!ideaId) {
        setError('Idea ID not found');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Fetch idea details
        const ideaData = await ideasService.getIdeaDetail(ideaId);
        setIdea(ideaData);

        // AC4: Auto-update status to "Under Review" if currently "Submitted"
        if (ideaData.status === 'Submitted' && !statusUpdated) {
          try {
            await ideasService.updateIdeaStatus(ideaId, 'Under Review');
            setStatusUpdated(true);
            // Update local state to reflect new status
            setIdea({ ...ideaData, status: 'Under Review' });
          } catch (statusError) {
            // Log but don't fail - review can still proceed
            console.warn('Status update failed:', statusError);
          }
        }
      } catch (err) {
        const error = err as ApiError;
        let errorMessage = 'Failed to load idea details';

        if (error.response?.status === 403) {
          errorMessage = 'You do not have permission to review this idea';
        } else if (error.response?.status === 404) {
          errorMessage = 'Idea not found';
        } else if (error.message) {
          errorMessage = error.message;
        }

        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    loadAndUpdateIdea();
  }, [ideaId, statusUpdated]);

  // AC5: Back button with breadcrumb - preserves queue state via sessionStorage
  const handleBack = () => {
    const scrollPosition = sessionStorage.getItem('evaluation_queue_scroll');
    navigate('/evaluation-queue');
    if (scrollPosition) {
      window.scrollTo(0, parseInt(scrollPosition, 10));
    }
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          {/* Header skeleton */}
          <div className="h-8 bg-gray-200 rounded w-2/3" />
          {/* Content skeleton */}
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !idea) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-red-900 mb-2">Error</h2>
          <p className="text-red-700 mb-4">{error || 'Failed to load idea'}</p>
          <button
            onClick={handleBack}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            ← Back to Queue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* AC5: Breadcrumb Navigation */}
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-600">
          <button
            onClick={handleBack}
            className="text-blue-600 hover:underline font-medium transition-colors"
          >
            ← Evaluation Queue
          </button>
          <span>/</span>
          <span className="text-gray-900 font-medium">Review Idea</span>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-4 gap-8">
          {/* Left Column (70%) - Main Content */}
          <div className="col-span-3 space-y-8">
            {/* AC1: Header Section with Title */}
            <div className="border-b pb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{idea.title}</h1>
              <p className="text-gray-600">{idea.description}</p>
            </div>

            {/* AC1: Category Badge */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Category</h3>
              <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {idea.category}
              </span>
            </div>

            {/* AC2: Attachments Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Attachments</h3>
              {idea.attachments && idea.attachments.length > 0 ? (
                <AttachmentsSection attachments={idea.attachments} />
              ) : (
                <p className="text-gray-500 italic">No attachments</p>
              )}
            </div>
          </div>

          {/* Right Column (30%) - Sidebar */}
          <div className="col-span-1 space-y-6">
            {/* AC1: Status Badge */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Status</h4>
              <StatusBadge status={idea.status as any} />
            </div>

            {/* AC3: Submitter Info Card */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Submitter</h4>
              <div className="space-y-2">
                <p className="text-sm text-gray-900 font-medium">{idea.submitterName || 'Anonymous'}</p>
                {idea.submitterEmail && (
                  <a
                    href={`mailto:${idea.submitterEmail}`}
                    className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                  >
                    ✉ {idea.submitterEmail}
                  </a>
                )}
              </div>
            </div>

            {/* AC6: Meta Information */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">Submitted</p>
                <p className="text-sm text-gray-900">
                  {new Date(idea.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              {idea.updatedAt && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Last Updated</p>
                  <p className="text-sm text-gray-900">
                    {new Date(idea.updatedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer: Actions (STORY-3.3) */}
        <div className="mt-12 pt-6 border-t flex justify-between items-end">
          <button
            onClick={handleBack}
            className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            ← Back to Queue
          </button>
          <ApproveRejectButtons
            status={idea.status}
            onApprove={handleApprove}
            loading={actionLoading}
            error={actionError}
          />
        </div>
      </div>
    </div>
  );
};

export default IdeaReviewPanel;
