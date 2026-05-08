'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import {
  Newspaper, Users, FileText, GraduationCap, Bell, ListChecks,
  ArrowUpRight, PlusCircle, Activity, TrendingUp, Clock
} from 'lucide-react'

const css = `
  .dash-page{display:flex;flex-direction:column;gap:24px}
  .dash-header{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap}
  .dash-title{font-size:22px;font-weight:800;color:#0f1e35;letter-spacing:-0.02em;margin:0 0 4px}
  .dash-sub{font-size:13px;color:#6b7280;margin:0}
  .dash-header-btn{display:inline-flex;align-items:center;gap:7px;padding:9px 18px;background:#0f1e35;color:#fff;border-radius:6px;font-size:11.5px;font-weight:700;letter-spacing:0.05em;text-decoration:none;transition:background 0.2s}
  .dash-header-btn:hover{background:#1a2f4a}
  .stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
  .stat-card{background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:22px;display:flex;flex-direction:column;gap:16px;text-decoration:none;transition:all 0.2s;cursor:pointer}
  .stat-card:hover{border-color:#0f1e35;box-shadow:0 4px 16px rgba(0,0,0,0.06);transform:translateY(-1px)}
  .stat-card-top{display:flex;align-items:center;justify-content:space-between}
  .stat-icon{width:38px;height:38px;border-radius:8px;display:flex;align-items:center;justify-content:center}
  .stat-val{font-size:32px;font-weight:900;color:#0f1e35;letter-spacing:-0.03em;line-height:1}
  .stat-label{font-size:10px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#9ca3af;margin-top:4px}
  .content-grid{display:grid;grid-template-columns:2fr 1fr;gap:20px}
  .panel{background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:22px}
  .panel-title{font-size:13px;font-weight:700;color:#0f1e35;margin:0 0 18px;display:flex;align-items:center;gap:8px}
  .panel-title-dot{width:8px;height:8px;background:#f59e0b;border-radius:2px;flex-shrink:0}
  .feed-item{display:flex;align-items:center;justify-content:space-between;padding:12px;border-radius:7px;background:#f8fafc;margin-bottom:8px;transition:background 0.15s}
  .feed-item:last-child{margin-bottom:0}
  .feed-item:hover{background:#f1f5f9}
  .feed-icon{width:36px;height:36px;background:#fff;border:1px solid #e5e7eb;border-radius:7px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
  .feed-title{font-size:12.5px;font-weight:600;color:#1e293b;margin:0 0 3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:280px}
  .feed-date{font-size:10px;color:#9ca3af;font-weight:500}
  .feed-link{font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#0f1e35;text-decoration:none;padding:5px 10px;border:1px solid #e5e7eb;border-radius:5px;white-space:nowrap}
  .feed-link:hover{background:#f8fafc}
  .quick-links{display:flex;flex-direction:column;gap:8px}
  .quick-link{display:flex;align-items:center;justify-content:space-between;padding:12px 14px;background:#f8fafc;border:1px solid #e5e7eb;border-radius:7px;text-decoration:none;transition:all 0.15s}
  .quick-link:hover{background:#0f1e35;border-color:#0f1e35}
  .quick-link:hover .ql-label{color:#fff}
  .quick-link:hover .ql-icon{color:#f59e0b}
  .quick-link:hover .ql-arrow{color:#fff}
  .ql-label{font-size:12px;font-weight:600;color:#374151;transition:color 0.15s}
  .ql-icon{color:#6b7280;transition:color 0.15s}
  .ql-arrow{color:#d1d5db;transition:color 0.15s}
  .divider{height:1px;background:#f1f5f9;margin:4px 0}
  @media(max-width:1024px){.stats-grid{grid-template-columns:1fr 1fr}.content-grid{grid-template-columns:1fr}}
  @media(max-width:600px){.stats-grid{grid-template-columns:1fr}}
`

const ICONS_BG: Record<string, string> = {
  noticias: 'rgba(99,102,241,0.1)', personal: 'rgba(236,72,153,0.1)',
  tramites: 'rgba(245,158,11,0.1)', especialidades: 'rgba(16,185,129,0.1)',
}
const ICONS_COLOR: Record<string, string> = {
  noticias: '#6366f1', personal: '#ec4899', tramites: '#f59e0b', especialidades: '#10b981',
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState({ noticias: 0, tramites: 0, comunicados: 0, convocatorias: 0, personal: 0, especialidades: 0 })
  const [recientes, setRecientes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [n, t, c, conv, p, e] = await Promise.all([
          supabase.from('noticias').select('id', { count: 'exact', head: true }),
          supabase.from('tramites').select('id', { count: 'exact', head: true }),
          supabase.from('comunicados').select('id', { count: 'exact', head: true }),
          supabase.from('convocatorias').select('id', { count: 'exact', head: true }),
          supabase.from('personal').select('id', { count: 'exact', head: true }),
          supabase.from('especialidades').select('id', { count: 'exact', head: true }),
        ])
        setStats({ noticias: n.count??0, tramites: t.count??0, comunicados: c.count??0, convocatorias: conv.count??0, personal: p.count??0, especialidades: e.count??0 })
        const { data } = await supabase.from('noticias').select('id,titulo,fecha_publicacion').order('fecha_publicacion',{ascending:false}).limit(5)
        setRecientes(data || [])
      } finally { setLoading(false) }
    }
    load()
  }, [])

  const username = user?.email?.split('@')[0] ?? 'Admin'

  const CARDS = [
    { key:'noticias',      label:'Noticias',      icon:Newspaper,      val:stats.noticias,      href:'/admin/noticias' },
    { key:'personal',      label:'Personal',       icon:Users,          val:stats.personal,      href:'/admin/personal' },
    { key:'tramites',      label:'Trámites',       icon:ListChecks,     val:stats.tramites,      href:'/admin/tramites' },
    { key:'especialidades',label:'Especialidades', icon:GraduationCap,  val:stats.especialidades,href:'/admin/especialidades' },
  ]

  const QUICK = [
    { label:'Nueva Noticia',       icon:Newspaper,     href:'/admin/noticias/nuevo' },
    { label:'Alta de Personal',    icon:Users,         href:'/admin/personal/nuevo' },
    { label:'Nueva Convocatoria',  icon:FileText,      href:'/admin/convocatorias/nuevo' },
    { label:'Ver Trámites',        icon:ListChecks,    href:'/admin/tramites' },
    { label:'Comunicados',         icon:Bell,          href:'/admin/comunicados' },
  ]

  return (
    <>
      <style>{css}</style>
      <div className="dash-page">

        {/* Header */}
        <div className="dash-header">
          <div>
            <h1 className="dash-title">Panel de Control</h1>
            <p className="dash-sub">Bienvenido, <strong>{username}</strong> — Gestión administrativa central · ESFM Warisata</p>
          </div>
          <Link href="/admin/noticias/nuevo" className="dash-header-btn">
            <PlusCircle size={15} /> Nueva Noticia
          </Link>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          {CARDS.map(c => (
            <Link key={c.key} href={c.href} className="stat-card">
              <div className="stat-card-top">
                <div className="stat-icon" style={{ background: ICONS_BG[c.key] }}>
                  <c.icon size={18} color={ICONS_COLOR[c.key]} />
                </div>
                <ArrowUpRight size={15} color="#d1d5db" />
              </div>
              <div>
                <div className="stat-val">{loading ? '—' : c.val}</div>
                <div className="stat-label">{c.label}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Content */}
        <div className="content-grid">
          
          {/* Recent activity */}
          <div className="panel">
            <h3 className="panel-title"><div className="panel-title-dot"/> Actividad Reciente</h3>
            {loading ? [1,2,3,4].map(i => (
              <div key={i} style={{ height:52, background:'#f8fafc', borderRadius:7, marginBottom:8, animation:'sk 1.5s ease-in-out infinite' }} />
            )) : recientes.length > 0 ? recientes.map(n => (
              <div key={n.id} className="feed-item">
                <div style={{ display:'flex', alignItems:'center', gap:12, minWidth:0 }}>
                  <div className="feed-icon"><Newspaper size={16} color="#6366f1"/></div>
                  <div style={{ minWidth:0 }}>
                    <p className="feed-title">{n.titulo}</p>
                    <p className="feed-date">{new Date(n.fecha_publicacion).toLocaleDateString('es-BO',{day:'2-digit',month:'short',year:'numeric'})}</p>
                  </div>
                </div>
                <Link href={`/admin/noticias/${n.id}`} className="feed-link">Editar</Link>
              </div>
            )) : (
              <p style={{ textAlign:'center', padding:'32px 0', color:'#9ca3af', fontSize:13 }}>No hay actividad reciente.</p>
            )}
          </div>

          {/* Quick links */}
          <div className="panel">
            <h3 className="panel-title"><div className="panel-title-dot"/>Accesos Rápidos</h3>
            <div className="quick-links">
              {QUICK.map((q,i) => (
                <Link key={i} href={q.href} className="quick-link">
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <q.icon size={14} className="ql-icon" color="#6b7280" />
                    <span className="ql-label">{q.label}</span>
                  </div>
                  <ArrowUpRight size={13} className="ql-arrow" color="#d1d5db" />
                </Link>
              ))}
            </div>

            <div className="divider" style={{ margin:'16px 0' }} />

            {/* Mini stats */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              {[
                { label:'Comunicados', val:stats.comunicados, icon:Bell },
                { label:'Convocatorias', val:stats.convocatorias, icon:FileText },
              ].map((s,i) => (
                <div key={i} style={{ background:'#f8fafc', border:'1px solid #e5e7eb', borderRadius:8, padding:'12px 14px' }}>
                  <div style={{ fontSize:22, fontWeight:900, color:'#0f1e35', letterSpacing:'-0.02em' }}>{loading ? '—' : s.val}</div>
                  <div style={{ fontSize:9.5, fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase', color:'#9ca3af', marginTop:3 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes sk{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
    </>
  )
}
