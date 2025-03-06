import React, { useEffect, useState } from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';

const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check if user has a preference stored
    const savedMode = localStorage.getItem('darkMode');
    
    // Check if user has OS-level preference for dark mode
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Initialize darkMode state based on stored preference or OS preference
    if (savedMode !== null) {
      setDarkMode(savedMode === 'true');
    } else {
      setDarkMode(prefersDark);
    }
  }, []);

  useEffect(() => {
    // Update class on document element when darkMode changes
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Store preference
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <button
      onClick={toggleDarkMode}
      className="relative inline-flex items-center justify-center p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all duration-300"
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div className={`w-12 h-6 rounded-full p-1 relative transition-colors duration-300 ease-in-out ${darkMode ? 'bg-indigo-600' : 'bg-gray-300'}`}>
        <div className={`absolute inset-0 flex transition-all duration-300 ease-in-out ${darkMode ? 'justify-end' : 'justify-start'}`}>
          <div className="flex items-center justify-center w-5 h-5 rounded-full bg-white shadow transform transition-all duration-300">
            {darkMode ? (
              <MoonIcon className="h-3 w-3 text-indigo-600" />
            ) : (
              <SunIcon className="h-3 w-3 text-yellow-500" />
            )}
          </div>
        </div>
      </div>
      <span className="sr-only">{darkMode ? 'Switch to light mode' : 'Switch to dark mode'}</span>
    </button>
  );
};

export default DarkModeToggle;