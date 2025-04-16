import os
import logging
from azure.cosmos import CosmosClient, PartitionKey
from dotenv import load_dotenv

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Cargar variables de entorno
load_dotenv()

def test_cosmos_connection():
    """
    Prueba de conexión a Cosmos DB con diagnóstico detallado
    """
    # Recuperar credenciales
    COSMOS_URI = os.getenv("COSMOS_URI")
    COSMOS_KEY = os.getenv("COSMOS_KEY")
    COSMOS_DB = os.getenv("COSMOS_DB", "tedxlascondes-db")
    COSMOS_CONTAINER = os.getenv("COSMOS_CONTAINER", "speakers")

    # Imprimir información para diagnóstico
    print("Configuración de Cosmos DB:")
    print(f"URI: {COSMOS_URI}")
    print(f"Database: {COSMOS_DB}")
    print(f"Container: {COSMOS_CONTAINER}")

    # Validar que tengamos credenciales
    if not COSMOS_URI:
        logger.error("COSMOS_URI no está configurado")
        return False

    if not COSMOS_KEY:
        logger.error("COSMOS_KEY no está configurado")
        return False

    try:
        # Intentar establecer conexión
        logger.info("Intentando conectar a Cosmos DB...")
        
        # Crear cliente de Cosmos
        client = CosmosClient(COSMOS_URI, credential=COSMOS_KEY)
        
        # Intentar crear base de datos
        database = client.create_database_if_not_exists(id=COSMOS_DB)
        logger.info(f"Base de datos '{COSMOS_DB}' creada o ya existente")
        
        # Intentar crear contenedor
        container = database.create_container_if_not_exists(
            id=COSMOS_CONTAINER,
            partition_key=PartitionKey(path="/id"),
            offer_throughput=400
        )
        logger.info(f"Contenedor '{COSMOS_CONTAINER}' creado o ya existente")
        
        # Intentar insertar un documento de prueba
        test_item = {
            "id": "test-connection-" + str(hash(COSMOS_URI)),
            "test_key": "connection_test",
            "timestamp": str(datetime.now())
        }
        
        container.create_item(body=test_item)
        logger.info("Documento de prueba insertado exitosamente")
        
        return True
    
    except Exception as e:
        logger.error(f"Error de conexión: {e}")
        
        # Diagnóstico más detallado
        import traceback
        traceback.print_exc()
        
        return False

if __name__ == "__main__":
    from datetime import datetime
    
    # Ejecutar prueba de conexión
    result = test_cosmos_connection()
    
    if result:
        print("\n✅ Conexión a Cosmos DB establecida exitosamente")
    else:
        print("\n❌ Falló la conexión a Cosmos DB")