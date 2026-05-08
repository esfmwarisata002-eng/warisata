'use client'
import { useState, useEffect, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  Plus, 
  Trash2, 
  Edit3, 
  FileText, 
  PlusCircle, 
  Loader2, 
  X, 
  ListChecks,
  Coins,
  Calculator,
  LayoutGrid,
  Library,
  Settings2,
  BookOpen,
  Search,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react'
import Toast from '@/components/Toast'

interface Categoria { id: string; nombre: string; }
interface RequisitoBase { id: string; descripcion: string; }

interface Tramite {
  id: string; titulo: string; descripcion: string | null; tiempo_estimado: string | null; costo: number; categoria_id: string | null;
  tramite_categorias?: { id: string; nombre: string; }
}

interface RequisitoTramite {
  id: string; descripcion: string; obligatorio: boolean; orden: number; costo: number;
}

export default function RequisitosCompactosPage() {
  const [tramites, setTramites] = useState<Tramite[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [requisitos, setRequisitos] = useState<RequisitoTramite[]>([])
  const [biblioteca, setBiblioteca] = useState<RequisitoBase[]>([])
  const [selectedTramite, setSelectedTramite] = useState<string | null>(null)
  
  const [loading, setLoading] = useState(true)
  const [showModalTramite, setShowModalTramite] = useState(false)
  const [showModalRequisito, setShowModalRequisito] = useState(false)
  const [showModalBiblioteca, setShowModalBiblioteca] = useState(false)
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null)

  const [tramiteForm, setTramiteForm] = useState({ titulo: '', descripcion: '', tiempo_estimado: '', categoria_id: '' })
  const [requisitoForm, setRequisitoForm] = useState({ descripcion: '', obligatorio: true, orden: 0, costo: 0 })
  const [editingId, setEditingId] = useState<string | null>(null)
  
  const [searchLib, setSearchLib] = useState('')
  const [selectedFromLib, setSelectedFromLib] = useState<string[]>([])

  useEffect(() => { fetchInitialData() }, [])
  useEffect(() => { if (selectedTramite) fetchRequisitos(selectedTramite) }, [selectedTramite])

  const fetchInitialData = async () => {
    setLoading(true)
    await Promise.all([fetchTramites(), fetchCategorias(), fetchBiblioteca()])
    setLoading(false)
  }

  const fetchCategorias = async () => {
    const { data } = await supabase.from('tramite_categorias').select('*').order('orden')
    setCategorias(data || [])
  }

  const fetchBiblioteca = async () => {
    const { data } = await supabase.from('requisitos').select('id, descripcion').order('descripcion')
    if (data) {
       const unique = Array.from(new Map(data.map(item => [item.descripcion.trim().toUpperCase(), item])).values())
       setBiblioteca(unique)
    }
  }

  const fetchTramites = async () => {
    const { data } = await supabase.from('tramites').select('*, tramite_categorias(id, nombre)').order('created_at')
    setTramites(data || [])
    if (data && data.length > 0 && !selectedTramite) setSelectedTramite(data[0].id)
  }

  async function fetchRequisitos(tramiteId: string) {
    const { data } = await supabase.from('tramite_requisito').select(`obligatorio, orden, costo, requisitos (id, descripcion)`).eq('tramite_id', tramiteId).order('orden')
    if (data) {
      const formatted = data.map((r: any) => ({
        id: r.requisitos.id,
        descripcion: r.requisitos.descripcion,
        obligatorio: r.obligatorio,
        orden: r.orden,
        costo: r.costo || 0 
      }))
      setRequisitos(formatted)
    }
  }

  const groupedTramites = useMemo(() => {
    const groups: { [key: string]: Tramite[] } = {}
    tramites.forEach(t => {
      const catName = t.tramite_categorias?.nombre || 'SIN CATEGORÍA'
      if (!groups[catName]) groups[catName] = []
      groups[catName].push(t)
    })
    return groups
  }, [tramites])

  const totalCostoTramite = useMemo(() => {
    return requisitos.reduce((sum, req) => sum + (Number(req.costo) || 0), 0)
  }, [requisitos])

  const saveTramite = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const payload = { titulo: tramiteForm.titulo.toUpperCase(), categoria_id: tramiteForm.categoria_id || null }
      if (editingId) await supabase.from('tramites').update(payload).eq('id', editingId)
      else await supabase.from('tramites').insert([payload])
      setShowModalTramite(false); fetchTramites();
      setToast({ message: 'Actualizado ✅', type: 'success' })
    } catch (err: any) { setToast({ message: err.message, type: 'error' }) }
  }

  const vicularMasivo = async () => {
    if (!selectedTramite || selectedFromLib.length === 0) return
    setLoading(true)
    try {
      const payloads = selectedFromLib.map((reqId, index) => ({
        tramite_id: selectedTramite,
        requisito_id: reqId,
        obligatorio: true,
        orden: requisitos.length + index + 1,
        costo: 0
      }))
      await supabase.from('tramite_requisito').insert(payloads)
      setShowModalBiblioteca(false); setSelectedFromLib([]);
      fetchRequisitos(selectedTramite);
      setToast({ message: 'Vinculación Masiva ✅', type: 'success' })
    } catch (err: any) { setToast({ message: 'Error', type: 'error' }) }
    finally { setLoading(false) }
  }

  const saveRequisito = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTramite) return
    setLoading(true)
    try {
      const descUpper = requisitoForm.descripcion.trim().toUpperCase()
      const existing = biblioteca.find(b => b.descripcion.toUpperCase() === descUpper)
      let reqId = existing?.id
      if (!reqId) {
        const { data: reqData } = await supabase.from('requisitos').insert({ descripcion: descUpper }).select().single()
        reqId = reqData.id
      }
      await supabase.from('tramite_requisito').upsert({
        tramite_id: selectedTramite, requisito_id: reqId, obligatorio: requisitoForm.obligatorio, orden: requisitoForm.orden || requisitos.length + 1, costo: Number(requisitoForm.costo) 
      })
      setShowModalRequisito(false); fetchRequisitos(selectedTramite); fetchBiblioteca();
      setToast({ message: 'Guardado ✅', type: 'success' })
    } finally { setLoading(false) }
  }

  const filteredLib = biblioteca.filter(b => b.descripcion.toLowerCase().includes(searchLib.toLowerCase()))

  return (
    <div className="min-h-screen bg-[#f8f9fa] p-4 lg:p-10 text-[#1a3a5c]">
      
      {/* HEADER COMPACTO */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mb-6 border-b border-gray-200 pb-6 gap-4">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-[#1a3a5c] rounded-2xl flex items-center justify-center text-white shadow-xl"><Library size={24} /></div>
           <div>
              <h1 className="font-extrabold uppercase text-xl tracking-tight leading-none text-[#1a3a5c]">Catálogo <span className="text-[#c8902a]">Institucional</span></h1>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">Gestión Centralizada</p>
           </div>
        </div>
        <div className="flex gap-2">
           <button onClick={() => { setSearchLib(''); setSelectedFromLib([]); setShowModalBiblioteca(true); }} className="bg-amber-50 text-[#c8902a] px-5 py-3 rounded-xl font-bold uppercase text-[9px] shadow-sm hover:bg-[#c8902a] hover:text-white transition-all flex items-center gap-2">
             <BookOpen size={16} /> Biblioteca
           </button>
           <button onClick={() => { setEditingId(null); setTramiteForm({ titulo: '', descripcion: '', tiempo_estimado: '', categoria_id: '' }); setShowModalTramite(true); }} className="bg-[#1a3a5c] text-white px-6 py-3 rounded-xl font-bold uppercase text-[9px] shadow-xl hover:bg-black transition-all flex items-center gap-2 active:scale-95">
             <PlusCircle size={18} /> Nuevo Trámite
           </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* PANEL IZQUIERDO: SECCIÓN DE BLOQUES COMPACTA */}
        <div className="md:col-span-4 space-y-6 max-h-[750px] overflow-y-auto pr-2 no-scrollbar">
           {Object.keys(groupedTramites).sort().map(categoria => (
              <div key={categoria} className="space-y-2">
                 <div className="flex items-center gap-2 px-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#c8902a]"></div>
                    <h3 className="font-black text-[9px] uppercase text-gray-400 tracking-[0.2em] font-mono">{categoria}</h3>
                 </div>
                 <div className="space-y-1.5">
                    {groupedTramites[categoria].map(t => (
                       <div key={t.id} onClick={() => setSelectedTramite(t.id)} className={`cursor-pointer px-4 py-3 rounded-xl transition-all border ${selectedTramite === t.id ? 'bg-[#1a3a5c] border-[#1a3a5c] text-white shadow-md' : 'bg-white border-transparent text-slate-500 hover:border-slate-100 shadow-sm'}`}>
                          <h4 className="font-bold text-[10px] uppercase tracking-tight leading-tight">{t.titulo}</h4>
                          <div className="flex justify-end mt-2">
                             <button onClick={(e) => { e.stopPropagation(); setEditingId(t.id); setTramiteForm({ titulo: t.titulo, descripcion: t.descripcion || '', tiempo_estimado: t.tiempo_estimado || '', categoria_id: t.categoria_id || '' }); setShowModalTramite(true); }} className={`p-1.5 rounded-lg transition-all ${selectedTramite === t.id ? 'bg-white/10 text-white' : 'bg-slate-50 text-slate-300'}`}><Settings2 size={10} /></button>
                          </div>
                      </div>
                    ))}
                 </div>
              </div>
           ))}
        </div>

        {/* PANEL DERECHO: ARANCELES COMPACTO */}
        <div className="md:col-span-8">
           {selectedTramite ? (
              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 min-h-[500px] flex flex-col relative overflow-hidden">
                 <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-50">
                    <div>
                       <p className="text-[9px] font-black uppercase text-[#c8902a] mb-1">Trámite Seleccionado</p>
                       <h2 className="text-lg font-black uppercase text-[#1a3a5c] tracking-tighter leading-tight max-w-lg">{tramites.find(t => t.id === selectedTramite)?.titulo}</h2>
                    </div>
                    <div className="bg-slate-900 px-6 py-4 rounded-2xl text-center shadow-lg">
                       <p className="text-[8px] font-black text-amber-500 uppercase mb-1">Costo Total</p>
                       <p className="text-xl font-black text-white flex items-center justify-center gap-2">
                          <Coins size={20} className="text-amber-500" /> {totalCostoTramite} Bs
                       </p>
                    </div>
                 </div>

                 <div className="space-y-2 flex-1 relative z-10">
                    {requisitos.map((req) => (
                      <div key={req.id} className="p-4 bg-[#fdfdfd] rounded-2xl border border-slate-50 hover:border-[#1a3a5c]/5 hover:bg-slate-50 transition-all flex justify-between items-center group">
                         <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${req.obligatorio ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-400'} `}>
                               <FileText size={18} />
                            </div>
                            <div>
                               <h4 className="font-extrabold text-[10px] uppercase text-[#1a3a5c] tracking-tight">{req.descripcion}</h4>
                               <div className="flex gap-3 mt-1.5 items-center">
                                  {req.obligatorio && <span className="text-[7px] font-black bg-red-600 text-white px-2 py-0.5 rounded-md uppercase">Original</span>}
                                  <span className="text-[9px] font-black text-[#c8902a] uppercase flex items-center gap-1">
                                     <Coins size={12} /> {req.costo} Bs
                                  </span>
                               </div>
                            </div>
                         </div>
                         <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                            <button onClick={() => { setEditingId(req.id); setRequisitoForm({ descripcion: req.descripcion, obligatorio: req.obligatorio, orden: req.orden, costo: req.costo }); setShowModalRequisito(true); }} className="p-2.5 bg-white rounded-xl text-blue-600 shadow-sm border border-gray-100 hover:bg-blue-600 hover:text-white transition-all"><Edit3 size={14} /></button>
                            <button onClick={async () => { if(confirm('¿Eliminar?')) { await supabase.from('tramite_requisito').delete().eq('requisito_id', req.id).eq('tramite_id', selectedTramite); fetchRequisitos(selectedTramite!); } }} className="p-2.5 bg-white rounded-xl text-red-600 shadow-sm border border-gray-100 hover:bg-red-600 hover:text-white transition-all"><Trash2 size={14} /></button>
                         </div>
                      </div>
                    ))}
                    {requisitos.length === 0 && (
                      <div className="h-40 flex flex-col items-center justify-center opacity-10 font-black uppercase text-[9px] gap-4">
                         <Calculator size={60} />
                         <p>Sin Requisitos</p>
                      </div>
                    )}
                 </div>

                 <div className="mt-8 flex justify-center py-4 gap-4">
                    <button onClick={() => setShowModalBiblioteca(true)} className="bg-amber-100 text-[#c8902a] px-8 py-3.5 rounded-xl font-bold text-[9px] uppercase tracking-widest flex items-center gap-2 hover:bg-[#c8902a] hover:text-white transition-all shadow-sm">
                       <BookOpen size={18} /> Biblioteca
                    </button>
                    <button onClick={() => { setEditingId(null); setRequisitoForm({ descripcion: '', obligatorio: true, orden: requisitos.length + 1, costo: 0 }); setShowModalRequisito(true); }} className="bg-slate-900 text-white px-8 py-3.5 rounded-xl font-bold text-[9px] uppercase tracking-widest flex items-center gap-2 hover:bg-black transition-all shadow-lg active:scale-95">
                       <PlusCircle size={18} /> Añadir Requisito
                    </button>
                 </div>
              </div>
           ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-5 py-60 grayscale"><LayoutGrid size={150} /></div>
           )}
        </div>
      </div>

      {/* MODAL BIBLIOTECA COMPACTO */}
      {showModalBiblioteca && (
        <div className="fixed inset-0 bg-[#0a1b2e]/90 backdrop-blur-md flex items-center justify-center p-4 z-[120] animate-in zoom-in-95 duration-200">
           <div className="bg-white rounded-[2.5rem] w-full max-w-xl p-8 shadow-2xl relative border-b-[10px] border-[#c8902a]">
              <button onClick={() => setShowModalBiblioteca(false)} className="absolute right-6 top-6 text-gray-300 hover:text-black transition-colors"><X size={24} /></button>
              <div className="mb-6 text-center">
                 <h2 className="font-extrabold uppercase text-xl text-[#1a3a5c] tracking-tighter leading-none mb-2">Biblioteca de Requisitos</h2>
                 <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Selección Rápida y Masiva</p>
              </div>

              <div className="relative mb-6">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                 <input autoFocus value={searchLib} onChange={e => setSearchLib(e.target.value)} className="w-full pl-10 pr-4 py-4 bg-gray-50 rounded-xl text-[11px] font-bold uppercase text-[#1a3a5c] outline-none focus:ring-4 focus:ring-[#1a3a5c]/5" placeholder="BUSCAR DOCUMENTO..." />
              </div>

              <div className="max-h-[300px] overflow-y-auto space-y-1 pr-1 no-scrollbar border-y border-gray-50 py-4">
                 {filteredLib.map(item => (
                    <div key={item.id} onClick={() => {
                       if(selectedFromLib.includes(item.id)) setSelectedFromLib(selectedFromLib.filter(id => id !== item.id))
                       else setSelectedFromLib([...selectedFromLib, item.id])
                    }} className={`p-3.5 rounded-xl flex justify-between items-center cursor-pointer transition-all border ${selectedFromLib.includes(item.id) ? 'bg-[#c8902a] border-[#c8902a] text-white shadow-md' : 'bg-gray-50 border-transparent text-slate-500 hover:bg-white hover:border-amber-100'}`}>
                       <span className="text-[10px] font-black uppercase">{item.descripcion}</span>
                       {selectedFromLib.includes(item.id) ? <CheckCircle2 size={16} /> : <Plus size={16} className="text-slate-200" />}
                    </div>
                 ))}
              </div>

              <div className="mt-6 flex gap-3">
                 <button onClick={() => setShowModalBiblioteca(false)} className="flex-1 py-4 text-slate-300 font-bold uppercase text-[9px]">Cerrar</button>
                 <button disabled={selectedFromLib.length === 0 || loading} onClick={vicularMasivo} className="flex-[2] py-4 bg-slate-900 text-white rounded-xl font-black uppercase text-[10px] hover:bg-black shadow-lg transition-all flex items-center justify-center gap-2">
                    {loading ? <Loader2 className="animate-spin" /> : <ShieldCheck size={18} />}
                    {loading ? "Sincronizando..." : `Vincular ${selectedFromLib.length} Ítems`}
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* MODAL REQUISITO INDIVIDUAL COMPACTO */}
      {showModalRequisito && (
        <div className="fixed inset-0 bg-[#0a1b2e]/90 backdrop-blur-xl flex items-center justify-center p-4 z-[120] animate-in zoom-in-95 duration-200">
           <div className="bg-white rounded-[2rem] w-full max-w-sm p-8 shadow-2xl relative border-t-8 border-[#1a3a5c]">
              <div className="flex justify-between items-center mb-6">
                 <h2 className="font-black uppercase text-lg text-[#1a3a5c] tracking-tighter">Ajuste de Arancel</h2>
                 <button onClick={() => setShowModalRequisito(false)} className="text-gray-300 hover:text-black"><X size={24} /></button>
              </div>
              <form onSubmit={saveRequisito} className="space-y-6">
                 <div>
                    <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest px-2 block mb-1.5">Descripción</label>
                    <input required value={requisitoForm.descripcion} onChange={e => setRequisitoForm({ ...requisitoForm, descripcion: e.target.value })} className="w-full p-4 bg-gray-50 rounded-xl text-[11px] font-bold focus:ring-4 focus:ring-[#1a3a5c]/5 border-none outline-none transition-all uppercase" list="lib-data" />
                    <datalist id="lib-data">
                       {biblioteca.map(b => <option key={b.id} value={b.descripcion} />)}
                    </datalist>
                 </div>
                 <div>
                    <label className="text-[9px] font-black text-amber-600 uppercase tracking-widest px-2 block mb-1.5">Costo Bs</label>
                    <div className="relative">
                       <Coins className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500" size={18} />
                       <input type="number" step="0.50" value={requisitoForm.costo} onChange={e => setRequisitoForm({ ...requisitoForm, costo: parseFloat(e.target.value) || 0 })} className="w-full pl-12 pr-4 py-4 bg-amber-50 text-[#c8902a] rounded-xl font-black text-lg focus:ring-4 focus:ring-amber-200 border-none outline-none transition-all" />
                    </div>
                 </div>
                 <button type="submit" disabled={loading} className="w-full py-4 bg-[#1a3a5c] text-white rounded-xl font-black uppercase text-[10px] shadow-lg hover:bg-black transition-all flex items-center justify-center gap-2">
                    {loading ? <Loader2 className="animate-spin" /> : <ShieldCheck size={18} />}
                    Confirmar Datos
                 </button>
              </form>
           </div>
        </div>
      )}

      {/* MODAL TRÁMITE COMPACTO */}
      {showModalTramite && (
        <div className="fixed inset-0 bg-[#0a1b2e]/90 backdrop-blur-xl flex items-center justify-center p-4 z-[100] animate-in zoom-in-95 duration-200">
           <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl relative">
              <div className="flex justify-between items-center mb-6">
                 <h2 className="font-black uppercase text-lg text-[#1a3a5c] tracking-tighter">Detalles de Trámite</h2>
                 <button onClick={() => setShowModalTramite(false)} className="text-gray-300 hover:text-black"><X size={24} /></button>
              </div>
              <form onSubmit={saveTramite} className="space-y-6">
                 <div>
                    <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest px-2 block mb-1.5">Bloque</label>
                    <select required value={tramiteForm.categoria_id} onChange={e => setTramiteForm({ ...tramiteForm, categoria_id: e.target.value })} className="w-full p-4 bg-gray-50 rounded-xl text-[10px] font-bold uppercase border-none outline-none focus:ring-4 focus:ring-[#1a3a5c]/5 cursor-pointer">
                       <option value="">-- SELECCIONAR BLOQUE --</option>
                       {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                    </select>
                 </div>
                 <div>
                    <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest px-2 block mb-1.5">Nombre Institucional</label>
                    <textarea rows={2} required value={tramiteForm.titulo} onChange={e => setTramiteForm({ ...tramiteForm, titulo: e.target.value })} className="w-full p-4 bg-gray-50 rounded-xl text-[10px] font-black focus:ring-4 focus:ring-[#1a3a5c]/5 border-none outline-none resize-none uppercase" />
                 </div>
                 <button type="submit" className="w-full py-4 bg-[#1a3a5c] text-white rounded-xl font-black uppercase text-[10px] shadow-xl hover:bg-black transition-all">Sincronizar</button>
              </form>
           </div>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
