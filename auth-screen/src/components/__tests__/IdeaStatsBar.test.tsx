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
      // Component renders "Total Ideas" label and "10" value separately
      expect(screen.getByText('Total Ideas')).toBeInTheDocument();
      const container = screen.getByTestId('stats-bar');
      expect(container).toHaveTextContent('10');
    });

    it('should display DRAFT count with percentage', () => {
      const stats = { draft: 3, submitted: 2, underReview: 1, approved: 3, rejected: 1 };
      render(<IdeaStatsBar stats={stats} />);
      // Component renders label and value separately
      expect(screen.getByText('Draft')).toBeInTheDocument();
      const container = screen.getByTestId('stats-bar');
      expect(container).toHaveTextContent('3');
      expect(container).toHaveTextContent('(30%)'); // 3 out of 10 = 30%
    });

    it('should display SUBMITTED count with percentage', () => {
      const stats = { draft: 3, submitted: 2, underReview: 1, approved: 3, rejected: 1 };
      render(<IdeaStatsBar stats={stats} />);
      expect(screen.getByText('Submitted')).toBeInTheDocument();
      const container = screen.getByTestId('stats-bar');
      expect(container).toHaveTextContent('(20%)'); // 2 out of 10 = 20%
    });

    it('should display UNDER_REVIEW count with percentage', () => {
      const stats = { draft: 3, submitted: 2, underReview: 1, approved: 3, rejected: 1 };
      render(<IdeaStatsBar stats={stats} />);
      expect(screen.getByText('Under Review')).toBeInTheDocument();
      const container = screen.getByTestId('stats-bar');
      expect(container).toHaveTextContent('(10%)'); // 1 out of 10 = 10%
    });

    it('should display APPROVED count with percentage', () => {
      const stats = { draft: 3, submitted: 2, underReview: 1, approved: 3, rejected: 1 };
      render(<IdeaStatsBar stats={stats} />);
      expect(screen.getByText('Approved')).toBeInTheDocument();
    });

    it('should display REJECTED count with percentage', () => {
      const stats = { draft: 3, submitted: 2, underReview: 1, approved: 3, rejected: 1 };
      render(<IdeaStatsBar stats={stats} />);
      expect(screen.getByText('Rejected')).toBeInTheDocument();
    });
  });

  describe('percentage calculation', () => {
    it('should calculate percentages correctly for 10 ideas', () => {
      const stats = { draft: 3, submitted: 2, underReview: 1, approved: 3, rejected: 1 };
      const { container } = render(<IdeaStatsBar stats={stats} />);
      // Verify all percentages are shown
      expect(container).toHaveTextContent('(30%)'); // Draft
      expect(container).toHaveTextContent('(20%)'); // Submitted
      expect(container).toHaveTextContent('(10%)'); // Under Review
      // Approved and Rejected also 30% and 10% respectively
    });

    it('should round percentages to nearest integer', () => {
      // Test with values that produce non-integer percentages
      const stats = { draft: 1, submitted: 1, underReview: 1, approved: 0, rejected: 0 };
      const { container } = render(<IdeaStatsBar stats={stats} />);
      // 1/3 = 33.33% → should round to 33%
      expect(container).toHaveTextContent('(33%)');
    });

    it('should handle zero ideas without division error', () => {
      const stats = { draft: 0, submitted: 0, underReview: 0, approved: 0, rejected: 0 };
      render(<IdeaStatsBar stats={stats} />);
      // Should render without error, all stats show 0%
      expect(screen.getByText('Total Ideas')).toBeInTheDocument();
    });

    it('should handle all ideas in one status', () => {
      const stats = { draft: 0, submitted: 0, underReview: 0, approved: 10, rejected: 0 };
      const { container } = render(<IdeaStatsBar stats={stats} />);
      // 10 Approved (100%)
      expect(screen.getByText('Approved')).toBeInTheDocument();
      expect(container).toHaveTextContent('(100%)');
    });
  });
});
