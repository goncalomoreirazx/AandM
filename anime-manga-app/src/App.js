import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Header from './components/Header';
import Footer from './components/Footer';
import AnimeSearch from './components/AnimeSearch'; // Certifique-se de que o caminho está correto
import MangaSearch from './components/MangaSearch';
import AnimeDetails from './components/AnimeDetails';
import MangaDetails from './components/MangaDetails';
import CategoryResult from './components/CategoryResult';
import Home from './components/Home';
import TopAnimes from './components/TopAnimes';
import TopMangas from './components/TopMangas';
import CategoryResultManga from './components/CategoryResultManga';
import UserProfile from './components/UserProfile';
import EditProfile from './components/EditProfile';
import MyList from './components/MyList';

const App = () => {
    return (
        <div className="bg-white text-black dark:bg-gray-900 dark:text-white min-h-screen transition-colors duration-500">
            <Router>
                <div className="flex flex-col min-h-screen">
                    <Header />
                    <main className="flex-grow">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/animesearch" element={<AnimeSearch />} />
                            <Route path="/anime/:id" element={<AnimeDetails />} />
                            <Route path="/category/:genreId" element={<CategoryResult />} />
                            <Route path="/mangasearch" element={<MangaSearch />} />
                            <Route path='manga-category/:genreId' element={<CategoryResultManga/>}/>
                            <Route path="/manga/:id" element={<MangaDetails />} />
                            <Route path="/topanimes" element={<TopAnimes/>} />
                            <Route path="/topmangas" element={<TopMangas />} />
                            <Route path='/userprofile' element={< UserProfile />}/>
                            <Route path='/edit-profile' element={<EditProfile/>}/>
                            <Route path='mylist' element={<MyList/>}/>
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </Router>
        </div>
    );
};

export default App;
