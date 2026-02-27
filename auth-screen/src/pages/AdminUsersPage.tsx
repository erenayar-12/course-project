import React from 'react';

const AdminUsersPage: React.FC = () => (
  <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <h1 className="text-3xl font-bold mb-4 text-blue-900">Admin - User Management</h1>
      <p className="mb-6 text-gray-700">Manage platform users, assign roles, and view user activity logs. (Demo data below)</p>
      <table className="w-full border rounded">
        <thead>
          <tr className="bg-blue-100">
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Role</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-2">Priya Sharma</td>
            <td className="p-2">user@example.com</td>
            <td className="p-2">Submitter</td>
            <td className="p-2 text-green-700">Active</td>
          </tr>
          <tr>
            <td className="p-2">Raj Verma</td>
            <td className="p-2">evaluator@example.com</td>
            <td className="p-2">Evaluator</td>
            <td className="p-2 text-green-700">Active</td>
          </tr>
          <tr>
            <td className="p-2">Admin User</td>
            <td className="p-2">admin@example.com</td>
            <td className="p-2">Admin</td>
            <td className="p-2 text-green-700">Active</td>
          </tr>
        </tbody>
      </table>
      <div className="mt-6 text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded p-4">
        <strong>Note:</strong> This is a demo. In production, you can add/remove users, assign roles, and view audit logs here.
      </div>
    </div>
  </main>
);

export default AdminUsersPage;
