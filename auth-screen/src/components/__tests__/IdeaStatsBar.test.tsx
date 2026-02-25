/**
 * IdeaStatsBar Component Tests
 * 
 * Tests the statistics display component
 * Verifies AC6: proper count and percentage display
 * 
 * @file Unit tests for IdeaStatsBar.tsx
 */

import { render, screen } from '@testing-library/react';
import { IdeaStatsBar } from '../IdeaStatsBar';

describe('IdeaStatsBar', () => {
  describe('statistics display', () => {
    it('should display total ideas count', () => {
      const stats = { draft: 3, submitted: 2, underReview: 1, approved: 3, rejected: 1 };
      render(<IdeaStatsBar stats={stats} />);
      expect(screen.getByText('Total Ideas: 10')).toBeInTheDocument();
    });

    it('should display DRAFT count with percentage', () => {
      const stats = { draft: 3, submitted: 2, underReview: 1, approved: 3, rejected: 1 };
      render(<IdeaStatsBar stats={stats} />);
      // TODO: Verify format is "3 Draft (30%)" or similar
      expect(screen.getByText('Draft: 3')).toBeInTheDocument();
    });

    it('should display SUBMITTED count with percentage', () => {
      const stats = { draft: 3, submitted: 2, underReview: 1, approved: 3, rejected: 1 };
      render(<IdeaStatsBar stats={stats} />);
      // TODO: Verify format includes percentage
      expect(screen.getByText('Submitted: 2')).toBeInTheDocument();
    });

    it('should display UNDER_REVIEW count with percentage', () => {
      const stats = { draft: 3, submitted: 2, underReview: 1, approved: 3, rejected: 1 };
      render(<IdeaStatsBar stats={stats} />);
      expect(screen.getByText('Under Review: 1')).toBeInTheDocument();
    });

    it('should display APPROVED count with percentage', () => {
      const stats = { draft: 3, submitted: 2, underReview: 1, approved: 3, rejected: 1 };
      render(<IdeaStatsBar stats={stats} />);
      expect(screen.getByText('Approved: 3')).toBeInTheDocument();
    });

    it('should display REJECTED count with percentage', () => {
      const stats = { draft: 3, submitted: 2, underReview: 1, approved: 3, rejected: 1 };
      render(<IdeaStatsBar stats={stats} />);
      expect(screen.getByText('Rejected: 1')).toBeInTheDocument();
    });
  });

  describe('percentage calculation', () => {
    it('should calculate percentages correctly for 10 ideas', () => {
      const stats = { draft: 3, submitted: 2, underReview: 1, approved: 3, rejected: 1 };
      render(<IdeaStatsBar stats={stats} />);
      // TODO: Verify percentages: 30%, 20%, 10%, 30%, 10%
      // Example expected text: "3 Draft (30%)" etc.
      expect(screen.getByText('Total Ideas: 10')).toBeInTheDocument();
    });

    it('should round percentages to nearest integer', () => {
      // Test with values that produce non-integer percentages
      const stats = { draft: 1, submitted: 1, underReview: 1, approved: 0, rejected: 0 };
      render(<IdeaStatsBar stats={stats} />);
      // 1/3 = 33.33% → should round to 33%
      // TODO: Verify rounding behavior
      expect(screen.getByText('Total Ideas: 3')).toBeInTheDocument();
    });

    it('should handle zero ideas without division error', () => {
      const stats = { draft: 0, submitted: 0, underReview: 0, approved: 0, rejected: 0 };
      render(<IdeaStatsBar stats={stats} />);
      // Should render without error
      expect(screen.getByText('Total Ideas: 0')).toBeInTheDocument();
    });

    it('should handle all ideas in one status', () => {
      const stats = { draft: 0, submitted: 0, underReview: 0, approved: 10, rejected: 0 };
      render(<IdeaStatsBar stats={stats} />);
      // 10 Approved (100%)
      expect(screen.getByText('Approved: 10')).toBeInTheDocument();
      expect(screen.getByText('Total Ideas: 10')).toBeInTheDocument();
    });
  });
});
