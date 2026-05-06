export interface ChangePasswordRequest {
  old_password: string
  new_password: string
}

export interface ChangePasswordResponse {
  detail: string
}

export interface ChangePasswordErrorResponse {
  error_detail: Record<string, string[]>
}
