// PRISMA SCHEMA REFERENCE
// This file documents the database schema for STORY-2.1
// In production, this would be: prisma/schema.prisma

// prisma/schema.prisma
// =====================

/*
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  ideas     Idea[]
  
  @@index([email])
}

model Idea {
  id          String   @id @default(cuid())
  userId      String
  title       String   @db.VarChar(100)
  description String   @db.Text
  category    String   @db.VarChar(50)
  status      String   @db.VarChar(20) @default("Submitted")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  attachments IdeaAttachment[]

  @@index([userId])
  @@index([status])
  @@index([createdAt])
}

model IdeaAttachment {
  id        String   @id @default(cuid())
  ideaId    String
  fileName  String
  fileSize  Int
  mimeType  String
  filePath  String
  createdAt DateTime @default(now())

  idea      Idea     @relation(fields: [ideaId], references: [id], onDelete: Cascade)

  @@index([ideaId])
}

*/

// SETUP INSTRUCTIONS:
// 1. npm install @prisma/client prisma
// 2. Create .env with DATABASE_URL=postgresql://user:password@localhost:5432/innovatepam
// 3. Copy schema above to prisma/schema.prisma
// 4. Run: npx prisma migrate dev --name add_ideas_table
// 5. Run: npx prisma generate

// This schema creates:
// - User table: Authenticated users from Auth0
// - Idea table: All submitted ideas (main)
// - IdeaAttachment table: File attachments for ideas
// 
// Key indexes for performance:
// - userId: Fast filtering ideas by user
// - status: Fast filtering by idea status
// - createdAt: Fast sorting chronologically

export const PRISMA_SCHEMA_REFERENCE = `
See comments above for the Prisma schema.
This is provided as reference for backend implementation.
`;
