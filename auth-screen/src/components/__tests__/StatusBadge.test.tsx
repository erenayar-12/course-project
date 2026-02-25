/**
 * StatusBadge Component Tests
 * 
 * Tests the color-coded status badge component (AC4)
 * Ensures proper rendering of all status types with correct styling
 * 
 * @file Unit tests for StatusBadge.tsx
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { StatusBadge } from '../StatusBadge';
import '@testing-library/jest-dom';

describe('StatusBadge', () => {
  describe('rendering', () => {
    // UT-2.3a-011
    it('should render DRAFT status with yellow background', () => {
      render(<StatusBadge status="DRAFT" />);
      const badge = screen.getByText('Draft');
      expect(badge).toBeInTheDocument();
      expect(badge.parentElement).toHaveClass('bg-yellow-100');
    });

    // UT-2.3a-012
    it('should render SUBMITTED status with blue background', () => {
      render(<StatusBadge status="SUBMITTED" />);
      const badge = screen.getByText('Submitted');
      expect(badge).toBeInTheDocument();
      expect(badge.parentElement).toHaveClass('bg-blue-100');
    });

    // UT-2.3a-013
    it('should render UNDER_REVIEW status with orange background', () => {
      render(<StatusBadge status="UNDER_REVIEW" />);
      const badge = screen.getByText('Under Review');
      expect(badge).toBeInTheDocument();
      expect(badge.parentElement).toHaveClass('bg-orange-100');
    });

    // UT-2.3a-014
    it('should render APPROVED status with green background', () => {
      render(<StatusBadge status="APPROVED" />);
      const badge = screen.getByText('Approved');
      expect(badge).toBeInTheDocument();
      expect(badge.parentElement).toHaveClass('bg-green-100');
    });

    it('should render REJECTED status with red background', () => {
      render(<StatusBadge status="REJECTED" />);
      const badge = screen.getByText('Rejected');
      expect(badge).toBeInTheDocument();
      expect(badge.parentElement).toHaveClass('bg-red-100');
    });

    it('should render as a badge component with proper styling', () => {
      const { container } = render(<StatusBadge status="APPROVED" />);

      const badge = container.querySelector('[data-testid="status-badge"]');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('inline-flex', 'px-3', 'py-1', 'rounded-full', 'text-sm');
    });
  });

  describe('accessibility', () => {
    it('should have proper semantic role', () => {
      render(<StatusBadge status="SUBMITTED" />);
      const badge = screen.getByRole('status');
      expect(badge).toBeInTheDocument();
    });

    it('should apply correct text color for contrast', () => {
      render(<StatusBadge status="SUBMITTED" />);
      const badge = screen.getByRole('status');
      expect(badge).toHaveClass('text-blue-800');
    });
  });
});
