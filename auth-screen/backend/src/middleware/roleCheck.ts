import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.js';

/**
 * Role-Based Access Control (RBAC) Middleware
 * Validates that authenticated user has one of the required roles
 * 
 * Reference: STORY-EPIC-1.4 - AC4 (API endpoints validate role)
 * 
 * Usage:
 *   router.post('/ideas/:id/evaluate', roleCheck(['evaluator', 'admin']), handler);
 */

export type UserRole = 'submitter' | 'evaluator' | 'admin';

export interface AuthRequestWithRole extends AuthRequest {
  userRole?: UserRole;
}

/**
 * Determine user role from JWT token or request
 * 
 * In a real implementation:
 * - Role would come from JWT claim (added by Auth0 rules)
 * - Format: decoded.https://innovatepam.com/roles = ['evaluator']
 * 
 * For now, we'll use a simple pattern-based approach:
 * - Email with "admin" → ADMIN
 * - Email with "evaluator" or "eval" → EVALUATOR
 * - Default → SUBMITTER
 */
export const getUserRole = (email?: string): UserRole => {
  if (!email) return 'submitter';
  
  const lowerEmail = email.toLowerCase();
  
  if (lowerEmail.includes('admin')) {
    return 'admin';
  }
  
  if (lowerEmail.includes('evaluator') || lowerEmail.includes('eval')) {
    return 'evaluator';
  }
  
  return 'submitter';
};

/**
 * Middleware factory: Returns middleware that checks for required roles
 * 
 * @param requiredRoles - Array of roles that are authorized
 * @returns Express middleware function
 */
export const roleCheck = (requiredRoles: UserRole[]) => {
  return (req: AuthRequestWithRole, res: Response, next: NextFunction) => {
    try {
      // Determine user role from email (in real app, would be from JWT claim)
      const userRole = getUserRole(req.email);
      req.userRole = userRole;

      // Check if user role is in the required roles list
      if (!requiredRoles.includes(userRole)) {
        return res.status(403).json({
          success: false,
          code: 'INSUFFICIENT_PERMISSIONS',
          message: 'Insufficient permissions for this action',
          userRole,
          requiredRoles,
        });
      }

      // User has required role, proceed to next middleware/handler
      next();
    } catch (error) {
      console.error('Role check middleware error:', error);
      res.status(500).json({
        success: false,
        message: 'Role validation failed',
      });
    }
  };
};

/**
 * Middleware to require EVALUATOR or ADMIN role
 * Commonly used for evaluation endpoints
 */
export const requireEvaluator = roleCheck(['evaluator', 'admin']);

/**
 * Middleware to require ADMIN role
 * Commonly used for system administration endpoints
 */
export const requireAdmin = roleCheck(['admin']);
