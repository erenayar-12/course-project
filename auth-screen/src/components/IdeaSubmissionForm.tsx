/**
 * IdeaSubmissionForm.tsx
 * Main form component for idea submission.
 * Integrates React Hook Form, Zod validation, and IdeasService.
 *
 * Form Flow:
 * 1. User fills fields (title, description, category)
 * 2. React Hook Form tracks state
 * 3. On blur/change: Zod validates client-side
 * 4. Submit button enabled only when valid
 * 5. On submit: API call to backend
 * 6. Success: Show toast + redirect to dashboard
 * 7. Error: Show error message + keep form editable
 */

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { ideaSubmissionSchema, IdeaSubmissionFormData, IDEA_CATEGORIES } from '@/types/ideaSchema';
import FormTextField from '@/components/FormTextField';
import FormTextArea from '@/components/FormTextArea';
import FormSelect from '@/components/FormSelect';
import { FileUploadInput } from '@/components/FileUploadInput';
import { FileProgressBar } from '@/components/FileProgressBar';
import ideasService from '@/services/ideas.service';
import { fileService } from '@/services/file.service';

interface IdeaSubmissionFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

/**
 * Idea submission form component.
 * @param onSuccess - Callback after successful submission
 * @param onCancel - Callback when cancel is clicked
 */
const IdeaSubmissionForm: React.FC<IdeaSubmissionFormProps> = ({ onSuccess, onCancel }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  // React Hook Form setup with Zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    reset,
  } = useForm<IdeaSubmissionFormData>({
    resolver: zodResolver(ideaSubmissionSchema),
    mode: 'onBlur', // Validate on blur instead of onChange for UX
  });

  /**
   * Form submission handler.
   * Validates, calls API, shows feedback, handles file upload, and redirects.
   */
  const onSubmit = async (data: IdeaSubmissionFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setFileError(null);

    try {
      // 1. Submit idea form data
      const ideaResponse = await ideasService.submitIdea(data);
      const ideaId = ideaResponse.data.id;

      // 2. If file selected, upload it
      if (selectedFile) {
        // Validate file before upload
        const validation = fileService.validateFile(selectedFile);
        if (!validation.valid) {
          setFileError(validation.error || 'Invalid file');
          setIsSubmitting(false);
          return;
        }

        setIsUploading(true);
        try {
          await fileService.uploadFile(ideaId, selectedFile, (event) => {
            setUploadProgress(event.progress);
          });
        } catch (uploadError) {
          const message = uploadError instanceof Error ? uploadError.message : 'File upload failed';
          setFileError(message);
          setIsSubmitting(false);
          setIsUploading(false);
          return;
        }
      }

      // 3. Show success
      onSuccess?.();

      // 4. Reset form and redirect after short delay
      reset();
      setSelectedFile(null);
      setUploadProgress(0);
      setTimeout(() => {
        navigate('/ideas');
      }, 2000);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to submit idea';
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  /**
   * Handle form cancellation.
   * Clears form and optionally calls parent callback.
   */
  const handleCancel = () => {
    if (isDirty) {
      const confirmed = window.confirm('Discard unsaved changes?');
      if (!confirmed) return;
    }
    reset();
    onCancel?.();
  };

  /**
   * Handle keyboard shortcuts.
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Submit an Idea</h1>

      {/* General error message */}
      {submitError && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800 text-sm">{submitError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} onKeyDown={handleKeyDown} noValidate>
        {/* Title Field */}
        <FormTextField
          {...register('title')}
          name="title"
          label="Idea Title"
          placeholder="Give your idea a clear, concise title"
          error={errors.title}
          disabled={isSubmitting}
          maxLength={100}
        />

        {/* Description Field */}
        <FormTextArea
          {...register('description')}
          name="description"
          label="Description"
          placeholder="Provide detailed description of your idea (minimum 10 characters)"
          error={errors.description}
          disabled={isSubmitting}
          maxLength={2000}
          rows={6}
        />

        {/* Category Dropdown */}
        <FormSelect
          {...register('category')}
          name="category"
          label="Category"
          options={IDEA_CATEGORIES.map((cat) => ({ value: cat, label: cat }))}
          error={errors.category}
          disabled={isSubmitting}
        />

        {/* File Upload Input */}
        <FileUploadInput
          onFileSelect={setSelectedFile}
          selectedFile={selectedFile}
          error={fileError || undefined}
          disabled={isSubmitting || isUploading}
        />

        {/* Upload Progress Bar */}
        <FileProgressBar
          progress={uploadProgress}
          isUploading={isUploading}
          fileName={selectedFile?.name}
        />

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4 justify-end">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting || isUploading}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting || isUploading || !isValid || !isDirty}
            className={`
              px-6 py-2 bg-blue-600 text-white rounded-md font-medium
              hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors flex items-center gap-2
            `}
          >
            {isSubmitting || isUploading ? (
              <>
                <span className="inline-block animate-spin">⟳</span>
                {isUploading ? 'Uploading...' : 'Submitting...'}
              </>
            ) : (
              'Submit Idea'
            )}
          </button>
        </div>
      </form>

      {/* Keyboard shortcuts hint */}
      <p className="mt-6 text-xs text-gray-500 text-center">
        💡 Tip: Press Escape to cancel
      </p>
    </div>
  );
};

export default IdeaSubmissionForm;
