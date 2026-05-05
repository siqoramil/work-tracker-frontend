import { useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { authService, extractApiError } from '@/services/auth'

type Step = 'request' | 'confirm' | 'done'

export default function ResetPasswordPage() {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const prefillToken = searchParams.get('token')?.trim() || ''
  const prefillEmail = searchParams.get('email')?.trim() || ''

  const [step, setStep] = useState<Step>(prefillToken ? 'confirm' : 'request')
  const [email, setEmail] = useState(prefillEmail)
  const [code, setCode] = useState(prefillToken)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onRequest = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await authService.forgotPassword({ email: email.trim() })
      setStep('confirm')
    } catch (err) {
      setError(
        extractApiError(err, t('auth.resetPassword.request.errorFallback')),
      )
    } finally {
      setLoading(false)
    }
  }

  const onConfirm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    const trimmedCode = code.trim()
    if (!/^\d{6}$/.test(trimmedCode)) {
      setError(t('auth.resetPassword.confirm.invalidCode'))
      return
    }
    if (newPassword.length < 8) {
      setError(t('auth.resetPassword.confirm.tooShort'))
      return
    }
    if (newPassword !== confirmPassword) {
      setError(t('auth.resetPassword.confirm.noMatch'))
      return
    }

    setLoading(true)
    try {
      await authService.resetPassword({
        email: email.trim(),
        code: trimmedCode,
        new_password: newPassword,
      })
      setStep('done')
    } catch (err) {
      setError(
        extractApiError(err, t('auth.resetPassword.confirm.errorFallback')),
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Link
        to="/auth/signin"
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
        {t('auth.resetPassword.back')}
      </Link>

      <StepIndicator step={step} />

      <div className="mb-8">
        <span className="inline-flex items-center rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700 ring-1 ring-inset ring-brand-100 dark:bg-brand-500/15 dark:text-brand-200 dark:ring-brand-500/30">
          {t('auth.resetPassword.badge')}
        </span>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          {step === 'request' && t('auth.resetPassword.request.title')}
          {step === 'confirm' && t('auth.resetPassword.confirm.title')}
          {step === 'done' && t('auth.resetPassword.done.title')}
        </h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {step === 'request' && t('auth.resetPassword.request.subtitle')}
          {step === 'confirm' && (
            <>
              {t('auth.resetPassword.confirm.subtitlePrefix')}{' '}
              <span className="font-medium text-slate-900 dark:text-slate-100">
                {email || t('auth.resetPassword.confirm.yourEmail')}
              </span>
              {t('auth.resetPassword.confirm.subtitleSuffix')}
            </>
          )}
          {step === 'done' && t('auth.resetPassword.done.subtitle')}
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

      {step === 'request' && (
        <form onSubmit={onRequest} className="space-y-5">
          <Input
            label={t('auth.resetPassword.request.email')}
            type="email"
            autoComplete="email"
            placeholder={t('auth.resetPassword.request.emailPlaceholder')}
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
          <Button type="submit" fullWidth loading={loading}>
            {t('auth.resetPassword.request.submit')}
          </Button>
          <p className="text-center text-xs text-slate-500 dark:text-slate-400">
            {t('auth.resetPassword.request.haveCode')}{' '}
            <button
              type="button"
              onClick={() => setStep('confirm')}
              className="font-semibold text-brand-700 hover:text-brand-800 dark:text-brand-300 dark:hover:text-brand-200"
            >
              {t('auth.resetPassword.request.enterHere')}
            </button>
          </p>
        </form>
      )}

      {step === 'confirm' && (
        <form onSubmit={onConfirm} className="space-y-5">
          <Input
            label={t('auth.resetPassword.confirm.code')}
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="\d{6}"
            maxLength={6}
            placeholder={t('auth.resetPassword.confirm.codePlaceholder')}
            value={code}
            onChange={(e) =>
              setCode(e.target.value.replace(/\D/g, '').slice(0, 6))
            }
            required
            className="text-center text-lg font-semibold tracking-[0.4em]"
            hint={t('auth.resetPassword.confirm.codeHint')}
          />
          <Input
            label={t('auth.resetPassword.confirm.newPassword')}
            type="password"
            autoComplete="new-password"
            placeholder={t('auth.resetPassword.confirm.newPasswordPlaceholder')}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={8}
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
          <Input
            label={t('auth.resetPassword.confirm.confirmPassword')}
            type="password"
            autoComplete="new-password"
            placeholder={t(
              'auth.resetPassword.confirm.confirmPasswordPlaceholder',
            )}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={8}
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
          <Button type="submit" fullWidth loading={loading}>
            {t('auth.resetPassword.confirm.submit')}
          </Button>
          <p className="text-center text-xs text-slate-500 dark:text-slate-400">
            {t('auth.resetPassword.confirm.noCode')}{' '}
            <button
              type="button"
              onClick={() => {
                setStep('request')
                setError(null)
              }}
              className="font-semibold text-brand-700 hover:text-brand-800 dark:text-brand-300 dark:hover:text-brand-200"
            >
              {t('auth.resetPassword.confirm.sendNew')}
            </button>
          </p>
        </form>
      )}

      {step === 'done' && (
        <div className="space-y-5">
          <div className="rounded-2xl border border-brand-100 bg-brand-50/60 p-5 dark:border-brand-500/30 dark:bg-brand-500/10">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-brand-600 text-white dark:bg-brand-500">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path d="M5 12l4.5 4.5L19 7" />
                </svg>
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {t('auth.resetPassword.done.panelTitle')}
                </p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  {t('auth.resetPassword.done.panelMessage')}
                </p>
              </div>
            </div>
          </div>
          <Link to="/auth/signin" className="block">
            <Button variant="secondary" fullWidth>
              {t('auth.resetPassword.done.goToSignIn')}
            </Button>
          </Link>
        </div>
      )}

      {step !== 'done' && (
        <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
          {t('auth.resetPassword.remembered')}{' '}
          <Link
            to="/auth/signin"
            className="font-semibold text-brand-700 hover:text-brand-800 dark:text-brand-300 dark:hover:text-brand-200"
          >
            {t('auth.resetPassword.signInInstead')}
          </Link>
        </p>
      )}
    </div>
  )
}

