'use client'

import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import Input from '@/components/ui/Input'
import DateField from '@/components/ui/DateField'
import Button from '@/components/ui/Button'
import ImageWithSkeleton from '@/components/ui/ImageWithSkeleton'
import { trackingApi } from '@/services/tracking'
import type {
  ActivityLogResponse,
  ScreenshotResponse,
} from '@/services/tracking/tracking.type'
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

function findActivity(
  screenshot: ScreenshotResponse,
  logs: ActivityLogResponse[],
  intervalMs: number,
): ActivityLogResponse | undefined {
  const captured = new Date(screenshot.captured_at).getTime()
  let best: ActivityLogResponse | undefined
  let bestDelta = Infinity
  for (const log of logs) {
    if (log.user_id !== screenshot.user_id) continue
    const start = new Date(log.interval_start).getTime()
    const delta = captured - start
    if (delta < 0) continue
    if (delta <= intervalMs && delta < bestDelta) {
      best = log
      bestDelta = delta
    }
  }
  return best
}

function compactNumber(n: number): string {
  if (n >= 10_000) return `${(n / 1000).toFixed(n >= 100_000 ? 0 : 1)}k`
  return n.toLocaleString()
}

export default function ScreenshotsSection() {
  const { t } = useTranslation()
  const defaults = useMemo(() => computeDefaultRange(), [])

  const [draft, setDraft] = useState<Filters>({
    userId: '',
    dateFrom: defaults.weekAgo,
    dateTo: defaults.today,
  })
  const [applied, setApplied] = useState<Filters>(draft)
  const [lightbox, setLightbox] = useState<ScreenshotResponse | null>(null)

  const settingsQuery = useQuery({
    queryKey: ['tracking-settings'],
    queryFn: trackingApi.getSettings,
    staleTime: 5 * 60_000,
  })
  const intervalMinutes = settingsQuery.data?.activity_interval_minutes ?? 10
  const intervalMs = intervalMinutes * 60_000

  const screenshotsParams = {
    user_id: applied.userId.trim() || undefined,
    date_from: toIsoStart(applied.dateFrom),
    date_to: toIsoEnd(applied.dateTo),
  }

  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ['screenshots', applied],
    queryFn: () => trackingApi.listScreenshots(screenshotsParams),
  })

  const activityQuery = useQuery({
    queryKey: ['screenshots-activity', applied],
    queryFn: () => trackingApi.listActivity(screenshotsParams),
  })

  const rows = data ?? []
  const activityLogs = activityQuery.data ?? []

  const lightboxActivity = lightbox
    ? findActivity(lightbox, activityLogs, intervalMs)
    : undefined

  return (
    <div>
      <form
        className="mb-6 grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)_auto] lg:items-end"
        onSubmit={(e) => {
          e.preventDefault()
          setApplied(draft)
        }}
      >
        <div className="sm:col-span-2 lg:col-span-1">
          <Input
            label={t('screenshots.filters.userId')}
            placeholder={t('screenshots.filters.userIdPlaceholder')}
            value={draft.userId}
            onChange={(e) => setDraft({ ...draft, userId: e.target.value })}
          />
        </div>
        <DateField
          label={t('screenshots.filters.from')}
          value={draft.dateFrom}
          max={draft.dateTo || undefined}
          onChange={(v) => setDraft({ ...draft, dateFrom: v })}
        />
        <DateField
          label={t('screenshots.filters.to')}
          value={draft.dateTo}
          min={draft.dateFrom || undefined}
          onChange={(v) => setDraft({ ...draft, dateTo: v })}
        />
        <Button
          type="submit"
          loading={isFetching}
          className="sm:col-span-2 lg:col-span-1 w-full sm:w-auto"
        >
          {t('screenshots.filters.apply')}
        </Button>
      </form>

      {error && (
        <div
          role="alert"
          className="mb-5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300"
        >
          {extractApiError(error, t('screenshots.errorFallback'))}
        </div>
      )}

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
          {t('screenshots.loading')}
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
          {t('screenshots.empty')}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {rows.map((s) => {
            const activity = findActivity(s, activityLogs, intervalMs)
            return (
              <button
                type="button"
                key={s.id}
                onClick={() => setLightbox(s)}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white text-left transition hover:border-brand-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-brand-500/40 dark:hover:shadow-black/40"
              >
                <div className="relative aspect-video bg-slate-100 dark:bg-slate-800">
                  <ImageWithSkeleton
                    src={s.file_path}
                    alt={`Screenshot ${s.id}`}
                    loading="lazy"
                    className="h-full w-full object-cover transition group-hover:scale-[1.02]"
                  />
                </div>
                <div className="flex flex-col gap-2 p-3">
                  <div>
                    <p className="text-xs font-medium text-slate-700 dark:text-slate-200">
                      {formatDate(s.captured_at)}
                    </p>
                    <code className="mt-0.5 block truncate text-[11px] text-slate-400 dark:text-slate-500">
                      {s.user_id}
                    </code>
                  </div>
                  <ActivityChips
                    activity={activity}
                    activityLoading={activityQuery.isLoading}
                  />
                </div>
              </button>
            )
          })}
        </div>
      )}

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
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-3 dark:border-slate-800">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {formatDate(lightbox.captured_at)}
                </p>
                <code className="text-xs text-slate-500 dark:text-slate-400">
                  {lightbox.user_id}
                </code>
              </div>
              <div className="hidden sm:block">
                <ActivityChips
                  activity={lightboxActivity}
                  activityLoading={activityQuery.isLoading}
                  size="md"
                />
              </div>
              <button
                type="button"
                onClick={() => setLightbox(null)}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                aria-label={t('screenshots.close')}
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
            <div className="border-b border-slate-100 px-5 py-2 dark:border-slate-800 sm:hidden">
              <ActivityChips
                activity={lightboxActivity}
                activityLoading={activityQuery.isLoading}
                size="md"
              />
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

