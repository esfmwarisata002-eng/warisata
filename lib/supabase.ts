import { createClient } from '@/utils/supabase/client'

// Cliente singleton para el navegador (usado en componentes 'use client')
export const supabase = createClient()
