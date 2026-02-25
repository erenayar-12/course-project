/**
 * Evaluation Service
 * 
 * Handles evaluation workflow: submitting evaluations, tracking evaluation history,
 * and maintaining immutable audit trail per STORY-2.3b requirements.
 * 
 * STORY-1.4 AC4: API endpoints validate role
 */

import { PrismaClient } from '@prisma/client';

export interface EvaluationInput {
  ideaId: string;
  status: 'ACCEPTED' | 'REJECTED' | 'NEEDS_REVISION';
  comments: string;
  fileUrl?: string;
}

export interface EvaluationResponse {
  id: string;
  ideaId: string;
  evaluatorId: string;
  status: string;
  comments: string;
  fileUrl?: string;
  createdAt: Date;
}

export class EvaluationService {
  private prisma: PrismaClient;

  constructor(prisma?: PrismaClient) {
    this.prisma = prisma || new PrismaClient();
  }
  /**
   * Submit evaluation for an idea
   * Only evaluators/admins can evaluate
   * Creates immutable evaluation record in database
   * 
   * @param ideaId - ID of idea being evaluated
   * @param evaluatorId - ID of evaluator (from JWT)
   * @param input - Evaluation data
   * @returns Created evaluation record
   */
  async submitEvaluation(
    ideaId: string,
    evaluatorId: string,
    input: EvaluationInput
  ): Promise<EvaluationResponse> {
    // Verify idea exists
    const idea = await this.prisma.idea.findUnique({
      where: { id: ideaId },
    });

    if (!idea) {
      throw new Error('Idea not found');
    }

    // Create evaluation record (immutable - no updates allowed after creation)
    const evaluation = await this.prisma.ideationEvaluation.create({
      data: {
        ideaId,
        evaluatorId,
        status: input.status,
        comments: input.comments,
        fileUrl: input.fileUrl,
      },
    });

    // Update idea status to reflect evaluation
    await this.prisma.idea.update({
      where: { id: ideaId },
      data: {
        status: input.status === 'ACCEPTED' 
          ? 'APPROVED' 
          : input.status === 'REJECTED' 
            ? 'REJECTED' 
            : 'NEEDS_REVISION',
      },
    });

    console.log('Evaluation submitted (STORY-2.3b AC14):', evaluation.id);

    return {
      id: evaluation.id,
      ideaId: evaluation.ideaId,
      evaluatorId: evaluation.evaluatorId,
      status: evaluation.status,
      comments: evaluation.comments,
      fileUrl: evaluation.fileUrl || undefined,
      createdAt: evaluation.createdAt,
    };
  }

  /**
   * Get evaluation history for an idea (immutable audit trail)
   * 
   * @param ideaId - ID of idea
   * @returns Array of all evaluations for the idea
   */
  async getEvaluationHistory(ideaId: string): Promise<EvaluationResponse[]> {
    // Verify idea exists
    const idea = await this.prisma.idea.findUnique({
      where: { id: ideaId },
    });

    if (!idea) {
      throw new Error('Idea not found');
    }

    // Fetch all evaluations in chronological order (immutable audit trail)
    const evaluations = await this.prisma.ideationEvaluation.findMany({
      where: { ideaId },
      orderBy: { createdAt: 'asc' },
    });

    return evaluations.map(e => ({
      id: e.id,
      ideaId: e.ideaId,
      evaluatorId: e.evaluatorId,
      status: e.status,
      comments: e.comments,
      fileUrl: e.fileUrl || undefined,
      createdAt: e.createdAt,
    }));
  }

