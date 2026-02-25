/**
 * Backend IdeasService Unit Tests
 * Mocks Prisma client to test business logic in isolation
 *
 * In production, this would be in the backend repository's test suite
 */

import IdeasServiceBackend from '../services/ideas.service.backend';

/**
 * Mock Prisma client for testing
 */
const createMockPrisma = () => ({
  idea: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    count: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
});

describe('IdeasServiceBackend (Backend Service)', () => {
  let service: IdeasServiceBackend;
  let mockPrisma: ReturnType<typeof createMockPrisma>;

  beforeEach(() => {
    mockPrisma = createMockPrisma();
    service = new IdeasServiceBackend(mockPrisma as unknown as ConstructorParameters<typeof IdeasServiceBackend>[0]);
    jest.clearAllMocks();
  });

  describe('createIdea', () => {
    it('should create idea with validated data and submitted status', async () => {
      // ARRANGE
      const userId = 'user-123';
      const ideaData = {
        title: 'Backend Test Idea',
        description: 'This is a backend test idea description',
        category: 'Innovation' as const,
      };

      mockPrisma.idea.create.mockResolvedValue({
        id: 'idea-backend-1',
        userId,
        ...ideaData,
        status: 'Submitted',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // ACT
      const result = await service.createIdea(userId, ideaData);

      // ASSERT
      expect(result.status).toBe('Submitted');
      expect(result.userId).toBe(userId);
      expect(result.title).toBe(ideaData.title);
      expect(mockPrisma.idea.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId,
          title: ideaData.title,
          description: ideaData.description,
          category: ideaData.category,
          status: 'Submitted',
        }),
      });
    });

    it('should reject invalid data with validation error', async () => {
      // ARRANGE
      const userId = 'user-123';
      const invalidData = {
        title: 'AB', // Too short
        description: 'Short', // Too short
        category: 'InvalidCategory' as unknown,
      };

      // ACT & ASSERT
      await expect(service.createIdea(userId, invalidData as unknown as Parameters<typeof service.createIdea>[1])).rejects.toThrow();
      expect(mockPrisma.idea.create).not.toHaveBeenCalled();
    });

    it('should throw error if database create fails', async () => {
      // ARRANGE
      const userId = 'user-123';
      mockPrisma.idea.create.mockRejectedValue(new Error('Database error'));

      // ACT & ASSERT
      await expect(
        service.createIdea(userId, {
          title: 'Valid Title',
          description: 'Valid description text',
          category: 'Innovation' as const,
        })
      ).rejects.toThrow('Database error');
    });
  });

  describe('getUserIdeas', () => {
    it('should fetch paginated ideas for user', async () => {
      // ARRANGE
      const userId = 'user-123';
      const mockIdeas = [
        {
          id: 'idea-1',
          title: 'Idea 1',
          description: 'Description 1',
          status: 'Submitted',
          createdAt: new Date(),
        },
        {
          id: 'idea-2',
          title: 'Idea 2',
          description: 'Description 2',
          status: 'Under Review',
          createdAt: new Date(),
        },
      ];

      mockPrisma.idea.findMany.mockResolvedValue(mockIdeas);
      mockPrisma.idea.count.mockResolvedValue(2);

      // ACT
      const result = await service.getUserIdeas(userId, 1, 10);

      // ASSERT
      expect(result.ideas).toEqual(mockIdeas);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(10);
      expect(result.pagination.total).toBe(2);
      expect(result.pagination.totalPages).toBe(1);
      expect(mockPrisma.idea.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId },
          skip: 0,
          take: 10,
        })
      );
    });

    it('should calculate pagination correctly for multiple pages', async () => {
      // ARRANGE
      mockPrisma.idea.findMany.mockResolvedValue([]);
      mockPrisma.idea.count.mockResolvedValue(25);

      // ACT
      const result = await service.getUserIdeas('user-123', 2, 10);

      // ASSERT
      expect(result.pagination.totalPages).toBe(3);
      expect(result.pagination.hasNextPage).toBe(true);
      expect(result.pagination.hasPrevPage).toBe(true);
      expect(mockPrisma.idea.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 10, // (page 2 - 1) * 10
          take: 10,
        })
      );
    });

    it('should return empty array when user has no ideas', async () => {
      // ARRANGE
      mockPrisma.idea.findMany.mockResolvedValue([]);
      mockPrisma.idea.count.mockResolvedValue(0);

      // ACT
      const result = await service.getUserIdeas('user-no-ideas', 1, 10);

      // ASSERT
      expect(result.ideas).toEqual([]);
      expect(result.pagination.total).toBe(0);
      expect(result.pagination.totalPages).toBe(0);
    });
  });

  describe('getIdeaById', () => {
    it('should return idea if user is owner', async () => {
      // ARRANGE
      const userId = 'user-123';
      const ideaId = 'idea-456';
      const mockIdea = {
        id: ideaId,
        userId,
        title: 'My Idea',
        description: 'My idea description',
        status: 'Submitted',
      };

      mockPrisma.idea.findUnique.mockResolvedValue(mockIdea);

      // ACT
      const result = await service.getIdeaById(ideaId, userId);

      // ASSERT
      expect(result).toEqual(mockIdea);
      expect(mockPrisma.idea.findUnique).toHaveBeenCalledWith({
        where: { id: ideaId },
      });
    });

    it('should throw error if idea not found', async () => {
      // ARRANGE
      mockPrisma.idea.findUnique.mockResolvedValue(null);

      // ACT & ASSERT
      await expect(service.getIdeaById('nonexistent', 'user-123')).rejects.toThrow('Idea not found');
    });

    it('should throw error if user is not owner', async () => {
      // ARRANGE
      const userId = 'user-123';
      const anotherUser = 'user-999';
      mockPrisma.idea.findUnique.mockResolvedValue({
        id: 'idea-456',
        userId: anotherUser,
        title: 'Someone else\'s idea',
      });

      // ACT & ASSERT
      await expect(service.getIdeaById('idea-456', userId)).rejects.toThrow('Unauthorized');
    });
  });

  describe('updateIdea', () => {
    it('should update idea if in submitted status', async () => {
      // ARRANGE
      const userId = 'user-123';
      const ideaId = 'idea-456';
      const updatedData = {
        title: 'Updated Title',
        description: 'Updated description text',
        category: 'Process Improvement' as const,
      };

      mockPrisma.idea.findUnique.mockResolvedValue({
        id: ideaId,
        userId,
        title: 'Old Title',
        status: 'Submitted',
      });

      mockPrisma.idea.update.mockResolvedValue({
        id: ideaId,
        userId,
        ...updatedData,
        status: 'Submitted',
      });

      // ACT
      const result = await service.updateIdea(ideaId, userId, updatedData);

      // ASSERT
      expect(result.title).toBe(updatedData.title);
      expect(mockPrisma.idea.update).toHaveBeenCalledWith({
        where: { id: ideaId },
        data: updatedData,
      });
    });

    it('should prevent updating idea not in submitted status', async () => {
      // ARRANGE
      mockPrisma.idea.findUnique.mockResolvedValue({
        id: 'idea-456',
        userId: 'user-123',
        status: 'Under Review', // Not submitted
      });

      // ACT & ASSERT
      await expect(
        service.updateIdea('idea-456', 'user-123', {
          title: 'New Title',
          description: 'New description',
          category: 'Innovation' as const,
        })
      ).rejects.toThrow('Cannot edit idea with status: Under Review');

      expect(mockPrisma.idea.update).not.toHaveBeenCalled();
    });
  });

  describe('deleteIdea', () => {
    it('should delete idea if in submitted status', async () => {
      // ARRANGE
      const userId = 'user-123';
      const ideaId = 'idea-456';

      mockPrisma.idea.findUnique.mockResolvedValue({
        id: ideaId,
        userId,
        status: 'Submitted',
      });

      mockPrisma.idea.delete.mockResolvedValue({ id: ideaId });

      // ACT
      const result = await service.deleteIdea(ideaId, userId);

      // ASSERT
      expect(result.success).toBe(true);
      expect(mockPrisma.idea.delete).toHaveBeenCalledWith({
        where: { id: ideaId },
      });
    });

    it('should prevent deleting idea not in submitted status', async () => {
      // ARRANGE
      mockPrisma.idea.findUnique.mockResolvedValue({
        id: 'idea-456',
        userId: 'user-123',
        status: 'Accepted', // Not submitted
      });

      // ACT & ASSERT
      await expect(service.deleteIdea('idea-456', 'user-123')).rejects.toThrow(
        'Cannot delete idea with status: Accepted'
      );

      expect(mockPrisma.idea.delete).not.toHaveBeenCalled();
    });
  });

  describe('getIdeasByStatus', () => {
    it('should fetch ideas filtered by status', async () => {
      // ARRANGE
      const mockIdeas = [
        { id: 'idea-1', status: 'Submitted', title: 'Idea 1' },
        { id: 'idea-2', status: 'Submitted', title: 'Idea 2' },
      ];

      mockPrisma.idea.findMany.mockResolvedValue(mockIdeas);
      mockPrisma.idea.count.mockResolvedValue(2);

      // ACT
      const result = await service.getIdeasByStatus('Submitted', 1, 10);

      // ASSERT
      expect(result.ideas).toEqual(mockIdeas);
      expect(result.pagination.total).toBe(2);
      expect(mockPrisma.idea.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { status: 'Submitted' },
        })
      );
    });
  });
});
