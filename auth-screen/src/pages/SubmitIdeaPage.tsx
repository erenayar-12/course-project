import React from 'react';
import { useState } from 'react';
import { auth } from '../firebaseConfig';
import { apiPost } from '../api/client';
import { useNavigate } from 'react-router-dom';


const SubmitIdeaPage: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('PRODUCT'); // Default to valid value
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const user = auth.currentUser;
    console.log('USER OBJECT:', user);
    if (!user) {
      setError('You must be logged in to submit an idea.');
      setLoading(false);
      return;
    }
    // Validate fields before submit
    if (title.length < 3) {
      setError('Title must be at least 3 characters.');
      setLoading(false);
      return;
    }
    if (description.length < 10) {
      setError('Description must be at least 10 characters.');
      setLoading(false);
      return;
    }
    if (!['PRODUCT', 'PROCESS', 'MARKETING', 'OTHER'].includes(category)) {
      setError('Category must be one of PRODUCT, PROCESS, MARKETING, OTHER.');
      setLoading(false);
      return;
    }
    try {
      const formData = {
        title,
        description,
        category,
        submitterEmail: user && user.email ? user.email : '',
      };
      await apiPost('/ideas', formData);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to submit idea.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-4 text-green-900">Submit New Idea</h1>
        <p className="mb-6 text-gray-700">Fill out the form below to submit your innovative idea. All fields are required unless marked optional.</p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block font-semibold mb-1">Title</label>
            <input className="w-full border rounded p-2" maxLength={100} required placeholder="Enter idea title" value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div>
            <label className="block font-semibold mb-1">Description</label>
            <textarea className="w-full border rounded p-2" maxLength={2000} required placeholder="Describe your idea" rows={4} value={description} onChange={e => setDescription(e.target.value)} />
          </div>
          <div>
            <label className="block font-semibold mb-1">Category</label>
            <select className="w-full border rounded p-2" required value={category} onChange={e => setCategory(e.target.value)}>
              <option value="">Select category</option>
              <option value="PRODUCT">Product</option>
              <option value="PROCESS">Process</option>
              <option value="MARKETING">Marketing</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-1">Attachment (optional, max 10MB, PDF/DOC/PNG/JPG)</label>
            <input type="file" className="w-full" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" onChange={e => setFile(e.target.files?.[0] || null)} />
          </div>
          <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 font-semibold" disabled={loading}>{loading ? 'Submitting...' : 'Submit Idea'}</button>
        </form>
        {error && <div className="mt-4 text-red-600">{error}</div>}
        <div className="mt-6 text-sm text-green-700 bg-green-50 border border-green-200 rounded p-4">
          <strong>Note:</strong> This is a demo form. In production, submissions will be validated and saved to the database.
        </div>
      </div>
    </main>
  );
};

export default SubmitIdeaPage;
