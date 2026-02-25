/**
 * STORY-2.3b: EvaluationQueueRow Component
 * 
 * Displays a single idea in the evaluation queue table
 * AC 13: Shows columns - Submitter, Title, Category, Date, Status, Actions
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Idea } from '../../types/evaluationTypes';
import StatusBadge from './StatusBadge';

interface EvaluationQueueRowProps {
  idea: Idea;
  onOpenModal: (ideaId: string) => void;
}

/**
 * EvaluationQueueRow Component
 * Renders a table row for an idea in the evaluation queue
 * Supports AC13: Displays all required columns and actions
 */
const EvaluationQueueRow: React.FC<EvaluationQueueRowProps> = ({ idea, onOpenModal }) => {
  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <tr className="hover:bg-gray-50 border-b">
      {/* Submitter Email */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {idea.submitterEmail}
      </td>

      {/* Idea Title - Link to detail page */}
      <td className="px-6 py-4 whitespace-nowrap">
        <Link
          to={`/ideas/${idea.id}`}
          className="text-blue-600 hover:underline font-medium"
        >
          {idea.title}
        </Link>
      </td>

      {/* Category Tag */}
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
          {idea.category}
        </span>
      </td>

      {/* Submission Date */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        {formatDate(idea.createdAt)}
      </td>

      {/* Status Badge */}
      <td className="px-6 py-4 whitespace-nowrap">
        <StatusBadge status={idea.status} />
      </td>

      {/* Attachment Count */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        {idea.attachmentCount ? `📎 ${idea.attachmentCount}` : '-'}
      </td>

      {/* Actions - Review Button */}
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
        <button
          onClick={() => onOpenModal(idea.id)}
          className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-xs font-medium"
        >
          Review
        </button>
      </td>
    </tr>
  );
};

export default EvaluationQueueRow;
