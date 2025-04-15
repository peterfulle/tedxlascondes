/**
 * Servicio para gestión de archivos en Azure Blob Storage
 * 
 * Este servicio maneja la subida de archivos a Azure Blob Storage
 * y obtiene URLs firmadas para su descarga.
 */

// URL base de la API para operaciones de almacenamiento
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const StorageService = {
  /**
   * Obtiene una URL firmada para subir un archivo
   * @param {string} fileName - Nombre del archivo
   * @param {string} fileType - Tipo MIME del archivo
   * @param {string} speakerId - ID del speaker al que pertenece el archivo
   * @param {string} fileCategory - Categoría del archivo (fotoPerfil, cv, presentacion)
   * @returns {Promise<Object>} - Datos para subir el archivo incluyendo la URL
   */
  getUploadUrl: async (fileName, fileType, speakerId, fileCategory) => {
    try {
      const response = await fetch(`${API_URL}/storage/upload-url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file_name: fileName,
          content_type: fileType,
          speaker_id: speakerId,
          category: fileCategory
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Error al obtener la URL de subida');
      }
      
      return response.json();
    } catch (error) {
      console.error('Error getting upload URL:', error);
      throw error;
    }
  },
  
  /**
   * Sube un archivo directamente a Blob Storage usando una URL firmada
   * @param {string} url - URL firmada para la subida
   * @param {File} file - Archivo a subir
   * @param {string} fileType - Tipo MIME del archivo
   * @returns {Promise<string>} - URL pública del archivo subido
   */
  uploadFileToUrl: async (url, file, fileType) => {
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': fileType,
          'x-ms-blob-type': 'BlockBlob'
        },
        body: file
      });
      
      if (!response.ok) {
        throw new Error(`Error al subir el archivo: ${response.statusText}`);
      }
      
      // La URL pública es diferente de la URL de subida
      // Normalmente se retorna en la respuesta del endpoint que genera la URL firmada
      return url.split('?')[0]; // URL básica sin el SAS token
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },
  
  /**
   * Proceso completo para subir un archivo
   * @param {File} file - Archivo a subir
   * @param {string} speakerId - ID del speaker
   * @param {string} category - Categoría del archivo
   * @returns {Promise<string>} - URL pública del archivo
   */
  uploadFile: async (file, speakerId, category) => {
    try {
      // 1. Obtener URL firmada
      const { upload_url, public_url } = await StorageService.getUploadUrl(
        file.name,
        file.type,
        speakerId,
        category
      );
      
      // 2. Subir el archivo
      await StorageService.uploadFileToUrl(upload_url, file, file.type);
      
      // 3. Devolver la URL pública
      return public_url;
    } catch (error) {
      console.error('Error in complete upload process:', error);
      throw error;
    }
  },
  
  /**
   * Procesa todos los archivos de un speaker y actualiza sus URLs
   * @param {string} speakerId - ID del speaker
   * @param {Object} files - Objeto con los archivos a subir
   * @returns {Promise<Object>} - Objeto con las URLs de los archivos
   */
  processAllFiles: async (speakerId, files) => {
    const fileUrls = {};
    
    try {
      // Procesar foto de perfil si existe
      if (files.fotoPerfil) {
        fileUrls.fotoPerfilUrl = await StorageService.uploadFile(
          files.fotoPerfil,
          speakerId,
          'fotoPerfil'
        );
      }
      
      // Procesar CV si existe
      if (files.cv) {
        fileUrls.cvUrl = await StorageService.uploadFile(
          files.cv,
          speakerId,
          'cv'
        );
      }
      
      // Procesar presentación si existe
      if (files.presentacion) {
        fileUrls.presentacionUrl = await StorageService.uploadFile(
          files.presentacion,
          speakerId,
          'presentacion'
        );
      }
      
      return fileUrls;
    } catch (error) {
      console.error('Error processing files:', error);
      throw error;
    }
  }
};

export default StorageService;