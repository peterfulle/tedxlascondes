from fastapi import FastAPI, HTTPException, Query, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from pydantic import BaseModel

from models import Speaker
from cosmos import (
    add_speaker, 
    get_speakers, 
    get_speaker, 
    update_speaker, 
    delete_speaker,
    search_speakers
)
from storage import setup_storage_routes


app = FastAPI(
    title="TEDxLasCondes API",
    description="API para gestionar speakers y postulaciones para TEDxLasCondes",
    version="1.0.0"
)

# Configurar rutas de almacenamiento
setup_storage_routes(app)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)



# Configurar CORS para permitir solicitudes desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especificar el dominio exacto
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelos para actualizaciones parciales
class SpeakerUpdate(BaseModel):
    estado: Optional[str] = None
    evaluacion: Optional[float] = None
    comentariosInternos: Optional[str] = None

# Rutas de la API

@app.get("/")
def root():
    return {"message": "API TEDxLasCondes running 🚀", "version": "1.0.0"}

@app.get("/speakers", response_model=List[Speaker])
def list_speakers(
    query: Optional[str] = Query(None, description="Buscar por nombre, apellido, email o título"),
    category: Optional[str] = Query(None, description="Filtrar por categoría"),
    status: Optional[str] = Query(None, description="Filtrar por estado")
):
    """Obtener todos los speakers con filtros opcionales."""
    try:
        if query or category or status:
            speakers = search_speakers(query, category, status)
        else:
            speakers = get_speakers()
        
        # Si hay algún error en los datos, lo manejamos aquí
        valid_speakers = []
        for speaker in speakers:
            # Aseguramos que tenga ID como mínimo
            if 'id' in speaker:
                valid_speakers.append(speaker)
        
        return valid_speakers
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener speakers: {str(e)}")
    
    
    
    

@app.post("/speakers", response_model=Speaker, status_code=status.HTTP_201_CREATED)
def create_speaker(speaker: Speaker):
    """Crear un nuevo speaker."""
    import json
    try:
        # Log para depuración
        speaker_dict = speaker.dict()
        print(f"DEBUG - Datos recibidos del frontend: {json.dumps(speaker_dict, default=str)}")
        
        # Intentar crear el speaker
        result = add_speaker(speaker_dict)
        print(f"DEBUG - Speaker creado con éxito: {json.dumps(result, default=str)}")
        return result
    except Exception as e:
        print(f"DEBUG - Error al crear speaker: {str(e)}")
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Error al crear speaker: {str(e)}")
    
    
    

@app.get("/speakers/{speaker_id}", response_model=Speaker)
def read_speaker(speaker_id: str):
    """Obtener un speaker por su ID."""
    speaker = get_speaker(speaker_id)
    if not speaker:
        raise HTTPException(status_code=404, detail="Speaker no encontrado")
    return speaker

