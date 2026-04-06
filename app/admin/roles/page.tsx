'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Plus, Trash2, ShieldCheck, X, Save, Edit3, Loader2 } from 'lucide-react'
import Toast from '@/components/Toast'

interface Rol {
  id: string
  nombre: string
  descripcion: string
}

export default function RolesPage() {
  const [roles, setRoles] = useState<Rol[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: ''
  })

  useEffect(() => {
    fetchRoles()
  }, [])

  async function fetchRoles() {
    setLoading(true)
    const { data, error } = await supabase
      .from('roles')
      .select('*')
      .order('nombre')
    
    if (error) setToast({ message: 'Error: ' + error.message, type: 'error' })
    else setRoles(data || [])
    setLoading(false)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = editingId 
        ? await supabase.from('roles').update(formData).eq('id', editingId)
        : await supabase.from('roles').insert([formData])

      if (error) throw error

      setToast({ message: editingId ? 'Rol actualizado' : 'Rol creado', type: 'success' })
      setShowModal(false)
      setEditingId(null)
      setFormData({ nombre: '', descripcion: '' })
      fetchRoles()
    } catch (err: any) {
      setToast({ message: err.message, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Seguro que deseas eliminar este rol? Podría haber usuarios asociados.')) return
    try {
      const { error } = await supabase.from('roles').delete().eq('id', id)
      if (error) throw error
      setToast({ message: 'Rol eliminado', type: 'success' })
      fetchRoles()
    } catch (err: any) {
      setToast({ message: 'Error al eliminar: ' + err.message, type: 'error' })
    }
  }

  const openEdit = (rol: Rol) => {
    setEditingId(rol.id)
    setFormData({ nombre: rol.nombre, descripcion: rol.descripcion })
    setShowModal(true)
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#1a3a5c]">Roles del Sistema</h1>
          <p className="text-gray-600">Define los niveles de acceso para el personal administrativo</p>
        </div>
        <button
          onClick={() => { setEditingId(null); setFormData({ nombre: '', descripcion: '' }); setShowModal(true); }}
          className="flex items-center gap-2 bg-[#1a3a5c] text-white px-4 py-2 rounded-lg hover:bg-[#264e7a] transition"
        >
          <Plus size={20} /> Nuevo Rol
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((rol) => (
          <div key={rol.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                <ShieldCheck size={24} />
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(rol)} className="text-gray-400 hover:text-blue-600 p-2"><Edit3 size={18} /></button>
                <button onClick={() => handleDelete(rol.id)} className="text-gray-400 hover:text-red-600 p-2"><Trash2 size={18} /></button>
              </div>
            </div>
            <h3 className="font-bold text-lg text-gray-800 mb-2">{rol.nombre}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{rol.descripcion || 'Sin descripción'}</p>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#1a3a5c]">{editingId ? 'Editar Rol' : 'Nuevo Rol'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Rol</label>
                <input
                  required
                  value={formData.nombre}
                  onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#1a3a5c]/20"
                  placeholder="Ej. Editor de Noticias"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  rows={3}
                  value={formData.descripcion}
                  onChange={e => setFormData({ ...formData, descripcion: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#1a3a5c]/20"
                  placeholder="Explica qué puede hacer este rol..."
                />
              </div>
              <button disabled={loading} className="w-full bg-[#1a3a5c] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#264e7a]">
                {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                {editingId ? 'Actualizar Rol' : 'Guardar Rol'}
              </button>
            </form>
          </div>
        </div>
      )}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
