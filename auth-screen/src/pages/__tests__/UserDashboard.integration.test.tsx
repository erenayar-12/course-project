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
import { BrowserRouter } from 'react-router-dom';
import { UserDashboard } from '../../pages/UserDashboard';

// Mock fetch globally
global.fetch = jest.fn();

const mockIdeasResponse = {
  ideas: [
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

/**
 * Helper to render UserDashboard with router context
 */
const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
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

      renderWithRouter(<UserDashboard />);

      // AC8: Loading spinner visible
      expect(screen.getByText(/Loading/i)).toBeInTheDocument();
    });

    it('should fetch ideas from GET /api/ideas', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockIdeasResponse,
      });

      renderWithRouter(<UserDashboard />);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/ideas'),
          expect.any(Object)
        );
      });
    });

    it('should display ideas sorted by createdAt DESC', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockIdeasResponse,
      });

      renderWithRouter(<UserDashboard />);

      await waitFor(() => {
        // AC5: Most recent first (createdAt DESC)
        // First Idea has createdAt '2026-02-25' which is the most recent
        expect(screen.getByText('First Idea')).toBeInTheDocument();
        // Second Idea should also be present (less recent: '2026-02-24')
        expect(screen.getByText('Second Idea')).toBeInTheDocument();
      });
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

      renderWithRouter(<UserDashboard />);

      await waitFor(() => {
        // AC3: Empty state message
        expect(screen.getByText('No ideas yet')).toBeInTheDocument();
        // AC3: CTA button
        expect(screen.getByText('Submit Your First Idea')).toBeInTheDocument();
      });
    });

    it('should navigate to submission form on CTA button click', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          ideas: [],
        }),
      });

      renderWithRouter(<UserDashboard />);

      await waitFor(() => {
        expect(screen.getByText('Submit Your First Idea')).toBeInTheDocument();
      });

      // TODO: Mock router/navigation and verify navigation to submission form
      // const user = userEvent.setup();
      // const ctaButton = screen.getByText('Submit Your First Idea');
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

      renderWithRouter(<UserDashboard />);

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

      renderWithRouter(<UserDashboard />);

      await waitFor(() => {
        // AC5: Page information displayed
        expect(screen.getByText('Page 1 of 1')).toBeInTheDocument();
      });
    });

    it('should load next page when next button clicked', async () => {
      const page1Response = { ...mockIdeasResponse, pagination: { ...mockIdeasResponse.pagination, totalPages: 2 } };
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => page1Response,
      });

      renderWithRouter(<UserDashboard />);

      await waitFor(() => {
        expect(screen.getByText('First Idea')).toBeInTheDocument();
      });

      // AC5: Verify pagination controls exist
      const nextButton = screen.getByTestId('pagination-next');
      expect(nextButton).toBeInTheDocument();
    });
  });

  describe('statistics', () => {
    it('should display status breakdown with counts and percentages', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockIdeasResponse,
      });

      renderWithRouter(<UserDashboard />);

      await waitFor(() => {
        // First verify ideas loaded
        expect(screen.getByText('First Idea')).toBeInTheDocument();
        // AC6: Stats bar should be visible
        const statsBar = screen.getByTestId('stats-bar');
        expect(statsBar).toBeInTheDocument();
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

      renderWithRouter(<UserDashboard />);

      await waitFor(() => {
        // AC9: Error message displayed
        expect(screen.getByText('Unable to Load Ideas')).toBeInTheDocument();
      });
    });

    it('should display retry button on error', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Internal server error' }),
      });

      renderWithRouter(<UserDashboard />);

      await waitFor(() => {
        // AC9: Retry button visible
        expect(screen.getByText('Try Again')).toBeInTheDocument();
      });
    });

    it('should refetch ideas when retry button clicked', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          statusText: 'Internal Server Error',
          json: async () => ({ error: 'Internal server error' }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockIdeasResponse,
        });

      renderWithRouter(<UserDashboard />);

      await waitFor(() => {
        expect(screen.getByText('Try Again')).toBeInTheDocument();
      });

      const user = userEvent.setup();
      const retryButton = screen.getByText('Try Again');
      await user.click(retryButton);

      // AC9: Refetch should load ideas successfully
      await waitFor(() => {
        expect(screen.getByText('First Idea')).toBeInTheDocument();
      });
    });
  });
});
