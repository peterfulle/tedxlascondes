// src/components/EmptyState.jsx
import React from 'react';

const EmptyState = () => {
  // Función para mostrar icono de búsqueda con X
  const SearchX = (props) => {
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
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        <line x1="17" y1="17" x2="17" y2="17"></line>
        <line x1="21" y1="21" x2="21" y2="21"></line>
      </svg>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center h-64 text-gray-400">
      <SearchX className="h-16 w-16 mb-4 text-gray-600" />
      <p className="text-lg">No se encontraron postulaciones</p>
      <p className="text-sm">Intenta con otros filtros o términos de búsqueda</p>
    </div>
  );
};

export default EmptyState;