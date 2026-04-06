'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Plus, Trash2, Tags, X, Save, Edit3, Loader2, GripVertical } from 'lucide-react'
import Toast from '@/components/Toast'

interface Categoria {
  id: string
  nombre: string
  orden: number
}

export default function CategoriasPersonalPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    nombre: '',
    orden: 0
  })

  useEffect(() => {
    fetchCategorias()
  }, [])

  async function fetchCategorias() {
    setLoading(true)
    const { data, error } = await supabase
      .from('categorias_personal')
      .select('*')
      .order('orden')
    
    if (error) setToast({ message: 'Error: ' + error.message, type: 'error' })
    else setCategorias(data || [])
    setLoading(false)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = editingId 
        ? await supabase.from('categorias_personal').update(formData).eq('id', editingId)
        : await supabase.from('categorias_personal').insert([formData])

      if (error) throw error

      setToast({ message: editingId ? 'Categoría actualizada' : 'Categoría creada', type: 'success' })
      setShowModal(false)
      setEditingId(null)
      setFormData({ nombre: '', orden: categorias.length + 1 })
      fetchCategorias()
    } catch (err: any) {
      setToast({ message: err.message, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Seguro que deseas eliminar esta categoría? El personal asociado quedará sin categoría.')) return
    try {
      const { error } = await supabase.from('categorias_personal').delete().eq('id', id)
      if (error) throw error
      setToast({ message: 'Categoría eliminada', type: 'success' })
      fetchCategorias()
    } catch (err: any) {
      setToast({ message: 'Error al eliminar: ' + err.message, type: 'error' })
    }
  }

  const openEdit = (cat: Categoria) => {
    setEditingId(cat.id)
    setFormData({ nombre: cat.nombre, orden: cat.orden })
    setShowModal(true)
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#1a3a5c]">Categorías de Personal</h1>
          <p className="text-gray-600">Organiza cómo se agrupa el plantel docente y administrativo</p>
        </div>
        <button
          onClick={() => { 
            setEditingId(null); 
            setFormData({ nombre: '', orden: categorias.length + 1 }); 
            setShowModal(true); 
          }}
          className="flex items-center gap-2 bg-[#1a3a5c] text-white px-4 py-2 rounded-lg hover:bg-[#264e7a] transition"
        >
          <Plus size={20} /> Nueva Categoría
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden max-w-2xl">
        <div className="p-4 border-b border-gray-50 bg-gray-50 font-semibold text-gray-600 text-sm grid grid-cols-6 items-center">
          <div className="col-span-1 px-4">Orden</div>
          <div className="col-span-4">Nombre de Categoría</div>
          <div className="col-span-1 text-right px-4">Acciones</div>
        </div>
        <div className="divide-y divide-gray-50">
          {categorias.map((cat) => (
            <div key={cat.id} className="p-4 grid grid-cols-6 items-center hover:bg-gray-50 transition group">
              <div className="col-span-1 px-4 flex items-center gap-2 text-gray-400">
                <GripVertical size={16} className="opacity-0 group-hover:opacity-100 transition" />
                <span className="font-bold text-gray-700">{cat.orden}</span>
              </div>
              <div className="col-span-4 font-medium text-gray-800">{cat.nombre}</div>
              <div className="col-span-1 flex justify-end gap-2 px-4">
                <button onClick={() => openEdit(cat)} className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition"><Edit3 size={18} /></button>
                <button onClick={() => handleDelete(cat.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition"><Trash2 size={18} /></button>
              </div>
            </div>
          ))}
          {categorias.length === 0 && !loading && (
            <div className="p-12 text-center text-gray-500">No hay categorías configuradas</div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#1a3a5c]">{editingId ? 'Editar Categoría' : 'Nueva Categoría'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Categoría</label>
                <input
                  required
                  value={formData.nombre}
                  onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#1a3a5c]/20"
                  placeholder="Ej. Plantel Administrativo"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Orden de Visualización</label>
                <input
                  type="number"
                  required
                  value={formData.orden}
                  onChange={e => setFormData({ ...formData, orden: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#1a3a5c]/20"
                />
              </div>
              <button disabled={loading} className="w-full bg-[#1a3a5c] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#264e7a]">
                {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                {editingId ? 'Actualizar Categoría' : 'Guardar Categoría'}
              </button>
            </form>
          </div>
        </div>
      )}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
