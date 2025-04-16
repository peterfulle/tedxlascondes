// Reemplaza la implementación actual de handleSubmit con esta versión:
const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Resetear errores
  setFormErrors({});
  setIsSubmitting(true);
  
  try {
    // Validación general
    const validationErrors = validateForm(formData);
    
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      setIsSubmitting(false);
      
      // Scroll al primer error
      const firstErrorField = Object.keys(validationErrors)[0];
      const errorElement = document.querySelector(`[name="${firstErrorField}"]`);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      
      return;
    }
    
    // Preparar datos para envío - separamos los archivos
    const speakerData = {
      nombre: formData.nombre,
      apellido: formData.apellido,
      email: formData.email,
      telefono: formData.telefono,
      ciudad: formData.ciudad,
      pais: formData.pais,
      biografia: formData.biografia,
      
      // Redes sociales (opcional)
      website: formData.website || null,
      linkedin: formData.linkedin || null,
      twitter: formData.twitter || null,
      instagram: formData.instagram || null,
      youtube: formData.youtube || null,
      
      // Propuesta de charla
      tituloCharla: formData.tituloCharla,
      categorias: formData.categorias,
      descripcionBreve: formData.descripcionBreve,
      descripcionDetallada: formData.descripcionDetallada,
      impactoEsperado: formData.impactoEsperado,
      experienciaPrevia: formData.experienciaPrevia || null,
      motivacion: formData.motivacion,
      
      // Disponibilidad
      disponibilidad: formData.disponibilidad,
      
      // VideoDemo (solo URL)
      videoDemo: formData.videoDemo || null,
      
      // Términos
      aceptaTerminos: formData.aceptaTerminos,
      aceptaComunicaciones: formData.aceptaComunicaciones
    };
    
    // Paso 1: Crear el registro de speaker
    const speakerResponse = await SpeakerService.createSpeaker(speakerData);
    console.log("Speaker creado con éxito:", speakerResponse);
    
    // Paso 2: Subir archivos si existen
    if (formData.fotoPerfil || formData.cv || formData.presentacion) {
      try {
        const fileUrls = await SpeakerService.uploadSpeakerFiles(
          speakerResponse.id, 
          {
            fotoPerfil: formData.fotoPerfil,
            cv: formData.cv,
            presentacion: formData.presentacion
          }
        );
        console.log("Archivos subidos con éxito:", fileUrls);
      } catch (fileError) {
        console.error("Error al subir archivos:", fileError);
        // Continuamos aunque haya error en archivos, ya tenemos el speaker registrado
      }
    }
    
    // Limpiar datos guardados
    localStorage.removeItem('tedx_speaker_form');
    
    // Marcar como enviado
    setIsSubmitted(true);
    setIsSubmitting(false);
    
  } catch (error) {
    console.error('Error en el envío:', error);
    
    setFormErrors(prev => ({
      ...prev,
      submit: `Error al enviar la postulación: ${error.message}`
    }));
    
    setIsSubmitting(false);
  }
};