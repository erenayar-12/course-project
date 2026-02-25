import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';
import ideasRouter from './routes/ideas.js';
import authRouter from './routes/auth.js';
import evaluationsRouter from './routes/evaluations.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const corsOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';

// Middleware
app.use(cors({ origin: corsOrigin }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Routes
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

app.use('/api/ideas', ideasRouter);
app.use('/api/auth', authRouter);
app.use(evaluationsRouter); // Evaluation routes (already have /api prefix)

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.path}`,
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Graceful shutdown
const server = app.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════════════════════════╗
  ║  Innovate PAM Backend API (STORY-1.4 RBAC Complete)   ║
  ║  Server running on http://localhost:${PORT}              ║
  ║  Environment: ${process.env.NODE_ENV || 'development'}                  ║
  ╚════════════════════════════════════════════════════════╝
  
  ✅ STORY-1.4 AC4: API endpoints with role validation
  ✅ STORY-1.4 AC5: Token refresh with role sync
  
  API Endpoints:
    Ideas Management:
      POST   /api/ideas              Create new idea
      GET    /api/ideas              List user's ideas
      GET    /api/ideas/:id          Get idea by detail
      PUT    /api/ideas/:id          Update idea
      DELETE /api/ideas/:id          Delete idea
    
    File Operations:
      POST   /api/ideas/:id/upload   Upload file for idea
    
    Evaluation (Evaluator/Admin Only - AC4):
      POST   /api/ideas/:id/evaluate            Submit idea evaluation
      GET    /api/ideas/:id/evaluation-history  Get evaluation history (audit trail)
      POST   /api/evaluation-queue/bulk-status-update  Bulk status update (AC15)
    
    Authentication (AC5 - Token Refresh):
      POST   /api/auth/refresh       Refresh token and sync role
    
    Health Check:
      GET    /health                 API health status
  
  Role-Based Access Control (RBAC - AC1-AC5):
    - Submitter (default): Can create/update/delete own ideas
    - Evaluator: Can view all ideas, submit evaluations, perform bulk operations
    - Admin: Full access to all operations
  
  Note: Role detection uses email pattern matching (admin/evaluator keywords)
  `);
});

process.on('SIGINT', () => {
  console.log('\nShutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\nTerminating gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

export default app;
