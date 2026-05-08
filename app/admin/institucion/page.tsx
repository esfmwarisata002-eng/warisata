'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  FileText, 
  Save, 
  Edit3, 
  Loader2, 
  X, 
  History, 
  Target, 
  Eye, 
  BookOpen,
  Plus,
  CheckCircle2,
  Upload,
  ImageIcon
} from 'lucide-react'
import Toast from '@/components/Toast'

interface Seccion {
  id: string; slug: string; titulo: string; contenido: string; imagen_url: string | null; updated_at: string;
}

export default function GestionInstitucionConFotosPage() {
  const [secciones, setSecciones] = useState<Seccion[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' | 'info' } | null>(null)
  
  const [formData, setFormData] = useState({ id: '', titulo: '', contenido: '', slug: '', imagen_url: '' })
  const [isNew, setIsNew] = useState(false)

  useEffect(() => { fetchSecciones() }, [])

  const fetchSecciones = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('secciones_institucionales').select('*').order('slug')
    if (error) setToast({ message: 'Error de Tabla: Verifica los campos slug e imagen_url', type: 'error' })
    else setSecciones(data || [])
    setLoading(false)
  }

  const compressImage = (file: File): Promise<Blob> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_W = 1200;
          const scale = MAX_W / img.width;
          canvas.width = MAX_W;
          canvas.height = img.height * scale;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          canvas.toBlob((blob) => resolve(blob!), 'image/jpeg', 0.8);
        };
      };
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    const file = e.target.files[0]
    if (file.size > 2 * 1024 * 1024) {
      alert("⚠️ Foto muy pesada (Max 2MB)"); return;
    }

    setUploading(true)
    try {
      setToast({ message: 'Optimizando fotografía...', type: 'info' })
      const compressed = await compressImage(file)
      const fileName = `${Date.now()}_inst.jpg`
      const filePath = `institucion/${fileName}`
      
      const { error: uploadError } = await supabase.storage.from('imagenes').upload(filePath, compressed)
      if (uploadError) throw uploadError
      
      const { data: { publicUrl } } = supabase.storage.from('imagenes').getPublicUrl(filePath)
      setFormData({ ...formData, imagen_url: publicUrl })
      setToast({ message: 'Imagen lista ✅', type: 'success' })
    } catch (error: any) {
      setToast({ message: 'Error al subir imagen', type: 'error' })
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = { 
        titulo: formData.titulo.toUpperCase(), 
        contenido: formData.contenido,
        imagen_url: formData.imagen_url,
        slug: formData.slug.toLowerCase().trim().replace(/\s+/g, '-'),
        updated_at: new Date().toISOString()
      }

      const { error } = (isNew && !formData.id) 
        ? await supabase.from('secciones_institucionales').insert([payload])
        : await supabase.from('secciones_institucionales').update(payload).eq('id', formData.id)

      if (error) throw error
      setToast({ message: 'Sincronización Exitosa ✅', type: 'success' })
      setShowModal(false); fetchSecciones()
    } catch (err: any) {
      setToast({ message: 'Error al guardar datos', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const openForm = (seccion?: Seccion) => {
    if (seccion) {
      setIsNew(false)
      setFormData({ id: seccion.id, titulo: seccion.titulo, contenido: seccion.contenido, slug: seccion.slug, imagen_url: seccion.imagen_url || '' })
    } else {
      setIsNew(true)
      setFormData({ id: '', titulo: '', contenido: '', slug: '', imagen_url: '' })
    }
    setShowModal(true)
  }

  return (
    <div className="p-4 lg:p-8 bg-[#f8f9fa] min-h-screen text-[#1a3a5c]">
      
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center mb-10 border-b border-gray-200 pb-6 gap-4">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-[#1a3a5c] rounded-2xl flex items-center justify-center text-white shadow-xl"><FileText size={24} /></div>
           <div>
              <h1 className="font-black uppercase text-xl leading-none italic">Pilares <span className="text-[#c8902a]">Institucionales</span></h1>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">Gestor de Texto e Imagen Oficial</p>
           </div>
        </div>
        <button onClick={() => openForm()} className="bg-[#1a3a5c] text-white px-6 py-3 rounded-xl font-black uppercase text-[10px] shadow-xl hover:bg-black transition-all flex items-center gap-3">
          <Plus size={18} /> Nueva Sección
        </button>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full py-40 text-center opacity-10 animate-pulse"><Loader2 size={50} className="mx-auto animate-spin" /></div>
        ) : (
          secciones.map((sec) => (
            <div key={sec.id} className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col group relative overflow-hidden transition-all hover:shadow-2xl">
               <div className="w-full h-40 bg-slate-50 relative overflow-hidden">
                  {sec.imagen_url ? (
                    <img src={sec.imagen_url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-100"><ImageIcon size={60} /></div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
               </div>
               
               <div className="p-6 pt-0 relative z-10 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-tighter mb-3 pr-2">{sec.titulo}</h3>
                    <p className="text-[11px] text-gray-500 line-clamp-3 leading-relaxed mb-6 italic">{sec.contenido}</p>
                  </div>
                  
                  <div className="flex justify-between items-center pt-5 border-t border-slate-50">
                     <span className="text-[8px] font-black uppercase text-gray-300 tracking-[0.2em]">{sec.slug}</span>
                     <button onClick={() => openForm(sec)} className="flex items-center gap-2 bg-[#1a3a5c] text-white px-4 py-2.5 rounded-xl font-black uppercase text-[8px] shadow-lg hover:bg-black transition-all">Editar Información</button>
                  </div>
               </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-[#0a1b2e]/95 backdrop-blur-xl flex items-center justify-center p-4 z-[120] animate-in slide-in-from-bottom-5 duration-300">
           <div className="bg-white rounded-[3.5rem] w-full max-w-4xl p-8 lg:p-14 shadow-2xl relative border-b-[15px] border-[#c8902a] overflow-hidden">
              <button onClick={() => setShowModal(false)} className="absolute right-10 top-10 text-gray-300 hover:text-black z-50"><X size={32} /></button>
              
              <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-12 gap-12">
                 {/* COLUMNA IMAGEN */}
                 <div className="md:col-span-4 space-y-4">
                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-4">Fotografía de Sección</p>
                    <div className="relative group w-full aspect-[4/3] rounded-[2.5rem] bg-slate-50 border-4 border-dashed border-slate-100 flex flex-col items-center justify-center cursor-pointer hover:bg-white hover:border-[#1a3a5c]/20 transition-all overflow-hidden shadow-inner">
                       {uploading ? (
                         <Loader2 size={30} className="animate-spin text-[#1a3a5c]" />
                       ) : formData.imagen_url ? (
                         <img src={formData.imagen_url} className="w-full h-full object-cover" />
                       ) : (
                         <div className="text-slate-200 flex flex-col items-center gap-4"><Upload size={40} /><p className="text-[9px] font-black uppercase tracking-widest text-center px-6">Subir Fotografía Oficial (Max 2MB)</p></div>
                       )}
                       <input type="file" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                    </div>
                    {formData.imagen_url && <p className="text-[8px] font-bold text-emerald-500 uppercase text-center">Imagen Vinculada Correcamente ✅</p>}
                 </div>

                 {/* COLUMNA TEXTO */}
                 <div className="md:col-span-8 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-4">Título del Pilar</label>
                          <input required value={formData.titulo} onChange={e => setFormData({ ...formData, titulo: e.target.value })} className="w-full p-5 bg-gray-50 rounded-2xl text-[11px] font-black uppercase border-none outline-none focus:ring-4 focus:ring-[#1a3a5c]/5" />
                       </div>
                       <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-4">ID Interno (Slug)</label>
                          <input required disabled={!isNew} value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} className="w-full p-5 bg-gray-50 rounded-2xl text-[11px] font-bold text-slate-300 border-none outline-none" />
                       </div>
                    </div>

                    <div className="space-y-1">
                       <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-4">Redacción Institucional</label>
                       <textarea required rows={7} value={formData.contenido} onChange={e => setFormData({ ...formData, contenido: e.target.value })} className="w-full p-6 bg-gray-50 rounded-[2.5rem] text-xs font-semibold leading-relaxed border-none outline-none focus:ring-4 focus:ring-[#1a3a5c]/5 resize-none" placeholder="Escribe el texto oficial aquí..." />
                    </div>

                    <div className="flex gap-4 pt-4">
                       <button type="submit" disabled={saving} className="flex-1 py-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase text-[11px] shadow-2xl hover:bg-[#1a3a5c] transition-all flex items-center justify-center gap-3">
                          {saving ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={24} />}
                          {saving ? "Procesando..." : "Sincronizar Sección"}
                       </button>
                    </div>
                 </div>
              </form>
           </div>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type as any} onClose={() => setToast(null)} />}
    </div>
  )
}
