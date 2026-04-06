'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Plus, Trash2, Shield, User, Check, X } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import Toast from '@/components/Toast'

interface Rol {
  id: string
  nombre: string
}

interface Usuario {
  id: string
  nombre_completo: string
  activo: boolean
  created_at: string
  rol_id: string
  roles?: Rol
}

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [roles, setRoles] = useState<Rol[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null)

  // Formulario para nuevo usuario
  const [email, setEmail] = useState('')
  const [nombre, setNombre] = useState('')
  const [password, setPassword] = useState('')
  const [rolId, setRolId] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    try {
      // Obtener usuarios con sus roles (usando join de Supabase)
      const { data: usersData, error: usersError } = await supabase
        .from('usuarios')
        .select('*, roles(id, nombre)')
        .order('created_at', { ascending: false })

      const { data: rolesData, error: rolesError } = await supabase
        .from('roles')
        .select('*')
        .order('nombre')

      if (usersError) throw usersError
      if (rolesError) throw rolesError

      setUsuarios(usersData || [])
      setRoles(rolesData || [])
      if (rolesData && rolesData.length > 0) setRolId(rolesData[0].id)
    } catch (err: any) {
      setToast({ message: 'Error al cargar datos: ' + err.message, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const crearUsuario = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      // 1. Crear en Auth de Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: nombre }
        }
      })

      if (authError) throw authError

      // 2. Asociar el rol en la tabla pública usuarios
      // Nota: El trigger handle_new_user ya crea el registro inicial, 
      // actualizamos el nombre y el rol.
      if (authData.user) {
        const { error: dbError } = await supabase
          .from('usuarios')
          .update({
            nombre_completo: nombre,
            rol_id: rolId
          })
          .eq('id', authData.user.id)

        if (dbError) throw dbError
      }

      setToast({ message: 'Usuario creado y asociado correctamente', type: 'success' })
      setShowModal(false)
      fetchData()
      setEmail('')
      setPassword('')
      setNombre('')
    } catch (err: any) {
      setToast({ message: 'Error al crear usuario: ' + err.message, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const toggleEstado = async (id: string, actual: boolean) => {
    try {
      const { error } = await supabase
        .from('usuarios')
        .update({ activo: !actual })
        .eq('id', id)

      if (error) throw error
      fetchData()
    } catch (err: any) {
      setToast({ message: 'Error: ' + err.message, type: 'error' })
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#1a3a5c]">Gestión de Usuarios</h1>
          <p className="text-gray-600">Controla quién accede al panel administrativo</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#1a3a5c] text-white px-4 py-2 rounded-lg hover:bg-[#264e7a] transition"
        >
          <Plus size={20} /> Crear Usuario
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 font-semibold text-sm text-gray-600">Nombre</th>
              <th className="px-6 py-4 font-semibold text-sm text-gray-600">Rol</th>
              <th className="px-6 py-4 font-semibold text-sm text-gray-600">Estado</th>
              <th className="px-6 py-4 font-semibold text-sm text-gray-600">Registrado el</th>
              <th className="px-6 py-4 font-semibold text-sm text-gray-600">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {usuarios.map((usu) => (
              <tr key={usu.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <User size={16} />
                    </div>
                    <span className="font-medium text-gray-800">{usu.nombre_completo}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 flex items-center gap-1 w-fit border border-indigo-100">
                    <Shield size={14} />
                    {usu.roles?.nombre || 'Sin Rol'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => toggleEstado(usu.id, usu.activo)}
                    className={`text-xs px-2 py-1 rounded ${usu.activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                  >
                    {usu.activo ? 'Activo' : 'Inactivo'}
                  </button>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {format(new Date(usu.created_at), "dd 'de' MMMM, yyyy", { locale: es })}
                </td>
                <td className="px-6 py-4">
                  <button className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {usuarios.length === 0 && !loading && (
              <tr>
                <td colSpan={5} className="text-center py-12 text-gray-500">No hay usuarios registrados</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal para Crear Usuario */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#1a3a5c]">Nuevo Usuario</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={crearUsuario} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                <input
                  type="text"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#1a3a5c]/20 focus:border-[#1a3a5c]"
                  placeholder="Ej. Juan Perez"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#1a3a5c]/20 focus:border-[#1a3a5c]"
                  placeholder="admin@warisata.edu.bo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña Temporal</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#1a3a5c]/20 focus:border-[#1a3a5c]"
                  placeholder="******"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rol del Sistema</label>
                <select
                  value={rolId}
                  onChange={(e) => setRolId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#1a3a5c]/20 focus:border-[#1a3a5c]"
                >
                  {roles.map(rol => (
                    <option key={rol.id} value={rol.id}>{rol.nombre}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-[#1a3a5c] text-white rounded-lg hover:bg-[#264e7a] transition disabled:opacity-50"
                >
                  {loading ? 'Creando...' : 'Crear Usuario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  )
}
