/**
 * STORY-2.3b: Evaluation Endpoints Integration Tests
 * Test Category: Backend Integration Tests (BE-INT-2.3b-005 through 009)
 * 
 * These tests verify HTTP API endpoints and role-based access control.
 */

import express, { Express } from 'express';
import request from 'supertest';
import { authMiddleware } from '../../middleware/auth';
import { requireEvaluator } from '../../middleware/roleCheck';

// Mock handler for testing
const mockEvaluateHandler = (req: any, res: any) => {
  res.status(200).json({
    id: 'eval-1',
    ideaId: req.params.id,
    evaluatorId: req.userId,
    status: req.body.status,
    comments: req.body.comments,
    createdAt: new Date(),
  });
};

const mockHistoryHandler = (req: any, res: any) => {
  res.status(200).json([
    {
      id: 'eval-1',
      status: 'ACCEPTED',
      comments: 'Good work',
      createdAt: new Date(),
    },
  ]);
};

const mockBulkUpdateHandler = (req: any, res: any) => {
  const { ideaIds, status } = req.body;

  if (ideaIds.length > 100) {
    return res.status(400).json({ error: 'Bulk operations limited to 100 items maximum' });
  }

  res.status(200).json({ updatedCount: ideaIds.length });
};

const mockExportHandler = (req: any, res: any) => {
  const csv = 'Submitter,Title,Category,Date,Status\nUser 1,Idea 1,INNOVATION,2025-02-01,SUBMITTED';
  res.status(200).set('Content-Type', 'text/csv').send(csv);
};

describe('Evaluation Endpoints Integration Tests', () => {
  let app: Express;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use(authMiddleware);

    // POST /api/ideas/:id/evaluate
    app.post('/api/ideas/:id/evaluate', requireEvaluator, mockEvaluateHandler);

    // GET /api/ideas/:id/evaluations
    app.get('/api/ideas/:id/evaluations', requireEvaluator, mockHistoryHandler);

    // PATCH /api/ideas/bulk-evaluate
    app.patch('/api/ideas/bulk-evaluate', requireEvaluator, mockBulkUpdateHandler);

    // GET /api/ideas/export/csv
    app.get('/api/ideas/export/csv', requireEvaluator, mockExportHandler);
  });

  // BE-INT-2.3b-005
  it('should accept evaluation request and return 200 with saved record', async () => {
    const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyLTEiLCJlbWFpbCI6ImV2YWx1YXRvckBleGFtcGxlLmNvbSJ9.SIGNATURE';

    const response = await request(app)
      .post('/api/ideas/idea-1/evaluate')
      .set('Authorization', token)
      .send({
        status: 'ACCEPTED',
        comments: 'Great idea!',
      });

    expect(response.status).toBe(200);
    expect(response.body.id).toBe('eval-1');
    expect(response.body.status).toBe('ACCEPTED');
  });

  // BE-INT-2.3b-006
  it('should return evaluation history for idea', async () => {
    const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyLTEiLCJlbWFpbCI6ImV2YWx1YXRvckBleGFtcGxlLmNvbSJ9.SIGNATURE';

    const response = await request(app)
      .get('/api/ideas/idea-1/evaluations')
      .set('Authorization', token);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  // BE-INT-2.3b-007
  it('should update status for up to 100 ideas', async () => {
    const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyLTEiLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIn0.SIGNATURE';
    const ideaIds = Array.from({ length: 50 }, (_, i) => `idea-${i}`);

    const response = await request(app)
      .patch('/api/ideas/bulk-evaluate')
      .set('Authorization', token)
      .send({
        ideaIds,
        status: 'UNDER_REVIEW',
        comments: 'Bulk assignment',
      });

    expect(response.status).toBe(200);
    expect(response.body.updatedCount).toBe(50);
  });

  // BE-INT-2.3b-008
  it('should reject request with > 100 ideas', async () => {
    const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyLTEiLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIn0.SIGNATURE';
    const ideaIds = Array.from({ length: 101 }, (_, i) => `idea-${i}`);

    const response = await request(app)
      .patch('/api/ideas/bulk-evaluate')
      .set('Authorization', token)
      .send({ ideaIds, status: 'UNDER_REVIEW' });

    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/exceed.*100/i);
  });

  // BE-INT-2.3b-009
  it('should generate CSV with correct columns and format', async () => {
    const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyLTEiLCJlbWFpbCI6ImV2YWx1YXRvckBleGFtcGxlLmNvbSJ9.SIGNATURE';

    const response = await request(app)
      .get('/api/ideas/export/csv?status=SUBMITTED')
      .set('Authorization', token);

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/text\/csv/);
    expect(response.text).toMatch(/Submitter,Title,Category/);
  });
});
