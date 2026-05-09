import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/features/auth'

export default function PublicOnlyRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  if (isAuthenticated) {
    return <Navigate to="/app/activity" replace />
  }

  return <Outlet />
}
