import React from 'react';
import { useMockAuth0 } from '../context/MockAuth0Context';
import { ROLES } from '../constants/roles';

/**
 * Dashboard Component
 * 
 * Shows different content based on user role.
 * Reference: STORY-EPIC-1.4 - Role-based UI
 */
const Dashboard: React.FC = () => {
  const { user, logout } = useMockAuth0();

  if (!user) {
    return <div>Loading...</div>;
  }

  const getDashboardContent = () => {
    switch (user.role) {
      case ROLES.ADMIN:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>
            <p className="text-gray-600">Welcome, Admin! You have full system access.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900">User Management</h3>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900">System Settings</h3>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900">View All Ideas</h3>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900">Evaluation Queue</h3>
              </div>
            </div>
          </div>
        );

      case ROLES.EVALUATOR:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">Evaluation Dashboard</h2>
            <p className="text-gray-600">Welcome, Evaluator! Review and evaluate submitted ideas.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h3 className="font-semibold text-purple-900">Evaluation Queue</h3>
                <p className="text-sm text-purple-700 mt-2">5 ideas pending review</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h3 className="font-semibold text-purple-900">My Reviews</h3>
                <p className="text-sm text-purple-700 mt-2">12 completed reviews</p>
              </div>
            </div>
          </div>
        );

      case ROLES.SUBMITTER:
      default:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">Submitter Dashboard</h2>
            <p className="text-gray-600">Welcome, Submitter! Submit and track your ideas.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-900">Submit New Idea</h3>
                <p className="text-sm text-green-700 mt-2">Create a new submission</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-900">My Submissions</h3>
                <p className="text-sm text-green-700 mt-2">3 submitted ideas</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
              <p className="text-gray-600 mt-2">
                Email: <span className="font-semibold">{user.email}</span>
              </p>
              <p className="text-gray-600">
                Role: <span className="font-semibold capitalize text-blue-600">{user.role}</span>
              </p>
            </div>
            <button
              onClick={logout}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Role-based Content */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {getDashboardContent()}
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-700">
            <strong>Note:</strong> This is a mock dashboard. Different content is shown based on your role.
            Try logging in with different emails to see role-based access control:
            <br />• <code className="bg-white px-2 py-1 rounded">user@example.com</code> → Submitter
            <br />• <code className="bg-white px-2 py-1 rounded">evaluator@example.com</code> → Evaluator
            <br />• <code className="bg-white px-2 py-1 rounded">admin@example.com</code> → Admin
          </p>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
