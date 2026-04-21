export type UserResponse = {
  id: string
  email: string
  full_name: string
  company_name?: string | null
  role?: string | null
  is_email_verified?: boolean
  created_at?: string
  updated_at?: string
}

export type TokenResponse = {
  access_token: string
  refresh_token: string
  token_type?: string
}

export type LoginPayload = {
  email: string
  password: string
}

export type SignupPayload = {
  email: string
  password: string
  full_name: string
  company_name: string
}

export type RefreshTokenPayload = {
  refresh_token: string
}

export type ForgotPasswordPayload = {
  email: string
}

export type ForgotPasswordResponse = {
  message: string
}

export type ResetPasswordPayload = {
  reset_token: string
  new_password: string
}

export type ResetPasswordResponse = {
  message: string
}

export type VerifyEmailPayload = {
  token: string
}

export type VerifyEmailResponse = {
  message: string
}

export type InvitePayload = {
  email: string
  full_name: string
  password: string
}

export type ApiErrorBody = {
  detail?:
    | string
    | Array<{ loc: (string | number)[]; msg: string; type: string }>
}
