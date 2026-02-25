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
      const badge = screen.getByTestId('status-badge');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('bg-yellow-100');
      expect(badge).toHaveTextContent('Draft');
    });

    // UT-2.3a-012
    it('should render SUBMITTED status with blue background', () => {
      render(<StatusBadge status="SUBMITTED" />);
      const badge = screen.getByTestId('status-badge');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('bg-blue-100');
      expect(badge).toHaveTextContent('Submitted');
    });

    // UT-2.3a-013
    it('should render UNDER_REVIEW status with orange background', () => {
      render(<StatusBadge status="UNDER_REVIEW" />);
      const badge = screen.getByTestId('status-badge');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('bg-orange-100');
      expect(badge).toHaveTextContent('Under Review');
    });

    // UT-2.3a-014
    it('should render APPROVED status with green background', () => {
      render(<StatusBadge status="APPROVED" />);
      const badge = screen.getByTestId('status-badge');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('bg-green-100');
      expect(badge).toHaveTextContent('Approved');
    });

    it('should render REJECTED status with red background', () => {
      render(<StatusBadge status="REJECTED" />);
      const badge = screen.getByTestId('status-badge');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('bg-red-100');
      expect(badge).toHaveTextContent('Rejected');
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
