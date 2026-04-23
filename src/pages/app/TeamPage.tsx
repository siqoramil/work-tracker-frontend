import { useState, type FormEvent } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { authService, extractApiError } from '@/services/auth'

type InvitedUser = {
  id: string
  email: string
  full_name: string
}

export default function TeamPage() {
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
      setError('Password must be at least 8 characters long.')
      return
    }

    setLoading(true)
    try {
      const user = await authService.invite({
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
      setError(extractApiError(err, 'Unable to send invite'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]">
      <section>
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-700">
            Team
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            Invite teammates
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Create accounts for people on your team. Share the temporary
            password with them — they can change it later from the reset
            password page.
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

        <form
          onSubmit={onSubmit}
          className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6"
        >
          <Input
            label="Full name"
            autoComplete="off"
            placeholder="Jane Cooper"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <Input
            label="Work email"
            type="email"
            autoComplete="off"
            placeholder="jane@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Temporary password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            hint="You’ll share this with the teammate. They can reset it anytime."
          />
          <Button type="submit" loading={loading}>
            Send invite
          </Button>
        </form>
      </section>

      <aside className="rounded-2xl border border-slate-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-slate-900">
          Recently invited
        </h3>
        {invited.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">
            People you invite during this session will appear here.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-slate-100">
            {invited.map((u) => (
              <li key={u.id} className="flex items-center gap-3 py-3">
                <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-800">
                  {u.full_name
                    .split(/\s+/)
                    .map((p) => p[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase() || 'U'}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {u.full_name}
                  </p>
                  <p className="truncate text-xs text-slate-500">{u.email}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </aside>
    </div>
  )
}
