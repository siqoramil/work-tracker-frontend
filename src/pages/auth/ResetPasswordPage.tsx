import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { authService, extractApiError } from '@/services/auth'

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await authService.forgotPassword({ email: email.trim() })
      setSent(true)
    } catch (err) {
      setError(extractApiError(err, 'Unable to send reset link'))
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

      <div className="mb-8">
        <span className="inline-flex items-center rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700 ring-1 ring-inset ring-brand-100">
          Account recovery
        </span>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">
          Reset your password
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Enter the email linked to your admin account and we’ll send you a
          secure reset link.
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

      {sent ? (
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
                Check your inbox
              </p>
              <p className="mt-1 text-sm text-slate-600">
                We’ve sent a reset link to{' '}
                <span className="font-medium text-slate-900">{email}</span>. The
                link is valid for 30 minutes.
              </p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="mt-3 text-sm font-semibold text-brand-700 hover:text-brand-800"
              >
                Use a different email
              </button>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-5">
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
            Send reset link
          </Button>
        </form>
      )}

      <p className="mt-8 text-center text-sm text-slate-500">
        Remembered it?{' '}
        <Link
          to="/auth/signin"
          className="font-semibold text-brand-700 hover:text-brand-800"
        >
          Sign in instead
        </Link>
      </p>
    </div>
  )
}
