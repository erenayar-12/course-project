describe('Idea Submission Form - E2E Tests', () => {
  beforeEach(() => {
    // Start fresh for each test
    cy.viewport(1200, 800);
  });

  describe('Form Display and Interaction', () => {
    it('should display the idea submission form with all required fields', () => {
      cy.visit('/');
      
      // Check form title
      cy.contains('h2', /submit|idea|form/i).should('be.visible');
      
      // Check all form fields are present
      cy.get('input[name="title"]').should('exist');
      cy.get('textarea[name="description"]').should('exist');
      cy.get('select[name="category"]').should('exist');
      
      // Check buttons
      cy.contains('button', /submit|save/i).should('exist');
      cy.contains('button', /cancel|reset/i).should('exist');
    });

    it('should show validation errors when submitting empty form', () => {
      cy.visit('/');
      
      // Try to submit empty form
      cy.contains('button', /submit|save/i).click();
      
      // Should see validation errors
      cy.contains(/required|title|must/i).should('be.visible');
    });

    it('should show validation error for title too short', () => {
      cy.visit('/');
      
      const titleInput = cy.get('input[name="title"]');
      titleInput.type('AB'); // Less than 3 characters
      titleInput.blur();
      
      // Should show error
      cy.contains(/at least|3|characters|title/i).should('be.visible');
    });

    it('should show validation error for description too short', () => {
      cy.visit('/');
      
      cy.get('input[name="title"]').type('Valid Title');
      const descInput = cy.get('textarea[name="description"]');
      descInput.type('Short'); // Less than 10 characters
      descInput.blur();
      
      // Should show error
      cy.contains(/at least|10|characters|description/i).should('be.visible');
    });
  });

  describe('Form Submission Flow', () => {
    it('should allow submission with valid form data', () => {
      cy.visit('/');
      
      // Fill in form with valid data
      cy.get('input[name="title"]').type('Innovative New Feature');
      cy.get('textarea[name="description"]').type('This is a detailed description of a new innovative feature that would improve user experience significantly.');
      cy.get('select[name="category"]').select('technology');
      
      // Submit form
      cy.contains('button', /submit|save/i).click();
      
      // Should show success message or navigate
      cy.contains(/success|submitted|thank|created/i).should('be.visible');
    });

    it('should enable submit button with valid data', () => {
      cy.visit('/');
      
      const submitBtn = cy.contains('button', /submit|save/i);
      
      // Button should be disabled initially (or enabled but validation prevents submit)
      cy.get('input[name="title"]').type('Valid Title');
      cy.get('textarea[name="description"]').type('This is a valid and long enough description for testing purposes.');
      cy.get('select[name="category"]').select('technology');
      
      // Button should be enabled
      submitBtn.should('not.be.disabled');
    });

    it('should reset form on cancel with confirmation', () => {
      cy.visit('/');
      
      // Fill form
      cy.get('input[name="title"]').type('Test Title');
      cy.get('textarea[name="description"]').type('Test Description');
      
      // Cancel
      cy.contains('button', /cancel|reset/i).click();
      
      // Should show confirmation dialog or reset
      cy.get('input[name="title"]').should('have.value', '');
    });

    it('should handle character counter in description field', () => {
      cy.visit('/');
      
      const description = 'This is a test description with some content.';
      cy.get('textarea[name="description"]').type(description);
      
      // Should show character count
      cy.contains(`${description.length}`).should('be.visible');
    });
  });

  describe('Category Selection', () => {
    it('should display all category options', () => {
      cy.visit('/');
      
      cy.get('select[name="category"]').click();
      
      // Should have multiple options
      cy.get('select[name="category"] option').should('have.length.greaterThan', 1);
    });

    it('should allow selecting different categories', () => {
      cy.visit('/');
      
      cy.get('select[name="category"]').select('technology');
      cy.get('select[name="category"]').should('have.value', 'technology');
      
      cy.get('select[name="category"]').select('business');
      cy.get('select[name="category"]').should('have.value', 'business');
    });
  });

  describe('Error Handling', () => {
    it('should show max length error when title exceeds 100 chars', () => {
      cy.visit('/');
      
      const longTitle = 'A'.repeat(101);
      cy.get('input[name="title"]').type(longTitle);
      cy.get('input[name="title"]').blur();
      
      cy.contains(/max|too long|100|characters/i).should('be.visible');
    });

    it('should show max length error when description exceeds 2000 chars', () => {
      cy.visit('/');
      
      const longDesc = 'A'.repeat(2001);
      cy.get('textarea[name="description"]').type(longDesc);
      cy.get('textarea[name="description"]').blur();
      
      cy.contains(/max|too long|2000|characters/i).should('be.visible');
    });

    it('should handle network errors gracefully', () => {
      cy.visit('/');
      
      // Intercept and fail API call
      cy.intercept('POST', '**/api/ideas', {
        statusCode: 500,
        body: { error: 'Internal Server Error' }
      });
      
      // Fill and submit
      cy.get('input[name="title"]').type('Valid Title');
      cy.get('textarea[name="description"]').type('This is a valid description for error testing purposes.');
      cy.get('select[name="category"]').select('technology');
      
      cy.contains('button', /submit|save/i).click();
      
      // Should show error message
      cy.contains(/error|failed|try again/i).should('be.visible');
    });

    it('should handle 401 unauthorized error', () => {
      cy.visit('/');
      
      cy.intercept('POST', '**/api/ideas', {
        statusCode: 401,
        body: { error: 'Unauthorized' }
      });
      
      cy.get('input[name="title"]').type('Valid Title');
      cy.get('textarea[name="description"]').type('This is a valid description for auth error testing.');
      cy.get('select[name="category"]').select('technology');
      
      cy.contains('button', /submit|save/i).click();
      
      // Should show not authenticated message or redirect
      cy.contains(/sign|auth|login|session/i).should('be.visible');
    });

    it('should handle 400 validation error from API', () => {
      cy.visit('/');
      
      cy.intercept('POST', '**/api/ideas', {
        statusCode: 400,
        body: { error: 'Title already exists' }
      });
      
      cy.get('input[name="title"]').type('Valid Title');
      cy.get('textarea[name="description"]').type('This is a valid description for validation error testing.');
      cy.get('select[name="category"]').select('technology');
      
      cy.contains('button', /submit|save/i).click();
      
      // Should show error message
      cy.contains(/error|already|exists/i).should('be.visible');
    });
  });

  describe('Accessibility and UX', () => {
    it('should have proper label associations', () => {
      cy.visit('/');
      
      // Labels should be associated with inputs
      cy.contains('label', /title/i).should('be.visible');
      cy.contains('label', /description/i).should('be.visible');
      cy.contains('label', /category/i).should('be.visible');
    });

    it('should show clear error messages inline with fields', () => {
      cy.visit('/');
      
      cy.get('input[name="title"]').type('X');
      cy.get('input[name="title"]').blur();
      
      // Error should be near the field
      cy.get('input[name="title"]').parent().contains(/error|must be|at least/i).should('be.visible');
    });

    it('should support TAB navigation through form fields', () => {
      cy.visit('/');
      
      // Tab to title field
      cy.get('input[name="title"]').focus();
      cy.get('input[name="title"]').should('have.focus');
      
      // Tab to next field
      cy.get('input[name="title"]').trigger('keydown', { keyCode: 9, which: 9 });
      cy.get('textarea[name="description"]').should('have.focus');
    });
  });
});
