// src/components/TopAnimes.js
import React, { useEffect, useState } from 'react';
import { getTopAnimes, addToUserList } from '../services/jikanService';
import Dialog from './Dialog';

const TopAnimes = () => {
  const [topAnimes, setTopAnimes] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDialog, setShowDialog] = useState(false); // Estado para mostrar o diálogo

  useEffect(() => {
    const fetchTopAnimes = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getTopAnimes(25, page);
        setTopAnimes(data);
      } catch (error) {
        setError('Erro ao buscar os top Animes.');
      } finally {
        setLoading(false);
      }
    };

    fetchTopAnimes();
  }, [page]);

  const handleAddToList = async (anime) => {
    const userSession = localStorage.getItem('userSession');

    if (!userSession) {
      setError('Usuário não está logado.');
      return; // Sai da função se o usuário não estiver logado
    }

    const parsedData = JSON.parse(userSession);
    const userId = parsedData.id; // Obtém o ID do usuário da sessão

    try {
      await addToUserList(anime.mal_id, 'anime'); // Adiciona o anime à lista
      setShowDialog(true); // Exibe o diálogo
      setTimeout(() => setShowDialog(false), 1000); // Fecha o diálogo após 1 segundo
    } catch (error) {
      console.error('Erro ao adicionar à lista:', error);
      setError('Erro ao adicionar à lista.'); // Mensagem de erro
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Top Animes</h1>

      {loading ? (
        <p className="text-center text-white">Carregando...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="table-auto w-full">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2">Rank</th>
                  <th className="px-4 py-2">Title</th>
                  <th className="px-4 py-2">Score</th>
                  <th className="px-4 py-2">Add to List</th>
                </tr>
              </thead>
              <tbody>
                {topAnimes.map((anime, index) => (
                  <tr key={anime.mal_id} className="border-t">
                    <td className="px-4 py-2 text-center">{(page - 1) * 25 + index + 1}</td>
                    <td className="px-4 py-2 flex items-center">
                      <img src={anime.images.jpg.image_url} alt={anime.title} className="w-16 h-24 object-cover mr-4" />
                      <div>
                        <h3 className="font-bold text-lg">{anime.title}</h3>
                        <p className="text-sm text-gray-500">Episodes: {anime.episodes || 'N/A'}</p>
                      </div>
                    </td>
                    <td className="px-4 py-2 text-center">{anime.score || 'N/A'}</td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => handleAddToList(anime)}
                        className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600"
                      >
                        Add to List
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {showDialog && <Dialog onClose={() => setShowDialog(false)} />} {/* Mostra o diálogo */}

          <div className="flex justify-between mt-6">
            <button
              onClick={() => setPage((prevPage) => prevPage - 1)}
              disabled={page === 1}
              className={`bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 ${page === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Previous 25
            </button>
            <button
              onClick={() => setPage((prevPage) => prevPage + 1)}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Next 25
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TopAnimes;
