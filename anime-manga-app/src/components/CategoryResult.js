import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAnimeByGenre } from '../services/jikanService';

const CategoryResult = () => {
  const { genreId } = useParams();
  const [animeList, setAnimeList] = useState([]);

  useEffect(() => {
    const fetchAnimeByGenre = async () => {
      try {
        const animes = await getAnimeByGenre(genreId);
        setAnimeList(animes);
      } catch (error) {
        console.error("Erro ao buscar animes por gênero:", error);
      }
    };
    fetchAnimeByGenre();
  }, [genreId]);

  return (
    <div className="container mx-auto p-4">
     <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-4">Animes do Gênero</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {animeList.map((anime) => (
          <div key={anime.mal_id} className="bg-white p-4 rounded-lg shadow-md">
            <Link to={`/anime/${anime.mal_id}`}>
              <img src={anime.images.jpg.image_url} alt={anime.title} className="w-full h-48 object-cover mb-4 rounded" />
              <h3 className="text-xl font-bold mb-2">{anime.title}</h3>
            </Link>
          </div>
        ))}
      </div>
     </div>  
    </div>
  );
};

export default CategoryResult;
