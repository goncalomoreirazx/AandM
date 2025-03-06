import React, { useState, useEffect } from 'react';
import { getUserList, removeAnimeFromList, removeMangaFromList, updateItemStatus } from '../services/jikanService';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { StarIcon, TrashIcon, EyeIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { ChevronRightIcon, ChevronDownIcon } from '@heroicons/react/24/solid';

// Add rate limiting helper
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const MyList = () => {
  const [userData, setUserData] = useState(null);
  const [animeList, setAnimeList] = useState([]);
  const [mangaList, setMangaList] = useState([]);
  const [activeTab, setActiveTab] = useState('animes');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deletingItemId, setDeletingItemId] = useState(null);
  const [emptyMessage, setEmptyMessage] = useState("");
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [statusUpdateSuccess, setStatusUpdateSuccess] = useState(false);

  // Status options for dropdown
  const statusOptions = [
    { value: 'plan_to_watch', label: 'Plan to Watch', icon: <ClockIcon className="h-4 w-4" /> },
    { value: 'watching', label: 'Watching', icon: <EyeIcon className="h-4 w-4" /> },
    { value: 'completed', label: 'Completed', icon: <CheckCircleIcon className="h-4 w-4" /> },
    { value: 'on_hold', label: 'On Hold', icon: <ClockIcon className="h-4 w-4" /> },
    { value: 'dropped', label: 'Dropped', icon: <TrashIcon className="h-4 w-4" /> }
  ];

  // Get readable status names
  const getStatusLabel = (status) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option ? option.label : 'Plan to Watch';
  };

  // Get icon for status
  const getStatusIcon = (status) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option ? option.icon : <ClockIcon className="h-4 w-4" />;
  };

  useEffect(() => {
    // Get user data from localStorage
    const userSession = localStorage.getItem('userSession');
    if (userSession) {
      try {
        const parsedData = JSON.parse(userSession);
        setUserData(parsedData);
      } catch (error) {
        console.error("Error parsing user session:", error);
        setError("Error loading user data. Please log in again.");
      }
    } else {
      setError("User not logged in. Please log in to view your list.");
    }
  }, []);

  useEffect(() => {
    if (userData) {
      fetchUserList(userData.id, 'anime');
      fetchUserList(userData.id, 'manga');
    }
  }, [userData]);

  // Added rate-limiting to prevent 429 errors
  const fetchAnimeDetails = async (externalId) => {
    try {
      // Add a small delay between requests to avoid rate limiting
      await delay(300);
      const response = await axios.get(`https://api.jikan.moe/v4/anime/${externalId}`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 410) {
        console.warn(`Anime with ID ${externalId} not found.`);
        return null;
      } else if (error.response && error.response.status === 429) {
        // Retry with a longer delay for rate limiting
        console.warn("Rate limit hit, waiting and retrying...");
        await delay(1000);
        try {
          const response = await axios.get(`https://api.jikan.moe/v4/anime/${externalId}`);
          return response.data;
        } catch (retryError) {
          console.error('Error fetching anime details after retry:', retryError);
          return null;
        }
      }
      console.error('Error fetching anime details:', error);
      return null;
    }
  };

  // Added rate-limiting to prevent 429 errors
  const fetchMangaDetails = async (externalId) => {
    try {
      // Add a small delay between requests to avoid rate limiting
      await delay(300);
      const response = await axios.get(`https://api.jikan.moe/v4/manga/${externalId}`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 410) {
        console.warn(`Manga with ID ${externalId} not found.`);
        return null;
      } else if (error.response && error.response.status === 429) {
        // Retry with a longer delay for rate limiting
        console.warn("Rate limit hit, waiting and retrying...");
        await delay(1000);
        try {
          const response = await axios.get(`https://api.jikan.moe/v4/manga/${externalId}`);
          return response.data;
        } catch (retryError) {
          console.error('Error fetching manga details after retry:', retryError);
          return null;
        }
      }
      console.error('Error fetching manga details:', error);
      return null;
    }
  };

  const fetchUserList = async (userId, contentType) => {
    setLoading(true);
    try {
      const response = await getUserList(userId, contentType);
      
      if (contentType === 'anime') {
        // Process items in batches to avoid rate limits
        const animeDetails = [];
        // Process 3 items at a time
        for (let i = 0; i < response.length; i += 3) {
          const batch = response.slice(i, i + 3);
          const batchDetails = await Promise.all(
            batch.map(async (item) => {
              const details = await fetchAnimeDetails(item.external_id);
              if (details) {
                // Attach database item data to API response
                details.listData = item;
              }
              return details;
            })
          );
          animeDetails.push(...batchDetails.filter(detail => detail !== null));
          // Add a delay between batches
          if (i + 3 < response.length) await delay(1000);
        }
        
        setAnimeList(animeDetails);
        
        if (animeDetails.length === 0 && activeTab === 'animes') {
          setEmptyMessage("You don't have any anime in your list yet.");
        }
      } else if (contentType === 'manga') {
        // Process items in batches to avoid rate limits
        const mangaDetails = [];
        // Process 3 items at a time
        for (let i = 0; i < response.length; i += 3) {
          const batch = response.slice(i, i + 3);
          const batchDetails = await Promise.all(
            batch.map(async (item) => {
              const details = await fetchMangaDetails(item.external_id);
              if (details) {
                // Attach database item data to API response
                details.listData = item;
              }
              return details;
            })
          );
          mangaDetails.push(...batchDetails.filter(detail => detail !== null));
          // Add a delay between batches
          if (i + 3 < response.length) await delay(1000);
        }
        
        setMangaList(mangaDetails);
        
        if (mangaDetails.length === 0 && activeTab === 'mangas') {
          setEmptyMessage("You don't have any manga in your list yet.");
        }
      }
    } catch (error) {
      console.error('Error fetching user list:', error);
      setError('Failed to load your list. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDeleteModal = (item, type) => {
    setItemToDelete({ item, type });
    setConfirmDelete(true);
  };

  const handleRemoveItem = async () => {
    if (!itemToDelete || !userData) return;
    
    const { item, type } = itemToDelete;
    const externalId = item.data.mal_id;
    setDeletingItemId(externalId);
    
    try {
      if (type === 'anime') {
        await removeAnimeFromList(userData.id, externalId);
        setAnimeList(animeList.filter(anime => anime.data.mal_id !== externalId));
      } else {
        await removeMangaFromList(userData.id, externalId);
        setMangaList(mangaList.filter(manga => manga.data.mal_id !== externalId));
      }
    } catch (error) {
      console.error(`Error removing ${type}:`, error);
      setError(`Failed to remove ${type} from your list.`);
    } finally {
      setDeletingItemId(null);
      closeModal();
    }
  };

  const handleStatusUpdate = async (item, status, contentType) => {
    if (!userData) return;
    
    const externalId = item.data.mal_id;
    setUpdatingStatus(externalId);
    
    try {
      await updateItemStatus(userData.id, externalId, contentType, status);
      
      // Update local state based on content type
      if (contentType === 'anime') {
        setAnimeList(animeList.map(anime => {
          if (anime.data.mal_id === externalId) {
            // Create a deep copy and update status
            const updated = { ...anime };
            updated.listData = { ...updated.listData, status };
            return updated;
          }
          return anime;
        }));
      } else {
        setMangaList(mangaList.map(manga => {
          if (manga.data.mal_id === externalId) {
            // Create a deep copy and update status
            const updated = { ...manga };
            updated.listData = { ...updated.listData, status };
            return updated;
          }
          return manga;
        }));
      }
      
      // Show success message briefly
      setStatusUpdateSuccess(true);
      setTimeout(() => setStatusUpdateSuccess(false), 2000);
    } catch (error) {
      console.error(`Error updating ${contentType} status:`, error);
      setError(`Failed to update status.`);
    } finally {
      setUpdatingStatus(null);
      setStatusDropdownOpen(null);
    }
  };

  const closeModal = () => {
    setConfirmDelete(false);
    setItemToDelete(null);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'animes' && animeList.length === 0) {
      setEmptyMessage("You don't have any anime in your list yet.");
    } else if (tab === 'mangas' && mangaList.length === 0) {
      setEmptyMessage("You don't have any manga in your list yet.");
    } else {
      setEmptyMessage("");
    }
  };

  const toggleStatusDropdown = (id) => {
    setStatusDropdownOpen(statusDropdownOpen === id ? null : id);
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (loading && !animeList.length && !mangaList.length) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="bg-gradient-to-r from-purple-700 via-indigo-800 to-indigo-900 rounded-xl shadow-xl p-6 md:p-8 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">My List</h1>
        <p className="text-indigo-200">Keep track of your favorite anime and manga</p>
      </div>
      
      {/* Status update success message */}
      {statusUpdateSuccess && (
        <div className="fixed top-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md z-50 animate-fade-in">
          <div className="flex items-center">
            <CheckCircleIcon className="h-5 w-5 mr-2" />
            <p>Status updated successfully!</p>
          </div>
        </div>
      )}
      
      {/* Tabs */}
      <div className="flex justify-center space-x-2 mb-8">
        <button
          onClick={() => handleTabChange('animes')}
          className={`px-6 py-3 rounded-lg font-medium text-lg transition-colors ${
            activeTab === 'animes'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          Anime
        </button>
        <button
          onClick={() => handleTabChange('mangas')}
          className={`px-6 py-3 rounded-lg font-medium text-lg transition-colors ${
            activeTab === 'mangas'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          Manga
        </button>
      </div>

      {/* Empty state */}
      {((activeTab === 'animes' && animeList.length === 0) || 
        (activeTab === 'mangas' && mangaList.length === 0)) && !loading && (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <div className="mx-auto h-20 w-20 text-gray-400">
            {activeTab === 'animes' ? (
              <EyeIcon className="h-full w-full" />
            ) : (
              <ClockIcon className="h-full w-full" />
            )}
          </div>
          <h3 className="mt-4 text-xl font-medium text-gray-900 dark:text-white">
            {emptyMessage}
          </h3>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            {activeTab === 'animes' 
              ? "Start by adding anime from the 'Top Anime' or 'Search Anime' pages."
              : "Start by adding manga from the 'Top Manga' or 'Search Manga' pages."
            }
          </p>
          <div className="mt-6">
            <Link
              to={activeTab === 'animes' ? '/topanimes' : '/topmangas'}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Browse {activeTab === 'animes' ? 'Anime' : 'Manga'}
              <ChevronRightIcon className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Content */}
      {activeTab === 'animes' && animeList.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Anime
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell">
                    Episodes
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden sm:table-cell">
                    Score
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {animeList.map((anime) => (
                  <tr key={anime.data.mal_id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-16 w-12">
                          <img 
                            className="h-16 w-12 object-cover rounded" 
                            src={anime.data.images.jpg.image_url} 
                            alt={anime.data.title} 
                          />
                        </div>
                        <div className="ml-4">
                          <Link 
                            to={`/anime/${anime.data.mal_id}`}
                            className="text-md font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300"
                          >
                            {anime.data.title}
                          </Link>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {anime.data.aired && new Date(anime.data.aired.from).getFullYear()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
                        {anime.data.type || "TV"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">
                      {anime.data.episodes || "Ongoing"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="relative">
                        <button 
                          className={`inline-flex items-center justify-between px-3 py-1.5 rounded-md text-sm font-medium
                            ${statusDropdownOpen === anime.data.mal_id ? 'bg-indigo-100 dark:bg-indigo-900' : 'bg-gray-100 dark:bg-gray-700'}
                            text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-800 w-28`}
                          onClick={() => toggleStatusDropdown(anime.data.mal_id)}
                        >
                          <div className="flex items-center">
                            {getStatusIcon(anime.listData?.status || 'plan_to_watch')}
                            <span className="ml-2">{getStatusLabel(anime.listData?.status || 'plan_to_watch')}</span>
                          </div>
                          {statusDropdownOpen === anime.data.mal_id ? (
                            <ChevronDownIcon className="h-4 w-4 ml-1" />
                          ) : (
                            <ChevronRightIcon className="h-4 w-4 ml-1" />
                          )}
                        </button>
                        
                        {statusDropdownOpen === anime.data.mal_id && (
                          <div className="absolute top-full left-0 mt-1 w-40 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10">
                            {statusOptions.map((option) => (
                              <button
                                key={option.value}
                                className={`w-full text-left px-4 py-2 text-sm flex items-center hover:bg-indigo-50 dark:hover:bg-indigo-900 
                                  ${anime.listData?.status === option.value ? 'bg-indigo-50 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-medium' : 'text-gray-700 dark:text-gray-200'}`}
                                onClick={() => handleStatusUpdate(anime, option.value, 'anime')}
                                disabled={updatingStatus === anime.data.mal_id}
                              >
                                {option.icon}
                                <span className="ml-2">{option.label}</span>
                              </button>
                            ))}
                          </div>
                        )}
                        
                        {updatingStatus === anime.data.mal_id && (
                          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700 bg-opacity-75 dark:bg-opacity-75 rounded-md">
                            <div className="animate-spin h-4 w-4 border-2 border-indigo-500 rounded-full border-t-transparent"></div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center hidden sm:table-cell">
                      <div className="flex items-center justify-center">
                        <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                        <span className="text-gray-900 dark:text-gray-100">{anime.data.score || "N/A"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                      <button
                        onClick={() => handleOpenDeleteModal(anime, 'anime')}
                        disabled={deletingItemId === anime.data.mal_id}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                        aria-label="Remove from list"
                      >
                        {deletingItemId === anime.data.mal_id ? (
                          <svg className="animate-spin h-5 w-5 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <TrashIcon className="h-5 w-5 mx-auto" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'mangas' && mangaList.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Manga
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell">
                    Volumes
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden sm:table-cell">
                    Score
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {mangaList.map((manga) => (
                  <tr key={manga.data.mal_id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-16 w-12">
                          <img 
                            className="h-16 w-12 object-cover rounded" 
                            src={manga.data.images.jpg.image_url} 
                            alt={manga.data.title} 
                          />
                        </div>
                        <div className="ml-4">
                          <Link 
                            to={`/manga/${manga.data.mal_id}`}
                            className="text-md font-medium text-purple-600 dark:text-purple-400 hover:text-purple-900 dark:hover:text-purple-300"
                          >
                            {manga.data.title}
                          </Link>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {manga.data.published && manga.data.published.from && new Date(manga.data.published.from).getFullYear()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                        {manga.data.type || "Manga"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">
                      {manga.data.volumes || "Ongoing"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="relative">
                        <button 
                          className={`inline-flex items-center justify-between px-3 py-1.5 rounded-md text-sm font-medium
                            ${statusDropdownOpen === manga.data.mal_id ? 'bg-purple-100 dark:bg-purple-900' : 'bg-gray-100 dark:bg-gray-700'}
                            text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-purple-800 w-28`}
                          onClick={() => toggleStatusDropdown(manga.data.mal_id)}
                        >
                          <div className="flex items-center">
                            {getStatusIcon(manga.listData?.status || 'plan_to_watch')}
                            <span className="ml-2">{getStatusLabel(manga.listData?.status || 'plan_to_watch')}</span>
                          </div>
                          {statusDropdownOpen === manga.data.mal_id ? (
                            <ChevronDownIcon className="h-4 w-4 ml-1" />
                          ) : (
                            <ChevronRightIcon className="h-4 w-4 ml-1" />
                          )}
                        </button>
                        
                        {statusDropdownOpen === manga.data.mal_id && (
                          <div className="absolute top-full left-0 mt-1 w-40 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10">
                            {statusOptions.map((option) => (
                              <button
                                key={option.value}
                                className={`w-full text-left px-4 py-2 text-sm flex items-center hover:bg-purple-50 dark:hover:bg-purple-900 
                                  ${manga.listData?.status === option.value ? 'bg-purple-50 dark:bg-purple-900 text-purple-700 dark:text-purple-300 font-medium' : 'text-gray-700 dark:text-gray-200'}`}
                                onClick={() => handleStatusUpdate(manga, option.value, 'manga')}
                                disabled={updatingStatus === manga.data.mal_id}
                              >
                                {option.icon}
                                <span className="ml-2">{option.label}</span>
                              </button>
                            ))}
                          </div>
                        )}
                        
                        {updatingStatus === manga.data.mal_id && (
                          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700 bg-opacity-75 dark:bg-opacity-75 rounded-md">
                            <div className="animate-spin h-4 w-4 border-2 border-purple-500 rounded-full border-t-transparent"></div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center hidden sm:table-cell">
                      <div className="flex items-center justify-center">
                        <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                        <span className="text-gray-900 dark:text-gray-100">{manga.data.score || "N/A"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                      <button
                        onClick={() => handleOpenDeleteModal(manga, 'manga')}
                        disabled={deletingItemId === manga.data.mal_id}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                        aria-label="Remove from list"
                      >
                        {deletingItemId === manga.data.mal_id ? (
                          <svg className="animate-spin h-5 w-5 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <TrashIcon className="h-5 w-5 mx-auto" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && itemToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Confirm Removal
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to remove <span className="font-semibold">{itemToDelete.item.data.title}</span> from your list?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRemoveItem}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyList;