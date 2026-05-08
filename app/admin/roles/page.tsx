'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  Plus, 
  Trash2, 
  ShieldCheck, 
  X, 
  Save, 
  Edit3, 
  Loader2, 
  CheckCircle2, 
  Lock,
  LayoutGrid,
  ShieldAlert
} from 'lucide-react'
import Toast from '@/components/Toast'

interface Rol {
  id: string; nombre: string; descripcion: string; permisos: string[];
}

const MODULOS_PERMISOS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'noticias', label: 'Noticias' },
  { id: 'comunicados', label: 'Comunicados' },
  { id: 'personal', label: 'Personal' },
  { id: 'organigrama', label: 'Organigrama' },
  { id: 'requisitos', label: 'Trámites y Requisitos' },
  { id: 'institucion', label: 'Gestión Institucional' },
  { id: 'especialidades', label: 'Especialidades' },
  { id: 'calendario', label: 'Calendario' },
  { id: 'galeria', label: 'Galería' },
  { id: 'descargas', label: 'Descargas' },
  { id: 'usuarios', label: 'Usuarios' },
  { id: 'roles', label: 'Roles y Permisos' },
]

export default function RolesPermisosPage() {
  const [roles, setRoles] = useState<Rol[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    permisos: [] as string[]
  })

  useEffect(() => { fetchRoles() }, [])

  async function fetchRoles() {
    setLoading(true)
    const { data, error } = await supabase.from('roles').select('*').order('nombre')
    if (error) setToast({ message: 'Error de Tabla roles.permisos', type: 'error' })
    else setRoles(data || [])
    setLoading(false)
  }

  const togglePermiso = (id: string) => {
    setFormData(prev => ({
      ...prev,
      permisos: prev.permisos.includes(id) 
        ? prev.permisos.filter(p => p !== id) 
        : [...prev.permisos, id]
    }))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = { ...formData, nombre: formData.nombre.toUpperCase() }
      const { error } = editingId 
        ? await supabase.from('roles').update(payload).eq('id', editingId)
        : await supabase.from('roles').insert([payload])

      if (error) throw error
      setToast({ message: 'Rol y Permisos Sincronizados ✅', type: 'success' })
      setShowModal(false); setEditingId(null); fetchRoles()
    } catch (err: any) {
      setToast({ message: 'Error al salvar rol', type: 'error' })
    } finally { setLoading(false) }
  }

  const openForm = (rol?: Rol) => {
    if (rol) {
      setEditingId(rol.id)
      setFormData({ nombre: rol.nombre, descripcion: rol.descripcion, permisos: rol.permisos || [] })
    } else {
      setEditingId(null)
      setFormData({ nombre: '', descripcion: '', permisos: [] })
    }
    setShowModal(true)
  }

  return (
    <div className="p-4 lg:p-10 bg-[#f8f9fa] min-h-screen text-[#1a3a5c]">
      
      {/* HEADER COMPACTO */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center mb-8 border-b border-gray-200 pb-6 gap-4">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl"><ShieldCheck size={26} /></div>
           <div>
              <h1 className="font-black uppercase text-xl leading-none italic">Roles <span className="text-[#c8902a]">y Seguridad</span></h1>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">Control de Acceso por Módulos</p>
           </div>
        </div>
        <button onClick={() => openForm()} className="bg-slate-900 text-white px-6 py-3.5 rounded-xl font-black uppercase text-[10px] shadow-xl hover:bg-black transition-all flex items-center gap-2">
           <Plus size={18} /> Nuevo Rango
        </button>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-40 text-center opacity-10 animate-pulse"><Loader2 size={50} className="mx-auto animate-spin" /></div>
        ) : (
          roles.map((rol) => (
            <div key={rol.id} className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-2xl transition-all group">
               <div>
                  <div className="flex justify-between items-start mb-4">
                     <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${rol.nombre === 'SUPER ADM' ? 'bg-amber-100 text-amber-600' : 'bg-slate-50 text-slate-400'}`}>
                        {rol.nombre === 'SUPER ADM' ? <ShieldAlert size={28} /> : <Lock size={22} />}
                     </div>
                     <div className="flex gap-2">
                        <button onClick={() => openForm(rol)} className="p-2.5 bg-slate-50 rounded-xl text-blue-600 hover:bg-blue-600 hover:text-white transition-all"><Edit3 size={16} /></button>
                        {rol.nombre !== 'SUPER ADM' && (
                           <button onClick={async () => { if(confirm('¿Eliminar Rol?')) { await supabase.from('roles').delete().eq('id', rol.id); fetchRoles() } }} className="p-2.5 bg-slate-50 rounded-xl text-red-500 hover:bg-red-600 hover:text-white transition-all"><Trash2 size={16} /></button>
                        )}
                     </div>
                  </div>
                  <h3 className="text-sm font-black uppercase tracking-tighter mb-2">{rol.nombre}</h3>
                  <p className="text-[10px] text-gray-400 leading-relaxed mb-6 line-clamp-2 italic">{rol.descripcion || "Sin descripción asignada."}</p>
                  
                  <div className="flex flex-wrap gap-1.5 mt-auto">
                     {rol.permisos?.slice(0, 4).map(p => (
                        <span key={p} className="text-[7px] font-black uppercase tracking-widest bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full border border-slate-200">{p}</span>
                     ))}
                     {(rol.permisos?.length || 0) > 4 && <span className="text-[7px] font-black uppercase text-amber-500 px-2 py-1">+{rol.permisos!.length - 4} más</span>}
                  </div>
               </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL CONFIGURADOR DE PERMISOS (COMPACTO) */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4 z-[120] animate-in slide-in-from-bottom-5 duration-300">
           <div className="bg-white rounded-[3.5rem] w-full max-w-2xl p-8 lg:p-12 shadow-2xl relative border-t-[10px] border-[#c8902a] overflow-hidden">
              <button onClick={() => setShowModal(false)} className="absolute right-10 top-10 text-gray-300 hover:text-black z-50"><X size={32} /></button>
              
              <div className="mb-8">
                 <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#c8902a] mb-2">Configurador de Seguridad</p>
                 <h2 className="text-2xl font-black uppercase text-[#1a3a5c] tracking-tighter leading-none">{editingId ? 'Ajustar Rango' : 'Nuevo Rango de Acceso'}</h2>
              </div>

              <form onSubmit={handleSave} className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                       <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-4 block">Nombre del Rol</label>
                       <input required value={formData.nombre} onChange={e => setFormData({ ...formData, nombre: e.target.value })} className="w-full p-5 bg-gray-50 rounded-2xl text-[11px] font-black uppercase border-none outline-none focus:ring-4 focus:ring-[#1a3a5c]/5" placeholder="Ej: EDITOR WEB" />
                    </div>
                    <div className="space-y-1">
                       <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-4 block">Descripción de Tareas</label>
                       <input value={formData.descripcion} onChange={e => setFormData({ ...formData, descripcion: e.target.value })} className="w-full p-5 bg-gray-50 rounded-2xl text-[11px] font-bold text-slate-400 border-none outline-none focus:ring-4 focus:ring-[#1a3a5c]/5" placeholder="Ej: Solo gestiona la galería" />
                    </div>
                 </div>

                 {/* CUADRÍCULA DE PERMISOS MARCADOS */}
                 <div className="space-y-4 pt-2">
                    <div className="flex items-center gap-3">
                       <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1a3a5c]">Marcar Módulos Autorizados</h3>
                       <div className="h-[1px] flex-1 bg-slate-100"></div>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                       {MODULOS_PERMISOS.map(mod => (
                          <div 
                            key={mod.id} 
                            onClick={() => togglePermiso(mod.id)}
                            className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between group ${formData.permisos.includes(mod.id) ? 'bg-[#1a3a5c] border-[#1a3a5c] text-white shadow-lg' : 'bg-slate-50 border-transparent text-slate-400 hover:bg-white hover:border-slate-100'}`}
                          >
                             <span className="text-[9px] font-black uppercase tracking-tight">{mod.label}</span>
                             {formData.permisos.includes(mod.id) ? <CheckCircle2 size={16} /> : <div className="w-4 h-4 rounded-full border-2 border-slate-200"></div>}
                          </div>
                       ))}
                    </div>
                 </div>

                 <div className="flex gap-4 pt-6">
                    <button type="submit" disabled={loading} className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase text-[11px] shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-3">
                       {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                       {loading ? "Sincronizando..." : "Sincronizar Rango y Permisos"}
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type as any} onClose={() => setToast(null)} />}
    </div>
  )
}
