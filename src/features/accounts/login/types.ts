export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  access_token: string
}

export interface LoginErrorResponse {
  error_detail: Record<string, string[]> | string
}
