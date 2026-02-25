/**
 * STORY-2.3b: EvaluationModal Component
 * 
 * Modal dialog for submitting evaluation of an idea
 * AC 14: Status dropdown, comments textarea, file upload
 */

import React, { useState } from 'react';
import { Idea, EvaluationStatus } from '../types/evaluationTypes';

interface EvaluationModalProps {
  idea?: Idea;
  isOpen: boolean;
  isLoading?: boolean;
  onClose: () => void;
  onSubmit: (status: EvaluationStatus, comments: string, fileUrl?: string) => Promise<void>;
}

/**
 * EvaluationModal Component
 * Dialog for submitting idea evaluation with status, comments, and optional file
 * Supports AC14: Status dropdown, 500-char comment limit, file upload
 */
const EvaluationModal: React.FC<EvaluationModalProps> = ({
  idea,
  isOpen,
  isLoading = false,
  onClose,
  onSubmit,
}) => {
  const [status, setStatus] = useState(EvaluationStatus.ACCEPTED);
  const [comments, setComments] = useState('');
  const [fileUrl, setFileUrl] = useState<string>();
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState(false);

  if (!isOpen || !idea) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);

    if (!comments.trim()) {
      setError('Comments are required');
      return;
    }

    if (comments.length > 500) {
      setError('Comments must be 500 characters or less');
      return;
    }

    try {
      await onSubmit(status, comments, fileUrl);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setComments('');
        setFileUrl(undefined);
        onClose();
      }, 2000);
    } catch (err) {
      setError((err as Error).message || 'Failed to submit evaluation');
    }
  };

  const handleCancel = () => {
    setComments('');
    setFileUrl(undefined);
    setError(undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div data-testid="evaluation-modal" className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 p-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{idea.title}</h2>
          <p className="text-gray-600 mt-1">{idea.description}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Status Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Evaluation Status *
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as EvaluationStatus)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ACCEPTED">✓ Accepted</option>
              <option value="REJECTED">✗ Rejected</option>
              <option value="NEEDS_REVISION">⚠️ Needs Revision</option>
            </select>
          </div>

          {/* Comments Textarea with Character Counter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Comments (max 500 characters) *
            </label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value.slice(0, 500))}
              placeholder="Enter your evaluation comments..."
              maxLength={500}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              {comments.length}/500 characters
            </p>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Evaluation Notes (optional)
            </label>
            <input
              type="file"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  // In real implementation, upload file and get URL
                  setFileUrl(`file://${e.target.files[0].name}`);
                }
              }}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              aria-label="Upload evaluation notes"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
              ✓ Evaluation submitted successfully!
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !comments.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isLoading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EvaluationModal;
