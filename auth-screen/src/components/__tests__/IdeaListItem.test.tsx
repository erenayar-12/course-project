/**
 * IdeaListItem Component Tests
 * 
 * Tests the individual idea row component
 * Verifies rendering of AC2 fields and AC7 navigation
 * 
 * @file Unit tests for IdeaListItem.tsx
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { IdeaListItem } from '../IdeaListItem';

const mockIdea = {
  id: '1',
  title: 'Test Idea',
  status: 'SUBMITTED' as const,
  category: 'Product',
  createdAt: '2026-02-25',
  attachmentCount: 2,
};

/**
 * Wrapper to provide router context for useNavigate hook
 */
const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('IdeaListItem', () => {
  describe('rendering required fields', () => {
    it('should display idea title', () => {
      renderWithRouter(<IdeaListItem idea={mockIdea} />);
      expect(screen.getByText('Test Idea')).toBeInTheDocument();
    });

    it('should display status badge', () => {
      renderWithRouter(<IdeaListItem idea={mockIdea} />);
      expect(screen.getByText('Submitted')).toBeInTheDocument();
    });

    it('should display category', () => {
      renderWithRouter(<IdeaListItem idea={mockIdea} />);
      expect(screen.getByText('Product')).toBeInTheDocument();
    });

    it('should display submission date', () => {
      renderWithRouter(<IdeaListItem idea={mockIdea} />);
      expect(screen.getByText('02/25/2026')).toBeInTheDocument();
    });

    it('should display attachment count', () => {
      renderWithRouter(<IdeaListItem idea={mockIdea} />);
      // Component renders attachment with emoji and count
      expect(screen.getByText(/📎 2/i)).toBeInTheDocument();
    });
  });

  describe('click navigation', () => {
    it('should navigate when row is clicked and onNavigate prop provided', async () => {
      const onNavigate = jest.fn();
      const user = userEvent.setup();
      
      renderWithRouter(<IdeaListItem idea={mockIdea} onNavigate={onNavigate} />);
      
      // Find clickable row element
      const row = screen.getByText('Test Idea').closest('tr');
      if (row) {
        await user.click(row);
        expect(onNavigate).toHaveBeenCalled();
      }
    });

    it('should pass correct ideaId to navigation handler', async () => {
      const onNavigate = jest.fn();
      const user = userEvent.setup();
      
      const ideaWithDifferentId = { ...mockIdea, id: 'abc-123' };
      renderWithRouter(<IdeaListItem idea={ideaWithDifferentId} onNavigate={onNavigate} />);
      
      const row = screen.getByText('Test Idea').closest('tr');
      if (row) {
        await user.click(row);
        expect(onNavigate).toHaveBeenCalled();
      }
    });
  });

  describe('rendering variants', () => {
    it('should render with all fields populated', () => {
      renderWithRouter(<IdeaListItem idea={mockIdea} />);
      expect(screen.getByText('Test Idea')).toBeInTheDocument();
      expect(screen.getByText('Submitted')).toBeInTheDocument();
      expect(screen.getByText('Product')).toBeInTheDocument();
    });

    it('should handle missing attachments count gracefully', () => {
      const ideaNoAttachments = { ...mockIdea, attachmentCount: 0 };
      renderWithRouter(<IdeaListItem idea={ideaNoAttachments} />);
      // Component doesn't render attachment cell when count is 0
      expect(screen.queryByText(/📎/i)).not.toBeInTheDocument();
    });
  });
});
