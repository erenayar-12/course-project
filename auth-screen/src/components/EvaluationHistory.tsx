/**
 * STORY-2.3b: EvaluationHistory Component
 * 
 * Displays immutable audit trail of all evaluations for an idea (read-only)
 * AC 16: Shows evaluation history with date, evaluator, status, comments
 */

import React from 'react';
import { IdeationEvaluation } from '../../types/evaluationTypes';

interface EvaluationHistoryProps {
  evaluations: IdeationEvaluation[];
}

// Format datetime for display
const formatDateTime = (date: Date): string => {
  return new Date(date).toLocaleString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

/**
 * EvaluationHistory Component
 * Displays all past evaluations in chronological order (immutable audit trail)
 * Supports AC16: Read-only evaluation history timeline
 */
const EvaluationHistory: React.FC<EvaluationHistoryProps> = ({ evaluations }) => {
  if (evaluations.length === 0) {
    return (
      <div data-testid="empty-history" className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-gray-500 text-sm">No evaluation history</p>
      </div>
    );
  }

  return (
    <div data-testid="evaluation-history" className="mt-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Evaluation History</h3>
      
      <div className="space-y-4">
        {evaluations.map((evaluation, index) => (
          <div
            key={evaluation.id}
            data-testid="evaluation-item"
            className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-medium text-gray-900">{evaluation.evaluatorEmail}</p>
                <p className="text-sm text-gray-600">{formatDateTime(evaluation.createdAt)}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                evaluation.status === 'ACCEPTED'
                  ? 'bg-green-100 text-green-800'
                  : evaluation.status === 'REJECTED'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {evaluation.status}
              </span>
            </div>
            
            <p className="text-gray-700 mb-2">{evaluation.comments}</p>
            
            {evaluation.fileUrl && (
              <a
                href={evaluation.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                📎 View Evaluation Notes
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EvaluationHistory;
