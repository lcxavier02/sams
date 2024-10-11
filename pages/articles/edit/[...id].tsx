import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';
import { FaTrash } from 'react-icons/fa';


/**
 * EditArticle Component
 * 
 * This component allows the user to edit an article, update its information, and delete it.
 * It uses a form to display and edit the article's details, including title, authors, publication date,
 * keywords, abstract, journal, DOI, and pages. It also includes functionality to delete the article with a confirmation modal.
 *
 * @component
 * @returns {JSX.Element} - The rendered component for editing an article.
 */
const EditArticle = (): JSX.Element => {
  const [article, setArticle] = useState({
    title: '',
    authors: '',
    publication_date: '',
    keywords: '',
    abstract: '',
    journal: '',
    doi: '',
    pages: '',
  });
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState<{ username: string } | null>(null);
  const router = useRouter();
  const { id } = router.query;

  /**
   * useEffect for fetching the user profile and the article data.
   * 
   * Fetches the user profile to ensure the logged-in user is authenticated.
   * Fetches the article data based on the article's `id` from the query parameters.
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

    const getArticle = async () => {
      try {
        const response = await axios.get(`/api/articles/?id=${id}`, { withCredentials: true });
        const articleData = response.data;

        const formattedDate = new Date(articleData.publication_date).toISOString().split('T')[0];

        setArticle({
          title: articleData.title || '',
          authors: articleData.authors?.join(', ') || '',
          publication_date: formattedDate || '',
          keywords: articleData.keywords?.join(', ') || '',
          abstract: articleData.abstract || '',
          journal: articleData.journal || '',
          doi: articleData.doi || '',
          pages: articleData.pages?.join(', ') || '',
        });
      } catch (err) {
        console.error('Error fetching article:', err);
        setError('Error fetching article');
      }
    };

    if (id) {
      getUserProfile();
      getArticle();
    }
  }, [id]);

  /**
   * Handle input changes in the form fields.
   * 
   * @param {React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>} e - Event object for the input change.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setArticle({
      ...article,
      [e.target.name]: e.target.value,
    });
  };

  /**
   * Handle form submission to update the article details.
   * 
   * @param {React.FormEvent<HTMLFormElement>} e - Event object for the form submission.
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      await axios.put(`/api/articles/?id=${id}`, {
        ...article,
        authors: article.authors.split(',').map((author) => author.trim()),
        keywords: article.keywords.split(',').map((keyword) => keyword.trim()),
        pages: article.pages.split(',').map((page) => page.trim()),
      });

      router.push('/');
    } catch (err: any) {
      setError('Error updating article');
    }
  };

  /**
   * Handle article deletion with confirmation modal.
   */
  const handleDelete = async () => {
    try {
      await axios.delete(`/api/articles/?id=${id}`, { withCredentials: true });
      setShowModal(false);
      router.push('/');
    } catch (err) {
      setError('Error deleting article');
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
        <h1 className="text-2xl font-bold mb-4">Edit Article</h1>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="title"
            type="text"
            placeholder="Title"
            value={article.title}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
          <input
            name="authors"
            type="text"
            placeholder="Authors (comma-separated)"
            value={article.authors}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
          <input
            name="publication_date"
            type="date"
            placeholder="Publication Date"
            value={article.publication_date}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
          <textarea
            name="abstract"
            placeholder="Abstract"
            value={article.abstract}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
          <input
            name="journal"
            type="text"
            placeholder="Journal"
            value={article.journal}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
          <input
            name="doi"
            type="text"
            placeholder="DOI"
            value={article.doi}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
          <input
            name="keywords"
            type="text"
            placeholder="Keywords (comma-separated)"
            value={article.keywords}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
          <input
            name="pages"
            type="text"
            placeholder="Pages (comma-separated)"
            value={article.pages}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
          <div className="flex space-x-4">
            <button type="submit" className="p-2 bg-blue-500 text-white rounded-lg">
              Update Article
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

        <div className="mt-4">
          <button onClick={() => setShowModal(true)} className="flex items-center text-red-500">
            <FaTrash className="mr-2" />
            Delete Article
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete this article?</p>
            <div className="flex space-x-4 mt-4">
              <button
                onClick={handleDelete}
                className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditArticle;
