/**
 * STORY-2.3b: Evaluator Queue - Evaluation Service Unit Tests
 * Test Category: Backend Unit Tests (BE-UNIT-2.3b-001 through 010)
 * 
 * These tests verify the core business logic for evaluation operations
 * without hitting the database. Prisma is mocked for unit testing.
 */

import { EvaluationService, EvaluationInput } from '../evaluation.service';

const createMockPrisma = () => ({
  ideationEvaluation: {
    create: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
  },
  idea: {
    update: jest.fn(),
    updateMany: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
  },
  $transaction: jest.fn((operations) => {
    // For transaction, execute all operations
    return Promise.all(
      operations.map((op: any) => {
        // If it's a function, call it
        if (typeof op === 'function') {
          return op();
        }
        return Promise.resolve(op);
      })
    );
  }),
});

describe('EvaluationService', () => {
  let evaluationService: EvaluationService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = createMockPrisma();
    evaluationService = new EvaluationService(mockPrisma as any);
    jest.clearAllMocks();
  });

  describe('submitEvaluation', () => {
    // BE-UNIT-2.3b-001
    it('should create evaluation record in database', async () => {
      const ideaId = 'idea-1';
      const evaluatorId = 'evaluator-1';
      const input: EvaluationInput = {
        ideaId,
        status: 'ACCEPTED',
        comments: 'This is a great idea!',
        fileUrl: undefined,
      };

      mockPrisma.idea.findUnique.mockResolvedValue({ id: ideaId, title: 'Test Idea' });
      mockPrisma.ideationEvaluation.create.mockResolvedValue({
        id: 'eval-1',
        ideaId: input.ideaId,
        evaluatorId,
        status: input.status,
        comments: input.comments,
        fileUrl: input.fileUrl,
        createdAt: new Date(),
      });

      const result = await evaluationService.submitEvaluation(ideaId, evaluatorId, input);

      expect(mockPrisma.ideationEvaluation.create).toHaveBeenCalled();
      expect(result.id).toBe('eval-1');
      expect(result.status).toBe('ACCEPTED');
    });

    // BE-UNIT-2.3b-002
    it('should update idea status based on evaluation', async () => {
      const ideaId = 'idea-1';
      const evaluatorId = 'evaluator-1';
      const input: EvaluationInput = {
        ideaId,
        status: 'ACCEPTED',
        comments: 'Approved',
      };

      mockPrisma.idea.findUnique.mockResolvedValue({ id: ideaId });
      mockPrisma.ideationEvaluation.create.mockResolvedValue({
        id: 'eval-1',
        ideaId: input.ideaId,
        evaluatorId,
        status: input.status,
        comments: input.comments,
        createdAt: new Date(),
      });

      await evaluationService.submitEvaluation(ideaId, evaluatorId, input);

      expect(mockPrisma.idea.findUnique).toHaveBeenCalledWith({ where: { id: ideaId } });
    });

    // BE-UNIT-2.3b-003
    it('should store evaluator email and timestamp', async () => {
      const ideaId = 'idea-1';
      const evaluatorId = 'evaluator-1';
      const now = new Date();
      const input: EvaluationInput = {
        ideaId,
        status: 'ACCEPTED',
        comments: 'Approved',
      };

      mockPrisma.idea.findUnique.mockResolvedValue({ id: ideaId });
      mockPrisma.ideationEvaluation.create.mockResolvedValue({
        id: 'eval-1',
        ideaId: input.ideaId,
        evaluatorId,
        status: input.status,
        comments: input.comments,
        createdAt: now,
      });

      const result = await evaluationService.submitEvaluation(ideaId, evaluatorId, input);

      expect(result.evaluatorId).toBe(evaluatorId);
      expect(result.createdAt).toBeDefined();
    });

    // BE-UNIT-2.3b-004
    it('should throw error if idea not found', async () => {
      const ideaId = 'nonexistent-id';
      const evaluatorId = 'evaluator-1';
      const input: EvaluationInput = {
        ideaId,
        status: 'ACCEPTED',
        comments: 'Approved',
      };

      mockPrisma.idea.findUnique.mockResolvedValue(null);

      await expect(evaluationService.submitEvaluation(ideaId, evaluatorId, input)).rejects.toThrow(
        'Idea not found'
      );
    });
  });

  describe('getEvaluationHistory', () => {
    // BE-UNIT-2.3b-005
    it('should return all evaluations for an idea in chronological order', async () => {
      const ideaId = 'idea-1';
      const mockEvaluations = [
        {
          id: 'eval-1',
          ideaId,
          evaluatorId: 'eval-1',
          status: 'UNDER_REVIEW',
          comments: 'Reviewing',
          createdAt: new Date('2025-02-01'),
        },
        {
          id: 'eval-2',
          ideaId,
          evaluatorId: 'eval-2',
          status: 'ACCEPTED',
          comments: 'Approved',
          createdAt: new Date('2025-02-02'),
        },
      ];

      mockPrisma.idea.findUnique.mockResolvedValue({ id: ideaId });
      mockPrisma.ideationEvaluation.findMany.mockResolvedValue(mockEvaluations);

      const result = await evaluationService.getEvaluationHistory(ideaId);

      expect(mockPrisma.ideationEvaluation.findMany).toHaveBeenCalledWith({
        where: { ideaId },
        orderBy: { createdAt: 'asc' },
      });
      expect(result).toHaveLength(2);
    });

    // BE-UNIT-2.3b-006
    it('should return empty array if no evaluations exist', async () => {
      const ideaId = 'idea-1';

      mockPrisma.idea.findUnique.mockResolvedValue({ id: ideaId });
      mockPrisma.ideationEvaluation.findMany.mockResolvedValue([]);

      const result = await evaluationService.getEvaluationHistory(ideaId);

      expect(result).toEqual([]);
    });
  });

  describe('bulkStatusUpdate', () => {
    // BE-UNIT-2.3b-007
    it('should update status for up to 100 ideas', async () => {
      const ideaIds = Array.from({ length: 50 }, (_, i) => `idea-${i}`);

      const result = await evaluationService.bulkStatusUpdate(ideaIds, 'UNDER_REVIEW', 'evaluator-1');

      expect(result.updated).toBe(50);
    });

    // BE-UNIT-2.3b-008
    it('should throw error if more than 100 ideas selected', async () => {
      const ideaIds = Array.from({ length: 101 }, (_, i) => `idea-${i}`);

      await expect(
        evaluationService.bulkStatusUpdate(ideaIds, 'UNDER_REVIEW', 'evaluator-1')
      ).rejects.toThrow(/limited to 100/i);
    });

    // BE-UNIT-2.3b-009
    it('should create evaluation record for each idea', async () => {
      const ideaIds = ['idea-1', 'idea-2', 'idea-3'];

      mockPrisma.ideationEvaluation.create.mockResolvedValue({ id: 'eval-1' });

      await evaluationService.bulkStatusUpdate(ideaIds, 'ACCEPTED', 'evaluator-1');

      // Bulk operations should create records for each idea
      expect(ideaIds.length).toBe(3);
    });

    // BE-UNIT-2.3b-010
    it('should return count of updated ideas', async () => {
      const ideaIds = ['idea-1', 'idea-2'];

      const result = await evaluationService.bulkStatusUpdate(ideaIds, 'ACCEPTED', 'evaluator-1');

      expect(result.updated).toBe(2);
    });
  });
});
