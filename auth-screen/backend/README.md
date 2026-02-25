# Backend API Setup Guide

## Prerequisites

- Node.js v18+ installed
- PostgreSQL 14+ database
- npm/yarn package manager

## Installation & Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and update with your database credentials:

```bash
cp .env.example .env
```

Edit `.env` and update:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/innovatepam_db"
JWT_SECRET="your-long-secret-key-for-prod"
AUTH0_DOMAIN="your-auth0-domain.auth0.com"
AUTH0_CLIENT_ID="your-auth0-client-id"
```

### 3. Create PostgreSQL Database

Create a new PostgreSQL database named `innovatepam_db`:

**Using psql:**
```bash
createdb innovatepam_db
```

**Or using pgAdmin GUI:**
- Right-click on "Databases" → Create → Database
- Name: `innovatepam_db`
- Owner: `postgres` (or your DB user)

### 4. Run Database Migrations

Initialize the database schema:

```bash
npm run db:push
```

This creates three tables:
- `User` - Auth0 users
- `Idea` - Idea submissions
- `IdeaAttachment` - Uploaded files

### 5. Create Upload Directory

The app will automatically create `uploads/ideas/` directory on startup, but you can pre-create it:

```bash
mkdir -p uploads/ideas
```

## Development

### Start Dev Server

Runs with auto-reload on file changes:

```bash
npm run dev
```

Server will start on `http://localhost:3001`

### API Endpoints

**Health Check:**
- `GET /health` - API status

**Ideas:**
- `POST /api/ideas` - Create new idea
- `GET /api/ideas` - List user's ideas (paginated)
- `GET /api/ideas/:id` - Get idea details
- `PUT /api/ideas/:id` - Update idea
- `DELETE /api/ideas/:id` - Delete idea
- `POST /api/ideas/:id/upload` - Upload file for idea

All endpoints except `/health` require JWT authentication via `Authorization: Bearer <token>` header.

## Production Build

### Build TypeScript

```bash
npm run build
```

Outputs compiled JavaScript to `dist/` directory.

### Start Production Server

```bash
npm start
```

## Database Management

### View Database Schema

```bash
npm run db:push
```

This syncs your `prisma/schema.prisma` with PostgreSQL.

### Create New Migration

After changing `schema.prisma`:

```bash
npm run db:migrate
```

Name your migration (e.g., "add_user_role").

### Reset Database (Development Only)

⚠️ **WARNING: Deletes all data**

```bash
npx prisma db push --force-reset
```

### Inspect Database

```bash
npx prisma studio
```

Opens a web GUI to browse and edit database records.

## Testing

### Run Tests

```bash
npm test
```

### Watch Mode

```bash
npm run test:watch
```

## Troubleshooting

### Port Already in Use

Change `PORT` in `.env` (default: 3001)

### Database Connection Failed

1. Verify PostgreSQL is running:
   ```bash
   psql -U postgres -c "SELECT version();"
   ```

2. Check `DATABASE_URL` in `.env` is correct

3. Verify database exists:
   ```bash
   psql -U postgres -l | grep innovatepam_db
   ```

### Prisma Client Not Generated

Regenerate:

```bash
npm run db:generate
```

### CORS Errors

Update `FRONTEND_URL` in `.env` (default: http://localhost:5173)

## API Authentication

Requests must include a JWT token from Auth0:

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" http://localhost:3001/api/ideas
```

The token's `sub` claim is used to identify the user.

## File Upload Specs

- **Max File Size:** 10 MB
- **Allowed MIME Types:**
  - `application/pdf` (.pdf)
  - `application/msword` (.doc)
  - `application/vnd.openxmlformats-officedocument.wordprocessingml.document` (.docx)
  - `application/vnd.ms-excel` (.xls)
  - `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` (.xlsx)
  - `image/jpeg` (.jpg, .jpeg)
  - `image/png` (.png)

Files are stored in `uploads/ideas/` with unique names (UUID + timestamp).

## Architecture

```
src/
  middleware/
    auth.ts           - JWT verification
    errorHandler.ts   - Error response formatting
    requestLogger.ts  - Request/response logging
  routes/
    ideas.ts          - Idea CRUD endpoints
  services/
    ideas.service.ts  - Database operations
  types/
    ideaSchema.ts     - Zod validation schemas
  server.ts           - Express app setup
```

## Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| DATABASE_URL | ✅ | - | PostgreSQL connection string |
| PORT | ❌ | 3001 | API server port |
| NODE_ENV | ❌ | development | Environment (development/production) |
| JWT_SECRET | ❌ | your-secret-key | JWT signing secret |
| AUTH0_DOMAIN | ❌ | - | Auth0 tenant domain |
| AUTH0_CLIENT_ID | ❌ | - | Auth0 application ID |
| AUTH0_CLIENT_SECRET | ❌ | - | Auth0 application secret |
| UPLOAD_DIR | ❌ | ./uploads/ideas | File upload directory |
| MAX_FILE_SIZE | ❌ | 10MB | Maximum file size in bytes |
| FRONTEND_URL | ❌ | http://localhost:5173 | CORS origin |

## Support

For issues or questions, refer to the main project README or documentation.
