import os
import logging
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
COSMOS_DB = os.getenv("COSMOS_DB", "tedxlascondes-db")
COSMOS_CONTAINER = os.getenv("COSMOS_CONTAINER", "speakers")

# Verificar configuración
if not COSMOS_URI or not COSMOS_KEY:
    logger.error("Missing Cosmos DB configuration. Set COSMOS_URI and COSMOS_KEY environment variables.")
    # Permitir desarrollo local con datos simulados si falta configuración
    USE_MOCK_DATA = True
else:
    USE_MOCK_DATA = False

# Inicializar cliente solo si tenemos configuración
if not USE_MOCK_DATA:
    try:
        client = CosmosClient(COSMOS_URI, credential=COSMOS_KEY)
        database = client.create_database_if_not_exists(id=COSMOS_DB)
        container = database.create_container_if_not_exists(
            id=COSMOS_CONTAINER,
            partition_key=PartitionKey(path="/id"),
            offer_throughput=400
        )
        logger.info(f"Connected to Cosmos DB: {COSMOS_DB}, Container: {COSMOS_CONTAINER}")
    except exceptions.CosmosHttpResponseError as e:
        logger.error(f"Failed to connect to Cosmos DB: {e}")
        USE_MOCK_DATA = True

# Almacenamiento temporal para modo de desarrollo
mock_speakers = []

def add_speaker(speaker: dict):
    """Añadir un nuevo speaker."""
    if USE_MOCK_DATA:
        mock_speakers.append(speaker)
        return speaker
    
    try:
        return container.create_item(body=speaker)
    except exceptions.CosmosHttpResponseError as e:
        logger.error(f"Failed to add speaker: {e}")
        raise

def get_speakers():
    """Obtener todos los speakers."""
    if USE_MOCK_DATA:
        return mock_speakers
    
    try:
        return list(container.read_all_items())
    except exceptions.CosmosHttpResponseError as e:
        logger.error(f"Failed to get speakers: {e}")
        return []

def get_speaker(speaker_id: str):
    """Obtener un speaker por su ID."""
    if USE_MOCK_DATA:
        for speaker in mock_speakers:
            if speaker.get("id") == speaker_id:
                return speaker
        return None
    
    try:
        return container.read_item(item=speaker_id, partition_key=speaker_id)
    except exceptions.CosmosResourceNotFoundError:
        return None
    except exceptions.CosmosHttpResponseError as e:
        logger.error(f"Failed to get speaker {speaker_id}: {e}")
        return None

def update_speaker(speaker_id: str, updates: dict):
    """Actualizar un speaker existente."""
    if USE_MOCK_DATA:
        for i, speaker in enumerate(mock_speakers):
            if speaker.get("id") == speaker_id:
                mock_speakers[i].update(updates)
                return mock_speakers[i]
        return None
    
    try:
        # Primero obtenemos el documento actual
        speaker = container.read_item(item=speaker_id, partition_key=speaker_id)
        # Aplicamos las actualizaciones
        speaker.update(updates)
        # Guardamos el documento actualizado
        return container.replace_item(item=speaker_id, body=speaker)
    except exceptions.CosmosResourceNotFoundError:
        logger.error(f"Speaker {speaker_id} not found")
        return None
    except exceptions.CosmosHttpResponseError as e:
        logger.error(f"Failed to update speaker {speaker_id}: {e}")
        raise

def delete_speaker(speaker_id: str):
    """Eliminar un speaker."""
    if USE_MOCK_DATA:
        for i, speaker in enumerate(mock_speakers):
            if speaker.get("id") == speaker_id:
                return mock_speakers.pop(i)
        return None
    
    try:
        return container.delete_item(item=speaker_id, partition_key=speaker_id)
    except exceptions.CosmosResourceNotFoundError:
        logger.error(f"Speaker {speaker_id} not found")
        return None
    except exceptions.CosmosHttpResponseError as e:
        logger.error(f"Failed to delete speaker {speaker_id}: {e}")
        raise

def search_speakers(query: str = None, category: str = None, status: str = None):
    """
    Buscar speakers por diferentes criterios.
    Nota: En modo mock, hace búsqueda simple. En Cosmos DB, usaría SQL.
    """
    if USE_MOCK_DATA:
        results = mock_speakers.copy()
        
        if query:
            query = query.lower()
            results = [s for s in results if 
                       query in s.get("nombre", "").lower() or 
                       query in s.get("apellido", "").lower() or
                       query in s.get("email", "").lower() or
                       query in s.get("tituloCharla", "").lower()]
        
        if category:
            results = [s for s in results if category in s.get("categorias", [])]
            
        if status:
            results = [s for s in results if s.get("estado") == status]
            
        return results
    
    # Construir la query SQL para Cosmos DB
    query_parts = ["SELECT * FROM c WHERE 1=1"]
    parameters = []
    
    if query:
        query_parts.append("AND (CONTAINS(LOWER(c.nombre), @query) OR CONTAINS(LOWER(c.apellido), @query) OR CONTAINS(LOWER(c.email), @query) OR CONTAINS(LOWER(c.tituloCharla), @query))")
        parameters.append({"name": "@query", "value": query.lower()})
    
    if category:
        query_parts.append("AND ARRAY_CONTAINS(c.categorias, @category)")
        parameters.append({"name": "@category", "value": category})
    
    if status:
        query_parts.append("AND c.estado = @status")
        parameters.append({"name": "@status", "value": status})
    
    sql_query = " ".join(query_parts)
    
    try:
        items = list(container.query_items(
            query=sql_query,
            parameters=parameters,
            enable_cross_partition_query=True
        ))
        return items
    except exceptions.CosmosHttpResponseError as e:
        logger.error(f"Failed to search speakers: {e}")
        return []