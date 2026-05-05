import { useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useAuthStore } from '@/stores/auth.store'
import { extractApiError } from '@/services/auth'

function scorePassword(password: string) {
  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  return score
}

const strengthColors = [
  'bg-slate-200 dark:bg-slate-700',
  'bg-red-400',
  'bg-amber-400',
  'bg-brand-400',
  'bg-brand-600',
]

export default function SignUpPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const signUp = useAuthStore((s) => s.signUp)

  const [fullName, setFullName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const strength = useMemo(() => scorePassword(password), [password])

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!agreed) return
    setError(null)
    setLoading(true)
    try {
      const trimmedEmail = email.trim()
      await signUp({
        full_name: fullName.trim(),
        company_name: companyName.trim(),
        email: trimmedEmail,
        password,
      })
      navigate(`/auth/verify-email?email=${encodeURIComponent(trimmedEmail)}`, {
        replace: true,
      })
    } catch (err) {
      setError(extractApiError(err, t('auth.signUp.errorFallback')))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <span className="inline-flex items-center rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700 ring-1 ring-inset ring-brand-100 dark:bg-brand-500/15 dark:text-brand-200 dark:ring-brand-500/30">
          {t('auth.signUp.badge')}
        </span>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          {t('auth.signUp.title')}
        </h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {t('auth.signUp.subtitle')}
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
        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            label={t('auth.signUp.fullName')}
            autoComplete="name"
            placeholder={t('auth.signUp.fullNamePlaceholder')}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
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
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21a8 8 0 0116 0" />
              </svg>
            }
          />
          <Input
            label={t('auth.signUp.company')}
            autoComplete="organization"
            placeholder={t('auth.signUp.companyPlaceholder')}
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
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
                <path d="M3 21V7l9-4 9 4v14M9 21v-8h6v8" />
              </svg>
            }
          />
        </div>
        <Input
          label={t('auth.signUp.workEmail')}
          type="email"
          autoComplete="email"
          placeholder={t('auth.signUp.workEmailPlaceholder')}
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
        <div>
          <Input
            label={t('auth.signUp.password')}
            type="password"
            autoComplete="new-password"
            placeholder={t('auth.signUp.passwordPlaceholder')}
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
          <div className="mt-2 flex gap-1.5">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className={`h-1.5 flex-1 rounded-full transition ${
                  i < strength
                    ? strengthColors[strength]
                    : 'bg-slate-200 dark:bg-slate-700'
                }`}
              />
            ))}
          </div>
          <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
            {t('auth.signUp.strength')}{' '}
            <span className="font-medium text-slate-700 dark:text-slate-200">
              {t(`auth.signUp.strengthLabels.${strength}` as const)}
            </span>
          </p>
        </div>

        <label className="flex cursor-pointer items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 dark:border-slate-600 dark:bg-slate-800"
            required
          />
          <span>
            {t('auth.signUp.agreeTo')}{' '}
            <a
              href="#"
              className="font-medium text-brand-700 hover:underline dark:text-brand-300"
            >
              {t('auth.signUp.termsOfService')}
            </a>{' '}
            {t('auth.signUp.and')}{' '}
            <a
              href="#"
              className="font-medium text-brand-700 hover:underline dark:text-brand-300"
            >
              {t('auth.signUp.privacyPolicy')}
            </a>
            .
          </span>
        </label>

        <Button type="submit" fullWidth loading={loading} disabled={!agreed}>
          {t('auth.signUp.submit')}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
        {t('auth.signUp.haveAccount')}{' '}
        <Link
          to="/auth/signin"
          className="font-semibold text-brand-700 hover:text-brand-800 dark:text-brand-300 dark:hover:text-brand-200"
        >
          {t('auth.signUp.signInLink')}
        </Link>
      </p>
    </div>
  )
}
