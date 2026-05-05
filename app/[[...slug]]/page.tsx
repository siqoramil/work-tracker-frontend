import ClientShell from './ClientShell'

export const dynamicParams = false

export function generateStaticParams() {
  return [
    { slug: [] },
    { slug: ['auth'] },
    { slug: ['auth', 'signin'] },
    { slug: ['auth', 'signup'] },
    { slug: ['auth', 'verify-email'] },
    { slug: ['auth', 'reset-password'] },
    { slug: ['app'] },
    { slug: ['app', 'tracking'] },
    { slug: ['app', 'board'] },
    { slug: ['app', 'team'] },
    { slug: ['app', 'settings'] },
    { slug: ['app', 'download'] },
    { slug: ['app', 'dashboard'] },
    { slug: ['app', 'activity'] },
    { slug: ['app', 'screenshots'] },
  ]
}

export default function CatchAllPage() {
  return <ClientShell />
}
