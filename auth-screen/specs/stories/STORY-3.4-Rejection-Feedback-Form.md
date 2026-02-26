# STORY-3.4: Rejection Feedback Form

**Status:** Not Started  
**Story ID:** STORY-3.4  
**Epic:** EPIC-3 (Idea Evaluation Workflow & Status Tracking)  
**Sprint:** Backlog  
**Story Points:** 5  
**Priority:** P0 (Critical)  
**Persona:** Raj (Evaluator/Admin)  
**Created:** February 26, 2026  
**Updated:** February 26, 2026  

---

## User Story

**As an** evaluator  
**I want** to provide detailed feedback when rejecting an idea  
**so that** submitters understand why their idea was not accepted and can improve future submissions

---

## Context

When an evaluator clicks "Reject" (from STORY-3.3), a modal form opens requiring structured feedback. Feedback is mandatory (non-empty) to ensure rejections are constructive. The form includes character counting, validation, and clear guidance. Feedback is saved to database and visible to submitter in their idea detail view.

---

## Acceptance Criteria

### AC1: Reject Modal Opens with Feedback Form
**Given:** Evaluator clicks "Reject" button in review panel  
**When:** Modal opens  
**Then:**
- Modal dialog appears with title: "Why are you rejecting this idea?"
- Form contains: Label "Feedback", text area, character count, Cancel/Submit buttons
- Modal is centered on screen
- Background is dimmed (opacity)
- Mobile: Modal is full-screen or takes 90% width

### AC2: Feedback Is Required
**Given:** Modal is open  
**When:** Evaluator tries to submit without entering feedback  
**Then:**
- Submit button is disabled (grayed out)
- Error message shown: "Feedback is required"
- After user types first character, error clears and button enables

### AC3: Character Limit Enforced
**Given:** Feedback form is open  
**When:** Evaluator types feedback  
**Then:**
- Character count shows: "45/500 characters"
- Count color: Green (0-250), Yellow (250-400), Red (400-500)
- Text input blocked after 500 characters (user cannot type beyond)
- Submit enabled only if 1-500 characters

### AC4: Feedback Saved with Status Change
**Given:** Evaluator enters "This idea lacks business justification" and clicks Submit  
**When:** Form submitted  
**Then:**
- API call made: `PUT /api/ideas/:ideaId/status` with `{ status: 'Rejected', feedback: '...' }`
- Idea.status = 'Rejected'
- Idea.evaluatorFeedback = feedback text
- At STORY-3.5 level: statusChangeLogs entry created
- At STORY-3.6 level: Email sent to submitter

### AC5: Feedback Visible to Submitter
**Given:** Idea rejected with feedback "Missing customer research"  
**When:** Submitter views their idea (STORY-2.5)  
**Then:**
- Detail page shows section: "Evaluator Feedback"
- Feedback text displayed: "Missing customer research"
- Label shows: "This idea was rejected on Feb 3, 2026"

### AC6: Cancel Button Discards Changes
**Given:** Modal is open with feedback entered  
**When:** Evaluator clicks Cancel or clicks outside modal  
**Then:**
- Modal closes without saving
- Idea status remains "Under Review"
- Feedback discarded (not saved)
- Button states reset

---

## Technical Details

### Component to Create

**File:** `src/components/RejectionFeedbackModal.tsx` (NEW)

```typescript
interface RejectionFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (feedback: string) => Promise<void>;
  isLoading?: boolean;
}

export function RejectionFeedbackModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false
}: RejectionFeedbackModalProps) {
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState(null);
  
  const MAX_CHARS = 500;
  const MIN_CHARS = 1;
  const isValid = feedback.length >= MIN_CHARS && feedback.length <= MAX_CHARS;

  const handleFeedbackChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= MAX_CHARS) {
      setFeedback(text);
      setError(null);
    }
  };

  const handleSubmit = async () => {
    if (!isValid) {
      setError('Feedback is required (1-500 characters)');
      return;
    }

    try {
      await onSubmit(feedback);
      setFeedback('');
    } catch (err) {
      setError(err.message || 'Failed to submit feedback');
    }
  };

  const handleClose = () => {
    setFeedback('');
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  const charCount = feedback.length;
  const charColor = charCount < 250 ? 'text-green-600' : 
                    charCount < 400 ? 'text-yellow-600' : 'text-red-600';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Why are you rejecting this idea?</h2>
          <p className="text-gray-600 text-sm mt-1">
            Provide constructive feedback to help the submitter understand the decision.
          </p>
        </div>

        {/* Body */}
        <div className="px-6 py-4">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-800 text-sm rounded border border-red-200">
              {error}
            </div>
          )}

          <label className="block text-sm font-medium text-gray-700 mb-2">
            Feedback
          </label>

          <textarea
            value={feedback}
            onChange={handleFeedbackChange}
            placeholder="Explain why this idea isn't suitable at this time. Be specific and constructive..."
            className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            disabled={isLoading}
          />

          <div className={`text-sm ${charColor} mt-2 font-medium`}>
            {charCount}/{MAX_CHARS} characters
          </div>

          {charCount > 450 && (
            <p className="text-sm text-red-600 mt-1">Approaching character limit</p>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex gap-3">
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={!isValid || isLoading}
            className={`flex-1 px-4 py-2 rounded-lg font-medium text-white flex items-center justify-center gap-2
              ${isValid && !isLoading
                ? 'bg-red-600 hover:bg-red-700 cursor-pointer'
                : 'bg-gray-300 cursor-not-allowed'
              }
            `}
          >
            {isLoading ? (
              <>
                <span className="inline-block animate-spin">⟳</span>
                Rejecting...
              </>
            ) : (
              'Reject Idea'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
```

