import {
  forwardRef,
  useId,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  hint?: string
  error?: string
  leadingIcon?: ReactNode
  trailingAction?: ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    id,
    label,
    hint,
    error,
    leadingIcon,
    trailingAction,
    type = 'text',
    className = '',
    ...rest
  },
  ref,
) {
  const autoId = useId()
  const inputId = id ?? autoId
  const [revealed, setRevealed] = useState(false)
  const isPassword = type === 'password'
  const resolvedType = isPassword && revealed ? 'text' : type

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
        >
          {label}
        </label>
      )}
      <div
        className={`group relative flex items-center rounded-xl border bg-white transition dark:bg-slate-800 ${
          error
            ? 'border-red-300 focus-within:border-red-500 focus-within:ring-4 focus-within:ring-red-100 dark:border-red-500/60 dark:focus-within:ring-red-900/40'
            : 'border-slate-200 focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-100 dark:border-slate-700 dark:focus-within:border-brand-400 dark:focus-within:ring-brand-900/40'
        }`}
      >
        {leadingIcon && (
          <span className="pointer-events-none pl-3.5 text-slate-400 dark:text-slate-500">
            {leadingIcon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          type={resolvedType}
          className={`w-full bg-transparent px-3.5 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-60 dark:text-slate-100 dark:placeholder:text-slate-500 ${className}`}
          {...rest}
        />
        {isPassword ? (
          <button
            type="button"
            onClick={() => setRevealed((v) => !v)}
            className="mr-1.5 rounded-md px-2 py-1 text-xs font-medium text-slate-500 hover:text-brand-700 dark:text-slate-400 dark:hover:text-brand-300"
            tabIndex={-1}
            aria-label={revealed ? 'Hide password' : 'Show password'}
          >
            {revealed ? 'Hide' : 'Show'}
          </button>
        ) : (
          trailingAction && <span className="pr-3">{trailingAction}</span>
        )}
      </div>
      {error ? (
        <p className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
          {hint}
        </p>
      ) : null}
    </div>
  )
})

export default Input
