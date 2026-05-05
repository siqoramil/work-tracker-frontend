'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

type DateFieldProps = {
  label?: string
  value: string
  onChange: (value: string) => void
  min?: string
  max?: string
  placeholder?: string
  className?: string
  disabled?: boolean
}

function pad(n: number) {
  return n.toString().padStart(2, '0')
}

function toIso(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function fromIso(s: string | undefined | null): Date | null {
  if (!s) return null
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(s)
  if (!m) return null
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
  return isNaN(d.getTime()) ? null : d
}

function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function startOfDay(d: Date): Date {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

export default function DateField({
  label,
  value,
  onChange,
  min,
  max,
  placeholder,
  className = '',
  disabled,
}: DateFieldProps) {
  const { i18n, t } = useTranslation()
  const id = useId()
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const [open, setOpen] = useState(false)

  const selected = useMemo(() => fromIso(value), [value])
  const today = useMemo(() => startOfDay(new Date()), [])
  const minDate = useMemo(() => fromIso(min), [min])
  const maxDate = useMemo(() => fromIso(max), [max])

  const initialView = selected ?? today
  const [view, setView] = useState({
    year: initialView.getFullYear(),
    month: initialView.getMonth(),
  })

  useEffect(() => {
    if (open && selected) {
      setView({ year: selected.getFullYear(), month: selected.getMonth() })
    }
  }, [open, selected])

  useEffect(() => {
    if (!open) return
    function onDown(e: MouseEvent) {
      if (!wrapperRef.current) return
      if (!wrapperRef.current.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const locale = i18n.language || 'en'
  const monthFmt = useMemo(
    () => new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }),
    [locale],
  )
  const weekdayFmt = useMemo(
    () => new Intl.DateTimeFormat(locale, { weekday: 'short' }),
    [locale],
  )
  const displayFmt = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
    [locale],
  )

  const days = useMemo(() => {
    const first = new Date(view.year, view.month, 1)
    const firstDow = (first.getDay() + 6) % 7
    const start = new Date(view.year, view.month, 1 - firstDow)
    return Array.from({ length: 42 }, (_, i) => {
      return new Date(
        start.getFullYear(),
        start.getMonth(),
        start.getDate() + i,
      )
    })
  }, [view])

  const weekdayHeaders = useMemo(() => {
    const ref = new Date(2024, 0, 1)
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(ref.getFullYear(), ref.getMonth(), ref.getDate() + i)
      return weekdayFmt.format(d).charAt(0).toUpperCase()
    })
  }, [weekdayFmt])

  const isOutOfRange = (d: Date): boolean => {
    const day = startOfDay(d)
    if (minDate && day < startOfDay(minDate)) return true
    if (maxDate && day > startOfDay(maxDate)) return true
    return false
  }

  const gotoPrevMonth = () =>
    setView(({ year, month }) =>
      month === 0 ? { year: year - 1, month: 11 } : { year, month: month - 1 },
    )
  const gotoNextMonth = () =>
    setView(({ year, month }) =>
      month === 11 ? { year: year + 1, month: 0 } : { year, month: month + 1 },
    )
  const gotoToday = () => {
    const d = new Date()
    if (isOutOfRange(d)) return
    setView({ year: d.getFullYear(), month: d.getMonth() })
    onChange(toIso(d))
    setOpen(false)
  }
  const clear = () => {
    onChange('')
    setOpen(false)
  }
  const selectDay = (d: Date) => {
    if (isOutOfRange(d)) return
    setView({ year: d.getFullYear(), month: d.getMonth() })
    onChange(toIso(d))
    setOpen(false)
  }

  const display = selected ? displayFmt.format(selected) : ''
  const monthLabel = monthFmt.format(new Date(view.year, view.month, 1))
  const todayDisabled = isOutOfRange(today)

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
        >
          {label}
        </label>
      )}
      <div ref={wrapperRef} className="relative">
        <button
          id={id}
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setOpen((o) => !o)}
          aria-haspopup="dialog"
          aria-expanded={open}
          className={`group flex w-full items-center justify-between rounded-xl border bg-white px-3.5 py-2.5 text-left text-sm transition dark:bg-slate-800 ${
            open
              ? 'border-brand-500 ring-4 ring-brand-100 dark:border-brand-400 dark:ring-brand-900/40'
              : 'border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600'
          } ${disabled ? 'cursor-not-allowed opacity-60' : ''} ${className}`}
        >
          <span
            className={
              display
                ? 'text-slate-900 dark:text-slate-100'
                : 'text-slate-400 dark:text-slate-500'
            }
          >
            {display || placeholder || 'DD/MM/YYYY'}
          </span>
          <span
            className={
              open
                ? 'text-brand-600 dark:text-brand-300'
                : 'text-slate-400 group-hover:text-slate-500 dark:text-slate-500 dark:group-hover:text-slate-400'
            }
          >
            <CalendarIcon />
          </span>
        </button>

        {open && (
          <div
            role="dialog"
            className="absolute left-0 top-full z-50 mt-2 w-[20rem] origin-top rounded-2xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-700 dark:bg-slate-800 dark:shadow-black/50"
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-semibold capitalize text-slate-900 dark:text-slate-100">
                {monthLabel}
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={gotoPrevMonth}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-100"
                  aria-label="Previous month"
                >
                  <ChevronLeft />
                </button>
                <button
                  type="button"
                  onClick={gotoNextMonth}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-100"
                  aria-label="Next month"
                >
                  <ChevronRight />
                </button>
              </div>
            </div>

            <div className="mb-1 grid grid-cols-7 gap-0.5">
              {weekdayHeaders.map((w, i) => (
                <div
                  key={i}
                  className="py-1 text-center text-[11px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500"
                >
                  {w}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-0.5">
              {days.map((d, i) => {
                const isCurrentMonth = d.getMonth() === view.month
                const isSelected = selected ? sameDay(d, selected) : false
                const isToday = sameDay(d, today)
                const oor = isOutOfRange(d)

                let cls =
                  'flex h-9 items-center justify-center rounded-lg text-sm transition '
                if (oor) {
                  cls +=
                    'cursor-not-allowed text-slate-300 line-through hover:bg-transparent dark:text-slate-600'
                } else if (isSelected) {
                  cls +=
                    'bg-brand-500 text-white font-semibold shadow-sm hover:bg-brand-600 dark:bg-brand-500 dark:hover:bg-brand-400'
                } else if (isToday) {
                  cls +=
                    'border border-brand-400 text-brand-700 font-semibold hover:bg-brand-50 dark:border-brand-400 dark:text-brand-300 dark:hover:bg-brand-500/10'
                } else if (isCurrentMonth) {
                  cls +=
                    'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700'
                } else {
                  cls +=
                    'text-slate-300 hover:bg-slate-50 dark:text-slate-600 dark:hover:bg-slate-700/50'
                }

                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => selectDay(d)}
                    disabled={oor}
                    className={cls}
                  >
                    {d.getDate()}
                  </button>
                )
              })}
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-sm font-medium dark:border-slate-700">
              <button
                type="button"
                onClick={clear}
                disabled={!value}
                className="rounded-md px-2 py-1 text-slate-500 transition hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40 dark:text-slate-400 dark:hover:text-slate-100"
              >
                {t('common.clear', { defaultValue: 'Clear' })}
              </button>
              <button
                type="button"
                onClick={gotoToday}
                disabled={todayDisabled}
                className="rounded-md px-2 py-1 text-brand-600 transition hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-40 dark:text-brand-300 dark:hover:text-brand-200"
              >
                {t('common.today', { defaultValue: 'Today' })}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function CalendarIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

function ChevronLeft() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}
