/**
 * STORY-2.3b: EvaluationHistory Component Unit Tests
 * Test Category: Frontend Unit Tests (FE-UNIT-2.3b-020 through 022)
 * 
 * Tests: History list rendering, evaluation details, empty state
 */

import { render, screen } from '@testing-library/react';
import EvaluationHistory from '../EvaluationHistory';
import { EvaluationStatus } from '../../types/evaluationTypes';

describe('EvaluationHistory', () => {
  const mockEvaluations = [
    {
      id: 'eval-1',
      ideaId: 'idea-1',
      evaluatorId: 'eval-1',
      evaluatorEmail: 'evaluator1@example.com',
      status: EvaluationStatus.NEEDS_REVISION,
      comments: 'Currently reviewing',
      createdAt: new Date('2025-02-01'),
    },
    {
      id: 'eval-2',
      ideaId: 'idea-1',
      evaluatorId: 'eval-2',
      evaluatorEmail: 'evaluator2@example.com',
      status: EvaluationStatus.ACCEPTED,
      comments: 'Approved!',
      createdAt: new Date('2025-02-02'),
    },
  ];

  describe('rendering', () => {
    // FE-UNIT-2.3b-020
    it('should display list of past evaluations', () => {
      render(<EvaluationHistory evaluations={mockEvaluations} />);
      expect(screen.getByText('Evaluation History')).toBeInTheDocument();
      expect(screen.getAllByTestId('evaluation-item')).toHaveLength(2);
    });

    // FE-UNIT-2.3b-021
    it('should show evaluator name, status, date, and comments for each evaluation', () => {
      render(<EvaluationHistory evaluations={mockEvaluations} />);

      // First evaluation
      expect(screen.getByText('evaluator1@example.com')).toBeInTheDocument();
      expect(screen.getByText('NEEDS_REVISION')).toBeInTheDocument();
      expect(screen.getByText('Currently reviewing')).toBeInTheDocument();

      // Second evaluation
      expect(screen.getByText('evaluator2@example.com')).toBeInTheDocument();
      expect(screen.getByText('ACCEPTED')).toBeInTheDocument();
      expect(screen.getByText('Approved!')).toBeInTheDocument();
    });

    // FE-UNIT-2.3b-022
    it('should display message "No evaluation history" when empty', () => {
      render(<EvaluationHistory evaluations={[]} />);
      expect(screen.getByText(/No evaluation history/i)).toBeInTheDocument();
    });
  });
});
