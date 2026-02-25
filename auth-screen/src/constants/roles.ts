/**
 * Role-Based Access Control Constants
 *
 * Defines all available roles in the system.
 * Reference: STORY-EPIC-1.4 - AC1
 */

export const ROLES = {
  ADMIN: 'admin',
  EVALUATOR: 'evaluator',
  SUBMITTER: 'submitter',
} as const;

export type UserRole = typeof ROLES[keyof typeof ROLES];

/**
 * Role hierarchy for permission checking
 * Used to determine if a user has sufficient permissions
 */
export const ROLE_PERMISSIONS: Record<UserRole, UserRole[]> = {
  [ROLES.ADMIN]: [ROLES.ADMIN, ROLES.EVALUATOR, ROLES.SUBMITTER],
  [ROLES.EVALUATOR]: [ROLES.EVALUATOR, ROLES.SUBMITTER],
  [ROLES.SUBMITTER]: [ROLES.SUBMITTER],
};

/**
 * Routes that require specific roles
 * Reference: STORY-EPIC-1.4 - AC2, AC3
 */
export const PROTECTED_ROUTES: Record<string, UserRole[]> = {
  '/dashboard': [ROLES.SUBMITTER, ROLES.EVALUATOR, ROLES.ADMIN],
  '/submit-idea': [ROLES.SUBMITTER, ROLES.ADMIN],
  '/evaluation-queue': [ROLES.EVALUATOR, ROLES.ADMIN],
  '/admin-panel': [ROLES.ADMIN],
};
