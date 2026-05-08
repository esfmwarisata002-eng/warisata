'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import { Rocket, Shield, Lock, Mail, Sparkles, Zap, Command } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user && !authLoading) {
      router.push('/admin')
    }
  }, [user, authLoading, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        setError(error.message === 'Invalid login credentials' ? 'Credenciales incorrectas. Inténtelo de nuevo.' : error.message)
        setLoading(false)
      } else {
        router.push('/admin')
      }
    } catch (err) {
      setError('Ocurrió un error al intentar iniciar sesión.')
      setLoading(false)
    }
  }

  if (authLoading) return null

  return (
    <div className="min-h-screen font-outfit bg-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* VIBRANT BACKGROUND DECORATIONS */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-violet-600/10 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-rose-500/10 rounded-full blur-[150px] translate-y-1/2 -translate-x-1/2" />

      <div className="w-full max-w-xl relative">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500 rounded-2xl rotate-12 -z-10 animate-float" />
        <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-violet-600 rounded-full -z-10 animate-pulse" />

        <div className="bg-white rounded-[4rem] shadow-3xl p-12 lg:p-16 border border-slate-50 relative z-10">
          <div className="text-center space-y-8 mb-16">
            <Link href="/" className="inline-flex items-center gap-6 group">
               <div className="w-20 h-20 bg-slate-950 text-white rounded-[2rem] flex items-center justify-center shadow-2xl transition-transform group-hover:rotate-12 group-hover:scale-110">
                  <Command size={40} />
               </div>
               <div className="flex flex-col text-left">
                  <span className="text-4xl font-black tracking-tighter leading-none text-slate-950 uppercase italic">Warisata</span>
                  <span className="text-[10px] font-black uppercase tracking-[0.5em] text-violet-600 mt-1">Sistemas Académicos</span>
               </div>
            </Link>
            
            <div className="space-y-4">
               <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic">Ingreso de <br /> <span className="text-gradient">Personal.</span></h1>
               <p className="text-lg text-slate-400 font-medium italic">Accede a la plataforma de gestión institucional.</p>
            </div>
          </div>

          {error && (
            <div className="p-6 bg-rose-50 border border-rose-100 rounded-3xl text-rose-600 text-sm font-bold flex items-center gap-4 mb-10 animate-in slide-in-from-top-4 duration-500">
               <Shield size={20} />
               {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 pl-4">Correo Institucional</label>
              <div className="relative group">
                 <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-violet-600 transition-colors" size={24} />
                 <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="admin@warisata.edu.bo"
                  className="w-full pl-16 pr-8 py-6 bg-slate-50 border-2 border-transparent rounded-[2rem] focus:bg-white focus:border-violet-600 focus:shadow-2xl transition-all outline-none font-black text-slate-950 uppercase text-xs tracking-widest placeholder:text-slate-200"
                 />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 pl-4">Contraseña Segura</label>
              <div className="relative group">
                 <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-rose-500 transition-colors" size={24} />
                 <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-16 pr-8 py-6 bg-slate-50 border-2 border-transparent rounded-[2rem] focus:bg-white focus:border-rose-500 focus:shadow-2xl transition-all outline-none font-black text-slate-950 uppercase text-xs tracking-widest placeholder:text-slate-200"
                 />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-8 bg-slate-950 text-white rounded-[2.5rem] font-black text-xs uppercase tracking-[0.4em] shadow-3xl hover:bg-violet-600 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 group disabled:opacity-50"
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Rocket size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  Despegar al Sistema
                </>
              )}
            </button>
          </form>

          <div className="mt-16 text-center space-y-6">
             <div className="flex items-center justify-center gap-4">
                {[1,2,3,4,5,6,7].map(i => <div key={i} className={`w-2 h-2 rounded-full ${i % 2 === 0 ? 'animate-bounce' : 'animate-pulse'}`} style={{ backgroundColor: i === 1 ? '#8b5cf6' : i === 2 ? '#f43f5e' : i === 3 ? '#f59e0b' : i === 4 ? '#10b981' : i === 5 ? '#06b6d4' : i === 6 ? '#3b82f6' : '#6366f1' }} />)}
             </div>
             <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">
                © 2026 ESFM Warisata · Estado Plurinacional de Bolivia
             </p>
          </div>
        </div>
      </div>
    </div>
  )
}
