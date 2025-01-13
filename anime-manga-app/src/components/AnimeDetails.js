import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getAnimeById, addToUserList } from '../services/jikanService';
import Dialog from '../components/Dialog'; // Importe o Dialog

const AnimeDetails = () => {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [status, setStatus] = useState({ loading: true, error: null });
  const [showDialog, setShowDialog] = useState(false); // Novo estado para controlar o Dialog

  useEffect(() => {
    const fetchAnimeDetails = async () => {
      try {
        const animeData = await getAnimeById(id);
        setAnime(animeData);
        setStatus({ loading: false, error: null });
      } catch (error) {
        setStatus({ loading: false, error: "Erro ao carregar os detalhes do anime." });
      }
    };

    fetchAnimeDetails();
  }, [id]);

  const handleAddToList = async () => {
    if (!anime) return;
    try {
      await addToUserList(anime.mal_id, 'anime');
      setShowDialog(true); // Exibe o Dialog

      setTimeout(() => setShowDialog(false), 1000); // Oculta o Dialog após 1 segundo
    } catch (error) {
      console.error('Erro ao adicionar à lista:', error);
    }
  };

  if (status.loading) return <p className="text-center text-white">Carregando...</p>;
  if (status.error) return <p className="text-center text-red-500">{status.error}</p>;
  if (!anime) return <p className="text-center text-white">Anime não encontrado.</p>;

  return (
    <div className="container mx-auto p-6">
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg">
        <div className="flex flex-col md:flex-row md:space-x-6">
          {anime.images && anime.images.jpg && anime.images.jpg.image_url ? (
            <img
              src={anime.images.jpg.image_url}
              alt={anime.title}
              className="object-contain w-full md:w-1/2 h-auto max-h-96 rounded-lg shadow-md mb-6 md:mb-0"
            />
          ) : (
            <p className="text-white text-center">Imagem não disponível.</p>
          )}
          <div className="flex-1">
            <h2 className="text-4xl font-extrabold text-white mb-4">{anime.title}</h2>
            <p className="text-lg text-white mb-2"><strong>Score:</strong> {anime.score || "N/A"}</p>
            <p className="text-lg text-white mb-2"><strong>Episódios:</strong> {anime.episodes || "Desconhecido"}</p>
            <p className="text-lg text-white mb-2"><strong>Status:</strong> {anime.status || "Desconhecido"}</p>
            <p className="text-lg text-white mb-2"><strong>Rank:</strong> #{anime.rank || "N/A"}</p>
            <p className="text-lg text-white mb-2"><strong>Popularidade:</strong> {anime.popularity || "N/A"}</p>
            <div className="mt-6">
              <button onClick={handleAddToList} className="bg-blue-500 text-white p-2 rounded text-center">Adicionar à Lista</button>
            </div>
          </div>
        </div>
      </div>
      {showDialog && <Dialog onClose={() => setShowDialog(false)} />}
    </div>
  );
};

export default AnimeDetails;
