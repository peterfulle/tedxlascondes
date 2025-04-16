import SpeakerService from './api-service';
import React, { useState, useEffect } from 'react';




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
  Save,
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
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
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


  // Validaciones y mensajes centralizados
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


  // Configuración de archivos aceptados
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
  }, [formData]);
  

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


  // Reemplaza la función validateStep por esta versión:
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
  
  const saveProgress = () => {
    setIsSaving(true);
    
    // Simulamos una operación asíncrona
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    }, 800);
  };




  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Resetear errores
    setFormErrors({});
    setIsSubmitting(true);
    
    console.log("Iniciando envío de formulario...");
    
    try {
      // Validación general
      const validationErrors = validateForm(formData);
      
      if (Object.keys(validationErrors).length > 0) {
        setFormErrors(validationErrors);
        setIsSubmitting(false);
        return;
      }
      
      // Preparar datos para envío
      const speakerData = {
        // Agregar id generado en el cliente para cumplir con la validación
        id: `client-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        
        // Campos personales
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        telefono: formData.telefono,
        ciudad: formData.ciudad,
        pais: formData.pais || "Chile",
        biografia: formData.biografia,
        
        // Redes sociales (opcional)
        website: formData.website || "",
        linkedin: formData.linkedin || "",
        twitter: formData.twitter || "",
        instagram: formData.instagram || "",
        youtube: formData.youtube || "",
        
        // Propuesta de charla
        tituloCharla: formData.tituloCharla,
        categorias: formData.categorias,
        descripcionBreve: formData.descripcionBreve,
        descripcionDetallada: formData.descripcionDetallada,
        impactoEsperado: formData.impactoEsperado,
        experienciaPrevia: formData.experienciaPrevia || "",
        motivacion: formData.motivacion,
        
        // Disponibilidad
        disponibilidad: formData.disponibilidad,
        
        // VideoDemo (solo URL)
        videoDemo: formData.videoDemo || "",
        
        // Términos
        aceptaTerminos: formData.aceptaTerminos,
        aceptaComunicaciones: formData.aceptaComunicaciones
      };
      
      console.log("Datos preparados para envío:", speakerData);
      
      // Paso 1: Crear el registro de speaker
      console.log("Llamando a SpeakerService.createSpeaker()...");
      const speakerResponse = await SpeakerService.createSpeaker(speakerData);
      console.log("Speaker creado con éxito:", speakerResponse);
      
      // Paso 2: Subir archivos si existen
      if (formData.fotoPerfil || formData.cv || formData.presentacion) {
        try {
          console.log("Subiendo archivos...");
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
        submit: `Error al enviar la postulación: ${error.message || "Error de conexión con el servidor"}`
      }));
      
      setIsSubmitting(false);
    }
  };

  




  // Función de validación central
  const validateForm = (formData) => {
    const errors = {};

    // Validaciones personales
    if (!formData.nombre) errors.nombre = 'Nombre es obligatorio';
    if (!formData.apellido) errors.apellido = 'Apellido es obligatorio';
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Correo electrónico inválido';
    }
    if (!formData.telefono) errors.telefono = 'Teléfono es obligatorio';
    if (!formData.ciudad) errors.ciudad = 'Ciudad es obligatoria';

    // Validaciones de propuesta
    if (!formData.tituloCharla) errors.tituloCharla = 'Título de charla es obligatorio';
    if (formData.categorias.length === 0) errors.categorias = 'Selecciona al menos una categoría';
    if (!formData.descripcionBreve) errors.descripcionBreve = 'Descripción breve es obligatoria';
    if (!formData.descripcionDetallada) errors.descripcionDetallada = 'Descripción detallada es obligatoria';
    if (!formData.impactoEsperado) errors.impactoEsperado = 'Impacto esperado es obligatorio';
    
    // Validaciones de disponibilidad
    if (formData.disponibilidad.length === 0) errors.disponibilidad = 'Selecciona al menos una fecha';
    
    // Validaciones de materiales
    if (!formData.fotoPerfil) errors.fotoPerfil = 'Foto de perfil es obligatoria';
    
    // Validaciones de términos
    if (!formData.aceptaTerminos) errors.aceptaTerminos = 'Debes aceptar los términos y condiciones';

    return errors;
  };




  
  // Sección: Información Personal
  const renderPersonalInfoSection = () => (
    <div className="mb-8 animate-fade-in">
      <div 
        className={`flex justify-between items-center cursor-pointer p-4 rounded-t-xl ${
          expandedSections.personal ? 'bg-gray-800 text-white' : 'bg-gray-900 text-gray-300 hover:bg-gray-800/50'
        }`}
        onClick={() => toggleSection('personal')}
      >
        <h3 className="text-xl font-semibold flex items-center">
          <User className={`w-5 h-5 mr-3 ${expandedSections.personal ? 'text-red-500' : 'text-gray-400'}`} />
          Información Personal
          {completedSections.personal && <Check className="w-5 h-5 ml-2 text-green-500" />}
        </h3>
        <div className="flex items-center">
          {!completedSections.personal && <span className="text-yellow-500 text-sm mr-3">Pendiente</span>}
          {expandedSections.personal ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>
      
      {expandedSections.personal && (
        <div className="bg-gray-900 border border-gray-800 rounded-b-xl p-6 shadow-lg space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">





            <div>
              <label htmlFor="nombre" className="block text-sm font-medium mb-2 flex items-center">
                Nombre *
                {formErrors.nombre && (
                  <span className="ml-2 text-red-500 text-xs error-message flex items-center">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    {formErrors.nombre}
                  </span>
                )}
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-3 rounded-lg bg-gray-800 border ${
                  formErrors.nombre ? 'border-red-500' : 'border-gray-700'
                } text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition`}
                placeholder="Tu nombre"
              />
            </div>





            <div>
              <label htmlFor="apellido" className="block text-sm font-medium mb-2 flex items-center">
                Apellido *
                {formErrors.apellido && (
                  <span className="ml-2 text-red-500 text-xs error-message flex items-center">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    {formErrors.apellido}
                  </span>
                )}
              </label>
              <input
                type="text"
                id="apellido"
                name="apellido"
                value={formData.apellido}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-3 rounded-lg bg-gray-800 border ${
                  formErrors.apellido ? 'border-red-500' : 'border-gray-700'
                } text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition`}
                placeholder="Tu apellido"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2 flex items-center">
                Correo electrónico *
                {formErrors.email && (
                  <span className="ml-2 text-red-500 text-xs error-message flex items-center">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    {formErrors.email}
                  </span>
                )}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-3 rounded-lg bg-gray-800 border ${
                  formErrors.email ? 'border-red-500' : 'border-gray-700'
                } text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition`}
                placeholder="tu@correo.com"
              />
            </div>
            <div>
              <label htmlFor="telefono" className="block text-sm font-medium mb-2 flex items-center">
                Teléfono de contacto *
                {formErrors.telefono && (
                  <span className="ml-2 text-red-500 text-xs error-message flex items-center">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    {formErrors.telefono}
                  </span>
                )}
              </label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-3 rounded-lg bg-gray-800 border ${
                  formErrors.telefono ? 'border-red-500' : 'border-gray-700'
                } text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition`}
                placeholder="+56 9 XXXX XXXX"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="ciudad" className="block text-sm font-medium mb-2 flex items-center">
                Ciudad *
                {formErrors.ciudad && (
                  <span className="ml-2 text-red-500 text-xs error-message flex items-center">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    {formErrors.ciudad}
                  </span>
                )}
              </label>
              <input
                type="text"
                id="ciudad"
                name="ciudad"
                value={formData.ciudad}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-3 rounded-lg bg-gray-800 border ${
                  formErrors.ciudad ? 'border-red-500' : 'border-gray-700'
                } text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition`}
                placeholder="Tu ciudad"
              />
            </div>
            <div>
              <label htmlFor="pais" className="block text-sm font-medium mb-2">
                País *
              </label>
              <select
                id="pais"
                name="pais"
                value={formData.pais}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              >
                <option value="Chile">Chile</option>
                <option value="Argentina">Argentina</option>
                <option value="Bolivia">Bolivia</option>
                <option value="Perú">Perú</option>
                <option value="Colombia">Colombia</option>
                <option value="Ecuador">Ecuador</option>
                <option value="México">México</option>
                <option value="España">España</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="biografia" className="block text-sm font-medium mb-2 flex justify-between">
              <div className="flex items-center">
                Biografía (máx. 200 palabras) *
                {formErrors.biografia && (
                  <span className="ml-2 text-red-500 text-xs error-message flex items-center">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    {formErrors.biografia}
                  </span>
                )}
              </div>
              <button 
                type="button" 
                className="text-gray-400 hover:text-white flex items-center text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  alert("La biografía debe resumir tu trayectoria profesional, experiencia relevante y principales logros. Será utilizada en los materiales del evento si eres seleccionado/a.");
                }}
              >
                <HelpCircle className="w-3 h-3 mr-1" />
                Ayuda
              </button>
            </label>
            <textarea
              id="biografia"
              name="biografia"
              value={formData.biografia}
              onChange={handleInputChange}
              required
              rows={4}
              maxLength={1000}
              className={`w-full px-4 py-3 rounded-lg bg-gray-800 border ${
                formErrors.biografia ? 'border-red-500' : 'border-gray-700'
              } text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition`}
              placeholder="Cuéntanos sobre ti, tu experiencia profesional y trayectoria."
            ></textarea>
            <div className="flex justify-between items-center mt-1">
              <p className="text-xs text-gray-400">
                {formData.biografia.length}/1000 caracteres
              </p>
              <p className="text-xs text-gray-400">
                Aproximadamente {formData.biografia.split(/\s+/).filter(Boolean).length} palabras
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );





  // Sección: Redes Sociales
    const renderSocialMediaSection = () => (
      <div className="mb-8 animate-fade-in">
        <div 
          className={`flex justify-between items-center cursor-pointer p-4 rounded-t-xl ${
            expandedSections.redesSociales ? 'bg-gray-800 text-white' : 'bg-gray-900 text-gray-300 hover:bg-gray-800/50'
          }`}
          onClick={() => toggleSection('redesSociales')}
        >
          <h3 className="text-xl font-semibold flex items-center">
            <Globe className={`w-5 h-5 mr-3 ${expandedSections.redesSociales ? 'text-red-500' : 'text-gray-400'}`} />
            Redes Sociales
            {completedSections.redesSociales && <Check className="w-5 h-5 ml-2 text-green-500" />}
          </h3>
          <div className="flex items-center">
            {expandedSections.redesSociales ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </div>
        
        {expandedSections.redesSociales && (
          <div className="bg-gray-900 border border-gray-800 rounded-b-xl p-6 shadow-lg space-y-6">
            <div className="bg-gray-800/50 p-4 rounded-lg mb-4">
              <p className="text-gray-300 text-sm flex items-start">
                <Info className="w-5 h-5 mr-2 text-blue-400 flex-shrink-0" />
                Esta sección es opcional, pero recomendamos completarla para conectar mejor con la audiencia y el equipo de TEDx.
              </p>
            </div>
            
            <div>
              <label htmlFor="website" className="block text-sm font-medium mb-2 flex items-center">
                <Globe className="w-4 h-4 mr-2 text-gray-400" />
                Sitio web
              </label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition"
                placeholder="https://tusitio.com"
              />
            </div>
            <div>
              <label htmlFor="linkedin" className="block text-sm font-medium mb-2 flex items-center">
                <Linkedin className="w-4 h-4 mr-2 text-gray-400" />
                LinkedIn
              </label>
              <input
                type="url"
                id="linkedin"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition"
                placeholder="https://linkedin.com/in/tunombre"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="twitter" className="block text-sm font-medium mb-2 flex items-center">
                  <Twitter className="w-4 h-4 mr-2 text-gray-400" />
                  Twitter
                </label>
                <input
                  type="url"
                  id="twitter"
                  name="twitter"
                  value={formData.twitter}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition"
                  placeholder="https://twitter.com/tuusuario"
                />
              </div>
              <div>
                <label htmlFor="instagram" className="block text-sm font-medium mb-2 flex items-center">
                  <Instagram className="w-4 h-4 mr-2 text-gray-400" />
                  Instagram
                </label>
                <input
                  type="url"
                  id="instagram"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition"
                  placeholder="https://instagram.com/tuusuario"
                />
              </div>
            </div>
            <div>
              <label htmlFor="youtube" className="block text-sm font-medium mb-2 flex items-center">
                <Youtube className="w-4 h-4 mr-2 text-gray-400" />
                Canal de YouTube
              </label>
              <input
                type="url"
                id="youtube"
                name="youtube"
                value={formData.youtube}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition"
                placeholder="https://youtube.com/c/tucanal"
              />
            </div>
          </div>
        )}
      </div>
    );
    
    // Sección: Propuesta
    const renderProposalSection = () => (
      <div className="mb-8 animate-fade-in">
        <div 
          className={`flex justify-between items-center cursor-pointer p-4 rounded-t-xl ${
            expandedSections.propuesta ? 'bg-gray-800 text-white' : 'bg-gray-900 text-gray-300 hover:bg-gray-800/50'
          }`}
          onClick={() => toggleSection('propuesta')}
        >
          <h3 className="text-xl font-semibold flex items-center">
            <Mic className={`w-5 h-5 mr-3 ${expandedSections.propuesta ? 'text-red-500' : 'text-gray-400'}`} />
            Tu Propuesta
            {completedSections.propuesta && <Check className="w-5 h-5 ml-2 text-green-500" />}
          </h3>
          <div className="flex items-center">
            {!completedSections.propuesta && <span className="text-yellow-500 text-sm mr-3">Pendiente</span>}
            {expandedSections.propuesta ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </div>
        
        {expandedSections.propuesta && (
          <div className="bg-gray-900 border border-gray-800 rounded-b-xl p-6 shadow-lg space-y-6">
            <div>
              <label htmlFor="tituloCharla" className="block text-sm font-medium mb-2 flex items-center">
                Título de tu charla *
                {formErrors.tituloCharla && (
                  <span className="ml-2 text-red-500 text-xs error-message flex items-center">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    {formErrors.tituloCharla}
                  </span>
                )}
              </label>
              <input
                type="text"
                id="tituloCharla"
                name="tituloCharla"
                value={formData.tituloCharla}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-3 rounded-lg bg-gray-800 border ${
                  formErrors.tituloCharla ? 'border-red-500' : 'border-gray-700'
                } text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition`}
                placeholder="Título claro y atractivo"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center">
                Categorías (selecciona hasta 3) *
                {formErrors.categorias && (
                  <span className="ml-2 text-red-500 text-xs error-message flex items-center">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    {formErrors.categorias}
                  </span>
                )}
              </label>

              <div className="flex flex-wrap gap-2">
                {categorias.map(categoria => (
                  <button
                    key={categoria.id}
                    type="button"
                    onClick={() => handleCategoriaChange(categoria.id)}
                    className={`px-3 py-1 rounded-full text-sm transition-all ${
                      formData.categorias.includes(categoria.id)
                        ? 'bg-red-600 text-white shadow-lg shadow-red-900/20'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    {formData.categorias.includes(categoria.id) && (
                      <Check className="w-3 h-3 mr-1 inline-block" />
                    )}
                    {categoria.nombre}
                  </button>
                ))}
              </div>

              <p className="text-xs text-gray-400 mt-1">
                {formData.categorias.length} de 3 seleccionadas.
              </p>
            </div>
            <div>
              <label htmlFor="descripcionBreve" className="block text-sm font-medium mb-2 flex items-start justify-between">
                <div className="flex items-center">
                  Descripción breve (máx. 50 palabras) *
                  {formErrors.descripcionBreve && (
                    <span className="ml-2 text-red-500 text-xs error-message flex items-center">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      {formErrors.descripcionBreve}
                    </span>
                  )}
                </div>
                <button 
                  type="button" 
                  className="text-gray-400 hover:text-white flex items-center text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    alert("Esta descripción corta será utilizada en materiales promocionales y programas del evento. Debe capturar la esencia de tu idea de forma concisa.");
                  }}
                >
                  <HelpCircle className="w-3 h-3 mr-1" />
                  Ayuda
                </button>
              </label>
              <textarea
                id="descripcionBreve"
                name="descripcionBreve"
                value={formData.descripcionBreve}
                onChange={handleInputChange}
                required
                rows={2}
                maxLength={300}
                className={`w-full px-4 py-3 rounded-lg bg-gray-800 border ${
                  formErrors.descripcionBreve ? 'border-red-500' : 'border-gray-700'
                } text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition`}
                placeholder="Resume tu idea de forma atractiva y concisa"
              ></textarea>
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-gray-400">
                  {formData.descripcionBreve.length}/300 caracteres
                </p>
                <p className="text-xs text-gray-400">
                  Aproximadamente {formData.descripcionBreve.split(/\s+/).filter(Boolean).length} palabras
                </p>
              </div>
            </div>
            <div>
              <label htmlFor="descripcionDetallada" className="block text-sm font-medium mb-2 flex items-start justify-between">
                <div className="flex items-center">
                  Descripción detallada (máx. 500 palabras) *
                  {formErrors.descripcionDetallada && (
                    <span className="ml-2 text-red-500 text-xs error-message flex items-center">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      {formErrors.descripcionDetallada}
                    </span>
                  )}
                </div>
                <button 
                  type="button" 
                  className="text-gray-400 hover:text-white flex items-center text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    alert("Explica tu idea en detalle, incluyendo los puntos principales que desarrollarías en tu charla. Menciona qué hace única a tu propuesta y por qué es relevante para la audiencia de TEDx.");
                  }}
                >
                  <HelpCircle className="w-3 h-3 mr-1" />
                  Ayuda
                </button>
              </label>
              <textarea
                id="descripcionDetallada"
                name="descripcionDetallada"
                value={formData.descripcionDetallada}
                onChange={handleInputChange}
                required
                rows={6}
                maxLength={3000}
                className={`w-full px-4 py-3 rounded-lg bg-gray-800 border ${
                  formErrors.descripcionDetallada ? 'border-red-500' : 'border-gray-700'
                } text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition`}
                placeholder="Explica tu idea en detalle"
              ></textarea>
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-gray-400">
                  {formData.descripcionDetallada.length}/3000 caracteres
                </p>
                <p className="text-xs text-gray-400">
                  Aproximadamente {formData.descripcionDetallada.split(/\s+/).filter(Boolean).length} palabras
                </p>
              </div>
            </div>
            <div>
              <label htmlFor="impactoEsperado" className="block text-sm font-medium mb-2 flex items-start justify-between">
                <div className="flex items-center">
                  Impacto esperado (máx. 200 palabras) *
                  {formErrors.impactoEsperado && (
                    <span className="ml-2 text-red-500 text-xs error-message flex items-center">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      {formErrors.impactoEsperado}
                    </span>
                  )}
                </div>
                <button 
                  type="button" 
                  className="text-gray-400 hover:text-white flex items-center text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    alert("Describe cómo tu charla podría impactar a la audiencia. ¿Qué cambio de perspectiva buscas generar? ¿Qué acción o reflexión esperas inspirar?");
                  }}
                >
                  <HelpCircle className="w-3 h-3 mr-1" />
                  Ayuda
                </button>
              </label>
              <textarea
                id="impactoEsperado"
                name="impactoEsperado"
                value={formData.impactoEsperado}
                onChange={handleInputChange}
                required
                rows={4}
                maxLength={1200}
                className={`w-full px-4 py-3 rounded-lg bg-gray-800 border ${
                  formErrors.impactoEsperado ? 'border-red-500' : 'border-gray-700'
                } text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition`}
                placeholder="¿Qué impacto buscas generar con tu charla?"
              ></textarea>
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-gray-400">
                  {formData.impactoEsperado.length}/1200 caracteres
                </p>
                <p className="text-xs text-gray-400">
                  Aproximadamente {formData.impactoEsperado.split(/\s+/).filter(Boolean).length} palabras
                </p>
              </div>
            </div>
            <div>
              <label htmlFor="experienciaPrevia" className="block text-sm font-medium mb-2 flex justify-between">
                <span>Experiencia previa como orador/a (opcional)</span>
                <button 
                  type="button" 
                  className="text-gray-400 hover:text-white flex items-center text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    alert("Describe cualquier experiencia previa dando charlas, conferencias o presentaciones. No es necesario tener experiencia, pero es útil conocer tu nivel de comodidad en escenario.");
                  }}
                >
                  <HelpCircle className="w-3 h-3 mr-1" />
                  Ayuda
                </button>
              </label>
              <textarea
                id="experienciaPrevia"
                name="experienciaPrevia"
                value={formData.experienciaPrevia}
                onChange={handleInputChange}
                rows={3}
                maxLength={1000}
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition"
                placeholder="Describe tus charlas o presentaciones anteriores (si no tienes experiencia, no hay problema)"
              ></textarea>
              <p className="text-xs text-gray-400 mt-1">
                {formData.experienciaPrevia.length}/1000 caracteres
              </p>
            </div>
            <div>
              <label htmlFor="motivacion" className="block text-sm font-medium mb-2 flex items-center">
                ¿Por qué quieres dar una charla en TEDxLasCondes? *
                {formErrors.motivacion && (
                  <span className="ml-2 text-red-500 text-xs error-message flex items-center">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    {formErrors.motivacion}
                  </span>
                )}
              </label>
              <textarea
                id="motivacion"
                name="motivacion"
                value={formData.motivacion}
                onChange={handleInputChange}
                required
                rows={3}
                maxLength={1000}
                className={`w-full px-4 py-3 rounded-lg bg-gray-800 border ${
                  formErrors.motivacion ? 'border-red-500' : 'border-gray-700'
                } text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition`}
                placeholder="Comparte tu motivación personal para postular"
              ></textarea>
              <p className="text-xs text-gray-400 mt-1">
                {formData.motivacion.length}/1000 caracteres
              </p>
            </div>
          </div>
        )}
      </div>
    );


    
   
   
   
   
  // Sección: Disponibilidad
  const renderAvailabilitySection = () => (
    <div className="mb-8 animate-fade-in">
      <div 
        className={`flex justify-between items-center cursor-pointer p-4 rounded-t-xl ${
          expandedSections.disponibilidad ? 'bg-gray-800 text-white' : 'bg-gray-900 text-gray-300 hover:bg-gray-800/50'
        }`}
        onClick={() => toggleSection('disponibilidad')}
      >
        <h3 className="text-xl font-semibold flex items-center">
          <Calendar className={`w-5 h-5 mr-3 ${expandedSections.disponibilidad ? 'text-red-500' : 'text-gray-400'}`} />
          Disponibilidad
          {completedSections.disponibilidad && <Check className="w-5 h-5 ml-2 text-green-500" />}
        </h3>
        <div className="flex items-center">
          {!completedSections.disponibilidad && <span className="text-yellow-500 text-sm mr-3">Pendiente</span>}
          {expandedSections.disponibilidad ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>
      
      {expandedSections.disponibilidad && (
        <div className="bg-gray-900 border border-gray-800 rounded-b-xl p-6 shadow-lg space-y-6">
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <p className="text-gray-300 text-sm flex items-start">
              <Info className="w-5 h-5 mr-2 text-blue-400 flex-shrink-0" />
              Los speakers seleccionados deberán asistir a sesiones de coaching y ensayos durante las fechas indicadas para preparar su presentación.
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-4">
              Fechas disponibles para coaching y ensayos (selecciona al menos una) *
              {formErrors.disponibilidad && (
                <span className="ml-2 text-red-500 text-xs error-message flex items-center">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {formErrors.disponibilidad}
                </span>
              )}
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fechasDisponibles.map(fecha => (
                <div 
                  key={fecha.id} 
                  className={`p-4 rounded-lg border border-gray-700 cursor-pointer transition-all ${
                    formData.disponibilidad.includes(fecha.id) 
                      ? 'bg-red-900/20 border-red-500/50' 
                      : 'bg-gray-800 hover:bg-gray-800/70'
                  }`}
                  onClick={() => handleDisponibilidadChange(fecha.id)}
                >
                  <div className="flex items-center">
                    <div className={`w-5 h-5 flex-shrink-0 rounded border mr-3 flex items-center justify-center ${
                      formData.disponibilidad.includes(fecha.id) 
                        ? 'bg-red-500 border-red-500' 
                        : 'border-gray-600'
                    }`}>
                      {formData.disponibilidad.includes(fecha.id) && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <div>
                      <p className={`${formData.disponibilidad.includes(fecha.id) ? 'text-white' : 'text-gray-300'}`}>
                        {fecha.texto}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {fecha.horario} hrs.
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-red-500/10 p-4 rounded-lg">
            <p className="text-sm text-gray-300 flex items-start">
              <AlertCircle className="w-5 h-5 mr-2 text-red-500 flex-shrink-0" />
              La asistencia a las sesiones de coaching es obligatoria para los speakers seleccionados.
              No podrás participar en el evento principal sin completar este proceso.
            </p>
          </div>
        </div>
      )}
    </div>
  );



  // Sección: Materiales de Apoyo - Corregida
  const renderMaterialsSection = () => (
    <div className="mb-8 animate-fade-in">
      <div 
        className={`flex justify-between items-center cursor-pointer p-4 rounded-t-xl ${
          expandedSections.materiales ? 'bg-gray-800 text-white' : 'bg-gray-900 text-gray-300 hover:bg-gray-800/50'
        }`}
        onClick={() => toggleSection('materiales')}
      >
        <h3 className="text-xl font-semibold flex items-center">
          <FileText className={`w-5 h-5 mr-3 ${expandedSections.materiales ? 'text-red-500' : 'text-gray-400'}`} />
          Materiales de Apoyo
          {completedSections.materiales && <Check className="w-5 h-5 ml-2 text-green-500" />}
        </h3>
        <div className="flex items-center">
          {!completedSections.materiales && <span className="text-yellow-500 text-sm mr-3">Pendiente</span>}
          {expandedSections.materiales ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>
      
      {expandedSections.materiales && (
        <div className="bg-gray-900 border border-gray-800 rounded-b-xl p-6 shadow-lg space-y-6">
          {/* Foto de perfil */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Foto de perfil (JPG o PNG, máx. 2MB) *
              {formErrors.fotoPerfil && (
                <span className="ml-2 text-red-500 text-xs error-message flex items-center">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {formErrors.fotoPerfil}
                </span>
              )}
            </label>
            <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-all ${
              formData.fotoPerfil ? 'border-green-500/50 bg-green-500/5' : 
              formErrors.fotoPerfil ? 'border-red-500/50 bg-red-500/5' : 'border-gray-600 bg-gray-800/30'
            }`}>
              {formData.fotoPerfil ? (
                <div className="space-y-3">
                  <div className="w-32 h-32 mx-auto rounded-full overflow-hidden bg-gray-700 flex items-center justify-center border-4 border-gray-800">
                    <img
                      src={URL.createObjectURL(formData.fotoPerfil)}
                      alt="Vista previa"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-sm text-gray-300 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    {formData.fotoPerfil.name} ({Math.round(formData.fotoPerfil.size / 1024)} KB)
                  </p>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, fotoPerfil: null }))}
                    className="text-red-500 text-sm hover:text-red-400 transition flex items-center mx-auto"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Eliminar
                  </button>
                </div>
              ) : (
                <div className="group">
                  <Upload className="w-12 h-12 text-gray-500 mx-auto mb-2 group-hover:text-red-500 transition-colors" />
                  <p className="text-gray-400 mb-3">Arrastra y suelta tu foto, o</p>
                  <label htmlFor="fotoPerfil" className="bg-gray-800 px-4 py-2 rounded-lg text-white hover:bg-red-600 transition-colors cursor-pointer inline-block">
                    Seleccionar archivo
                  </label>
                  <input
                    type="file"
                    id="fotoPerfil"
                    name="fotoPerfil"
                    accept="image/jpeg, image/png"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <p className="text-xs text-gray-500 mt-3">
                    Se usará en el sitio web y materiales promocionales.
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* CV */}
          <div>
            <label className="block text-sm font-medium mb-2 flex justify-between">
              <span>Currículum Vitae (PDF, máx. 5MB)</span>
              {formErrors.cv && (
                <span className="text-red-500 text-xs error-message flex items-center">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {formErrors.cv}
                </span>
              )}
            </label>
            <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-all ${
              formData.cv ? 'border-green-500/50 bg-green-500/5' : 
              formErrors.cv ? 'border-red-500/50 bg-red-500/5' : 'border-gray-600 bg-gray-800/30'
            }`}>
              {formData.cv ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-center space-x-3">
                    <FileText className="w-8 h-8 text-red-500" />
                    <span className="text-white">{formData.cv.name}</span>
                  </div>
                  <p className="text-sm text-gray-300 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    Archivo subido correctamente ({Math.round(formData.cv.size / 1024)} KB)
                  </p>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, cv: null }))}
                    className="text-red-500 text-sm hover:text-red-400 transition flex items-center mx-auto"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Eliminar
                  </button>
                </div>
              ) : (
                <div className="group">
                  <Upload className="w-12 h-12 text-gray-500 mx-auto mb-2 group-hover:text-red-500 transition-colors" />
                  <p className="text-gray-400 mb-3">Arrastra y suelta tu CV, o</p>
                  <label htmlFor="cv" className="bg-gray-800 px-4 py-2 rounded-lg text-white hover:bg-red-600 transition-colors cursor-pointer inline-block">
                    Seleccionar archivo
                  </label>
                  <input
                    type="file"
                    id="cv"
                    name="cv"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              )}
            </div>
          </div>
          
          {/* Presentación */}
          <div>
            <label className="block text-sm font-medium mb-2 flex justify-between">
              <span>Presentación o material (PDF/PPT, máx. 10MB)</span>
              {formErrors.presentacion && (
                <span className="text-red-500 text-xs error-message flex items-center">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {formErrors.presentacion}
                </span>
              )}
            </label>
            <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-all ${
              formData.presentacion ? 'border-green-500/50 bg-green-500/5' : 
              formErrors.presentacion ? 'border-red-500/50 bg-red-500/5' : 'border-gray-600 bg-gray-800/30'
            }`}>
              {formData.presentacion ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-center space-x-3">
                    <FileText className="w-8 h-8 text-red-500" />
                    <span className="text-white">{formData.presentacion.name}</span>
                  </div>
                  <p className="text-sm text-gray-300 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    Archivo subido correctamente ({Math.round(formData.presentacion.size / 1024)} KB)
                  </p>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, presentacion: null }))}
                    className="text-red-500 text-sm hover:text-red-400 transition flex items-center mx-auto"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Eliminar
                  </button>
                </div>
              ) : (
                <div className="group">
                  <Upload className="w-12 h-12 text-gray-500 mx-auto mb-2 group-hover:text-red-500 transition-colors" />
                  <p className="text-gray-400 mb-3">Arrastra y suelta tu presentación, o</p>
                  <label htmlFor="presentacion" className="bg-gray-800 px-4 py-2 rounded-lg text-white hover:bg-red-600 transition-colors cursor-pointer inline-block">
                    Seleccionar archivo
                  </label>
                  <input
                    type="file"
                    id="presentacion"
                    name="presentacion"
                    accept="application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              )}
            </div>
          </div>
          
          {/* Video demo */}
          <div>
            <label htmlFor="videoDemo" className="block text-sm font-medium mb-2">
              Enlace a video demostrativo (opcional)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Youtube className="w-5 h-5 text-gray-500" />
              </div>
              <input
                type="url"
                id="videoDemo"
                name="videoDemo"
                value={formData.videoDemo}
                onChange={handleInputChange}
                className="w-full pl-12 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition"
                placeholder="https://youtube.com/watch?v=xxxx"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1 flex items-center">
              <Info className="w-3 h-3 mr-1 text-blue-400" />
              Comparte un enlace a un video si tienes material previo de charlas o presentaciones.
            </p>
          </div>
        </div>
      )}
    </div>
  );
  
  
 





   

   // Sección: Términos y Condiciones
     const renderTermsSection = () => (
       <div className="mb-8 animate-fade-in">
         <div 
           className={`flex justify-between items-center cursor-pointer p-4 rounded-t-xl ${
             expandedSections.terminos ? 'bg-gray-800 text-white' : 'bg-gray-900 text-gray-300 hover:bg-gray-800/50'
           }`}
           onClick={() => toggleSection('terminos')}
         >
           <h3 className="text-xl font-semibold flex items-center">
             <Lock className={`w-5 h-5 mr-3 ${expandedSections.terminos ? 'text-red-500' : 'text-gray-400'}`} />
             Términos y Condiciones
             {completedSections.terminos && <Check className="w-5 h-5 ml-2 text-green-500" />}
           </h3>
           <div className="flex items-center">
             {!completedSections.terminos && <span className="text-yellow-500 text-sm mr-3">Pendiente</span>}
             {expandedSections.terminos ? (
               <ChevronUp className="w-5 h-5 text-gray-400" />
             ) : (
               <ChevronDown className="w-5 h-5 text-gray-400" />
             )}
           </div>
         </div>
         
         {expandedSections.terminos && (
           <div className="bg-gray-900 border border-gray-800 rounded-b-xl p-6 shadow-lg space-y-6">
             <div className="bg-gray-800 p-5 rounded-lg max-h-60 overflow-y-auto text-sm text-gray-300 border border-gray-700">
               <h4 className="font-semibold mb-4 text-white text-lg">Términos para Speakers de TEDxLasCondes</h4>
               <p className="mb-4">Al postular, aceptas:</p>
               <ol className="list-decimal pl-5 space-y-3">
                 <li>Tu charla debe ser original y no presentada previamente en otro evento TEDx o TED.</li>
                 <li>Participarás en sesiones de coaching y ensayos en caso de ser seleccionado.</li>
                 <li>TEDxLasCondes podrá grabar y publicar tu charla digitalmente.</li>
                 <li>La charla debe ajustarse a los lineamientos de TED, evitando contenido comercial, religioso o polarizante.</li>
                 <li>El tiempo máximo será de 18 minutos.</li>
                 <li>No existe remuneración económica para los speakers.</li>
                 <li>No usarás la plataforma para promocionar productos o servicios.</li>
               </ol>
             </div>
             
             <div className="space-y-5">
               <div className="flex items-start">
                 <div 
                   onClick={() => handleCheckboxChange({target: {name: 'aceptaTerminos', checked: !formData.aceptaTerminos}})}
                   className="cursor-pointer flex-shrink-0 mt-1"
                 >
                   <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition ${
                     formData.aceptaTerminos 
                       ? 'bg-red-600 border-red-600' 
                       : formErrors.aceptaTerminos 
                         ? 'border-red-500' 
                         : 'border-gray-600 hover:border-red-500'
                   }`}>
                     {formData.aceptaTerminos && <Check className="w-4 h-4 text-white" />}
                   </div>
                 </div>
                 <label 
                   htmlFor="aceptaTerminos" 
                   className="ml-3 text-gray-300 cursor-pointer"
                   onClick={() => handleCheckboxChange({target: {name: 'aceptaTerminos', checked: !formData.aceptaTerminos}})}
                 >
                   <span className="block mb-1">He leído y acepto los términos *</span>
                   {formErrors.aceptaTerminos && (
                     <span className="text-red-500 text-xs error-message flex items-center">
                       <AlertTriangle className="w-3 h-3 mr-1" />
                       Debes aceptar los términos y condiciones para continuar
                     </span>
                   )}
                 </label>
               </div>
               
               <div className="flex items-start">
                 <div 
                   onClick={() => handleCheckboxChange({target: {name: 'aceptaComunicaciones', checked: !formData.aceptaComunicaciones}})}
                   className="cursor-pointer flex-shrink-0 mt-1"
                 >
                   <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition ${
                     formData.aceptaComunicaciones 
                       ? 'bg-red-600 border-red-600' 
                       : 'border-gray-600 hover:border-red-500'
                   }`}>
                     {formData.aceptaComunicaciones && <Check className="w-4 h-4 text-white" />}
                   </div>
                 </div>
                 <label 
                   htmlFor="aceptaComunicaciones" 
                   className="ml-3 text-gray-300 cursor-pointer"
                   onClick={() => handleCheckboxChange({target: {name: 'aceptaComunicaciones', checked: !formData.aceptaComunicaciones}})}
                 >
                   Acepto recibir comunicaciones de TEDxLasCondes sobre eventos, oportunidades y novedades.
                 </label>
               </div>
             </div>
             
             <div className="p-4 rounded-lg bg-blue-900/20 border border-blue-900/30 flex items-start">
               <Info className="w-5 h-5 text-blue-400 mr-3 flex-shrink-0 mt-0.5" />
               <div>
                 <p className="text-gray-300 text-sm mb-2">
                   Al finalizar tu postulación, recibirás un correo electrónico de confirmación con un código único de referencia.
                 </p>
                 <p className="text-gray-300 text-sm">
                   El proceso de selección puede tomar hasta 4 semanas. Te notificaremos por correo electrónico sobre el estado de tu postulación.
                 </p>
               </div>
             </div>
           </div>
         )}
       </div>
     ); 
 
   

   // Página de confirmación
     const renderConfirmationPage = () => (
       <div className="text-center py-12 animate-fade-in">
         <div className="w-20 h-20 mx-auto bg-green-500 rounded-full flex items-center justify-center mb-8 shadow-lg shadow-green-500/20">
           <CheckCircle className="w-12 h-12 text-white" />
         </div>
         <h2 className="text-3xl font-bold mb-4">¡Postulación enviada con éxito!</h2>
         <p className="text-gray-300 mb-8 max-w-md mx-auto">
           Gracias por postular como speaker para TEDxLasCondes. Hemos enviado un correo de confirmación con los detalles de tu postulación.
         </p>
         
         <div className="bg-gradient-to-r from-gray-900 to-black rounded-lg p-8 max-w-md mx-auto mb-10 border border-gray-800">
           <p className="text-gray-400 mb-3">Correo de confirmación enviado a:</p>
           <p className="text-white text-xl font-semibold mb-6">{formData.email}</p>
           
           <div className="bg-black p-5 rounded-lg border border-gray-800 mb-6">
             <div className="flex justify-between items-center mb-3">
               <span className="text-gray-400 text-sm">ID de postulación</span>
               <button 
                 onClick={() => navigator.clipboard.writeText(`TEDx2025-${Math.floor(100000 + Math.random() * 900000)}`)}
                 className="text-blue-400 text-xs hover:text-blue-300 transition"
               >
                 Copiar
               </button>
             </div>
             <p className="font-mono bg-gray-800 px-3 py-2 rounded text-lg">
               #TEDx2025-{Math.floor(100000 + Math.random() * 900000)}
             </p>
           </div>
           
           <div className="text-sm text-gray-400 flex items-start">
             <AlertCircle className="w-4 h-4 mr-2 text-yellow-500 flex-shrink-0 mt-0.5" />
             <p>
               Si no encuentras el correo en tu bandeja de entrada, revisa la carpeta de spam o correo no deseado.
             </p>
           </div>
         </div>
         
         <div className="text-gray-400 mb-10">
           <p>El proceso de evaluación puede tomar hasta 4 semanas.</p>
           <p>Te contactaremos para informarte sobre el estado de tu postulación.</p>
         </div>
         
         <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
           <a href="/" className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition w-full sm:w-auto">
             Volver al inicio
           </a>
           <button 
             className="bg-transparent border border-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition w-full sm:w-auto"
             onClick={() => window.open('https://twitter.com/intent/tweet?text=Acabo%20de%20postular%20como%20speaker%20para%20TEDxLasCondes%202025.%20%C2%A1Desaf%C3%ADos%20aceptados!%20%23TEDxLasCondes', '_blank')}
           >
             Compartir en redes
           </button>
         </div>
       </div>
     );  
   
   // Modal de Login  
   const renderLoginForm = () => (  
     <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">  
       <div className="bg-gray-900 rounded-2xl w-full max-w-md p-8 animate-fadeIn">  
         <div className="flex justify-between items-center mb-6">  
           <h2 className="text-2xl font-bold">Acceder a tu cuenta</h2>  
           <button onClick={() => setShowLoginForm(false)} className="text-gray-400 hover:text-white">  
             <X className="w-6 h-6" />  
           </button>  
         </div>  
         <form onSubmit={handleLogin} className="space-y-6">  
           <div>  
             <label htmlFor="login-email" className="block text-sm font-medium mb-2">  
               Correo electrónico  
             </label>  
             <input  
               type="email"  
               id="login-email"  
               className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"  
               placeholder="tu@correo.com"  
             />  
           </div>  
           <div>  
             <label htmlFor="login-password" className="block text-sm font-medium mb-2">  
               Contraseña  
             </label>  
             <input  
               type="password"  
               id="login-password"  
               className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"  
               placeholder="••••••••"  
             />  
           </div>  
           <div className="flex items-center justify-between">  
             <div className="flex items-center">  
               <input  
                 id="remember-me"  
                 type="checkbox"  
                 className="w-4 h-4 bg-gray-800 border border-gray-700 rounded focus:ring-red-500 text-red-600"  
               />  
               <label htmlFor="remember-me" className="ml-2 text-sm text-gray-300">Recordarme</label>  
             </div>  
             <button type="button" className="text-red-500 text-sm hover:text-red-400">  
               ¿Olvidaste tu contraseña?  
             </button>  
           </div>  
           <button type="submit" className="w-full px-4 py-3 bg-red-600 rounded-lg text-white hover:bg-red-700 transition">  
             Iniciar sesión  
           </button>  
           <div className="text-center">  
             <p className="text-sm text-gray-400">  
               ¿No tienes una cuenta? <button type="button" className="text-red-500 hover:text-red-400">Regístrate</button>  
             </p>  
           </div>  
         </form>  
       </div>  
     </div>  
   ); 
   
   

   // Renderizado del popup de introducción
  const renderIntroPopup = () => (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center backdrop-blur-md">
      <div className="w-full max-w-4xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl shadow-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto">
        {/* Cabecera del popup */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="text-red-600 font-bold text-3xl mr-2">TEDx</div>
            <div className="text-white font-bold text-xl">LasCondes 2025</div>
          </div>
          <div className="rounded-lg bg-gray-800 px-3 py-1">
            <p className="text-xs text-gray-400">Paso {introStep} de 2</p>
          </div>
        </div>

        {introStep === 1 ? (
          /* Paso 1: Introducción general */
          <>
            <div className="text-center mb-8">
              <div className="inline-block bg-red-600 text-white px-4 py-1 rounded-full text-sm font-medium mb-4 animate-pulse">
                Convocatoria abierta 2025
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">Postula como <span className="text-red-600">Speaker</span></h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Comparte tu idea y forma parte de TEDxLasCondes 2025: "Horizontes Emergentes"
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-900/60 p-6 rounded-xl border border-gray-800 backdrop-blur-sm flex flex-col items-center text-center group hover:border-red-500/50 transition-all hover:bg-gray-800/40 hover:shadow-lg hover:shadow-red-500/10">
              <Calendar className="w-10 h-10 text-red-500 mb-3 group-hover:scale-110 transition-transform group-hover:text-red-400" />
              <h3 className="font-bold mb-1 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">Fecha límite</h3>
              <p className="text-gray-400">15 de Junio, 2025</p>
            </div>
              <div className="bg-gray-900/60 p-6 rounded-xl border border-gray-800 backdrop-blur-sm flex flex-col items-center text-center group hover:border-red-500/50 transition-all">
                <Clock className="w-10 h-10 text-red-500 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold mb-1">Tiempo estimado</h3>
                <p className="text-gray-400">15-20 minutos</p>
              </div>
              <div className="bg-gray-900/60 p-6 rounded-xl border border-gray-800 backdrop-blur-sm flex flex-col items-center text-center group hover:border-red-500/50 transition-all">
                <Users className="w-10 h-10 text-red-500 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold mb-1">Selección</h3>
                <p className="text-gray-400">15 speakers</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-red-900/30 to-black p-6 rounded-xl mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <Mic className="w-6 h-6 mr-2 text-red-500" />
                Acerca de la postulación
              </h2>
              <p className="text-gray-300 mb-4">
                Buscamos ideas originales y transformadoras que merezcan ser compartidas con nuestra audiencia. Si tienes una idea que puede cambiar perspectivas, inspirar acción o generar reflexión, queremos escucharte.
              </p>
              <p className="text-gray-300">
                Las charlas seleccionadas formarán parte del evento principal TEDxLasCondes 2025 y serán grabadas profesionalmente para su difusión global.
              </p>
            </div>

            <div className="flex justify-end">
              <button 
                onClick={() => setIntroStep(2)} 
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition flex items-center font-medium"
              >
                Ver requisitos
                <ChevronRight className="w-5 h-5 ml-1" />
              </button>
            </div>
          </>
        ) : (
          /* Paso 2: Requisitos y documentos */
          <>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">Requisitos de postulación</h2>
              <p className="text-gray-400">Asegúrate de tener preparados los siguientes elementos antes de comenzar</p>
            </div>

            <div className="space-y-6 mb-8">
              <div className="bg-gray-900/60 p-5 rounded-xl border border-gray-800">
                <h3 className="text-xl font-bold mb-3 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-red-500" />
                  Documentos requeridos
                </h3>
                <ul className="space-y-4 pl-2">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Foto de perfil (obligatorio)</p>
                      <p className="text-sm text-gray-400">Formato JPG o PNG, máximo 2MB</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">CV o Currículum (opcional)</p>
                      <p className="text-sm text-gray-400">Formato PDF, máximo 5MB</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Presentación o material de apoyo (opcional)</p>
                      <p className="text-sm text-gray-400">Formato PDF o PPT, máximo 10MB</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-900/60 p-5 rounded-xl border border-gray-800">
                <h3 className="text-xl font-bold mb-3 flex items-center">
                  <Info className="w-5 h-5 mr-2 text-blue-500" />
                  Información que deberás proporcionar
                </h3>
                <ul className="space-y-3 pl-2">
                  <li className="flex items-start">
                    <ChevronRight className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
                    <span>Datos personales y de contacto</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
                    <span>Título y descripción de tu charla</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
                    <span>Impacto esperado y motivación personal</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
                    <span>Disponibilidad para sesiones de coaching y ensayos</span>
                  </li>
                </ul>
              </div>

              <div className="bg-yellow-900/20 border border-yellow-900/30 p-5 rounded-xl">
                <div className="flex items-start">
                  <AlertCircle className="w-6 h-6 text-yellow-500 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-yellow-500 mb-1">Importante</h4>
                    <p className="text-gray-300 text-sm mb-2">
                      El formulario guardará automáticamente tu progreso, permitiéndote continuar más tarde si es necesario.
                    </p>
                    <p className="text-gray-300 text-sm">
                      Si eres seleccionado/a, deberás asistir a sesiones de coaching y ensayos previos al evento principal.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button 
                onClick={() => setIntroStep(1)} 
                className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition"
              >
                Atrás
              </button>
              <button 
                onClick={startApplication} 
                className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-3 rounded-lg hover:from-red-700 hover:to-red-800 transition flex items-center font-medium"
              >
                Iniciar postulación
                <ChevronRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );



   


    // Función handleLogin básica (pendiente)
    // Función renderStepIndicator básica (pendiente) error con linea, 
    //handleLogin está siendo llamado en la línea 1931, pero no existe ninguna definición de esa función
    const handleLogin = () => {
      console.log("Iniciar sesión...");
      // Aquí podrías colocar lógica de autenticación real más adelante
    };


    //renderStepIndicator está siendo llamado en la línea 2170, pero tampoco está definida.
    const renderStepIndicator = () => {
      return (
        <div style={{ margin: '20px 0' }}>
          <p>Paso actual: 1 de 3</p>
          <progress value="1" max="3" />
        </div>
      );
    };


    
   
   


   // Renderizado principal del contenido
     const renderMainContent = () => {
       if (isSubmitted) {
         return renderConfirmationPage();
       }
       
       return (
         <div className="w-full max-w-4xl mx-auto bg-gray-900/50 rounded-2xl p-6 shadow-xl border border-gray-800/50 backdrop-blur-sm">
           {renderStepIndicator()}
           
           <form onSubmit={handleSubmit} className="space-y-2">
             {currentStep === 1 && (
               <div className="space-y-2 animate-slide-in-right">
                 {renderPersonalInfoSection()}
                 {renderSocialMediaSection()}
                 
                 <div className="sticky bottom-0 flex justify-between mt-8 p-4 bg-gray-900/80 border border-gray-800 rounded-xl backdrop-blur-md">
                   <div className="flex-1"></div> {/* Spacer para alinear el botón a la derecha */}
                   <button
                      type="button"
                      onClick={nextStep}
                      disabled={isSubmitting}
                      className="relative overflow-hidden bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-3 rounded-lg hover:from-red-700 hover:to-red-800 transition flex items-center justify-center shadow-lg shadow-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed after:content-[''] after:absolute after:inset-0 after:bg-white after:opacity-0 after:hover:opacity-10 active:scale-[0.98]"
                    >
                      <span className="relative z-10 flex items-center">
                        Siguiente
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </span>
                    </button>
                 </div>
               </div>
             )}
             
             {currentStep === 2 && (
               <div className="space-y-2 animate-slide-in-right">
                 {renderProposalSection()}
                 {renderAvailabilitySection()}
                 
                 <div className="sticky bottom-0 flex justify-between mt-8 p-4 bg-gray-900/80 border border-gray-800 rounded-xl backdrop-blur-md">
                   <button
                     type="button"
                     onClick={prevStep}
                     className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition flex items-center"
                   >
                     <ArrowLeft className="w-4 h-4 mr-2" />
                     Anterior
                   </button>
                   
                   <button
                     type="button"
                     onClick={nextStep}
                     disabled={isSubmitting}
                     className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-3 rounded-lg hover:from-red-700 hover:to-red-800 transition flex items-center justify-center shadow-lg shadow-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                   >
                     Siguiente
                     <ArrowRight className="w-4 h-4 ml-2" />
                   </button>
                 </div>
               </div>
             )}
             
             {currentStep === 3 && (
               <div className="space-y-2 animate-slide-in-right">
                 {renderMaterialsSection()}
                 {renderTermsSection()}
                 
                 <div className="sticky bottom-0 flex justify-between mt-8 p-4 bg-gray-900/80 border border-gray-800 rounded-xl backdrop-blur-md">
                   <button
                     type="button"
                     onClick={prevStep}
                     className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition flex items-center"
                   >
                     <ArrowLeft className="w-4 h-4 mr-2" />
                     Anterior
                   </button>
                   
                   <button
                     type="submit"
                     disabled={isSubmitting || !formData.aceptaTerminos}
                     className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-3 rounded-lg hover:from-red-700 hover:to-red-800 transition flex items-center justify-center shadow-lg shadow-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                   >
                     {isSubmitting ? (
                       <>
                         <div className="animate-spin mr-2 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                         Enviando...
                       </>
                     ) : (
                       <>
                         <Send className="w-4 h-4 mr-2" />
                         Enviar postulación
                       </>
                     )}
                   </button>
                 </div>
               </div>
             )}
           </form>
         </div>
       );
     };


      return (
        <div className="min-h-screen bg-black text-white font-sans">
          {/* Mostrar el popup si showIntroPopup es true */}
          {showIntroPopup && renderIntroPopup()}
          
          {/* Header */}
          <header className="bg-black sticky top-0 z-40 border-b border-gray-800">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
              <a href="/" className="flex items-center group">
                <div className="text-red-600 font-bold text-3xl mr-2 transition group-hover:scale-105">TEDx</div>
                <div className="text-white font-bold text-xl transition group-hover:scale-105">LasCondes</div>
              </a>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowLoginForm(true)}
                  className="text-gray-300 hover:text-white transition flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  ¿Ya tienes una postulación?
                </button>
                <a href="/" className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-lg hover:from-red-700 hover:to-red-800 transition shadow-lg shadow-red-900/20">
                  Volver al inicio
                </a>
              </div>
            </div>
          </header>
      
          {/* Mostrar el contenido principal solo si el popup está cerrado */}
          {!showIntroPopup && (
            <>
              {/* Contenido Principal */}
              <section id="formulario" className="py-12 bg-gradient-to-b from-gray-900 to-black">
                <div className="container mx-auto px-4">
                  {renderMainContent()}
                </div>
              </section>
      
              {/* Footer */}
              <footer className="bg-black py-6 border-t border-gray-800">
                <div className="container mx-auto px-4 text-center">
                  <p className="text-gray-400 text-sm">© 2025 TEDxLasCondes. Este evento TEDx es operado bajo licencia de TED.</p>
                </div>
              </footer>
            </>
          )}
      
          {/* Modal de Login - se muestra independientemente del estado del popup */}
          {showLoginForm && renderLoginForm()}
          
          {/* Estilos específicos */}

          <style jsx>{`
            @keyframes fade-in {
              0% { opacity: 0; }
              100% { opacity: 1; }
            }
            
            @keyframes fade-in-out {
              0% { opacity: 0; transform: translateY(-10px); }
              20% { opacity: 1; transform: translateY(0); }
              80% { opacity: 1; transform: translateY(0); }
              100% { opacity: 0; transform: translateY(-10px); }
            }
            
            @keyframes slide-in-right {
              0% { transform: translateX(20px); opacity: 0; }
              100% { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes scaleIn {
              0% { transform: scale(0); }
              70% { transform: scale(1.1); }
              100% { transform: scale(1); }
            }
            
            @keyframes fadeUp {
              0% { opacity: 0; transform: translateY(10px); }
              100% { opacity: 1; transform: translateY(0); }
            }
            
            @keyframes pulse-border {
              0% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.4); }
              70% { box-shadow: 0 0 0 10px rgba(220, 38, 38, 0); }
              100% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0); }
            }
            
            .animate-fade-in {
              animation: fade-in 0.3s ease-out forwards;
            }
            
            .animate-fade-in-out {
              animation: fade-in-out 3s ease-out forwards;
            }
            
            .animate-slide-in-right {
              animation: slide-in-right 0.3s ease-out forwards;
            }
            
            .animate-scaleIn {
              animation: scaleIn 0.4s ease-out forwards;
            }
            
            .animate-fadeUp {
              animation: fadeUp 0.4s ease-out forwards;
            }
            
            .animate-pulse-border {
              animation: pulse-border 2s infinite;
            }
          `}</style>








        </div>
      );


    
   
     
  
 };  
   
 export default SpeakerRegistrationPlatform;