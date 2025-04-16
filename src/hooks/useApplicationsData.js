// src/hooks/useApplicationsData.js
import { useState, useEffect } from 'react';
import SpeakerService from '../api-service'; // Corregir esta ruta

export const useApplicationsData = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estado para las estadísticas
  const [stats, setStats] = useState({
    total: 0,
    pendientes: 0,
    enRevision: 0,
    aprobados: 0,
    rechazados: 0,
    categorias: {}
  });

  // Cargar datos iniciales
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await SpeakerService.getSpeakers();
        
        // Normalizar los datos para evitar problemas
        const normalizedData = data.map(app => ({
          ...app,
          evaluacion: app.evaluacion || 0,
          estado: app.estado || 'pendiente',
          categorias: app.categorias || [],
          fechaPostulacion: app.fechaPostulacion || new Date().toISOString()
        }));
        
        setApplications(normalizedData);
        setFilteredApplications(normalizedData);
        calculateStats(normalizedData);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
        setError(error.message || "Error al cargar los datos");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Calcular estadísticas
  const calculateStats = (data) => {
    const stats = {
      total: data.length,
      pendientes: data.filter(app => app.estado === 'pendiente').length,
      enRevision: data.filter(app => app.estado === 'revision').length,
      aprobados: data.filter(app => app.estado === 'aprobado').length,
      rechazados: data.filter(app => app.estado === 'rechazado').length,
      categorias: {}
    };
    
    data.forEach(app => {
      if (app.categorias) {
        app.categorias.forEach(cat => {
          if (stats.categorias[cat]) {
            stats.categorias[cat]++;
          } else {
            stats.categorias[cat] = 1;
          }
        });
      }
    });
    
    setStats(stats);
  };

  // Actualizar estado de una aplicación
  const updateApplicationStatus = async (id, newStatus) => {
    try {
      await SpeakerService.updateSpeaker(id, { estado: newStatus });
      
      // Recargar los datos después de la actualización
      const updatedData = await SpeakerService.getSpeakers();
      setApplications(updatedData);
      setFilteredApplications(updatedData);
      calculateStats(updatedData);
      
      return { success: true };
    } catch (error) {
      console.error(`Error al actualizar el estado a ${newStatus}:`, error);
      return { 
        success: false, 
        error: error.message || `Error al actualizar el estado a ${newStatus}` 
      };
    }
  };

  // Eliminar una aplicación
  const deleteApplication = async (id) => {
    try {
      await SpeakerService.deleteSpeaker(id);
      
      // Actualizar el estado local
      const updatedApps = applications.filter(app => app.id !== id);
      setApplications(updatedApps);
      setFilteredApplications(filteredApplications.filter(app => app.id !== id));
      calculateStats(updatedApps);
      
      return { success: true };
    } catch (error) {
      console.error(`Error al eliminar la postulación:`, error);
      return { 
        success: false, 
        error: error.message || "Error al eliminar la postulación" 
      };
    }
  };

  // Obtener detalles de una aplicación
  const getApplicationDetails = async (id) => {
    try {
      return await SpeakerService.getSpeaker(id);
    } catch (error) {
      console.error(`Error al cargar detalles del speaker ${id}:`, error);
      throw error;
    }
  };
  
  // Ver detalles de una postulación
  const viewApplicationDetails = async (application) => {
    try {
      // Cargar los datos más recientes directamente de la API
      const freshData = await SpeakerService.getSpeaker(application.id);
      return freshData;
    } catch (error) {
      console.error(`Error al cargar detalles del speaker ${application.id}:`, error);
      return application;
    }
  };

  return {
    applications,
    filteredApplications,
    setFilteredApplications,
    isLoading,
    error,
    stats,
    updateApplicationStatus,
    deleteApplication,
    getApplicationDetails,
    viewApplicationDetails
  };
};