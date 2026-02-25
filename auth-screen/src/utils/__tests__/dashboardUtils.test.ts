/**
 * dashboardUtils.test.ts
 * Unit tests for dashboard utility functions
 * STORY-2.3a: User Dashboard - Test Suite
 * 
 * Test pyramid: 100% unit tests (pure functions)
 * No external dependencies, no API calls
 */

import {
  calculatePaginatedIdeas,
  formatDateForDisplay,
  calculateApprovalPercentage,
  filterIdeasByStatus,
  sortIdeasByDate,
} from '../dashboardUtils';

describe('dashboardUtils', () => {
  describe('calculatePaginatedIdeas', () => {
    // UT-2.3a-023
    it('should return first 10 items for page 1', () => {
      const ideas = Array.from({ length: 25 }, (_, i) => ({
        id: `idea-${i}`,
        title: `Idea ${i}`,
        status: 'SUBMITTED' as const,
        category: 'TECH' as const,
        createdAt: new Date(),
      }));
      const result = calculatePaginatedIdeas(ideas, 1, 10);

      expect(result).toHaveLength(10);
      expect(result[0].id).toBe('idea-0');
      expect(result[9].id).toBe('idea-9');
    });

    // UT-2.3a-024
    it('should return items 10-19 for page 2', () => {
      const ideas = Array.from({ length: 25 }, (_, i) => ({
        id: `idea-${i}`,
        title: `Idea ${i}`,
        status: 'SUBMITTED' as const,
        category: 'TECH' as const,
        createdAt: new Date(),
      }));
      const result = calculatePaginatedIdeas(ideas, 2, 10);

      expect(result).toHaveLength(10);
      expect(result[0].id).toBe('idea-10');
      expect(result[9].id).toBe('idea-19');
    });

    // UT-2.3a-025
    it('should handle page >= total pages gracefully', () => {
      const ideas = Array.from({ length: 15 }, (_, i) => ({
        id: `idea-${i}`,
        title: `Idea ${i}`,
        status: 'SUBMITTED' as const,
        category: 'TECH' as const,
        createdAt: new Date(),
      }));
      const result = calculatePaginatedIdeas(ideas, 5, 10); // Page way beyond available

      expect(result).toHaveLength(0); // Empty page or last partial page handling
    });

    it('should return remaining items on last page', () => {
      const ideas = Array.from({ length: 25 }, (_, i) => ({
        id: `idea-${i}`,
        title: `Idea ${i}`,
        status: 'SUBMITTED' as const,
        category: 'TECH' as const,
        createdAt: new Date(),
      }));
      const result = calculatePaginatedIdeas(ideas, 3, 10); // Page 3 has 5 items

      expect(result).toHaveLength(5);
      expect(result[0].id).toBe('idea-20');
      expect(result[4].id).toBe('idea-24');
    });
  });

  describe('formatDateForDisplay', () => {
    // UT-2.3a-026
    it('should format ISO date to MM/DD/YYYY', () => {
      const isoDate = '2026-02-24T10:30:00Z';
      const result = formatDateForDisplay(new Date(isoDate));

      expect(result).toBe('02/24/2026');
    });

    // UT-2.3a-027
    it('should handle invalid date gracefully', () => {
      const invalidDate = new Date('invalid');
      const result = formatDateForDisplay(invalidDate);

      expect(result).toMatch(/invalid|error|n\/a/i); // Should return error indicator
    });

    it('should format various dates correctly', () => {
      expect(formatDateForDisplay(new Date('2025-01-01'))).toBe('01/01/2025');
      expect(formatDateForDisplay(new Date('2026-12-25'))).toBe('12/25/2026');
      expect(formatDateForDisplay(new Date('2026-09-09'))).toBe('09/09/2026');
    });
  });

  describe('calculateApprovalPercentage', () => {
    // UT-2.3a-028
    it('should return 100% when all ideas approved', () => {
      const ideas = [
        { id: '1', status: 'APPROVED' as const, title: 'Idea 1', category: 'TECH' as const, createdAt: new Date() },
        { id: '2', status: 'APPROVED' as const, title: 'Idea 2', category: 'TECH' as const, createdAt: new Date() },
        { id: '3', status: 'APPROVED' as const, title: 'Idea 3', category: 'TECH' as const, createdAt: new Date() },
      ];
      const result = calculateApprovalPercentage(ideas);

      expect(result).toBe(100);
    });

    // UT-2.3a-029
    it('should return 0% when no ideas approved', () => {
      const ideas = [
        { id: '1', status: 'SUBMITTED' as const, title: 'Idea 1', category: 'TECH' as const, createdAt: new Date() },
        { id: '2', status: 'UNDER_REVIEW' as const, title: 'Idea 2', category: 'TECH' as const, createdAt: new Date() },
        { id: '3', status: 'REJECTED' as const, title: 'Idea 3', category: 'TECH' as const, createdAt: new Date() },
      ];
      const result = calculateApprovalPercentage(ideas);

      expect(result).toBe(0);
    });

    // UT-2.3a-030
    it('should calculate correct percentage for mixed ideas', () => {
      const ideas = [
        { id: '1', status: 'APPROVED' as const, title: 'Idea 1', category: 'TECH' as const, createdAt: new Date() },
        { id: '2', status: 'APPROVED' as const, title: 'Idea 2', category: 'TECH' as const, createdAt: new Date() },
        { id: '3', status: 'SUBMITTED' as const, title: 'Idea 3', category: 'TECH' as const, createdAt: new Date() },
        { id: '4', status: 'REJECTED' as const, title: 'Idea 4', category: 'TECH' as const, createdAt: new Date() },
      ];
      const result = calculateApprovalPercentage(ideas);

      // 2 approved out of 4 = 50%
      expect(result).toBe(50);
    });

    // UT-2.3a-031
    it('should handle division by zero (no ideas)', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ideas: any[] = [];
      const result = calculateApprovalPercentage(ideas);

      // Should return 0 or NaN depending on implementation
      expect([0, NaN]).toContain(result);
    });

    it('should round percentage to nearest integer', () => {
      const ideas = [
        { id: '1', status: 'APPROVED' as const, title: 'Idea 1', category: 'TECH' as const, createdAt: new Date() },
        { id: '2', status: 'SUBMITTED' as const, title: 'Idea 2', category: 'TECH' as const, createdAt: new Date() },
        { id: '3', status: 'SUBMITTED' as const, title: 'Idea 3', category: 'TECH' as const, createdAt: new Date() },
      ];
      const result = calculateApprovalPercentage(ideas);

      // 1/3 = 33.33%, should round to 33
      expect(result).toBe(33);
    });
  });

  describe('filterIdeasByStatus', () => {
    it('should filter ideas by single status', () => {
      const ideas = [
        { id: '1', status: 'SUBMITTED' as const, title: 'Idea 1', category: 'TECH' as const, createdAt: new Date() },
        { id: '2', status: 'APPROVED' as const, title: 'Idea 2', category: 'TECH' as const, createdAt: new Date() },
        { id: '3', status: 'SUBMITTED' as const, title: 'Idea 3', category: 'TECH' as const, createdAt: new Date() },
      ];
      const result = filterIdeasByStatus(ideas, 'SUBMITTED');

      expect(result).toHaveLength(2);
      expect(result.map(i => i.id)).toEqual(['1', '3']);
    });

    it('should return empty array for non-matching status', () => {
      const ideas = [{ id: '1', status: 'SUBMITTED' as const, title: 'Idea 1', category: 'TECH' as const, createdAt: new Date() }];
      const result = filterIdeasByStatus(ideas, 'REJECTED');

      expect(result).toHaveLength(0);
    });
  });

  describe('sortIdeasByDate', () => {
    it('should sort ideas by createdAt DESC (newest first)', () => {
      const ideas = [
        { id: '1', title: 'Idea 1', status: 'SUBMITTED' as const, category: 'TECH' as const, createdAt: new Date('2026-02-20') },
        { id: '2', title: 'Idea 2', status: 'SUBMITTED' as const, category: 'TECH' as const, createdAt: new Date('2026-02-25') },
        { id: '3', title: 'Idea 3', status: 'SUBMITTED' as const, category: 'TECH' as const, createdAt: new Date('2026-02-22') },
      ];
      const result = sortIdeasByDate(ideas, 'DESC');

      expect(result[0].id).toBe('2'); // Newest
      expect(result[1].id).toBe('3');
      expect(result[2].id).toBe('1'); // Oldest
    });

    it('should sort ideas by createdAt ASC (oldest first)', () => {
      const ideas = [
        { id: '1', title: 'Idea 1', status: 'SUBMITTED' as const, category: 'TECH' as const, createdAt: new Date('2026-02-20') },
        { id: '2', title: 'Idea 2', status: 'SUBMITTED' as const, category: 'TECH' as const, createdAt: new Date('2026-02-25') },
        { id: '3', title: 'Idea 3', status: 'SUBMITTED' as const, category: 'TECH' as const, createdAt: new Date('2026-02-22') },
      ];
      const result = sortIdeasByDate(ideas, 'ASC');

      expect(result[0].id).toBe('1'); // Oldest
      expect(result[1].id).toBe('3');
      expect(result[2].id).toBe('2'); // Newest
    });
  });
});
