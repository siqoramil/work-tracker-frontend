'use client'
import { useEffect, useState, type CSSProperties } from 'react'

const BAR_HEIGHTS = [45, 72, 58, 90, 65, 110, 82, 95, 70, 120, 88, 105]
const CYCLE_MS = 7000
const FILL_MS = 1800

const CARDS = [
  { label: 'Hours this week', target: 412, suffix: 'h', delta: '+8%' },
  { label: 'Active projects', target: 23, suffix: '', delta: '+2' },
  { label: 'Pending approvals', target: 7, suffix: '', delta: '−3' },
]

const SIDEBAR = [
  'Dashboard',
  'Team',
  'Projects',
  'Timesheets',
  'Invoices',
  'Reports',
  'Settings',
]

function useLoopCount(target: number) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const elapsed = (now - start) % CYCLE_MS
      const filling = Math.min(elapsed / FILL_MS, 1)
      const eased = 1 - Math.pow(1 - filling, 3)
      setValue(Math.round(target * eased))
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target])
  return value
}

function WaterBar({ height, index }: { height: number; index: number }) {
  const delay = (index * 0.12).toFixed(2) + 's'
  const waveDelay = (index * 0.4).toFixed(2) + 's'
  return (
    <div className="relative flex h-32 flex-1 items-end">
      {/* faint trough behind the bar */}
      <div className="absolute inset-x-0 bottom-0 h-full rounded-t-md bg-brand-100/40 dark:bg-brand-500/10" />
      <div
        className="relative w-full overflow-hidden rounded-t-md"
        style={
          {
            '--target-h': `${height}px`,
            animation: `water-fill ${CYCLE_MS}ms ease-in-out infinite`,
            animationDelay: delay,
            height: 0,
            willChange: 'height',
          } as CSSProperties
        }
      >
        {/* water gradient body */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-300 via-brand-500 to-brand-600 dark:from-brand-400 dark:via-brand-500 dark:to-brand-700" />

        {/* surface highlight */}
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-b from-white/45 to-transparent" />

        {/* moving surface wave (back) */}
        <svg
          className="pointer-events-none absolute -top-[2px] left-0 h-2 w-[200%] opacity-70"
          viewBox="0 0 200 8"
          preserveAspectRatio="none"
          style={{
            animation: `wave-flow-reverse 3.2s linear infinite`,
            animationDelay: waveDelay,
          }}
        >
          <path
            d="M0 4 Q 12.5 0 25 4 T 50 4 T 75 4 T 100 4 T 125 4 T 150 4 T 175 4 T 200 4 V 8 H 0 Z"
            fill="rgba(255,255,255,0.55)"
          />
        </svg>

        {/* moving surface wave (front) */}
        <svg
          className="pointer-events-none absolute top-0 left-0 h-2.5 w-[200%]"
          viewBox="0 0 200 10"
          preserveAspectRatio="none"
          style={{
            animation: `wave-flow 2.2s linear infinite`,
            animationDelay: waveDelay,
          }}
        >
          <path
            d="M0 5 Q 12.5 9 25 5 T 50 5 T 75 5 T 100 5 T 125 5 T 150 5 T 175 5 T 200 5 V 10 H 0 Z"
            fill="rgba(255,255,255,0.35)"
          />
        </svg>

        {/* lateral shimmer */}
        <div
          className="pointer-events-none absolute inset-y-0 -inset-x-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          style={{
            animation: `water-shimmer 3.6s ease-in-out infinite`,
            animationDelay: `${(index * 0.25).toFixed(2)}s`,
          }}
        />
      </div>
    </div>
  )
}

function StatCard({ card }: { card: (typeof CARDS)[number] }) {
  const value = useLoopCount(card.target)
  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-2.5 dark:border-slate-800 dark:bg-slate-900/60 sm:p-3">
      {/* drifting highlight */}
      <div
        className="pointer-events-none absolute inset-y-0 -inset-x-1/2 bg-gradient-to-r from-transparent via-brand-200/40 to-transparent dark:via-brand-400/15"
        style={{ animation: `water-shimmer 5s ease-in-out infinite` }}
      />
      <p className="relative text-[9px] uppercase tracking-wide text-slate-400 dark:text-slate-500 sm:text-[10px]">
        {card.label}
      </p>
      <p className="relative mt-1 text-base font-semibold text-slate-900 tabular-nums dark:text-slate-100 sm:text-xl">
        {value}
        {card.suffix}
      </p>
      <p className="relative text-[10px] text-brand-600 dark:text-brand-400">
        {card.delta}
      </p>
    </div>
  )
}

export default function AnimatedDashboardPreview() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-brand-900/10 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/40">
      {/* title bar */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 bg-slate-50 px-4 py-2.5 dark:border-slate-800 dark:bg-slate-900/60">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-brand-400" />
        <span className="ml-3 text-xs text-slate-500 dark:text-slate-400">
          app.worktracker.io / dashboard
        </span>
        {/* live indicator */}
        <span className="ml-auto flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-brand-600 dark:text-brand-400">
          <span className="relative flex h-1.5 w-1.5">
            <span
              className="absolute inset-0 rounded-full bg-brand-500"
              style={{ animation: `ripple-ring 1.6s ease-out infinite` }}
            />
            <span className="relative h-1.5 w-1.5 rounded-full bg-brand-500" />
          </span>
          live
        </span>
      </div>

      {/* body */}
      <div className="grid grid-cols-12 gap-3 p-3 sm:gap-4 sm:p-5">
        <aside className="col-span-3 hidden flex-col gap-1 md:flex">
          {SIDEBAR.map((item, i) => (
            <div
              key={item}
              className={`relative rounded-lg px-3 py-2 text-xs font-medium ${
                i === 0
                  ? 'bg-brand-50 text-brand-800 dark:bg-brand-500/15 dark:text-brand-200'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {item}
              {i === 0 && (
                <span
                  className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-brand-400/60"
                  style={{
                    animation: `ripple-ring 2.6s ease-out infinite`,
                  }}
                />
              )}
            </div>
          ))}
        </aside>

        <main className="col-span-12 md:col-span-9">
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {CARDS.map((c) => (
              <StatCard key={c.label} card={c} />
            ))}
          </div>

          <div className="relative mt-3 overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-b from-brand-50 to-white p-3 dark:border-slate-800 dark:from-brand-900/30 dark:to-slate-900">
            {/* scanline sweep gives a video feel */}
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-brand-400/15 to-transparent"
              style={{
                animation: `scanline-sweep 6s ease-in-out infinite`,
              }}
            />

            {/* bars */}
            <div
              className="relative flex h-32 items-end gap-1.5"
              style={{ animation: `water-bob 3.4s ease-in-out infinite` }}
            >
              {BAR_HEIGHTS.map((h, i) => (
                <WaterBar key={i} height={h} index={i} />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
