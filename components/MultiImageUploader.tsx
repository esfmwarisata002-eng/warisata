'use client'
import { useState, useEffect, useRef } from 'react'
import { X, Loader2, AlertCircle, UploadCloud } from 'lucide-react'
import { uploadImage, generateFileName } from '@/utils/storage'

export default function MultiImageUploader({ urls, onChange }: { urls: string[], onChange: (urls: string[]) => void }) {
  const [uploading, setUploading] = useState(false)
  const [previews, setPreviews] = useState<string[]>(urls || [])
  const [lastError, setLastError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setPreviews(urls || [])
  }, [urls])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    console.log('--- ARCHIVOS DETECTADOS ---', files?.length);
    
    if (!files || files.length === 0) return
    
    setLastError(null);
    setUploading(true)
    const filesArray = Array.from(files)
    
    // 1. Mostrar previsualización instantánea (Blobs)
    const tempPreviews = filesArray.map(f => URL.createObjectURL(f));
    setPreviews(prev => [...prev, ...tempPreviews]);

    try {
      const uploadedUrls: string[] = [];
      for (const file of filesArray) {
        const uniqueName = generateFileName(file)
        // Usar carpeta galeria que es la más segura en permisos
        const path = `galeria/${uniqueName}`
        const url = await uploadImage(file, path)
        uploadedUrls.push(url)
      }
      
      const finalUrls = [...(urls || []), ...uploadedUrls];
      onChange(finalUrls)
    } catch (error: any) {
      console.error('ERROR CRITICO:', error);
      setLastError(error.message || 'Fallo en la comunicación con el servidor');
      setPreviews(urls || []);
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  const removeImage = (index: number) => {
    const newUrls = previews.filter((_, i) => i !== index)
    onChange(newUrls)
  }

  return (
    <div className="space-y-6">
      {/* Zona de Carga Estilo "Dropzone" */}
      <div 
        onClick={() => inputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-[2rem] p-10 transition-all duration-500 cursor-pointer
          flex flex-col items-center justify-center gap-4 text-center
          ${uploading ? 'bg-gray-50 border-gray-200' : 'bg-white border-[#c8902a]/30 hover:border-[#c8902a] hover:bg-amber-50/30'}
        `}
      >
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${uploading ? 'bg-gray-100 text-gray-400' : 'bg-amber-100 text-[#c8902a]'}`}>
            {uploading ? <Loader2 className="animate-spin" size={32} /> : <UploadCloud size={32} />}
        </div>
        
        <div>
            <p className="text-sm font-black text-[#1a3a5c] uppercase tracking-widest">
                {uploading ? 'Subiendo archivos...' : 'Haz clic para subir fotos'}
            </p>
            <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-tighter">
                PNG, JPG o WEBP (Máx. 5MB cada una)
            </p>
        </div>

        <input 
          ref={inputRef}
          type="file" 
          multiple 
          accept="image/*" 
          onChange={handleUpload}
          className="hidden" 
        />
      </div>

      {lastError && (
        <div className="p-5 bg-red-50 border-2 border-red-100 rounded-2xl flex items-center gap-4 animate-in fade-in zoom-in duration-300">
          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center text-red-500 shrink-0">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-xs font-black text-red-600 uppercase tracking-widest">Error del Servidor</p>
            <p className="text-sm text-red-700 font-medium">{lastError}</p>
          </div>
        </div>
      )}

      {/* Grid de Previsualización */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {previews.map((url, index) => (
          <div key={index} className="relative aspect-square rounded-[1.5rem] overflow-hidden group border border-gray-100 shadow-sm bg-gray-50">
            <img src={url} alt="Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            
            {/* Overlay de carga para nuevas fotos */}
            {url.startsWith('blob:') && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center gap-2">
                    <Loader2 className="animate-spin text-white" size={24} />
                    <span className="text-[9px] font-black text-white uppercase tracking-widest">Subiendo</span>
                </div>
            )}

            {!uploading && !url.startsWith('blob:') && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(index);
                  }}
                  className="absolute top-3 right-3 bg-red-500/90 text-white p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 shadow-xl"
                >
                  <X size={16} />
                </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
