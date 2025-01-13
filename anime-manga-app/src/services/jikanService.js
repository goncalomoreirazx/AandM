import axios from 'axios';

const JikanAPI = axios.create({
  baseURL: 'https://api.jikan.moe/v4', 
});

// ANIME FUNCTIONS

// Busca animes por nome
export const searchAnime = async (query) => {
  try {
    const response = await JikanAPI.get('/anime', { params: { q: query } });
    return response.data.data;
  } catch (error) {
    console.error("Erro ao buscar animes:", error);
    throw error;
  }
};

// Busca anime por ID
export const getAnimeById = async (id) => {
  try {
    const response = await JikanAPI.get(`/anime/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Erro ao buscar anime por ID:", error);
    throw error;
  }
};

// Busca animes por gênero
export const getAnimeByGenre = async (genreId) => {
  try {
    const response = await JikanAPI.get('/anime', { params: { genres: genreId } });
    return response.data.data;
  } catch (error) {
    console.error("Erro ao buscar animes por gênero:", error);
    throw error;
  }
};

// Lista de gêneros de animes
export const getGenres = async () => {
  try {
    const response = await JikanAPI.get('/genres/anime');
    return response.data.data;
  } catch (error) {
    console.error('Erro ao buscar gêneros:', error);
    throw error;
  }
};

// Busca animes de um estúdio específico
export const getAnimeByStudio = async (studioId) => {
  try {
    const response = await JikanAPI.get(`/studios/${studioId}/anime`);
    return response.data.data;
  } catch (error) {
    console.error('Erro ao buscar animes por estúdio:', error);
    throw error;
  }
};

// Top animes com paginação
export const getTopAnimes = async (limit = 25, page = 1) => {
  try {
    const response = await JikanAPI.get('/top/anime', { params: { limit, page } });
    return response.data.data;
  } catch (error) {
    console.error("Erro ao buscar os top animes:", error);
    throw error;
  }
};

// MANGA FUNCTIONS

// Busca mangas por nome
export const searchManga = async (query) => {
  try {
    const response = await JikanAPI.get('/manga', { params: { q: query } });  // No limit parameter
    return response.data.data;
  } catch (error) {
    console.error("Erro ao buscar manga:", error);
    throw error;
  }
};


// Top mangas
export const getTopManga = async (page = 1, limit = 25) => {
  try {
    const response = await JikanAPI.get('/top/manga', { params: { page, limit } });
    return response.data.data;
  } catch (error) {
    console.error("Erro ao buscar top mangas:", error);
    throw error;
  }
};

// Busca manga por ID
export const getMangaById = async (id) => {
  try {
    const response = await JikanAPI.get(`/manga/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Erro ao buscar manga por ID:", error);
    throw error;
  }
};

// Lista de gêneros de mangas
export const getMangaGenres = async () => {
  try {
    const response = await JikanAPI.get('/genres/manga');
    return response.data.data;
  } catch (error) {
    console.error("Erro ao buscar gêneros de mangas:", error);
    throw error;
  }
};

// Busca mangas por gênero
export const getMangaByGenre = async (genreId) => {
  try {
    const response = await JikanAPI.get('/manga', { params: { genres: genreId } });
    return response.data.data;
  } catch (error) {
    console.error("Erro ao buscar mangas por gênero:", error);
    throw error;
  }
};

// Busca notícias de animes
export const getAnimeNews = async (id) => {
  try {
    const response = await JikanAPI.get(`/anime/${id}/news`);
    return response.data.data;
  } catch (error) {
    console.error("Erro ao buscar notícias de animes:", error);
    throw error;
  }
};

// Busca notícias de mangas
export const getMangaNews = async (id) => {
  try {
    const response = await JikanAPI.get(`/manga/${id}/news`);
    return response.data.data;
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
      const response = await axios.post('http://localhost:3000/api/list', {
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
    const response = await axios.get(`http://localhost:3000/api/list`, {
      params: { userId, contentType }, // Remova externalId daqui
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
    const response = await axios.delete(`http://localhost:3000/api/user/${userId}/anime/${animeId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao remover anime da lista:', error);
    throw error;
  }
};

export const removeMangaFromList = async (userId, mangaId) => { 
  console.log(`Removendo mangá com ID externo: ${mangaId}`); // Log do mangaId que está sendo passado
  try {
    const response = await axios.delete(`http://localhost:3000/api/user/${userId}/manga/${mangaId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao remover mangá da lista:', error);
    throw error;
  }
};
