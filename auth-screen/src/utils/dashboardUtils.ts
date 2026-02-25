/**
 * dashboardUtils.ts
 * Utility functions for the User Dashboard (STORY-2.3a)
 * 
 * Pure functions for pagination, date formatting, and statistics calculation
 * No external dependencies - easy to test and maintain
 */

/**
 * Interface for Idea object used in dashboard
 */
export interface DashboardIdea {
  id: string;
  title: string;
  status: 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
  category: string;
  createdAt: Date | string;
  attachmentCount?: number;
}

/**
 * Calculate paginated subset of ideas
 * @param ideas - Array of all ideas
 * @param page - Current page number (1-indexed)
 * @param itemsPerPage - Items to show per page (default 10)
 * @returns Paginated subset of ideas
 */
export function calculatePaginatedIdeas(
  ideas: DashboardIdea[],
  page: number,
  itemsPerPage: number = 10
): DashboardIdea[] {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return ideas.slice(startIndex, endIndex);
}

/**
 * Format date to MM/DD/YYYY format
 * @param date - Date to format
 * @returns Formatted date string or error indicator
 */
export function formatDateForDisplay(date: Date): string {
  try {
    if (!date || isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${month}/${day}/${year}`;
  } catch (error) {
    return 'Error formatting date';
  }
}

/**
 * Calculate approval percentage for ideas
 * @param ideas - Array of ideas
 * @returns Percentage of approved ideas (0-100), or 0 if no ideas
 */
export function calculateApprovalPercentage(ideas: DashboardIdea[]): number {
  if (ideas.length === 0) return 0;
  
  const approvedCount = ideas.filter(idea => idea.status === 'APPROVED').length;
  const percentage = (approvedCount / ideas.length) * 100;
  
  return Math.round(percentage);
}

/**
 * Filter ideas by status
 * @param ideas - Array of ideas
 * @param status - Status to filter by
 * @returns Filtered array of ideas
 */
export function filterIdeasByStatus(
  ideas: DashboardIdea[],
  status: DashboardIdea['status']
): DashboardIdea[] {
  return ideas.filter(idea => idea.status === status);
}

/**
 * Sort ideas by creation date
 * @param ideas - Array of ideas to sort
 * @param order - 'ASC' for oldest first, 'DESC' for newest first (default 'DESC')
 * @returns Sorted array of ideas
 */
export function sortIdeasByDate(
  ideas: DashboardIdea[],
  order: 'ASC' | 'DESC' = 'DESC'
): DashboardIdea[] {
  return [...ideas].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    
    return order === 'DESC' ? dateB - dateA : dateA - dateB;
  });
}

/**
 * Calculate dashboard statistics
 * @param ideas - Array of ideas
 * @returns Object with total ideas, approval percentage, and pending count
 */
export interface DashboardStatistics {
  totalIdeas: number;
  approvalPercentage: number;
  approvedCount: number;
  pendingReviewCount: number;
  rejectedCount: number;
}

export function calculateDashboardStatistics(ideas: DashboardIdea[]): DashboardStatistics {
  const totalIdeas = ideas.length;
  const approvedCount = ideas.filter(i => i.status === 'APPROVED').length;
  const pendingReviewCount = ideas.filter(
    i => i.status === 'SUBMITTED' || i.status === 'UNDER_REVIEW' || i.status === 'DRAFT'
  ).length;
  const rejectedCount = ideas.filter(i => i.status === 'REJECTED').length;
  const approvalPercentage = calculateApprovalPercentage(ideas);
  
  return {
    totalIdeas,
    approvalPercentage,
    approvedCount,
    pendingReviewCount,
    rejectedCount,
  };
}

/**
 * Build pagination state object
 * @param totalItems - Total number of items
 * @param currentPage - Current page (1-indexed)
 * @param itemsPerPage - Items per page
 * @returns Pagination state
 */
export interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  canGoNext: boolean;
  canGoPrev: boolean;
  startItem: number;
  endItem: number;
}

export function calculatePaginationState(
  totalItems: number,
  currentPage: number,
  itemsPerPage: number = 10
): PaginationState {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const canGoNext = currentPage < totalPages;
  const canGoPrev = currentPage > 1;
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  
  return {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    canGoNext,
    canGoPrev,
    startItem,
    endItem,
  };
}
