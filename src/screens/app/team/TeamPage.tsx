import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import Input from '@/shared/ui/Input'
import Button from '@/shared/ui/Button'
import { authApi } from '@/features/auth'
import { extractApiError } from '@/shared/lib/errors'

type InvitedUser = {
  id: string
  email: string
  full_name: string
}

export default function TeamPage() {
  const { t } = useTranslation()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [invited, setInvited] = useState<InvitedUser[]>([])

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    if (password.length < 8) {
      setError(t('team.tooShort'))
      return
    }

    setLoading(true)
    try {
      const user = await authApi.invite({
        email: email.trim(),
        full_name: fullName.trim(),
        password,
      })
      setInvited((prev) => [
        { id: user.id, email: user.email, full_name: user.full_name },
        ...prev,
      ])
      setFullName('')
      setEmail('')
      setPassword('')
    } catch (err) {
      setError(extractApiError(err, t('team.errorFallback')))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]">
      <section>
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-300">
            {t('team.kicker')}
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
            {t('team.title')}
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            {t('team.subtitle')}
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300"
          >
            {error}
          </div>
        )}

        <form
          onSubmit={onSubmit}
          className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
        >
          <Input
            label={t('team.fullName')}
            autoComplete="off"
            placeholder={t('team.fullNamePlaceholder')}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <Input
            label={t('team.workEmail')}
            type="email"
            autoComplete="off"
            placeholder={t('team.workEmailPlaceholder')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label={t('team.tempPassword')}
            type="password"
            autoComplete="new-password"
            placeholder={t('team.tempPasswordPlaceholder')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            hint={t('team.tempPasswordHint')}
          />
          <Button type="submit" loading={loading}>
            {t('team.send')}
          </Button>
        </form>
      </section>

      <aside className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          {t('team.recentlyInvited')}
        </h3>
        {invited.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            {t('team.recentlyInvitedEmpty')}
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
            {invited.map((u) => (
              <li key={u.id} className="flex items-center gap-3 py-3">
                <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-800 dark:bg-brand-500/15 dark:text-brand-200">
                  {u.full_name
                    .split(/\s+/)
                    .map((p) => p[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase() || 'U'}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {u.full_name}
                  </p>
                  <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                    {u.email}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </aside>
    </div>
  )
}
