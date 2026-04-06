'use client'
import { useState, useRef } from 'react'
import { Upload, X, FileText, Image as ImageIcon, Loader2, CheckCircle2 } from 'lucide-react'
import { uploadImage, uploadDocument, generateFileName } from '@/utils/storage'

interface FileUploaderProps {
  type: 'image' | 'document'
  onUploadSuccess: (url: string) => void
  currentUrl?: string
  label?: string
}

export default function FileUploader({ type, onUploadSuccess, currentUrl, label }: FileUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentUrl || null)
  const [fileName, setFileName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    setIsUploading(true)
    setFileName(file.name)
    
    try {
      // Mostrar preview local inmediatamente
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => setPreview(e.target?.result as string)
        reader.readAsDataURL(file)
      }

      const uniqueName = generateFileName(file)
      const path = type === 'image' ? `imagenes/${uniqueName}` : `documentos/${uniqueName}`
      
      const url = type === 'image' 
        ? await uploadImage(file, path)
        : await uploadDocument(file, path)

      onUploadSuccess(url)
      if (type !== 'image') setPreview('doc-uploaded') // Simbolo para documentos
      
    } catch (error: any) {
      alert('Error al subir: ' + error.message)
      setPreview(currentUrl || null)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-bold text-[#1a3a5c] mb-1">{label}</label>}
      
      <div 
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => { e.preventDefault(); setDragActive(false); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
        className={`relative group cursor-pointer border-2 border-dashed rounded-2xl p-6 transition-all duration-300 min-h-[160px] flex flex-col items-center justify-center overflow-hidden
          ${dragActive ? 'border-[#c8902a] bg-[#c8902a]/5 scale-[1.01]' : 'border-gray-200 hover:border-[#1a3a5c]/30 hover:bg-gray-50'}`}
      >
        {/* Background Preview Blur (Efecto creativo) */}
        {preview && type === 'image' && (
          <div className="absolute inset-0 opacity-10 blur-xl scale-110 pointer-events-none">
            <img src={preview} alt="Bg" className="w-full h-full object-cover" />
          </div>
        )}

        {/* Content Layout */}
        <div className="relative z-10 flex flex-col items-center text-center">
          {isUploading ? (
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <Loader2 size={40} className="text-[#c8902a] animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-[#c8902a]">
                  50%
                </div>
              </div>
              <p className="text-xs font-bold text-[#1a3a5c] animate-pulse">Optimizando archivo...</p>
            </div>
          ) : preview ? (
            <div className="flex flex-col items-center gap-3 animate-in zoom-in-95 duration-300">
              {type === 'image' ? (
                <div className="relative group/preview">
                  <img 
                    src={preview} 
                    alt="Preview" 
                    className="w-24 h-24 rounded-xl object-cover shadow-2xl border-2 border-white ring-4 ring-[#1a3a5c]/5" 
                  />
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white p-1 rounded-full shadow-lg border-2 border-white">
                    <CheckCircle2 size={12} />
                  </div>
                </div>
              ) : (
                <div className="w-20 h-20 bg-blue-50 rounded-2xl flex flex-col items-center justify-center border border-blue-100 text-blue-600 shadow-xl">
                  <FileText size={32} />
                  <span className="text-[10px] font-black mt-1">PDF OK</span>
                </div>
              )}
              <div className="bg-white/80 backdrop-blur-md px-3 py-1 rounded-full border border-gray-100 shadow-sm">
                <p className="text-[10px] text-gray-500 font-medium truncate max-w-[150px]">
                  {fileName || 'Archivo guardado'}
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 bg-[#1a3a5c]/5 rounded-xl flex items-center justify-center text-[#1a3a5c]/40 mb-3 group-hover:scale-110 transition-transform duration-300 group-hover:text-[#c8902a]">
                {type === 'image' ? <ImageIcon size={24} /> : <Upload size={24} />}
              </div>
              <p className="text-xs font-bold text-[#1a3a5c]/60 group-hover:text-[#1a3a5c]">
                Arrastra tu {type === 'image' ? 'foto' : 'archivo PDF'} aquí
              </p>
              <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-medium">
                {type === 'image' ? 'Máx 500kb' : 'Máx 2MB'}
              </p>
            </>
          )}
        </div>

        <input 
          ref={fileInputRef}
          type="file" 
          hidden 
          accept={type === 'image' ? 'image/*' : '.pdf'} 
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
      </div>
    </div>
  )
}
