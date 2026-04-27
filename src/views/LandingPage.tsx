import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import MarketingNav from '@/components/layout/MarketingNav'
import MarketingFooter from '@/components/layout/MarketingFooter'
import Button from '@/components/ui/Button'

const features = [
  {
    title: 'Silent time tracking',
    text: 'Automatic desktop tracking that respects your team — no keystroke spying, no creepy overreach.',
    icon: <path d="M12 6v6l4 2m5-2a9 9 0 11-18 0 9 9 0 0118 0z" />,
  },
  {
    title: 'Project-level insights',
    text: 'See where hours actually go — by project, client, or task — with real-time dashboards.',
    icon: <path d="M3 3v18h18M7 15l3-3 3 3 5-6" />,
  },
  {
    title: 'Team productivity',
    text: 'Spot burnout before it happens. Balance workloads with humane, contextual signals.',
    icon: (
      <path d="M17 11a4 4 0 11-8 0 4 4 0 018 0zM3 20c0-3.3 3.6-6 9-6s9 2.7 9 6" />
    ),
  },
  {
    title: 'Invoices in a click',
    text: 'Turn approved hours into client-ready invoices — in your currency, your brand, your rules.',
    icon: <path d="M9 12h6M9 16h6M5 4h14v16H5zM9 8h6" />,
  },
  {
    title: 'Integrations',
    text: 'Slack, Jira, GitHub, Asana, QuickBooks and 40+ more — connect in under a minute.',
    icon: (
      <path d="M8 11V8a4 4 0 118 0v3m-8 0h8m-9 0h10v9a2 2 0 01-2 2H9a2 2 0 01-2-2z" />
    ),
  },
  {
    title: 'Admin-grade security',
    text: 'SOC 2 Type II, SSO, SCIM, encrypted at rest and in transit. Built for IT teams.',
    icon: <path d="M12 3l9 4v5c0 5-3.8 9.4-9 10.5C6.8 21.4 3 17 3 12V7l9-4z" />,
  },
]

const steps = [
  {
    num: '01',
    title: 'Install the desktop app',
    text: 'Give your team the WorkTracker desktop app — available on macOS, Windows, and Linux.',
  },
  {
    num: '02',
    title: 'Track quietly in the background',
    text: 'Start a timer, pick a project, and get back to work. WorkTracker handles the rest.',
  },
  {
    num: '03',
    title: 'Review, approve, invoice',
    text: 'Review timesheets from the admin panel, approve with one click, and bill clients in seconds.',
  },
]

const logos = ['NovaCorp', 'Helix', 'Proxima', 'Arclight', 'Bluebird', 'Radix']

