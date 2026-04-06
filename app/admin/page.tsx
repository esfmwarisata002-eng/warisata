'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import { 
  Newspaper, 
  Users, 
  Bell, 
  GraduationCap, 
  FileText, 
  Megaphone, 
  PlusCircle, 
  ArrowUpRight,
  Activity,
  Calendar,
  Eye,
  CheckCircle2,
  TrendingUp,
  LayoutDashboard
} from 'lucide-react'

interface Stats {
  noticias: number
  tramites: number
  comunicados: number
  convocatorias: number
  personal: number
  especialidades: number
}

interface RecentItem {
  id: string
  titulo: string
  fecha_publicacion: string
  destacada: boolean
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<Stats>({ noticias: 0, tramites: 0, comunicados: 0, convocatorias: 0, personal: 0, especialidades: 0 })
  const [recientes, setRecientes] = useState<RecentItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  async function fetchDashboardData() {
    try {
      const [n, t, c, conv, p, e] = await Promise.all([
        supabase.from('noticias').select('id', { count: 'exact', head: true }),
        supabase.from('tramites').select('id', { count: 'exact', head: true }),
        supabase.from('comunicados').select('id', { count: 'exact', head: true }),
        supabase.from('convocatorias').select('id', { count: 'exact', head: true }),
        supabase.from('personal').select('id', { count: 'exact', head: true }),
        supabase.from('especialidades').select('id', { count: 'exact', head: true }),
      ])
      
      setStats({
        noticias: n.count ?? 0,
        tramites: t.count ?? 0,
        comunicados: c.count ?? 0,
        convocatorias: conv.count ?? 0,
        personal: p.count ?? 0,
        especialidades: e.count ?? 0,
      })

      const { data } = await supabase
        .from('noticias')
        .select('id, titulo, fecha_publicacion, destacada')
        .order('fecha_publicacion', { ascending: false })
        .limit(4)

      setRecientes(data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    { label: 'Noticias', value: stats.noticias, icon: Newspaper, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', href: '/admin/noticias' },
    { label: 'Comunicados', value: stats.comunicados, icon: Bell, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100', href: '/admin/comunicados' },
    { label: 'Personal', value: stats.personal, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100', href: '/admin/personal' },
    { label: 'Especialidades', value: stats.especialidades, icon: GraduationCap, color: 'text-[#c8902a]', bg: 'bg-[#c8902a]/10', border: 'border-[#c8902a]/20', href: '/admin/especialidades' },
    { label: 'Trámites', value: stats.tramites, icon: FileText, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', href: '/admin/tramites' },
    { label: 'Convocatorias', value: stats.convocatorias, icon: Megaphone, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100', href: '/admin/convocatorias' },
  ]

  const quickActions = [
    { label: 'Nueva Noticia', href: '/admin/noticias/nuevo', icon: Newspaper, color: 'from-blue-600 to-blue-500' },
    { label: 'Emitir Comunicado', href: '/admin/comunicados/nuevo', icon: Bell, color: 'from-orange-600 to-orange-500' },
    { label: 'Agregar Personal', href: '/admin/personal/nuevo', icon: Users, color: 'from-indigo-600 to-indigo-500' },
  ]

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* Welcome Section */}
      <div className="relative overflow-hidden bg-[#1a3a5c] rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl shadow-[#1a3a5c]/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#c8902a]/20 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-white/5">
              <CheckCircle2 size={12} className="text-[#c8902a]" />
              Sistema Verificado
            </span>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
               ¡Buenos días, <span className="text-[#c8902a]">{user?.email?.split('@')[0]}</span>!
            </h1>
            <p className="text-white/60 text-sm md:text-base font-medium max-w-md">
              Panel de control institucional de la ESFM Warisata. Gestiona el portal digital de la institución de forma centralizada.
            </p>
          </div>
          <div className="hidden lg:block">
            <div className="relative group">
              <div className="absolute inset-0 bg-[#c8902a] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="relative w-40 h-40 bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10 flex items-center justify-center p-8 flex-col gap-2">
                <LayoutDashboard size={48} className="text-[#c8902a]" />
                <span className="text-[10px] font-black uppercase tracking-widest text-[#c8902a]">Dashboard</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Stats and Actions Column */}
        <div className="xl:col-span-8 space-y-8">
          
          <div className="flex items-center justify-between px-2">
             <h2 className="text-xl font-black text-[#1a3a5c] flex items-center gap-2 uppercase tracking-tight">
               <TrendingUp size={24} className="text-[#c8902a]" />
               Estadísticas Globales
             </h2>
             <span className="text-[10px] font-black text-gray-400">EN TIEMPO REAL</span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {statCards.map((card) => (
              <Link 
                key={card.label} 
                href={card.href}
                className={`group p-6 rounded-[2rem] border ${card.border} ${card.bg} transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-[rgba(0,0,0,0.05)]`}
              >
                <div className="flex flex-col gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${card.color} bg-white shadow-sm group-hover:scale-110 transition-transform`}>
                    <card.icon size={24} />
                  </div>
                  <div>
                    <p className="text-2xl md:text-3xl font-black text-[#1a3a5c] leading-none mb-1">
                      {loading ? '...' : card.value}
                    </p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
                      {card.label}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Quick Actions (Mobile optimized) */}
          <div className="space-y-4">
             <h2 className="text-sm font-black text-[#1a3a5c] px-2 flex items-center gap-2 uppercase tracking-widest">
               <PlusCircle size={18} className="text-[#c8902a]" /> Acciones Rápidas
             </h2>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {quickActions.map(action => (
                  <Link 
                    key={action.label} 
                    href={action.href}
                    className={`group relative overflow-hidden p-6 bg-gradient-to-br ${action.color} rounded-2xl text-white shadow-lg hover:shadow-xl transition-all active:scale-95`}
                  >
                    <div className="flex items-center justify-between relative z-10">
                      <div className="space-y-1">
                        <p className="text-xs font-black opacity-60 uppercase tracking-widest">Añadir</p>
                        <p className="font-bold text-sm">{action.label}</p>
                      </div>
                      <ArrowUpRight size={24} className="opacity-40 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                    </div>
                    <div className="absolute -bottom-4 -right-4 opacity-10 group-hover:scale-125 transition-transform duration-500">
                      <action.icon size={80} />
                    </div>
                  </Link>
                ))}
             </div>
          </div>
        </div>

        {/* Activity Feed Column */}
        <div className="xl:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-md font-black text-[#1a3a5c] flex items-center gap-2 uppercase tracking-tight">
                <Activity size={20} className="text-[#c8902a]" />
                Actividad Reciente
              </h2>
              <Link href="/admin/noticias" className="text-[10px] font-black text-[#c8902a] hover:underline underline-offset-4">VER TODO</Link>
            </div>

            <div className="space-y-6 flex-1">
              {loading ? (
                 <div className="flex flex-col gap-4">
                    {[1,2,3,4].map(i => <div key={i} className="h-16 bg-gray-50 animate-pulse rounded-2xl" />)}
                 </div>
              ) : recientes.length === 0 ? (
                 <div className="flex flex-col items-center justify-center p-12 text-center gap-4 text-gray-300">
                    <Newspaper size={48} className="opacity-20" />
                    <p className="text-xs font-bold uppercase tracking-widest">Sin actividad aún</p>
                 </div>
              ) : (
                recientes.map((item) => (
                  <div key={item.id} className="relative pl-6 before:absolute before:left-0 before:top-2 before:bottom-0 before:w-[2px] before:bg-gray-100 group">
                    <div className="absolute left-[-4px] top-1.5 w-2 h-2 rounded-full bg-[#1a3a5c] group-hover:bg-[#c8902a] transition-colors shadow-[0_0_8px_rgba(26,58,92,0.3)]" />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-gray-400 flex items-center gap-1">
                          <Calendar size={10} />
                          {new Date(item.fecha_publicacion).toLocaleDateString('es-BO', { day: '2-digit', month: 'short' })}
                        </span>
                        {item.destacada && (
                          <span className="text-[8px] font-black bg-[#c8902a]/10 text-[#c8902a] px-2 py-0.5 rounded-full ring-1 ring-[#c8902a]/20">DESTACADA</span>
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-[#1a3a5c] line-clamp-1 group-hover:text-[#c8902a] transition-colors">{item.titulo}</h4>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-8 pt-8 border-t border-gray-50">
               <div className="bg-gray-50 p-4 rounded-2xl flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-emerald-500">
                    <Eye size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Estado Online</p>
                    <p className="text-xs font-bold text-[#1a3a5c]">Sincronizado con Supabase</p>
                  </div>
               </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
