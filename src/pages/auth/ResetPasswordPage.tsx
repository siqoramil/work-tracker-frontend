import { useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { authService, extractApiError } from '@/services/auth'

type Step = 'request' | 'confirm' | 'done'

export default function ResetPasswordPage() {
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
      setError(extractApiError(err, 'Unable to send reset code'))
    } finally {
      setLoading(false)
    }
  }

  const onConfirm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    const trimmedCode = code.trim()
    if (!/^\d{6}$/.test(trimmedCode)) {
      setError('Enter the 6-digit code from your email.')
      return
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.')
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
      setError(extractApiError(err, 'Unable to reset password'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Link
        to="/auth/signin"
        className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-brand-700"
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
        Back to sign in
      </Link>

      <StepIndicator step={step} />

      <div className="mb-8">
        <span className="inline-flex items-center rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700 ring-1 ring-inset ring-brand-100">
          Account recovery
        </span>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">
          {step === 'request' && 'Reset your password'}
          {step === 'confirm' && 'Enter the 6-digit code'}
          {step === 'done' && 'Password updated'}
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          {step === 'request' &&
            'Enter the email linked to your account — we’ll send you a 6-digit code.'}
          {step === 'confirm' && (
            <>
              We sent a 6-digit code to{' '}
              <span className="font-medium text-slate-900">
                {email || 'your email'}
              </span>
              . Enter it below with your new password. The code is valid for 30
              minutes.
            </>
          )}
          {step === 'done' &&
            'Your password has been updated. Open the WorkTracker desktop app and sign in with your new password.'}
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {step === 'request' && (
        <form onSubmit={onRequest} className="space-y-5">
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
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
            Send 6-digit code
          </Button>
          <p className="text-center text-xs text-slate-500">
            Already have a code?{' '}
            <button
              type="button"
              onClick={() => setStep('confirm')}
              className="font-semibold text-brand-700 hover:text-brand-800"
            >
              Enter it here
            </button>
          </p>
        </form>
      )}

      {step === 'confirm' && (
        <form onSubmit={onConfirm} className="space-y-5">
          <Input
            label="6-digit code"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="\d{6}"
            maxLength={6}
            placeholder="123456"
            value={code}
            onChange={(e) =>
              setCode(e.target.value.replace(/\D/g, '').slice(0, 6))
            }
            required
            className="text-center text-lg font-semibold tracking-[0.4em]"
            hint="Check your email for the code we just sent."
          />
          <Input
            label="New password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
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
            label="Confirm new password"
            type="password"
            autoComplete="new-password"
            placeholder="Re-enter your new password"
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
            Update password
          </Button>
          <p className="text-center text-xs text-slate-500">
            Didn’t get the code?{' '}
            <button
              type="button"
              onClick={() => {
                setStep('request')
                setError(null)
              }}
              className="font-semibold text-brand-700 hover:text-brand-800"
            >
              Send a new one
            </button>
          </p>
        </form>
      )}

      {step === 'done' && (
        <div className="space-y-5">
          <div className="rounded-2xl border border-brand-100 bg-brand-50/60 p-5">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-brand-600 text-white">
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
                <p className="text-sm font-semibold text-slate-900">
                  You’re all set
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Open the WorkTracker desktop app and sign in with your email
                  and the new password.
                </p>
              </div>
            </div>
          </div>
          <Link to="/auth/signin" className="block">
            <Button variant="secondary" fullWidth>
              Go to web sign in
            </Button>
          </Link>
        </div>
      )}

      {step !== 'done' && (
        <p className="mt-8 text-center text-sm text-slate-500">
          Remembered it?{' '}
          <Link
            to="/auth/signin"
            className="font-semibold text-brand-700 hover:text-brand-800"
          >
            Sign in instead
          </Link>
        </p>
      )}
    </div>
  )
}

function StepIndicator({ step }: { step: Step }) {
  const items: { key: Step; label: string }[] = [
    { key: 'request', label: 'Email' },
    { key: 'confirm', label: 'Code & password' },
    { key: 'done', label: 'Done' },
  ]
  const activeIndex = items.findIndex((i) => i.key === step)

  return (
    <ol className="mb-6 flex items-center gap-2 text-xs font-medium text-slate-500">
      {items.map((item, idx) => {
        const isActive = idx === activeIndex
        const isComplete = idx < activeIndex
        return (
          <li key={item.key} className="flex items-center gap-2">
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
                isComplete
                  ? 'bg-brand-600 text-white'
                  : isActive
                    ? 'bg-brand-100 text-brand-800 ring-2 ring-brand-200'
                    : 'bg-slate-100 text-slate-500'
              }`}
            >
              {isComplete ? '✓' : idx + 1}
            </span>
            <span
              className={
                isActive || isComplete ? 'text-slate-800' : 'text-slate-400'
              }
            >
              {item.label}
            </span>
            {idx < items.length - 1 && (
              <span
                className={`h-px w-6 ${isComplete ? 'bg-brand-400' : 'bg-slate-200'}`}
              />
            )}
          </li>
        )
      })}
    </ol>
  )
}