type ActivityChipsProps = {
  activity: ActivityLogResponse | undefined
  activityLoading: boolean
  size?: 'sm' | 'md'
}

function ActivityChips({
  activity,
  activityLoading,
  size = 'sm',
}: ActivityChipsProps) {
  const { t } = useTranslation()
  const padding = size === 'md' ? 'px-2.5 py-1' : 'px-2 py-0.5'
  const text = size === 'md' ? 'text-xs' : 'text-[11px]'
  const iconSize = size === 'md' ? 'h-3.5 w-3.5' : 'h-3 w-3'

  if (activityLoading && !activity) {
    return (
      <div className="flex items-center gap-1.5">
        <span
          className={`inline-flex animate-pulse items-center gap-1 rounded-full bg-slate-100 ${padding} ${text} font-medium text-slate-400 dark:bg-slate-800 dark:text-slate-500`}
        >
          ···
        </span>
        <span
          className={`inline-flex animate-pulse items-center gap-1 rounded-full bg-slate-100 ${padding} ${text} font-medium text-slate-400 dark:bg-slate-800 dark:text-slate-500`}
        >
          ···
        </span>
      </div>
    )
  }

  if (!activity) {
    return (
      <p className={`${text} text-slate-400 dark:text-slate-500`}>
        {t('screenshots.noActivity')}
      </p>
    )
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span
        title={t('screenshots.tracker.keyboard')}
        className={`inline-flex items-center gap-1 rounded-full bg-brand-50 ${padding} ${text} font-semibold text-brand-700 dark:bg-brand-500/15 dark:text-brand-200`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          className={iconSize}
          aria-hidden="true"
        >
          <rect x="3" y="6" width="18" height="12" rx="2" />
          <path
            d="M7 10h.01M11 10h.01M15 10h.01M7 14h10"
            strokeLinecap="round"
          />
        </svg>
        {compactNumber(activity.keyboard_count)}
      </span>
      <span
        title={t('screenshots.tracker.mouse')}
        className={`inline-flex items-center gap-1 rounded-full bg-violet-50 ${padding} ${text} font-semibold text-violet-700 dark:bg-violet-500/15 dark:text-violet-200`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          className={iconSize}
          aria-hidden="true"
        >
          <rect x="7" y="3" width="10" height="18" rx="5" />
          <path d="M12 7v4" strokeLinecap="round" />
        </svg>
        {compactNumber(activity.mouse_count)}
      </span>
      <span
        title={t('screenshots.tracker.activity')}
        className={`inline-flex items-center gap-1 rounded-full bg-emerald-50 ${padding} ${text} font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          className={iconSize}
          aria-hidden="true"
        >
          <path
            d="M3 12h4l3-8 4 16 3-8h4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {Math.round(activity.activity_percent)}%
      </span>
    </div>
  )
}
