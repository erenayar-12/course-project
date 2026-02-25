import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import ideasRouter from './routes/ideas';

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
  ╔════════════════════════════════════════╗
  ║  Innovate PAM Backend API              ║
  ║  Server running on http://localhost:${PORT}    ║
  ║  Environment: ${process.env.NODE_ENV || 'development'}          ║
  ╚════════════════════════════════════════╝
  
  API Documentation:
    POST   /api/ideas              Create new idea
    GET    /api/ideas              List user's ideas
    GET    /api/ideas/:id          Get idea by ID
    PUT    /api/ideas/:id          Update idea
    DELETE /api/ideas/:id          Delete idea
    POST   /api/ideas/:id/upload   Upload file for idea
  
  Health Check:
    GET    /health                 API health status
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
