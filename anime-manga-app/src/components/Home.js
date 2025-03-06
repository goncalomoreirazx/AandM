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
  const renderContentSlider = (items, title, type, color) => {
    // Check if items exists and is an array before mapping
    if (!items || !Array.isArray(items) || items.length === 0) {
      return (
        <div className="mb-16">
          <h1 className="text-5xl font-bold text-white mb-8 text-center">
            <span className={`bg-clip-text text-transparent bg-gradient-to-r ${color}`}>
              {title}
            </span>
          </h1>
          <p className="text-white text-center">Loading content...</p>
        </div>
      );
    }

    return (
      <div className="mb-16">
        <h1 className="text-5xl font-bold text-white mb-8 text-center">
          <span className={`bg-clip-text text-transparent bg-gradient-to-r ${color}`}>
            {title}
          </span>
        </h1>
        <Slider {...contentSliderSettings}>
          {items.map(item => (
            <div key={item.mal_id} className="px-2">
              <div className="group relative bg-gray-800 rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl h-96">
                <div className="relative h-64">
                  <img 
                    src={item.images.jpg.image_url} 
                    alt={item.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-white mb-2 line-clamp-2 text-center">
                    {item.title}
                  </h2>
                  <Link 
                    to={`/${type}/${item.mal_id}`}
                    className={`block w-full mt-2 px-4 py-2 text-center text-white ${type === 'anime' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-purple-600 hover:bg-purple-700'} rounded-lg transition-colors duration-300 focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800`}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto py-8 px-4">
        {/* Hero Carousel Section */}
        <div className="relative mb-16">
          <div className="carousel max-w-6xl mx-auto rounded-2xl overflow-hidden shadow-2xl">
            <Slider {...carouselSettings}>
              <div><img src={solo} alt="Solo Leveling" className="w-full h-[600px] object-cover" /></div>
              <div><img src={fairytail} alt="Fairy Tail" className="w-full h-[600px] object-cover" /></div>
              <div><img src={onepiece} alt="One Piece" className="w-full h-[600px] object-cover" /></div>
              <div><img src={rmhs} alt="Mashle" className="w-full h-[600px] object-cover" /></div>
            </Slider>
          </div>
        </div>

        {/* Display error message if there's an error */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Seasonal Anime Section */}
        {renderContentSlider(seasonalAnimes, "This Season's Anime", "anime", "from-green-400 to-teal-500")}

        {/* Top Anime Section */}
        {renderContentSlider(topAnimes, "Top Anime", "anime", "from-blue-400 to-purple-500")}

        {/* Top Manga Section */}
        {renderContentSlider(topMangas, "Top Manga", "manga", "from-purple-400 to-pink-500")}
      </div>
    </div>
  );
};

export default Home;