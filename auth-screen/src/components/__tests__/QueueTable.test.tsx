/**
 * QueueTable Component Tests (STORY-3.1)
 * 
 * Tests the evaluation queue table display
 * Ensures proper rendering of queue items, loading states, and empty states
 * 
 * @file Unit tests for QueueTable.tsx
 */

import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueueTable } from '../QueueTable';
import { QueueIdea } from '../../types/ideaSchema';
import '@testing-library/jest-dom';

const mockIdeas: QueueIdea[] = [
  {
    id: '1',
    title: 'Test Idea 1',
    submitterName: 'John Doe',
    category: 'Technology',
    createdAt: '2026-02-15T10:00:00Z',
    status: 'Submitted',
    daysInQueue: 5,
  },
];

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('QueueTable', () => {
  describe('rendering', () => {
    it('should render without crashing', () => {
      renderWithRouter(<QueueTable ideas={[]} isLoading={false} />);
      expect(screen.getByText(/no ideas pending review/i)).toBeInTheDocument();
    });

    it('should render loading state', () => {
      renderWithRouter(<QueueTable ideas={[]} isLoading={true} />);
      // Check for skeleton or loading state
      expect(document.querySelector('.animate-pulse')).toBeInTheDocument();
    });

    it('should render table with columns', () => {
      renderWithRouter(<QueueTable ideas={mockIdeas} isLoading={false} />);
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Submitter')).toBeInTheDocument();
      expect(screen.getByText('Category')).toBeInTheDocument();
    });

    it('should display idea data', () => {
      renderWithRouter(<QueueTable ideas={mockIdeas} isLoading={false} />);
      expect(screen.getByText('Test Idea 1')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Technology')).toBeInTheDocument();
    });
  });

  describe('empty state', () => {
    it('should show empty message when no ideas', () => {
      renderWithRouter(<QueueTable ideas={[]} isLoading={false} />);
      expect(screen.getByText(/no ideas pending review/i)).toBeInTheDocument();
    });

    it('should not show empty when loading', () => {
      renderWithRouter(<QueueTable ideas={[]} isLoading={true} />);
      expect(screen.queryByText(/no ideas pending review/i)).not.toBeInTheDocument();
    });
  });

  describe('loading state', () => {
    it('should show skeleton when loading', () => {
      renderWithRouter(<QueueTable ideas={[]} isLoading={true} />);
      const skeletons = document.querySelectorAll('.animate-pulse');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('should hide table when loading', () => {
      renderWithRouter(<QueueTable ideas={mockIdeas} isLoading={true} />);
      // Skeleton should be shown instead of table data
      expect(document.querySelector('.animate-pulse')).toBeInTheDocument();
    });
  });
});
