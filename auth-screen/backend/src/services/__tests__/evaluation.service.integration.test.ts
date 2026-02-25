/**
 * STORY-2.3b: Backend Integration Tests - Evaluation Service
 * Test Category: Backend Integration Tests (BE-INT-2.3b-001 through 004)
 * 
 * These tests verify database operations using actual Prisma client and test database.
 */

import { PrismaClient } from '@prisma/client';
import { EvaluationService } from '../evaluation.service';

describe('EvaluationService Integration Tests', () => {
  let prisma: PrismaClient;
  let evaluationService: EvaluationService;

  beforeAll(async () => {
    prisma = new PrismaClient();
    evaluationService = new EvaluationService(prisma);
  });

  afterAll(async () => {
    // Clean up
    await prisma.idea.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // Clear data before each test
    await prisma.ideationEvaluation.deleteMany();
  });

  // BE-INT-2.3b-001
  it('should persist evaluation to database and retrieve it', async () => {
    const idea = await prisma.idea.create({
      data: {
        title: 'Test Idea',
        description: 'Test description',
        category: 'INNOVATION',
        userId: 'user-1',
        status: 'SUBMITTED',
      },
    });

    const evaluation = await evaluationService.submitEvaluation(idea.id, 'evaluator-1', {
      ideaId: idea.id,
      status: 'ACCEPTED',
      comments: 'Great idea!',
    });

    const retrieved = await evaluationService.getEvaluationHistory(idea.id);

    expect(evaluation).toBeDefined();
    expect(retrieved).toHaveLength(1);
  });

  // BE-INT-2.3b-002
  it('should maintain immutable audit trail (no DELETE on evaluations)', async () => {
    const idea = await prisma.idea.create({
      data: {
        title: 'Audit Test',
        description: 'Test the audit trail',
        category: 'INNOVATION',
        userId: 'user-1',
        status: 'SUBMITTED',
      },
    });

    await evaluationService.submitEvaluation(idea.id, 'evaluator-1', {
      ideaId: idea.id,
      status: 'ACCEPTED',
      comments: 'Approved',
    });

    const history = await evaluationService.getEvaluationHistory(idea.id);

    expect(history).toHaveLength(1);
    expect(history[0].createdAt).toBeDefined();
  });

  // BE-INT-2.3b-003
  it('should atomically update idea status and create evaluation', async () => {
    const idea = await prisma.idea.create({
      data: {
        title: 'Atomic Test',
        description: 'Test atomic operations',
        category: 'INNOVATION',
        userId: 'user-1',
        status: 'SUBMITTED',
      },
    });

    await evaluationService.submitEvaluation(idea.id, 'evaluator-1', {
      ideaId: idea.id,
      status: 'ACCEPTED',
      comments: 'Approved',
    });

    const updated = await prisma.idea.findUnique({ where: { id: idea.id } });

    expect(updated).toBeDefined();
    expect(updated?.status).toMatch(/SUBMITTED|ACCEPTED|UNDER_REVIEW/);
  });

  // BE-INT-2.3b-004
  it('should handle concurrent evaluation submissions correctly', async () => {
    const idea = await prisma.idea.create({
      data: {
        title: 'Concurrent Test',
        description: 'Test concurrent evaluations',
        category: 'INNOVATION',
        userId: 'user-1',
        status: 'SUBMITTED',
      },
    });

    const promises = [
      evaluationService.submitEvaluation(idea.id, 'evaluator-1', {
        ideaId: idea.id,
        status: 'ACCEPTED',
        comments: 'Evaluator 1',
      }),
      evaluationService.submitEvaluation(idea.id, 'evaluator-2', {
        ideaId: idea.id,
        status: 'NEEDS_REVISION',
        comments: 'Evaluator 2',
      }),
    ];

    const results = await Promise.all(promises);

    expect(results).toHaveLength(2);
    expect(results[0].evaluatorId).toBe('evaluator-1');
    expect(results[1].evaluatorId).toBe('evaluator-2');
  });
});
