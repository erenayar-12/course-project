# STORY-2.1 Test Specification

**Story ID:** STORY-2.1  
**Title:** Create Idea Submission Form with Validation  
**Generated:** February 25, 2026  
**Testing Framework:** Jest + React Testing Library (Frontend), Jest + Supertest (Backend)  
**Coverage Target:** 80% (measured by jest --coverage)  
**Test-First Mandate:** TDD (Red-Green-Refactor cycle)

---

## I. Testing Strategy (Per constitution.md)

### Testing Pyramid Distribution

```
        ◆ E2E (10%)              2-3 critical workflows
       ◆ ◆ Integration (20%)     8-12 endpoint scenarios
      ◆ ◆ ◆ Unit Tests (70%)    35-45 unit tests
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━
     Total: 45-60 tests across all levels
```

### Coverage Targets
- **Line Coverage:** 80% minimum
- **Branch Coverage:** 75% minimum
- **Function Coverage:** 80% minimum
- **Mutation Score:** 75% minimum

---

## II. Frontend Test Suite (React 18 + React Testing Library)

### Folder Structure
```
src/
├── components/
│   ├── ideaSubmissionForm.tsx
│   ├── formTextField.tsx
│   ├── formTextArea.tsx
│   ├── formSelect.tsx
│   └── __tests__/
│       ├── ideaSubmissionForm.test.tsx      (Unit: Component rendering & interactions)
│       ├── ideaSubmissionForm.integration.test.tsx  (Integration: Full form submission)
│       ├── formTextField.test.tsx           (Unit: Form field component)
│       ├── formTextArea.test.tsx            (Unit: Textarea component)
│       └── formSelect.test.tsx              (Unit: Select component)
├── types/
│   ├── ideaSchema.ts
│   └── __tests__/
│       └── ideaSchema.test.ts               (Unit: Zod validation schema)
├── services/
│   ├── ideas.service.ts
│   └── __tests__/
│       ├── ideas.service.test.ts            (Unit: Service business logic)
│       └── ideas.service.integration.test.ts (Integration: API calls)
└── tests/
    ├── e2e/
    │   └── idea-submission-flow.spec.ts    (E2E: Submit form → Dashboard)
    ├── fixtures/
    │   ├── ideaFixtures.ts                 (Test idea data)
    │   └── userFixtures.ts                 (Test user data)
    ├── setup.ts                            (Jest setup)
    └── helpers.ts                          (Test utilities)
```

### A. Unit Tests (70% of tests)

#### 1. ideaSchema.test.ts - Zod Validation Schema

**File Location:** `src/types/__tests__/ideaSchema.test.ts`

**Test Cases (Arrange-Act-Assert pattern):**

