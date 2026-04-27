import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '@/components/ui/Button'
import { useAuthStore } from '@/stores/auth.store'

type Platform = 'mac' | 'windows' | 'linux'

const AppleIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden>
    <path
      fill="#1d1d1f"
      d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09M12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25"
    />
  </svg>
)

const WindowsIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 88 88" className={className} aria-hidden>
    <rect x="0" y="0" width="40" height="40" fill="#F25022" />
    <rect x="48" y="0" width="40" height="40" fill="#7FBA00" />
    <rect x="0" y="48" width="40" height="40" fill="#00A4EF" />
    <rect x="48" y="48" width="40" height="40" fill="#FFB900" />
  </svg>
)

const LinuxIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 448 512" className={className} aria-hidden>
    <path
      fill="#1d1d1f"
      d="M220.8 123.3c1 .5 1.8 1.7 3 1.7 1.1 0 2.8-.4 2.9-1.5.2-1.4-1.9-2.3-3.2-2.9-1.7-.7-3.9-1-5.5-.1-.4.2-.8.7-.6 1.1.3 1.3 2.3 1.1 3.4 1.7zm-21.9 1.7c1.2 0 2-1.2 3-1.7 1.1-.6 3.1-.4 3.5-1.6.2-.4-.2-.9-.6-1.1-1.6-.9-3.8-.6-5.5.1-1.3.6-3.4 1.5-3.2 2.9.1 1 1.8 1.5 2.8 1.4zM420 403.8c-3.6-4-5.3-11.6-7.2-19.7-1.8-8.1-3.9-16.8-10.5-22.4-1.3-1.1-2.6-2.1-4-2.9-1.3-.8-2.7-1.5-4.1-2 9.2-27.3 5.6-54.5-3.7-79.1-11.4-30.1-31.3-56.4-46.5-74.4-17.1-21.5-33.7-41.9-33.4-72C311.1 85.4 315.7.1 234.8 0 132.4-.2 158 103.4 156.9 135.2c-1.7 23.4-6.4 41.8-22.5 64.7-18.9 22.5-45.5 58.8-58.1 96.7-6 17.9-8.8 36.1-6.2 53.3-6.5 5.8-11.4 14.7-16.6 20.2-4.2 4.3-10.3 5.9-17 8.3s-14 6-18.5 14.5c-2.1 3.9-2.8 8.1-2.8 12.4 0 3.9.6 7.9 1.2 11.8 1.2 8.1 2.5 15.7.8 20.8-5.2 14.4-5.9 24.4-2.2 31.7 3.8 7.3 11.4 10.5 20.1 12.3 17.3 3.6 40.8 2.7 59.3 12.5 19.8 10.4 39.9 14.1 55.9 10.4 11.6-2.6 21.1-9.6 25.9-20.2 12.5-.1 26.3-5.4 48.3-6.6 14.9-1.2 33.6 5.3 55.1 4.1.6 2.3 1.4 4.6 2.5 6.7v.1c8.3 16.7 23.8 24.3 40.3 23 16.6-1.3 34.1-11 48.3-27.9 13.6-16.4 36-23.2 50.9-32.2 7.4-4.5 13.4-10.1 13.9-18.3.4-8.2-4.4-17.3-15.5-29.7zM223.7 87.3c9.8-22.2 34.2-21.8 44-.4 6.5 14.2 3.6 30.9-4.3 40.4-1.6-.8-5.9-2.6-12.6-4.9 1.1-1.2 3.1-2.7 3.9-4.6 4.8-11.8-.2-27-9.1-27.3-7.3-.5-13.9 10.8-11.8 23-4.1-2-9.4-3.5-13-4.4-1-6.9-.3-14.6 2.9-21.8zM183 75.8c10.1 0 20.8 14.2 19.1 33.5-3.5 1-7.1 2.5-10.2 4.6 1.2-8.9-3.3-20.1-9.6-19.6-8.4.7-9.8 21.2-1.8 28.1 1 .8 1.9-.2-5.9 5.5-15.6-14.6-10.5-52.1 8.4-52.1zm-13.6 60.7c6.2-4.6 13.6-10 14.1-10.5 4.7-4.4 13.5-14.2 27.9-14.2 7.1 0 15.6 2.3 25.9 8.9 6.3 4.1 11.3 4.4 22.6 9.3 8.4 3.5 13.7 9.7 10.5 18.2-2.6 7.1-11 14.4-22.7 18.1-11.1 3.6-19.8 16-38.2 14.9-3.9-.2-7-1-9.6-2.1-8-3.5-12.2-10.4-20-15-8.6-4.8-13.2-10.4-14.7-15.3-1.4-4.9 0-9 4.2-12.3zm3.3 334c-2.7 35.1-43.9 34.4-75.3 18-29.9-15.8-68.6-6.5-76.5-21.9-2.4-4.7-2.4-12.7 2.6-26.4v-.2c2.4-7.6.6-16-.6-23.9-1.2-7.8-1.8-15 .9-20 3.5-6.7 8.5-9.1 14.8-11.3 10.3-3.7 11.8-3.4 19.6-9.9 5.5-5.7 9.5-12.9 14.3-18 5.1-5.5 10-8.1 17.7-6.9 8.1 1.2 15.1 6.8 21.9 16l19.6 35.6c9.5 19.9 43.1 48.4 41 68.9zm-1.4-25.9c-4.1-6.6-9.6-13.6-14.4-19.6 7.1 0 14.2-2.2 16.7-8.9 2.3-6.2 0-14.9-7.4-24.9-13.5-18.2-38.3-32.5-38.3-32.5-13.5-8.4-21.1-18.7-24.6-29.9s-3-23.3-.3-35.2c5.2-22.9 18.6-45.2 27.2-59.2 2.3-1.7.8 3.2-8.7 20.8-8.5 16.1-24.4 53.3-2.6 82.4.6-20.7 5.5-41.8 13.8-61.5 12-27.4 37.3-74.9 39.3-112.7 1.1.8 4.6 3.2 6.2 4.1 4.6 2.7 8.1 6.7 12.6 10.3 12.4 10 28.5 9.2 42.4 1.2 6.2-3.5 11.2-7.5 15.9-9 9.9-3.1 17.8-8.6 22.3-15 7.7 30.4 25.7 74.3 37.2 95.7 6.1 11.4 18.3 35.5 23.6 64.6 3.3-.1 7 .4 10.9 1.4 13.8-35.7-11.7-74.2-23.3-84.9-4.7-4.6-4.9-6.6-2.6-6.5 12.6 11.2 29.2 33.7 35.2 59 2.8 11.6 3.3 23.7.4 35.7 16.4 6.8 35.9 17.9 30.7 34.8-2.2-.1-3.2 0-4.2 0 3.2-10.1-3.9-17.6-22.8-26.1-19.6-8.6-36-8.6-38.3 12.5-12.1 4.2-18.3 14.7-21.4 27.3-2.8 11.2-3.6 24.7-4.4 39.9-.5 7.7-3.6 18-6.8 29-32.1 22.9-76.7 32.9-114.3 7.2zm257.4-11.5c-.9 16.8-41.2 19.9-63.2 46.5-13.2 15.7-29.4 24.4-43.6 25.5s-26.5-4.8-33.7-19.3c-4.7-11.1-2.4-23.1 1.1-36.3 3.7-14.2 9.2-28.8 9.9-40.6.8-15.2 1.7-28.5 4.2-38.7 2.6-10.3 6.6-17.2 13.7-21.1.3-.2.7-.3 1-.5.8 13.2 7.3 26.6 18.8 29.5 12.6 3.3 30.7-7.5 38.4-16.3 9-.3 15.7-.9 22.6 5.1 9.9 8.5 7.1 30.3 17.1 41.6 10.6 11.6 14 19.5 13.7 24.6zM173.3 148.7c2 1.9 4.7 4.5 8 7.1 6.6 5.2 15.8 10.6 27.3 10.6 11.6 0 22.5-5.9 31.8-10.8 4.9-2.6 10.9-7 14.8-10.4s5.9-6.3 3.1-6.6-2.6 2.6-6 5.1c-4.4 3.2-9.7 7.4-13.9 9.8-7.4 4.2-19.5 10.2-29.9 10.2s-18.7-4.8-24.9-9.7c-3.1-2.5-5.7-5-7.7-6.9-1.5-1.4-1.9-4.6-4.3-4.9-1.4-.1-1.8 3.7 1.7 6.5z"
    />
  </svg>
)

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
    icon: <AppleIcon className="h-7 w-7" />,
  },
  {
    id: 'windows',
    name: 'Windows',
    fileHint: 'WorkTracker-Setup.exe · x64',
    size: '138 MB',
    url: '#',
    icon: <WindowsIcon className="h-6 w-6" />,
  },
  {
    id: 'linux',
    name: 'Linux',
    fileHint: 'WorkTracker.AppImage · x86_64',
    size: '146 MB',
    url: '#',
    icon: <LinuxIcon className="h-7 w-7" />,
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
  const { t } = useTranslation()
  const user = useAuthStore((s) => s.user)
  const detected = useMemo(() => detectPlatform(), [])
  const primary = platforms.find((p) => p.id === detected)!

  return (
    <div>
      <div className="mb-6 sm:mb-8 md:mb-10">
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-medium text-brand-700 ring-1 ring-inset ring-brand-100 sm:text-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
            {t('download.signedInBadge')}
          </span>
          <h1 className="mt-2.5 text-xl font-semibold tracking-tight text-slate-900 sm:mt-3 sm:text-2xl md:text-3xl lg:text-4xl">
            {t('download.welcome', {
              name: user?.full_name || t('download.fallbackName'),
            })}
          </h1>
          <p className="mt-2 text-sm text-slate-600 md:text-base">
            {t('download.subtitle')}
          </p>
        </div>
      </div>

      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-white to-brand-50/40 shadow-sm">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-brand-500/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-brand-300/10 blur-3xl"
        />
        <div className="relative grid items-center gap-5 p-5 sm:gap-6 sm:p-7 lg:grid-cols-[1fr_auto] lg:gap-8 lg:p-10">
          <div className="flex items-start gap-4 sm:gap-5">
            <div className="flex h-14 w-14 flex-none items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-md shadow-slate-900/5 ring-1 ring-slate-50 sm:h-16 sm:w-16">
              {primary.icon}
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-700 sm:text-xs">
                {t('download.recommended')}
              </p>
              <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl lg:text-3xl">
                {t('download.downloadFor', { platform: primary.name })}
              </h2>
              <p className="mt-1 text-xs text-slate-500 sm:mt-1.5 sm:text-sm">
                {primary.fileHint} · {primary.size}
              </p>
            </div>
          </div>
          <div className="flex w-full lg:w-auto">
            <a
              href={primary.url}
              download
              className="group inline-flex w-full items-center justify-center gap-2.5 rounded-2xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/30 transition-all hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-xl hover:shadow-brand-600/40 active:translate-y-0 sm:px-7 sm:py-3.5 sm:text-base lg:w-auto"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 transition-transform group-hover:translate-y-0.5"
              >
                <path d="M12 3v13m0 0l-4.5-4.5M12 16l4.5-4.5M5 21h14" />
              </svg>
              <span>{t('download.downloadNow')}</span>
            </a>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {platforms.map((p) => {
          const isPrimary = p.id === detected
          return (
            <div
              key={p.id}
              className={`flex flex-col rounded-2xl border bg-white p-5 transition sm:p-6 ${
                isPrimary
                  ? 'border-brand-300 ring-1 ring-brand-200'
                  : 'border-slate-200 hover:border-brand-200 hover:shadow-md hover:shadow-brand-900/5'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm ring-1 ring-slate-50 sm:h-12 sm:w-12">
                  {p.icon}
                </div>
                {isPrimary && (
                  <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand-800">
                    {t('download.detected')}
                  </span>
                )}
              </div>
              <h3 className="mt-4 text-base font-semibold text-slate-900 sm:mt-5">
                {p.name}
              </h3>
              <p className="mt-1 truncate text-xs text-slate-500">
                {p.fileHint} · {p.size}
              </p>
              <a href={p.url} download className="mt-4 sm:mt-5">
                <Button variant="secondary" fullWidth>
                  <span className="truncate">
                    {t('download.downloadFor', { platform: p.name })}
                  </span>
                </Button>
              </a>
            </div>
          )
        })}
      </section>

      <section className="mt-6 grid gap-4 sm:mt-8 sm:gap-5 lg:grid-cols-[1.2fr_1fr] lg:gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 lg:p-7">
          <h3 className="text-base font-semibold text-slate-900 sm:text-lg">
            {t('download.installation.title')}
          </h3>
          <ol className="mt-4 space-y-4 sm:mt-5 sm:space-y-5">
            {[
              {
                title: t('download.installation.step1Title'),
                text: t('download.installation.step1Text'),
              },
              {
                title: t('download.installation.step2Title'),
                text: t('download.installation.step2Text'),
              },
              {
                title: t('download.installation.step3Title'),
                text: t('download.installation.step3Text', {
                  email:
                    user?.email ?? t('download.installation.step3Fallback'),
                }),
              },
              {
                title: t('download.installation.step4Title'),
                text: t('download.installation.step4Text'),
              },
            ].map((s, i) => (
              <li key={s.title} className="flex gap-3 sm:gap-4">
                <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-800">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900">
                    {s.title}
                  </p>
                  <p className="mt-0.5 text-sm text-slate-600">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <h4 className="text-sm font-semibold text-slate-900">
              {t('download.rollout.title')}
            </h4>
            <p className="mt-1 text-sm text-slate-600">
              {t('download.rollout.text')}
            </p>
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-2.5">
              <code className="min-w-0 flex-1 truncate text-xs text-slate-600">
                https://worktracker.io/download
              </code>
              <button
                type="button"
                onClick={() =>
                  navigator.clipboard?.writeText(
                    'https://worktracker.io/download',
                  )
                }
                className="shrink-0 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-700"
              >
                {t('download.rollout.copy')}
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-brand-200 bg-brand-50 p-5 sm:p-6">
            <h4 className="text-sm font-semibold text-brand-900">
              {t('download.help.title')}
            </h4>
            <p className="mt-1 text-sm text-brand-900/80">
              {t('download.help.text')}
            </p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <a href="#" className="flex-1">
                <Button variant="secondary" fullWidth>
                  {t('download.help.guide')}
                </Button>
              </a>
              <a href="#" className="flex-1">
                <Button variant="ghost" fullWidth>
                  {t('download.help.contact')}
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
