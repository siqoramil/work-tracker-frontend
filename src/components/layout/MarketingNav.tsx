import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Logo from '@/components/ui/Logo'
import Button from '@/components/ui/Button'
import LanguageSwitcher from '@/components/ui/LanguageSwitcher'

export default function MarketingNav() {
  const { t } = useTranslation()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  const links = [
    { label: t('marketingNav.links.features'), href: '#features' },
    { label: t('marketingNav.links.howItWorks'), href: '#how' },
    { label: t('marketingNav.links.customers'), href: '#customers' },
    { label: t('marketingNav.links.pricing'), href: '#pricing' },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-40 w-full transition ${
        scrolled
          ? 'border-b border-slate-200 bg-white/80 backdrop-blur'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link to="/" className="flex items-center">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <LanguageSwitcher />
          <Link
            to="/auth/signin"
            className="rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-700 hover:text-brand-700"
          >
            {t('common.signIn')}
          </Link>
          <Link to="/auth/signup">
            <Button>{t('common.startFreeTrial')}</Button>
          </Link>
        </div>

        <button
          type="button"
          aria-label={t('common.toggleMenu')}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 lg:hidden"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            className="h-5 w-5"
          >
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-5 py-4">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                {l.label}
              </a>
            ))}
            <div className="mt-2 flex">
              <LanguageSwitcher />
            </div>
            <div className="mt-2 flex gap-2">
              <Link to="/auth/signin" className="flex-1">
                <Button variant="secondary" fullWidth>
                  {t('common.signIn')}
                </Button>
              </Link>
              <Link to="/auth/signup" className="flex-1">
                <Button fullWidth>{t('common.startFree')}</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
