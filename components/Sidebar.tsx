'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Newspaper, 
  UserCircle, 
  Calendar, 
  FileText, 
  Image as ImageIcon,
  Users,
  Settings,
  Bell,
  Download,
  GraduationCap,
  LogOut,
  ShieldCheck,
  Tags,
  ChevronRight
} from 'lucide-react'

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
  { name: 'Noticias', icon: Newspaper, path: '/admin/noticias' },
  { name: 'Comunicados', icon: Bell, path: '/admin/comunicados' },
  { name: 'Personal', icon: UserCircle, path: '/admin/personal' },
  { name: 'Especialidades', icon: GraduationCap, path: '/admin/especialidades' },
  { name: 'Trámites', icon: FileText, path: '/admin/tramites' },
  { name: 'Calendario', icon: Calendar, path: '/admin/calendario' },
  { name: 'Galería', icon: ImageIcon, path: '/admin/galeria' },
  { name: 'Descargas', icon: Download, path: '/admin/descargas' },
  { name: 'Usuarios', icon: Users, path: '/admin/usuarios' },
]

const configItems = [
  { name: 'Roles del Sistema', icon: ShieldCheck, path: '/admin/roles' },
  { name: 'Categorías Personal', icon: Tags, path: '/admin/categorias-personal' },
]

export default function Sidebar() {
  const pathname = usePathname()

  const NavLink = ({ item }: { item: any }) => {
    const isActive = pathname === item.path
    return (
      <Link
        href={item.path}
        className={`group relative flex items-center gap-3 px-4 py-3 mx-2 rounded-xl transition-all duration-300 overflow-hidden ${
          isActive 
            ? 'bg-gradient-to-r from-[#c8902a]/20 to-transparent text-[#c8902a] shadow-inner' 
            : 'text-gray-400 hover:text-white hover:bg-white/5'
        }`}
      >
        {/* Indicador lateral activo */}
        {isActive && (
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#c8902a] rounded-r-full shadow-[0_0_10px_rgba(200,144,42,0.5)]" />
        )}
        
        <item.icon size={20} className={`transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-[#c8902a]' : ''}`} />
        <span className={`font-medium text-sm tracking-tight ${isActive ? 'font-bold' : ''}`}>{item.name}</span>
        
        {isActive && <ChevronRight size={14} className="ml-auto opacity-50 animate-pulse" />}
      </Link>
    )
  }

  return (
    <div className="w-64 bg-[#0a1b2e] min-h-screen text-white flex flex-col shadow-2xl border-r border-white/5">
      {/* Header del Sidebar */}
      <div className="p-6 mb-4">
        <div className="flex items-center gap-3 border-b border-white/10 pb-6">
          <div className="w-11 h-11 bg-gradient-to-br from-[#c8902a] to-[#a6751e] rounded-xl flex items-center justify-center font-black text-xl text-white shadow-xl shadow-[#c8902a]/20 transform rotate-3">
            W
          </div>
          <div>
            <h2 className="font-black text-lg tracking-tight leading-none text-white">ESFM Warisata</h2>
            <div className="mt-1 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-[9px] text-[#c8902a] font-bold tracking-[0.15em] uppercase">Panel Administrativo</span>
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto space-y-8 no-scrollbar pb-6">
        {/* Sección de Gestión */}
        <div>
          <p className="px-7 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Principal</p>
          <div className="space-y-0.5">
            {menuItems.map((item) => (
              <NavLink key={item.path} item={item} />
            ))}
          </div>
        </div>
        
        {/* Sección de Configuración */}
        <div>
          <p className="px-7 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Configuración</p>
          <div className="space-y-0.5">
            {configItems.map((item) => (
              <NavLink key={item.path} item={item} />
            ))}
            <Link
              href="/admin/ajustes"
              className="flex items-center gap-3 px-4 py-3 mx-2 text-gray-500 hover:text-white transition-colors"
            >
              <Settings size={20} className="opacity-50" />
              <span className="font-medium text-sm">Mas Ajustes...</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Footer del Sidebar con usuario (Simulado por ahora) */}
      <div className="p-4 mt-auto border-t border-white/10 bg-black/20">
        <div className="flex items-center gap-3 mb-4 px-3 py-2 rounded-xl bg-white/5">
          <div className="w-8 h-8 rounded-lg bg-[#c8902a]/20 border border-[#c8902a]/30 flex items-center justify-center text-[#c8902a]">
            <Users size={16} />
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-white truncate">Administrador</p>
            <p className="text-[10px] text-gray-500 truncate">Sessión Activa</p>
          </div>
        </div>
        
        <button className="flex items-center gap-3 px-4 py-3 w-full text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition duration-300 group">
          <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold text-xs uppercase tracking-widest">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  )
}
