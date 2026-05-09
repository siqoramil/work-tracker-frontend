import axios, {
  AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios'
import { API_BASE_URL } from '@/shared/config/api'

export const http: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

type AuthTokenAccessor = {
  getAccessToken: () => string | null
  getRefreshToken: () => string | null
  setTokens: (tokens: { accessToken: string; refreshToken: string }) => void
  signOut: () => void
}

let authAccessor: AuthTokenAccessor | null = null

export function bindAuthAccessor(accessor: AuthTokenAccessor) {
  authAccessor = accessor
}

http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = authAccessor?.getAccessToken() ?? null
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let refreshPromise: Promise<string | null> | null = null

export async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = authAccessor?.getRefreshToken() ?? null
  if (!refreshToken || !authAccessor) return null

  try {
    const { data } = await axios.post(
      `${API_BASE_URL}/auth/refresh`,
      { refresh_token: refreshToken },
      { headers: { 'Content-Type': 'application/json' } },
    )
    authAccessor.setTokens({
      accessToken: data.access_token,
      refreshToken: data.refresh_token ?? refreshToken,
    })
    return data.access_token as string
  } catch {
    authAccessor.signOut()
    return null
  }
}

export function bootstrapAuth(): Promise<string | null> {
  const refreshToken = authAccessor?.getRefreshToken() ?? null
  if (!refreshToken) return Promise.resolve(null)
  refreshPromise ??= refreshAccessToken().finally(() => {
    refreshPromise = null
  })
  return refreshPromise
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
