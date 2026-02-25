import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { ideasSchema, updateIdeaSchema } from '../types/ideaSchema';

const prisma = new PrismaClient();

export interface PaginationParams {
  limit: number;
  offset: number;
}

export class IdeasService {
  async createIdea(
    externalId: string,
    data: z.infer<typeof ideasSchema>
  ) {
    // First find or create user by externalId (Auth0 ID)
    const user = await prisma.user.findUnique({
      where: { externalId },
    });

    if (!user) {
      throw new Error('User not found. Please contact support.');
    }

    const idea = await prisma.idea.create({
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        status: 'DRAFT',
        userId: user.id,
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
    const user = await prisma.user.findUnique({
      where: { externalId },
    });

    if (!user) {
      throw new Error('User not found');
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
    const user = await prisma.user.findUnique({
      where: { externalId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const idea = await prisma.idea.findUnique({
      where: { id: ideaId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        attachments: true,
      },
    });

    if (!idea) {
      throw new Error('Idea not found');
    }

    // Check ownership
    if (idea.userId !== user.id) {
      throw new Error('Unauthorized: You do not own this idea');
    }

    return idea;
  }

  async updateIdea(
    ideaId: string,
    externalId: string,
    data: z.infer<typeof updateIdeaSchema>
  ) {
    const user = await prisma.user.findUnique({
      where: { externalId },
    });

    if (!user) {
      throw new Error('User not found');
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
      data,
      include: {
        attachments: true,
      },
    });

    return updated;
  }

  async deleteIdea(
    ideaId: string,
    externalId: string
  ) {
    const user = await prisma.user.findUnique({
      where: { externalId },
    });

    if (!user) {
      throw new Error('User not found');
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
    const user = await prisma.user.findUnique({
      where: { externalId },
    });

    if (!user) {
      throw new Error('User not found');
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
}

export const ideasService = new IdeasService();
