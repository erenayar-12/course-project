# STORY-2.1: Create Idea Submission Form with Validation

**Story ID:** STORY-2.1  
**Epic:** EPIC-2 (Idea Submission & Management System)  
**Created:** February 25, 2026  
**Status:** DRAFT  
**Priority:** P0 (High) - Blocks all downstream stories  
**Story Points:** 5 (T-shirt sizing: M = 3-5 days)  
**Estimated Duration:** 3-5 days  
**Owner:** [Developer Name]  
**Tech Stack:** React 18 + TypeScript + Vite + Tailwind CSS + Zod + React Hook Form  
**Backend Stack:** Node.js v18+ + Express.js + TypeScript + Prisma + PostgreSQL

## Title
Create Idea Submission Form with Client and Server Validation

## Description
As a **submitter**, I want to submit an innovative idea through a structured form so that my idea can be evaluated by the management team. The form should guide me through the submission process with clear labels, helpful hints, and validation to ensure all required information is provided before submission.

## Acceptance Criteria

### Functional Requirements (AC)
- [ ] **AC1:** Form displays all required fields: Title, Description, Category, and optional Attachments
- [ ] **AC2:** Form includes helpful labels and placeholder text for each field
- [ ] **AC3:** Client-side validation prevents submission with empty required fields
- [ ] **AC4:** Client-side validation enforces field limits:
  - Title: 3-100 characters
  - Description: 10-2000 characters
  - Category: required selection from dropdown
- [ ] **AC5:** Form displays clear error messages for each validation failure
- [ ] **AC6:** Form displays success message after successful submission
- [ ] **AC7:** Submitted data is persisted to PostgreSQL database via Prisma ORM
- [ ] **AC8:** User is redirected to "My Ideas" dashboard after successful submission
- [ ] **AC9:** Form can be submitted via Enter key or Submit button
- [ ] **AC10:** Form includes a Cancel button that clears all fields and confirms with user

### Non-Functional Requirements (NFR)
- [ ] **NFR1:** Form loads within 2 seconds
- [ ] **NFR2:** Form is fully responsive (mobile, tablet, desktop)
- [ ] **NFR3:** Form follows EPAM brand guidelines and design system (Tailwind CSS + shadcn/ui)
- [ ] **NFR4:** Form handles network errors gracefully with user-friendly error notifications
- [ ] **NFR5:** Server validates all fields (no implicit client-side dependencies)
- [ ] **NFR6:** Database insert includes proper error handling and rollback on failure
- [ ] **NFR7:** Component has >80% test coverage (Jest + React Testing Library)

## Implementation Tasks

### Frontend (React 18 + TypeScript + Vite)
- [ ] Create `src/components/IdeaSubmissionForm.tsx` component (PascalCase) in file `ideaSubmissionForm.tsx`
- [ ] Implement form state management using React Hook Form (recommended for form libraries)
- [ ] Implement Zod schema for client-side validation under `src/types/ideaSchema.ts`
- [ ] Create reusable form field components:
  - `FormTextField.tsx` (Text input wrapper)
  - `FormTextArea.tsx` (Textarea wrapper)
  - `FormSelect.tsx` (Dropdown wrapper)
- [ ] Integrate form submission with API endpoint (`POST /api/ideas`)
- [ ] Add error handling and user feedback using toast notifications (shadcn/ui Toast)
- [ ] Implement loading state during form submission
- [ ] Style form with Tailwind CSS for responsive design
- [ ] Add keyboard event handlers (Enter to submit, Escape to cancel)
- [ ] Integrate Auth0 token retrieval for API authentication

### Backend (Node.js v18+ + Express.js + TypeScript)
- [ ] Create `src/api/routes/ideas.ts` with POST `/api/ideas` endpoint
- [ ] Implement server-side request validation middleware using Zod
- [ ] Add JWT authentication/authorization middleware to verify user token
- [ ] Create Prisma schema for ideas table:
  ```prisma
  model Idea {
    id        String   @id @default(cuid())
    userId    String
    title     String   @db.VarChar(100)
    description String @db.Text
    category  String   @db.VarChar(50)
    status    String   @db.VarChar(20) @default("Submitted")
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
    
    user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
    
    @@index([userId])
    @@index([status])
  }
  ```
- [ ] Create `src/services/ideas.service.ts` for database operations (Prisma client)
- [ ] Implement ideas repository pattern for database abstraction
- [ ] Add request logging using built-in Express middleware
- [ ] Implement proper error handling with try-catch and custom error responses
- [ ] Return proper HTTP status codes (201 Created, 400 Bad Request, 401 Unauthorized, 500 Internal Server Error)

### Database (PostgreSQL + Prisma)
- [ ] Run `npx prisma migrate dev --name add_ideas_table` to generate migration
- [ ] Verify UUID extension is enabled in PostgreSQL
- [ ] Verify foreign key constraint with users table
- [ ] Verify indexes on `userId` and `status` columns

### Testing (Jest + React Testing Library)
- [ ] Unit tests for Zod validation schema (`ideaSchema.test.ts`)
- [ ] Component tests for `IdeaSubmissionForm.tsx` (React Testing Library)
  - Test form field rendering
  - Test validation error messages
  - Test form submission success
  - Test cancel button functionality
