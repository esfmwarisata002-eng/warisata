'use client'
import { useEffect } from 'react'
import { CheckCircle2, XCircle, Info, X, Zap } from 'lucide-react'

interface ToastProps {
  message: string
  type: 'success' | 'error' | 'info'
  onClose: () => void
}

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onClose, 5000)
    return () => clearTimeout(t)
  }, [onClose])

  const configs = {
    success: { 
      icon: CheckCircle2, 
      color: 'text-emerald-500', 
      bg: 'bg-emerald-50', 
      border: 'border-emerald-100',
      gradient: 'from-emerald-500 to-teal-400' 
    },
    error: { 
      icon: XCircle, 
      color: 'text-rose-500', 
      bg: 'bg-rose-50', 
      border: 'border-rose-100',
      gradient: 'from-rose-600 to-pink-500' 
    },
    info: { 
      icon: Info, 
      color: 'text-sky-500', 
      bg: 'bg-sky-50', 
      border: 'border-sky-100',
      gradient: 'from-sky-600 to-indigo-500' 
    },
  }
  
  const cfg = configs[type]
  const Icon = cfg.icon

  return (
    <div className={`fixed bottom-10 right-10 z-[10000] p-1 rounded-[2.5rem] shadow-3xl animate-in slide-in-from-right-10 duration-500`}>
      <div className={`absolute inset-0 bg-gradient-to-r ${cfg.gradient} rounded-[2.5rem] blur-xl opacity-20`} />
      <div className={`relative flex items-center gap-6 px-8 py-6 ${cfg.bg} ${cfg.border} border-2 rounded-[2.5rem] backdrop-blur-3xl min-w-[320px] max-w-md`}>
        <div className={`w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-lg ${cfg.color}`}>
           <Icon size={28} />
        </div>
        
        <div className="flex-1">
           <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 flex items-center gap-2">
              <Zap size={10} className="fill-current" /> Sistema de Transmisión
           </p>
           <p className="text-sm font-black text-slate-900 uppercase italic tracking-tight">{message}</p>
        </div>

        <button onClick={onClose} className="p-2 hover:bg-white/50 rounded-xl transition-colors text-slate-300 hover:text-slate-950">
           <X size={20} />
        </button>
      </div>
    </div>
  )
}
