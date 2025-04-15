import React, { useState } from 'react';  
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
  ArrowRight  
} from 'lucide-react';  



  
const SpeakerRegistrationPlatform = () => {  
  // ─── ESTADOS PRINCIPALES ───────────────────────────────  
  const [currentStep, setCurrentStep] = useState(1);  
  const [isSubmitted, setIsSubmitted] = useState(false);  
  const [showLoginForm, setShowLoginForm] = useState(false);  
    
  // Estado del formulario  
  const [formData, setFormData] = useState({  
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
  });  
  
  // Control de secciones expandidas  
  const [expandedSections, setExpandedSections] = useState({  
    personal: true,  
    redesSociales: false,  
    propuesta: false,  
    disponibilidad: false,  
    materiales: false,  
    terminos: false  
  });  
  
  // ─── CONSTANTES ───────────────────────────────  
  const categorias = [  
    'Innovación',  
    'Tecnología',  
    'Educación',  
    'Medio Ambiente',  
    'Salud',  
    'Cultura',  
    'Arte',  
    'Ciencia',  
    'Sociedad',  
    'Emprendimiento',  
    'Bienestar',  
    'Sostenibilidad',  
    'Otro'  
  ];  
  
  const fechasDisponibles = [  
    '15 de Mayo, 2025 (mañana)',  
    '15 de Mayo, 2025 (tarde)',  
    '16 de Mayo, 2025 (mañana)',  
    '16 de Mayo, 2025 (tarde)'  
  ];  
  
  // ─── HANDLERS ───────────────────────────────  
  const handleInputChange = (e) => {  
    const { name, value } = e.target;  
    setFormData(prev => ({ ...prev, [name]: value }));  
  };  
  
  const handleCheckboxChange = (e) => {  
    const { name, checked } = e.target;  
    setFormData(prev => ({ ...prev, [name]: checked }));  
  };  
  
  const handleCategoriaChange = (categoria) => {  
    setFormData(prev => {  
      const categoriasActuales = [...prev.categorias];  
      if (categoriasActuales.includes(categoria)) {  
        return { ...prev, categorias: categoriasActuales.filter(cat => cat !== categoria) };  
      } else {  
        if (categoriasActuales.length < 3) {  
          return { ...prev, categorias: [...categoriasActuales, categoria] };  
        }  
        return prev;  
      }  
    });  
  };  
  
  const handleDisponibilidadChange = (fecha) => {  
    setFormData(prev => {  
      const disponibilidadActual = [...prev.disponibilidad];  
      if (disponibilidadActual.includes(fecha)) {  
        return { ...prev, disponibilidad: disponibilidadActual.filter(f => f !== fecha) };  
      } else {  
        return { ...prev, disponibilidad: [...disponibilidadActual, fecha] };  
      }  
    });  
  };  
  
  const handleFileChange = (e) => {  
    const { name, files } = e.target;  
    if (files && files[0]) {  
      setFormData(prev => ({ ...prev, [name]: files[0] }));  
    }  
  };  
  
  const toggleSection = (section) => {  
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));  
  };  
  
  const nextStep = () => {  
    setCurrentStep(prev => Math.min(prev + 1, 3));  
  };  
  
  const prevStep = () => {  
    setCurrentStep(prev => Math.max(prev - 1, 1));  
  };  
  
  const handleSubmit = (e) => {  
    e.preventDefault();  
    // Lógica de envío de datos  
    console.log('Formulario enviado:', formData);  
    setIsSubmitted(true);  
  };  
  
  const saveProgress = () => {  
    alert('¡Progreso guardado! Puedes continuar más tarde.');  
  };  
  
  const handleLogin = (e) => {  
    e.preventDefault();  
    // Lógica para el login  
    setShowLoginForm(false);  
  };  
  
  // ─── RENDERIZADO DE COMPONENTES ───────────────────────────────  
  
  // Indicador de pasos  
  const renderStepIndicator = () => (  
    <div className="flex items-center justify-center mb-8">  
      {[1, 2, 3].map(step => (  
        <React.Fragment key={step}>  
          <div className={`mx-2 font-semibold ${currentStep === step ? 'text-red-600' : 'text-gray-400'}`}>  
            {step}  
          </div>  
          {step < 3 && <div className="w-8 border-t border-gray-500" />}  
        </React.Fragment>  
      ))}  
    </div>  
  );  
  
  // Sección: Información Personal  
  const renderPersonalInfoSection = () => (  
    <div className="mb-8">  
      <div  
        className="flex justify-between items-center cursor-pointer"  
        onClick={() => toggleSection('personal')}  
      >  
        <h3 className="text-xl font-semibold flex items-center">  
          <User className="w-5 h-5 mr-2 text-red-500" />  
          Información Personal  
        </h3>  
        {expandedSections.personal ? (  
          <ChevronUp className="w-5 h-5 text-gray-400" />  
        ) : (  
          <ChevronDown className="w-5 h-5 text-gray-400" />  
        )}  
      </div>  
      {expandedSections.personal && (  
        <div className="mt-4 space-y-6">  
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">  
            <div>  
              <label htmlFor="nombre" className="block text-sm font-medium mb-2">  
                Nombre *  
              </label>  
              <input  
                type="text"  
                id="nombre"  
                name="nombre"  
                value={formData.nombre}  
                onChange={handleInputChange}  
                required  
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"  
                placeholder="Tu nombre"  
              />  
            </div>  
            <div>  
              <label htmlFor="apellido" className="block text-sm font-medium mb-2">  
                Apellido *  
              </label>  
              <input  
                type="text"  
                id="apellido"  
                name="apellido"  
                value={formData.apellido}  
                onChange={handleInputChange}  
                required  
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"  
                placeholder="Tu apellido"  
              />  
            </div>  
          </div>  
  
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">  
            <div>  
              <label htmlFor="email" className="block text-sm font-medium mb-2">  
                Correo electrónico *  
              </label>  
              <input  
                type="email"  
                id="email"  
                name="email"  
                value={formData.email}  
                onChange={handleInputChange}  
                required  
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"  
                placeholder="tu@correo.com"  
              />  
            </div>  
            <div>  
              <label htmlFor="telefono" className="block text-sm font-medium mb-2">  
                Teléfono de contacto *  
              </label>  
              <input  
                type="tel"  
                id="telefono"  
                name="telefono"  
                value={formData.telefono}  
                onChange={handleInputChange}  
                required  
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"  
                placeholder="+56 9 XXXX XXXX"  
              />  
            </div>  
          </div>  
  
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">  
            <div>  
              <label htmlFor="ciudad" className="block text-sm font-medium mb-2">  
                Ciudad *  
              </label>  
              <input  
                type="text"  
                id="ciudad"  
                name="ciudad"  
                value={formData.ciudad}  
                onChange={handleInputChange}  
                required  
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"  
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
            <label htmlFor="biografia" className="block text-sm font-medium mb-2">  
              Biografía (máx. 200 palabras) *  
            </label>  
            <textarea  
              id="biografia"  
              name="biografia"  
              value={formData.biografia}  
              onChange={handleInputChange}  
              required  
              rows={4}  
              maxLength={1000}  
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"  
              placeholder="Cuéntanos sobre ti, tu experiencia profesional y trayectoria."  
            ></textarea>  
            <p className="text-xs text-gray-400 mt-1">  
              {formData.biografia.length}/1000 caracteres  
            </p>  
          </div>  
        </div>  
      )}  
    </div>  
  );  
  
  // Sección: Redes Sociales  
  const renderSocialMediaSection = () => (  
    <div className="mb-8">  
      <div  
        className="flex justify-between items-center cursor-pointer"  
        onClick={() => toggleSection('redesSociales')}  
      >  
        <h3 className="text-xl font-semibold flex items-center">  
          <Globe className="w-5 h-5 mr-2 text-red-500" />  
          Redes Sociales  
        </h3>  
        {expandedSections.redesSociales ? (  
          <ChevronUp className="w-5 h-5 text-gray-400" />  
        ) : (  
          <ChevronDown className="w-5 h-5 text-gray-400" />  
        )}  
      </div>  
      {expandedSections.redesSociales && (  
        <div className="mt-4 space-y-6">  
          <p className="text-gray-400 text-sm">  
            (Opcional) Comparte tus perfiles para conocerte mejor.  
          </p>  
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
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"  
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
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"  
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
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"  
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
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"  
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
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"  
              placeholder="https://youtube.com/c/tucanal"  
            />  
          </div>  
        </div>  
      )}  
    </div>  
  );  
  
  // Sección: Propuesta  
  const renderProposalSection = () => (  
    <div className="mb-8">  
      <div  
        className="flex justify-between items-center cursor-pointer"  
        onClick={() => toggleSection('propuesta')}  
      >  
        <h3 className="text-xl font-semibold flex items-center">  
          <Mic className="w-5 h-5 mr-2 text-red-500" />  
          Tu Propuesta  
        </h3>  
        {expandedSections.propuesta ? (  
          <ChevronUp className="w-5 h-5 text-gray-400" />  
        ) : (  
          <ChevronDown className="w-5 h-5 text-gray-400" />  
        )}  
      </div>  
      {expandedSections.propuesta && (  
        <div className="mt-4 space-y-6">  
          <div>  
            <label htmlFor="tituloCharla" className="block text-sm font-medium mb-2">  
              Título de tu charla *  
            </label>  
            <input  
              type="text"  
              id="tituloCharla"  
              name="tituloCharla"  
              value={formData.tituloCharla}  
              onChange={handleInputChange}  
              required  
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"  
              placeholder="Título claro y atractivo"  
            />  
          </div>  
          <div>  
            <label className="block text-sm font-medium mb-2">  
              Categorías (selecciona hasta 3) *  
            </label>  
            <div className="flex flex-wrap gap-2">  
              {categorias.map(categoria => (  
                <button  
                  key={categoria}  
                  type="button"  
                  onClick={() => handleCategoriaChange(categoria)}  
                  className={`px-3 py-1 rounded-full text-sm transition ${  
                    formData.categorias.includes(categoria)  
                      ? 'bg-red-600 text-white'  
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'  
                  }`}  
                >  
                  {categoria}  
                </button>  
              ))}  
            </div>  
            <p className="text-xs text-gray-400 mt-1">  
              {formData.categorias.length} de 3 seleccionadas.  
            </p>  
          </div>  
          <div>  
            <label htmlFor="descripcionBreve" className="block text-sm font-medium mb-2">  
              Descripción breve (máx. 50 palabras) *  
            </label>  
            <textarea  
              id="descripcionBreve"  
              name="descripcionBreve"  
              value={formData.descripcionBreve}  
              onChange={handleInputChange}  
              required  
              rows={2}  
              maxLength={300}  
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"  
              placeholder="Resume tu idea"  
            ></textarea>  
            <p className="text-xs text-gray-400 mt-1">  
              {formData.descripcionBreve.length}/300 caracteres  
            </p>  
          </div>  
          <div>  
            <label htmlFor="descripcionDetallada" className="block text-sm font-medium mb-2">  
              Descripción detallada (máx. 500 palabras) *  
            </label>  
            <textarea  
              id="descripcionDetallada"  
              name="descripcionDetallada"  
              value={formData.descripcionDetallada}  
              onChange={handleInputChange}  
              required  
              rows={6}  
              maxLength={3000}  
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"  
              placeholder="Explica tu idea en detalle"  
            ></textarea>  
            <p className="text-xs text-gray-400 mt-1">  
              {formData.descripcionDetallada.length}/3000 caracteres  
            </p>  
          </div>  
          <div>  
            <label htmlFor="impactoEsperado" className="block text-sm font-medium mb-2">  
              Impacto esperado (máx. 200 palabras) *  
            </label>  
            <textarea  
              id="impactoEsperado"  
              name="impactoEsperado"  
              value={formData.impactoEsperado}  
              onChange={handleInputChange}  
              required  
              rows={4}  
              maxLength={1200}  
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"  
              placeholder="¿Qué impacto buscas generar?"  
            ></textarea>  
            <p className="text-xs text-gray-400 mt-1">  
              {formData.impactoEsperado.length}/1200 caracteres  
            </p>  
          </div>  
          <div>  
            <label htmlFor="experienciaPrevia" className="block text-sm font-medium mb-2">  
              Experiencia previa como orador/a (opcional)  
            </label>  
            <textarea  
              id="experienciaPrevia"  
              name="experienciaPrevia"  
              value={formData.experienciaPrevia}  
              onChange={handleInputChange}  
              rows={3}  
              maxLength={1000}  
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"  
              placeholder="Describe tus charlas anteriores"  
            ></textarea>  
            <p className="text-xs text-gray-400 mt-1">  
              {formData.experienciaPrevia.length}/1000 caracteres  
            </p>  
          </div>  
          <div>  
            <label htmlFor="motivacion" className="block text-sm font-medium mb-2">  
              ¿Por qué quieres dar una charla en TEDxLasCondes? *  
            </label>  
            <textarea  
              id="motivacion"  
              name="motivacion"  
              value={formData.motivacion}  
              onChange={handleInputChange}  
              required  
              rows={3}  
              maxLength={1000}  
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"  
              placeholder="Comparte tu motivación"  
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
    <div className="mb-8">  
      <div  
        className="flex justify-between items-center cursor-pointer"  
        onClick={() => toggleSection('disponibilidad')}  
      >  
        <h3 className="text-xl font-semibold flex items-center">  
          <Calendar className="w-5 h-5 mr-2 text-red-500" />  
          Disponibilidad  
        </h3>  
        {expandedSections.disponibilidad ? (  
          <ChevronUp className="w-5 h-5 text-gray-400" />  
        ) : (  
          <ChevronDown className="w-5 h-5 text-gray-400" />  
        )}  
      </div>  
      {expandedSections.disponibilidad && (  
        <div className="mt-4 space-y-6">  
          <p className="text-gray-400 text-sm">  
            Indica las fechas y horarios en los que podrías asistir a coaching y ensayos.  
          </p>  
          <div>  
            <label className="block text-sm font-medium mb-2">  
              Fechas disponibles (selecciona al menos una) *  
            </label>  
            <div className="space-y-3">  
              {fechasDisponibles.map(fecha => (  
                <div key={fecha} className="flex items-center">  
                  <input  
                    type="checkbox"  
                    id={`fecha-${fecha}`}  
                    checked={formData.disponibilidad.includes(fecha)}  
                    onChange={() => handleDisponibilidadChange(fecha)}  
                    className="w-5 h-5 bg-gray-800 border border-gray-700 rounded focus:ring-red-500 text-red-600"  
                  />  
                  <label htmlFor={`fecha-${fecha}`} className="ml-3 text-gray-300 cursor-pointer">  
                    {fecha}  
                  </label>  
                </div>  
              ))}  
            </div>  
            {formData.disponibilidad.length === 0 && (  
              <p className="text-xs text-red-500 mt-1">  
                Selecciona al menos una fecha disponible.  
              </p>  
            )}  
          </div>  
          <div className="bg-red-500/10 p-4 rounded-lg">  
            <p className="text-sm text-gray-300 flex items-start">  
              <AlertCircle className="w-5 h-5 mr-2 text-red-500 flex-shrink-0" />  
              Los speakers deberán asistir a sesiones de coaching y ensayos en las semanas previas.  
            </p>  
          </div>  
        </div>  
      )}  
    </div>  
  );  
  
  // Sección: Materiales de Apoyo  
  const renderMaterialsSection = () => (  
    <div className="mb-8">  
      <div  
        className="flex justify-between items-center cursor-pointer"  
        onClick={() => toggleSection('materiales')}  
      >  
        <h3 className="text-xl font-semibold flex items-center">  
          <FileText className="w-5 h-5 mr-2 text-red-500" />  
          Materiales de Apoyo  
        </h3>  
        {expandedSections.materiales ? (  
          <ChevronUp className="w-5 h-5 text-gray-400" />  
        ) : (  
          <ChevronDown className="w-5 h-5 text-gray-400" />  
        )}  
      </div>  
      {expandedSections.materiales && (  
        <div className="mt-4 space-y-6">  
          <div>  
            <label className="block text-sm font-medium mb-2">  
              Foto de perfil (JPG o PNG, máx. 2MB) *  
            </label>  
            <div className="border border-dashed border-gray-600 rounded-lg p-6 text-center">  
              {formData.fotoPerfil ? (  
                <div className="space-y-2">  
                  <div className="w-24 h-24 mx-auto rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">  
                    <img  
                      src={URL.createObjectURL(formData.fotoPerfil)}  
                      alt="Vista previa"  
                      className="w-full h-full object-cover"  
                    />  
                  </div>  
                  <p className="text-sm text-gray-400">  
                    {formData.fotoPerfil.name} ({Math.round(formData.fotoPerfil.size / 1024)} KB)  
                  </p>  
                  <button  
                    type="button"  
                    onClick={() => setFormData(prev => ({ ...prev, fotoPerfil: null }))}  
                    className="text-red-500 text-sm hover:text-red-400 transition"  
                  >  
                    Eliminar  
                  </button>  
                </div>  
              ) : (  
                <>  
                  <Upload className="w-12 h-12 text-gray-500 mx-auto mb-2" />  
                  <p className="text-gray-400 mb-2">Arrastra y suelta tu foto, o</p>  
                  <label htmlFor="fotoPerfil" className="bg-gray-800 px-4 py-2 rounded-lg text-white hover:bg-gray-700 cursor-pointer inline-block">  
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
                  <p className="text-xs text-gray-500 mt-2">  
                    Se usará en el sitio web y materiales promocionales.  
                  </p>  
                </>  
              )}  
            </div>  
          </div>  
          <div>  
            <label className="block text-sm font-medium mb-2">  
              Currículum Vitae (PDF, máx. 5MB)  
            </label>  
            <div className="border border-dashed border-gray-600 rounded-lg p-6 text-center">  
              {formData.cv ? (  
                <div className="space-y-2">  
                  <div className="flex items-center justify-center space-x-2">  
                    <FileText className="w-8 h-8 text-red-500" />  
                    <span className="text-white">{formData.cv.name}</span>  
                  </div>  
                  <p className="text-sm text-gray-400">{Math.round(formData.cv.size / 1024)} KB</p>  
                  <button  
                    type="button"  
                    onClick={() => setFormData(prev => ({ ...prev, cv: null }))}  
                    className="text-red-500 text-sm hover:text-red-400 transition"  
                  >  
                    Eliminar  
                  </button>  
                </div>  
              ) : (  
                <>  
                  <Upload className="w-12 h-12 text-gray-500 mx-auto mb-2" />  
                  <p className="text-gray-400 mb-2">Arrastra y suelta tu CV, o</p>  
                  <label htmlFor="cv" className="bg-gray-800 px-4 py-2 rounded-lg text-white hover:bg-gray-700 cursor-pointer inline-block">  
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
                </>  
              )}  
            </div>  
          </div>  
          <div>  
            <label className="block text-sm font-medium mb-2">  
              Presentación o material (PDF/PPT, máx. 10MB)  
            </label>  
            <div className="border border-dashed border-gray-600 rounded-lg p-6 text-center">  
              {formData.presentacion ? (  
                <div className="space-y-2">  
                  <div className="flex items-center justify-center space-x-2">  
                    <FileText className="w-8 h-8 text-red-500" />  
                    <span className="text-white">{formData.presentacion.name}</span>  
                  </div>  
                  <p className="text-sm text-gray-400">{Math.round(formData.presentacion.size / 1024)} KB</p>  
                  <button  
                    type="button"  
                    onClick={() => setFormData(prev => ({ ...prev, presentacion: null }))}  
                    className="text-red-500 text-sm hover:text-red-400 transition"  
                  >  
                    Eliminar  
                  </button>  
                </div>  
              ) : (  
                <>  
                  <Upload className="w-12 h-12 text-gray-500 mx-auto mb-2" />  
                  <p className="text-gray-400 mb-2">Arrastra y suelta tu presentación, o</p>  
                  <label htmlFor="presentacion" className="bg-gray-800 px-4 py-2 rounded-lg text-white hover:bg-gray-700 cursor-pointer inline-block">  
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
                </>  
              )}  
            </div>  
          </div>  
          <div>  
            <label htmlFor="videoDemo" className="block text-sm font-medium mb-2">  
              Enlace a video demostrativo (opcional)  
            </label>  
            <input  
              type="url"  
              id="videoDemo"  
              name="videoDemo"  
              value={formData.videoDemo}  
              onChange={handleInputChange}  
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"  
              placeholder="https://youtube.com/watch?v=xxxx"  
            />  
            <p className="text-xs text-gray-400 mt-1">  
              Comparte un enlace a un video si tienes material previo.  
            </p>  
          </div>  
        </div>  
      )}  
    </div>  
  );  
  
  // Sección: Términos y Condiciones  
  const renderTermsSection = () => (  
    <div className="mb-8">  
      <div  
        className="flex justify-between items-center cursor-pointer"  
        onClick={() => toggleSection('terminos')}  
      >  
        <h3 className="text-xl font-semibold flex items-center">  
          <Lock className="w-5 h-5 mr-2 text-red-500" />  
          Términos y Condiciones  
        </h3>  
        {expandedSections.terminos ? (  
          <ChevronUp className="w-5 h-5 text-gray-400" />  
        ) : (  
          <ChevronDown className="w-5 h-5 text-gray-400" />  
        )}  
      </div>  
      {expandedSections.terminos && (  
        <div className="mt-4 space-y-6">  
          <div className="bg-gray-800 p-4 rounded-lg max-h-40 overflow-y-auto text-sm text-gray-300">  
            <h4 className="font-semibold mb-2">Términos para Speakers de TEDxLasCondes</h4>  
            <p className="mb-2">Al postular, aceptas:</p>  
            <ol className="list-decimal pl-5 space-y-2">  
              <li>Tu charla debe ser original y no presentada previamente en otro evento TEDx o TED.</li>  
              <li>Participarás en sesiones de coaching y ensayos en caso de ser seleccionado.</li>  
              <li>TEDxLasCondes podrá grabar y publicar tu charla digitalmente.</li>  
              <li>La charla debe ajustarse a los lineamientos de TED, evitando contenido comercial, religioso o polarizante.</li>  
              <li>El tiempo máximo será de 18 minutos.</li>  
              <li>No existe remuneración económica para los speakers.</li>  
              <li>No usarás la plataforma para promocionar productos o servicios.</li>  
            </ol>  
          </div>  
          <div className="space-y-4">  
            <div className="flex items-start">  
              <input  
                type="checkbox"  
                id="aceptaTerminos"  
                name="aceptaTerminos"  
                checked={formData.aceptaTerminos}  
                onChange={handleCheckboxChange}  
                required  
                className="w-5 h-5 mt-1 bg-gray-800 border border-gray-700 rounded focus:ring-red-500 text-red-600"  
              />  
              <label htmlFor="aceptaTerminos" className="ml-3 text-gray-300 cursor-pointer">  
                He leído y acepto los términos *  
              </label>  
            </div>  
            <div className="flex items-start">  
              <input  
                type="checkbox"  
                id="aceptaComunicaciones"  
                name="aceptaComunicaciones"  
                checked={formData.aceptaComunicaciones}  
                onChange={handleCheckboxChange}  
                className="w-5 h-5 mt-1 bg-gray-800 border border-gray-700 rounded focus:ring-red-500 text-red-600"  
              />  
              <label htmlFor="aceptaComunicaciones" className="ml-3 text-gray-300 cursor-pointer">  
                Acepto recibir comunicaciones de TEDxLasCondes.  
              </label>  
            </div>  
          </div>  
        </div>  
      )}  
    </div>  
  );  
  
  // Página de confirmación  
  const renderConfirmationPage = () => (  
    <div className="text-center py-12">  
      <div className="w-16 h-16 mx-auto bg-green-500 rounded-full flex items-center justify-center mb-6">  
        <CheckCircle className="w-10 h-10 text-white" />  
      </div>  
      <h2 className="text-3xl font-bold mb-4">¡Postulación enviada con éxito!</h2>  
      <p className="text-gray-300 mb-6 max-w-md mx-auto">  
        Gracias por postular como speaker para TEDxLasCondes. Revisarás tu correo para mayor información.  
      </p>  
      <div className="bg-gray-800 rounded-lg p-6 max-w-md mx-auto mb-8">  
        <p className="text-gray-400 mb-2">Correo de confirmación enviado a:</p>  
        <p className="text-white font-semibold">{formData.email}</p>  
        <p className="text-sm text-gray-400 mt-4">  
          Si no lo encuentras, revisa la carpeta de spam.  
        </p>  
      </div>  
      <div className="space-y-4">  
        <p className="text-gray-300">  
          ID de postulación: <span className="font-mono bg-gray-800 px-2 py-1 rounded">#TEDx2025-{Math.floor(100000 + Math.random() * 900000)}</span>  
        </p>  
        <p className="text-gray-400 text-sm">  
          Guarda este código para futuras consultas.  
        </p>  
      </div>  
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">  
        <button className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition w-full sm:w-auto">  
          Volver al inicio  
        </button>  
        <button className="bg-transparent border border-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition w-full sm:w-auto">  
          Ver postulaciones destacadas  
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
  
  // Renderizado principal del contenido  
  const renderMainContent = () => {  
    if (isSubmitted) {  
      return renderConfirmationPage();  
    }  
    return (  
      <div className="w-full max-w-5xl mx-auto">  
        {renderStepIndicator()}  
        <form onSubmit={handleSubmit}>  
          {currentStep === 1 && (  
            <>  
              {renderPersonalInfoSection()}  
              {renderSocialMediaSection()}  
              <div className="flex justify-between mt-12">  
                <button  
                  type="button"  
                  onClick={saveProgress}  
                  className="bg-transparent border border-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition flex items-center"  
                >  
                  <Save className="w-5 h-5 mr-2" />  
                  Guardar progreso  
                </button>  
                <button  
                  type="button"  
                  onClick={nextStep}  
                  className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition flex items-center"  
                >  
                  Siguiente  
                  <ArrowRight className="w-5 h-5 ml-2" />  
                </button>  
              </div>  
            </>  
          )}  
          {currentStep === 2 && (  
            <>  
              {renderProposalSection()}  
              {renderAvailabilitySection()}  
              <div className="flex justify-between mt-12">  
                <button  
                  type="button"  
                  onClick={prevStep}  
                  className="bg-transparent border border-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"  
                >  
                  Anterior  
                </button>  
                <div className="flex space-x-4">  
                  <button  
                    type="button"  
                    onClick={saveProgress}  
                    className="bg-transparent border border-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition flex items-center"  
                  >  
                    <Save className="w-5 h-5 mr-2" />  
                    Guardar progreso  
                  </button>  
                  <button  
                    type="button"  
                    onClick={nextStep}  
                    className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition flex items-center"  
                  >  
                    Siguiente  
                    <ArrowRight className="w-5 h-5 ml-2" />  
                  </button>  
                </div>  
              </div>  
            </>  
          )}  
          {currentStep === 3 && (  
            <>  
              {renderMaterialsSection()}  
              {renderTermsSection()}  
              <div className="flex justify-between mt-12">  
                <button  
                  type="button"  
                  onClick={prevStep}  
                  className="bg-transparent border border-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"  
                >  
                  Anterior  
                </button>  
                <div className="flex space-x-4">  
                  <button  
                    type="button"  
                    onClick={saveProgress}  
                    className="bg-transparent border border-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition flex items-center"  
                  >  
                    <Save className="w-5 h-5 mr-2" />  
                    Guardar progreso  
                  </button>  
                  <button  
                    type="submit"  
                    className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition flex items-center"  
                    disabled={!formData.aceptaTerminos}  
                  >  
                    <Send className="w-5 h-5 mr-2" />  
                    Enviar postulación  
                  </button>  
                </div>  
              </div>  
            </>  
          )}  
        </form>  
      </div>  
    );  
  };  
  
  return (  
    <div className="min-h-screen bg-black text-white font-sans">  
      {/* Header */}  
      <header className="bg-black sticky top-0 z-40 border-b border-gray-800">  
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">  
          <div className="flex items-center">  
            <div className="text-red-600 font-bold text-3xl mr-2">TEDx</div>  
            <div className="text-white font-bold text-xl">LasCondes</div>  
          </div>  
          <div className="flex items-center space-x-4">  
            <button  
              onClick={() => setShowLoginForm(true)}  
              className="text-gray-300 hover:text-white transition"  
            >  
              ¿Ya tienes una postulación?  
            </button>  
            <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition">  
              Volver al inicio  
            </button>  
          </div>  
        </div>  
      </header>  
  
      {/* Hero Section */}  
      <section className="bg-gradient-to-b from-black to-gray-900 pt-16 pb-12">  
        <div className="container mx-auto px-4 text-center">  
          <div className="inline-block bg-red-600 text-white px-4 py-1 rounded-full text-sm mb-4">  
            TEDxLasCondes 2025  
          </div>  
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Postula como Speaker</h1>  
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">  
            Comparte tu idea y forma parte de TEDxLasCondes.  
          </p>  
        </div>  
      </section>  
  
      {/* Contenido Principal */}  
      <section className="py-12 bg-gray-900">  
        <div className="container mx-auto px-4">  
          {renderMainContent()}  
        </div>  
      </section>  
  
      {/* Footer */}  
      <footer className="bg-black py-6 border-t border-gray-800">  
        <div className="container mx-auto px-4 text-center">  
          <p className="text-gray-400 text-sm">© 2025 TEDxLasCondes. Todos los derechos reservados.</p>  
        </div>  
      </footer>  
  
      {/* Modal de Login */}  
      {showLoginForm && renderLoginForm()}  
    </div>  
  );  
};  
  
export default SpeakerRegistrationPlatform;