  /**
   * Bulk status update for ideas (STORY-2.3b AC15)
   * 
   * @param ideaIds - Array of idea IDs to update
   * @param status - New status for all ideas
   * @param evaluatorId - ID of evaluator performing batch update
   * @returns Count of updated ideas
   */
  async bulkStatusUpdate(
    ideaIds: string[],
    status: string,
    evaluatorId: string
  ): Promise<{ updated: number }> {
    // Limit to 100 items per request (AC15)
    if (ideaIds.length > 100) {
      throw new Error('Bulk operations limited to 100 items maximum');
    }

    // Create evaluation records for each idea using transaction
    const evaluations = ideaIds.map(ideaId => ({
      ideaId,
      evaluatorId,
      status,
      comments: 'Bulk status update',
    }));

    // Use transaction for atomicity
    await this.prisma.$transaction(
      evaluations.map(evaluation => 
        this.prisma.ideationEvaluation.create({ data: evaluation })
      )
    );

    // Update all idea statuses
    const mapped = status === 'ACCEPTED' 
      ? 'APPROVED' 
      : status === 'REJECTED' 
        ? 'REJECTED' 
        : 'NEEDS_REVISION';

    await this.prisma.idea.updateMany({
      where: { id: { in: ideaIds } },
      data: { status: mapped },
    });

    console.log(`Bulk status update for ${ideaIds.length} ideas (STORY-2.3b AC15)`);

    return { updated: ideaIds.length };
  }

  /**
   * Get evaluation queue - all submitted ideas pending evaluation
   * Shows statuses: SUBMITTED, UNDER_REVIEW, NEEDS_REVISION (all "open" statuses)
   * 
   * @param limit - Results per page
   * @param offset - Pagination offset
   * @returns Array of ideas with pagination info
   */
  async getEvaluationQueue(limit: number = 10, offset: number = 0): Promise<any> {
    const ideas = await this.prisma.idea.findMany({
      where: {
        status: {
          in: ['SUBMITTED', 'UNDER_REVIEW', 'NEEDS_REVISION'],
        },
      },
      orderBy: { createdAt: 'desc' }, // Newest first (CLARIFIED)
      skip: offset,
      take: limit,
      include: {
        attachments: true,
        evaluations: {
          orderBy: { createdAt: 'desc' },
          take: 1, // Latest evaluation
        },
      },
    });

    const total = await this.prisma.idea.count({
      where: {
        status: {
          in: ['SUBMITTED', 'UNDER_REVIEW', 'NEEDS_REVISION'],
        },
      },
    });

    return {
      ideas,
      pagination: {
        total,
        page: Math.floor(offset / limit) + 1,
        pages: Math.ceil(total / limit),
        limit,
        offset,
      },
    };
  }

  /**
   * Bulk assign evaluator to multiple ideas
   * 
   * @param ideaIds - Array of idea IDs
   * @param assigneeId - ID of new evaluator
   * @returns Count of assigned ideas
   */
  async bulkAssign(ideaIds: string[], assigneeId: string): Promise<{ assigned: number }> {
    if (ideaIds.length > 100) {
      throw new Error('Bulk operations limited to 100 items maximum');
    }

    // Update status to UNDER_REVIEW for assigned ideas
    await this.prisma.idea.updateMany({
      where: { id: { in: ideaIds } },
      data: { status: 'UNDER_REVIEW' },
    });

    // Create evaluation records marking assignment using transaction
    const records = ideaIds.map(ideaId => ({
      ideaId,
      evaluatorId: assigneeId,
      status: 'UNDER_REVIEW',
      comments: 'Assigned for review',
    }));

    await this.prisma.$transaction(
      records.map(record => 
        this.prisma.ideationEvaluation.create({ data: record })
      )
    );

    return { assigned: ideaIds.length };
  }

  /**
   * Export ideas to CSV
   * 
   * @param ideaIds - Array of idea IDs to export
   * @returns CSV formatted string
   */
  async exportToCSV(ideaIds: string[]): Promise<string> {
    if (ideaIds.length > 100) {
      throw new Error('CSV export limited to 100 items maximum');
    }

    const ideas = await this.prisma.idea.findMany({
      where: { id: { in: ideaIds } },
      include: {
        user: true,
        attachments: true,
        evaluations: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    // Build CSV with headers
    const headers = ['Submitter', 'Title', 'Category', 'Date', 'Status', 'Attachments', 'Assigned To'];
    const rows = ideas.map(idea => [
      idea.user.email,
      `"${idea.title}"`, // Quote titles in case of commas
      idea.category,
      new Date(idea.createdAt).toLocaleDateString(),
      idea.status,
      idea.attachments.length.toString(),
      idea.evaluations[0]?.evaluatorId || 'Unassigned',
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    return csv;
  }
}

const prisma = new PrismaClient();
export const evaluationService = new EvaluationService(prisma);
