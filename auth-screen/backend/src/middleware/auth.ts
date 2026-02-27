import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import dotenv from 'dotenv';
dotenv.config();

// Initialize Firebase Admin SDK using cert()
// Import service account JSON for cert()
import serviceAccount from '../../service-account.json' with { type: 'json' };
initializeApp({
  credential: cert(serviceAccount as any),
});
import { getUserRole } from './roleCheck.js';

export interface AuthRequest extends Request {
  userId?: string;
  email?: string;
  externalId?: string; // Auth0 sub
  userRole?: 'submitter' | 'evaluator' | 'admin'; // STORY-1.4 RBAC
  user?: {
    role: 'submitter' | 'evaluator' | 'admin';
    email: string;
    id: string;
  };
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
    // Verify Firebase JWT
    getAuth()
      .verifyIdToken(token)
      .then((decoded) => {
        req.externalId = decoded.uid;
        req.email = decoded.email;
        req.userId = decoded.uid;
        req.userRole = getUserRole(decoded.email);
        req.user = {
          role: req.userRole,
          email: req.email || '',
          id: req.userId || '',
        };
        next();
      })
      .catch((error) => {
        console.error('Firebase JWT verification failed:', error);
        res.status(401).json({
          success: false,
          message: 'Authentication failed',
        });
      });
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({
      success: false,
      message: 'Authentication failed',
    });
  }
};
