'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  Upload, 
  Image as ImageIcon, 
  Loader2, 
  ShieldCheck, 
  RefreshCcw,
  FileImage,
  Maximize2,
  Calendar,
  AlertCircle
} from 'lucide-react'
import Toast from '@/components/Toast'

export default function OrganigramaDefinitivoPage() {
  const [organigrama, setOrganigrama] = useState<any>(null)
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    fetchOrganigrama()
  }, [])

  async function fetchOrganigrama() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('organigrama_oficial')
        .select('*')
        .limit(1)
      
      if (data && data.length > 0) {
        // Añadimos un timestamp a la URL para forzar al navegador a no usar el caché
        const urlWithCacheBuster = data[0].imagen_url ? `${data[0].imagen_url}${data[0].imagen_url.includes('?') ? '&' : '?'}t=${Date.now()}` : null;
        setOrganigrama({ ...data[0], imagen_url_live: urlWithCacheBuster });
      }
    } catch (err: any) {
      console.error("Error al cargar:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    
    setUploading(true)
    try {
      const file = e.target.files[0]
      const fileExt = file.name.split('.').pop()
      // Usamos un nombre de archivo único para evitar colisiones en el Storage
      const fileName = `oficial/organigrama_esfm_${Date.now()}.${fileExt}`

      // 1. Subir al Storage
      const { error: uploadError } = await supabase.storage
        .from('imagenes')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      // 2. Obtener URL
      const { data: urlData } = supabase.storage
        .from('imagenes')
        .getPublicUrl(fileName)

      // 3. Actualizar la DB (Buscamos la única fila existente)
      const { error: updateError } = await supabase
        .from('organigrama_oficial')
        .update({ 
          imagen_url: urlData.publicUrl,
          actualizado_el: new Date().toISOString()
        })
        .neq('id', '00000000-0000-0000-0000-000000000000') // Truco para actualizar cualquier fila
        .limit(1)

      if (updateError) throw updateError

      setToast({ message: 'Organigrama actualizado y sincronizado ✅', type: 'success' })
      
      // Esperamos un momento para que el CDN de Supabase procese
      setTimeout(() => {
        fetchOrganigrama()
      }, 1000)

    } catch (err: any) {
      setToast({ message: 'Falla en la subida: ' + err.message, type: 'error' })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#fcfcfc] p-6 lg:p-14">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center mb-16 border-b-2 border-slate-100 pb-12 gap-6">
        <div className="flex items-center gap-6">
           <div className="w-16 h-16 bg-[#1a3a5c] rounded-[1.8rem] flex items-center justify-center text-white shadow-2xl relative">
              <ImageIcon size={30} />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white flex items-center justify-center text-[10px] font-bold">✓</div>
           </div>
           <div>
              <h1 className="text-3xl font-black text-[#1a3a5c] uppercase tracking-tighter">Imagen <span className="text-[#c8902a]">Institucional</span></h1>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-3">
                 <ShieldCheck size={14} className="text-[#c8902a]" /> Repositorio de Estructura Única
              </p>
           </div>
        </div>

        <label className="group cursor-pointer bg-slate-900 text-white px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-[#1a3a5c] transition-all shadow-xl flex items-center gap-4 active:scale-95">
           {uploading ? <Loader2 className="animate-spin" size={20} /> : <RefreshCcw size={20} className="group-hover:rotate-180 transition-transform duration-500" />}
           Remplazar Imagen Actual
           <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
        </label>
      </div>

      {loading && !organigrama ? (
        <div className="py-40 flex flex-col items-center justify-center">
           <Loader2 className="animate-spin text-slate-200" size={60} />
        </div>
      ) : (
        <div className="max-w-6xl mx-auto">
           {organigrama?.imagen_url ? (
             <div className="bg-white p-8 rounded-[4rem] shadow-[0_40px_100px_rgba(0,0,0,0.08)] border border-slate-100 group relative">
                <div className="absolute top-10 left-10 flex gap-4">
                  <span className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-slate-100 text-[10px] font-black text-slate-500 flex items-center gap-2">
                    <Calendar size={14} /> ACTUALIZADO: {new Date(organigrama.actualizado_el).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="absolute top-10 right-10 flex gap-4 opacity-0 group-hover:opacity-100 transition-all z-20">
                   <a href={organigrama.imagen_url} target="_blank" className="p-6 bg-white shadow-2xl rounded-3xl text-slate-900 hover:bg-[#1a3a5c] hover:text-white transition-all transform hover:scale-110">
                      <Maximize2 size={28} />
                   </a>
                </div>

                <div className="overflow-hidden rounded-[2.5rem] bg-slate-50 border border-slate-50">
                  <img 
                    src={organigrama.imagen_url_live} 
                    alt="Organigrama Oficial" 
                    className="w-full h-auto object-contain min-h-[500px]" 
                  />
                </div>

                <div className="mt-10 flex flex-col items-center gap-2 pb-4">
                   <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.8em]">ESFM Warisata • Documento Certificado</p>
                   {uploading && <p className="text-[9px] font-black text-[#c8902a] animate-pulse">Sincronizando nueva versión...</p>}
                </div>
             </div>
           ) : (
             <div className="py-48 border-4 border-dashed border-slate-100 rounded-[5rem] bg-slate-50/50 flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 bg-white shadow-inner rounded-full flex items-center justify-center text-slate-100 mb-8 border border-slate-100">
                   <FileImage size={56} />
                </div>
                <h2 className="text-2xl font-black text-slate-200 uppercase tracking-tighter">Buscando Documento Oficial...</h2>
                <div className="mt-8 flex items-center gap-3 bg-amber-50 text-amber-700 px-6 py-3 rounded-2xl border border-amber-100 shadow-sm animate-bounce">
                  <AlertCircle size={20} />
                  <p className="text-[10px] font-black uppercase tracking-widest">Sube la imagen para activar este módulo</p>
                </div>
             </div>
           )}
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
