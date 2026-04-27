import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import Input from '@/components/ui/Input'
import DateField from '@/components/ui/DateField'
import Button from '@/components/ui/Button'
import { trackingApi, type ScreenshotResponse } from '@/services/tracking'
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

export default function ScreenshotsPage() {
  const { t } = useTranslation()
  const defaults = useMemo(() => computeDefaultRange(), [])

  const [draft, setDraft] = useState<Filters>({
    userId: '',
    dateFrom: defaults.weekAgo,
    dateTo: defaults.today,
  })
  const [applied, setApplied] = useState<Filters>(draft)
  const [lightbox, setLightbox] = useState<ScreenshotResponse | null>(null)

  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ['screenshots', applied],
    queryFn: () =>
      trackingApi.listScreenshots({
        user_id: applied.userId.trim() || undefined,
        date_from: toIsoStart(applied.dateFrom),
        date_to: toIsoEnd(applied.dateTo),
      }),
  })

  const rows = data ?? []

  return (
    <div>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-700">
          {t('screenshots.kicker')}
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          {t('screenshots.title')}
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          {t('screenshots.subtitle')}
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
          className="mb-5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700"
        >
          {extractApiError(error, t('screenshots.errorFallback'))}
        </div>
      )}

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
          {t('screenshots.loading')}
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
          {t('screenshots.empty')}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {rows.map((s) => (
            <button
              type="button"
              key={s.id}
              onClick={() => setLightbox(s)}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white text-left transition hover:border-brand-200 hover:shadow-md"
            >
              <div className="aspect-video bg-slate-100">
                <img
                  src={s.file_path}
                  alt={`Screenshot ${s.id}`}
                  loading="lazy"
                  className="h-full w-full object-cover transition group-hover:scale-[1.02]"
                  onError={(e) => {
                    ;(e.currentTarget as HTMLImageElement).style.display =
                      'none'
                  }}
                />
              </div>
              <div className="p-3">
                <p className="text-xs text-slate-500">
                  {formatDate(s.captured_at)}
                </p>
                <code className="mt-1 block truncate text-[11px] text-slate-400">
                  {s.user_id}
                </code>
              </div>
            </button>
          ))}
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
            className="max-h-full max-w-5xl overflow-hidden rounded-2xl bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {formatDate(lightbox.captured_at)}
                </p>
                <code className="text-xs text-slate-500">
                  {lightbox.user_id}
                </code>
              </div>
              <button
                type="button"
                onClick={() => setLightbox(null)}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
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
