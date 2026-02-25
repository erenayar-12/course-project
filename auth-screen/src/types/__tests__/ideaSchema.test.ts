/**
 * ideaSchema.test.ts
 * Unit tests for idea submission form validation schema.
 * RED-GREEN-REFACTOR: Tests demonstrate expected behavior.
 */

import { ideaSubmissionSchema, IDEA_CATEGORIES } from '../ideaSchema';

describe('ideaSubmissionSchema', () => {
  describe('title validation', () => {
    it('should accept valid title (3-100 chars)', () => {
      // ARRANGE
      const input = {
        title: 'Modern Title',
        description: 'Valid description with enough characters here',
        category: 'Innovation' as const,
      };

      // ACT
      const result = ideaSubmissionSchema.safeParse(input);

      // ASSERT
      expect(result.success).toBe(true);
    });

    it('should reject title shorter than 3 characters', () => {
      // ARRANGE
      const input = {
        title: 'AB',
        description: 'Valid description with enough characters',
        category: 'Innovation' as const,
      };

      // ACT
      const result = ideaSubmissionSchema.safeParse(input);

      // ASSERT
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('at least 3');
      }
    });

    it('should reject title longer than 100 characters', () => {
      // ARRANGE
      const input = {
        title: 'A'.repeat(101),
        description: 'Valid description with enough characters',
        category: 'Innovation' as const,
      };

      // ACT
      const result = ideaSubmissionSchema.safeParse(input);

      // ASSERT
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('not exceed 100');
      }
    });

    it('should accept title with exactly 3 characters', () => {
      // ARRANGE
      const input = {
        title: 'ABC',
        description: 'Valid description with enough characters',
        category: 'Innovation' as const,
      };

      // ACT
      const result = ideaSubmissionSchema.safeParse(input);

      // ASSERT
      expect(result.success).toBe(true);
    });

    it('should accept title with exactly 100 characters', () => {
      // ARRANGE
      const input = {
        title: 'A'.repeat(100),
        description: 'Valid description with enough characters',
        category: 'Innovation' as const,
      };

      // ACT
      const result = ideaSubmissionSchema.safeParse(input);

      // ASSERT
      expect(result.success).toBe(true);
    });
  });

  describe('description validation', () => {
    it('should accept valid description (10-2000 chars)', () => {
      // ARRANGE
      const input = {
        title: 'Valid Title',
        description: '1234567890',
        category: 'Innovation' as const,
      };

      // ACT
      const result = ideaSubmissionSchema.safeParse(input);

      // ASSERT
      expect(result.success).toBe(true);
    });

    it('should reject description shorter than 10 characters', () => {
      // ARRANGE
      const input = {
        title: 'Valid Title',
        description: 'Short',
        category: 'Innovation' as const,
      };

      // ACT
      const result = ideaSubmissionSchema.safeParse(input);

      // ASSERT
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('at least 10');
      }
    });

    it('should reject description longer than 2000 characters', () => {
      // ARRANGE
      const input = {
        title: 'Valid Title',
        description: 'A'.repeat(2001),
        category: 'Innovation' as const,
      };

      // ACT
      const result = ideaSubmissionSchema.safeParse(input);

      // ASSERT
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('not exceed 2000');
      }
    });
  });

  describe('category validation', () => {
    it('should accept all valid categories', () => {
      // ARRANGE
      const validCategories = IDEA_CATEGORIES;

      // ACT & ASSERT
      validCategories.forEach((category) => {
        const result = ideaSubmissionSchema.safeParse({
          title: 'Valid Title',
          description: 'Valid description',
          category,
        });
        expect(result.success).toBe(true);
      });
    });

    it('should reject invalid category', () => {
      // ARRANGE
      const input = {
        title: 'Valid Title',
        description: 'Valid description',
        category: 'InvalidCategory' as unknown,
      };

      // ACT
      const result = ideaSubmissionSchema.safeParse(input);

      // ASSERT
      expect(result.success).toBe(false);
    });

    it('should reject empty string category', () => {
      // ARRANGE
      const input = {
        title: 'Valid Title',
        description: 'Valid description',
        category: '' as unknown,
      };

      // ACT
      const result = ideaSubmissionSchema.safeParse(input);

      // ASSERT
      expect(result.success).toBe(false);
    });
  });

  describe('complete form validation', () => {
    it('should accept complete valid form', () => {
      // ARRANGE
      const validForm = {
        title: 'Streamline Customer Onboarding',
        description: 'Implement automated workflow to reduce onboarding time by 50%',
        category: 'Process Improvement' as const,
      };

      // ACT
      const result = ideaSubmissionSchema.safeParse(validForm);

      // ASSERT
      expect(result.success).toBe(true);
    });

    it('should provide typed data after parsing', () => {
      // ARRANGE
      const validForm = {
        title: 'Test Title',
        description: 'This is a valid test description',
        category: 'Innovation' as const,
      };

      // ACT
      const result = ideaSubmissionSchema.safeParse(validForm);

      // ASSERT
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.title).toEqual('Test Title');
        expect(result.data.description).toEqual('This is a valid test description');
        expect(result.data.category).toEqual('Innovation');
      }
    });
  });
});
