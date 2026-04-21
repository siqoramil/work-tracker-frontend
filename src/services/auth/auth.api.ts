import { http } from '@/api/http'
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
  UserResponse,
  VerifyEmailPayload,
  VerifyEmailResponse,
} from './auth.type'

export const authApi = {
  login: (body: LoginPayload) =>
    http.post<TokenResponse>('/auth/login', body).then((r) => r.data),

  signup: (body: SignupPayload) =>
    http.post<UserResponse>('/auth/signup', body).then((r) => r.data),

  refresh: (body: RefreshTokenPayload) =>
    http.post<TokenResponse>('/auth/refresh', body).then((r) => r.data),

  me: () => http.get<UserResponse>('/auth/me').then((r) => r.data),

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
    http.post<UserResponse>('/auth/invite', body).then((r) => r.data),
}
