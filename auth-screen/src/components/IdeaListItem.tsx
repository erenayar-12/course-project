/**
 * IdeaListItem Component
 * 
 * Displays a single idea row in the dashboard list.
 * Implements AC2: Displays title, status, category, submission date, attachment count
 * Implements AC7: Click navigation to /ideas/:ideaId
 * 
 * @component
 * @example
 * <IdeaListItem
 *   idea={{
 *     id: '1',
 *     title: 'New Feature',
 *     status: 'SUBMITTED',
 *     category: 'Product',
 *     createdAt: '2026-02-25',
 *     attachmentCount: 2
 *   }}
 * />
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StatusBadge } from './StatusBadge';
import { formatDateForDisplay } from '../utils/dashboardUtils';

interface Idea {
  id: string;
  title: string;
  status: 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
  category: string;
  createdAt: string;
  attachmentCount: number;
}

interface IdeaListItemProps {
  idea: Idea;
  onNavigate?: (ideaId: string) => void;
}

/**
 * Renders a clickable list item for an idea
 * @param idea - The idea data to display
 * @param onNavigate - Callback when row is clicked (default: navigate to /ideas/:ideaId)
 * @returns List item component
 */
export const IdeaListItem: React.FC<IdeaListItemProps> = ({ idea, onNavigate }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onNavigate) {
      onNavigate(idea.id);
    } else {
      // Default: navigate to detail page (AC7)
      navigate(`/ideas/${idea.id}`);
    }
  };

  // Parse createdAt to Date if it's a string
  const createdDate = typeof idea.createdAt === 'string' ? new Date(idea.createdAt) : idea.createdAt;
  const formattedDate = formatDateForDisplay(createdDate);

  return (
    <tr
      data-testid="queue-row"
      onClick={handleClick}
      className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
    >
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {idea.title}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        <span className="inline-flex px-2 py-1 rounded text-xs font-semibold bg-gray-100 text-gray-800">
          {idea.category}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        {formattedDate}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <StatusBadge status={idea.status} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        {idea.attachmentCount > 0 && (
          <span title={`${idea.attachmentCount} attachment${idea.attachmentCount !== 1 ? 's' : ''}`}>
            📎 {idea.attachmentCount}
          </span>
        )}
      </td>
    </tr>
  );
};
