import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useAuthStore } from '@/stores/auth.store'
import { extractApiError } from '@/services/auth'

export default function VerifyEmailPage() {
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
      setError('Missing email — please sign up again.')
      return
    }
    const trimmedCode = code.trim()
    if (!/^\d{6}$/.test(trimmedCode)) {
      setError('Enter the 6-digit code from your email.')
      return
    }

    setLoading(true)
    try {
      await verifyEmailCode({ email, code: trimmedCode })
      navigate('/app/activity', { replace: true })
    } catch (err) {
      setError(extractApiError(err, 'Invalid or expired code.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Link
        to="/auth/signup"
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
        Back to sign up
      </Link>

      <div className="mb-8">
        <span className="inline-flex items-center rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700 ring-1 ring-inset ring-brand-100">
          Email verification
        </span>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">
          Enter the 6-digit code
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          We sent a 6-digit code to{' '}
          <span className="font-medium text-slate-900">
            {email || 'your email'}
          </span>
          . Enter it below to confirm your address and finish creating your
          workspace.
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

      <form onSubmit={onSubmit} className="space-y-5">
        <Input
          label="Email"
          type="email"
          value={email}
          readOnly
          tabIndex={-1}
          className="cursor-not-allowed bg-slate-50 text-slate-600"
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
        <Button type="submit" fullWidth loading={loading}>
          Verify and continue
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-slate-500">
        Wrong email?{' '}
        <Link
          to="/auth/signup"
          className="font-semibold text-brand-700 hover:text-brand-800"
        >
          Sign up again
        </Link>
      </p>
    </div>
  )
}
