import os
import sys
import json
import uuid
import logging
from dotenv import load_dotenv
from azure.cosmos import CosmosClient, PartitionKey, exceptions

# Configurar logging para mostrar en consola
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout),  # Añadir salida a stdout
        logging.FileHandler('cosmos_debug.log')  # Añadir log a archivo
    ]
)
logger = logging.getLogger(__name__)

# Cargar variables de entorno
load_dotenv()

# Configuración de Cosmos DB
COSMOS_URI = os.getenv("COSMOS_URI")
COSMOS_KEY = os.getenv("COSMOS_KEY")
COSMOS_DB = os.getenv("COSMOS_DB", "TEDxLasCondes")
COSMOS_CONTAINER = os.getenv("COSMOS_CONTAINER", "speakers")

def insert_test_speaker():
    """
    Probar la inserción de un speaker de ejemplo con depuración extendida
    """
    # Imprimir todas las variables de entorno para depuración
    print("Variables de entorno:")
    print(f"COSMOS_URI: {COSMOS_URI}")
    print(f"COSMOS_DB: {COSMOS_DB}")
    print(f"COSMOS_CONTAINER: {COSMOS_CONTAINER}")
    print(f"COSMOS_KEY: {'*' * 10 if COSMOS_KEY else 'NO CONFIGURADA'}")

    if not COSMOS_URI or not COSMOS_KEY:
        print("❌ ERROR: Falta COSMOS_URI o COSMOS_KEY")
        sys.exit(1)

    try:
        # Crear cliente de Cosmos
        logger.info("Intentando crear cliente de Cosmos DB")
        client = CosmosClient(COSMOS_URI, credential=COSMOS_KEY)
        
        # Obtener o crear base de datos
        logger.info(f"Intentando crear/obtener base de datos: {COSMOS_DB}")
        database = client.create_database_if_not_exists(id=COSMOS_DB)
        
        # Obtener o crear contenedor
        logger.info(f"Intentando crear/obtener contenedor: {COSMOS_CONTAINER}")
        container = database.create_container_if_not_exists(
            id=COSMOS_CONTAINER,
            partition_key=PartitionKey(path="/id"),
            offer_throughput=400
        )
        
        # Crear speaker de prueba
        test_speaker = {
            "id": str(uuid.uuid4()),
            "nombre": "Peter",
            "apellido": "Fulle",
            "email": "peter@tedxlascondes.com",
            "telefono": "+56912345678",
            "ciudad": "Santiago",
            "pais": "Chile",
            "biografia": "Fundador de TEDxLasCondes",
            "tituloCharla": "Transformando Ideas en Realidad",
            "categorias": ["innovacion", "liderazgo"],
            "descripcionBreve": "Cómo las ideas pueden cambiar el mundo",
            "descripcionDetallada": "Una exploración profunda de cómo las ideas pequeñas pueden generar grandes transformaciones",
            "impactoEsperado": "Inspirar a otros a creer en el poder de las ideas",
            "motivacion": "Compartir conocimiento y empoderar a otros",
            "disponibilidad": ["15-mayo-am"],
            "estado": "pendiente",
            "evaluacion": 0.0,
            "aceptaTerminos": True
        }
        
        # Insertar speaker
        logger.info("Intentando insertar speaker")
        print("Datos del speaker:")
        print(json.dumps(test_speaker, indent=2))
        
        result = container.create_item(body=test_speaker)
        
        print("\n✅ Speaker insertado exitosamente:")
        print(json.dumps(result, indent=2))
        
        return result
    
    except exceptions.CosmosHttpResponseError as e:
        logger.error(f"Error de Cosmos DB: {e}")
        print(f"\n❌ Error de Cosmos DB: {e}")
        print(f"Detalles del error: {e.response.text}")
        raise
    except Exception as e:
        logger.error(f"Error general: {e}")
        print(f"\n❌ Error general: {e}")
        raise

if __name__ == "__main__":
    insert_test_speaker()