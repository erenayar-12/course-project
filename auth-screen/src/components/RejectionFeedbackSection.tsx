/**
 * RejectionFeedbackSection Component
 * 
 * Displays evaluator feedback when idea is rejected:
 * - Evaluator name
 * - Feedback date
 * - Feedback comments
 * - Resubmit button as CTA
 * 
 * Implements AC6 from STORY-2.5 specification
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';

interface EvaluatorFeedback {
  evaluatorId: string;
  evaluatorName: string;
  comments: string;
  feedbackDate: Date | string;
}

interface RejectionFeedbackSectionProps {
  feedback: EvaluatorFeedback;
  ideaId: string;
}

/**
 * RejectionFeedbackSection Component
 * 
 * Displays rejection feedback with warning styling
 * Shows only when idea status is REJECTED
 * Includes resubmit button to navigate to edit form
 */
const RejectionFeedbackSection: React.FC<RejectionFeedbackSectionProps> = ({
  feedback,
  ideaId,
}) => {
  const navigate = useNavigate();

  const formatDate = (date: Date | string): string => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleResubmit = () => {
    navigate(`/ideas/${ideaId}/edit`, {
      state: {
        message: 'Please address the feedback and resubmit your idea.',
      },
    });
  };

  return (
    <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-red-900">Evaluator Feedback</h3>
          <p className="text-sm text-red-700 mt-1">
            By {feedback.evaluatorName} on {formatDate(feedback.feedbackDate)}
          </p>
        </div>
        <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full">
          Rejected
        </span>
      </div>

      {/* Feedback comments */}
      <div className="mb-6 bg-white rounded p-4 border border-red-200">
        <p className="text-gray-700 whitespace-pre-wrap text-sm">
          {feedback.comments}
        </p>
      </div>

      {/* Resubmit CTA */}
      <div className="flex gap-3">
        <button
          onClick={handleResubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium"
          aria-label="Resubmit idea"
        >
          Resubmit Idea
        </button>

        <p className="text-sm text-red-700 self-center">
          Address the feedback and resubmit for review.
        </p>
      </div>
    </div>
  );
};

export default RejectionFeedbackSection;
