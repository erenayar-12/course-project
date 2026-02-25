/**
 * STORY-2.3b: EvaluationQueueRow Component Unit Tests
 * Test Category: Frontend Unit Tests (FE-UNIT-2.3b-009 through 014)
 * 
 * Tests: Submitter email, title link, category tag, date formatting, status badge, action button
 */

import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import EvaluationQueueRow from '../EvaluationQueueRow';
import { IdeaStatus } from '../../types/evaluationTypes';

jest.mock('../StatusBadge', () => {
  return function MockStatusBadge({ status }: { status: string }) {
    return <span data-testid="status-badge">{status}</span>;
  };
});

describe('EvaluationQueueRow', () => {
  const mockIdea = {
    id: 'idea-1',
    title: 'Test Idea',
    description: 'Test Description',
    submitterEmail: 'user@example.com',
    category: 'INNOVATION',
    createdAt: new Date('2025-02-15'),
    status: IdeaStatus.SUBMITTED,
    userId: 'user-1',
    updatedAt: new Date('2025-02-15'),
    attachmentCount: 2,
  };

  const mockOnOpenModal = jest.fn();

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<MemoryRouter>{component}</MemoryRouter>);
  };

  describe('rendering', () => {
    // FE-UNIT-2.3b-009
    it('should render submitter email', () => {
      renderWithRouter(
        <table>
          <tbody>
            <EvaluationQueueRow idea={mockIdea} onOpenModal={mockOnOpenModal} />
          </tbody>
        </table>
      );
      expect(screen.getByText('user@example.com')).toBeInTheDocument();
    });

    // FE-UNIT-2.3b-010
    it('should render idea title as link', () => {
      renderWithRouter(
        <table>
          <tbody>
            <EvaluationQueueRow idea={mockIdea} onOpenModal={mockOnOpenModal} />
          </tbody>
        </table>
      );
      const titleLink = screen.getByRole('link', { name: 'Test Idea' });
      expect(titleLink).toHaveAttribute('href', '/ideas/idea-1');
    });

    // FE-UNIT-2.3b-011
    it('should render category as tag', () => {
      renderWithRouter(
        <table>
          <tbody>
            <EvaluationQueueRow idea={mockIdea} onOpenModal={mockOnOpenModal} />
          </tbody>
        </table>
      );
      expect(screen.getByText('INNOVATION')).toBeInTheDocument();
    });

    // FE-UNIT-2.3b-012
    it('should render creation date formatted as MM/DD/YYYY', () => {
      renderWithRouter(
        <table>
          <tbody>
            <EvaluationQueueRow idea={mockIdea} onOpenModal={mockOnOpenModal} />
          </tbody>
        </table>
      );
      expect(screen.getByText('02/15/2025')).toBeInTheDocument();
    });
  });

  describe('status badge', () => {
    // FE-UNIT-2.3b-013
    it('should display StatusBadge component with current status', () => {
      renderWithRouter(
        <table>
          <tbody>
            <EvaluationQueueRow idea={mockIdea} onOpenModal={mockOnOpenModal} />
          </tbody>
        </table>
      );
      expect(screen.getByTestId('status-badge')).toHaveTextContent('SUBMITTED');
    });

    // FE-UNIT-2.3b-014
    it('should render View/Review action button', () => {
      renderWithRouter(
        <table>
          <tbody>
            <EvaluationQueueRow idea={mockIdea} onOpenModal={mockOnOpenModal} />
          </tbody>
        </table>
      );
      const reviewButton = screen.getByRole('button', { name: /Review/i });
      expect(reviewButton).toBeInTheDocument();
    });
  });
});
