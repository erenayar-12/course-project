/**
 * Statistics Calculator Tests
 * 
 * Tests pure functions for statistics aggregation and calculation
 * Verifies AC6: statistics with counts and percentages
 * 
 * @file Unit tests for statisticsCalculator.ts
 */

import {
  aggregateStatuses,
  calculatePercentages,
  getStatsByReadableName,
} from '../../utils/statisticsCalculator';

describe('statisticsCalculator', () => {
  describe('aggregateStatuses', () => {
    it('should count each status correctly', () => {
      const ideas = [
        { id: '1', status: 'DRAFT' as const },
        { id: '2', status: 'DRAFT' as const },
        { id: '3', status: 'APPROVED' as const },
        { id: '4', status: 'SUBMITTED' as const },
      ];
      
      const result = aggregateStatuses(ideas);
      
      expect(result.draft).toBe(2);
      expect(result.approved).toBe(1);
      expect(result.submitted).toBe(1);
      expect(result.underReview).toBe(0);
      expect(result.rejected).toBe(0);
    });

    it('should return zero counts for empty ideas list', () => {
      const ideas: any[] = [];
      const result = aggregateStatuses(ideas);
      
      expect(result.draft).toBe(0);
      expect(result.submitted).toBe(0);
      expect(result.underReview).toBe(0);
      expect(result.approved).toBe(0);
      expect(result.rejected).toBe(0);
    });

    it('should handle all statuses', () => {
      const ideas = [
        { id: '1', status: 'DRAFT' as const },
        { id: '2', status: 'SUBMITTED' as const },
        { id: '3', status: 'UNDER_REVIEW' as const },
        { id: '4', status: 'APPROVED' as const },
        { id: '5', status: 'REJECTED' as const },
      ];
      
      const result = aggregateStatuses(ideas);
      
      expect(result.draft).toBe(1);
      expect(result.submitted).toBe(1);
      expect(result.underReview).toBe(1);
      expect(result.approved).toBe(1);
      expect(result.rejected).toBe(1);
    });
  });

  describe('calculatePercentages', () => {
    it('should return percentage for each status', () => {
      const stats = {
        draft: 3,
        submitted: 2,
        underReview: 1,
        approved: 3,
        rejected: 1,
      };
      
      const result = calculatePercentages(stats);
      
      expect(result.draft).toBe(30);
      expect(result.submitted).toBe(20);
      expect(result.underReview).toBe(10);
      expect(result.approved).toBe(30);
      expect(result.rejected).toBe(10);
    });

    it('should handle edge case: 0 total ideas', () => {
      const stats = {
        draft: 0,
        submitted: 0,
        underReview: 0,
        approved: 0,
        rejected: 0,
      };
      
      const result = calculatePercentages(stats);
      
      // All should be 0 without throwing division error
      expect(result.draft).toBe(0);
      expect(result.submitted).toBe(0);
    });

    it('should handle rounding correctly', () => {
      // 1/3 = 33.33... should round to 33
      const stats = {
        draft: 1,
        submitted: 1,
        underReview: 1,
        approved: 0,
        rejected: 0,
      };
      
      const result = calculatePercentages(stats);
      
      // Each should be roughly 33% (accounting for rounding of 3 items)
      expect(result.draft + result.submitted + result.underReview).toBeCloseTo(100, 0);
    });

    it('should handle all ideas in one status', () => {
      const stats = {
        draft: 0,
        submitted: 0,
        underReview: 0,
        approved: 10,
        rejected: 0,
      };
      
      const result = calculatePercentages(stats);
      
      expect(result.approved).toBe(100);
      expect(result.draft).toBe(0);
      expect(result.submitted).toBe(0);
    });

    it('should sum to approximately 100%', () => {
      const stats = {
        draft: 5,
        submitted: 3,
        underReview: 2,
        approved: 7,
        rejected: 3,
      };
      
      const result = calculatePercentages(stats);
      const sum = Object.values(result).reduce((a, b) => a + b, 0);
      
      expect(sum).toBeCloseTo(100, 0);
    });
  });

  describe('getStatsByReadableName', () => {
    it('should return stats keyed by readable status name', () => {
      const stats = {
        draft: 3,
        submitted: 2,
        underReview: 1,
        approved: 3,
        rejected: 1,
      };
      
      const result = getStatsByReadableName(stats);
      
      expect(result['Draft']).toBe(3);
      expect(result['Submitted']).toBe(2);
      expect(result['Under Review']).toBe(1);
      expect(result['Approved']).toBe(3);
      expect(result['Rejected']).toBe(1);
    });

    it('should work with percentage values', () => {
      const percentages = {
        draft: 30,
        submitted: 20,
        underReview: 10,
        approved: 30,
        rejected: 10,
      };
      
      const result = getStatsByReadableName(percentages);
      
      expect(result['Draft']).toBe(30);
      expect(result['Submitted']).toBe(20);
    });

    it('should have all status types', () => {
      const stats = {
        draft: 1,
        submitted: 1,
        underReview: 1,
        approved: 1,
        rejected: 1,
      };
      
      const result = getStatsByReadableName(stats);
      
      expect(Object.keys(result).length).toBe(5);
      expect(result).toHaveProperty('Draft');
      expect(result).toHaveProperty('Submitted');
      expect(result).toHaveProperty('Under Review');
      expect(result).toHaveProperty('Approved');
      expect(result).toHaveProperty('Rejected');
    });
  });
});
