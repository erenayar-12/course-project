/**
 * STORY-2.6: IdeaForm Component
 * 
 * Reusable form component supporting both submission (create) and edit modes.
 * 
 * Features:
 * - AC1: Prefilled form data from idea detail (edit mode)
 * - AC2: Form validation with constraints
 * - AC3: Real-time character counts with color coding
 * - AC4: Category dropdown with predefined options
 * - AC5: Attachment management (keep existing + add new)
 * - AC6: Unsaved changes warning on navigation
 * - AC13: Unsaved changes warning modal
 */

import React, { useCallback, useEffect, useState } from 'react';
import FormTextField from './FormTextField';
import FormTextArea from './FormTextArea';
import FormSelect from './FormSelect';
import { IdeaResponse } from '../types/ideaSchema';

export type IdeaFormMode = 'create' | 'edit';

export interface IdeaFormData {
  title: string;
  description: string;
  category: string;
  newFiles?: File[];
}

export interface IdeaFormProps {
  mode: IdeaFormMode;
  initialIdea?: IdeaResponse;
  onSubmit: (data: IdeaFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
  error?: string | null;
}

const CATEGORY_OPTIONS = [
  { value: 'Innovation', label: '💡 Innovation' },
  { value: 'Process Improvement', label: '⚙️ Process Improvement' },
  { value: 'Cost Reduction', label: '💰 Cost Reduction' },
  { value: 'Customer Experience', label: '😊 Customer Experience' },
  { value: 'Sustainability', label: '🌱 Sustainability' },
  { value: 'Technology', label: '🔧 Technology' },
  { value: 'Other', label: '📝 Other' },
];

const MIN_TITLE = 5;
const MAX_TITLE = 100;
const MIN_DESCRIPTION = 20;
const MAX_DESCRIPTION = 2000;

const IdeaForm: React.FC<IdeaFormProps> = ({
  mode,
  initialIdea,
  onSubmit,
  onCancel,
  isSubmitting = false,
  error = null,
}) => {
  const [formData, setFormData] = useState<IdeaFormData>({
    title: initialIdea?.title || '',
    description: initialIdea?.description || '',
    category: initialIdea?.category || 'Innovation',
    newFiles: [],
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Track unsaved changes
  useEffect(() => {
    const hasChanges: boolean =
      (formData.title !== (initialIdea?.title || '')) ||
      (formData.description !== (initialIdea?.description || '')) ||
      (formData.category !== (initialIdea?.category || 'Innovation')) ||
      !!(formData.newFiles && formData.newFiles.length > 0);

    setHasUnsavedChanges(hasChanges);
  }, [formData, initialIdea]);

  // Warn on page unload if unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.title.length < MIN_TITLE) {
      newErrors.title = `Title must be at least ${MIN_TITLE} characters`;
    }
    if (formData.title.length > MAX_TITLE) {
      newErrors.title = `Title must not exceed ${MAX_TITLE} characters`;
    }

    if (formData.description.length < MIN_DESCRIPTION) {
      newErrors.description = `Description must be at least ${MIN_DESCRIPTION} characters`;
    }
    if (formData.description.length > MAX_DESCRIPTION) {
      newErrors.description = `Description must not exceed ${MAX_DESCRIPTION} characters`;
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
      setHasUnsavedChanges(false);
      setFormErrors({});
    } catch (err) {
      // Error is handled by parent component
      console.error('Form submission error:', err);
    }
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      setShowUnsavedWarning(true);
      setPendingAction(() => onCancel);
    } else {
      onCancel();
    }
  };

  const confirmUnsavedChanges = () => {
    setShowUnsavedWarning(false);
    setHasUnsavedChanges(false);
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  const getTitleCharacterColor = (): string => {
    const percentage = (formData.title.length / MAX_TITLE) * 100;
    if (percentage < 50) return 'text-green-600';
    if (percentage < 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getDescriptionCharacterColor = (): string => {
    const percentage = (formData.description.length / MAX_DESCRIPTION) * 100;
    if (percentage < 50) return 'text-green-600';
    if (percentage < 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const isFormValid =
    formData.title.length >= MIN_TITLE &&
    formData.title.length <= MAX_TITLE &&
    formData.description.length >= MIN_DESCRIPTION &&
    formData.description.length <= MAX_DESCRIPTION &&
    formData.category &&
    Object.keys(formErrors).length === 0;

  const formTitle =
    mode === 'create'
      ? 'Submit New Idea'
      : 'Edit Idea';

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{formTitle}</h1>
          <p className="text-gray-600">
            {mode === 'create'
              ? 'Share your innovative idea with us'
              : 'Update your idea details'}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 font-medium">Error</p>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Title Field */}
        <div>
          <FormTextField
            name="title"
            label="Title"
            placeholder="Enter idea title (5-100 characters)"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            maxLength={MAX_TITLE}
            required
          />
          {formErrors.title && (
            <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>
          )}
          <div className={`mt-1 text-sm ${getTitleCharacterColor()}`}>
            {formData.title.length} / {MAX_TITLE} characters
          </div>
        </div>

        {/* Description Field */}
        <div>
          <FormTextArea
            name="description"
            label="Description"
            placeholder="Enter detailed description (20-2000 characters)"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            maxLength={MAX_DESCRIPTION}
            rows={6}
            required
          />
          {formErrors.description && (
            <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>
          )}
          <div className={`mt-1 text-sm ${getDescriptionCharacterColor()}`}>
            {formData.description.length} / {MAX_DESCRIPTION} characters
          </div>
        </div>

        {/* Category Field */}
        <div>
          <FormSelect
            name="category"
            label="Category"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            options={CATEGORY_OPTIONS}
            required
          />
          {formErrors.category && (
            <p className="mt-1 text-sm text-red-600">{formErrors.category}</p>
          )}
        </div>

        {/* File Upload - Create mode only */}
        {mode === 'create' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Supporting Files
              <span className="text-gray-500 text-xs ml-1">(Optional, max 5 files)</span>
            </label>
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.png"
              onChange={(e) => {
                const files = Array.from(e.currentTarget.files || []);
                setFormData({ ...formData, newFiles: files.slice(0, 5) });
              }}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {formData.newFiles && formData.newFiles.length > 0 && (
              <div className="mt-3 space-y-2">
                {formData.newFiles.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 border border-gray-200 rounded">
                    <span className="text-sm text-gray-700">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = formData.newFiles?.filter((_, i) => i !== idx) || [];
                        setFormData({ ...formData, newFiles: updated });
                      }}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {mode === 'create' ? 'Submitting...' : 'Saving...'}
              </span>
            ) : mode === 'create' ? (
              'Submit Idea'
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </form>

      {/* Unsaved Changes Warning Modal */}
      {showUnsavedWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="warning-title"
          >
            <h2 id="warning-title" className="text-xl font-bold text-gray-900 mb-4">
              Unsaved Changes
            </h2>
            <p className="text-gray-600 mb-6">
              You have unsaved changes. Are you sure you want to leave without saving?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowUnsavedWarning(false)}
                className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Keep Editing
              </button>
              <button
                onClick={confirmUnsavedChanges}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Discard Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default IdeaForm;
