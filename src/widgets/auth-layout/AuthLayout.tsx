import { Link, Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Logo from '@/shared/ui/Logo'
import ThemeToggle from '@/features/theme/ui/ThemeToggle'

const highlights = [
  {
    title: 'Time that speaks for itself',
    text: 'Track every minute your team spends on projects with pixel-perfect accuracy.',
  },
  {
    title: 'Effortless payroll',
    text: 'Turn logged hours into invoices and reports in a single click.',
  },
  {
    title: 'Insights that scale',
    text: 'Dashboards that grow with your team — from 3 people to 300.',
  },
]

export default function AuthLayout() {
  const { t } = useTranslation()
  return (
    <div className="flex min-h-screen w-full bg-white dark:bg-slate-950">
      <aside className="relative hidden w-1/2 overflow-hidden bg-brand-700 text-white lg:flex lg:flex-col">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800" />
          <div className="absolute -top-32 -left-20 h-96 w-96 rounded-full bg-brand-400/30 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-[32rem] w-[32rem] translate-x-1/3 translate-y-1/3 rounded-full bg-brand-300/20 blur-3xl" />
          <svg
            className="absolute inset-0 h-full w-full text-white/[0.06]"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <defs>
              <pattern
                id="grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative z-10 flex h-full flex-col p-10 xl:p-14">
          <Logo tone="light" />

          <div className="mt-16 xl:mt-24">
            <h1 className="max-w-md text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">
              Run your team’s time like a well-oiled machine.
            </h1>
            <p className="mt-4 max-w-md text-base text-brand-50/90">
              The admin cockpit for WorkTracker — manage people, projects, and
              payouts in one green-tinted place.
            </p>
          </div>

          <ul className="mt-12 space-y-5">
            {highlights.map((h) => (
              <li key={h.title} className="flex max-w-md items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-3.5 w-3.5 text-white"
                    aria-hidden="true"
                  >
                    <path d="M5 12l4.5 4.5L19 7" />
                  </svg>
                </span>
                <div>
                  <p className="font-medium text-white">{h.title}</p>
                  <p className="text-sm text-brand-50/80">{h.text}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-auto flex items-center justify-between pt-12 text-xs text-brand-50/70">
            <span>© {new Date().getFullYear()} WorkTracker Admin</span>
            <div className="flex gap-5">
              <a href="#" className="hover:text-white">
                Privacy
              </a>
              <a href="#" className="hover:text-white">
                Terms
              </a>
            </div>
          </div>
        </div>
      </aside>

      <main className="relative flex flex-1 items-center justify-center px-5 py-10 sm:px-10">
        <Link
          to="/"
          aria-label={t('common.backToHome')}
          className="group absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm backdrop-blur transition hover:border-brand-300 hover:bg-white hover:text-brand-700 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:border-brand-500/60 dark:hover:bg-slate-900 dark:hover:text-brand-200 sm:left-10 sm:top-8 sm:gap-2 sm:px-3.5 sm:py-2 sm:text-sm"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
            aria-hidden="true"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
          <span>{t('common.backToHome')}</span>
        </Link>
        <div className="absolute right-5 top-5 sm:right-10 sm:top-8">
          <ThemeToggle />
        </div>
        <div className="w-full max-w-md">
          <div className="mb-10 flex items-center justify-between lg:hidden">
            <Logo />
          </div>
          <Outlet />
        </div>
      </main>
    </div>
  )
}
