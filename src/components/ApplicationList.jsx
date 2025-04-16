// src/components/ApplicationList.jsx
import React from 'react';
import { Eye, Edit, Trash, Star, StarHalf } from 'lucide-react';
import { CATEGORY_NAMES, STATUS_LABELS } from '../utils/constants';

const ApplicationList = ({ applications, onViewDetails, onDelete }) => {
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
    <div className="overflow-x-auto rounded-lg border border-gray-700">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-800">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Postulante
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Charla
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Categorías
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Estado
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Evaluación
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-gray-900 divide-y divide-gray-800">
          {applications.map((application) => (
            <tr key={application.id} className="hover:bg-gray-800 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
                    {application.fotoPerfil ? (
                      <img src={application.fotoPerfil} alt="" className="h-10 w-10 rounded-full" />
                    ) : (
                      <div className="font-bold text-xl">{application.nombre ? application.nombre.charAt(0) : 'A'}</div>
                    )}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium">{application.nombre} {application.apellido}</div>
                    <div className="text-sm text-gray-400">{application.email}</div>
                    <div className="text-xs text-gray-500">{application.ciudad}, {application.pais}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm">{application.tituloCharla}</div>
                <div className="text-xs text-gray-400">Postulado: {new Date(application.fechaPostulacion).toLocaleDateString()}</div>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-wrap gap-1">
                  {application.categorias && application.categorias.map(cat => (
                    <span key={cat} className="px-2 py-1 text-xs rounded-full bg-gray-700">
                      {CATEGORY_NAMES[cat] || cat}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {renderStatusBadge(application.estado)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {renderStars(application.evaluacion)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <button 
                    onClick={() => onViewDetails(application)}
                    className="text-blue-400 hover:text-blue-300 transition"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApplicationList;