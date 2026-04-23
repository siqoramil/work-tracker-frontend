import { useState, type FormEvent } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { trackingApi } from '@/services/tracking'
import { extractApiError } from '@/services/auth'

export default function SettingsPage() {
  const [formError, setFormError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const settingsQuery = useQuery({
    queryKey: ['tracking-settings'],
    queryFn: trackingApi.getSettings,
  })

  const updateMutation = useMutation({
    mutationFn: trackingApi.updateSettings,
    onSuccess: () => {
      setSuccess('Tracking settings saved.')
      setFormError(null)
      settingsQuery.refetch()
    },
    onError: (err) => {
      setFormError(extractApiError(err, 'Unable to update tracking settings'))
      setSuccess(null)
    },
  })

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormError(null)
    setSuccess(null)

    const formData = new FormData(e.currentTarget)
    const raw = String(formData.get('activity_interval_minutes') ?? '')
    const minutes = Number.parseInt(raw, 10)
    if (!Number.isFinite(minutes) || minutes < 1) {
      setFormError('Interval must be a positive number of minutes.')
      return
    }
    updateMutation.mutate({ activity_interval_minutes: minutes })
  }

  const loadError = settingsQuery.error
    ? extractApiError(settingsQuery.error, 'Unable to load tracking settings')
    : null
  const displayError = formError ?? loadError

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-700">
          Tracking
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Company settings
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          These settings apply to every teammate tracked by the desktop app.
        </p>
      </div>

      {displayError && (
        <div
          role="alert"
          className="mb-5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700"
        >
          {displayError}
        </div>
      )}
      {success && (
        <div
          role="status"
          className="mb-5 rounded-xl border border-brand-200 bg-brand-50 px-3.5 py-2.5 text-sm text-brand-800"
        >
          {success}
        </div>
      )}

      {settingsQuery.isPending ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
          Loading settings…
        </div>
      ) : (
        <form
          key={settingsQuery.data?.activity_interval_minutes}
          onSubmit={onSubmit}
          className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6"
        >
          <Input
            label="Activity interval (minutes)"
            name="activity_interval_minutes"
            type="number"
            min={1}
            max={120}
            defaultValue={settingsQuery.data?.activity_interval_minutes}
            required
            hint="How often desktop clients roll up keyboard & mouse counts into an activity log entry."
          />
          {settingsQuery.data?.company_id && (
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Company ID
              </p>
              <code className="mt-1 block truncate rounded-md bg-slate-50 px-2 py-1.5 text-xs text-slate-600">
                {settingsQuery.data.company_id}
              </code>
            </div>
          )}
          <Button type="submit" loading={updateMutation.isPending}>
            Save changes
          </Button>
        </form>
      )}
    </div>
  )
}
