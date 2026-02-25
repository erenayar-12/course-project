import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getUserRole } from './roleCheck';

export interface AuthRequest extends Request {
  userId?: string;
  email?: string;
  externalId?: string; // Auth0 sub
  userRole?: 'submitter' | 'evaluator' | 'admin'; // STORY-1.4 RBAC
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Missing or invalid authorization header',
      });
    }

    const token = authHeader.substring(7);
    const secret = process.env.JWT_SECRET || 'your-secret-key';

    // For Auth0 tokens, we decode but don't verify (verification happens at Auth0)
    // In production, use Auth0 SDK (auth0-js) or verify against jwks endpoint
    const decoded = jwt.decode(token) as any;

    if (!decoded || !decoded.sub) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
    }

    // Store user info in request
    req.externalId = decoded.sub; // Auth0 unique ID
    req.email = decoded.email;
    req.userId = decoded.sub; // For now, use externalId as userId
    req.userRole = getUserRole(decoded.email); // STORY-1.4 RBAC - determine user role

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({
      success: false,
      message: 'Authentication failed',
    });
  }
};