```typescript
/**
 * Unit tests for idea submission form validation schema.
 * Validates that Zod schema correctly enforces title, description, and category constraints.
 * Framework: Jest
 * Execution target: <100ms per test
 */

describe('ideaSubmissionSchema', () => {
  describe('title validation', () => {
    describe('when title is valid (3-100 characters)', () => {
      it('should accept title with 3 characters', () => {
        // ARRANGE
        const input = { title: 'ABC', description: 'Valid description', category: 'Innovation' };
        
        // ACT
        const result = ideaSubmissionSchema.safeParse(input);
        
        // ASSERT
        expect(result.success).toBe(true);
      });

      it('should accept title with 100 characters', () => {
        // ARRANGE
        const longTitle = 'A'.repeat(100);
        const input = { title: longTitle, description: 'Valid description', category: 'Innovation' };
        
        // ACT
        const result = ideaSubmissionSchema.safeParse(input);
        
        // ASSERT
        expect(result.success).toBe(true);
      });

      it('should accept title with spaces and punctuation', () => {
        // ARRANGE
        const input = { title: 'New Feature - Cost Reduction!', description: 'Description', category: 'Innovation' };
        
        // ACT
        const result = ideaSubmissionSchema.safeParse(input);
        
        // ASSERT
        expect(result.success).toBe(true);
      });
    });

    describe('when title is invalid', () => {
      it('should reject title with less than 3 characters', () => {
        // ARRANGE
        const input = { title: 'AB', description: 'Valid description', category: 'Innovation' };
        
        // ACT
        const result = ideaSubmissionSchema.safeParse(input);
        
        // ASSERT
        expect(result.success).toBe(false);
        expect(result.error?.issues[0].message).toContain('at least 3');
      });

      it('should reject title with more than 100 characters', () => {
        // ARRANGE
        const longTitle = 'A'.repeat(101);
        const input = { title: longTitle, description: 'Valid description', category: 'Innovation' };
        
        // ACT
        const result = ideaSubmissionSchema.safeParse(input);
        
        // ASSERT
        expect(result.success).toBe(false);
        expect(result.error?.issues[0].message).toContain('exceed 100');
      });

      it('should reject empty title', () => {
        // ARRANGE
        const input = { title: '', description: 'Valid description', category: 'Innovation' };
        
        // ACT
        const result = ideaSubmissionSchema.safeParse(input);
        
        // ASSERT
        expect(result.success).toBe(false);
      });
    });
  });

  describe('description validation', () => {
    describe('when description is valid (10-2000 characters)', () => {
      it('should accept description with 10 characters', () => {
        // ARRANGE
        const input = { title: 'Valid Title', description: '1234567890', category: 'Innovation' };
        
        // ACT
        const result = ideaSubmissionSchema.safeParse(input);
        
        // ASSERT
        expect(result.success).toBe(true);
      });

      it('should accept description with 2000 characters', () => {
        // ARRANGE
        const longDesc = 'A'.repeat(2000);
        const input = { title: 'Valid Title', description: longDesc, category: 'Innovation' };
        
        // ACT
        const result = ideaSubmissionSchema.safeParse(input);
        
        // ASSERT
        expect(result.success).toBe(true);
      });

      it('should accept description with multiline and special characters', () => {
        // ARRANGE
        const input = {
          title: 'Valid Title',
          description: 'This is a detailed description.\nWith multiple lines!\nAnd special chars: @#$%',
          category: 'Innovation'
        };
        
        // ACT
        const result = ideaSubmissionSchema.safeParse(input);
        
        // ASSERT
        expect(result.success).toBe(true);
      });
    });

    describe('when description is invalid', () => {
      it('should reject description with less than 10 characters', () => {
        // ARRANGE
        const input = { title: 'Valid Title', description: 'Short', category: 'Innovation' };
        
        // ACT
        const result = ideaSubmissionSchema.safeParse(input);
        
        // ASSERT
        expect(result.success).toBe(false);
        expect(result.error?.issues[0].message).toContain('at least 10');
      });

      it('should reject description with more than 2000 characters', () => {
        // ARRANGE
        const longDesc = 'A'.repeat(2001);
        const input = { title: 'Valid Title', description: longDesc, category: 'Innovation' };
        
        // ACT
        const result = ideaSubmissionSchema.safeParse(input);
        
        // ASSERT
        expect(result.success).toBe(false);
        expect(result.error?.issues[0].message).toContain('exceed 2000');
      });

      it('should reject empty description', () => {
        // ARRANGE
        const input = { title: 'Valid Title', description: '', category: 'Innovation' };
        
        // ACT
        const result = ideaSubmissionSchema.safeParse(input);
        
        // ASSERT
        expect(result.success).toBe(false);
      });
    });
  });

  describe('category validation', () => {
    describe('when category is valid', () => {
      it('should accept "Innovation" category', () => {
        // ARRANGE
        const input = { title: 'Valid Title', description: 'Valid description', category: 'Innovation' };
        
        // ACT
        const result = ideaSubmissionSchema.safeParse(input);
        
        // ASSERT
        expect(result.success).toBe(true);
      });

      it('should accept all valid categories', () => {
        // ARRANGE
        const categories = ['Innovation', 'Process Improvement', 'Cost Reduction', 'Other'];
        
        // ACT & ASSERT
        categories.forEach(cat => {
          const input = { title: 'Valid Title', description: 'Valid description', category: cat };
          const result = ideaSubmissionSchema.safeParse(input);
          expect(result.success).toBe(true);
        });
      });
    });

    describe('when category is invalid', () => {
      it('should reject unknown category', () => {
        // ARRANGE
        const input = { title: 'Valid Title', description: 'Valid description', category: 'InvalidCategory' };
        
        // ACT
        const result = ideaSubmissionSchema.safeParse(input);
        
        // ASSERT
        expect(result.success).toBe(false);
      });

      it('should reject empty category', () => {
        // ARRANGE
        const input = { title: 'Valid Title', description: 'Valid description', category: '' };
        
        // ACT
        const result = ideaSubmissionSchema.safeParse(input);
        
        // ASSERT
        expect(result.success).toBe(false);
      });
    });
  });

  describe('complete form validation', () => {
    it('should validate complete valid form submission', () => {
      // ARRANGE
      const input = {
        title: 'Reduce Processing Time',
        description: 'Implement automated workflow to reduce manual processing from 2 hours to 30 minutes',
        category: 'Process Improvement'
      };
      
      // ACT
      const result = ideaSubmissionSchema.safeParse(input);
      
      // ASSERT
      expect(result.success).toBe(true);
      expect(result.data).toEqual(input);
    });

    it('should return all validation errors for completely invalid form', () => {
      // ARRANGE
      const input = { title: 'AB', description: 'Short', category: 'Invalid' };
      
      // ACT
      const result = ideaSubmissionSchema.safeParse(input);
      
      // ASSERT
      expect(result.success).toBe(false);
      expect(result.error?.issues).toHaveLength(3); // title, description, category errors
    });
  });
});
```

**Coverage Metrics:**
- All validation branches: 100%
- All error paths: 100%
- Time: ~50ms (10 tests)

---

#### 2. formTextField.test.tsx - Form Text Field Component

**File Location:** `src/components/__tests__/formTextField.test.tsx`

**Test Cases:**

