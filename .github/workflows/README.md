# TEDxLasCondes - Sistema de Gestión de Speakers

Este proyecto proporciona una plataforma completa para la gestión de postulaciones de speakers para TEDxLasCondes, incluyendo un formulario de registro y un dashboard administrativo para revisar y gestionar las postulaciones.

## Estructura del Proyecto

El proyecto está dividido en dos partes principales:

### Frontend (React)
- **SpeakerRegistrationPlatform**: Formulario de registro para speakers
- **TEDxAdminDashboard**: Panel de administración para gestionar postulaciones
- **Servicios API**: Comunicación con el backend

### Backend (FastAPI + Azure)
- **API REST**: Endpoints para gestión de speakers
- **Cosmos DB**: Base de datos para almacenar información de speakers
- **Blob Storage**: Almacenamiento para archivos (fotos, CV, presentaciones)

## Requisitos Previos

- Node.js 16+ para el frontend
- Python 3.8+ para el backend
- Cuenta de Azure con servicios:
  - Azure Cosmos DB
  - Azure Blob Storage

## Configuración del Backend

1. **Crear entorno virtual e instalar dependencias**:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # En Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. **Configurar variables de entorno**:
   - Copiar el archivo `.env.example` a `.env`
   - Completar con tus credenciales de Azure:
     ```
     COSMOS_URI=https://tedxlascondes-speakers.documents.azure.com:443/
     COSMOS_KEY=tu-primary-key-aquí
     COSMOS_DB=tedxlascondes-db
     COSMOS_CONTAINER=speakers
     
     BLOB_ACCOUNT_NAME=tu-storage-account
     BLOB_ACCOUNT_KEY=tu-storage-key
     BLOB_CONTAINER_NAME=tedx-speakers-files
     ```

3. **Iniciar el servidor de desarrollo**:
   ```bash
   uvicorn main:app --reload
   ```

## Configuración del Frontend

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Configurar variables de entorno**:
   - Crear archivo `.env.local` con:
     ```
     REACT_APP_API_URL=http://localhost:8000
     ```

3. **Iniciar el servidor de desarrollo**:
   ```bash
   npm start
   ```

## Configuración de Azure Cosmos DB

1. **Crear una base de datos en Cosmos DB**:
   - Desde el portal de Azure, crea un nuevo recurso de Azure Cosmos DB
   - Selecciona la API SQL (Core)
   - Crea una base de datos llamada "tedxlascondes-db"
   - Crea un contenedor llamado "speakers" con clave de partición "/id"

2. **Obtener credenciales**:
   - Ve a "Claves" en el panel lateral
   - Copia el URI y la Clave primaria a tu archivo `.env`

## Configuración de Azure Blob Storage

1. **Crear una cuenta de almacenamiento**:
   - Desde el portal de Azure, crea un nuevo recurso de Azure Storage
   - Configura un nuevo contenedor llamado "tedx-speakers-files"
   - Configura la política de acceso según tus necesidades

2. **Obtener credenciales**:
   - Ve a "Claves de acceso" en el panel lateral
   - Copia el nombre de la cuenta, la clave y la cadena de conexión a tu archivo `.env`

## Desarrollo

### Flujo de datos

1. El usuario completa el formulario en `SpeakerRegistrationPlatform`
2. Los datos se envían a la API mediante `SpeakerService.createSpeaker()`
3. Los archivos se suben a Azure Blob Storage mediante `StorageService.uploadFile()`
4. La información se almacena en Cosmos DB
5. El administrador puede ver y gestionar las postulaciones en `TEDxAdminDashboard`

### Personalización

- **Formulario de registro**: Editar `SpeakerRegistrationPlatform.js` para ajustar campos
- **Panel de administración**: Editar `TEDxAdminDashboard.js` para añadir funcionalidades
- **API**: Editar `main.py` para añadir endpoints

## Despliegue en Producción

### Backend (FastAPI)

1. **Configurar un servicio de App en Azure**:
   - Crear un recurso de App Service para Python
   - Configurar las variables de entorno
   - Implementar el código utilizando GitHub Actions o Azure DevOps

### Frontend (React)

1. **Generar una build de producción**:
   ```bash
   npm run build
   ```

2. **Opciones de despliegue**:
   - **Azure Static Web Apps**: Ideal para aplicaciones React
   - **Azure Blob Storage + CDN**: Para servir sitios estáticos
   - **GitHub Pages**: Opción gratuita para proyectos públicos

## Soporte

Para preguntas o soporte, contacta a:
- Peter Fülle (peter@tedxlascondes.cl)

---

© 2025 TEDxLasCondes. Todos los derechos reservados.