'use client'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import ConfirmDialog from '@/components/ConfirmDialog'
import Toast from '@/components/Toast'
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  Eye, 
  Star, 
  Calendar, 
  MoreHorizontal,
  ChevronRight,
  Sparkles,
  Zap
} from 'lucide-react'

interface Noticia {
  id: string; titulo: string; resumen: string; imagen_portada_url: string
  destacada: boolean; vistas: number; fecha_publicacion: string
}

export default function NoticiasPage() {
  const [noticias, setNoticias] = useState<Noticia[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ msg: string; type: 'success'|'error'|'info' } | null>(null)

  const fetchNoticias = useCallback(async () => {
    setLoading(true)
    let q = supabase.from('noticias').select('*').order('fecha_publicacion', { ascending: false })
    if (search) q = q.ilike('titulo', `%${search}%`)
    const { data } = await q
    setNoticias(data ?? [])
    setLoading(false)
  }, [search])

  useEffect(() => { fetchNoticias() }, [fetchNoticias])

  const handleDelete = async () => {
    if (!deleteId) return
    const { error } = await supabase.from('noticias').delete().eq('id', deleteId)
    setDeleteId(null)
    if (error) setToast({ msg: 'Error al eliminar la crónica', type: 'error' })
    else { setToast({ msg: 'Crónica eliminada de la historia ✅', type: 'success' }); fetchNoticias() }
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <Header title="Archivo Cromático" subtitle="Gestión de crónicas y noticias institucionales" />
      
      <div className="px-4 lg:px-0 space-y-10">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="relative w-full md:w-96 group">
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-rose-500 rounded-[2rem] blur opacity-10 group-focus-within:opacity-30 transition-opacity" />
            <div className="relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="text" 
                placeholder="BUSCAR EN EL ARCHIVO..." 
                value={search} 
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-[2rem] shadow-sm focus:outline-none focus:ring-4 focus:ring-violet-50 font-bold text-slate-950 placeholder:text-slate-200 transition-all uppercase text-[10px] tracking-widest"
              />
            </div>
          </div>
          
          <Link href="/admin/noticias/nuevo" className="w-full md:w-auto">
            <button className="w-full px-10 py-5 bg-slate-950 text-white rounded-[2rem] font-black uppercase text-[10px] tracking-widest shadow-2xl hover:bg-violet-600 transition-all flex items-center justify-center gap-3 group">
              <Plus size={20} className="group-hover:rotate-90 transition-transform" /> Inyectar Noticia
            </button>
          </Link>
        </div>

        {/* Cinematic List */}
        <div className="bg-white rounded-[4rem] shadow-3xl border border-slate-50 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-[6px] bg-gradient-to-r from-violet-600 via-rose-500 to-amber-500 opacity-20" />
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-50">
                  {['Crónica Histórica', 'Cronología', 'Estado', 'Impacto', 'Acciones'].map(h => (
                    <th key={h} className="px-10 py-8 text-left text-[9px] font-black uppercase tracking-[0.4em] text-slate-300">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr><td colSpan={5} className="py-40 text-center"><div className="w-12 h-12 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto" /></td></tr>
                ) : noticias.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-40 text-center">
                       <p className="text-4xl font-black text-slate-50 uppercase italic tracking-tighter">Archivo Vacío.</p>
                    </td>
                  </tr>
                ) : noticias.map((n, i) => (
                  <tr key={n.id} className="group hover:bg-slate-50/50 transition-all">
                    <td className="px-10 py-8">
                       <div className="flex items-center gap-6">
                          <div className="w-20 h-20 rounded-[1.5rem] overflow-hidden grayscale group-hover:grayscale-0 transition-all shadow-xl">
                             <img src={n.imagen_portada_url || 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=200'} className="w-full h-full object-cover" alt="" />
                          </div>
                          <div className="max-w-md">
                             <h4 className="text-sm font-black text-slate-950 uppercase italic tracking-tight mb-1 group-hover:text-violet-600 transition-colors line-clamp-1">{n.titulo}</h4>
                             <p className="text-[10px] font-medium text-slate-400 line-clamp-1 italic">{n.resumen}</p>
                          </div>
                       </div>
                    </td>
                    <td className="px-10 py-8">
                       <div className="flex items-center gap-3">
                          <Calendar size={14} className="text-rose-500" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{new Date(n.fecha_publicacion).toLocaleDateString()}</span>
                       </div>
                    </td>
                    <td className="px-10 py-8">
                      {n.destacada ? (
                        <span className="px-4 py-1.5 bg-amber-50 text-amber-600 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-2 w-max">
                           <Star size={10} className="fill-amber-500" /> Destacada
                        </span>
                      ) : (
                        <span className="px-4 py-1.5 bg-slate-100 text-slate-400 rounded-full text-[8px] font-black uppercase tracking-widest w-max block">Cronograma Normal</span>
                      )}
                    </td>
                    <td className="px-10 py-8">
                       <div className="flex items-center gap-3">
                          <Eye size={14} className="text-cyan-500" />
                          <span className="text-[10px] font-black text-slate-950">{n.vistas}</span>
                       </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-4">
                        <Link href={`/admin/noticias/${n.id}`}>
                          <button className="p-4 bg-white text-indigo-600 rounded-2xl shadow-sm border border-slate-50 hover:bg-indigo-600 hover:text-white transition-all">
                            <Edit3 size={18} />
                          </button>
                        </Link>
                        <button 
                          onClick={() => setDeleteId(n.id)}
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
        title="¿RESTRINGIR ACCESO A ESTA CRÓNICA?"
        message="La noticia será eliminada permanentemente del repositorio histórico. Esta acción es irreversible."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
