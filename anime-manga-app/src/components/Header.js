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
      <Disclosure as="nav" className="bg-gray-800 dark:bg-gray-900">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="relative flex h-16 items-center justify-between">
                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                  <DisclosureButton className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
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
                    <Link to="/" className="text-white text-2xl font-bold">A&M</Link>
                  </div>
                  <div className="hidden sm:ml-6 sm:block">
                    <div className="flex space-x-6">
                      {navigation.map((item, index) => (
                        <div key={item.name} className="relative">
                          {item.subItems ? (
                            <button
                              onClick={() => handleDropdownClick(index)}
                              className={classNames(
                                'text-gray-300 hover:bg-gray-700 hover:text-white',
                                'rounded-md px-3 py-2 text-sm font-medium'
                              )}>
                              {item.name}
                            </button>
                          ) : (
                            <Link
                              to={item.href}
                              className={classNames(
                                'text-gray-300 hover:bg-gray-700 hover:text-white',
                                'rounded-md px-3 py-2 text-sm font-medium'
                              )}>
                              {item.name}
                            </Link>
                          )}
                          {item.subItems && openDropdown === index && (
                            <div className="absolute left-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-gray-700 dark:bg-gray-800 text-white shadow-lg">
                              {item.subItems.map((subItem) => (
                                <Link
                                  key={subItem.name}
                                  to={subItem.href}
                                  className="block px-4 py-2 text-sm hover:bg-gray-600 dark:hover:bg-gray-700">
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
                  <div className="mr-3">
                    <DarkModeToggle />
                  </div>
                  
                  {isLoggedIn ? (
                    <div className="relative">
                      <span className="ml-2 mr-3 text-white">{userData?.username}</span>
                      <button
                        type="button"
                        className="bg-gray-200 text-black dark:bg-gray-700 dark:text-white rounded-full p-2"
                        onClick={() => setUserMenuOpen(!userMenuOpen)}>
                        <UserIcon className="h-6 w-6" />
                      </button>
                      {userMenuOpen && (
                        <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg">
                          <Link
                            to="/UserProfile"
                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                            Profile
                          </Link>
                          <Link
                            to="/mylist"
                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                            MyList
                          </Link>
                          <button
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                            onClick={handleLogout}>
                            Logout
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="bg-gray-200 text-black dark:bg-gray-700 dark:text-white rounded-md px-3 py-2 text-sm font-medium mr-2 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        onClick={() => setIsLoginOpen(true)}>
                        Login
                      </button>
                      <button
                        type="button"
                        className="bg-indigo-600 text-white rounded-md px-3 py-2 text-sm font-medium hover:bg-indigo-700 transition-colors"
                        onClick={() => setIsRegisterOpen(true)}>
                        Register
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            <DisclosurePanel className="sm:hidden">
              <div className="space-y-1 px-2 pb-3 pt-2">
                {isLoggedIn && (
                  <div className="relative">
                    <div className="flex items-center px-3 py-2">
                      <UserIcon className="h-6 w-6 text-gray-300" />
                      <span className="ml-2 text-white">{userData?.username}</span>
                    </div>
                    <div className="ml-4">
                      <Link
                        to="/UserProfile"
                        className="block px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
                        Profile
                      </Link>
                      <Link
                        to="/mylist"
                        className="block px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
                        MyList
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
                        Logout
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Main navigation */}
                {navigation.map((item, index) => (
                  <div key={item.name} className="relative">
                    <div className="text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium cursor-default">
                      {item.name}
                    </div>
                    {item.subItems && (
                      <div className="ml-4">
                        {item.subItems.map((subItem) => (
                          <Link
                            key={subItem.name}
                            to={subItem.href}
                            className="block px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
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