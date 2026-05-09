'use client'

import dynamic from 'next/dynamic'

const ClientApp = dynamic(() => import('@/init/providers/ClientApp'), {
  ssr: false,
})

export default function ClientShell() {
  return <ClientApp />
}
