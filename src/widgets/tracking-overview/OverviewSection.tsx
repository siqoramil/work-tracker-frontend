'use client'

import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import Button from '@/shared/ui/Button'
import ImageWithSkeleton from '@/shared/ui/ImageWithSkeleton'
import { activityApi, type Screenshot } from '@/entities/activity'
import { extractApiError } from '@/shared/lib/errors'
import { useAuthStore } from '@/features/auth'

type RangePreset = 'today' | '7d' | '30d'

function rangeFor(preset: RangePreset) {
  const today = new Date()
  const end = new Date(today)
  end.setHours(23, 59, 59, 999)
  const start = new Date(today)
  if (preset === 'today') start.setHours(0, 0, 0, 0)
  else if (preset === '7d') start.setDate(start.getDate() - 6)
  else start.setDate(start.getDate() - 29)
  start.setHours(0, 0, 0, 0)
  return { date_from: start.toISOString(), date_to: end.toISOString() }
}

function formatDateTime(iso: string) {
  try {
    return new Date(iso).toLocaleString()
  } catch {
    return iso
  }
}

function formatTime(iso: string) {
  try {
    return new Date(iso).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}

export default function OverviewSection() {
  const { t } = useTranslation()
  const user = useAuthStore((s) => s.user)
  const PRESETS: { key: RangePreset; label: string }[] = [
    { key: 'today', label: t('dashboard.presets.today') },
    { key: '7d', label: t('dashboard.presets.last7Days') },
    { key: '30d', label: t('dashboard.presets.last30Days') },
  ]
  const [preset, setPreset] = useState<RangePreset>('today')
  const [lightbox, setLightbox] = useState<Screenshot | null>(null)

  const range = useMemo(() => rangeFor(preset), [preset])
  const filters = useMemo(
    () => ({
      user_id: user?.id,
      date_from: range.date_from,
      date_to: range.date_to,
    }),
    [user?.id, range],
  )

  const activityQuery = useQuery({
    queryKey: ['dashboard-activity', filters],
    queryFn: () => activityApi.listActivity(filters),
    enabled: !!user?.id,
  })

  const screenshotsQuery = useQuery({
    queryKey: ['dashboard-screenshots', filters],
    queryFn: () => activityApi.listScreenshots(filters),
    enabled: !!user?.id,
  })

  const activity = activityQuery.data ?? []
  const screenshots = screenshotsQuery.data ?? []

  const totals = activity.reduce(
    (acc, r) => {
      acc.keyboard += r.keyboard_count
      acc.mouse += r.mouse_count
      acc.activitySum += r.activity_percent
      return acc
    },
    { keyboard: 0, mouse: 0, activitySum: 0 },
  )
  const avgActivity =
    activity.length > 0 ? Math.round(totals.activitySum / activity.length) : 0

  const recentScreenshots = screenshots.slice(0, 8)
  const error = activityQuery.error || screenshotsQuery.error

  return (
    <div>
      <div className="mb-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          {user?.full_name
            ? t('dashboard.welcomeName', {
                name: user.full_name.split(' ')[0],
              })
            : t('dashboard.welcome')}
        </h2>
        <div className="inline-flex w-full max-w-full overflow-x-auto rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-900 sm:w-auto">
          {PRESETS.map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => setPreset(p.key)}
              className={`shrink-0 whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                preset === p.key
                  ? 'bg-brand-600 text-white dark:bg-brand-500'
                  : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300"
        >
          {extractApiError(error, t('dashboard.errorFallback'))}
        </div>
      )}

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label={t('dashboard.stats.keyboardEvents')}
          value={totals.keyboard.toLocaleString()}
          icon={<KeyboardIcon />}
          tone="brand"
          loading={activityQuery.isLoading}
        />
        <StatCard
          label={t('dashboard.stats.mouseEvents')}
          value={totals.mouse.toLocaleString()}
          icon={<MouseIcon />}
          tone="violet"
          loading={activityQuery.isLoading}
        />
        <StatCard
          label={t('dashboard.stats.avgActivity')}
          value={`${avgActivity}%`}
          icon={<ActivityIcon />}
          tone="emerald"
          loading={activityQuery.isLoading}
        />
        <StatCard
          label={t('dashboard.stats.screenshots')}
          value={screenshots.length.toLocaleString()}
          icon={<CameraIcon />}
          tone="amber"
          loading={screenshotsQuery.isLoading}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3 dark:border-slate-800">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {t('dashboard.recentIntervals')}
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100 text-sm dark:divide-slate-800">
                <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-900/60 dark:text-slate-400">
                  <tr>
                    <th className="px-5 py-3">
                      {t('dashboard.table.interval')}
                    </th>
                    <th className="px-5 py-3 text-right">
                      {t('dashboard.table.keyboard')}
                    </th>
                    <th className="px-5 py-3 text-right">
                      {t('dashboard.table.mouse')}
                    </th>
                    <th className="px-5 py-3 text-right">
                      {t('dashboard.table.activity')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {activityQuery.isLoading ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-5 py-10 text-center text-sm text-slate-500 dark:text-slate-400"
                      >
                        {t('dashboard.table.loading')}
                      </td>
                    </tr>
                  ) : activity.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-5 py-10 text-center text-sm text-slate-500 dark:text-slate-400"
                      >
                        {t('dashboard.table.empty')}
                      </td>
                    </tr>
                  ) : (
                    activity.slice(0, 10).map((r) => (
                      <tr key={r.id}>
                        <td className="px-5 py-3 text-slate-700 dark:text-slate-300">
                          {formatTime(r.interval_start)}
                          <span className="ml-1 text-xs text-slate-400 dark:text-slate-500">
                            {new Date(r.interval_start).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-right tabular-nums dark:text-slate-300">
                          {r.keyboard_count}
                        </td>
                        <td className="px-5 py-3 text-right tabular-nums dark:text-slate-300">
                          {r.mouse_count}
                        </td>
                        <td className="px-5 py-3 text-right">
                          <span className="inline-flex items-center gap-2">
                            <span className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                              <span
                                className="block h-full bg-brand-500"
                                style={{
                                  width: `${Math.max(0, Math.min(100, r.activity_percent))}%`,
                                }}
                              />
                            </span>
                            <span className="w-10 text-right font-medium text-slate-700 tabular-nums dark:text-slate-200">
                              {Math.round(r.activity_percent)}%
                            </span>
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3 dark:border-slate-800">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {t('dashboard.latestScreenshots')}
              </h3>
            </div>
            <div className="p-3">
              {screenshotsQuery.isLoading ? (
                <p className="px-2 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                  {t('dashboard.table.loading')}
                </p>
              ) : recentScreenshots.length === 0 ? (
                <p className="px-2 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                  {t('dashboard.noScreenshots')}
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {recentScreenshots.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setLightbox(s)}
                      className="group overflow-hidden rounded-lg border border-slate-200 bg-slate-100 text-left transition hover:border-brand-200 dark:border-slate-800 dark:bg-slate-800 dark:hover:border-brand-500/40"
                    >
                      <div className="relative aspect-video">
                        <ImageWithSkeleton
                          src={s.file_path}
                          alt={`Screenshot ${s.id}`}
                          loading="lazy"
                          className="h-full w-full object-cover transition group-hover:scale-[1.02]"
                        />
                      </div>
                      <p className="px-2 py-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                        {formatTime(s.captured_at)}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {t('dashboard.desktopNotInstalled')}
            </h4>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {t('dashboard.desktopHint')}
            </p>
            <Link to="/app/download" className="mt-3 block">
              <Button variant="secondary" fullWidth>
                {t('dashboard.downloadDesktop')}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/80 p-6"
          onClick={() => setLightbox(null)}
        >
          <div
            className="max-h-full max-w-5xl overflow-hidden rounded-2xl bg-white dark:bg-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3 dark:border-slate-800">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {formatDateTime(lightbox.captured_at)}
              </p>
              <button
                type="button"
                onClick={() => setLightbox(null)}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                aria-label={t('dashboard.close')}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="h-5 w-5"
                >
                  <path
                    d="M6 6l12 12M6 18L18 6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            <div className="relative flex min-h-[300px] items-center justify-center bg-slate-50 dark:bg-slate-950">
              <ImageWithSkeleton
                src={lightbox.file_path}
                alt={`Screenshot ${lightbox.id}`}
                className="max-h-[75vh] w-auto max-w-full"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

type Tone = 'brand' | 'violet' | 'emerald' | 'amber'
const toneMap: Record<Tone, { bg: string; text: string }> = {
  brand: {
    bg: 'bg-brand-50 dark:bg-brand-500/15',
    text: 'text-brand-700 dark:text-brand-300',
  },
  violet: {
    bg: 'bg-violet-50 dark:bg-violet-500/15',
    text: 'text-violet-700 dark:text-violet-300',
  },
  emerald: {
    bg: 'bg-emerald-50 dark:bg-emerald-500/15',
    text: 'text-emerald-700 dark:text-emerald-300',
  },
  amber: {
    bg: 'bg-amber-50 dark:bg-amber-500/15',
    text: 'text-amber-700 dark:text-amber-300',
  },
}

function StatCard({
  label,
  value,
  icon,
  tone,
  loading,
}: {
  label: string
  value: string
  icon: React.ReactNode
  tone: Tone
  loading?: boolean
}) {
  const c = toneMap[tone]
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {label}
          </p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-slate-900 dark:text-slate-100">
            {loading ? '—' : value}
          </p>
        </div>
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-xl ${c.bg} ${c.text}`}
        >
          {icon}
        </span>
      </div>
    </div>
  )
}

function KeyboardIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      className="h-4 w-4"
      aria-hidden="true"
    >
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M7 10h.01M11 10h.01M15 10h.01M7 14h10" strokeLinecap="round" />
    </svg>
  )
}

function MouseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      className="h-4 w-4"
      aria-hidden="true"
    >
      <rect x="7" y="3" width="10" height="18" rx="5" />
      <path d="M12 7v4" strokeLinecap="round" />
    </svg>
  )
}

function ActivityIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        d="M3 12h4l3-8 4 16 3-8h4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CameraIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M4 8h4l2-3h4l2 3h4v11H4z" strokeLinejoin="round" />
      <circle cx="12" cy="13" r="3.5" />
    </svg>
  )
}