```typescript
/**
 * Unit tests for FormTextField reusable component.
 * Validates input field rendering, value changes, error display, and accessibility.
 * Framework: Jest + React Testing Library
 */

describe('FormTextField', () => {
  describe('rendering', () => {
    it('should render input field with label', () => {
      // ARRANGE
      const { getByLabelText } = render(
        <FormTextField label="Title" name="title" />
      );
      
      // ACT & ASSERT
      expect(getByLabelText('Title')).toBeInTheDocument();
    });

    it('should render with placeholder text', () => {
      // ARRANGE
      const { getByPlaceholderText } = render(
        <FormTextField placeholder="Enter title" name="title" />
      );
      
      // ACT & ASSERT
      expect(getByPlaceholderText('Enter title')).toBeInTheDocument();
    });

    it('should render error message when provided', () => {
      // ARRANGE
      const { getByText } = render(
        <FormTextField name="title" error="Title is required" />
      );
      
      // ACT & ASSERT
      expect(getByText('Title is required')).toBeInTheDocument();
    });

    it('should display error styling when error is present', () => {
      // ARRANGE
      const { getByName } = render(
        <FormTextField name="title" error="Error message" />
      );
      
      // ACT & ASSERT
      const input = getByName('title') as HTMLInputElement;
      expect(input).toHaveClass('border-red-500'); // Tailwind error class
    });

    it('should be disabled when disabled prop is true', () => {
      // ARRANGE
      const { getByName } = render(
        <FormTextField name="title" disabled={true} />
      );
      
      // ACT & ASSERT
      expect((getByName('title') as HTMLInputElement).disabled).toBe(true);
    });
  });

  describe('user interaction', () => {
    it('should call onChange when user types', () => {
      // ARRANGE
      const handleChange = jest.fn();
      const { getByName } = render(
        <FormTextField name="title" onChange={handleChange} />
      );
      const input = getByName('title') as HTMLInputElement;
      
      // ACT
      fireEvent.change(input, { target: { value: 'New Idea' } });
      
      // ASSERT
      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(input.value).toBe('New Idea');
    });

    it('should call onBlur when field loses focus', () => {
      // ARRANGE
      const handleBlur = jest.fn();
      const { getByName } = render(
        <FormTextField name="title" onBlur={handleBlur} />
      );
      
      // ACT
      fireEvent.blur(getByName('title'));
      
      // ASSERT
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });
  });

  describe('accessibility', () => {
    it('should have associated label with input', () => {
      // ARRANGE
      const { getByLabelText } = render(
        <FormTextField label="Title" name="title" />
      );
      
      // ACT & ASSERT
      expect(getByLabelText('Title')).toBeInTheDocument();
    });

    it('should have aria-invalid attribute when error present', () => {
      // ARRANGE
      const { getByName } = render(
        <FormTextField name="title" error="Error" />
      );
      
      // ACT & ASSERT
      expect(getByName('title')).toHaveAttribute('aria-invalid', 'true');
    });

    it('should have aria-describedby pointing to error message', () => {
      // ARRANGE
      const { getByName, getByText } = render(
        <FormTextField name="title" error="Title is required" />
      );
      
      // ACT
      const input = getByName('title');
      const errorMsg = getByText('Title is required');
      
      // ASSERT
      expect(input).toHaveAttribute('aria-describedby', errorMsg.id);
    });
  });
});
```

**Coverage Metrics:**
- Component rendering: 100%
- Event handlers: 100%
- Time: ~80ms (8 tests)

---

#### 3. ideaSubmissionForm.test.tsx - Main Form Component (Unit Tests)

**File Location:** `src/components/__tests__/ideaSubmissionForm.test.tsx`

**Test Cases (Select Critical Tests):**

```typescript
/**
 * Unit tests for IdeaSubmissionForm component.
 * Validates form rendering, field visibility, and user interactions.
 * Framework: Jest + React Testing Library
 * Note: API submission tested in integration tests
 */

describe('IdeaSubmissionForm', () => {
  describe('rendering', () => {
    it('should render all form fields', () => {
      // ARRANGE
      const { getByLabelText } = render(<IdeaSubmissionForm />);
      
      // ACT & ASSERT
      expect(getByLabelText('Title')).toBeInTheDocument();
      expect(getByLabelText('Description')).toBeInTheDocument();
      expect(getByLabelText('Category')).toBeInTheDocument();
    });

    it('should render Submit and Cancel buttons', () => {
      // ARRANGE
      const { getByRole } = render(<IdeaSubmissionForm />);
      
      // ACT & ASSERT
      expect(getByRole('button', { name: /submit/i })).toBeInTheDocument();
      expect(getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });

    it('should render form with correct structure', () => {
      // ARRANGE
      const { container } = render(<IdeaSubmissionForm />);
      
      // ACT & ASSERT
      expect(container.querySelector('form')).toBeInTheDocument();
    });
  });

  describe('form validation display', () => {
    it('should not show validation errors on initial render', () => {
      // ARRANGE
      const { queryByText } = render(<IdeaSubmissionForm />);
      
      // ACT & ASSERT
      expect(queryByText(/title is required/i)).not.toBeInTheDocument();
    });

    it('should show error message when title field is touched and empty', async () => {
      // ARRANGE
      const { getByLabelText, getByText } = render(<IdeaSubmissionForm />);
      const titleInput = getByLabelText('Title');
      
      // ACT
      fireEvent.focus(titleInput);
      fireEvent.blur(titleInput);
      await waitFor(() => {
        // ASSERT
        expect(getByText(/title is required/i)).toBeInTheDocument();
      });
    });

    it('should show error when title exceeds maximum length', async () => {
      // ARRANGE
      const { getByLabelText, getByText } = render(<IdeaSubmissionForm />);
      
      // ACT
      fireEvent.change(getByLabelText('Title'), {
        target: { value: 'A'.repeat(101) }
      });
      fireEvent.blur(getByLabelText('Title'));
      
      await waitFor(() => {
        // ASSERT
        expect(getByText(/exceed 100/i)).toBeInTheDocument();
      });
    });
  });

  describe('user interactions', () => {
    it('should enable Submit button when all fields valid', async () => {
      // ARRANGE
      const { getByLabelText, getByRole } = render(<IdeaSubmissionForm />);
      
      // ACT
      fireEvent.change(getByLabelText('Title'), {
        target: { value: 'Valid Title' }
      });
      fireEvent.change(getByLabelText('Description'), {
        target: { value: 'Valid description text here' }
      });
      fireEvent.change(getByLabelText('Category'), {
        target: { value: 'Innovation' }
      });
      
      await waitFor(() => {
        // ASSERT
        expect(getByRole('button', { name: /submit/i })).not.toBeDisabled();
      });
    });

    it('should keep Submit button disabled until all fields valid', () => {
      // ARRANGE
      const { getByRole } = render(<IdeaSubmissionForm />);
      
      // ACT & ASSERT
      expect(getByRole('button', { name: /submit/i })).toBeDisabled();
    });
  });

  describe('form cancellation', () => {
    it('should call onCancel when Cancel button clicked', () => {
      // ARRANGE
      const mockOnCancel = jest.fn();
      const { getByRole } = render(<IdeaSubmissionForm onCancel={mockOnCancel} />);
      
      // ACT
      fireEvent.click(getByRole('button', { name: /cancel/i }));
      
      // ASSERT
      expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });
  });
});
```

