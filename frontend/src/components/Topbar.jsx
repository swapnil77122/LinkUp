import React from 'react';

export default function Topbar({ darkMode, setDarkMode }) {
  return (
    <div className={`flex items-center justify-between px-4 py-3 ${darkMode ? 'bg-gray-900 text-white' : 'bg-blue-600 text-white'}`}>
      <h1 className="text-lg font-semibold">LinkUp</h1>
      <div className="flex items-center gap-3">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-3 py-1 rounded-md bg-white text-sm font-medium text-gray-800 hover:bg-gray-200"
        >
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
    </div>
  );
}
