'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import {
  LayoutDashboard, Newspaper, UserCircle, FileText, Image as ImageIcon,
  Users, Bell, GraduationCap, ListChecks, PhoneCall, ShieldCheck,
  Tags, Network, LogOut, ChevronRight, X, BookOpen
} from 'lucide-react'

const MAIN = [
  { name: 'Dashboard',     icon: LayoutDashboard, path: '/admin' },
  { name: 'Noticias',      icon: Newspaper,        path: '/admin/noticias' },
  { name: 'Comunicados',   icon: Bell,             path: '/admin/comunicados' },
  { name: 'Convocatorias', icon: FileText,         path: '/admin/convocatorias' },
  { name: 'Trámites',      icon: ListChecks,       path: '/admin/tramites' },
  { name: 'Requisitos',    icon: BookOpen,         path: '/admin/requisitos' },
  { name: 'Personal',      icon: UserCircle,       path: '/admin/personal' },
  { name: 'Institución',   icon: FileText,         path: '/admin/institucion' },
  { name: 'Carreras',      icon: GraduationCap,    path: '/admin/especialidades' },
  { name: 'Galería',       icon: ImageIcon,        path: '/admin/galeria' },
  { name: 'Contacto',      icon: PhoneCall,        path: '/admin/contacto' },
  { name: 'Usuarios',      icon: Users,            path: '/admin/usuarios' },
]

const CONFIG = [
  { name: 'Roles',         icon: ShieldCheck, path: '/admin/roles' },
  { name: 'Etiquetas',     icon: Tags,        path: '/admin/categorias-personal' },
  { name: 'Tipo Trámites', icon: Network,     path: '/admin/categorias-tramites' },
]

const css = `
  .sidebar{width:240px;min-width:240px;background:#0f1e35;display:flex;flex-direction:column;height:100vh;overflow:hidden;border-right:1px solid rgba(255,255,255,0.05);flex-shrink:0}
  .sidebar-logo{padding:20px 20px 16px;border-bottom:1px solid rgba(255,255,255,0.06)}
  .sidebar-logo-inner{display:flex;align-items:center;gap:12px;text-decoration:none}
  .sidebar-logo-icon{width:36px;height:36px;background:#f59e0b;display:flex;align-items:center;justify-content:center;flex-shrink:0}
  .sidebar-logo-name{font-size:14px;font-weight:800;color:#fff;letter-spacing:-0.01em;line-height:1.1}
  .sidebar-logo-sub{font-size:8px;color:rgba(255,255,255,0.3);letter-spacing:0.25em;text-transform:uppercase;margin-top:2px;font-weight:600}
  .sidebar-nav{flex:1;overflow-y:auto;padding:12px 0}
  .sidebar-section{margin-bottom:4px}
  .sidebar-section-label{font-size:8.5px;font-weight:700;letter-spacing:0.3em;text-transform:uppercase;color:rgba(255,255,255,0.2);padding:16px 20px 8px}
  .sidebar-item{display:flex;align-items:center;gap:10px;padding:8px 16px;margin:0 8px;border-radius:6px;text-decoration:none;transition:all 0.15s;cursor:pointer}
  .sidebar-item:hover{background:rgba(255,255,255,0.06)}
  .sidebar-item.active{background:rgba(245,158,11,0.15);border-left:2px solid #f59e0b}
  .sidebar-item-icon{width:30px;height:30px;display:flex;align-items:center;justify-content:center;border-radius:6px;flex-shrink:0}
  .sidebar-item.active .sidebar-item-icon{background:rgba(245,158,11,0.2)}
  .sidebar-item-label{font-size:11.5px;font-weight:600;color:rgba(255,255,255,0.55);letter-spacing:0.02em}
  .sidebar-item.active .sidebar-item-label{color:#fff}
  .sidebar-item:hover .sidebar-item-label{color:rgba(255,255,255,0.85)}
  .sidebar-footer{padding:12px;border-top:1px solid rgba(255,255,255,0.06)}
  .sidebar-logout{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:6px;border:none;background:none;color:rgba(255,255,255,0.35);cursor:pointer;width:100%;transition:all 0.15s;font-size:11px;font-weight:600;letter-spacing:0.05em}
  .sidebar-logout:hover{background:rgba(239,68,68,0.12);color:#f87171}
  .sidebar-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:109;display:none}
  @media(max-width:900px){
    .sidebar{position:fixed;left:0;top:0;bottom:0;z-index:110;transform:translateX(-100%);transition:transform 0.25s}
    .sidebar.open{transform:translateX(0)}
    .sidebar-overlay.open{display:block}
  }
`

interface SidebarProps { isOpen: boolean; onClose: () => void }

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const { signOut } = useAuth() as any
  const router = useRouter()

  const handleLogout = async () => {
    try { await signOut?.() } catch {}
    router.push('/login')
  }

  return (
    <>
      <style>{css}</style>
      <div className={`sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        
        {/* Logo */}
        <div className="sidebar-logo">
          <Link href="/" className="sidebar-logo-inner">
            <div className="sidebar-logo-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#002147" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
              </svg>
            </div>
            <div>
              <div className="sidebar-logo-name">Warisata</div>
              <div className="sidebar-logo-sub">Panel Administrativo</div>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          <div className="sidebar-section">
            <div className="sidebar-section-label">Menú Principal</div>
            {MAIN.map(item => {
              const active = pathname === item.path
              return (
                <Link key={item.path} href={item.path} onClick={onClose} className={`sidebar-item ${active ? 'active' : ''}`}>
                  <div className="sidebar-item-icon">
                    <item.icon size={15} color={active ? '#f59e0b' : 'rgba(255,255,255,0.4)'} />
                  </div>
                  <span className="sidebar-item-label">{item.name}</span>
                </Link>
              )
            })}
          </div>

          <div className="sidebar-section">
            <div className="sidebar-section-label">Configuración</div>
            {CONFIG.map(item => {
              const active = pathname === item.path
              return (
                <Link key={item.path} href={item.path} onClick={onClose} className={`sidebar-item ${active ? 'active' : ''}`}>
                  <div className="sidebar-item-icon">
                    <item.icon size={15} color={active ? '#f59e0b' : 'rgba(255,255,255,0.4)'} />
                  </div>
                  <span className="sidebar-item-label">{item.name}</span>
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <button className="sidebar-logout" onClick={handleLogout}>
            <LogOut size={14} />
            Cerrar Sesión
          </button>
        </div>
      </aside>
    </>
  )
}
