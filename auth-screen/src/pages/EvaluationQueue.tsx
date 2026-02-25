import React from 'react';
import { useMockAuth0 } from '../context/MockAuth0Context';

/**
 * EvaluationQueue Component
 *
 * Shows evaluation queue - only accessible to Evaluators and Admins.
 * Reference: STORY-EPIC-1.4 - AC3 (Evaluator-only routes)
 */
const EvaluationQueue: React.FC = () => {
  const { user } = useMockAuth0();

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Evaluation Queue</h1>
          <p className="text-gray-600 mb-6">
            Ideas pending review (Current role:{' '}
            <span className="font-semibold capitalize">{user?.role}</span>)
          </p>

          <div className="space-y-4">
            {[1, 2, 3].map((id) => (
              <div key={id} className="border border-purple-200 rounded-lg p-4 bg-purple-50">
                <h3 className="font-bold text-gray-800">Idea #{id}</h3>
                <p className="text-gray-600 text-sm mt-2">
                  Sample idea description for evaluation...
                </p>
                <button className="mt-3 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
                  Review
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded">
            <p className="text-sm text-purple-700">
              <strong>Protected Route:</strong> Only Evaluators and Admins can access this page. If
              you see this, your role has evaluation permissions.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default EvaluationQueue;
