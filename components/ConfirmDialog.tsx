'use client'
import { AlertTriangle, X, ShieldAlert, Zap } from 'lucide-react'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel }: ConfirmDialogProps) {
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 z-[5000] bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="absolute top-0 left-0 w-full h-[6px] bg-gradient-to-r from-rose-600 via-amber-500 to-rose-600" />
      
      <div className="bg-white rounded-[4rem] w-full max-w-sm p-12 lg:p-16 shadow-2xl relative border-b-[15px] border-rose-500 animate-in zoom-in-95 duration-300">
        <button onClick={onCancel} className="absolute right-10 top-10 text-slate-300 hover:text-slate-950 transition-colors">
          <X size={32} />
        </button>

        <div className="flex flex-col items-center text-center space-y-10">
          <div className="w-24 h-24 bg-rose-50 rounded-[2.5rem] flex items-center justify-center text-rose-500 shadow-xl animate-float">
             <ShieldAlert size={48} />
          </div>

          <div className="space-y-4">
             <p className="text-[10px] font-black uppercase tracking-[0.5em] text-rose-400">Acción Crítica</p>
             <h3 className="text-3xl font-black text-slate-950 uppercase italic tracking-tighter leading-none">{title}</h3>
             <p className="text-lg text-slate-400 font-medium italic leading-relaxed pt-2">{message}</p>
          </div>

          <div className="w-full space-y-4">
             <button 
               onClick={onConfirm}
               className="w-full py-6 bg-rose-500 text-white rounded-[2rem] font-black uppercase text-[10px] tracking-widest shadow-2xl hover:bg-rose-600 transition-all active:scale-95 flex items-center justify-center gap-3"
             >
                <Zap size={18} /> Confirmar Eliminación
             </button>
             <button 
               onClick={onCancel}
               className="w-full py-6 bg-slate-50 text-slate-400 rounded-[2rem] font-black uppercase text-[10px] tracking-widest hover:bg-slate-100 transition-all"
             >
                Abortar Misión
             </button>
          </div>

          <div className="flex gap-2 opacity-20 pt-4">
             {[1,2,3,4,5].map(i => <div key={i} className="w-2 h-2 rounded-full bg-rose-500" />)}
          </div>
        </div>
      </div>
    </div>
  )
}
