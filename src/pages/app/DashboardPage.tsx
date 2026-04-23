import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import Button from '@/components/ui/Button'
import { trackingApi, type ScreenshotResponse } from '@/services/tracking'
import { extractApiError } from '@/services/auth'
import { useAuthStore } from '@/stores/auth.store'

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

const PRESETS: { key: RangePreset; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: '7d', label: 'Last 7 days' },
  { key: '30d', label: 'Last 30 days' },
]

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user)
  const [preset, setPreset] = useState<RangePreset>('today')
  const [lightbox, setLightbox] = useState<ScreenshotResponse | null>(null)

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
    queryFn: () => trackingApi.listActivity(filters),
    enabled: !!user?.id,
  })

  const screenshotsQuery = useQuery({
    queryKey: ['dashboard-screenshots', filters],
    queryFn: () => trackingApi.listScreenshots(filters),
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
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-700">
            Dashboard
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            {user?.full_name
              ? `Welcome back, ${user.full_name.split(' ')[0]}`
              : 'Welcome back'}
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Your activity and screenshots captured by the desktop app.
          </p>
        </div>

        <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1">
          {PRESETS.map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => setPreset(p.key)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                preset === p.key
                  ? 'bg-brand-600 text-white'
                  : 'text-slate-600 hover:bg-slate-50'
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
          className="mb-5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700"
        >
          {extractApiError(error, 'Unable to load dashboard data')}
        </div>
      )}

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Keyboard events"
          value={totals.keyboard.toLocaleString()}
          icon={<KeyboardIcon />}
          tone="brand"
          loading={activityQuery.isLoading}
        />
        <StatCard
          label="Mouse events"
          value={totals.mouse.toLocaleString()}
          icon={<MouseIcon />}
          tone="violet"
          loading={activityQuery.isLoading}
        />
        <StatCard
          label="Avg. activity"
          value={`${avgActivity}%`}
          icon={<ActivityIcon />}
          tone="emerald"
          loading={activityQuery.isLoading}
        />
        <StatCard
          label="Screenshots"
          value={screenshots.length.toLocaleString()}
          icon={<CameraIcon />}
          tone="amber"
          loading={screenshotsQuery.isLoading}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
              <h3 className="text-sm font-semibold text-slate-900">
                Recent intervals
              </h3>
              <Link
                to="/app/activity"
                className="text-xs font-semibold text-brand-700 hover:text-brand-800"
              >
                View all →
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100 text-sm">
                <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-3">Interval</th>
                    <th className="px-5 py-3 text-right">Keyboard</th>
                    <th className="px-5 py-3 text-right">Mouse</th>
                    <th className="px-5 py-3 text-right">Activity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activityQuery.isLoading ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-5 py-10 text-center text-sm text-slate-500"
                      >
                        Loading…
                      </td>
                    </tr>
                  ) : activity.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-5 py-10 text-center text-sm text-slate-500"
                      >
                        No activity recorded for this range yet.
                      </td>
                    </tr>
                  ) : (
                    activity.slice(0, 10).map((r) => (
                      <tr key={r.id}>
                        <td className="px-5 py-3 text-slate-700">
                          {formatTime(r.interval_start)}
                          <span className="ml-1 text-xs text-slate-400">
                            {new Date(r.interval_start).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-right tabular-nums">
                          {r.keyboard_count}
                        </td>
                        <td className="px-5 py-3 text-right tabular-nums">
                          {r.mouse_count}
                        </td>
                        <td className="px-5 py-3 text-right">
                          <span className="inline-flex items-center gap-2">
                            <span className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
                              <span
                                className="block h-full bg-brand-500"
                                style={{
                                  width: `${Math.max(0, Math.min(100, r.activity_percent))}%`,
                                }}
                              />
                            </span>
                            <span className="w-10 text-right font-medium text-slate-700 tabular-nums">
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
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
              <h3 className="text-sm font-semibold text-slate-900">
                Latest screenshots
              </h3>
              <Link
                to="/app/screenshots"
                className="text-xs font-semibold text-brand-700 hover:text-brand-800"
              >
                View all →
              </Link>
            </div>
            <div className="p-3">
              {screenshotsQuery.isLoading ? (
                <p className="px-2 py-8 text-center text-sm text-slate-500">
                  Loading…
                </p>
              ) : recentScreenshots.length === 0 ? (
                <p className="px-2 py-8 text-center text-sm text-slate-500">
                  No screenshots yet.
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {recentScreenshots.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setLightbox(s)}
                      className="group overflow-hidden rounded-lg border border-slate-200 bg-slate-100 text-left transition hover:border-brand-200"
                    >
                      <div className="aspect-video">
                        <img
                          src={s.file_path}
                          alt={`Screenshot ${s.id}`}
                          loading="lazy"
                          className="h-full w-full object-cover transition group-hover:scale-[1.02]"
                          onError={(e) => {
                            ;(
                              e.currentTarget as HTMLImageElement
                            ).style.display = 'none'
                          }}
                        />
                      </div>
                      <p className="px-2 py-1.5 text-[11px] text-slate-500">
                        {formatTime(s.captured_at)}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-white p-5">
            <h4 className="text-sm font-semibold text-slate-900">
              Desktop app not installed?
            </h4>
            <p className="mt-1 text-xs text-slate-500">
              Download WorkTracker desktop to start tracking automatically.
            </p>
            <Link to="/app/download" className="mt-3 block">
              <Button variant="secondary" fullWidth>
                Download desktop app
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
            className="max-h-full max-w-5xl overflow-hidden rounded-2xl bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
              <p className="text-sm font-semibold text-slate-900">
                {formatDateTime(lightbox.captured_at)}
              </p>
              <button
                type="button"
                onClick={() => setLightbox(null)}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
                aria-label="Close"
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
            <img
              src={lightbox.file_path}
              alt={`Screenshot ${lightbox.id}`}
              className="max-h-[75vh] w-auto max-w-full"
            />
          </div>
        </div>
      )}
    </div>
  )
}

type Tone = 'brand' | 'violet' | 'emerald' | 'amber'
const toneMap: Record<Tone, { bg: string; text: string }> = {
  brand: { bg: 'bg-brand-50', text: 'text-brand-700' },
  violet: { bg: 'bg-violet-50', text: 'text-violet-700' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-700' },
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
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {label}
          </p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-slate-900">
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
