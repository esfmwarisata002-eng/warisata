import { supabase } from '@/lib/supabase';

// ==========================================
// SERVICIOS (APIs / Consultas comunes)
// ==========================================
// Estos servicios están listos para ser usados y centralizan las llamadas a la BD.

export const PublicServices = {
  getNoticiasDestacadas: async () => {
    return await supabase
      .from('noticias')
      .select('id, titulo, resumen, imagen_portada_url, fecha_publicacion')
      .eq('destacada', true)
      .order('fecha_publicacion', { ascending: false })
      .limit(3);
  },

  getAllNoticias: async () => {
    return await supabase
      .from('noticias')
      .select('id, titulo, resumen, imagen_portada_url, fecha_publicacion')
      .order('fecha_publicacion', { ascending: false });
  },

  getTramitesActivos: async () => {
    return await supabase
      .from('tramites')
      .select('*')
      .eq('activo', true)
      .order('titulo', { ascending: true });
  },

  getOrganigrama: async () => {
    return await supabase
      .from('organigrama')
      .select('*, personal(*)')
      .order('orden', { ascending: true });
  },
  
  getConvocatoriasAbiertas: async () => {
    return await supabase
      .from('convocatorias')
      .select('*')
      .eq('estado', 'abierta')
      .order('fecha_inicio', { ascending: false });
  }
};
