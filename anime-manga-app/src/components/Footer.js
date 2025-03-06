import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white pt-12 pb-8">
            <div className="container mx-auto px-4">
                <div className="flex flex-wrap justify-between">
                    {/* Logo & About */}
                    <div className="w-full md:w-1/4 text-center md:text-left mb-8 md:mb-0">
                        <h2 className="text-3xl font-bold mb-4">A&M</h2>
                        <p className="text-gray-400 mb-4 text-sm">
                            Your ultimate destination for anime and manga content. 
                            Discover, track, and enjoy your favorite series all in one place.
                        </p>
                        <div className="flex justify-center md:justify-start space-x-4">
                            <a href="#" className="hover:text-blue-400 transition-colors">
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                                </svg>
                            </a>
                            <a href="#" className="hover:text-indigo-400 transition-colors">
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                            </a>
                            <a href="#" className="hover:text-blue-600 transition-colors">
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="w-full md:w-1/4 mb-8 md:mb-0">
                        <h3 className="text-lg font-semibold mb-4 text-center md:text-left">Quick Links</h3>
                        <ul className="space-y-2 text-center md:text-left">
                            <li>
                                <Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link>
                            </li>
                            <li>
                                <Link to="/topanimes" className="text-gray-400 hover:text-white transition-colors">Top Anime</Link>
                            </li>
                            <li>
                                <Link to="/topmangas" className="text-gray-400 hover:text-white transition-colors">Top Manga</Link>
                            </li>
                            <li>
                                <Link to="/animesearch" className="text-gray-400 hover:text-white transition-colors">Search Anime</Link>
                            </li>
                            <li>
                                <Link to="/mangasearch" className="text-gray-400 hover:text-white transition-colors">Search Manga</Link>
                            </li>
                        </ul>
                    </div>

                    {/* User */}
                    <div className="w-full md:w-1/4 mb-8 md:mb-0">
                        <h3 className="text-lg font-semibold mb-4 text-center md:text-left">User</h3>
                        <ul className="space-y-2 text-center md:text-left">
                            <li>
                                <Link to="/userprofile" className="text-gray-400 hover:text-white transition-colors">Profile</Link>
                            </li>
                            <li>
                                <Link to="/mylist" className="text-gray-400 hover:text-white transition-colors">My List</Link>
                            </li>
                            <li>
                                <Link to="/edit-profile" className="text-gray-400 hover:text-white transition-colors">Edit Profile</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="w-full md:w-1/4">
                        <h3 className="text-lg font-semibold mb-4 text-center md:text-left">Stay Updated</h3>
                        <p className="text-gray-400 mb-4 text-sm text-center md:text-left">
                            Subscribe to our newsletter for the latest updates on new anime and manga releases.
                        </p>
                        <form className="flex flex-col md:flex-row gap-2">
                            <input 
                                type="email" 
                                placeholder="Your email" 
                                className="px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <button 
                                type="submit" 
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 mt-8 pt-8 text-center">
                    <p className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} Anime & Manga. All rights reserved.
                    </p>
                    <p className="text-gray-600 text-xs mt-2">
                        Powered by <a href="https://jikan.moe/" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">Jikan API</a>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;