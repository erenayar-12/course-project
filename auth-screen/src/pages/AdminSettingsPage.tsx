import React from 'react';

const AdminSettingsPage: React.FC = () => (
  <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <h1 className="text-3xl font-bold mb-4 text-blue-900">Admin - System Settings</h1>
      <p className="mb-6 text-gray-700">Configure system-wide settings, manage roles, and view audit logs. (Demo content below)</p>
      <ul className="list-disc pl-6 text-gray-800">
        <li>Role management (add/remove roles)</li>
        <li>System health status: <span className="text-green-700 font-semibold">Healthy</span></li>
        <li>Audit log retention: <span className="text-blue-700">1 year</span></li>
        <li>Session timeout: <span className="text-blue-700">30 minutes</span></li>
      </ul>
      <div className="mt-6 text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded p-4">
        <strong>Note:</strong> This is a demo. In production, you can configure advanced settings and view system logs here.
      </div>
    </div>
  </main>
);

export default AdminSettingsPage;
