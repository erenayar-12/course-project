/**
 * STORY-2.3b: EvaluationQueue Component Unit Tests
 * Test Category: Frontend Unit Tests (FE-UNIT-2.3b-001 through 008)
 * 
 * Tests: Rendering, status filtering, column display
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import EvaluationQueue from '../EvaluationQueue';

// Mock child components
jest.mock('../EvaluationQueueRow', () => {
  return function MockRow({ idea }: any) {
    return <tr data-testid="queue-row"><td>{idea.title}</td></tr>;
  };
});

jest.mock('../BulkActionsBar', () => {
  return function MockBar() {
    return <div data-testid="bulk-actions-bar">Bulk Actions</div>;
  };
});

describe('EvaluationQueue', () => {
  const mockIdeas = [
    { id: '1', title: 'Idea 1', status: 'SUBMITTED', createdAt: new Date() },
    { id: '2', title: 'Idea 2', status: 'UNDER_REVIEW', createdAt: new Date() },
    { id: '3', title: 'Idea 3', status: 'SUBMITTED', createdAt: new Date() },
    { id: '4', title: 'Idea 4', status: 'NEEDS_REVISION', createdAt: new Date() },
  ];

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  describe('rendering', () => {
    // FE-UNIT-2.3b-001
    it('should display queue title "Pending Ideas"', () => {
      renderWithRouter(<EvaluationQueue ideas={mockIdeas} />);
      expect(screen.getByText(/Pending Ideas/i)).toBeInTheDocument();
    });

    // FE-UNIT-2.3b-002
    it('should render table with columns: Submitter, Title, Category, Date, Status, Actions', () => {
      renderWithRouter(<EvaluationQueue ideas={mockIdeas} />);
      expect(screen.getByText('Submitter')).toBeInTheDocument();
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Category')).toBeInTheDocument();
      expect(screen.getByText('Date')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Actions')).toBeInTheDocument();
    });

    // FE-UNIT-2.3b-003
    it('should render 10 ideas per page', () => {
      const manyIdeas = Array.from({ length: 15 }, (_, i) => ({
        ...mockIdeas[0],
        id: `idea-${i}`,
        title: `Idea ${i}`,
      }));

      renderWithRouter(<EvaluationQueue ideas={manyIdeas} limit={10} />);
      const rows = screen.getAllByTestId('queue-row');
      expect(rows).toHaveLength(10);
    });

    // FE-UNIT-2.3b-004
    it('should display status filter buttons (All, Submitted, Under Review, Needs Revision)', () => {
      renderWithRouter(<EvaluationQueue ideas={mockIdeas} />);
      expect(screen.getByRole('button', { name: /All/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Submitted/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Under Review/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Needs Revision/i })).toBeInTheDocument();
    });
  });

  describe('status filtering', () => {
    // FE-UNIT-2.3b-005
    it('should filter ideas by SUBMITTED status when button clicked', () => {
      renderWithRouter(<EvaluationQueue ideas={mockIdeas} />);
      fireEvent.click(screen.getByRole('button', { name: /Submitted/i }));

      const rows = screen.getAllByTestId('queue-row');
      expect(rows).toHaveLength(2); // Should show only SUBMITTED ideas
      expect(rows[0]).toHaveTextContent('Idea 1');
      expect(rows[1]).toHaveTextContent('Idea 3');
    });

    // FE-UNIT-2.3b-006
    it('should filter ideas by UNDER_REVIEW status when button clicked', () => {
      renderWithRouter(<EvaluationQueue ideas={mockIdeas} />);
      fireEvent.click(screen.getByRole('button', { name: /Under Review/i }));

      const rows = screen.getAllByTestId('queue-row');
      expect(rows).toHaveLength(1);
      expect(rows[0]).toHaveTextContent('Idea 2');
    });

    // FE-UNIT-2.3b-007
    it('should filter ideas by NEEDS_REVISION status when button clicked', () => {
      renderWithRouter(<EvaluationQueue ideas={mockIdeas} />);
      fireEvent.click(screen.getByRole('button', { name: /Needs Revision/i }));

      const rows = screen.getAllByTestId('queue-row');
      expect(rows).toHaveLength(1);
      expect(rows[0]).toHaveTextContent('Idea 4');
    });

    // FE-UNIT-2.3b-008
    it('should show all open statuses when "All" filter clicked', () => {
      renderWithRouter(<EvaluationQueue ideas={mockIdeas} />);
      fireEvent.click(screen.getByRole('button', { name: /All/i }));

      const rows = screen.getAllByTestId('queue-row');
      expect(rows).toHaveLength(4); // Should show all ideas
    });
  });
});
