import { useTranslation } from 'react-i18next'
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '@/i18n'

interface LanguageSwitcherProps {
  className?: string
}

export default function LanguageSwitcher({
  className = '',
}: LanguageSwitcherProps) {
  const { i18n, t } = useTranslation()
  const current = (i18n.resolvedLanguage ?? i18n.language ?? 'en').slice(
    0,
    2,
  ) as SupportedLanguage

  return (
    <div
      className={`inline-flex items-center gap-0.5 rounded-lg border border-slate-200 bg-white p-0.5 ${className}`}
      role="group"
      aria-label={t('common.language')}
    >
      {SUPPORTED_LANGUAGES.map((lng) => (
        <button
          key={lng}
          type="button"
          onClick={() => i18n.changeLanguage(lng)}
          className={`rounded-md px-2 py-1 text-[11px] font-semibold uppercase tracking-wider transition-colors ${
            current === lng
              ? 'bg-brand-600 text-white'
              : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
          }`}
          aria-pressed={current === lng}
        >
          {lng}
        </button>
      ))}
    </div>
  )
}
