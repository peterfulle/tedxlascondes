import React, { useState, useEffect, lazy, Suspense, useCallback } from 'react';
import { 
  Play, Calendar, Search, Menu, X, ChevronRight, Heart, Share2, 
  Clock, Mic, Globe, Users, Sparkles, 
  ChevronDown 
} from 'lucide-react';
import {
  BrowserRouter,
  Routes,
  Route,
  Link
} from 'react-router-dom';

// Importaciones diferidas para mejorar el rendimiento
const SpeakerRegistrationPlatform = lazy(() => import('./SpeakerRegistrationPlatform'));

// Header mejorado con diseño más elegante y moderno
const Header = ({ isMenuOpen, toggleMenu }) => (
  <header className="bg-black sticky top-0 z-50 border-b border-gray-800">
    <div className="container mx-auto px-4 py-4 flex justify-between items-center">
      <Link to="/" className="flex items-center group">
        <div className="text-red-600 font-bold text-3xl mr-2 transition-transform group-hover:scale-105">TEDx</div>
        <div className="text-white font-bold text-xl transition-transform group-hover:scale-105">LasCondes</div>
      </Link>
      
      {/* Desktop Navigation - Rediseñado para ser más elegante */}
      <nav className="hidden md:flex items-center">
        <div className="flex space-x-1 mr-4 bg-gray-900/40 backdrop-blur-sm px-2 py-1 rounded-full">
          {[
            { name: "Charlas", path: "/charlas" },
            { name: "Eventos", path: "/eventos" },
            { name: "Oradores", path: "/oradores" },
            { name: "Sobre TEDx", path: "/sobre-tedx" }
          ].map((item, index) => (
            <Link 
              key={index}
              to={item.path} 
              className="px-4 py-2 rounded-full hover:bg-gray-800 transition-all text-sm font-medium hover:text-red-500"
            >
              {item.name}
            </Link>
          ))}
        </div>
        
        <div className="flex space-x-3">
          <Link 
            to="/register-speaker" 
            className="border border-gray-700 text-white px-4 py-2 rounded-full hover:border-red-500 hover:text-red-500 transition-all text-sm font-medium"
          >
            Postula como Speaker
          </Link>
          <Link 
            to="/proximo-evento" 
            className="bg-gradient-to-r from-red-600 to-red-700 text-white px-5 py-2 rounded-full hover:from-red-700 hover:to-red-800 transition-all text-sm font-medium flex items-center shadow-lg shadow-red-900/20"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Próximo Evento
          </Link>
        </div>
      </nav>
      
      {/* Mobile Menu Button - Mejorado con transición */}
      <button 
        className="md:hidden bg-gray-900 p-2 rounded-full"
        onClick={toggleMenu}
        aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
      >
        {isMenuOpen ? (
          <X className="w-5 h-5 text-red-500" />
        ) : (
          <Menu className="w-5 h-5 text-white" />
        )}
      </button>
    </div>
    
    {/* Mobile Navigation - Animación y diseño mejorado */}
    {isMenuOpen && (
      <div className="md:hidden bg-gray-900/95 backdrop-blur-md py-4 animate-fadeIn border-b border-gray-800 absolute w-full">
        <div className="container mx-auto px-4 space-y-2">
          {[
            { name: "Charlas", path: "/charlas" },
            { name: "Eventos", path: "/eventos" },
            { name: "Oradores", path: "/oradores" },
            { name: "Sobre TEDx", path: "/sobre-tedx" }
          ].map((item, index) => (
            <Link 
              key={index}
              to={item.path} 
              className="block py-3 px-4 hover:bg-gray-800 rounded-lg hover:text-red-500 transition"
            >
              {item.name}
            </Link>
          ))}
          <div className="pt-3 space-y-3 border-t border-gray-800 mt-3">
            <Link 
              to="/register-speaker" 
              className="block w-full text-center border border-gray-700 py-3 px-4 rounded-lg hover:bg-gray-800 hover:text-red-500 transition"
            >
              Postula como Speaker
            </Link>
            <Link 
              to="/proximo-evento" 
              className="bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-4 rounded-lg w-full hover:from-red-700 hover:to-red-800 transition flex items-center justify-center"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Próximo Evento
            </Link>
          </div>
        </div>
      </div>
    )}
  </header>
);

