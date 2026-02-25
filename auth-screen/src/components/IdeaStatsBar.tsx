/**
 * IdeaStatsBar Component
 * 
 * Displays statistics summary with status breakdown.
 * Implements AC6: Shows counts AND percentages (e.g., "3 Approved (30%)")
 * 
 * @component
 * @example
 * <IdeaStatsBar stats={{ draft: 3, submitted: 2, underReview: 1, approved: 3, rejected: 1 }} />
 */

import React from 'react';

interface StatsBadge {
  draft: number;
  submitted: number;
  underReview: number;
  approved: number;
  rejected: number;
}

interface IdeaStatsBarProps {
  stats: StatsBadge;
}

/**
 * Calculate percentage of a value relative to total
 * @param value - The count to calculate percentage for
 * @param total - The total count
 * @returns Percentage as string with %
 */
function calculatePercentage(value: number, total: number): string {
  if (total === 0) return '0%';
  return `${Math.round((value / total) * 100)}%`;
}

/**
 * Renders a statistics bar with status breakdown and percentages
 * @param stats - Object with counts for each status
 * @returns Statistics component
 */
export const IdeaStatsBar: React.FC<IdeaStatsBarProps> = ({ stats }) => {
  const total = Object.values(stats).reduce((a, b) => a + b, 0);

  const statItems = [
    { label: 'Total Ideas', value: total, color: 'text-gray-900', bg: 'bg-gray-100' },
    { label: 'Draft', value: stats.draft, percentage: calculatePercentage(stats.draft, total), color: 'text-yellow-700', bg: 'bg-yellow-50' },
    { label: 'Submitted', value: stats.submitted, percentage: calculatePercentage(stats.submitted, total), color: 'text-blue-700', bg: 'bg-blue-50' },
    { label: 'Under Review', value: stats.underReview, percentage: calculatePercentage(stats.underReview, total), color: 'text-orange-700', bg: 'bg-orange-50' },
    { label: 'Approved', value: stats.approved, percentage: calculatePercentage(stats.approved, total), color: 'text-green-700', bg: 'bg-green-50' },
    { label: 'Rejected', value: stats.rejected, percentage: calculatePercentage(stats.rejected, total), color: 'text-red-700', bg: 'bg-red-50' },
  ];

  return (
    <div data-testid="stats-bar" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {statItems.map((item) => (
        <div key={item.label} className={`${item.bg} rounded-lg p-4`}>
          <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{item.label}</div>
          <div className={`text-2xl font-bold ${item.color} mt-2`}>
            {item.value}
            {item.percentage && <span className="text-xs ml-1">({item.percentage})</span>}
          </div>
        </div>
      ))}
    </div>
  );
};
