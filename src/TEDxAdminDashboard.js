import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StatusTabs from './components/StatusTabs';
import ApplicationFilters from './components/ApplicationFilters';
import ApplicationList from './components/ApplicationList';
import ApplicationGrid from './components/ApplicationGrid';
import ApplicationDetailModal from './components/ApplicationDetailModal';
import Pagination from './components/Pagination';
import LoadingSpinner from './components/LoadingSpinner';
import EmptyState from './components/EmptyState';
import { useApplicationsData } from './hooks/useApplicationsData';
import { usePagination } from './hooks/usePagination';

const TEDxAdminDashboard = () => {
  // Estado de UI local
  const [viewMode, setViewMode] = useState('list');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todas');
  const [sortBy, setSortBy] = useState('fecha');
  const [sortOrder, setSortOrder] = useState('desc');
  const [activeTab, setActiveTab] = useState('todos');
  
  // Hook personalizado para datos de aplicaciones
  const {
    applications,
    filteredApplications,
    setFilteredApplications,
    isLoading,
    error,
    stats,
    updateApplicationStatus,
    deleteApplication,
    getApplicationDetails,
    viewApplicationDetails: fetchApplicationDetails
  } = useApplicationsData();
  
  // Hook personalizado para paginación
  const {
    currentPage,
    setCurrentPage,
    itemsPerPage,
    currentItems,
    totalPages,
    indexOfFirstItem,
    indexOfLastItem
  } = usePagination(filteredApplications, 5);
  
  // Manejar visualización de detalles
  const handleViewDetails = async (application) => {
    try {
      const details = await getApplicationDetails(application.id);
      setSelectedApplication(details);
      setShowDetailsModal(true);
    } catch (error) {
      console.error("Error al cargar detalles:", error);
      setSelectedApplication(application);
      setShowDetailsModal(true);
    }
  };
  
  // Manejar cambio de estado
  const handleStatusChange = async (id, newStatus) => {
    await updateApplicationStatus(id, newStatus);
    setShowDetailsModal(false);
  };
  
  // Manejar eliminación
  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta postulación? Esta acción no se puede deshacer.")) {
      await deleteApplication(id);
      if (selectedApplication && selectedApplication.id === id) {
        setShowDetailsModal(false);
      }
    }
  };
  
  // Efecto para filtrar aplicaciones
  useEffect(() => {
    if (!applications.length) return;
    
    let result = [...applications];
    
    // Filtrar por estado (pestaña activa)
    if (activeTab !== 'todos') {
      result = result.filter(app => app.estado === activeTab);
    }
    
    // Filtrar por término de búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(app => 
        app.nombre?.toLowerCase().includes(term) || 
        app.apellido?.toLowerCase().includes(term) || 
        app.email?.toLowerCase().includes(term) || 
        app.tituloCharla?.toLowerCase().includes(term)
      );
    }
    
    // Filtrar por categoría
    if (selectedCategory !== 'todas') {
      result = result.filter(app => 
        app.categorias?.includes(selectedCategory)
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
  }, [activeTab, searchTerm, selectedCategory, sortBy, sortOrder, applications, setFilteredApplications, setCurrentPage]);
  
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar stats={stats} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <ApplicationFilters 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />
        
        <StatusTabs 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          stats={stats} 
        />
        
        <main className="flex-1 overflow-auto bg-gray-900 p-4">
          {isLoading ? (
            <LoadingSpinner />
          ) : filteredApplications.length === 0 ? (
            <EmptyState />
          ) : viewMode === 'list' ? (
            <ApplicationList 
              applications={currentItems}
              onViewDetails={handleViewDetails}
              onDelete={handleDelete}
            />
          ) : (
            <ApplicationGrid 
              applications={currentItems}
              onViewDetails={handleViewDetails}
              onDelete={handleDelete}
            />
          )}
          
          {filteredApplications.length > 0 && (
            <Pagination 
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              totalItems={filteredApplications.length}
              indexOfFirstItem={indexOfFirstItem}
              indexOfLastItem={indexOfLastItem}
            />
          )}
        </main>
      </div>
      
      {showDetailsModal && selectedApplication && (
        <ApplicationDetailModal
          application={selectedApplication}
          onClose={() => setShowDetailsModal(false)}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default TEDxAdminDashboard;