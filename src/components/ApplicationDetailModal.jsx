// src/components/ApplicationDetailModal.jsx
import React from 'react';
import { X, Check, Mail, MessageCircle, User, Calendar, Mic, FileText, ExternalLink, Globe } from 'lucide-react';
import { CATEGORY_NAMES, STATUS_LABELS } from '../utils/constants';

const ApplicationDetailModal = ({ application, onClose, onStatusChange, onDelete }) => {
  // Renderizar una etiqueta de estado
  const renderStatusBadge = (status) => {
    const { text, color, textColor } = STATUS_LABELS[status] || STATUS_LABELS.pendiente;
    return (
      <span className={`${color} ${textColor} text-xs font-medium px-2.5 py-0.5 rounded-full`}>
        {text}
      </span>
    );
  };

  if (!application) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center sticky top-0 bg-gray-800 z-10">
          <h2 className="text-xl font-bold">{application.id} - Detalles de postulación</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="overflow-y-auto p-6 flex-1">
          {/* Cabecera */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-16 w-16 rounded-full bg-gray-700 flex items-center justify-center">
                {application.fotoPerfil ? (
                  <img src={application.fotoPerfil} alt="" className="h-16 w-16 rounded-full" />
                ) : (
                  <div className="font-bold text-3xl">{application.nombre ? application.nombre.charAt(0) : 'A'}</div>
                )}
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold">{application.nombre} {application.apellido}</h3>
                <p className="text-gray-400">{application.ciudad}, {application.pais}</p>
                <div className="flex items-center mt-1">
                  <Mail className="h-4 w-4 text-gray-500 mr-1" />
                  <a href={`mailto:${application.email}`} className="text-blue-400 hover:underline">{application.email}</a>
                </div>
              </div>
            </div>
            <div>
              {renderStatusBadge(application.estado)}
            </div>
          </div>

          {/* Sección de información personal adicional */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-2 flex items-center">
              <User className="w-5 h-5 text-blue-500 mr-2" />
              Información Personal Completa
            </h4>
            <div className="bg-gray-800 rounded-lg p-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">Teléfono:</p>
                <p className="text-white">{application.telefono}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Email:</p>
                <p className="text-white">{application.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Ciudad:</p>
                <p className="text-white">{application.ciudad}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">País:</p>
                <p className="text-white">{application.pais}</p>
              </div>
            </div>
          </div>

          {/* Sección de redes sociales */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-2 flex items-center">
              <Globe className="w-5 h-5 text-green-500 mr-2" />
              Redes Sociales
            </h4>
            <div className="bg-gray-800 rounded-lg p-4 grid grid-cols-2 gap-4">
              {application.website && (
                <div>
                  <p className="text-sm text-gray-400">Sitio Web:</p>
                  <a href={application.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                    {application.website}
                  </a>
                </div>
              )}
              {application.linkedin && (
                <div>
                  <p className="text-sm text-gray-400">LinkedIn:</p>
                  <a href={application.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                    {application.linkedin}
                  </a>
                </div>
              )}
              {application.twitter && (
                <div>
                  <p className="text-sm text-gray-400">Twitter:</p>
                  <a href={application.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                    {application.twitter}
                  </a>
                </div>
              )}
              {application.instagram && (
                <div>
                  <p className="text-sm text-gray-400">Instagram:</p>
                  <a href={application.instagram} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                    {application.instagram}
                  </a>
                </div>
              )}
              {application.youtube && (
                <div>
                  <p className="text-sm text-gray-400">YouTube:</p>
                  <a href={application.youtube} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                    {application.youtube}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Detalles de la propuesta */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-2 flex items-center">
              <Mic className="w-5 h-5 text-red-500 mr-2" />
              Detalles Completos de la Propuesta
            </h4>
            <div className="bg-gray-800 rounded-lg p-4 space-y-4">
              <div>
                <p className="text-sm text-gray-400">Descripción Breve:</p>
                <p className="text-white">{application.descripcionBreve}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Descripción Detallada:</p>
                <p className="text-white">{application.descripcionDetallada}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Impacto Esperado:</p>
                <p className="text-white">{application.impactoEsperado}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Motivación:</p>
                <p className="text-white">{application.motivacion}</p>
              </div>
              {application.experienciaPrevia && (
                <div>
                  <p className="text-sm text-gray-400">Experiencia Previa:</p>
                  <p className="text-white">{application.experienciaPrevia}</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Información de la charla */}
          <div className="bg-gray-700 rounded-lg p-4 mb-6">
            <h4 className="text-lg font-semibold mb-2 flex items-center">
              <Mic className="w-5 h-5 text-red-500 mr-2" />
              Propuesta de charla
            </h4>
            <div className="mb-4">
              <div className="text-xl font-medium">{application.tituloCharla}</div>
              <div className="text-sm text-gray-400 mt-1">Postulado: {new Date(application.fechaPostulacion).toLocaleDateString()}</div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {application.categorias && application.categorias.map(cat => (
                <span key={cat} className="px-3 py-1 text-sm rounded-full bg-gray-600">
                  {CATEGORY_NAMES[cat] || cat}
                </span>
              ))}
            </div>
          </div>
          
          {/* Sección de biografía */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-2 flex items-center">
              <User className="w-5 h-5 text-blue-500 mr-2" />
              Biografía
            </h4>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-gray-300">{application.biografia}</p>
            </div>
          </div>
          
          {/* Disponibilidad */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-2 flex items-center">
              <Calendar className="w-5 h-5 text-green-500 mr-2" />
              Disponibilidad
            </h4>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {application.disponibilidad && application.disponibilidad.includes('15-mayo-am') && (
                  <div className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    <span>15 de Mayo, 2025 (mañana)</span>
                  </div>
                )}
                {application.disponibilidad && application.disponibilidad.includes('15-mayo-pm') && (
                  <div className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    <span>15 de Mayo, 2025 (tarde)</span>
                  </div>
                )}
                {application.disponibilidad && application.disponibilidad.includes('16-mayo-am') && (
                  <div className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    <span>16 de Mayo, 2025 (mañana)</span>
                  </div>
                )}
                {application.disponibilidad && application.disponibilidad.includes('16-mayo-pm') && (
                  <div className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    <span>16 de Mayo, 2025 (tarde)</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Comentarios internos */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-2 flex items-center">
              <MessageCircle className="w-5 h-5 text-yellow-500 mr-2" />
              Comentarios internos
            </h4>
            <div className="bg-gray-800 rounded-lg p-4">
              <textarea
                className="w-full bg-gray-700 border border-gray-600 rounded p-3 text-white"
                rows="3"
                placeholder="Agrega comentarios internos sobre esta postulación..."
                defaultValue={application.comentariosInternos}
              ></textarea>
            </div>
          </div>
          
          {/* Enlaces a materiales */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-2 flex items-center">
              <FileText className="w-5 h-5 text-purple-500 mr-2" />
              Materiales adjuntos
            </h4>
            <div className="bg-gray-800 rounded-lg p-4 divide-y divide-gray-700">
              <div className="py-2 flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="w-5 h-5 text-gray-400 mr-2" />
                  <span>Foto de perfil</span>
                </div>
                <button className="text-blue-400 hover:text-blue-300 transition flex items-center">
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Ver
                </button>
              </div>
              <div className="py-2 flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="w-5 h-5 text-gray-400 mr-2" />
                  <span>Currículum Vitae</span>
                </div>
                <button className="text-blue-400 hover:text-blue-300 transition flex items-center">
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Ver
                </button>
              </div>
              <div className="py-2 flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="w-5 h-5 text-gray-400 mr-2" />
                  <span>Presentación</span>
                </div>
                <button className="text-blue-400 hover:text-blue-300 transition flex items-center">
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Ver
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer con acciones */}
        <div className="p-4 border-t border-gray-700 flex justify-between items-center sticky bottom-0 bg-gray-800 z-10">
          <div className="flex space-x-2">
            <button
              onClick={() => onStatusChange(application.id, 'pendiente')}
              className="px-4 py-2 rounded-lg bg-yellow-600 text-white hover:bg-yellow-700 transition"
            >
              Marcar pendiente
            </button>
            <button
              onClick={() => onStatusChange(application.id, 'revision')}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              En revisión
            </button>
            <button
              onClick={() => onStatusChange(application.id, 'aprobado')}
              className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
            >
              Aprobar
            </button>
            <button
              onClick={() => onStatusChange(application.id, 'rechazado')}
              className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
            >
              Rechazar
            </button>
          </div>
          <div>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailModal;

