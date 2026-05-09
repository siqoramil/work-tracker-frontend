import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'light' | 'dark'

type ThemeState = {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const applyDocumentTheme = (theme: Theme) => {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  root.classList.toggle('dark', theme === 'dark')
  root.style.colorScheme = theme
}

const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light'
  try {
    const raw = window.localStorage.getItem('worktracker.theme')
    if (raw) {
      const parsed = JSON.parse(raw) as { state?: { theme?: Theme } }
      const stored = parsed?.state?.theme
      if (stored === 'light' || stored === 'dark') return stored
    }
  } catch {
    // ignore
  }
  if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) return 'dark'
  return 'light'
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: getInitialTheme(),
      setTheme: (theme) => {
        applyDocumentTheme(theme)
        set({ theme })
      },
      toggleTheme: () => {
        const next: Theme = get().theme === 'dark' ? 'light' : 'dark'
        applyDocumentTheme(next)
        set({ theme: next })
      },
    }),
    {
      name: 'worktracker.theme',
      partialize: (state) => ({ theme: state.theme }),
      onRehydrateStorage: () => (state) => {
        if (state?.theme) applyDocumentTheme(state.theme)
      },
    },
  ),
)

export const initThemeOnClient = () => {
  if (typeof document === 'undefined') return
  const theme = useThemeStore.getState().theme
  applyDocumentTheme(theme)
}