- [ ] Integration tests for form submission flow with mock API
- [ ] E2E tests for complete submission workflow (fill form → submit → verify redirect)
- [ ] Test network error handling and retry logic
- [ ] Achieve >80% code coverage for component

## Technical Notes

### Tech Stack (Per agents.md)
- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Node.js v18+, Express.js, TypeScript
- **Authentication:** Auth0 (JWT tokens via OAuth 2.0)
- **Database:** PostgreSQL with Prisma ORM
- **Testing:** Jest + React Testing Library
- **Form Library:** React Hook Form (state management)
- **Validation:** Zod (both client and server)

### File Structure
```
src/
├── components/
│   ├── ideaSubmissionForm.tsx          # IdeaSubmissionForm component
│   ├── formTextField.tsx               # FormTextField component
│   ├── formTextArea.tsx                # FormTextArea component
│   └── formSelect.tsx                  # FormSelect component
├── types/
│   └── ideaSchema.ts                   # Zod schema + TypeScript types
├── services/
│   └── ideas.service.ts                # Ideas business logic
├── api/
│   └── routes/
│       └── ideas.ts                    # POST /api/ideas endpoint
└── __tests__/
    ├── ideaSubmissionForm.test.tsx     # Component tests
    └── ideaSchema.test.ts              # Schema validation tests
```

### Database Schema (Prisma)
```prisma
model Idea {
  id        String   @id @default(cuid())
  userId    String
  title     String   @db.VarChar(100)
  description String @db.Text
  category  String   @db.VarChar(50)
  status    String   @db.VarChar(20) @default("Submitted")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
  @@index([status])
}
```

### API Response Format (TypeScript)
```typescript
interface IdeaResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    userId: string;
    title: string;
    description: string;
    category: string;
    status: "Submitted" | "Under Review" | "Accepted" | "Rejected";
    createdAt: string;
    updatedAt: string;
  };
}
```

### Validation Schema (Zod)
```typescript
export const ideaSubmissionSchema = z.object({
  title: z.string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must not exceed 100 characters"),
  description: z.string()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description must not exceed 2000 characters"),
  category: z.enum(["Innovation", "Process Improvement", "Cost Reduction", "Other"])
    .refine(v => v !== "", "Category is required")
});
```

### Field Validations
- **Title:** 3-100 characters, alphanumeric + spaces + common punctuation
- **Description:** 10-2000 characters, free text
- **Category:** Enum from predefined list: Innovation, Process Improvement, Cost Reduction, Other

## Definition of Done
- [ ] Code follows naming conventions: Component files camelCase (e.g., `ideaSubmissionForm.tsx`), Components PascalCase (e.g., `IdeaSubmissionForm`)
- [ ] Code review completed and approved
- [ ] All unit tests passing with >80% code coverage (Jest)
- [ ] All component tests passing (React Testing Library)
- [ ] All integration tests passing
- [ ] All E2E tests passing
- [ ] No console errors or warnings
- [ ] No TypeScript compilation errors (`tsc --noEmit`)
- [ ] Code formatted with Prettier
- [ ] ESLint passes without warnings
- [ ] Responsive design verified on mobile/tablet/desktop
- [ ] Accessibility checks passed (WCAG 2.1 AA)
- [ ] Prisma migrations applied successfully
- [ ] Documentation updated (README, component docs)
- [ ] Commit message follows format: `[frontend] Add idea submission form component` + related spec reference
- [ ] Merged to main branch via approved PR

---

## Dependencies

### Must Complete BEFORE This Story
- ✅ **EPIC-1 (Authentication):** User must be authenticated before submitting ideas
- ✅ **Database Setup:** PostgreSQL and Prisma configuration complete
- ✅ **Project Setup:** React 18 + Vite + TypeScript scaffolding complete
- ✅ **UI Components:** Tailwind CSS and shadcn/ui installed and accessible

### This Story Unblocks
- 🔗 [STORY-2.2: File Upload](STORY-2.2-File-Upload.md) - Depends on form component
- 🔗 [STORY-2.3: Dashboard](STORY-2.3-Dashboard.md) - Depends on ideas database schema
- 🔗 [STORY-2.5: Detail Page](STORY-2.5-Detail-Page.md) - Depends on ideas in database
- 🔗 [STORY-2.6: Edit](STORY-2.6-Edit-Functionality.md) - Depends on form infrastructure

### Related Stories
- 🔗 [STORY-2.2: File Upload Handling](STORY-2.2-File-Upload.md) (P0, blocks dashboard)
- 🔗 [STORY-2.3: Dashboard List View](STORY-2.3-Dashboard.md) (P1)
- 🔗 [STORY-2.4: Sorting & Filtering](STORY-2.4-Sort-Filter.md) (P1)
- 🔗 [STORY-2.5: Detail Page](STORY-2.5-Detail-Page.md) (P1)
- 🔗 [STORY-2.6: Edit Functionality](STORY-2.6-Edit-Functionality.md) (P2)
