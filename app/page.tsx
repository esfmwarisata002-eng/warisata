import { redirect } from 'next/navigation';

export default function Home() {
  // Redirigir a la vista de administración por defecto
  redirect('/admin');
}
