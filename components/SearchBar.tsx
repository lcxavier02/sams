import { FaSearch } from "react-icons/fa";
import { useState } from "react";

interface SearchBarProps {
  onSearch: (term: string, searchBy: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBy, setSearchBy] = useState('title');

  const handleSearchClick = () => {
    onSearch(searchTerm, searchBy);
  };

  return (
    <div className="flex items-center space-x-2">
      {/* Input del buscador */}
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search articles..."
        className="p-2 border border-gray-300 rounded-lg w-80"
      />

      {/* Dropdown para cambiar entre título y DOI */}
      <select
        value={searchBy}
        onChange={(e) => setSearchBy(e.target.value)}
        className="p-2 border border-gray-300 rounded-lg"
      >
        <option value="title">Title</option>
        <option value="doi">DOI</option>
      </select>

      {/* Botón con icono de búsqueda */}
      <button
        onClick={handleSearchClick}
        className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        <FaSearch />
      </button>
    </div>
  );
};

export default SearchBar;
