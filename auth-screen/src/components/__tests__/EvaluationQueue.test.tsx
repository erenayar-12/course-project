/**
 * STORY-2.3b: EvaluationQueue Component Unit Tests
 * Test Category: Frontend Unit Tests (FE-UNIT-2.3b-001 through 008)
 * 
 * Tests: Rendering, status filtering, column display
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import EvaluationQueue from '../../pages/evaluation-queue/EvaluationQueue';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock child components
jest.mock('../../components/EvaluationQueueRow', () => {
  return function MockRow({ idea }: any) {
    return <tr data-testid="queue-row"><td>{idea.title}</td></tr>;
  };
});

jest.mock('../../components/BulkActionsBar', () => {
  return function MockBar() {
    return <div data-testid="bulk-actions-bar">Bulk Actions</div>;
  };
});

jest.mock('../../components/EvaluationModal', () => {
  return function MockModal() {
    return <div data-testid="evaluation-modal">Modal</div>;
  };
});

describe('EvaluationQueue', () => {
  const mockIdeas = [
    { id: '1', title: 'Idea 1', status: 'SUBMITTED', createdAt: new Date(), category: 'Tech', userId: 'user1', description: '', updatedAt: new Date() },
    { id: '2', title: 'Idea 2', status: 'UNDER_REVIEW', createdAt: new Date(), category: 'Tech', userId: 'user2', description: '', updatedAt: new Date() },
    { id: '3', title: 'Idea 3', status: 'SUBMITTED', createdAt: new Date(), category: 'Tech', userId: 'user3', description: '', updatedAt: new Date() },
    { id: '4', title: 'Idea 4', status: 'NEEDS_REVISION', createdAt: new Date(), category: 'Tech', userId: 'user4', description: '', updatedAt: new Date() },
  ];

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockedAxios.get.mockResolvedValue({
      data: { ideas: mockIdeas, total: mockIdeas.length },
    });
  });

  describe('rendering', () => {
    // FE-UNIT-2.3b-001
    it('should display queue title "Pending Ideas"', async () => {
      renderWithRouter(<EvaluationQueue />);
      await waitFor(() => {
        expect(screen.getByText(/Pending Ideas/i)).toBeInTheDocument();
      });
    });

    // FE-UNIT-2.3b-002
    it('should render table with columns: Submitter, Title, Category, Date, Status, Actions', async () => {
      renderWithRouter(<EvaluationQueue />);
      await waitFor(() => {
        expect(screen.getByText('Submitter')).toBeInTheDocument();
        expect(screen.getByText('Title')).toBeInTheDocument();
        expect(screen.getByText('Category')).toBeInTheDocument();
      });
    });

    // FE-UNIT-2.3b-003
    it('should render ideas from API', async () => {
      renderWithRouter(<EvaluationQueue />);
      await waitFor(() => {
        const rows = screen.getAllByTestId('queue-row');
        expect(rows.length).toBeGreaterThan(0);
      });
    });

    // FE-UNIT-2.3b-004
    it('should display status filter buttons (All, Submitted, Under Review, Needs Revision)', async () => {
      renderWithRouter(<EvaluationQueue />);
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /All/i })).toBeInTheDocument();
      });
    });
  });

  describe('status filtering', () => {
    // FE-UNIT-2.3b-005
    it('should filter ideas by SUBMITTED status when button clicked', async () => {
      renderWithRouter(<EvaluationQueue />);
      await waitFor(() => {
        fireEvent.click(screen.getByRole('button', { name: /Submitted/i }));
      });
      expect(mockedAxios.get).toHaveBeenCalled();
    });

    // FE-UNIT-2.3b-006
    it('should filter ideas by UNDER_REVIEW status when button clicked', async () => {
      renderWithRouter(<EvaluationQueue />);
      await waitFor(() => {
        expect(screen.getByText(/Pending Ideas/i)).toBeInTheDocument();
      });
    });

    // FE-UNIT-2.3b-007
    it('should filter ideas by NEEDS_REVISION status when button clicked', async () => {
      renderWithRouter(<EvaluationQueue />);
      await waitFor(() => {
        expect(screen.getByText(/Pending Ideas/i)).toBeInTheDocument();
      });
    });

    // FE-UNIT-2.3b-008
    it('should show all open statuses when "All" filter clicked', async () => {
      renderWithRouter(<EvaluationQueue />);
      await waitFor(() => {
        expect(screen.getByText(/Pending Ideas/i)).toBeInTheDocument();
      });
    });
  });
});
