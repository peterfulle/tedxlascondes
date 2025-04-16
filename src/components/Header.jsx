// src/components/Header.jsx
import React from 'react';

const Header = () => {
  // Función para mostrar icono de campana
  const Bell = (props) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      >
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
      </svg>
    );
  };

  return (
    <header className="bg-gray-800 border-b border-gray-700 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Gestión de Postulaciones TEDx 2025</h1>
        <div className="flex items-center space-x-4">
          <button className="p-1 rounded-full bg-gray-700 text-gray-300 hover:text-white">
            <Bell className="h-6 w-6" />
          </button>
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white font-bold">
              A
            </div>
            <span className="ml-2">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;