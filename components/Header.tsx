'use client'

interface HeaderProps {
  title: string
  subtitle?: string
}

export default function Header({ title, subtitle }: HeaderProps) {
  const now = new Date().toLocaleDateString('es-BO', { weekday:'long', year:'numeric', month:'long', day:'numeric' })
  return (
    <header style={{ background:'#fff', borderBottom:'1px solid #e2e8f0', padding:'1rem 1.5rem', display:'flex', justifyContent:'space-between', alignItems:'center', position:'sticky', top:0, zIndex:40 }}>
      <div>
        <h1 style={{ fontSize:'1.25rem', fontWeight:'700', color:'#1a3a5c', margin:0 }}>{title}</h1>
        {subtitle && <p style={{ fontSize:'.8rem', color:'#64748b', margin:0, marginTop:'2px' }}>{subtitle}</p>}
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
        <span style={{ fontSize:'.8rem', color:'#94a3b8', textTransform:'capitalize' }}>{now}</span>
        <div style={{ width:'36px', height:'36px', background:'linear-gradient(135deg,#1a3a5c,#2196f3)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:'.9rem', fontWeight:'700' }}>A</div>
      </div>
    </header>
  )
}
