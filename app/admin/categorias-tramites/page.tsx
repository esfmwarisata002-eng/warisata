'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Plus, Trash2, ListChecks, X, Save, Edit3, Loader2, GripVertical, LayoutGrid } from 'lucide-react'
import Toast from '@/components/Toast'

interface Categoria {
  id: string
  nombre: string
  orden: number
}

export default function CategoriasTramitesPage() {
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
      .from('tramite_categorias')
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
      const payload = {
        nombre: formData.nombre.toUpperCase(),
        orden: formData.orden
      }

      const { error } = editingId 
        ? await supabase.from('tramite_categorias').update(payload).eq('id', editingId)
        : await supabase.from('tramite_categorias').insert([payload])

      if (error) throw error

      setToast({ message: editingId ? 'Bloque actualizado ✅' : 'Bloque creado 📦', type: 'success' })
      setShowModal(false)
      setEditingId(null)
      fetchCategorias()
    } catch (err: any) {
      setToast({ message: 'Error de esquema: ¿Creaste la tabla tramite_categorias?', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Seguro que deseas eliminar este bloque? Los trámites asociados deberán ser reasignados.')) return
    try {
      const { error } = await supabase.from('tramite_categorias').delete().eq('id', id)
      if (error) throw error
      setToast({ message: 'Bloque eliminado 🧹', type: 'success' })
      fetchCategorias()
    } catch (err: any) {
      setToast({ message: 'No se puede eliminar: El bloque aún tiene trámites dentro.', type: 'error' })
    }
  }

  const openEdit = (cat: Categoria) => {
    setEditingId(cat.id)
    setFormData({ nombre: cat.nombre, orden: cat.orden })
    setShowModal(true)
  }

  return (
    <div className="p-10 lg:p-14 bg-gray-50/30 min-h-screen">
      <div className="max-w-4xl mx-auto flex justify-between items-center mb-12">
        <div className="flex items-center gap-5">
           <div className="w-14 h-14 bg-[#1a3a5c] rounded-2xl flex items-center justify-center text-white shadow-xl"><LayoutGrid size={28} /></div>
           <div>
              <h1 className="text-2xl font-black uppercase text-[#1a3a5c] tracking-tighter">Bloques de Trámites</h1>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Gestión Centralizada de Estructuras</p>
           </div>
        </div>
        <button
          onClick={() => { 
            setEditingId(null); 
            setFormData({ nombre: '', orden: categorias.length + 1 }); 
            setShowModal(true); 
          }}
          className="flex items-center gap-3 bg-[#1a3a5c] text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] shadow-2xl hover:bg-black transition-all active:scale-95"
        >
          <Plus size={18} /> Nuevo Bloque
        </button>
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 bg-gray-50/50 font-black text-[10px] text-gray-400 uppercase tracking-[0.2em] grid grid-cols-6 items-center italic">
          <div className="col-span-1 px-4">Prioridad</div>
          <div className="col-span-4 pl-4 text-center">Identificación del Bloque</div>
          <div className="col-span-1 text-right px-4">Operaciones</div>
        </div>
        <div className="divide-y divide-gray-50">
          {categorias.map((cat) => (
            <div key={cat.id} className="p-6 grid grid-cols-6 items-center hover:bg-blue-50/30 transition group">
              <div className="col-span-1 px-4 flex items-center gap-3">
                <GripVertical size={18} className="text-gray-200 opacity-0 group-hover:opacity-100 transition" />
                <span className="font-black text-[#c8902a] text-lg">{cat.orden}</span>
              </div>
              <div className="col-span-4 font-black uppercase text-[#1a3a5c] tracking-tight text-center">{cat.nombre}</div>
              <div className="col-span-1 flex justify-end gap-3 px-4">
                <button onClick={() => openEdit(cat)} className="p-3 bg-white text-blue-600 rounded-xl shadow-sm border border-gray-50 hover:bg-blue-600 hover:text-white transition-all"><Edit3 size={16} /></button>
                <button onClick={() => handleDelete(cat.id)} className="p-3 bg-white text-red-500 rounded-xl shadow-sm border border-gray-50 hover:bg-red-500 hover:text-white transition-all"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
          {categorias.length === 0 && !loading && (
            <div className="p-24 text-center">
               <ListChecks size={60} className="mx-auto text-gray-100 mb-6" />
               <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-300">No hay bloques definidos</p>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-[#0a1b2e]/60 backdrop-blur-md flex items-center justify-center p-6 z-[100] animate-in fade-in duration-300">
           <div className="bg-white rounded-[3rem] w-full max-w-sm p-10 shadow-2xl relative border-t-8 border-[#c8902a]">
              <div className="flex justify-between items-center mb-8">
                 <h2 className="font-black uppercase text-xl text-[#1a3a5c] tracking-tighter">{editingId ? 'Editar Bloque' : 'Nuevo Bloque'}</h2>
                 <button onClick={() => setShowModal(false)} className="text-gray-300"><X size={24} /></button>
              </div>
              <form onSubmit={handleSave} className="space-y-6">
                 <div>
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-2 block mb-1">Nombre Oficial</label>
                    <input
                      required
                      autoFocus
                      value={formData.nombre}
                      onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                      className="w-full p-5 bg-gray-50 rounded-[1.5rem] text-xs font-black uppercase border-none outline-none focus:ring-4 focus:ring-[#1a3a5c]/5"
                      placeholder="Ej. CERTIFICACIONES"
                    />
                 </div>
                 <div>
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-2 block mb-1">Orden de Prioridad</label>
                    <input
                      type="number"
                      required
                      value={formData.orden}
                      onChange={e => setFormData({ ...formData, orden: parseInt(e.target.value) })}
                      className="w-full p-5 bg-gray-50 text-[#1a3a5c] font-black rounded-[1.5rem] text-sm border-none outline-none"
                    />
                 </div>
                 <button disabled={loading} className="w-full bg-[#1a3a5c] text-white py-6 rounded-[2rem] font-black uppercase text-[10px] shadow-2xl flex items-center justify-center gap-3 hover:bg-black transition-all">
                    {loading ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                    {editingId ? 'Sincronizar Bloque' : 'Inyectar Bloque'}
                 </button>
              </form>
           </div>
        </div>
      )}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
