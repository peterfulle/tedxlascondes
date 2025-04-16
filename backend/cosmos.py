import os
import logging
import uuid
import datetime
from typing import Dict, Any
from azure.cosmos import CosmosClient, PartitionKey, exceptions
from dotenv import load_dotenv

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Cargar variables de entorno
load_dotenv()

# Configuración de Cosmos DB
COSMOS_URI = os.getenv("COSMOS_URI")
COSMOS_KEY = os.getenv("COSMOS_KEY")
COSMOS_DB = os.getenv("COSMOS_DB", "TEDxLasCondes")
COSMOS_CONTAINER = os.getenv("COSMOS_CONTAINER", "speakers")

# Verificar configuración
if not COSMOS_URI or not COSMOS_KEY:
    logger.error("Missing Cosmos DB configuration. Set COSMOS_URI and COSMOS_KEY environment variables.")
    USE_MOCK_DATA = True
else:
    USE_MOCK_DATA = False

# Almacenamiento temporal para modo de desarrollo
mock_speakers = []

# Inicializar cliente de Cosmos DB
def _get_cosmos_client():
    try:
        client = CosmosClient(COSMOS_URI, credential=COSMOS_KEY)
        database = client.create_database_if_not_exists(id=COSMOS_DB)
        container = database.create_container_if_not_exists(
            id=COSMOS_CONTAINER,
            partition_key=PartitionKey(path="/id"),
            offer_throughput=400
        )
        return container
    except Exception as e:
        logger.error(f"Error inicializando Cosmos DB: {e}")
        raise

def add_speaker(speaker: Dict[str, Any]) -> Dict[str, Any]:
    """
    Añadir un nuevo speaker con validación y manejo de errores
    """
    import traceback
    import json
    
    # Log inicial
    logger.info(f"Iniciando add_speaker con datos: {json.dumps(speaker, default=str)}")
    
    # Asegurar valores predeterminados
    if 'evaluacion' not in speaker:
        speaker['evaluacion'] = 0  # Valor predeterminado
    if 'estado' not in speaker:
        speaker['estado'] = 'pendiente'  # Estado predeterminado
    if 'fechaPostulacion' not in speaker:
        speaker['fechaPostulacion'] = datetime.datetime.now().isoformat()  # Fecha actual
    
    if USE_MOCK_DATA:
        logger.warning("⚠️ MODO MOCK ACTIVADO - Los datos NO se guardarán en Cosmos DB")
        mock_speakers.append(speaker)
        logger.info("Speaker agregado al almacenamiento mock")
        return speaker
    
    try:
        # Asegurar que hay un ID único
        if 'id' not in speaker or not speaker['id']:
            speaker['id'] = str(uuid.uuid4())
            logger.info(f"Generado nuevo ID para el speaker: {speaker['id']}")
        
        # Imprimir datos para logging
        logger.info(f"Intentando insertar speaker con ID {speaker['id']}")
        
        # Obtener contenedor de Cosmos DB
        logger.info("Obteniendo cliente de Cosmos DB...")
        container = _get_cosmos_client()
        logger.info("Cliente de Cosmos DB obtenido con éxito")
        
        # Insertar documento
        logger.info("Insertando documento en Cosmos DB...")
        result = container.create_item(body=speaker)
        
        logger.info(f"✅ Speaker insertado exitosamente con ID: {result['id']}")
        return result
    
    except exceptions.CosmosHttpResponseError as e:
        error_details = e.response.text if hasattr(e, 'response') else 'Sin detalles adicionales'
        logger.error(f"❌ Error de Cosmos DB al insertar speaker: {e}")
        logger.error(f"Detalles del error: {error_details}")
        logger.error(f"Traza: {traceback.format_exc()}")
        raise
    except Exception as e:
        logger.error(f"❌ Error general al insertar speaker: {e}")
        logger.error(f"Traza: {traceback.format_exc()}")
        raise

