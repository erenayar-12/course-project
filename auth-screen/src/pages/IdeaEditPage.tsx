/**
 * STORY-2.6: IdeaEditPage Component
 *
 * Idea edit page container that handles:
 * - Route parameter extraction (ideaId)
 * - Fetching existing idea data
 * - Prefilling form with existing data
 * - Form submission and API calls
 * - Authorization checks (owner-only editing)
 * - Error handling (404, 403, authorization errors)
 * - Navigation after successful submission
 *
 * Acceptance Criteria Addressed:
 * - AC1: Form prefillal with existing idea data
 * - AC8: Proper error handling and display
 * - AC9: Authorization verification (user is owner)
 * - AC10: 404 handling for non-existent ideas
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMockAuth0 } from '../context/MockAuth0Context';
import IdeaForm, { IdeaFormData } from '../components/IdeaForm';
import { IdeaResponse } from '../types/ideaSchema';
import { ideasService } from '../services/ideas.service';
import { SkeletonLoader } from '../components/SkeletonLoader';

type PageState = 'loading' | 'loaded' | 'error' | 'submitting';

interface PageError {
  title: string;
  message: string;
  status?: number;
}

const IdeaEditPage: React.FC = () => {
  const { ideaId } = useParams<{ ideaId: string }>();
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useMockAuth0();

  const [pageState, setPageState] = useState<PageState>('loading');
  const [idea, setIdea] = useState<IdeaResponse | null>(null);
  const [pageError, setPageError] = useState<PageError | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Validate route param
  useEffect(() => {
    if (!ideaId) {
      setPageError({
        title: 'Invalid Request',
        message: 'Idea ID is missing',
        status: 400,
      });
      setPageState('error');
    }
  }, [ideaId]);

  // Fetch idea data on mount
  useEffect(() => {
    if (!ideaId || pageState !== 'loading' || authLoading) return;

    const fetchIdea = async () => {
      try {
        const response = await ideasService.getIdeaDetail(ideaId);

        // AC9: Authorization - check if user owns this idea
        if (!user || response.userId !== user.email) {
          setPageError({
            title: 'Access Denied',
            message: 'You do not have permission to edit this idea',
            status: 403,
          });
          setPageState('error');
          return;
        }

        setIdea(response);
        setPageState('loaded');
      } catch (error: any) {
        const message = error.message || 'Failed to load idea';
        const status = message.includes('not found') ? 404 :
          message.includes('permission') ? 403 : 500;

        setPageError({
          title: status === 404 ? 'Idea Not Found' :
            status === 403 ? 'Access Denied' :
              'Error Loading Idea',
          message,
          status,
        });

        setPageState('error');
      }
    };

    fetchIdea();
  }, [ideaId, authLoading, user]);

  // Handle form submission
  const handleSubmit = async (data: IdeaFormData) => {
    if (!idea || !ideaId) {
      setSubmitError('Idea data is missing');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Update idea details
      const updatedIdea = await ideasService.updateIdea(ideaId, {
        title: data.title,
        description: data.description,
        category: data.category,
      });

      // Handle new file uploads if provided
      if (data.newFiles && data.newFiles.length > 0) {
        try {
          await ideasService.uploadAttachments(ideaId, data.newFiles);
        } catch (uploadError: any) {
          console.error('Error uploading files:', uploadError);
          // Idea was updated successfully, so we continue even if files fail
          // This is non-critical - the idea content was saved
        }
      }

      setIdea(updatedIdea);
      setIsSubmitting(false);

      // Redirect to detail page
      navigate(`/ideas/${ideaId}`);
    } catch (error: any) {
      setIsSubmitting(false);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to update idea';

      setSubmitError(errorMessage);
    }
  };

  // Handle form cancel
  const handleCancel = () => {
    if (ideaId) {
      navigate(`/ideas/${ideaId}`);
    } else {
      navigate('/ideas');
    }
  };

  // Render error state
  if (pageState === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center">
              {pageError?.status === 404 && (
                <>
                  <div className="text-6xl mb-4">404</div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {pageError.title}
                  </h1>
                </>
              )}
              {pageError?.status === 403 && (
                <>
                  <div className="text-6xl mb-4">🔒</div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {pageError.title}
                  </h1>
                </>
              )}
              {!pageError?.status || (pageError.status !== 404 && pageError.status !== 403) && (
                <>
                  <div className="text-6xl mb-4">⚠️</div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {pageError?.title || 'Error'}
                  </h1>
                </>
              )}

              <p className="text-gray-600 mb-6">
                {pageError?.message || 'An error occurred'}
              </p>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => navigate('/ideas')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Back to Ideas
                </button>
                {pageError?.status !== 404 && (
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Try Again
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render loading state
  if (pageState === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <SkeletonLoader count={5} rowHeight={24} />
        </div>
      </div>
    );
  }

  // Render loaded state
  if (pageState === 'loaded' && idea) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6 md:p-8">
          <IdeaForm
            mode="edit"
            initialIdea={idea}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
            error={submitError}
          />
        </div>
      </div>
    );
  }

  return null;
};

export default IdeaEditPage;
