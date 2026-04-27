import type { Metadata } from 'next'
import '@/index.css'

export const metadata: Metadata = {
  title: 'work-tracker-web',
  icons: {
    icon: { url: '/favicon.svg', type: 'image/svg+xml' },
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <div id="root">{children}</div>
      </body>
    </html>
  )
}