### Database Schema Update

**Add column to `ideas` table:**
```sql
ALTER TABLE ideas ADD COLUMN evaluatorFeedback NVARCHAR(500) NULL;
```

**Note:** Also add to `statusChangeLogs.feedback` if not already added in STORY-3.5

### API Integration

**Backend - `backend/src/routes/ideas.ts`:**

```typescript
router.put('/:ideaId/status', authMiddleware, roleMiddleware(['evaluator']), async (req, res) => {
  const { status, feedback } = req.body;
  
  // Validate feedback if rejecting
  if (status === 'Rejected') {
    if (!feedback || feedback.trim().length === 0) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Feedback is required when rejecting an idea'
      });
    }
    if (feedback.length > 500) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Feedback must be 500 characters or less'
      });
    }
  }

  // Continue with state transition...
  // See STORY-3.3 for full implementation
});
```

**Frontend - `src/services/ideas.service.ts`:**

```typescript
async updateIdeaStatus(ideaId: string, data: { status: string; feedback?: string }) {
  const response = await axios.put(
    `/api/ideas/${ideaId}/status`,
    data,
    { headers: getAuthHeaders() }
  );
  return response.data;
}
```

### Integration with IdeaReviewPanel

**File:** `src/pages/IdeaReviewPanel.tsx` - Already has placeholder, update to:

```typescript
import { RejectionFeedbackModal } from '../components/RejectionFeedbackModal';

// In component:
const [showRejectModal, setShowRejectModal] = useState(false);
const [rejectLoading, setRejectLoading] = useState(false);

const handleRejectClick = () => {
  setShowRejectModal(true);
};

const handleRejectSubmit = async (feedback: string) => {
  try {
    setRejectLoading(true);
    const updated = await ideasService.updateIdeaStatus(ideaId, {
      status: 'Rejected',
      feedback
    });
    setIdea(updated);
    setShowRejectModal(false);
  } catch (err) {
    // Error handling
  } finally {
    setRejectLoading(false);
  }
};

// In JSX - Update Reject button:
<button
  onClick={handleRejectClick}
  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
>
  ✗ Reject
</button>

// Add modal at end:
<RejectionFeedbackModal
  isOpen={showRejectModal}
  onClose={() => setShowRejectModal(false)}
  onSubmit={handleRejectSubmit}
  isLoading={rejectLoading}
/>
```

### Display in IdeaDetailPage

**File:** `src/pages/IdeaDetailPage.tsx` - Add feedback section:

```typescript
{idea.status === 'Rejected' && idea.evaluatorFeedback && (
  <section className="mb-8 p-6 bg-red-50 rounded-lg border border-red-200">
    <h2 className="text-lg font-semibold text-red-900 mb-2">
      Evaluator Feedback
    </h2>
    <p className="text-red-800 mb-3">
      This idea was rejected on {new Date(idea.updatedAt).toLocaleDateString()}
    </p>
    <p className="text-gray-700 leading-relaxed">
      {idea.evaluatorFeedback}
    </p>
  </section>
)}
```

---

## Files Affected

### New Files
- `src/components/RejectionFeedbackModal.tsx`

### Modified Files
- `src/pages/IdeaReviewPanel.tsx` - Integrate modal
- `src/pages/IdeaDetailPage.tsx` - Display feedback
- `backend/src/routes/ideas.ts` - Validate feedback
- `src/services/ideas.service.ts` - Already has updateIdeaStatus

---

## Testing

### Unit Tests
- [ ] Modal opens when reject clicked
- [ ] Feedback required validation works
- [ ] Character limit enforced
- [ ] Character count shows correct color
- [ ] Submit disabled when empty
- [ ] Submit enabled with valid feedback
- [ ] Cancel closes modal without saving
- [ ] Click outside modal closes it

### E2E Tests
- [ ] Evaluator can reject with feedback
- [ ] Feedback saved to database
- [ ] Feedback visible to submitter
- [ ] Modal closes after submit
- [ ] Character limit enforced in UI
- [ ] Validation error shows

---

## Definition of Done Checklist

- [ ] Modal component implemented
- [ ] Validation works frontend + backend
- [ ] Character limit enforced
- [ ] Feedback saved correctly
- [ ] Feedback visible to submitter
- [ ] Modal appearance professional
- [ ] Accessibility verified
- [ ] Unit tests >80% coverage
- [ ] E2E tests passing
- [ ] No console errors
- [ ] Mobile responsive

---

## Dependencies

### Blocks
- None (integrates with STORY-3.3)

### Blocked By
- STORY-3.3 (Reject button needs feedback logic)

---

## Estimation

- **Story Points:** 5
- **Estimated Days:** 1-2 days
- **Confidence:** High

---

## Notes

- Feedback is stored in `ideas.evaluatorFeedback` column
- Also logged in `statusChangeLogs.feedback` at STORY-3.5 level
- Character limit of 500 chars balances detail with UI space
- Color changes provide visual feedback on length
- Feedback visible to submitter in detail page
