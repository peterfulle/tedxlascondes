/**
 * Servicio para comunicarse con la API de TEDxLasCondes
 */

// URL base de la API - cambiar según el entorno
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

/**
 * Maneja errores de las peticiones
 */
const handleResponse = async (response) => {
  if (!response.ok) {
    // Intentar extraer el mensaje de error del servidor
    let errorMessage;
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || 'Ocurrió un error al procesar la solicitud';
    } catch (e) {
      errorMessage = 'Ocurrió un error en la comunicación con el servidor';
    }
    throw new Error(errorMessage);
  }
  
  // Para DELETE con status 204 No Content
  if (response.status === 204) {
    return null;
  }
  
  return response.json();
};

/**
 * Servicio API para Speakers
 */
const SpeakerService = {
  // Obtener todos los speakers (opcionalmente con filtros)
  getSpeakers: async (filters = {}) => {
    const { query, category, status } = filters;
    
    // Construir query string para filtros
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (category) params.append('category', category);
    if (status) params.append('status', status);
    
    const queryString = params.toString() ? `?${params.toString()}` : '';
    
    try {
      const response = await fetch(`${API_URL}/speakers${queryString}`);
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching speakers:', error);
      throw error;
    }
  },
  
  // Obtener un speaker por ID
  getSpeaker: async (id) => {
    try {
      const response = await fetch(`${API_URL}/speakers/${id}`);
      return handleResponse(response);
    } catch (error) {
      console.error(`Error fetching speaker ${id}:`, error);
      throw error;
    }
  },
  
  // Crear un nuevo speaker
  createSpeaker: async (speakerData) => {
    try {
      const response = await fetch(`${API_URL}/speakers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(speakerData),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error creating speaker:', error);
      throw error;
    }
  },
  
  // Actualizar parcialmente un speaker
  updateSpeaker: async (id, updateData) => {
    try {
      const response = await fetch(`${API_URL}/speakers/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      return handleResponse(response);
    } catch (error) {
      console.error(`Error updating speaker ${id}:`, error);
      throw error;
    }
  },
  
  // Eliminar un speaker
  deleteSpeaker: async (id) => {
    try {
      const response = await fetch(`${API_URL}/speakers/${id}`, {
        method: 'DELETE',
      });
      return handleResponse(response);
    } catch (error) {
      console.error(`Error deleting speaker ${id}:`, error);
      throw error;
    }
  },
  
  // Obtener estadísticas
  getStats: async () => {
    try {
      const response = await fetch(`${API_URL}/stats`);
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  }
};

export default SpeakerService;