import { supabase } from '@/lib/supabase';

export async function uploadImage(file: File, path: string): Promise<string> {
  // Subida directa sin procesamientos extras para descartar fallos
  const { data, error } = await supabase.storage
    .from('imagenes')
    .upload(path, file);

  if (error) throw error;
  if (!data) throw new Error('Error al recibir confirmación de subida');

  const { data: { publicUrl } } = supabase.storage
    .from('imagenes')
    .getPublicUrl(data.path);

  return publicUrl;
}

export async function uploadDocument(file: File, path: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from('documentos')
    .upload(path, file, { upsert: true });

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from('documentos')
    .getPublicUrl(data.path);

  return publicUrl;
}

export function generateFileName(file: File): string {
  const ext = file.name.split('.').pop() || 'jpg';
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`;
}