**Coverage Metrics:**
- Form rendering: 100%
- Validation display: 95%
- User interactions: 90%
- Time: ~150ms (12 tests)

---

### B. Integration Tests (20% of tests)

#### ideaSubmissionForm.integration.test.tsx - Full Form Submission

**File Location:** `src/components/__tests__/ideaSubmissionForm.integration.test.tsx`

**Test Cases:**

```typescript
/**
 * Integration tests for complete idea submission flow.
 * Tests interaction with IdeasService, API calls, and success/error paths.
 * Framework: Jest + React Testing Library + MSW (Mock Service Worker)
 */

describe('IdeaSubmissionForm (Integration)', () => {
  // SHARED ARRANGE
  beforeEach(() => {
    server.listen();
  });

  afterEach(() => {
    server.resetHandlers();
    server.close();
  });

  describe('form submission success', () => {
    it('should submit form with valid data to POST /api/ideas', async () => {
      // ARRANGE
      const mockIdea = {
        id: 'idea-123',
        title: 'Reduce Processing Time',
        description: 'Implement automated workflow',
        category: 'Process Improvement'
      };
      
      server.use(
        rest.post('http://localhost:3001/api/ideas', (req, res, ctx) => {
          return res(ctx.status(201), ctx.json({ success: true, data: mockIdea }));
        })
      );

      const mockOnSuccess = jest.fn();
      const { getByLabelText, getByRole } = render(
        <IdeaSubmissionForm onSuccess={mockOnSuccess} />
      );

      // ACT
      fireEvent.change(getByLabelText('Title'), {
        target: { value: mockIdea.title }
      });
      fireEvent.change(getByLabelText('Description'), {
        target: { value: mockIdea.description }
      });
      fireEvent.change(getByLabelText('Category'), {
        target: { value: mockIdea.category }
      });
      fireEvent.click(getByRole('button', { name: /submit/i }));

      // ASSERT
      await waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalledWith(mockIdea);
      });
    });

    it('should show success message after successful submission', async () => {
      // ARRANGE
      server.use(
        rest.post('http://localhost:3001/api/ideas', (req, res, ctx) => {
          return res(ctx.status(201), ctx.json({ success: true, data: {} }));
        })
      );

      const { getByLabelText, getByRole, getByText } = render(<IdeaSubmissionForm />);

      // ACT
      fireEvent.change(getByLabelText('Title'), { target: { value: 'Valid Title' } });
      fireEvent.change(getByLabelText('Description'), { target: { value: 'Valid description' } });
      fireEvent.change(getByLabelText('Category'), { target: { value: 'Innovation' } });
      fireEvent.click(getByRole('button', { name: /submit/i }));

      // ASSERT
      await waitFor(() => {
        expect(getByText(/submitted successfully/i)).toBeInTheDocument();
      });
    });

    it('should disable form fields and submit button during submission', async () => {
      // ARRANGE
      let resolveRequest: () => void;
      const requestPromise = new Promise<void>((resolve) => {
        resolveRequest = resolve;
      });

      server.use(
        rest.post('http://localhost:3001/api/ideas', async (req, res, ctx) => {
          await requestPromise;
          return res(ctx.status(201), ctx.json({ success: true, data: {} }));
        })
      );

      const { getByLabelText, getByRole } = render(<IdeaSubmissionForm />);

      // ACT - Fill form
      fireEvent.change(getByLabelText('Title'), { target: { value: 'Valid Title' } });
      fireEvent.change(getByLabelText('Description'), { target: { value: 'Valid description' } });
      fireEvent.change(getByLabelText('Category'), { target: { value: 'Innovation' } });
      
      // ACT - Submit
      fireEvent.click(getByRole('button', { name: /submit/i }));

      // ASSERT - During submission (before request resolves)
      expect((getByLabelText('Title') as HTMLInputElement).disabled).toBe(true);
      expect(getByRole('button', { name: /submit/i })).toBeDisabled();

      // CLEANUP
      resolveRequest!();
    });
  });

  describe('form submission failure', () => {
    it('should display error message on API failure (500)', async () => {
      // ARRANGE
      server.use(
        rest.post('http://localhost:3001/api/ideas', (req, res, ctx) => {
          return res(
            ctx.status(500),
            ctx.json({ success: false, error: 'Internal server error' })
          );
        })
      );

      const { getByLabelText, getByRole, getByText } = render(<IdeaSubmissionForm />);

      // ACT
      fireEvent.change(getByLabelText('Title'), { target: { value: 'Valid Title' } });
      fireEvent.change(getByLabelText('Description'), { target: { value: 'Valid description' } });
      fireEvent.change(getByLabelText('Category'), { target: { value: 'Innovation' } });
      fireEvent.click(getByRole('button', { name: /submit/i }));

      // ASSERT
      await waitFor(() => {
        expect(getByText(/internal server error/i)).toBeInTheDocument();
      });
    });

    it('should display validation error message on 400 Bad Request', async () => {
      // ARRANGE
      server.use(
        rest.post('http://localhost:3001/api/ideas', (req, res, ctx) => {
          return res(
            ctx.status(400),
            ctx.json({
              success: false,
              error: 'Validation failed',
              details: [{ field: 'title', message: 'Title already exists' }]
            })
          );
        })
      );

      const { getByLabelText, getByRole, getByText } = render(<IdeaSubmissionForm />);

      // ACT
      fireEvent.change(getByLabelText('Title'), { target: { value: 'Existing Title' } });
      fireEvent.change(getByLabelText('Description'), { target: { value: 'Valid description' } });
      fireEvent.change(getByLabelText('Category'), { target: { value: 'Innovation' } });
      fireEvent.click(getByRole('button', { name: /submit/i }));

      // ASSERT
      await waitFor(() => {
        expect(getByText(/title already exists/i)).toBeInTheDocument();
      });
    });

    it('should handle network timeout gracefully', async () => {
      // ARRANGE
      server.use(
        rest.post('http://localhost:3001/api/ideas', (req, res, ctx) => {
          return res(
            ctx.status(408),
            ctx.json({ success: false, error: 'Request timeout' })
          );
        })
      );

      const { getByLabelText, getByRole, getByText } = render(<IdeaSubmissionForm />);

      // ACT
      fireEvent.change(getByLabelText('Title'), { target: { value: 'Valid Title' } });
      fireEvent.change(getByLabelText('Description'), { target: { value: 'Valid description' } });
      fireEvent.change(getByLabelText('Category'), { target: { value: 'Innovation' } });
      fireEvent.click(getByRole('button', { name: /submit/i }));

      // ASSERT
      await waitFor(() => {
        expect(getByText(/request timeout/i)).toBeInTheDocument();
      });
    });

    it('should re-enable form after submission failure', async () => {
      // ARRANGE
      server.use(
        rest.post('http://localhost:3001/api/ideas', (req, res, ctx) => {
          return res(ctx.status(500), ctx.json({ success: false, error: 'Error' }));
        })
      );

      const { getByLabelText, getByRole } = render(<IdeaSubmissionForm />);

      // ACT
      fireEvent.change(getByLabelText('Title'), { target: { value: 'Valid Title' } });
      fireEvent.change(getByLabelText('Description'), { target: { value: 'Valid description' } });
      fireEvent.change(getByLabelText('Category'), { target: { value: 'Innovation' } });
      fireEvent.click(getByRole('button', { name: /submit/i }));

      // ASSERT - After failure
      await waitFor(() => {
        expect((getByLabelText('Title') as HTMLInputElement).disabled).toBe(false);
        expect(getByRole('button', { name: /submit/i })).not.toBeDisabled();
      });
    });
  });

  describe('keyboard interactions', () => {
    it('should submit form when Enter key pressed', async () => {
      // ARRANGE
      server.use(
        rest.post('http://localhost:3001/api/ideas', (req, res, ctx) => {
          return res(ctx.status(201), ctx.json({ success: true, data: {} }));
        })
      );

      const mockOnSuccess = jest.fn();
      const { getByLabelText } = render(<IdeaSubmissionForm onSuccess={mockOnSuccess} />);

      // ACT
      fireEvent.change(getByLabelText('Title'), { target: { value: 'Valid Title' } });
      fireEvent.change(getByLabelText('Description'), { target: { value: 'Valid description' } });
      fireEvent.change(getByLabelText('Category'), { target: { value: 'Innovation' } });
      fireEvent.keyDown(getByLabelText('Title'), { key: 'Enter', code: 'Enter' });

      // ASSERT
      await waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalled();
      });
    });

    it('should clear form when Escape key pressed', () => {
      // ARRANGE
      const { getByLabelText } = render(<IdeaSubmissionForm />);

      // ACT
      fireEvent.change(getByLabelText('Title'), { target: { value: 'Some Title' } });
      fireEvent.keyDown(getByLabelText('Title'), { key: 'Escape', code: 'Escape' });

      // ASSERT
      expect((getByLabelText('Title') as HTMLInputElement).value).toBe('');
    });
  });
});
```

