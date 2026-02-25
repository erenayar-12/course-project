/**
 * Pagination Utilities Tests
 * 
 * Tests pure functions for pagination calculations
 * Verifies AC5 pagination offset and page calculations
 * 
 * @file Unit tests for paginationUtils.ts
 */

import {
  calculatePageOffset,
  calculateTotalPages,
  isLastPage,
} from '../../utils/paginationUtils';

describe('paginationUtils', () => {
  describe('calculatePageOffset', () => {
    it('should return 0 for page 1', () => {
      expect(calculatePageOffset(1)).toBe(0);
    });

    it('should return 10 for page 2', () => {
      expect(calculatePageOffset(2)).toBe(10);
    });

    it('should return correct offset for arbitrary page', () => {
      expect(calculatePageOffset(3)).toBe(20);
      expect(calculatePageOffset(5)).toBe(40);
      expect(calculatePageOffset(10)).toBe(90);
    });

    it('should handle page 0 (edge case)', () => {
      // page 0 is invalid but should return -10 mathematically
      expect(calculatePageOffset(0)).toBe(-10);
    });
  });

  describe('calculateTotalPages', () => {
    it('should return 1 for exactly 10 ideas', () => {
      expect(calculateTotalPages(10)).toBe(1);
    });

    it('should return 1 for fewer than 10 ideas', () => {
      expect(calculateTotalPages(1)).toBe(1);
      expect(calculateTotalPages(5)).toBe(1);
      expect(calculateTotalPages(9)).toBe(1);
    });

    it('should return 2 for 11-20 ideas', () => {
      expect(calculateTotalPages(11)).toBe(2);
      expect(calculateTotalPages(15)).toBe(2);
      expect(calculateTotalPages(20)).toBe(2);
    });

    it('should round up for non-divisible counts', () => {
      expect(calculateTotalPages(21)).toBe(3);
      expect(calculateTotalPages(25)).toBe(3);
      expect(calculateTotalPages(31)).toBe(4);
    });

    it('should return 1 for 0 ideas', () => {
      expect(calculateTotalPages(0)).toBe(1);
    });

    it('should handle large numbers', () => {
      expect(calculateTotalPages(1000)).toBe(100);
      expect(calculateTotalPages(1001)).toBe(101);
    });
  });

  describe('isLastPage', () => {
    it('should return true when on last page', () => {
      expect(isLastPage(1, 1)).toBe(true);
      expect(isLastPage(3, 3)).toBe(true);
      expect(isLastPage(10, 10)).toBe(true);
    });

    it('should return false when not on last page', () => {
      expect(isLastPage(1, 2)).toBe(false);
      expect(isLastPage(2, 3)).toBe(false);
      expect(isLastPage(5, 10)).toBe(false);
    });

    it('should return false for invalid combinations', () => {
      expect(isLastPage(5, 3)).toBe(false); // page > totalPages
      expect(isLastPage(0, 5)).toBe(false); // page 0
    });
  });
});
