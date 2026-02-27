import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { ideasSchema, updateIdeaSchema } from '../types/ideaSchema.js';

const prisma = new PrismaClient();

export interface PaginationParams {
  limit: number;
  offset: number;
}

export class IdeasService {
    async getAllIdeas(params: PaginationParams) {
      const [ideas, total] = await Promise.all([
        prisma.idea.findMany({
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            attachments: {
              select: {
                id: true,
                originalName: true,
                fileSize: true,
                uploadedAt: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: params.limit,
          skip: params.offset,
        }),
        prisma.idea.count(),
      ]);
      return {
        ideas,
        total,
        page: Math.floor(params.offset / params.limit) + 1,
        pageSize: params.limit,
      };
    }
  async createIdea(
    externalId: string,
    data: z.infer<typeof ideasSchema> & { submitterEmail?: string; submitterName?: string }
  ) {
    // First find or create user by externalId (Auth0 ID)
    let user = await prisma.user.findUnique({
      where: { externalId },
    });
    if (!user) {
      // Create user if not found (auto-register)
      user = await prisma.user.create({
        data: {
          externalId,
          email: data.submitterEmail || '',
          name: data.submitterName || '',
        },
      });
    } else {
      // Update user info if changed
      await prisma.user.update({
        where: { id: user.id },
        data: {
          email: data.submitterEmail || user.email,
          name: data.submitterName || user.name,
        },
      });
    }

    const idea = await prisma.idea.create({
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        status: 'SUBMITTED',
        userId: user.id,
        submitterEmail: data.submitterEmail || '',
        submitterName: data.submitterName || '',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return idea;
  }

  async getUserIdeas(
    externalId: string,
    params: PaginationParams
  ) {

    let user = await prisma.user.findUnique({
      where: { externalId },
    });
    if (!user) {
      user = await prisma.user.create({
        data: {
          externalId,
          email: '',
          name: '',
        },
      });
    }

    const [ideas, total] = await Promise.all([
      prisma.idea.findMany({
        where: { userId: user.id },
        include: {
          attachments: {
            select: {
              id: true,
              originalName: true,
              fileSize: true,
              uploadedAt: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: params.limit,
        skip: params.offset,
      }),
      prisma.idea.count({
        where: { userId: user.id },
      }),
    ]);

    return {
      ideas,
      total,
      page: Math.floor(params.offset / params.limit) + 1,
      pageSize: params.limit,
    };
  }

  async getIdeaById(
    ideaId: string,
    externalId: string
  ) {

    // Find idea and allow admin/evaluator access
    const idea = await prisma.idea.findUnique({
      where: { id: ideaId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            externalId: true,
          },
        },
        attachments: true,
      },
    });

    if (!idea) {
      throw new Error('Idea not found');
    }

    // Ownership check only for submitter
    // If admin/evaluator, allow access
    // If not, block
    if (externalId && idea.user.externalId !== externalId) {
      // Check role from req.user (passed from route)
      // If req.user.role is admin/evaluator, allow access
      // Otherwise, block
      // NOTE: req.user.role must be passed from route
      // If not present, default to blocking
      if (!('role' in arguments[arguments.length - 1]) || !['admin', 'evaluator'].includes(arguments[arguments.length - 1].role)) {
        throw new Error('Unauthorized: You do not own this idea');
      }
    }

    return idea;
  }

  async updateIdea(
    ideaId: string,
    externalId: string,
    data: z.infer<typeof updateIdeaSchema>
  ) {

    let user = await prisma.user.findUnique({
      where: { externalId },
    });
    if (!user) {
      user = await prisma.user.create({
        data: {
          externalId,
          email: '',
          name: '',
        },
      });
    }

    const idea = await prisma.idea.findUnique({
      where: { id: ideaId },
    });

    if (!idea) {
      throw new Error('Idea not found');
    }

    if (idea.userId !== user.id) {
      throw new Error('Unauthorized: You do not own this idea');
    }

    const updated = await prisma.idea.update({
      where: { id: ideaId },
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        status: 'DRAFT',
        userId: user.id,
        submitterEmail: data.submitterEmail,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return updated;
  }

  async deleteIdea(
    ideaId: string,
    externalId: string
  ) {

    let user = await prisma.user.findUnique({
      where: { externalId },
    });
    if (!user) {
      user = await prisma.user.create({
        data: {
          externalId,
          email: '',
          name: '',
        },
      });
    }

    const idea = await prisma.idea.findUnique({
      where: { id: ideaId },
    });

    if (!idea) {
      throw new Error('Idea not found');
    }

    if (idea.userId !== user.id) {
      throw new Error('Unauthorized: You do not own this idea');
    }

    await prisma.idea.delete({
      where: { id: ideaId },
    });

    return { success: true };
  }

  async addAttachment(
    ideaId: string,
    externalId: string,
    filename: string,
    storedFilename: string,
    fileSize: number,
    mimeType: string
  ) {

    let user = await prisma.user.findUnique({
      where: { externalId },
    });
    if (!user) {
      user = await prisma.user.create({
        data: {
          externalId,
          email: '',
          name: '',
        },
      });
    }

    const idea = await prisma.idea.findUnique({
      where: { id: ideaId },
    });

    if (!idea) {
      throw new Error('Idea not found');
    }

    if (idea.userId !== user.id) {
      throw new Error('Unauthorized: You do not own this idea');
    }

    const attachment = await prisma.ideaAttachment.create({
      data: {
        ideaId,
        originalName: filename,
        storedName: storedFilename,
        fileSize,
        mimeType,
        uploadedBy: user.id,
      },
    });

    return attachment;
  }

  /**
   * Get evaluation queue: all ideas with status "Submitted" or "Under Review"
   * sorted by createdAt ascending (oldest first - FIFO)
   * @param limit - Items per page
   * @param offset - Skip N items (for pagination)
   * @returns Array of ideas with submitter name and days in queue
   */
  async getEvaluationQueue(
    limit: number = 25,
    offset: number = 0
  ) {
    // Get ideas with "Submitted" or "Under Review" status
    const ideas = await prisma.idea.findMany({
      where: {
        status: {
          in: ['SUBMITTED', 'NEEDS_REVISION'],
        },
      },
      select: {
        id: true,
        title: true,
        category: true,
        createdAt: true,
        status: true,
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc', // Oldest first (FIFO)
      },
      take: limit,
      skip: offset,
    });

    // Get total count for pagination
    const totalCount = await prisma.idea.count({
      where: {
        status: {
          in: ['SUBMITTED', 'UNDER_REVIEW'],
        },
      },
    });

    // Calculate days in queue for each idea
    const now = new Date();
    const formattedIdeas = ideas.map(idea => {
      const daysInQueue = Math.floor(
        (now.getTime() - idea.createdAt.getTime()) / (1000 * 60 * 60 * 24)
      );

      return {
        id: idea.id,
        title: idea.title,
        submitterName: idea.user.name || 'Unknown',
        category: idea.category,
        createdAt: idea.createdAt.toISOString(),
        status: idea.status === 'SUBMITTED' ? 'Submitted' : 'Under Review',
        daysInQueue,
      };
    });

    return {
      data: formattedIdeas,
      pagination: {
        total: totalCount,
        limit,
        offset,
      },
    };
  }
}

export const ideasService = new IdeasService();
