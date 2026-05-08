'use client'
import { Bell, Search, Sparkles, User } from 'lucide-react'

interface HeaderProps {
  title: string
  subtitle?: string
}

export default function Header({ title, subtitle }: HeaderProps) {
  const now = new Date().toLocaleDateString('es-BO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  
  return (
    <header className="sticky top-0 z-40 bg-white/50 backdrop-blur-3xl border-b border-slate-100 px-8 py-6 flex items-center justify-between">
      <div className="flex flex-col">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-black uppercase tracking-tighter italic text-slate-950">{title}</h1>
          <Sparkles size={16} className="text-amber-500 animate-pulse" />
        </div>
        {subtitle && <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 italic">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-10">
        <div className="hidden md:flex items-center gap-4 px-6 py-3 bg-slate-50 rounded-full border border-slate-100">
           <Search size={16} className="text-slate-300" />
           <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Comando Rápido...</span>
        </div>

        <div className="flex items-center gap-6">
           <div className="relative cursor-pointer hover:scale-110 transition-transform">
              <Bell size={22} className="text-slate-400" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-white shadow-sm" />
           </div>
           
           <div className="h-10 w-px bg-slate-100" />
           
           <div className="flex items-center gap-4 group cursor-pointer">
              <div className="flex flex-col items-end">
                 <span className="text-[10px] font-black uppercase text-slate-950 tracking-tight leading-none">Administrador</span>
                 <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest mt-1">Online</span>
              </div>
              <div className="w-12 h-12 bg-slate-950 text-white rounded-2xl flex items-center justify-center shadow-xl group-hover:rotate-6 group-hover:scale-105 transition-all">
                 <User size={22} />
              </div>
           </div>
        </div>
      </div>
    </header>
  )
}
