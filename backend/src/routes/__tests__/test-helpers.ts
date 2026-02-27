import { PrismaClient } from '@prisma/client';

export async function createTestUser(prisma: PrismaClient) {
  return await prisma.user.create({
    data: {
      externalId: 'test-external-id-' + Date.now(),
      email: 'testuser' + Date.now() + '@example.com',
      name: 'Test User',
    },
  });
}

export async function createTestIdea(prisma: PrismaClient, userId: string, overrides: any = {}) {
  return await prisma.idea.create({
    data: {
      userId,
      title: overrides.title || 'Test Idea',
      description: overrides.description || 'Test description',
      status: overrides.status || 'DRAFT',
      createdAt: overrides.createdAt || new Date(),
      ...overrides,
    },
  });
}

export async function cleanupDatabase(prisma: PrismaClient) {
  await prisma.idea.deleteMany();
  await prisma.user.deleteMany();
}
