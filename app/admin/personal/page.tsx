'use client'
import { useState, useEffect, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  Plus, 
  Trash2, 
  Edit3, 
  User, 
  Search, 
  Loader2, 
  X,
  Upload,
  LayoutGrid,
  List as ListIcon,
  UserCheck,
  Settings2,
  AlertCircle
} from 'lucide-react'
import Toast from '@/components/Toast'

interface Personal {
  id: string; nombre: string; apellidos: string; cargo: string; foto_url: string | null; categoria_id: string; orden: number;
  categorias_personal: { id: string; nombre: string; orden: number; }
}

export default function PersonalPage() {
  const [items, setItems] = useState<Personal[]>([])
  const [categorias, setCategorias] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'blocks' | 'list'>('blocks')
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' | 'info' } | null>(null)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({ nombre: '', apellidos: '', cargo: '', foto_url: '', categoria_id: '', orden: 0 })

  useEffect(() => { fetchData(); fetchCategorias(); }, [])

  async function fetchCategorias() {
    const { data } = await supabase.from('categorias_personal').select('*').order('orden')
    setCategorias(data || [])
  }

  async function fetchData() {
    setLoading(true)
    try {
      const { data } = await supabase.from('personal').select('*, categorias_personal(id, nombre, orden)').order('orden', { ascending: true })
      setItems(data || [])
    } finally { setLoading(false) }
  }

  // MOTOR DE COMPRESIÓN LOCAL (Refinado para 1000px de ancho)
  const compressImage = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1000;
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          canvas.toBlob((blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Falló el procesamiento de imagen'));
          }, 'image/jpeg', 0.85);
        };
      };
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    const file = e.target.files[0]
    
    // VALIDACIÓN CRITICA: MÁXIMO 2 MEGAS (2048 KB)
    const MAX_SIZE = 2 * 1024 * 1024; // 2MB
    if (file.size > MAX_SIZE) {
      alert("⚠️ ARCHIVO MUY PESADO: La foto supera los 2 Megas. Por favor, utiliza una imagen más ligera.");
      return;
    }

    setUploading(true)
    try {
      // PROCESADO: Comprimir todo lo que pase de 400KB para mantener la web fluida
      let fileToUpload: File | Blob = file;
      if (file.size > 400 * 1024) {
        setToast({ message: 'Optimizando retrato (Max 2MB)...', type: 'info' })
        fileToUpload = await compressImage(file);
      }

      const fileName = `${Date.now()}_personal.jpg`
      const filePath = `personal/${fileName}`
      
      const { error: uploadError } = await supabase.storage.from('imagenes').upload(filePath, fileToUpload)
      if (uploadError) throw uploadError
      
      const { data: { publicUrl } } = supabase.storage.from('imagenes').getPublicUrl(filePath)
      setFormData({ ...formData, foto_url: publicUrl })
      setToast({ message: 'Imagen sincronizada y optimizada ✅', type: 'success' })
    } catch (error: any) {
      setToast({ message: 'Error de red: ' + error.message, type: 'error' })
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (editingId) await supabase.from('personal').update(formData).eq('id', editingId)
      else await supabase.from('personal').insert([formData])
      setShowModal(false); fetchData();
      setToast({ message: 'Registro de personal actualizado 🏢', type: 'success' })
    } catch (err: any) { setToast({ message: err.message, type: 'error' }) } finally { setLoading(false) }
  }

  const openForm = (item?: Personal) => {
    if (item) {
      setEditingId(item.id)
      setFormData({ nombre: item.nombre, apellidos: item.apellidos, cargo: item.cargo, foto_url: item.foto_url || '', categoria_id: item.categoria_id, orden: item.orden || 0 })
    } else {
      setEditingId(null)
      setFormData({ nombre: '', apellidos: '', cargo: '', foto_url: '', categoria_id: '', orden: items.length + 1 })
    }
    setShowModal(true)
  }

  const filteredItems = useMemo(() => items.filter(i => `${i.nombre} ${i.apellidos} ${i.cargo}`.toLowerCase().includes(searchTerm.toLowerCase())), [items, searchTerm])

  return (
    <div className="min-h-screen bg-[#f1f5f9] p-6 lg:p-12 text-slate-800">
      
      {/* HEADER EJECUTIVO */}
      <div className="max-w-7xl mx-auto mb-10 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 transition-all">
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-xl rotate-3"><UserCheck size={24} /></div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-slate-900">Control de Personal ESFM</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Límite de Imagen: 2 Megas Activo</p>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
           <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button onClick={() => setViewMode('blocks')} className={`px-5 py-2.5 rounded-lg flex items-center gap-2 text-[10px] font-black uppercase transition-all ${viewMode === 'blocks' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 opacity-60'}`}><LayoutGrid size={14} /> Bloques</button>
              <button onClick={() => setViewMode('list')} className={`px-5 py-2.5 rounded-lg flex items-center gap-2 text-[10px] font-black uppercase transition-all ${viewMode === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 opacity-60'}`}><ListIcon size={14} /> Lista</button>
           </div>
           
           <input type="text" placeholder="Filtrar por nombre o cargo..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-[200px] px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:bg-white focus:border-slate-900 transition-all shadow-inner" />

           <button onClick={() => openForm()} className="bg-slate-900 text-white px-6 py-3.5 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-black transition-all shadow-lg active:scale-95">
              <Plus size={18} /> Añadir
           </button>
        </div>
      </div>

      {/* CONTENIDO AGRUPADO */}
      <div className="max-w-7xl mx-auto space-y-16">
        {loading ? (
          <div className="py-40 text-center opacity-20 animate-pulse"><Loader2 className="animate-spin mx-auto" size={40} /></div>
        ) : (
          categorias.map(cat => {
            const staff = filteredItems.filter(i => i.categoria_id === cat.id)
            if (staff.length === 0) return null
            return (
              <div key={cat.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                 <div className="flex items-center gap-4 mb-8">
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">{cat.nombre}</span>
                    <div className="h-[1.5px] flex-1 bg-slate-200/60" />
                    <span className="text-[10px] font-bold text-slate-400 px-3 py-1 bg-white border border-slate-100 rounded-lg shadow-sm">{staff.length} <span className="font-normal opacity-50 lowercase">empleados</span></span>
                 </div>

                 {viewMode === 'blocks' ? (
                   <div className="grid grid-cols-2 lg:grid-cols-5 gap-8">
                      {staff.map(person => (
                         <div key={person.id} className="bg-white p-5 rounded-2xl border border-slate-200 group relative hover:shadow-2xl hover:border-slate-900 transition-all overflow-hidden shadow-sm">
                            <div className="w-full aspect-[4/5] rounded-xl bg-slate-50 mb-4 overflow-hidden border border-slate-100 relative group-hover:scale-[1.02] transition-transform duration-500">
                               {person.foto_url ? <img src={person.foto_url} className="w-full h-full object-cover" /> : <div className="h-full flex items-center justify-center text-slate-200"><User size={40} /></div>}
                               <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-3">
                                  <button onClick={() => openForm(person)} className="w-12 h-12 bg-white rounded-2xl text-slate-900 flex items-center justify-center hover:scale-110 transition-transform"><Edit3 size={18} /></button>
                                  <button onClick={async () => { if(confirm('¿Baja definitiva?')) { await supabase.from('personal').delete().eq('id', person.id); fetchData() } }} className="w-12 h-12 bg-white rounded-2xl text-red-600 flex items-center justify-center hover:scale-110 transition-transform"><Trash2 size={18} /></button>
                               </div>
                            </div>
                            <div className="text-center px-1">
                               <h3 className="text-xs font-black uppercase text-slate-900 leading-tight mb-1">{person.nombre} {person.apellidos}</h3>
                               <p className="text-[10px] font-bold text-slate-400 capitalize">{person.cargo}</p>
                            </div>
                         </div>
                      ))}
                   </div>
                 ) : (
                   <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xl">
                      <table className="w-full text-left">
                         <tbody className="divide-y divide-slate-50">
                            {staff.map(person => (
                              <tr key={person.id} className="hover:bg-slate-50 transition-all group">
                                 <td className="p-5 pl-8 w-1/3">
                                    <div className="flex items-center gap-4">
                                       <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0">
                                          {person.foto_url ? <img src={person.foto_url} className="w-full h-full object-cover" /> : <User className="text-slate-300 m-auto h-full" size={18} />}
                                       </div>
                                       <p className="text-[11px] font-bold uppercase text-slate-900">{person.nombre} {person.apellidos}</p>
                                    </div>
                                 </td>
                                 <td className="p-5 w-1/3"><p className="text-[10px] font-bold text-slate-400 uppercase italic opacity-70">{person.cargo}</p></td>
                                 <td className="p-5 pr-8 text-right w-1/3">
                                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100">
                                       <button onClick={() => openForm(person)} className="w-10 h-10 bg-slate-100 rounded-xl text-slate-900 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all"><Edit3 size={15} /></button>
                                       <button onClick={async () => { if(confirm('¿Baja definitiva?')) { await supabase.from('personal').delete().eq('id', person.id); fetchData() } }} className="w-10 h-10 bg-slate-100 rounded-xl text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all"><Trash2 size={15} /></button>
                                    </div>
                                 </td>
                              </tr>
                            ))}
                         </tbody>
                      </table>
                   </div>
                 )}
              </div>
            )
          })
        )}
      </div>

      {/* MODAL FORMULARIO (ESTRICTO) */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-6 z-[100] animate-in fade-in duration-300">
           <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-slate-300/40 overflow-hidden">
              <div className="flex justify-between items-center bg-slate-100 p-6 border-b border-slate-200">
                 <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900 flex items-center gap-3"><Settings2 size={18} className="text-slate-500" /> Registro Bio-Administrativo</h2>
                 <button onClick={() => setShowModal(false)} className="w-10 h-10 flex items-center justify-center bg-white rounded-xl text-slate-400 hover:text-red-500 shadow-sm transition-all hover:rotate-90"><X size={20} /></button>
              </div>

              <form onSubmit={handleSave} className="p-10 grid grid-cols-1 md:grid-cols-12 gap-10">
                 <div className="md:col-span-4">
                    <div className="relative group w-full aspect-[4/5] rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 hover:border-slate-900 transition-all overflow-hidden shadow-inner">
                       {uploading ? (
                         <div className="flex flex-col items-center gap-2 animate-pulse"><Loader2 size={30} className="animate-spin text-slate-900" /><p className="text-[8px] font-black uppercase">Filtro Activo...</p></div>
                       ) : formData.foto_url ? (
                         <img src={formData.foto_url} className="w-full h-full object-cover" />
                       ) : (
                         <div className="text-slate-300 flex flex-col items-center gap-3"><Upload size={24} className="opacity-40" /><p className="text-[9px] font-black uppercase tracking-widest text-center px-4">Arrastrar Archivo (Máx 2MB)</p></div>
                       )}
                       <input type="file" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                    </div>
                 </div>

                 <div className="md:col-span-8 space-y-5">
                    <div className="grid grid-cols-2 gap-5">
                       <div className="space-y-1">
                          <label className="text-[9px] font-black text-slate-400 uppercase px-1">Nombres</label>
                          <input required value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} className="w-full px-5 py-3.5 bg-slate-100 border-none rounded-xl text-xs font-bold focus:bg-white focus:ring-4 focus:ring-slate-900/5 outline-none transition-all" />
                       </div>
                       <div className="space-y-1">
                          <label className="text-[9px] font-black text-slate-400 uppercase px-1">Apellidos</label>
                          <input required value={formData.apellidos} onChange={e => setFormData({...formData, apellidos: e.target.value})} className="w-full px-5 py-3.5 bg-slate-100 border-none rounded-xl text-xs font-bold focus:bg-white focus:ring-4 focus:ring-slate-900/5 outline-none transition-all" />
                       </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-5 items-end">
                       <div className="col-span-2 space-y-1">
                          <label className="text-[9px] font-black text-slate-400 uppercase px-1">Sección Jerárquica</label>
                          <select required value={formData.categoria_id} onChange={e => setFormData({...formData, categoria_id: e.target.value})} className="w-full px-5 py-3.5 bg-slate-100 border-none rounded-xl text-[10px] font-black uppercase outline-none focus:bg-white focus:ring-4 focus:ring-slate-900/5 transition-all">
                             <option value="">SELECCIONAR...</option>
                             {categorias.map(cat => <option key={cat.id} value={cat.id}>{cat.nombre}</option>)}
                          </select>
                       </div>
                       <div className="space-y-1">
                          <label className="text-[9px] font-black text-slate-400 uppercase px-1 text-center block">Orden Nº</label>
                          <input required type="number" value={formData.orden} onChange={e => setFormData({...formData, orden: parseInt(e.target.value) || 0})} className="w-full px-4 py-3.5 bg-slate-900 text-white rounded-xl text-xs font-black text-center" />
                       </div>
                    </div>

                    <div className="space-y-1">
                       <label className="text-[9px] font-black text-slate-400 uppercase px-1">Cargo Oficial</label>
                       <input required value={formData.cargo} onChange={e => setFormData({...formData, cargo: e.target.value})} className="w-full px-5 py-3.5 bg-slate-100 border-none rounded-xl text-[11px] font-bold uppercase italic outline-none focus:bg-white focus:ring-4 focus:ring-slate-900/5 transition-all" placeholder="EJ. DOCENTE DE LINGÜÍSTICA" />
                    </div>

                    <div className="pt-6">
                       <button type="submit" disabled={loading} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-black transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-3">
                          {editingId ? "Actualizar Funcionario" : "Confirmar Alta Digital"}
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