export default function LandingPage() {
  const { t } = useTranslation()
  return (
    <div className="relative min-h-screen bg-white text-slate-800">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[640px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-50 via-white to-white" />
        <div className="absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-brand-200/40 blur-3xl" />
      </div>

      <MarketingNav />

      <section className="relative mx-auto max-w-7xl px-5 pt-12 pb-16 sm:px-8 sm:pt-20 sm:pb-20 lg:pt-28">
        <div className="flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-3 py-1 text-xs font-medium text-brand-700 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
            {t('landing.hero.badge')}
          </span>
          <h1 className="mt-6 max-w-4xl text-3xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            {t('landing.hero.titleStart')}{' '}
            <span className="relative inline-block">
              <span className="relative z-10 text-brand-700">
                {t('landing.hero.titleHighlight')}
              </span>
              <span className="absolute inset-x-0 bottom-1 -z-0 h-3 bg-brand-200/70" />
            </span>
            .
          </h1>
          <p className="mt-6 max-w-2xl text-base text-slate-600 sm:text-lg">
            {t('landing.hero.subtitle')}
          </p>
          <div className="mt-8 flex w-full max-w-md flex-col items-stretch gap-3 sm:max-w-none sm:w-auto sm:flex-row sm:items-center">
            <Link to="/auth/signup" className="contents sm:block">
              <Button className="w-full px-6 py-3 text-base sm:w-auto">
                {t('landing.hero.cta')}
              </Button>
            </Link>
            <a href="#features" className="contents sm:block">
              <Button
                variant="secondary"
                className="w-full px-6 py-3 text-base sm:w-auto"
              >
                {t('landing.hero.secondary')}
              </Button>
            </a>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="h-3.5 w-3.5 text-brand-600"
              >
                <path
                  d="M5 12l4 4L19 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {t('landing.hero.noCard')}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="h-3.5 w-3.5 text-brand-600"
              >
                <path
                  d="M5 12l4 4L19 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {t('landing.hero.freeUsers')}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="h-3.5 w-3.5 text-brand-600"
              >
                <path
                  d="M5 12l4 4L19 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {t('landing.hero.cancelAny')}
            </span>
          </div>
        </div>

        <div className="relative mx-auto mt-16 max-w-5xl">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-brand-900/10">
            <div className="flex items-center gap-1.5 border-b border-slate-200 bg-slate-50 px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-brand-400" />
              <span className="ml-3 text-xs text-slate-500">
                app.worktracker.io / dashboard
              </span>
            </div>
            <div className="grid grid-cols-12 gap-3 p-3 sm:gap-4 sm:p-5">
              <aside className="col-span-3 hidden flex-col gap-1 md:flex">
                {[
                  'Dashboard',
                  'Team',
                  'Projects',
                  'Timesheets',
                  'Invoices',
                  'Reports',
                  'Settings',
                ].map((item, i) => (
                  <div
                    key={item}
                    className={`rounded-lg px-3 py-2 text-xs font-medium ${
                      i === 0 ? 'bg-brand-50 text-brand-800' : 'text-slate-500'
                    }`}
                  >
                    {item}
                  </div>
                ))}
              </aside>
              <main className="col-span-12 md:col-span-9">
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {[
                    { label: 'Hours this week', value: '412h', delta: '+8%' },
                    { label: 'Active projects', value: '23', delta: '+2' },
                    { label: 'Pending approvals', value: '7', delta: '−3' },
                  ].map((c) => (
                    <div
                      key={c.label}
                      className="rounded-xl border border-slate-200 bg-white p-2.5 sm:p-3"
                    >
                      <p className="text-[9px] uppercase tracking-wide text-slate-400 sm:text-[10px]">
                        {c.label}
                      </p>
                      <p className="mt-1 text-base font-semibold text-slate-900 sm:text-xl">
                        {c.value}
                      </p>
                      <p className="text-[10px] text-brand-600">{c.delta}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 h-40 rounded-xl border border-slate-200 bg-gradient-to-b from-brand-50 to-white p-3">
                  <div className="flex items-end gap-1.5">
                    {[45, 72, 58, 90, 65, 110, 82, 95, 70, 120, 88, 105].map(
                      (h, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-t bg-brand-500/80"
                          style={{ height: `${h}px` }}
                        />
                      ),
                    )}
                  </div>
                </div>
              </main>
            </div>
          </div>
          <div className="pointer-events-none absolute -bottom-10 left-1/2 -z-10 h-40 w-3/4 -translate-x-1/2 rounded-full bg-brand-400/20 blur-3xl" />
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white py-10">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <p className="text-center text-xs font-medium uppercase tracking-wider text-slate-400">
            {t('landing.trustedBy')}
          </p>
          <div className="mt-6 grid grid-cols-2 items-center gap-6 sm:grid-cols-3 lg:grid-cols-6">
            {logos.map((l) => (
              <div
                key={l}
                className="text-center text-lg font-semibold tracking-tight text-slate-400"
              >
                {l}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="features"
        className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24"
      >
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-700">
            Built for admins
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Everything you need to run a productive team.
          </h2>
          <p className="mt-4 text-base text-slate-600">
            WorkTracker bundles time tracking, project management, and billing
            into one admin-friendly workspace. No more stitching together five
            tools.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-lg hover:shadow-brand-900/5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-100">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  {f.icon}
                </svg>
              </div>
              <h3 className="mt-5 text-lg font-semibold text-slate-900">
                {f.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="how" className="bg-slate-50/60 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-700">
              How it works
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Up and running in three steps.
            </h2>
          </div>

          <div className="mt-12 grid gap-5 sm:mt-14 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {steps.map((s) => (
              <div
                key={s.num}
                className="relative rounded-2xl border border-slate-200 bg-white p-7"
              >
                <span className="text-4xl font-semibold tracking-tight text-brand-200">
                  {s.num}
                </span>
                <h3 className="mt-3 text-lg font-semibold text-slate-900">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="customers"
        className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24"
      >
        <figure className="mx-auto max-w-3xl text-center">
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="mx-auto h-8 w-8 text-brand-300"
            aria-hidden="true"
          >
            <path d="M9 7H5a2 2 0 00-2 2v4a2 2 0 002 2h2v4H3v2h8v-2H9v-8a2 2 0 00-2-2zm12 0h-4a2 2 0 00-2 2v4a2 2 0 002 2h2v4h-4v2h8v-2h-2v-8a2 2 0 00-2-2z" />
          </svg>
          <blockquote className="mt-6 text-xl font-medium leading-relaxed tracking-tight text-slate-900 sm:text-3xl">
            “We replaced three tools with WorkTracker. Our weekly payroll cycle
            dropped from 2 days to 40 minutes — and the team actually enjoys
            using it.”
          </blockquote>
          <figcaption className="mt-8 flex items-center justify-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-600 text-sm font-semibold text-white">
              MR
            </span>
            <div className="text-left">
              <p className="font-semibold text-slate-900">Maya Reyes</p>
              <p className="text-sm text-slate-500">
                Head of Operations · Helix Studio
              </p>
            </div>
          </figcaption>
        </figure>
      </section>

      <section
        id="pricing"
        className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 sm:pb-24"
      >
        <div className="overflow-hidden rounded-3xl bg-brand-700 text-white">
          <div className="relative grid items-center gap-6 p-6 sm:gap-8 sm:p-10 lg:grid-cols-2 lg:p-14">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute -top-20 -right-10 h-80 w-80 rounded-full bg-brand-400/30 blur-3xl" />
              <div className="absolute bottom-0 left-0 h-64 w-64 -translate-x-1/4 translate-y-1/4 rounded-full bg-brand-300/20 blur-3xl" />
            </div>
            <div className="relative">
              <h2 className="text-2xl font-semibold tracking-tight sm:text-4xl">
                Ready to give your admins their time back?
              </h2>
              <p className="mt-4 max-w-lg text-brand-50/90">
                Start your 14-day free trial today. No credit card, no lock-in —
                just a faster way to run your team.
              </p>
            </div>
            <div className="relative flex flex-col items-stretch gap-3 sm:flex-row sm:items-center lg:justify-end">
              <Link to="/auth/signup" className="contents sm:block">
                <Button
                  variant="secondary"
                  className="w-full bg-white px-6 py-3 text-base text-slate-900 hover:bg-slate-100 sm:w-auto"
                >
                  Start free trial
                </Button>
              </Link>
              <Link to="/auth/signin" className="contents sm:block">
                <Button
                  variant="ghost"
                  className="w-full px-6 py-3 text-base text-white hover:bg-white/10 sm:w-auto"
                >
                  I already have an account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  )
}
