/**
 * QueueTable Component (STORY-3.1)
 * 
 * Displays evaluation queue as a table:
 * - 6 columns: Title, Submitter, Category, Date, Status, Days in Queue
 * - Clickable rows to navigate to idea detail
 * - Status badges with color coding
 * - Loading skeleton while fetching
 * - Empty state when queue is empty
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StatusBadge } from './StatusBadge';
import { QueueIdea } from '../types/ideaSchema';

interface QueueTableProps {
  ideas: QueueIdea[];
  isLoading: boolean;
  onRowClick?: (ideaId: string) => void;
}

const SkeletonRow: React.FC = () => (
  <tr>
    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div></td>
    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div></td>
    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div></td>
    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div></td>
    <td className="px-6 py-4"><div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div></td>
    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div></td>
  </tr>
);

export const QueueTable: React.FC<QueueTableProps> = ({ 
  ideas, 
  isLoading,
  onRowClick 
}) => {
  const navigate = useNavigate();

  // Format date as "Feb 1, 2026"
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Handle row click - navigate to idea detail
  const handleRowClick = (ideaId: string) => {
    if (onRowClick) {
      onRowClick(ideaId);
    }
    navigate(`/ideas/${ideaId}`);
  };

  // Empty state
  if (!isLoading && ideas.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500 text-lg">No ideas pending review</p>
        <p className="text-gray-400 text-sm mt-2">All ideas have been reviewed or evaluated</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto shadow-md rounded-lg">
      <table className="w-full bg-white">
        <thead className="bg-gray-100 border-b border-gray-200">
          <tr>
            <th className="text-left px-6 py-3 font-semibold text-gray-700">Title</th>
            <th className="text-left px-6 py-3 font-semibold text-gray-700">Submitter</th>
            <th className="text-left px-6 py-3 font-semibold text-gray-700">Category</th>
            <th className="text-left px-6 py-3 font-semibold text-gray-700">Submitted</th>
            <th className="text-left px-6 py-3 font-semibold text-gray-700">Status</th>
            <th className="text-left px-6 py-3 font-semibold text-gray-700">Days in Queue</th>
            <th className="text-left px-6 py-3 font-semibold text-gray-700">Action</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, idx) => (
              <SkeletonRow key={idx} />
            ))
          ) : (
            ideas.map((idea) => (
              <tr
                key={idea.id}
                className="border-b border-gray-200 hover:bg-blue-50 transition-colors"
              >
                <td className="px-6 py-4 font-medium text-indigo-600 hover:underline max-w-xs truncate">
                  {idea.title}
                </td>
                <td className="px-6 py-4 text-gray-700">
                  {idea.submitterName}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {idea.category}
                </td>
                <td className="px-6 py-4 text-gray-600 text-sm">
                  {formatDate(idea.createdAt)}
                </td>
                <td className="px-6 py-4">
                  <StatusBadge 
                    status={
                      idea.status === 'Submitted' ? 'SUBMITTED' : 
                      idea.status === 'Under Review' ? 'UNDER_REVIEW' : 
                      'SUBMITTED'
                    } 
                  />
                </td>
                <td className="px-6 py-4 text-gray-700 font-semibold">
                  {idea.daysInQueue === 1 ? '1 day' : `${idea.daysInQueue} days`}
                </td>
                <td className="px-6 py-4">
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold"
                    onClick={() => onRowClick && onRowClick(idea.id)}
                  >
                    Review
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