**Coverage Metrics:**
- API integration: 100%
- Error handling: 95%
- Success paths: 100%
- Time: ~300ms (15 tests)

---

### C. E2E Tests (10% of tests)

#### idea-submission-flow.spec.ts - Complete User Journey

**File Location:** `tests/e2e/idea-submission-flow.spec.ts`

**Test Cases:**

```typescript
/**
 * E2E test for complete idea submission workflow.
 * Tests: Navigate → Fill form → Submit → Verify in dashboard
 * Framework: Playwright or Cypress
 */

describe('E2E: Idea Submission Flow', () => {
  describe('Happy path: User submits idea and sees it in dashboard', () => {
    it('should complete full submission flow from form to dashboard', async () => {
      // ARRANGE
      const browser = await chromium.launch();
      const page = await browser.newPage();
      
      // Navigate to form page
      await page.goto('http://localhost:5173/ideas/submit');
      
      // ACT 1: Fill form
      await page.fill('label:has-text("Title") ~ input', 'Reduce Processing Time');
      await page.fill('label:has-text("Description") ~ textarea', 
        'Implement automated workflow to reduce manual processing');
      await page.selectOption('label:has-text("Category") ~ select', 'Process Improvement');
      
      // ACT 2: Submit form
      await page.click('button:has-text("Submit")');
      
      // ASSERT 1: Success message appears
      await expect(page.locator('text=Idea submitted successfully')).toBeVisible({ timeout: 5000 });
      
      // ACT 3: Navigate to dashboard (or auto-redirected)
      await page.waitForNavigation();
      await page.goto('http://localhost:5173/ideas');
      
      // ASSERT 2: New idea appears in dashboard
      await expect(page.locator('text=Reduce Processing Time')).toBeVisible();
      await expect(page.locator('text=Process Improvement')).toBeVisible();
      await expect(page.locator('text=Submitted')).toBeVisible();
      
      // CLEANUP
      await browser.close();
    });
  });

  describe('Error case: Submission fails and shows error', () => {
    it('should show error and allow retry', async () => {
      // ARRANGE
      const browser = await chromium.launch();
      const page = await browser.newPage();
      
      // Simulate API error on first attempt
      await page.route('**/api/ideas', route => {
        if (route.request().method() === 'POST') {
          route.abort('failed');
        }
      });
      
      await page.goto('http://localhost:5173/ideas/submit');
      
      // ACT 1: Try to submit
      await page.fill('label:has-text("Title") ~ input', 'Test Idea');
      await page.fill('label:has-text("Description") ~ textarea', 'Test description');
      await page.selectOption('label:has-text("Category") ~ select', 'Innovation');
      await page.click('button:has-text("Submit")');
      
      // ASSERT: Error message shown
      await expect(page.locator('text=/network error|failed/i')).toBeVisible({ timeout: 5000 });
      
      // CLEANUP
      await browser.close();
    });
  });
});
```

