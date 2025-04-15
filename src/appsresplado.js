import React, { useState, useEffect, lazy, Suspense, useCallback } from 'react';
import { 
  Play, Calendar, Search, Menu, X, ChevronRight, Heart, Share2, 
  Clock, Mic, ArrowRight, Globe, Users, Sparkles, 
  Send, ChevronDown 
} from 'lucide-react';
import {
  BrowserRouter,
  Routes,
  Route,
  Link
} from 'react-router-dom';

// Importaciones diferidas para mejorar el rendimiento
const SpeakerRegistrationPlatform = lazy(() => import('./SpeakerRegistrationPlatform'));

// Actualizar el componente Header para usar Link a register-speaker
const Header = ({ isMenuOpen, toggleMenu }) => (
  <header className="bg-black sticky top-0 z-50 border-b border-gray-800">
    <div className="container mx-auto px-4 py-4 flex justify-between items-center">
      <Link to="/" className="flex items-center">
        <div className="text-red-600 font-bold text-3xl mr-2">TEDx</div>
        <div className="text-white font-bold text-xl">LasCondes</div>
      </Link>
      
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-8">
        <Link to="/charlas" className="hover:text-red-600 transition">Charlas</Link>
        <Link to="/eventos" className="hover:text-red-600 transition">Eventos</Link>
        <Link to="/oradores" className="hover:text-red-600 transition">Oradores</Link>
        <Link to="/sobre-tedx" className="hover:text-red-600 transition">Sobre TEDx</Link>
        <Link to="/register-speaker" className="hover:text-red-600 transition">Postula como Speaker</Link>
        <Link to="/proximo-evento" className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition flex items-center">
          <Calendar className="w-4 h-4 mr-2" />
          Próximo Evento
        </Link>
      </nav>
      
      {/* Mobile Menu Button */}
      <button 
        className="md:hidden" 
        onClick={toggleMenu}
        aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
      >
        {isMenuOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <Menu className="w-6 h-6 text-white" />
        )}
      </button>
    </div>
    
    {/* Mobile Navigation */}
    {isMenuOpen && (
      <div className="md:hidden bg-gray-900 py-4 animate-fadeIn">
        <div className="container mx-auto px-4 space-y-4">
          <Link to="/charlas" className="block hover:text-red-600 transition">Charlas</Link>
          <Link to="/eventos" className="block hover:text-red-600 transition">Eventos</Link>
          <Link to="/oradores" className="block hover:text-red-600 transition">Oradores</Link>
          <Link to="/sobre-tedx" className="block hover:text-red-600 transition">Sobre TEDx</Link>
          <Link to="/register-speaker" className="block w-full text-left hover:text-red-600 transition">Postula como Speaker</Link>
          <Link to="/proximo-evento" className="bg-red-600 text-white px-4 py-2 rounded w-full hover:bg-red-700 transition flex items-center justify-center">
            <Calendar className="w-4 h-4 mr-2" />
            Próximo Evento
          </Link>
        </div>
      </div>
    )}
  </header>
);

