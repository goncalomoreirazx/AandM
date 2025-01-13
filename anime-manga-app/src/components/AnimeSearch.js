import React, { useEffect, useState } from 'react';
import { getGenres, searchAnime, getAnimeByGenre } from '../services/jikanService';
import { Link } from 'react-router-dom';

const AnimeSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [genres, setGenres] = useState([]);
  
  // Function to search for anime by name
  const handleSearch = async () => {
    if (query) {
      const animes = await searchAnime(query);
      setResults(animes);
    }
  };

  // Function to handle genre selection and fetch anime by genre
  const handleGenreSelect = async (genreId) => {
    const animes = await getAnimeByGenre(genreId);  // Fetch anime by genre
    setResults(animes);  // Set results to the genre-based search results
  };

  // Fetch genres from the API when the component mounts
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genreList = await getGenres();
        setGenres(genreList);
      } catch (error) {
        console.error("Erro ao buscar gêneros:", error);
      }
    };
    fetchGenres();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-4">Buscar Animes</h2>
        <div className="flex mb-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Digite o nome do anime..."
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

      <div className="flex mt-8">
        {/* Left Column: Genres */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-1/4 mr-8">
          <h2 className="text-2xl font-bold text-white mb-4">Filtrar por Gênero</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {genres.map((genre) => (
              <button
                key={genre.mal_id}
                onClick={() => handleGenreSelect(genre.mal_id)}
                className="bg-gray-700 text-white p-2 rounded hover:bg-gray-600"
              >
                {genre.name}
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Anime Search Results */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex-1">
          <h2 className="text-2xl font-bold text-white mb-4">Resultados da Busca</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((anime) => (
              <div key={anime.mal_id} className="bg-white p-4 rounded-lg shadow-md">
                <Link to={`/anime/${anime.mal_id}`}>
                  <img src={anime.images.jpg.image_url} alt={anime.title} className="w-full h-96 object-cover mb-4 rounded" />
                  <h3 className="text-xl font-bold mb-2 text-center">{anime.title}</h3>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimeSearch;
