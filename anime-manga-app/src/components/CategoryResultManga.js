import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMangaByGenre } from '../services/jikanService';

const CategoryResultManga = () => {
  const { genreId } = useParams();
  const [mangaList, setMangaList] = useState([]);

  useEffect(() => {
    const fetchMangaByGenre = async () => {
      try {
        const mangas = await getMangaByGenre(genreId);
        setMangaList(mangas);
      } catch (error) {
        console.error("Erro ao buscar mangas por gênero:", error);
      }
    };
    fetchMangaByGenre();
  }, [genreId]);

  return (
    <div className="container mx-auto p-4">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-4">Mangas do Gênero</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mangaList.map((manga) => (
            <div key={manga.mal_id} className="bg-white p-4 rounded-lg shadow-md w-96 h-128">
              <Link to={`/manga/${manga.mal_id}`}>
                <img src={manga.images.jpg.image_url} alt={manga.title} className="w-full h-96 object-cover mb-4 rounded" />
                <h3 className="text-xl font-bold mb-2 text-center">{manga.title}</h3>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryResultManga;
