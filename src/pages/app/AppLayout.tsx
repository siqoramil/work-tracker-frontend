import { Outlet } from 'react-router-dom'
import AppTopbar from '@/components/layout/AppTopbar'

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50/40">
      <AppTopbar />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 md:py-14 md:px-8">
        <Outlet />
      </main>
    </div>
  )
}
