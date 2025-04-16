// src/components/ApplicationGrid.jsx
import React from 'react';
import { Eye, Edit, Trash, Star, StarHalf } from 'lucide-react';
import { CATEGORY_NAMES, STATUS_LABELS } from '../utils/constants';

const ApplicationGrid = ({ applications, onViewDetails, onDelete }) => {
  // Renderizar una etiqueta de estado
  const renderStatusBadge = (status) => {
    const { text, color, textColor } = STATUS_LABELS[status] || STATUS_LABELS.pendiente;
    return (
      <span className={`${color} ${textColor} text-xs font-medium px-2.5 py-0.5 rounded-full`}>
        {text}
      </span>
    );
  };

  // Renderizar estrellas de evaluación
  const renderStars = (rating) => {
    const totalStars = 5;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
        ))}
        {hasHalfStar && <StarHalf className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
        {[...Array(totalStars - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
          <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
        ))}
        <span className="ml-1 text-sm text-gray-400">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {applications.map((application) => (
        <div key={application.id} className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-red-500 transition-colors">
          <div className="p-4">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gray-700 flex items-center justify-center">
                  {application.fotoPerfil ? (
                    <img src={application.fotoPerfil} alt="" className="h-12 w-12 rounded-full" />
                  ) : (
                    <div className="font-bold text-xl">{application.nombre ? application.nombre.charAt(0) : 'A'}</div>
                  )}
                </div>
                <div className="ml-3">
                  <div className="text-sm font-medium">{application.nombre} {application.apellido}</div>
                  <div className="text-xs text-gray-400">{application.ciudad}, {application.pais}</div>
                </div>
              </div>
              {renderStatusBadge(application.estado)}
            </div>
            
            <h3 className="text-md font-semibold mb-2 line-clamp-2">{application.tituloCharla}</h3>
            
            <div className="flex flex-wrap gap-1 mb-3">
              {application.categorias && application.categorias.map(cat => (
                <span key={cat} className="px-2 py-0.5 text-xs rounded-full bg-gray-700">
                  {CATEGORY_NAMES[cat] || cat}
                </span>
              ))}
            </div>
            
            <div className="text-xs text-gray-400 mb-2">
              Fecha de postulación: {new Date(application.fechaPostulacion).toLocaleDateString()}
            </div>
            
            <div className="mb-3">
              {renderStars(application.evaluacion)}
            </div>
            
            <div className="flex justify-between mt-4 pt-3 border-t border-gray-700">
              <button 
                onClick={() => onViewDetails(application)}
                className="text-blue-400 hover:text-blue-300 transition flex items-center text-sm"
              >
                <Eye className="h-4 w-4 mr-1" />
                Ver detalles
              </button>
              <div className="flex space-x-2">
                <button className="text-yellow-400 hover:text-yellow-300 transition">
                  <Edit className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => onDelete(application.id)}
                  className="text-red-400 hover:text-red-300 transition"
                >
                  <Trash className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ApplicationGrid;