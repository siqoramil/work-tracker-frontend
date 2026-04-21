import axios, {
  AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios'
import { useAuthStore } from '@/stores/auth.store'

const baseURL = import.meta.env.VITE_API_BASE_URL
if (!baseURL) {
  throw new Error(
    'VITE_API_BASE_URL is not defined. Add it to your .env file.',
  )
}

export const http: AxiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().accessToken
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let refreshPromise: Promise<string | null> | null = null

async function refreshAccessToken(): Promise<string | null> {
  const { refreshToken, setTokens, signOut } = useAuthStore.getState()
  if (!refreshToken) return null

  try {
    const { data } = await axios.post(
      `${baseURL}/auth/refresh`,
      { refresh_token: refreshToken },
      { headers: { 'Content-Type': 'application/json' } },
    )
    setTokens({
      accessToken: data.access_token,
      refreshToken: data.refresh_token ?? refreshToken,
    })
    return data.access_token as string
  } catch {
    signOut()
    return null
  }
}

http.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined

    const isAuthEndpoint =
      typeof original?.url === 'string' &&
      /\/auth\/(login|refresh|signup|forgot-password|reset-password|verify-email)/.test(
        original.url,
      )

    if (
      error.response?.status === 401 &&
      original &&
      !original._retry &&
      !isAuthEndpoint
    ) {
      original._retry = true
      refreshPromise ??= refreshAccessToken().finally(() => {
        refreshPromise = null
      })
      const newToken = await refreshPromise
      if (newToken) {
        original.headers = original.headers ?? {}
        original.headers.Authorization = `Bearer ${newToken}`
        return http(original)
      }
    }

    return Promise.reject(error)
  },
)
