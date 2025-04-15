from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import date
import uuid

class Speaker(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    nombre: str
    apellido: str
    email: str
    telefono: Optional[str] = None
    ciudad: str
    pais: str = "Chile"
    biografia: str
    
    # Redes sociales
    website: Optional[str] = None
    linkedin: Optional[str] = None
    twitter: Optional[str] = None
    instagram: Optional[str] = None
    youtube: Optional[str] = None
    
    # Propuesta
    tituloCharla: str
    categorias: List[str]
    descripcionBreve: str
    descripcionDetallada: str
    impactoEsperado: str
    experienciaPrevia: Optional[str] = None
    motivacion: str
    
    # Estado de la postulación
    estado: str = "pendiente"  # pendiente, revision, aprobado, rechazado
    evaluacion: float = 0.0    # De 0 a 5
    fechaPostulacion: str = Field(default_factory=lambda: date.today().isoformat())
    
    # Disponibilidad
    disponibilidad: List[str]
    
    # Comentarios internos (solo para administradores)
    comentariosInternos: Optional[str] = None
    
    # No se guardan los archivos directamente en la BD, sino referencias a ellos
    fotoPerfilUrl: Optional[str] = None
    cvUrl: Optional[str] = None
    presentacionUrl: Optional[str] = None
    videoDemo: Optional[str] = None
    
    # Términos y condiciones
    aceptaTerminos: bool = True
    aceptaComunicaciones: Optional[bool] = False