**Coverage Metrics:**
- Happy path: 100%
- Error handling: 80%
- Time: ~2-3 seconds per test

---

## III. Backend Test Suite (Node.js + Express + TypeScript)

### Folder Structure
```
src/
├── api/
│   ├── routes/
│   │   ├── ideas.ts
│   │   └── __tests__/
│   │       └── ideas.integration.test.ts
├── services/
│   ├── ideas.service.ts
│   └── __tests__/
│       ├── ideas.service.test.ts
│       └── ideas.service.integration.test.ts
└── tests/
    ├── e2e/
    │   └── idea-submission-api.spec.ts
    ├── fixtures/
    │   ├── ideaFixtures.ts
    │   ├── userFixtures.ts
    │   └── database.ts
    ├── setup.ts
    └── helpers.ts
```

### A. Unit Tests

#### ideas.service.test.ts

**Test Cases (Select Critical Tests):**

```typescript
/**
 * Unit tests for IdeasService business logic.
 * Tests: Validation, transformation, business rules
 * Framework: Jest
 * Mocking: Jest mocks for database and Auth0
 */

describe('IdeasService', () => {
  let service: IdeasService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {
      idea: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    };
    service = new IdeasService(mockPrisma);
  });

  describe('createIdea', () => {
    describe('when input is valid', () => {
      it('should create idea with submitted status', async () => {
        // ARRANGE
        const ideaData = {
          title: 'Reduce Processing Time',
          description: 'Implement automated workflow',
          category: 'Process Improvement',
          userId: 'user-123'
        };

        mockPrisma.idea.create.mockResolvedValue({
          id: 'idea-123',
          ...ideaData,
          status: 'Submitted',
          createdAt: new Date(),
          updatedAt: new Date()
        });

        // ACT
        const result = await service.createIdea(ideaData);

        // ASSERT
        expect(mockPrisma.idea.create).toHaveBeenCalledWith({
          data: expect.objectContaining(ideaData)
        });
        expect(result.status).toBe('Submitted');
      });

      it('should call Prisma create with correct schema', async () => {
        // ARRANGE
        const ideaData = {
          title: 'Valid Title',
          description: 'Valid description text',
          category: 'Innovation',
          userId: 'user-123'
        };

        mockPrisma.idea.create.mockResolvedValue({});

        // ACT
        await service.createIdea(ideaData);

        // ASSERT
        expect(mockPrisma.idea.create).toHaveBeenCalledWith({
          data: expect.objectContaining({
            title: ideaData.title,
            description: ideaData.description,
            category: ideaData.category,
            userId: ideaData.userId
          })
        });
      });
    });

    describe('when input is invalid', () => {
      it('should throw error when title is too short', async () => {
        // ARRANGE
        const ideaData = {
          title: 'AB',
          description: 'Valid description',
          category: 'Innovation',
          userId: 'user-123'
        };

        // ACT & ASSERT
        await expect(service.createIdea(ideaData)).rejects.toThrow(/title.*3 characters/i);
      });

      it('should throw error for invalid category', async () => {
        // ARRANGE
        const ideaData = {
          title: 'Valid Title',
          description: 'Valid description',
          category: 'InvalidCategory',
          userId: 'user-123'
        };

        // ACT & ASSERT
        await expect(service.createIdea(ideaData)).rejects.toThrow(/invalid.*category/i);
      });

      it('should not call Prisma create when validation fails', async () => {
        // ARRANGE
        const ideaData = {
          title: 'AB',
          description: 'Valid description',
          category: 'Innovation',
          userId: 'user-123'
        };

        // ACT
        try {
          await service.createIdea(ideaData);
        } catch {}

        // ASSERT
        expect(mockPrisma.idea.create).not.toHaveBeenCalled();
      });
    });

    describe('when database operation fails', () => {
      it('should throw database error if create fails', async () => {
        // ARRANGE
        const ideaData = {
          title: 'Valid Title',
          description: 'Valid description',
          category: 'Innovation',
          userId: 'user-123'
        };

        mockPrisma.idea.create.mockRejectedValue(
          new Error('Database connection failed')
        );

        // ACT & ASSERT
        await expect(service.createIdea(ideaData)).rejects.toThrow('Database connection failed');
      });

      it('should handle unique constraint violation', async () => {
        // ARRANGE
        const ideaData = {
          title: 'Valid Title',
          description: 'Valid description',
          category: 'Innovation',
          userId: 'user-123'
        };

        mockPrisma.idea.create.mockRejectedValue({
          code: 'P2002', // Prisma unique constraint error
          meta: { target: ['title'] }
        });

        // ACT & ASSERT
        await expect(service.createIdea(ideaData)).rejects.toThrow(/title.*already exists/i);
      });
    });
  });

  describe('getIdeasByUser', () => {
    it('should fetch ideas with pagination', async () => {
      // ARRANGE
      const userId = 'user-123';
      const mockIdeas = [
        { id: 'idea-1', title: 'Idea 1', status: 'Submitted' },
        { id: 'idea-2', title: 'Idea 2', status: 'Under Review' }
      ];

      mockPrisma.idea.findMany.mockResolvedValue(mockIdeas);

      // ACT
      const result = await service.getIdeasByUser(userId, { page: 1, limit: 10 });

      // ASSERT
      expect(mockPrisma.idea.findMany).toHaveBeenCalledWith({
        where: { userId },
        skip: 0,
        take: 10,
        orderBy: { createdAt: 'desc' }
      });
      expect(result).toEqual(mockIdeas);
    });
  });
});
```

