/**
 * Filter and Sort Utilities for Ideas
 * 
 * Functions to apply filters and sorting to idea lists
 */

import { IdeaStatus } from '../components/IdeaStatusFilter';
import { SortBy, SortOrder } from '../components/IdeaSortDropdown';

export interface FilteredIdea {
  id: string;
  title: string;
  status: string;
  category: string;
  createdAt: string;
  attachmentCount: number;
}

/**
 * Filter ideas by status
 * @param ideas - Array of ideas to filter
 * @param status - Status to filter by (ALL means no filter)
 * @returns Filtered ideas
 */
export function filterIdeasByStatus(
  ideas: FilteredIdea[],
  status: Exclude<IdeaStatus, 'ALL'> | undefined
): FilteredIdea[] {
  if (!status) return ideas;

  return ideas.filter((idea) => idea.status === status);
}

/**
 * Sort ideas by field and order
 * @param ideas - Array of ideas to sort
 * @param sortBy - Field to sort by
 * @param sortOrder - Sort order (ASC or DESC)
 * @returns Sorted ideas
 */
export function sortIdeas(
  ideas: FilteredIdea[],
  sortBy: SortBy,
  sortOrder: SortOrder
): FilteredIdea[] {
  const sorted = [...ideas];

  sorted.sort((a, b) => {
    let comparison = 0;

    if (sortBy === 'createdAt') {
      const aTime = new Date(a.createdAt).getTime();
      const bTime = new Date(b.createdAt).getTime();
      comparison = aTime < bTime ? -1 : aTime > bTime ? 1 : 0;
    } else {
      const aTitle = a.title.toLowerCase();
      const bTitle = b.title.toLowerCase();
      comparison = aTitle < bTitle ? -1 : aTitle > bTitle ? 1 : 0;
    }

    return sortOrder === 'DESC' ? -comparison : comparison;
  });

  return sorted;
}

/**
 * Apply both filters and sorting to ideas
 * @param ideas - Array of ideas
 * @param status - Status filter
 * @param sortBy - Sort field
 * @param sortOrder - Sort order
 * @returns Filtered and sorted ideas
 */
export function applyFiltersAndSort(
  ideas: FilteredIdea[],
  status: Exclude<IdeaStatus, 'ALL'> | undefined,
  sortBy: SortBy,
  sortOrder: SortOrder
): FilteredIdea[] {
  let result = filterIdeasByStatus(ideas, status);
  result = sortIdeas(result, sortBy, sortOrder);
  return result;
}
