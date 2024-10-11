import { ArticlePayload, UserPayload } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import ArticlesContainer from "@/components/ArticlesContainer";
import { FaPlus } from "react-icons/fa";

/**
 * Home Component
 *
 * This component represents the home page of the application. It manages the display of
 * the user's profile, a list of articles, and provides functionality for searching, adding,
 * and editing articles. It also includes user authentication-related features such as logout.
 *
 * @component
 *
 * @example
 * return (
 *   <Home />
 * )
 */
export default function Home() {
  const [user, setUser] = useState<UserPayload | null>(null);
  const [articles, setArticles] = useState<ArticlePayload[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string | null>(null);
  const router = useRouter();

  /**
   * Fetches the profile of the currently logged-in user.
   * The profile is fetched from the `/api/profile` endpoint.
   */
  const getProfile = async () => {
    try {
      const profile = await axios.get('/api/profile', {
        withCredentials: true,
      });
      setUser(profile.data);
    } catch (error) {
      console.error('Error obteniendo el perfil:', error);
    }
  };

  /**
   * Fetches the list of articles.
   * If search term and search criteria are provided, it fetches search results.
   * Otherwise, it fetches all articles.
   *
   * @param {string | null} term - The search term (if any).
   * @param {string | null} searchBy - The search criteria, either 'title' or 'doi'.
   */
  const fetchArticles = async (term: string | null = null, searchBy: string | null = null) => {
    try {
      const endpoint = term && searchBy
        ? `/api/search?term=${term}&searchBy=${searchBy}`
        : '/api/articles';

      const response = await axios.get(endpoint, {
        withCredentials: true,
      });

      setArticles(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching articles:', error);
      setArticles([]);
    }
  };

  /**
  * Handles the search functionality. Updates the search term and triggers a new fetch request
  * for articles based on the provided search term and criteria.
  *
  * @param {string} term - The search term entered by the user.
  * @param {string} searchBy - The criteria by which to search (title or doi).
  */
  const handleSearch = async (term: string, searchBy: string) => {
    setSearchTerm(term);
    fetchArticles(term, searchBy);
  };

  /**
   * Handles the logout functionality. Sends a request to the `/api/auth/logout` endpoint
   * to log the user out, then redirects to the login page.
   */
  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout', {}, {
        withCredentials: true,
      });

      router.push('/login');
    } catch (error) {
      console.error('Error al hacer logout:', error);
    }
  };

  // Fetch user profile and articles when the component mounts
  useEffect(() => {
    getProfile();
    fetchArticles();
  }, []);

  return (
    <div>
      {user ? (
        <>
          <Navbar username={user.username} onLogout={handleLogout} />
          <div className="p-6 flex justify-between items-center">
            <SearchBar onSearch={handleSearch} />
            <button
              onClick={() => router.push('/articles/new')}
              className="flex items-center p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              <FaPlus className="mr-2" /> Add Article
            </button>
          </div>

          {error && (
            <div className="p-4 mb-4 text-red-500 bg-red-100 rounded-lg">
              {error}
            </div>
          )}

          <ArticlesContainer searchResults={articles} />
        </>
      ) : (
        <h1>Loading...</h1>
      )}
    </div>
  );
}
