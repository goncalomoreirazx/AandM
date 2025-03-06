import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getAnimeById, addToUserList } from '../services/jikanService';
import Dialog from '../components/Dialog';
import { StarIcon, ClockIcon, FilmIcon, CalendarIcon, ChartBarIcon, TagIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { HeartIcon as HeartIconOutline } from '@heroicons/react/24/outline';

const AnimeDetails = () => {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [status, setStatus] = useState({ loading: true, error: null });
  const [showDialog, setShowDialog] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAddingToList, setIsAddingToList] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const userSession = localStorage.getItem('userSession');
    setIsLoggedIn(!!userSession);

    const fetchAnimeDetails = async () => {
      try {
        const animeData = await getAnimeById(id);
        setAnime(animeData);
        document.title = `${animeData.title} | Anime & Manga`;
        setStatus({ loading: false, error: null });
      } catch (error) {
        console.error("Error loading anime details:", error);
        setStatus({ loading: false, error: "Failed to load anime details. Please try again later." });
      }
    };

    fetchAnimeDetails();

    // Check if anime is in user's favorites
    // This would ideally be implemented with a real API check
    return () => {
      document.title = 'Anime & Manga';
    };
  }, [id]);

  const handleAddToList = async () => {
    if (!anime || !isLoggedIn) return;

    setIsAddingToList(true);
    try {
      await addToUserList(anime.mal_id, 'anime');
      setShowDialog(true);
      setTimeout(() => setShowDialog(false), 2000);
    } catch (error) {
      console.error('Error adding to list:', error);
      alert('Failed to add to your list. Please try again.');
    } finally {
      setIsAddingToList(false);
    }
  };

  const toggleFavorite = () => {
    if (!isLoggedIn) return;
    setIsFavorite(!isFavorite);
    // This would ideally update the user's favorites in the database
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (status.loading) {
    return (
      <div className="container mx-auto p-8 flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (status.error) {
    return (
      <div className="container mx-auto p-8">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md">
          <p>{status.error}</p>
        </div>
      </div>
    );
  }

  if (!anime) {
    return (
      <div className="container mx-auto p-8">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded shadow-md">
          <p>Anime not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 py-8">
      {/* Hero Section with Banner */}
      <div className="relative h-64 md:h-96 rounded-xl overflow-hidden mb-8">
        {/* Banner image or fallback gradient */}
        {anime.images?.jpg?.large_image_url ? (
          <div className="absolute inset-0">
            <img 
              src={anime.images.jpg.large_image_url} 
              alt={anime.title} 
              className="w-full h-full object-cover filter blur-sm"
            />
            <div className="absolute inset-0 bg-black bg-opacity-60"></div>
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 to-purple-800"></div>
        )}
        
        {/* Content overlay */}
        <div className="absolute inset-0 flex flex-col md:flex-row items-center justify-center md:justify-start md:items-end p-6 md:p-12">
          <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-8">
            <div className="relative w-40 h-56 md:w-48 md:h-72 rounded-lg overflow-hidden border-4 border-white shadow-xl">
              <img 
                src={anime.images?.jpg?.image_url || 'https://via.placeholder.com/350x500?text=No+Image'} 
                alt={anime.title} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="text-center md:text-left max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 md:mb-4">{anime.title}</h1>
            {anime.title_english && anime.title_english !== anime.title && (
              <h2 className="text-xl md:text-2xl text-gray-300 mb-2">{anime.title_english}</h2>
            )}
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mt-4">
              {anime.score && (
                <div className="flex items-center bg-yellow-500 bg-opacity-90 text-white px-3 py-1 rounded-full">
                  <StarIcon className="h-4 w-4 mr-1" />
                  <span className="font-bold">{anime.score}</span>
                </div>
              )}
              <div className="bg-indigo-600 bg-opacity-90 text-white px-3 py-1 rounded-full text-sm">
                {anime.type || "TV"}
              </div>
              <div className="bg-purple-600 bg-opacity-90 text-white px-3 py-1 rounded-full text-sm">
                {anime.status || "Unknown"}
              </div>
              {anime.rating && (
                <div className="bg-gray-700 bg-opacity-90 text-white px-3 py-1 rounded-full text-sm">
                  {anime.rating}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Actions */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleAddToList}
                disabled={isAddingToList || !isLoggedIn}
                className={`flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition-colors ${
                  isAddingToList || !isLoggedIn ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isAddingToList ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding...
                  </>
                ) : (
                  <>
                    <ClockIcon className="h-5 w-5 mr-2" />
                    Add to List
                  </>
                )}
              </button>
              
              <button
                onClick={toggleFavorite}
                disabled={!isLoggedIn}
                className={`flex items-center px-6 py-3 rounded-lg shadow transition-colors ${
                  isFavorite 
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                } ${!isLoggedIn ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isFavorite ? (
                  <HeartIconSolid className="h-5 w-5 mr-2" />
                ) : (
                  <HeartIconOutline className="h-5 w-5 mr-2" />
                )}
                {isFavorite ? 'Favorited' : 'Favorite'}
              </button>
              
              {!isLoggedIn && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Please log in to add this anime to your list or favorites.
                </p>
              )}
            </div>
          </div>

          {/* Synopsis */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Synopsis</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
              {anime.synopsis || "No synopsis available."}
            </p>
          </div>

          {/* Trailer */}
          {anime.trailer?.youtube_id && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Trailer</h2>
              <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                <iframe
                  src={`https://www.youtube.com/embed/${anime.trailer.youtube_id}`}
                  title={`${anime.title} Trailer`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>
          )}

          {/* Characters */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Characters</h2>
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-500 dark:text-indigo-300 mb-3">
                  <UserGroupIcon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Coming Soon</h3>
                <p className="mt-1 text-gray-500 dark:text-gray-400">
                  Character information will be available soon.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Info */}
        <div className="space-y-8">
          {/* Information */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Information</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <FilmIcon className="h-5 w-5 mt-0.5 text-indigo-500 dark:text-indigo-400 flex-shrink-0" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Episodes</h3>
                  <p className="mt-1 text-gray-900 dark:text-white">{anime.episodes || "Unknown"}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <CalendarIcon className="h-5 w-5 mt-0.5 text-indigo-500 dark:text-indigo-400 flex-shrink-0" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Aired</h3>
                  <p className="mt-1 text-gray-900 dark:text-white">
                    {anime.aired?.from ? (
                      <>
                        {formatDate(anime.aired.from)}
                        {anime.aired.to && ` to ${formatDate(anime.aired.to)}`}
                      </>
                    ) : (
                      "Unknown"
                    )}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <ChartBarIcon className="h-5 w-5 mt-0.5 text-indigo-500 dark:text-indigo-400 flex-shrink-0" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Popularity</h3>
                  <p className="mt-1 text-gray-900 dark:text-white">#{anime.popularity || "N/A"}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <StarIcon className="h-5 w-5 mt-0.5 text-indigo-500 dark:text-indigo-400 flex-shrink-0" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Rank</h3>
                  <p className="mt-1 text-gray-900 dark:text-white">#{anime.rank || "N/A"}</p>
                </div>
              </div>
              
              {anime.studios && anime.studios.length > 0 && (
                <div className="flex items-start">
                  <TagIcon className="h-5 w-5 mt-0.5 text-indigo-500 dark:text-indigo-400 flex-shrink-0" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Studios</h3>
                    <p className="mt-1 text-gray-900 dark:text-white">
                      {anime.studios.map(studio => studio.name).join(', ')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Genres */}
          {anime.genres && anime.genres.length > 0 && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Genres</h2>
              <div className="flex flex-wrap gap-2">
                {anime.genres.map(genre => (
                  <span 
                    key={genre.mal_id} 
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Alternative Titles */}
          {(anime.title_english || anime.title_japanese || (anime.titles && anime.titles.length > 0)) && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Alternative Titles</h2>
              <div className="space-y-3">
                {anime.title_english && anime.title_english !== anime.title && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">English</h3>
                    <p className="mt-1 text-gray-900 dark:text-white">{anime.title_english}</p>
                  </div>
                )}
                
                {anime.title_japanese && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Japanese</h3>
                    <p className="mt-1 text-gray-900 dark:text-white">{anime.title_japanese}</p>
                  </div>
                )}
                
                {anime.titles && anime.titles.length > 0 && anime.titles.map((title, index) => {
                  // Skip main, English, and Japanese titles which are already shown
                  if (title.type === 'Default' || title.type === 'English' || title.type === 'Japanese') {
                    return null;
                  }
                  
                  return (
                    <div key={index}>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title.type}</h3>
                      <p className="mt-1 text-gray-900 dark:text-white">{title.title}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Success Dialog */}
      {showDialog && <Dialog onClose={() => setShowDialog(false)} message="Anime added to your list successfully!" />}
    </div>
  );
};

export default AnimeDetails;