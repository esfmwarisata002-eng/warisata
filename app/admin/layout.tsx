'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import Sidebar from '@/components/Sidebar'
import { Loader2 } from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

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
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* El Sidebar tiene un ancho fijo por defecto */}
      <Sidebar />
      
      {/* El main ahora llena el espacio restante correctamente sin márgenes extra */}
      <main className="flex-1 min-h-screen overflow-y-auto">
        <div className="max-w-[1600px] mx-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
