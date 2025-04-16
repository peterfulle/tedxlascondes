// src/components/Pagination.jsx
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ 
  currentPage, 
  setCurrentPage, 
  totalPages, 
  totalItems,
  indexOfFirstItem,
  indexOfLastItem
}) => {
  return (
    <div className="flex items-center justify-between mt-6">
      <div className="text-sm text-gray-400">
        Mostrando {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, totalItems)} de {totalItems} postulaciones
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded bg-gray-700 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
          const pageNumber = i + 1;
          return (
            <button
              key={i}
              onClick={() => setCurrentPage(pageNumber)}
              className={`px-3 py-1 rounded ${
                currentPage === pageNumber
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {pageNumber}
            </button>
          );
        })}
        {totalPages > 5 && <span className="px-3 py-1 text-gray-400">...</span>}
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded bg-gray-700 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;