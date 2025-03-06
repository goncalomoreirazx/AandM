import React, { useEffect, useState } from 'react';
import { getTopAnimes, addToUserList } from '../services/jikanService';
import { Link } from 'react-router-dom';
import Dialog from './Dialog';
import { StarIcon } from '@heroicons/react/24/solid'; // Updated to Heroicons v2 path

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
        console.error('Erro ao buscar os top Animes:', error);
        setError('Erro ao buscar os top Animes. Por favor, tente novamente mais tarde.');
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

  // Function to render star ratings
  const renderRating = (score) => {
    if (!score) return null;
    
    const maxStars = 5;
    const starScore = score / 2; // Convert from 10-scale to 5-scale
    
    return (
      <div className="flex items-center">
        {[...Array(maxStars)].map((_, index) => {
          const starValue = index + 1;
          return (
            <StarIcon
              key={index}
              className={`h-5 w-5 ${
                starValue <= starScore
                  ? 'text-yellow-400'
                  : starValue <= starScore + 0.5
                  ? 'text-yellow-300'
                  : 'text-gray-300'
              }`}
            />
          );
        })}
        <span className="ml-1 text-gray-600">{score.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Top Animes</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
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
                {topAnimes && topAnimes.map ? (
                  topAnimes.map((anime, index) => (
                    <tr key={anime.mal_id} className="border-t">
                      <td className="px-4 py-2 text-center">{(page - 1) * 25 + index + 1}</td>
                      <td className="px-4 py-2 flex items-center">
                        <img 
                          src={anime.images?.jpg?.image_url} 
                          alt={anime.title} 
                          className="w-16 h-24 object-cover mr-4"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/64x96?text=No+Image';
                          }}
                        />
                        <div>
                          <h3 className="font-bold text-lg">{anime.title}</h3>
                          <p className="text-sm text-gray-500">Episodes: {anime.episodes || 'N/A'}</p>
                          {renderRating(anime.score)}
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
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-4 py-2 text-center">
                      No anime data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {showDialog && <Dialog onClose={() => setShowDialog(false)} />}

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