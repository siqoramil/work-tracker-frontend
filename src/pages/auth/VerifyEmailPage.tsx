import { Link, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import Button from '@/components/ui/Button'
import { authService, extractApiError } from '@/services/auth'

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')?.trim() || ''

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['verify-email', token],
    queryFn: () => authService.verifyEmail({ token }),
    enabled: Boolean(token),
    retry: false,
  })

  const status: 'missing' | 'verifying' | 'success' | 'error' = !token
    ? 'missing'
    : isPending
      ? 'verifying'
      : isError
        ? 'error'
        : 'success'

  const message = data?.message ?? ''
  const errorMessage = isError
    ? extractApiError(error, 'This verification link is invalid or expired.')
    : ''

  return (
    <div>
      <div className="mb-8">
        <span className="inline-flex items-center rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700 ring-1 ring-inset ring-brand-100">
          Email verification
        </span>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">
          {status === 'success'
            ? 'Email verified'
            : status === 'error'
              ? 'Verification failed'
              : status === 'missing'
                ? 'Missing token'
                : 'Verifying your email…'}
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          {status === 'verifying' &&
            'Hang tight — we’re confirming your email address.'}
          {status === 'success' &&
            'Your email address is now confirmed. You can sign in to your workspace.'}
          {status === 'error' && errorMessage}
          {status === 'missing' &&
            'No verification token was supplied in the URL.'}
        </p>
      </div>

      {status === 'verifying' && (
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
          Please wait…
        </div>
      )}

      {status === 'success' && (
        <div className="rounded-2xl border border-brand-100 bg-brand-50/60 p-5">
          <p className="text-sm text-slate-700">
            {message || 'Your email has been verified.'}
          </p>
          <Link to="/auth/signin" className="mt-4 inline-block">
            <Button>Continue to sign in</Button>
          </Link>
        </div>
      )}

      {status === 'error' && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          <p>{errorMessage}</p>
          <p className="mt-3 text-xs text-red-900/70">
            If the link came from an older email, request a new one by signing
            up or contacting your admin.
          </p>
        </div>
      )}

      {status === 'missing' && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
          Open the verification link from your email to complete this step.
        </div>
      )}

      <p className="mt-8 text-center text-sm text-slate-500">
        Go back to{' '}
        <Link
          to="/auth/signin"
          className="font-semibold text-brand-700 hover:text-brand-800"
        >
          sign in
        </Link>
        .
      </p>
    </div>
  )
}