**Coverage Metrics:**
- Service logic: 85%
- Error paths: 80%
- Time: ~100ms (10 tests)

---

### B. Integration Tests

#### ideas.integration.test.ts - API Endpoint Testing

**Test Cases:**

```typescript
/**
 * Integration tests for POST /api/ideas endpoint.
 * Tests: Request validation, authentication, database persistence, response format
 * Framework: Jest + Supertest
 * Database: PostgreSQL test instance with rollback
 */

describe('POST /api/ideas (Integration)', () => {
  beforeAll(async () => {
    await setupTestDatabase();
    app = createExpressApp();
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  beforeEach(async () => {
    await rollbackDatabase();
  });

  describe('successful submission', () => {
    it('should create idea and return 201 with idea data', async () => {
      // ARRANGE
      const authToken = await generateTestJWT({
        sub: 'user-123',
        email: 'user@example.com'
      });

      const ideaPayload = {
        title: 'Reduce Processing Time',
        description: 'Implement automated workflow process',
        category: 'Process Improvement'
      };

      // ACT
      const response = await request(app)
        .post('/api/ideas')
        .set('Authorization', `Bearer ${authToken}`)
        .send(ideaPayload);

      // ASSERT
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toMatchObject({
        id: expect.any(String),
        title: ideaPayload.title,
        description: ideaPayload.description,
        category: ideaPayload.category,
        status: 'Submitted',
        userId: 'user-123'
      });

      // Verify in database
      const ideaInDB = await prisma.idea.findUnique({
        where: { id: response.body.data.id }
      });
      expect(ideaInDB).toBeDefined();
    });

    it('should set correct response headers', async () => {
      // ARRANGE
      const authToken = await generateTestJWT({ sub: 'user-123' });

      // ACT
      const response = await request(app)
        .post('/api/ideas')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Valid Title',
          description: 'Valid description text',
          category: 'Innovation'
        });

      // ASSERT
      expect(response.headers['content-type']).toMatch(/json/);
    });
  });

  describe('validation failure', () => {
    it('should return 400 when title is missing', async () => {
      // ARRANGE
      const authToken = await generateTestJWT({ sub: 'user-123' });

      // ACT
      const response = await request(app)
        .post('/api/ideas')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          description: 'Valid description',
          category: 'Innovation'
        });

      // ASSERT
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('title');
    });

    it('should return 400 with detailed validation errors', async () => {
      // ARRANGE
      const authToken = await generateTestJWT({ sub: 'user-123' });

      // ACT
      const response = await request(app)
        .post('/api/ideas')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'AB',
          description: 'Short',
          category: 'InvalidCategory'
        });

      // ASSERT
      expect(response.status).toBe(400);
      expect(response.body.details).toBeInstanceOf(Array);
      expect(response.body.details.length).toBe(3);
    });
  });

  describe('authentication/authorization', () => {
    it('should return 401 when no authorization header', async () => {
      // ARRANGE
      // ACT
      const response = await request(app)
        .post('/api/ideas')
        .send({
          title: 'Valid Title',
          description: 'Valid description',
          category: 'Innovation'
        });

      // ASSERT
      expect(response.status).toBe(401);
    });

    it('should return 401 with invalid JWT token', async () => {
      // ARRANGE
      // ACT
      const response = await request(app)
        .post('/api/ideas')
        .set('Authorization', 'Bearer invalid.token.here')
        .send({
          title: 'Valid Title',
          description: 'Valid description',
          category: 'Innovation'
        });

      // ASSERT
      expect(response.status).toBe(401);
    });
  });

  describe('concurrent submissions', () => {
    it('should handle concurrent requests from same user', async () => {
      // ARRANGE
      const authToken = await generateTestJWT({ sub: 'user-123' });
      const promises = [];

      // ACT
      for (let i = 0; i < 3; i++) {
        promises.push(
          request(app)
            .post('/api/ideas')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
              title: `Idea ${i}`,
              description: `Description ${i}`,
              category: 'Innovation'
            })
        );
      }

      const responses = await Promise.all(promises);

      // ASSERT
      responses.forEach(res => {
        expect(res.status).toBe(201);
      });
      expect(responses[0].body.data.id).not.toBe(responses[1].body.data.id);
    });
  });
});
```

