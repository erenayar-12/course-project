import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function addComment(ideaId: string, authorId: string, text: string) {
  return await prisma.comment.create({
    data: {
      ideaId,
      authorId,
      text,
    },
  });
}

export async function getCommentsForIdea(ideaId: string) {
  return await prisma.comment.findMany({
    where: { ideaId },
    orderBy: { createdAt: 'asc' },
    include: { author: { select: { name: true, email: true, id: true } } },
  });
}
