/**
 * STORY-2.3b: Evaluation API Routes
 * 
 * Endpoints for evaluator queue operations:
 * - GET /api/evaluation-queue - Fetch queue
 * - POST /api/ideas/:ideaId/evaluate - Submit evaluation
 * - GET /api/ideas/:ideaId/evaluation-history - Fetch audit trail
 * - POST /api/evaluation-queue/bulk-status-update - Batch update status
 * - POST /api/evaluation-queue/bulk-assign - Reassign evaluators
 * - GET /api/evaluation-queue/export - Export to CSV
 */

import { Router, Response } from 'express';
import { AuthRequest, authMiddleware } from '../middleware/auth.js';
import { requireEvaluator } from '../middleware/roleCheck.js';
import { evaluationService } from '../services/evaluation.service.js';

const router = Router();

// Apply auth middleware to all evaluation routes
router.use(authMiddleware);

/**
 * GET /api/evaluation-queue
 * Fetch evaluation queue - all ideas with open statuses (SUBMITTED, UNDER_REVIEW, NEEDS_REVISION)
 * 
 * Query params:
 * - status: comma-separated statuses (default: SUBMITTED,UNDER_REVIEW,NEEDS_REVISION)
 * - limit: results per page (default: 10, max: 100)
 * - offset: pagination offset (default: 0)
 * 
 * AC 12, AC 13: Shows all open ideas from all users, sorted by createdAt DESC (newest first)
 */
router.get('/api/evaluation-queue', requireEvaluator, async (req: AuthRequest, res: Response) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 100);
    const offset = parseInt(req.query.offset as string) || 0;

    const result = await evaluationService.getEvaluationQueue(limit, offset);

    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching evaluation queue:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch evaluation queue',
      error: (error as Error).message,
    });
  }
});

/**
 * POST /api/ideas/:ideaId/evaluate
 * Submit evaluation for an idea
 * 
 * Body:
 * - status: ACCEPTED | REJECTED | NEEDS_REVISION
 * - comments: string (max 500 chars)
 * - fileUrl?: string (optional evaluation notes file URL)
 * 
 * AC 14: Submit evaluation with comments and optional file, creates immutable audit record
 */
router.post('/api/ideas/:ideaId/evaluate', requireEvaluator, async (req: AuthRequest, res: Response) => {
  try {
    const { ideaId } = req.params;
    const { status, comments, fileUrl } = req.body;

    // Validate required fields
    if (!status || !comments) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: status, comments',
      });
    }

    // Validate status
    if (!['ACCEPTED', 'REJECTED', 'NEEDS_REVISION'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be ACCEPTED, REJECTED, or NEEDS_REVISION',
      });
    }

    // Validate comments length
    if (comments.length > 500) {
      return res.status(400).json({
        success: false,
        message: 'Comments must be 500 characters or less',
      });
    }

    const evaluation = await evaluationService.submitEvaluation(
      ideaId,
      req.userId!,
      { ideaId, status, comments, fileUrl }
    );

    res.status(200).json({
      success: true,
      evaluation,
      message: 'Evaluation submitted successfully',
    });
  } catch (error) {
    console.error('Error submitting evaluation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit evaluation',
      error: (error as Error).message,
    });
  }
});

/**
 * GET /api/ideas/:ideaId/evaluation-history
 * Fetch evaluation history for an idea (immutable audit trail)
 * 
 * AC 16: Shows all evaluations with date, evaluator, status, comments in read-only format
 */
router.get('/api/ideas/:ideaId/evaluation-history', requireEvaluator, async (req: AuthRequest, res: Response) => {
  try {
    const { ideaId } = req.params;

    const history = await evaluationService.getEvaluationHistory(ideaId);

    res.status(200).json({
      success: true,
      evaluations: history,
    });
  } catch (error) {
    console.error('Error fetching evaluation history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch evaluation history',
      error: (error as Error).message,
    });
  }
});

/**
 * POST /api/evaluation-queue/bulk-status-update
 * Apply status update to multiple ideas
 * 
 * Body:
 * - ideaIds: string[] (max 100)
 * - status: ACCEPTED | REJECTED | NEEDS_REVISION
 * 
 * AC 15: Bulk status update with confirmation, limited to 100 items
 */
router.post('/api/evaluation-queue/bulk-status-update', requireEvaluator, async (req: AuthRequest, res: Response) => {
  try {
    const { ideaIds, status } = req.body;

    if (!ideaIds || !Array.isArray(ideaIds) || ideaIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ideaIds. Must be a non-empty array',
      });
    }

    if (ideaIds.length > 100) {
      return res.status(400).json({
        success: false,
        message: 'Bulk operations limited to 100 items maximum',
      });
    }

    const result = await evaluationService.bulkStatusUpdate(ideaIds, status, req.userId!);

    res.status(200).json({
      success: true,
      ...result,
      message: `Successfully updated ${result.updated} ideas`,
    });
  } catch (error) {
    console.error('Error in bulk status update:', error);
    res.status(500).json({
      success: false,
      message: 'Bulk status update failed',
      error: (error as Error).message,
    });
  }
});

/**
 * POST /api/evaluation-queue/bulk-assign
 * Reassign evaluation of multiple ideas to another evaluator
 * 
 * Body:
 * - ideaIds: string[] (max 100)
 * - assigneeId: string (evaluator user ID)
 * 
 * AC 15: Bulk reassign with confirmation
 */
router.post('/api/evaluation-queue/bulk-assign', requireEvaluator, async (req: AuthRequest, res: Response) => {
  try {
    const { ideaIds, assigneeId } = req.body;

    if (!ideaIds || !Array.isArray(ideaIds) || ideaIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ideaIds. Must be a non-empty array',
      });
    }

    if (ideaIds.length > 100) {
      return res.status(400).json({
        success: false,
        message: 'Bulk operations limited to 100 items maximum',
      });
    }

    const result = await evaluationService.bulkAssign(ideaIds, assigneeId);

    res.status(200).json({
      success: true,
      ...result,
      message: `Successfully assigned ${result.assigned} ideas`,
    });
  } catch (error) {
    console.error('Error in bulk assign:', error);
    res.status(500).json({
      success: false,
      message: 'Bulk assign failed',
      error: (error as Error).message,
    });
  }
});

/**
 * GET /api/evaluation-queue/export
 * Export ideas to CSV
 * 
 * Query params:
 * - ids: comma-separated idea IDs (max 100)
 * 
 * AC 15: CSV export with all table columns
 */
router.get('/api/evaluation-queue/export', requireEvaluator, async (req: AuthRequest, res: Response) => {
  try {
    const idsParam = req.query.ids as string;

    if (!idsParam) {
      return res.status(400).json({
        success: false,
        message: 'Missing ids query parameter',
      });
    }

    const ideaIds = idsParam.split(',');

    if (ideaIds.length > 100) {
      return res.status(400).json({
        success: false,
        message: 'CSV export limited to 100 items maximum',
      });
    }

    const csv = await evaluationService.exportToCSV(ideaIds);

    res.status(200)
      .set('Content-Type', 'text/csv')
      .set('Content-Disposition', `attachment; filename="ideas-export.csv"`)
      .send(csv);
  } catch (error) {
    console.error('Error in CSV export:', error);
    res.status(500).json({
      success: false,
      message: 'CSV export failed',
      error: (error as Error).message,
    });
  }
});

export default router;
