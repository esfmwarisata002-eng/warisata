'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import Sidebar from '@/components/Sidebar'
import { Loader2, Menu, Bell, Search, ChevronDown } from 'lucide-react'

const css = `
  .admin-shell{display:flex;height:100vh;overflow:hidden;background:#f1f5f9;font-family:'Inter','Outfit',sans-serif}
  .admin-main{flex:1;display:flex;flex-direction:column;min-width:0;overflow:hidden}
  .admin-topbar{height:56px;background:#fff;border-bottom:1px solid #e5e7eb;display:flex;align-items:center;padding:0 28px;gap:16px;flex-shrink:0;z-index:50}
  .admin-topbar-mobile-btn{display:none;background:none;border:none;cursor:pointer;color:#374151;padding:4px}
  .admin-search{flex:1;max-width:380px;display:flex;align-items:center;gap:10px;background:#f8fafc;border:1px solid #e5e7eb;border-radius:6px;padding:0 14px;height:36px}
  .admin-search input{border:none;background:none;outline:none;font-size:12.5px;color:#374151;width:100%}
  .admin-search input::placeholder{color:#9ca3af}
  .admin-topbar-right{margin-left:auto;display:flex;align-items:center;gap:12px}
  .admin-notif-btn{width:34px;height:34px;background:#f8fafc;border:1px solid #e5e7eb;border-radius:6px;display:flex;align-items:center;justify-content:center;cursor:pointer;position:relative}
  .admin-notif-dot{position:absolute;top:6px;right:6px;width:7px;height:7px;background:#f59e0b;border-radius:50%;border:2px solid #fff}
  .admin-user-pill{display:flex;align-items:center;gap:8px;padding:5px 12px 5px 5px;background:#f8fafc;border:1px solid #e5e7eb;border-radius:6px;cursor:pointer}
  .admin-avatar{width:28px;height:28px;background:#0f1e35;border-radius:4px;display:flex;align-items:center;justify-content:center;color:#f59e0b;font-size:11px;font-weight:800}
  .admin-user-name{font-size:12px;font-weight:600;color:#374151}
  .admin-user-role{font-size:9px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#22c55e}
  .admin-content{flex:1;overflow-y:auto;padding:28px}
  @media(max-width:900px){
    .admin-topbar-mobile-btn{display:flex;align-items:center;justify-content:center}
    .admin-search{display:none}
  }
`

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // useEffect(() => {
  //   if (!loading && !user) router.push('/login')
  // }, [user, loading, router])

  /* if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f1f5f9', fontFamily:"'Inter',sans-serif" }}>
      <div style={{ textAlign:'center' }}>
        <Loader2 style={{ width:40, height:40, animation:'spin 1s linear infinite', color:'#0f1e35', margin:'0 auto 12px' }} />
        <p style={{ fontSize:13, color:'#6b7280', fontWeight:500 }}>Iniciando sesión...</p>
      </div>
    </div>
  ) */

  // if (!user) return null

  const username = user?.email?.split('@')[0] ?? 'Admin'
  const initial = username[0]?.toUpperCase()

  return (
    <>
      <style>{css}</style>
      <div className="admin-shell">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="admin-main">
          {/* Top bar */}
          <header className="admin-topbar">
            <button className="admin-topbar-mobile-btn" onClick={() => setSidebarOpen(true)}>
              <Menu size={20} />
            </button>

            <div className="admin-search">
              <Search size={13} color="#9ca3af" />
              <input placeholder="Buscar en el panel..." />
            </div>

            <div className="admin-topbar-right">
              <div className="admin-notif-btn">
                <Bell size={15} color="#6b7280" />
                <div className="admin-notif-dot" />
              </div>

              <div className="admin-user-pill">
                <div className="admin-avatar">{initial}</div>
                <div>
                  <div className="admin-user-name">{username}</div>
                  <div className="admin-user-role">Online</div>
                </div>
                <ChevronDown size={12} color="#9ca3af" style={{ marginLeft:2 }} />
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="admin-content">
            {children}
          </main>
        </div>
      </div>
    </>
  )
}
