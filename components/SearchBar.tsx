import { FaSearch } from "react-icons/fa";
import { useState, useEffect } from "react";

interface SearchBarProps {
  onSearch: (term: string, searchBy: string) => void;
}

/**
 * SearchBar component that allows users to search articles by title or DOI.
 * Includes a debounced input field, a select dropdown to choose the search type, and a search button.
 * 
 * @component
 * @example
 * return (
 *   <SearchBar onSearch={handleSearch} />
 * )
 * 
 * @param {Object} props - Component properties
 * @param {Function} props.onSearch - Callback function to perform the search, triggered after a debounce delay or when clicking the search button.
 * 
 * @returns {JSX.Element} The SearchBar component with input, select, and search button
 */
const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBy, setSearchBy] = useState('title');
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);

  // Reset the search term and search type when the component loads or reloads
  useEffect(() => {
    setSearchTerm('');
    setSearchBy('title');
  }, []);

  /**
   * Handles the input change and starts a debounce timeout.
   * The search will be performed 1 second after the user stops typing.
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event
   */
  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);

    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const timeout = setTimeout(() => {
      onSearch(e.target.value, searchBy);
    }, 1000);

    setDebounceTimeout(timeout);
  };

  return (
    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchTermChange}
        placeholder="Search articles..."
        className="p-2 w-full outline-none"
      />

      <select
        value={searchBy}
        onChange={(e) => setSearchBy(e.target.value)}
        className="p-2 px-4 bg-white border-l border-gray-300 outline-none"
      >
        <option value="title">Title</option>
        <option value="doi">DOI</option>
      </select>

      <button
        onClick={() => onSearch(searchTerm, searchBy)}
        className="p-3 bg-blue-500 text-white flex items-center justify-center"
      >
        <FaSearch />
      </button>
    </div>
  );
};

export default SearchBar;
