import axios from 'axios'

type ApiErrorBody = {
  detail?:
    | string
    | Array<{ loc: (string | number)[]; msg: string; type: string }>
}

export function extractApiError(
  error: unknown,
  fallback = 'Something went wrong',
): string {
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    const detail = error.response?.data?.detail
    if (typeof detail === 'string') return detail
    if (Array.isArray(detail) && detail.length > 0) {
      return detail.map((d) => d.msg).join(', ')
    }
    if (error.message) return error.message
  }
  if (error instanceof Error && error.message) return error.message
  return fallback
}
