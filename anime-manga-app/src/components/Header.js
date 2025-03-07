import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, UserIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import DarkModeToggle from './DarkModeToggle';

const navigation = [
  {
    name: 'Animes', subItems: [
      { name: 'Search Animes', href: '/AnimeSearch' },
      { name: 'Top Animes', href: '/TopAnimes' },
    ]
  },
  {
    name: 'Mangas', subItems: [
      { name: 'Search Mangas', href: '/MangaSearch' },
      { name: 'Top Mangas', href: '/TopMangas' },
    ]
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Header() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const userSession = localStorage.getItem('userSession');
    if (userSession) {
      try {
        const parsedData = JSON.parse(userSession);
        setUserData(parsedData);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Error parsing user session:", error);
      }
    }
  }, []);

  const handleDropdownClick = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('userSession');
    setUserData(null);
    setUserMenuOpen(false);
    console.log('User logged out');
    window.location.href = '/';
  };

  const handleLoginSuccess = (userData) => {
    setIsLoggedIn(true);
    setUserData(userData);
    localStorage.setItem('userSession', JSON.stringify(userData));
    setIsLoginOpen(false);
    console.log('User logged in:', userData);
  };

  return (
    <>
      <Disclosure as="nav" className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-black dark:to-gray-900 border-b border-gray-700 shadow-lg">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="relative flex h-20 items-center justify-between">
                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                  <DisclosureButton className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition duration-200">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </DisclosureButton>
                </div>
                <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                  <div className="flex flex-shrink-0 items-center">
                    <Link to="/" className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 text-3xl font-bold tracking-tighter hover:from-purple-400 hover:to-blue-600 transition duration-500">A&M</Link>
                  </div>
                  <div className="hidden sm:ml-8 sm:block">
                    <div className="flex space-x-8">
                      {navigation.map((item, index) => (
                        <div key={item.name} className="relative group">
                          {item.subItems ? (
                            <button
                              onClick={() => handleDropdownClick(index)}
                              className={classNames(
                                'text-gray-300 hover:text-white',
                                'rounded-md px-3 py-2 text-sm font-medium relative'
                              )}>
                              {item.name}
                              {/* Animated bottom border */}
                              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                            </button>
                          ) : (
                            <Link
                              to={item.href}
                              className={classNames(
                                'text-gray-300 hover:text-white',
                                'rounded-md px-3 py-2 text-sm font-medium relative'
                              )}>
                              {item.name}
                              {/* Animated bottom border */}
                              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                            </Link>
                          )}
                          {item.subItems && openDropdown === index && (
                            <div className="absolute left-0 z-10 mt-2 w-48 origin-top-right rounded-lg bg-gray-800 text-white shadow-lg ring-1 ring-black ring-opacity-5 divide-y divide-gray-700 backdrop-blur-sm bg-opacity-95 animate-fadeIn">
                              {item.subItems.map((subItem) => (
                                <Link
                                  key={subItem.name}
                                  to={subItem.href}
                                  className="block px-4 py-3 text-sm hover:bg-gray-700 hover:text-indigo-400 transition duration-150 first:rounded-t-lg last:rounded-b-lg">
                                  {subItem.name}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  <div className="mr-4">
                    <DarkModeToggle />
                  </div>
                  
                  {isLoggedIn ? (
                    <div className="relative ml-3">
                      <div className="flex items-center">
                        <span className="mr-3 text-white hidden md:block text-sm font-medium">
                          Welcome, <span className="text-indigo-400">{userData?.username}</span>
                        </span>
                        <button
                          type="button"
                          className="relative flex rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 p-1 text-white hover:from-indigo-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                          onClick={() => setUserMenuOpen(!userMenuOpen)}>
                          <span className="sr-only">Open user menu</span>
                          <UserIcon className="h-6 w-6" />
                          {/* Online indicator */}
                          <span className="absolute bottom-0 right-0 block h-2 w-2 rounded-full bg-green-400 ring-2 ring-gray-800"></span>
                        </button>
                      </div>
                      
                      {userMenuOpen && (
                        <div className="absolute right-0 z-10 mt-3 w-60 origin-top-right rounded-lg bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 dark:divide-gray-700 focus:outline-none animate-fadeIn">
                          <div className="py-2 px-4">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Signed in as</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{userData?.email}</p>
                          </div>
                          <div className="py-1">
                            <Link
                              to="/UserProfile"
                              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-150"
                              onClick={() => setUserMenuOpen(false)}>
                              <svg className="mr-3 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              Profile
                            </Link>
                            <Link
                              to="/mylist"
                              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-150"
                              onClick={() => setUserMenuOpen(false)}>
                              <svg className="mr-3 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                              </svg>
                              My List
                            </Link>
                          </div>
                          <div className="py-1">
                            <button
                              className="flex w-full items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-150"
                              onClick={handleLogout}>
                              <svg className="mr-3 h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                              </svg>
                              Logout
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex space-x-3">
                      <button
                        type="button"
                        className="flex items-center text-white bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 hover:shadow-lg"
                        onClick={() => setIsLoginOpen(true)}>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                        </svg>
                        Login
                      </button>
                      <button
                        type="button"
                        className="text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 hover:shadow-lg"
                        onClick={() => setIsRegisterOpen(true)}>
                        Register
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <DisclosurePanel className="sm:hidden">
              <div className="space-y-1 px-3 pb-4 pt-2 divide-y divide-gray-700">
                {isLoggedIn && (
                  <div className="relative py-3">
                    <div className="flex items-center px-3 py-2 mb-2 bg-gray-800 rounded-lg">
                      <div className="flex items-center justify-center h-10 w-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full text-white">
                        <UserIcon className="h-6 w-6" />
                      </div>
                      <div className="ml-3">
                        <p className="text-white font-medium">{userData?.username}</p>
                        <p className="text-xs text-gray-400 truncate">{userData?.email}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <Link
                        to="/UserProfile"
                        className="flex justify-center items-center px-3 py-2 text-sm font-medium text-gray-300 bg-gray-800 rounded-lg hover:bg-gray-700 hover:text-white transition duration-150">
                        Profile
                      </Link>
                      <Link
                        to="/mylist"
                        className="flex justify-center items-center px-3 py-2 text-sm font-medium text-gray-300 bg-gray-800 rounded-lg hover:bg-gray-700 hover:text-white transition duration-150">
                        My List
                      </Link>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-red-400 bg-gray-800 rounded-lg hover:bg-gray-700 hover:text-red-300 transition duration-150">
                      <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
                )}
                
                {/* Main navigation */}
                {navigation.map((item, index) => (
                  <div key={item.name} className="pt-3">
                    <div className="mb-2 text-indigo-400 px-3 py-2 text-base font-medium rounded-lg bg-gray-800 shadow-inner">
                      {item.name}
                    </div>
                    {item.subItems && (
                      <div className="space-y-1 ml-4">
                        {item.subItems.map((subItem) => (
                          <Link
                            key={subItem.name}
                            to={subItem.href}
                            className="flex items-center px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition duration-150">
                            <span className="w-2 h-2 bg-gray-500 rounded-full mr-3 flex-shrink-0"></span>
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </DisclosurePanel>
          </>
        )}
      </Disclosure>

      {/* Modals */}
      <LoginModal isOpen={isLoginOpen} setIsOpen={setIsLoginOpen} onLoginSuccess={handleLoginSuccess} />
      <RegisterModal isOpen={isRegisterOpen} setIsOpen={setIsRegisterOpen} />
    </>
  );
}