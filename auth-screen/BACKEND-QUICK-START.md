# 🚀 Backend Setup Quick Start Guide

## Before You Start
Make sure PostgreSQL is installed and running on your system.

## 3-Minute Setup

### 1. Create Database
```bash
# MacOS/Linux
createdb innovatepam_db

# Windows (if psql is in PATH)
createdb -U postgres innovatepam_db

# Or use pgAdmin GUI
# Right-click Databases → Create → Database → Name: innovatepam_db
```

### 2. Configure Environment
```bash
cd backend
# Already created from .env.example in git repository
```

### 3. Initialize Database Schema
```bash
npm run db:push
```

### 4. Start Dev Server
```bash
npm run dev
```

Server runs on **http://localhost:3001**

## Test the API

### Health Check
```bash
curl http://localhost:3001/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2026-02-25T10:30:00Z",
  "environment": "development"
}
```

### Create Test User (optional)
To test authenticated endpoints, you need to add a user to the database with an Auth0 token.

Using Prisma Studio:
```bash
npx prisma studio
```

This opens a GUI at http://localhost:5555 where you can:
1. Click "User" table
2. Click "Create" button
3. Fill in:
   - externalId: `auth0|test-user` (the `sub` from your JWT)
   - email: `test@example.com`
   - name: `Test User`
   - role: `USER`
   - status: `ACTIVE`
4. Click Create

### Create Idea (Requires JWT Token)
```bash
curl -X POST http://localhost:3001/api/ideas \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Idea",
    "description": "This is a test idea for the platform",
    "category": "PRODUCT"
  }'
```

Replace `YOUR_JWT_TOKEN` with a valid Auth0 token where the `sub` claim matches the user's `externalId`.

### List Ideas
```bash
curl http://localhost:3001/api/ideas?limit=10&offset=0 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Upload File
```bash
curl -X POST http://localhost:3001/api/ideas/IDEA_ID/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@proposal.pdf"
```

Replace `IDEA_ID` with the ID returned from the create idea endpoint.

## Available Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Run production build |
| `npm run db:push` | Sync database schema |
| `npm run db:migrate` | Create new migration |
| `npm run db:generate` | Regenerate Prisma client |
| `npm test` | Run tests (when implemented) |

## File Upload Spec

- **Max Size:** 10 MB
- **Allowed Formats:** PDF, Word (.doc, .docx), Excel (.xls, .xlsx), JPEG, PNG
- **Storage:** Files stored in `uploads/ideas/` directory

## Troubleshooting

### "Cannot connect to database"
1. Verify PostgreSQL is running
2. Check DATABASE_URL in .env is correct
3. Verify database exists: `psql -l | grep innovatepam_db`

### "Port 3001 already in use"
Change `PORT` in `.env` to an available port

### "JWT token invalid"
1. Use a valid Auth0 token
2. Ensure user with matching `sub` exists in User table
3. Check token hasn't expired

### "File upload fails"
1. Check file size is under 10 MB
2. Verify file format is allowed (PDF, Word, Excel, JPEG, PNG)
3. Ensure `uploads/ideas/` directory exists (created automatically on startup)

## Database Inspection

### View Data in Browser
```bash
npx prisma studio
```

Opens GUI at http://localhost:5555

### Query Database Directly
```bash
psql innovatepam_db

# List tables
\dt

# View users
SELECT * FROM "User";

# View ideas
SELECT * FROM "Idea";

# Quit
\q
```

## Next Steps

1. ✅ Database created
2. ✅ Backend running
3. **Next:** Configure frontend to connect to backend
   - Update API base URL in frontend .env
   - Use localhost:3001 for development

## Architecture Overview

```
Frontend (Vite React)        Backend (Express API)       Database (PostgreSQL)
localhost:5173               localhost:3001
    |                            |                            |
    |  POST /api/ideas           |                            |
    |---->|  Validate JWT         |                            |
    |     |---->|  Create Idea    |                            |
    |     |     |---->| INSERT User/Idea       |
    |     |<----|  Return ID           |<------|
    |<----|                                     |
    |                                           |
    |  POST /api/ideas/:id/upload              |
    |---->|  Multer Upload         |           |
    |     |---->|  Save to Disk    |           |
    |     |     |---->| INSERT Attachment |
    |     |<----|  Return Meta           |<---|
    |<----|
```

## File Locations

| Path | Purpose |
|------|---------|
| `backend/.env` | Configuration (not in git) |
| `backend/src/server.ts` | Express app entry point |
| `backend/src/routes/ideas.ts` | REST endpoints |
| `backend/src/services/ideas.service.ts` | Database layer |
| `backend/src/middleware/auth.ts` | JWT verification |
| `backend/prisma/schema.prisma` | Database schema |
| `backend/uploads/ideas/` | Uploaded files storage |
| `backend/dist/` | Compiled JavaScript (after npm run build) |

## Security Notes

- All endpoints except `/health` require JWT from Auth0
- File uploads validated by MIME type and size
- Database ownership enforced (users can only access their own ideas)
- SQL injection prevented via Prisma ORM
- CORS configured to allow frontend only

## Production Deployment Checklist

- [ ] Set NODE_ENV=production
- [ ] Configure real Auth0 credentials
- [ ] Use strong JWT_SECRET (min 32 chars)
- [ ] Set DATABASE_URL to production PostgreSQL
- [ ] Update FRONTEND_URL for CORS
- [ ] Set up file storage (S3 instead of disk)
- [ ] Enable HTTPS
- [ ] Set up monitoring and logging
- [ ] Configure database backups
- [ ] Test all endpoints with production credentials

---

**Need Help?** See [Backend README](./backend/README.md) for full documentation.
