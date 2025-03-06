import axios from 'axios';
import jikanApi from './apiService';

// Create a custom instance for non-Jikan API calls
const customAPI = axios.create({
  baseURL: 'http://localhost:3000', 
});

// ANIME FUNCTIONS

// Busca animes por nome
export const searchAnime = async (query) => {
  try {
    const data = await jikanApi.get('/anime', `jikan_search_anime_${query}`, 60, { q: query });
    return data;
  } catch (error) {
    console.error("Erro ao buscar animes:", error);
    throw error;
  }
};

// Busca anime por ID
export const getAnimeById = async (id) => {
  try {
    const data = await jikanApi.get(`/anime/${id}`, `jikan_anime_${id}`, 60 * 24); // Cache for 24 hours
    return data;
  } catch (error) {
    console.error("Erro ao buscar anime por ID:", error);
    throw error;
  }
};

// Busca animes por gênero
export const getAnimeByGenre = async (genreId) => {
  try {
    const data = await jikanApi.get('/anime', `jikan_anime_genre_${genreId}`, 60, { genres: genreId });
    return data;
  } catch (error) {
    console.error("Erro ao buscar animes por gênero:", error);
    throw error;
  }
};

// Lista de gêneros de animes
export const getGenres = async () => {
  try {
    const data = await jikanApi.get('/genres/anime', 'jikan_anime_genres', 60 * 24 * 7); // Cache for a week
    return data;
  } catch (error) {
    console.error('Erro ao buscar gêneros:', error);
    throw error;
  }
};

// Busca animes de um estúdio específico
export const getAnimeByStudio = async (studioId) => {
  try {
    const data = await jikanApi.get(`/studios/${studioId}/anime`, `jikan_studio_${studioId}`, 60 * 24);
    return data;
  } catch (error) {
    console.error('Erro ao buscar animes por estúdio:', error);
    throw error;
  }
};

// Top animes com paginação
export const getTopAnimes = async (limit = 25, page = 1) => {
  try {
    const data = await jikanApi.get('/top/anime', `jikan_top_anime_${page}_${limit}`, 60 * 3, { limit, page });
    return data;
  } catch (error) {
    console.error("Erro ao buscar os top animes:", error);
    throw error;
  }
};

// Seasonal animes
export const getSeasonalAnimes = async (limit = 10) => {
  try {
    const data = await jikanApi.get('/seasons/now', 'jikan_seasonal_anime', 60 * 24, { limit });
    return data;
  } catch (error) {
    console.error("Erro ao buscar animes da temporada:", error);
    throw error;
  }
};

// MANGA FUNCTIONS

// Busca mangas por nome
export const searchManga = async (query) => {
  try {
    const data = await jikanApi.get('/manga', `jikan_search_manga_${query}`, 60, { q: query });
    return data;
  } catch (error) {
    console.error("Erro ao buscar manga:", error);
    throw error;
  }
};

// Top mangas
export const getTopManga = async (page = 1, limit = 25) => {
  try {
    const data = await jikanApi.get('/top/manga', `jikan_top_manga_${page}_${limit}`, 60 * 3, { page, limit });
    return data;
  } catch (error) {
    console.error("Erro ao buscar top mangas:", error);
    throw error;
  }
};

// Busca manga por ID
export const getMangaById = async (id) => {
  try {
    const data = await jikanApi.get(`/manga/${id}`, `jikan_manga_${id}`, 60 * 24);
    return data;
  } catch (error) {
    console.error("Erro ao buscar manga por ID:", error);
    throw error;
  }
};

// Lista de gêneros de mangas
export const getMangaGenres = async () => {
  try {
    const data = await jikanApi.get('/genres/manga', 'jikan_manga_genres', 60 * 24 * 7);
    return data;
  } catch (error) {
    console.error("Erro ao buscar gêneros de mangas:", error);
    throw error;
  }
};

// Busca mangas por gênero
export const getMangaByGenre = async (genreId) => {
  try {
    const data = await jikanApi.get('/manga', `jikan_manga_genre_${genreId}`, 60, { genres: genreId });
    return data;
  } catch (error) {
    console.error("Erro ao buscar mangas por gênero:", error);
    throw error;
  }
};

// Busca notícias de animes
export const getAnimeNews = async (id) => {
  try {
    const data = await jikanApi.get(`/anime/${id}/news`, `jikan_anime_news_${id}`, 60);
    return data;
  } catch (error) {
    console.error("Erro ao buscar notícias de animes:", error);
    throw error;
  }
};

// Busca notícias de mangas
export const getMangaNews = async (id) => {
  try {
    const data = await jikanApi.get(`/manga/${id}/news`, `jikan_manga_news_${id}`, 60);
    return data;
  } catch (error) {
    console.error("Erro ao buscar notícias de mangas:", error);
    throw error;
  }
};

// LIST AND NEWS FUNCTIONS

// Adiciona anime/manga à lista do usuário
export const addToUserList = async (externalId, contentType) => {
  const userSession = localStorage.getItem('userSession');

  if (!userSession) {
      throw new Error('Usuário não está logado.');
  }

  const parsedData = JSON.parse(userSession);
  const userId = parsedData.id;

  try {
      const response = await customAPI.post('/api/list', {
          userId,
          externalId,
          contentType,
      });

      return response.data; // Retorna a resposta do servidor
  } catch (error) {
      console.error('Erro ao adicionar à lista:', error);
      
      // Exibe mensagem de erro
      const errorMessage = error.response?.data?.message || 'Erro ao adicionar à lista.';
      alert(errorMessage);
      throw error; // Propaga o erro para o componente chamador
  }
};

export const getUserList = async (userId, contentType) => { 
  try {
    const response = await customAPI.get(`/api/list`, {
      params: { userId, contentType },
    });
    return response.data; 
  } catch (error) {
    console.error('Erro ao buscar lista do usuário:', error);
    throw error; 
  }
};

//REMOVER OS ANIMES OU MANGAS QUE TENHO NA LISTA
export const removeAnimeFromList = async (userId, animeId) => {
  try {
    const response = await customAPI.delete(`/api/user/${userId}/anime/${animeId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao remover anime da lista:', error);
    throw error;
  }
};

export const removeMangaFromList = async (userId, mangaId) => { 
  console.log(`Removendo mangá com ID externo: ${mangaId}`); // Log do mangaId que está sendo passado
  try {
    const response = await customAPI.delete(`/api/user/${userId}/manga/${mangaId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao remover mangá da lista:', error);
    throw error;
  }
};

export const updateItemStatus = async (userId, externalId, contentType, status) => {
  try {
    const response = await customAPI.put('/api/list/status', {
      userId,
      externalId,
      contentType,
      status
    });
    return response.data;
  } catch (error) {
    console.error('Error updating item status:', error);
    throw error;
  }
};