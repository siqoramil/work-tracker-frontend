type LogoProps = {
  className?: string
  iconOnly?: boolean
  tone?: 'brand' | 'light'
}

export default function Logo({
  className = '',
  iconOnly = false,
  tone = 'brand',
}: LogoProps) {
  const markClasses =
    tone === 'brand'
      ? 'bg-brand-600 text-white'
      : 'bg-white/15 text-white ring-1 ring-white/30 backdrop-blur'

  const labelClasses =
    tone === 'brand' ? 'text-slate-900 dark:text-slate-100' : 'text-white'

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-xl shadow-sm ${markClasses}`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path d="M12 2.5l9 4.5v5c0 5-3.8 9.4-9 10.5-5.2-1.1-9-5.5-9-10.5v-5l9-4.5z" />
          <path d="M8.5 12.5l2.5 2.5 4.5-5" />
        </svg>
      </span>
      {!iconOnly && (
        <span
          className={`text-lg font-semibold tracking-tight ${labelClasses}`}
        >
          WorkTracker
        </span>
      )}
    </div>
  )
}
