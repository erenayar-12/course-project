/**
 * Integration Tests: Ideas Filtering & Sorting
 * 
 * Tests for STORY-2.4 filtering and sorting features:
 * - Single-select status filtering
 * - Sorting by createdAt and title
 * - Sorting direction (ASC/DESC)
 * - Combined filter + sort
 * - Parameter validation
 * - Pagination with filters
 * 
 * @test STORY-2.4: Sort & Filter
 */

import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import { app } from '../../server';
import { createTestUser, createTestIdea, cleanupDatabase } from './test-helpers';

const prisma = new PrismaClient();

describe('GET /api/ideas - Filtering & Sorting', () => {
  let authToken: string;
  let userId: string;
  let testIdeas: any[] = [];

  beforeAll(async () => {
    // Create test user
    const user = await createTestUser(prisma);
    userId = user.id;
    
    // Create multiple test ideas with different statuses and dates
    testIdeas = await Promise.all([
      createTestIdea(prisma, userId, {
        title: 'Alpha Idea',
        status: 'DRAFT',
        createdAt: new Date('2026-02-01'),
      }),
      createTestIdea(prisma, userId, {
        title: 'Beta Idea',
        status: 'SUBMITTED',
        createdAt: new Date('2026-02-05'),
      }),
      createTestIdea(prisma, userId, {
        title: 'Charlie Idea',
        status: 'UNDER_REVIEW',
        createdAt: new Date('2026-02-10'),
      }),
      createTestIdea(prisma, userId, {
        title: 'Delta Idea',
        status: 'SUBMITTED',
        createdAt: new Date('2026-02-15'),
      }),
      createTestIdea(prisma, userId, {
        title: 'Echo Idea',
        status: 'APPROVED',
        createdAt: new Date('2026-02-20'),
      }),
    ]);

    // Generate auth token (mock implementation)
    authToken = generateMockAuthToken(user.externalId);
  });

  afterAll(async () => {
    await cleanupDatabase(prisma);
    await prisma.$disconnect();
  });

  // AC3: Single-Select Status Filter Works
  describe('AC3: Status Filter', () => {
    it('should filter ideas by SUBMITTED status', async () => {
      const res = await request(app)
        .get('/api/ideas')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ status: 'SUBMITTED' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(2); // Beta and Delta
      expect(res.body.data.every((idea: any) => idea.status === 'SUBMITTED')).toBe(true);
    });

    it('should filter ideas by UNDER_REVIEW status', async () => {
      const res = await request(app)
        .get('/api/ideas')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ status: 'UNDER_REVIEW' });

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1); // Charlie
      expect(res.body.data[0].title).toBe('Charlie Idea');
    });

    it('should return empty array when no ideas match status filter', async () => {
      const res = await request(app)
        .get('/api/ideas')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ status: 'REJECTED' });

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(0);
    });

    it('should reject invalid status value', async () => {
      const res = await request(app)
        .get('/api/ideas')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ status: 'INVALID_STATUS' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Invalid query parameters');
    });
  });

  // AC4: Sort Functionality Works
  describe('AC4: Sorting', () => {
    it('should sort by createdAt DESC (newest first) by default', async () => {
      const res = await request(app)
        .get('/api/ideas')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data[0].title).toBe('Echo Idea'); // 2026-02-20
      expect(res.body.data[res.body.data.length - 1].title).toBe('Alpha Idea'); // 2026-02-01
    });

    it('should sort by createdAt ASC (oldest first)', async () => {
      const res = await request(app)
        .get('/api/ideas')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ sortBy: 'createdAt', sortOrder: 'ASC' });

      expect(res.status).toBe(200);
      expect(res.body.data[0].title).toBe('Alpha Idea'); // 2026-02-01
      expect(res.body.data[res.body.data.length - 1].title).toBe('Echo Idea'); // 2026-02-20
    });

    it('should sort by title alphabetically (A-Z)', async () => {
      const res = await request(app)
        .get('/api/ideas')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ sortBy: 'title', sortOrder: 'ASC' });

      expect(res.status).toBe(200);
      expect(res.body.data[0].title).toBe('Alpha Idea');
      expect(res.body.data[1].title).toBe('Beta Idea');
      expect(res.body.data[4].title).toBe('Echo Idea');
    });

    it('should sort by title reverse alphabetically (Z-A)', async () => {
      const res = await request(app)
        .get('/api/ideas')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ sortBy: 'title', sortOrder: 'DESC' });

      expect(res.status).toBe(200);
      expect(res.body.data[0].title).toBe('Echo Idea');
      expect(res.body.data[1].title).toBe('Delta Idea');
      expect(res.body.data[4].title).toBe('Alpha Idea');
    });

    it('should reject invalid sortBy value', async () => {
      const res = await request(app)
        .get('/api/ideas')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ sortBy: 'invalidField' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject invalid sortOrder value', async () => {
      const res = await request(app)
        .get('/api/ideas')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ sortBy: 'title', sortOrder: 'INVALID' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  // AC5: Filter + Sort Combination Works
  describe('AC5: Combined Filter & Sort', () => {
    it('should filter by status and sort by title A-Z', async () => {
      const res = await request(app)
        .get('/api/ideas')
        .set('Authorization', `Bearer ${authToken}`)
        .query({
          status: 'SUBMITTED',
          sortBy: 'title',
          sortOrder: 'ASC',
        });

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(2); // Beta and Delta
      expect(res.body.data[0].title).toBe('Beta Idea');
      expect(res.body.data[1].title).toBe('Delta Idea');
    });

    it('should filter by status and sort by date DESC', async () => {
      const res = await request(app)
        .get('/api/ideas')
        .set('Authorization', `Bearer ${authToken}`)
        .query({
          status: 'SUBMITTED',
          sortBy: 'createdAt',
          sortOrder: 'DESC',
        });

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(2); // Beta and Delta
      expect(res.body.data[0].title).toBe('Delta Idea'); // 2026-02-15
      expect(res.body.data[1].title).toBe('Beta Idea'); // 2026-02-05
    });
  });

  // AC8: Pagination with Filters
  describe('AC8: Pagination with Filters', () => {
    it('should paginate filtered results', async () => {
      const res = await request(app)
        .get('/api/ideas')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ status: 'SUBMITTED', limit: 1, offset: 0 });

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.pagination.total).toBe(2);
    });

    it('should get second page of filtered results', async () => {
      const res = await request(app)
        .get('/api/ideas')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ status: 'SUBMITTED', limit: 1, offset: 1 });

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.pagination.page).toBe(2);
    });
  });

  // AC10: Parameter Validation
  describe('AC10: Parameter Validation', () => {
    it('should enforce minimum limit', async () => {
      const res = await request(app)
        .get('/api/ideas')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ limit: 0 });

      expect(res.status).toBe(400);
    });

    it('should enforce maximum limit', async () => {
      const res = await request(app)
        .get('/api/ideas')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ limit: 150 });

      expect(res.status).toBe(400);
    });

    it('should reject negative offset', async () => {
      const res = await request(app)
        .get('/api/ideas')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ offset: -1 });

      expect(res.status).toBe(400);
    });
  });

  // Performance Test
  describe('Performance', () => {
    it('should return filtered results within 1 second', async () => {
      const startTime = Date.now();
      const res = await request(app)
        .get('/api/ideas')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ status: 'SUBMITTED' });

      const duration = Date.now() - startTime;
      expect(res.status).toBe(200);
      expect(duration).toBeLessThan(1000);
    });
  });
});

// Helper function to generate mock auth token
function generateMockAuthToken(externalId: string): string {
  // In production, this would be a real JWT
  // For testing, we'd mock the auth middleware
  return `mock_token_${externalId}`;
}
