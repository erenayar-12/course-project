/**
 * STORY-2.3b: Evaluation Types
 * TypeScript interfaces and enums for evaluation queue functionality
 */

export enum IdeaStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  NEEDS_REVISION = 'NEEDS_REVISION',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum EvaluationStatus {
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  NEEDS_REVISION = 'NEEDS_REVISION',
}

export interface Idea {
  id: string;
  title: string;
  description: string;
  category: string;
  status: IdeaStatus;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  submitterEmail?: string;
  attachmentCount?: number;
}

export interface IdeaWithRelations extends Idea {
  attachments: IdeaAttachment[];
  evaluations: IdeationEvaluation[];
}

export interface IdeaAttachment {
  id: string;
  ideaId: string;
  originalName: string;
  storedName: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: Date;
}

export interface IdeationEvaluation {
  id: string;
  ideaId: string;
  evaluatorId: string;
  evaluatorEmail?: string;
  status: EvaluationStatus;
  comments: string;
  fileUrl?: string;
  createdAt: Date;
}

export interface EvaluationQueueResponse {
  ideas: IdeaWithRelations[];
  pagination: {
    total: number;
    page: number;
    pages: number;
    limit: number;
    offset: number;
    lastEvaluatedAt?: Date;
  };
}

export interface SubmitEvaluationPayload {
  status: EvaluationStatus;
  comments: string;
  fileUrl?: string;
}

export interface SubmitEvaluationResponse {
  success: boolean;
  evaluation: IdeationEvaluation;
  message?: string;
}

export interface BulkStatusUpdatePayload {
  ideaIds: string[];
  status: EvaluationStatus;
  comments?: string;
}

export interface BulkStatusUpdateResponse {
  success: boolean;
  updated: number;
  failed?: number;
  errors?: string[];
}

export interface BulkAssignPayload {
  ideaIds: string[];
  assigneeId: string;
}

export interface BulkAssignResponse {
  success: boolean;
  assigned: number;
}

export interface EvaluationHistoryResponse {
  success: boolean;
  evaluations: IdeationEvaluation[];
}

export interface EvaluationQueueFilters {
  status?: IdeaStatus[];
  category?: string;
  submitterId?: string;
  evaluatorId?: string;
  limit?: number;
  offset?: number;
}

export interface EvaluationContext {
  selectedIdeas: string[];
  isSelecting: boolean;
  bulkStatusSelected: EvaluationStatus | null;
  assigneeSelected: string | null;
}
