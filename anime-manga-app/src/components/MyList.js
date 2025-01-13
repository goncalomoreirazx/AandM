import React, { useState, useEffect } from 'react';
import { getUserList, removeAnimeFromList, removeMangaFromList } from '../services/jikanService';
import axios from 'axios';

const MyList = () => {
  const [userData, setUserData] = useState(null);
  const [animeList, setAnimeList] = useState([]);
  const [mangaList, setMangaList] = useState([]);
  const [activeTab, setActiveTab] = useState('animes');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [animeToDelete, setAnimeToDelete] = useState(null);
  const [mangaToDelete, setMangaToDelete] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userSession = localStorage.getItem('userSession');
    if (userSession) {
      try {
        const parsedData = JSON.parse(userSession);
        setUserData(parsedData);
      } catch (error) {
        console.error("Error parsing user session:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (userData) {
      fetchUserList(userData.id, 'anime');
      fetchUserList(userData.id, 'manga');
    }
  }, [userData]);

  const fetchAnimeDetails = async (externalId) => {
    try {
      const response = await axios.get(`https://api.jikan.moe/v4/anime/${externalId}`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 410) {
        console.warn(`Anime with ID ${externalId} not found.`);
        return null;
      }
      console.error('Error fetching anime details:', error);
      throw error;
    }
  };

  const fetchMangaDetails = async (externalId) => {
    try {
      const response = await axios.get(`https://api.jikan.moe/v4/manga/${externalId}`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 410) {
        console.warn(`Manga with ID ${externalId} not found.`);
        return null;
      }
      console.error('Error fetching manga details:', error);
      throw error;
    }
  };

  const fetchUserList = async (userId, contentType) => {
    setLoading(true);
    try {
      const response = await getUserList(userId, contentType);
      if (contentType === 'anime') {
        const animeDetailsPromises = response.map((item) => fetchAnimeDetails(item.external_id));
        const animeDetails = await Promise.all(animeDetailsPromises);
        setAnimeList(animeDetails.filter((detail) => detail !== null));
      } else if (contentType === 'manga') {
        const mangaDetailsPromises = response.map((item) => fetchMangaDetails(item.external_id));
        const mangaDetails = await Promise.all(mangaDetailsPromises);
        setMangaList(mangaDetails.filter((detail) => detail !== null));
      }
    } catch (error) {
      console.error('Error fetching user list:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAnime = async (externalId) => {
    try {
      await removeAnimeFromList(userData.id, externalId);
      setAnimeList(animeList.filter((anime) => anime.data.mal_id !== externalId));
      closeModal();
    } catch (error) {
      console.error('Error removing anime:', error);
    }
  };

  const handleRemoveManga = async () => {
    const externalId = mangaToDelete.data.mal_id;
    try {
      await removeMangaFromList(userData.id, externalId);
      setMangaList(mangaList.filter((manga) => manga.data.mal_id !== externalId));
      closeModal();
    } catch (error) {
      console.error('Error removing manga:', error);
    }
  };

  const handleTabChange = (tab) => setActiveTab(tab);

  const openModal = (item, type) => {
    if (type === 'anime') setAnimeToDelete(item);
    else setMangaToDelete(item);
    setConfirmDelete(true);
  };

  const closeModal = () => {
    setConfirmDelete(false);
    setAnimeToDelete(null);
    setMangaToDelete(null);
  };

  return (
    <div className="container mx-auto p-6 bg-gradient-to-b from-gray-800 to-gray-900 min-h-screen">
      <h1 className="text-5xl font-bold text-center text-white mb-8">Minha Lista</h1>
      <div className="flex justify-center space-x-6 mb-6">
        <button
          onClick={() => handleTabChange('animes')}
          className={`text-lg px-6 py-3 rounded-lg font-semibold transition ${
            activeTab === 'animes' ? 'bg-indigo-600 text-white' : 'bg-gray-300 text-gray-800'
          }`}
        >
          Animes
        </button>
        <button
          onClick={() => handleTabChange('mangas')}
          className={`text-lg px-6 py-3 rounded-lg font-semibold transition ${
            activeTab === 'mangas' ? 'bg-indigo-600 text-white' : 'bg-gray-300 text-gray-800'
          }`}
        >
          Mangás
        </button>
      </div>
      {loading ? (
        <div className="text-white text-center">Carregando...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {activeTab === 'animes' &&
            animeList.map((anime) => (
              <div
                key={anime.data.mal_id}
                className="bg-white rounded-lg shadow-lg transform hover:scale-105 transition w-64 h-auto"
              >
                <a href={anime.data.url} target="_blank" rel="noopener noreferrer">
                  <img
                    src={anime.data.images.jpg.image_url}
                    alt={anime.data.title}
                    className="w-full h-96 object-cover rounded-t-lg" // Adjusted height for bigger card height
                  />
                  <div className="p-4">
                    <h2 className="text-lg font-bold text-center text-gray-900">
                      {anime.data.title}
                    </h2>
                  </div>
                </a>
                <div className="flex justify-center p-4">
                  <button
                    onClick={() => openModal(anime, 'anime')}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))}
          {activeTab === 'mangas' &&
            mangaList.map((manga) => (
              <div
                key={manga.data.mal_id}
                className="bg-white rounded-lg shadow-lg transform hover:scale-105 transition w-64 h-auto"
              >
                <a href={manga.data.url} target="_blank" rel="noopener noreferrer">
                  <img
                    src={manga.data.images.jpg.image_url}
                    alt={manga.data.title}
                    className="w-full h-96 object-cover rounded-t-lg" // Adjusted height for bigger card height
                  />
                  <div className="p-4">
                    <h2 className="text-lg font-bold text-center text-gray-900">
                      {manga.data.title}
                    </h2>
                  </div>
                </a>
                <div className="flex justify-center p-4">
                  <button
                    onClick={() => openModal(manga, 'manga')}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
      {confirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900">Confirmar Remoção</h2>
            <p className="text-gray-700 my-4">
              Você tem certeza que deseja remover{' '}
              <strong>
                {animeToDelete
                  ? animeToDelete.data.title
                  : mangaToDelete.data.title || 'este item'}
              </strong>{' '}
              da sua lista?
            </p>
            <div className="flex justify-end space-x-4">
              <button onClick={closeModal} className="px-4 py-2 bg-gray-300 rounded">
                Cancelar
              </button>
              <button
                onClick={() =>
                  animeToDelete
                    ? handleRemoveAnime(animeToDelete.data.mal_id)
                    : handleRemoveManga(mangaToDelete.data.mal_id)
                }
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyList;
