# Project Conventions Guide (agents.md)

This document establishes the standards and conventions for the **auth-screen** project. All team members and AI assistants should follow these guidelines when contributing to this project.

---

## 1. Tech Stack

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui or Material-UI

### Backend
- **Runtime:** Node.js (v18+)
- **Framework:** Express.js or Next.js API Routes
- **Language:** TypeScript

### Authentication
- **Service:** Auth0
- **Token Type:** JWT (Access + Refresh tokens)
- **Protocol:** OAuth 2.0

### Database
- **Type:** PostgreSQL
- **ORM:** Prisma or TypeORM

### Workflow Engine
- **Type:** State Machine (MVP Phase)
- **Status States:** Draft → Submitted → In Review → Approved/Rejected → Completed
- **Future:** Consider Bull Queue or Temporal for scaling

### Development Tools
- **Package Manager:** npm or yarn
- **Linter:** ESLint
- **Formatter:** Prettier
- **Testing:** Jest + React Testing Library

---

## 2. Specification Structure

All project specifications are stored in the `specs/` directory following this structure:

```
specs/
├── templates/
│   ├── prd-template.md           # PRD template
│   ├── epic-template.md          # Epic template
│   └── story-template.md         # User Story template
├── prds/
│   └── [PROJECT-ID]-prd.md       # Completed PRDs
├── epics/
│   └── [PROJECT-ID]-epic-[N].md  # Epics breakdown
└── stories/
    └── [PROJECT-ID]-story-[N].md # User Stories
```

### When to Use Each Template
- **PRD Template:** Start here for any major feature or project
- **Epic Template:** Break down PRD into large implementable features
- **Story Template:** Create individual development tasks from epics

---

## 3. Naming Conventions

### Document Naming Format
```
[PROJECT-ID]-[DOC-TYPE]-[INCREMENT].[EXTENSION]
```

### Project Identifiers
- **Auth System:** `AUTH`
- **Idea Submission:** `IDEA`
- **Workflow Engine:** `WF`

### Document Types
- `prd` - Product Requirements Document
- `epic` - Epic specification
- `story` - User Story

### Examples
- `AUTH-prd.md` - Authentication PRD
- `AUTH-epic-1.md` - First epic for auth
- `AUTH-story-1.md` - First user story for auth
- `IDEA-epic-2.md` - Second epic for idea submission
- `WF-story-3.md` - Third story for workflow system

---

## 4. File Organization

### Directory Structure
```
auth-screen/
├── .github/
│   └── prompts/                  # GitHub Copilot custom prompts
├── specs/
│   ├── templates/                # Template files (read-only reference)
│   ├── prds/                     # Completed PRD documents
│   ├── epics/                    # Epic breakdowns
│   └── stories/                  # Individual user stories
├── src/                          # Source code (to be created)
│   ├── components/               # React components
│   ├── pages/                    # Page components (Next.js)
│   ├── api/                      # API routes (Next.js)
│   ├── types/                    # TypeScript types/interfaces
│   ├── services/                 # Business logic (auth, api calls)
│   └── utils/                    # Utility functions
├── tests/                        # Test files
├── public/                       # Static assets
├── agents.md                     # This file (project conventions)
├── README.md                     # Project overview
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
└── vite.config.ts                # Vite configuration
```

---

## 5. Workflow Process

### Creating Specifications

1. **Start with PRD** (`AUTH-prd.md` or `IDEA-prd.md`)
   - Define problem, goals, personas, requirements
   - Use: `specs/templates/prd-template.md`

2. **Break into Epics** (`AUTH-epic-1.md`, `AUTH-epic-2.md`)
   - Decompose features into implementable chunks
   - Use: `specs/templates/epic-template.md`

3. **Create User Stories** (`AUTH-story-1.md`, `AUTH-story-2.md`)
   - Define specific development tasks
   - Use: `specs/templates/story-template.md`

### File Status Tracking
Add a **Status** field in all spec documents:
```
Status: [DRAFT / IN REVIEW / APPROVED / IN PROGRESS / COMPLETED]
```

---

## 6. Code Naming Conventions

### TypeScript/JavaScript
- **Files:** camelCase (e.g., `loginForm.tsx`, `authService.ts`)
- **Components:** PascalCase (e.g., `LoginForm`, `UserProfile`)
- **Functions:** camelCase (e.g., `handleSubmit`, `fetchUserData`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `MAX_PASSWORD_LENGTH`, `API_TIMEOUT`)
- **Types/Interfaces:** PascalCase (e.g., `UserCredentials`, `AuthResponse`)

