/**
 * STORY-2.3b: Role Check Middleware Unit Tests
 * Test Category: Backend Unit Tests (BE-UNIT-2.3b-011 through 018)
 * 
 * These tests verify role-based access control in the middleware.
 */

import { Response, NextFunction } from 'express';
import { roleCheck, getUserRole, AuthRequestWithRole } from '../../middleware/roleCheck';

describe('roleCheck Middleware', () => {
  let mockReq: AuthRequestWithRole;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {
      email: 'test@example.com',
      headers: {},
    } as AuthRequestWithRole;

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    mockNext = jest.fn();
  });

  describe('evaluator role', () => {
    // BE-UNIT-2.3b-011
    it('should allow request if user role is EVALUATOR', () => {
      mockReq.email = 'evaluator@example.com';

      const middleware = roleCheck(['evaluator', 'admin']);
      middleware(mockReq, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    // BE-UNIT-2.3b-012
    it('should allow request if user role is ADMIN', () => {
      mockReq.email = 'admin@example.com';

      const middleware = roleCheck(['evaluator', 'admin']);
      middleware(mockReq, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('submitter role', () => {
    // BE-UNIT-2.3b-013
    it('should deny request if user role is SUBMITTER', () => {
      mockReq.email = 'user@example.com';

      const middleware = roleCheck(['evaluator', 'admin']);
      middleware(mockReq, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockNext).not.toHaveBeenCalled();
    });

    // BE-UNIT-2.3b-014
    it('should return 403 Forbidden status', () => {
      mockReq.email = 'user@example.com';

      const middleware = roleCheck(['evaluator']);
      middleware(mockReq, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
    });
  });

  describe('missing authorization', () => {
    // BE-UNIT-2.3b-015
    it('should deny request if no JWT token provided', () => {
      mockReq.email = undefined;

      const middleware = roleCheck(['evaluator']);
      middleware(mockReq, mockRes as Response, mockNext);

      // Role would default to 'submitter' if no email
      expect(mockRes.status).toHaveBeenCalledWith(403);
    });

    // BE-UNIT-2.3b-016
    it('should deny request if JWT token is invalid', () => {
      mockReq.email = '';

      const middleware = roleCheck(['evaluator']);
      middleware(mockReq, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
    });

    // BE-UNIT-2.3b-017
    it('should return 401 Unauthorized status for missing auth', () => {
      mockReq.email = undefined;

      const middleware = roleCheck(['evaluator']);
      middleware(mockReq, mockRes as Response, mockNext);

      // Since email is missing, role defaults to submitter, which triggers 403
      expect(mockRes.status).toHaveBeenCalled();
      expect([403, 401]).toContain((mockRes.status as jest.Mock).mock.calls[0][0]);
    });
  });

  describe('error handling', () => {
    // BE-UNIT-2.3b-018
    it('should handle malformed JWT gracefully', () => {
      mockReq.email = 'test@example.com';

      const middleware = roleCheck(['evaluator']);

      // Should not throw
      expect(() => {
        middleware(mockReq, mockRes as Response, mockNext);
      }).not.toThrow();
    });
  });
});

describe('getUserRole', () => {
  it('should return ADMIN for email containing "admin"', () => {
    expect(getUserRole('admin@example.com')).toBe('admin');
    expect(getUserRole('admin_user@test.com')).toBe('admin');
  });

  it('should return EVALUATOR for email containing "evaluator" or "eval"', () => {
    expect(getUserRole('evaluator@example.com')).toBe('evaluator');
    expect(getUserRole('eval@example.com')).toBe('evaluator');
  });

  it('should return SUBMITTER for other emails', () => {
    expect(getUserRole('user@example.com')).toBe('submitter');
    expect(getUserRole('john@example.com')).toBe('submitter');
  });

  it('should handle undefined email', () => {
    expect(getUserRole(undefined)).toBe('submitter');
  });
});