def get_speakers():
    """Obtener todos los speakers."""
    if USE_MOCK_DATA:
        return mock_speakers
    
    try:
        container = _get_cosmos_client()
        
        # Filtrar los documentos que no son speakers (test connections, etc.)
        valid_speakers = []
        for item in container.read_all_items():
            # Excluir documentos de prueba y asegurarse que tengan campos mínimos
            if 'test_key' not in item and 'email' in item:
                # Asegurar que todos los documentos tengan los campos necesarios
                if 'evaluacion' not in item:
                    item['evaluacion'] = 0
                if 'estado' not in item:
                    item['estado'] = 'pendiente'
                if 'fechaPostulacion' not in item:
                    item['fechaPostulacion'] = datetime.datetime.now().isoformat()
                
                valid_speakers.append(item)
        
        logger.info(f"Speakers encontrados: {len(valid_speakers)}")
        return valid_speakers
    except Exception as e:
        logger.error(f"Error al obtener speakers: {e}")
        return []

def get_speaker(speaker_id: str):
    """Obtener un speaker por su ID."""
    if USE_MOCK_DATA:
        return next((speaker for speaker in mock_speakers if speaker.get("id") == speaker_id), None)
    
    try:
        container = _get_cosmos_client()
        speaker = container.read_item(item=speaker_id, partition_key=speaker_id)
        
        # Asegurar valores predeterminados
        if 'evaluacion' not in speaker:
            speaker['evaluacion'] = 0
        if 'estado' not in speaker:
            speaker['estado'] = 'pendiente'
        if 'fechaPostulacion' not in speaker:
            speaker['fechaPostulacion'] = datetime.datetime.now().isoformat()
            
        return speaker
    except exceptions.CosmosResourceNotFoundError:
        logger.warning(f"Speaker {speaker_id} no encontrado")
        return None
    except Exception as e:
        logger.error(f"Error al obtener speaker {speaker_id}: {e}")
        return None

def update_speaker(speaker_id: str, updates: Dict[str, Any]):
    """Actualizar un speaker existente."""
    if USE_MOCK_DATA:
        for i, speaker in enumerate(mock_speakers):
            if speaker.get("id") == speaker_id:
                mock_speakers[i].update(updates)
                return mock_speakers[i]
        return None
    
    try:
        container = _get_cosmos_client()
        
        # Primero obtener el documento actual
        speaker = container.read_item(item=speaker_id, partition_key=speaker_id)
        
        # Aplicar actualizaciones
        speaker.update(updates)
        
        # Reemplazar el documento
        return container.replace_item(item=speaker_id, body=speaker)
    except exceptions.CosmosResourceNotFoundError:
        logger.error(f"Speaker {speaker_id} no encontrado")
        return None
    except Exception as e:
        logger.error(f"Error al actualizar speaker {speaker_id}: {e}")
        raise

def delete_speaker(speaker_id: str):
    """Eliminar un speaker."""
    if USE_MOCK_DATA:
        for i, speaker in enumerate(mock_speakers):
            if speaker.get("id") == speaker_id:
                return mock_speakers.pop(i)
        return None
    
    try:
        container = _get_cosmos_client()
        return container.delete_item(item=speaker_id, partition_key=speaker_id)
    except exceptions.CosmosResourceNotFoundError:
        logger.error(f"Speaker {speaker_id} no encontrado")
        return None
    except Exception as e:
        logger.error(f"Error al eliminar speaker {speaker_id}: {e}")
        raise
    
    
def search_speakers(query=None, category=None, status=None):
    from .db import load_speakers  # Ajusta esto si tienes otra forma de cargar speakers
    speakers = load_speakers()

    def matches(speaker):
        if query:
            text = f"{speaker.get('nombre', '')} {speaker.get('apellido', '')} {speaker.get('email', '')} {speaker.get('titulo', '')}".lower()
            if query.lower() not in text:
                return False
        if category and category not in speaker.get('categorias', []):
            return False
        if status and speaker.get('estado') != status:
            return False
        return True

    return [s for s in speakers if matches(s)]