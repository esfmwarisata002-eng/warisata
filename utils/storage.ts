import imageCompression from 'browser-image-compression';
import { supabase } from '@/lib/supabase';

// Opciones de compresión para imágenes (< 500kb)
const imageOptions = {
  maxSizeMB: 0.5,            // Máximo 500kb
  maxWidthOrHeight: 1200,    // Tamaño máximo razonable
  useWebWorker: true,
  initialQuality: 0.8
};

/**
 * Comprime y sube una imagen al storage de Supabase
 */
export async function uploadImage(file: File, path: string): Promise<string> {
  let finalFile: File | Blob = file;

  // Solo comprimir si es imagen
  if (file.type.startsWith('image/')) {
    try {
      finalFile = await imageCompression(file, imageOptions);
    } catch (error) {
      console.warn('Error en la compresión, subiendo original:', error);
    }
  }

  // Subir a Supabase
  const { data, error } = await supabase.storage
    .from('imagenes')
    .upload(path, finalFile, { upsert: true });

  if (error) throw error;

  // Obtener URL pública
  const { data: { publicUrl } } = supabase.storage
    .from('imagenes')
    .getPublicUrl(data.path);

  return publicUrl;
}

/**
 * Valida un documento y lo sube (< 2mb)
 */
export async function uploadDocument(file: File, path: string): Promise<string> {
  const maxSize = 2 * 1024 * 1024; // 2MB

  if (file.size > maxSize) {
    throw new Error('El documento excede el límite de 2MB');
  }

  const { data, error } = await supabase.storage
    .from('documentos')
    .upload(path, file, { upsert: true });

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from('documentos')
    .getPublicUrl(data.path);

  return publicUrl;
}

/**
 * Genera un nombre de archivo único para evitar colisiones
 */
export function generateFileName(file: File): string {
  const ext = file.name.split('.').pop();
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `${timestamp}-${random}.${ext}`;
}
