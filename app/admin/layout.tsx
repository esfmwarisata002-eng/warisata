'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import Sidebar from '@/components/Sidebar'
import { Loader2, Menu } from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!loading && !user) router.push('/login')
  }, [user, loading, router])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-[#1a3a5c] mx-auto" />
        <p className="text-gray-500 font-medium animate-pulse">Iniciando sesión...</p>
      </div>
    </div>
  )

  if (!user) return null

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
      {/* Sidebar con control de estado para móvil */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Contenido Principal */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* Header superior móvil SOLAMENTE */}
        <header className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-gray-100 shadow-sm z-30">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-[#1a3a5c] hover:bg-gray-50 rounded-xl transition"
          >
            <Menu size={28} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#c8902a] rounded-lg flex items-center justify-center text-white font-bold text-xs">
              W
            </div>
            <span className="font-black text-sm text-[#1a3a5c] tracking-tight uppercase">ESFM Warisata</span>
          </div>
        </header>

        {/* Área de contenido con scroll independiente */}
        <main className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">
          <div className="max-w-[1600px] mx-auto p-4 md:p-8 lg:p-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
