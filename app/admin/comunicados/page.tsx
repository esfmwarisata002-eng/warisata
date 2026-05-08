'use client'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import ConfirmDialog from '@/components/ConfirmDialog'
import Toast from '@/components/Toast'
import { 
  Bell, 
  Search, 
  Trash2, 
  Edit3, 
  FileText, 
  AlertCircle, 
  Calendar, 
  Download,
  Plus,
  Zap,
  MoreHorizontal
} from 'lucide-react'

interface Comunicado { id: string; titulo: string; fecha_publicacion: string; importante: boolean; archivo_url: string }

export default function ComunicadosPage() {
  const [items, setItems] = useState<Comunicado[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ msg: string; type: 'success'|'error'|'info' } | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    let q = supabase.from('comunicados').select('*').order('fecha_publicacion', { ascending: false })
    if (search) q = q.ilike('titulo', `%${search}%`)
    const { data } = await q
    setItems(data ?? [])
    setLoading(false)
  }, [search])

  useEffect(() => { fetchData() }, [fetchData])

  const handleDelete = async () => {
    if (!deleteId) return
    const { error } = await supabase.from('comunicados').delete().eq('id', deleteId)
    setDeleteId(null)
    if (error) setToast({ msg: 'Error al eliminar el comunicado', type: 'error' })
    else { setToast({ msg: 'Comunicado retirado de circulación ✅', type: 'success' }); fetchData() }
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <Header title="Centro de Notificaciones" subtitle="Gestión de comunicados oficiales y alertas" />
      
      <div className="px-4 lg:px-0 space-y-10">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="relative w-full md:w-96 group">
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-rose-500 rounded-[2rem] blur opacity-10 group-focus-within:opacity-30 transition-opacity" />
            <div className="relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="text" 
                placeholder="BUSCAR COMUNICADO..." 
                value={search} 
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-[2rem] shadow-sm focus:outline-none focus:ring-4 focus:ring-amber-50 font-bold text-slate-950 placeholder:text-slate-200 transition-all uppercase text-[10px] tracking-widest"
              />
            </div>
          </div>
          
          <Link href="/admin/comunicados/nuevo" className="w-full md:w-auto">
            <button className="w-full px-10 py-5 bg-slate-950 text-white rounded-[2rem] font-black uppercase text-[10px] tracking-widest shadow-2xl hover:bg-amber-500 transition-all flex items-center justify-center gap-3 group">
              <Plus size={20} className="group-hover:rotate-90 transition-transform" /> Emitir Comunicado
            </button>
          </Link>
        </div>

        {/* Cinematic List */}
        <div className="bg-white rounded-[4rem] shadow-3xl border border-slate-50 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-[6px] bg-gradient-to-r from-amber-500 via-rose-500 to-violet-600 opacity-20" />
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-50">
                  {['Identificación del Comunicado', 'Fecha Emisión', 'Prioridad', 'Fuente', 'Acciones'].map(h => (
                    <th key={h} className="px-10 py-8 text-left text-[9px] font-black uppercase tracking-[0.4em] text-slate-300">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr><td colSpan={5} className="py-40 text-center"><div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" /></td></tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-40 text-center">
                       <p className="text-4xl font-black text-slate-50 uppercase italic tracking-tighter">Sin Alertas Activas.</p>
                    </td>
                  </tr>
                ) : items.map((c, i) => (
                  <tr key={c.id} className="group hover:bg-slate-50/50 transition-all">
                    <td className="px-10 py-8">
                       <div className="flex items-center gap-6">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl transition-all ${c.importante ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-100 text-slate-400 group-hover:bg-amber-500 group-hover:text-white'}`}>
                             <Bell size={24} />
                          </div>
                          <div>
                             <h4 className="text-sm font-black text-slate-950 uppercase italic tracking-tight mb-1 group-hover:text-amber-600 transition-colors">{c.titulo}</h4>
                             <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Memo Ref: #{c.id.substring(0,6)}</p>
                          </div>
                       </div>
                    </td>
                    <td className="px-10 py-8">
                       <div className="flex items-center gap-3">
                          <Calendar size={14} className="text-violet-500" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{new Date(c.fecha_publicacion).toLocaleDateString()}</span>
                       </div>
                    </td>
                    <td className="px-10 py-8">
                      {c.importante ? (
                        <span className="px-4 py-1.5 bg-rose-50 text-rose-600 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-2 w-max border border-rose-100 shadow-sm">
                           <AlertCircle size={10} /> Alta Prioridad
                        </span>
                      ) : (
                        <span className="px-4 py-1.5 bg-slate-100 text-slate-400 rounded-full text-[8px] font-black uppercase tracking-widest w-max block">Informativo</span>
                      )}
                    </td>
                    <td className="px-10 py-8">
                      {c.archivo_url ? (
                        <a href={c.archivo_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-rose-500 transition-colors">
                           <Download size={14} /> PDF Oficial
                        </a>
                      ) : (
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-200">—</span>
                      )}
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-4">
                        <Link href={`/admin/comunicados/${c.id}`}>
                          <button className="p-4 bg-white text-indigo-600 rounded-2xl shadow-sm border border-slate-50 hover:bg-indigo-600 hover:text-white transition-all">
                            <Edit3 size={18} />
                          </button>
                        </Link>
                        <button 
                          onClick={() => setDeleteId(c.id)}
                          className="p-4 bg-white text-rose-500 rounded-2xl shadow-sm border border-slate-50 hover:bg-rose-500 hover:text-white transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                        <button className="p-4 bg-slate-50 text-slate-300 rounded-2xl hover:bg-slate-950 hover:text-white transition-all">
                           <MoreHorizontal size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        title="¿DESACTIVAR ESTE COMUNICADO?"
        message="La información dejará de ser visible para la comunidad estudiantil de manera inmediata."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
