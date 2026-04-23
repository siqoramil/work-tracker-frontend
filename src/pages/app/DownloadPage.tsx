import { useMemo } from 'react'
import Button from '@/components/ui/Button'
import { useAuthStore } from '@/stores/auth.store'

type Platform = 'mac' | 'windows' | 'linux'

const platforms: {
  id: Platform
  name: string
  fileHint: string
  size: string
  url: string
  icon: React.ReactNode
}[] = [
  {
    id: 'mac',
    name: 'macOS',
    fileHint: 'WorkTracker.dmg · Universal',
    size: '142 MB',
    url: '#',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7">
        <path d="M16.4 1.3c.1 1-.3 2-.9 2.7-.7.8-1.7 1.4-2.7 1.3-.1-1 .4-2 1-2.7.7-.8 1.8-1.3 2.6-1.3zm3.4 17.3c-.7 1-1.4 2-2.6 2-1.1 0-1.5-.7-2.8-.7-1.3 0-1.7.6-2.7.7-1.1.1-1.9-1.1-2.6-2-1.4-2-2.5-5.6-1-8.1.7-1.2 2-2 3.4-2 1.1 0 2.2.8 2.8.8.7 0 2-.9 3.4-.8.6 0 2.3.2 3.3 1.8-.1.1-2 1.2-2 3.5 0 2.8 2.4 3.7 2.5 3.7 0 .1-.4 1.3-1.7 3.1z" />
      </svg>
    ),
  },
  {
    id: 'windows',
    name: 'Windows',
    fileHint: 'WorkTracker-Setup.exe · x64',
    size: '138 MB',
    url: '#',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7">
        <path d="M3 5.5l8-1.1v8.1H3V5.5zm0 13l8 1.1v-8.1H3v7zm9 1.2L21.5 21V12.5H12v7.2zM12 3.9v8.1h9.5V2.5L12 3.9z" />
      </svg>
    ),
  },
  {
    id: 'linux',
    name: 'Linux',
    fileHint: 'WorkTracker.AppImage · x86_64',
    size: '146 MB',
    url: '#',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7">
        <path d="M12 2c-2.6 0-4.2 2.1-4.2 4.7 0 .9.3 1.9.6 2.7-1.5 1.1-2.7 3-3 5-.5 2.8.1 5.5 2.1 7.1 1.3 1.1 3.2 1.5 4.5 1.5s3.2-.4 4.5-1.5c2-1.6 2.6-4.3 2.1-7.1-.3-2-1.5-3.9-3-5 .3-.8.6-1.8.6-2.7C16.2 4.1 14.6 2 12 2zm-1.8 4.2c.4 0 .7.4.7 1s-.3 1-.7 1c-.4 0-.7-.4-.7-1s.3-1 .7-1zm3.6 0c.4 0 .7.4.7 1s-.3 1-.7 1c-.4 0-.7-.4-.7-1s.3-1 .7-1z" />
      </svg>
    ),
  },
]

function detectPlatform(): Platform {
  if (typeof navigator === 'undefined') return 'windows'
  const ua = navigator.userAgent.toLowerCase()
  if (ua.includes('mac')) return 'mac'
  if (ua.includes('win')) return 'windows'
  if (ua.includes('linux')) return 'linux'
  return 'windows'
}

export default function DownloadPage() {
  const user = useAuthStore((s) => s.user)
  const detected = useMemo(() => detectPlatform(), [])
  const primary = platforms.find((p) => p.id === detected)!

  return (
    <div>
      <div className="mb-8 sm:mb-10">
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700 ring-1 ring-inset ring-brand-100">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
            You’re signed in
          </span>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl md:text-4xl">
            Welcome, {user?.full_name || 'admin'} 👋
          </h1>
          <p className="mt-2 text-sm text-slate-600 sm:text-base">
            Let’s get you set up. Install the WorkTracker desktop app on every
            computer that should track time — it runs quietly in the background
            and syncs with your admin panel in real time.
          </p>
        </div>
      </div>

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
        <div className="grid items-center gap-5 p-5 sm:gap-6 sm:p-8 md:grid-cols-[1fr_auto] md:p-10">
          <div className="flex items-start gap-5">
            <div className="flex h-14 w-14 flex-none items-center justify-center rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-900/20">
              {primary.icon}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">
                Recommended for you
              </p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
                Download for {primary.name}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {primary.fileHint} · {primary.size}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-stretch gap-2 sm:flex-row">
            <a href={primary.url} download>
              <Button className="px-6 py-3 text-base">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" />
                </svg>
                Download now
              </Button>
            </a>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {platforms.map((p) => {
          const isPrimary = p.id === detected
          return (
            <div
              key={p.id}
              className={`flex flex-col rounded-2xl border bg-white p-6 transition ${
                isPrimary
                  ? 'border-brand-300 ring-1 ring-brand-200'
                  : 'border-slate-200 hover:border-brand-200 hover:shadow-md hover:shadow-brand-900/5'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white">
                  {p.icon}
                </div>
                {isPrimary && (
                  <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand-800">
                    Detected
                  </span>
                )}
              </div>
              <h3 className="mt-5 text-base font-semibold text-slate-900">
                {p.name}
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                {p.fileHint} · {p.size}
              </p>
              <a href={p.url} download className="mt-5">
                <Button variant="secondary" fullWidth>
                  Download for {p.name}
                </Button>
              </a>
            </div>
          )
        })}
      </section>

      <section className="mt-8 grid gap-5 sm:mt-10 sm:gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
          <h3 className="text-lg font-semibold text-slate-900">
            Installation steps
          </h3>
          <ol className="mt-5 space-y-5">
            {[
              {
                title: 'Download the installer',
                text: 'Pick the file for your operating system above.',
              },
              {
                title: 'Run and follow the prompts',
                text: 'The installer will walk you through setup in under a minute.',
              },
              {
                title: 'Sign in with this account',
                text: `Open the app and sign in as ${user?.email ?? 'your admin email'}.`,
              },
              {
                title: 'You’re done — tracking begins automatically',
                text: 'The app syncs silently with your admin panel whenever you’re online.',
              },
            ].map((s, i) => (
              <li key={s.title} className="flex gap-4">
                <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-800">
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {s.title}
                  </p>
                  <p className="mt-0.5 text-sm text-slate-600">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h4 className="text-sm font-semibold text-slate-900">
              Rolling out to your team?
            </h4>
            <p className="mt-1 text-sm text-slate-600">
              Share the install link with teammates. They’ll sign in with their
              own credentials and land in the right workspace automatically.
            </p>
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-2.5">
              <code className="flex-1 truncate text-xs text-slate-600">
                https://worktracker.io/download
              </code>
              <button
                type="button"
                onClick={() =>
                  navigator.clipboard?.writeText(
                    'https://worktracker.io/download',
                  )
                }
                className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-700"
              >
                Copy
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-brand-200 bg-brand-50 p-6">
            <h4 className="text-sm font-semibold text-brand-900">Need help?</h4>
            <p className="mt-1 text-sm text-brand-900/80">
              Read the setup guide or chat with support — most installations are
              live in under 3 minutes.
            </p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <a href="#">
                <Button variant="secondary" fullWidth>
                  Setup guide
                </Button>
              </a>
              <a href="#">
                <Button variant="ghost" fullWidth>
                  Contact support
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
