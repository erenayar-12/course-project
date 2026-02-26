import React, { useState } from 'react';

interface ApproveRejectButtonsProps {
  status: string;
  onApprove: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const ApproveRejectButtons: React.FC<ApproveRejectButtonsProps> = ({
  status,
  onApprove,
  loading,
  error,
}) => {
  const [showRejectModal, setShowRejectModal] = useState(false);

  const isTerminal = status === 'Accepted' || status === 'Rejected';
  const approveDisabled = isTerminal || loading;
  const rejectDisabled = isTerminal || loading;

  return (
    <div className="flex flex-col items-end space-y-2">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded px-4 py-2 mb-2 text-sm">
          {error}
        </div>
      )}
      <div className="flex space-x-3">
        <button
          type="button"
          className={`px-5 py-2 rounded-lg font-medium transition-colors ${approveDisabled ? 'bg-gray-200 text-gray-500 cursor-not-allowed opacity-50' : 'bg-green-600 text-white hover:bg-green-700'}`}
          onClick={onApprove}
          disabled={approveDisabled}
          title={isTerminal ? `This idea is already ${status}` : 'Approve this idea?'}
        >
          {loading ? '⟳ Approving...' : '✓ Approve'}
        </button>
        <button
          type="button"
          className={`px-5 py-2 rounded-lg font-medium transition-colors ${rejectDisabled ? 'bg-gray-200 text-gray-500 cursor-not-allowed opacity-50' : 'bg-red-600 text-white hover:bg-red-700'}`}
          onClick={() => setShowRejectModal(true)}
          disabled={rejectDisabled}
          title={isTerminal ? `This idea is already ${status}` : 'Reject this idea?'}
        >
          Reject
        </button>
      </div>
      {showRejectModal && (
        <div role="dialog" className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-lg font-semibold mb-2">Feedback form coming in STORY-3.4</h2>
            <p className="text-gray-600 mb-4">Rejection feedback will be required in the next story. This is a placeholder modal.</p>
            <div className="flex justify-end">
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 cursor-not-allowed opacity-50"
                disabled
              >
                Submit Feedback
              </button>
              <button
                className="ml-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={() => setShowRejectModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApproveRejectButtons;
