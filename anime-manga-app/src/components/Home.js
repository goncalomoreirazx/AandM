import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import fairytail from '../assets/fairytail.jpg';
import onepiece from '../assets/onepiece.jpg';
import solo from '../assets/solo.avif';
import rmhs from '../assets/rmhs.avif';
import axios from 'axios';

// Settings for the main carousel
const carouselSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
};

// Settings for content sliders
const contentSliderSettings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 5,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1
      }
    }
  ]
};

// Helper function to fetch data with caching and retry
const fetchWithCacheAndRetry = async (url, cacheKey, expiry = 30) => {
  // Check cache first
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    // Check if cache is still valid (expiry in minutes)
    if (Date.now() - timestamp < expiry * 60 * 1000) {
      return data;
    }
  }

  // If not in cache or expired, fetch from API with retry
  let retries = 3;
  let delay = 1000; // Start with 1 second delay

  while (retries > 0) {
    try {
      const response = await axios.get(url);
      // Cache successful response
      localStorage.setItem(cacheKey, JSON.stringify({
        data: response.data.data,
        timestamp: Date.now()
      }));
      return response.data.data;
    } catch (error) {
      if (error.response && error.response.status === 429 && retries > 1) {
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
        retries--;
      } else {
        // If not a rate limit issue or out of retries, throw the error
        throw error;
      }
    }
  }
};

