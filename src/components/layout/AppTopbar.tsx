import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Logo from '@/components/ui/Logo'
import LanguageSwitcher from '@/components/ui/LanguageSwitcher'
import ThemeToggle from '@/components/ui/ThemeToggle'
import { useAuthStore } from '@/stores/auth.store'

export default function AppTopbar() {
  const { t } = useTranslation()
  const user = useAuthStore((s) => s.user)
  const signOut = useAuthStore((s) => s.signOut)
  const navigate = useNavigate()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  const navItems = [
    { to: '/app/tracking', label: t('appNav.tracking') },
    { to: '/app/board', label: t('appNav.board') },
    { to: '/app/team', label: t('appNav.team') },
    { to: '/app/settings', label: t('appNav.settings') },
    { to: '/app/download', label: t('appNav.download') },
  ]

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
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-2 px-3 sm:h-16 sm:gap-4 sm:px-6 lg:gap-6 lg:px-8">
        <button
          type="button"
          aria-label={t('common.toggleMenu')}
          aria-expanded={mobileNavOpen}
          onClick={() => setMobileNavOpen((v) => !v)}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-200 sm:h-10 sm:w-10 lg:hidden"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            className="h-5 w-5"
            aria-hidden="true"
          >
            {mobileNavOpen ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>

        <Link to="/app/dashboard" className="flex items-center shrink-0">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex xl:gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-lg px-2.5 py-1.5 text-sm font-medium transition xl:px-3 ${
                  isActive
                    ? 'bg-brand-50 text-brand-800 dark:bg-brand-500/15 dark:text-brand-200'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <LanguageSwitcher />
        </div>

        <div className="relative ml-auto md:ml-3">
          <button
            type="button"
            onClick={() => setUserMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-1.5 text-sm hover:border-brand-200 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-brand-500/60 sm:gap-3 sm:pl-1.5 sm:pr-3"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-xs font-semibold text-white dark:bg-brand-500">
              {initials}
            </span>
            <span className="hidden text-left sm:block sm:max-w-[120px] md:max-w-[160px] lg:max-w-[180px] xl:max-w-[220px]">
              <span className="block truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                {user?.full_name}
              </span>
              <span className="block truncate text-xs text-slate-500 dark:text-slate-400">
                {user?.email}
              </span>
            </span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              className="hidden h-4 w-4 text-slate-400 dark:text-slate-500 sm:block"
              aria-hidden="true"
            >
              <path d="M6 9l6 6 6-6" strokeLinecap="round" />
            </svg>
          </button>
          {userMenuOpen && (
            <div
              onMouseLeave={() => setUserMenuOpen(false)}
              className="absolute right-0 mt-2 w-60 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:shadow-black/40"
            >
              <div className="border-b border-slate-100 px-4 py-3 dark:border-slate-700">
                <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {user?.full_name}
                </p>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                  {user?.email}
                </p>
                {user?.role && (
                  <p className="mt-1 inline-block rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-800 dark:bg-brand-500/15 dark:text-brand-200">
                    {user.role}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={onSignOut}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700"
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
                {t('common.signOut')}
              </button>
            </div>
          )}
        </div>
      </div>

      {mobileNavOpen && (
        <>
          <div
            onClick={() => setMobileNavOpen(false)}
            className="fixed inset-0 top-14 z-20 bg-slate-900/20 backdrop-blur-sm dark:bg-black/50 sm:top-16 lg:hidden"
            aria-hidden="true"
          />
          <div className="absolute left-0 right-0 top-full z-30 border-b border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-900 lg:hidden">
            <nav className="mx-auto grid max-w-7xl grid-cols-2 gap-1 px-3 py-3 sm:grid-cols-3 sm:px-6 sm:py-4 md:grid-cols-6">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileNavOpen(false)}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-2.5 text-center text-sm font-medium transition sm:text-left ${
                      isActive
                        ? 'bg-brand-50 text-brand-800 dark:bg-brand-500/15 dark:text-brand-200'
                        : 'text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <div className="mx-auto flex max-w-7xl items-center justify-end gap-2 px-3 pb-3 sm:px-6 sm:pb-4 md:hidden">
              <ThemeToggle />
              <LanguageSwitcher />
            </div>
          </div>
        </>
      )}
    </header>
  )
}
