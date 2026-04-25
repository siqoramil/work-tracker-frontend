import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Logo from '@/components/ui/Logo'

export default function MarketingFooter() {
  const { t } = useTranslation()

  const columns = [
    {
      title: t('marketingFooter.columns.product'),
      items: [
        { key: 'features', label: t('marketingFooter.columns.items.features') },
        { key: 'integrations', label: t('marketingFooter.columns.items.integrations') },
        { key: 'changelog', label: t('marketingFooter.columns.items.changelog') },
        { key: 'roadmap', label: t('marketingFooter.columns.items.roadmap') },
      ],
    },
    {
      title: t('marketingFooter.columns.company'),
      items: [
        { key: 'about', label: t('marketingFooter.columns.items.about') },
        { key: 'customers', label: t('marketingFooter.columns.items.customers') },
        { key: 'careers', label: t('marketingFooter.columns.items.careers') },
        { key: 'contact', label: t('marketingFooter.columns.items.contact') },
      ],
    },
    {
      title: t('marketingFooter.columns.resources'),
      items: [
        { key: 'helpCenter', label: t('marketingFooter.columns.items.helpCenter') },
        { key: 'blog', label: t('marketingFooter.columns.items.blog') },
        { key: 'guides', label: t('marketingFooter.columns.items.guides') },
        { key: 'apiDocs', label: t('marketingFooter.columns.items.apiDocs') },
      ],
    },
    {
      title: t('marketingFooter.columns.legal'),
      items: [
        { key: 'terms', label: t('marketingFooter.columns.items.terms') },
        { key: 'privacy', label: t('marketingFooter.columns.items.privacy') },
        { key: 'security', label: t('marketingFooter.columns.items.security') },
        { key: 'dpa', label: t('marketingFooter.columns.items.dpa') },
      ],
    },
  ]

  return (
    <footer className="border-t border-slate-200 bg-slate-50/50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:gap-8 md:grid-cols-3 md:gap-10 lg:grid-cols-5">
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Logo />
            <p className="mt-4 max-w-sm text-sm text-slate-500">
              {t('marketingFooter.tagline')}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              {['twitter', 'linkedin', 'github'].map((s) => (
                <a
                  key={s}
                  href="#"
                  aria-label={s}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:border-brand-300 hover:text-brand-700"
                >
                  <span className="text-xs font-semibold uppercase">
                    {s[0]}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title} className="min-w-0">
              <p className="text-sm font-semibold text-slate-900">
                {col.title}
              </p>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                {col.items.map((item) => (
                  <li key={item.key}>
                    <a href="#" className="hover:text-brand-700">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-slate-200 pt-6 text-xs text-slate-500 sm:mt-12 md:flex-row md:items-center md:gap-6">
          <p className="leading-relaxed">
            {t('marketingFooter.credit', { year: new Date().getFullYear() })}{' '}
            <a
              href="https://ovrin.uz"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-brand-700 hover:text-brand-800"
            >
              ovrin.uz
            </a>
            .
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link to="/auth/signin" className="hover:text-brand-700">
              {t('common.signIn')}
            </Link>
            <a href="#" className="hover:text-brand-700">
              {t('marketingFooter.links.status')}
            </a>
            <a
              href="mailto:siqoramil@gmail.com"
              className="break-all hover:text-brand-700"
            >
              siqoramil@gmail.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