// También actualizo el Hero para que combine mejor con el nuevo header
const Hero = ({ countdown }) => (
  <section className="relative h-screen bg-black overflow-hidden">
    {/* Video o imagen de fondo con overlay */}
    <div className="absolute inset-0 bg-gray-900">
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent z-10"></div>
      <img 
        src="/api/placeholder/1920/1080" 
        alt="TEDxLasCondes evento" 
        className="w-full h-full object-cover opacity-70"
        loading="eager"
      />
    </div>
    
    {/* Partículas/Elementos decorativos */}
    <div className="absolute inset-0 z-10 opacity-30">
      <div className="absolute w-40 h-40 rounded-full bg-red-600/20 blur-3xl top-1/4 left-1/4 animate-pulse"></div>
      <div className="absolute w-60 h-60 rounded-full bg-red-600/10 blur-3xl bottom-1/4 right-1/4 animate-pulse" style={{animationDelay: '1s'}}></div>
    </div>
    
    {/* Contenido del Hero */}
    <div className="relative z-20 container mx-auto h-full flex flex-col justify-center px-4 md:px-12">
      <div className="max-w-3xl">
        <div className="bg-gradient-to-r from-red-600 to-red-700 h-1 w-24 mb-8 rounded-full"></div>
        <h1 className="text-5xl md:text-7xl font-bold mb-4 leading-tight">
          <span className="text-white">Ideas que</span> 
          <span className="text-red-600"> transforman</span> 
          <span className="text-white"> nuestro futuro</span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-gray-300">
          TEDxLasCondes 2025: Horizontes Emergentes
        </p>
        <div className="bg-black/40 backdrop-blur-md p-6 rounded-2xl mb-8 inline-block border border-gray-800/50">
          <p className="text-lg mb-4">Próximo evento: 15 de Mayo, 2025</p>
          <div className="grid grid-cols-4 gap-4 text-center">
            {Object.entries(countdown).map(([key, value]) => (
              <div key={key} className="bg-red-600/20 rounded-lg p-3 backdrop-blur-sm">
                <div className="text-3xl font-bold">{value}</div>
                <div className="text-sm">{key === 'days' ? 'Días' : key === 'hours' ? 'Horas' : key === 'minutes' ? 'Min' : 'Seg'}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <a 
            href="#charlas" 
            className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-full flex items-center justify-center hover:from-red-700 hover:to-red-800 transition-all group shadow-lg shadow-red-900/20"
          >
            <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition" />
            Ver charlas destacadas
          </a>
          <Link 
            to="/register-speaker" 
            className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition group"
          >
            <Mic className="w-5 h-5 mr-2 group-hover:scale-110 transition" />
            Postula como speaker
          </Link>
        </div>
      </div>
    </div>
    
    {/* Scroll indicator */}
    <a href="#por-que-tedx" className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-20">
      <ChevronDown className="w-8 h-8 text-white opacity-70" />
    </a>
  </section>
);

const Features = ({ features }) => (
  <section id="por-que-tedx" className="py-20 bg-gradient-to-b from-black to-gray-900">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Por qué TEDxLasCondes?</h2>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          Una plataforma para ideas que transforman, donde conectamos perspectivas locales con impacto global
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-xl hover:shadow-xl hover:shadow-red-600/10 transition group">
            <div className="mb-6 transform group-hover:scale-110 transition duration-300">
              {feature.icon}
            </div>
            <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
            <p className="text-gray-400">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);


// NextEvent rediseñado con popup para waitlist e información de ticket
const NextEvent = ({ events }) => {
  const [showWaitlistPopup, setShowWaitlistPopup] = useState(false);
  const [showInfoPopup, setShowInfoPopup] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleReserveClick = () => {
    setShowWaitlistPopup(true);
    setShowInfoPopup(false);
  };
  
  const handleInfoClick = () => {
    setShowInfoPopup(true);
    setShowWaitlistPopup(false);
  };
  
  const closePopup = () => {
    setShowWaitlistPopup(false);
    setShowInfoPopup(false);
    setIsSubmitted(false);
    setEmail('');
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      // Aquí iría la lógica para guardar el email en la base de datos
    }
  };

  return (
    <section className="py-16 bg-black relative">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header con diseño minimalista */}
          <div className="flex items-center mb-12">
            <div className="w-12 h-0.5 bg-red-600 mr-6"></div>
            <h2 className="text-3xl font-bold">Próximo Evento</h2>
            <div className="ml-auto flex items-center text-gray-400 text-sm">
              <Calendar className="w-4 h-4 mr-2" />
              <span>Noviembre 2025</span>
            </div>
          </div>
          
          {/* Tarjeta de evento con diseño elegante */}
          {events.map(event => (
            <div 
              key={event.id}
              className="bg-gradient-to-b from-gray-900 to-black border border-gray-800 rounded-2xl overflow-hidden"
            >
              <div className="p-8 md:p-10">
                {/* Header del evento */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
                  <div>
                    <div className="inline-flex items-center bg-red-600/10 text-red-500 px-3 py-1 rounded-md text-xs font-medium mb-3">
                      Evento Principal
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight">{event.title}</h3>
                  </div>
                  
                  {/* Contador minimalista */}
                  <div className="mt-6 md:mt-0 flex items-center bg-black/40 px-4 py-3 rounded-xl border border-gray-800">
                    <div className="font-mono text-xl text-red-500 font-medium">30d : 12h : 45m : 20s</div>
                  </div>
                </div>
                
                {/* Contenido principal en formato de grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Columna de información */}
                  <div className="lg:col-span-2">
                    <p className="text-gray-300 leading-relaxed mb-8">
                      {event.description}
                    </p>
                    
                    {/* Detalles del evento en diseño minimalista */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-red-600/10 flex items-center justify-center mr-4 flex-shrink-0">
                          <Calendar className="w-5 h-5 text-red-500" />
                        </div>
                        <div>
                          <h4 className="text-sm text-gray-400">Fecha y Hora</h4>
                          <p className="font-medium">{event.date}, 09:00 - 18:00</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-red-600/10 flex items-center justify-center mr-4 flex-shrink-0">
                          <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-sm text-gray-400">Ubicación</h4>
                          <p className="font-medium">{event.location}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Etiquetas / Temáticas */}
                    <div className="mb-8">
                      <h4 className="text-sm text-gray-400 mb-3">Temáticas del evento</h4>
                      <div className="flex flex-wrap gap-2">
                        {['Innovación', 'Tecnología', 'Sostenibilidad', 'Liderazgo', 'Creatividad'].map((tag, i) => (
                          <span key={i} className="px-3 py-1 bg-gray-800 text-gray-300 text-xs rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button 
                        onClick={handleReserveClick}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                        </svg>
                        Reservar entrada
                      </button>
                      <button 
                        onClick={handleInfoClick}
                        className="border border-gray-700 hover:border-red-500 text-white hover:text-red-500 px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Más información
                      </button>
                    </div>
                  </div>
                  
                  {/* Columna de detalles adicionales */}
                  <div className="lg:col-span-1">
                    <div className="bg-black border border-gray-800 rounded-xl p-6">
                      {/* Fecha destacada */}
                      <div className="flex items-center justify-center mb-8">
                        <div className="text-center">
                          <div className="text-5xl font-bold text-red-600">15</div>
                          <div className="text-sm uppercase tracking-wider mt-1 text-gray-400">Mayo 2025</div>
                        </div>
                      </div>
                      
                      {/* Lista de highlights */}
                      <div className="space-y-4">
                        <h4 className="font-medium text-sm uppercase tracking-wider mb-4">Destacados</h4>
                        {[
                          '12 speakers internacionales',
                          'Networking con líderes de la industria',
                          'Exposición de innovación tecnológica',
                          'Talleres exclusivos para asistentes'
                        ].map((item, i) => (
                          <div key={i} className="flex items-start">
                            <div className="w-5 h-5 rounded-full bg-red-600/10 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                              <svg className="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <p className="text-sm text-gray-300">{item}</p>
                          </div>
                        ))}
                      </div>
                      
                      {/* Badge de plazas limitadas */}
                      <div className="mt-8 bg-red-900/20 rounded-lg p-4 border border-red-900/30">
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="text-sm font-medium text-red-500">¡Plazas limitadas!</p>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                          Tickets no disponibles, pronto se habilitaran.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Panel de otros eventos futuros */}
          <div className="mt-10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium">Eventos Futuros</h3>
              <a href="#" className="text-red-500 text-sm hover:underline flex items-center">
                Ver todos
                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { 
                  title: 'Workshop: Liderazgo Innovador', 
                  date: '22 Junio, 2025', 
                  type: 'Workshop' 
                },
                { 
                  title: 'TEDx Salón: Tecnologías Emergentes', 
                  date: '10 Julio, 2025', 
                  type: 'Salón' 
                },
                { 
                  title: 'Networking: Comunidad TEDx', 
                  date: '05 Agosto, 2025', 
                  type: 'Networking' 
                }
              ].map((item, i) => (
                <div key={i} className="bg-gray-900/30 rounded-lg p-4 border border-gray-800 hover:border-red-500/30 transition-colors group cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs py-1 px-2 bg-gray-800 rounded text-gray-400">{item.type}</span>
                    <span className="text-xs text-gray-500">{item.date}</span>
                  </div>
                  <h4 className="font-medium group-hover:text-red-500 transition-colors">{item.title}</h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Popup de lista de espera */}
      {showWaitlistPopup && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-gradient-to-b from-gray-900 to-black border border-gray-800 rounded-2xl p-8 max-w-md w-full relative animate-fadeIn shadow-2xl">
            {/* Botón de cerrar */}
            <button 
              onClick={closePopup}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
              aria-label="Cerrar"
            >
              <X className="w-6 h-6" />
            </button>
            
            {!isSubmitted ? (
              <>
                <div className="text-center mb-6">
                  <div className="bg-red-600/20 p-3 rounded-full inline-flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">¡Tickets no disponibles!</h3>
                  <p className="text-gray-400">Ingresa a nuestra lista de espera y te notificaremos cuando liberemos nuevos tickets.</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="waitlist-email" className="block text-sm font-medium mb-2">Correo electrónico</label>
                    <input 
                      id="waitlist-email"
                      type="email" 
                      placeholder="tu@email.com" 
                      className="w-full bg-black/50 border border-gray-700 focus:border-red-500 rounded-lg p-3 text-white placeholder-gray-500 transition-all outline-none"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <button 
                    type="submit"
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white font-medium py-3 rounded-lg hover:from-red-700 hover:to-red-800 transition-all flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Unirme a la lista de espera
                  </button>
                </form>
                
                <div className="mt-6 text-center text-sm text-gray-500">
                  Te notificaremos por email cuando haya disponibilidad de tickets
                </div>
              </>
            ) : (
              <div className="text-center py-6">
                <div className="bg-green-500/20 p-4 rounded-full inline-flex items-center justify-center mb-6">
                  <svg className="w-12 h-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-3">¡Gracias por registrarte!</h3>
                <p className="text-gray-400 mb-6">
                  Te hemos añadido a nuestra lista de espera y te notificaremos cuando haya disponibilidad de tickets.
                </p>
                <button 
                  onClick={closePopup}
                  className="bg-white text-gray-900 font-medium px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Popup de información de tickets */}
      {showInfoPopup && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-gradient-to-b from-gray-900 to-black border border-gray-800 rounded-2xl p-8 max-w-4xl w-full relative animate-fadeIn shadow-2xl">
            {/* Botón de cerrar */}
            <button 
              onClick={closePopup}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
              aria-label="Cerrar"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Columna de información */}
              <div>
                <div className="flex items-center mb-6">
                  <div className="bg-red-600/20 p-3 rounded-full inline-flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold">Información de Tickets</h3>
                </div>
                
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Adquirir un ticket para TEDxVitacura es mucho más que asistir a un evento. Es formar parte de una comunidad global dedicada a difundir ideas que pueden transformar nuestro mundo.
                </p>
                
                <div className="space-y-6">
                  <div className="border-b border-gray-800 pb-4">
                    <h4 className="font-semibold text-lg mb-2 flex items-center">
                      <span className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center mr-3 text-white text-sm">1</span>
                      Acceso Completo al Evento
                    </h4>
                    <p className="text-gray-400 pl-11">
                      Tu ticket te da acceso a todas las charlas, actividades de networking, y experiencias interactivas durante el evento principal.
                    </p>
                  </div>
                  
                  <div className="border-b border-gray-800 pb-4">
                    <h4 className="font-semibold text-lg mb-2 flex items-center">
                      <span className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center mr-3 text-white text-sm">2</span>
                      Material Exclusivo
                    </h4>
                    <p className="text-gray-400 pl-11">
                      Recibirás un kit de bienvenida con merchandising exclusivo del evento, además de material y recursos relacionados con las charlas.
                    </p>
                  </div>
                  
                  <div className="border-b border-gray-800 pb-4">
                    <h4 className="font-semibold text-lg mb-2 flex items-center">
                      <span className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center mr-3 text-white text-sm">3</span>
                      Acceso a la Comunidad TEDx
                    </h4>
                    <p className="text-gray-400 pl-11">
                      Formarás parte de nuestra comunidad global de innovadores, creativos y líderes de pensamiento comprometidos con las ideas que transforman.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Columna de tickets */}
              <div className="bg-black/40 rounded-xl p-6 border border-gray-800">
                <h4 className="text-xl font-bold mb-6 text-center">Tipos de Tickets</h4>
                
                
                  
                  
                  
                  
                
                {/* CTA para unirse a la lista de espera */}
                <div className="mt-8 bg-red-600/10 rounded-lg p-5 border border-red-600/20">
                  <h5 className="font-medium mb-2 flex items-center">
                    <svg className="w-5 h-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Tickets actualmente agotados
                  </h5>
                  <p className="text-gray-400 text-sm mb-4">
                    Todas las categorías de tickets están temporalmente agotadas. Únete a nuestra lista de espera para ser notificado cuando estén disponibles nuevamente.
                  </p>
                  <button 
                    onClick={handleReserveClick}
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white font-medium py-3 rounded-lg hover:from-red-700 hover:to-red-800 transition-all flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                    </svg>
                    Unirme a la lista de espera
                  </button>
                </div>
              </div>
            </div>
            
            
          </div>
        </div>
      )}
      
      {/* Estilos para la animación del popup */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </section>
  );
};


                      

                      




                      

// SearchSection mejorado con diseño más interactivo y moderno
const SearchSection = () => (
  <section className="py-16 bg-black relative overflow-hidden">
    {/* Fondo con elementos decorativos */}
    <div className="absolute inset-0">
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-red-600/5 blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-red-600/10 blur-3xl"></div>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md"></div>
    </div>
    
    <div className="container mx-auto px-4 relative z-10">
      <div className="max-w-4xl mx-auto bg-gradient-to-r from-gray-900 to-black p-10 rounded-3xl border border-gray-800/50 shadow-2xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center mb-6 bg-red-600/20 text-red-500 p-3 rounded-xl">
            <Search className="w-6 h-6" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Descubre ideas inspiradoras</h2>
          <p className="text-gray-400 text-lg">Explora nuestro catálogo de charlas por tema, orador o palabra clave</p>
        </div>
        
        <div className="relative mt-8">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-gray-500" />
          </div>
          
          <input
            type="text"
            placeholder="¿Qué tema te interesa explorar?"
            className="w-full bg-black/50 border-2 border-gray-800 focus:border-red-600 rounded-xl py-4 pl-14 pr-36 text-white placeholder-gray-500 transition-all focus:ring-4 focus:ring-red-600/20 outline-none"
            aria-label="Buscar contenido"
          />
          
          <div className="absolute right-3 top-3">
            <button 
              className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-2 rounded-lg shadow-lg shadow-red-900/20 hover:from-red-700 hover:to-red-800 transition-all"
              aria-label="Iniciar búsqueda"
            >
              Buscar
            </button>
          </div>
        </div>
        
        {/* Búsquedas populares */}
        <div className="mt-6 flex flex-wrap justify-center">
          <span className="text-sm text-gray-400 mr-3 mt-2">Búsquedas populares:</span>
          {["Innovación", "Tecnología", "Sostenibilidad", "Educación", "Liderazgo"].map((tag, index) => (
            <button 
              key={index}
              className="bg-gray-800/50 text-sm text-gray-300 px-4 py-1.5 rounded-full hover:bg-red-600/20 hover:text-white transition-all mt-2 mr-2"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// FeaturedTalks mejorado con diseño más potente y llamativo
const FeaturedTalks = ({ talks }) => {
  const featuredTalks = talks.filter(talk => talk.featured);
  
  return (
    <section id="charlas-destacadas" className="py-20 bg-gradient-to-b from-black to-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center mb-2">
              <div className="w-10 h-1 bg-red-600 rounded-full mr-4"></div>
              <h2 className="text-3xl md:text-5xl font-bold">Charlas destacadas</h2>
            </div>
            <p className="text-gray-400 text-lg mt-4 max-w-2xl">
              Ideas revolucionarias que están transformando perspectivas y abriendo nuevos horizontes
            </p>
          </div>
          <Link 
            to="/charlas" 
            className="group flex items-center bg-black/30 backdrop-blur-sm px-6 py-3 rounded-full border border-gray-800 hover:border-red-500 transition-all"
          >
            <span className="mr-2 text-white group-hover:text-red-500 transition-colors">Ver todas las charlas</span>
            <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center group-hover:bg-red-700 transition-colors">
              <ChevronRight className="w-5 h-5 text-white group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {featuredTalks.map(talk => (
            <div 
              key={talk.id} 
              className="bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden group hover:shadow-2xl hover:shadow-red-900/20 transition-all cursor-pointer hover:-translate-y-2 duration-300 border border-gray-800/30 hover:border-red-500/30"
            >
              <div className="relative">
                <img 
                  src={talk.image} 
                  alt={talk.title} 
                  className="w-full h-64 object-cover group-hover:scale-105 transition duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80"></div>
                
                {/* Overlay con efecto hover */}
                <div className="absolute inset-0 bg-red-900/0 group-hover:bg-red-900/20 transition-colors duration-300 flex items-center justify-center">
                  <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-500 shadow-xl">
                    <Play className="w-10 h-10 text-white" />
                  </div>
                </div>
                
                {/* Badge */}
                <div className="absolute top-4 left-4 bg-gradient-to-r from-red-600 to-red-700 text-white text-xs px-3 py-1.5 rounded-full flex items-center shadow-lg">
                  <span className="w-1.5 h-1.5 bg-white rounded-full mr-1.5 animate-pulse"></span>
                  Destacado
                </div>
                
                {/* Duración */}
                <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm flex items-center shadow-lg">
                  <Clock className="w-3.5 h-3.5 mr-1.5 text-red-500" />
                  {talk.duration}
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-medium bg-red-500/10 text-red-400 px-3 py-1 rounded-full">{talk.category}</span>
                  <span className="text-xs text-gray-400">{talk.date}</span>
                </div>
                
                <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-red-500 transition-colors">{talk.title}</h3>
                
                <div className="flex items-center mb-4">
                  <div className="w-9 h-9 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center mr-3 text-sm font-bold">
                    {talk.speaker.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{talk.speaker}</p>
                    <p className="text-xs text-gray-500">{talk.views} visualizaciones</p>
                  </div>
                </div>
                
                <div className="pt-3 border-t border-gray-800 flex justify-between text-xs text-gray-500">
                  <button className="hover:text-red-500 transition-colors flex items-center" aria-label="Guardar charla">
                    <Heart className="w-4 h-4 mr-1.5" />
                    <span>Guardar</span>
                  </button>
                  <button className="hover:text-red-500 transition-colors flex items-center" aria-label="Compartir charla">
                    <Share2 className="w-4 h-4 mr-1.5" />
                    <span>Compartir</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// SpeakerCTA mejorado con diseño horizontal para las características
const SpeakerCTA = () => (
  <section className="py-24 bg-black relative overflow-hidden">
    {/* Fondo con patrón de grid */}
    <div className="absolute inset-0 opacity-10">
      <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <pattern id="speaker-grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
          <linearGradient id="speaker-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#dc2626" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#speaker-grid)" />
        <rect width="100%" height="100%" fill="url(#speaker-gradient)" />
      </svg>
    </div>
    
    <div className="container mx-auto px-4 relative z-10">
      <div className="bg-gradient-to-br from-gray-900 via-black to-black rounded-3xl overflow-hidden border border-gray-800 shadow-2xl shadow-red-900/10">
        <div className="p-10 md:p-16">
          <div className="flex items-center mb-6">
            <div className="w-10 h-1 bg-red-600 rounded-full mr-4"></div>
            <span className="text-red-500 font-medium">Convocatoria abierta</span>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 mb-12">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">Comparte tus ideas en nuestro escenario</h2>
              <p className="text-xl text-gray-300 leading-relaxed">
                ¿Tienes una idea poderosa que merece ser difundida? Postula como speaker para la próxima edición de TEDxLasCondes y forma parte de nuestra comunidad global de innovadores y pensadores.
              </p>
            </div>
            
            <div className="flex-shrink-0">
              <img 
                src="/api/placeholder/500/300" 
                alt="Speaker en TEDxLasCondes" 
                className="rounded-xl shadow-lg shadow-red-900/30 transform rotate-2 border-4 border-gray-800"
                loading="lazy"
              />
              
              {/* Sello o distintivo */}
              <div className="bg-red-600 rounded-full h-24 w-24 flex items-center justify-center transform -translate-y-12 translate-x-6 rotate-12 shadow-lg shadow-red-900/50 border-4 border-white/20">
                <div className="text-center">
                  <div className="font-bold text-white text-sm">Postula</div>
                  <div className="text-white/80 text-xs">hasta</div>
                  <div className="font-bold text-white text-sm">15 Jun</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Características en diseño horizontal */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {[
              { 
                title: "Ideas originales", 
                desc: "Buscamos ideas frescas y perspectivas que desafíen lo convencional",
                icon: <Sparkles className="w-5 h-5 text-white" />
              },
              { 
                title: "Impacto tangible", 
                desc: "Priorizamos ideas con potencial para generar cambios positivos en nuestra sociedad",
                icon: <Globe className="w-5 h-5 text-white" />
              },
              { 
                title: "Acompañamiento profesional", 
                desc: "Te brindamos coaching y apoyo para pulir tu presentación",
                icon: <Users className="w-5 h-5 text-white" />
              },
              { 
                title: "Plataforma global", 
                desc: "Tu charla será grabada profesionalmente y compartida con audiencia mundial",
                icon: <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              }
            ].map((item, index) => (
              <div key={index} className="flex flex-col h-full bg-gradient-to-br from-gray-800/50 to-black/50 p-5 rounded-xl border border-gray-700/30 hover:border-red-500/30 transition-all hover:shadow-lg hover:shadow-red-900/10 group">
                <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-lg p-3 w-12 h-12 mb-4 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h3 className="font-bold text-lg mb-2 group-hover:text-red-500 transition-colors">{item.title}</h3>
                <p className="text-gray-400 text-sm flex-grow">{item.desc}</p>
              </div>
            ))}
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-8 bg-black/30 p-6 rounded-xl border border-gray-800">
            <div className="md:w-2/3">
              <Link 
                to="/register-speaker" 
                className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-xl hover:from-red-700 hover:to-red-800 transition-all flex items-center justify-center w-full font-medium shadow-lg shadow-red-900/20"
              >
                <Mic className="w-5 h-5 mr-3" />
                Postula como speaker
              </Link>
            </div>
            
            {/* Testimonial integrado */}
            <div className="md:w-1/3 flex items-center">
              <img 
                src="/api/placeholder/100/100" 
                alt="Speaker TEDx anterior" 
                className="w-12 h-12 rounded-full mr-4 object-cover border-2 border-red-600 flex-shrink-0"
              />
              <div>
                <p className="text-sm text-gray-300 italic">"Participar como speaker en TEDx transformó mi carrera profesional y me conectó con personas increíbles."</p>
                <p className="text-xs text-gray-500 mt-1">— Carolina Méndez, Speaker TEDxLasCondes 2024</p>
              </div>
            </div>
          </div>
          
          {/* Estadística */}
          <div className="text-center mt-8 py-4 bg-black/20 rounded-xl backdrop-blur-sm">
            <div className="text-3xl font-bold text-white mb-2">18+ Speakers</div>
            <p className="text-white/80">han compartido sus ideas transformadoras en nuestro escenario</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// Testimonials mejorado con diseño más elegante y moderno
const Testimonials = ({ testimonials }) => (
  <section className="py-24 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
    {/* Elementos decorativos de fondo */}
    <div className="absolute inset-0 overflow-hidden opacity-30">
      <svg className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 text-red-600/10" viewBox="0 0 200 200" fill="currentColor">
        <path d="M46.8,95.3c-8.3,14.3-21.3,19.7-35.6,18.4c-8.3-0.8-15.5-4.1-21.2-9.4c-2.3-2.1-3-1-3,2.1 c0.1,14.9,5.8,29.5,15.9,41c18.1,20.7,38,22.6,47,22.6c22.3,0,39.7-8.3,49.5-19.3c6.4-7.1,10.4-15.3,13.1-25.1 c9.7-35.1-14.4-74.3-54.1-86.9c-26.9-8.6-55.5-1.9-75.3,17.6c-11.7,11.6-15.9,21-16.4,21.9c-0.3,0.5-0.1,1.3,1.3,1.3 c15-0.2,32.1,0.4,53.9,12.1C27.9,97.4,40.7,78.7,46.8,95.3z"/>
      </svg>
      <svg className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 text-red-600/10" viewBox="0 0 200 200" fill="currentColor">
        <path d="M38.9,54.5c19.4,3.8,34.5,15.5,43.7,33.5c4.2,8.3,5.6,17.2,5,25.5c-0.7,4.2,0.2,4.5,3.2,2.9 c12.4-6.7,22.6-17.5,28.7-31.6c10.6-24.5,3.7-46.4-1.4-55.4c-12.5-22.6-32.1-32.4-46.8-34.3c-8-1-16.3,0.3-24.9,0.6 c-30.5,1-59.8,35.9-61.9,73c-1.4,25.1,9.7,47.3,29.1,64.6c11.1,10.1,22.3,14.7,23.8,15.3c0.5,0.2,1.5-0.1,1-1.4 c-6.2-17.2-11.7-32.2-6.2-52.6C38.4,76.6,15.2,70.4,38.9,54.5z"/>
      </svg>
    </div>
    
    <div className="container mx-auto px-4 relative z-10">
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center mb-6 bg-red-600/20 p-3 rounded-full">
          <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
          </svg>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold mb-4">Nuestros lideres</h2>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          Testimonios del equipo directivo de TEDxLasCondes
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <div 
            key={testimonial.id} 
            className="bg-gradient-to-br from-black to-gray-900 p-8 rounded-2xl border border-gray-800 hover:border-red-600/30 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl hover:shadow-red-900/10 relative"
          >
            {/* Comillas grandes estilizadas */}
            <div className="absolute -top-5 -left-2 text-red-600/10 text-7xl font-serif">
              "
            </div>
            
            <div className="relative">
              <div className="mb-6">
                {/* Estrellas de valoración */}
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-red-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                
                <blockquote className="mb-8">
                  <p className="text-gray-300 italic leading-relaxed text-lg">"{testimonial.quote}"</p>
                </blockquote>
              </div>
              
              <div className="flex items-center">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.author}
                  className="w-14 h-14 rounded-full object-cover border-2 border-red-500/30 mr-4 shadow-lg"
                  loading="lazy"
                />
                <div>
                  <h4 className="font-bold text-lg">{testimonial.author}</h4>
                  <p className="text-sm text-gray-400">{testimonial.role}</p>
                  
                  {/* Indicador de evento */}
                  <div className="flex items-center mt-1 text-xs text-gray-500">
                    <Calendar className="w-3 h-3 mr-1" />
                    <span>Edición 2024</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Elemento decorativo - círculo */}
            <div className="absolute -bottom-3 -right-3 w-16 h-16 rounded-full bg-gradient-to-br from-red-600/10 to-transparent"></div>
          </div>
        ))}
      </div>
      
      {/* CTA para enviar tu propio testimonio */}
      <div className="mt-16 text-center">
        <button className="bg-transparent border-2 border-gray-700 hover:border-red-500 text-white px-8 py-4 rounded-xl transition-all group inline-flex items-center">
          <span className="mr-2 group-hover:text-red-500">Comparte tu experiencia</span>
          <svg className="w-5 h-5 group-hover:text-red-500 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>
    </div>
  </section>
);



// Sponsors rediseñado con efecto de marquee para todos los patrocinadores
const Sponsors = ({ sponsors }) => {
  // Separamos los sponsors por tipo para mejor organización
  const platinumSponsors = sponsors.filter(s => s.tier === 'platinum');
  const goldSponsors = sponsors.filter(s => s.tier === 'gold');
  const silverSponsors = sponsors.filter(s => s.tier === 'silver');
  
  // Media partners (simulados para el ejemplo)
  const mediaPartners = [
    { id: 101, name: "Radio Global", image: "/api/placeholder/180/70", type: "radio" },
    { id: 102, name: "Diario Innovación", image: "/api/placeholder/180/70", type: "prensa" },
    { id: 103, name: "Canal Futuro", image: "/api/placeholder/180/70", type: "tv" },
    { id: 104, name: "Tech Magazine", image: "/api/placeholder/180/70", type: "revista" },
    { id: 105, name: "Podcast Ideas", image: "/api/placeholder/180/70", type: "podcast" }
  ];
  
  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-red-600 blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full bg-red-600 blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Encabezado principal */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="w-16 h-1 bg-red-600 rounded-full mb-6"></div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Nuestros Aliados</h2>
          <p className="text-xl text-gray-400 max-w-3xl">
            Empresas, organizaciones y medios que hacen posible amplificar las ideas de TEDxLasCondes
          </p>
        </div>
        
        {/* Platinum Sponsors - Con marquee */}
        {platinumSponsors.length > 0 && (
          <div className="mb-20">
            <div className="flex items-center mb-8">
              <div className="flex-shrink-0">
                <span className="inline-flex items-center justify-center bg-red-600/20 text-red-500 p-2 rounded-lg">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </span>
              </div>
              <h3 className="text-2xl font-bold ml-3 text-white">Platinum Sponsors</h3>
              <div className="h-px bg-gradient-to-r from-gray-700 to-transparent flex-grow ml-4"></div>
            </div>
            
            <div className="overflow-hidden relative py-5">
              {/* Efecto gradiente en los bordes */}
              <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-gray-900 to-transparent z-10"></div>
              <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-gray-900 to-transparent z-10"></div>
              
              {/* Marquee automático de platinum sponsors */}
              <div className="flex space-x-10 animate-marquee-slow py-2">
                {[...platinumSponsors, ...platinumSponsors, ...platinumSponsors].map((sponsor, index) => (
                  <div 
                    key={`platinum-${sponsor.id}-${index}`} 
                    className="flex-shrink-0 bg-gradient-to-br from-gray-800 to-black p-8 rounded-2xl border border-gray-700 flex items-center group hover:border-red-500/30 transition-colors w-64"
                  >
                    <div className="flex flex-col items-center w-full">
                      <div className="bg-red-600/90 text-white text-xs px-2 py-1 rounded-full uppercase font-bold tracking-wider mb-4">
                        Platinum
                      </div>
                      <img 
                        src={sponsor.image} 
                        alt={sponsor.name} 
                        className="h-16 object-contain mb-6 filter grayscale group-hover:filter-none transition duration-500"
                        loading="lazy"
                      />
                      <h4 className="text-lg font-bold text-center text-white mb-2">{sponsor.name}</h4>
                      <p className="text-gray-400 text-xs text-center">Patrocinador principal</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Gold Sponsors - Con marquee */}
        {goldSponsors.length > 0 && (
          <div className="mb-20">
            <div className="flex items-center mb-8">
              <span className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></span>
              <h3 className="text-xl font-bold text-white">Gold Sponsors</h3>
              <div className="h-px bg-gradient-to-r from-gray-700 to-transparent flex-grow ml-4"></div>
            </div>
            
            <div className="overflow-hidden relative py-5">
              {/* Efecto gradiente en los bordes */}
              <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-gray-900 to-transparent z-10"></div>
              <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-gray-900 to-transparent z-10"></div>
              
              {/* Marquee automático en dirección contraria */}
              <div className="flex space-x-8 animate-marquee-reverse py-2">
                {[...goldSponsors, ...goldSponsors, ...goldSponsors].map((sponsor, index) => (
                  <div 
                    key={`gold-${sponsor.id}-${index}`} 
                    className="flex-shrink-0 bg-black/60 backdrop-blur-sm p-6 rounded-xl border border-gray-800 hover:border-yellow-500/30 transition-all flex flex-col items-center justify-center group w-48 h-36"
                  >
                    <img 
                      src={sponsor.image} 
                      alt={sponsor.name} 
                      className="h-12 object-contain mb-4 filter grayscale group-hover:filter-none transition duration-500"
                      loading="lazy"
                    />
                    <h4 className="text-sm font-medium text-center text-gray-300 group-hover:text-white transition-colors">{sponsor.name}</h4>
                    <div className="mt-2 w-8 h-0.5 bg-yellow-500/30"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Silver Sponsors - Con marquee */}
        {silverSponsors.length > 0 && (
          <div className="mb-20">
            <div className="flex items-center mb-8">
              <span className="w-2 h-2 rounded-full bg-gray-400 mr-2"></span>
              <h3 className="text-xl font-bold text-white">Silver Sponsors</h3>
              <div className="h-px bg-gradient-to-r from-gray-700 to-transparent flex-grow ml-4"></div>
            </div>
            
            <div className="overflow-hidden relative py-5">
              {/* Efecto gradiente en los bordes */}
              <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-gray-900 to-transparent z-10"></div>
              <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-gray-900 to-transparent z-10"></div>
              
              {/* Marquee automático, velocidad normal */}
              <div className="flex space-x-6 animate-marquee py-2">
                {[...silverSponsors, ...silverSponsors, ...silverSponsors].map((sponsor, index) => (
                  <div 
                    key={`silver-${sponsor.id}-${index}`} 
                    className="flex-shrink-0 bg-black/60 backdrop-blur-sm p-4 rounded-xl border border-gray-800 hover:border-gray-500/30 transition-all flex flex-col items-center justify-center group w-36 h-28"
                  >
                    <img 
                      src={sponsor.image} 
                      alt={sponsor.name} 
                      className="h-10 object-contain mb-3 filter grayscale group-hover:filter-none transition duration-500"
                      loading="lazy"
                    />
                    <h4 className="text-xs font-medium text-center text-gray-400 group-hover:text-white transition-colors">{sponsor.name}</h4>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Media Partners - Con marquee */}
        <div className="mb-20">
          <div className="flex items-center mb-8">
            <div className="flex-shrink-0">
              <span className="inline-flex items-center justify-center bg-red-600/20 text-red-500 p-2 rounded-lg">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </span>
            </div>
            <h3 className="text-2xl font-bold ml-3 text-white">Media Partners</h3>
            <div className="h-px bg-gradient-to-r from-gray-700 to-transparent flex-grow ml-4"></div>
          </div>
          
          <div className="overflow-hidden relative py-5">
            {/* Efecto gradiente en los bordes */}
            <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-gray-900 to-transparent z-10"></div>
            <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-gray-900 to-transparent z-10"></div>
            
            {/* Marquee automático de media partners */}
            <div className="flex space-x-8 animate-marquee-fast py-2">
              {[...mediaPartners, ...mediaPartners, ...mediaPartners].map((partner, index) => (
                <div 
                  key={`media-${partner.id}-${index}`} 
                  className="flex-shrink-0 bg-black/40 backdrop-blur-sm px-6 py-4 rounded-xl border border-gray-800 flex items-center group hover:border-red-500/30 transition-colors"
                >
                  <img 
                    src={partner.image} 
                    alt={partner.name} 
                    className="h-12 w-auto object-contain filter grayscale group-hover:filter-none transition duration-500"
                    loading="lazy"
                  />
                  <div className="ml-5">
                    <h4 className="font-medium text-white">{partner.name}</h4>
                    <p className="text-xs text-gray-400 capitalize">{partner.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* CTA de patrocinio */}
        <div className="bg-gradient-to-r from-red-900/30 via-black to-black p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0 md:mr-6">
            <h3 className="text-2xl font-bold mb-2">¿Te gustaría ser parte de TEDxLasCondes?</h3>
            <p className="text-gray-400">Conoce los beneficios de patrocinar nuestro evento y las diferentes formas de colaboración</p>
          </div>
          <div className="flex space-x-4">
            <button className="bg-white text-red-900 font-bold px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors shadow-lg">
              Kit de patrocinio
            </button>
            <button className="bg-transparent border-2 border-red-600 text-white hover:bg-red-600 px-6 py-3 rounded-xl transition-all duration-300 font-semibold">
              Conviértete en patrocinador
            </button>
          </div>
        </div>
        
        {/* Estadísticas de patrocinio */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: "35+", label: "Patrocinadores", icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" },
            { value: "12K+", label: "Alcance en vivo", icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" },
            { value: "96%", label: "Satisfacción", icon: "M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" },
            { value: "5M+", label: "Visualizaciones online", icon: "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" }
          ].map((stat, index) => (
            <div key={index} className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-xl border border-gray-800 text-center group hover:border-red-500/30 transition-all duration-300 hover:-translate-y-1">
              <div className="bg-red-600/20 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center group-hover:bg-red-600/30 transition-colors">
                <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                </svg>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Animaciones de estilo "keyframes" para los diferentes marquees */}
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-reverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee-slow {
          animation: marquee 50s linear infinite;
        }
        .animate-marquee-fast {
          animation: marquee 25s linear infinite;
        }
        .animate-marquee-reverse {
          animation: marquee-reverse 40s linear infinite;
        }
      `}</style>
    </section>
  );
};


// Continuación del componente FAQ
const FAQ = () => {
  // Estado para controlar qué pregunta está abierta
  const [openQuestion, setOpenQuestion] = useState(null);
  
  // Lista de preguntas y respuestas
  const faqs = [
    {
      q: "¿Qué es TEDx?",
      a: "TEDx es un programa de eventos locales autoorganizados que reúnen a la gente para compartir una experiencia similar a TED. Nuestro evento es llamado TEDxLasCondes, donde x = evento TED organizado independientemente. A través de TEDxLasCondes, queremos difundir ideas valiosas y conectar a nuestra comunidad con perspectivas innovadoras que pueden transformar nuestra sociedad y entorno."
    },
    {
      q: "¿Cómo puedo asistir al evento?",
      a: "Puedes adquirir tus entradas a través de nuestra plataforma de venta de tickets en esta misma web. Los precios varían según el tipo de entrada (General, Premium o VIP) y la anticipación con la que compres. Recomendamos adquirir tus entradas con tiempo ya que nuestros eventos suelen agotar localidades. Mantente atento a nuestras redes sociales para enterarte cuando se abra la venta de entradas."
    },
    {
      q: "¿Puedo postular como voluntario?",
      a: "¡Sí! TEDxLasCondes cuenta con un equipo de voluntarios comprometidos que hacen posible cada evento. Abrimos convocatorias periódicamente a través de nuestras redes sociales y web. Si estás interesado en formar parte de nuestro equipo, envíanos un correo a voluntarios@tedxlascondes.cl con tu CV y una breve carta explicando por qué te gustaría unirte. Los voluntarios tienen acceso gratuito al evento y participan en capacitaciones exclusivas."
    },
    {
      q: "¿Cómo funciona el proceso de selección de speakers?",
      a: "Nuestro comité de contenido evalúa todas las postulaciones basándose en la originalidad, relevancia e impacto potencial de la idea. El proceso consta de varias etapas: postulación inicial, entrevista, desarrollo de la idea y ensayos. Los seleccionados pasan por un proceso de coaching de 2-3 meses para preparar su charla para el evento principal. Buscamos ideas originales que puedan generar un impacto positivo y perspectivas que no hayan sido ampliamente difundidas en nuestra comunidad."
    },
    {
      q: "¿Las charlas se graban y publican en línea?",
      a: "Sí, todas las charlas se graban profesionalmente y se publican en nuestro canal de YouTube y en esta web después del evento, permitiendo que las ideas alcancen una audiencia global. Cada charla pasa por un proceso de edición y se publica aproximadamente 3-4 semanas después del evento. Los speakers reciben también el material editado para su uso personal. Estas grabaciones permiten amplificar el impacto de las ideas y llegar a audiencias en todo el mundo."
    }
  ];
  
  // Función para cambiar la pregunta abierta
  const toggleQuestion = (index) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };
  
  return (
    <section className="py-24 bg-gradient-to-b from-black to-gray-900 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-1/2 h-1/2">
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <circle cx="0" cy="0" r="50" fill="url(#red-gradient)" />
          </svg>
        </div>
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2">
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <circle cx="100" cy="100" r="50" fill="url(#red-gradient)" />
          </svg>
        </div>
        <defs>
          <linearGradient id="red-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#dc2626" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#7f1d1d" stopOpacity="0.1" />
          </linearGradient>
        </defs>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center mb-6 bg-red-600/20 p-3 rounded-full">
            <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Preguntas Frecuentes</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Todo lo que necesitas saber sobre TEDxLasCondes y cómo participar en nuestra comunidad
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gradient-to-r from-gray-900 to-black rounded-2xl overflow-hidden border border-gray-800 transition-all shadow-lg">
                <button
                  className="w-full text-left p-6 flex justify-between items-center focus:outline-none"
                  onClick={() => toggleQuestion(index)}
                  aria-expanded={openQuestion === index}
                >
                  <h3 className="text-xl font-semibold pr-8">{faq.q}</h3>
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 text-white transition-transform duration-300 ${openQuestion === index ? 'rotate-45' : ''}`}>
                    {openQuestion === index ? (
                      <X className="w-4 h-4" />
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    )}
                  </div>
                </button>
                
                {/* Área de respuesta con animación */}
                <div 
                  className={`overflow-hidden transition-all duration-300 ${
                    openQuestion === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="p-6 pt-0 border-t border-gray-800 bg-black/20">
                    <p className="text-gray-300 leading-relaxed">{faq.a}</p>
                    
                    {/* Acciones adicionales */}
                    <div className="mt-4 flex justify-end">
                      <button className="text-red-500 text-sm flex items-center hover:text-red-400 transition-colors">
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                        Compartir
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Contacto adicional */}
          <div className="mt-12 text-center p-8 bg-gradient-to-br from-red-900/20 to-gray-900 rounded-2xl border border-gray-800">
            <p className="text-lg text-gray-300 mb-4">¿No encontraste la respuesta que buscabas?</p>
            <button className="bg-white text-red-800 px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors inline-flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contáctanos
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

// Newsletter rediseñado con aspecto más elegante y moderno
const Newsletter = () => (
  <section className="py-24 bg-black relative overflow-hidden">
    {/* Elementos decorativos sutiles */}
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-red-600/30 to-transparent"></div>
      <div className="absolute left-0 right-0 bottom-0 h-px bg-gradient-to-r from-transparent via-red-600/30 to-transparent"></div>
      <div className="absolute -top-64 -right-64 w-96 h-96 rounded-full bg-red-600/5 blur-3xl"></div>
      <div className="absolute -bottom-32 -left-32 w-64 h-64 rounded-full bg-red-600/5 blur-3xl"></div>
    </div>
    
    <div className="container mx-auto px-4 relative z-10">
      <div className="max-w-5xl mx-auto">
        <div className="bg-gradient-to-b from-gray-900 to-black border border-gray-800 rounded-3xl shadow-2xl overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Lado izquierdo: Imagen/Visual */}
            <div className="lg:w-2/5 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 to-black"></div>
              <img 
                src="/api/placeholder/800/1000" 
                alt="TEDx Newsletter" 
                className="w-full h-full object-cover opacity-70"
                loading="lazy"
              />
              
              {/* Overlay con elementos gráficos */}
              <div className="absolute inset-0 flex flex-col justify-between p-8 md:p-10">
                <div className="rounded-full bg-red-600 h-16 w-16 flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                
                <div className="bg-black/50 backdrop-blur-sm p-6 rounded-xl border border-white/10 mt-auto">
                  <div className="text-3xl font-bold text-white mb-2">Inspiración</div>
                  <p className="text-white/80">Recibe contenido exclusivo e historias de nuestros speakers directamente en tu inbox</p>
                </div>
              </div>
            </div>
            
            {/* Lado derecho: Formulario */}
            <div className="lg:w-3/5 p-8 md:p-12">
              <div className="text-left mb-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Únete a nuestra comunidad</h2>
                <p className="text-gray-400 text-lg mb-2">
                  Suscríbete para recibir las últimas novedades sobre TEDxLasCondes
                </p>
                <div className="w-16 h-1 bg-red-600 rounded-full"></div>
              </div>
              
              <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="nombre" className="text-white/80 text-sm font-medium mb-2 block">Nombre</label>
                    <input
                      id="nombre"
                      type="text"
                      placeholder="Tu nombre"
                      className="w-full bg-black/50 text-white border border-gray-800 focus:border-red-600 rounded-xl px-4 py-3 placeholder-gray-500 transition-all focus:ring-2 focus:ring-red-600/20 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="apellido" className="text-white/80 text-sm font-medium mb-2 block">Apellido</label>
                    <input
                      id="apellido"
                      type="text"
                      placeholder="Tu apellido"
                      className="w-full bg-black/50 text-white border border-gray-800 focus:border-red-600 rounded-xl px-4 py-3 placeholder-gray-500 transition-all focus:ring-2 focus:ring-red-600/20 outline-none"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="text-white/80 text-sm font-medium mb-2 block">Email</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Tu correo electrónico"
                    className="w-full bg-black/50 text-white border border-gray-800 focus:border-red-600 rounded-xl px-4 py-3 placeholder-gray-500 transition-all focus:ring-2 focus:ring-red-600/20 outline-none"
                    required
                  />
                </div>
                
                <div>
                  <label className="text-white/80 text-sm font-medium mb-3 block">¿Qué temas te interesan?</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {["Innovación", "Tecnología", "Ciencia", "Arte", "Educación", "Sostenibilidad"].map((tema, index) => (
                      <label key={index} className="flex items-center space-x-2 group cursor-pointer">
                        <input type="checkbox" className="form-checkbox text-red-600 rounded hidden" />
                        <div className="w-5 h-5 border border-gray-600 rounded group-hover:border-red-500 flex items-center justify-center">
                          <svg className="w-3 h-3 text-red-500 opacity-0 group-hover:opacity-50" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-gray-400 text-sm group-hover:text-white transition-colors">{tema}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 group cursor-pointer">
                  <input type="checkbox" id="privacy" className="form-checkbox text-red-600 rounded hidden" required />
                  <div className="w-5 h-5 border border-gray-600 rounded group-hover:border-red-500 flex items-center justify-center">
                    <svg className="w-3 h-3 text-red-500 opacity-0 group-hover:opacity-50" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <label htmlFor="privacy" className="text-gray-400 text-sm group-hover:text-white transition-colors">
                    Acepto la política de privacidad y recibir comunicaciones de TEDxLasCondes
                  </label>
                </div>
                
                <button 
                  type="submit" 
                  className="bg-gradient-to-r from-red-600 to-red-700 text-white font-bold px-8 py-4 rounded-xl hover:from-red-700 hover:to-red-800 transition-all flex items-center justify-center shadow-lg shadow-red-900/20 w-full md:w-auto"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Suscribirme al newsletter
                </button>
                
                <p className="text-gray-500 text-xs mt-4">
                  Nos tomamos en serio tu privacidad. Nunca compartiremos tu información y puedes darte de baja en cualquier momento.
                </p>
              </form>
              
              {/* Logos de testimoniales o credibilidad */}
              <div className="mt-12 border-t border-gray-800 pt-8">
                <p className="text-gray-500 text-sm mb-4">Nuestro newsletter llega a profesionales de:</p>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  {['Company A', 'Company B', 'Company C', 'Company D'].map((company, index) => (
                    <div key={index} className="grayscale opacity-50 hover:opacity-80 transition-opacity">
                      <div className="h-8 w-20 bg-gray-700 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
          {[
            { label: "Suscriptores", value: "5,200+" },
            { label: "Tasa de apertura", value: "62%" },
            { label: "Compromiso", value: "41%" },
            { label: "Satisfacción", value: "98%" }
          ].map((stat, index) => (
            <div key={index} className="bg-gray-900/50 p-4 rounded-xl border border-gray-800 transition-all hover:border-red-500/30 text-center backdrop-blur-sm">
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);



const Footer = () => (
  <footer className="bg-black pt-20 pb-10">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
        <div className="md:col-span-2">
          <Link to="/" className="flex items-center mb-6">
            <div className="text-red-600 font-bold text-3xl mr-2">TEDx</div>
            <div className="text-white font-bold text-xl">LasCondes</div>
          </Link>
          <p className="text-gray-400 mb-6 max-w-md">
            Una organización sin fines de lucro dedicada a difundir ideas que merecen ser compartidas. 
            TEDxLasCondes opera bajo licencia de TED.
          </p>
          <div className="flex space-x-4 mb-8">
            {[
              { name: "Twitter", path: "M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" },
              { name: "Instagram", path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
              { name: "YouTube", path: "M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" },
              { name: "Facebook", path: "M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" },
              { name: "LinkedIn", path: "M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" }
            ].map((social, index) => (
              <a 
                key={index} 
                href={`https://${social.name.toLowerCase()}.com/tedxlascondes`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gray-800 hover:bg-red-600 w-10 h-10 rounded-full flex items-center justify-center transition"
                aria-label={`Visitar ${social.name} de TEDxLasCondes`}
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d={social.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">TEDxLasCondes</h3>
          <ul className="space-y-3">
            {["Sobre nosotros", "Nuestro equipo", "Participa como speaker", "Voluntariado", "Patrocina"].map((item, index) => (
              <li key={index}>
                <Link 
                  to={item === "Participa como speaker" ? "/register-speaker" : `/${item.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-gray-400 hover:text-red-500 transition"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">Eventos y Charlas</h3>
          <ul className="space-y-3">
            {["Próximos eventos", "Eventos pasados", "Charlas destacadas", "Todas las charlas", "Speakers"].map((item, index) => (
              <li key={index}>
                <Link 
                  to={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-gray-400 hover:text-red-500 transition"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">Contacto</h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <svg className="w-5 h-5 text-red-500 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <a href="mailto:info@tedxlascondes.cl" className="text-gray-400 hover:text-red-500 transition">info@tedxlascondes.cl</a>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-red-500 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-gray-400">Las Condes, Santiago, Chile</span>
            </li>
            <li className="pt-4">
              <Link to="/politica-de-privacidad" className="text-gray-400 hover:text-red-500 transition">
                Política de privacidad
              </Link>
            </li>
            <li>
              <Link to="/terminos-de-uso" className="text-gray-400 hover:text-red-500 transition">
                Términos de uso
              </Link>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
        <div className="text-gray-500 text-sm mb-4 md:mb-0">
          <p>Este evento TEDx es operado bajo licencia de TED.</p>
          <p className="mt-1">© {new Date().getFullYear()} TEDxLasCondes. Todos los derechos reservados.</p>
        </div>
        <div className="flex items-center">
          <img 
            src="/api/placeholder/120/40" 
            alt="TED Logo" 
            className="h-6 opacity-50"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  </footer>
);

// Componente principal - mejora el rendimiento con useMemo y useCallback
const TEDxLasCondesApp = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prevState => !prevState);
  }, []);

  // Efecto para countdown
  useEffect(() => {
    // Fecha del próximo evento: 15 de Mayo, 2025
    const eventDate = new Date('May 15, 2025 09:00:00').getTime();
    
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = eventDate - now;
      
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      
      setCountdown({ days, hours, minutes, seconds });
    };
    
    // Actualizar cada segundo
    const interval = setInterval(updateCountdown, 1000);
    updateCountdown(); // Inicializar
    
    return () => clearInterval(interval);
  }, []);

  // Cerrar el menú al cambiar el tamaño de la ventana
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMenuOpen]);

  // Datos para características del evento
  const features = [
    {
      icon: <Globe className="w-10 h-10 text-red-500" />,
      title: "Ideas Globales",
      description: "Conectamos ideas locales con perspectivas globales para ampliar el horizonte de nuestra comunidad."
    },
    {
      icon: <Users className="w-10 h-10 text-red-500" />,
      title: "Comunidad Diversa",
      description: "Reunimos a personas de diversos campos y experiencias para enriquecer el diálogo."
    },
    {
      icon: <Sparkles className="w-10 h-10 text-red-500" />,
      title: "Innovación y Creatividad",
      description: "Fomentamos soluciones creativas y promovemos la innovación para los desafíos actuales."
    }
  ];

  // Datos de ejemplo para charlas destacadas
  const talks = [
    {
      id: 1,
      title: "El futuro de la innovación sustentable",
      speaker: "Ana Martínez",
      duration: "18:24",
      date: "Abril 2025",
      image: "/api/placeholder/640/360",
      category: "Innovación",
      views: "12,463",
      featured: true
    },
    {
      id: 2,
      title: "Transformando la educación a través de la tecnología",
      speaker: "Carlos Rojas",
      duration: "15:08",
      date: "Abril 2025",
      image: "/api/placeholder/640/360",
      category: "Educación",
      views: "8,271",
      featured: true
    },
    {
      id: 3,
      title: "Comunidades resilientes: el poder de la acción local",
      speaker: "Lucía Fernández",
      duration: "19:36",
      date: "Abril 2025",
      image: "/api/placeholder/640/360",
      category: "Sociedad",
      views: "9,542"
    },
    {
      id: 4,
      title: "Inteligencia Artificial y creatividad humana",
      speaker: "Roberto Núñez",
      duration: "16:15",
      date: "Marzo 2025",
      image: "/api/placeholder/640/360",
      category: "Tecnología",
      views: "15,873",
      featured: true
    },
    {
      id: 5,
      title: "Rediseñando ciudades para un futuro sostenible",
      speaker: "Valentina Torres",
      duration: "20:42",
      date: "Marzo 2025",
      image: "/api/placeholder/640/360",
      category: "Urbanismo",
      views: "7,219"
    },
    {
      id: 6,
      title: "El arte como herramienta de transformación social",
      speaker: "Gabriel Mendoza",
      duration: "17:33",
      date: "Febrero 2025",
      image: "/api/placeholder/640/360",
      category: "Arte",
      views: "10,128"
    },
    {
      id: 7,
      title: "Mindfulness y bienestar en la era digital",
      speaker: "Camila Vega",
      duration: "14:56",
      date: "Febrero 2025",
      image: "/api/placeholder/640/360",
      category: "Bienestar",
      views: "11,487"
    },
    {
      id: 8,
      title: "Economía circular: reinventando el consumo",
      speaker: "Matías Herrera",
      duration: "19:12",
      date: "Enero 2025",
      image: "/api/placeholder/640/360",
      category: "Economía",
      views: "8,954"
    }
  ];

  // Datos de ejemplo para eventos
  const events = [
    {
      id: 1,
      title: "TEDxLasCondes 2025: Horizontes Emergentes",
      date: "15 de Mayo, 2025",
      location: "Centro Cultural Las Condes",
      image: "/api/placeholder/640/360",
      description: "Un día completo de charlas inspiradoras, interacción con speakers y experiencias transformadoras que ampliarán tu perspectiva sobre el futuro."
    }
  ];

  // Testimonios
  const testimonials = [
    {
      id: 1,
      quote: "Liderar nuevamente un TEDx es un ejercicio profundo de resiliencia y visión. Cuando todo parecía incierto, descubrimos que las grandes ideas solo florecen cuando hay personas que realmente se quedan, que construyen, y que creen. Hoy avanzamos con un propósito más claro que nunca: rodearnos de quienes estén dispuestos a transformar, no solo a figurar.",
      author: "Peter Fulle",
      role: "Director Ejecutivo TEDxLasCondes",
      image: "/foto-peter.jpg"
    },
    {
      id: 2,
      quote: "Asumir este nuevo rol en TEDxLasCondes significa construir desde lo esencial: confianza, colaboración y propósito. Estamos dando forma a una experiencia que no solo inspira desde el escenario, sino que también transforma desde dentro. Lo mejor está por venir.",
      author: "Maca Salosny",
      role: "Subdirectora Ejecutiva TEDxLasCondes",
      image: "/foto-maca.jpg"
    },
    {
      id: 3,
      quote: "La diversidad de ideas y la energía que se vive en TEDxLasCondes es única. Un espacio donde realmente surgen conexiones valiosas.",
      author: "Isabel Fuentes",
      role: "Patrocinador TEDxLasCondes 2024",
      image: "/api/placeholder/100/100"
    }
  ];

  // Datos para patrocinadores
  const sponsors = [
    { id: 1, name: "Empresa Innovadora", image: "/api/placeholder/200/80", tier: "platinum" },
    { id: 2, name: "Corporación Tecnológica", image: "/api/placeholder/200/80", tier: "platinum" },
    { id: 3, name: "Banco Digital", image: "/api/placeholder/200/80", tier: "gold" },
    { id: 4, name: "Consultora Futuro", image: "/api/placeholder/200/80", tier: "gold" },
    { id: 5, name: "Startup Creativa", image: "/api/placeholder/200/80", tier: "silver" },
    { id: 6, name: "Fundación Educación", image: "/api/placeholder/200/80", tier: "silver" }
  ];

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Header Component */}
      <Header isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
      
      {/* Hero Section */}
      <Hero countdown={countdown} />
      
      {/* Características del evento */}
      <Features features={features} />
      
      {/* Próximo Evento - Destacado */}
      <NextEvent events={events} />
      
      {/* Sección de búsqueda mejorada */}
      <SearchSection />
      
      {/* Charlas destacadas */}
      <FeaturedTalks talks={talks} />
      
      {/* Sección de postulación como speaker */}
      <SpeakerCTA />

      {/* Testimonios */}
      <Testimonials testimonials={testimonials} />
      

      
      {/* Patrocinadores */}
      <Sponsors sponsors={sponsors} />
      
      {/* FAQ */}
      <FAQ />
      
      {/* Newsletter */}
      <Newsletter />
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

// App component con React Router
const App = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-red-600 text-2xl font-bold animate-pulse flex items-center">
            <div className="mr-2">TEDx</div>
            <div className="text-white">LasCondes</div>
            <div className="ml-4">Cargando...</div>
          </div>
        </div>
      }>
        <Routes>
          {/* Ruta para la página principal */}
          <Route path="/" element={<TEDxLasCondesApp />} />
          
          {/* Ruta para la plataforma de registro de ponentes */}
          <Route path="/register-speaker" element={<SpeakerRegistrationPlatform />} />
          
          {/* Rutas adicionales */}
          <Route path="/charlas" element={<TEDxLasCondesApp />} />
          <Route path="/eventos" element={<TEDxLasCondesApp />} />
          <Route path="/oradores" element={<TEDxLasCondesApp />} />
          <Route path="/sobre-tedx" element={<TEDxLasCondesApp />} />
          <Route path="/proximo-evento" element={<TEDxLasCondesApp />} />
          
          {/* Ruta de fallback para manejar rutas no encontradas */}
          <Route path="*" element={
            <div className="min-h-screen bg-black flex items-center justify-center flex-col p-4">
              <div className="text-red-600 text-4xl font-bold mb-4">404</div>
              <h1 className="text-2xl mb-6">Página no encontrada</h1>
              <p className="mb-8 text-gray-400 text-center max-w-md">
                La página que estás buscando no existe o ha sido movida.
              </p>
              <Link to="/" className="bg-red-600 text-white px-6 py-3 rounded-full hover:bg-red-700 transition">
                Volver al inicio
              </Link>
            </div>
          } />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;