import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useAuthStore } from '@/stores/auth.store'
import { extractApiError } from '@/services/auth'

type LocationState = { from?: { pathname?: string } } | null

export default function SignInPage() {
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
      setError(extractApiError(err, 'Unable to sign in'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <span className="inline-flex items-center rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700 ring-1 ring-inset ring-brand-100">
          Admin portal
        </span>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">
          Welcome back
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Sign in to manage your workspace, team, and projects.
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
        <Input
          label="Password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
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
          <label className="inline-flex cursor-pointer items-center gap-2 text-slate-600">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
            />
            Keep me signed in
          </label>
          <Link
            to="/auth/reset-password"
            className="font-medium text-brand-700 hover:text-brand-800"
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" fullWidth loading={loading}>
          Sign in
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-slate-500">
        Don’t have an account?{' '}
        <Link
          to="/auth/signup"
          className="font-semibold text-brand-700 hover:text-brand-800"
        >
          Create one
        </Link>
      </p>
    </div>
  )
}
