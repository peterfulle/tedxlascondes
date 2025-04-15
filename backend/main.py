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
    if query or category or status:
        return search_speakers(query, category, status)
    return get_speakers()

@app.post("/speakers", response_model=Speaker, status_code=status.HTTP_201_CREATED)
def create_speaker(speaker: Speaker):
    """Crear un nuevo speaker."""
    try:
        return add_speaker(speaker.dict())
    except Exception as e:
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