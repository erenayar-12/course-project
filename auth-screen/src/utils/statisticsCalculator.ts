/**
 * Statistics Calculator
 * 
 * Pure functions for aggregating and calculating idea statistics.
 * Used to support AC6: Display status breakdown with counts and percentages
 */

export interface IdeaStatusCounts {
  draft: number;
  submitted: number;
  underReview: number;
  approved: number;
  rejected: number;
}

export interface StatusPercentages {
  draft: number;
  submitted: number;
  underReview: number;
  approved: number;
  rejected: number;
}

interface Idea {
  id: string;
  status: 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
  [key: string]: unknown;
}

/**
 * Aggregate idea statuses into counts
 * @param ideas - Array of ideas
 * @returns Object with count for each status
 * @example
 * const ideas = [
 *   { status: 'DRAFT' },
 *   { status: 'DRAFT' },
 *   { status: 'APPROVED' }
 * ];
 * aggregateStatuses(ideas) // { draft: 2, submitted: 0, underReview: 0, approved: 1, rejected: 0 }
 */
export function aggregateStatuses(ideas: Idea[]): IdeaStatusCounts {
  const counts: IdeaStatusCounts = {
    draft: 0,
    submitted: 0,
    underReview: 0,
    approved: 0,
    rejected: 0,
  };

  if (!ideas || ideas.length === 0) {
    return counts;
  }
  
  ideas.forEach((idea) => {
    switch (idea.status) {
      case 'DRAFT':
        counts.draft += 1;
        break;
      case 'SUBMITTED':
        counts.submitted += 1;
        break;
      case 'UNDER_REVIEW':
        counts.underReview += 1;
        break;
      case 'APPROVED':
        counts.approved += 1;
        break;
      case 'REJECTED':
        counts.rejected += 1;
        break;
    }
  });
  
  return counts;
}

/**
 * Calculate percentages for each status
 * @param stats - Status counts object
 * @returns Object with percentage for each status (rounded to nearest integer)
 * @example
 * const stats = { draft: 3, submitted: 2, underReview: 1, approved: 3, rejected: 1 };
 * calculatePercentages(stats) // { draft: 30, submitted: 20, underReview: 10, approved: 30, rejected: 10 }
 */
export function calculatePercentages(stats: IdeaStatusCounts): StatusPercentages {
  // TODO: Calculate (count / total) * 100 for each status, rounded
  // Handle edge case: 0 total ideas
  const total = Object.values(stats).reduce((a, b) => a + b, 0);
  
  if (total === 0) {
    return {
      draft: 0,
      submitted: 0,
      underReview: 0,
      approved: 0,
      rejected: 0,
    };
  }

  return {
    draft: 0,
    submitted: 0,
    underReview: 0,
    approved: 0,
    rejected: 0,
  };
}

/**
 * Get statistics with human-readable status names
 * @param stats - Status counts or percentages
 * @param percentages - If true, format as percentages; otherwise as counts
 * @returns Object keyed by readable status name
 * @example
 * getStatsByReadableName({ draft: 3, submitted: 2, ... })
 * // { "Draft": 3, "Submitted": 2, ... }
 */
export function getStatsByReadableName(
  stats: IdeaStatusCounts | StatusPercentages
): Record<string, number> {
  // TODO: Map snake_case keys to human-readable format
  return {
    Draft: stats.draft,
    Submitted: stats.submitted,
    'Under Review': stats.underReview,
    Approved: stats.approved,
    Rejected: stats.rejected,
  };
}