function StepIndicator({ step }: { step: Step }) {
  const { t } = useTranslation()
  const items: { key: Step; label: string }[] = [
    { key: 'request', label: t('auth.resetPassword.stepLabels.email') },
    { key: 'confirm', label: t('auth.resetPassword.stepLabels.codePassword') },
    { key: 'done', label: t('auth.resetPassword.stepLabels.done') },
  ]
  const activeIndex = items.findIndex((i) => i.key === step)

  return (
    <ol className="mb-6 flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
      {items.map((item, idx) => {
        const isActive = idx === activeIndex
        const isComplete = idx < activeIndex
        return (
          <li key={item.key} className="flex items-center gap-2">
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
                isComplete
                  ? 'bg-brand-600 text-white dark:bg-brand-500'
                  : isActive
                    ? 'bg-brand-100 text-brand-800 ring-2 ring-brand-200 dark:bg-brand-500/20 dark:text-brand-200 dark:ring-brand-500/40'
                    : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
              }`}
            >
              {isComplete ? '✓' : idx + 1}
            </span>
            <span
              className={
                isActive || isComplete
                  ? 'text-slate-800 dark:text-slate-100'
                  : 'text-slate-400 dark:text-slate-500'
              }
            >
              {item.label}
            </span>
            {idx < items.length - 1 && (
              <span
                className={`h-px w-6 ${isComplete ? 'bg-brand-400' : 'bg-slate-200 dark:bg-slate-700'}`}
              />
            )}
          </li>
        )
      })}
    </ol>
  )
}
