import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import Logo from '@/components/ui/Logo'
import { useAuthStore } from '@/stores/auth.store'

const navItems = [
  { to: '/app/dashboard', label: 'Dashboard' },
  { to: '/app/activity', label: 'Activity' },
  { to: '/app/screenshots', label: 'Screenshots' },
  { to: '/app/team', label: 'Team' },
  { to: '/app/settings', label: 'Settings' },
  { to: '/app/download', label: 'Download' },
]

export default function AppTopbar() {
  const user = useAuthStore((s) => s.user)
  const signOut = useAuthStore((s) => s.signOut)
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const initials = user?.full_name
    ? user.full_name
        .split(/[\s.]+/)
        .map((p) => p[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'U'

  const onSignOut = () => {
    signOut()
    navigate('/auth/signin', { replace: true })
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-5 sm:px-8">
        <Link to="/app/dashboard" className="flex items-center">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  isActive
                    ? 'bg-brand-50 text-brand-800'
                    : 'text-slate-600 hover:bg-slate-100'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="relative ml-auto">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-3 rounded-full border border-slate-200 bg-white py-1 pl-1.5 pr-3 text-sm hover:border-brand-200"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-xs font-semibold text-white">
              {initials}
            </span>
            <span className="hidden text-left sm:block">
              <span className="block text-sm font-semibold text-slate-900">
                {user?.full_name}
              </span>
              <span className="block text-xs text-slate-500">
                {user?.email}
              </span>
            </span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              className="h-4 w-4 text-slate-400"
              aria-hidden="true"
            >
              <path d="M6 9l6 6 6-6" strokeLinecap="round" />
            </svg>
          </button>
          {open && (
            <div
              onMouseLeave={() => setOpen(false)}
              className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg"
            >
              <div className="border-b border-slate-100 px-4 py-3">
                <p className="text-sm font-semibold text-slate-900">
                  {user?.full_name}
                </p>
                <p className="truncate text-xs text-slate-500">{user?.email}</p>
                {user?.role && (
                  <p className="mt-1 inline-block rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-800">
                    {user.role}
                  </p>
                )}
              </div>
              <div className="md:hidden">
                {navItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="border-t border-slate-100" />
              </div>
              <button
                type="button"
                onClick={onSignOut}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  className="h-4 w-4"
                >
                  <path
                    d="M15 12H3m0 0l4-4m-4 4l4 4M21 4v16"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
