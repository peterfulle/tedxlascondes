import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  ChevronDown,
  Check,
  X,
  Eye,
  Edit,
  Trash,
  Calendar,
  BarChart,
  Settings,
  LogOut,
  User,
  Mic,
  Clock,
  List,
  Grid,
  Download,
  Mail,
  MessageCircle,
  Star,
  StarHalf,
  AlertCircle,
  CheckCircle,
  FileText,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  RefreshCw
} from 'lucide-react';

import SpeakerService from './api-service';




const fetchApplicationData = async () => {
  try {
    const data = await SpeakerService.getSpeakers();
    return data;
  } catch (error) {
    console.error("Error al cargar los datos:", error);
    return [];
  }
};

// Componente principal del Dashboard
const TEDxAdminDashboard = () => {



  // Estados para manejar los datos
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todas');
  const [sortBy, setSortBy] = useState('fecha');
  const [sortOrder, setSortOrder] = useState('desc');
  const [viewMode, setViewMode] = useState('list'); // 'list' o 'grid'
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  
  // Estado para las estadísticas
  const [stats, setStats] = useState({
    total: 0,
    pendientes: 0,
    enRevision: 0,
    aprobados: 0,
    rechazados: 0,
    categorias: {}
  });

  // Cargar datos cuando se monta el componente
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchApplicationData();
        setApplications(data);
        setFilteredApplications(data);
        calculateStats(data);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Calcular estadísticas a partir de los datos
  const calculateStats = (data) => {
    const stats = {
      total: data.length,
      pendientes: data.filter(app => app.estado === 'pendiente').length,
      enRevision: data.filter(app => app.estado === 'revision').length,
      aprobados: data.filter(app => app.estado === 'aprobado').length,
      rechazados: data.filter(app => app.estado === 'rechazado').length,
      categorias: {}
    };
    
    // Contar postulaciones por categoría
    data.forEach(app => {
      app.categorias.forEach(cat => {
        if (stats.categorias[cat]) {
          stats.categorias[cat]++;
        } else {
          stats.categorias[cat] = 1;
        }
      });
    });
    
    setStats(stats);
  };

  // Filtrar aplicaciones según el estado activo
  useEffect(() => {
    let result = [...applications];
    
    // Filtrar por estado (pestaña activa)
    if (activeTab !== 'todos') {
      result = result.filter(app => app.estado === activeTab);
    }
    
    // Filtrar por término de búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(app => 
        app.nombre.toLowerCase().includes(term) || 
        app.apellido.toLowerCase().includes(term) || 
        app.email.toLowerCase().includes(term) || 
        app.tituloCharla.toLowerCase().includes(term)
      );
    }
    
    // Filtrar por categoría
    if (selectedCategory !== 'todas') {
      result = result.filter(app => 
        app.categorias.includes(selectedCategory)
      );
    }
    
    // Ordenar resultados
    result.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'fecha':
          comparison = new Date(a.fechaPostulacion) - new Date(b.fechaPostulacion);
          break;
        case 'nombre':
          comparison = `${a.nombre} ${a.apellido}`.localeCompare(`${b.nombre} ${b.apellido}`);
          break;
        case 'evaluacion':
          comparison = a.evaluacion - b.evaluacion;
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    setFilteredApplications(result);
    setCurrentPage(1); // Resetear a la primera página cuando cambian los filtros
  }, [activeTab, searchTerm, selectedCategory, sortBy, sortOrder, applications]);

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredApplications.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);


  // Añadir función para cargar estadísticas directamente de la API
  const loadStats = async () => {
    try {
      const statsData = await SpeakerService.getStats();
      setStats({
        total: statsData.status.total,
        pendientes: statsData.status.pendientes,
        enRevision: statsData.status.enRevision,
        aprobados: statsData.status.aprobados,
        rechazados: statsData.status.rechazados,
        categorias: statsData.categories
      });
    } catch (error) {
      console.error("Error al cargar estadísticas:", error);
      // Usar calculateStats con datos locales como fallback
      calculateStats(applications);
    }
  };

  // Actualizar el estado de una postulación
  const updateApplicationStatus = async (id, newStatus) => {
    try {
      const updatedApp = await SpeakerService.updateSpeaker(id, { estado: newStatus });
      
      // Actualizar el estado local
      const updatedApps = applications.map(app => {
        if (app.id === id) {
          // Si estamos viendo los detalles de esta aplicación, actualizar también ahí
          if (selectedApplication && selectedApplication.id === id) {
            setSelectedApplication(updatedApp);
          }
          return updatedApp;
        }
        return app;
      });
      
      setApplications(updatedApps);
      calculateStats(updatedApps);
      
      // Mostrar mensaje de éxito (podrías implementar un sistema de notificaciones)
      console.log(`Estado actualizado a: ${newStatus}`);
    } catch (error) {
      console.error(`Error al actualizar el estado a ${newStatus}:`, error);
      // Mostrar mensaje de error
      alert(`Error al actualizar el estado: ${error.message}`);
    }
  };

  // Añadir una función para eliminar un speaker
  const deleteSpeakerHandler = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta postulación? Esta acción no se puede deshacer.")) {
      try {
        await SpeakerService.deleteSpeaker(id);
        
        // Actualizar el estado local
        const updatedApps = applications.filter(app => app.id !== id);
        setApplications(updatedApps);
        setFilteredApplications(filteredApplications.filter(app => app.id !== id));
        calculateStats(updatedApps);
        
        // Si estamos viendo los detalles de esta aplicación, cerrar el modal
        if (selectedApplication && selectedApplication.id === id) {
          setShowDetailsModal(false);
        }
        
        // Mostrar mensaje de éxito
        console.log(`Postulación eliminada correctamente`);
      } catch (error) {
        console.error(`Error al eliminar la postulación:`, error);
        alert(`Error al eliminar la postulación: ${error.message}`);
      }
    }
  };

  

  // Ver detalles de una postulación
  const viewApplicationDetails = async (application) => {
    try {
      // Cargar los datos más recientes directamente de la API
      const freshData = await SpeakerService.getSpeaker(application.id);
      setSelectedApplication(freshData);
      setShowDetailsModal(true);
    } catch (error) {
      console.error(`Error al cargar detalles del speaker ${application.id}:`, error);
      // Usar los datos que ya tenemos como fallback
      setSelectedApplication(application);
      setShowDetailsModal(true);
    }
  };

  // Mapeo de categorías para mostrar nombres legibles
  const categoryNames = {
    'innovacion': 'Innovación',
    'tecnologia': 'Tecnología',
    'educacion': 'Educación',
    'medioambiente': 'Medio Ambiente',
    'salud': 'Salud',
    'cultura': 'Cultura',
    'arte': 'Arte',
    'ciencia': 'Ciencia',
    'sociedad': 'Sociedad',
    'emprendimiento': 'Emprendimiento',
    'bienestar': 'Bienestar',
    'sostenibilidad': 'Sostenibilidad',
    'deporte': 'Deporte',
    'liderazgo': 'Liderazgo',
    'superacion': 'Superación'
  };

  // Mapeo de estados para mostrar etiquetas
  const statusLabels = {
    'pendiente': { text: 'Pendiente', color: 'bg-yellow-500', textColor: 'text-yellow-900' },
    'revision': { text: 'En Revisión', color: 'bg-blue-500', textColor: 'text-blue-900' },
    'aprobado': { text: 'Aprobado', color: 'bg-green-500', textColor: 'text-green-900' },
    'rechazado': { text: 'Rechazado', color: 'bg-red-500', textColor: 'text-red-900' }
  };

  // Renderizar una etiqueta de estado
  const renderStatusBadge = (status) => {
    const { text, color, textColor } = statusLabels[status] || statusLabels.pendiente;
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
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 border-r border-gray-700">
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center">
            <div className="text-red-600 font-bold text-2xl mr-1">TEDx</div>
            <div className="text-white font-bold text-lg">LasCondes</div>
          </div>
          <p className="text-xs text-gray-400 mt-1">Panel de Administración</p>
        </div>
        
        <nav className="mt-5">
          <div className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Principal
          </div>
          <a href="#" className="flex items-center px-4 py-3 text-white bg-gray-700 border-l-4 border-red-500">
            <Users className="h-5 w-5 mr-3" />
            Postulaciones
          </a>
          <a href="#" className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition">
            <Calendar className="h-5 w-5 mr-3" />
            Calendario
          </a>
          <a href="#" className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition">
            <BarChart className="h-5 w-5 mr-3" />
            Estadísticas
          </a>
          
          <div className="px-4 mt-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Configuración
          </div>
          <a href="#" className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition">
            <Settings className="h-5 w-5 mr-3" />
            Ajustes
          </a>
          <a href="#" className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition">
            <User className="h-5 w-5 mr-3" />
            Mi cuenta
          </a>
          <a href="#" className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition">
            <LogOut className="h-5 w-5 mr-3" />
            Cerrar sesión
          </a>
        </nav>
        
        {/* Resumen de estadísticas en el sidebar */}
        <div className="mt-auto p-4 border-t border-gray-700">
          <div className="text-sm font-semibold mb-2">Resumen</div>
          <div className="text-xs text-gray-400 mb-1 flex justify-between">
            <span>Total postulaciones:</span>
            <span className="text-white">{stats.total}</span>
          </div>
          <div className="text-xs text-gray-400 mb-1 flex justify-between">
            <span>Pendientes:</span>
            <span className="text-yellow-500">{stats.pendientes}</span>
          </div>
          <div className="text-xs text-gray-400 mb-1 flex justify-between">
            <span>En revisión:</span>
            <span className="text-blue-500">{stats.enRevision}</span>
          </div>
          <div className="text-xs text-gray-400 mb-1 flex justify-between">
            <span>Aprobados:</span>
            <span className="text-green-500">{stats.aprobados}</span>
          </div>
          <div className="text-xs text-gray-400 flex justify-between">
            <span>Rechazados:</span>
            <span className="text-red-500">{stats.rechazados}</span>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
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

        {/* Panel de control */}
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
                  {Object.entries(categoryNames).map(([value, label]) => (
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
                onClick={() => setShowDetailsModal(false)} // Sólo para demo
              >
                Nueva postulación
              </button>
            </div>
          </div>
        </div>

        {/* Pestañas */}
        <div className="bg-gray-800 px-4 border-b border-gray-700">
          <nav className="flex space-x-4">
            <button
              className={`py-4 px-1 text-sm font-medium border-b-2 ${
                activeTab === 'todos' 
                  ? 'border-red-500 text-white' 
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('todos')}
            >
              Todas ({stats.total})
            </button>
            <button
              className={`py-4 px-1 text-sm font-medium border-b-2 ${
                activeTab === 'pendiente' 
                  ? 'border-red-500 text-white' 
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('pendiente')}
            >
              Pendientes ({stats.pendientes})
            </button>
            <button
              className={`py-4 px-1 text-sm font-medium border-b-2 ${
                activeTab === 'revision' 
                  ? 'border-red-500 text-white' 
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('revision')}
            >
              En revisión ({stats.enRevision})
            </button>
            <button
              className={`py-4 px-1 text-sm font-medium border-b-2 ${
                activeTab === 'aprobado' 
                  ? 'border-red-500 text-white' 
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('aprobado')}
            >
              Aprobados ({stats.aprobados})
            </button>
            <button
              className={`py-4 px-1 text-sm font-medium border-b-2 ${
                activeTab === 'rechazado' 
                  ? 'border-red-500 text-white' 
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('rechazado')}
            >
              Rechazados ({stats.rechazados})
            </button>
          </nav>
        </div>

        {/* Contenido principal */}
        <main className="flex-1 overflow-auto bg-gray-900 p-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <SearchX className="h-16 w-16 mb-4 text-gray-600" />
              <p className="text-lg">No se encontraron postulaciones</p>
              <p className="text-sm">Intenta con otros filtros o términos de búsqueda</p>
            </div>
          ) : viewMode === 'list' ? (
            // Vista de lista
            <div className="overflow-x-auto rounded-lg border border-gray-700">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-800">
                  <tr>
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
                  {currentItems.map((application) => (
                    <tr key={application.id} className="hover:bg-gray-800 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
                            {application.fotoPerfil ? (
                              <img src={application.fotoPerfil} alt="" className="h-10 w-10 rounded-full" />
                            ) : (
                              <div className="font-bold text-xl">{application.nombre.charAt(0)}</div>
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
                          {application.categorias.map(cat => (
                            <span key={cat} className="px-2 py-1 text-xs rounded-full bg-gray-700">
                              {categoryNames[cat] || cat}
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
                            onClick={() => viewApplicationDetails(application)}
                            className="text-blue-400 hover:text-blue-300 transition"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                          <button className="text-yellow-400 hover:text-yellow-300 transition">
                            <Edit className="h-5 w-5" />
                          </button>
                          <button className="text-red-400 hover:text-red-300 transition">
                            <Trash className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            // Vista de cuadrícula
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentItems.map((application) => (
                <div key={application.id} className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-red-500 transition-colors">
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gray-700 flex items-center justify-center">
                          {application.fotoPerfil ? (
                            <img src={application.fotoPerfil} alt="" className="h-12 w-12 rounded-full" />
                          ) : (
                            <div className="font-bold text-xl">{application.nombre.charAt(0)}</div>
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
                      {application.categorias.map(cat => (
                        <span key={cat} className="px-2 py-0.5 text-xs rounded-full bg-gray-700">
                          {categoryNames[cat] || cat}
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
                        onClick={() => viewApplicationDetails(application)}
                        className="text-blue-400 hover:text-blue-300 transition flex items-center text-sm"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Ver detalles
                      </button>
                      <div className="flex space-x-2">
                        <button className="text-yellow-400 hover:text-yellow-300 transition">
                          <Edit className="h-5 w-5" />
                        </button>
                        <button className="text-red-400 hover:text-red-300 transition">
                          <Trash className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Paginación */}
          {filteredApplications.length > 0 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-400">
                Mostrando {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredApplications.length)} de {filteredApplications.length} postulaciones
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
          )}
        </main>
      </div>

      {/* Modal de detalles */}
      {showDetailsModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center sticky top-0 bg-gray-800 z-10">
              <h2 className="text-xl font-bold">{selectedApplication.id} - Detalles de postulación</h2>
              <button onClick={() => setShowDetailsModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="overflow-y-auto p-6 flex-1">
              {/* Cabecera */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-16 w-16 rounded-full bg-gray-700 flex items-center justify-center">
                    {selectedApplication.fotoPerfil ? (
                      <img src={selectedApplication.fotoPerfil} alt="" className="h-16 w-16 rounded-full" />
                    ) : (
                      <div className="font-bold text-3xl">{selectedApplication.nombre.charAt(0)}</div>
                    )}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-2xl font-bold">{selectedApplication.nombre} {selectedApplication.apellido}</h3>
                    <p className="text-gray-400">{selectedApplication.ciudad}, {selectedApplication.pais}</p>
                    <div className="flex items-center mt-1">
                      <Mail className="h-4 w-4 text-gray-500 mr-1" />
                      <a href={`mailto:${selectedApplication.email}`} className="text-blue-400 hover:underline">{selectedApplication.email}</a>
                    </div>
                  </div>
                </div>
                <div>
                  {renderStatusBadge(selectedApplication.estado)}
                </div>
              </div>
              
              {/* Información de la charla */}
              <div className="bg-gray-700 rounded-lg p-4 mb-6">
                <h4 className="text-lg font-semibold mb-2 flex items-center">
                  <Mic className="w-5 h-5 text-red-500 mr-2" />
                  Propuesta de charla
                </h4>
                <div className="mb-4">
                  <div className="text-xl font-medium">{selectedApplication.tituloCharla}</div>
                  <div className="text-sm text-gray-400 mt-1">Postulado: {new Date(selectedApplication.fechaPostulacion).toLocaleDateString()}</div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedApplication.categorias.map(cat => (
                    <span key={cat} className="px-3 py-1 text-sm rounded-full bg-gray-600">
                      {categoryNames[cat] || cat}
                    </span>
                  ))}
                </div>
                
                <div className="bg-gray-800 rounded p-3 mb-3">
                  <div className="text-sm font-medium mb-1">Evaluación:</div>
                  {renderStars(selectedApplication.evaluacion)}
                </div>
              </div>
              
              {/* Sección de biografía */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-2 flex items-center">
                  <User className="w-5 h-5 text-blue-500 mr-2" />
                  Biografía
                </h4>
                <div className="bg-gray-800 rounded-lg p-4">
                  <p className="text-gray-300">{selectedApplication.biografia}</p>
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
                    {selectedApplication.disponibilidad.includes('15-mayo-am') && (
                      <div className="flex items-center">
                        <Check className="w-4 h-4 text-green-500 mr-2" />
                        <span>15 de Mayo, 2025 (mañana)</span>
                      </div>
                    )}
                    {selectedApplication.disponibilidad.includes('15-mayo-pm') && (
                      <div className="flex items-center">
                        <Check className="w-4 h-4 text-green-500 mr-2" />
                        <span>15 de Mayo, 2025 (tarde)</span>
                      </div>
                    )}
                    {selectedApplication.disponibilidad.includes('16-mayo-am') && (
                      <div className="flex items-center">
                        <Check className="w-4 h-4 text-green-500 mr-2" />
                        <span>16 de Mayo, 2025 (mañana)</span>
                      </div>
                    )}
                    {selectedApplication.disponibilidad.includes('16-mayo-pm') && (
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
                    defaultValue={selectedApplication.comentariosInternos}
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
                  onClick={() => {
                    updateApplicationStatus(selectedApplication.id, 'pendiente');
                    setShowDetailsModal(false);
                  }}
                  className="px-4 py-2 rounded-lg bg-yellow-600 text-white hover:bg-yellow-700 transition"
                >
                  Marcar pendiente
                </button>
                <button
                  onClick={() => {
                    updateApplicationStatus(selectedApplication.id, 'revision');
                    setShowDetailsModal(false);
                  }}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  En revisión
                </button>
                <button
                  onClick={() => {
                    updateApplicationStatus(selectedApplication.id, 'aprobado');
                    setShowDetailsModal(false);
                  }}
                  className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
                >
                  Aprobar
                </button>
                <button
                  onClick={() => {
                    updateApplicationStatus(selectedApplication.id, 'rechazado');
                    setShowDetailsModal(false);
                  }}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                >
                  Rechazar
                </button>
              </div>
              <div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Componente de Bell que faltaba definir
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

// Componente de SearchX que faltaba definir
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
export default TEDxAdminDashboard;


