// src/components/ApplicationFilters.jsx
import React from 'react';
import { Search, ChevronDown, List, Grid, Download } from 'lucide-react';
import { CATEGORY_NAMES } from '../utils/constants';

const ApplicationFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  selectedCategory, 
  setSelectedCategory,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  viewMode,
  setViewMode
}) => {
  return (
    <div className="p-4 bg-gray-800 border-b border-gray-700">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Buscador */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="bg-gray-700 border border-gray-600 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="Buscar postulantes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Filtros */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              className="bg-gray-700 border border-gray-600 text-white rounded-lg pl-3 pr-8 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-red-500"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="todas">Todas las categorías</option>
              {Object.entries(CATEGORY_NAMES).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>
          
          <div className="relative">
            <select
              className="bg-gray-700 border border-gray-600 text-white rounded-lg pl-3 pr-8 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-red-500"
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [newSortBy, newSortOrder] = e.target.value.split('-');
                setSortBy(newSortBy);
                setSortOrder(newSortOrder);
              }}
            >
              <option value="fecha-desc">Más recientes primero</option>
              <option value="fecha-asc">Más antiguos primero</option>
              <option value="nombre-asc">Nombre (A-Z)</option>
              <option value="nombre-desc">Nombre (Z-A)</option>
              <option value="evaluacion-desc">Mayor evaluación</option>
              <option value="evaluacion-asc">Menor evaluación</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>
          
          <div className="flex bg-gray-700 rounded-lg p-1">
            <button
              className={`p-1 rounded ${viewMode === 'list' ? 'bg-gray-600' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <List className="h-5 w-5" />
            </button>
            <button
              className={`p-1 rounded ${viewMode === 'grid' ? 'bg-gray-600' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-5 w-5" />
            </button>
          </div>
          
          <button className="flex items-center bg-gray-700 hover:bg-gray-600 text-white rounded-lg px-3 py-2 transition">
            <Download className="h-5 w-5 mr-1" />
            Exportar
          </button>
          
          <button 
            className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 py-2 transition ml-2"
          >
            Nueva postulación
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationFilters;