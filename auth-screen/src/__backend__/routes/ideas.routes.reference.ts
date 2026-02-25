/**
 * Backend API Routes for Ideas
 * These would be Express.js routes in a Node.js backend service
 *
 * In production, this would be: src/routes/ideas.ts
 * These are the HTTP endpoints that the frontend IdeasService.ts calls
 */

/**
 * EXPRESS ROUTE DEFINITIONS (REFERENCE)
 * =====================================
 *
 * import { Router } from 'express';
 * import { authenticateJWT } from '@/middleware/auth';
 * import { validateRequestBody } from '@/middleware/validation';
 *
 * const router = Router();
 * const ideasService = new IdeasServiceBackend(prisma);
 *
 * // POST /api/ideas - Create a new idea
 * router.post(
 *   '/',
 *   authenticateJWT,
 *   validateRequestBody(ideaSubmissionSchema),
 *   async (req, res, next) => {
 *     try {
 *       const userId = req.user?.sub; // From JWT token
 *       if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
 *
 *       const idea = await ideasService.createIdea(userId, req.body);
 *
 *       res.status(201).json({
 *         success: true,
 *         message: 'Idea submitted successfully',
 *         data: idea,
 *       });
 *     } catch (error) {
 *       next(error);
 *     }
 *   }
 * );
 *
 * // GET /api/ideas - Get user's ideas (paginated)
 * router.get(
 *   '/',
 *   authenticateJWT,
 *   async (req, res, next) => {
 *     try {
 *       const userId = req.user?.sub;
 *       if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
 *
 *       const page = parseInt(req.query.page as string) || 1;
 *       const limit = parseInt(req.query.limit as string) || 10;
 *
 *       const result = await ideasService.getUserIdeas(userId, page, limit);
 *
 *       res.status(200).json({
 *         success: true,
 *         data: result.ideas,
 *         pagination: result.pagination,
 *       });
 *     } catch (error) {
 *       next(error);
 *     }
 *   }
 * );
 *
 * // GET /api/ideas/:ideaId - Get single idea
 * router.get(
 *   '/:ideaId',
 *   authenticateJWT,
 *   async (req, res, next) => {
 *     try {
 *       const userId = req.user?.sub;
 *       if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
 *
 *       const idea = await ideasService.getIdeaById(req.params.ideaId, userId);
 *
 *       res.status(200).json({
 *         success: true,
 *         data: idea,
 *       });
 *     } catch (error) {
 *       next(error);
 *     }
 *   }
 * );
 *
 * // PUT /api/ideas/:ideaId - Update an idea
 * router.put(
 *   '/:ideaId',
 *   authenticateJWT,
 *   validateRequestBody(ideaSubmissionSchema),
 *   async (req, res, next) => {
 *     try {
 *       const userId = req.user?.sub;
 *       if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
 *
 *       const idea = await ideasService.updateIdea(req.params.ideaId, userId, req.body);
 *
 *       res.status(200).json({
 *         success: true,
 *         message: 'Idea updated successfully',
 *         data: idea,
 *       });
 *     } catch (error) {
 *       next(error);
 *     }
 *   }
 * );
 *
 * // DELETE /api/ideas/:ideaId - Delete an idea
 * router.delete(
 *   '/:ideaId',
 *   authenticateJWT,
 *   async (req, res, next) => {
 *     try {
 *       const userId = req.user?.sub;
 *       if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
 *
 *       const result = await ideasService.deleteIdea(req.params.ideaId, userId);
 *
 *       res.status(200).json({
 *         success: true,
 *         message: result.message,
 *       });
 *     } catch (error) {
 *       next(error);
 *     }
 *   }
 * );
 *
 * // GET /api/ideas/admin/status/:status - Get ideas by status (admin only)
 * router.get(
 *   '/admin/status/:status',
 *   authenticateJWT,
 *   async (req, res, next) => {
 *     try {
 *       const userId = req.user?.sub;
 *       if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
 *
 *       // In production: check if user is admin
 *       // if (!isAdmin(userId)) return res.status(403).json({ success: false, error: 'Forbidden' });
 *
 *       const page = parseInt(req.query.page as string) || 1;
 *       const result = await ideasService.getIdeasByStatus(req.params.status, page);
 *
 *       res.status(200).json({
 *         success: true,
 *         data: result.ideas,
 *         pagination: result.pagination,
 *       });
 *     } catch (error) {
 *       next(error);
 *     }
 *   }
 * );
 *
 * export default router;
 */

/**
 * MIDDLEWARE REQUIREMENTS (Reference)
 * ===================================
 *
 * authenticateJWT Middleware:
 * - Verifies JWT token from Authorization header
 * - Extracts user information (sub = user ID)
 * - Returns 401 if token invalid or missing
 *
 * validateRequestBody Middleware:
 * - Uses Zod schema to validate request body
 * - Returns 400 with validation errors if invalid
 * - Passes validation error details in response
 *
 * Example error response:
 * {
 *   "success": false,
 *   "error": "Validation failed",
 *   "details": [
 *     { "field": "title", "message": "Title must be at least 3 characters" },
 *     { "field": "description", "message": "Description must be at least 10 characters" }
 *   ]
 * }
 */

export const API_ROUTES_REFERENCE = {
  'POST /api/ideas': {
    auth: 'Required (JWT)',
    body: '{ title, description, category }',
    response: '201 Created',
    description: 'Create a new idea',
  },
  'GET /api/ideas': {
    auth: 'Required (JWT)',
    queryParams: '?page=1&limit=10',
    response: '200 OK with paginated ideas',
    description: 'Get user\'s ideas with pagination',
  },
  'GET /api/ideas/:ideaId': {
    auth: 'Required (JWT)',
    response: '200 OK with single idea',
    description: 'Get idea by ID (only if user is owner)',
  },
  'PUT /api/ideas/:ideaId': {
    auth: 'Required (JWT)',
    body: '{ title, description, category }',
    response: '200 OK with updated idea',
    description: 'Update idea (only for Submitted status)',
  },
  'DELETE /api/ideas/:ideaId': {
    auth: 'Required (JWT)',
    response: '200 OK',
    description: 'Delete idea (only for Submitted status)',
  },
};
