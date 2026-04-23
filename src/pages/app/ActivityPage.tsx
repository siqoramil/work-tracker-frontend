import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { trackingApi } from '@/services/tracking'
import { extractApiError } from '@/services/auth'

function toIsoStart(date: string) {
  return date ? `${date}T00:00:00Z` : undefined
}
function toIsoEnd(date: string) {
  return date ? `${date}T23:59:59Z` : undefined
}
function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString()
  } catch {
    return iso
  }
}

function computeDefaultRange() {
  const today = new Date().toISOString().slice(0, 10)
  const weekAgo = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10)
  return { today, weekAgo }
}

type Filters = {
  userId: string
  dateFrom: string
  dateTo: string
}

export default function ActivityPage() {
  const defaults = useMemo(() => computeDefaultRange(), [])

  const [draft, setDraft] = useState<Filters>({
    userId: '',
    dateFrom: defaults.weekAgo,
    dateTo: defaults.today,
  })
  const [applied, setApplied] = useState<Filters>(draft)

  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ['activity', applied],
    queryFn: () =>
      trackingApi.listActivity({
        user_id: applied.userId.trim() || undefined,
        date_from: toIsoStart(applied.dateFrom),
        date_to: toIsoEnd(applied.dateTo),
      }),
  })

  const rows = data ?? []

  const totals = rows.reduce(
    (acc, r) => {
      acc.keyboard += r.keyboard_count
      acc.mouse += r.mouse_count
      acc.activitySum += r.activity_percent
      return acc
    },
    { keyboard: 0, mouse: 0, activitySum: 0 },
  )
  const avgActivity =
    rows.length > 0 ? Math.round(totals.activitySum / rows.length) : 0

  return (
    <div>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-700">
          Tracking
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Activity logs
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Review keyboard and mouse activity captured by the desktop app.
        </p>
      </div>

      <form
        className="mb-6 grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)_auto] lg:items-end"
        onSubmit={(e) => {
          e.preventDefault()
          setApplied(draft)
        }}
      >
        <div className="sm:col-span-2 lg:col-span-1">
          <Input
            label="User ID (optional)"
            placeholder="Leave blank for all users"
            value={draft.userId}
            onChange={(e) => setDraft({ ...draft, userId: e.target.value })}
          />
        </div>
        <Input
          label="From"
          type="date"
          value={draft.dateFrom}
          onChange={(e) => setDraft({ ...draft, dateFrom: e.target.value })}
        />
        <Input
          label="To"
          type="date"
          value={draft.dateTo}
          onChange={(e) => setDraft({ ...draft, dateTo: e.target.value })}
        />
        <Button type="submit" loading={isFetching} className="sm:col-span-2 lg:col-span-1 w-full sm:w-auto">
          Apply
        </Button>
      </form>

      {error && (
        <div
          role="alert"
          className="mb-5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700"
        >
          {extractApiError(error, 'Unable to load activity logs')}
        </div>
      )}

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        {[
          { label: 'Entries', value: rows.length.toString() },
          { label: 'Keyboard events', value: totals.keyboard.toLocaleString() },
          { label: 'Mouse events', value: totals.mouse.toLocaleString() },
        ].map((c) => (
          <div
            key={c.label}
            className="rounded-2xl border border-slate-200 bg-white p-4"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              {c.label}
            </p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">
              {c.value}
            </p>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
          <h3 className="text-sm font-semibold text-slate-900">Entries</h3>
          <span className="text-xs text-slate-500">
            Avg. activity{' '}
            <span className="font-semibold text-slate-900">{avgActivity}%</span>
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3">Interval start</th>
                <th className="px-5 py-3">User</th>
                <th className="px-5 py-3 text-right">Keyboard</th>
                <th className="px-5 py-3 text-right">Mouse</th>
                <th className="px-5 py-3 text-right">Activity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-10 text-center text-sm text-slate-500"
                  >
                    Loading…
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-10 text-center text-sm text-slate-500"
                  >
                    No activity found for the selected filters.
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.id}>
                    <td className="px-5 py-3 text-slate-700">
                      {formatDate(r.interval_start)}
                    </td>
                    <td className="px-5 py-3">
                      <code className="text-xs text-slate-500">
                        {r.user_id.slice(0, 8)}…
                      </code>
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
  )
}
