'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import OverviewSection from '@/widgets/tracking-overview/OverviewSection'
import ActivitySection from '@/widgets/tracking-activity/ActivitySection'
import ScreenshotsSection from '@/widgets/tracking-screenshots/ScreenshotsSection'

type Tab = 'overview' | 'activity' | 'screenshots'

const TABS: Tab[] = ['overview', 'activity', 'screenshots']

const tabIcons: Record<Tab, ReactNode> = {
  overview: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </svg>
  ),
  activity: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M3 12h4l3-8 4 16 3-8h4" />
    </svg>
  ),
  screenshots: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M4 8h4l2-3h4l2 3h4v11H4z" />
      <circle cx="12" cy="13" r="3.5" />
    </svg>
  ),
}

export default function TrackingPage() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const initial = (searchParams.get('tab') as Tab) || 'overview'
  const [tab, setTab] = useState<Tab>(
    TABS.includes(initial) ? initial : 'overview',
  )

  useEffect(() => {
    const next = new URLSearchParams(searchParams)
    if (tab === 'overview') next.delete('tab')
    else next.set('tab', tab)
    setSearchParams(next, { replace: true })
  }, [tab, searchParams, setSearchParams])

  return (
    <div>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-300">
          {t('tracking.kicker')}
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
          {t('tracking.title')}
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          {t('tracking.subtitle')}
        </p>
      </div>

      <div className="mb-6 border-b border-slate-200 dark:border-slate-800">
        <nav
          className="-mb-px flex gap-1 overflow-x-auto"
          role="tablist"
          aria-label={t('tracking.title')}
        >
          {TABS.map((key) => {
            const isActive = tab === key
            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setTab(key)}
                className={`inline-flex shrink-0 items-center gap-2 border-b-2 px-3 py-2.5 text-sm font-medium transition sm:px-4 sm:py-3 ${
                  isActive
                    ? 'border-brand-600 text-brand-700 dark:border-brand-400 dark:text-brand-300'
                    : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-800 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-slate-200'
                }`}
              >
                {tabIcons[key]}
                <span>{t(`tracking.tabs.${key}`)}</span>
              </button>
            )
          })}
        </nav>
      </div>

      <div role="tabpanel">
        {tab === 'overview' && <OverviewSection />}
        {tab === 'activity' && <ActivitySection />}
        {tab === 'screenshots' && <ScreenshotsSection />}
      </div>
    </div>
  )
}
