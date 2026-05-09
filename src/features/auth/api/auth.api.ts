import { http } from '@/shared/api/http'
import type { User } from '@/entities/user'
import type {
  ForgotPasswordPayload,
  ForgotPasswordResponse,
  InvitePayload,
  LoginPayload,
  RefreshTokenPayload,
  ResetPasswordPayload,
  ResetPasswordResponse,
  SignupPayload,
  TokenResponse,
  VerifyEmailPayload,
  VerifyEmailResponse,
} from '../model/types'

export const authApi = {
  login: (body: LoginPayload) =>
    http.post<TokenResponse>('/auth/login', body).then((r) => r.data),

  signup: (body: SignupPayload) =>
    http.post<User>('/auth/signup', body).then((r) => r.data),

  refresh: (body: RefreshTokenPayload) =>
    http.post<TokenResponse>('/auth/refresh', body).then((r) => r.data),

  me: () => http.get<User>('/auth/me').then((r) => r.data),

  forgotPassword: (body: ForgotPasswordPayload) =>
    http
      .post<ForgotPasswordResponse>('/auth/forgot-password', body)
      .then((r) => r.data),

  resetPassword: (body: ResetPasswordPayload) =>
    http
      .post<ResetPasswordResponse>('/auth/reset-password', body)
      .then((r) => r.data),

  verifyEmail: (body: VerifyEmailPayload) =>
    http
      .post<VerifyEmailResponse>('/auth/verify-email', body)
      .then((r) => r.data),

  invite: (body: InvitePayload) =>
    http.post<User>('/auth/invite', body).then((r) => r.data),
}
