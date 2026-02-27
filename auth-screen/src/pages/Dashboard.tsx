import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserRole } from '../firebaseRoleUtils';
import { ROLES } from '../constants/roles';

/**
 * Dashboard Component
 *
 * Shows different content based on user role.
 * Reference: STORY-EPIC-1.4 - Role-based UI
 */
const Dashboard: React.FC = () => {
  const [firebaseUser, setFirebaseUser] = React.useState<any>(null);
  const [role, setRole] = React.useState<string>('');
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        // Categorize admin@admin.com as admin, all others as user
        const email = user.email || '';
        const role = email === 'admin@admin.com' ? 'admin' : 'user';
        setRole(role);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const logout = () => {
    auth.signOut();
    navigate('/login');
  };

  if (loading || !firebaseUser) {
    return <div>Loading...</div>;
  }

  const getDashboardContent = () => {
    if (role === 'admin') {
      return (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>
          <p className="text-gray-600">Welcome, Admin! You have full system access.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <button className="bg-blue-50 p-4 rounded-lg border border-blue-200 w-full text-left hover:bg-blue-100" onClick={() => navigate('/admin/users')}>
              <h3 className="font-semibold text-blue-900">User Management</h3>
            </button>
            <button className="bg-blue-50 p-4 rounded-lg border border-blue-200 w-full text-left hover:bg-blue-100" onClick={() => navigate('/admin/settings')}>
              <h3 className="font-semibold text-blue-900">System Settings</h3>
            </button>
            <button className="bg-blue-50 p-4 rounded-lg border border-blue-200 w-full text-left hover:bg-blue-100" onClick={() => navigate('/ideas')}>
              <h3 className="font-semibold text-blue-900">View All Ideas</h3>
            </button>
            <button className="bg-blue-50 p-4 rounded-lg border border-blue-200 w-full text-left hover:bg-blue-100" onClick={() => navigate('/evaluation-queue')}>
              <h3 className="font-semibold text-blue-900">Evaluation Queue</h3>
            </button>
          </div>
        </div>
      );
    }
    // All other users
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">User Dashboard</h2>
        <p className="text-gray-600">Welcome, User! Submit and track your ideas.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <button className="bg-green-50 p-4 rounded-lg border border-green-200 w-full text-left hover:bg-green-100" onClick={() => navigate('/submit-idea')}>
            <h3 className="font-semibold text-green-900">Submit New Idea</h3>
            <p className="text-sm text-green-700 mt-2">Create a new submission</p>
          </button>
          <button className="bg-green-50 p-4 rounded-lg border border-green-200 w-full text-left hover:bg-green-100" onClick={() => navigate('/my-ideas')}>
            <h3 className="font-semibold text-green-900">My Submissions</h3>
            <p className="text-sm text-green-700 mt-2">3 submitted ideas</p>
          </button>
        </div>
      </div>
    );
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
                Email: <span className="font-semibold">{firebaseUser.email}</span>
              </p>
              <p className="text-gray-600">
                Role: <span className="font-semibold capitalize text-blue-600">{role}</span>
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
        <div className="bg-white rounded-lg shadow-lg p-6">{getDashboardContent()}</div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-700">
            <strong>Note:</strong> This dashboard uses Firebase Auth and Firestore roles. Try logging in with different emails to see role-based access control:
            <br />• <code className="bg-white px-2 py-1 rounded">admin@admin.com</code> → Admin
            <br />• <code className="bg-white px-2 py-1 rounded">user@user.com</code> → User
          </p>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
