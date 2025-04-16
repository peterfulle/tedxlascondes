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
      // Obtener y analizar el mensaje de error
      const errorText = await response.text();
      try {
        // Intentar parsear como JSON
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.detail || JSON.stringify(errorData);
      } catch {
        // Si no es JSON, usar el texto tal cual
        errorMessage = errorText;
      }
    } catch (e) {
      errorMessage = `Error ${response.status}: ${response.statusText}`;
    }
    
    console.error(`Error en respuesta (${response.status}):`, errorMessage);
    throw new Error(errorMessage);
  }
  
  // Para DELETE con status 204 No Content
  if (response.status === 204) {
    return null;
  }
  
  return response.json();
};

/**
 * Servicio para subir archivos
 */
const uploadFile = async (file, speakerId, category) => {
  try {
    console.log(`Intentando subir archivo ${category} para speaker ${speakerId}`);
    
    // Primero obtenemos una URL firmada para subir el archivo
    const uploadUrlResponse = await fetch(`${API_URL}/storage/upload-url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        file_name: file.name,
        content_type: file.type,
        speaker_id: speakerId,
        category: category // 'fotoPerfil', 'cv', o 'presentacion'
      }),
    });
    
    if (!uploadUrlResponse.ok) {
      const errorText = await uploadUrlResponse.text();
      throw new Error(`Error al obtener URL de subida: ${errorText}`);
    }
    
    const { upload_url, public_url } = await uploadUrlResponse.json();
    console.log(`URL de subida obtenida: ${upload_url}`);
    
    // Ahora subimos el archivo a la URL firmada
    const uploadResponse = await fetch(upload_url, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
      },
      body: file,
    });
    
    if (!uploadResponse.ok) {
      throw new Error('Error al subir el archivo');
    }
    
    console.log(`Archivo subido exitosamente: ${public_url}`);
    
    // Devolvemos la URL pública del archivo
    return public_url;
    
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
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
      console.log(`Obteniendo speakers desde ${API_URL}/speakers${queryString}`);
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
      console.log(`Obteniendo speaker con ID ${id}`);
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
      console.log('Creando nuevo speaker con datos:', speakerData);
      
      // Asegurarse de que el speaker tenga un ID si no lo tiene
      if (!speakerData.id) {
        speakerData.id = `client-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
        console.log(`Generado ID para el speaker: ${speakerData.id}`);
      }
      
      // Crear el registro del speaker
      const response = await fetch(`${API_URL}/speakers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(speakerData),
      });
      
      console.log('Respuesta recibida:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error del servidor:', errorText);
        
        // Intentar analizar el error
        try {
          const errorDetail = JSON.parse(errorText);
          throw new Error(errorDetail.detail || JSON.stringify(errorDetail));
        } catch (parseError) {
          // Si no se puede parsear, usar el texto tal cual
          throw new Error(`Error ${response.status}: ${errorText}`);
        }
      }
      
      const createdSpeaker = await response.json();
      console.log('Speaker creado exitosamente:', createdSpeaker);
      
      return createdSpeaker;
    } catch (error) {
      console.error('Error creating speaker:', error);
      throw error;
    }
  },
  
  // Subir archivos y actualizar el speaker con las URLs
  uploadSpeakerFiles: async (speakerId, files) => {
    try {
      console.log(`Subiendo archivos para speaker ${speakerId}:`, 
        Object.entries(files).filter(([_, file]) => file).map(([key]) => key)
      );
      
      const fileUrls = {};
      
      // Subir la foto de perfil si existe
      if (files.fotoPerfil) {
        fileUrls.fotoPerfilUrl = await uploadFile(files.fotoPerfil, speakerId, 'fotoPerfil');
      }
      
      // Subir el CV si existe
      if (files.cv) {
        fileUrls.cvUrl = await uploadFile(files.cv, speakerId, 'cv');
      }
      
      // Subir la presentación si existe
      if (files.presentacion) {
        fileUrls.presentacionUrl = await uploadFile(files.presentacion, speakerId, 'presentacion');
      }
      
      console.log('URLs de archivos obtenidas:', fileUrls);
      
      // Si tenemos URLs de archivos, actualizamos el speaker
      if (Object.keys(fileUrls).length > 0) {
        await SpeakerService.updateSpeaker(speakerId, fileUrls);
      }
      
      return fileUrls;
    } catch (error) {
      console.error('Error uploading files:', error);
      throw error;
    }
  },
  
  // Actualizar parcialmente un speaker
  updateSpeaker: async (id, updateData) => {
    try {
      console.log(`Actualizando speaker ${id} con datos:`, updateData);
      
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
      console.log(`Eliminando speaker ${id}`);
      
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
      console.log('Obteniendo estadísticas');
      
      const response = await fetch(`${API_URL}/stats`);
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  }
};

export default SpeakerService;