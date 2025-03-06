import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getMangaById, addToUserList } from '../services/jikanService';
import { 
  StarIcon, 
  CalendarIcon, 
  BookOpenIcon, 
  UserGroupIcon,
  BookmarkIcon,
  InformationCircleIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid';

const MangaDetails = () => {
  const { id } = useParams();
  const [manga, setManga] = useState(null);
  const [status, setStatus] = useState({ loading: true, error: null });
  const [showNotification, setShowNotification] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchMangaDetails = async () => {
      try {
        const mangaData = await getMangaById(id);
        setManga(mangaData);
        setStatus({ loading: false, error: null });
        // For debugging
        console.log('Manga data:', mangaData);
      } catch (error) {
        setStatus({ loading: false, error: "Error loading manga details." });
        console.error("Error fetching manga details:", error);
      }
    };

    // Check if user is logged in
    const userSession = localStorage.getItem('userSession');
    setIsLoggedIn(!!userSession);

    fetchMangaDetails();
  }, [id]);

  const handleAddToList = async () => {
    if (!manga) return;
    
    if (!isLoggedIn) {
      alert("Please log in to add this manga to your list");
      return;
    }

    try {
      await addToUserList(manga.mal_id, 'manga');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    } catch (error) {
      console.error('Error adding to list:', error);
      alert('Failed to add to your list. Please try again.');
    }
  };

  const renderStatBadge = (icon, value, label) => (
    <div className="flex flex-col items-center bg-white dark:bg-gray-800 rounded-lg p-3 shadow-md">
      <div className="text-purple-600 dark:text-purple-400 mb-1">
        {icon}
      </div>
      <div className="font-bold text-gray-900 dark:text-white text-lg">{value}</div>
      <div className="text-gray-500 dark:text-gray-400 text-xs">{label}</div>
    </div>
  );

  if (status.loading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center min-h-[70vh]">
        <div className="animate-pulse space-y-8 w-full max-w-4xl">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/3 h-96 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
            <div className="w-full md:w-2/3 space-y-4">
              <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded-lg w-3/4"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
              <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mt-6"></div>
            </div>
          </div>
          <div className="h-48 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (status.error) {
    return (
      <div className="container mx-auto p-4 text-center">
        <div className="bg-red-100 dark:bg-red-900 p-4 rounded-lg">
          <p className="text-red-700 dark:text-red-200 text-lg">{status.error}</p>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            Please try again later or check your connection.
          </p>
        </div>
      </div>
    );
  }

  if (!manga) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-gray-700 dark:text-gray-300 text-lg">Manga not found.</p>
      </div>
    );
  }

  // Format publishing date
  const formatPublishingDate = () => {
    if (!manga.published) return 'Unknown';
    if (manga.published.from) {
      const startDate = new Date(manga.published.from).getFullYear();
      const endDate = manga.published.to ? new Date(manga.published.to).getFullYear() : 'Present';
      return `${startDate} - ${endDate}`;
    }
    return 'Unknown';
  };

  return (
    <>
      {/* Background image with overlay */}
      <div 
        className="w-full h-64 md:h-96 absolute bg-cover bg-center opacity-20 dark:opacity-10 z-0"
        style={{
          backgroundImage: `url(${manga.images?.jpg?.large_image_url})`,
          filter: 'blur(8px)'
        }}
      ></div>
      
      {/* Main content */}
      <div className="container mx-auto p-4 relative z-10 pt-6 md:pt-12">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden mb-8">
          <div className="flex flex-col md:flex-row">
            {/* Left: Image */}
            <div className="w-full md:w-1/3 p-6">
              <img
                src={manga.images?.jpg?.large_image_url}
                alt={manga.title}
                className="w-full h-auto max-h-[500px] object-cover rounded-lg shadow-md mx-auto"
              />
              
              {/* Add to list button (mobile) */}
              <div className="mt-4 block md:hidden">
                <button
                  onClick={handleAddToList}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg flex justify-center items-center transition-colors duration-200"
                >
                  <BookmarkIcon className="h-5 w-5 mr-2" />
                  Add to My List
                </button>
              </div>
            </div>
            
            {/* Right: Details */}
            <div className="w-full md:w-2/3 p-6">
              <div className="flex flex-wrap items-center mb-4">
                {manga.score && (
                  <div className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-3 py-1 rounded-md flex items-center mr-3 mb-2">
                    <StarIconSolid className="h-5 w-5 mr-1 text-yellow-500" />
                    <span className="font-bold">{manga.score}</span>
                  </div>
                )}
                {manga.status && (
                  <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-md mb-2 text-sm">
                    {manga.status}
                  </div>
                )}
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {manga.title}
              </h1>
              
              {manga.title_japanese && (
                <p className="text-gray-600 dark:text-gray-400 mb-4 text-lg">
                  {manga.title_japanese}
                </p>
              )}
              
              {/* Stats row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-6">
                {renderStatBadge(
                  <DocumentTextIcon className="h-6 w-6" />,
                  manga.chapters || "?",
                  "Chapters"
                )}
                {renderStatBadge(
                  <BookOpenIcon className="h-6 w-6" />,
                  manga.volumes || "?",
                  "Volumes"
                )}
                {renderStatBadge(
                  <CalendarIcon className="h-6 w-6" />,
                  formatPublishingDate(),
                  "Published"
                )}
                {renderStatBadge(
                  <UserGroupIcon className="h-6 w-6" />,
                  manga.popularity?.toLocaleString() || "?",
                  "Popularity"
                )}
              </div>
              
              {/* Genres */}
              {manga.genres && manga.genres.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-gray-700 dark:text-gray-300 text-sm mb-2">Genres</h3>
                  <div className="flex flex-wrap gap-2">
                    {manga.genres.map(genre => (
                      <span 
                        key={genre.mal_id}
                        className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full text-sm"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Add to list button (desktop) */}
              <div className="mt-6 hidden md:block">
                <button
                  onClick={handleAddToList}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center transition-colors duration-200"
                >
                  <BookmarkIcon className="h-5 w-5 mr-2" />
                  Add to My List
                </button>
              </div>
            </div>
          </div>
          
          {/* Synopsis */}
          {manga.synopsis && (
            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <InformationCircleIcon className="h-6 w-6 mr-2 text-purple-600 dark:text-purple-400" />
                Synopsis
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {manga.synopsis}
              </p>
            </div>
          )}
          
          {/* Additional information */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column */}
            <div>
              {/* Authors */}
              {manga.authors && manga.authors.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-gray-900 dark:text-white font-semibold mb-2">Authors</h3>
                  <div className="text-gray-700 dark:text-gray-300">
                    {manga.authors.map(author => author.name).join(', ')}
                  </div>
                </div>
              )}
              
              {/* Serialization */}
              {manga.serializations && manga.serializations.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-gray-900 dark:text-white font-semibold mb-2">Serialization</h3>
                  <div className="text-gray-700 dark:text-gray-300">
                    {manga.serializations.map(serial => serial.name).join(', ')}
                  </div>
                </div>
              )}
              
              {/* Type */}
              {manga.type && (
                <div className="mb-4">
                  <h3 className="text-gray-900 dark:text-white font-semibold mb-2">Type</h3>
                  <div className="text-gray-700 dark:text-gray-300">
                    {manga.type}
                  </div>
                </div>
              )}
            </div>
            
            {/* Right column */}
            <div>
              {/* Themes */}
              {manga.themes && manga.themes.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-gray-900 dark:text-white font-semibold mb-2">Themes</h3>
                  <div className="text-gray-700 dark:text-gray-300">
                    {manga.themes.map(theme => theme.name).join(', ')}
                  </div>
                </div>
              )}
              
              {/* Demographics */}
              {manga.demographics && manga.demographics.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-gray-900 dark:text-white font-semibold mb-2">Demographics</h3>
                  <div className="text-gray-700 dark:text-gray-300">
                    {manga.demographics.map(demo => demo.name).join(', ')}
                  </div>
                </div>
              )}
              
              {/* Score by Users */}
              {manga.scored_by && (
                <div className="mb-4">
                  <h3 className="text-gray-900 dark:text-white font-semibold mb-2">Scored By</h3>
                  <div className="text-gray-700 dark:text-gray-300">
                    {manga.scored_by.toLocaleString()} users
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Success notification */}
      {showNotification && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center z-50 animate-fade-in-up">
          <BookmarkIconSolid className="h-5 w-5 mr-2" />
          <span>Added to your list!</span>
        </div>
      )}
    </>
  );
};

export default MangaDetails;

