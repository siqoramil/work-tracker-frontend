import { Outlet } from 'react-router-dom'
import AppTopbar from '@/components/layout/AppTopbar'

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50/40">
      <AppTopbar />
      <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        <Outlet />
      </main>
    </div>
  )
}
