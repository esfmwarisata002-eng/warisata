'use client'
import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Upload, 
  X, 
  Loader2, 
  Calendar,
  CheckCircle2,
  ChevronRight,
  LayoutGrid,
  Trash
} from 'lucide-react'
import Toast from '@/components/Toast'

interface Evento { id: string; titulo: string; fecha_evento: string; portada_url: string | null; }
interface Foto { id: string; evento_id: string; foto_url: string; descripcion: string | null; }

export default function GaleriaPremiumPage() {
  const [eventos, setEventos] = useState<Evento[]>([])
  const [selectedEvento, setSelectedEvento] = useState<string | null>(null)
  const [fotos, setFotos] = useState<Foto[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: 'success'|'error'|'info' } | null>(null)
  const [showNewEvento, setShowNewEvento] = useState(false)
  const [newEventoForm, setNewEventoForm] = useState({ titulo: '', fecha_evento: new Date().toISOString().split('T')[0] })

  const fetchEventos = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('eventos').select('*').order('fecha_evento', { ascending: false })
    setEventos(data ?? [])
    setLoading(false)
  }, [])

  const fetchFotos = useCallback(async (eventoId: string) => {
    const { data } = await supabase.from('fotos_evento').select('*').eq('evento_id', eventoId)
    setFotos(data ?? [])
  }, [])

  useEffect(() => { fetchEventos() }, [fetchEventos])
  useEffect(() => { if (selectedEvento) fetchFotos(selectedEvento) }, [selectedEvento, fetchFotos])

  const compressImage = (file: File): Promise<Blob> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1200;
          const scale = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scale;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          canvas.toBlob((blob) => resolve(blob!), 'image/jpeg', 0.85);
        };
      };
    });
  };

  const handleCreateEvento = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.from('eventos').insert([newEventoForm])
    if (error) setToast({ msg: 'Error al crear álbum', type: 'error' })
    else {
      setToast({ msg: 'Álbum creado exitosamente 📸', type: 'success' })
      setShowNewEvento(false); fetchEventos()
    }
  }

  const handleUploadFotos = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length || !selectedEvento) return
    setUploading(true)
    const files = Array.from(e.target.files)
    setToast({ msg: `Procesando ${files.length} imágenes...`, type: 'info' })
    
    try {
      let firstPhotoUrl = ''
      for (const file of files) {
        const compressed = await compressImage(file)
        const fileName = `${Date.now()}-${file.name}`
        const filePath = `galeria/${fileName}`
        
        const { data, error } = await supabase.storage.from('imagenes').upload(filePath, compressed)
        
        if (!error && data) {
          const { data: urlData } = supabase.storage.from('imagenes').getPublicUrl(data.path)
          const publicUrl = urlData.publicUrl
          if (!firstPhotoUrl) firstPhotoUrl = publicUrl
          
          await supabase.from('fotos_evento').insert([{ 
            evento_id: selectedEvento, 
            foto_url: publicUrl 
          }])
        }
      }

      // Si el evento no tiene portada, le ponemos la primera que subimos ahora
      const eventoActual = eventos.find(ev => ev.id === selectedEvento)
      if (eventoActual && !eventoActual.portada_url && firstPhotoUrl) {
         await supabase.from('eventos').update({ portada_url: firstPhotoUrl }).eq('id', selectedEvento)
         fetchEventos()
      }

      setToast({ msg: 'Fotos añadidas a la galería ✅', type: 'success' })
      fetchFotos(selectedEvento)
    } catch (err) {
      setToast({ msg: 'Error en la subida masiva', type: 'error' })
    } finally {
      setUploading(false)
    }
  }

  const deleteFoto = async (id: string) => {
    if (!confirm('¿Eliminar esta fotografía?')) return
    const { error } = await supabase.from('fotos_evento').delete().eq('id', id)
    if (!error) {
       setToast({ msg: 'Foto eliminada', type: 'success' })
       fetchFotos(selectedEvento!)
    }
  }

  const deleteEvento = async (id: string) => {
    if (!confirm('¿Eliminar todo el álbum? Esta acción borrará todas sus fotos.')) return
    const { error } = await supabase.from('eventos').delete().eq('id', id)
    if (!error) {
       setSelectedEvento(null)
       fetchEventos()
       setToast({ msg: 'Álbum eliminado', type: 'success' })
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] p-4 lg:p-10 text-[#1a3a5c]">
      
      {/* HEADER COMPACTO */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mb-8 border-b border-gray-100 pb-6 gap-4">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl"><LayoutGrid size={24} /></div>
           <div>
              <h1 className="font-black uppercase text-xl leading-none italic">Galería <span className="text-[#c8902a]">Institucional</span></h1>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">Gestión de Álbumes Fotográficos</p>
           </div>
        </div>
        <button onClick={() => setShowNewEvento(true)} className="bg-slate-900 text-white px-6 py-3.5 rounded-xl font-black text-[10px] uppercase flex items-center gap-3 hover:bg-black transition-all shadow-lg active:scale-95">
           <Plus size={18} /> Crear Álbum
        </button>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* PANEL DE ÁLBUMES (IZQUIERDA) */}
        <div className="md:col-span-4 space-y-2 max-h-[750px] overflow-y-auto pr-2 no-scrollbar">
           {eventos.map(ev => (
              <div key={ev.id} onClick={() => setSelectedEvento(ev.id)} className={`group cursor-pointer px-6 py-4 rounded-2xl border-2 transition-all relative overflow-hidden ${selectedEvento === ev.id ? 'bg-[#1a3a5c] border-[#1a3a5c] text-white shadow-xl scale-[1.02]' : 'bg-white border-transparent text-slate-500 hover:border-slate-100 hover:bg-slate-50'}`}>
                 <div className="flex justify-between items-center relative z-10">
                    <div className="flex-1">
                       <h3 className={`text-[11px] font-black uppercase tracking-tight leading-tight ${selectedEvento === ev.id ? 'text-white' : 'text-[#1a3a5c]'}`}>{ev.titulo}</h3>
                       <p className={`text-[9px] font-bold mt-2 flex items-center gap-1.5 ${selectedEvento === ev.id ? 'text-blue-200' : 'text-gray-400'}`}><Calendar size={12} /> {new Date(ev.fecha_evento).toLocaleDateString()}</p>
                    </div>
                    {selectedEvento === ev.id ? <ChevronRight size={16} className="text-white opacity-50" /> : <ChevronRight size={14} className="text-slate-200" />}
                 </div>
                 
                 <button onClick={(e) => { e.stopPropagation(); deleteEvento(ev.id) }} className={`absolute -right-10 group-hover:right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all shadow-sm ${selectedEvento === ev.id ? 'bg-white/10 text-white' : 'bg-red-50 text-red-500 hover:bg-red-600 hover:text-white'}`}><Trash size={14} /></button>
              </div>
           ))}
           {eventos.length === 0 && !loading && (
             <div className="p-10 text-center opacity-20 italic text-[10px] font-black uppercase tracking-widest">No hay álbumes creados</div>
           )}
        </div>

        {/* CONTENEDOR DE FOTOS (DERECHA) */}
        <div className="md:col-span-8">
           {!selectedEvento ? (
             <div className="bg-white rounded-[3rem] p-20 flex flex-col items-center justify-center text-slate-100 border border-slate-50 shadow-sm border-dashed">
                <ImageIcon size={120} className="mb-6 opacity-20" />
                <p className="font-black text-[11px] uppercase tracking-[1em] opacity-40">Selecciona un Álbum</p>
             </div>
           ) : (
             <div className="bg-white rounded-[3.5rem] p-8 lg:p-12 shadow-sm border border-white relative overflow-hidden flex flex-col min-h-[600px]">
                <div className="flex justify-between items-center mb-10 pb-6 border-b border-slate-50">
                   <div>
                      <p className="text-[9px] font-black uppercase text-[#c8902a] mb-2 tracking-widest">Contenido del Evento</p>
                      <h2 className="text-xl font-black uppercase text-[#1a3a5c] tracking-tighter leading-none">{eventos.find(ev => ev.id === selectedEvento)?.titulo}</h2>
                   </div>
                   <label className={`px-8 py-4 bg-[#10b981] text-white rounded-2xl font-black text-[10px] uppercase cursor-pointer hover:bg-black transition-all shadow-xl flex items-center gap-3 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                      {uploading ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
                      {uploading ? 'Procesando...' : 'Subir Fotografías'}
                      <input type="file" multiple accept="image/*" onChange={handleUploadFotos} className="hidden" />
                   </label>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
                   {fotos.map(f => (
                     <div key={f.id} className="group relative aspect-square rounded-[2rem] overflow-hidden bg-slate-50 border border-slate-100 shadow-sm hover:shadow-2xl transition-all hover:scale-[1.03]">
                        <img src={f.foto_url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-sm">
                           <button onClick={() => deleteFoto(f.id)} className="w-12 h-12 bg-white rounded-2xl text-red-600 flex items-center justify-center hover:scale-110 transition-transform shadow-2xl"><Trash2 size={20} /></button>
                        </div>
                     </div>
                   ))}
                   {fotos.length === 0 && !uploading && (
                     <div className="col-span-full py-20 text-center opacity-10 flex flex-col items-center gap-4">
                        <Upload size={80} />
                        <p className="font-black uppercase tracking-widest text-xs">Carga fotos a este álbum</p>
                     </div>
                   )}
                </div>
             </div>
           )}
        </div>
      </div>

      {/* MODAL NUEVO EVENTO */}
      {showNewEvento && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-6 z-[120] animate-in zoom-in-95 duration-200">
           <div className="bg-white rounded-[3rem] w-full max-w-sm p-12 shadow-2xl relative border-t-8 border-[#c8902a]">
              <button onClick={() => setShowNewEvento(false)} className="absolute right-8 top-8 text-gray-300 hover:text-black transition-colors"><X size={32} /></button>
              <div className="mb-10 text-center">
                 <h2 className="font-black uppercase text-xl text-[#1a3a5c] tracking-tighter">Nuevo Álbum</h2>
                 <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">Define el evento institucional</p>
              </div>
              <form onSubmit={handleCreateEvento} className="space-y-8">
                 <div className="space-y-1">
                    <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest px-4 block">Título del Evento</label>
                    <input required autoFocus value={newEventoForm.titulo} onChange={e => setNewEventoForm({...newEventoForm, titulo: e.target.value})} className="w-full p-6 bg-gray-50 rounded-[1.5rem] text-[11px] font-black uppercase border-none outline-none focus:ring-4 focus:ring-slate-900/5 transition-all shadow-inner" placeholder="Ej: ANIVERSARIO 2024" />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest px-4 block">Fecha</label>
                    <input required type="date" value={newEventoForm.fecha_evento} onChange={e => setNewEventoForm({...newEventoForm, fecha_evento: e.target.value})} className="w-full p-6 bg-slate-900 text-white rounded-[1.5rem] text-[11px] font-black uppercase border-none outline-none focus:ring-4 focus:ring-blue-500/20 shadow-xl" />
                 </div>
                 <button type="submit" className="w-full py-6 bg-[#1a3a5c] text-white rounded-[2rem] font-black uppercase text-[11px] shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-3 active:scale-95">
                    <CheckCircle2 size={24} /> Crear Álbum Ahora
                 </button>
              </form>
           </div>
        </div>
      )}

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