**Coverage Metrics:**
- API endpoint: 90%
- Response formats: 95%
- Error scenarios: 85%
- Time: ~500ms (12 tests)

---

### C. E2E API Tests

#### idea-submission-api.spec.ts

```typescript
/**
 * E2E test for complete API submission workflow.
 * Tests: Auth → Create → Fetch → Verify
 * Framework: Jest + Supertest
 */

describe('E2E: Idea Submission API Flow', () => {
  it('should complete full workflow: auth → submit → fetch', async () => {
    // ARRANGE
    const userEmail = 'test@example.com';
    const authToken = await generateTestJWT({
      sub: 'user-123',
      email: userEmail
    });

    // ACT 1: Submit idea
    const submitResponse = await request(app)
      .post('/api/ideas')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Reduce Processing Time',
        description: 'Implement automated workflow',
        category: 'Process Improvement'
      });

    const ideaId = submitResponse.body.data.id;

    // ASSERT 1: Idea created
    expect(submitResponse.status).toBe(201);

    // ACT 2: Fetch idea details
    const fetchResponse = await request(app)
      .get(`/api/ideas/${ideaId}`)
      .set('Authorization', `Bearer ${authToken}`);

    // ASSERT 2: Idea fetched correctly
    expect(fetchResponse.status).toBe(200);
    expect(fetchResponse.body.data.title).toBe('Reduce Processing Time');
    expect(fetchResponse.body.data.status).toBe('Submitted');
  });
});
```

**Coverage Metrics:**
- Full workflow: 100%
- Time: ~1 second

---

## IV. Test Configuration & Execution

### Jest Configuration (jest.config.js)

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom', // Frontend; use 'node' for backend
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts(x)?', '**/?(*.)+(spec|test).ts(x)?'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
    '!src/types/**'
  ],
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
};
```

### Running Tests

```bash
# Unit tests only
npm test -- --testPathPattern="\.test\.ts"

# Integration tests only
npm test -- --testPathPattern="\.integration\.test\.ts"

# E2E tests
npm test -- --testPathPattern="\.spec\.ts"

# All tests with coverage
npm test -- --coverage

# Watch mode (development)
npm test -- --watch

# Mutation testing (Stryker)
npm run mutation

# Generate coverage report
npm test -- --coverage --coverageReporters=html
```

---

## V. Test Coverage Goals

| File Type | Target Coverage | Status |
|-----------|------------------|--------|
| ideaSchema.ts | 100% | ✅ Achievable |
| ideaSubmissionForm.tsx | 90% | ✅ Achievable |
| formTextField.tsx | 95% | ✅ Achievable |
| ideas.service.ts | 85% | ✅ Achievable |
| ideas.ts (route) | 80% | ✅ Achievable |
| **Overall** | **80%** | ✅ Target |

---

## VI. Definition of Done for Tests

- [ ] All tests written BEFORE implementation (TDD)
- [ ] 80% code coverage achieved
- [ ] All tests passing locally (`npm test`)
- [ ] All tests passing in CI/CD pipeline
- [ ] No console errors or warnings during test execution
- [ ] Test file naming follows conventions
- [ ] Tests use Arrange-Act-Assert pattern
- [ ] Integration tests use test database with rollback
- [ ] E2E tests cover critical user paths only
- [ ] Coverage report generated (lcov + HTML)
- [ ] Documentation updated with test commands
- [ ] No hardcoded timeouts (use proper async/await + waitFor)

---

## VII. Test Execution Timeline

| Phase | Timeline | Tests | Status |
|-------|----------|-------|--------|
| **Pre-Implementation** | Feb 26-27 | Write unit + integration tests | NOT STARTED |
| **Implementation** | Feb 27-Mar 3 | Implement code to pass tests | NOT STARTED |
| **Integration** | Mar 3-4 | Write E2E tests, final validation | NOT STARTED |
| **Coverage Review** | Mar 4 | Verify 80% coverage, mutation testing | NOT STARTED |
| **Merge to Main** | Mar 5 | All gates passed, ready for Sprint 2 | NOT STARTED |

---

## References

- **Constitution:** `/speckit-lab/.specify/memory/constitution.md`
- **Story Spec:** `STORY-2.1-Submission-Form.md`
- **Tech Stack:**`agents.md`
- **Jest Docs:** https://jestjs.io/
- **React Testing Library:** https://testing-library.com/react

---

**Status:** DRAFT (Ready for implementation start Feb 27)  
**Test Lead:** [QA Engineer Name]  
**Last Updated:** February 25, 2026
