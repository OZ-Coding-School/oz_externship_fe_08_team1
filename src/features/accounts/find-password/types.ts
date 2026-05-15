export interface FindPasswordRequest {
  email_token: string
  new_password: string
}

export interface FindPasswordResponse {
  detail: string
}
