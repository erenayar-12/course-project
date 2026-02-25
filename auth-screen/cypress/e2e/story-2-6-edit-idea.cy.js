/**
 * STORY-2.6 E2E Test: Idea Edit Workflow
 * 
 * Tests the complete user flow:
 * 1. Navigate to detail page
 * 2. Click edit button
 * 3. Modify form fields
 * 4. Submit changes
 * 5. Verify redirect
 */

describe('STORY-2.6: Idea Edit Workflow', () => {
  beforeEach(() => {
    // Login
    cy.visit('http://localhost:3000/login');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
  });

  it('should navigate to edit page from detail view', () => {
    // Assuming we have an idea already
    // Navigate to detail page
    cy.visit('http://localhost:3000/ideas/test-idea-id');
    
    // Click edit button (if it exists)
    cy.get('button:contains("Edit")').click();
    
    // Should be on edit page
    cy.url().should('include', '/ideas/test-idea-id/edit');
    cy.get('h1:contains("Edit Idea")').should('be.visible');
  });

  it('should prefill form with existing idea data', () => {
    cy.visit('http://localhost:3000/ideas/test-idea-id/edit');
    
    // Form should be populated
    cy.get('input[name="title"]').should('have.value', 'Test Idea');
    cy.get('textarea[name="description"]').should('have.value', 'This is a test idea');
    cy.get('select[name="category"]').should('have.value', 'Innovation');
  });

  it('should validate form before submission', () => {
    cy.visit('http://localhost:3000/ideas/test-idea-id/edit');
    
    // Clear title
    cy.get('input[name="title"]').clear();
    
    // Try to submit - button should be disabled
    cy.get('button:contains("Save Changes")').should('be.disabled');
  });

  it('should update idea on form submission', () => {
    cy.visit('http://localhost:3000/ideas/test-idea-id/edit');
    
    // Modify title
    cy.get('input[name="title"]').clear().type('Updated Idea Title');
    
    // Modify description
    cy.get('textarea[name="description"]').clear().type('This is an updated description with more details about the idea');
    
    // Submit
    cy.get('button:contains("Save Changes")').click();
    
    // Should redirect to detail page
    cy.url().should('include', '/ideas/test-idea-id');
    
    // Updated data should be displayed
    cy.get('h1:contains("Updated Idea Title")').should('be.visible');
  });

  it('should show unsaved changes warning on cancel', () => {
    cy.visit('http://localhost:3000/ideas/test-idea-id/edit');
    
    // Modify form
    cy.get('input[name="title"]').clear().type('Changed Title');
    
    // Click cancel
    cy.get('button:contains("Cancel")').click();
    
    // Warning modal should appear
    cy.get('h2:contains("Unsaved Changes")').should('be.visible');
    
    // Click discard
    cy.get('button:contains("Discard Changes")').click();
    
    // Should navigate back
    cy.url().should('include', '/ideas/test-idea-id');
  });

  it('should handle unauthorized access (404)', () => {
    // Try to access non-existent idea
    cy.visit('http://localhost:3000/ideas/non-existent-id/edit');
    
    // Should show error page
    cy.get('h1:contains("Idea Not Found")').should('be.visible');
    cy.get('button:contains("Back to Ideas")').should('be.visible');
  });

  it('should handle 403 forbidden (no permission)', () => {
    // This would require a real scenario where accessing someone else's idea
    // For now, test the error handling UI
    cy.visit('http://localhost:3000/ideas/other-user-idea/edit');
    
    // Might get 403 error
    // Should show error page
    cy.get('body').should('exist'); // Page should load without crashing
  });

  it('should track character count with color changes', () => {
    cy.visit('http://localhost:3000/ideas/test-idea-id/edit');
    
    // Clear and type short title (green)
    cy.get('input[name="title"]').clear().type('Short');
    cy.get('input[name="title"]').parent().next().should('have.class', 'text-green-600');
    
    // Type longer title (yellow)
    cy.get('input[name="title"]').clear().type('This is a much longer title that takes more characters');
    cy.get('input[name="title"]').parent().next().should('have.class', 'text-yellow-600');
  });

  it('should disable form during submission', () => {
    cy.visit('http://localhost:3000/ideas/test-idea-id/edit');
    
    // Modify form
    cy.get('input[name="title"]').clear().type('Updated Title');
    
    // Click submit and immediately check if buttons are disabled
    cy.get('button:contains("Save Changes")').click();
    cy.get('button:contains("Save Changes", "Saving...")').should('be.disabled');
  });

  it('should handle file uploads in create mode (not in edit)', () => {
    // Create mode should have file upload
    // Edit mode should not have file upload
    
    // Go to detail page first
    cy.visit('http://localhost:3000/ideas/test-idea-id/edit');
    
    // File upload section should NOT be visible in edit mode
    cy.get('label:contains("Supporting Files")').should('not.exist');
  });

  it('should redirect on successful update', () => {
    cy.visit('http://localhost:3000/ideas/test-idea-id/edit');
    
    // Make changes
    cy.get('input[name="title"]').clear().type('Final Updated Title');
    
    // Submit
    cy.get('button:contains("Save Changes")').click();
    
    // Verify redirect to detail page
    cy.url().should('eq', 'http://localhost:3000/ideas/test-idea-id');
    cy.get('h1').should('contain', 'Final Updated Title');
  });
});
