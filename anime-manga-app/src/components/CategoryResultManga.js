import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMangaByGenre, getMangaGenres } from '../services/jikanService';

const CategoryResultManga = () => {
  const { genreId } = useParams();
  const [mangaList, setMangaList] = useState([]);
  const [genreName, setGenreName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGenreName = async () => {
      try {
        const genres = await getMangaGenres();
        const genre = genres.find(g => g.mal_id === parseInt(genreId));
        if (genre) {
          setGenreName(genre.name);
        }
      } catch (error) {
        console.error("Error fetching genre name:", error);
      }
    };

    const fetchMangaByGenre = async () => {
      setLoading(true);
      try {
        const mangas = await getMangaByGenre(genreId);
        setMangaList(mangas);
      } catch (error) {
        console.error("Error fetching manga by genre:", error);
        setError("Failed to load manga. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchGenreName();
    fetchMangaByGenre();
  }, [genreId]);

  if (loading) {
    return (
      <div className="container mx-auto p-8 text-center">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-8 text-center">
        <div className="bg-red-500 text-white p-4 rounded-lg shadow">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="bg-gradient-to-r from-purple-900 to-pink-800 rounded-xl shadow-xl p-6 md:p-8 mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
          {genreName ? `${genreName} Manga` : 'Genre Results'}
        </h2>
        <p className="text-purple-200">
          {mangaList.length} {mangaList.length === 1 ? 'manga' : 'mangas'} found
        </p>
      </div>

      {mangaList.length === 0 ? (
        <div className="text-center py-12 bg-gray-800 rounded-xl shadow-xl">
          <svg className="mx-auto h-20 w-20 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <p className="mt-4 text-xl text-gray-300">No manga found in this category</p>
          <Link to="/mangasearch" className="mt-6 inline-block bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition">
            Browse all manga
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mangaList.map((manga) => (
            <Link to={`/manga/${manga.mal_id}`} key={manga.mal_id} className="group">
              <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl h-full flex flex-col">
                <div className="relative h-80 overflow-hidden">
                  <img 
                    src={manga.images.jpg.image_url} 
                    alt={manga.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
                  <div className="absolute bottom-0 left-0 p-4 w-full">
                    <div className="flex items-center justify-between">
                      <div className="px-2 py-1 bg-purple-600 text-xs font-bold text-white rounded">
                        {manga.type || "Manga"}
                      </div>
                      {manga.score && (
                        <div className="flex items-center space-x-1 bg-black bg-opacity-70 px-2 py-1 rounded">
                          <svg className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-white text-xs font-semibold">{manga.score}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="p-4 flex-grow flex flex-col">
                  <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{manga.title}</h3>
                  {manga.published && manga.published.from && (
                    <p className="text-gray-400 text-sm">{new Date(manga.published.from).getFullYear() || "N/A"}</p>
                  )}
                  <div className="mt-auto pt-3">
                    <button className="w-full bg-gray-700 hover:bg-purple-600 text-white py-2 px-4 rounded-lg transition duration-300">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryResultManga;
