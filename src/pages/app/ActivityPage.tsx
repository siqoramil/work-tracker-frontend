import { useEffect, useMemo, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { trackingApi } from '@/services/tracking'
import { extractApiError } from '@/services/auth'

const PAGE_SIZE = 25

function toIsoStart(date: string) {
  return date ? `${date}T00:00:00Z` : undefined
}
function toIsoEnd(date: string) {
  return date ? `${date}T23:59:59Z` : undefined
}
function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      timeZoneName: 'short',
    })
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

type SortKey =
  | 'interval_start'
  | 'user_id'
  | 'keyboard_count'
  | 'mouse_count'
  | 'activity_percent'
type SortDir = 'asc' | 'desc'

function SortableHeader({
  label,
  sortKey,
  sortBy,
  sortDir,
  onClick,
  align = 'left',
}: {
  label: string
  sortKey: SortKey
  sortBy: SortKey
  sortDir: SortDir
  onClick: (key: SortKey) => void
  align?: 'left' | 'right'
}) {
  const active = sortBy === sortKey
  const arrow = active ? (sortDir === 'asc' ? '↑' : '↓') : '↕'
  return (
    <th className={`px-5 py-3 ${align === 'right' ? 'text-right' : ''}`}>
      <button
        type="button"
        onClick={() => onClick(sortKey)}
        className={`inline-flex items-center gap-1 uppercase tracking-wide transition hover:text-slate-700 ${
          active ? 'text-slate-900' : 'text-slate-500'
        } ${align === 'right' ? 'flex-row-reverse' : ''}`}
      >
        <span>{label}</span>
        <span
          className={`text-[10px] ${active ? 'opacity-100' : 'opacity-40'}`}
          aria-hidden
        >
          {arrow}
        </span>
      </button>
    </th>
  )
}

