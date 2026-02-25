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
import { IdeaListItem } from '../IdeaListItem';

const mockIdea = {
  id: '1',
  title: 'Test Idea',
  status: 'SUBMITTED' as const,
  category: 'Product',
  createdAt: '2026-02-25',
  attachmentCount: 2,
};

describe('IdeaListItem', () => {
  describe('rendering required fields', () => {
    it('should display idea title', () => {
      render(<IdeaListItem idea={mockIdea} />);
      expect(screen.getByText('Test Idea')).toBeInTheDocument();
    });

    it('should display status badge', () => {
      render(<IdeaListItem idea={mockIdea} />);
      expect(screen.getByText('SUBMITTED')).toBeInTheDocument();
    });

    it('should display category', () => {
      render(<IdeaListItem idea={mockIdea} />);
      expect(screen.getByText('Product')).toBeInTheDocument();
    });

    it('should display submission date', () => {
      render(<IdeaListItem idea={mockIdea} />);
      expect(screen.getByText('2026-02-25')).toBeInTheDocument();
    });

    it('should display attachment count', () => {
      render(<IdeaListItem idea={mockIdea} />);
      expect(screen.getByText('2 attachments')).toBeInTheDocument();
    });
  });

  describe('click navigation', () => {
    it('should navigate to /ideas/:ideaId when row clicked', async () => {
      const onNavigate = jest.fn();
      const user = userEvent.setup();
      
      render(<IdeaListItem idea={mockIdea} onNavigate={onNavigate} />);
      
      // Find clickable element (should be the container)
      const element = screen.getByText('Test Idea').closest('div');
      if (element) {
        await user.click(element);
        expect(onNavigate).toHaveBeenCalledWith('1');
      }
    });

    it('should pass ideaId to detail page route', async () => {
      const onNavigate = jest.fn();
      const user = userEvent.setup();
      
      const ideaWithDifferentId = { ...mockIdea, id: 'abc-123' };
      render(<IdeaListItem idea={ideaWithDifferentId} onNavigate={onNavigate} />);
      
      const element = screen.getByText('Test Idea').closest('div');
      if (element) {
        await user.click(element);
        expect(onNavigate).toHaveBeenCalledWith('abc-123');
      }
    });
  });

  describe('rendering variants', () => {
    it('should render with all fields populated', () => {
      render(<IdeaListItem idea={mockIdea} />);
      expect(screen.getByText('Test Idea')).toBeInTheDocument();
      expect(screen.getByText('SUBMITTED')).toBeInTheDocument();
      expect(screen.getByText('Product')).toBeInTheDocument();
      expect(screen.getByText('2026-02-25')).toBeInTheDocument();
      expect(screen.getByText('2 attachments')).toBeInTheDocument();
    });

    it('should handle missing attachments count gracefully', () => {
      const ideaNoAttachments = { ...mockIdea, attachmentCount: 0 };
      render(<IdeaListItem idea={ideaNoAttachments} />);
      expect(screen.getByText('0 attachments')).toBeInTheDocument();
    });
  });
});
