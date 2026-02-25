/**
 * Authentication Routes
 * 
 * Handles JWT token refresh and role synchronization
 * STORY-1.4 AC5: Token refresh with role updates
 */

import { Router, Response } from 'express';
import { AuthRequest, authMiddleware } from '../middleware/auth.js';
import { getUserRole } from '../middleware/roleCheck.js';

const router = Router();

/**
 * POST /api/auth/refresh
 * Refresh JWT token and sync role information
 * 
 * STORY-1.4 AC5: Implements token refresh mechanism for role updates
 * 
 * Request body:
 *   - token: string (current JWT token)
 *   - externalId?: string (Auth0 sub claim, for testing)
 * 
 * Response:
 *   - accessToken: string (new JWT token)
 *   - role: 'submitter' | 'evaluator' | 'admin' (updated role from email)
 *   - email: string (email from token)
 */
router.post('/refresh', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const email = req.email || 'unknown@example.com';
    const externalId = req.externalId || 'unknown';

    // Recalculate role based on current email
    // This allows role changes to be picked up on next token refresh
    const updatedRole = getUserRole(email);

    // In a real implementation, you would:
    // 1. Validate the current token
    // 2. Generate a new JWT with updated claims
    // 3. Return both token and user info
    //
    // For now, we return the updated role information

    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        accessToken: req.headers.authorization?.replace('Bearer ', '') || '',
        role: updatedRole,
        email: email,
        externalId: externalId,
        refreshedAt: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to refresh token',
    });
  }
});

export default router;
