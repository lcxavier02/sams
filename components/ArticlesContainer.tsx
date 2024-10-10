import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { ArticlePayload } from '@/types';

const ArticlesContainer: React.FC = () => {
  const [articles, setArticles] = useState<ArticlePayload[]>([]);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get('/api/articles', { withCredentials: true });
        setArticles(response.data);
      } catch (err) {
        console.error('Error fetching articles:', err);
        setError('Error fetching articles');
      }
    };

    fetchArticles();
  }, []);

  const handleArticleClick = (_id: string) => {
    router.push(`/articles/edit/${_id}`);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Articles</h2>
      <div className="border border-gray-300 rounded-lg p-4">
        {error && <p className="text-red-500">{error}</p>}
        {articles.length === 0 ? (
          <p>No articles found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {articles.map((article) => (
              <div
                key={article._id}
                className="border rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition"
                onClick={() => handleArticleClick(article._id)}
              >
                <h3 className="text-lg font-bold">{article.title}</h3>
                <p className="text-sm text-gray-700">
                  Published by <span className='font-semibold'>{article.authors.join(', ')}</span> in <span className='font-semibold'>{article.journal || 'Unknown Journal'}</span>
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className='text-xs py-1'>Keywords:</span>
                  {article.keywords?.map((keyword, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticlesContainer;