const Home = () => {
  const [topAnimes, setTopAnimes] = useState([]);
  const [topMangas, setTopMangas] = useState([]);
  const [seasonalAnimes, setSeasonalAnimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch data in parallel with proper error handling
        const [animes, mangas, seasonal] = await Promise.all([
          fetchWithCacheAndRetry('https://api.jikan.moe/v4/top/anime?limit=10', 'topAnimes'),
          fetchWithCacheAndRetry('https://api.jikan.moe/v4/top/manga?limit=10', 'topMangas'),
          fetchWithCacheAndRetry('https://api.jikan.moe/v4/seasons/now?limit=10', 'seasonalAnimes')
        ]);

        setTopAnimes(animes);
        setTopMangas(mangas);
        setSeasonalAnimes(seasonal);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to render content sliders safely
  const renderContentSlider = (items, title, type, color, btnColor) => {
    // Check if items exists and is an array before mapping
    if (!items || !Array.isArray(items) || items.length === 0) {
      return (
        <div className="mb-24">
          <div className="relative mb-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center">
              <h2 className="px-6 text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r dark:from-white dark:to-gray-400 mb-2">
                <span className={`bg-clip-text text-transparent bg-gradient-to-r ${color}`}>
                  {title}
                </span>
              </h2>
            </div>
          </div>
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center">
              <div className="animate-pulse flex space-x-4">
                <div className="rounded-full bg-gray-700 h-12 w-12"></div>
                <div className="flex-1 space-y-4 py-1">
                  <div className="h-4 bg-gray-700 rounded w-36"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-700 rounded w-24"></div>
                  </div>
                </div>
              </div>
              <p className="text-gray-400 mt-6">Loading content...</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="mb-24">
        <div className="relative mb-10">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center">
            <h2 className="px-6 text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r dark:from-white dark:to-gray-400 mb-2">
              <span className={`bg-clip-text text-transparent bg-gradient-to-r ${color}`}>
                {title}
              </span>
            </h2>
          </div>
        </div>
        <div className="px-4 md:px-8">
          <Slider {...contentSliderSettings}>
            {items.map(item => (
              <div key={item.mal_id} className="px-3">
                <div className="group relative bg-gray-900 rounded-xl overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.3)] transform transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_10px_25px_rgba(0,0,0,0.5)] h-[420px]">
                  <div className="relative h-[280px] overflow-hidden">
                    <img 
                      src={item.images.jpg.image_url} 
                      alt={item.title} 
                      className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-90" />
                    <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {item.score ? `★ ${item.score}` : "N/A"}
                    </div>
                  </div>
                  <div className="p-4 h-[140px] flex flex-col justify-between">
                    <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-cyan-400 transition-colors duration-300">
                      {item.title}
                    </h3>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {item.genres && item.genres.slice(0, 2).map(genre => (
                        <span key={genre.mal_id} className="inline-block text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded">
                          {genre.name}
                        </span>
                      ))}
                    </div>
                    <Link 
                      to={`/${type}/${item.mal_id}`}
                      className={`w-full mt-auto py-2 px-4 text-center text-white font-medium rounded-lg transition-all duration-300 transform ${btnColor} hover:brightness-110 hover:shadow-lg hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900`}
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black">
      <div className="container mx-auto py-8 px-4">
        {/* Hero Carousel Section */}
        <div className="relative mb-16">
          <div className="carousel max-w-6xl mx-auto rounded-2xl overflow-hidden shadow-[0_5px_30px_rgba(0,0,0,0.5)]">
            <Slider {...carouselSettings}>
              <div className="relative">
                <img src={solo} alt="Solo Leveling" className="w-full h-[600px] object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
                <div className="absolute bottom-0 left-0 w-full p-8">
                  <h2 className="text-3xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">Solo Leveling</h2>
                  <p className="text-xl text-gray-200 drop-shadow-lg">The weak hunter Sung Jinwoo becomes the only one able to level up</p>
                </div>
              </div>
              <div className="relative">
                <img src={fairytail} alt="Fairy Tail" className="w-full h-[600px] object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
                <div className="absolute bottom-0 left-0 w-full p-8">
                  <h2 className="text-3xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">Fairy Tail</h2>
                  <p className="text-xl text-gray-200 drop-shadow-lg">Natsu, Lucy, and the Fairy Tail guild's adventures</p>
                </div>
              </div>
              <div className="relative">
                <img src={onepiece} alt="One Piece" className="w-full h-[600px] object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
                <div className="absolute bottom-0 left-0 w-full p-8">
                  <h2 className="text-3xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">One Piece</h2>
                  <p className="text-xl text-gray-200 drop-shadow-lg">Luffy's journey to become the Pirate King</p>
                </div>
              </div>
              <div className="relative">
                <img src={rmhs} alt="Mashle" className="w-full h-[600px] object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
                <div className="absolute bottom-0 left-0 w-full p-8">
                  <h2 className="text-3xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">Mashle</h2>
                  <p className="text-xl text-gray-200 drop-shadow-lg">A magicless boy in a magical world relies on muscle</p>
                </div>
              </div>
            </Slider>
          </div>
        </div>

        {/* Display error message if there's an error */}
        {error && (
          <div className="bg-red-900 border border-red-500 text-red-100 px-6 py-4 rounded-lg mb-10 shadow-lg mx-auto max-w-4xl">
            <div className="flex items-center">
              <svg className="h-6 w-6 text-red-300 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Welcome Section */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">
            Welcome to Anime & Manga Hub
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8">
            Your ultimate destination for discovering and tracking your favorite anime and manga series.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/animesearch"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold rounded-lg hover:from-blue-700 hover:to-blue-900 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-blue-500/30"
            >
              Search Anime
            </Link>
            <Link
              to="/mangasearch"
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white font-bold rounded-lg hover:from-purple-700 hover:to-purple-900 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-purple-500/30"
            >
              Search Manga
            </Link>
          </div>
        </div>

        {/* Seasonal Anime Section */}
        {renderContentSlider(seasonalAnimes, "This Season's Anime", "anime", "from-green-400 to-teal-500", "bg-gradient-to-r from-green-600 to-teal-600")}

        {/* Top Anime Section */}
        {renderContentSlider(topAnimes, "Top Anime", "anime", "from-blue-400 to-indigo-500", "bg-gradient-to-r from-blue-600 to-indigo-600")}

        {/* Top Manga Section */}
        {renderContentSlider(topMangas, "Top Manga", "manga", "from-purple-400 to-pink-500", "bg-gradient-to-r from-purple-600 to-pink-600")}
        
        {/* Call to Action Section */}
        <div className="rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-r from-indigo-900 to-purple-900 my-16">
          <div className="relative px-8 py-16">
            <div className="relative z-10 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to track your favorite series?
              </h2>
              <p className="text-lg text-gray-200 mb-8 max-w-2xl mx-auto">
                Join our community to track your watching progress, build your collection, and discover new series.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => {}} // You can add login modal trigger here
                  className="px-6 py-3 bg-white text-indigo-900 font-bold rounded-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {}} // You can add register modal trigger here
                  className="px-6 py-3 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transform hover:scale-105 transition-all duration-300"
                >
                  Register
                </button>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;