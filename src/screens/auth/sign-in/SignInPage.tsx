import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Input from '@/shared/ui/Input'
import Button from '@/shared/ui/Button'
import { useAuthStore } from '@/features/auth'
import { extractApiError } from '@/shared/lib/errors'

type LocationState = { from?: { pathname?: string } } | null

export default function SignInPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const signIn = useAuthStore((s) => s.signIn)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await signIn({ email: email.trim(), password })
      const state = location.state as LocationState
      const redirectTo = state?.from?.pathname ?? '/app/activity'
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(extractApiError(err, t('auth.signIn.errorFallback')))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <span className="inline-flex items-center rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700 ring-1 ring-inset ring-brand-100 dark:bg-brand-500/15 dark:text-brand-200 dark:ring-brand-500/30">
          {t('auth.signIn.badge')}
        </span>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          {t('auth.signIn.title')}
        </h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {t('auth.signIn.subtitle')}
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

      <form onSubmit={onSubmit} className="space-y-5">
        <Input
          label={t('auth.signIn.email')}
          type="email"
          autoComplete="email"
          placeholder={t('auth.signIn.emailPlaceholder')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          leadingIcon={
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              className="h-4 w-4"
              aria-hidden="true"
            >
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="M3 7l9 6 9-6" />
            </svg>
          }
        />
        <Input
          label={t('auth.signIn.password')}
          type="password"
          autoComplete="current-password"
          placeholder={t('auth.signIn.passwordPlaceholder')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          leadingIcon={
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              className="h-4 w-4"
              aria-hidden="true"
            >
              <rect x="4" y="10" width="16" height="10" rx="2" />
              <path d="M8 10V7a4 4 0 118 0v3" />
            </svg>
          }
        />

        <div className="flex items-center justify-between text-sm">
          <label className="inline-flex cursor-pointer items-center gap-2 text-slate-600 dark:text-slate-300">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 dark:border-slate-600 dark:bg-slate-800"
            />
            {t('auth.signIn.rememberMe')}
          </label>
          <Link
            to="/auth/reset-password"
            className="font-medium text-brand-700 hover:text-brand-800 dark:text-brand-300 dark:hover:text-brand-200"
          >
            {t('auth.signIn.forgotPassword')}
          </Link>
        </div>

        <Button type="submit" fullWidth loading={loading}>
          {t('auth.signIn.submit')}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
        {t('auth.signIn.noAccount')}{' '}
        <Link
          to="/auth/signup"
          className="font-semibold text-brand-700 hover:text-brand-800 dark:text-brand-300 dark:hover:text-brand-200"
        >
          {t('auth.signIn.createOne')}
        </Link>
      </p>
    </div>
  )
}
