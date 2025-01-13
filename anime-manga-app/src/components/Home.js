import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import fairytail from '../assets/fairytail.jpg';
import onepiece from '../assets/onepiece.jpg';
import solo from '../assets/solo.avif';
import rmhs from '../assets/rmhs.avif';

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
};

const Home = () => {
  const [mangas, setMangas] = useState([]);
  const [topAnimes, setTopAnimes] = useState([]);

  useEffect(() => {
    const fetchTopMangas = async () => {
      try {
        const response = await fetch('https://api.jikan.moe/v4/top/manga');
        const data = await response.json();
        setMangas(data.data.slice(0, 5));
      } catch (error) {
        console.error('Erro ao buscar os top mangas:', error);
      }
    };
    fetchTopMangas();
  }, []);

  useEffect(() => {
    const fetchTopAnimes = async () => {
      try {
        const response = await fetch('https://api.jikan.moe/v4/top/anime');
        const data = await response.json();
        setTopAnimes(data.data.slice(0, 5));
      } catch (error) {
        console.error('Erro ao buscar os top animes:', error);
      }
    };
    fetchTopAnimes();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto py-8 px-4">
        {/* Hero Carousel Section */}
        <div className="relative mb-16">
          <div className="carousel max-w-6xl mx-auto rounded-2xl overflow-hidden shadow-2xl">
            <Slider {...settings}>
              <div><img src={solo} alt="Imagem 1" className="w-full h-[600px] object-cover" /></div>
              <div><img src={fairytail} alt="Imagem 2" className="w-full h-[600px] object-cover" /></div>
              <div><img src={onepiece} alt="Imagem 3" className="w-full h-[600px] object-cover" /></div>
              <div><img src={rmhs} alt="Imagem 4" className="w-full h-[600px] object-cover" /></div>
            </Slider>
          </div>
        </div>

        {/* Top Anime Section */}
        <div className="mb-16">
          <h1 className="text-5xl font-bold text-white mb-8 text-center">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Top Anime
            </span>
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {topAnimes.map(anime => (
              <div key={anime.mal_id} className="group relative bg-gray-800 rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                <div className="relative h-80">
                  <img 
                    src={anime.images.jpg.image_url} 
                    alt={anime.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-white mb-2 line-clamp-2 text-center">
                    {anime.title}
                  </h2>
                  <Link 
                    to={`/anime/${anime.mal_id}`}
                    className="block w-full mt-2 px-4 py-2 text-center text-white bg-blue-600 rounded-lg transition-colors duration-300 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Manga Section */}
        <div>
          <h1 className="text-5xl font-bold text-white mb-8 text-center">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
              Top Manga
            </span>
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {mangas.map(manga => (
              <div key={manga.mal_id} className="group relative bg-gray-800 rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                <div className="relative h-80">
                  <img 
                    src={manga.images.jpg.image_url} 
                    alt={manga.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-white mb-2 line-clamp-2 text-center">
                    {manga.title}
                  </h2>
                  <Link 
                    to={`/manga/${manga.mal_id}`}
                    className="block w-full mt-2 px-4 py-2 text-center text-white bg-purple-600 rounded-lg transition-colors duration-300 hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;