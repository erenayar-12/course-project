import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedAdmin() {
  await prisma.user.upsert({
    where: { id: '07RbHjM0QzWE9dcAxwkbJ5KWfQQ2' },
    update: {},
    create: {
      id: '07RbHjM0QzWE9dcAxwkbJ5KWfQQ2',
      externalId: 'admin-external-id',
      email: 'admin@admin.com',
      name: 'Admin',
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });
  console.log('Admin user seeded');
}

seedAdmin().finally(() => prisma.$disconnect());
