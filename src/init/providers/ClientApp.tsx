'use client'

import { StrictMode, useEffect, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AppRouter from '@/init/routing/AppRouter'
import '@/shared/i18n'
import { bindAuthAccessor, bootstrapAuth } from '@/shared/api/http'
import { useAuthStore } from '@/features/auth'
import { initThemeOnClient } from '@/features/theme'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

bindAuthAccessor({
  getAccessToken: () => useAuthStore.getState().accessToken,
  getRefreshToken: () => useAuthStore.getState().refreshToken,
  setTokens: (tokens) => useAuthStore.getState().setTokens(tokens),
  signOut: () => useAuthStore.getState().signOut(),
})

export default function ClientApp() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    initThemeOnClient()
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
          <AppRouter />
        </BrowserRouter>
      </QueryClientProvider>
    </StrictMode>
  )
}
