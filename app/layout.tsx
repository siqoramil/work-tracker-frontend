import type { Metadata } from 'next'
import '@/index.css'

export const metadata: Metadata = {
  title: 'Work Tracker',
  icons: {
    icon: { url: '/favicon.svg', type: 'image/svg+xml' },
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

const themeBootstrap = `(function(){try{var k='worktracker.theme';var raw=localStorage.getItem(k);var t=null;if(raw){try{var p=JSON.parse(raw);if(p&&p.state&&(p.state.theme==='dark'||p.state.theme==='light'))t=p.state.theme;}catch(e){}}if(!t){t=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}var d=document.documentElement;if(t==='dark')d.classList.add('dark');d.style.colorScheme=t;}catch(e){}})();`

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
        <div id="root">{children}</div>
      </body>
    </html>
  )
}