// Actualizar la sección Hero para usar Link a register-speaker
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
    
    {/* Contenido del Hero */}
    <div className="relative z-20 container mx-auto h-full flex flex-col justify-center px-4 md:px-12">
      <div className="max-w-3xl">
        <h1 className="text-5xl md:text-7xl font-bold mb-4 leading-tight">
          <span className="text-white">Ideas que</span> 
          <span className="text-red-600"> transforman</span> 
          <span className="text-white"> nuestro futuro</span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-gray-300">
          TEDxLasCondes 2025: Horizontes Emergentes
        </p>
        <div className="bg-black/30 backdrop-blur-sm p-6 rounded-lg mb-8 inline-block">
          <p className="text-lg mb-4">Próximo evento: 15 de Mayo, 2025</p>
          <div className="grid grid-cols-4 gap-4 text-center">
            {Object.entries(countdown).map(([key, value]) => (
              <div key={key} className="bg-red-600/20 rounded-lg p-3">
                <div className="text-3xl font-bold">{value}</div>
                <div className="text-sm">{key === 'days' ? 'Días' : key === 'hours' ? 'Horas' : key === 'minutes' ? 'Min' : 'Seg'}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <a href="#charlas-destacadas" className="bg-red-600 text-white px-8 py-4 rounded-full flex items-center justify-center hover:bg-red-700 transition group">
            <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition" />
            Ver charlas destacadas
          </a>
          <Link to="/register-speaker" className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition group">
            <Mic className="w-5 h-5 mr-2 group-hover:scale-110 transition" />
            Postula como speaker
          </Link>
        </div>
      </div>
    </div>
    
    {/* Scroll indicator */}
    <a href="#por-que-tedx" className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
      <ChevronDown className="w-8 h-8 text-white opacity-70" />
    </a>
  </section>
);

// Actualizar el componente SpeakerCTA para usar Link a register-speaker
const SpeakerCTA = () => (
  <section className="py-20 bg-black relative overflow-hidden">
    <div className="absolute inset-0 opacity-20">
      <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="url(#grid-pattern)" />
      </svg>
      <defs>
        <pattern id="grid-pattern" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
        </pattern>
      </defs>
    </div>
    <div className="container mx-auto px-4 relative z-10">
      <div className="flex flex-col lg:flex-row bg-gradient-to-r from-gray-900 to-black rounded-2xl overflow-hidden border border-gray-800">
        <div className="lg:w-1/2 p-8 md:p-12 flex flex-col justify-center order-2 lg:order-1">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Comparte tus ideas en nuestro escenario</h2>
          <p className="text-gray-300 mb-6">
            ¿Tienes una idea que merece ser difundida? Postula como speaker para la próxima edición de TEDxLasCondes y forma parte de nuestra comunidad.
          </p>
          <ul className="space-y-4 mb-8">
            {[
              { title: "Ideas originales", desc: "Buscamos ideas frescas y perspectivas que desafíen lo convencional" },
              { title: "Impacto tangible", desc: "Priorizamos ideas con potencial para generar cambios positivos en nuestra sociedad" },
              { title: "Acompañamiento profesional", desc: "Te brindamos coaching y apoyo para pulir tu presentación" }
            ].map((item, index) => (
              <li key={index} className="flex items-start">
                <div className="bg-red-600 rounded-full p-1 mt-1 mr-3">
                  <svg className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
              </li>
            ))}
          </ul>
          <Link to="/register-speaker" className="bg-red-600 text-white px-8 py-4 rounded-full hover:bg-red-700 transition flex items-center justify-center md:justify-start md:w-auto w-full">
            Postula ahora
            <Mic className="ml-2 w-5 h-5" />
          </Link>
        </div>
        <div className="lg:w-1/2 bg-gray-900 order-1 lg:order-2 relative">
          <img 
            src="/api/placeholder/800/600" 
            alt="Speaker en TEDxLasCondes" 
            className="w-full h-full object-cover opacity-90"
            loading="lazy"
          />
          <div className="absolute top-6 right-6 bg-red-600 rounded-full h-20 w-20 flex items-center justify-center transform rotate-12">
            <span className="text-white text-sm font-bold">Postula ahora</span>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// Componente principal - modificado para eliminar modal y usar el componente SpeakerRegistrationPlatform
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

  // El resto de los datos y componentes...

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Header Component */}
      <Header isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
      
      {/* Hero Section */}
      <Hero countdown={countdown} />
      
      {/* Resto de secciones... */}
    </div>
  );
};

// App component con React Router actualizado
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
          
          {/* Ruta para la plataforma de registro de ponentes - ahora carga el componente real */}
          <Route path="/register-speaker" element={<SpeakerRegistrationPlatform />} />
          
          {/* Resto de rutas... */}
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;