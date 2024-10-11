import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { UserPayload } from '@/types';
import Navbar from '@/components/Navbar';


/**
 * NewArticle Component
 * 
 * This component allows the user to create a new article by submitting a form. 
 * The form contains fields for article details such as title, authors, publication date, keywords, abstract, journal, DOI, and pages. 
 * It also includes functionality to cancel the form submission and return to the main page.
 *
 * @component
 * @returns {JSX.Element} - The rendered form for creating a new article.
 */
function NewArticle(): JSX.Element {
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    authors: '',
    publication_date: '',
    keywords: '',
    abstract: '',
    journal: '',
    doi: '',
    pages: '',
    user: '',
  });
  const [error, setError] = useState('');
  const [user, setUser] = useState<UserPayload | null>(null);
  const router = useRouter();

  /**
   * useEffect to fetch the user profile data.
   * 
   * This hook fetches the logged-in user profile data upon component mount.
   */
  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const response = await axios.get('/api/profile', { withCredentials: true });
        setUser(response.data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Error fetching user profile');
      }
    };

    getUserProfile();
  }, []);

  /**
   * Handle input changes for the form fields.
   * 
   * @param {React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>} e - Event object for input change.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /**
   * Handle form submission to create a new article.
   * 
   * @param {React.FormEvent<HTMLFormElement>} e - Event object for form submission.
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      await axios.post('/api/articles', {
        ...formData,
        authors: formData.authors.split(', '),
        keywords: formData.keywords.split(', '),
        pages: formData.pages.split(', '),
        user: user?.id,
      });

      router.push('/');
    } catch (error: any) {
      setError('Error creating article');
    }
  };

  /**
   * Handle cancel button to navigate back to the articles list.
   */
  const handleCancel = () => {
    router.push('/');
  };

  return (
    <div>
      {user && <Navbar username={user.username} onLogout={() => router.push('/login')} />}
      <div className="container mx-auto mt-6 p-6">
        <h1 className="text-2xl font-bold mb-4">Create a New Article</h1>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="title"
            type="text"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
          <input
            name="authors"
            type="text"
            placeholder="Authors (comma-separated)"
            value={formData.authors}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
          <input
            name="publication_date"
            type="date"
            placeholder="Publication Date"
            value={formData.publication_date}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
          <textarea
            name="abstract"
            placeholder="Abstract"
            value={formData.abstract}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
          <input
            name="journal"
            type="text"
            placeholder="Journal"
            value={formData.journal}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
          <input
            name="doi"
            type="text"
            placeholder="DOI"
            value={formData.doi}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
          <input
            name="keywords"
            type="text"
            placeholder="Keywords (comma-separated)"
            value={formData.keywords}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
          <input
            name="pages"
            type="text"
            placeholder="Pages (comma-separated)"
            value={formData.pages}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
          <div className="flex space-x-4">
            <button type="submit" className="p-2 bg-blue-500 text-white rounded-lg">
              Create Article
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewArticle;
