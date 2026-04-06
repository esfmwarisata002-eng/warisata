export type Role = { id: string; nombre: string; descripcion: string }
export type Noticia = {
  id: string; titulo: string; resumen: string; contenido: string
  imagen_portada_url: string; destacada: boolean; vistas: number; fecha_publicacion: string
}
export type Tramite = {
  id: string; titulo: string; descripcion: string; tiempo_estimado: string
  costo: number; palabras_clave: string; activo: boolean
}
export type Personal = {
  id: string; nombre: string; apellidos: string; cargo: string
  email: string; telefono: string; foto_url: string
}
export type Comunicado = {
  id: string; titulo: string; contenido: string; fecha_publicacion: string
  importante: boolean; archivo_url: string
}
export type Convocatoria = {
  id: string; titulo: string; descripcion: string; fecha_inicio: string
  fecha_fin: string; documento_pdf_url: string; estado: string
}
export type EventoAcademico = {
  id: string; titulo: string; descripcion: string; fecha_inicio: string; fecha_fin: string; tipo: string; color: string
}
