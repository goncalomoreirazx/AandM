import React, { useEffect, useState } from 'react';  
import { getMangaGenres, searchManga, getMangaByGenre } from '../services/jikanService';
import { Link, useNavigate } from 'react-router-dom';

const MangaSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);  // Added state for selected genre
  const navigate = useNavigate();

  // Fetch mangas based on search query
  const handleSearch = async () => {
    if (query) {
      const mangas = await searchManga(query);  // Function to search mangas by name
      setResults(mangas);
      setSelectedGenre(null);  // Clear genre filter when searching
    }
  };

  // Handle genre selection
  const handleGenreSelect = async (genreId) => {
    setSelectedGenre(genreId);  // Update selected genre
    const mangas = await getMangaByGenre(genreId);  // Fetch mangas by genre
    setResults(mangas);
    setQuery('');  // Clear search query when selecting genre
  };

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genreList = await getMangaGenres();
        setGenres(genreList);
      } catch (error) {
        console.error("Erro ao buscar gêneros de mangas:", error);
      }
    };
    fetchGenres();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-4">Buscar Mangas</h2>
        <div className="flex mb-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Digite o nome do manga..."
            className="p-2 rounded-l w-full bg-gray-200"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white p-2 rounded-r hover:bg-blue-600"
          >
            Buscar
          </button>
        </div>
      </div>

      <div className="flex mt-8 space-x-8">
        {/* Left Column: Genres */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-1/3">
          <h2 className="text-2xl font-bold text-white mb-4">Filtrar por Gênero</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {genres.map((genre) => (
              <button
                key={genre.mal_id}
                onClick={() => handleGenreSelect(genre.mal_id)}
                className={`bg-gray-700 text-white p-2 rounded hover:bg-gray-600 ${
                  selectedGenre === genre.mal_id ? 'bg-blue-500' : ''
                }`}
              >
                {genre.name}
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Manga Search Results or Genre Results */}
        <div className="flex-1 bg-gray-800 p-6 rounded-lg shadow-lg w-2/3">
          <h2 className="text-2xl font-bold text-white mb-4">
            {selectedGenre ? `Mangas do Gênero` : 'Resultados da Busca'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.length === 0 ? (
              <p className="text-white">Nenhum resultado encontrado.</p>
            ) : (
              results.map((manga) => (
                <div key={manga.mal_id} className="bg-white p-4 rounded-lg shadow-md">
                  <Link to={`/manga/${manga.mal_id}`}>
                    <img
                      src={manga.images.jpg.image_url}
                      alt={manga.title}
                      className="w-full h-96 object-cover mb-4 rounded"
                    />
                    <h3 className="text-xl font-bold mb-2">{manga.title}</h3>
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MangaSearch;
