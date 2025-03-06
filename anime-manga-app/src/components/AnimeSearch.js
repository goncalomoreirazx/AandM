import React, { useEffect, useState } from 'react';
import { getGenres, searchAnime, getAnimeByGenre } from '../services/jikanService';
import { Link } from 'react-router-dom';
import { SearchIcon } from '@heroicons/react/outline';

const AnimeSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Function to search for anime by name
  const handleSearch = async () => {
    if (query) {
      setLoading(true);
      try {
        const animes = await searchAnime(query);
        setResults(animes);
        setSelectedGenre(null);
      } catch (error) {
        console.error("Error searching anime:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle Enter key press for search
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Function to handle genre selection and fetch anime by genre
  const handleGenreSelect = async (genreId) => {
    setLoading(true);
    try {
      setSelectedGenre(genreId);
      const animes = await getAnimeByGenre(genreId);
      setResults(animes);
      setQuery('');
    } catch (error) {
      console.error("Error fetching anime by genre:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch genres from the API when the component mounts
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genreList = await getGenres();
        setGenres(genreList);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };
    fetchGenres();
  }, []);

  return (
    <div className="container mx-auto p-4 md:p-6 min-h-screen">
      {/* Search Bar Section */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-800 rounded-xl shadow-xl p-6 md:p-8 mb-8">
        <h2 className="text-3xl font-bold text-white mb-4 text-center md:text-left">Search Anime</h2>
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative w-full">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter anime name..."
              className="p-4 pl-12 rounded-lg w-full bg-white bg-opacity-20 backdrop-blur-sm text-white placeholder-gray-300 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 focus:border-transparent transition"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <button
            onClick={handleSearch}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 w-full md:w-auto flex justify-center items-center"
          >
            Search
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Column: Genres */}
        <div className="w-full md:w-1/4 bg-gray-800 rounded-xl shadow-xl p-6 h-fit">
          <h2 className="text-2xl font-bold text-white mb-4">Filter by Genre</h2>
          <div className="grid grid-cols-2 gap-2">
            {genres.map((genre) => (
              <button
                key={genre.mal_id}
                onClick={() => handleGenreSelect(genre.mal_id)}
                className={`text-sm p-2 rounded-lg transition-all duration-300 
                  ${selectedGenre === genre.mal_id 
                    ? 'bg-indigo-600 text-white font-semibold shadow-lg' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              >
                {genre.name}
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Anime Search Results */}
        <div className="flex-1 bg-gray-800 rounded-xl shadow-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-6">
            {selectedGenre ? "Genre Results" : "Search Results"}
          </h2>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center text-gray-400 py-12">
              <svg className="mx-auto h-16 w-16 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <p className="mt-4 text-lg">No results found. Try a different search or genre.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              {results.map((anime) => (
                <Link to={`/anime/${anime.mal_id}`} key={anime.mal_id} className="group">
                  <div className="relative bg-gray-900 rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl h-full flex flex-col">
                    <div className="relative h-80 overflow-hidden">
                      <img 
                        src={anime.images.jpg.image_url} 
                        alt={anime.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
                      <div className="absolute bottom-0 left-0 p-4 w-full">
                        <div className="flex items-center justify-between">
                          <div className="px-2 py-1 bg-indigo-600 text-xs font-bold text-white rounded">
                            {anime.type || "TV"}
                          </div>
                          {anime.score && (
                            <div className="flex items-center space-x-1 bg-black bg-opacity-70 px-2 py-1 rounded">
                              <svg className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              <span className="text-white text-xs font-semibold">{anime.score}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="p-4 flex-grow flex flex-col">
                      <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{anime.title}</h3>
                      {anime.aired && (
                        <p className="text-gray-400 text-sm mb-2">{new Date(anime.aired.from).getFullYear() || "N/A"}</p>
                      )}
                      <div className="mt-auto flex flex-wrap gap-1">
                        {anime.genres && anime.genres.slice(0, 3).map(genre => (
                          <span key={genre.mal_id} className="inline-block bg-gray-700 text-gray-300 px-2 py-1 text-xs rounded">
                            {genre.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnimeSearch;