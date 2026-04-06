'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'

interface Stats {
  noticias: number
  tramites: number
  comunicados: number
  convocatorias: number
  personal: number
  especialidades: number
}

interface RecentNoticia {
  id: string
  titulo: string
  fecha_publicacion: string
  destacada: boolean
}

const statCards = [
  { key: 'noticias',       label: 'Noticias',       icon: '📰', color: '#3b82f6', bg: '#dbeafe', href: '/admin/noticias' },
  { key: 'tramites',       label: 'Trámites',       icon: '📋', color: '#8b5cf6', bg: '#ede9fe', href: '/admin/tramites' },
  { key: 'comunicados',    label: 'Comunicados',    icon: '📢', color: '#f59e0b', bg: '#fef3c7', href: '/admin/comunicados' },
  { key: 'convocatorias',  label: 'Convocatorias',  icon: '📣', color: '#10b981', bg: '#d1fae5', href: '/admin/convocatorias' },
  { key: 'personal',       label: 'Personal',       icon: '👥', color: '#1a3a5c', bg: '#e0e7ff', href: '/admin/personal' },
  { key: 'especialidades', label: 'Especialidades', icon: '🎓', color: '#c8902a', bg: '#fef9c3', href: '/admin/especialidades' },
]

const quickLinks = [
  { label: 'Nueva Noticia',      href: '/admin/noticias/nuevo',      icon: '➕', color: '#3b82f6' },
  { label: 'Nuevo Comunicado',   href: '/admin/comunicados/nuevo',   icon: '📝', color: '#f59e0b' },
  { label: 'Nueva Convocatoria', href: '/admin/convocatorias/nuevo', icon: '📣', color: '#10b981' },
  { label: 'Agregar Personal',   href: '/admin/personal/nuevo',      icon: '👤', color: '#8b5cf6' },
]

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({ noticias:0, tramites:0, comunicados:0, convocatorias:0, personal:0, especialidades:0 })
  const [recientes, setRecientes] = useState<RecentNoticia[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
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
      const { data } = await supabase.from('noticias').select('id,titulo,fecha_publicacion,destacada').order('fecha_publicacion', { ascending: false }).limit(5)
      setRecientes(data ?? [])
      setLoading(false)
    }
    fetchStats()
  }, [])

  return (
    <div>
      <Header title="Dashboard" subtitle="Resumen general del sistema institucional" />
      <div style={{ padding: '1.5rem' }}>

        {/* Welcome Banner */}
        <div style={{ background: 'linear-gradient(135deg,#1a3a5c 0%,#264e7a 60%,#c8902a 100%)', borderRadius: '14px', padding: '1.75rem 2rem', marginBottom: '1.75rem', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '.4rem' }}>¡Bienvenido al Panel de Control!</h2>
            <p style={{ color: 'rgba(255,255,255,.8)', fontSize: '.9rem' }}>Escuela Superior de Formación de Maestros Warisata</p>
          </div>
          <div style={{ fontSize: '3.5rem', opacity: .8 }}>🏫</div>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
          {statCards.map(card => (
            <Link key={card.key} href={card.href} style={{ textDecoration: 'none' }}>
              <div style={{ background: '#fff', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,.08)', borderLeft: `4px solid ${card.color}`, transition: 'transform .2s, box-shadow .2s', cursor: 'pointer' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 25px rgba(0,0,0,.12)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 3px rgba(0,0,0,.08)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '.75rem' }}>
                  <div style={{ width: '40px', height: '40px', background: card.bg, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>{card.icon}</div>
                </div>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: card.color, lineHeight: 1 }}>
                  {loading ? '—' : stats[card.key as keyof Stats]}
                </div>
                <div style={{ fontSize: '.8rem', color: '#64748b', marginTop: '.3rem' }}>{card.label}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Links + Recent */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '1.25rem' }}>

          {/* Quick Links */}
          <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,.08)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#1a3a5c', marginBottom: '1rem' }}>⚡ Accesos Rápidos</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
              {quickLinks.map(link => (
                <Link key={link.href} href={link.href} style={{
                  display: 'flex', alignItems: 'center', gap: '.75rem',
                  padding: '.75rem 1rem', borderRadius: '8px',
                  background: '#f8fafc', border: '1.5px solid #e2e8f0',
                  textDecoration: 'none', color: '#1e293b', fontSize: '.875rem', fontWeight: '500', transition: 'all .2s'
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = link.color; (e.currentTarget as HTMLElement).style.color = link.color }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0'; (e.currentTarget as HTMLElement).style.color = '#1e293b' }}
                >
                  <span style={{ fontSize: '1.1rem' }}>{link.icon}</span>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Recent News */}
          <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#1a3a5c', margin: 0 }}>📰 Últimas Noticias</h3>
              <Link href="/admin/noticias" style={{ fontSize: '.8rem', color: '#2196f3', textDecoration: 'none' }}>Ver todas →</Link>
            </div>
            {loading ? (
              <p style={{ color: '#94a3b8', fontSize: '.875rem' }}>Cargando...</p>
            ) : recientes.length === 0 ? (
              <p style={{ color: '#94a3b8', fontSize: '.875rem', textAlign: 'center', padding: '1.5rem 0' }}>No hay noticias aún</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
                {recientes.map(n => (
                  <div key={n.id} style={{ display: 'flex', alignItems: 'center', gap: '.75rem', padding: '.65rem .85rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '.85rem', fontWeight: '500', color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.titulo}</div>
                      <div style={{ fontSize: '.75rem', color: '#94a3b8', marginTop: '2px' }}>{new Date(n.fecha_publicacion).toLocaleDateString('es-BO')}</div>
                    </div>
                    {n.destacada && <span style={{ background: '#fef3c7', color: '#92400e', padding: '.15rem .5rem', borderRadius: '999px', fontSize: '.7rem', fontWeight: '600', flexShrink: 0 }}>⭐ Destacada</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
