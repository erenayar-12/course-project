/**
 * Backend IdeasService
 * Business logic for idea operations (backend implementation)
 *
 * In production, this would be in: src/services/ideas.service.ts (backend)
 * This demonstrates how the backend would handle database operations with Prisma
 */

import { ideaSubmissionSchema, IdeaSubmissionFormData } from '@/types/ideaSchema';

/**
 * Mock Prisma client interface (for demonstration)
 * In production: import { PrismaClient } from '@prisma/client'
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
interface MockPrismaClient {
  idea: {
    create: (args: any) => Promise<any>;
    findMany: (args: any) => Promise<any[]>;
    findUnique: (args: any) => Promise<any | null>;
    findFirst: (args: any) => Promise<any | null>;
    count: (args: any) => Promise<number>;
    update: (args: any) => Promise<any>;
    delete: (args: any) => Promise<any>;
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export class IdeasServiceBackend {
  /**
   * @param prisma - Prisma client instance
   */
  constructor(private prisma: MockPrismaClient) {}

  /**
   * Create a new idea with server-side validation
   * @param userId - ID of user submitting idea (from JWT token)
   * @param data - Form data from frontend
   * @returns Created idea record with all fields
   * @throws Error if validation fails or database error
   */
  async createIdea(userId: string, data: IdeaSubmissionFormData) {
    try {
      // Server-side validation (always validate, even if client validated)
      const validatedData = ideaSubmissionSchema.parse(data);

      // Check if user exists (would check User table in production)
      // In production: const user = await this.prisma.user.findUnique({ where: { id: userId } })
      // if (!user) throw new Error('User not found');

      // Create idea in database
      const idea = await this.prisma.idea.create({
        data: {
          userId,
          title: validatedData.title,
          description: validatedData.description,
          category: validatedData.category,
          status: 'Submitted',
        },
      });

      return idea;
    } catch (error) {
      // Handle database errors
      const message = error instanceof Error ? error.message : 'Failed to create idea';
      throw new Error(message);
    }
  }

  /**
   * Fetch all ideas for a user with pagination
   * @param userId - ID of user
   * @param page - Page number (1-indexed)
   * @param limit - Items per page
   * @returns Object with ideas array and pagination metadata
   */
  async getUserIdeas(userId: string, page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;

      // Fetch ideas and total count in parallel
      const [ideas, total] = await Promise.all([
        this.prisma.idea.findMany({
          where: { userId },
          skip,
          take: limit,
          // In production, would use Prisma select:
          // select: { id: true, title: true, description: true, category: true, status: true, createdAt: true }
        }),
        this.prisma.idea.count({
          where: { userId },
        }),
      ]);

      return {
        ideas,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1,
        },
      };
    } catch (error) {
      throw new Error('Failed to fetch ideas');
    }
  }

  /**
   * Get single idea by ID
   * Verifies ownership before returning
   * @param ideaId - ID of idea to fetch
   * @param userId - ID of requesting user (for authorization)
   * @returns Idea object if found and user is owner
   * @throws Error if not found or unauthorized
   */
  async getIdeaById(ideaId: string, userId: string) {
    try {
      const idea = await this.prisma.idea.findUnique({
        where: { id: ideaId },
        // In production, would include relations:
        // include: { attachments: true }
      });

      // Verify ownership
      if (!idea) {
        throw new Error('Idea not found');
      }

      if (idea.userId !== userId) {
        throw new Error('Unauthorized: This idea belongs to another user');
      }

      return idea;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to fetch idea');
    }
  }

  /**
   * Update an idea (only allowed for ideas in "Submitted" status)
   * @param ideaId - ID of idea to update
   * @param userId - ID of requesting user
   * @param data - Updated form data
   * @returns Updated idea
   */
  async updateIdea(ideaId: string, userId: string, data: IdeaSubmissionFormData) {
    try {
      // Validate the new data
      const validatedData = ideaSubmissionSchema.parse(data);

      // Get current idea to verify ownership and status
      const idea = await this.getIdeaById(ideaId, userId);

      // Only allow editing ideas in "Submitted" status
      if (idea.status !== 'Submitted') {
        throw new Error(`Cannot edit idea with status: ${idea.status}`);
      }

      // Update in database
      const updated = await this.prisma.idea.update({
        where: { id: ideaId },
        data: {
          title: validatedData.title,
          description: validatedData.description,
          category: validatedData.category,
        },
      });

      return updated;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to update idea');
    }
  }

  /**
   * Delete an idea (only allowed for ideas in "Submitted" status)
   * @param ideaId - ID of idea to delete
   * @param userId - ID of requesting user
   */
  async deleteIdea(ideaId: string, userId: string) {
    try {
      // Verify ownership and get current idea
      const idea = await this.getIdeaById(ideaId, userId);

      // Only allow deleting ideas in "Submitted" status
      if (idea.status !== 'Submitted') {
        throw new Error(`Cannot delete idea with status: ${idea.status}`);
      }

      // Delete from database
      await this.prisma.idea.delete({
        where: { id: ideaId },
      });

      return { success: true, message: 'Idea deleted successfully' };
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to delete idea');
    }
  }

  /**
   * Get ideas filtered by status (admin/evaluator feature)
   * @param status - Status to filter by
   * @param page - Page number
   * @param limit - Items per page
   */
  async getIdeasByStatus(status: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [ideas, total] = await Promise.all([
      this.prisma.idea.findMany({
        where: { status },
        skip,
        take: limit,
      }),
      this.prisma.idea.count({
        where: { status },
      }),
    ]);

    return {
      ideas,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

export default IdeasServiceBackend;