export default function ActivityPage() {
  const { t } = useTranslation()
  const defaults = useMemo(() => computeDefaultRange(), [])

  const [draft, setDraft] = useState<Filters>({
    userId: '',
    dateFrom: defaults.weekAgo,
    dateTo: defaults.today,
  })
  const [applied, setApplied] = useState<Filters>(draft)
  const [sortBy, setSortBy] = useState<SortKey>('interval_start')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const sentinelRef = useRef<HTMLTableRowElement | null>(null)

  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ['activity', applied],
    queryFn: () =>
      trackingApi.listActivity({
        user_id: applied.userId.trim() || undefined,
        date_from: toIsoStart(applied.dateFrom),
        date_to: toIsoEnd(applied.dateTo),
      }),
  })

  const rows = useMemo(() => data ?? [], [data])

  const totals = useMemo(
    () =>
      rows.reduce(
        (acc, r) => {
          acc.keyboard += r.keyboard_count
          acc.mouse += r.mouse_count
          acc.activitySum += r.activity_percent
          return acc
        },
        { keyboard: 0, mouse: 0, activitySum: 0 },
      ),
    [rows],
  )
  const avgActivity =
    rows.length > 0 ? Math.round(totals.activitySum / rows.length) : 0

  const sortedRows = useMemo(() => {
    const copy = [...rows]
    copy.sort((a, b) => {
      let cmp = 0
      if (sortBy === 'interval_start') {
        cmp =
          new Date(a.interval_start).getTime() -
          new Date(b.interval_start).getTime()
      } else if (sortBy === 'user_id') {
        cmp = a.user_id.localeCompare(b.user_id)
      } else {
        cmp = (a[sortBy] as number) - (b[sortBy] as number)
      }
      return sortDir === 'asc' ? cmp : -cmp
    })
    return copy
  }, [rows, sortBy, sortDir])

  function toggleSort(key: SortKey) {
    setVisibleCount(PAGE_SIZE)
    if (sortBy === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(key)
      setSortDir(
        key === 'interval_start' ||
          key === 'keyboard_count' ||
          key === 'mouse_count' ||
          key === 'activity_percent'
          ? 'desc'
          : 'asc',
      )
    }
  }

  // Load more rows when sentinel is intersected.
  useEffect(() => {
    const node = sentinelRef.current
    if (!node) return
    if (visibleCount >= sortedRows.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((c) => Math.min(c + PAGE_SIZE, sortedRows.length))
        }
      },
      { rootMargin: '120px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [visibleCount, sortedRows.length])

  const visibleRows = sortedRows.slice(0, visibleCount)
  const hasMore = visibleCount < sortedRows.length

  const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone

  return (
    <div>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-700">
          {t('activity.kicker')}
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          {t('activity.title')}
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          {t('activity.subtitle')}
        </p>
      </div>

      <form
        className="mb-6 grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)_auto] lg:items-end"
        onSubmit={(e) => {
          e.preventDefault()
          setApplied(draft)
          setVisibleCount(PAGE_SIZE)
        }}
      >
        <div className="sm:col-span-2 lg:col-span-1">
          <Input
            label={t('activity.filters.userId')}
            placeholder={t('activity.filters.userIdPlaceholder')}
            value={draft.userId}
            onChange={(e) => setDraft({ ...draft, userId: e.target.value })}
          />
        </div>
        <Input
          label={t('activity.filters.from')}
          type="date"
          value={draft.dateFrom}
          onChange={(e) => setDraft({ ...draft, dateFrom: e.target.value })}
        />
        <Input
          label={t('activity.filters.to')}
          type="date"
          value={draft.dateTo}
          onChange={(e) => setDraft({ ...draft, dateTo: e.target.value })}
        />
        <Button
          type="submit"
          loading={isFetching}
          className="sm:col-span-2 lg:col-span-1 w-full sm:w-auto"
        >
          {t('activity.filters.apply')}
        </Button>
      </form>

      {error && (
        <div
          role="alert"
          className="mb-5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700"
        >
          {extractApiError(error, t('activity.errorFallback'))}
        </div>
      )}

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        {[
          { label: t('activity.stats.entries'), value: rows.length.toString() },
          { label: t('activity.stats.keyboardEvents'), value: totals.keyboard.toLocaleString() },
          { label: t('activity.stats.mouseEvents'), value: totals.mouse.toLocaleString() },
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
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-5 py-3">
          <div className="flex flex-col">
            <h3 className="text-sm font-semibold text-slate-900">{t('activity.table.entries')}</h3>
            <span className="text-[11px] text-slate-400">
              {t('activity.table.timezoneNote', { tz: localTz })}
            </span>
          </div>
          <span className="text-xs text-slate-500">
            {t('activity.table.showing')}{' '}
            <span className="font-semibold text-slate-900">
              {visibleRows.length}
            </span>{' '}
            {t('activity.table.of')}{' '}
            <span className="font-semibold text-slate-900">
              {sortedRows.length}
            </span>{' '}
            · {t('activity.table.avgActivity')}{' '}
            <span className="font-semibold text-slate-900">{avgActivity}%</span>
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="w-12 px-5 py-3 text-right">#</th>
                <SortableHeader
                  label={t('activity.table.intervalStart')}
                  sortKey="interval_start"
                  sortBy={sortBy}
                  sortDir={sortDir}
                  onClick={toggleSort}
                />
                <SortableHeader
                  label={t('activity.table.user')}
                  sortKey="user_id"
                  sortBy={sortBy}
                  sortDir={sortDir}
                  onClick={toggleSort}
                />
                <SortableHeader
                  label={t('activity.table.keyboard')}
                  sortKey="keyboard_count"
                  sortBy={sortBy}
                  sortDir={sortDir}
                  onClick={toggleSort}
                  align="right"
                />
                <SortableHeader
                  label={t('activity.table.mouse')}
                  sortKey="mouse_count"
                  sortBy={sortBy}
                  sortDir={sortDir}
                  onClick={toggleSort}
                  align="right"
                />
                <SortableHeader
                  label={t('activity.table.activity')}
                  sortKey="activity_percent"
                  sortBy={sortBy}
                  sortDir={sortDir}
                  onClick={toggleSort}
                  align="right"
                />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-10 text-center text-sm text-slate-500"
                  >
                    {t('activity.table.loading')}
                  </td>
                </tr>
              ) : sortedRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-10 text-center text-sm text-slate-500"
                  >
                    {t('activity.empty')}
                  </td>
                </tr>
              ) : (
                <>
                  {visibleRows.map((r, idx) => (
                    <tr key={r.id}>
                      <td className="px-5 py-3 text-right text-xs text-slate-400 tabular-nums">
                        {idx + 1}
                      </td>
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
                  ))}
                  {hasMore && (
                    <tr ref={sentinelRef}>
                      <td
                        colSpan={6}
                        className="px-5 py-6 text-center text-xs text-slate-400"
                      >
                        <span className="inline-flex items-center gap-2">
                          <span className="h-3 w-3 animate-spin rounded-full border-2 border-slate-200 border-t-brand-500" />
                          {t('activity.table.loadingMore')}
                        </span>
                      </td>
                    </tr>
                  )}
                  {!hasMore && sortedRows.length > PAGE_SIZE && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-5 py-4 text-center text-xs text-slate-400"
                      >
                        {t('activity.table.endOfResults', { count: sortedRows.length })}
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
