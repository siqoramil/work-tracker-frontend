import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authService } from '@/services/auth'
import type { UserResponse } from '@/services/auth'

type AuthState = {
  user: UserResponse | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  hasHydrated: boolean

  setTokens: (tokens: { accessToken: string; refreshToken: string }) => void
  setUser: (user: UserResponse | null) => void
  signIn: (input: { email: string; password: string }) => Promise<void>
  signUp: (input: {
    full_name: string
    company_name: string
    email: string
    password: string
  }) => Promise<void>
  verifyEmailCode: (input: { email: string; code: string }) => Promise<void>
  refreshUser: () => Promise<void>
  signOut: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      hasHydrated: false,

      setTokens: ({ accessToken, refreshToken }) =>
        set({ accessToken, refreshToken, isAuthenticated: true }),

      setUser: (user) => set({ user }),

      signIn: async ({ email, password }) => {
        const tokens = await authService.login({ email, password })
        set({
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          isAuthenticated: true,
        })
        const user = await authService.fetchCurrentUser()
        set({ user })
      },

      signUp: async ({ full_name, company_name, email, password }) => {
        await authService.signup({ full_name, company_name, email, password })
      },

      verifyEmailCode: async ({ email, code }) => {
        const tokens = await authService.verifyEmail({ email, code })
        set({
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          isAuthenticated: true,
        })
        const user = await authService.fetchCurrentUser()
        set({ user })
      },

      refreshUser: async () => {
        if (!get().accessToken) return
        try {
          const user = await authService.fetchCurrentUser()
          set({ user })
        } catch {
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
          })
        }
      },

      signOut: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'worktracker.auth',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setUser(state.user)
        useAuthStore.setState({ hasHydrated: true })
      },
    },
  ),
)
