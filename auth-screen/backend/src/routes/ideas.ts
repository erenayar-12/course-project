import { Router, Response } from 'express';
import { default as multer } from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { AuthRequest, authMiddleware } from '../middleware/auth.js';
import { roleCheck } from '../middleware/roleCheck.js';
import { ideasService } from '../services/ideas.service.js';
import { evaluationService } from '../services/evaluation.service.js';
import { ideasSchema, updateIdeaSchema, paginationSchema, fileUploadSchema } from '../types/ideaSchema.js';
import { AppError } from '../middleware/errorHandler.js';
import fs from 'fs';

const router = Router();

// Configure multer for file uploads
const uploadDir = process.env.UPLOAD_DIR || './uploads/ideas';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req: any, file: any, cb: any) => {
    cb(null, uploadDir);
  },
  filename: (req: any, file: any, cb: any) => {
    const uniqueName = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req: any, file: any, cb: any) => {
  const allowedMimes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/jpeg',
    'image/png',
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid file type: ${file.mimetype}. Allowed: PDF, Word, Excel, JPEG, PNG`
      )
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

// POST /api/ideas - Create a new idea
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const validated = ideasSchema.parse(req.body);
    const idea = await ideasService.createIdea(req.externalId!, validated);

    res.status(201).json({
      success: true,
      message: 'Idea created successfully',
      data: idea,
    });
  } catch (error) {
    const err = error as any;
    if (err.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: err.errors,
      });
    }

    res.status(500).json({
      success: false,
      message: err.message || 'Failed to create idea',
    });
  }
});

// GET /api/ideas - List user's ideas
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const validated = paginationSchema.parse(req.query);
    const result = await ideasService.getUserIdeas(req.externalId!, validated);

    res.status(200).json({
      success: true,
      data: result.ideas,
      pagination: {
        total: result.total,
        page: result.page,
        pageSize: result.pageSize,
      },
    });
  } catch (error) {
    const err = error as any;
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to fetch ideas',
    });
  }
});

// GET /api/ideas/:id - Get specific idea
router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const idea = await ideasService.getIdeaById(
      req.params.id,
      req.externalId!
    );

    res.status(200).json({
      success: true,
      data: idea,
    });
  } catch (error) {
    const err = error as any;
    const statusCode = err.message.includes('Unauthorized') ? 403 : 
                       err.message.includes('not found') ? 404 : 500;

    res.status(statusCode).json({
      success: false,
      message: err.message || 'Failed to fetch idea',
    });
  }
});

// PUT /api/ideas/:id - Update idea
router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const validated = updateIdeaSchema.parse(req.body);
    const idea = await ideasService.updateIdea(
      req.params.id,
      req.externalId!,
      validated
    );

    res.status(200).json({
      success: true,
      message: 'Idea updated successfully',
      data: idea,
    });
  } catch (error) {
    const err = error as any;
    if (err.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: err.errors,
      });
    }

    const statusCode = err.message.includes('Unauthorized') ? 403 : 
                       err.message.includes('not found') ? 404 : 500;

    res.status(statusCode).json({
      success: false,
      message: err.message || 'Failed to update idea',
    });
  }
});

// DELETE /api/ideas/:id - Delete idea
router.delete(
  '/:id',
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      await ideasService.deleteIdea(req.params.id, req.externalId!);

      res.status(200).json({
        success: true,
        message: 'Idea deleted successfully',
      });
    } catch (error) {
      const err = error as any;
      const statusCode = err.message.includes('Unauthorized') ? 403 : 
                         err.message.includes('not found') ? 404 : 500;

      res.status(statusCode).json({
        success: false,
        message: err.message || 'Failed to delete idea',
      });
    }
  }
);

// POST /api/ideas/:id/upload - Upload file for idea
router.post(
  '/:id/upload',
  authMiddleware,
  upload.single('file'),
  async (req: AuthRequest, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file provided',
        });
      }

      // Validate file
      const validated = fileUploadSchema.parse({
        mimeType: req.file.mimetype,
        fileSize: req.file.size,
      });

      // Verify idea exists and user owns it
      await ideasService.getIdeaById(req.params.id, req.externalId!);

      // Add attachment to database
      const attachment = await ideasService.addAttachment(
        req.params.id,
        req.externalId!,
        req.file.originalname,
        req.file.filename,
        req.file.size,
        req.file.mimetype
      );

      res.status(201).json({
        success: true,
        message: 'File uploaded successfully',
        data: {
          attachmentId: attachment.id,
          ideaId: attachment.ideaId,
          originalFileName: attachment.originalName,
          fileSize: attachment.fileSize,
          mimeType: attachment.mimeType,
          uploadedAt: attachment.uploadedAt,
        },
      });
    } catch (error) {
      const err = error as any;

      // Clean up uploaded file on error
      if (req.file) {
        const filePath = path.join(uploadDir, req.file.filename);
        fs.unlink(filePath, (unlinkErr) => {
          if (unlinkErr) console.error('Failed to delete file:', unlinkErr);
        });
      }

      if (err.name === 'ZodError') {
        return res.status(400).json({
          success: false,
          message: 'File validation error',
          errors: err.errors,
        });
      }

      const statusCode = err.message.includes('Unauthorized') ? 403 : 
                         err.message.includes('not found') ? 404 : 500;

      res.status(statusCode).json({
        success: false,
        message: err.message || 'Failed to upload file',
      });
    }
  }
);

/**
 * STORY-1.4 AC4: Evaluation endpoints with role validation
 * POST /api/ideas/:id/evaluate - Submit idea evaluation (evaluator/admin only)
 * GET /api/ideas/:id/evaluation-history - Get evaluation history (evaluator/admin only)
 * POST /api/evaluation-queue/bulk-status-update - Bulk status update (evaluator/admin only)
 */

router.post(
  '/:id/evaluate',
  authMiddleware,
  roleCheck(['evaluator', 'admin']),
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { status, comments, fileUrl } = req.body;
      const externalId = req.user?.sub || 'unknown';

      if (!status || !comments) {
        return res.status(400).json({
          success: false,
          message: 'Status and comments are required',
        });
      }

      const validStatuses = ['accepted', 'rejected', 'needs_revision'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
        });
      }

      const evaluation = await evaluationService.submitEvaluation(id, externalId, {
        ideaId: id,
        status,
        comments,
        fileUrl,
      });

      res.status(201).json({
        success: true,
        message: 'Evaluation submitted successfully',
        data: evaluation,
      });
    } catch (err: any) {
      const statusCode = err.message.includes('not found') ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: err.message || 'Failed to submit evaluation',
      });
    }
  }
);

router.get(
  '/:id/evaluation-history',
  authMiddleware,
  roleCheck(['evaluator', 'admin']),
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;

      const history = await evaluationService.getEvaluationHistory(id);

      res.status(200).json({
        success: true,
        message: 'Evaluation history retrieved successfully',
        data: history,
      });
    } catch (err: any) {
      const statusCode = err.message.includes('not found') ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: err.message || 'Failed to retrieve evaluation history',
      });
    }
  }
);

/**
 * STORY-2.3b AC15: Bulk operations with role validation
 * POST /api/evaluation-queue/bulk-status-update - Bulk status update (evaluator/admin only)
 */

router.post(
  '/evaluation-queue/bulk-status-update',
  authMiddleware,
  roleCheck(['evaluator', 'admin']),
  async (req: AuthRequest, res: Response) => {
    try {
      const { ideaIds, status } = req.body;
      const externalId = req.user?.sub || 'unknown';

      if (!Array.isArray(ideaIds) || ideaIds.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'ideaIds must be a non-empty array',
        });
      }

      const result = await evaluationService.bulkStatusUpdate(
        ideaIds,
        status,
        externalId
      );

      res.status(200).json({
        success: true,
        message: 'Bulk status update completed',
        data: result,
      });
    } catch (err: any) {
      const statusCode = err.message.includes('limited to') ? 400 : 500;
      res.status(statusCode).json({
        success: false,
        message: err.message || 'Failed to update statuses',
      });
    }
  }
);

export default router;
