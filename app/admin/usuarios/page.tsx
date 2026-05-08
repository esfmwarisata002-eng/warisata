'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  Plus, 
  Trash2, 
  ShieldCheck, 
  User as UserIcon, 
  X, 
  Edit3, 
  Loader2, 
  CheckCircle2, 
  Mail,
  Key,
  ChevronRight,
  ShieldAlert,
  Users
} from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import Toast from '@/components/Toast'

interface Rol { id: string; nombre: string; }
interface Usuario { id: string; nombre_completo: string; activo: boolean; created_at: string; rol_id: string; email?: string; roles?: Rol; }

export default function UsuariosPremiumPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [roles, setRoles] = useState<Rol[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null)

  const [formData, setFormData] = useState({ email: '', nombre: '', password: '', rol_id: '' })

  useEffect(() => { fetchData() }, [])

  async function fetchData() {
    setLoading(true)
    try {
      const { data: usersData, error: usersError } = await supabase.from('usuarios').select('*, roles(id, nombre)').order('created_at', { ascending: false })
      const { data: rolesData, error: rolesError } = await supabase.from('roles').select('*').order('nombre')
      if (usersError || rolesError) throw usersError || rolesError
      setUsuarios(usersData || [])
      setRoles(rolesData || [])
      if (rolesData && rolesData.length > 0) setFormData(prev => ({ ...prev, rol_id: rolesData[0].id }))
    } catch (err: any) {
      setToast({ message: 'Error de sincronización: ' + err.message, type: 'error' })
    } finally { setLoading(false) }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editingId) {
        // MODO EDICIÓN
        const { error } = await supabase.from('usuarios').update({ nombre_completo: formData.nombre, rol_id: formData.rol_id }).eq('id', editingId)
        if (error) throw error
        setToast({ message: 'Perfil actualizado ✅', type: 'success' })
      } else {
        // MODO CREACIÓN
        const { data: authData, error: authError } = await supabase.auth.signUp({ email: formData.email, password: formData.password, options: { data: { full_name: formData.nombre } } })
        if (authError) throw authError
        if (authData.user) {
          const { error: dbError } = await supabase.from('usuarios').upsert({ id: authData.user.id, nombre_completo: formData.nombre, rol_id: formData.rol_id, activo: true })
          if (dbError) throw dbError
        }
        setToast({ message: 'Usuario creado e inyectado ✅', type: 'success' })
      }
      setShowModal(false); fetchData()
    } catch (err: any) {
      setToast({ message: 'Error: ' + err.message, type: 'error' })
    } finally { setSaving(false) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Dar de baja definitiva a este administrador?')) return
    setLoading(true)
    try {
      const { error } = await supabase.from('usuarios').delete().eq('id', id)
      if (error) throw error
      setToast({ message: 'Acceso revocado 🧹', type: 'success' })
      fetchData()
    } catch (err) {
      setToast({ message: 'Error al eliminar', type: 'error' })
    } finally { setLoading(false) }
  }

  const toggleEstado = async (id: string, actual: boolean) => {
    const { error } = await supabase.from('usuarios').update({ activo: !actual }).eq('id', id)
    if (!error) fetchData()
  }

  const openForm = (u?: Usuario) => {
    if (u) {
      setEditingId(u.id)
      setFormData({ email: '', nombre: u.nombre_completo, password: '', rol_id: u.rol_id })
    } else {
      setEditingId(null)
      setFormData({ email: '', nombre: '', password: '', rol_id: roles[0]?.id || '' })
    }
    setShowModal(true)
  }

  return (
    <div className="p-4 lg:p-10 bg-[#f8f9fa] min-h-screen text-[#1a3a5c]">
      
      {/* HEADER COMPACTO */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center mb-10 border-b border-gray-200 pb-6 gap-4">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl"><Users size={26} /></div>
           <div>
              <h1 className="font-black uppercase text-xl leading-none italic">Gestión <span className="text-[#c8902a]">Administrativa</span></h1>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">Control de Personal Técnico</p>
           </div>
        </div>
        <button onClick={() => openForm()} className="bg-slate-900 text-white px-6 py-3.5 rounded-xl font-black uppercase text-[10px] shadow-xl hover:bg-black transition-all flex items-center gap-2">
           <Plus size={18} /> Crear Usuario
        </button>
      </div>

      <div className="max-w-6xl mx-auto bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-5 border-b border-slate-50 bg-slate-50/50 font-black text-[9px] text-gray-400 uppercase tracking-[0.2em] grid grid-cols-12 gap-4">
           <div className="col-span-4 pl-4">Identidad del Usuario</div>
           <div className="col-span-3 text-center">Rango Asignado</div>
           <div className="col-span-2 text-center">Estado</div>
           <div className="col-span-3 text-right pr-4">Acciones</div>
        </div>
        
        <div className="divide-y divide-slate-50">
           {loading ? (
             <div className="p-20 text-center opacity-10 animate-pulse"><Loader2 size={40} className="mx-auto animate-spin" /></div>
           ) : (
             usuarios.map(u => (
               <div key={u.id} className="p-5 grid grid-cols-12 gap-4 items-center hover:bg-blue-50/50 transition-all group">
                  <div className="col-span-4 flex items-center gap-4 pl-4">
                     <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 shadow-inner group-hover:bg-[#1a3a5c] group-hover:text-white transition-all">
                        <UserIcon size={18} />
                     </div>
                     <div>
                        <p className="text-[11px] font-black uppercase text-[#1a3a5c] tracking-tight">{u.nombre_completo}</p>
                        <p className="text-[8px] font-bold text-gray-300 uppercase tracking-widest mt-1">ID: {u.id.substring(0,8)}...</p>
                     </div>
                  </div>
                  <div className="col-span-3 flex justify-center">
                     <span className="px-4 py-1.5 rounded-full bg-slate-100 text-[8px] font-black uppercase text-slate-500 border border-slate-200 flex items-center gap-2">
                        <ShieldCheck size={12} className="text-[#c8902a]" /> {u.roles?.nombre || 'SIN ROL'}
                     </span>
                  </div>
                  <div className="col-span-2 flex justify-center">
                     <button onClick={() => toggleEstado(u.id, u.activo)} className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase transition-all shadow-sm ${u.activo ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                        {u.activo ? 'ACCESO ACTIVO' : 'RESTRINGIDO'}
                     </button>
                  </div>
                  <div className="col-span-3 flex justify-end gap-3 pr-4">
                     <button onClick={() => openForm(u)} className="p-3 bg-white text-blue-600 rounded-xl shadow-sm border border-slate-50 hover:bg-blue-600 hover:text-white transition-all"><Edit3 size={16} /></button>
                     <button onClick={() => handleDelete(u.id)} className="p-3 bg-white text-red-500 rounded-xl shadow-sm border border-slate-50 hover:bg-red-600 hover:text-white transition-all"><Trash2 size={16} /></button>
                  </div>
               </div>
             ))
           )}
           {usuarios.length === 0 && !loading && (
             <div className="p-20 text-center opacity-20 italic font-black uppercase tracking-[0.3em] text-[10px]">No hay personal autorizado</div>
           )}
        </div>
      </div>

      {/* MODAL CONFIGURADOR DE USUARIOS */}
      {showModal && (
        <div className="fixed inset-0 bg-[#0a1b2e]/90 backdrop-blur-xl flex items-center justify-center p-4 z-[120] animate-in zoom-in-95 duration-200">
           <div className="bg-white rounded-[3.5rem] w-full max-w-sm p-10 lg:p-14 shadow-2xl relative border-b-[15px] border-[#1a3a5c]">
              <button onClick={() => setShowModal(false)} className="absolute right-10 top-10 text-gray-300 hover:text-black z-50"><X size={32} /></button>
              
              <div className="mb-10 text-center">
                 <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#c8902a] mb-2">{editingId ? 'ACTUALIZAR PERFIL' : 'NUEVO ACCESO ADM'}</p>
                 <h2 className="text-2xl font-black uppercase text-[#1a3a5c] tracking-tighter leading-none">Gestión de Cuenta</h2>
              </div>

              <form onSubmit={handleSave} className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-4 block">Nombre del Funcionario</label>
                    <div className="relative">
                       <UserIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                       <input required value={formData.nombre} onChange={e => setFormData({ ...formData, nombre: e.target.value })} className="w-full pl-14 pr-6 py-5 bg-gray-50 rounded-2xl text-[11px] font-black uppercase border-none outline-none focus:ring-4 focus:ring-slate-100" />
                    </div>
                 </div>

                 {!editingId && (
                    <>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-4 block">Correo Electrónico</label>
                          <div className="relative">
                             <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                             <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full pl-14 pr-6 py-5 bg-gray-50 rounded-2xl text-[11px] font-bold border-none outline-none" />
                          </div>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-4 block">Password Temporal</label>
                          <div className="relative">
                             <Key className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                             <input required type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} className="w-full pl-14 pr-6 py-5 bg-gray-50 rounded-2xl text-[11px] font-bold border-none outline-none" />
                          </div>
                       </div>
                    </>
                 )}

                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-4 block">Rango Autorizado</label>
                    <div className="relative">
                       <ShieldAlert className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                       <select required value={formData.rol_id} onChange={e => setFormData({ ...formData, rol_id: e.target.value })} className="w-full pl-14 pr-6 py-5 bg-gray-50 rounded-2xl text-[11px] font-black uppercase border-none outline-none focus:ring-4 focus:ring-slate-100 cursor-pointer appearance-none">
                          {roles.map(r => <option key={r.id} value={r.id}>{r.nombre}</option>)}
                       </select>
                    </div>
                 </div>

                 <button type="submit" disabled={saving} className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase text-[10px] shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-3 active:scale-95">
                    {saving ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={24} />}
                    {saving ? "Procesando..." : editingId ? "Actualizar Perfil" : "Emitir Nuevo Acceso"}
                 </button>
              </form>
           </div>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type as any} onClose={() => setToast(null)} />}
    </div>
  )
}
