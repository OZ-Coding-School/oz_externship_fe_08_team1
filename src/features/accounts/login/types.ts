export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  access_token: string
}

export interface LoginWithdrawnErrorDetail {
  detail: string
  expire_at: string
}

export type LoginErrorDetail =
  | string
  | LoginWithdrawnErrorDetail
  | Record<string, string[]>

export interface LoginErrorResponse {
  error_detail: LoginErrorDetail
}

export function isWithdrawnError(
  detail: LoginErrorDetail
): detail is LoginWithdrawnErrorDetail {
  return (
    typeof detail === 'object' &&
    detail !== null &&
    'expire_at' in detail &&
    typeof (detail as LoginWithdrawnErrorDetail).expire_at === 'string'
  )
}
