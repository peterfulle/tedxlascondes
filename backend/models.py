from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import date
import uuid
from typing import List, Optional
from pydantic import BaseModel, Field

class Speaker(BaseModel):
    id: str
    nombre: Optional[str] = None
    apellido: Optional[str] = None
    email: Optional[str] = None
    telefono: Optional[str] = None
    ciudad: Optional[str] = None
    pais: Optional[str] = "Chile"
    biografia: Optional[str] = None
    
    website: Optional[str] = None
    linkedin: Optional[str] = None
    twitter: Optional[str] = None
    instagram: Optional[str] = None
    youtube: Optional[str] = None
    
    tituloCharla: Optional[str] = None
    categorias: Optional[List[str]] = []
    descripcionBreve: Optional[str] = None
    descripcionDetallada: Optional[str] = None
    impactoEsperado: Optional[str] = None
    experienciaPrevia: Optional[str] = None
    motivacion: Optional[str] = None
    
    disponibilidad: Optional[List[str]] = []
    
    fotoPerfilUrl: Optional[str] = None
    cvUrl: Optional[str] = None
    presentacionUrl: Optional[str] = None
    videoDemo: Optional[str] = None
    
    aceptaTerminos: Optional[bool] = False
    aceptaComunicaciones: Optional[bool] = False
    
    # Permitir campos adicionales que vienen de Cosmos DB
    class Config:
        extra = "allow"