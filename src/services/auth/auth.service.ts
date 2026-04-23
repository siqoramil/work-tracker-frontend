import axios from 'axios'
import { authApi } from './auth.api'
import type {
  ApiErrorBody,
  ForgotPasswordPayload,
  InvitePayload,
  LoginPayload,
  ResetPasswordPayload,
  SignupPayload,
  VerifyEmailPayload,
} from './auth.type'

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

export const authService = {
  login: (payload: LoginPayload) => authApi.login(payload),
  signup: (payload: SignupPayload) => authApi.signup(payload),
  fetchCurrentUser: () => authApi.me(),
  forgotPassword: (payload: ForgotPasswordPayload) =>
    authApi.forgotPassword(payload),
  resetPassword: (payload: ResetPasswordPayload) =>
    authApi.resetPassword(payload),
  verifyEmail: (payload: VerifyEmailPayload) => authApi.verifyEmail(payload),
  invite: (payload: InvitePayload) => authApi.invite(payload),
}
