
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ideasService from '../services/ideas.service';


const IdeasPage: React.FC = () => {
  const navigate = useNavigate();
  const [ideas, setIdeas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIdeas = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await ideasService.getIdeas();
        console.log('IdeasPage ideas:', result.data);
        const mainIdeas = (result.data || []).filter(
          (idea) => !['SUBMITTED', 'NEEDS_REVISION'].includes(idea.status)
        );
        setIdeas(mainIdeas);
      } catch (err: any) {
        setError(err.message || 'Failed to load ideas');
      } finally {
        setLoading(false);
      }
    };
    fetchIdeas();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-4 text-blue-900">All Ideas</h1>
        {loading ? (
          <p className="mb-6 text-gray-700">Loading ideas...</p>
        ) : error ? (
          <p className="mb-6 text-red-700">{error}</p>
        ) : (
          <>
            <table className="w-full border rounded">
              <thead>
                <tr className="bg-blue-100">
                  <th className="p-2">Title</th>
                  <th className="p-2">Category</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Submitter</th>
                  <th className="p-2">Submission Date</th>
                </tr>
              </thead>
              <tbody>
                {ideas.map((idea) => (
                  <tr
                    key={idea.id}
                    className="cursor-pointer hover:bg-blue-50"
                    onClick={() => navigate(`/ideas/${idea.id}`)}
                  >
                    <td className="p-2 underline text-blue-800">{idea.title}</td>
                    <td className="p-2">{idea.category}</td>
                    <td className="p-2">{idea.status}</td>
                    <td className="p-2">{idea.user?.name || idea.submitter || '-'}</td>
                    <td className="p-2">{idea.createdAt ? new Date(idea.createdAt).toLocaleDateString() : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {ideas.length === 0 && (
              <div className="mt-6 text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded p-4">
                No ideas found.
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
};

export default IdeasPage;
