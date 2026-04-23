import { Link } from 'react-router-dom'
import Logo from '@/components/ui/Logo'

const columns = [
  {
    title: 'Product',
    items: ['Features', 'Integrations', 'Changelog', 'Roadmap'],
  },
  {
    title: 'Company',
    items: ['About', 'Customers', 'Careers', 'Contact'],
  },
  {
    title: 'Resources',
    items: ['Help center', 'Blog', 'Guides', 'API docs'],
  },
  {
    title: 'Legal',
    items: ['Terms', 'Privacy', 'Security', 'DPA'],
  },
]

export default function MarketingFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50/50">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        <div className="grid gap-8 sm:grid-cols-2 sm:gap-10 lg:grid-cols-5">
          <div className="sm:col-span-2 lg:col-span-2">
            <Logo />
            <p className="mt-4 max-w-sm text-sm text-slate-500">
              The time-tracking admin platform for teams that care about output
              — and the people behind it.
            </p>
            <div className="mt-5 flex items-center gap-3">
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
            <div key={col.title}>
              <p className="text-sm font-semibold text-slate-900">
                {col.title}
              </p>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                {col.items.map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-brand-700">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-slate-200 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} WorkTracker. Crafted by{' '}
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
          <div className="flex gap-5">
            <Link to="/auth/signin" className="hover:text-brand-700">
              Sign in
            </Link>
            <a href="#" className="hover:text-brand-700">
              Status
            </a>
            <a
              href="mailto:siqoramil@gmail.com"
              className="hover:text-brand-700"
            >
              siqoramil@gmail.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
