import { Outlet } from 'react-router-dom'
import AppTopbar from '@/components/layout/AppTopbar'

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50/40">
      <AppTopbar />
      <main className="mx-auto max-w-7xl px-3 py-5 sm:px-6 sm:py-8 md:py-10 lg:px-8 lg:py-12">
        <Outlet />
      </main>
    </div>
  )
}
