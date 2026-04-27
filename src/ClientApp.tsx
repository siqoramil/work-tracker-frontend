'use client'

import { StrictMode, useEffect, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from '@/App'
import '@/i18n'
import { bootstrapAuth } from '@/api/http'
import { useAuthStore } from '@/stores/auth.store'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

export default function ClientApp() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    bootstrapAuth().then((newToken) => {
      if (cancelled) return
      if (newToken) {
        void useAuthStore.getState().refreshUser()
      }
      setReady(true)
    })
    return () => {
      cancelled = true
    }
  }, [])

  if (!ready) return null

  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </StrictMode>
  )
}
