/**
 * Pagination Utilities
 * 
 * Pure functions for calculating pagination values.
 * Used to support AC5: Pagination controls with proper offset calculations
 */

const ITEMS_PER_PAGE = 10;

/**
 * Calculate API offset based on page number (1-indexed)
 * @param page - Page number (1-indexed)
 * @returns Offset value for API call (0-indexed)
 * @example calculatePageOffset(1) // 0
 * @example calculatePageOffset(2) // 10
 */
export function calculatePageOffset(page: number): number {
  return (page - 1) * ITEMS_PER_PAGE;
}

/**
 * Calculate total number of pages given total idea count
 * @param totalIdeas - Total number of ideas
 * @returns Number of pages required (ceiling division by 10), minimum 1
 * @example calculateTotalPages(0) // 1
 * @example calculateTotalPages(10) // 1
 * @example calculateTotalPages(11) // 2
 * @example calculateTotalPages(25) // 3
 */
export function calculateTotalPages(totalIdeas: number): number {
  return Math.max(1, Math.ceil(totalIdeas / ITEMS_PER_PAGE));
}

/**
 * Check if current page is the last page
 * @param currentPage - Current page number
 * @param totalPages - Total number of pages
 * @returns True if on last page, false if invalid or not on last page
 * @example isLastPage(3, 3) // true
 * @example isLastPage(2, 3) // false
 * @example isLastPage(5, 3) // false (invalid: page > totalPages)
 * @example isLastPage(0, 5) // false (invalid: page 0)
 */
export function isLastPage(currentPage: number, totalPages: number): boolean {
  // Return false for invalid states (page <= 0 or page > totalPages)
  if (currentPage <= 0 || currentPage > totalPages) {
    return false;
  }
  return currentPage === totalPages;
}
