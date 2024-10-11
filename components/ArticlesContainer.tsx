import React from 'react';
import { useRouter } from 'next/router';
import { ArticlePayload } from '@/types';

interface ArticlesContainerProps {
  searchResults: ArticlePayload[];
}

/**
 * ArticlesContainer component displays a list of articles based on search results.
 *
 * @component
 * @example
 * // Example usage:
 * const searchResults = [
 *   {
 *     _id: 'article-id-1',
 *     title: 'Understanding Quantum Mechanics',
 *     authors: ['John Doe', 'Jane Smith'],
 *     journal: 'Physics Today',
 *     keywords: ['physics', 'quantum'],
 *   },
 *   {
 *     _id: 'article-id-2',
 *     title: 'Introduction to Machine Learning',
 *     authors: ['Alice', 'Bob'],
 *     journal: 'AI Journal',
 *     keywords: ['machine learning', 'AI'],
 *   }
 * ];
 *
 * <ArticlesContainer searchResults={searchResults} />
 *
 * @param {ArticlesContainerProps} props - The props for the component.
 * @returns {React.FC} A functional component that displays a list of articles.
 */
const ArticlesContainer: React.FC<ArticlesContainerProps> = ({ searchResults }) => {
  const router = useRouter();

  /**
   * Handles clicking on an article, navigating to the edit page for that article.
   *
   * @param {string} _id - The ID of the article to navigate to for editing.
   */
  const handleArticleClick = (_id: string) => {
    router.push(`/articles/edit/${_id}`);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Articles</h2>
      <div className="border border-gray-300 rounded-lg p-4">
        {searchResults.length === 0 ? (
          <p>No articles found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchResults.map((article) => (
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
