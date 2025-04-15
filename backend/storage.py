import os
import logging
from datetime import datetime, timedelta
from typing import Optional
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from azure.storage.blob import BlobServiceClient, generate_blob_sas, BlobSasPermissions

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Forzar el uso del modo de almacenamiento simulado para desarrollo
USE_MOCK_STORAGE = True

# Configuración de Azure Blob Storage
BLOB_ACCOUNT_NAME = os.getenv("BLOB_ACCOUNT_NAME")
BLOB_ACCOUNT_KEY = os.getenv("BLOB_ACCOUNT_KEY")
BLOB_CONNECTION_STRING = os.getenv("BLOB_CONNECTION_STRING")
BLOB_CONTAINER_NAME = os.getenv("BLOB_CONTAINER_NAME", "tedx-speakers-files")

# Verificar si tenemos configuración (para referencia futura)
if not BLOB_CONNECTION_STRING:
    if BLOB_ACCOUNT_NAME and BLOB_ACCOUNT_KEY:
        BLOB_CONNECTION_STRING = f"DefaultEndpointsProtocol=https;AccountName={BLOB_ACCOUNT_NAME};AccountKey={BLOB_ACCOUNT_KEY};EndpointSuffix=core.windows.net"
    else:
        logger.warning("Missing Blob Storage configuration. Using mock storage.")

# Si tenemos la configuración y no estamos en modo simulado, inicializamos el cliente
if not USE_MOCK_STORAGE:
    try:
        blob_service_client = BlobServiceClient.from_connection_string(BLOB_CONNECTION_STRING)
        # Crear el contenedor si no existe
        try:
            container_client = blob_service_client.get_container_client(BLOB_CONTAINER_NAME)
            if not container_client.exists():
                container_client = blob_service_client.create_container(BLOB_CONTAINER_NAME)
                logger.info(f"Container '{BLOB_CONTAINER_NAME}' created")
            else:
                logger.info(f"Container '{BLOB_CONTAINER_NAME}' already exists")
        except Exception as e:
            logger.error(f"Error accessing or creating container: {e}")
            USE_MOCK_STORAGE = True
    except Exception as e:
        logger.error(f"Failed to initialize Blob Storage client: {e}")
        USE_MOCK_STORAGE = True

# Router para endpoints de almacenamiento
router = APIRouter(prefix="/storage", tags=["storage"])

# Modelos para las peticiones y respuestas
class UploadUrlRequest(BaseModel):
    file_name: str
    content_type: str
    speaker_id: str
    category: str  # fotoPerfil, cv, presentacion

class UploadUrlResponse(BaseModel):
    upload_url: str
    public_url: str
    expires_in: int  # segundos

@router.post("/upload-url", response_model=UploadUrlResponse)
async def get_upload_url(request: UploadUrlRequest):
    """
    Genera una URL firmada para subir un archivo a Azure Blob Storage.
    """
    if USE_MOCK_STORAGE:
        # Para desarrollo, simulamos una URL
        mock_url = f"https://example.com/mock-upload/{request.speaker_id}/{request.category}/{request.file_name}"
        return {
            "upload_url": mock_url,
            "public_url": mock_url,
            "expires_in": 3600
        }
    
    try:
        # Sanitizar y estructurar el nombre del blob
        safe_filename = request.file_name.replace(" ", "_").lower()
        blob_name = f"{request.speaker_id}/{request.category}/{safe_filename}"
        
        # Obtener cliente del blob
        blob_client = blob_service_client.get_blob_client(
            container=BLOB_CONTAINER_NAME,
            blob=blob_name
        )
        
        # Generar SAS token para la URL de carga
        sas_token = generate_blob_sas(
            account_name=blob_service_client.account_name,
            container_name=BLOB_CONTAINER_NAME,
            blob_name=blob_name,
            account_key=blob_service_client.credential.account_key,
            permission=BlobSasPermissions(write=True, create=True),
            expiry=datetime.utcnow() + timedelta(hours=1)
        )
        
        # Construir URLs
        upload_url = f"{blob_client.url}?{sas_token}"
        public_url = f"{blob_client.url}"  # URL base sin SAS para acceso público si el contenedor lo permite
        
        return {
            "upload_url": upload_url,
            "public_url": public_url,
            "expires_in": 3600  # 1 hora
        }
    except Exception as e:
        logger.error(f"Error generating upload URL: {e}")
        raise HTTPException(status_code=500, detail=f"Error generating upload URL: {str(e)}")

def setup_storage_routes(app):
    """
    Añade las rutas de almacenamiento a la aplicación FastAPI.
    """