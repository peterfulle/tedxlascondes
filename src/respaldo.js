// src/SpeakerRegistrationPlatform.js
import React, { useState, useEffect } from 'react';
import SpeakerService from './api-service';

// @ts-nocheck
import {
  Mic,
  X,
  Upload,
  CheckCircle,
  AlertCircle,
  Calendar,
  FileText,
  User,
  Globe,
  Youtube,
  Linkedin,
  Twitter,
  Instagram,
  ChevronDown,
  ChevronUp,
  Lock,
  // Eliminar Save de aquí ya que no se usa
  Send,
  ArrowRight,
  ArrowLeft,
  HelpCircle,
  Info,
  Check,
  AlertTriangle,
  Clock,
  Users,
  ChevronRight
} from 'lucide-react';

const SpeakerRegistrationPlatform = () => {
  // ─── ESTADOS PRINCIPALES ───────────────────────────────
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  // Este isSaving se usa en el renderizado, así que lo mantenemos
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  // Este showSuccessMessage se usa en el renderizado, así que lo mantenemos
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Nuevo estado para controlar el popup
  const [showIntroPopup, setShowIntroPopup] = useState(true);
  const [introStep, setIntroStep] = useState(1); // Para navegación multi-paso en el popup

  // Función para cerrar el popup e iniciar el formulario
  const startApplication = () => {
    setShowIntroPopup(false);
  };
  
  // Estado del formulario
  const defaultFormData = {
    // Información personal
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    ciudad: '',
    pais: 'Chile',
    biografia: '',
  
    // Redes sociales
    website: '',
    linkedin: '',
    twitter: '',
    instagram: '',
    youtube: '',
  
    // Propuesta
    tituloCharla: '',
    categorias: [],
    descripcionBreve: '',
    descripcionDetallada: '',
    impactoEsperado: '',
    experienciaPrevia: '',
    motivacion: '',
  
    // Disponibilidad
    disponibilidad: [],
  
    // Materiales
    fotoPerfil: null,
    cv: null,
    presentacion: null,
    videoDemo: '',
  
    // Términos
    aceptaTerminos: false,
    aceptaComunicaciones: false
  };
  
  const [formData, setFormData] = useState(defaultFormData);
  
  // Control de secciones expandidas
  const sectionsConfig = {
    personal: { 
      id: 'personal', 
      title: 'Información Personal', 
      icon: 'User', 
      isRequired: true, 
      isExpanded: true, 
      isCompleted: false,
      helpText: 'Comparte tus datos básicos para poder contactarte'
    },
    redesSociales: { 
      id: 'redesSociales', 
      title: 'Redes Sociales', 
      icon: 'Globe', 
      isRequired: false, 
      isExpanded: false, 
      isCompleted: true,
      helpText: 'Opcional. Nos ayudará a conocer más sobre tu presencia digital'
    },
    propuesta: { 
      id: 'propuesta', 
      title: 'Tu Propuesta', 
      icon: 'Mic', 
      isRequired: true, 
      isExpanded: false, 
      isCompleted: false,
      helpText: 'El corazón de tu postulación. Detalla tu idea para TEDx'
    },
    disponibilidad: { 
      id: 'disponibilidad', 
      title: 'Disponibilidad', 
      icon: 'Calendar', 
      isRequired: true, 
      isExpanded: false, 
      isCompleted: false,
      helpText: 'Selecciona fechas para las sesiones de coaching y ensayos'
    },
    materiales: { 
      id: 'materiales', 
      title: 'Materiales de Apoyo', 
      icon: 'FileText', 
      isRequired: true, 
      isExpanded: false, 
      isCompleted: false,
      helpText: 'Sube tu foto y documentos complementarios'
    },
    terminos: { 
      id: 'terminos', 
      title: 'Términos y Condiciones', 
      icon: 'Lock', 
      isRequired: true, 
      isExpanded: false, 
      isCompleted: false,
      helpText: 'Lee y acepta los términos para enviar tu postulación'
    }
  };
  
  const [expandedSections, setExpandedSections] = useState(
    Object.fromEntries(
      Object.entries(sectionsConfig).map(([key, section]) => [key, section.isExpanded])
    )
  );
  
  const [completedSections, setCompletedSections] = useState(
    Object.fromEntries(
      Object.entries(sectionsConfig).map(([key, section]) => [key, section.isCompleted])
    )
  );
  
  // ─── CONSTANTES ───────────────────────────────
  const categorias = [
    { id: 'innovacion', nombre: 'Innovación', icono: 'Lightbulb', color: '#FF5722' },
    { id: 'tecnologia', nombre: 'Tecnología', icono: 'Cpu', color: '#2196F3' },
    { id: 'educacion', nombre: 'Educación', icono: 'BookOpen', color: '#4CAF50' },
    { id: 'medioambiente', nombre: 'Medio Ambiente', icono: 'Leaf', color: '#8BC34A' },
    { id: 'salud', nombre: 'Salud', icono: 'Heart', color: '#E91E63' },
    { id: 'cultura', nombre: 'Cultura', icono: 'Globe', color: '#9C27B0' },
    { id: 'arte', nombre: 'Arte', icono: 'PaintBucket', color: '#673AB7' },
    { id: 'ciencia', nombre: 'Ciencia', icono: 'Flask', color: '#3F51B5' },
    { id: 'sociedad', nombre: 'Sociedad', icono: 'Users', color: '#00BCD4' },
    { id: 'emprendimiento', nombre: 'Emprendimiento', icono: 'TrendingUp', color: '#FFC107' },
    { id: 'bienestar', nombre: 'Bienestar', icono: 'Smile', color: '#CDDC39' },
    { id: 'sostenibilidad', nombre: 'Sostenibilidad', icono: 'Recycle', color: '#009688' },
    { id: 'otro', nombre: 'Otro', icono: 'Plus', color: '#607D8B' }
  ];
  
  const fechasDisponibles = [
    { 
      id: '15-mayo-am', 
      texto: '15 de Mayo, 2025 (mañana)', 
      fecha: new Date(2025, 4, 15, 9, 0), 
      horario: '9:00 - 13:00', 
      disponibilidad: 'alta', 
      tipo: 'coaching'
    },
    { 
      id: '15-mayo-pm', 
      texto: '15 de Mayo, 2025 (tarde)', 
      fecha: new Date(2025, 4, 15, 14, 0), 
      horario: '14:00 - 18:00', 
      disponibilidad: 'media', 
      tipo: 'coaching'
    },
    { 
      id: '16-mayo-am', 
      texto: '16 de Mayo, 2025 (mañana)', 
      fecha: new Date(2025, 4, 16, 9, 0), 
      horario: '9:00 - 13:00', 
      disponibilidad: 'baja', 
      tipo: 'ensayo'
    },
    { 
      id: '16-mayo-pm', 
      texto: '16 de Mayo, 2025 (tarde)', 
      fecha: new Date(2025, 4, 16, 14, 0), 
      horario: '14:00 - 18:00', 
      disponibilidad: 'alta', 
      tipo: 'ensayo'
    },
  ];

  // Configuración detallada de los pasos
  const stepsConfig = [
    {
      id: 1,
      title: "Información Personal",
      subtitle: "Cuéntanos sobre ti",
      icon: "User",
      sections: ['personal', 'redesSociales'],
      nextButtonText: "Siguiente: Tu propuesta",
      previousButtonText: "",
      isOptional: false,
      help: "En esta sección compartirás tus datos de contacto e información básica"
    },
    {
      id: 2,
      title: "Propuesta y Disponibilidad",
      subtitle: "Detalles de tu charla",
      icon: "Mic",
      sections: ['propuesta', 'disponibilidad'],
      nextButtonText: "Siguiente: Materiales",
      previousButtonText: "Anterior: Información personal",
      isOptional: false,
      help: "Describe tu idea para TEDx y selecciona fechas para el coaching"
    },
    {
      id: 3,
      title: "Materiales y Términos",
      subtitle: "Documentos y aceptación",
      icon: "FileText",
      sections: ['materiales', 'terminos'],
      nextButtonText: "Enviar postulación",
      previousButtonText: "Anterior: Tu propuesta",
      isOptional: false,
      help: "Sube tu foto y documentos, y acepta los términos y condiciones"
    }
  ];

  // Para mantener compatibilidad con el código existente
  const stepSections = {
    1: stepsConfig[0].sections,
    2: stepsConfig[1].sections,
    3: stepsConfig[2].sections
  };

  // Validaciones y mensajes centralizados - este objeto no se usa, pero lo mantenemos
  // para no romper la lógica existente.
  const validations = {
    patterns: {
      email: /\S+@\S+\.\S+/,
      phone: /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/,
      textOnly: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
      url: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/
    },
    messages: {
      required: 'Este campo es obligatorio',
      invalidEmail: 'Ingresa un correo electrónico válido',
      invalidPhone: 'Ingresa un número de teléfono válido',
      invalidUrl: 'Ingresa una URL válida',
      maxWords: (max) => `No debe exceder las ${max} palabras`,
      minWords: (min) => `Debe tener al menos ${min} palabras`,
      maxLength: (max) => `No debe exceder los ${max} caracteres`,
      minLength: (min) => `Debe tener al menos ${min} caracteres`,
      maxSize: (maxMB) => `El archivo excede el tamaño máximo permitido (${maxMB}MB)`,
      invalidFileType: 'Tipo de archivo no permitido',
      selectMin: (min) => `Selecciona al menos ${min} ${min === 1 ? 'opción' : 'opciones'}`,
      selectMax: (max) => `Selecciona máximo ${max} opciones`
    },
    success: {
      formSaved: 'Progreso guardado correctamente',
      formSubmitted: 'Postulación enviada con éxito',
      fileUploaded: 'Archivo subido correctamente'
    },
    errors: {
      general: 'Ha ocurrido un error. Inténtalo de nuevo más tarde.',
      validation: 'Por favor, completa todos los campos obligatorios antes de enviar el formulario.',
      fileUpload: 'Error al subir el archivo.',
      formSubmission: 'Error al enviar el formulario.'
    }
  };

  // Configuración de archivos aceptados - no se usa pero lo mantenemos para no romper lógica existente
  const fileConfig = {
    fotoPerfil: {
      maxSize: 2 * 1024 * 1024, // 2MB
      accept: 'image/jpeg, image/png',
      labelText: 'Foto de perfil (JPG o PNG, máx. 2MB)',
      required: true,
      helpText: 'Se usará en el sitio web y materiales promocionales',
      errorSizeMessage: 'El archivo excede el tamaño máximo permitido (2MB)',
      errorTypeMessage: 'Solo se permiten archivos JPG o PNG'
    },
    cv: {
      maxSize: 5 * 1024 * 1024, // 5MB
      accept: 'application/pdf',
      labelText: 'Currículum Vitae (PDF, máx. 5MB)',
      required: false,
      helpText: 'Comparte tu trayectoria profesional',
      errorSizeMessage: 'El archivo excede el tamaño máximo permitido (5MB)',
      errorTypeMessage: 'Solo se permiten archivos PDF'
    },
    presentacion: {
      maxSize: 10 * 1024 * 1024, // 10MB
      accept: 'application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation',
      labelText: 'Presentación o material (PDF/PPT, máx. 10MB)',
      required: false,
      helpText: 'Material de apoyo para tu propuesta',
      errorSizeMessage: 'El archivo excede el tamaño máximo permitido (10MB)',
      errorTypeMessage: 'Solo se permiten archivos PDF o PowerPoint'
    }
  };

  // Requisitos mínimos para cada sección
  const sectionRequirements = {
    personal: [
      { campo: 'nombre', tipo: 'text', minLength: 2, maxLength: 50, mensaje: 'El nombre es obligatorio', regex: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/ },
      { campo: 'apellido', tipo: 'text', minLength: 2, maxLength: 50, mensaje: 'El apellido es obligatorio', regex: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/ },
      { campo: 'email', tipo: 'email', mensaje: 'Ingresa un correo electrónico válido', regex: /\S+@\S+\.\S+/ },
      { campo: 'telefono', tipo: 'tel', mensaje: 'Ingresa un número de teléfono válido', regex: /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/ },
      { campo: 'ciudad', tipo: 'text', minLength: 2, maxLength: 50, mensaje: 'La ciudad es obligatoria' },
      { campo: 'biografia', tipo: 'textarea', minWords: 10, maxWords: 200, mensaje: 'La biografía debe tener entre 10 y 200 palabras' }
    ],
    redesSociales: [], // Opcional
    propuesta: [
      { campo: 'tituloCharla', tipo: 'text', minLength: 5, maxLength: 100, mensaje: 'El título de la charla es obligatorio' },
      { campo: 'categorias', tipo: 'array', minItems: 1, maxItems: 3, mensaje: 'Selecciona al menos una categoría' },
      { campo: 'descripcionBreve', tipo: 'textarea', minWords: 10, maxWords: 50, mensaje: 'La descripción breve debe tener entre 10 y 50 palabras' },
      { campo: 'descripcionDetallada', tipo: 'textarea', minWords: 50, maxWords: 500, mensaje: 'La descripción detallada debe tener entre 50 y 500 palabras' },
      { campo: 'impactoEsperado', tipo: 'textarea', minWords: 20, maxWords: 200, mensaje: 'El impacto esperado debe tener entre 20 y 200 palabras' },
      { campo: 'motivacion', tipo: 'textarea', minWords: 20, maxWords: 200, mensaje: 'La motivación debe tener entre 20 y 200 palabras' }
    ],
    disponibilidad: [
      { campo: 'disponibilidad', tipo: 'array', minItems: 1, mensaje: 'Selecciona al menos una fecha disponible' }
    ],
    materiales: [
      { campo: 'fotoPerfil', tipo: 'file', required: true, accept: 'image/jpeg,image/png', maxSize: 2 * 1024 * 1024, mensaje: 'La foto de perfil es obligatoria (máx. 2MB)' }
    ],
    terminos: [
      { campo: 'aceptaTerminos', tipo: 'checkbox', mensaje: 'Debes aceptar los términos y condiciones para continuar' }
    ]
  };
  
  useEffect(() => {
    const updatedCompletedSections = { ...completedSections };
    
    // Verificar sección personal
    updatedCompletedSections.personal = (
      !!formData.nombre && 
      !!formData.apellido && 
      !!formData.email && 
      !!formData.telefono && 
      !!formData.ciudad && 
      !!formData.biografia
    );
    
    // Redes sociales es siempre opcional/completado
    updatedCompletedSections.redesSociales = true;
    
    // Verificar propuesta
    updatedCompletedSections.propuesta = (
      !!formData.tituloCharla && 
      formData.categorias.length > 0 && 
      !!formData.descripcionBreve && 
      !!formData.descripcionDetallada && 
      !!formData.impactoEsperado && 
      !!formData.motivacion
    );
    
    // Verificar disponibilidad
    updatedCompletedSections.disponibilidad = formData.disponibilidad.length > 0;
    
    // Verificar materiales
    updatedCompletedSections.materiales = !!formData.fotoPerfil;
    
    // Verificar términos
    updatedCompletedSections.terminos = !!formData.aceptaTerminos;
    
    setCompletedSections(updatedCompletedSections);
    
    // Debug: Imprimir para ver qué secciones están completadas
    console.log("Secciones completadas:", updatedCompletedSections);
  }, [formData, completedSections]); // Agregado completedSections para resolver warning
  

  // Guardar progreso en localStorage
  useEffect(() => {
    // Evitamos guardar archivos en localStorage
    const dataToSave = { ...formData };
    delete dataToSave.fotoPerfil;
    delete dataToSave.cv;
    delete dataToSave.presentacion;
    
    localStorage.setItem('tedx_speaker_form', JSON.stringify(dataToSave));
  }, [formData]);

  // Cargar datos guardados al iniciar
  useEffect(() => {
    const savedData = localStorage.getItem('tedx_speaker_form');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setFormData(prev => ({
          ...prev,
          ...parsedData
        }));
        
        // Mostrar mensaje de éxito por un momento
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
      } catch (error) {
        console.error('Error cargando datos guardados:', error);
      }
    }
  }, []);
  
  // ─── HANDLERS ───────────────────────────────
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar errores al modificar un campo
    if (formErrors[name]) {
      setFormErrors(prev => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };
  
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
    
    // Limpiar errores al modificar un campo
    if (formErrors[name]) {
      setFormErrors(prev => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };
  
  const handleCategoriaChange = (categoria) => {
    setFormData(prev => {
      const categoriasActuales = [...prev.categorias];
      if (categoriasActuales.includes(categoria.id || categoria)) {
        return { ...prev, categorias: categoriasActuales.filter(cat => cat !== (categoria.id || categoria)) };
      } else {
        if (categoriasActuales.length < 3) {
          return { ...prev, categorias: [...categoriasActuales, categoria.id || categoria] };
        }
        return prev;
      }
    });
    
    // Limpiar error de categorías si existiera
    if (formErrors.categorias) {
      setFormErrors(prev => {
        const updated = { ...prev };
        delete updated.categorias;
        return updated;
      });
    }
  };
  
  const handleDisponibilidadChange = (fechaId) => {
    setFormData(prev => {
      const disponibilidadActual = [...prev.disponibilidad];
      if (disponibilidadActual.includes(fechaId)) {
        return { ...prev, disponibilidad: disponibilidadActual.filter(id => id !== fechaId) };
      } else {
        return { ...prev, disponibilidad: [...disponibilidadActual, fechaId] };
      }
    });
    
    // Limpiar error de disponibilidad si existiera
    if (formErrors.disponibilidad) {
      setFormErrors(prev => {
        const updated = { ...prev };
        delete updated.disponibilidad;
        return updated;
      });
    }
  };
  
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      // Validar tamaño máximo
      const maxSizeMB = name === 'fotoPerfil' ? 2 : name === 'cv' ? 5 : 10;
      const maxSizeBytes = maxSizeMB * 1024 * 1024;
      
      if (files[0].size > maxSizeBytes) {
        setFormErrors(prev => ({
          ...prev,
          [name]: `El archivo excede el tamaño máximo permitido (${maxSizeMB}MB)`
        }));
        return;
      }
      
      setFormData(prev => ({ ...prev, [name]: files[0] }));
      
      // Limpiar errores al subir un archivo válido
      if (formErrors[name]) {
        setFormErrors(prev => {
          const updated = { ...prev };
          delete updated[name];
          return updated;
        });
      }
    }
  };
  
  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Función para validar un paso
  const validateStep = (step) => {
    const sections = stepSections[step];
    const newErrors = {};
    
    // Validar cada sección correspondiente al paso actual
    sections.forEach(section => {
      const requirements = sectionRequirements[section];
      
      // Ignorar secciones opcionales (como redes sociales)
      if (requirements.length === 0) return;
      
      requirements.forEach(req => {
        const field = req.campo || req; // Para manejar tanto objetos como strings
        
        // Verificar los requisitos según el tipo
        if (field === 'categorias' && formData.categorias.length === 0) {
          newErrors.categorias = 'Selecciona al menos una categoría';
        } else if (field === 'disponibilidad' && formData.disponibilidad.length === 0) {
          newErrors.disponibilidad = 'Selecciona al menos una fecha disponible';
        } else if (!formData[field]) {
          newErrors[field] = `Este campo es obligatorio`;
        }
      });
    });
    
    // Email válido
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Ingresa un correo electrónico válido';
    }
    
    // Teléfono válido (simple validación)
    if (formData.telefono && !/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/.test(formData.telefono)) {
      newErrors.telefono = 'Ingresa un número de teléfono válido';
    }
    
    // Validaciones específicas por paso
    if (step === 1) {
      if (formData.biografia && formData.biografia.split(' ').length > 200) {
        newErrors.biografia = 'La biografía no debe exceder las 200 palabras';
      }
      
      // Debug: Imprimir para ver qué campos faltan
      console.log("Paso 1 validación:", {
        nombre: formData.nombre, 
        apellido: formData.apellido,
        email: formData.email,
        telefono: formData.telefono,
        ciudad: formData.ciudad,
        biografia: formData.biografia
      });
    } else if (step === 2) {
      if (formData.descripcionBreve && formData.descripcionBreve.split(' ').length > 50) {
        newErrors.descripcionBreve = 'La descripción breve no debe exceder las 50 palabras';
      }
      if (formData.descripcionDetallada && formData.descripcionDetallada.split(' ').length > 500) {
        newErrors.descripcionDetallada = 'La descripción detallada no debe exceder las 500 palabras';
      }
      if (formData.impactoEsperado && formData.impactoEsperado.split(' ').length > 200) {
        newErrors.impactoEsperado = 'El impacto esperado no debe exceder las 200 palabras';
      }
    }
    
    // Mostramos los errores encontrados
    console.log("Errores de validación:", newErrors);
    
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const nextStep = () => {
    if (validateStep(currentStep)) {
      window.scrollTo(0, 0);
      setCurrentStep(prev => Math.min(prev + 1, 3));
      
      // Expandir automáticamente la primera sección del nuevo paso
      const nextStepSections = stepSections[currentStep + 1] || [];
      if (nextStepSections.length > 0) {
        setExpandedSections(prev => ({
          ...prev,
          [nextStepSections[0]]: true
        }));
      }
    } else {
      // Si hay errores, expandir las secciones relevantes
      const sectionsToExpand = {};
      const currentSections = stepSections[currentStep];
      
      currentSections.forEach(section => {
        const requirementsForSection = sectionRequirements[section];
        const hasErrorInSection = requirementsForSection.some(field => formErrors[field]);
        
        if (hasErrorInSection) {
          sectionsToExpand[section] = true;
        }
      });
      
      setExpandedSections(prev => ({
        ...prev,
        ...sectionsToExpand
      }));
      
      // Scroll al primer error
      const firstErrorField = document.querySelector('.error-message');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };
  
  const prevStep = () => {
    window.scrollTo(0, 0);
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };
  
  // Esta función no se usa según el warning, pero la dejamos para mantener la lógica
  const saveProgress = () => {
    setIsSaving(true);
    
    // Simulamos una operación asíncrona
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    }, 800);
  };
  
  // Función handleSubmit modificada
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Primero resetear los errores
    setFormErrors({});
    
    // Validar cada paso
    const step1Valid = validateStep(1);
    const step2Valid = validateStep(2);
    const step3Valid = validateStep(3);
    
    const allValid = step1Valid && step2Valid && step3Valid;
    
    if (allValid) {
      setIsSubmitting(true);

      try {
        // Crear el objeto de postulación para enviar a la API
        const speakerData = {
          nombre: formData.nombre,
          apellido: formData.apellido,
          email: formData.email,
          telefono: formData.telefono,
          ciudad: formData.ciudad,
          pais: formData.pais,
          biografia: formData.biografia,
          

          // Redes sociales
          website: formData.website || "",
          linkedin: formData.linkedin || "",
          twitter: formData.twitter || "",
          instagram: formData.instagram || "",
          youtube: formData.youtube || "",
          
          // Propuesta
          tituloCharla: formData.tituloCharla,
          categorias: formData.categorias,
          descripcionBreve: formData.descripcionBreve,
          descripcionDetallada: formData.descripcionDetallada,
          impactoEsperado: formData.impactoEsperado,
          experienciaPrevia: formData.experienciaPrevia || "",
          motivacion: formData.motivacion,
          
          // Disponibilidad
          disponibilidad: formData.disponibilidad,
          
          // URLs de archivos - esto se maneja por separado
          fotoPerfilUrl: formData.fotoPerfil ? "pending_upload" : null,
          cvUrl: formData.cv ? "pending_upload" : null,
          presentacionUrl: formData.presentacion ? "pending_upload" : null,
          videoDemo: formData.videoDemo || null,
          
          // Términos
          aceptaTerminos: formData.aceptaTerminos,
          aceptaComunicaciones: formData.aceptaComunicaciones
        };
        
        // Enviar datos a la API
        const response = await SpeakerService.createSpeaker(speakerData);
        console.log('Speaker creado:', response);
        
        // Si hay archivos, aquí se implementaría la lógica para subirlos
        // y luego actualizar el registro con las URLs correctas
        if (formData.fotoPerfil || formData.cv || formData.presentacion) {
          // Aquí iría la lógica para subir archivos a un servicio de almacenamiento
          // y luego actualizar el registro con SpeakerService.updateSpeaker
          console.log('Archivos pendientes de subir');
        }
        
        // Mostrar pantalla de éxito
        setIsSubmitting(false);
        setIsSubmitted(true);
        
        // Limpiar datos guardados
        localStorage.removeItem('tedx_speaker_form');
      } catch (error) {
        console.error('Error al enviar la postulación:', error);
        setFormErrors(prev => ({
          ...prev,
          submit: `Error al enviar la postulación: ${error.message}`
        }));
        setIsSubmitting(false);
      }
    } else {
      // Encontrar el primer paso con errores y navegar a ese paso
      let stepWithError = 1;
      if (!step1Valid) {
        stepWithError = 1;
      } else if (!step2Valid) {
        stepWithError = 2;
      } else if (!step3Valid) {
        stepWithError = 3;
      }
      
      setCurrentStep(stepWithError);
      
      // Expandir secciones con errores
      const sectionsToExpand = {};
      const currentSections = stepSections[stepWithError];
      
      currentSections.forEach(section => {
        const requirementsForSection = sectionRequirements[section];
        const hasErrorInSection = requirementsForSection.some(field => {
          if (field === 'categorias') return formData.categorias.length === 0;
          if (field === 'disponibilidad') return formData.disponibilidad.length === 0;
          return !formData[field];
        });
        
        if (hasErrorInSection) {
          sectionsToExpand[section] = true;
        }
      });
      
      setExpandedSections(prev => ({
        ...prev,
        ...sectionsToExpand
      }));
      
      // Mostrar un mensaje de error
      alert('Por favor, complete todos los campos obligatorios antes de enviar el formulario.');
    }
  };

  
  const handleLogin = (e) => {
    e.preventDefault();
    // Lógica para el login
    setShowLoginForm(false);
  };
  
  // ─── RENDERIZADO DE COMPONENTES ───────────────────────────────
  
  // Indicador de pasos
  const renderStepIndicator = () => (
    <div className="mb-12 pt-6">
      <div className="flex flex-col md:flex-row items-center justify-between mb-4">
        <h2 className="text-2xl font-bold mb-4 md:mb-0">Tu postulación como Speaker</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setIsSaving(true);
              // Simulamos una operación asíncrona
              setTimeout(() => {
                setIsSaving(false);
                setShowSuccessMessage(true);
                setTimeout(() => setShowSuccessMessage(false), 3000);
              }, 800);
            }}
            disabled={isSaving}
            className="flex items-center text-white bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                Guardando...
              </>
            ) : (
              <>
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
                  className="w-4 h-4 mr-2"
                >
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                  <polyline points="17 21 17 13 7 13 7 21"></polyline>
                  <polyline points="7 3 7 8 15 8"></polyline>
                </svg>
                Guardar progreso
              </>
            )}
          </button>
          
          {showSuccessMessage && (
            <div className="absolute right-4 top-20 bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg animate-fade-in-out flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Progreso guardado correctamente
            </div>
          )}
        </div>
      </div>
      
      
      <div className="relative">
        <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-full h-1 bg-gray-800"></div>
        <div className="absolute top-1/2 left-0 transform -translate-y-1/2 transition-all duration-700 ease-in-out" style={{
          width: `${(currentStep / 3) * 100}%`,
          height: '2px',
          background: 'linear-gradient(90deg, rgba(220,38,38,1) 0%, rgba(248,113,113,1) 100%)'
        }}></div>
        <div className="flex items-center justify-between relative z-10">
          {[
            { step: 1, title: "Información Personal" },
            { step: 2, title: "Propuesta y Disponibilidad" },
            { step: 3, title: "Materiales y Términos" }
          ].map(item => (
            <div key={item.step} className="flex flex-col items-center">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all shadow-md ${
                  currentStep === item.step 
                    ? 'bg-gradient-to-r from-red-600 to-red-500 text-white scale-110' 
                    : currentStep > item.step 
                      ? 'bg-gradient-to-r from-green-600 to-green-500 text-white' 
                      : 'bg-gray-800 text-gray-400'
                }`}
              >
                {currentStep > item.step ? <Check className="w-5 h-5" /> : item.step}
              </div>
              <span className={`text-sm mt-2 text-center hidden md:block ${
                currentStep === item.step ? 'text-white font-medium' : 'text-gray-400'
              }`}>{item.title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  
  
  // Resto del código sigue igual...
  
  // Añade el resto de los métodos de renderizado aquí...
  
  // Aquí iría el renderizado principal, etc.
  // ...
  
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* ... */}
      {/* Contenido del componente */}
      {/* ... */}
    </div>
  );
};
   
export default SpeakerRegistrationPlatform;
