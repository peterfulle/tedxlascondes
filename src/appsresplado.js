import React, { useState, useEffect } from 'react';
import {
  Mic,
  X,
  CheckCircle,
  Calendar,
  Clock,
  Users,
  FileText,
  ChevronRight,
  AlertCircle,
  Info
} from 'lucide-react';

const SpeakerRegistrationPlatform = () => {
  // ... otros estados
  
  // Nuevo estado para controlar el popup
  const [showIntroPopup, setShowIntroPopup] = useState(true);
  const [introStep, setIntroStep] = useState(1); // Para navegación multi-paso en el popup

  // ... resto de código existente

  // Función para cerrar el popup e iniciar el formulario
  const startApplication = () => {
    setShowIntroPopup(false);
  };

  // Renderizado del popup de introducción
  const renderIntroPopup = () => (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center backdrop-blur-md">
      <div className="w-full max-w-4xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl shadow-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto">
        {/* Cabecera del popup */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="text-red-600 font-bold text-3xl mr-2">TEDx</div>
            <div className="text-white font-bold text-xl">LasCondes 2025</div>
          </div>
          <div className="rounded-lg bg-gray-800 px-3 py-1">
            <p className="text-xs text-gray-400">Paso {introStep} de 2</p>
          </div>
        </div>

        {introStep === 1 ? (
          /* Paso 1: Introducción general */
          <>
            <div className="text-center mb-8">
              <div className="inline-block bg-red-600 text-white px-4 py-1 rounded-full text-sm font-medium mb-4 animate-pulse">
                Convocatoria abierta 2025
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">Postula como <span className="text-red-600">Speaker</span></h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Comparte tu idea y forma parte de TEDxLasCondes 2025: "Horizontes Emergentes"
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-900/60 p-6 rounded-xl border border-gray-800 backdrop-blur-sm flex flex-col items-center text-center group hover:border-red-500/50 transition-all">
                <Calendar className="w-10 h-10 text-red-500 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold mb-1">Fecha límite</h3>
                <p className="text-gray-400">15 de Junio, 2025</p>
              </div>
              <div className="bg-gray-900/60 p-6 rounded-xl border border-gray-800 backdrop-blur-sm flex flex-col items-center text-center group hover:border-red-500/50 transition-all">
                <Clock className="w-10 h-10 text-red-500 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold mb-1">Tiempo estimado</h3>
                <p className="text-gray-400">15-20 minutos</p>
              </div>
              <div className="bg-gray-900/60 p-6 rounded-xl border border-gray-800 backdrop-blur-sm flex flex-col items-center text-center group hover:border-red-500/50 transition-all">
                <Users className="w-10 h-10 text-red-500 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold mb-1">Selección</h3>
                <p className="text-gray-400">15 speakers</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-red-900/30 to-black p-6 rounded-xl mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <Mic className="w-6 h-6 mr-2 text-red-500" />
                Acerca de la postulación
              </h2>
              <p className="text-gray-300 mb-4">
                Buscamos ideas originales y transformadoras que merezcan ser compartidas con nuestra audiencia. Si tienes una idea que puede cambiar perspectivas, inspirar acción o generar reflexión, queremos escucharte.
              </p>
              <p className="text-gray-300">
                Las charlas seleccionadas formarán parte del evento principal TEDxLasCondes 2025 y serán grabadas profesionalmente para su difusión global.
              </p>
            </div>

            <div className="flex justify-end">
              <button 
                onClick={() => setIntroStep(2)} 
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition flex items-center font-medium"
              >
                Ver requisitos
                <ChevronRight className="w-5 h-5 ml-1" />
              </button>
            </div>
          </>
        ) : (
          /* Paso 2: Requisitos y documentos */
          <>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">Requisitos de postulación</h2>
              <p className="text-gray-400">Asegúrate de tener preparados los siguientes elementos antes de comenzar</p>
            </div>

            <div className="space-y-6 mb-8">
              <div className="bg-gray-900/60 p-5 rounded-xl border border-gray-800">
                <h3 className="text-xl font-bold mb-3 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-red-500" />
                  Documentos requeridos
                </h3>
                <ul className="space-y-4 pl-2">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Foto de perfil (obligatorio)</p>
                      <p className="text-sm text-gray-400">Formato JPG o PNG, máximo 2MB</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">CV o Currículum (opcional)</p>
                      <p className="text-sm text-gray-400">Formato PDF, máximo 5MB</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Presentación o material de apoyo (opcional)</p>
                      <p className="text-sm text-gray-400">Formato PDF o PPT, máximo 10MB</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-900/60 p-5 rounded-xl border border-gray-800">
                <h3 className="text-xl font-bold mb-3 flex items-center">
                  <Info className="w-5 h-5 mr-2 text-blue-500" />
                  Información que deberás proporcionar
                </h3>
                <ul className="space-y-3 pl-2">
                  <li className="flex items-start">
                    <ChevronRight className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
                    <span>Datos personales y de contacto</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
                    <span>Título y descripción de tu charla</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
                    <span>Impacto esperado y motivación personal</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
                    <span>Disponibilidad para sesiones de coaching y ensayos</span>
                  </li>
                </ul>
              </div>

              <div className="bg-yellow-900/20 border border-yellow-900/30 p-5 rounded-xl">
                <div className="flex items-start">
                  <AlertCircle className="w-6 h-6 text-yellow-500 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-yellow-500 mb-1">Importante</h4>
                    <p className="text-gray-300 text-sm mb-2">
                      El formulario guardará automáticamente tu progreso, permitiéndote continuar más tarde si es necesario.
                    </p>
                    <p className="text-gray-300 text-sm">
                      Si eres seleccionado/a, deberás asistir a sesiones de coaching y ensayos previos al evento principal.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button 
                onClick={() => setIntroStep(1)} 
                className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition"
              >
                Atrás
              </button>
              <button 
                onClick={startApplication} 
                className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-3 rounded-lg hover:from-red-700 hover:to-red-800 transition flex items-center font-medium"
              >
                Iniciar postulación
                <ChevronRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Mostrar el popup si showIntroPopup es true */}
      {showIntroPopup && renderIntroPopup()}

      {/* Header */}
      <header className="bg-black sticky top-0 z-40 border-b border-gray-800">
        {/* ... código del header ... */}
      </header>

      {/* Solo mostrar el contenido principal si el popup está cerrado */}
      {!showIntroPopup && (
        <>
          {/* Hero Section - Eliminamos o reemplazamos con una versión más pequeña */}
          <section className="bg-gradient-to-b from-black to-gray-900 pt-12 pb-8">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Postula como <span className="text-red-600">Speaker</span></h1>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Completa el siguiente formulario para postular
              </p>
            </div>
          </section>

          {/* Contenido Principal */}
          <section className="py-12 bg-gray-900">
            <div className="container mx-auto px-4">
              {renderMainContent()}
            </div>
          </section>

          {/* Footer */}
          <footer className="bg-black py-6 border-t border-gray-800">
            <div className="container mx-auto px-4 text-center">
              <p className="text-gray-400 text-sm">© 2025 TEDxLasCondes. Todos los derechos reservados.</p>
            </div>
          </footer>
        </>
      )}

      {/* Modal de Login - sigue mostrándose independientemente del estado del popup */}
      {showLoginForm && renderLoginForm()}
    </div>
  );
};

export default SpeakerRegistrationPlatform;