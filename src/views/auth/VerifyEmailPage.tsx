import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useAuthStore } from '@/stores/auth.store'
import { extractApiError } from '@/services/auth'

export default function VerifyEmailPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const verifyEmailCode = useAuthStore((s) => s.verifyEmailCode)

  const email = searchParams.get('email')?.trim() || ''
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    if (!email) {
      setError(t('auth.verifyEmail.missingEmail'))
      return
    }
    const trimmedCode = code.trim()
    if (!/^\d{6}$/.test(trimmedCode)) {
      setError(t('auth.verifyEmail.invalidCode'))
      return
    }

    setLoading(true)
    try {
      await verifyEmailCode({ email, code: trimmedCode })
      navigate('/app/activity', { replace: true })
    } catch (err) {
      setError(extractApiError(err, t('auth.verifyEmail.errorFallback')))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Link
        to="/auth/signup"
        className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-brand-700 dark:text-slate-400 dark:hover:text-brand-300"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
        {t('auth.verifyEmail.back')}
      </Link>

      <div className="mb-8">
        <span className="inline-flex items-center rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700 ring-1 ring-inset ring-brand-100 dark:bg-brand-500/15 dark:text-brand-200 dark:ring-brand-500/30">
          {t('auth.verifyEmail.badge')}
        </span>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          {t('auth.verifyEmail.title')}
        </h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {t('auth.verifyEmail.subtitlePrefix')}{' '}
          <span className="font-medium text-slate-900 dark:text-slate-100">
            {email || t('auth.verifyEmail.yourEmail')}
          </span>
          {t('auth.verifyEmail.subtitleSuffix')}
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
          label={t('auth.verifyEmail.email')}
          type="email"
          value={email}
          readOnly
          tabIndex={-1}
          className="cursor-not-allowed bg-slate-50 text-slate-600 dark:bg-slate-900 dark:text-slate-300"
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
          label={t('auth.verifyEmail.code')}
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="\d{6}"
          maxLength={6}
          placeholder={t('auth.verifyEmail.codePlaceholder')}
          value={code}
          onChange={(e) =>
            setCode(e.target.value.replace(/\D/g, '').slice(0, 6))
          }
          required
          className="text-center text-lg font-semibold tracking-[0.4em]"
          hint={t('auth.verifyEmail.codeHint')}
        />
        <Button type="submit" fullWidth loading={loading}>
          {t('auth.verifyEmail.submit')}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
        {t('auth.verifyEmail.wrongEmail')}{' '}
        <Link
          to="/auth/signup"
          className="font-semibold text-brand-700 hover:text-brand-800 dark:text-brand-300 dark:hover:text-brand-200"
        >
          {t('auth.verifyEmail.signUpAgain')}
        </Link>
      </p>
    </div>
  )
}
