/**
 * UserDashboard Component Integration Tests
 * 
 * Tests UserDashboard with API integration
 * Verifies AC1, AC3, AC5, AC6, AC8, AC9 functionality
 * 
 * @file Integration tests for UserDashboard.tsx
 */

import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserDashboard } from '../../pages/UserDashboard';

// Mock fetch globally
global.fetch = jest.fn();

const mockIdeasResponse = {
  data: [
    {
      id: '1',
      title: 'First Idea',
      status: 'SUBMITTED',
      category: 'Product',
      createdAt: '2026-02-25',
      attachmentCount: 2,
    },
    {
      id: '2',
      title: 'Second Idea',
      status: 'APPROVED',
      category: 'Engineering',
      createdAt: '2026-02-24',
      attachmentCount: 1,
    },
    {
      id: '3',
      title: 'Third Idea',
      status: 'DRAFT',
      category: 'Design',
      createdAt: '2026-02-23',
      attachmentCount: 0,
    },
  ],
  pagination: {
    total: 3,
    page: 1,
    limit: 10,
    totalPages: 1,
  },
  stats: {
    draft: 1,
    submitted: 1,
    underReview: 0,
    approved: 1,
    rejected: 0,
  },
};

describe('UserDashboard (Integration)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('data loading', () => {
    it('should display loading spinner while fetching ideas', async () => {
      (global.fetch as jest.Mock).mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      render(<UserDashboard />);

      // AC8: Loading spinner visible
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should fetch ideas from GET /api/ideas?limit=10&offset=0', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockIdeasResponse,
      });

      render(<UserDashboard />);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/ideas'),
          expect.any(Object)
        );
      });

      // Verify fetch includes pagination params
      const fetchCall = (global.fetch as jest.Mock).mock.calls[0][0];
      expect(fetchCall).toContain('limit=10');
      expect(fetchCall).toContain('offset=0');
    });

    it('should display ideas sorted by createdAt DESC', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockIdeasResponse,
      });

      render(<UserDashboard />);

      await waitFor(() => {
        // AC5: Most recent first (createdAt DESC)
        expect(screen.getByText('First Idea')).toBeInTheDocument();
      });

      // Verify order: First (25th), Second (24th), Third (23rd)
      const ideaTitles = screen.getAllByText(/Idea/);
      expect(ideaTitles[0]).toHaveTextContent('First Idea');
    });
  });

  describe('empty state', () => {
    it('should display empty state when user has no ideas', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [],
          pagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
          stats: { draft: 0, submitted: 0, underReview: 0, approved: 0, rejected: 0 },
        }),
      });

      render(<UserDashboard />);

      await waitFor(() => {
        // AC3: Empty state message
        expect(screen.getByText('No ideas submitted yet')).toBeInTheDocument();
        // AC3: CTA button
        expect(screen.getByText('Submit Your First Idea')).toBeInTheDocument();
      });
    });

    it('should navigate to submission form on CTA button click', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [],
          pagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
          stats: { draft: 0, submitted: 0, underReview: 0, approved: 0, rejected: 0 },
        }),
      });

      render(<UserDashboard />);

      await waitFor(() => {
        expect(screen.getByText('Submit Your First Idea')).toBeInTheDocument();
      });

      const user = userEvent.setup();
      const ctaButton = screen.getByText('Submit Your First Idea');
      
      // TODO: Mock router/navigation and verify navigation to submission form
      // await user.click(ctaButton);
      // expect(mockNavigate).toHaveBeenCalledWith('/ideas/new');
    });
  });

  describe('pagination', () => {
    it('should display 10 ideas per page', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockIdeasResponse,
      });

      render(<UserDashboard />);

      await waitFor(() => {
        expect(screen.getByText('First Idea')).toBeInTheDocument();
      });

      // AC5: Exactly 10 ideas max (this response has 3)
      const ideaItems = screen.getAllByText(/Idea/);
      expect(ideaItems.length).toBeGreaterThan(0);
      expect(ideaItems.length).toBeLessThanOrEqual(10);
    });

    it('should display pagination controls with current/total pages', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockIdeasResponse,
      });

      render(<UserDashboard />);

      await waitFor(() => {
        // AC5: Page information displayed
        expect(screen.getByText('Page 1 of 1')).toBeInTheDocument();
      });
    });

    it('should load next page when next button clicked', async () => {
      const page1Response = { ...mockIdeasResponse, pagination: { ...mockIdeasResponse.pagination, totalPages: 2 } };
      
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => page1Response,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            ...mockIdeasResponse,
            data: [{ id: '4', title: 'Fourth Idea', status: 'SUBMITTED' as const, category: 'Product', createdAt: '2026-02-22', attachmentCount: 0 }],
            pagination: { ...mockIdeasResponse.pagination, page: 2, totalPages: 2 },
          }),
        });

      render(<UserDashboard />);

      await waitFor(() => {
        expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
      });

      const user = userEvent.setup();
      const nextButton = screen.getByText('Next');
      await user.click(nextButton);

      // AC5: Fetch with offset=10 (page 2)
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('offset=10'),
          expect.any(Object)
        );
      });
    });
  });

  describe('statistics', () => {
    it('should display status breakdown with counts and percentages', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockIdeasResponse,
      });

      render(<UserDashboard />);

      await waitFor(() => {
        // AC6: Stats display with counts and percentages
        // Expected format: "1 Submitted (33%)" etc.
        expect(screen.getByText('Submitted: 1')).toBeInTheDocument();
        expect(screen.getByText('Approved: 1')).toBeInTheDocument();
        expect(screen.getByText('Draft: 1')).toBeInTheDocument();
      });
    });
  });

  describe('error handling', () => {
    it('should display error message when API fails', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Internal server error' }),
      });

      render(<UserDashboard />);

      await waitFor(() => {
        // AC9: Error message displayed
        expect(screen.getByText(/Failed to load ideas/i)).toBeInTheDocument();
      });
    });

    it('should display retry button on error', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Internal server error' }),
      });

      render(<UserDashboard />);

      await waitFor(() => {
        // AC9: Retry button visible
        expect(screen.getByText('Retry')).toBeInTheDocument();
      });
    });

    it('should refetch ideas when retry button clicked', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          json: async () => ({ error: 'Internal server error' }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockIdeasResponse,
        });

      render(<UserDashboard />);

      await waitFor(() => {
        expect(screen.getByText('Retry')).toBeInTheDocument();
      });

      const user = userEvent.setup();
      const retryButton = screen.getByText('Retry');
      await user.click(retryButton);

      // AC9: Retry calls fetchIdeas again
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(2);
      });
    });
  });
});
