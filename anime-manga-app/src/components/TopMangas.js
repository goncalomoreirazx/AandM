import React, { useEffect, useState } from 'react';
import { getTopManga, addToUserList } from '../services/jikanService';
import { Link } from 'react-router-dom';
import Dialog from './Dialog';
import { StarIcon } from '@heroicons/react/24/solid'; // Updated to Heroicons v2 path

const TopMangas = () => {
  const [topMangas, setTopMangas] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDialog, setShowDialog] = useState(false); // Estado para mostrar o diálogo

  useEffect(() => {
    const fetchMangas = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getTopManga(page);
        setTopMangas(data);
      } catch (error) {
        console.error('Erro ao buscar os mangas:', error);
        setError('Erro ao buscar os top Mangas. Por favor, tente novamente mais tarde.');
      } finally {
        setLoading(false); // Certifique-se de definir loading como false após a operação
      }
    };
    fetchMangas();
  }, [page]);

  const handleAddToList = async (manga) => {
    const userSession = localStorage.getItem('userSession');

    if (!userSession) {
      setError('Usuário não está logado.');
      return; // Sai da função se o usuário não estiver logado
    }

    const parsedData = JSON.parse(userSession);
    const userId = parsedData.id; // Obtém o ID do usuário da sessão
    try {
      await addToUserList(manga.mal_id, 'manga'); 
      setShowDialog(true); // Exibe o diálogo
      setTimeout(() => setShowDialog(false), 1000); // Fecha o diálogo após 1 segundo
    } catch(error) {
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

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage((prevPage) => prevPage - 1);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Top Mangas</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="table-auto w-full">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2">Rank</th>
                  <th className="px-4 py-2">Manga</th>
                  <th className="px-4 py-2">Score</th>
                  <th className="px-4 py-2">Add to List</th>
                </tr>
              </thead>
              <tbody>
                {topMangas && topMangas.map ? (
                  topMangas.map((manga, index) => (
                    <tr key={manga.mal_id} className="border-t">
                      <td className="px-4 py-2 text-center">{index + 1 + (page - 1) * 25}</td>
                      <td className="px-4 py-2 flex items-center">
                        <img 
                          src={manga.images?.jpg?.image_url}
                          alt={manga.title} 
                          className="w-12 h-16 mr-4"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/48x64?text=No+Image';
                          }}
                        />
                        <div>
                          <Link to={`/manga/${manga.mal_id}`} className="font-bold">{manga.title}</Link>
                          <p className="text-gray-600">Volumes: {manga.volumes || 'N/A'}</p>
                          {renderRating(manga.score)}
                        </div>
                      </td>
                      <td className="px-4 py-2 text-center">{manga.score || 'N/A'}</td>
                      <td className="px-4 py-2 text-center">
                        <button
                          onClick={() => handleAddToList(manga)}
                          className="bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600"
                        >
                          Add to List
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-4 py-2 text-center">
                      No manga data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {showDialog && <Dialog onClose={() => setShowDialog(false)} />}
            
          <div className="flex justify-between mt-4">
            <button
              onClick={handlePrevPage}
              disabled={page === 1}
              className={`bg-gray-300 text-black py-2 px-4 rounded hover:bg-gray-400 ${
                page === 1 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Previous 25
            </button>
            <button
              onClick={handleNextPage}
              className="bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600"
            >
              Next 25
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TopMangas;