### Database
- **Tables:** snake_case plural (e.g., `users`, `auth_tokens`, `workflow_states`)
- **Columns:** snake_case (e.g., `created_at`, `user_id`, `is_approved`)
- **Constraints:** descriptive (e.g., `fk_ideas_user_id`)

---

## 7. Communication Standards

### Specification Comments
- Use clear, actionable language
- Use placeholders like `[DESCRIPTION HERE]` in templates
- Include "Why" along with "What" in requirements
- Add acceptance criteria that are testable

### PR/Commit Messages
```
[SUBSYSTEM] Brief description

- Detailed change 1
- Detailed change 2
- Related spec: AUTH-story-5.md
```

### Example
```
[frontend] Add login form component

- Create LoginForm component with email/password fields
- Integrate Auth0 authentication flow
- Add form validation and error handling
- Related spec: AUTH-story-1.md
```

---

## 8. Quick Reference: Creating New Specs

### For a New Feature
```bash
# 1. Copy template and fill in
cd specs/
cp templates/prd-template.md prds/[PROJECT-ID]-prd.md

# 2. Fill in PRD details
# 3. Create epics
cp templates/epic-template.md epics/[PROJECT-ID]-epic-1.md

# 4. Create user stories
cp templates/story-template.md stories/[PROJECT-ID]-story-1.md
```

### Before Implementation
- [ ] PRD is approved
- [ ] All epics created
- [ ] All stories have acceptance criteria
- [ ] Stories follow INVEST principles

---

## 9. Project Phase Roadmap

**Phase 1 (MVP):** Authentication + Basic Workflow
- `AUTH-prd.md` → `AUTH-epic-1.md` → `AUTH-story-1..N.md`
- `WF-prd.md` → `WF-epic-1.md` → `WF-story-1..N.md`

**Phase 2:** Idea Submission System
- `IDEA-prd.md` → `IDEA-epic-1.md` → `IDEA-story-1..N.md`

**Phase 3:** Advanced Workflow Features
- `WF-epic-2.md` → `WF-story-N..M.md`

---

## 10. Current Sprint Specifications

### Story 1.5: Logout & Session Timeout

**Status:** APPROVED  
**Story Points:** 2  
**Estimated Days:** 0.5 - 1 day  
**Reference:** `specs/stories/STORY-EPIC-1.5-Logout-Timeout.md`

#### Overview
Implement user-initiated logout and automatic session timeout after 30 minutes of inactivity with 5-minute warning modal.

#### Acceptance Criteria
1. **AC1: Logout Button** - User can click logout button in navigation menu and be logged out
2. **AC2: Clear Auth Data** - Logout clears JWT token, user state, and localStorage
3. **AC3: 30-Min Timeout** - Session automatically expires after 30 minutes of inactivity  
4. **AC4: Activity Reset** - Mouse/keyboard/click events reset the inactivity counter
5. **AC5: Warning Modal** - Modal displays at 25-minute mark (5 min before timeout)

#### Technical Implementation

**New Components:**
- `src/hooks/useSessionTimeout.ts` - Custom hook for timeout logic
- `src/components/SessionWarningModal.tsx` - Warning modal component
- `src/constants/sessionConfig.ts` - Timeout constants

**Modified Components:**
- `src/components/Navbar.tsx` - Add Logout button
- `src/context/MockAuth0Context.tsx` - Update logout handler
- `src/App.tsx` - Integrate useSessionTimeout hook

**Key Constants:**
```typescript
const SESSION_TIMEOUT_MS = 30 * 60 * 1000;        // 30 minutes
const WARNING_THRESHOLD_MS = 25 * 60 * 1000;      // 5 min before timeout
const ACTIVITY_EVENTS = ['mousedown', 'keydown', 'click', 'scroll', 'touchstart'];
```

**Hook Responsibilities:**
1. Track user activity via event listeners
2. Maintain inactivity timer (reset on activity)
3. Show warning modal at 5-minute mark
4. Auto-logout at 30-minute mark
5. Reset timer when user clicks "Stay Logged In"

#### Dependencies
- ✅ STORY-1.2 (Auth0 integration with logout)
- ✅ Navigation component (Navbar.tsx)
- ✅ STORY-1.4 (RBAC for dashboard context)

#### Testing Strategy
- Unit tests for `useSessionTimeout` hook
- Integration: logout button clears auth state
- Mock time: simulate inactivity, verify auto-logout
- Verify warning modal at 25-minute mark
- Verify activity events reset timer

---

## 11. Questions? Update This Document

This is a living document. As conventions are clarified or changed, update this file so all team members and AI assistants stay aligned.

**Last Updated:** February 25, 2026  
**Owner:** GitHub Copilot / Development Team