@app.patch("/speakers/{speaker_id}", response_model=Speaker)
def patch_speaker(speaker_id: str, updates: SpeakerUpdate):
    """Actualizar parcialmente un speaker."""
    # Filtrar campos nulos
    update_data = {k: v for k, v in updates.dict().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No se proporcionaron datos para actualizar")
    
    speaker = update_speaker(speaker_id, update_data)
    if not speaker:
        raise HTTPException(status_code=404, detail="Speaker no encontrado")
    return speaker

@app.delete("/speakers/{speaker_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_speaker(speaker_id: str):
    """Eliminar un speaker."""
    result = delete_speaker(speaker_id)
    if not result:
        raise HTTPException(status_code=404, detail="Speaker no encontrado")
    return None

# Endpoints adicionales

@app.get("/stats")
def get_stats():
    """Obtener estadísticas sobre speakers y postulaciones."""
    speakers = get_speakers()
    
    # Contar por estado
    status_counts = {
        "total": len(speakers),
        "pendientes": sum(1 for s in speakers if s.get("estado") == "pendiente"),
        "enRevision": sum(1 for s in speakers if s.get("estado") == "revision"),
        "aprobados": sum(1 for s in speakers if s.get("estado") == "aprobado"),
        "rechazados": sum(1 for s in speakers if s.get("estado") == "rechazado")
    }
    
    # Contar por categoría
    category_counts = {}
    for speaker in speakers:
        for cat in speaker.get("categorias", []):
            if cat in category_counts:
                category_counts[cat] += 1
            else:
                category_counts[cat] = 1
    
    return {
        "status": status_counts,
        "categories": category_counts
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
    
    
    
@app.get("/test-cosmos")
def test_cosmos_connection():
    """Endpoint para probar la conexión directa a Cosmos DB."""
    import uuid
    import json
    import datetime
    from cosmos import _get_cosmos_client, USE_MOCK_DATA
    
    result = {
        "status": "pending",
        "mock_mode": USE_MOCK_DATA,
        "timestamp": str(datetime.datetime.now()),
        "test_id": str(uuid.uuid4()),
        "steps": []
    }
    
    try:
        # Paso 1: Verificar variables de entorno
        import os
        cosmos_uri = os.getenv("COSMOS_URI")
        cosmos_key = os.getenv("COSMOS_KEY")
        
        result["steps"].append({
            "step": "check_env_vars",
            "success": bool(cosmos_uri and cosmos_key),
            "cosmos_uri_exists": bool(cosmos_uri),
            "cosmos_key_exists": bool(cosmos_key)
        })
        
        # Si estamos en modo mock, terminamos aquí
        if USE_MOCK_DATA:
            result["status"] = "skipped"
            result["message"] = "Usando modo MOCK. No se realizarán operaciones en Cosmos DB."
            return result
        
        # Paso 2: Intentar obtener el cliente
        try:
            container = _get_cosmos_client()
            result["steps"].append({
                "step": "get_cosmos_client",
                "success": True
            })
        except Exception as e:
            result["steps"].append({
                "step": "get_cosmos_client",
                "success": False,
                "error": str(e)
            })
            result["status"] = "error"
            result["message"] = f"Error al obtener cliente Cosmos DB: {str(e)}"
            return result
        
        # Paso 3: Intentar crear un documento de prueba
        test_doc = {
            "id": f"test-{result['test_id']}",
            "test_key": "cosmos_test",
            "timestamp": result["timestamp"],
            "environment": "test"
        }
        
        try:
            created_item = container.create_item(body=test_doc)
            result["steps"].append({
                "step": "create_test_document",
                "success": True,
                "document_id": test_doc["id"]
            })
        except Exception as e:
            result["steps"].append({
                "step": "create_test_document",
                "success": False,
                "error": str(e)
            })
            result["status"] = "error"
            result["message"] = f"Error al crear documento de prueba: {str(e)}"
            return result
        
        # Paso 4: Intentar leer el documento creado
        try:
            read_item = container.read_item(item=test_doc["id"], partition_key=test_doc["id"])
            result["steps"].append({
                "step": "read_test_document",
                "success": True
            })
        except Exception as e:
            result["steps"].append({
                "step": "read_test_document",
                "success": False,
                "error": str(e)
            })
            result["status"] = "error"
            result["message"] = f"Error al leer documento de prueba: {str(e)}"
            return result
        
        # Paso 5: Intentar eliminar el documento
        try:
            container.delete_item(item=test_doc["id"], partition_key=test_doc["id"])
            result["steps"].append({
                "step": "delete_test_document",
                "success": True
            })
        except Exception as e:
            result["steps"].append({
                "step": "delete_test_document",
                "success": False,
                "error": str(e)
            })
            # No marcamos como error si falla la eliminación
        
        # Si llegamos aquí, todo está bien
        result["status"] = "success"
        result["message"] = "Conexión a Cosmos DB exitosa. Todas las operaciones completadas."
        
    except Exception as e:
        result["status"] = "error"
        result["message"] = f"Error general: {str(e)}"
    
    return result

@app.get("/test-speaker-creation")
def test_speaker_creation():
    """Endpoint para probar la creación de un speaker directamente."""
    import uuid
    import datetime
    
    try:
        # Crear un speaker de prueba
        test_speaker = {
            "id": f"test-speaker-{uuid.uuid4()}",
            "nombre": "Prueba",
            "apellido": "Técnica",
            "email": f"test-{uuid.uuid4()}@example.com",
            "telefono": "+1234567890",
            "ciudad": "Ciudad de Prueba",
            "pais": "Chile",
            "biografia": "Esta es una prueba de creación de speaker.",
            "tituloCharla": "Prueba de Conexión a Cosmos DB",
            "categorias": ["tecnologia", "innovacion"],
            "descripcionBreve": "Descripción breve de prueba",
            "descripcionDetallada": "Descripción detallada de prueba para verificar la conexión a Cosmos DB.",
            "impactoEsperado": "Impacto esperado de prueba",
            "motivacion": "Motivación de prueba",
            "disponibilidad": ["15-mayo-am"],
            "aceptaTerminos": True,
            "createdAt": str(datetime.datetime.now())
        }
        
        # Intentar agregar el speaker
        result = add_speaker(test_speaker)
        
        return {
            "success": True,
            "message": "Speaker de prueba creado exitosamente",
            "speaker": result
        }
    except Exception as e:
        return {
            "success": False,
            "message": f"Error al crear speaker de prueba: {str(e)}",
            "error_details": str(e)
        }
        

@app.get("/test")
def test_endpoint():
    return {"status": "ok", "message": "Test endpoint funciona correctamente"}